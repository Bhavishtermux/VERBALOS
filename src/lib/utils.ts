import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function calculateWpm(wordCount: number, timeSpentSeconds: number): number {
  if (timeSpentSeconds <= 0) return 0;
  const minutes = timeSpentSeconds / 60;
  return Math.round(wordCount / minutes);
}
