export interface CatPatternConfig {
  year: number | "Current";
  name: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  rcPassageCount: number;
  rcQuestionsCount: number;
  vaQuestionsCount: number;
  markingScheme: {
    correct: number;
    incorrectMcq: number;
    incorrectTita: number;
    unattempted: number;
  };
  vaDistribution: {
    paraSummary: number;
    paraJumbles: number;
    oddOneOut: number;
    paraCompletion: number;
    sentencePlacement: number;
  };
  pacingGuidelines: {
    targetMinutesPerRc: number;
    targetMinutesForVa: number;
    reviewBufferMinutes: number;
  };
}

export const CAT_YEAR_PRESETS: Record<string, CatPatternConfig> = {
  CAT_2024_2025_CURRENT: {
    year: "Current",
    name: "CAT 2024-2025 Standard Pattern (24 Qs / 40 Mins)",
    totalQuestions: 24,
    totalTimeMinutes: 40,
    rcPassageCount: 4,
    rcQuestionsCount: 16, // 4 passages x 4 questions
    vaQuestionsCount: 8,
    markingScheme: {
      correct: 3,
      incorrectMcq: -1,
      incorrectTita: 0,
      unattempted: 0,
    },
    vaDistribution: {
      paraSummary: 2,
      paraJumbles: 2,
      oddOneOut: 2,
      paraCompletion: 1,
      sentencePlacement: 1,
    },
    pacingGuidelines: {
      targetMinutesPerRc: 8.5, // ~34 mins for 4 RCs
      targetMinutesForVa: 5.5,  // ~6 mins for VA
      reviewBufferMinutes: 0.5,
    },
  },
  CAT_2021_2023: {
    year: 2023,
    name: "CAT 2021-2023 Pattern (24 Qs / 40 Mins)",
    totalQuestions: 24,
    totalTimeMinutes: 40,
    rcPassageCount: 4,
    rcQuestionsCount: 16,
    vaQuestionsCount: 8,
    markingScheme: {
      correct: 3,
      incorrectMcq: -1,
      incorrectTita: 0,
      unattempted: 0,
    },
    vaDistribution: {
      paraSummary: 3,
      paraJumbles: 3,
      oddOneOut: 2,
      paraCompletion: 0,
      sentencePlacement: 0,
    },
    pacingGuidelines: {
      targetMinutesPerRc: 8.5,
      targetMinutesForVa: 5.5,
      reviewBufferMinutes: 0.5,
    },
  },
  CAT_2020_COVID: {
    year: 2020,
    name: "CAT 2020 Pattern (26 Qs / 40 Mins)",
    totalQuestions: 26,
    totalTimeMinutes: 40,
    rcPassageCount: 4,
    rcQuestionsCount: 18,
    vaQuestionsCount: 8,
    markingScheme: {
      correct: 3,
      incorrectMcq: -1,
      incorrectTita: 0,
      unattempted: 0,
    },
    vaDistribution: {
      paraSummary: 3,
      paraJumbles: 3,
      oddOneOut: 2,
      paraCompletion: 0,
      sentencePlacement: 0,
    },
    pacingGuidelines: {
      targetMinutesPerRc: 8.0,
      targetMinutesForVa: 6.0,
      reviewBufferMinutes: 2.0,
    },
  },
  CAT_LEGACY_PRE_2020: {
    year: 2019,
    name: "CAT Pre-2020 Legacy Pattern (34 Qs / 60 Mins)",
    totalQuestions: 34,
    totalTimeMinutes: 60,
    rcPassageCount: 5,
    rcQuestionsCount: 24,
    vaQuestionsCount: 10,
    markingScheme: {
      correct: 3,
      incorrectMcq: -1,
      incorrectTita: 0,
      unattempted: 0,
    },
    vaDistribution: {
      paraSummary: 3,
      paraJumbles: 4,
      oddOneOut: 3,
      paraCompletion: 0,
      sentencePlacement: 0,
    },
    pacingGuidelines: {
      targetMinutesPerRc: 9.5,
      targetMinutesForVa: 10.0,
      reviewBufferMinutes: 2.5,
    },
  },
};

export const DEFAULT_CAT_CONFIG: CatPatternConfig = CAT_YEAR_PRESETS.CAT_2024_2025_CURRENT;

const CONFIG_STORAGE_KEY = "verbalos_cat_pattern_config";

export function getActiveCatConfig(): CatPatternConfig {
  if (typeof window === "undefined") return DEFAULT_CAT_CONFIG;
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_CAT_CONFIG;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CAT_CONFIG;
  }
}

export function saveActiveCatConfig(config: CatPatternConfig): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.warn("Could not save CAT config", e);
  }
}
