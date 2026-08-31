import { RCQuestion } from "./rc";

export type ReadingSourcePublication = "Aeon" | "The Atlantic" | "The Hindu";

export type ArticleTopic =
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
  | "Business"
  | "Society"
  | "International Affairs"
  | "Medicine"
  | "Language"
  | "Ethics"
  | "Religion"
  | "Other";

export type ArticleDifficulty = "Accessible" | "Medium" | "Hard" | "CAT+";

export type ContentMode = "link" | "read-and-practice";

export type ContentStatus =
  | "discovered"
  | "reviewed"
  | "suitable"
  | "rejected"
  | "published"
  | "archived";

export interface CATRelevanceBreakdown {
  centralIdeaClarity: number; // 1 - 10
  argumentDensity: number; // 1 - 10
  inferencePotential: number; // 1 - 10
  counterargumentsPresent: boolean;
  overallScore: number; // 0 - 100
}

export interface ArgumentIntel {
  centralIdea: string;
  authorPosition: string;
  argumentStructure: string[];
  majorClaims: string[];
  counterargument?: string;
  tone: string;
  purpose: string;
  keyInferenceOpportunities: string[];
  paragraphFunctions?: string[];
  potentialQuestionAreas?: string[];
}

export interface RealWorldArticle {
  id: string;
  source: ReadingSourcePublication;
  title: string;
  author: string;
  publicationDate: string;
  url: string;
  category: string;
  topic: ArticleTopic;
  tags: string[];
  wordCount?: number;
  estimatedReadingTimeMinutes: number;
  difficulty: ArticleDifficulty;
  mode: ContentMode;
  status: ContentStatus;
  shortDescription: string;
  whyThisArticle: string;
  relevance: CATRelevanceBreakdown;
  argumentIntel: ArgumentIntel;
  excerptContent?: string;
  questions?: RCQuestion[];
  sourceAttributionNotice: string;
}

export interface ReadingHistoryItem {
  id: string;
  articleId: string;
  source: ReadingSourcePublication;
  topic: ArticleTopic;
  title: string;
  startedAt: string;
  completedAt?: string;
  readingTimeSeconds: number;
  calculatedWpm?: number;
  questionsAttempted?: number;
  questionsCorrect?: number;
  notes?: {
    thesis?: string;
    tone?: string;
    summary?: string;
  };
  savedWordIds?: string[];
}

export interface SourceExposureStats {
  weeklyBySource: Record<ReadingSourcePublication, number>;
  weeklyByTopic: Record<string, number>;
  totalArticlesCompleted: number;
  totalReadingTimeMinutes: number;
  averageWpm: number;
  streakDays: number;
}