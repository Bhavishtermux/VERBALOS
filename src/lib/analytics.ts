import { RCSessionResult, RCPassage } from "@/types/rc";
import { MistakeLogEntry, MistakeCategory } from "@/lib/diagnostics";
import { initialSeedSessions, initialSeedMistakes } from "@/data/seed-sessions";

export interface SkillPerformanceItem {
  skill: string;
  correct: number;
  total: number;
  accuracy: number;
  status: "Mastered" | "Developing" | "Review Needed" | "Untested";
}

export interface SourcePerformanceItem {
  source: string;
  attempted: number;
  correct: number;
  total: number;
  accuracy: number;
  avgWpm: number;
}

export interface DifficultyPerformanceItem {
  difficulty: string;
  attempted: number;
  correct: number;
  total: number;
  accuracy: number;
  avgWpm: number;
}

export interface MistakeTypeSummary {
  category: MistakeCategory;
  count: number;
  percentage: number;
  recommendation: string;
}

export interface CalculatedAnalytics {
  totalSessions: number;
  overallAccuracy: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  averageWpm: number;
  averageScoreOutOfFive: number;
  averageReadingTimeSeconds: number;
  averageReadingTimeFormatted: string;
  averageQuestionSolvingSeconds: number;
  averageQuestionSolvingFormatted: string;
  totalTimeSeconds: number;
  totalTimeHours: string;
  currentStreak: number;

  // 1. Accuracy Trend (chronological)
  accuracyTrend: {
    sessionId: string;
    passageTitle: string;
    date: string;
    formattedDate: string;
    accuracy: number;
    wpm: number;
    score: string;
  }[];

  // 2. WPM Trend
  wpmTrend: {
    sessionId: string;
    passageTitle: string;
    date: string;
    formattedDate: string;
    wpm: number;
  }[];

  // 3. Skill Performance
  skillPerformance: SkillPerformanceItem[];

  // 4. Source Performance
  sourcePerformance: SourcePerformanceItem[];

  // 5. Difficulty Performance
  difficultyPerformance: DifficultyPerformanceItem[];

  // 6. Most Common Mistake Types
  mistakeTypeBreakdown: MistakeTypeSummary[];
}

const ALL_SESSIONS_STORAGE_KEY = "rc_lab_all_sessions";
const MISTAKE_HISTORY_STORAGE_KEY = "rc_lab_mistake_history";

/**
 * Loads all session records from localStorage
 */
export function getAllSessions(): RCSessionResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ALL_SESSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load sessions from localStorage", e);
  }
  return [];
}

/**
 * Loads all mistake records from localStorage
 */
export function getStoredMistakes(): MistakeLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MISTAKE_HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load mistakes from localStorage", e);
  }
  return [];
}

// Format seconds into mm:ss
export function formatTimeSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const MISTAKE_RECOMMENDATIONS: Record<MistakeCategory, string> = {
  "Unsupported inference": "Verify textual evidence; eliminate options requiring unstated assumptions.",
  "Extreme option": "Watch for absolutes like 'completely', 'always', or 'never' that magnify moderate stances.",
  "Tone mismatch": "Scrutinize authorial adjectives and modal adverbs to calibrate true sentiment.",
  "Main idea confusion": "Distinguish central overarching conflict from single-paragraph supporting examples.",
  "Misread passage": "Re-read boundary clauses carefully before locking answers under time pressure.",
  "Outside passage": "Eliminate choices introducing real-world truths not discussed in the text.",
  "Partial truth": "Read options to the very last word to spot disguised erroneous clauses.",
  "Detail error": "Double-check whether statements belong to the author or a cited secondary critic.",
  "Question misinterpretation": "Focus on the question stem's operational verb (e.g. 'function', 'infer', 'undermine').",
};

/**
 * Pure calculation function generating unified analytics from session history
 */
export function calculateAnalytics(
  sessions: RCSessionResult[] = getAllSessions(),
  mistakes: MistakeLogEntry[] = getStoredMistakes()
): CalculatedAnalytics {
  const totalSessions = sessions.length;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      overallAccuracy: 0,
      totalQuestionsAnswered: 0,
      totalQuestionsCorrect: 0,
      averageWpm: 0,
      averageScoreOutOfFive: 0,
      averageReadingTimeSeconds: 0,
      averageReadingTimeFormatted: "00:00",
      averageQuestionSolvingSeconds: 0,
      averageQuestionSolvingFormatted: "00:00",
      totalTimeSeconds: 0,
      totalTimeHours: "0.0",
      currentStreak: 0,
      accuracyTrend: [],
      wpmTrend: [],
      skillPerformance: [
        { skill: "Main Idea", correct: 0, total: 0, accuracy: 0, status: "Untested" },
        { skill: "Inference", correct: 0, total: 0, accuracy: 0, status: "Untested" },
        { skill: "Tone", correct: 0, total: 0, accuracy: 0, status: "Untested" },
        { skill: "Purpose", correct: 0, total: 0, accuracy: 0, status: "Untested" },
        { skill: "Detail", correct: 0, total: 0, accuracy: 0, status: "Untested" },
        { skill: "Strengthen", correct: 0, total: 0, accuracy: 0, status: "Untested" },
        { skill: "Weaken", correct: 0, total: 0, accuracy: 0, status: "Untested" },
        { skill: "Author's Attitude", correct: 0, total: 0, accuracy: 0, status: "Untested" },
      ],
      sourcePerformance: [
        { source: "Aeon", attempted: 0, correct: 0, total: 0, accuracy: 0, avgWpm: 0 },
        { source: "The Atlantic", attempted: 0, correct: 0, total: 0, accuracy: 0, avgWpm: 0 },
        { source: "The Hindu", attempted: 0, correct: 0, total: 0, accuracy: 0, avgWpm: 0 },
      ],
      difficultyPerformance: [
        { difficulty: "Medium", attempted: 0, correct: 0, total: 0, accuracy: 0, avgWpm: 0 },
        { difficulty: "Hard", attempted: 0, correct: 0, total: 0, accuracy: 0, avgWpm: 0 },
        { difficulty: "CAT", attempted: 0, correct: 0, total: 0, accuracy: 0, avgWpm: 0 },
        { difficulty: "CAT+", attempted: 0, correct: 0, total: 0, accuracy: 0, avgWpm: 0 },
      ],
      mistakeTypeBreakdown: [],
    };
  }

  // 1. Aggregate Totals
  let totalQuestionsAnswered = 0;
  let totalQuestionsCorrect = 0;
  let sumWpm = 0;
  let sumReadingTime = 0;
  let sumQuestionTime = 0;

  sessions.forEach((s) => {
    totalQuestionsAnswered += s.score.total;
    totalQuestionsCorrect += s.score.correct;
    sumWpm += s.readingWpm || 250;
    sumReadingTime += s.readingTimeSeconds || 180;
    sumQuestionTime += s.questionSolvingDurationSeconds || 180;
  });

  const overallAccuracy = Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100);
  const averageWpm = Math.round(sumWpm / totalSessions);
  const averageScoreOutOfFive = Number((totalQuestionsCorrect / totalSessions).toFixed(1));
  const averageReadingTimeSeconds = Math.round(sumReadingTime / totalSessions);
  const averageQuestionSolvingSeconds = Math.round(sumQuestionTime / totalSessions);
  const totalTimeSeconds = sumReadingTime + sumQuestionTime;
  const totalTimeHours = (totalTimeSeconds / 3600).toFixed(1);

  // 2. Chronological Trends (Oldest to Newest)
  const chronologicalSessions = [...sessions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const accuracyTrend = chronologicalSessions.map((s, idx) => {
    const d = new Date(s.timestamp);
    return {
      sessionId: s.sessionId,
      passageTitle: s.passageTitle,
      date: s.timestamp,
      formattedDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      accuracy: s.score.accuracy,
      wpm: s.readingWpm,
      score: `${s.score.correct}/${s.score.total}`,
    };
  });

  const wpmTrend = chronologicalSessions.map((s) => {
    const d = new Date(s.timestamp);
    return {
      sessionId: s.sessionId,
      passageTitle: s.passageTitle,
      date: s.timestamp,
      formattedDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      wpm: s.readingWpm,
    };
  });

  // 3. Skill Performance Breakdown
  const standardSkills = [
    "Main Idea",
    "Inference",
    "Tone",
    "Purpose",
    "Detail",
    "Strengthen",
    "Weaken",
    "Author's Attitude",
  ];

  const skillCounts: Record<string, { correct: number; total: number }> = {};
  standardSkills.forEach((sk) => {
    skillCounts[sk] = { correct: 0, total: 0 };
  });

  sessions.forEach((s) => {
    s.questionBreakdown.forEach((q) => {
      let norm = q.type as string;
      if (norm === "Main Idea / Central Theme") norm = "Main Idea";
      if (norm === "Tone / Attitude") norm = "Tone";
      if (norm === "Detail / Fact-based") norm = "Detail";
      if (norm === "Purpose / Organization") norm = "Purpose";

      if (!skillCounts[norm]) {
        skillCounts[norm] = { correct: 0, total: 0 };
      }
      skillCounts[norm].total += 1;
      if (q.isCorrect) {
        skillCounts[norm].correct += 1;
      }
    });
  });

  const skillPerformance: SkillPerformanceItem[] = standardSkills.map((skill) => {
    const item = skillCounts[skill] || { correct: 0, total: 0 };
    if (item.total === 0) {
      return {
        skill,
        correct: 0,
        total: 0,
        accuracy: 0,
        status: "Untested",
      };
    }
    const acc = Math.round((item.correct / item.total) * 100);
    return {
      skill,
      correct: item.correct,
      total: item.total,
      accuracy: acc,
      status: acc >= 80 ? "Mastered" : acc >= 50 ? "Developing" : "Review Needed",
    };
  });

  // 4. Source Performance
  const standardSources = ["Aeon", "The Atlantic", "The Hindu"];
  const sourcePerformance: SourcePerformanceItem[] = standardSources.map((source) => {
    const matching = sessions.filter((s) => s.passageSource === source);
    if (matching.length === 0) {
      return {
        source,
        attempted: 0,
        correct: 0,
        total: 0,
        accuracy: 0,
        avgWpm: 0,
      };
    }
    let c = 0;
    let t = 0;
    let w = 0;
    matching.forEach((m) => {
      c += m.score.correct;
      t += m.score.total;
      w += m.readingWpm || 250;
    });
    return {
      source,
      attempted: matching.length,
      correct: c,
      total: t,
      accuracy: Math.round((c / t) * 100),
      avgWpm: Math.round(w / matching.length),
    };
  });

  // 5. Difficulty Performance
  const standardDiffs = ["Medium", "Hard", "CAT", "CAT+"];
  const difficultyPerformance: DifficultyPerformanceItem[] = standardDiffs.map((diff) => {
    const matching = sessions.filter((s) => s.passageDifficulty === diff);
    if (matching.length === 0) {
      return {
        difficulty: diff,
        attempted: 0,
        correct: 0,
        total: 0,
        accuracy: 0,
        avgWpm: 0,
      };
    }
    let c = 0;
    let t = 0;
    let w = 0;
    matching.forEach((m) => {
      c += m.score.correct;
      t += m.score.total;
      w += m.readingWpm || 250;
    });
    return {
      difficulty: diff,
      attempted: matching.length,
      correct: c,
      total: t,
      accuracy: Math.round((c / t) * 100),
      avgWpm: Math.round(w / matching.length),
    };
  });

  // 6. Most Common Mistake Types
  const mistakeCounts: Record<MistakeCategory, number> = {
    "Unsupported inference": 0,
    "Extreme option": 0,
    "Tone mismatch": 0,
    "Main idea confusion": 0,
    "Misread passage": 0,
    "Outside passage": 0,
    "Partial truth": 0,
    "Detail error": 0,
    "Question misinterpretation": 0,
  };

  mistakes.forEach((m) => {
    if (mistakeCounts[m.mistakeCategory] !== undefined) {
      mistakeCounts[m.mistakeCategory] += 1;
    } else {
      mistakeCounts[m.mistakeCategory] = 1;
    }
  });

  const totalMistakes = mistakes.length;
  const mistakeTypeBreakdown: MistakeTypeSummary[] = (
    Object.entries(mistakeCounts) as [MistakeCategory, number][]
  )
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalMistakes > 0 ? Math.round((count / totalMistakes) * 100) : 0,
      recommendation:
        MISTAKE_RECOMMENDATIONS[category] ||
        "Review passage evidence carefully before selecting answers.",
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate actual practice streak from unique session calendar days
  const sessionDates = Array.from(
    new Set(
      sessions
        .map((s) => s.timestamp?.slice(0, 10))
        .filter(Boolean)
    )
  ).sort().reverse();

  let calculatedStreak = 0;
  if (sessionDates.length > 0) {
    calculatedStreak = sessionDates.length;
  }

  return {
    totalSessions,
    overallAccuracy,
    totalQuestionsAnswered,
    totalQuestionsCorrect,
    averageWpm,
    averageScoreOutOfFive,
    averageReadingTimeSeconds,
    averageReadingTimeFormatted: formatTimeSeconds(averageReadingTimeSeconds),
    averageQuestionSolvingSeconds,
    averageQuestionSolvingFormatted: formatTimeSeconds(averageQuestionSolvingSeconds),
    totalTimeSeconds,
    totalTimeHours,
    currentStreak: Math.max(calculatedStreak, 1),
    accuracyTrend,
    wpmTrend,
    skillPerformance,
    sourcePerformance,
    difficultyPerformance,
    mistakeTypeBreakdown,
  };
}
