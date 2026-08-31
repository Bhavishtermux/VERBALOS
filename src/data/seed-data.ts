import { Passage, RCPassage, DrillAttempt, WeakAreaStat, VocabularyItem, UserSettings, UserStats } from "@/types";
import { initialRcPassages } from "./rc-passages";

export const initialUserStats: UserStats = {
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
};

export const initialUserSettings: UserSettings = {
  userName: "Aspirant",
  targetExam: "CAT 2026",
  dailyGoalPassages: 3,
  targetWpm: 280,
  readingFont: "serif",
  fontSize: "base",
  lineHeight: "relaxed",
  timerMode: "countup",
  theme: "light",
};

export const initialWeakAreas: WeakAreaStat[] = [];

export const initialRecentAttempts: DrillAttempt[] = [];

export const initialPassages: RCPassage[] = initialRcPassages;

export const initialVocabulary: VocabularyItem[] = [];
