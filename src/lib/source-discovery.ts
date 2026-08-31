import {
  RealSourceArticle,
  RealArticleSource,
  SourceTopic,
  ReasoningDifficulty,
  ArticleQualityScore,
  ContentStatus,
} from "./sources/types";
import { REAL_SOURCE_ARTICLES } from "@/data/real-sources";

// Public verified feeds for discovery
export const SOURCE_FEED_CONFIG = {
  Aeon: {
    name: "Aeon",
    feedUrl: "https://aeon.co/feed.rss",
    primaryTopics: ["Philosophy", "Psychology", "Science", "Society", "Culture", "History", "Ethics"],
    defaultDifficulty: "Hard" as ReasoningDifficulty,
    mode: "LINK_MODE" as const,
  },
  "The Atlantic": {
    name: "The Atlantic",
    feedUrl: "https://www.theatlantic.com/feed/all/",
    primaryTopics: ["Technology", "Science", "Culture", "Politics", "Economics", "Literature", "Society"],
    defaultDifficulty: "Medium" as ReasoningDifficulty,
    mode: "LINK_MODE" as const,
  },
  "The Hindu": {
    name: "The Hindu",
    feedUrl: "https://www.thehindu.com/opinion/feeder/default.rss",
    primaryTopics: ["Economics", "Politics", "Environment", "International Affairs", "Society", "Science"],
    defaultDifficulty: "Hard" as ReasoningDifficulty,
    mode: "LINK_MODE" as const,
  },
};

/**
 * Evaluates whether an article is suitable for CAT VARC preparation
 * and computes a multi-dimensional quality score.
 */
export function scoreArticleQuality(params: {
  title: string;
  description: string;
  wordCount?: number;
  topic: SourceTopic;
  source: RealArticleSource;
}): ArticleQualityScore {
  const { title, description, wordCount = 1000, topic, source } = params;
  const combinedText = `${title} ${description}`.toLowerCase();

  // 1. Anti-Clickbait / Low-Value Filter
  const lowValueIndicators = [
    "celebrity",
    "gossip",
    "scorecard",
    "match report",
    "trailer",
    "discount",
    "coupon",
    "buying guide",
    "horoscope",
    "breaking news",
    "live updates",
    "top 10 gadgets",
  ];

  const hasLowValue = lowValueIndicators.some((word) => combinedText.includes(word));
  if (hasLowValue) {
    return {
      catRelevance: 2.0,
      argumentDepth: 1.5,
      editorialCaliber: 3.0,
      reasoningPotential: 2.0,
      readabilityScore: 4.0,
      overallScore: 2.5,
    };
  }

  // 2. Intellectual & Argumentative Indicators
  const argumentKeywords = [
    "why",
    "how",
    "paradox",
    "critique",
    "illusion",
    "rethinking",
    "ethics",
    "epistemic",
    "structural",
    "evolutionary",
    "crisis",
    "consequence",
    "implication",
    "philosophy",
    "cognitive",
    "sovereignty",
    "dilemma",
    "fallacy",
    "tension",
    "reconciliation",
  ];

  const argumentMatchCount = argumentKeywords.filter((kw) => combinedText.includes(kw)).length;

  // Base scores by publication source
  let baseCatRelevance = source === "Aeon" ? 9.2 : source === "The Hindu" ? 9.0 : 8.8;
  let baseArgumentDepth = source === "Aeon" ? 9.3 : source === "The Hindu" ? 8.9 : 8.7;
  let editorialCaliber = 9.5;

  // Bonus for argumentative depth
  const argumentBonus = Math.min(argumentMatchCount * 0.25, 0.8);
  const catRelevance = Math.min(Number((baseCatRelevance + argumentBonus).toFixed(1)), 9.9);
  const argumentDepth = Math.min(Number((baseArgumentDepth + argumentBonus).toFixed(1)), 9.9);
  const reasoningPotential = Math.min(Number(((catRelevance + argumentDepth) / 2).toFixed(1)), 9.9);

  // Length calibration: optimal CAT length is 800 - 2,000 words
  let readabilityScore = 9.2;
  if (wordCount >= 900 && wordCount <= 1800) {
    readabilityScore = 9.6;
  } else if (wordCount < 600 || wordCount > 3000) {
    readabilityScore = 8.4;
  }

  const overallScore = Number(
    ((catRelevance * 0.35 + argumentDepth * 0.35 + reasoningPotential * 0.2 + editorialCaliber * 0.1)).toFixed(1)
  );

  return {
    catRelevance,
    argumentDepth,
    editorialCaliber,
    reasoningPotential,
    readabilityScore,
    overallScore,
  };
}

/**
 * Classifies an article's reasoning difficulty based on multi-perspective tension,
 * structural density, and argument nuance (NOT mere dictionary vocabulary).
 */
export function classifyReasoningDifficulty(params: {
  topic: SourceTopic;
  source: RealArticleSource;
  qualityScore: ArticleQualityScore;
  wordCount: number;
}): { difficulty: ReasoningDifficulty; rationale: string } {
  const { topic, source, qualityScore } = params;

  if (topic === "Philosophy" || (source === "Aeon" && qualityScore.argumentDepth >= 9.5)) {
    return {
      difficulty: "Hard",
      rationale:
        "High conceptual density with non-linear philosophical premises and abstract epistemic arguments requiring active thesis tracking.",
    };
  }

  if (topic === "Economics" && (source === "The Hindu" || source === "The Atlantic")) {
    return {
      difficulty: "Hard",
      rationale:
        "Dense institutional and policy reasoning examining structural trade-offs, fiscal data, and regional welfare implications.",
    };
  }

  if (qualityScore.argumentDepth >= 9.6 && qualityScore.catRelevance >= 9.7) {
    return {
      difficulty: "CAT+",
      rationale:
        "Highly demanding rhetorical architecture featuring multi-layered counter-arguments, subtle authorial irony, and high inference density.",
    };
  }

  if (topic === "Science" || topic === "Environment" || topic === "Culture") {
    return {
      difficulty: "Medium",
      rationale:
        "Structured argumentative exposition with lucid empirical evidence and accessible prose, ideal for building speed and stamina.",
    };
  }

  return {
    difficulty: "Accessible",
    rationale:
      "Direct thesis development with explicit transitions, well-defined examples, and straightforward author stance.",
  };
}

/**
 * Returns all published articles from the real-sources catalog
 */
export function getAllPublishedSourceArticles(): RealSourceArticle[] {
  return REAL_SOURCE_ARTICLES.filter((art) => art.status === "Published");
}

/**
 * Retrieves a single article by ID with safe fallback
 */
export function getSourceArticleById(id: string): RealSourceArticle | undefined {
  return REAL_SOURCE_ARTICLES.find((art) => art.id === id);
}
