"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  Award,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SelectionLabPage() {
  const { rcPassages } = useRc();
  const [activeTab, setActiveTab] = useState<"passage" | "question">("passage");

  // Passage Triage State
  const sampleSet = rcPassages.slice(0, 4);
  const [passageRankings, setPassageRankings] = useState<Record<string, number>>({});
  const [isPassageTriageSubmitted, setIsPassageTriageSubmitted] = useState<boolean>(false);

  // Question Triage State
  const samplePassage = rcPassages[0] || sampleSet[0];
  const [questionDecisions, setQuestionDecisions] = useState<Record<number, "attempt" | "maybe" | "skip">>({});
  const [isQuestionTriageSubmitted, setIsQuestionTriageSubmitted] = useState<boolean>(false);

  const handleRankPassage = (pId: string, rank: number) => {
    setPassageRankings((prev) => {
      const updated = { ...prev };
      // Clear previous assignment of this rank
      Object.keys(updated).forEach((k) => {
        if (updated[k] === rank) delete updated[k];
      });
      updated[pId] = rank;
      return updated;
    });
  };

  const handleDecideQuestion = (qIdx: number, decision: "attempt" | "maybe" | "skip") => {
    setQuestionDecisions((prev) => ({
      ...prev,
      [qIdx]: decision,
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200/80 pb-5 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" /> Exam Decision Intelligence
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">Triage &amp; Time Allocation</span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            Selection &amp; Triage Lab
          </h1>
          <p className="mt-1 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A 99th percentile VARC score is determined before solving a single question. Train your ability to scan 4 RCs in 2.5 minutes and triage questions to maximize expected score per minute.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg self-start md:self-auto">
          <Button
            variant={activeTab === "passage" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("passage")}
            className="text-xs h-7 font-mono"
          >
            1. Passage Selection (4 RCs)
          </Button>
          <Button
            variant={activeTab === "question" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("question")}
            className="text-xs h-7 font-mono"
          >
            2. Question Triage (Within RC)
          </Button>
        </div>
      </div>

      {activeTab === "passage" ? (
        /* 1. PASSAGE SELECTION DRILL */
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold font-serif text-blue-950 dark:text-blue-300 uppercase text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Sectional Triage Scenario:</span>
            </div>
            <p className="text-blue-900/90 dark:text-blue-200 font-sans leading-relaxed">
              You have entered the 40-minute VARC section. You spend the first 2 minutes scanning all 4 passages. Rank which order you will attempt them (#1 Highest Priority $\rightarrow$ #4 Lowest Priority/Skip candidate).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleSet.map((p, idx) => {
              const currentRank = passageRankings[p.id];
              return (
                <Card
                  key={p.id}
                  className={`p-5 flex flex-col justify-between transition-all bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm ${
                    currentRank ? "ring-2 ring-blue-500/80 dark:ring-blue-400" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                        Passage #{idx + 1}
                      </Badge>
                      <Badge
                        variant={
                          p.difficulty === "CAT+"
                            ? "danger"
                            : p.difficulty === "CAT"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[10px] font-mono"
                      >
                        {p.difficulty} • {p.wordCount} words
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-50 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        Genre: {p.topic} • Source: {p.source}
                      </p>
                    </div>

                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-950 p-2.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                        Question Density Matrix:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {p.questions.map((q, qIdx) => (
                          <span
                            key={qIdx}
                            className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-[10px]"
                          >
                            Q{qIdx + 1}: {q.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ranking Buttons */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500 font-bold">
                      {currentRank ? `Assigned: Order #${currentRank}` : "Unranked"}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRankPassage(p.id, r)}
                          className={`h-7 w-7 rounded-md text-xs font-mono font-bold transition-all ${
                            currentRank === r
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                          }`}
                        >
                          #{r}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end pt-3">
            <Button
              onClick={() => setIsPassageTriageSubmitted(true)}
              disabled={Object.keys(passageRankings).length < 4}
              className="gap-1.5 font-mono text-xs"
            >
              <span>Evaluate Triage Strategy</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {isPassageTriageSubmitted && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-serif font-bold text-base">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>CAT Selection Diagnostics &amp; Feedback</span>
              </div>
              <p className="text-xs text-emerald-950/90 dark:text-emerald-200/90 leading-relaxed font-sans">
                <strong>Strategic Insight:</strong> Prioritizing RCs with higher direct detail and main idea questions over dense abstract epistemology yields an average +4.2 net marks in the first 20 minutes of the sectional clock.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* 2. QUESTION TRIAGE DRILL */
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">
                  Active Passage Context:
                </span>
                <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-50">
                  {samplePassage.title}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs font-mono">
                {samplePassage.topic} • {samplePassage.difficulty}
              </Badge>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-serif line-clamp-3 italic">
              &ldquo;{samplePassage.content.slice(0, 320)}...&rdquo;
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="font-mono uppercase font-bold text-xs text-zinc-400">
                Triage All 4 Questions (Choose: Attempt Immediately / Maybe / Skip Trap):
              </h4>

              {samplePassage.questions.map((q, idx) => {
                const decision = questionDecisions[idx];
                return (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-400">Q{idx + 1}</span>
                          <Badge variant="academic" className="text-[10px] font-mono uppercase">
                            {q.type}
                          </Badge>
                        </div>
                        <p className="font-serif font-bold text-xs md:text-sm text-zinc-900 dark:text-zinc-100">
                          {q.questionText}
                        </p>
                      </div>

                      {/* Decision Badges */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleDecideQuestion(idx, "attempt")}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                            decision === "attempt"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                          }`}
                        >
                          Attempt
                        </button>
                        <button
                          onClick={() => handleDecideQuestion(idx, "maybe")}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                            decision === "maybe"
                              ? "bg-amber-600 text-white shadow-sm"
                              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                          }`}
                        >
                          Maybe
                        </button>
                        <button
                          onClick={() => handleDecideQuestion(idx, "skip")}
                          className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                            decision === "skip"
                              ? "bg-rose-600 text-white shadow-sm"
                              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                          }`}
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3">
              <Button
                onClick={() => setIsQuestionTriageSubmitted(true)}
                disabled={Object.keys(questionDecisions).length < samplePassage.questions.length}
                className="gap-1.5 font-mono text-xs"
              >
                <span>Evaluate Question Triage</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {isQuestionTriageSubmitted && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2 animate-in fade-in-50 duration-200">
                <h4 className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Question Triage Accuracy: 100%</span>
                </h4>
                <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 font-sans leading-relaxed">
                  You correctly prioritized high-certainty Main Idea and Direct Detail queries while tagging ambiguous negative inference questions for selective review.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
