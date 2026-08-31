"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Compass,
  Clock,
  Sparkles,
  ExternalLink,
  Play,
  CheckCircle2,
  Filter,
  Layers,
  Flame,
  Award,
  Zap,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Share2,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  RealSourceArticle,
  RealArticleSource,
  SourceTopic,
  ReasoningDifficulty,
  UserReadingRecord,
} from "@/lib/sources/types";
import { getAllPublishedSourceArticles } from "@/lib/source-discovery";
import {
  getStoredReadingRecords,
  calculateSourceExposureStats,
  getPersonalizedSourceRecommendations,
  RecommendedArticleItem,
} from "@/lib/source-recommendations";
import { calculateAnalytics, getAllSessions, getStoredMistakes } from "@/lib/analytics";

export default function ReadingRoomPage() {
  const { stats } = useRc();
  const [mounted, setMounted] = useState(false);
  const [readingRecords, setReadingRecords] = useState<UserReadingRecord[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedModeFilter, setSelectedModeFilter] = useState<"All" | "Practice" | "ReadOnly">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"recommended" | "all" | "completed">("recommended");

  useEffect(() => {
    setMounted(true);
    const loadRecords = () => {
      setReadingRecords(getStoredReadingRecords());
    };
    loadRecords();
    window.addEventListener("storage", loadRecords);
    return () => window.removeEventListener("storage", loadRecords);
  }, []);

  const allArticles = useMemo(() => getAllPublishedSourceArticles(), []);

  // Compute live analytics & personalized recommendations
  const recommendationData = useMemo(() => {
    const sessions = getAllSessions();
    const mistakes = getStoredMistakes();
    const analytics = calculateAnalytics(sessions, mistakes);
    return getPersonalizedSourceRecommendations({ analytics, readingRecords });
  }, [readingRecords]);

  // Compute source exposure metrics
  const exposureStats = useMemo(() => {
    return calculateSourceExposureStats(readingRecords);
  }, [readingRecords]);

  const completedArticleIds = useMemo(() => {
    return new Set(readingRecords.map((r) => r.articleId));
  }, [readingRecords]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    let list = allArticles;

    if (activeTab === "completed") {
      list = list.filter((art) => completedArticleIds.has(art.id));
    }

    if (selectedSource !== "All") {
      list = list.filter((art) => art.source === selectedSource);
    }

    if (selectedTopic !== "All") {
      list = list.filter((art) => art.topic === selectedTopic || art.secondaryTopics?.includes(art.topic as any));
    }

    if (selectedDifficulty !== "All") {
      list = list.filter((art) => art.difficulty === selectedDifficulty);
    }

    if (selectedModeFilter === "Practice") {
      list = list.filter((art) => art.practiceQuestions && art.practiceQuestions.length > 0);
    } else if (selectedModeFilter === "ReadOnly") {
      list = list.filter((art) => !art.practiceQuestions || art.practiceQuestions.length === 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.author.toLowerCase().includes(q) ||
          art.description.toLowerCase().includes(q) ||
          art.topic.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allArticles, selectedSource, selectedTopic, selectedDifficulty, selectedModeFilter, searchQuery, activeTab, completedArticleIds]);

  const getSourceBadgeStyle = (source: RealArticleSource) => {
    switch (source) {
      case "Aeon":
        return "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
      case "The Atlantic":
        return "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
      case "The Hindu":
        return "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200";
    }
  };

  const getDifficultyBadgeVariant = (diff: ReasoningDifficulty) => {
    switch (diff) {
      case "Accessible":
        return "success";
      case "Medium":
        return "secondary";
      case "Hard":
        return "warning";
      case "CAT+":
        return "danger";
      default:
        return "neutral";
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent mx-auto dark:border-zinc-100" />
        <p className="text-xs text-zinc-500 font-mono">Loading curated source library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Curated Source Ecosystem
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">Aeon • The Atlantic • The Hindu</span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            Active Reading Room
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Real-world essays and editorial journalism to build stamina, intellectual breadth, and CAT-grade comprehension.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/practice">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <Compass className="h-3.5 w-3.5" />
              <span>Structured Drills</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Source Exposure & Diversity Meter */}
      <Card className="p-4 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Weekly Source Exposure &amp; Diversity
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Total Read: {exposureStats.totalArticlesRead} Essays • ~{exposureStats.totalReadingMinutes} mins
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Aeon */}
          <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="font-serif font-bold text-purple-900 dark:text-purple-300">Aeon</span>
              <span className="font-bold">{exposureStats.aeonCount} Read</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Philosophy, Psychology &amp; Society
            </p>
          </div>

          {/* The Atlantic */}
          <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="font-serif font-bold text-blue-900 dark:text-blue-300">The Atlantic</span>
              <span className="font-bold">{exposureStats.atlanticCount} Read</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Ideas, Science &amp; Cultural Analysis
            </p>
          </div>

          {/* The Hindu */}
          <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="font-serif font-bold text-amber-900 dark:text-amber-300">The Hindu</span>
              <span className="font-bold">{exposureStats.hinduCount} Read</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Opinion, Economy &amp; Ecology
            </p>
          </div>

          {/* Average Calibrated WPM */}
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-zinc-500">Reading Speed</span>
              <strong className="text-zinc-900 dark:text-zinc-100">{exposureStats.averageWpm} WPM</strong>
            </div>
            <p className="text-[10px] text-zinc-400">
              Calibrated across live reading sessions
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Today's Curated 3-Pack (Aeon • Atlantic • Hindu) */}
      {recommendationData.featuredPack.length > 0 && activeTab === "recommended" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
              <h2 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                Today&apos;s Curated Reading (Aeon • The Atlantic • The Hindu)
              </h2>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Balanced 3-Source Daily Diet
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationData.featuredPack.map((rec) => (
              <Card
                key={rec.article.id}
                className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between p-4 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSourceBadgeStyle(
                        rec.article.source
                      )}`}
                    >
                      {rec.article.source}
                    </span>
                    <Badge variant={getDifficultyBadgeVariant(rec.article.difficulty)} className="text-[10px] font-mono">
                      {rec.article.difficulty}
                    </Badge>
                  </div>

                  <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                    {rec.article.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed line-clamp-2">
                    {rec.article.description}
                  </p>

                  {/* Why This Article Box */}
                  <div className="p-2.5 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-0.5">
                    <div className="flex items-center gap-1 font-bold font-mono text-[10px] uppercase">
                      <Lightbulb className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span>Why This:</span>
                    </div>
                    <p className="leading-tight pl-3.5">{rec.whyThisArticle}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>By {rec.article.author.slice(0, 22)}</span>
                    <span>~{rec.article.estimatedReadingTimeMinutes} mins</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {rec.article.practiceQuestions && rec.article.practiceQuestions.length > 0 ? (
                      <Link href={`/reading-room/${rec.article.id}`} className="w-full">
                        <Button size="sm" className="w-full text-xs h-8 gap-1 font-semibold">
                          <span>Read + Practice (5 Qs)</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/reading-room/${rec.article.id}`} className="w-full">
                        <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1">
                          <span>Start Reading</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 4. Filter & Search Controls */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeTab === "recommended" ? "default" : "ghost"}
              onClick={() => setActiveTab("recommended")}
              className="text-xs h-8 font-mono"
            >
              Recommended Diet
            </Button>
            <Button
              size="sm"
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className="text-xs h-8 font-mono"
            >
              All Articles ({allArticles.length})
            </Button>
            <Button
              size="sm"
              variant={activeTab === "completed" ? "default" : "ghost"}
              onClick={() => setActiveTab("completed")}
              className="text-xs h-8 font-mono"
            >
              Completed ({completedArticleIds.size})
            </Button>
          </div>

          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search topic, author, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs font-sans"
            />
          </div>
        </div>

        {/* Dropdown Filters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Source:</label>
            <Select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-xs h-8"
            >
              <option value="All">All Sources (Aeon • Atlantic • Hindu)</option>
              <option value="Aeon">Aeon</option>
              <option value="The Atlantic">The Atlantic</option>
              <option value="The Hindu">The Hindu</option>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Discipline:</label>
            <Select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs h-8"
            >
              <option value="All">All Topics</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Psychology">Psychology</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="Economics">Economics</option>
              <option value="Literature">Literature</option>
              <option value="Environment">Environment</option>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Reasoning Difficulty:</label>
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs h-8"
            >
              <option value="All">All Tiers</option>
              <option value="Accessible">Accessible</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="CAT+">CAT+ (Advanced)</option>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Training Mode:</label>
            <Select
              value={selectedModeFilter}
              onChange={(e) => setSelectedModeFilter(e.target.value as any)}
              className="text-xs h-8"
            >
              <option value="All">All Modes</option>
              <option value="Practice">Read + CAT Practice (With 5 Qs)</option>
              <option value="ReadOnly">Read Only (Stamina &amp; WPM)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* 5. Article Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredArticles.length} curated articles
          </span>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => {
              const isCompleted = completedArticleIds.has(article.id);
              const hasQuestions = article.practiceQuestions && article.practiceQuestions.length > 0;

              return (
                <Card
                  key={article.id}
                  className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between p-4 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSourceBadgeStyle(
                          article.source
                        )}`}
                      >
                        {article.source}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="neutral" className="text-[10px] font-mono">
                          {article.topic}
                        </Badge>
                        <Badge
                          variant={getDifficultyBadgeVariant(article.difficulty)}
                          className="text-[10px] font-mono"
                        >
                          {article.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed line-clamp-2">
                      {article.description}
                    </p>

                    {/* Central Idea & Argument Insight */}
                    <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-0.5">
                      <strong className="font-mono text-[10px] uppercase text-zinc-800 dark:text-zinc-200 block">
                        Central Argument:
                      </strong>
                      <p className="line-clamp-2 leading-relaxed font-sans">
                        {article.argumentBlueprint.centralIdea}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>By {article.author.slice(0, 20)}</span>
                      <span>~{article.estimatedReadingTimeMinutes} mins • {article.wordCount} words</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={article.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 shrink-0"
                      >
                        <span>Original</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <Link href={`/reading-room/${article.id}`}>
                        <Button
                          size="sm"
                          className={`text-xs h-8 gap-1 ${
                            hasQuestions
                              ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                              : "variant-outline"
                          }`}
                        >
                          {hasQuestions ? (
                            <>
                              <span>Read + Practice (5 Qs)</span>
                              <ArrowRight className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              <span>Begin Reading</span>
                              <ArrowRight className="h-3 w-3" />
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center text-xs text-zinc-400 font-mono space-y-2">
            <p>No suitable articles match your current source or topic filter.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedSource("All");
                setSelectedTopic("All");
                setSelectedDifficulty("All");
                setSelectedModeFilter("All");
                setSearchQuery("");
              }}
              className="text-xs"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
