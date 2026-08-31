import { RCPassage } from "@/types/rc";
import { CalculatedAnalytics } from "@/lib/analytics";

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
  analytics: CalculatedAnalytics,
  allPassages: RCPassage[]
): RecommendationSummary {
  const recommendations: PracticeRecommendation[] = [];

  // Separate uncompleted and completed passages
  const uncompletedPassages = allPassages.filter((p) => !p.completed);
  const availablePassages = uncompletedPassages.length > 0 ? uncompletedPassages : allPassages;

  // Extract key metrics
  const {
    overallAccuracy,
    averageWpm,
    skillPerformance,
    sourcePerformance,
    difficultyPerformance,
  } = analytics;

  // Helper to find skill accuracy
  const getSkillAcc = (skillName: string) => {
    const item = skillPerformance.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );
    return item && item.total > 0 ? item.accuracy : 100;
  };

  const inferenceAcc = getSkillAcc("Inference");
  const toneAcc = getSkillAcc("Tone");
  const mainIdeaAcc = getSkillAcc("Main Idea");
  const detailAcc = getSkillAcc("Detail");

  // RULE 1: IF inference accuracy < 65% -> Recommend inference-heavy RCs
  if (inferenceAcc < 65 || (inferenceAcc < 75 && skillPerformance.length > 0)) {
    const inferencePassage =
      availablePassages.find((p) =>
        p.questions.some((q) => q.type === "Inference") &&
        (p.topic === "Philosophy" || p.topic === "Psychology" || p.topic === "Sociology")
      ) ||
      availablePassages.find((p) => p.questions.some((q) => q.type === "Inference")) ||
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
          p.questions.some(
            (q) => q.type === "Tone" || q.type === "Author's Attitude" || q.type === "Tone / Attitude"
          ) && (p.source === "Aeon" || p.source === "The Atlantic")
      ) ||
      availablePassages.find((p) =>
        p.questions.some(
          (q) => q.type === "Tone" || q.type === "Author's Attitude" || q.type === "Tone / Attitude"
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
      availablePassages.find((p) => p.difficulty === "Medium") ||
      availablePassages.find((p) => p.difficulty === "Hard") ||
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

  // RULE 4: IF accuracy < 70% -> Recommend accuracy-focused practice
  if (overallAccuracy < 70 && overallAccuracy > 0) {
    const accuracyPassage =
      availablePassages.find((p) => p.difficulty === "Medium" || p.difficulty === "Hard") ||
      availablePassages[0];

    if (accuracyPassage && !recommendations.some((r) => r.passage.id === accuracyPassage.id)) {
      recommendations.push({
        id: `rec-acc-${accuracyPassage.id}`,
        passage: accuracyPassage,
        ruleTriggered: "Comprehension Baseline (< 70%)",
        rationale: `Your overall comprehension accuracy is ${overallAccuracy}%. This drill focuses on disciplined elimination and boundary verification.`,
        focusType: "accuracy",
        badgeText: "Focus: Accuracy Calibration",
        priority: 7,
      });
    }
  }

  // RULE 5: IF accuracy > 85% AND WPM < 250 -> Recommend speed-focused practice
  if (overallAccuracy >= 80 && averageWpm < 260 && averageWpm > 0) {
    const speedPassage =
      availablePassages.find((p) => p.difficulty === "CAT" || p.difficulty === "CAT+") ||
      availablePassages[0];

    if (speedPassage && !recommendations.some((r) => r.passage.id === speedPassage.id)) {
      recommendations.push({
        id: `rec-speed-${speedPassage.id}`,
        passage: speedPassage,
        ruleTriggered: "Speed Acceleration (Accuracy > 80%, WPM < 260)",
        rationale: `Your accuracy is high (${overallAccuracy}%), but your pacing is ${averageWpm} WPM. Practice maintaining comprehension at an accelerated tempo.`,
        focusType: "speed",
        badgeText: "Focus: Speed Acceleration",
        priority: 8,
      });
    }
  }

  // RULE 6: Source or Genre Diversity
  // Find source with lowest accuracy or least attempted
  const lowestSource = [...sourcePerformance].sort((a, b) => a.accuracy - b.accuracy)[0];
  if (lowestSource && lowestSource.accuracy < 75) {
    const sourcePassage =
      availablePassages.find((p) => p.source === lowestSource.source) ||
      availablePassages[0];

    if (sourcePassage && !recommendations.some((r) => r.passage.id === sourcePassage.id)) {
      recommendations.push({
        id: `rec-src-${sourcePassage.id}`,
        passage: sourcePassage,
        ruleTriggered: `Source Focus: ${lowestSource.source}`,
        rationale: `Your accuracy on ${lowestSource.source} articles is ${lowestSource.accuracy}%. Practice with ${lowestSource.source}'s characteristic editorial style.`,
        focusType: "source",
        badgeText: `Focus: ${lowestSource.source} Style`,
        priority: 6,
      });
    }
  }

  // Fallback: If no specific rules triggered, pick highest-value uncompleted passage
  if (recommendations.length === 0) {
    const defaultPassage = availablePassages[0] || allPassages[0];
    recommendations.push({
      id: `rec-default-${defaultPassage.id}`,
      passage: defaultPassage,
      ruleTriggered: "Standard CAT Drill",
      rationale: `Based on your balanced accuracy (${overallAccuracy}%) and pacing (${averageWpm} WPM), this CAT-standard drill provides optimal balanced practice.`,
      focusType: "general",
      badgeText: "Recommended Practice",
      priority: 5,
    });
  }

  // Sort by priority descending
  recommendations.sort((a, b) => b.priority - a.priority);

  const primary = recommendations[0];

  return {
    primaryHeadline: primary.badgeText,
    primaryRationale: primary.rationale,
    recommendations: recommendations.slice(0, 3),
  };
}
