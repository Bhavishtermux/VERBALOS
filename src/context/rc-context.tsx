"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
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
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export interface ActiveSessionData {
  isActive: boolean;
  title: string;
  type?: "rc" | "mock" | "va";
  onSaveAndExit?: (targetHref: string) => void;
  onDiscardAndExit?: (targetHref: string) => void;
}

interface RcContextType {
  stats: UserStats;
  settings: UserSettings;
  weakAreas: WeakAreaStat[];
  rcPassages: RCPassage[];
  passages: RCPassage[]; // Backward-compatibility alias
  recentAttempts: DrillAttempt[];
  vocabulary: VocabularyItem[];
  isHydrated: boolean;
  activeSession: ActiveSessionData | null;
  setActiveSession: (data: ActiveSessionData | null) => void;
  pendingNavUrl: string | null;
  setPendingNavUrl: (url: string | null) => void;
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
  const router = useRouter();
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
    "rc_lab_rc_passages_v3",
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

  // Active Session Navigation Guard State
  const [activeSession, setActiveSession] = useState<ActiveSessionData | null>(null);
  const [pendingNavUrl, setPendingNavUrl] = useState<string | null>(null);

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
      prev.map((p) => (p.id === passageId ? { ...p, flaggedForReview: !p.flaggedForReview } : p))
    );
  };

  const toggleVocabularyMastered = (vocabId: string) => {
    setVocabulary((prev) =>
      prev.map((v) => (v.id === vocabId ? { ...v, mastered: !v.mastered } : v))
    );
  };

  const resetAllProgress = async () => {
    // 1. Wipe Supabase Cloud tables if authenticated
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
      window.localStorage.removeItem("rc_lab_stats_v2");
      window.localStorage.removeItem("rc_lab_weak_areas_v2");
      window.localStorage.removeItem("rc_lab_rc_passages_v2");
      window.localStorage.removeItem("rc_lab_rc_passages_v3");
      if (user?.id) {
        window.localStorage.setItem(`rc_lab_migrated_user_${user.id}`, "true");
      }
    }

    // 3. Reset in-memory stats and records
    setStats({
      accuracy: 0,
      averageWpm: 0,
      rcsCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalTimeMinutes: 0,
      todayCompleted: 0,
      todayGoal: 3,
      todayAccuracy: 0,
      projectedPercentile: 0,
    });
    setRecentAttempts([]);
    setVocabulary([]);
    setWeakAreas([]);
    setRcPassages(initialRcPassages.map((p) => ({ ...p, completed: false, lastScore: undefined, flaggedForReview: false })));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
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
        activeSession,
        setActiveSession,
        pendingNavUrl,
        setPendingNavUrl,
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

      {/* Universal Notice Dialog when navigating away during active session */}
      {pendingNavUrl && activeSession && (
        <Modal
          isOpen={true}
          onClose={() => setPendingNavUrl(null)}
          title={`Leave Active ${activeSession.type === "mock" ? "Mock Exam" : "RC Practice"}?`}
          maxWidth="md"
        >
          <div className="space-y-4 pt-1">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-4 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold font-serif text-sm text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Active Timed Session in Progress</span>
              </div>
              <p className="leading-relaxed font-sans text-xs">
                You are currently in an active session on <strong>&ldquo;{activeSession.title}&rdquo;</strong>.
                Would you like to save your reading pace &amp; answers so far, discard this session, or stay and continue?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPendingNavUrl(null)}
                className="text-xs order-3 sm:order-1"
              >
                Stay &amp; Continue
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const target = pendingNavUrl;
                  const onDiscard = activeSession.onDiscardAndExit;
                  setPendingNavUrl(null);
                  setActiveSession(null);
                  if (onDiscard) onDiscard(target);
                  router.push(target);
                }}
                className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 order-2"
              >
                Discard &amp; Exit
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const target = pendingNavUrl;
                  const onSave = activeSession.onSaveAndExit;
                  setPendingNavUrl(null);
                  setActiveSession(null);
                  if (onSave) onSave(target);
                  router.push(target);
                }}
                className="text-xs bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm order-1 sm:order-3"
              >
                Save Progress &amp; Exit
              </Button>
            </div>
          </div>
        </Modal>
      )}
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
