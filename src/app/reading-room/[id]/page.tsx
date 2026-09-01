"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  X,
  RotateCcw,
  Sparkles,
  Zap,
  Bookmark,
  Share2,
  Lightbulb,
  Layers,
  HelpCircle,
  Compass,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSourceArticleById } from "@/lib/source-discovery";
import { saveReadingRecord } from "@/lib/source-recommendations";
import { lookupWord, fetchWordDefinition, VocabLookupResult, saveLookedUpWord } from "@/lib/vocabulary";
import { RealSourceArticle } from "@/lib/sources/types";

interface SelectedWordState {
  word: string;
  data: VocabLookupResult;
  rect: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
}

type WordClickHandler = (word: string, e: React.MouseEvent<HTMLElement>) => void;

interface InteractiveParagraphProps {
  text: string;
  pIdx: number;
  selectedWord: SelectedWordState | null;
  onWordClick: WordClickHandler;
}

function InteractiveParagraph({
  text,
  pIdx,
  selectedWord,
  onWordClick,
}: InteractiveParagraphProps) {
  const tokens = text.split(new RegExp("(\\s+)", "g"));
  return (
    <p key={pIdx} className="mb-4 leading-relaxed font-serif text-base text-zinc-800 dark:text-zinc-200">
      {tokens.map((token, tIdx) => {
        if (!token || token.trim().length === 0) return token;
        const clean = token.replace(new RegExp("[^a-zA-Z-]", "g"), "");
        const isHighlighted = Boolean(selectedWord && selectedWord.word.toLowerCase() === clean.toLowerCase());

        return (
          <span
            key={tIdx}
            onClick={(e) => onWordClick(clean, e)}
            className={
              isHighlighted
                ? "cursor-pointer rounded-[2px] transition-colors bg-amber-200 text-amber-950 dark:bg-amber-900/80 dark:text-amber-100"
                : "cursor-pointer rounded-[2px] transition-colors hover:bg-amber-100 hover:text-amber-950 dark:hover:bg-amber-950/60 dark:hover:text-amber-200"
            }
          >
            {token}
          </span>
        );
      })}
    </p>
  );
}

export default function SourceArticleReadingPage() {
  const params = useParams();
  const router = useRouter();

  const articleId = params?.id as string;
  const article: RealSourceArticle | undefined = useMemo(() => {
    return getSourceArticleById(articleId);
  }, [articleId]);

  // Stage: "preview" | "reading" | "reflection" | "questions" | "results"
  const [stage, setStage] = useState<"preview" | "reading" | "reflection" | "questions" | "results">("preview");

  // Timer & Speed State
  const [readingSeconds, setReadingSeconds] = useState<number>(0);
  const [isReadingTimerActive, setIsReadingTimerActive] = useState<boolean>(false);
  const [finalReadingDuration, setFinalReadingDuration] = useState<number>(0);
  const [calculatedWpm, setCalculatedWpm] = useState<number>(0);

  // Active Mental Mapping State
  const [mentalMapThesis, setMentalMapThesis] = useState<string>("");
  const [mentalMapTone, setMentalMapTone] = useState<string>("");
  const [mentalMapSummary, setMentalMapSummary] = useState<string>("");
  const [showArgumentBlueprint, setShowArgumentBlueprint] = useState<boolean>(false);

  // Question solving state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<boolean>(false);

  // Vocabulary Lookup State
  const [selectedWord, setSelectedWord] = useState<SelectedWordState | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);
  const [savedSuccessWord, setSavedSuccessWord] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Check mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reading timer interval
  useEffect(() => {
    if (isReadingTimerActive) {
      timerRef.current = setInterval(() => {
        setReadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isReadingTimerActive]);

  // Click outside to dismiss word popup
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedWord(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Handle word click for vocabulary popup with live dictionary lookup
  const handleWordClick = async (word: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const cleanWord = word.replace(new RegExp("[^a-zA-Z-]", "g"), "").trim();
    if (!cleanWord || cleanWord.length < 2) return;

    const initialData = lookupWord(cleanWord);
    const rect = e.currentTarget.getBoundingClientRect();

    setSelectedWord({
      word: cleanWord,
      data: initialData,
      rect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      },
    });

    // If not from curated cache or marked as fetching, resolve from dictionary API
    if (!initialData.isCurated || initialData.isFetching) {
      const realData = await fetchWordDefinition(cleanWord);
      setSelectedWord((prev) => {
        if (prev && prev.word.toLowerCase() === cleanWord.toLowerCase()) {
          return {
            ...prev,
            data: realData,
          };
        }
        return prev;
      });
    }
  };

  const handleStartReading = () => {
    setStage("reading");
    setReadingSeconds(0);
    setIsReadingTimerActive(true);
  };

  const handleFinishReading = () => {
    setIsReadingTimerActive(false);
    setFinalReadingDuration(readingSeconds);
    const wpm = article ? Math.round((article.wordCount / Math.max(readingSeconds, 1)) * 60) : 250;
    setCalculatedWpm(wpm);

    if (article) {
      saveReadingRecord({
        articleId: article.id,
        source: article.source,
        topic: article.topic,
        startedAt: new Date(Date.now() - readingSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        readingDurationSeconds: readingSeconds,
        calculatedWpm: wpm,
        modeUsed: article.practiceQuestions && article.practiceQuestions.length > 0 ? "Read + Practice" : "Read Only",
      });
    }

    setStage("reflection");
  };

  const handleProceedToQuestions = () => {
    setStage("questions");
    setCurrentQuestionIndex(0);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitAllQuestions = () => {
    setStage("results");
    setShowExplanations(true);
  };

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 mx-auto text-amber-500" />
        <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
          Article Not Found
        </h2>
        <p className="text-xs text-zinc-500 font-sans">
          The requested essay could not be located in the real-world source library.
        </p>
        <Link href="/reading-room">
          <Button size="sm" variant="outline">
            Return to Reading Room
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate Contextual Popup Position on Desktop (Viewport-Safe Clamping)
  const popupStyle = useMemo(() => {
    if (!selectedWord || isMobileScreen) return {};

    const { rect } = selectedWord;
    const winWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const winHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const popupWidth = Math.min(320, winWidth - 32);
    const popupEstimatedHeight = 220;
    const padding = 16;

    // Horizontal positioning: Center over word, strictly clamped within viewport boundaries
    let left = rect.left + rect.width / 2 - popupWidth / 2;
    if (left + popupWidth > winWidth - padding) {
      left = winWidth - popupWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    // Vertical positioning: Default below word, fallback to above if near bottom
    let top = rect.bottom + 8;
    if (top + popupEstimatedHeight > winHeight - padding) {
      const spaceAbove = rect.top - padding;
      if (spaceAbove > popupEstimatedHeight) {
        top = rect.top - popupEstimatedHeight - 8;
      } else {
        top = Math.max(padding, winHeight - popupEstimatedHeight - padding);
      }
    }

    return {
      position: "fixed" as const,
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      width: `${popupWidth}px`,
      maxWidth: `calc(100vw - 32px)`,
      zIndex: 9999,
    };
  }, [selectedWord, isMobileScreen]);

  const questions = article.practiceQuestions || [];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  let correctCount = 0;
  if (stage === "results") {
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Top Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <Link
          href="/reading-room"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Reading Room
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] font-mono uppercase">
            {article.source}
          </Badge>
          <Badge variant="neutral" className="text-[10px] font-mono">
            {article.topic}
          </Badge>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1"
          >
            <span>Original URL</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* STAGE 1: PREVIEW & ATTRIBUTION */}
      {stage === "preview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{article.source}</span>
              <span>•</span>
              <span>Published {article.publicationDate}</span>
              <span>•</span>
              <span>{article.wordCount} words</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-sm font-serif text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span>By <strong>{article.author}</strong></span>
              {article.authorBio && <span className="text-zinc-400">({article.authorBio})</span>}
            </div>
          </div>

          <Card className="p-5 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-sm">
            <div>
              <span className="font-mono text-[10px] uppercase text-zinc-400 block font-bold">
                CAT Argument Blueprint
              </span>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100 pt-0.5">
                Central Thesis &amp; Rhetorical Structure
              </h3>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-2">
              <div>
                <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-[11px] block">
                  Core Argument:
                </strong>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-0.5">
                  {article.argumentBlueprint.centralIdea}
                </p>
              </div>

              <div>
                <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-[11px] block">
                  Author Stance:
                </strong>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-0.5">
                  {article.argumentBlueprint.authorPosition}
                </p>
              </div>

              <div>
                <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-[11px] block">
                  Tone &amp; Register:
                </strong>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pt-0.5">
                  {article.argumentBlueprint.tone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">Reading Time</span>
                <strong className="text-zinc-800 dark:text-zinc-200">~{article.estimatedReadingTimeMinutes} mins</strong>
              </div>
              <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">Difficulty</span>
                <strong className="text-zinc-800 dark:text-zinc-200">{article.difficulty}</strong>
              </div>
              <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">CAT Questions</span>
                <strong className="text-zinc-800 dark:text-zinc-200">{questions.length} Questions</strong>
              </div>
              <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase block">Quality Score</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{article.qualityScore.overallScore}/10</strong>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1.5"
              >
                <span>Read Full Essay on {article.source}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <Button
                size="lg"
                onClick={handleStartReading}
                className="w-full sm:w-auto text-xs px-6 h-10 gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm"
              >
                <span>Begin Active Reading</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* STAGE 2: ACTIVE READING MODE */}
      {stage === "reading" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="sticky top-2 z-20 flex items-center justify-between rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur border border-zinc-200/80 dark:border-zinc-800 px-4 py-2.5 shadow-sm text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Reading Pace: <strong>{Math.floor(readingSeconds / 60)}m {readingSeconds % 60}s</strong></span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-500">Target: ~{article.estimatedReadingTimeMinutes}m</span>
            </div>

            <Button
              size="sm"
              onClick={handleFinishReading}
              className="text-xs h-7 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
            >
              Finish Reading →
            </Button>
          </div>

          <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h1 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-snug">
              {article.title}
            </h1>
            <p className="text-xs font-mono text-zinc-500">
              By {article.author} • {article.source} • Tap any word to view definition
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none text-justify">
            {(article.contentExcerpt || article.fullContent || article.description)
              .split("\n\n")
              .map((p, pIdx) => (
                <InteractiveParagraph
                  key={pIdx}
                  text={p}
                  pIdx={pIdx}
                  selectedWord={selectedWord}
                  onWordClick={handleWordClick}
                />
              ))}
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <Button
              size="lg"
              onClick={handleFinishReading}
              className="text-xs px-6 h-10 gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm"
            >
              <span>Done Reading — Next: Reflection &amp; Practice</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STAGE 3: ACTIVE REFLECTION & MENTAL MAPPING */}
      {stage === "reflection" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase text-zinc-400 font-bold block">
                  Active Reading Debrief
                </span>
                <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100 pt-0.5">
                  Reading Calibrated: {calculatedWpm} WPM ({Math.floor(finalReadingDuration / 60)}m {finalReadingDuration % 60}s)
                </h3>
              </div>
              <Badge variant="success" className="text-[10px] font-mono">
                Pace Recorded
              </Badge>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-zinc-700 dark:text-zinc-300 block">
                  1. What is the author&apos;s primary thesis / central argument?
                </label>
                <textarea
                  value={mentalMapThesis}
                  onChange={(e) => setMentalMapThesis(e.target.value)}
                  placeholder="Summarize the core claim in your own words..."
                  className="w-full h-20 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-2.5 text-xs focus:ring-1 focus:ring-zinc-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold text-zinc-700 dark:text-zinc-300 block">
                  2. What is the author&apos;s primary tone &amp; rhetorical purpose?
                </label>
                <input
                  type="text"
                  value={mentalMapTone}
                  onChange={(e) => setMentalMapTone(e.target.value)}
                  placeholder="e.g. Critical, reflective, cautionary, analytically persuasive..."
                  className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-2.5 text-xs focus:ring-1 focus:ring-zinc-400 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setShowArgumentBlueprint(!showArgumentBlueprint)}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
              >
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span>{showArgumentBlueprint ? "Hide Author Blueprint" : "Compare with Author Blueprint"}</span>
              </button>

              {questions.length > 0 ? (
                <Button
                  size="sm"
                  onClick={handleProceedToQuestions}
                  className="w-full sm:w-auto text-xs h-9 px-5 gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm"
                >
                  <span>Proceed to CAT Practice ({questions.length} Qs)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Link href="/reading-room">
                  <Button size="sm" className="w-full sm:w-auto text-xs h-9 px-5">
                    Save &amp; Return to Reading Room
                  </Button>
                </Link>
              )}
            </div>

            {showArgumentBlueprint && (
              <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-2 animate-in fade-in duration-200">
                <span className="font-mono text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 block">
                  Reference Blueprint (VerbalOS Curriculum Analysis)
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  <strong>Thesis:</strong> {article.argumentBlueprint.centralIdea}
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  <strong>Tone:</strong> {article.argumentBlueprint.tone}
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* STAGE 4: CAT QUESTIONS PRACTICE */}
      {stage === "questions" && questions.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-mono">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <Badge variant="neutral" className="text-[10px] font-mono">
                {questions[currentQuestionIndex].type}
              </Badge>
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Answered: {answeredCount} / {questions.length}
            </span>
          </div>

          <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 leading-snug">
              {questions[currentQuestionIndex].questionText}
            </h3>

            <div className="space-y-2.5 text-xs">
              {questions[currentQuestionIndex].options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                const letter = ["A", "B", "C", "D"][optIdx];

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                    className={`w-full p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800 font-medium text-zinc-950 dark:text-zinc-50 shadow-sm"
                        : "border-zinc-200/80 bg-white hover:bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="font-mono font-bold shrink-0">{letter}.</span>
                    <span className="leading-relaxed flex-1 font-sans">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="text-xs h-8"
              >
                Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="text-xs h-8"
                >
                  Next Question →
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSubmitAllQuestions}
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Submit &amp; View Diagnostic Explanations
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* STAGE 5: RESULTS & 6-PART EXPLANATIONS */}
      {stage === "results" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4 text-center">
            <span className="font-mono text-[10px] uppercase text-zinc-400 font-bold block">
              CAT Practice Scorecard
            </span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              {correctCount} / {questions.length} Correct
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              Score: <strong>{correctCount * 3 - (questions.length - correctCount)}</strong> / {questions.length * 3} (+3 / -1 standard CAT marking)
            </p>
          </Card>

          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
              Detailed Question Analysis &amp; Trap Breakdowns
            </h3>

            {questions.map((q, qIdx) => {
              const userChoice = selectedAnswers[qIdx];
              const isCorrect = userChoice === q.correctOptionIndex;

              return (
                <Card
                  key={q.id}
                  className={`p-5 space-y-4 border ${
                    isCorrect
                      ? "border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-zinc-900"
                      : "border-amber-200 dark:border-amber-900/40 bg-white dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs">Q{qIdx + 1}</span>
                      <Badge variant="neutral" className="text-[10px] font-mono">
                        {q.type}
                      </Badge>
                    </div>

                    <Badge variant={isCorrect ? "success" : "danger"} className="text-[10px] gap-1 font-semibold">
                      {isCorrect ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {isCorrect ? "Correct (+3)" : "Incorrect (-1)"}
                    </Badge>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                    {q.questionText}
                  </h4>

                  <div className="space-y-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const letter = ["A", "B", "C", "D"][optIdx];
                      const isOptionCorrect = optIdx === q.correctOptionIndex;
                      const isOptionSelected = optIdx === userChoice;

                      let optStyle = "bg-zinc-50 dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300";
                      if (isOptionCorrect) {
                        optStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 font-medium text-emerald-950 dark:text-emerald-200";
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 font-medium text-rose-950 dark:text-rose-200";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-lg border flex items-start gap-2.5 ${optStyle}`}>
                          <span className="font-mono font-bold shrink-0">{letter}.</span>
                          <span className="flex-1 leading-relaxed font-sans">{opt}</span>
                          {isOptionCorrect && <span className="font-mono text-[10px] uppercase font-bold text-emerald-600">[Correct]</span>}
                          {isOptionSelected && !isOptionCorrect && <span className="font-mono text-[10px] uppercase font-bold text-rose-600">[Your Choice]</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-1.5">
                    <span className="font-mono font-bold text-[10px] uppercase text-zinc-500 block">
                      Curriculum Explanation &amp; Distractor Audit:
                    </span>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                      {q.explanation}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
            <Link href="/reading-room">
              <Button variant="outline" size="sm" className="text-xs">
                Return to Reading Room
              </Button>
            </Link>

            <Link href="/practice">
              <Button size="sm" className="text-xs gap-1.5">
                <span>Continue Practice</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Vocabulary Contextual Popup (Compact & Informative) */}
      {selectedWord && !isMobileScreen && (
        <div
          ref={popupRef}
          style={popupStyle}
          className="fixed z-[9999] rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#141416] p-3.5 shadow-2xl text-xs space-y-2 animate-in fade-in-50 zoom-in-95 select-none"
        >
          {/* Top: WORD + Part of speech */}
          <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-1.5">
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50 leading-tight">
                {selectedWord.word}
              </h4>
              <span className="text-[10px] font-mono lowercase text-zinc-500 dark:text-zinc-400 block mt-0.5">
                {selectedWord.data.partOfSpeech?.toLowerCase() || "noun"}
              </span>
            </div>
            <button
              onClick={() => setSelectedWord(null)}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Meaning: Simple definition */}
          <div className="text-xs text-zinc-850 dark:text-zinc-200 leading-snug font-sans">
            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Meaning: </strong>
            <span>{selectedWord.data.definition}</span>
          </div>

          {/* In context: Contextual nuance */}
          {selectedWord.data.inContext && (
            <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug font-sans">
              <strong className="font-semibold text-amber-700 dark:text-amber-400">In context: </strong>
              <span>{selectedWord.data.inContext}</span>
            </div>
          )}

          {/* Example sentence */}
          {selectedWord.data.example && (
            <div className="p-2 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-[11px] text-zinc-800 dark:text-zinc-200 italic font-serif leading-snug">
              &ldquo;{selectedWord.data.example}&rdquo;
            </div>
          )}

          {/* Footer with + Save Word */}
          <div className="pt-1.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-mono">
            <button
              onClick={() => {
                saveLookedUpWord(selectedWord.data, article.id, article.title);
                setSavedSuccessWord(selectedWord.word);
                setTimeout(() => setSavedSuccessWord(null), 2000);
              }}
              className="text-amber-600 hover:text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1"
            >
              <Bookmark className="h-3 w-3" />
              <span>{savedSuccessWord === selectedWord.word ? "Saved to Vocab!" : "+ Save to Vocab"}</span>
            </button>
            <span className="text-zinc-400">VerbalOS Lexicon</span>
          </div>
        </div>
      )}
    </div>
  );
}
