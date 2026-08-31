"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  ChevronRight,
  Compass,
  Sparkles,
  Lightbulb,
  Check,
  Cloud,
  FileCheck,
  SpellCheck,
  ShieldAlert,
  HelpCircle,
  Crosshair,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { useAuth } from "@/context/auth-context";
import {
  calculateAnalytics,
  getAllSessions,
  getStoredMistakes,
  CalculatedAnalytics,
} from "@/lib/analytics";
import {
  generateRecommendations,
  PracticeRecommendation,
} from "@/lib/recommendations";
import {
  getPersonalizedSourceRecommendations,
  getStoredReadingRecords,
  RecommendedArticleItem,
} from "@/lib/source-recommendations";
import { fetchUserSessionsCloud } from "@/lib/supabase/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const router = useRouter();
  const { rcPassages, settings, stats } = useRc();
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState<CalculatedAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [curatedReadingPack, setCuratedReadingPack] = useState<RecommendedArticleItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // 1. Initial calculation from local storage
      const localSessions = getAllSessions();
      const localMistakes = getStoredMistakes();
      let activeSessions = localSessions;

      // 2. Fetch cloud sessions if user is authenticated
      if (user?.id) {
        try {
          const cloudSessions = await fetchUserSessionsCloud(user.id);
          if (isMounted && cloudSessions && cloudSessions.length > 0) {
            // Merge cloud sessions with local
            const sessionMap = new Map<string, any>();
            localSessions.forEach((s) => sessionMap.set(s.sessionId, s));
            cloudSessions.forEach((s) => sessionMap.set(s.sessionId, s));
            activeSessions = Array.from(sessionMap.values());
          }
        } catch (e) {
          console.warn("Could not load cloud sessions for dashboard", e);
        }
      }

      if (isMounted) {
        const calculated = calculateAnalytics(activeSessions, localMistakes);
        setAnalytics(calculated);
        const records = getStoredReadingRecords();
        const recs = getPersonalizedSourceRecommendations({ analytics: calculated, readingRecords: records });
        setCuratedReadingPack(recs.featuredPack);
        setLoading(false);
      }
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadData);
    };
  }, [user]);

  // Personalized Rule-Based Recommendations
  const recommendations: PracticeRecommendation[] = analytics
    ? generateRecommendations(analytics, rcPassages)?.recommendations || []
    : [];

  const displayName = profile?.displayName || user?.email?.split("@")[0] || "Aspirant";
  const hasData = analytics && analytics.totalSessions > 0;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Diagnostic Overview
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">CAT 2026 Preparation</span>
            {user && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <Badge variant="secondary" className="text-[9px] font-mono gap-1">
                  <Cloud className="h-2.5 w-2.5 text-emerald-500" /> Cloud Synced
                </Badge>
              </>
            )}
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            Good morning, {displayName}.
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 font-sans">
            Let&apos;s improve your VARC today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/practice">
            <Button size="sm" className="gap-1.5 text-xs h-9 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start Practice</span>
            </Button>
          </Link>
          <Link href="/mocks">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9">
              <FileCheck className="h-3.5 w-3.5" />
              <span>Take Section Mock</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. TODAY'S VARC PLAN & DAILY CADENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Personalized Daily Plan */}
        <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                Today&apos;s VARC Plan
              </h3>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Estimated: ~45 mins
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" /> 1 RC Passage
              </div>
              <strong className="text-sm font-serif text-zinc-900 dark:text-zinc-100 block">
                Philosophy / Science
              </strong>
              <span className="text-[10px] text-zinc-400">Target: &gt;80% Accuracy</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                <Layers className="h-3.5 w-3.5 text-purple-600" /> 15 VA Questions
              </div>
              <strong className="text-sm font-serif text-zinc-900 dark:text-zinc-100 block">
                Para Summary &amp; Jumbles
              </strong>
              <span className="text-[10px] text-zinc-400">Target: ~1.5m / question</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                <SpellCheck className="h-3.5 w-3.5 text-emerald-600" /> 10 Vocab Reviews
              </div>
              <strong className="text-sm font-serif text-zinc-900 dark:text-zinc-100 block">
                Contextual Words
              </strong>
              <span className="text-[10px] text-zinc-400">Active flashcard recall</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <span className="text-zinc-500 font-sans">
              Focus of the day: <strong className="text-zinc-800 dark:text-zinc-200">Inference &amp; Option Elimination</strong>
            </span>
            <Button
              onClick={() => router.push("/practice")}
              size="sm"
              className="text-xs h-8 gap-1.5"
            >
              <span>Start Today&apos;s Plan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>

        {/* Right 1 Col: Today's Completion Cadence */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Today&apos;s Cadence
            </span>
            <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 pt-0.5">
              Daily Practice Targets
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-zinc-500">Reading Comprehension:</span>
                <strong className="text-zinc-900 dark:text-zinc-100">
                  {stats.todayCompleted || 0} / {settings.dailyGoalPassages || 3} RCs
                </strong>
              </div>
              <Progress
                value={((stats.todayCompleted || 0) / Math.max(settings.dailyGoalPassages || 3, 1)) * 100}
                className="h-1.5"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-zinc-500">Verbal Ability Drills:</span>
                <strong className="text-zinc-900 dark:text-zinc-100">
                  {hasData ? "0 / 15 Qs" : "0 / 15 Qs"}
                </strong>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-zinc-500">Vocabulary Reviews:</span>
                <strong className="text-zinc-900 dark:text-zinc-100">0 / 10 Words</strong>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>
          </div>

          <div className="pt-1 text-[11px] font-mono text-zinc-400 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>Streak: <strong>{stats.currentStreak || 0} days active</strong></span>
          </div>
        </Card>
      </div>

      {/* 2. CORE PERFORMANCE METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
          <span className="text-[11px] font-mono text-zinc-400 uppercase block">Overall Accuracy</span>
          <strong className="text-2xl sm:text-3xl font-serif text-emerald-600 dark:text-emerald-400 font-bold block pt-1">
            {hasData ? `${analytics.overallAccuracy}%` : "0%"}
          </strong>
          <span className="text-[10px] text-zinc-400 font-mono">
            {hasData ? `${analytics.totalQuestionsAnswered} Questions Answered` : "0 Questions Attempted"}
          </span>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
          <span className="text-[11px] font-mono text-zinc-400 uppercase block">Average WPM</span>
          <strong className="text-2xl sm:text-3xl font-serif text-zinc-900 dark:text-zinc-100 font-bold block pt-1">
            {hasData ? `${analytics.averageWpm}` : "—"}
          </strong>
          <span className="text-[10px] text-zinc-400 font-mono">
            {hasData ? "Calibrated Reading Speed" : "Not calibrated yet"}
          </span>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
          <span className="text-[11px] font-mono text-zinc-400 uppercase block">Mock Section Score</span>
          <strong className="text-2xl sm:text-3xl font-serif text-zinc-900 dark:text-zinc-100 font-bold block pt-1">
            {hasData && analytics.averageScoreOutOfFive > 0
              ? `${Math.round(analytics.averageScoreOutOfFive * 14.4)} / 72`
              : "— / 72"}
          </strong>
          <span className="text-[10px] text-zinc-400 font-mono">
            {hasData ? "CAT Benchmark Pace" : "0 mocks completed"}
          </span>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-4 text-center">
          <span className="text-[11px] font-mono text-zinc-400 uppercase block">Practice Streak</span>
          <strong className="text-2xl sm:text-3xl font-serif text-amber-600 dark:text-amber-400 font-bold block pt-1">
            {stats.currentStreak || 0} Days
          </strong>
          <span className="text-[10px] text-zinc-400 font-mono">Consecutive Training</span>
        </Card>
      </div>

      {/* 3. WEAK AREA HIGHLIGHT OR ONBOARDING READINESS BANNER */}
      {hasData && analytics.mistakeTypeBreakdown.length > 0 ? (
        <Card className="bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40 p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Critical Focus: {analytics.mistakeTypeBreakdown[0].category}
                  </span>
                  <Badge className="bg-rose-600 text-white text-[10px] font-mono">
                    {analytics.mistakeTypeBreakdown[0].percentage}% of Errors
                  </Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 pt-0.5">
                  {analytics.mistakeTypeBreakdown[0].recommendation}
                </p>
              </div>
            </div>

            <Button
              onClick={() => router.push("/practice")}
              className="text-xs font-semibold px-4 h-9 bg-rose-600 hover:bg-rose-700 text-white shadow-sm shrink-0"
            >
              Practice Drills →
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <Target className="h-5 w-5 text-[#C83214]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Diagnostic Engine Ready // 0 Errors Recorded
                  </span>
                  <Badge variant="neutral" className="text-[10px] font-mono">Fresh Profile</Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 pt-0.5">
                  Complete your first Reading Comprehension passage or Verbal Ability drill to calculate your accuracy, WPM speed, and personalized cognitive error profile.
                </p>
              </div>
            </div>

            <Button
              onClick={() => router.push("/practice")}
              className="text-xs font-semibold px-4 h-9 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm shrink-0"
            >
              Start First RC Drill →
            </Button>
          </div>
        </Card>
      )}

      {/* TODAY'S CURATED INTELLECTUAL READING PACK */}
      {curatedReadingPack.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Today&apos;s Curated Reading (Aeon • The Atlantic • The Hindu)
              </h3>
            </div>
            <Link
              href="/reading-room"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              Explore Reading Room →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {curatedReadingPack.map((rec) => (
              <Card
                key={rec.article.id}
                className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between p-4 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {rec.article.source}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {rec.article.topic}
                    </Badge>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                    {rec.article.title}
                  </h4>

                  <div className="p-2 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[10px] text-amber-900 dark:text-amber-200 space-y-0.5">
                    <strong className="font-mono uppercase block text-[9px]">Why This:</strong>
                    <p className="line-clamp-2 leading-tight">{rec.whyThisArticle}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-zinc-400">
                    ~{rec.article.estimatedReadingTimeMinutes} mins
                  </span>
                  <Link href={`/reading-room/${rec.article.id}`}>
                    <Button size="sm" className="h-7 text-xs gap-1">
                      <span>Start Reading</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TRAINING LABS LAUNCHPAD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-50">
              Interactive Reasoning Labs
            </h3>
            <p className="text-xs text-zinc-500 font-sans">
              Targeted cognitive training environments for process elimination, exam triage, and stamina
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/elimination-lab">
            <Card className="p-4 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:border-amber-500 transition-all cursor-pointer h-full flex flex-col justify-between space-y-3 group">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" className="text-[10px] font-mono">Process Lab</Badge>
                  <Crosshair className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Elimination Lab
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                  Practice diagnosing the 10 fatal distractor traps before locking your choice.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                Enter Lab →
              </span>
            </Card>
          </Link>

          <Link href="/reading-room">
            <Card className="p-4 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:border-emerald-500 transition-all cursor-pointer h-full flex flex-col justify-between space-y-3 group">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="text-[10px] font-mono">Stamina Lab</Badge>
                  <BookOpen className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Active Reading Room
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                  Long-form essays across 12 disciplines with active thesis and mental mapping.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                Enter Room →
              </span>
            </Card>
          </Link>
        </div>
      </div>

      {/* 4. RECOMMENDED FOR YOU (RULE-BASED) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-50">
              Recommended for You
            </h3>
            <p className="text-xs text-zinc-500 font-sans">
              Rule-based recommendations derived from your live diagnostic accuracy and error patterns
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec) => (
            <Card
              key={rec.id}
              className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between p-4 space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" className="text-[10px] font-mono">
                    {rec.passage.topic}
                  </Badge>
                  <span className="text-[11px] font-mono text-zinc-400">{rec.passage.difficulty}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                  {rec.passage.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed line-clamp-2">
                  {rec.rationale}
                </p>
              </div>

              <Button
                onClick={() => router.push(`/practice/${rec.passage.id}`)}
                size="sm"
                variant="outline"
                className="w-full text-xs h-8 gap-1"
              >
                <span>Launch Workout</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
