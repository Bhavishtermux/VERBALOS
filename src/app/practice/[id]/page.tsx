"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  FileText,
  HelpCircle,
  Play,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Zap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  BookMarked,
  Timer,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { useAuth } from "@/context/auth-context";
import { RCPassage, RCQuestion, RCSessionResult } from "@/types/rc";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  lookupWord,
  cleanWord,
  saveLookedUpWord,
  VocabLookupResult,
} from "@/lib/vocabulary";
import {
  syncPracticeSessionCloud,
  syncVocabularyWordCloud,
} from "@/lib/supabase/data-service";

interface SelectedWordState {
  raw: string;
  cleaned: string;
  result: VocabLookupResult;
  rect: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
}

export default function RcReadingPage() {
  const params = useParams();
  const router = useRouter();
  const { rcPassages, settings, togglePassageFlag } = useRc();
  const { user } = useAuth();

  const passageId = params?.id as string;
  const passage = rcPassages.find((p) => p.id === passageId);

  // Experience Stages: "preview" | "reading" | "questions"
  const [stage, setStage] = useState<"preview" | "reading" | "questions">("preview");

  // 1. Reading Timer State (Independent Countdown)
  const [readingSeconds, setReadingSeconds] = useState<number>(0);
  const [isReadingActive, setIsReadingActive] = useState<boolean>(false);
  const [finalReadingDuration, setFinalReadingDuration] = useState<number>(0);
  const [calculatedWpm, setCalculatedWpm] = useState<number>(0);

  // Allocated budgets
  const allocatedReadingSeconds = useMemo(() => {
    return Math.max((passage?.estimatedMinutes || 6) * 60, 180);
  }, [passage]);

  const allocatedQuestionSeconds = useMemo(() => {
    return (passage?.questions?.length || 5) * 90; // 1.5 mins per question = 7:30
  }, [passage]);

  // 2. Question Solving Timer State (Independent Countdown)
  const [questionSeconds, setQuestionSeconds] = useState<number>(0);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<string>("");

  // Vocabulary Lookup State
  const [selectedWord, setSelectedWord] = useState<SelectedWordState | null>(null);
  const [isDetailedVocabOpen, setIsDetailedVocabOpen] = useState<boolean>(false);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  // Question solving state (One question at a time)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showPassageInQuestions, setShowPassageInQuestions] = useState<boolean>(false);

  // Timer interval refs & popup ref
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Track window resize for mobile vs desktop positioning
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Continuous Reading Timer Effect (Runs ONLY during "reading" stage)
  useEffect(() => {
    if (isReadingActive) {
      readingTimerRef.current = setInterval(() => {
        setReadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current);
      }
    }

    return () => {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current);
      }
    };
  }, [isReadingActive]);

  // 2. Separate Question Solving Timer Effect (Runs ONLY during "questions" stage)
  useEffect(() => {
    if (isQuestionTimerActive) {
      questionTimerRef.current = setInterval(() => {
        setQuestionSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    }

    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, [isQuestionTimerActive]);

  // Format seconds as MM:SS
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(Math.max(totalSecs, 0) / 60);
    const secs = Math.max(totalSecs, 0) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Remaining Countdown Computations
  const readingCountdownRemaining = Math.max(allocatedReadingSeconds - readingSeconds, 0);
  const isReadingOvertime = readingSeconds > allocatedReadingSeconds;

  const questionCountdownRemaining = Math.max(allocatedQuestionSeconds - questionSeconds, 0);
  const isQuestionOvertime = questionSeconds > allocatedQuestionSeconds;

  // Click outside & Escape key listeners for Vocabulary popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedWord(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".vocab-word-token")
      ) {
        setSelectedWord(null);
      }
    };

    if (selectedWord) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedWord]);

  // Handler: Click "BEGIN READING"
  const handleBeginReading = () => {
    setReadingSeconds(0);
    setIsReadingActive(true);
    setStage("reading");

    // Scroll to top of passage
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Click a word token in the passage
  const handleWordClick = (rawToken: string, e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const cleaned = cleanWord(rawToken);

    if (!cleaned) return;

    // Lookup definition
    const result = lookupWord(cleaned);

    setSelectedWord({
      raw: rawToken,
      cleaned,
      result,
      rect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  // Handler: Click "View more →" in quick popup
  const handleOpenDetailedView = () => {
    if (!selectedWord || !passage) return;

    // Save word to user vocabulary in localStorage
    const savedItem = saveLookedUpWord(selectedWord.result, passage.id, passage.title);

    // Sync to Supabase cloud if user is logged in
    if (user?.id) {
      syncVocabularyWordCloud(user.id, savedItem);
    }

    // Open detail panel (Reading timer continues running uninterrupted!)
    setIsDetailedVocabOpen(true);
  };

  // Handler: Click "START QUESTIONS →"
  const handleStartQuestions = () => {
    // Close any open vocab popup
    setSelectedWord(null);
    setIsDetailedVocabOpen(false);

    // 1. Stop reading timer
    setIsReadingActive(false);
    if (readingTimerRef.current) {
      clearInterval(readingTimerRef.current);
    }

    // 2. Save reading duration & calculate WPM
    const durationSec = Math.max(readingSeconds, 1);
    setFinalReadingDuration(durationSec);

    const durationMinutes = durationSec / 60;
    const wpm = Math.round((passage?.wordCount || 800) / durationMinutes);
    setCalculatedWpm(wpm);

    // 3. Store reading data in localStorage
    if (passage) {
      const sessionData = {
        passageId: passage.id,
        passageTitle: passage.title,
        wordCount: passage.wordCount,
        readingTimeSeconds: durationSec,
        readingTimeFormatted: formatTimer(durationSec),
        wpm: wpm,
        completedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(
          `rc_lab_reading_session_${passage.id}`,
          JSON.stringify(sessionData)
        );
      } catch (err) {
        console.warn("Could not save reading session to localStorage", err);
      }
    }

    // 4. Start the SEPARATE question-solving timer
    const qStart = new Date().toISOString();
    setQuestionStartTime(qStart);
    setQuestionSeconds(0);
    setIsQuestionTimerActive(true);

    // 5. Navigate to Question screen
    setStage("questions");
    setCurrentQuestionIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Select an option for a question (changing answers allowed anytime before submission)
  const handleSelectOption = (qIndex: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  // Handler: Click "SUBMIT RC" on final question
  const handleSubmitRC = () => {
    if (!passage) return;

    // 1. Stop question solving timer
    setIsQuestionTimerActive(false);
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }

    const qEnd = new Date().toISOString();
    const qDurationSec = Math.max(questionSeconds, 1);
    const totalDurationSec = finalReadingDuration + qDurationSec;

    // 2. Calculate score and question breakdown
    let correctCount = 0;
    const breakdown = passage.questions.map((q, idx) => {
      const userChoice = selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : null;
      const isCorrect = userChoice === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        selectedOptionIndex: userChoice,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = passage.questions.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    // 3. Create persistent Session Result
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const sessionResult: RCSessionResult = {
      sessionId,
      passageId: passage.id,
      passageTitle: passage.title,
      passageTopic: passage.topic,
      passageSource: passage.source,
      passageDifficulty: passage.difficulty,
      author: passage.author,
      wordCount: passage.wordCount,
      readingTimeSeconds: finalReadingDuration,
      readingTimeFormatted: formatTimer(finalReadingDuration),
      readingWpm: calculatedWpm,
      questionStartTime,
      questionEndTime: qEnd,
      questionSolvingDurationSeconds: qDurationSec,
      questionSolvingDurationFormatted: formatTimer(qDurationSec),
      totalDurationSeconds: totalDurationSec,
      totalDurationFormatted: formatTimer(totalDurationSec),
      selectedAnswers,
      score: {
        correct: correctCount,
        total: totalQuestions,
        accuracy,
      },
      questionBreakdown: breakdown,
      timestamp: new Date().toISOString(),
    };

    // 4. Save to localStorage
    try {
      // Save individual session result
      localStorage.setItem(`rc_lab_session_${sessionId}`, JSON.stringify(sessionResult));

      // Append to all sessions list
      const existingSessionsRaw = localStorage.getItem("rc_lab_all_sessions");
      const allSessions: RCSessionResult[] = existingSessionsRaw ? JSON.parse(existingSessionsRaw) : [];
      allSessions.unshift(sessionResult);
      localStorage.setItem("rc_lab_all_sessions", JSON.stringify(allSessions));

      // Update passage in rcPassages list
      const passagesKey = "rc_lab_rc_passages_v2";
      const rawPassages = localStorage.getItem(passagesKey);
      if (rawPassages) {
        const storedList: RCPassage[] = JSON.parse(rawPassages);
        const updatedList = storedList.map((p) =>
          p.id === passage.id
            ? {
                ...p,
                completed: true,
                lastScore: {
                  correct: correctCount,
                  total: totalQuestions,
                  accuracy,
                  wpm: calculatedWpm,
                  date: new Date().toISOString().slice(0, 10),
                },
              }
            : p
        );
        localStorage.setItem(passagesKey, JSON.stringify(updatedList));
      }

      // Sync to Supabase Cloud if user is authenticated
      if (user?.id) {
        syncPracticeSessionCloud(sessionResult, user.id);
      }
    } catch (err) {
      console.warn("Could not save session result to localStorage", err);
    }

    // 5. Navigate immediately to /results/[sessionId]
    router.push(`/results/${sessionId}`);
  };

  // If passage is not found
  if (!passage) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="h-10 w-10 mx-auto text-amber-500" />
        <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
          Passage Not Found
        </h2>
        <p className="text-xs text-zinc-500">
          The requested reading comprehension passage could not be located in the library.
        </p>
        <Link href="/library">
          <Button size="sm" variant="outline">
            Return to RC Library
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate Contextual Popup Position on Desktop
  const popupStyle = useMemo(() => {
    if (!selectedWord || isMobileScreen) return {};

    const { rect } = selectedWord;
    const popupWidth = 280;
    const popupHeight = 130;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Horizontal positioning centered on word, clamped inside viewport
    let left = rect.left + scrollX + rect.width / 2 - popupWidth / 2;
    if (left < 16) left = 16;
    if (left + popupWidth > window.innerWidth - 16) {
      left = window.innerWidth - popupWidth - 16;
    }

    // Vertical positioning: Prefer above, fallback to below
    let top = rect.top + scrollY - popupHeight - 10;
    if (rect.top < popupHeight + 80) {
      top = rect.bottom + scrollY + 10;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${popupWidth}px`,
    };
  }, [selectedWord, isMobileScreen]);

  // =========================================================================
  // STAGE 1: RC PREVIEW PAGE
  // =========================================================================
  if (stage === "preview") {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to RC Library
          </Link>

          <button
            onClick={() => togglePassageFlag(passage.id)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 transition-colors ${
              passage.flaggedForReview
                ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 fill-current" />
            <span>{passage.flaggedForReview ? "Flagged for Review" : "Bookmark"}</span>
          </button>
        </div>

        {/* RC Preview Header Card */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 space-y-6">
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="text-xs font-mono uppercase bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              Source: {passage.source}
            </Badge>
            <Badge variant="neutral" className="text-xs">
              Topic: {passage.topic}
            </Badge>
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
              className="text-xs"
            >
              Difficulty: {passage.difficulty}
            </Badge>
          </div>

          {/* Title and Author */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              {passage.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">
              Authored by {passage.author} • Academic Essay Format
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 rounded-lg bg-zinc-50/80 p-4 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 text-center">
            <div>
              <span className="block text-[10px] sm:text-xs text-zinc-400 font-mono uppercase">
                Word Count
              </span>
              <span className="font-semibold font-mono text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                {passage.wordCount} words
              </span>
            </div>
            <div>
              <span className="block text-[10px] sm:text-xs text-zinc-400 font-mono uppercase">
                Countdown Target
              </span>
              <span className="font-semibold font-mono text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                ~{formatTimer(allocatedReadingSeconds)}
              </span>
            </div>
            <div>
              <span className="block text-[10px] sm:text-xs text-zinc-400 font-mono uppercase">
                Questions
              </span>
              <span className="font-semibold font-mono text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                {passage.questions.length} Questions
              </span>
            </div>
          </div>

          {/* Important Notice Callout */}
          <div className="rounded-lg border border-amber-200/90 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Read carefully. Your reading countdown starts only when you begin.</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed pl-5.5">
              Read the entire passage at your natural comprehension speed. The countdown tracks your pace against the CAT reading target. You can tap any word for instant vocabulary lookup without pausing your timer. When you finish reading, click <strong>START QUESTIONS →</strong> to stop the clock and calibrate your Words Per Minute (WPM).
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <Button
              onClick={handleBeginReading}
              size="lg"
              className="w-full h-12 text-sm sm:text-base font-semibold tracking-wide gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-md"
            >
              <Play className="h-4 w-4 fill-current" />
              BEGIN READING
            </Button>
          </div>
        </div>

        {/* CAT Reading Best Practices */}
        <div className="rounded-lg border border-zinc-200/60 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
          <h4 className="font-semibold font-serif text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wider">
            Reading Strategy Guidelines:
          </h4>
          <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
            <li>Map the central conflict and the author&apos;s primary thesis during your initial pass.</li>
            <li>Tap any unfamiliar word for an unobtrusive quick meaning.</li>
            <li>Your reading WPM is calculated independently and excludes question-solving time.</li>
          </ul>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE 2: ACTIVE READING EXPERIENCE WITH VOCABULARY LOOKUP
  // =========================================================================
  if (stage === "reading") {
    const isSerif = settings.readingFont === "serif";

    return (
      <div className="min-h-screen pb-24 relative">
        {/* Sticky Prominent Timer & Header Bar */}
        <div className="sticky top-0 z-40 -mx-4 md:-mx-8 -mt-6 md:-mt-8 px-4 md:px-8 py-3 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 dark:bg-zinc-950/95 dark:border-zinc-800 shadow-sm transition-all">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Passage Title & Topic */}
            <div className="flex items-center gap-2.5 truncate">
              <Badge variant="neutral" className="text-[10px] hidden sm:inline-flex font-mono">
                {passage.topic}
              </Badge>
              <span className="text-xs font-serif font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                {passage.title}
              </span>
            </div>

            {/* Center: Prominent Continuous Countdown Timer */}
            <div className="flex items-center gap-2 shrink-0">
              <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-mono font-bold shadow-sm ring-1 ${
                isReadingOvertime
                  ? "bg-rose-900 text-rose-100 ring-rose-800"
                  : "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 ring-zinc-800/10"
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isReadingOvertime ? "bg-rose-400" : "bg-emerald-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isReadingOvertime ? "bg-rose-500" : "bg-emerald-500"
                  }`}></span>
                </span>
                <span>
                  {isReadingOvertime
                    ? `+${formatTimer(readingSeconds - allocatedReadingSeconds)}`
                    : formatTimer(readingCountdownRemaining)}
                </span>
              </div>
              <span className="hidden md:inline text-[11px] text-zinc-400 font-mono">
                {isReadingOvertime ? "Overtime" : "Countdown Remaining"}
              </span>
            </div>

            {/* Right: Word Count & Quick Action */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                {passage.wordCount} words
              </span>
              <Button
                onClick={handleStartQuestions}
                size="sm"
                className="h-8 text-xs font-semibold px-3 gap-1 bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 shadow-sm"
              >
                <span>Done Reading</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Reading Canvas */}
        <div className="max-w-[800px] mx-auto pt-8 sm:pt-12 px-2 sm:px-4">
          {/* Article Header in Canvas */}
          <div className="border-b border-zinc-200/80 pb-6 mb-8 dark:border-zinc-800 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              <span>{passage.source}</span>
              <span>•</span>
              <span>{passage.topic}</span>
              <span>•</span>
              <span>{passage.difficulty}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              {passage.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-500 font-mono">
              <span>By {passage.author}</span>
              <span>•</span>
              <span>{passage.wordCount} words</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Tap any word for instant meaning
              </span>
            </div>
          </div>

          {/* Academic Passage Content with Clickable Word Tokens */}
          <article
            className={`prose prose-zinc dark:prose-invert max-w-none text-zinc-850 dark:text-zinc-200 select-text ${
              isSerif ? "font-serif text-[17px] sm:text-[18px]" : "font-sans text-[16px] sm:text-[17px]"
            } leading-[1.85] sm:leading-[1.9] space-y-6 sm:space-y-7 tracking-normal`}
          >
            {passage.content.split("\n\n").map((paragraph, pIdx) => {
              const tokens = paragraph.split(/(\s+)/);

              return (
                <p key={pIdx} className="text-justify text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {tokens.map((token, tIdx) => {
                    const cleaned = cleanWord(token);
                    const isWordToken = /[a-zA-Z]/.test(token);

                    if (!isWordToken || !cleaned) {
                      return <span key={tIdx}>{token}</span>;
                    }

                    const isHighlighted = selectedWord?.cleaned === cleaned;

                    return (
                      <span
                        key={tIdx}
                        onClick={(e) => handleWordClick(token, e)}
                        className={`vocab-word-token cursor-pointer rounded-[2px] transition-colors duration-100 ${
                          isHighlighted
                            ? "bg-amber-200 text-zinc-950 dark:bg-amber-800/80 dark:text-zinc-50 font-semibold ring-1 ring-amber-400"
                            : "hover:bg-amber-100/70 hover:text-zinc-950 dark:hover:bg-amber-950/60 dark:hover:text-zinc-100"
                        }`}
                        title="Click for word meaning"
                      >
                        {token}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </article>

          {/* Bottom Action Section: START QUESTIONS → */}
          <div className="mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/50 text-center space-y-4 shadow-sm">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 mb-1">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                Finished Reading the Passage?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                Clicking below will stop the reading clock, lock your <strong>Reading WPM</strong>, and launch the 5 comprehension questions with an independent solving timer.
              </p>

              <div className="pt-2">
                <Button
                  onClick={handleStartQuestions}
                  size="lg"
                  className="h-12 px-8 text-sm sm:text-base font-semibold tracking-wide gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-md"
                >
                  START QUESTIONS →
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contextual Vocabulary Popup (100% Opaque & High-Contrast) */}
        {selectedWord && !isDetailedVocabOpen && (
          <>
            {isMobileScreen ? (
              <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:hidden animate-ios-slide-up">
                <div
                  ref={popupRef}
                  className="rounded-[6px] border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] p-4 shadow-2xl text-zinc-950 dark:text-zinc-50 max-w-sm mx-auto ring-1 ring-black/10 dark:ring-white/10"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C83214]" />
                      <h4 className="text-sm font-serif font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                        {selectedWord.cleaned}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedWord(null)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-2.5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans font-medium">
                    {selectedWord.result.definition}
                  </p>

                  <div className="mt-3.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">Academic Lexicon</span>
                    <button
                      onClick={handleOpenDetailedView}
                      className="text-xs font-semibold text-[#C83214] dark:text-[#E04B2F] hover:underline flex items-center gap-1"
                    >
                      View more →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                ref={popupRef}
                style={popupStyle}
                className="absolute z-[100] rounded-[6px] border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#121214] p-3.5 shadow-2xl text-zinc-950 dark:text-zinc-50 select-none animate-ios-slide-up ring-1 ring-black/10 dark:ring-white/10"
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C83214]" />
                    <span className="text-xs font-bold font-serif text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">
                      {selectedWord.cleaned}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="p-1 text-zinc-400 hover:text-zinc-750 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-2 text-xs text-zinc-800 dark:text-zinc-200 leading-snug font-sans font-medium">
                  {selectedWord.result.definition}
                </p>

                <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase">Lexicon</span>
                  <button
                    onClick={handleOpenDetailedView}
                    className="text-xs font-semibold text-[#C83214] dark:text-[#E04B2F] hover:underline flex items-center gap-0.5"
                  >
                    View more →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Detailed Vocabulary Modal (View More) */}
        {isDetailedVocabOpen && selectedWord && (
          <Modal
            isOpen={isDetailedVocabOpen}
            onClose={() => setIsDetailedVocabOpen(false)}
            title={selectedWord.result.word.toUpperCase()}
            description="Vocabulary Detail Panel • Saved to My Vocabulary"
            maxWidth="md"
          >
            <div className="space-y-4 text-xs">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <h2 className="text-xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                  {selectedWord.result.word}
                </h2>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 block">
                  Meaning:
                </span>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                  {selectedWord.result.definition}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                    Part of Speech:
                  </span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
                    {selectedWord.result.partOfSpeech || "Noun"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                    Pronunciation:
                  </span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    {selectedWord.result.pronunciation || "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                  Abbreviation:
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
                  {selectedWord.result.abbreviation || "No commonly used abbreviation"}
                </p>
              </div>

              {selectedWord.result.example && (
                <div className="rounded-lg border border-zinc-200/70 dark:border-zinc-800 p-3 space-y-1 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                    Example:
                  </span>
                  <p className="font-serif italic text-zinc-800 dark:text-zinc-200">
                    &ldquo;{selectedWord.result.example}&rdquo;
                  </p>
                </div>
              )}

              {selectedWord.result.synonyms && selectedWord.result.synonyms.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                    Synonyms:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWord.result.synonyms.map((syn) => (
                      <Badge key={syn} variant="secondary" className="text-[11px] font-normal lowercase">
                        {syn}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedWord.result.antonyms && selectedWord.result.antonyms.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                    Antonyms:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWord.result.antonyms.map((ant) => (
                      <Badge key={ant} variant="neutral" className="text-[11px] font-normal lowercase">
                        {ant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Clock className="h-3.5 w-3.5" /> Countdown active ({formatTimer(readingCountdownRemaining)} remaining)
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsDetailedVocabOpen(false)}
                  className="text-xs"
                >
                  Continue Reading
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // =========================================================================
  // STAGE 3: CLEAN, FOCUSED QUESTION-SOLVING INTERFACE
  // =========================================================================
  const currentQ = passage.questions[currentQuestionIndex];
  const totalQuestions = passage.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const selectedOption = selectedAnswers[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Top Banner: Reading Stats & Question Solving Countdown Timer */}
      <div className="rounded-xl border border-zinc-200/80 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/80 shadow-sm text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: Calibrated Reading Pace Badge */}
          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-zinc-100 p-1.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs font-serif block">
                Reading Pace Calibrated
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {finalReadingDuration}s ({calculatedWpm} WPM) • Locked
              </span>
            </div>
          </div>

          {/* Center/Right: Independent Question Solving Countdown Timer */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-mono font-semibold ${
              isQuestionOvertime
                ? "bg-rose-900 text-rose-100"
                : "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
            }`}>
              <Timer className="h-3.5 w-3.5" />
              <span>
                {isQuestionOvertime
                  ? `+${formatTimer(questionSeconds - allocatedQuestionSeconds)} Overtime`
                  : `${formatTimer(questionCountdownRemaining)} Remaining`}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPassageInQuestions(!showPassageInQuestions)}
              className="h-7 text-xs gap-1"
            >
              <Eye className="h-3.5 w-3.5" />
              {showPassageInQuestions ? "Hide Passage" : "View Passage"}
            </Button>
          </div>
        </div>
      </div>

      {/* Optional Collapsible Passage Reference Box */}
      {showPassageInQuestions && (
        <Card className="border-zinc-200 dark:border-zinc-800 max-h-[380px] overflow-y-auto">
          <CardHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-serif">{passage.title}</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {passage.wordCount} words
              </Badge>
            </div>
            <CardDescription className="text-xs">Passage Text Reference</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-xs font-serif leading-relaxed text-zinc-800 dark:text-zinc-200 space-y-4">
            {passage.content.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Question Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-semibold font-serif text-zinc-900 dark:text-zinc-100">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </h3>
          <span className="text-[11px] text-zinc-400 font-mono">
            Type: {currentQ.type}
          </span>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center gap-1.5">
          {passage.questions.map((_, idx) => {
            const isCurrent = currentQuestionIndex === idx;
            const isAnswered = selectedAnswers[idx] !== undefined;

            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-6 w-6 rounded-full text-[10px] font-mono font-medium transition-all ${
                  isCurrent
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 ring-2 ring-zinc-400"
                    : isAnswered
                    ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600"
                }`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 space-y-6">
        {/* Question Text */}
        <h2 className="text-base sm:text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
          {currentQ.questionText}
        </h2>

        {/* Options List (A, B, C, D) - Do NOT reveal correct answers */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const optionLetters = ["A", "B", "C", "D"];

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                className={`w-full text-left p-4 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-3 select-none ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100 font-medium text-zinc-950 dark:text-zinc-50"
                    : "border-zinc-200/80 bg-white hover:bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/50 text-zinc-750 dark:text-zinc-300"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {optionLetters[optIdx]}
                </span>
                <span className="leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Previous / Next / SUBMIT RC */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
          className="gap-1.5 text-xs h-9"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-2">
          {!isLastQuestion ? (
            <Button
              size="sm"
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
              className="gap-1.5 text-xs h-9 font-medium"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmitRC}
              className="gap-1.5 text-xs h-9 font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 px-5 shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              <span>SUBMIT RC</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
