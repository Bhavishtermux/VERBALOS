"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingDown,
  BookOpen,
  Filter,
  ArrowRight,
  ShieldAlert,
  Search,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MistakeJournalEntry, MistakeCategory } from "@/types";
import { getStoredMistakes } from "@/lib/analytics";

const MISTAKE_DESCRIPTIONS: Record<MistakeCategory, { diagnosis: string; remedy: string }> = {
  "Unsupported inference": {
    diagnosis: "You frequently choose choices that sound logically plausible but extrapolate beyond what the passage explicitly establishes.",
    remedy: "Anchor your elimination directly in explicit paragraph sentences; if an option requires a multi-step unstated assumption, discard it.",
  },
  "Partial truth": {
    diagnosis: "You pick options that state a fact accurately according to the passage, but fail to directly answer the specific question stem.",
    remedy: "Read all four options to the very last word and verify whether it answers the specific operational question verb (e.g. 'function', 'undermines').",
  },
  "Extreme option": {
    diagnosis: "You fall for options containing radical qualifiers such as 'always', 'completely', 'invariably', or 'never'.",
    remedy: "CAT authors rarely take absolute stances. Scrutinize modal adverbs ('might', 'tends to') vs absolutes ('proves', 'destroys').",
  },
  "Outside passage": {
    diagnosis: "You incorporate real-world external knowledge that is true in reality but absent from the author's enclosed argument.",
    remedy: "Treat the passage as a closed epistemological universe. If an author doesn't state it, it is out of bounds.",
  },
  "Tone mismatch": {
    diagnosis: "You mistake measured analytical critique for outright cynical hostility or praise for neutral reporting.",
    remedy: "Underline authorial adjectives ('remarkable', 'flawed', 'regrettable') to accurately calibrate emotional sentiment.",
  },
  "Main idea confusion": {
    diagnosis: "You confuse a localized supporting example in paragraph 2 with the overarching thesis of the entire passage.",
    remedy: "Map the passage paragraph-by-paragraph: ask 'Why did the author write this paragraph?' rather than getting lost in details.",
  },
  "Misread passage": {
    diagnosis: "Under time pressure, you misread negative boundary clauses ('not uncommonly', 'except', 'unlikely').",
    remedy: "Circle operational negative words in the question stem before evaluating choices.",
  },
  "Detail error": {
    diagnosis: "You attribute a quote or hypothesis to the main author when it was actually expressed by a cited secondary critic.",
    remedy: "Check the subject of the sentence: is the author agreeing with the critic or reporting their view to refute it?",
  },
  "Question misinterpretation": {
    diagnosis: "You answered what the passage said rather than what the question specifically demanded.",
    remedy: "Restate the question stem in your own words before looking at options A, B, C, and D.",
  },
  "Scope error": {
    diagnosis: "The option broadens the topic from a specific domain to human civilization as a whole.",
    remedy: "Compare option nouns with passage nouns: if the text says 'digital platforms', eliminate options asserting 'all modern technology'.",
  },
  "Contradiction": {
    diagnosis: "The option reverses the author's actual cause-and-effect relationship.",
    remedy: "Draw arrows: did X cause Y, or did Y cause X?",
  },
  "Author-position confusion": {
    diagnosis: "Confusing the perspective of the counter-argument with the author's own conclusion.",
    remedy: "Identify the author's thesis pivot words: 'However', 'Yet', 'In reality', 'On the contrary'.",
  },
};

// Initial Seed Mistakes for the Journal
const initialMistakeLogs: MistakeJournalEntry[] = [
  {
    id: "m-01",
    sessionId: "rc-01",
    practiceType: "RC",
    contentTitle: "The Solipsistic Trap: Phenomenological Consciousness",
    questionText: "Which of the following best captures the epistemological limitation of the argument from analogy according to phenomenology?",
    questionType: "Inference",
    mistakeCategory: "Unsupported inference",
    userAnswer: "It assumes that physical bodies can never express genuine emotional states without neural mirroring.",
    correctAnswer: "It remains an inductive probabilistic wager unable to rule out the possibility of philosophical zombies.",
    explanation: "Paragraph 2 explicitly explains that the argument from analogy is merely a probabilistic wager that cannot overcome the philosophical zombie dilemma.",
    topic: "Philosophy",
    difficulty: "CAT+",
    date: "2026-08-30",
    formattedDate: "Aug 30, 2026",
  },
  {
    id: "m-02",
    sessionId: "rc-02",
    practiceType: "RC",
    contentTitle: "Digital Feudalism and Cloud Rentierism",
    questionText: "What distinguishes digital platform rentierism from classical industrial production?",
    questionType: "Main Idea",
    mistakeCategory: "Partial truth",
    userAnswer: "Digital platforms employ high-frequency stock trading algorithms to dominate global commerce.",
    correctAnswer: "Digital platforms extract surplus through legal asset monopolization rather than value-adding physical production.",
    explanation: "While platform owners participate in financial markets, the defining characteristic highlighted by the text is asset monopolization and rent extraction.",
    topic: "Economics",
    difficulty: "CAT",
    date: "2026-08-29",
    formattedDate: "Aug 29, 2026",
  },
  {
    id: "m-03",
    sessionId: "ps-01",
    practiceType: "Para Summary",
    contentTitle: "Evolutionary Rationality & Cognitive Bias",
    questionText: "Choose the option that best summarizes the paragraph:",
    questionType: "Para Summary",
    mistakeCategory: "Extreme option",
    userAnswer: "All forms of modern education are fundamentally powerless against deep-seated prehistoric cognitive biases.",
    correctAnswer: "Human biases are evolved heuristics for ancestral survival rather than accidental corruptions of pure rationality.",
    explanation: "The text never claims modern education is 'fundamentally powerless', which is an extreme absolute generalization.",
    topic: "Psychology",
    difficulty: "CAT",
    date: "2026-08-28",
    formattedDate: "Aug 28, 2026",
  },
  {
    id: "m-04",
    sessionId: "rc-03",
    practiceType: "RC",
    contentTitle: "The Panopticon of Attention: Surveillance Capitalism",
    questionText: "The author's tone toward the monetization of cognitive surplus can best be described as:",
    questionType: "Tone",
    mistakeCategory: "Tone mismatch",
    userAnswer: "Objective resignation toward unavoidable technological progress.",
    correctAnswer: "Deeply critical of its erosion of human autonomy and democratic agency.",
    explanation: "The author uses urgent, critical prose ('predatory extraction', 'eroding civic sovereignty') rather than passive resignation.",
    topic: "Sociology",
    difficulty: "Hard",
    date: "2026-08-27",
    formattedDate: "Aug 27, 2026",
  },
];

export default function MistakeJournalPage() {
  const [mistakes, setMistakes] = useState<MistakeJournalEntry[]>(initialMistakeLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Calculate Recurring Mistakes Frequency
  const frequencyMap: Record<string, number> = {};
  mistakes.forEach((m) => {
    frequencyMap[m.mistakeCategory] = (frequencyMap[m.mistakeCategory] || 0) + 1;
  });

  const recurringMistakesSorted = Object.entries(frequencyMap)
    .map(([cat, count]) => ({ category: cat as MistakeCategory, count }))
    .sort((a, b) => b.count - a.count);

  const topMistake = recurringMistakesSorted[0];

  // Filtered Mistakes List
  const filteredMistakes = mistakes.filter((m) => {
    const matchesSearch =
      m.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === "all" || m.mistakeCategory === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Diagnostic Log
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 font-mono">Recurring Trap Analysis & Prescriptions</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
          Mistake Journal
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Every incorrect answer is diagnosed and classified by cognitive error pattern to prevent recurring traps in your CAT exam.
        </p>
      </div>

      {/* Top Recurring Trap Highlight Banner */}
      {topMistake && (
        <Card className="bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-950 dark:text-amber-200">
                Primary Recurring Cognitive Trap: <span className="underline decoration-amber-400">{topMistake.category}</span>
              </h3>
            </div>
            <Badge className="bg-amber-600 text-white font-mono text-[10px]">
              {topMistake.count} Logged Occurrences
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-sans">
            {MISTAKE_DESCRIPTIONS[topMistake.category]?.diagnosis ||
              "You frequently select options that go beyond the explicit factual boundaries of the text."}
          </p>

          <div className="p-3 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">
              What to Do in Your Next Practice:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300">
              {MISTAKE_DESCRIPTIONS[topMistake.category]?.remedy}
            </p>
          </div>
        </Card>
      )}

      {/* Recurring Mistakes Frequency Ranking */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recurringMistakesSorted.slice(0, 3).map((item, idx) => (
          <Card key={item.category} className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                Rank #{idx + 1} Trap
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {item.count} errors
              </Badge>
            </div>
            <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {item.category}
            </h4>
            <p className="text-[11px] text-zinc-500 line-clamp-2">
              {MISTAKE_DESCRIPTIONS[item.category]?.remedy}
            </p>
          </Card>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search mistakes by passage title, question text, topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        <Select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="text-xs w-full sm:w-56"
        >
          <option value="all">All Trap Categories</option>
          <option value="Unsupported inference">Unsupported inference</option>
          <option value="Partial truth">Partial truth</option>
          <option value="Extreme option">Extreme option</option>
          <option value="Outside passage">Outside passage</option>
          <option value="Tone mismatch">Tone mismatch</option>
          <option value="Main idea confusion">Main idea confusion</option>
        </Select>
      </div>

      {/* Detailed Mistakes Log */}
      <div className="space-y-4">
        {filteredMistakes.map((entry) => (
          <Card key={entry.id} className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="neutral" className="text-[10px] font-mono">
                  {entry.practiceType}
                </Badge>
                <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {entry.contentTitle}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span>{entry.topic}</span> • <span>{entry.formattedDate}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-xs sm:text-sm font-serif text-zinc-800 dark:text-zinc-200 leading-relaxed">
              <strong>Question:</strong> {entry.questionText}
            </div>

            {/* Mistake Diagnostic Callout */}
            <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                <span className="font-bold text-rose-950 dark:text-rose-200 font-mono">
                  Mistake Type: {entry.mistakeCategory}
                </span>
              </div>
              <p className="text-rose-900/90 dark:text-rose-200/80 text-[11px] leading-relaxed">
                {MISTAKE_DESCRIPTIONS[entry.mistakeCategory]?.diagnosis}
              </p>
            </div>

            {/* User vs Correct Answer Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-rose-600 dark:text-rose-400 font-bold block">
                  Your Answer (Trap Choice):
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-serif leading-relaxed mt-1 block">
                  {entry.userAnswer}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold block">
                  Correct Answer:
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-serif leading-relaxed mt-1 block">
                  {entry.correctAnswer}
                </span>
              </div>
            </div>

            {/* Textual Proof Explanation */}
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <strong className="text-zinc-800 dark:text-zinc-200">Textual Proof:</strong> {entry.explanation}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
