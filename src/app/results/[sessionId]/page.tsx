"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Timer,
  Target,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Eye,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
  ChevronRight,
  BookMarked,
  Lightbulb,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  Compass,
} from "lucide-react";
import { RCSessionResult } from "@/types/rc";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  diagnoseQuestionMistake,
  logMistakesToStorage,
  MistakeLogEntry,
  MistakeDiagnosis,
} from "@/lib/diagnostics";

// Helper to map Question Type to Skill Name
function getSkillTestedName(type: string): string {
  switch (type) {
    case "Inference":
      return "Implicit Premise Extraction & Deduction";
    case "Main Idea":
    case "Main Idea / Central Theme":
      return "Overarching Thesis & Argument Synthesis";
    case "Tone":
    case "Tone / Attitude":
    case "Author's Attitude":
      return "Authorial Stance & Rhetorical Nuance";
    case "Detail":
    case "Detail / Fact-based":
      return "Textual Reference Verification & Precision";
    case "Purpose":
    case "Purpose / Organization":
      return "Structural & Paragraph Function Analysis";
    case "Strengthen":
      return "Evidentiary Support & Logical Coherence";
    case "Weaken":
      return "Vulnerability Detection & Counter-argumentation";
    default:
      return "Verbal Logic & Comprehension";
  }
}

export default function RcResultsPage() {
  const params = useParams();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<RCSessionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPassageText, setShowPassageText] = useState<boolean>(false);
  const [mistakesLogged, setMistakesLogged] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionId) return;

    try {
      // 1. Check direct session key in localStorage
      const directData = localStorage.getItem(`rc_lab_session_${sessionId}`);
      if (directData) {
        setSession(JSON.parse(directData));
        setLoading(false);
        return;
      }

      // 2. Fallback search in all sessions array
      const allSessionsRaw = localStorage.getItem("rc_lab_all_sessions");
      if (allSessionsRaw) {
        const allSessions: RCSessionResult[] = JSON.parse(allSessionsRaw);
        const match = allSessions.find((s) => s.sessionId === sessionId);
        if (match) {
          setSession(match);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load session result from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Log mistakes to localStorage for downstream progress analytics
  useEffect(() => {
    if (session && !mistakesLogged) {
      const mistakeEntries: MistakeLogEntry[] = session.questionBreakdown
        .filter((item) => !item.isCorrect && item.selectedOptionIndex !== null)
        .map((item) => {
          const userOptText = item.options[item.selectedOptionIndex!] || "";
          const correctOptText = item.options[item.correctOptionIndex] || "";
          const diag = diagnoseQuestionMistake(
            item.questionText,
            item.type,
            userOptText,
            correctOptText,
            item.selectedOptionIndex!,
            item.correctOptionIndex
          );

          return {
            id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            sessionId: session.sessionId,
            passageId: session.passageId,
            passageTitle: session.passageTitle,
            questionId: item.questionId,
            questionType: item.type,
            mistakeCategory: diag.mistakeCategory,
            userAnswerIndex: item.selectedOptionIndex!,
            correctAnswerIndex: item.correctOptionIndex,
            timestamp: session.timestamp,
          };
        });

      if (mistakeEntries.length > 0) {
        logMistakesToStorage(mistakeEntries);
      }
      setMistakesLogged(true);
    }
  }, [session, mistakesLogged]);

  // Compute Skill Breakdown (e.g. Inference: 1/2, Main Idea: 1/1, Tone: 1/1, Detail: 0/1)
  const skillBreakdown = useMemo(() => {
    if (!session) return [];

    const statsMap: Record<string, { correct: number; total: number }> = {};

    session.questionBreakdown.forEach((q) => {
      // Normalize type name
      let cleanType = q.type;
      if (cleanType === "Main Idea / Central Theme") cleanType = "Main Idea";
      if (cleanType === "Tone / Attitude" || cleanType === "Author's Attitude") cleanType = "Tone";
      if (cleanType === "Detail / Fact-based") cleanType = "Detail";
      if (cleanType === "Purpose / Organization") cleanType = "Purpose";

      if (!statsMap[cleanType]) {
        statsMap[cleanType] = { correct: 0, total: 0 };
      }
      statsMap[cleanType].total += 1;
      if (q.isCorrect) {
        statsMap[cleanType].correct += 1;
      }
    });

    return Object.entries(statsMap).map(([type, score]) => {
      const accuracy = Math.round((score.correct / score.total) * 100);
      return {
        type,
        correct: score.correct,
        total: score.total,
        accuracy,
        status:
          accuracy === 100
            ? "Mastered"
            : accuracy >= 50
            ? "Developing"
            : "Review Needed",
      };
    });
  }, [session]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent mx-auto dark:border-zinc-100" />
        <p className="text-xs text-zinc-500 font-mono">Compiling evaluation analytics...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
          Evaluation Session Not Found
        </h2>
        <p className="text-xs text-zinc-500">
          The requested practice session data could not be retrieved from local storage.
        </p>
        <div className="pt-2">
          <Link href="/library">
            <Button size="sm" variant="outline">
              Return to RC Library
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to RC Library
        </Link>

        <span className="text-[11px] font-mono text-zinc-400">
          Session ID: {session.sessionId.slice(0, 16)}...
        </span>
      </div>

      {/* 1. Large Score & Overview Card */}
      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                {session.passageSource}
              </Badge>
              <Badge variant="neutral" className="text-[10px]">
                {session.passageTopic}
              </Badge>
              <Badge
                variant={
                  session.passageDifficulty === "CAT+"
                    ? "danger"
                    : session.passageDifficulty === "CAT"
                    ? "warning"
                    : "academic"
                }
                className="text-[10px]"
              >
                {session.passageDifficulty}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-snug">
              {session.passageTitle}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              By {session.author} • {session.wordCount} words
            </p>
          </div>

          {/* Large Score Box */}
          <div className="shrink-0 text-center sm:text-right bg-zinc-50 dark:bg-zinc-950/80 p-5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 min-w-[180px]">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
              Session Score
            </span>
            <div className="text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50">
              {session.score.correct} / {session.score.total}
            </div>
            <span
              className={`text-sm font-bold font-mono block mt-1 ${
                session.score.accuracy >= 80
                  ? "text-emerald-600 dark:text-emerald-400"
                  : session.score.accuracy >= 60
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {session.score.accuracy}% Accuracy
            </span>
          </div>
        </div>

        {/* 2. Independent Timing & Speed Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-lg bg-zinc-50/80 p-3.5 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
              Reading Time
            </span>
            <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {session.readingTimeFormatted}
            </span>
          </div>

          <div className="rounded-lg bg-zinc-50/80 p-3.5 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
              Reading WPM
            </span>
            <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {session.readingWpm} WPM
            </span>
          </div>

          <div className="rounded-lg bg-zinc-50/80 p-3.5 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
              Question-Solving Time
            </span>
            <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {session.questionSolvingDurationFormatted}
            </span>
          </div>

          <div className="rounded-lg bg-zinc-50/80 p-3.5 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
              Total Time
            </span>
            <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {session.totalDurationFormatted}
            </span>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPassageText(!showPassageText)}
            className="text-xs gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            {showPassageText ? "Hide Passage Text" : "View Passage Reference"}
          </Button>

          <div className="flex items-center gap-2">
            <Link href={`/practice/${session.passageId}`}>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" /> Retake Drill
              </Button>
            </Link>
            <Link href="/library">
              <Button size="sm" className="text-xs gap-1.5">
                <span>Browse Library</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Collapsible Passage Reference Box */}
      {showPassageText && (
        <Card className="border-zinc-200 dark:border-zinc-800 max-h-[380px] overflow-y-auto">
          <CardHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-serif">{session.passageTitle}</CardTitle>
            <CardDescription className="text-xs">Original Text Reference</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-xs font-serif leading-relaxed text-zinc-800 dark:text-zinc-200 space-y-4">
            <p className="whitespace-pre-line leading-relaxed">
              Passage text reference is available for reviewing the exact paragraph context of each question.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 3. SKILL BREAKDOWN SECTION */}
      <Card className="bg-white dark:bg-zinc-900">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider font-mono">
                Skill Breakdown
              </CardTitle>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Categorized by CAT Question Competency
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {skillBreakdown.map((skill) => (
              <div
                key={skill.type}
                className="rounded-lg border border-zinc-200/80 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-serif">
                    {skill.type}
                  </span>
                  <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300 text-xs">
                    {skill.correct} / {skill.total}
                  </span>
                </div>

                <Progress
                  value={skill.accuracy}
                  max={100}
                  size="sm"
                  indicatorColor={
                    skill.accuracy === 100
                      ? "bg-emerald-500"
                      : skill.accuracy >= 50
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }
                />

                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                  <span>{skill.accuracy}% Accuracy</span>
                  <Badge
                    variant={
                      skill.status === "Mastered"
                        ? "success"
                        : skill.status === "Developing"
                        ? "warning"
                        : "danger"
                    }
                    className="text-[9px] py-0 px-1 font-normal"
                  >
                    {skill.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. DETAILED QUESTION-BY-QUESTION REVIEW */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
            Detailed Question Review & Diagnostics
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            5 Questions Evaluated
          </span>
        </div>

        {session.questionBreakdown.map((item, idx) => {
          const userChoiceText =
            item.selectedOptionIndex !== null ? item.options[item.selectedOptionIndex] : "";
          const correctChoiceText = item.options[item.correctOptionIndex];

          // Compute diagnostic if incorrect
          let diagnosisData: MistakeDiagnosis | null = null;
          if (!item.isCorrect && item.selectedOptionIndex !== null) {
            diagnosisData = diagnoseQuestionMistake(
              item.questionText,
              item.type,
              userChoiceText,
              correctChoiceText,
              item.selectedOptionIndex,
              item.correctOptionIndex
            );
          }

          const skillName = getSkillTestedName(item.type);

          return (
            <Card
              key={item.questionId}
              className={`border transition-all ${
                item.isCorrect
                  ? "border-emerald-200/90 dark:border-emerald-900/40 bg-white dark:bg-zinc-900"
                  : "border-amber-200/90 dark:border-amber-900/40 bg-white dark:bg-zinc-900"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Question {idx + 1}
                    </span>
                    <Badge variant="neutral" className="text-[10px] font-mono">
                      {item.type}
                    </Badge>
                    <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                      • Skill: {skillName}
                    </span>
                  </div>

                  <Badge
                    variant={item.isCorrect ? "success" : "danger"}
                    className="text-[10px] gap-1 font-semibold"
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" /> Incorrect
                      </>
                    )}
                  </Badge>
                </div>

                <CardTitle className="text-sm sm:text-base font-serif mt-3 leading-snug text-zinc-900 dark:text-zinc-100">
                  {item.questionText}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                {/* Options List */}
                <div className="space-y-2 text-xs">
                  {item.options.map((opt, optIdx) => {
                    const isUserChoice = item.selectedOptionIndex === optIdx;
                    const isCorrectChoice = item.correctOptionIndex === optIdx;

                    let cardClass =
                      "bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-700 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800";
                    if (isCorrectChoice) {
                      cardClass =
                        "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-medium";
                    } else if (isUserChoice && !isCorrectChoice) {
                      cardClass =
                        "bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 border-rose-300 dark:border-rose-800 font-medium";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border flex items-start gap-2.5 ${cardClass}`}
                      >
                        <span className="font-mono font-bold shrink-0 text-xs">
                          {optionLetters[optIdx]}.
                        </span>
                        <span className="leading-relaxed flex-1">{opt}</span>

                        {isCorrectChoice && (
                          <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold shrink-0">
                            [Correct Answer]
                          </span>
                        )}
                        {isUserChoice && !isCorrectChoice && (
                          <span className="font-mono text-[10px] text-rose-700 dark:text-rose-400 uppercase font-semibold shrink-0">
                            [Your Choice]
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Standard Explanation Box */}
                <div className="rounded-lg bg-zinc-50 p-3.5 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-1">
                  <span className="text-zinc-500 font-mono text-[11px] font-bold block uppercase">
                    Explanation:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                    {item.explanation}
                  </p>
                </div>

                {/* 5. EDUCATIONAL DIAGNOSIS BOX: WHY YOU MISSED THIS (Only for incorrect questions) */}
                {!item.isCorrect && diagnosisData && (
                  <div className="rounded-lg border border-amber-200/90 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 text-xs text-amber-950 dark:text-amber-200 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2">
                      <div className="flex items-center gap-1.5 font-bold font-serif text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider">
                        <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Why You Missed This</span>
                      </div>
                      <Badge
                        variant="warning"
                        className="text-[10px] font-mono font-medium px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200"
                      >
                        Mistake type: {diagnosisData.mistakeCategory}
                      </Badge>
                    </div>

                    {/* Diagnostic Explanation */}
                    <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                      {diagnosisData.diagnosis}
                    </p>

                    {/* What to do next */}
                    <div className="pt-1 text-[11px] text-amber-900/80 dark:text-amber-300/80 font-sans">
                      <strong className="text-amber-950 dark:text-amber-200 font-mono">What to do next: </strong>
                      <span>{diagnosisData.whatToDoNext}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <Link href="/library">
          <Button variant="outline" size="sm" className="text-xs">
            Return to RC Library
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/progress">
            <Button size="sm" className="text-xs gap-1.5">
              <span>View Progress & Analytics</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
