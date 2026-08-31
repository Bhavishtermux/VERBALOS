"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Layers,
  HelpCircle,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Award,
  BookOpen,
  TrendingUp,
  AlertCircle,
  MoveUp,
  MoveDown,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRc } from "@/context/rc-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  initialParaSummaryQuestions,
  initialParaJumbleQuestions,
  initialOddSentenceOutQuestions,
} from "@/data/va-questions";
import {
  VAType,
  ParaSummaryQuestion,
  ParaJumbleQuestion,
  OddSentenceOutQuestion,
  VAQuestion,
} from "@/types";
import { syncPracticeSessionCloud } from "@/lib/supabase/data-service";

export default function VerbalAbilityPage() {
  const { user } = useAuth();
  const { registerActiveSession, unregisterActiveSession } = useRc();

  // Active Drill State
  const [selectedType, setSelectedType] = useState<VAType>("para-summary");
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const [drillStage, setDrillStage] = useState<"catalog" | "practice" | "review">("catalog");

  // Register Navigation Guard when solving active drill
  useEffect(() => {
    if (drillStage === "practice") {
      registerActiveSession({
        title: "Exit Verbal Ability Drill?",
        message: "You are currently solving a timed Verbal Ability question. Navigating away will discard your unsaved progress.",
      });
    } else {
      unregisterActiveSession();
    }

    return () => {
      unregisterActiveSession();
    };
  }, [drillStage, registerActiveSession, unregisterActiveSession]);

  // Timer State
  const [solvingSeconds, setSolvingSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // User Interaction State per question type
  const [selectedSummaryOption, setSelectedSummaryOption] = useState<number | null>(null);
  const [currentJumbleOrder, setCurrentJumbleOrder] = useState<string[]>([]);
  const [selectedOddSentenceId, setSelectedOddSentenceId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Historical Session Accuracy (cached locally)
  const [vaStats, setVaStats] = useState({
    summaryAccuracy: 75,
    summaryAttempts: 8,
    jumbleAccuracy: 60,
    jumbleAttempts: 6,
    oddAccuracy: 80,
    oddAttempts: 5,
    avgTimeSeconds: 110,
  });

  // Active Questions set based on selectedType
  const currentQuestions: VAQuestion[] =
    selectedType === "para-summary"
      ? initialParaSummaryQuestions
      : selectedType === "para-jumbles"
      ? initialParaJumbleQuestions
      : initialOddSentenceOutQuestions;

  const currentQ = currentQuestions[activeDrillIndex] || currentQuestions[0];

  // Initialize Para Jumble initial shuffled order when question changes
  useEffect(() => {
    if (selectedType === "para-jumbles" && currentQ.type === "para-jumbles") {
      const q = currentQ as ParaJumbleQuestion;
      setCurrentJumbleOrder(q.sentences.map((s) => s.id));
    }
    setSelectedSummaryOption(null);
    setSelectedOddSentenceId(null);
    setHasSubmitted(false);
  }, [selectedType, activeDrillIndex, currentQ]);

  // Timer Tick
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setSolvingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Launch Drill
  const handleStartDrill = (type: VAType, index = 0) => {
    setSelectedType(type);
    setActiveDrillIndex(index);
    setSolvingSeconds(0);
    setIsTimerActive(true);
    setDrillStage("practice");
    setHasSubmitted(false);
  };

  // Handle Para Jumble Reordering
  const handleMoveSentence = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentJumbleOrder.length || hasSubmitted) return;
    const updated = [...currentJumbleOrder];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCurrentJumbleOrder(updated);
  };

  // Handle Question Submission
  const handleSubmitQuestion = () => {
    setIsTimerActive(false);
    setHasSubmitted(true);

    // Check correctness
    let isCorrect = false;
    if (currentQ.type === "para-summary") {
      isCorrect = selectedSummaryOption === (currentQ as ParaSummaryQuestion).correctOptionIndex;
    } else if (currentQ.type === "para-jumbles") {
      const q = currentQ as ParaJumbleQuestion;
      isCorrect = currentJumbleOrder.join("") === q.correctOrder.join("");
    } else if (currentQ.type === "odd-sentence-out") {
      isCorrect = selectedOddSentenceId === (currentQ as OddSentenceOutQuestion).correctOddSentenceId;
    }

    // Sync drill session record to Supabase if authenticated
    if (user?.id) {
      const sessionRecord: any = {
        sessionId: `va-${selectedType}-${Date.now()}`,
        passageId: currentQ.id,
        passageTitle: `${selectedType.toUpperCase()}: ${currentQ.topic}`,
        passageTopic: currentQ.topic,
        passageSource: "VerbalOS Official",
        passageDifficulty: currentQ.difficulty,
        author: "VerbalOS",
        wordCount: 150,
        readingTimeSeconds: 0,
        readingTimeFormatted: "00:00",
        readingWpm: 0,
        questionStartTime: new Date().toISOString(),
        questionEndTime: new Date().toISOString(),
        questionSolvingDurationSeconds: solvingSeconds,
        questionSolvingDurationFormatted: formatTimer(solvingSeconds),
        totalDurationSeconds: solvingSeconds,
        totalDurationFormatted: formatTimer(solvingSeconds),
        selectedAnswers: { 0: selectedSummaryOption ?? 0 },
        score: {
          correct: isCorrect ? 1 : 0,
          total: 1,
          accuracy: isCorrect ? 100 : 0,
        },
        questionBreakdown: [
          {
            questionId: currentQ.id,
            questionText: currentQ.topic,
            type: selectedType,
            options: [],
            selectedOptionIndex: 0,
            correctOptionIndex: 0,
            isCorrect,
            explanation: currentQ.explanation,
          },
        ],
        timestamp: new Date().toISOString(),
      };
      syncPracticeSessionCloud(sessionRecord, user.id);
    }
  };

  // Next Question in Set
  const handleNextQuestion = () => {
    if (activeDrillIndex < currentQuestions.length - 1) {
      setActiveDrillIndex(activeDrillIndex + 1);
      setSolvingSeconds(0);
      setIsTimerActive(true);
      setHasSubmitted(false);
    } else {
      setDrillStage("catalog");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Verbal Ability
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 font-mono">Para Summary, Para Jumbles & Odd Sentence</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
          Verbal Ability Practice
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Master non-RC CAT questions with targeted drills, structural link diagnosis, and trap analysis.
        </p>
      </div>

      {/* VA Mastery Breakdown Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Para Summary */}
        <Card
          onClick={() => handleStartDrill("para-summary", 0)}
          className="cursor-pointer bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Para Summary
              </h3>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {initialParaSummaryQuestions.length} Drills
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Identify central arguments and avoid distortion, scope, and broad/narrow traps.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-400">
            <span>Accuracy: <strong className="text-zinc-800 dark:text-zinc-200">{vaStats.summaryAccuracy}%</strong></span>
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-sans font-semibold">
              Practice <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Card>

        {/* Para Jumbles */}
        <Card
          onClick={() => handleStartDrill("para-jumbles", 0)}
          className="cursor-pointer bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Para Jumbles
              </h3>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {initialParaJumbleQuestions.length} Drills
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Reorder scrambled sentences using openers, mandatory pairs, and discourse links.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-400">
            <span>Accuracy: <strong className="text-zinc-800 dark:text-zinc-200">{vaStats.jumbleAccuracy}%</strong></span>
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-sans font-semibold">
              Practice <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Card>

        {/* Odd Sentence Out */}
        <Card
          onClick={() => handleStartDrill("odd-sentence-out", 0)}
          className="cursor-pointer bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Odd Sentence Out
              </h3>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {initialOddSentenceOutQuestions.length} Drills
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Extract thematic continuity and detect sentences that break coherent paragraph flow.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-400">
            <span>Accuracy: <strong className="text-zinc-800 dark:text-zinc-200">{vaStats.oddAccuracy}%</strong></span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
              Practice <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Card>
      </div>

      {/* ACTIVE DRILL WORKSPACE */}
      {drillStage === "practice" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Top Drill Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrillStage("catalog")}
                className="h-7 text-xs gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to VA Hub
              </Button>
              <Badge variant="neutral" className="text-[10px] font-mono uppercase">
                {selectedType.replace("-", " ")}
              </Badge>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-serif">
                Question {activeDrillIndex + 1} of {currentQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1 font-mono font-bold text-xs">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTimer(solvingSeconds)}</span>
              </div>
            </div>
          </div>

          {/* QUESTION TYPE 1: PARA SUMMARY */}
          {selectedType === "para-summary" && (
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Topic: <strong>{currentQ.topic}</strong> • Difficulty: <strong>{currentQ.difficulty}</strong>
                  </span>
                </div>
                <CardTitle className="text-base font-serif pt-1">
                  Choose the option that best summarizes the paragraph:
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Paragraph Text */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-serif">
                  {(currentQ as ParaSummaryQuestion).paragraph}
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {(currentQ as ParaSummaryQuestion).options.map((opt, idx) => {
                    const isSelected = selectedSummaryOption === idx;
                    const isCorrect = idx === (currentQ as ParaSummaryQuestion).correctOptionIndex;
                    let optionStyle = "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900";

                    if (hasSubmitted) {
                      if (isCorrect) {
                        optionStyle = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasSubmitted}
                        onClick={() => setSelectedSummaryOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 text-xs sm:text-sm ${optionStyle}`}
                      >
                        <span className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Actions & Submit */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  {!hasSubmitted ? (
                    <Button
                      onClick={handleSubmitQuestion}
                      disabled={selectedSummaryOption === null}
                      className="text-xs font-semibold px-5 h-9 ml-auto"
                    >
                      Submit Summary
                    </Button>
                  ) : (
                    <div className="w-full space-y-4">
                      {/* Detailed Trap Diagnosis */}
                      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <h4 className="font-bold font-serif text-sm text-zinc-900 dark:text-zinc-50">
                            Summary & Option Trap Analysis:
                          </h4>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                          {currentQ.explanation}
                        </p>
                        <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                          {(currentQ as ParaSummaryQuestion).trapAnalysis.map((trap, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px]">
                              <Badge
                                variant="secondary"
                                className={`text-[9px] font-mono shrink-0 ${
                                  trap.trapType === "Correct Summary"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                }`}
                              >
                                Option {String.fromCharCode(65 + trap.optionIndex)}: {trap.trapType}
                              </Badge>
                              <span className="text-zinc-600 dark:text-zinc-400">{trap.explanation}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button onClick={handleNextQuestion} className="text-xs font-semibold gap-1.5 h-9">
                          <span>{activeDrillIndex < currentQuestions.length - 1 ? "Next Drill" : "Finish Practice"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* QUESTION TYPE 2: PARA JUMBLES */}
          {selectedType === "para-jumbles" && (
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Topic: <strong>{currentQ.topic}</strong> • Difficulty: <strong>{currentQ.difficulty}</strong>
                  </span>
                </div>
                <CardTitle className="text-base font-serif pt-1">
                  Arrange the sentences into a coherent logical paragraph:
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                <p className="text-xs text-zinc-500 font-mono">
                  Use the Up/Down arrows to reorder sentences into the correct logical sequence:
                </p>

                {/* Draggable/Orderable Sentence Blocks */}
                <div className="space-y-3">
                  {currentJumbleOrder.map((sentenceId, idx) => {
                    const q = currentQ as ParaJumbleQuestion;
                    const sentence = q.sentences.find((s) => s.id === sentenceId)!;
                    const isCorrectPosition = hasSubmitted && q.correctOrder[idx] === sentenceId;

                    return (
                      <div
                        key={sentenceId}
                        className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 text-xs sm:text-sm ${
                          hasSubmitted
                            ? isCorrectPosition
                              ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                              : "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20"
                            : "border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-800"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <span className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                            {sentenceId}
                          </span>
                          <span className="leading-relaxed text-zinc-800 dark:text-zinc-200 font-serif">
                            {sentence.text}
                          </span>
                        </div>

                        {!hasSubmitted && (
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => handleMoveSentence(idx, idx - 1)}
                              disabled={idx === 0}
                              className="p-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-30"
                            >
                              <MoveUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleMoveSentence(idx, idx + 1)}
                              disabled={idx === currentJumbleOrder.length - 1}
                              className="p-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-30"
                            >
                              <MoveDown className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Current Sequence Indicator */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs font-mono">
                  <span>Current Order: <strong>{currentJumbleOrder.join(" → ")}</strong></span>
                  {hasSubmitted && (
                    <span>Correct Order: <strong className="text-emerald-600 dark:text-emerald-400">{(currentQ as ParaJumbleQuestion).correctOrder.join(" → ")}</strong></span>
                  )}
                </div>

                {/* Actions & Submit */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  {!hasSubmitted ? (
                    <Button onClick={handleSubmitQuestion} className="text-xs font-semibold px-5 h-9 ml-auto">
                      Submit Sequence
                    </Button>
                  ) : (
                    <div className="w-full space-y-4">
                      {/* Sequence Breakdown & Structural Links */}
                      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <h4 className="font-bold font-serif text-sm text-zinc-900 dark:text-zinc-50">
                            Logical Structure & Link Explanation:
                          </h4>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                          {currentQ.explanation}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px]">
                          <div>
                            <span className="font-mono text-zinc-400 block font-semibold">Opener Sentence:</span>
                            <span className="text-zinc-700 dark:text-zinc-300">{(currentQ as ParaJumbleQuestion).structureAnalysis.opener}</span>
                          </div>
                          <div>
                            <span className="font-mono text-zinc-400 block font-semibold">Mandatory Pairs:</span>
                            <span className="text-zinc-700 dark:text-zinc-300">{(currentQ as ParaJumbleQuestion).structureAnalysis.mandatoryPairs.join(", ")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button onClick={handleNextQuestion} className="text-xs font-semibold gap-1.5 h-9">
                          <span>{activeDrillIndex < currentQuestions.length - 1 ? "Next Drill" : "Finish Practice"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* QUESTION TYPE 3: ODD SENTENCE OUT */}
          {selectedType === "odd-sentence-out" && (
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Topic: <strong>{currentQ.topic}</strong> • Difficulty: <strong>{currentQ.difficulty}</strong>
                  </span>
                </div>
                <CardTitle className="text-base font-serif pt-1">
                  Identify the sentence that does NOT belong to the coherent paragraph:
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* 5 Sentences to Choose From */}
                <div className="space-y-3">
                  {(currentQ as OddSentenceOutQuestion).sentences.map((sentence) => {
                    const isSelected = selectedOddSentenceId === sentence.id;
                    const isOdd = sentence.id === (currentQ as OddSentenceOutQuestion).correctOddSentenceId;

                    let cardStyle = "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900";
                    if (hasSubmitted) {
                      if (isOdd) {
                        cardStyle = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200";
                      } else if (isSelected && !isOdd) {
                        cardStyle = "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200";
                      }
                    } else if (isSelected) {
                      cardStyle = "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100";
                    }

                    return (
                      <button
                        key={sentence.id}
                        disabled={hasSubmitted}
                        onClick={() => setSelectedOddSentenceId(sentence.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 text-xs sm:text-sm ${cardStyle}`}
                      >
                        <span className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {sentence.id}
                        </span>
                        <span className="leading-relaxed flex-1 font-serif">{sentence.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Actions & Submit */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  {!hasSubmitted ? (
                    <Button
                      onClick={handleSubmitQuestion}
                      disabled={selectedOddSentenceId === null}
                      className="text-xs font-semibold px-5 h-9 ml-auto"
                    >
                      Submit Odd Sentence
                    </Button>
                  ) : (
                    <div className="w-full space-y-4">
                      {/* Flow Explanation */}
                      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <h4 className="font-bold font-serif text-sm text-zinc-900 dark:text-zinc-50">
                            Thematic Flow & Disconnect Analysis:
                          </h4>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                          {currentQ.explanation}
                        </p>
                        <div className="p-3 rounded bg-zinc-100 dark:bg-zinc-900 text-[11px] space-y-1">
                          <span className="font-mono text-zinc-400 font-bold block">Paragraph Theme:</span>
                          <span className="text-zinc-800 dark:text-zinc-200">{(currentQ as OddSentenceOutQuestion).paragraphTheme}</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button onClick={handleNextQuestion} className="text-xs font-semibold gap-1.5 h-9">
                          <span>{activeDrillIndex < currentQuestions.length - 1 ? "Next Drill" : "Finish Practice"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
