"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
  Target,
  BarChart3,
  Award,
  BookOpen,
  Eye,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRc } from "@/context/rc-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { initialMockTests } from "@/data/mock-tests";
import { initialRcPassages } from "@/data/rc-passages";
import {
  initialParaSummaryQuestions,
  initialParaJumbleQuestions,
  initialOddSentenceOutQuestions,
} from "@/data/va-questions";
import { VARCMockConfig, MockQuestionState, VARCMockResult } from "@/types";
import { syncPracticeSessionCloud } from "@/lib/supabase/data-service";

interface FlatMockQuestion {
  questionNumber: number;
  section: "rc" | "va";
  rcPassageId?: string;
  rcPassageTitle?: string;
  rcPassageContent?: string;
  vaType?: string;
  questionId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number | string | string[];
  explanation: string;
  difficulty: string;
  topic: string;
}

export default function VARCMocksPage() {
  const { user } = useAuth();
  const { setActiveSession } = useRc();

  const [activeMock, setActiveMock] = useState<VARCMockConfig | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [flatQuestions, setFlatQuestions] = useState<FlatMockQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Synchronize Active Session Guard with Global Layout (Sidebar/Mobile Nav)
  useEffect(() => {
    if (isTestActive && activeMock) {
      setActiveSession({
        isActive: true,
        title: activeMock.title,
        type: "mock",
        onSaveAndExit: () => {
          handleFinalSubmit();
        },
        onDiscardAndExit: () => {
          setIsTestActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
          setActiveMock(null);
        },
      });
    } else {
      setActiveSession(null);
    }

    return () => {
      setActiveSession(null);
    };
  }, [isTestActive, activeMock, setActiveSession]);

  // Per-question state array
  const [questionStates, setQuestionStates] = useState<Record<number, MockQuestionState>>({});

  // Mock Section Timer
  const [remainingSeconds, setRemainingSeconds] = useState(40 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Result state
  const [mockResult, setMockResult] = useState<VARCMockResult | null>(null);

  // Build flat questions list when activeMock is selected
  const handleStartMock = (mockConfig: VARCMockConfig) => {
    setActiveMock(mockConfig);
    const questions: FlatMockQuestion[] = [];
    let qNum = 1;

    // 1. Add RC Questions
    mockConfig.rcPassageIds.forEach((rcId) => {
      const passage = initialRcPassages.find((p) => p.id === rcId);
      if (passage && passage.questions) {
        passage.questions.forEach((q) => {
          questions.push({
            questionNumber: qNum++,
            section: "rc",
            rcPassageId: passage.id,
            rcPassageTitle: passage.title,
            rcPassageContent: passage.content,
            questionId: q.id,
            questionText: q.questionText,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
            difficulty: passage.difficulty,
            topic: (passage.topic || passage.genre || "Philosophy") as string,
          });
        });
      }
    });

    // 2. Add VA Questions
    mockConfig.vaQuestionIds.forEach((vaId) => {
      const ps = initialParaSummaryQuestions.find((q) => q.id === vaId);
      if (ps) {
        questions.push({
          questionNumber: qNum++,
          section: "va",
          vaType: "Para Summary",
          questionId: ps.id,
          questionText: `Choose the best summary:\n\n${ps.paragraph}`,
          options: ps.options,
          correctOptionIndex: ps.correctOptionIndex,
          explanation: ps.explanation,
          difficulty: ps.difficulty,
          topic: ps.topic,
        });
      }
      const pj = initialParaJumbleQuestions.find((q) => q.id === vaId);
      if (pj) {
        questions.push({
          questionNumber: qNum++,
          section: "va",
          vaType: "Para Jumbles",
          questionId: pj.id,
          questionText: `Arrange into a coherent paragraph:\n\n${pj.sentences.map((s) => `[${s.id}] ${s.text}`).join("\n")}`,
          options: [
            pj.correctOrder.join(""),
            pj.sentences.map((s) => s.id).reverse().join(""),
            pj.correctOrder.slice(1).concat(pj.correctOrder[0]).join(""),
            pj.correctOrder.slice(2).concat(pj.correctOrder.slice(0, 2)).join(""),
          ],
          correctOptionIndex: 0,
          explanation: pj.explanation,
          difficulty: pj.difficulty,
          topic: pj.topic,
        });
      }
      const oso = initialOddSentenceOutQuestions.find((q) => q.id === vaId);
      if (oso) {
        questions.push({
          questionNumber: qNum++,
          section: "va",
          vaType: "Odd Sentence Out",
          questionId: oso.id,
          questionText: "Identify the sentence that does NOT belong to the paragraph:",
          options: oso.sentences.map((s) => `[${s.id}] ${s.text}`),
          correctOptionIndex: Number(oso.correctOddSentenceId) - 1,
          explanation: oso.explanation,
          difficulty: oso.difficulty,
          topic: oso.topic,
        });
      }
    });

    setFlatQuestions(questions);

    // Initialize initial question states
    const initialStates: Record<number, MockQuestionState> = {};
    questions.forEach((q, idx) => {
      initialStates[idx] = {
        questionId: q.questionId,
        section: q.section,
        rcPassageId: q.rcPassageId,
        questionNumber: q.questionNumber,
        status: idx === 0 ? "unanswered" : "unvisited",
        selectedOption: null,
        timeSpentSeconds: 0,
      };
    });
    setQuestionStates(initialStates);

    setRemainingSeconds(mockConfig.durationMinutes * 60);
    setCurrentQIndex(0);
    setIsTestActive(true);
    setMockResult(null);
  };

  // Section Countdown Timer Tick
  useEffect(() => {
    if (isTestActive) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });

        // Accumulate time spent on current question
        setQuestionStates((prev) => {
          const curr = prev[currentQIndex];
          if (!curr) return prev;
          return {
            ...prev,
            [currentQIndex]: {
              ...curr,
              timeSpentSeconds: curr.timeSpentSeconds + 1,
            },
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive, currentQIndex]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(Math.max(totalSecs, 0) / 60);
    const secs = Math.max(totalSecs, 0) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle Option Select
  const handleSelectOption = (optIndex: number) => {
    setQuestionStates((prev) => {
      const curr = prev[currentQIndex];
      const isMarked = curr.status === "marked_review" || curr.status === "answered_marked_review";
      return {
        ...prev,
        [currentQIndex]: {
          ...curr,
          selectedOption: optIndex,
          status: isMarked ? "answered_marked_review" : "answered",
        },
      };
    });
  };

  // Clear Response
  const handleClearResponse = () => {
    setQuestionStates((prev) => {
      const curr = prev[currentQIndex];
      const isMarked = curr.status === "answered_marked_review" || curr.status === "marked_review";
      return {
        ...prev,
        [currentQIndex]: {
          ...curr,
          selectedOption: null,
          status: isMarked ? "marked_review" : "unanswered",
        },
      };
    });
  };

  // Toggle Mark for Review
  const handleToggleMarkForReview = () => {
    setQuestionStates((prev) => {
      const curr = prev[currentQIndex];
      const hasAnswer = curr.selectedOption !== null;
      let newStatus: MockQuestionState["status"] = "unanswered";

      if (curr.status === "marked_review") {
        newStatus = "unanswered";
      } else if (curr.status === "answered_marked_review") {
        newStatus = "answered";
      } else if (hasAnswer) {
        newStatus = "answered_marked_review";
      } else {
        newStatus = "marked_review";
      }

      return {
        ...prev,
        [currentQIndex]: {
          ...curr,
          status: newStatus,
        },
      };
    });
  };

  // Jump to Question
  const handleJumpToQuestion = (targetIdx: number) => {
    setQuestionStates((prev) => {
      const targetState = prev[targetIdx];
      if (targetState.status === "unvisited") {
        return {
          ...prev,
          [targetIdx]: { ...targetState, status: "unanswered" },
        };
      }
      return prev;
    });
    setCurrentQIndex(targetIdx);
  };

  // Submit Mock Test & Compute Results
  const handleFinalSubmit = () => {
    setIsTestActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalScore = 0;

    let rcAttempted = 0;
    let rcCorrect = 0;
    let rcTotal = 0;
    let rcTime = 0;

    let vaAttempted = 0;
    let vaCorrect = 0;
    let vaTotal = 0;
    let vaTime = 0;

    const questionResponses = flatQuestions.map((q, idx) => {
      const st = questionStates[idx];
      const isAttempted = st?.selectedOption !== null && st?.selectedOption !== undefined;
      const isCorrect = isAttempted && st.selectedOption === q.correctOptionIndex;

      if (q.section === "rc") {
        rcTotal++;
        rcTime += st.timeSpentSeconds;
        if (isAttempted) {
          rcAttempted++;
          if (isCorrect) rcCorrect++;
        }
      } else {
        vaTotal++;
        vaTime += st.timeSpentSeconds;
        if (isAttempted) {
          vaAttempted++;
          if (isCorrect) vaCorrect++;
        }
      }

      if (isAttempted) {
        totalAttempted++;
        if (isCorrect) {
          totalCorrect++;
          totalScore += 3; // Standard CAT marking scheme
        } else {
          totalIncorrect++;
          totalScore -= 1; // Standard -1 negative marking
        }
      }

      return {
        questionNumber: q.questionNumber,
        questionId: q.questionId,
        section: q.section,
        questionType: q.vaType || "RC Question",
        userAnswer: isAttempted ? q.options[st.selectedOption as number] : "Unattempted",
        correctAnswer: q.options[q.correctOptionIndex as number],
        isCorrect,
        isAttempted,
        explanation: q.explanation,
        timeSpentSeconds: st.timeSpentSeconds,
      };
    });

    const unattempted = flatQuestions.length - totalAttempted;
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const totalDurationSeconds = (activeMock?.durationMinutes || 40) * 60 - remainingSeconds;

    const result: VARCMockResult = {
      mockSessionId: `mock-session-${Date.now()}`,
      mockId: activeMock?.id || "mock-01",
      mockTitle: activeMock?.title || "CAT Mock",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      totalDurationSeconds,
      totalDurationFormatted: formatTimer(totalDurationSeconds),
      totalQuestions: flatQuestions.length,
      attempted: totalAttempted,
      correct: totalCorrect,
      incorrect: totalIncorrect,
      unattempted,
      score: totalScore,
      accuracy,
      rcScore: {
        attempted: rcAttempted,
        correct: rcCorrect,
        total: rcTotal,
        accuracy: rcAttempted > 0 ? Math.round((rcCorrect / rcAttempted) * 100) : 0,
        timeSpentSeconds: rcTime,
      },
      vaScore: {
        attempted: vaAttempted,
        correct: vaCorrect,
        total: vaTotal,
        accuracy: vaAttempted > 0 ? Math.round((vaCorrect / vaAttempted) * 100) : 0,
        timeSpentSeconds: vaTime,
      },
      questionResponses,
    };

    setMockResult(result);

    // Sync to Supabase cloud if user is logged in
    if (user?.id) {
      const cloudSession: any = {
        sessionId: result.mockSessionId,
        passageId: result.mockId,
        passageTitle: result.mockTitle,
        passageTopic: "Full CAT VARC Section",
        passageSource: "VerbalOS",
        passageDifficulty: activeMock?.difficulty || "CAT",
        author: "VerbalOS",
        wordCount: 1600,
        readingTimeSeconds: rcTime,
        readingTimeFormatted: formatTimer(rcTime),
        readingWpm: 280,
        questionStartTime: result.startedAt,
        questionEndTime: result.completedAt,
        questionSolvingDurationSeconds: vaTime,
        questionSolvingDurationFormatted: formatTimer(vaTime),
        totalDurationSeconds,
        totalDurationFormatted: formatTimer(totalDurationSeconds),
        selectedAnswers: {},
        score: {
          correct: totalCorrect,
          total: flatQuestions.length,
          accuracy,
        },
        questionBreakdown: questionResponses.map((qr) => ({
          questionId: qr.questionId,
          questionText: qr.questionType,
          type: "Main Idea" as any,
          options: [],
          selectedOptionIndex: qr.isAttempted ? 0 : null,
          correctOptionIndex: 0,
          isCorrect: qr.isCorrect,
          explanation: qr.explanation,
        })),
        timestamp: new Date().toISOString(),
      };
      syncPracticeSessionCloud(cloudSession, user.id);
    }
  };

  // Current Question Object
  const currQ = flatQuestions[currentQIndex];
  const currState = questionStates[currentQIndex] || {
    selectedOption: null,
    status: "unanswered",
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      {!isTestActive && !mockResult && (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Exam Simulation
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">Timed 40-Minute Section Drills</span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            VARC Section Mocks
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Full-length sectional mock tests under continuous CAT exam timing with mixed RC and Verbal Ability questions.
          </p>
        </div>
      )}

      {/* 1. MOCK CATALOG */}
      {!isTestActive && !mockResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialMockTests.map((mock) => (
            <Card
              key={mock.id}
              className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" className="text-[10px] font-mono">
                    {mock.difficulty} Standard
                  </Badge>
                  <span className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {mock.durationMinutes} mins
                  </span>
                </div>
                <CardTitle className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                  {mock.title}
                </CardTitle>
                <CardDescription className="text-xs">{mock.subtitle}</CardDescription>
              </CardHeader>

              <CardContent className="pt-2 space-y-4">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Questions:</span>
                    <strong className="text-zinc-800 dark:text-zinc-200">{mock.totalQuestions} Questions</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">RC Distribution:</span>
                    <strong className="text-zinc-800 dark:text-zinc-200">{mock.rcPassageIds.length} Passages (10 Qs)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">VA Distribution:</span>
                    <strong className="text-zinc-800 dark:text-zinc-200">{mock.vaQuestionIds.length} VA Qs (PS/PJ/OSO)</strong>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartMock(mock)}
                  className="w-full text-xs font-semibold gap-1.5 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Start Section Mock</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 2. ACTIVE MOCK TEST WORKSPACE */}
      {isTestActive && currQ && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          {/* Sticky Prominent Section Timer Bar */}
          <div className="sticky top-0 z-40 -mx-4 md:-mx-8 -mt-6 md:-mt-8 px-4 md:px-8 py-3 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 dark:bg-zinc-950/95 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 truncate">
              <button
                onClick={() => setShowExitModal(true)}
                title="Exit Sectional Mock"
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-mono px-2.5 py-1 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Exit Mock</span>
              </button>
              <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                {activeMock?.title}
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono hidden sm:inline-flex uppercase">
                {currQ.section.toUpperCase()} SECTION
              </Badge>
            </div>

            {/* Continuous Countdown Timer */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-1.5 rounded-full px-4 py-1 font-mono font-bold text-xs shadow-sm ring-1 ${
                  remainingSeconds < 300
                    ? "bg-rose-900 text-rose-100 ring-rose-800 animate-pulse"
                    : "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 ring-zinc-800/10"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">Remaining</span>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleFinalSubmit}
              size="sm"
              className="h-8 text-xs font-semibold px-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              Submit Mock
            </Button>
          </div>

          {/* Test Main Grid (Left Question/Passage + Right Palette) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
            {/* Left 3 Columns: Active Question / Passage Display */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase">
                      Question {currQ.questionNumber} of {flatQuestions.length} ({currQ.section.toUpperCase()})
                    </span>
                    <CardTitle className="text-sm font-serif">
                      {currQ.section === "rc" ? currQ.rcPassageTitle : currQ.vaType}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" className="text-[10px] font-mono">
                      +3 / -1 Mark
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-5 space-y-6">
                  {/* If RC: Show scrollable Passage box */}
                  {currQ.section === "rc" && currQ.rcPassageContent && (
                    <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 max-h-60 overflow-y-auto text-xs sm:text-sm font-serif leading-relaxed text-zinc-800 dark:text-zinc-200">
                      <h4 className="font-bold font-serif mb-2 text-zinc-900 dark:text-zinc-100">
                        {currQ.rcPassageTitle}
                      </h4>
                      <p className="whitespace-pre-line">{currQ.rcPassageContent}</p>
                    </div>
                  )}

                  {/* Question Stem */}
                  <div className="text-sm sm:text-base font-serif font-semibold text-zinc-900 dark:text-zinc-50 leading-relaxed whitespace-pre-line">
                    {currQ.questionText}
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {currQ.options.map((opt, optIdx) => {
                      const isSelected = currState.selectedOption === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 text-xs sm:text-sm ${
                            isSelected
                              ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800/90 ring-1 ring-zinc-900 dark:ring-zinc-100"
                              : "border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-300"
                          }`}
                        >
                          <span className="h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed text-zinc-800 dark:text-zinc-200">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleMarkForReview}
                        className={`text-xs h-8 gap-1.5 ${
                          currState.status.includes("marked") ? "bg-amber-50 text-amber-900 border-amber-300" : ""
                        }`}
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>{currState.status.includes("marked") ? "Unmark Review" : "Mark for Review"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearResponse}
                        disabled={currState.selectedOption === null}
                        className="text-xs h-8 text-zinc-500"
                      >
                        Clear Response
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentQIndex === 0}
                        onClick={() => handleJumpToQuestion(currentQIndex - 1)}
                        className="text-xs h-8 gap-1"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Previous
                      </Button>
                      <Button
                        size="sm"
                        disabled={currentQIndex === flatQuestions.length - 1}
                        onClick={() => handleJumpToQuestion(currentQIndex + 1)}
                        className="text-xs h-8 gap-1"
                      >
                        Next <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Question Palette */}
            <div className="space-y-4">
              <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <CardTitle className="text-xs font-mono uppercase text-zinc-400">Question Palette</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Question Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {flatQuestions.map((q, idx) => {
                      const st = questionStates[idx] || { status: "unvisited" };
                      const isCurrent = idx === currentQIndex;

                      let badgeColor = "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"; // unvisited/unanswered
                      if (st.status === "answered") {
                        badgeColor = "bg-emerald-600 text-white";
                      } else if (st.status === "marked_review") {
                        badgeColor = "bg-amber-500 text-white";
                      } else if (st.status === "answered_marked_review") {
                        badgeColor = "bg-purple-600 text-white";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleJumpToQuestion(idx)}
                          className={`h-9 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all ${badgeColor} ${
                            isCurrent ? "ring-2 ring-zinc-950 dark:ring-zinc-50 scale-105" : ""
                          }`}
                        >
                          {q.questionNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Palette Legend */}
                  <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] font-mono text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-emerald-600"></span> Answered
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-zinc-200 dark:bg-zinc-700"></span> Unanswered
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-amber-500"></span> Marked for Review
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-purple-600"></span> Answered & Marked
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOCK RESULTS & DIAGNOSTIC REPORT */}
      {mockResult && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-zinc-400">Scorecard</span>
              <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                {mockResult.mockTitle} — Performance Report
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMockResult(null);
                setIsTestActive(false);
              }}
              className="text-xs gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Back to Mocks
            </Button>
          </div>

          {/* Primary Scorecard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
              <span className="text-[11px] font-mono text-zinc-400 uppercase block">Scaled Score</span>
              <strong className="text-2xl sm:text-3xl font-serif text-zinc-900 dark:text-zinc-100 font-bold block pt-1">
                {mockResult.score}
              </strong>
              <span className="text-[10px] text-zinc-400 font-mono">(+3 / -1 scheme)</span>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
              <span className="text-[11px] font-mono text-zinc-400 uppercase block">Accuracy</span>
              <strong className="text-2xl sm:text-3xl font-serif text-emerald-600 dark:text-emerald-400 font-bold block pt-1">
                {mockResult.accuracy}%
              </strong>
              <span className="text-[10px] text-zinc-400 font-mono">{mockResult.correct} of {mockResult.attempted} Attempted</span>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
              <span className="text-[11px] font-mono text-zinc-400 uppercase block">Attempt Rate</span>
              <strong className="text-2xl sm:text-3xl font-serif text-zinc-900 dark:text-zinc-100 font-bold block pt-1">
                {Math.round((mockResult.attempted / mockResult.totalQuestions) * 100)}%
              </strong>
              <span className="text-[10px] text-zinc-400 font-mono">{mockResult.attempted} / {mockResult.totalQuestions} Qs</span>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
              <span className="text-[11px] font-mono text-zinc-400 uppercase block">Time Spent</span>
              <strong className="text-2xl sm:text-3xl font-mono text-zinc-900 dark:text-zinc-100 font-bold block pt-1">
                {mockResult.totalDurationFormatted}
              </strong>
              <span className="text-[10px] text-zinc-400 font-mono">Secular Section Pace</span>
            </Card>
          </div>

          {/* Sectional Comparison: RC vs VA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <span className="text-xs font-bold font-serif text-zinc-900 dark:text-zinc-100 block">
                RC Section Performance:
              </span>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Attempted / Total:</span>
                <span>{mockResult.rcScore.attempted} / {mockResult.rcScore.total}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">RC Accuracy:</span>
                <strong className="text-emerald-600">{mockResult.rcScore.accuracy}% ({mockResult.rcScore.correct} correct)</strong>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Time Spent:</span>
                <span>{formatTimer(mockResult.rcScore.timeSpentSeconds)}</span>
              </div>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <span className="text-xs font-bold font-serif text-zinc-900 dark:text-zinc-100 block">
                Verbal Ability Performance:
              </span>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Attempted / Total:</span>
                <span>{mockResult.vaScore.attempted} / {mockResult.vaScore.total}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">VA Accuracy:</span>
                <strong className="text-emerald-600">{mockResult.vaScore.accuracy}% ({mockResult.vaScore.correct} correct)</strong>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Time Spent:</span>
                <span>{formatTimer(mockResult.vaScore.timeSpentSeconds)}</span>
              </div>
            </Card>
          </div>

          {/* Question-by-Question Detailed Review */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-base font-serif">Comprehensive Question Review</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
              {mockResult.questionResponses.map((qr) => (
                <div key={qr.questionNumber} className="py-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-400">Q{qr.questionNumber}</span>
                      <Badge variant="secondary" className="text-[10px] font-mono">{qr.questionType}</Badge>
                    </div>
                    {qr.isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold font-mono text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Correct (+3)
                      </span>
                    ) : qr.isAttempted ? (
                      <span className="flex items-center gap-1 text-rose-600 font-semibold font-mono text-[11px]">
                        <XCircle className="h-3.5 w-3.5" /> Incorrect (-1)
                      </span>
                    ) : (
                      <span className="text-zinc-400 font-mono text-[11px]">Unattempted (0)</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800">
                      <span className="text-zinc-400 block font-mono">Your Answer:</span>
                      <span className={qr.isCorrect ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-rose-700 dark:text-rose-300 font-semibold"}>
                        {qr.userAnswer}
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800">
                      <span className="text-zinc-400 block font-mono">Correct Answer:</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{qr.correctAnswer}</span>
                    </div>
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-1">
                    {qr.explanation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Exit Mock Exam Confirmation Modal */}
      {showExitModal && (
        <Modal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
          title="Exit 40-Minute Sectional Mock?"
          maxWidth="md"
        >
          <div className="space-y-4 pt-1">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-4 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold font-serif text-sm text-amber-800 dark:text-amber-300">
                <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Exam Clock Running ({formatTimer(remainingSeconds)} Remaining)</span>
              </div>
              <p className="leading-relaxed font-sans text-xs">
                You are currently taking <strong>{activeMock?.title}</strong>.
                Would you like to submit your answers recorded so far, discard this exam attempt, or continue the test?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowExitModal(false)}
                className="text-xs order-3 sm:order-1"
              >
                Continue Exam
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowExitModal(false);
                  setIsTestActive(false);
                  if (timerRef.current) clearInterval(timerRef.current);
                  setActiveMock(null);
                }}
                className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 order-2"
              >
                Discard &amp; Exit
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setShowExitModal(false);
                  handleFinalSubmit();
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm order-1 sm:order-3"
              >
                Submit &amp; Finish Mock
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
