import { getSupabaseClient, isSupabaseConfigured } from "./client";
import { RCSessionResult } from "@/types/rc";
import { UserSavedVocabWord } from "@/lib/vocabulary";
import { UserSettings } from "@/types";

export interface PendingSyncItem {
  id: string;
  type: "session" | "vocabulary" | "settings" | "daily_progress";
  payload: any;
  createdAt: string;
}

const PENDING_SYNC_KEY = "rc_lab_pending_sync";

/**
 * Adds an item to the local offline pending-sync queue
 */
export function enqueuePendingSync(type: PendingSyncItem["type"], payload: any) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(PENDING_SYNC_KEY);
    const queue: PendingSyncItem[] = raw ? JSON.parse(raw) : [];
    queue.push({
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
    });
    window.localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn("Could not enqueue offline sync item", e);
  }
}

/**
 * Flushes the pending-sync queue when online
 */
export async function flushPendingSyncQueue(userId: string): Promise<void> {
  if (typeof window === "undefined" || !isSupabaseConfigured) return;
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const raw = window.localStorage.getItem(PENDING_SYNC_KEY);
    if (!raw) return;
    const queue: PendingSyncItem[] = JSON.parse(raw);
    if (!Array.isArray(queue) || queue.length === 0) return;

    const remainingItems: PendingSyncItem[] = [];

    for (const item of queue) {
      try {
        if (item.type === "session") {
          await syncPracticeSessionCloud(item.payload, userId);
        } else if (item.type === "vocabulary") {
          await syncVocabularyWordCloud(userId, item.payload);
        } else if (item.type === "settings") {
          await syncUserSettingsCloud(userId, item.payload);
        }
      } catch (err) {
        remainingItems.push(item);
      }
    }

    if (remainingItems.length > 0) {
      window.localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(remainingItems));
    } else {
      window.localStorage.removeItem(PENDING_SYNC_KEY);
    }
  } catch (e) {
    console.warn("Error flushing pending sync queue", e);
  }
}

/**
 * Cloud: Syncs a completed practice session and its individual question answers
 */
export async function syncPracticeSessionCloud(
  session: RCSessionResult,
  userId: string
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    enqueuePendingSync("session", session);
    return false;
  }

  try {
    // 1. Insert session record
    const { error: sessionError } = await client.from("practice_sessions").upsert({
      id: session.sessionId,
      user_id: userId,
      rc_id: session.passageId,
      started_at: session.questionStartTime || session.timestamp,
      completed_at: session.questionEndTime || session.timestamp,
      reading_time_seconds: session.readingTimeSeconds,
      reading_wpm: session.readingWpm,
      question_time_seconds: session.questionSolvingDurationSeconds,
      total_time_seconds: session.totalDurationSeconds,
      score: session.score.correct,
      total_questions: session.score.total,
      accuracy: session.score.accuracy,
      created_at: session.timestamp,
    });

    if (sessionError) {
      console.warn("Error inserting practice session to Supabase:", sessionError);
      enqueuePendingSync("session", session);
      return false;
    }

    // 2. Insert answer breakdown records
    if (session.questionBreakdown && session.questionBreakdown.length > 0) {
      const answersPayload = session.questionBreakdown.map((q) => ({
        user_id: userId,
        session_id: session.sessionId,
        question_id: q.questionId,
        selected_answer: q.selectedOptionIndex,
        correct_answer: q.correctOptionIndex,
        is_correct: q.isCorrect,
        question_type: q.type,
        mistake_type: !q.isCorrect ? "Identified in evaluation" : null,
        created_at: session.timestamp,
      }));

      const { error: answersError } = await client
        .from("answers")
        .upsert(answersPayload, { onConflict: "id" });

      if (answersError) {
        console.warn("Error inserting answers to Supabase:", answersError);
      }
    }

    // 3. Increment daily progress
    const today = new Date().toISOString().slice(0, 10);
    await incrementDailyProgressCloud(userId, today);

    return true;
  } catch (err) {
    console.warn("Network error during practice session sync:", err);
    enqueuePendingSync("session", session);
    return false;
  }
}

/**
 * Cloud: Increments daily progress count
 */
export async function incrementDailyProgressCloud(userId: string, dateStr: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { data: existing } = await client
      .from("daily_progress")
      .select("rcs_completed")
      .eq("user_id", userId)
      .eq("date", dateStr)
      .single();

    const count = existing ? existing.rcs_completed + 1 : 1;

    await client.from("daily_progress").upsert({
      user_id: userId,
      date: dateStr,
      rcs_completed: count,
      daily_goal: 3,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Could not update daily progress in Supabase", e);
  }
}

/**
 * Cloud: Fetches all practice sessions and answers for the current user
 */
export async function fetchUserSessionsCloud(userId: string): Promise<RCSessionResult[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data: sessions, error: sessionErr } = await client
      .from("practice_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (sessionErr || !sessions) {
      console.warn("Error fetching user sessions from Supabase:", sessionErr);
      return [];
    }

    // Fetch answers for these sessions
    const { data: answers } = await client
      .from("answers")
      .select("*")
      .eq("user_id", userId);

    const answersMap: Record<string, any[]> = {};
    if (answers) {
      answers.forEach((ans) => {
        if (!answersMap[ans.session_id]) {
          answersMap[ans.session_id] = [];
        }
        answersMap[ans.session_id].push(ans);
      });
    }

    // Format into RCSessionResult[]
    return sessions.map((s) => {
      const sessionAnswers = answersMap[s.id] || [];
      const selectedAnswers: Record<number, number> = {};
      sessionAnswers.forEach((ans, idx) => {
        if (ans.selected_answer !== null && ans.selected_answer !== undefined) {
          selectedAnswers[idx] = ans.selected_answer;
        }
      });

      return {
        sessionId: s.id,
        passageId: s.rc_id,
        passageTitle: s.rc_id, // Title resolved via context
        passageTopic: "Philosophy",
        passageSource: "Aeon",
        passageDifficulty: "CAT",
        author: "Academic Essayist",
        wordCount: 850,
        readingTimeSeconds: s.reading_time_seconds,
        readingTimeFormatted: `${Math.floor(s.reading_time_seconds / 60)
          .toString()
          .padStart(2, "0")}:${(s.reading_time_seconds % 60).toString().padStart(2, "0")}`,
        readingWpm: s.reading_wpm,
        questionStartTime: s.started_at,
        questionEndTime: s.completed_at,
        questionSolvingDurationSeconds: s.question_time_seconds,
        questionSolvingDurationFormatted: `${Math.floor(s.question_time_seconds / 60)
          .toString()
          .padStart(2, "0")}:${(s.question_time_seconds % 60).toString().padStart(2, "0")}`,
        totalDurationSeconds: s.total_time_seconds,
        totalDurationFormatted: `${Math.floor(s.total_time_seconds / 60)
          .toString()
          .padStart(2, "0")}:${(s.total_time_seconds % 60).toString().padStart(2, "0")}`,
        selectedAnswers,
        score: {
          correct: s.score,
          total: s.total_questions,
          accuracy: s.accuracy,
        },
        questionBreakdown: sessionAnswers.map((ans) => ({
          questionId: ans.question_id,
          questionText: "Question prompt reference",
          type: (ans.question_type as any) || "Inference",
          options: ["A", "B", "C", "D"],
          selectedOptionIndex: ans.selected_answer,
          correctOptionIndex: ans.correct_answer,
          isCorrect: ans.is_correct,
          explanation: "Verified against textual context.",
        })),
        timestamp: s.created_at,
      };
    });
  } catch (err) {
    console.warn("Error fetching sessions from Supabase:", err);
    return [];
  }
}

/**
 * Cloud: Syncs a vocabulary lookup word
 */
export async function syncVocabularyWordCloud(
  userId: string,
  wordData: UserSavedVocabWord
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    enqueuePendingSync("vocabulary", wordData);
    return false;
  }

  try {
    const { data: existing } = await client
      .from("vocabulary")
      .select("lookup_count, first_seen_at")
      .eq("user_id", userId)
      .eq("word", wordData.word)
      .maybeSingle();

    const lookupCount = existing ? (existing.lookup_count || 1) + 1 : wordData.viewCount || 1;
    const firstSeen = existing?.first_seen_at || wordData.dateLookedUp || new Date().toISOString();

    const { error } = await client.from("vocabulary").upsert({
      user_id: userId,
      word: wordData.word,
      meaning: wordData.meaning,
      part_of_speech: wordData.partOfSpeech,
      pronunciation: wordData.pronunciation,
      abbreviation: wordData.abbreviation || "No commonly used abbreviation",
      example: wordData.example,
      synonyms: wordData.synonyms || [],
      antonyms: wordData.antonyms || [],
      lookup_count: lookupCount,
      first_seen_at: firstSeen,
      last_seen_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Error syncing vocabulary to Supabase:", error);
      enqueuePendingSync("vocabulary", wordData);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("Network error during vocabulary sync:", err);
    enqueuePendingSync("vocabulary", wordData);
    return false;
  }
}

/**
 * Cloud: Fetches all saved vocabulary words for the user
 */
export async function fetchUserVocabularyCloud(userId: string): Promise<UserSavedVocabWord[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("vocabulary")
      .select("*")
      .eq("user_id", userId)
      .order("last_seen_at", { ascending: false });

    if (error || !data) {
      console.warn("Error fetching vocabulary from Supabase:", error);
      return [];
    }

    return data.map((v) => ({
      id: v.id,
      word: v.word,
      meaning: v.meaning,
      partOfSpeech: v.part_of_speech || "Noun",
      pronunciation: v.pronunciation,
      abbreviation: v.abbreviation || "No commonly used abbreviation",
      example: v.example,
      synonyms: v.synonyms || [],
      antonyms: v.antonyms || [],
      sourceRcId: "rc-cloud",
      sourceRcTitle: "Reading Comprehension Drill",
      dateLookedUp: v.last_seen_at,
      viewCount: v.lookup_count || 1,
    }));
  } catch (err) {
    console.warn("Error fetching vocabulary from Supabase:", err);
    return [];
  }
}

/**
 * Cloud: Syncs user settings
 */
export async function syncUserSettingsCloud(
  userId: string,
  settings: Partial<UserSettings>
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    enqueuePendingSync("settings", settings);
    return false;
  }

  try {
    const { error } = await client.from("user_settings").upsert({
      user_id: userId,
      font_size: settings.fontSize || "base",
      reading_width: "normal",
      dark_mode: settings.theme === "dark",
      timer_visible: settings.timerMode !== undefined,
      reading_font: settings.readingFont || "serif",
      daily_goal_passages: settings.dailyGoalPassages || 3,
      target_wpm: settings.targetWpm || 300,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Error syncing user settings to Supabase:", error);
      enqueuePendingSync("settings", settings);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Network error during settings sync:", err);
    enqueuePendingSync("settings", settings);
    return false;
  }
}

/**
 * Cloud: Fetches user settings
 */
export async function fetchUserSettingsCloud(userId: string): Promise<Partial<UserSettings> | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      fontSize: data.font_size,
      readingFont: data.reading_font,
      theme: data.dark_mode ? "dark" : "light",
      dailyGoalPassages: data.daily_goal_passages,
      targetWpm: data.target_wpm,
    };
  } catch (err) {
    console.warn("Error fetching settings from Supabase:", err);
    return null;
  }
}

/**
 * Deletes all user practice progress from Supabase cloud database
 */
export async function resetAllCloudProgress(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !userId) return true;
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    // 1. Delete practice sessions & answers
    await client.from("answers").delete().eq("user_id", userId);
    await client.from("practice_sessions").delete().eq("user_id", userId);
    
    // 2. Delete mock tests & mock answers
    await client.from("mock_answers").delete().eq("user_id", userId);
    await client.from("mocks").delete().eq("user_id", userId);
    
    // 3. Delete mistake journal
    await client.from("mistakes").delete().eq("user_id", userId);
    
    // 4. Delete daily progress
    await client.from("daily_progress").delete().eq("user_id", userId);
    
    // 5. Delete saved vocabulary
    await client.from("vocabulary").delete().eq("user_id", userId);

    return true;
  } catch (err) {
    console.error("Failed to reset cloud progress:", err);
    return false;
  }
}
