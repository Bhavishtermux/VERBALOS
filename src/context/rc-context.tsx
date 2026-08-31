"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import {
  DrillAttempt,
  WeakAreaStat,
  VocabularyItem,
  UserSettings,
  UserStats,
} from "@/types";
import { RCPassage } from "@/types/rc";
import {
  initialUserStats,
  initialUserSettings,
  initialWeakAreas,
  initialRecentAttempts,
  initialVocabulary,
} from "@/data/seed-data";
import { initialRcPassages } from "@/data/rc-passages";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/context/auth-context";
import { fetchUserSettingsCloud, resetAllCloudProgress } from "@/lib/supabase/data-service";

interface RcContextType {
  stats: UserStats;
  settings: UserSettings;
  weakAreas: WeakAreaStat[];
  rcPassages: RCPassage[];
  passages: RCPassage[]; // Backward-compatibility alias
  recentAttempts: DrillAttempt[];
  vocabulary: VocabularyItem[];
  isHydrated: boolean;
  getPassageById: (id: string) => RCPassage | undefined;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  togglePassageFlag: (passageId: string) => void;
  toggleVocabularyMastered: (vocabId: string) => void;
  resetToDefaults: () => void;
  resetAllProgress: () => Promise<void>;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const RcContext = createContext<RcContextType | undefined>(undefined);

export function RcProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats, statsHydrated] = useLocalStorage<UserStats>(
    "rc_lab_stats_v2",
    initialUserStats
  );
  const [settings, setSettings, settingsHydrated] = useLocalStorage<UserSettings>(
    "rc_lab_settings_v2",
    initialUserSettings
  );
  const [weakAreas, setWeakAreas, weakAreasHydrated] = useLocalStorage<WeakAreaStat[]>(
    "rc_lab_weak_areas_v2",
    initialWeakAreas
  );
  const [rcPassages, setRcPassages, passagesHydrated] = useLocalStorage<RCPassage[]>(
    "rc_lab_rc_passages_v2",
    initialRcPassages
  );
  const [recentAttempts, setRecentAttempts, attemptsHydrated] = useLocalStorage<DrillAttempt[]>(
    "rc_lab_attempts_v2",
    initialRecentAttempts
  );
  const [vocabulary, setVocabulary, vocabHydrated] = useLocalStorage<VocabularyItem[]>(
    "rc_lab_vocabulary_v2",
    initialVocabulary
  );

  // Synchronize dark mode class on document.documentElement
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isDark = settings.theme === "dark";
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings.theme]);

  // Load cloud settings on authentication
  useEffect(() => {
    if (!user?.id) return;
    fetchUserSettingsCloud(user.id).then((cloudSettings) => {
      if (cloudSettings) {
        setSettings((prev) => ({
          ...prev,
          ...cloudSettings,
          theme: (cloudSettings.theme as any) || prev.theme,
        }));
      }
    });
  }, [user?.id]);

  const isHydrated =
    statsHydrated &&
    settingsHydrated &&
    weakAreasHydrated &&
    passagesHydrated &&
    attemptsHydrated &&
    vocabHydrated;

  const getPassageById = (id: string): RCPassage | undefined => {
    return rcPassages.find((p) => p.id === id);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.theme !== undefined && typeof document !== "undefined") {
        if (newSettings.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return updated;
    });
  };

  const togglePassageFlag = (passageId: string) => {
    setRcPassages((prev) =>
      prev.map((p) =>
        p.id === passageId ? { ...p, flaggedForReview: !p.flaggedForReview } : p
      )
    );
  };

  const toggleVocabularyMastered = (vocabId: string) => {
    setVocabulary((prev) =>
      prev.map((v) => (v.id === vocabId ? { ...v, mastered: !v.mastered } : v))
    );
  };

  const resetAllProgress = async () => {
    // 1. Delete all practice records from Supabase cloud database
    if (user?.id) {
      await resetAllCloudProgress(user.id);
    }

    // 2. Clear all local storage practice records
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("rc_lab_all_sessions");
      window.localStorage.removeItem("rc_lab_mistake_history");
      window.localStorage.removeItem("rc_lab_saved_vocabulary");
      window.localStorage.removeItem("rc_lab_daily_progress");
      window.localStorage.removeItem("verbalos_mock_sessions");
      window.localStorage.removeItem("rc_lab_pending_sync");
      window.localStorage.removeItem("rc_lab_attempts_v2");
      window.localStorage.removeItem("rc_lab_vocabulary_v2");
      if (user?.id) {
        window.localStorage.setItem(`rc_lab_migrated_user_${user.id}`, "true");
      }
    }

    // 3. Reset in-memory stats and records
    setStats({
      totalPassagesRead: 0,
      totalQuestionsSolved: 0,
      totalCorrect: 0,
      totalTimeSpentSeconds: 0,
      averageWpm: 0,
      currentStreak: 0,
      longestStreak: 0,
      accuracy: 0,
      passagesToday: 0,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    });
    setRecentAttempts([]);
    setVocabulary([]);
    setWeakAreas(initialWeakAreas);
  };

  const resetToDefaults = () => {
    resetAllProgress();
  };

  const exportDataJson = (): string => {
    const data = {
      stats,
      settings,
      weakAreas,
      rcPassages,
      recentAttempts,
      vocabulary,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.stats) setStats(parsed.stats);
      if (parsed.settings) {
        setSettings(parsed.settings);
        if (parsed.settings.theme === "dark" && typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        } else if (typeof document !== "undefined") {
          document.documentElement.classList.remove("dark");
        }
      }
      if (parsed.weakAreas) setWeakAreas(parsed.weakAreas);
      if (parsed.rcPassages) setRcPassages(parsed.rcPassages);
      if (parsed.recentAttempts) setRecentAttempts(parsed.recentAttempts);
      if (parsed.vocabulary) setVocabulary(parsed.vocabulary);
      return true;
    } catch (e) {
      console.error("Failed to import VerbalOS JSON data", e);
      return false;
    }
  };

  return (
    <RcContext.Provider
      value={{
        stats,
        settings,
        weakAreas,
        rcPassages,
        passages: rcPassages,
        recentAttempts,
        vocabulary,
        isHydrated,
        getPassageById,
        updateSettings,
        togglePassageFlag,
        toggleVocabularyMastered,
        resetToDefaults,
        resetAllProgress,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </RcContext.Provider>
  );
}

export function useRc() {
  const context = useContext(RcContext);
  if (!context) {
    throw new Error("useRc must be used within an RcProvider");
  }
  return context;
}
