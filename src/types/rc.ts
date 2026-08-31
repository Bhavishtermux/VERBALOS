export type RCSource = "Aeon" | "The Atlantic" | "The Hindu" | (string & {});

export type RCTopic =
  | "Philosophy"
  | "Economics"
  | "Psychology"
  | "Sociology"
  | "Science"
  | "Technology"
  | "History"
  | "Business"
  | "Politics"
  | "Culture"
  | "Environment"
  | "Art"
  | "Education"
  | "Science & Tech"
  | "History & Politics"
  | "Art & Literature"
  | (string & {});

export type RCDifficulty = "Medium" | "Hard" | "CAT" | "CAT+" | "Moderate" | "CAT Standard" | "Advanced" | (string & {});

export type RCQuestionType =
  | "Main Idea"
  | "Central Argument"
  | "Inference"
  | "Tone"
  | "Author's Purpose"
  | "Detail"
  | "Application"
  | "Strengthen"
  | "Weaken"
  | "Author's Attitude"
  | "Most Supported"
  | "Cannot Be Inferred"
  | "Purpose"
  | "Tone / Attitude"
  | "Main Idea / Central Theme"
  | "Detail / Fact-based"
  | "Purpose / Organization"
  | "Vocabulary"
  | "Contextual Vocabulary"
  | (string & {});

export interface RCQuestion {
  id: string;
  type: RCQuestionType;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface PreviousScore {
  correct: number;
  total: number;
  accuracy: number;
  wpm?: number;
  date?: string;
}

export interface RCPassage {
  id: string;
  title: string;
  source: RCSource;
  author: string;
  topic: RCTopic;
  genre?: RCTopic;
  difficulty: RCDifficulty;
  summary?: string;
  content: string;
  wordCount: number;
  estimatedMinutes: number;
  estimatedTimeMins?: number;
  questionsCount?: number;
  questions: RCQuestion[];
  completed?: boolean;
  lastScore?: PreviousScore;
  lastAttemptAccuracy?: number;
  lastAttemptWpm?: number;
  lastAttemptDate?: string;
  flaggedForReview?: boolean;
}

export interface RCSessionResult {
  sessionId: string;
  passageId: string;
  passageTitle: string;
  passageTopic: string;
  passageSource: string;
  passageDifficulty: string;
  author: string;
  wordCount: number;
  readingTimeSeconds: number;
  readingTimeFormatted: string;
  readingWpm: number;
  questionStartTime: string;
  questionEndTime: string;
  questionSolvingDurationSeconds: number;
  questionSolvingDurationFormatted: string;
  totalDurationSeconds: number;
  totalDurationFormatted: string;
  selectedAnswers: Record<number, number>;
  score: {
    correct: number;
    total: number;
    accuracy: number;
  };
  questionBreakdown: {
    id?: string;
    questionId: string;
    questionText: string;
    type: RCQuestionType;
    options: string[];
    selectedOptionIndex: number | null;
    correctOptionIndex: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  timestamp: string;
}
