"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ArrowUpDown,
  BookMarked,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  RotateCw,
  ExternalLink,
  ChevronRight,
  Clock,
  Cloud,
  ArrowRight,
} from "lucide-react";
import {
  getSavedVocabWords,
  UserSavedVocabWord,
} from "@/lib/vocabulary";
import { useAuth } from "@/context/auth-context";
import { fetchUserVocabularyCloud } from "@/lib/supabase/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

export default function VocabularyPage() {
  const { user } = useAuth();
  const [savedWords, setSavedWords] = useState<UserSavedVocabWord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "most_viewed" | "alphabetical">("newest");
  const [selectedDetailWord, setSelectedDetailWord] = useState<UserSavedVocabWord | null>(null);

  // Daily Vocabulary Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewList, setReviewList] = useState<UserSavedVocabWord[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isMeaningRevealed, setIsMeaningRevealed] = useState(false);

  const handleStartDailyReview = () => {
    if (savedWords.length === 0) return;
    // Pick up to 8 words prioritizing most viewed
    const sorted = [...savedWords].sort((a, b) => (b.viewCount || 1) - (a.viewCount || 1));
    setReviewList(sorted.slice(0, 8));
    setReviewIndex(0);
    setIsMeaningRevealed(false);
    setIsReviewOpen(true);
  };

  const handleNextReviewWord = () => {
    if (reviewIndex < reviewList.length - 1) {
      setReviewIndex(reviewIndex + 1);
      setIsMeaningRevealed(false);
    } else {
      setIsReviewOpen(false);
    }
  };

  // Load from Supabase Cloud or LocalStorage on mount
  useEffect(() => {
    let isMounted = true;

    const loadWords = async () => {
      // 1. Initial load from local store
      const localWords = getSavedVocabWords();
      if (isMounted) {
        setSavedWords(localWords);
      }

      // 2. If authenticated, fetch cloud vocabulary from Supabase
      if (user?.id) {
        try {
          const cloudWords = await fetchUserVocabularyCloud(user.id);
          if (isMounted && cloudWords && cloudWords.length > 0) {
            // Merge cloud words with local
            const map = new Map<string, UserSavedVocabWord>();
            localWords.forEach((w) => map.set(w.word.toLowerCase(), w));
            cloudWords.forEach((w) => map.set(w.word.toLowerCase(), w));
            const merged = Array.from(map.values());
            setSavedWords(merged);
          }
        } catch (e) {
          console.warn("Could not fetch cloud vocabulary", e);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadWords();

    // Listen for storage events across tabs or local updates
    window.addEventListener("storage", loadWords);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadWords);
    };
  }, [user]);

  // Filter and sort words
  const filteredWords = useMemo(() => {
    return savedWords
      .filter((w) => {
        const q = searchQuery.toLowerCase();
        return (
          w.word.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          (w.example && w.example.toLowerCase().includes(q)) ||
          w.sourceRcTitle.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.dateLookedUp).getTime() - new Date(a.dateLookedUp).getTime();
        }
        if (sortBy === "most_viewed") {
          return (b.viewCount || 1) - (a.viewCount || 1);
        }
        if (sortBy === "alphabetical") {
          return a.word.localeCompare(b.word);
        }
        return 0;
      });
  }, [savedWords, searchQuery, sortBy]);

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Vocabulary Repository
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">
              {savedWords.length} Words Captured
            </span>
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
            My Vocabulary
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            All words looked up during your Reading Comprehension practice sessions, synced across all your devices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {savedWords.length > 0 && (
            <Button
              size="sm"
              onClick={handleStartDailyReview}
              className="gap-1.5 text-xs h-8 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Daily Review (5-8 Words)</span>
            </Button>
          )}
          <Link href="/practice">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Practice RC</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm">
          <span className="text-xs font-medium text-zinc-400 uppercase font-mono">
            Total Words Captured
          </span>
          <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {savedWords.length}
          </p>
          <span className="text-[11px] text-zinc-500">Indexed from RC reading</span>
        </div>

        <div className="rounded-lg border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm">
          <span className="text-xs font-medium text-zinc-400 uppercase font-mono">
            Total Lookups
          </span>
          <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {savedWords.reduce((acc, cur) => acc + (cur.viewCount || 1), 0)}
          </p>
          <span className="text-[11px] text-zinc-500">Cumulative reference count</span>
        </div>

        <div className="rounded-lg border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm">
          <span className="text-xs font-medium text-zinc-400 uppercase font-mono">
            Active Sources
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {new Set(savedWords.map((w) => w.sourceRcTitle)).size} RCs
          </p>
          <span className="text-[11px] text-zinc-500">Diverse academic essays</span>
        </div>
      </div>

      {/* Toolbar: Search & Sort */}
      <div className="space-y-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="relative sm:col-span-8">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search word, meaning, example, or source RC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="sm:col-span-4">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs"
            >
              <option value="newest">Sort: Newest Added</option>
              <option value="most_viewed">Sort: Most Viewed</option>
              <option value="alphabetical">Sort: Alphabetical (A-Z)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards List */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent mx-auto dark:border-zinc-100" />
          <p className="text-xs text-zinc-400 font-mono">Loading cloud-synced vocabulary...</p>
        </div>
      ) : filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between transition-all hover:border-zinc-300 hover:shadow-sm dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                        {item.word}
                      </h3>
                      {item.partOfSpeech && (
                        <span className="text-[11px] font-mono italic text-zinc-400">
                          ({item.partOfSpeech})
                        </span>
                      )}
                    </div>
                    {item.pronunciation && (
                      <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                        {item.pronunciation}
                      </span>
                    )}
                  </div>

                  <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                    Viewed {item.viewCount || 1}x
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-1">
                {/* Meaning */}
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                  {item.meaning}
                </p>

                {/* Example Sentence */}
                {item.example && (
                  <div className="rounded-md bg-zinc-50 p-2.5 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 block mb-1">
                      Example:
                    </span>
                    <p className="font-serif italic text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      &ldquo;{item.example}&rdquo;
                    </p>
                  </div>
                )}

                {/* Metadata: Source RC & Date */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="flex items-center gap-1 truncate max-w-[200px]" title={item.sourceRcTitle}>
                    <BookMarked className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.sourceRcTitle}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="h-3 w-3" /> {formatDate(item.dateLookedUp)}
                  </span>
                </div>

                {/* Action: View details button */}
                <div className="pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDetailWord(item)}
                    className="w-full text-xs h-8 gap-1"
                  >
                    <span>View details</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 mb-2">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold font-serif text-zinc-800 dark:text-zinc-200">
              Words you look up while reading will appear here.
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Tap any word inside an RC passage during practice to instantly view its meaning and capture it to your vocabulary list across all devices.
            </p>
            <div className="pt-2">
              <Link href="/practice">
                <Button size="sm" className="text-xs">
                  Go to RC Practice to Start Reading
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary Detail Modal */}
      {selectedDetailWord && (
        <Modal
          isOpen={!!selectedDetailWord}
          onClose={() => setSelectedDetailWord(null)}
          title={selectedDetailWord.word.toUpperCase()}
          description={`Source: ${selectedDetailWord.sourceRcTitle}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            {/* Header Word */}
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <h2 className="text-xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                {selectedDetailWord.word}
              </h2>
            </div>

            {/* Meaning */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 block">
                Meaning:
              </span>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                {selectedDetailWord.meaning}
              </p>
            </div>

            {/* Part of Speech & Pronunciation */}
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Part of Speech:
                </span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
                  {selectedDetailWord.partOfSpeech || "Noun"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Pronunciation:
                </span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">
                  {selectedDetailWord.pronunciation || "—"}
                </span>
              </div>
            </div>

            {/* Abbreviation */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                Abbreviation:
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
                {selectedDetailWord.abbreviation || "No commonly used abbreviation"}
              </p>
            </div>

            {/* Example Usage */}
            {selectedDetailWord.example && (
              <div className="rounded-lg border border-zinc-200/70 dark:border-zinc-800 p-3 space-y-1 bg-white dark:bg-zinc-900">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                  Example:
                </span>
                <p className="font-serif italic text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  &ldquo;{selectedDetailWord.example}&rdquo;
                </p>
              </div>
            )}

            {/* Synonyms */}
            {selectedDetailWord.synonyms && selectedDetailWord.synonyms.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                  Synonyms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailWord.synonyms.map((syn) => (
                    <Badge key={syn} variant="secondary" className="text-[11px] font-normal lowercase">
                      {syn}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Antonyms */}
            {selectedDetailWord.antonyms && selectedDetailWord.antonyms.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                  Antonyms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailWord.antonyms.map((ant) => (
                    <Badge key={ant} variant="neutral" className="text-[11px] font-normal lowercase">
                      {ant}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 font-mono">
              <span>Viewed {selectedDetailWord.viewCount || 1} times</span>
              <Button size="sm" variant="outline" onClick={() => setSelectedDetailWord(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Daily Vocabulary Active Recall Review Modal */}
      {isReviewOpen && reviewList.length > 0 && (
        <Modal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          title={`Daily Vocabulary Review (${reviewIndex + 1} of ${reviewList.length})`}
          description="Test your memory of academic words encountered during RC practice"
          maxWidth="md"
        >
          <div className="space-y-5 py-3">
            {/* Word Display */}
            <div className="text-center p-6 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                What does this academic term mean?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                {reviewList[reviewIndex]?.word}
              </h2>
              {reviewList[reviewIndex]?.partOfSpeech && (
                <span className="text-xs font-mono text-zinc-400 italic block">
                  ({reviewList[reviewIndex]?.partOfSpeech})
                </span>
              )}
            </div>

            {/* Revealed Meaning & Context */}
            {isMeaningRevealed ? (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                    Definition:
                  </span>
                  <p className="text-sm font-serif text-zinc-900 dark:text-zinc-100 leading-relaxed font-semibold">
                    {reviewList[reviewIndex]?.meaning}
                  </p>

                  {reviewList[reviewIndex]?.example && (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block">RC Context Example:</span>
                      <p className="font-serif italic text-zinc-700 dark:text-zinc-300 pt-0.5 leading-relaxed">
                        &ldquo;{reviewList[reviewIndex]?.example}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-zinc-400">
                    Word {reviewIndex + 1} of {reviewList.length}
                  </span>
                  <Button onClick={handleNextReviewWord} className="text-xs font-semibold gap-1.5 h-9">
                    <span>{reviewIndex < reviewList.length - 1 ? "Next Word" : "Finish Review"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <Button
                  onClick={() => setIsMeaningRevealed(true)}
                  className="w-full text-xs font-semibold h-11 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Reveal Definition & Context
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
