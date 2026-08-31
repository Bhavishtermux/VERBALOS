export * from "./rc";
import { RCPassage } from "./rc";
export type Passage = RCPassage;

export type VAType = "para-summary" | "para-jumbles" | "odd-sentence-out";

export type MistakeCategory =
  | "Unsupported inference"
  | "Extreme option"
  | "Outside passage"
  | "Partial truth"
  | "Tone mismatch"
  | "Main idea confusion"
  | "Misread passage"
  | "Detail error"
  | "Question misinterpretation"
  | "Scope error"
  | "Contradiction"
  | "Author-position confusion";

export interface ParaSummaryQuestion {
  id: string;
  type: "para-summary";
  topic: string;
  difficulty: "Medium" | "Hard" | "CAT" | "CAT+";
  paragraph: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  trapAnalysis: {
    optionIndex: number;
    trapType: "Too Broad" | "Too Narrow" | "Distorts Argument" | "Introduces New Info" | "Extreme Option" | "Correct Summary";
    explanation: string;
  }[];
}

export interface ParaJumbleQuestion {
  id: string;
  type: "para-jumbles";
  topic: string;
  difficulty: "Medium" | "Hard" | "CAT" | "CAT+";
  sentences: { id: string; text: string }[];
  correctOrder: string[]; // e.g. ["B", "D", "A", "C"]
  explanation: string;
  structureAnalysis: {
    opener: string;
    mandatoryPairs: string[];
    chronologyOrContrast: string;
    conclusion: string;
  };
}

export interface OddSentenceOutQuestion {
  id: string;
  type: "odd-sentence-out";
  topic: string;
  difficulty: "Medium" | "Hard" | "CAT" | "CAT+";
  sentences: { id: string; text: string }[];
  correctOddSentenceId: string;
  explanation: string;
  paragraphTheme: string;
  whyOddBreaksStructure: string;
}

export type VAQuestion =
  | ParaSummaryQuestion
  | ParaJumbleQuestion
  | OddSentenceOutQuestion;

export interface VASessionResult {
  sessionId: string;
  vaType: VAType | "mixed";
  title: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number;
  timeSpentSeconds: number;
  timeSpentFormatted: string;
  questionResults: {
    questionId: string;
    type: VAType;
    userAnswer: string | number | string[];
    correctAnswer: string | number | string[];
    isCorrect: boolean;
    explanation: string;
    mistakeType?: MistakeCategory;
  }[];
  timestamp: string;
}

export interface VARCMockConfig {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number; // default 40
  totalQuestions: number; // default 24 (16 RC + 8 VA)
  rcPassageIds: string[];
  vaQuestionIds: string[];
  difficulty: "Medium" | "Hard" | "CAT" | "CAT+";
}

export interface MockQuestionState {
  questionId: string;
  section: "rc" | "va";
  rcPassageId?: string;
  questionNumber: number;
  status: "unvisited" | "unanswered" | "answered" | "marked_review" | "answered_marked_review";
  selectedOption: number | string | string[] | null;
  timeSpentSeconds: number;
}

export interface VARCMockResult {
  mockSessionId: string;
  mockId: string;
  mockTitle: string;
  startedAt: string;
  completedAt: string;
  totalDurationSeconds: number;
  totalDurationFormatted: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number; // +3 for correct, -1 for incorrect MCQ
  accuracy: number;
  rcScore: {
    attempted: number;
    correct: number;
    total: number;
    accuracy: number;
    timeSpentSeconds: number;
  };
  vaScore: {
    attempted: number;
    correct: number;
    total: number;
    accuracy: number;
    timeSpentSeconds: number;
  };
  questionResponses: {
    questionNumber: number;
    questionId: string;
    section: "rc" | "va";
    questionType: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    isAttempted: boolean;
    explanation: string;
    timeSpentSeconds: number;
    mistakeCategory?: MistakeCategory;
  }[];
}

export interface MistakeJournalEntry {
  id: string;
  sessionId: string;
  practiceType: "RC" | "Para Summary" | "Para Jumbles" | "Odd Sentence Out" | "VARC Mock";
  contentTitle: string;
  questionText: string;
  questionType: string;
  mistakeCategory: MistakeCategory;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: string;
  date: string;
  formattedDate: string;
}

export interface DrillAttempt {
  id: string;
  passageId: string;
  passageTitle: string;
  genre: string;
  date: string;
  accuracyPercent: number;
  correctQuestions: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  wpm: number;
  difficulty: string;
}

export interface WeakAreaStat {
  type: string;
  accuracy: number;
  totalQuestions: number;
  correctQuestions: number;
  status: "Critical Focus" | "Needs Attention" | "Moderate" | "Strong" | "Mastered";
  description: string;
}

export type QuestionType =
  | "Inference"
  | "Tone / Attitude"
  | "Main Idea / Central Theme"
  | "Detail / Fact-based"
  | "Purpose / Organization";

export interface Genre {
  name: string;
}

export interface UserSettings {
  userName: string;
  targetExam: string;
  dailyGoalPassages: number;
  targetWpm: number;
  readingFont: "serif" | "sans" | "mono";
  fontSize: "sm" | "base" | "lg" | "xl";
  lineHeight: "normal" | "relaxed" | "loose";
  timerMode: "countup" | "countdown";
  theme: "light" | "dark" | "system";
  readingWidth?: "compact" | "normal" | "wide";
  timerVisible?: boolean;
}

export interface UserStats {
  accuracy: number;
  averageWpm: number;
  rcsCompleted: number;
  vaCompleted?: number;
  mocksCompleted?: number;
  currentStreak: number;
  bestStreak?: number;
  totalTimeMinutes?: number;
  todayCompleted: number;
  todayGoal: number;
  todayAccuracy?: number;
  projectedPercentile?: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  category?: "tone" | "academic";
  partOfSpeech: string;
  definition: string;
  meaning?: string;
  pronunciation?: string;
  abbreviation?: string;
  rcContextExample: string;
  example?: string;
  toneToneType?: string;
  trapWarning?: string;
  synonyms: string[];
  antonyms?: string[];
  lookupCount?: number;
  mastered?: boolean;
  addedAt: string;
  sourceRc?: string;
}
