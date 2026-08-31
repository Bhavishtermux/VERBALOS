"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  HelpCircle,
  Layers,
  ListOrdered,
  Moon,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRc } from "@/context/rc-context";

export default function HomePage() {
  const { user } = useAuth();
  const { settings, updateSettings } = useRc();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isDark = settings.theme === "dark";

  const toggleTheme = () => {
    updateSettings({ theme: isDark ? "light" : "dark" });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-purple-100 dark:selection:bg-purple-950/50">
      {/* 1. Sticky Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-1 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="VerbalOS Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                VerbalOS
              </span>
              <span className="text-[10px] font-mono text-zinc-400 -mt-1 hidden sm:inline">
                CAT VARC Engine
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#chapters" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Practice Chapters
            </a>
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Features
            </a>
            <a href="#methodology" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Methodology
            </a>
            <a href="#faq" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all hover:translate-y-[-1px]"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-500/20 transition-all hover:translate-y-[-1px]"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Inspired by Optima Learn Style) */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-purple-50/50 via-white to-transparent dark:from-purple-950/20 dark:via-zinc-950 dark:to-transparent">
        {/* Glow ambient background element */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-80 w-80 rounded-full bg-amber-200/30 dark:bg-amber-900/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 mb-6">
            <span>Home</span>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span>Practice</span>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span className="text-purple-600 dark:text-purple-400 font-semibold">VARC</span>
          </nav>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl leading-[1.15]">
            CAT Verbal Ability &amp; Reading Comprehension Practice OS
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Curated dense academic reading passages from <strong>Aeon Essays</strong>, <strong>The Atlantic</strong>, <strong>The Hindu</strong>, and <strong>Scientific American</strong> — specifically engineered for CAT VARC with live WPM speed calibration and cognitive mistake diagnostics.
          </p>

          {/* Editorial Sources Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
            <span className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">RC Sources:</span>
            <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 font-medium">Aeon Essays</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">The Atlantic</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">The Hindu / Frontline</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">Scientific American</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">Smithsonian</span>
          </div>

          {/* Key CAT Focus Highlights & Difficulty Distribution */}
          <div className="mt-10 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col md:flex-row md:items-end justify-between gap-8">
            {/* Source & CAT Highlights */}
            <div className="flex flex-wrap items-end gap-6 sm:gap-10">
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 block">
                  Aeon &amp; Atlantic
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Dense Philosophy &amp; Sociology
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 block">
                  The Hindu &amp; Mint
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Economics &amp; Policy RCs
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-purple-600 dark:text-purple-400 block">
                  WPM Calibration
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Speed vs Comprehension
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 block">
                  40m Mocks
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  +3 / -1 CAT Scoring
                </span>
              </div>
            </div>

            {/* Difficulty Pill Bar */}
            <div className="w-full md:max-w-xs space-y-2">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <span className="bg-emerald-500" style={{ width: "20%" }} />
                <span className="bg-amber-500" style={{ width: "55%" }} />
                <span className="bg-rose-500" style={{ width: "25%" }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Easy
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> CAT+ Hard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Methodology Quote Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-l-4 border-purple-600 dark:border-purple-500 pl-5 sm:pl-6 py-2 bg-purple-50/40 dark:bg-purple-950/20 rounded-r-xl">
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif italic">
            &ldquo;VARC splits into Reading Comprehension, which carries ~66% of the marks, and Verbal Ability (Para Summary, Jumbles, Odd Sentence Out). VARC improves with volume and honest review of cognitive wrong answers rather than with rules. Every passage in VerbalOS is calibrated with speed tracking, instant vocabulary lookup, and classified trap diagnostics.&rdquo;
          </p>
        </div>
      </section>

      {/* 4. Practice Chapters Grid (Optima Learn Card Style) */}
      <section id="chapters" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Section Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Chapter Bank
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">5 Modular Drill Modes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Practice Chapters
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Select a focus area to start calibrated practice with immediate feedback.
          </p>
        </div>

        {/* RC Bank */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Reading Comprehension
            </h3>
            <span className="text-xs font-mono text-zinc-500">10+ Full Passages &amp; Analysis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Full RC Practice */}
            <Link
              href="/practice"
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition-all hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    10+
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Full RC Passages
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Philosophy, Economics, Science, &amp; Sociology with live WPM calibration &amp; paragraph markers.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <span className="bg-emerald-500" style={{ width: "20%" }} />
                  <span className="bg-amber-500" style={{ width: "60%" }} />
                  <span className="bg-rose-500" style={{ width: "20%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>RC Main Bank</span>
                  <span>WPM + Vocab</span>
                </div>
              </div>
            </Link>

            {/* Card 2: RC Library */}
            <Link
              href="/library"
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition-all hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    Curated
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Passage Library
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Filter by word count, genre, and CAT difficulty. Review past attempts and master dense prose.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <span className="bg-emerald-500" style={{ width: "30%" }} />
                  <span className="bg-amber-500" style={{ width: "50%" }} />
                  <span className="bg-rose-500" style={{ width: "20%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Genre Explorer</span>
                  <span>4 Domains</span>
                </div>
              </div>
            </Link>

            {/* Card 3: 40-Min Sectional Mocks */}
            <Link
              href="/mocks"
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50/40 to-white dark:from-purple-950/30 dark:to-zinc-900 shadow-sm hover:shadow-md hover:border-purple-400 transition-all hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-serif font-bold text-purple-600 dark:text-purple-400">
                    40 Min
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-700 dark:text-purple-300 group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Sectional Mock Simulation
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Official CAT Question Palette, +3 / -1 marking, Section Time Management, and detailed scorecards.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100 dark:border-purple-900/30 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-purple-700 dark:text-purple-300 font-semibold">
                  <span>Exam Simulation</span>
                  <span>CAT Standard (+3 / -1)</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Verbal Ability Chapters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Verbal Ability (VA)
            </h3>
            <span className="text-xs font-mono text-zinc-500">3 Core Focus Modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* VA 1: Para Summary */}
            <Link
              href="/verbal-ability"
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition-all hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    PS
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Para Summary
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Master 5 trap types: <em>Too Broad</em>, <em>Too Narrow</em>, <em>Distorts Argument</em>, and <em>Extreme Option</em>.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <span className="bg-emerald-500" style={{ width: "35%" }} />
                  <span className="bg-amber-500" style={{ width: "55%" }} />
                  <span className="bg-rose-500" style={{ width: "10%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>5-Trap Elimination</span>
                  <span>MCQ</span>
                </div>
              </div>
            </Link>

            {/* VA 2: Para Jumbles */}
            <Link
              href="/verbal-ability"
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition-all hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    PJ
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Para Jumbles (TITA)
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Interactive reorderable blocks with mandatory pair detection, opening hook, and contrast analysis.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <span className="bg-emerald-500" style={{ width: "40%" }} />
                  <span className="bg-amber-500" style={{ width: "50%" }} />
                  <span className="bg-rose-500" style={{ width: "10%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Mandatory Pairs</span>
                  <span>TITA / Key-In</span>
                </div>
              </div>
            </Link>

            {/* VA 3: Odd Sentence Out */}
            <Link
              href="/verbal-ability"
              className="group relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition-all hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    OSO
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Odd Sentence Out
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Detect subtle thematic shifts, tone breaks, and tangential sentences that do not belong.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <span className="bg-emerald-500" style={{ width: "50%" }} />
                  <span className="bg-amber-500" style={{ width: "40%" }} />
                  <span className="bg-rose-500" style={{ width: "10%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Theme Dissonance</span>
                  <span>TITA / Choice</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Feature Highlights (The 4 Pillars of VerbalOS) */}
      <section id="features" className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Why VerbalOS?
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Built Specifically for the 99th Percentile Mindset
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Most platforms just show an answer key. VerbalOS trains your metacognition and reading stamina.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Live WPM Calibration
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Measure authentic Words Per Minute (WPM) across dense academic prose. Track your reading speed versus question-solving accuracy to find your optimal sweet spot (250–300 WPM).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Cognitive Mistake Journal
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every wrong answer is categorized by cognitive failure: <em>Unsupported Inference</em>, <em>Extreme Option</em>, <em>Outside Passage</em>, or <em>Partial Truth</em>. Pinpoint exactly which trap CAT examiners use against you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Active Recall Vocabulary
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Double-click or tap any unfamiliar academic word inside reading passages for definitions, pronunciations, and synonyms. Automatically saves words to your spaced review flashcard deck.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Passage Triage &amp; Strategy Engine
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Train your 3-minute triage instincts. Rank 4 passages on Day 1 of exam week and decide which 3 to solve and which 1 to skip for maximum score efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section (Inspired by Optima Learn FAQ) */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            CAT VARC, Answered
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Everything you need to know about the exam section and practicing on VerbalOS.
          </p>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
          {/* FAQ 1 */}
          <div className="py-4">
            <button
              onClick={() => toggleFaq(0)}
              className="flex items-center justify-between w-full text-left font-medium text-sm sm:text-base text-zinc-900 dark:text-zinc-100 py-1"
            >
              <span>What does the CAT VARC section test?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 transition-transform ${
                  openFaq === 0 ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>
            {openFaq === 0 && (
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-6">
                The CAT VARC section consists of 24 questions across 40 minutes: 16 Reading Comprehension questions (4 passages of 4 questions each) and 8 Verbal Ability questions (Para Summary, Para Jumbles, and Odd Sentence Out). It tests critical reasoning, argument structure, and elimination discipline rather than rote vocabulary or grammar rules.
              </p>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="py-4">
            <button
              onClick={() => toggleFaq(1)}
              className="flex items-center justify-between w-full text-left font-medium text-sm sm:text-base text-zinc-900 dark:text-zinc-100 py-1"
            >
              <span>How do I actually improve at Reading Comprehension?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 transition-transform ${
                  openFaq === 1 ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>
            {openFaq === 1 && (
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-6">
                Volume plus honest error labeling. After every mistake, diagnose why you fell for the trap: did you over-infer, miss the author’s tone, or pick an option with outside world knowledge? Tracking your mistake patterns in VerbalOS helps you eliminate 2–3 options systematically on test day.
              </p>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="py-4">
            <button
              onClick={() => toggleFaq(2)}
              className="flex items-center justify-between w-full text-left font-medium text-sm sm:text-base text-zinc-900 dark:text-zinc-100 py-1"
            >
              <span>What is an optimal Reading Speed (WPM) for CAT?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 transition-transform ${
                  openFaq === 2 ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>
            {openFaq === 2 && (
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-6">
                For dense academic passages (Philosophy, Sociology, Economics), an ideal reading speed is 240 to 300 Words Per Minute (WPM). Reading faster than 350 WPM often degrades inference accuracy. VerbalOS calibrates your reading time on every passage so you know your optimal pacing.
              </p>
            )}
          </div>

          {/* FAQ 4 */}
          <div className="py-4">
            <button
              onClick={() => toggleFaq(3)}
              className="flex items-center justify-between w-full text-left font-medium text-sm sm:text-base text-zinc-900 dark:text-zinc-100 py-1"
            >
              <span>Is my practice history synchronized across all my devices?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 transition-transform ${
                  openFaq === 3 ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>
            {openFaq === 3 && (
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-6">
                Yes! When you sign in with your Google account, all your RC reading attempts, verbal ability drills, mock scores, and saved vocabulary words are encrypted and synchronized instantly via Supabase PostgreSQL cloud storage.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Footer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-purple-900 via-zinc-900 to-black text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Ready to Upgrade Your VARC Preparation?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Start practicing authentic CAT-level passages, calibrate your WPM, and journal your cognitive traps today.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-zinc-950 hover:bg-zinc-100 shadow-md transition-all hover:scale-105"
            >
              <span>{user ? "Open Dashboard" : "Start Practicing Free"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="VerbalOS" className="h-full w-full object-contain" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  VerbalOS
                </span>
                <p className="text-[11px] text-zinc-500">
                  Your personal CAT VARC operating system.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-500">
              <Link href="/practice" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                RC Practice
              </Link>
              <Link href="/verbal-ability" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Verbal Ability
              </Link>
              <Link href="/mocks" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Sectional Mocks
              </Link>
              <Link href="/strategy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Strategy Drill
              </Link>
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <span>© 2026 VerbalOS. Built for serious CAT aspirants.</span>
            <div className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Protected by Supabase Row Level Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
