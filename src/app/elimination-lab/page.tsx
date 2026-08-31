"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BarChart3,
  Lightbulb,
  Layers,
  ChevronRight,
  Crosshair,
  ShieldAlert,
  Award,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { CAT_TRAP_TAXONOMY, TrapType } from "@/lib/traps";
import {
  saveEliminationAttempt,
  getEliminationAttempts,
  calculateEliminationAnalytics,
  EliminationLabAttempt,
  OptionEliminationRecord,
} from "@/lib/elimination-service";

export default function EliminationLabPage() {
  const { rcPassages } = useRc();
  const [mounted, setMounted] = useState(false);
  const [selectedPassageId, setSelectedPassageId] = useState<string>("rc-01");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  // Elimination interaction state
  const [eliminations, setEliminations] = useState<Record<number, TrapType>>({});
  const [pendingEliminationOption, setPendingEliminationOption] = useState<number | null>(null);
  const [selectedFinalAnswer, setSelectedFinalAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Analytics state
  const [analytics, setAnalytics] = useState(calculateEliminationAnalytics([]));

  useEffect(() => {
    setMounted(true);
    setStartTime(Date.now());
    if (rcPassages && rcPassages.length > 0) {
      setSelectedPassageId(rcPassages[0].id);
    }
    const loadAnalytics = () => {
      const attempts = getEliminationAttempts();
      setAnalytics(calculateEliminationAnalytics(attempts));
    };
    loadAnalytics();
    window.addEventListener("storage", loadAnalytics);
    return () => window.removeEventListener("storage", loadAnalytics);
  }, [rcPassages]);

  const passage = useMemo(() => {
    return rcPassages.find((p) => p.id === selectedPassageId) || rcPassages[0];
  }, [rcPassages, selectedPassageId]);

  const currentQuestion = useMemo(() => {
    if (!passage || !passage.questions || passage.questions.length === 0) return null;
    return passage.questions[selectedQuestionIndex] || passage.questions[0];
  }, [passage, selectedQuestionIndex]);

  // Reset state when switching questions
  const handleSelectQuestion = (qIdx: number) => {
    setSelectedQuestionIndex(qIdx);
    setEliminations({});
    setSelectedFinalAnswer(null);
    setIsSubmitted(false);
    setStartTime(Date.now());
  };

  const handleOpenEliminationModal = (optIdx: number) => {
    setPendingEliminationOption(optIdx);
  };

  const handleConfirmElimination = (trap: TrapType) => {
    if (pendingEliminationOption === null) return;
    setEliminations((prev) => ({
      ...prev,
      [pendingEliminationOption]: trap,
    }));
    if (selectedFinalAnswer === pendingEliminationOption) {
      setSelectedFinalAnswer(null);
    }
    setPendingEliminationOption(null);
  };

  const handleUndoElimination = (optIdx: number) => {
    setEliminations((prev) => {
      const copy = { ...prev };
      delete copy[optIdx];
      return copy;
    });
  };

  const handleSubmit = () => {
    if (selectedFinalAnswer === null || !currentQuestion || !passage) return;

    const timeSpent = Math.max(Math.round((Date.now() - startTime) / 1000), 5);
    const isCorrect = selectedFinalAnswer === currentQuestion.correctOptionIndex;

    const eliminationRecords: OptionEliminationRecord[] = Object.entries(eliminations).map(
      ([optStr, trap]) => {
        const optIdx = parseInt(optStr, 10);
        const wasCorrect = optIdx === currentQuestion.correctOptionIndex;
        return {
          optionIndex: optIdx,
          selectedTrap: trap,
          isActualTrap: !wasCorrect,
          wasCorrectAnswer: wasCorrect,
          timestamp: new Date().toISOString(),
        };
      }
    );

    const attempt: EliminationLabAttempt = {
      attemptId: `elim_${Date.now()}`,
      questionId: currentQuestion.id,
      passageId: passage.id,
      passageTitle: passage.title,
      questionType: currentQuestion.type,
      eliminations: eliminationRecords,
      finalAnswerIndex: selectedFinalAnswer,
      isCorrect,
      timeSpentSeconds: timeSpent,
      date: new Date().toISOString(),
    };

    saveEliminationAttempt(attempt);
    setAnalytics(calculateEliminationAnalytics(getEliminationAttempts()));
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (!passage) return;
    if (selectedQuestionIndex < passage.questions.length - 1) {
      handleSelectQuestion(selectedQuestionIndex + 1);
    } else {
      // Find next passage
      const currentIdx = rcPassages.findIndex((p) => p.id === passage.id);
      const nextPassage = rcPassages[(currentIdx + 1) % rcPassages.length];
      setSelectedPassageId(nextPassage.id);
      setSelectedQuestionIndex(0);
      setEliminations({});
      setSelectedFinalAnswer(null);
      setIsSubmitted(false);
      setStartTime(Date.now());
    }
  };

  if (!mounted || !passage || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent mx-auto dark:border-zinc-100" />
        <p className="text-xs text-zinc-500 font-mono">Calibrating Elimination Lab...</p>
      </div>
    );
  }

  const trapOptions: TrapType[] = [
    "Too Broad",
    "Too Narrow",
    "Extreme Language",
    "Outside Scope",
    "Partial Truth",
    "Distortion",
    "Reversal",
    "Wrong Referent",
    "Tone Mismatch",
    "Correct Fact, Wrong Question",
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200/80 pb-5 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
              <Crosshair className="h-3.5 w-3.5" /> CAT Reasoning Lab
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">Process-Oriented Option Elimination</span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            Elimination Lab
          </h1>
          <p className="mt-1 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            In CAT VARC, picking the right answer is easy once you systematically eliminate the 3 flawed distractors. Diagnose the exact trap before confirming your choice.
          </p>
        </div>

        <Link href="/strategy">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 font-mono">
            <span>View Trap Taxonomy Guide</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Top Elimination Performance Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Questions Solved</span>
          <span className="text-lg font-bold font-serif text-zinc-900 dark:text-zinc-100">
            {analytics.totalQuestionsProcessed} Qs
          </span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Final Accuracy</span>
          <span className="text-lg font-bold font-serif text-emerald-600 dark:text-emerald-400">
            {analytics.totalQuestionsProcessed > 0 ? `${analytics.finalSelectionAccuracy}%` : "—"}
          </span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Killed Right Answer Rate</span>
          <span className={`text-lg font-bold font-serif ${analytics.correctAnswerEliminationRate > 15 ? "text-rose-600" : "text-zinc-800 dark:text-zinc-200"}`}>
            {analytics.totalEliminationsMade > 0 ? `${analytics.correctAnswerEliminationRate}%` : "0%"}
          </span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Most Dangerous Trap</span>
          <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 truncate block mt-1">
            {analytics.mostDangerousTrapForUser}
          </span>
        </Card>
      </div>

      {/* Selector Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-mono uppercase text-zinc-400 font-bold whitespace-nowrap">
            Passage:
          </span>
          <select
            value={selectedPassageId}
            onChange={(e) => {
              setSelectedPassageId(e.target.value);
              setSelectedQuestionIndex(0);
              setEliminations({});
              setSelectedFinalAnswer(null);
              setIsSubmitted(false);
              setStartTime(Date.now());
            }}
            className="text-xs font-serif font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none w-full max-w-sm truncate"
          >
            {rcPassages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.topic})
              </option>
            ))}
          </select>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-1">
          {passage.questions.map((q, idx) => (
            <button
              key={q.id || idx}
              onClick={() => handleSelectQuestion(idx)}
              className={`h-7 px-2.5 rounded text-xs font-mono font-bold transition-all ${
                selectedQuestionIndex === idx
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
              }`}
            >
              Q{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Passage Excerpt & Context */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-zinc-400">
              Passage Excerpt
            </span>
            <Badge variant="secondary" className="text-[10px] font-mono uppercase">
              {passage.source} • {passage.topic}
            </Badge>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white dark:bg-zinc-900/70 p-4 max-h-[500px] overflow-y-auto font-serif text-xs md:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 space-y-3">
            <h3 className="font-bold text-sm font-serif text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              {passage.title}
            </h3>
            <p className="whitespace-pre-line">{passage.content}</p>
          </div>
        </div>

        {/* Right Column: Elimination Workspace */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-5">
            {/* Question Header */}
            <div className="space-y-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="academic" className="text-[10px] font-mono uppercase">
                  {currentQuestion.type}
                </Badge>
                <span className="text-xs font-mono text-zinc-400">
                  Step 1: Eliminate Traps → Step 2: Pick Winner
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-snug">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options List with Interactive Elimination */}
            <div className="space-y-3">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isEliminated = eliminations[optIdx] !== undefined;
                const isSelectedWinner = selectedFinalAnswer === optIdx;
                const isCorrectAnswer = currentQuestion.correctOptionIndex === optIdx;

                let borderStyle = "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900";
                if (isSubmitted) {
                  if (isCorrectAnswer) {
                    borderStyle = "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20";
                  } else if (isSelectedWinner && !isCorrectAnswer) {
                    borderStyle = "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20";
                  }
                } else if (isEliminated) {
                  borderStyle = "border-zinc-200/60 bg-zinc-50/80 dark:bg-zinc-950/60 opacity-60";
                } else if (isSelectedWinner) {
                  borderStyle = "border-zinc-900 dark:border-zinc-100 bg-zinc-50/90 dark:bg-zinc-800/60 ring-1 ring-zinc-900 dark:ring-zinc-100";
                }

                return (
                  <div
                    key={optIdx}
                    className={`rounded-xl border p-3.5 transition-all space-y-2.5 ${borderStyle}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="font-mono text-xs font-bold text-zinc-400 pt-0.5 shrink-0">
                          ({String.fromCharCode(65 + optIdx)})
                        </span>
                        <p
                          className={`text-xs sm:text-sm font-sans leading-relaxed ${
                            isEliminated && !isSubmitted
                              ? "line-through text-zinc-400"
                              : "text-zinc-800 dark:text-zinc-200"
                          }`}
                        >
                          {optionText}
                        </p>
                      </div>

                      {/* Status Badges after submission */}
                      {isSubmitted && (
                        <div className="shrink-0">
                          {isCorrectAnswer ? (
                            <Badge variant="success" className="text-[10px] font-mono">
                              Correct Choice
                            </Badge>
                          ) : (
                            <Badge variant="danger" className="text-[10px] font-mono">
                              Flawed Distractor
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Trap Tag if eliminated */}
                    {isEliminated && (
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs">
                        <Badge variant="warning" className="text-[10px] font-mono font-semibold">
                          Trap: {eliminations[optIdx]}
                        </Badge>
                        {!isSubmitted && (
                          <button
                            onClick={() => handleUndoElimination(optIdx)}
                            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 hover:underline"
                          >
                            <RotateCcw className="h-3 w-3" /> Undo
                          </button>
                        )}
                      </div>
                    )}

                    {/* Elimination / Selection Controls before submission */}
                    {!isSubmitted && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                        {!isEliminated ? (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEliminationModal(optIdx)}
                              className="h-7 text-xs font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Eliminate Trap</span>
                            </Button>

                            <Button
                              type="button"
                              variant={isSelectedWinner ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedFinalAnswer(optIdx)}
                              className="h-7 text-xs font-mono gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{isSelectedWinner ? "Selected Winner" : "Pick as Winner"}</span>
                            </Button>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Action Bar */}
            {!isSubmitted ? (
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-mono text-zinc-500">
                  {Object.keys(eliminations).length} of 3 distractors eliminated
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedFinalAnswer === null}
                  className="gap-1.5 font-mono text-xs"
                >
                  <span>Submit &amp; Evaluate Reasoning</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              /* Post-Submission Master 6-Part Explanation */
              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in-50 duration-200">
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    selectedFinalAnswer === currentQuestion.correctOptionIndex
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200"
                      : "bg-rose-50/70 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedFinalAnswer === currentQuestion.correctOptionIndex ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-sm">
                        {selectedFinalAnswer === currentQuestion.correctOptionIndex
                          ? "Logical Elimination Successful!"
                          : "Trap Encountered"}
                      </h4>
                      <p className="text-xs opacity-90">
                        Correct Answer: Option ({String.fromCharCode(65 + currentQuestion.correctOptionIndex)})
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleNextQuestion} size="sm" className="gap-1 text-xs font-mono">
                    <span>Next Drill</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* 6-Part Master Reasoning Box */}
                <div className="space-y-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 text-xs space-y-3">
                  <div>
                    <span className="font-mono uppercase font-bold text-[10px] text-zinc-400 block mb-1">
                      1. Core Deductive Idea:
                    </span>
                    <p className="font-serif text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                    <span className="font-mono uppercase font-bold text-[10px] text-zinc-400 block mb-1">
                      2. CAT Elimination Lesson:
                    </span>
                    <p className="font-sans text-zinc-700 dark:text-zinc-300 text-xs italic">
                      Always differentiate the author’s primary thesis from illustrative secondary examples. Eliminate options that extrapolate beyond text boundary constraints.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trap Selection Modal */}
      {pendingEliminationOption !== null && (
        <Modal
          isOpen={true}
          onClose={() => setPendingEliminationOption(null)}
          title="Diagnose Elimination Trap"
          description={`Option (${String.fromCharCode(65 + pendingEliminationOption)}): Why is this distractor flawed according to CAT standards?`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="font-sans text-zinc-700 dark:text-zinc-300 italic bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800">
              &ldquo;{currentQuestion.options[pendingEliminationOption]}&rdquo;
            </p>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                Select Trap Category:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                {trapOptions.map((trap) => (
                  <button
                    key={trap}
                    onClick={() => handleConfirmElimination(trap)}
                    className="text-left p-2 rounded-lg border border-zinc-200 hover:border-amber-500 bg-white hover:bg-amber-50/50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-amber-950/30 transition-all space-y-0.5"
                  >
                    <span className="font-mono font-bold text-[11px] text-zinc-900 dark:text-zinc-100 block">
                      {trap}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block leading-tight line-clamp-1">
                      {CAT_TRAP_TAXONOMY[trap]?.shortDescription}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPendingEliminationOption(null)}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
