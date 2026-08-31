import { RCQuestion } from "@/types/rc";
import { TrapType } from "@/lib/traps";

export type RealArticleSource = "Aeon" | "The Atlantic" | "The Hindu" | "Project Syndicate";

export type SourceTopic =
  | "Philosophy"
  | "Psychology"
  | "Science"
  | "Technology"
  | "Economics"
  | "Politics"
  | "History"
  | "Sociology"
  | "Culture"
  | "Art"
  | "Literature"
  | "Environment"
  | "Education"
  | "Society"
  | "International Affairs"
  | "Medicine"
  | "Language"
  | "Ethics"
  | "Religion"
  | "Other";

export type ReasoningDifficulty = "Accessible" | "Medium" | "Hard" | "CAT+";

export type SourceMode = "LINK_MODE" | "ALLOWED_READ_MODE";

export type ContentStatus = "Discovered" | "Reviewed" | "Suitable" | "Published" | "Archived";

export interface ArticleQualityScore {
  catRelevance: number; // 1 - 10
  argumentDepth: number; // 1 - 10
  editorialCaliber: number; // 1 - 10
  reasoningPotential: number; // 1 - 10
  readabilityScore: number; // 1 - 10 (based on syntax & rhetorical clarity)
  overallScore: number; // 1 - 10
}

export interface CATArgumentBlueprint {
  centralIdea: string;
  authorPosition: string;
  argumentStructure: string;
  majorClaims: string[];
  counterArguments?: string[];
  tone: string;
  purpose: string;
  inferenceOpportunities: string[];
  paragraphFunctions: string[];
  potentialQuestionFocusAreas: string[];
}

export interface RealSourceArticle {
  id: string;
  source: RealArticleSource;
  title: string;
  subtitle?: string;
  author: string;
  authorBio?: string;
  publicationDate: string; // e.g. "2024-04-12"
  originalUrl: string;
  topic: SourceTopic;
  secondaryTopics?: SourceTopic[];
  wordCount: number;
  estimatedReadingTimeMinutes: number;
  difficulty: ReasoningDifficulty;
  difficultyRationale: string;
  contentType: "Essay" | "Feature Analysis" | "Editorial / Opinion" | "Philosophical Inquiry";
  status: ContentStatus;
  mode: SourceMode;
  qualityScore: ArticleQualityScore;
  description: string;
  contentExcerpt?: string; // Permitted excerpt for in-app reading & workout
  fullContent?: string; // If licensed/permitted
  argumentBlueprint: CATArgumentBlueprint;
  practiceQuestions?: RCQuestion[];
  isFeaturedToday?: boolean;
  isEvergreen?: boolean;
}

export interface UserReadingRecord {
  articleId: string;
  source: RealArticleSource;
  topic: SourceTopic;
  startedAt: string;
  completedAt?: string;
  readingDurationSeconds: number;
  calculatedWpm: number;
  modeUsed: "Read Only" | "Read + Practice";
  questionsAttempted?: number;
  questionsCorrect?: number;
  savedWordsCount?: number;
  userMentalMap?: {
    thesis?: string;
    tone?: string;
    summary?: string;
  };
}

export interface SourceExposureStats {
  aeonCount: number;
  atlanticCount: number;
  hinduCount: number;
  totalArticlesRead: number;
  totalReadingMinutes: number;
  topicBreakdown: Record<string, number>;
  averageWpm: number;
}
