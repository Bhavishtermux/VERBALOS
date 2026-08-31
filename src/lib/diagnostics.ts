import { RCQuestion, RCQuestionType } from "@/types/rc";

export type MistakeCategory =
  | "Misread passage"
  | "Unsupported inference"
  | "Extreme option"
  | "Outside passage"
  | "Partial truth"
  | "Tone mismatch"
  | "Main idea confusion"
  | "Detail error"
  | "Question misinterpretation";

export interface MistakeDiagnosis {
  mistakeCategory: MistakeCategory;
  diagnosis: string;
  whatToDoNext: string;
}

export interface MistakeLogEntry {
  id: string;
  sessionId: string;
  passageId: string;
  passageTitle: string;
  questionId: string;
  questionType: string;
  mistakeCategory: MistakeCategory;
  userAnswerIndex: number;
  correctAnswerIndex: number;
  timestamp: string;
}

/**
 * Heuristic and rule-based diagnostic engine for CAT Reading Comprehension errors
 */
export function diagnoseQuestionMistake(
  questionText: string,
  questionType: RCQuestionType,
  userOptionText: string,
  correctOptionText: string,
  userOptionIndex: number,
  correctOptionIndex: number
): MistakeDiagnosis {
  const userLower = userOptionText.toLowerCase();
  const qLower = questionText.toLowerCase();

  // 1. Check for Extreme Words in User Choice
  const extremeWords = [
    "always",
    "never",
    "completely",
    "entirely",
    "solely",
    "exclusively",
    "prohibits",
    "all ",
    "every ",
    "must ",
    "impossible",
    "perfectly",
    "universal",
    "total ",
  ];
  const hasExtreme = extremeWords.some((w) => userLower.includes(w));

  if (hasExtreme) {
    return {
      mistakeCategory: "Extreme option",
      diagnosis:
        "Your chosen option uses an absolute qualifier (e.g. 'completely', 'always', 'entirely') that magnifies the author's claim beyond the measured stance in the text.",
      whatToDoNext:
        "Eliminate options that convert nuanced or probable claims into unconditional, extreme absolutes.",
    };
  }

  // 2. Question-Type Specific Diagnoses
  if (questionType === "Inference") {
    if (userLower.length > correctOptionText.length * 1.2 || userLower.includes("because")) {
      return {
        mistakeCategory: "Unsupported inference",
        diagnosis:
          "Your answer is plausible in the real world, but it extrapolates beyond what the passage actually establishes.",
        whatToDoNext:
          "Before selecting an inference answer, verify that the passage provides direct textual evidence rather than circumstantial correlation.",
      };
    }
    return {
      mistakeCategory: "Unsupported inference",
      diagnosis:
        "The selected option assumes a causal link that the author hinted at but never strictly justified.",
      whatToDoNext:
        "Look for the closest unstated premise directly required for the author's argument to hold true.",
    };
  }

  if (questionType === "Tone" || questionType === "Author's Attitude" || questionType === "Tone / Attitude") {
    return {
      mistakeCategory: "Tone mismatch",
      diagnosis:
        "Your choice misjudged the author's subtle degree of stance—confusing objective analytical critique with hostility, or nuanced skepticism with cynicism.",
      whatToDoNext:
        "Inspect the passage's adjectives and modal qualifiers (e.g. 'perhaps', 'partially', 'seldom') to calibrate the exact degree of authorial sentiment.",
    };
  }

  if (questionType === "Main Idea" || questionType === "Main Idea / Central Theme") {
    if (userLower.length < 50 || userLower.includes("first") || userLower.includes("specifically")) {
      return {
        mistakeCategory: "Main idea confusion",
        diagnosis:
          "Your option captured a true supporting detail from a single paragraph, but failed to encompass the overarching argument of the entire text.",
        whatToDoNext:
          "Ask yourself: 'Does this statement summarize the overarching conflict of the whole essay, or is it merely one supporting piece of evidence?'",
      };
    }
    return {
      mistakeCategory: "Main idea confusion",
      diagnosis:
        "The selected choice broadened the thesis beyond the author's core dispute, introducing an overly generic claim.",
      whatToDoNext:
        "Ensure the main idea option synthesizes both the problem and the author's specific intellectual resolution.",
    };
  }

  if (questionType === "Detail" || questionType === "Detail / Fact-based") {
    return {
      mistakeCategory: "Detail error",
      diagnosis:
        "The chosen option misattributed a statement made by a quoted critic or secondary source as the author's own conclusion.",
      whatToDoNext:
        "Re-read the surrounding sentence to verify whether the assertion belongs to the author or a cited counter-argument.",
    };
  }

  if (questionType === "Purpose" || questionType === "Purpose / Organization") {
    return {
      mistakeCategory: "Question misinterpretation",
      diagnosis:
        "Your answer described the literal topic of the paragraph rather than its rhetorical function in advancing the author's broader argument.",
      whatToDoNext:
        "Focus on the verb in the options (e.g. 'to contrast', 'to illustrate', 'to qualify') and ask why the author included this specific section.",
    };
  }

  if (questionType === "Strengthen" || questionType === "Weaken") {
    return {
      mistakeCategory: "Outside passage",
      diagnosis:
        "Your choice attacked a peripheral assumption rather than the core logical bridge connecting the premises to the author's main conclusion.",
      whatToDoNext:
        "Isolate the exact premise-to-conclusion link before evaluating which fact would most directly rupture or solidify it.",
    };
  }

  // Default fallback heuristic
  return {
    mistakeCategory: "Partial truth",
    diagnosis:
      "The first half of the option is factually aligned with the text, but the second half introduces an inaccurate distorting detail.",
    whatToDoNext:
      "Read all four options to the very last word; test setters frequently place traps at the end of an otherwise appealing sentence.",
  };
}

const MISTAKES_STORAGE_KEY = "rc_lab_mistake_history";

/**
 * Saves logged mistakes to localStorage for downstream Progress page analytics
 */
export function logMistakesToStorage(entries: MistakeLogEntry[]): void {
  if (typeof window === "undefined" || entries.length === 0) return;
  try {
    const raw = window.localStorage.getItem(MISTAKES_STORAGE_KEY);
    const existing: MistakeLogEntry[] = raw ? JSON.parse(raw) : [];
    const updated = [...entries, ...existing];
    window.localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save mistake history to localStorage", e);
  }
}

/**
 * Retrieves all mistake logs from localStorage
 */
export function getMistakeHistory(): MistakeLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MISTAKES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Could not load mistake history", e);
  }
  return [];
}
