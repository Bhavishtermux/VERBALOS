"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  Clock,
  ExternalLink,
  Layers,
  Award,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  FileText,
  Lightbulb,
  ArrowRight,
  PenTool,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReadingRoomPage() {
  const { rcPassages } = useRc();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [activePassageId, setActivePassageId] = useState<string | null>(null);

  // Active Reading Journal state
  const [thesisNote, setThesisNote] = useState<string>("");
  const [toneNote, setToneNote] = useState<string>("");
  const [oneLineSummary, setOneLineSummary] = useState<string>("");
  const [isSavedJournal, setIsSavedJournal] = useState<boolean>(false);

  const genres = useMemo(() => {
    const set = new Set<string>();
    rcPassages.forEach((p) => {
      if (p.topic) set.add(p.topic);
    });
    return ["All", ...Array.from(set)];
  }, [rcPassages]);

  const filteredPassages = useMemo(() => {
    return rcPassages.filter((p) => {
      const matchQuery =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.author || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchGenre = selectedGenre === "All" || p.topic === selectedGenre;
      return matchQuery && matchGenre;
    });
  }, [rcPassages, searchQuery, selectedGenre]);

  const activePassage = useMemo(() => {
    return rcPassages.find((p) => p.id === activePassageId) || null;
  }, [rcPassages, activePassageId]);

  const handleOpenReader = (pId: string) => {
    setActivePassageId(pId);
    setThesisNote("");
    setToneNote("");
    setOneLineSummary("");
    setIsSavedJournal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveActiveNotes = () => {
    setIsSavedJournal(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200/80 pb-5 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> CAT Intellectual Stamina
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">Active Long-Form Reading Room</span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
            Reading Room
          </h1>
          <p className="mt-1 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Diverse, intellectually challenging long-form essays (Aeon, The Atlantic, Nature, Smithsonian, London Review of Books). Practice active mental mapping and argument extraction.
          </p>
        </div>

        {activePassage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActivePassageId(null)}
            className="text-xs font-mono self-start md:self-auto"
          >
            ← Back to Reading Catalog
          </Button>
        )}
      </div>

      {!activePassage ? (
        /* 1. CATALOG BROWSER */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search essays, authors, theories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                    selectedGenre === g
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Passage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPassages.map((p) => (
              <Card
                key={p.id}
                className="flex flex-col justify-between p-4 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:border-zinc-400 transition-all cursor-pointer group"
                onClick={() => handleOpenReader(p.id)}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                      {p.source}
                    </Badge>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {p.wordCount} words • ~{p.estimatedMinutes}m read
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                    {p.content.slice(0, 180)}...
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <span className="font-mono text-[11px] text-zinc-400">{p.topic}</span>
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read in Reader</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* 2. ACTIVE READER MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Essay Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-mono uppercase">
                  {activePassage.source}
                </Badge>
                <Badge variant="neutral" className="text-xs font-mono">
                  {activePassage.topic}
                </Badge>
                <span className="text-xs font-mono text-zinc-400">
                  {activePassage.wordCount} words
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-tight">
                {activePassage.title}
              </h2>
              {activePassage.author && (
                <p className="text-xs font-mono text-zinc-500">By {activePassage.author}</p>
              )}
            </div>

            {/* Formatted Essay Content */}
            <div className="font-serif text-sm md:text-base leading-relaxed md:leading-loose text-zinc-800 dark:text-zinc-200 space-y-5 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              {activePassage.content.split("\n\n").map((para, pIdx) => (
                <p key={pIdx} className="indent-4 first:indent-0">
                  {para}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Link href={`/practice/${activePassage.id}`}>
                <Button className="gap-2 font-mono text-xs">
                  <span>Solve Full 4-Question Drill for this Passage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Active Mental Mapping Journal */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  <PenTool className="h-4 w-4 text-amber-600" />
                  <span>Active Mental Mapping</span>
                </div>
                <Badge variant="warning" className="text-[10px] font-mono">
                  Comprehension Drill
                </Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-mono uppercase font-bold text-[10px] text-zinc-400 block mb-1">
                    1. Primary Thesis / Central Argument:
                  </label>
                  <textarea
                    rows={2}
                    value={thesisNote}
                    onChange={(e) => setThesisNote(e.target.value)}
                    placeholder="What is the author trying to prove or establish?"
                    className="w-full text-xs font-sans p-2.5 rounded-lg border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase font-bold text-[10px] text-zinc-400 block mb-1">
                    2. Author Tone &amp; Stance:
                  </label>
                  <input
                    type="text"
                    value={toneNote}
                    onChange={(e) => setToneNote(e.target.value)}
                    placeholder="e.g. Critical, Skeptical, Analytical, Eulogistic"
                    className="w-full text-xs font-sans p-2 rounded-lg border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase font-bold text-[10px] text-zinc-400 block mb-1">
                    3. One-Sentence Conceptual Summary:
                  </label>
                  <textarea
                    rows={2}
                    value={oneLineSummary}
                    onChange={(e) => setOneLineSummary(e.target.value)}
                    placeholder="Summarize the core movement in one clean sentence..."
                    className="w-full text-xs font-sans p-2.5 rounded-lg border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={handleSaveActiveNotes}
                    className="w-full text-xs font-mono gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isSavedJournal ? "Notes Saved!" : "Record Reading Reflection"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
