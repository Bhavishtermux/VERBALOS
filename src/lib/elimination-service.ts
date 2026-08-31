import { TrapType } from "./traps";

export interface OptionEliminationRecord {
  optionIndex: number;
  selectedTrap: TrapType;
  isActualTrap: boolean;
  wasCorrectAnswer: boolean;
  timestamp: string;
}

export interface EliminationLabAttempt {
  attemptId: string;
  questionId: string;
  passageId: string;
  passageTitle: string;
  questionType: string;
  eliminations: OptionEliminationRecord[];
  finalAnswerIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  date: string;
}

export interface EliminationAnalytics {
  totalQuestionsProcessed: number;
  totalEliminationsMade: number;
  correctlyEliminatedDistractors: number;
  correctAnswerEliminationCount: number; // Critical error: user killed the right answer!
  correctAnswerEliminationRate: number; // percentage
  finalSelectionAccuracy: number; // percentage
  mostFrequentTrapDiagnosed: string;
  mostDangerousTrapForUser: string;
  trapDistribution: {
    trapType: TrapType;
    eliminationsCount: number;
    accuracyPercent: number;
  }[];
}

const ELIMINATION_STORAGE_KEY = "verbalos_elimination_lab_attempts";

export function getEliminationAttempts(): EliminationLabAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ELIMINATION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEliminationAttempt(attempt: EliminationLabAttempt): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getEliminationAttempts();
    existing.unshift(attempt);
    window.localStorage.setItem(ELIMINATION_STORAGE_KEY, JSON.stringify(existing.slice(0, 300)));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.warn("Could not save elimination attempt", e);
  }
}

export function calculateEliminationAnalytics(
  attempts: EliminationLabAttempt[] = []
): EliminationAnalytics {
  if (!attempts || attempts.length === 0) {
    return {
      totalQuestionsProcessed: 0,
      totalEliminationsMade: 0,
      correctlyEliminatedDistractors: 0,
      correctAnswerEliminationCount: 0,
      correctAnswerEliminationRate: 0,
      finalSelectionAccuracy: 0,
      mostFrequentTrapDiagnosed: "None yet",
      mostDangerousTrapForUser: "None yet",
      trapDistribution: [],
    };
  }

  let totalEliminations = 0;
  let correctEliminations = 0;
  let killedCorrectAnswerCount = 0;
  let finalCorrectCount = 0;

  const trapStats: Record<string, { count: number; correctRecognitions: number }> = {};

  attempts.forEach((att) => {
    if (att.isCorrect) finalCorrectCount++;

    att.eliminations.forEach((el) => {
      totalEliminations++;
      if (el.wasCorrectAnswer) {
        killedCorrectAnswerCount++;
      } else {
        correctEliminations++;
      }

      if (!trapStats[el.selectedTrap]) {
        trapStats[el.selectedTrap] = { count: 0, correctRecognitions: 0 };
      }
      trapStats[el.selectedTrap].count++;
      if (el.isActualTrap) {
        trapStats[el.selectedTrap].correctRecognitions++;
      }
    });
  });

  const trapDistribution = Object.entries(trapStats).map(([trap, stat]) => ({
    trapType: trap as TrapType,
    eliminationsCount: stat.count,
    accuracyPercent: stat.count > 0 ? Math.round((stat.correctRecognitions / stat.count) * 100) : 0,
  }));

  trapDistribution.sort((a, b) => b.eliminationsCount - a.eliminationsCount);

  const mostFrequentTrap = trapDistribution[0]?.trapType || "None";
  
  // Most dangerous is the trap type with lowest recognition accuracy having at least 2 uses
  const candidateDangerous = [...trapDistribution]
    .filter((t) => t.eliminationsCount >= 2 && t.trapType !== "Valid Elimination / Correct Option")
    .sort((a, b) => a.accuracyPercent - b.accuracyPercent);

  const mostDangerous = candidateDangerous[0]?.trapType || "Partial Truth";

  const totalQs = attempts.length;
  const correctAnswerEliminationRate =
    totalEliminations > 0 ? Math.round((killedCorrectAnswerCount / totalEliminations) * 100) : 0;
  const finalSelectionAccuracy = totalQs > 0 ? Math.round((finalCorrectCount / totalQs) * 100) : 0;

  return {
    totalQuestionsProcessed: totalQs,
    totalEliminationsMade: totalEliminations,
    correctlyEliminatedDistractors: correctEliminations,
    correctAnswerEliminationCount: killedCorrectAnswerCount,
    correctAnswerEliminationRate,
    finalSelectionAccuracy,
    mostFrequentTrapDiagnosed: mostFrequentTrap,
    mostDangerousTrapForUser: mostDangerous,
    trapDistribution,
  };
}
