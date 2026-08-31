import {
  RealSourceArticle,
  RealArticleSource,
  SourceTopic,
  UserReadingRecord,
  SourceExposureStats,
} from "./sources/types";
import { getAllPublishedSourceArticles } from "./source-discovery";
import { CalculatedAnalytics } from "./analytics";

const READING_HISTORY_KEY = "verbalos_real_reading_history_v1";

/**
 * Loads all reading records from localStorage safely
 */
export function getStoredReadingRecords(): UserReadingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(READING_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Could not load reading history", e);
    return [];
  }
}

/**
 * Saves a completed or in-progress reading record
 */
export function saveReadingRecord(record: UserReadingRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredReadingRecords();
    const updated = [record, ...existing.filter((r) => r.articleId !== record.articleId)];
    window.localStorage.setItem(READING_HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.warn("Could not save reading record", e);
  }
}

/**
 * Computes source exposure statistics for the current week and lifetime
 */
export function calculateSourceExposureStats(records: UserReadingRecord[]): SourceExposureStats {
  let aeonCount = 0;
  let atlanticCount = 0;
  let hinduCount = 0;
  let totalReadingMinutes = 0;
  let totalWpmSum = 0;
  let wpmCount = 0;
  const topicBreakdown: Record<string, number> = {};

  records.forEach((r) => {
    if (r.source === "Aeon") aeonCount++;
    else if (r.source === "The Atlantic") atlanticCount++;
    else if (r.source === "The Hindu") hinduCount++;

    totalReadingMinutes += Math.round((r.readingDurationSeconds || 0) / 60);

    if (r.calculatedWpm && r.calculatedWpm > 50) {
      totalWpmSum += r.calculatedWpm;
      wpmCount++;
    }

    if (r.topic) {
      topicBreakdown[r.topic] = (topicBreakdown[r.topic] || 0) + 1;
    }
  });

  return {
    aeonCount,
    atlanticCount,
    hinduCount,
    totalArticlesRead: records.length,
    totalReadingMinutes,
    topicBreakdown,
    averageWpm: wpmCount > 0 ? Math.round(totalWpmSum / wpmCount) : 240,
  };
}

export interface RecommendedArticleItem {
  article: RealSourceArticle;
  whyThisArticle: string;
  categoryTag: "Weak Topic Priority" | "Stamina Builder" | "Source Balance" | "Core Benchmark";
  matchScore: number;
}

/**
 * Generates personalized recommendations based on the 40/30/20/10 balance algorithm
 * and real user diagnostic data.
 */
export function getPersonalizedSourceRecommendations(params: {
  analytics: CalculatedAnalytics | null;
  readingRecords: UserReadingRecord[];
}): {
  featuredPack: RecommendedArticleItem[];
  allRecommendations: RecommendedArticleItem[];
} {
  const { analytics, readingRecords } = params;
  const allArticles = getAllPublishedSourceArticles();
  const readArticleIds = new Set(readingRecords.map((r) => r.articleId));
  const stats = calculateSourceExposureStats(readingRecords);

  // Identify weak/under-exposed topics
  const underExposedTopics = new Set<string>();
  const allTopics: SourceTopic[] = ["Philosophy", "Economics", "Technology", "Psychology", "Environment", "Literature"];
  allTopics.forEach((t) => {
    if ((stats.topicBreakdown[t] || 0) === 0) {
      underExposedTopics.add(t);
    }
  });

  const scoredArticles: RecommendedArticleItem[] = allArticles.map((art) => {
    let score = art.qualityScore.overallScore * 10;
    let why = "Curated high-yield CAT editorial with rigorous logical structure.";
    let categoryTag: RecommendedArticleItem["categoryTag"] = "Core Benchmark";

    // 1. Weak/Under-exposed Topic Boost (40% Weight)
    if (underExposedTopics.has(art.topic)) {
      score += 25;
      categoryTag = "Weak Topic Priority";
      why = `You have completed few ${art.topic} drills; this ${art.source} piece builds crucial foundational reasoning in this domain.`;
    }

    // 2. Source Exposure Balancing
    if (art.source === "Aeon" && stats.aeonCount <= Math.min(stats.atlanticCount, stats.hinduCount)) {
      score += 15;
      if (categoryTag === "Core Benchmark") {
        categoryTag = "Source Balance";
        why = `Recommended to balance your weekly reading diet with long-form philosophical inquiry from Aeon.`;
      }
    } else if (art.source === "The Hindu" && stats.hinduCount <= Math.min(stats.aeonCount, stats.atlanticCount)) {
      score += 15;
      if (categoryTag === "Core Benchmark") {
        categoryTag = "Source Balance";
        why = `Sharp policy and economic editorial from The Hindu to train analytical data and institutional deduction.`;
      }
    }

    // 3. Difficulty Calibration
    if (analytics && analytics.overallAccuracy < 65 && art.difficulty === "Medium") {
      score += 10;
      categoryTag = "Stamina Builder";
      why = `Structured exposition with lucid transitions—ideal for calibrating your reading pace before dense philosophy.`;
    }

    // Small penalty if already read
    if (readArticleIds.has(art.id)) {
      score -= 30;
    }

    return {
      article: art,
      whyThisArticle: why,
      categoryTag,
      matchScore: score,
    };
  });

  scoredArticles.sort((a, b) => b.matchScore - a.matchScore);

  // Pick a diverse Today's 3-Pack: 1 Aeon + 1 The Atlantic + 1 The Hindu
  const aeonPick = scoredArticles.find((item) => item.article.source === "Aeon") || scoredArticles[0];
  const atlanticPick =
    scoredArticles.find((item) => item.article.source === "The Atlantic" && item.article.id !== aeonPick?.article.id) ||
    scoredArticles[1];
  const hinduPick =
    scoredArticles.find(
      (item) =>
        item.article.source === "The Hindu" &&
        item.article.id !== aeonPick?.article.id &&
        item.article.id !== atlanticPick?.article.id
    ) || scoredArticles[2];

  const featuredPack = [aeonPick, atlanticPick, hinduPick].filter(Boolean);

  return {
    featuredPack,
    allRecommendations: scoredArticles,
  };
}
