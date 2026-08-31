"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Timer,
  Target,
  Sparkles,
  Layers,
  Zap,
  Sliders,
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  Compass,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { initialRcPassages } from "@/data/rc-passages";
import {
  calculateAnalytics,
  getAllSessions,
  getStoredMistakes,
  CalculatedAnalytics,
} from "@/lib/analytics";
import {
  generateRecommendations,
  PracticeRecommendation,
  RecommendationSummary,
} from "@/lib/recommendations";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  getInProgressDrills,
  deleteInProgressDrill,
  InProgressDrill,
} from "@/lib/in-progress";

export default function PracticePage() {
  const { rcPassages, settings } = useRc();
  const [analytics, setAnalytics] = useState<CalculatedAnalytics | null>(null);
  const [inProgressDrills, setInProgressDrills] = useState<InProgressDrill[]>([]);

  const safePassages = useMemo(() => {
    return Array.isArray(rcPassages) && rcPassages.length > 0 ? rcPassages : initialRcPassages;
  }, [rcPassages]);

  useEffect(() => {
    const updateDrills = () => {
      setInProgressDrills(getInProgressDrills());
    };
    updateDrills();
    window.addEventListener("storage", updateDrills);
    return () => window.removeEventListener("storage", updateDrills);
  }, []);

  useEffect(() => {
    const loadData = () => {
      try {
        const sessions = getAllSessions();
        const mistakes = getStoredMistakes();
        const calculated = calculateAnalytics(sessions, mistakes);
        setAnalytics(calculated);
      } catch (e) {
        console.warn("Could not calculate practice analytics", e);
      }
    };

    loadData();

    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  // Compute recommendations safely
  const recommendationSummary = useMemo(() => {
    try {
      return generateRecommendations(analytics, safePassages);
    } catch {
      return null;
    }
  }, [analytics, safePassages]);

  const [selectedDrill, setSelectedDrill] = useState<{
    id: string;
    title: string;
    description: string;
    passages: number;
    questions: number;
    timeMinutes: number;
    genreFocus: string;
    strategy: string;
  } | null>(null);

  const [customPassageCount, setCustomPassageCount] = useState<number>(2);
  const [customGenre, setCustomGenre] = useState<string>("All");
  const [customDifficulty, setCustomDifficulty] = useState<string>("All");

  const practiceModes = useMemo(() => [
    {
      id: "cat-full",
      title: "CAT Full Section Simulation",
      subtitle: "Standard 4-Passage Benchmark",
      description:
        "Exact CAT VARC replica: 4 diverse passages (Philosophy, Economics, Science, Sociology), 20 questions under strict 40-minute sectional clock.",
      passages: 4,
      questions: 20,
      timeMinutes: 40,
      genreFocus: "Mixed Diverse (CAT Standard)",
      badge: "Standard Test",
      badgeVariant: "default" as const,
      icon: Timer,
      strategy: "Allocate ~9-10 mins per passage. Triage and begin with your highest-comfort genre first.",
      linkPassageId: safePassages[0]?.id || "rc-01",
    },
    {
      id: "weak-inference",
      title: "Inference & Deduction Sprint",
      subtitle: "Diagnostic Remediation",
      description:
        "High-density questions specifically targeting implicit premises, authorial bias, and nuanced boundary verification.",
      passages: 2,
      questions: 10,
      timeMinutes: 18,
      genreFocus: "Philosophy & Critical Theory",
      badge: "High Impact",
      badgeVariant: "danger" as const,
      icon: Target,
      strategy: "Scrutinize subtle qualifiers (e.g. 'seldom', 'plausible', 'partially') and resist extrapolating beyond the text.",
      linkPassageId: safePassages.find((p) => p?.topic === "Philosophy")?.id || safePassages[0]?.id || "rc-01",
    },
    {
      id: "genre-deep-dive",
      title: "Abstract Philosophy & Social Theory",
      subtitle: "Dense Genre Workout",
      description:
        "Tackle dense, conceptual texts with complex syntactic structures and non-linear epistemological arguments.",
      passages: 2,
      questions: 10,
      timeMinutes: 20,
      genreFocus: "Epistemology, Aesthetics & Social Theory",
      badge: "Advanced",
      badgeVariant: "warning" as const,
      icon: Layers,
      strategy: "Map the paragraph-level thesis before diving into options. Maintain focus on the author's primary conflict.",
      linkPassageId: safePassages.find((p) => p?.topic === "Sociology")?.id || safePassages[1]?.id || "rc-04",
    },
    {
      id: "speed-pacer",
      title: "Speed Pacing & Cadence Calibration",
      subtitle: "Target: 300+ WPM",
      description:
        "Time-constrained passages designed to train rapid structural scanning and eliminate cognitive regression.",
      passages: 2,
      questions: 10,
      timeMinutes: 14,
      genreFocus: "Economics & Science Policy",
      badge: "Speed Pacer",
      badgeVariant: "academic" as const,
      icon: Zap,
      strategy: "Aim for a 2.5-minute initial read followed by active question verification.",
      linkPassageId: safePassages.find((p) => p?.topic === "Economics")?.id || safePassages[2]?.id || "rc-02",
    },
  ], [safePassages]);

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Training Lab
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 font-mono">Personalized &amp; Structured Drills</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
          Practice &amp; Remediation
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Targeted practice drills calibrated directly against your accuracy, pacing, and mistake diagnostic data.
        </p>
      </div>

      {/* In-Progress Drills & Saved Drafts Section */}
      {inProgressDrills.length > 0 && (
        <div className="space-y-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 p-4 shadow-sm animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-amber-900 dark:text-amber-300">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>In-Progress Drills &amp; Saved Drafts ({inProgressDrills.length})</span>
            </div>
            <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 hidden sm:inline">
              Resume your saved reading sessions where you left off
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {inProgressDrills.map((drill) => (
              <Card
                key={drill.passageId}
                className="bg-white dark:bg-zinc-900 border-amber-200/80 dark:border-amber-900/60 p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-amber-400 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="warning" className="text-[10px] font-mono uppercase">
                      {drill.stage === "reading" ? "Reading Phase" : "Question Solving"}
                    </Badge>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {drill.topic} • {drill.difficulty}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-1">
                    {drill.passageTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-0.5">
                    <span>Reading Pace: <strong>{Math.floor(drill.readingSeconds / 60)}m {drill.readingSeconds % 60}s</strong></span>
                    <span>•</span>
                    <span>Answered: <strong>{Object.keys(drill.selectedAnswers || {}).length} of {drill.totalQuestions || 5} Qs</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <button
                    onClick={() => {
                      deleteInProgressDrill(drill.passageId);
                      setInProgressDrills(getInProgressDrills());
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-mono hover:underline"
                  >
                    Discard Draft
                  </button>
                  <Link href={`/practice/${drill.passageId}?resume=true`}>
                    <Button size="sm" className="h-8 text-xs gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm">
                      <span>Resume RC Drill</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 1. PERSONALIZED RECOMMENDATIONS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
              Recommended for You (Rule-Based Diagnostics)
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Generated from {analytics?.totalSessions ?? 0} Completed Sessions
          </span>
        </div>

        {recommendationSummary && recommendationSummary.recommendations && recommendationSummary.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recommendationSummary.recommendations.filter((r) => r && r.passage).map((rec, idx) => (
              <Card
                key={rec.id || idx}
                className="flex flex-col justify-between bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
                    <Badge variant="warning" className="text-[10px] font-mono font-semibold">
                      {rec.badgeText || "Recommended"}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                      {rec.passage?.source || "CAT Bank"}
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-serif leading-snug">
                    {rec.passage?.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono">
                    {rec.passage?.topic} • {rec.passage?.difficulty} • {rec.passage?.wordCount} words
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* WHY IT WAS RECOMMENDED BOX */}
                  <div className="rounded-lg bg-amber-50/70 p-3 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold font-serif text-amber-900 dark:text-amber-300 text-[10px] uppercase">
                      <Lightbulb className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span>Why This RC:</span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed pl-4 font-sans">
                      {rec.rationale}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-400">
                      ~{rec.passage?.estimatedMinutes || 6} mins • 5 Qs
                    </span>
                    <Link href={`/practice/${rec.passage?.id || "rc-01"}`}>
                      <Button size="sm" className="h-8 text-xs gap-1">
                        <span>Begin RC Practice</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 font-mono">
            Complete your first reading comprehension drill in the Reading Room or Practice modes to generate personalized diagnostic practice recommendations.
          </div>
        )}
      </div>

      {/* 2. STRUCTURED PRACTICE MODES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-sm font-bold font-serif uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
              Structured Sectional Modes
            </h2>
          </div>
          <Link href="/reading-room" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 font-mono">
            Explore Reading Room →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {practiceModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className="flex flex-col justify-between transition-all hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-zinc-100 p-2 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-serif">{mode.title}</CardTitle>
                        <CardDescription className="text-xs">{mode.subtitle}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={mode.badgeVariant}>{mode.badge}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {mode.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-50/80 p-2.5 text-center text-xs dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/60 font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block">Passages</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{mode.passages} RCs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block">Questions</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{mode.questions} Qs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block">Target Time</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{mode.timeMinutes} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[11px] font-mono text-zinc-400">
                      Genre: {mode.genreFocus.slice(0, 26)}...
                    </span>
                    <Link href={`/practice/${mode.linkPassageId}`}>
                      <Button size="sm" className="text-xs gap-1.5 h-8">
                        <Play className="h-3 w-3 fill-current" />
                        <span>Launch Drill</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 3. CUSTOM DRILL CONFIGURATOR */}
      <Card className="border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <div>
              <CardTitle className="text-sm font-serif">Custom RC Drill Configurator</CardTitle>
              <CardDescription className="text-xs">
                Build a personalized practice session tailored to your specific focus areas
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 block mb-1.5">
                Passage Quantity:
              </label>
              <Select
                value={customPassageCount.toString()}
                onChange={(e) => setCustomPassageCount(Number(e.target.value))}
                className="text-xs"
              >
                <option value="1">1 Passage (5 Questions • ~9 mins)</option>
                <option value="2">2 Passages (10 Questions • ~18 mins)</option>
                <option value="3">3 Passages (15 Questions • ~27 mins)</option>
                <option value="4">4 Passages Full Section (20 Qs • 40 mins)</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 block mb-1.5">
                Topic Domain:
              </label>
              <Select
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Topics (Balanced CAT Mix)</option>
                <option value="Philosophy">Philosophy & Phenomenology</option>
                <option value="Economics">Economics & Platform Markets</option>
                <option value="Psychology">Psychology & Behavioral Science</option>
                <option value="Sociology">Sociology & Cultural Hegemony</option>
                <option value="Science">Science & Evolutionary Biology</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 block mb-1.5">
                Target Difficulty:
              </label>
              <Select
                value={customDifficulty}
                onChange={(e) => setCustomDifficulty(e.target.value)}
                className="text-xs"
              >
                <option value="All">All Tiers (Adaptive)</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="CAT">CAT Standard</option>
                <option value="CAT+">CAT+ (Advanced Dense)</option>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-500 font-mono">
              Configured: {customPassageCount} passages • {customPassageCount * 5} questions • ~{customPassageCount * 9} mins
            </span>
            <Link href={`/practice/${rcPassages[0]?.id || "rc-01"}`}>
              <Button size="sm" className="text-xs gap-1.5">
                <Play className="h-3 w-3 fill-current" />
                <span>Launch Custom Drill</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
