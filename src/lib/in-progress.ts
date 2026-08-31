export interface InProgressDrill {
  passageId: string;
  passageTitle: string;
  topic: string;
  difficulty: string;
  stage: "preview" | "reading" | "questions";
  readingSeconds: number;
  calculatedWpm: number;
  selectedAnswers: Record<number, number>;
  currentQuestionIndex: number;
  totalQuestions: number;
  savedAt: string;
}

const STORAGE_KEY = "rc_lab_in_progress_drills";

export function getInProgressDrills(): InProgressDrill[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "object") return Object.values(parsed);
    return [];
  } catch (e) {
    console.warn("Failed to load in-progress drills", e);
    return [];
  }
}

export function getInProgressDrill(passageId: string): InProgressDrill | null {
  const drills = getInProgressDrills();
  return drills.find((d) => d.passageId === passageId) || null;
}

export function saveInProgressDrill(drill: InProgressDrill): void {
  if (typeof window === "undefined") return;
  try {
    const drills = getInProgressDrills().filter((d) => d.passageId !== drill.passageId);
    drills.unshift(drill);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drills));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.warn("Failed to save in-progress drill", e);
  }
}

export function deleteInProgressDrill(passageId: string): void {
  if (typeof window === "undefined") return;
  try {
    const drills = getInProgressDrills().filter((d) => d.passageId !== passageId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drills));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.warn("Failed to delete in-progress drill", e);
  }
}
