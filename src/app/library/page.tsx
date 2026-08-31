"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Filter,
  Bookmark,
  Clock,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowUpDown,
  LayoutGrid,
  List,
  Play,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { RCPassage, RCSource, RCTopic, RCDifficulty } from "@/types/rc";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function LibraryPage() {
  const { rcPassages, togglePassageFlag } = useRc();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sourcesList: RCSource[] = ["Aeon", "The Atlantic", "The Hindu"];

  const topicsList: RCTopic[] = [
    "Philosophy",
    "Economics",
    "Psychology",
    "Sociology",
    "Science",
    "Technology",
    "History",
    "Business",
    "Politics",
    "Culture",
    "Environment",
  ];

  const difficultiesList: RCDifficulty[] = ["Medium", "Hard", "CAT", "CAT+"];

  // Filtered and sorted passages
  const filteredPassages = useMemo(() => {
    return rcPassages
      .filter((p) => {
        // Search query
        const matchesQuery =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.author || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.topic || p.genre || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase());

        // Source filter
        const matchesSource =
          selectedSource === "All" || p.source === selectedSource;

        // Topic filter
        const matchesTopic =
          selectedTopic === "All" || p.topic === selectedTopic;

        // Difficulty filter
        const matchesDifficulty =
          selectedDifficulty === "All" || p.difficulty === selectedDifficulty;

        // Status filter
        let matchesStatus = true;
        if (selectedStatus === "completed") matchesStatus = !!p.completed;
        if (selectedStatus === "unattempted") matchesStatus = !p.completed;
        if (selectedStatus === "flagged") matchesStatus = !!p.flaggedForReview;

        return (
          matchesQuery &&
          matchesSource &&
          matchesTopic &&
          matchesDifficulty &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (selectedSort === "difficulty") {
          const diffOrder: Record<string, number> = {
            Medium: 1,
            Moderate: 1,
            Hard: 2,
            CAT: 3,
            "CAT Standard": 3,
            "CAT+": 4,
            Advanced: 4,
          };
          return (diffOrder[b.difficulty] || 0) - (diffOrder[a.difficulty] || 0);
        }
        if (selectedSort === "length-desc") return b.wordCount - a.wordCount;
        if (selectedSort === "length-asc") return a.wordCount - b.wordCount;
        if (selectedSort === "accuracy-asc") {
          return (a.lastScore?.accuracy ?? 100) - (b.lastScore?.accuracy ?? 100);
        }
        return 0;
      });
  }, [
    rcPassages,
    searchQuery,
    selectedSource,
    selectedTopic,
    selectedDifficulty,
    selectedStatus,
    selectedSort,
  ]);

  const completedCount = rcPassages.filter((p) => p.completed).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Passage Repository
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500">
              {completedCount} of {rcPassages.length} Completed
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            RC Library
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Curated, intellectually challenging long-form passages (700–1200 words) from Aeon, The Atlantic, and The Hindu styles.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 self-start md:self-auto rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-7 px-2.5 text-xs"
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1" /> Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-7 px-2.5 text-xs"
          >
            <List className="h-3.5 w-3.5 mr-1" /> List
          </Button>
        </div>
      </div>

      {/* Multi-Faceted Filter Toolbar */}
      <div className="space-y-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="relative lg:col-span-4 sm:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search title, author, topic, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Source filter */}
          <div className="lg:col-span-2 sm:col-span-1">
            <Select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Sources</option>
              {sourcesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>

          {/* Topic filter */}
          <div className="lg:col-span-2 sm:col-span-1">
            <Select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Topics</option>
              {topicsList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          {/* Difficulty filter */}
          <div className="lg:col-span-2 sm:col-span-1">
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Difficulties</option>
              {difficultiesList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2 sm:col-span-1">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="unattempted">Unattempted</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged for Review</option>
            </Select>
          </div>
        </div>

        {/* Quick Topic Chips Strip */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <span className="text-[11px] font-medium text-zinc-400 mr-1">Quick Topics:</span>
          <button
            onClick={() => setSelectedTopic("All")}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
              selectedTopic === "All"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            All Topics
          </button>
          {topicsList.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                selectedTopic === t
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Stats & Reset */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          Showing <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{filteredPassages.length}</strong> of {rcPassages.length} passages
        </span>
        {(searchQuery ||
          selectedSource !== "All" ||
          selectedTopic !== "All" ||
          selectedDifficulty !== "All" ||
          selectedStatus !== "All") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedSource("All");
              setSelectedTopic("All");
              setSelectedDifficulty("All");
              setSelectedStatus("All");
            }}
            className="h-6 text-xs text-amber-700 dark:text-amber-400 p-0 hover:bg-transparent hover:underline"
          >
            Reset all filters
          </Button>
        )}
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPassages.map((passage) => {
            const isCompleted = !!passage.completed;
            const isFlagged = !!passage.flaggedForReview;

            return (
              <Card
                key={passage.id}
                className="flex flex-col justify-between transition-all hover:border-zinc-300 hover:shadow-sm dark:hover:border-zinc-700"
              >
                <CardHeader className="pb-3">
                  {/* Badges: Source, Topic, Difficulty */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {passage.source}
                      </Badge>
                      <Badge variant="neutral" className="text-[10px]">
                        {passage.topic}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={
                          passage.difficulty === "CAT+"
                            ? "danger"
                            : passage.difficulty === "CAT"
                            ? "warning"
                            : passage.difficulty === "Hard"
                            ? "academic"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {passage.difficulty}
                      </Badge>
                      <button
                        onClick={() => togglePassageFlag(passage.id)}
                        className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                          isFlagged
                            ? "text-amber-500 fill-amber-500"
                            : "text-zinc-400 hover:text-zinc-600"
                        }`}
                        title={isFlagged ? "Flagged for review" : "Flag for review"}
                      >
                        <Bookmark className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  <CardTitle className="mt-2.5 text-sm font-semibold leading-snug font-serif line-clamp-2">
                    {passage.title}
                  </CardTitle>
                  <CardDescription className="text-[11px] text-zinc-400 font-mono">
                    By {passage.author}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Excerpt preview */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed font-serif">
                    {passage.content.slice(0, 220)}...
                  </p>

                  {/* Metadata line: Word count, Est. Reading Time, Questions count */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {passage.wordCount} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> ~{passage.estimatedMinutes}m read
                    </span>
                    <span>{passage.questions?.length ?? passage.questionsCount ?? 5} Questions</span>
                  </div>

                  {/* Previous Score if available */}
                  {passage.lastScore ? (
                    <div className="flex items-center justify-between rounded-md bg-zinc-50 p-2 text-xs dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                      <span className="text-zinc-500 font-mono text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Prev Score:
                      </span>
                      <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                        {passage.lastScore.correct}/{passage.lastScore.total} ({passage.lastScore.accuracy}%)
                        {passage.lastScore.wpm ? ` • ${passage.lastScore.wpm} WPM` : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-md bg-zinc-50/50 p-2 text-[11px] text-zinc-400 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 text-center font-mono">
                      Not attempted yet
                    </div>
                  )}

                  {/* Start RC Button */}
                  <Link href={`/practice/${passage.id}`} className="block pt-1">
                    <Button className="w-full gap-2 text-xs h-9 font-medium">
                      <Play className="h-3.5 w-3.5 fill-current" />
                      {isCompleted ? "Retake RC" : "Start RC"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-mono text-[11px]">
                    <th className="p-4 font-normal">Title & Author</th>
                    <th className="p-4 font-normal">Source</th>
                    <th className="p-4 font-normal">Topic</th>
                    <th className="p-4 font-normal">Difficulty</th>
                    <th className="p-4 font-normal">Length</th>
                    <th className="p-4 font-normal">Questions</th>
                    <th className="p-4 font-normal">Previous Score</th>
                    <th className="p-4 text-right font-normal">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredPassages.map((passage) => (
                    <tr key={passage.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                      <td className="p-4 font-serif font-medium text-zinc-900 dark:text-zinc-100 max-w-xs">
                        <div>{passage.title}</div>
                        <div className="text-[11px] font-sans text-zinc-400 font-normal">
                          By {passage.author}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {passage.source}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="neutral" className="text-[10px]">
                          {passage.topic}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            passage.difficulty === "CAT+"
                              ? "danger"
                              : passage.difficulty === "CAT"
                              ? "warning"
                              : passage.difficulty === "Hard"
                              ? "academic"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {passage.difficulty}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-zinc-500 text-[11px]">
                        {passage.wordCount}w (~{passage.estimatedMinutes}m)
                      </td>
                      <td className="p-4 font-mono text-zinc-500 text-[11px]">
                        {passage.questions?.length ?? passage.questionsCount ?? 5} Qs
                      </td>
                      <td className="p-4 font-mono">
                        {passage.lastScore ? (
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {passage.lastScore.accuracy}% ({passage.lastScore.correct}/{passage.lastScore.total})
                          </span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePassageFlag(passage.id)}
                            className={`p-1 rounded ${
                              passage.flaggedForReview
                                ? "text-amber-500"
                                : "text-zinc-400 hover:text-zinc-600"
                            }`}
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-current" />
                          </button>
                          <Link href={`/practice/${passage.id}`}>
                            <Button size="sm" className="h-7 text-xs px-3 gap-1">
                              Start RC <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
