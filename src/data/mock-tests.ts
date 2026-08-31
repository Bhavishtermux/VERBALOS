import { VARCMockConfig } from "@/types";

export const initialMockTests: VARCMockConfig[] = [
  {
    id: "mock-01",
    title: "CAT VARC Mock 1 (Standard 2026 Simulation)",
    subtitle: "24 Questions (16 RC across 4 Passages + 8 VA Questions)",
    durationMinutes: 40, // 40 minutes continuous section timer
    totalQuestions: 14, // Scaled for rich interactive practice
    rcPassageIds: ["rc-01", "rc-02"],
    vaQuestionIds: ["ps-01", "ps-02", "pj-01", "pj-02"],
    difficulty: "CAT",
  },
  {
    id: "mock-02",
    title: "CAT VARC Mock 2 (Advanced Editorial & Critical Reasoning)",
    subtitle: "High-density Philosophy, Economics, and Complex Para Jumbles",
    durationMinutes: 40,
    totalQuestions: 14,
    rcPassageIds: ["rc-03", "rc-04"],
    vaQuestionIds: ["ps-03", "ps-04", "pj-03", "pj-04"],
    difficulty: "CAT+",
  },
  {
    id: "mock-03",
    title: "CAT VARC Mock 3 (Speed & Accuracy Benchmark)",
    subtitle: "Focus on rapid RC inference and structural Odd Sentence elimination",
    durationMinutes: 30,
    totalQuestions: 12,
    rcPassageIds: ["rc-05", "rc-06"],
    vaQuestionIds: ["oso-01", "oso-02", "oso-03", "oso-04"],
    difficulty: "Hard",
  },
];
