import { RCPassage } from "@/types/rc";
import { CalculatedAnalytics } from "@/lib/analytics";
import { initialRcPassages } from "@/data/rc-passages";

export interface PracticeRecommendation {
  id: string;
  passage: RCPassage;
  ruleTriggered: string;
  rationale: string;
  focusType: "skill" | "accuracy" | "speed" | "topic" | "source" | "general";
  badgeText: string;
  priority: number;
}

export interface RecommendationSummary {
  primaryHeadline: string;
  primaryRationale: string;
  recommendations: PracticeRecommendation[];
}

/**
 * Rule-Based Recommendation Engine
 * Analyzes overall accuracy, skill accuracy, source accuracy, difficulty, and WPM
 * strictly from user analytics without AI.
 */
export function generateRecommendations(
  analytics?: CalculatedAnalytics | null,
  allPassages: RCPassage[] = []
): RecommendationSummary | null {
  const passagesPool = Array.isArray(allPassages) && allPassages.length > 0 ? allPassages : initialRcPassages;
  if (!passagesPool || passagesPool.length === 0) return null;

  const recommendations: PracticeRecommendation[] = [];

  // Separate uncompleted and completed passages
  const uncompletedPassages = passagesPool.filter((p) => !p?.completed);
  const availablePassages = uncompletedPassages.length > 0 ? uncompletedPassages : passagesPool;

  // Extract key metrics safely
  const overallAccuracy = analytics?.overallAccuracy ?? 0;
  const averageWpm = analytics?.averageWpm ?? 0;
  const skillPerformance = analytics?.skillPerformance ?? [];
  const sourcePerformance = analytics?.sourcePerformance ?? [];

  // Helper to find skill accuracy
  const getSkillAcc = (skillName: string) => {
    const item = skillPerformance.find(
      (s) => s?.skill?.toLowerCase() === skillName.toLowerCase()
    );
    return item && item.total > 0 ? item.accuracy : 100;
  };

  const inferenceAcc = getSkillAcc("Inference");
  const toneAcc = getSkillAcc("Tone");

  // RULE 1: IF inference accuracy < 65% -> Recommend inference-heavy RCs
  if (inferenceAcc < 65 || (inferenceAcc < 75 && skillPerformance.length > 0)) {
    const inferencePassage =
      availablePassages.find((p) =>
        Array.isArray(p?.questions) &&
        p.questions.some((q) => q?.type === "Inference") &&
        (p.topic === "Philosophy" || p.topic === "Psychology" || p.topic === "Sociology")
      ) ||
      availablePassages.find((p) => Array.isArray(p?.questions) && p.questions.some((q) => q?.type === "Inference")) ||
      availablePassages[0];

    if (inferencePassage) {
      recommendations.push({
        id: `rec-inf-${inferencePassage.id}`,
        passage: inferencePassage,
        ruleTriggered: "Low Inference Accuracy",
        rationale: `Your inference accuracy is ${inferenceAcc}%. Your next practice focuses on inference-heavy passages to strengthen implicit deduction.`,
        focusType: "skill",
        badgeText: "Focus: Inference Mastery",
        priority: 10,
      });
    }
  }

  // RULE 2: IF tone accuracy < 65% -> Recommend tone-heavy RCs
  if (toneAcc < 65 || (toneAcc < 75 && skillPerformance.length > 0)) {
    const tonePassage =
      availablePassages.find(
        (p) =>
          Array.isArray(p?.questions) &&
          p.questions.some(
            (q) => q?.type === "Tone" || q?.type === "Author's Attitude" || q?.type === "Tone / Attitude"
          ) && (p.source === "Aeon" || p.source === "The Atlantic")
      ) ||
      availablePassages.find((p) =>
        Array.isArray(p?.questions) &&
        p.questions.some(
          (q) => q?.type === "Tone" || q?.type === "Author's Attitude" || q?.type === "Tone / Attitude"
        )
      ) ||
      availablePassages[1 % availablePassages.length];

    if (tonePassage && !recommendations.some((r) => r.passage.id === tonePassage.id)) {
      recommendations.push({
        id: `rec-tone-${tonePassage.id}`,
        passage: tonePassage,
        ruleTriggered: "Low Tone Accuracy",
        rationale: `Your tone & attitude accuracy is ${toneAcc}%. Your next practice focuses on tone-heavy passages to calibrate rhetorical discernment.`,
        focusType: "skill",
        badgeText: "Focus: Tone & Attitude",
        priority: 9,
      });
    }
  }

  // RULE 3: IF WPM < 220 -> Recommend timed medium-difficulty RCs
  if (averageWpm < 220 && averageWpm > 0) {
    const mediumPassage =
      availablePassages.find((p) => p?.difficulty === "Medium" || p?.difficulty === "CAT Standard") ||
      availablePassages.find((p) => p?.difficulty === "Hard") ||
      availablePassages[0];

    if (mediumPassage && !recommendations.some((r) => r.passage.id === mediumPassage.id)) {
      recommendations.push({
        id: `rec-wpm-${mediumPassage.id}`,
        passage: mediumPassage,
        ruleTriggered: "Pacing Calibration (WPM < 220)",
        rationale: `Your average reading pace is ${averageWpm} WPM. We recommend timed Medium-difficulty RCs to build smooth reading cadence.`,
        focusType: "speed",
        badgeText: "Focus: Pacing & Flow",
        priority: 8,
      });
    }
  }

  // Fallback: If no specific rules triggered, pick highest-value uncompleted passage
  if (recommendations.length === 0) {
    const defaultPassage = availablePassages[0] || passagesPool[0];
    if (defaultPassage) {
      recommendations.push({
        id: `rec-default-${defaultPassage.id}`,
        passage: defaultPassage,
        ruleTriggered: "Standard CAT Drill",
        rationale: `Based on your diagnostic profile (${overallAccuracy}% accuracy, ${averageWpm || "—"} WPM), this CAT-standard drill provides balanced sectional practice.`,
        focusType: "general",
        badgeText: "Recommended Practice",
        priority: 5,
      });
    }
  }

  // Sort by priority descending
  recommendations.sort((a, b) => b.priority - a.priority);

  const primary = recommendations[0];
  if (!primary) return null;

  return {
    primaryHeadline: primary.badgeText,
    primaryRationale: primary.rationale,
    recommendations: recommendations.slice(0, 3),
  };
}
