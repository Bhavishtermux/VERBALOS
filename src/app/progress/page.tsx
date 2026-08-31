"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  Zap,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  BrainCircuit,
  Compass,
  Layers,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  calculateAnalytics,
  getAllSessions,
  getStoredMistakes,
  CalculatedAnalytics,
} from "@/lib/analytics";
import { useAuth } from "@/context/auth-context";
import { fetchUserSessionsCloud } from "@/lib/supabase/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProgressPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CalculatedAnalytics | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Immediately calculate and display local analytics (0ms latency)
    const localSessions = getAllSessions();
    const localMistakes = getStoredMistakes();
    const immediateCalculated = calculateAnalytics(localSessions, localMistakes);
    setAnalytics(immediateCalculated);

    const loadData = async () => {
      const currentLocal = getAllSessions();
      const currentMistakes = getStoredMistakes();
      let activeSessions = currentLocal;

      if (user?.id) {
        try {
          const cloudSessions = await fetchUserSessionsCloud(user.id);
          if (isMounted && cloudSessions && cloudSessions.length > 0) {
            const sessionMap = new Map<string, any>();
            currentLocal.forEach((s) => sessionMap.set(s.sessionId, s));
            cloudSessions.forEach((s) => sessionMap.set(s.sessionId, s));
            activeSessions = Array.from(sessionMap.values());
          }
        } catch (e) {
          console.warn("Could not load cloud sessions for progress", e);
        }
      }

      if (isMounted) {
        const calculated = calculateAnalytics(activeSessions, currentMistakes);
        setAnalytics(calculated);
      }
    };

    loadData();

    // Listen for storage events (e.g. from practice submissions)
    window.addEventListener("storage", loadData);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadData);
    };
  }, [user]);

  if (!analytics) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent mx-auto dark:border-zinc-100" />
        <p className="text-xs text-zinc-500 font-mono">Computing performance analytics...</p>
      </div>
    );
  }

  const {
    totalSessions,
    overallAccuracy,
    totalQuestionsAnswered,
    totalQuestionsCorrect,
    averageWpm,
    averageScoreOutOfFive,
    averageReadingTimeFormatted,
    averageQuestionSolvingFormatted,
    accuracyTrend,
    wpmTrend,
    skillPerformance,
    sourcePerformance,
    difficultyPerformance,
    mistakeTypeBreakdown,
  } = analytics;

  const hasSufficientTrendData = totalSessions >= 3;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Diagnostic Intelligence
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">
              {totalSessions} Sessions Evaluated
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            Progress & Diagnostics
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Real-time analytics calibrated strictly from your completed reading and question sessions.
          </p>
        </div>

        <Link href="/library" className="self-start md:self-auto">
          <Button size="sm" className="gap-1.5 text-xs h-9">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Practice Next RC</span>
          </Button>
        </Link>
      </div>

      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Overall Accuracy */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase">Accuracy</span>
            <Target className="h-3.5 w-3.5" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {overallAccuracy}%
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {totalQuestionsCorrect}/{totalQuestionsAnswered} correct
          </span>
        </div>

        {/* 2. Average WPM */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase">Reading Speed</span>
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {averageWpm} <span className="text-xs font-normal text-zinc-400">WPM</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Reading pace</span>
        </div>

        {/* 3. RCs Completed */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase">RCs Completed</span>
            <BookOpen className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {totalSessions}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Full drills solved</span>
        </div>

        {/* 4. Average Score */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase">Avg Score</span>
            <Award className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {averageScoreOutOfFive} <span className="text-xs font-normal text-zinc-400">/ 5</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Per 5-question RC</span>
        </div>

        {/* 5. Avg Reading Time */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase">Avg Read Time</span>
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {averageReadingTimeFormatted}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">~850 words passage</span>
        </div>

        {/* 6. Avg Question Time */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase">Avg Solve Time</span>
            <Activity className="h-3.5 w-3.5" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {averageQuestionSolvingFormatted}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">5 questions</span>
        </div>
      </div>

      {/* 1 & 2. Visual Charts: Accuracy Trend & WPM Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Accuracy Trend Chart */}
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm font-serif">Accuracy Trend</CardTitle>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                Chronological Sessions
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {totalSessions > 0 ? (
              <div className="space-y-4">
                {!hasSufficientTrendData && (
                  <div className="rounded-md bg-amber-50 p-2.5 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300">
                    Complete at least 3 RCs to see a meaningful trend.
                  </div>
                )}

                {/* Accuracy Bars List */}
                <div className="space-y-3">
                  {accuracyTrend.map((item, idx) => (
                    <div key={item.sessionId || idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]" title={item.passageTitle}>
                          {item.formattedDate}: {item.passageTitle.slice(0, 24)}...
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                          {item.score} ({item.accuracy}%)
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.accuracy >= 80
                              ? "bg-emerald-500"
                              : item.accuracy >= 60
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.max(item.accuracy, 8)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-zinc-400 font-mono">
                No session data available. Complete an RC to view your accuracy trend.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. WPM Trend Chart */}
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-serif">Reading Pacing Trend (WPM)</CardTitle>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                Target: 300 WPM
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {totalSessions > 0 ? (
              <div className="space-y-4">
                {!hasSufficientTrendData && (
                  <div className="rounded-md bg-amber-50 p-2.5 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300">
                    Complete at least 3 RCs to see a meaningful trend.
                  </div>
                )}

                {/* WPM Speed Bars */}
                <div className="space-y-3">
                  {wpmTrend.map((item, idx) => {
                    const relativePercent = Math.min(Math.round((item.wpm / 400) * 100), 100);
                    return (
                      <div key={item.sessionId || idx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]" title={item.passageTitle}>
                            {item.formattedDate}: {item.passageTitle.slice(0, 24)}...
                          </span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">
                            {item.wpm} WPM
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                          {/* 300 WPM marker guide */}
                          <div className="absolute top-0 bottom-0 left-[75%] w-[2px] bg-zinc-400/50 z-10" />
                          <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${relativePercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-zinc-400 font-mono">
                No session data available. Complete an RC to view your WPM pacing trend.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. SKILL PERFORMANCE MATRIX */}
      <Card className="bg-white dark:bg-zinc-900">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              <CardTitle className="text-sm font-serif">Skill Performance</CardTitle>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              8 CAT Verbal Competencies
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillPerformance.map((skill) => (
              <div
                key={skill.skill}
                className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs font-serif text-zinc-900 dark:text-zinc-100">
                    {skill.skill}
                  </span>
                  <Badge
                    variant={
                      skill.status === "Mastered"
                        ? "success"
                        : skill.status === "Developing"
                        ? "warning"
                        : skill.status === "Review Needed"
                        ? "danger"
                        : "secondary"
                    }
                    className="text-[9px] py-0 px-1.5 font-normal"
                  >
                    {skill.status}
                  </Badge>
                </div>

                <Progress
                  value={skill.accuracy}
                  max={100}
                  size="sm"
                  indicatorColor={
                    skill.accuracy >= 80
                      ? "bg-emerald-500"
                      : skill.accuracy >= 50
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }
                />

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-0.5">
                  <span>{skill.correct} / {skill.total} correct</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {skill.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4 & 5. Source & Difficulty Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Source Performance */}
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-sm font-serif">Source Performance</CardTitle>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                Publication Distribution
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {sourcePerformance.map((src) => (
              <div
                key={src.source}
                className="rounded-lg border border-zinc-200/70 p-3 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/40 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 font-serif">
                    {src.source}
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {src.attempted} RCs ({src.total} questions) • Avg {src.avgWpm} WPM
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                    {src.accuracy}%
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    {src.correct}/{src.total} correct
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 5. Difficulty Performance */}
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-sm font-serif">Difficulty Performance</CardTitle>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                Challenge Tiers
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {difficultyPerformance.map((diff) => (
              <div
                key={diff.difficulty}
                className="rounded-lg border border-zinc-200/70 p-3 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Badge
                    variant={
                      diff.difficulty === "CAT+"
                        ? "danger"
                        : diff.difficulty === "CAT"
                        ? "warning"
                        : diff.difficulty === "Hard"
                        ? "academic"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {diff.difficulty}
                  </Badge>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {diff.attempted} attempted • {diff.avgWpm} WPM
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                    {diff.accuracy}%
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    {diff.correct}/{diff.total} correct
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 6. MOST COMMON MISTAKE TYPES */}
      <Card className="bg-white dark:bg-zinc-900">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-rose-500" />
              <CardTitle className="text-sm font-serif">Most Common Mistake Types</CardTitle>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              Rule-Based Diagnostic Log
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {mistakeTypeBreakdown.length > 0 ? (
            <div className="space-y-3">
              {mistakeTypeBreakdown.map((item, idx) => (
                <div
                  key={item.category}
                  className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        #{idx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-zinc-900 dark:text-zinc-100">
                        {item.category}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[10px] font-mono">
                        {item.count} occurrences ({item.percentage}%)
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-5">
                    <strong className="text-zinc-800 dark:text-zinc-200 font-mono">Strategic Fix: </strong>
                    {item.recommendation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400 font-mono">
              Zero mistakes logged yet! Solve RC drills to calibrate your diagnostic patterns.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
