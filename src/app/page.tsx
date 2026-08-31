"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  HelpCircle,
  Hourglass,
  Layers,
  ListOrdered,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Terminal,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRc } from "@/context/rc-context";

export default function HomePage() {
  const { user } = useAuth();
  const { settings, updateSettings } = useRc();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<string>("manifest");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
      element.classList.remove("section-pulse");
      void element.offsetWidth;
      element.classList.add("section-pulse");
    }
  };

  const isDark = settings.theme === "dark";

  const toggleTheme = () => {
    updateSettings({ theme: isDark ? "light" : "dark" });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0C0C0D] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-[#C83214] selection:text-white antialiased">
      {/* 1. Top Editorial Masthead Notice */}
      <div className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/70 dark:bg-zinc-900/50 py-1.5 px-4 text-[11px] font-mono tracking-tight text-zinc-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              VERBALOS // 2026
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span className="hidden sm:inline">
              CAT VARC COGNITIVE TRAINING PROTOCOL
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase text-[10px] tracking-wider">Cloud Engine Active</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-[#FBFBFA]/95 dark:bg-[#0C0C0D]/95 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group ios-tap">
            <div className="h-8 w-8 rounded-[4px] bg-zinc-900 dark:bg-zinc-100 p-1 flex items-center justify-center ios-spring group-hover:scale-105">
              <img src="/logo.png" alt="VerbalOS Logo" className="h-full w-full object-contain invert dark:invert-0" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                VerbalOS
              </span>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                CAT Practice OS
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-mono tracking-tight">
            <a
              href="#manifest"
              onClick={(e) => scrollToSection(e, "manifest")}
              className={`px-3 py-1.5 rounded-[4px] ios-tap ios-spring ${
                activeTab === "manifest"
                  ? "text-[#C83214] font-bold bg-zinc-100 dark:bg-zinc-800/80"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              01. Protocol
            </a>
            <a
              href="#disciplines"
              onClick={(e) => scrollToSection(e, "disciplines")}
              className={`px-3 py-1.5 rounded-[4px] ios-tap ios-spring ${
                activeTab === "disciplines"
                  ? "text-[#C83214] font-bold bg-zinc-100 dark:bg-zinc-800/80"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              02. Chapters
            </a>
            <a
              href="#taxonomy"
              onClick={(e) => scrollToSection(e, "taxonomy")}
              className={`px-3 py-1.5 rounded-[4px] ios-tap ios-spring ${
                activeTab === "taxonomy"
                  ? "text-[#C83214] font-bold bg-zinc-100 dark:bg-zinc-800/80"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              03. Trap Taxonomy
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className={`px-3 py-1.5 rounded-[4px] ios-tap ios-spring ${
                activeTab === "faq"
                  ? "text-[#C83214] font-bold bg-zinc-100 dark:bg-zinc-800/80"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              04. FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-[4px] border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 ios-tap"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-mono font-semibold bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-[#C83214] dark:hover:bg-[#C83214] dark:hover:text-white ios-tap"
              >
                <span>DASHBOARD</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-mono font-semibold bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-[#C83214] dark:hover:bg-[#C83214] dark:hover:text-white ios-tap"
              >
                <span>SIGN IN →</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section: Mixed Emotion IIM CAT VARC Atmospheric Canvas */}
      <section id="manifest" className="relative border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Subtle Architectural Hairline Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Mixed Emotion IIM CAT VARC Typographic Watermark Tapestry */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-[0.035] dark:opacity-[0.045] font-serif leading-none tracking-tight flex flex-col justify-between py-6 px-4">
          <div className="text-4xl sm:text-6xl uppercase whitespace-nowrap">
            IIM AHMEDABAD • 00:39:59 • INFERENCE VS ASSUMPTION • OPTION B OR C? • BLACKI DREAMS
          </div>
          <div className="text-4xl sm:text-6xl uppercase whitespace-nowrap pl-20">
            99.9%ILE • THE TICKING CLOCK • EPISTEMIC HUMILITY • PARAGRAPH 3 ARGUMENT • AUTHORIAL TONE
          </div>
          <div className="text-4xl sm:text-6xl uppercase whitespace-nowrap pl-8">
            TOO BROAD OR TOO NARROW? • FMS DELHI • MANDATORY PAIR BC • SPEED VS ACCURACY SWEET SPOT
          </div>
          <div className="text-4xl sm:text-6xl uppercase whitespace-nowrap pl-32">
            ELIMINATE THE PARTIAL TRUTH • 285 WPM FLOW STATE • TRIAGE 3 PASSAGES • DON&apos;T ASSUME
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 animate-ios-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Main Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Protocol Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C83214] animate-pulse" />
                <span className="font-semibold text-[#C83214] dark:text-[#E04B2F]">CAT 2026</span>
                <span className="text-zinc-300 dark:text-zinc-700">/</span>
                <span className="font-medium tracking-tight">DEDICATED VARC OPERATING SYSTEM</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.12]">
                The Reading Discipline. <br />
                <span className="text-[#C83214] dark:text-[#E04B2F]">Not Rote Rules.</span>
              </h1>

              {/* Emotional Subtitle */}
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-xl">
                A rigorous, distraction-free environment engineered exclusively for CAT aspirants. Dense philosophical, economic, and sociopolitical prose from <strong>Aeon Essays</strong>, <strong>The Atlantic</strong>, and <strong>The Hindu</strong> — coupled with real-time WPM calibration and cognitive trap taxonomy.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] font-semibold bg-zinc-900 text-zinc-50 hover:bg-[#C83214] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-[#C83214] dark:hover:text-white ios-tap shadow-sm"
                >
                  <span>{user ? "OPEN DASHBOARD" : "LAUNCH PRACTICE OS →"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={user ? "/library" : "/login"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 ios-tap"
                >
                  <span>EXPLORE RC LIBRARY</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Architecture Manifest Card (5 cols) */}
            <div className="lg:col-span-5 border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/90 rounded-[4px] p-5 sm:p-6 space-y-5 font-mono text-xs shadow-sm ios-spring hover:border-zinc-400 dark:hover:border-zinc-600">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Hourglass className="h-3.5 w-3.5 text-[#C83214]" />
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                    [SYSTEM SPECIFICATIONS]
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">REV. 2026.1</span>
              </div>

              <div className="space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                <div className="flex items-start justify-between pt-2">
                  <span className="text-zinc-500 uppercase text-[11px]">Curated Sources</span>
                  <span className="font-medium text-right text-zinc-900 dark:text-zinc-100">
                    Aeon, Atlantic, Hindu, SciAm
                  </span>
                </div>

                <div className="flex items-start justify-between pt-3">
                  <span className="text-zinc-500 uppercase text-[11px]">Calibration Range</span>
                  <span className="font-medium text-right text-zinc-900 dark:text-zinc-100">
                    250 – 300 WPM (Sweet Spot)
                  </span>
                </div>

                <div className="flex items-start justify-between pt-3">
                  <span className="text-zinc-500 uppercase text-[11px]">Scoring Matrix</span>
                  <span className="font-medium text-right text-zinc-900 dark:text-zinc-100">
                    +3.00 Correct / -1.00 Negative
                  </span>
                </div>

                <div className="flex items-start justify-between pt-3">
                  <span className="text-zinc-500 uppercase text-[11px]">Sectional Exam</span>
                  <span className="font-medium text-right text-zinc-900 dark:text-zinc-100">
                    40 Minutes // 24 Questions
                  </span>
                </div>

                <div className="flex items-start justify-between pt-3">
                  <span className="text-zinc-500 uppercase text-[11px]">Data Security</span>
                  <span className="font-medium text-right text-emerald-600 dark:text-emerald-400">
                    PostgreSQL + Row Level Security
                  </span>
                </div>
              </div>

              {/* Difficulty breakdown */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Passage Difficulty Ratio:</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">20% : 55% : 25%</span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-[2px] bg-zinc-100 dark:bg-zinc-800">
                  <span className="bg-emerald-600" style={{ width: "20%" }} title="Easy" />
                  <span className="bg-amber-500" style={{ width: "55%" }} title="Moderate" />
                  <span className="bg-[#C83214]" style={{ width: "25%" }} title="CAT+ Hard" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Easy</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Moderate</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#C83214]" /> CAT+ Hard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mixed Emotion Live Ticker */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 py-2.5 overflow-hidden">
          <div className="animate-ticker flex items-center gap-8 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C83214]" /> 00:39:59 ON THE CLOCK
            </span>
            <span>•</span>
            <span>IIM BLACKI AMBITION VS OPTION B/C DILEMMA</span>
            <span>•</span>
            <span>NEVER ASSUME FACTS NOT EXPLICIT IN THE TEXT</span>
            <span>•</span>
            <span>280 WPM CALIBRATED FLOW STATE</span>
            <span>•</span>
            <span>ELIMINATE THE PARTIAL TRUTH &amp; EXTREME QUALIFIER</span>
            <span>•</span>
            <span>99.9%ILE ELIMINATION DISCIPLINE</span>
            <span>•</span>
            {/* Repeated for continuous infinite drift */}
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C83214]" /> 00:39:59 ON THE CLOCK
            </span>
            <span>•</span>
            <span>IIM BLACKI AMBITION VS OPTION B/C DILEMMA</span>
            <span>•</span>
            <span>NEVER ASSUME FACTS NOT EXPLICIT IN THE TEXT</span>
            <span>•</span>
            <span>280 WPM CALIBRATED FLOW STATE</span>
            <span>•</span>
            <span>ELIMINATE THE PARTIAL TRUTH &amp; EXTREME QUALIFIER</span>
            <span>•</span>
            <span>99.9%ILE ELIMINATION DISCIPLINE</span>
          </div>
        </div>
      </section>

      {/* 4. Publication Sources Matrix */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-[4px] space-y-1 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-[10px] font-mono text-[#C83214] font-semibold block">[01] PHILOSOPHY &amp; MIND</span>
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">Aeon Essays</h3>
              <p className="text-[11px] text-zinc-500 font-sans leading-tight">Epistemology, ethics, and consciousness theory.</p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-[4px] space-y-1 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-[10px] font-mono text-[#C83214] font-semibold block">[02] CULTURE &amp; SOCIOLOGY</span>
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">The Atlantic</h3>
              <p className="text-[11px] text-zinc-500 font-sans leading-tight">Modern social structures, technology, and literature.</p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-[4px] space-y-1 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-[10px] font-mono text-[#C83214] font-semibold block">[03] POLICY &amp; ECONOMICS</span>
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">The Hindu / Frontline</h3>
              <p className="text-[11px] text-zinc-500 font-sans leading-tight">Indian economic policy, history, and development.</p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-[4px] space-y-1 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-[10px] font-mono text-[#C83214] font-semibold block">[04] SCIENCE &amp; COGNITION</span>
              <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">Scientific American</h3>
              <p className="text-[11px] text-zinc-500 font-sans leading-tight">Evolutionary biology, neuroscience, and astronomy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Disciplines & Chapters (Architectural Grid with iOS Micro-Interactions) */}
      <section id="disciplines" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C83214] dark:text-[#E04B2F]">
              // PRACTICE CHAPTERS
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              The Five Operational Disciplines
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-500 max-w-xs sm:text-right">
            Calibrated practice with immediate cognitive trap breakdown and time tracking.
          </p>
        </div>

        {/* Structured Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Discipline 1: Reading Comprehension */}
          <Link
            href={user ? "/practice" : "/login"}
            className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] p-6 flex flex-col justify-between hover:border-[#C83214] dark:hover:border-[#C83214] ios-spring ios-tap hover:-translate-y-1 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-[#C83214] ios-spring">
                  [01]
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  16 Questions // 66% Score
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C83214] ios-spring">
                Reading Comprehension
              </h3>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Full-length editorial texts with live WPM calibration, paragraph markers, and instant dictionary lookup for academic jargon.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>WPM + Vocab Lookup</span>
              <span className="group-hover:translate-x-1 ios-spring text-zinc-900 dark:text-zinc-100 font-semibold">
                {user ? "PRACTICE →" : "SIGN IN TO START →"}
              </span>
            </div>
          </Link>

          {/* Discipline 2: Para Summary */}
          <Link
            href={user ? "/verbal-ability" : "/login"}
            className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] p-6 flex flex-col justify-between hover:border-[#C83214] dark:hover:border-[#C83214] ios-spring ios-tap hover:-translate-y-1 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-[#C83214] ios-spring">
                  [02]
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  MCQ // Trap Analysis
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C83214] ios-spring">
                Para Summary
              </h3>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Learn to systematically eliminate options that are <em>Too Broad</em>, <em>Too Narrow</em>, <em>Distort Argument</em>, or introduce <em>Unsupported Info</em>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>5-Trap Elimination</span>
              <span className="group-hover:translate-x-1 ios-spring text-zinc-900 dark:text-zinc-100 font-semibold">
                {user ? "PRACTICE →" : "SIGN IN TO START →"}
              </span>
            </div>
          </Link>

          {/* Discipline 3: Para Jumbles */}
          <Link
            href={user ? "/verbal-ability" : "/login"}
            className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] p-6 flex flex-col justify-between hover:border-[#C83214] dark:hover:border-[#C83214] ios-spring ios-tap hover:-translate-y-1 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-[#C83214] ios-spring">
                  [03]
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  TITA // No Penalty
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C83214] ios-spring">
                Para Jumbles (TITA)
              </h3>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Interactive reorderable sentence cards with structural breakdown: opening anchors, mandatory pronoun pairs, and chronological conclusions.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>Mandatory Pairs</span>
              <span className="group-hover:translate-x-1 ios-spring text-zinc-900 dark:text-zinc-100 font-semibold">
                {user ? "PRACTICE →" : "SIGN IN TO START →"}
              </span>
            </div>
          </Link>

          {/* Discipline 4: Odd Sentence Out */}
          <Link
            href={user ? "/verbal-ability" : "/login"}
            className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] p-6 flex flex-col justify-between hover:border-[#C83214] dark:hover:border-[#C83214] ios-spring ios-tap hover:-translate-y-1 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-[#C83214] ios-spring">
                  [04]
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Theme Dissonance
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C83214] ios-spring">
                Odd Sentence Out
              </h3>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Isolate subtle narrative departures, tone breaks, and deceptively relevant sentences that do not align with the core authorial thesis.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>Tone Analysis</span>
              <span className="group-hover:translate-x-1 ios-spring text-zinc-900 dark:text-zinc-100 font-semibold">
                {user ? "PRACTICE →" : "SIGN IN TO START →"}
              </span>
            </div>
          </Link>

          {/* Discipline 5: 40-Min Sectional Mocks */}
          <Link
            href={user ? "/mocks" : "/login"}
            className="group border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-[4px] p-6 flex flex-col justify-between hover:bg-[#C83214] hover:border-[#C83214] dark:hover:bg-[#C83214] dark:hover:border-[#C83214] dark:hover:text-white ios-spring ios-tap hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 dark:border-zinc-300 pb-3">
                <span className="font-mono text-xs font-bold opacity-80">
                  [05]
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-white/10 dark:bg-black/10">
                  Full 40m Exam
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold">
                Sectional Mock Engine
              </h3>

              <p className="text-xs opacity-90 font-sans leading-relaxed">
                Full 40-minute timed exam environment with official Question Palette (Answered, Marked for Review), +3/-1 CAT scoring, and accuracy analytics.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 dark:border-zinc-300 flex items-center justify-between font-mono text-xs">
              <span>CAT Test Environment</span>
              <span className="font-semibold">{user ? "START MOCK →" : "SIGN IN TO START →"}</span>
            </div>
          </Link>

          {/* Discipline 6: Mistake Journal */}
          <Link
            href={user ? "/mistakes" : "/login"}
            className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] p-6 flex flex-col justify-between hover:border-[#C83214] dark:hover:border-[#C83214] ios-spring ios-tap hover:-translate-y-1 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-[#C83214] ios-spring">
                  [06]
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Metacognition
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C83214] ios-spring">
                Cognitive Mistake Journal
              </h3>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Automated error ranking across 12 distinct cognitive traps. Track whether your recurring vulnerability is over-inference or extreme qualifiers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>12 Error Categories</span>
              <span className="group-hover:translate-x-1 ios-spring text-zinc-900 dark:text-zinc-100 font-semibold">
                VIEW RADAR →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Cognitive Trap Taxonomy Matrix */}
      <section id="taxonomy" className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/40 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C83214] dark:text-[#E04B2F]">
              // ERROR ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              The 4 Most Dangerous CAT Traps
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              CAT test-makers do not design difficult correct answers — they design deceptively alluring wrong answers. VerbalOS trains you to spot them instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-[4px] space-y-2 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-xs font-mono font-bold text-[#C83214]">TRAP 01 // THE UNSUPPORTED INFERENCE</span>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                True in Reality, Absent in Text
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                An option stating a universally accepted fact that is nonetheless completely unmentioned or unsupported by the author&apos;s explicit arguments.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-[4px] space-y-2 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-xs font-mono font-bold text-[#C83214]">TRAP 02 // EXTREME QUALIFIERS</span>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                Absolute Statements (Always, Only, Never)
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                The passage offers a nuanced, conditional hypothesis; the trap option turns it into an unconditional, absolute decree.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-[4px] space-y-2 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-xs font-mono font-bold text-[#C83214]">TRAP 03 // THE PARTIAL TRUTH</span>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                Correct Premise, Fatal Conclusion
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                The first half of the option quotes paragraph 2 verbatim, but the concluding clause smuggles in a fatal logical inversion.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-[4px] space-y-2 ios-spring hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600">
              <span className="text-xs font-mono font-bold text-[#C83214]">TRAP 04 // TONE BREAK &amp; ENDORSEMENT</span>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                Neutral Reporting vs. Authorial Advocacy
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Confusing the author describing another theorist&apos;s radical thesis with the author actually endorsing that thesis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion (High-Contrast Clean Editorial Style with Spring Animation) */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-8">
        <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C83214] dark:text-[#E04B2F]">
            // FREQUENTLY ASKED
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            CAT VARC: Principles &amp; Protocol
          </h2>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[4px] divide-y divide-zinc-200 dark:divide-zinc-800">
          {/* FAQ 1 */}
          <div className="p-5">
            <button
              onClick={() => toggleFaq(0)}
              className="flex items-center justify-between w-full text-left font-serif font-bold text-base text-zinc-900 dark:text-zinc-100 ios-tap"
            >
              <span>How does VerbalOS calibrate my Reading Speed (WPM)?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 ios-spring ${
                  openFaq === 0 ? "rotate-180 text-[#C83214]" : ""
                }`}
              />
            </button>
            {openFaq === 0 && (
              <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pr-6 animate-ios-slide-up">
                When you start an RC, our timer records your exact reading completion time before you unlock question mode. It calculates your Words Per Minute across dense editorial prose and compares it with your eventual accuracy — helping you establish whether 250 WPM or 300 WPM yields the highest net score.
              </div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="p-5">
            <button
              onClick={() => toggleFaq(1)}
              className="flex items-center justify-between w-full text-left font-serif font-bold text-base text-zinc-900 dark:text-zinc-100 ios-tap"
            >
              <span>Why focus on Aeon, The Atlantic, and The Hindu?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 ios-spring ${
                  openFaq === 1 ? "rotate-180 text-[#C83214]" : ""
                }`}
              />
            </button>
            {openFaq === 1 && (
              <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pr-6 animate-ios-slide-up">
                Over the last 10 years of CAT examinations, IIM convening bodies consistently source passages from international intellectual publications: <em>Aeon Essays</em> for philosophy and psychology, <em>The Atlantic</em> for sociopolitical critiques, and <em>The Hindu / Frontline</em> for economic history. Practicing with these exact prose styles eliminates reading fatigue on test day.
              </div>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="p-5">
            <button
              onClick={() => toggleFaq(2)}
              className="flex items-center justify-between w-full text-left font-serif font-bold text-base text-zinc-900 dark:text-zinc-100 ios-tap"
            >
              <span>Is VerbalOS free and synced across all my devices?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 ios-spring ${
                  openFaq === 2 ? "rotate-180 text-[#C83214]" : ""
                }`}
              />
            </button>
            {openFaq === 2 && (
              <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans pr-6 animate-ios-slide-up">
                Yes. When you authenticate via Google Single Sign-On, your completed attempts, sectional mock results, WPM pacing history, and saved vocabulary words are encrypted and synchronized instantly via Supabase PostgreSQL cloud database.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Box (Editorial High-Contrast) */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-50 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E04B2F]">
            // COMMENCE TRAINING
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Build Your 99th Percentile VARC Reflexes
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
            Eliminate cognitive traps, calibrate your speed, and practice authentic CAT-grade passages today.
          </p>

          <div className="pt-2">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] font-mono text-xs font-bold bg-[#C83214] text-white hover:bg-[#b02c12] ios-tap shadow-md"
            >
              <span>{user ? "GO TO DASHBOARD" : "START PRACTICING NOW"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. High-Contrast Editorial Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-[#FBFBFA] dark:bg-[#0C0C0D] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-[3px] bg-zinc-900 dark:bg-zinc-100 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="VerbalOS" className="h-full w-full object-contain invert dark:invert-0" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  VerbalOS
                </span>
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs ml-2">
                  // CAT VARC Protocol
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-500">
              <Link href={user ? "/practice" : "/login"} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                RC Engine
              </Link>
              <Link href={user ? "/verbal-ability" : "/login"} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Verbal Ability
              </Link>
              <Link href={user ? "/mocks" : "/login"} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                40m Mocks
              </Link>
              <Link href={user ? "/strategy" : "/login"} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Strategy
              </Link>
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Terms
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <span>© 2026 VerbalOS. Designed for serious CAT aspirants.</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Secured by Supabase Row Level Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
