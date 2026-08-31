"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Clock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Filter,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CAT_TRAP_TAXONOMY, TrapType } from "@/lib/traps";
import { getActiveCatConfig } from "@/lib/cat-config";

export default function StrategyPage() {
  const [activeSection, setActiveSection] = useState<
    "reading" | "question-types" | "traps" | "va-playbook" | "pacing" | "mock-debrief" | "fallacies"
  >("reading");

  const [selectedTrapKey, setSelectedTrapKey] = useState<TrapType>("Too Broad");
  const catConfig = getActiveCatConfig();

  const sections = [
    { id: "reading", title: "1. Active Reading Methodology", icon: BookOpen },
    { id: "question-types", title: "2. RC Question Types & Logic", icon: Target },
    { id: "traps", title: "3. The 10 Fatal Elimination Traps", icon: Filter },
    { id: "va-playbook", title: "4. Verbal Ability (VA) Playbook", icon: Layers },
    { id: "pacing", title: "5. 40-Min Sectional Pacing & Triage", icon: Clock },
    { id: "mock-debrief", title: "6. Mock Debrief & Decision Matrix", icon: TrendingUp },
    { id: "fallacies", title: "7. Dangerous Shortcuts Debunked", icon: ShieldAlert },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-zinc-200/80 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
            <Compass className="h-3.5 w-3.5" /> VerbalOS Knowledge Base
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 font-mono">Curriculum &amp; Pedagogical Strategy</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
          The CAT VARC Playbook
        </h1>
        <p className="mt-1 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
          An evidence-based training curriculum distilling active reading principles, deductive boundary verification, trap diagnosis, and tactical exam triage.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: ACTIVE READING METHODOLOGY */}
      {activeSection === "reading" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                Core Methodology
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                The 3-Phase Active Reading Architecture
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                Never read an academic RC passage passively like a novel. High-percentile reading is an aggressive search for argument structure, pivots, and authorial conviction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400 block">
                  Phase 1: Pre-Read (10 Seconds)
                </span>
                <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Genre &amp; Boundary Calibration
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Glance at the Title, Source, and opening sentence. Identify the domain (e.g. Epistemology vs Marine Ecology) to prepare mental models.
                </p>
              </Card>

              <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 block">
                  Phase 2: In-Read (2.5 – 3.5 Mins)
                </span>
                <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Rhetorical Function Mapping
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  For every paragraph, identify what it does (Context, Thesis, Counter-argument, Nuance, Synthesis). Flag transition words: <em>however, nevertheless, whereas, consequently</em>.
                </p>
              </Card>

              <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                  Phase 3: Post-Read (10 Seconds)
                </span>
                <h3 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  The One-Sentence Stance Test
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Before touching Question 1, mentally articulate: <em>&ldquo;The author wrote this passage to establish that [X], despite the common belief in [Y].&rdquo;</em>
                </p>
              </Card>
            </div>

            <div className="rounded-xl bg-amber-50/60 dark:bg-amber-950/20 p-4 border border-amber-200/70 dark:border-amber-900/40 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold font-serif text-amber-950 dark:text-amber-300">
                <Lightbulb className="h-4 w-4 text-amber-600 shrink-0" />
                <span>The Paragraph Function Catalog (CAT Structural Markers):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-amber-200/60 dark:border-amber-900/60 text-zinc-800 dark:text-zinc-200">
                  <strong>• Introduction:</strong> Context / Old Consensus
                </div>
                <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-amber-200/60 dark:border-amber-900/60 text-zinc-800 dark:text-zinc-200">
                  <strong>• Thesis Pivot:</strong> New Phenomenon / Conflict
                </div>
                <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-amber-200/60 dark:border-amber-900/60 text-zinc-800 dark:text-zinc-200">
                  <strong>• Evidence:</strong> Case Study / Empirical Data
                </div>
                <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-amber-200/60 dark:border-amber-900/60 text-zinc-800 dark:text-zinc-200">
                  <strong>• Counter:</strong> Anomaly / Alternative View
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: RC QUESTION TYPES & LOGIC */}
      {activeSection === "question-types" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                Taxonomy &amp; Deductive Rules
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                CAT Reading Comprehension Question Types
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                Every CAT RC question belongs to a precise logical family with its own proof standard and elimination rules.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    1. Inference Questions (&ldquo;Which of the following can be logically deduced...?&rdquo;)
                  </span>
                  <Badge variant="danger" className="text-[10px] font-mono">
                    High Frequency (45% of CAT)
                  </Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  <strong>Rule of Truth:</strong> An inference is a statement that <em>must be 100% true</em> if the passage statements are true. It is NOT an extrapolation, a guess, or a real-world fact.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 bg-white dark:bg-zinc-900 p-2.5 rounded border border-zinc-200/60 dark:border-zinc-800">
                  💡 <strong>Elimination Trigger:</strong> Eliminate options that require assuming extra real-world facts not explicitly necessitated by the text premises.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    2. Main Idea &amp; Primary Purpose (&ldquo;The central argument of the passage is...&rdquo;)
                  </span>
                  <Badge variant="academic" className="text-[10px] font-mono">
                    Must Get Right
                  </Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  <strong>Rule of Truth:</strong> Must encompass the entire arch of the text from paragraph 1 to final paragraph.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 bg-white dark:bg-zinc-900 p-2.5 rounded border border-zinc-200/60 dark:border-zinc-800">
                  💡 <strong>Elimination Trigger:</strong> Eliminate <em>Too Narrow</em> options that only capture one paragraph or a single illustrative case study.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    3. Tone &amp; Author Stance (&ldquo;The author&apos;s attitude towards X is best described as...&rdquo;)
                  </span>
                  <Badge variant="warning" className="text-[10px] font-mono">
                    Rhetorical Discernment
                  </Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  <strong>Rule of Truth:</strong> CAT authors in academic journals rarely exhibit uncritical devotion or foaming-at-the-mouth anger. Tone is almost always qualified, analytical, skeptical, or cautiously optimistic.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 bg-white dark:bg-zinc-900 p-2.5 rounded border border-zinc-200/60 dark:border-zinc-800">
                  💡 <strong>Elimination Trigger:</strong> Eliminate extreme adjectives like <em>cynical, dismissive, ecstatic, vitriolic, fanatical</em>.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    4. Application &amp; Analogous Reasoning (&ldquo;Which scenario best illustrates the author&apos;s claim?&rdquo;)
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    Structural Mapping
                  </Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  <strong>Rule of Truth:</strong> Map the abstract formula of the author&apos;s argument ($A \rightarrow B$ under condition $C$) into a completely new domain.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: THE 10 FATAL ELIMINATION TRAPS */}
      {activeSection === "traps" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                Interactive Trap Encyclopedia
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                The 10 Fatal Elimination Traps in CAT VARC
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                CAT distractors are not created randomly. They are engineered using 10 specific cognitive deception templates.
              </p>
            </div>

            {/* Trap Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.keys(CAT_TRAP_TAXONOMY).map((trapKey) => {
                const isSelected = selectedTrapKey === trapKey;
                return (
                  <button
                    key={trapKey}
                    onClick={() => setSelectedTrapKey(trapKey as TrapType)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-1 ring-amber-500"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-400"
                    }`}
                  >
                    <span className="font-mono font-bold block text-[11px] text-zinc-900 dark:text-zinc-100 truncate">
                      {trapKey}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Trap Diagnostic Card */}
            {CAT_TRAP_TAXONOMY[selectedTrapKey] && (
              <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-900/40 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                      Trap Profile
                    </span>
                    <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-50">
                      {CAT_TRAP_TAXONOMY[selectedTrapKey].title}
                    </h3>
                  </div>
                  <Badge variant="warning" className="text-[10px] font-mono">
                    {selectedTrapKey}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-mono uppercase font-bold text-[10px] text-zinc-400 block">
                    How the Trap Works:
                  </span>
                  <p className="font-sans text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {CAT_TRAP_TAXONOMY[selectedTrapKey].detailedMechanism}
                  </p>
                </div>

                {/* Concrete CAT Case Study */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-zinc-200/80 dark:border-zinc-800 space-y-3 text-xs">
                  <span className="font-mono uppercase font-bold text-[10px] text-amber-600 dark:text-amber-400 block">
                    Concrete CAT Case Study:
                  </span>
                  <div className="space-y-1 bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded border border-zinc-100 dark:border-zinc-800/80 font-serif italic text-zinc-700 dark:text-zinc-300">
                    &ldquo;{CAT_TRAP_TAXONOMY[selectedTrapKey].catExample.passageExcerpt}&rdquo;
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
                      Question: {CAT_TRAP_TAXONOMY[selectedTrapKey].catExample.questionPrompt}
                    </p>
                    <p className="font-mono text-rose-600 dark:text-rose-400 line-through">
                      Flawed Option: &ldquo;{CAT_TRAP_TAXONOMY[selectedTrapKey].catExample.flawedOption}&rdquo;
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-sans">
                      <strong>Deconstruction:</strong> {CAT_TRAP_TAXONOMY[selectedTrapKey].catExample.analysis}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                    <span className="font-mono font-bold text-emerald-900 dark:text-emerald-300 text-[10px] uppercase block mb-1">
                      ✓ Elimination Rule:
                    </span>
                    <p className="text-emerald-950 dark:text-emerald-200 text-[11px] leading-relaxed">
                      {CAT_TRAP_TAXONOMY[selectedTrapKey].eliminationRule}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                    <span className="font-mono font-bold text-rose-900 dark:text-rose-300 text-[10px] uppercase block mb-1">
                      ⚠ When NOT to Eliminate:
                    </span>
                    <p className="text-rose-950 dark:text-rose-200 text-[11px] leading-relaxed">
                      {CAT_TRAP_TAXONOMY[selectedTrapKey].whenNotToEliminate}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: VERBAL ABILITY PLAYBOOK */}
      {activeSection === "va-playbook" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                Verbal Ability Strategy
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                The 4 Pillars of CAT Verbal Ability
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                VA forms 8 questions (24 marks) in current CAT. Master the algorithmic heuristics for Para Summary, Para Jumbles, Odd Sentence Out, and Sentence Placement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-50">
                    Para Summary (PS)
                  </h3>
                  <Badge variant="academic" className="text-[10px] font-mono">
                    MCQ (+3 / -1)
                  </Badge>
                </div>
                <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400 font-sans">
                  <li>• <strong>Thesis Inclusion:</strong> The summary must contain both the premise AND the final conclusion.</li>
                  <li>• <strong>No New Facts:</strong> Discard options that introduce outside concepts not found in the paragraph.</li>
                  <li>• <strong>Eliminate Redundancy:</strong> Discard options focusing on minor examples while missing the macro thesis.</li>
                </ul>
              </Card>

              <Card className="p-5 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-50">
                    Para Jumbles (PJ)
                  </h3>
                  <Badge variant="success" className="text-[10px] font-mono">
                    TITA (No Negative Marks)
                  </Badge>
                </div>
                <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400 font-sans">
                  <li>• <strong>Mandatory Pairs:</strong> Find unassailable 2-sentence pairs based on pronouns (he/it/this) and demonstratives.</li>
                  <li>• <strong>Opening Sentence:</strong> Look for an independent, generalized noun without dangling pronouns.</li>
                  <li>• <strong>Chronology / Acronym Rule:</strong> Full name comes before short form; cause precedes effect.</li>
                </ul>
              </Card>

              <Card className="p-5 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-50">
                    Odd One Out (OOO)
                  </h3>
                  <Badge variant="success" className="text-[10px] font-mono">
                    TITA (No Negative Marks)
                  </Badge>
                </div>
                <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400 font-sans">
                  <li>• <strong>Do NOT look for the odd sentence first:</strong> Build the coherent paragraph with 4 sentences first!</li>
                  <li>• <strong>The Leftover Sentence:</strong> The remaining sentence is often on the same topic, but shifts scope (e.g. general vs specific) or breaks chronology.</li>
                </ul>
              </Card>

              <Card className="p-5 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-50">
                    Para Completion &amp; Sentence Placement
                  </h3>
                  <Badge variant="academic" className="text-[10px] font-mono">
                    MCQ / TITA
                  </Badge>
                </div>
                <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400 font-sans">
                  <li>• <strong>Boundary Anchors:</strong> Check if the inserted sentence has transition words (<em>Therefore, Instead</em>) that demand an exact antecedent.</li>
                  <li>• <strong>Logical Continuity:</strong> Ensure the sentence preceding the insertion flows seamlessly into it, and the following sentence continues its line of reasoning.</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: 40-MIN SECTIONAL PACING & TRIAGE */}
      {activeSection === "pacing" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                Time Management
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                The 40-Minute Sectional Clock Blueprint
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                Under strict 40-minute constraints ({catConfig.name}), pacing discipline beats raw reading speed.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Minutes 0:00 – 2:00
                  </span>
                  <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    The 2-Minute Sectional Triage Scan
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                    Scan all 4 RCs (15s each). Order them: #1 Easiest Genre $\rightarrow$ #4 Dense / Complex.
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs font-mono shrink-0">
                  2.0 Mins
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Minutes 2:00 – 30:00
                  </span>
                  <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Solve Top 3 RC Passages (12 Questions)
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                    Allocate 8.5 – 9.0 minutes per RC (3 mins read + 5.5 mins solve). Aim for 10/12 accuracy (+30 net score).
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs font-mono shrink-0">
                  28.0 Mins
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Minutes 30:00 – 38:00
                  </span>
                  <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Verbal Ability Execution (TITA &amp; Para Summary)
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                    Attempt high-probability TITA Para Jumbles &amp; Odd Sentence Out (Zero risk of negative marking!) + 2 Para Summaries.
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs font-mono shrink-0">
                  8.0 Mins
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Minutes 38:00 – 40:00
                  </span>
                  <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Review &amp; Selective Direct Pick
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                    Check tagged &apos;Maybe&apos; questions or pick 1-2 direct detail questions from 4th RC.
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs font-mono shrink-0">
                  2.0 Mins
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: MOCK DEBRIEF & DECISION MATRIX */}
      {activeSection === "mock-debrief" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                Diagnostic Analysis
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                The 4-Quadrant Mock Decision Matrix
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                Do not just calculate raw score after a mock exam. Classify every single attempt into one of four speed-accuracy quadrants.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <span className="font-mono uppercase font-bold text-[10px] text-emerald-700 dark:text-emerald-400 block">
                  Quadrant 1: Fast + Accurate (Target Zone)
                </span>
                <h4 className="font-serif font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  Flawless Intuition &amp; Boundary Precision
                </h4>
                <p className="text-xs text-emerald-900/90 dark:text-emerald-300/90 leading-relaxed font-sans">
                  Solving time &lt; 90s with correct answer. Identifies core strengths and high-comfort genres.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <span className="font-mono uppercase font-bold text-[10px] text-amber-700 dark:text-amber-400 block">
                  Quadrant 2: Fast + Inaccurate (Rushing / Skimming)
                </span>
                <h4 className="font-serif font-bold text-sm text-amber-950 dark:text-amber-200">
                  Surface Reading &amp; Half-Truth Traps
                </h4>
                <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed font-sans">
                  Solving time &lt; 60s but incorrect. You fell for keyword matching or read only the first half of the option.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-blue-300 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
                <span className="font-mono uppercase font-bold text-[10px] text-blue-700 dark:text-blue-400 block">
                  Quadrant 3: Slow + Accurate (Time Sink)
                </span>
                <h4 className="font-serif font-bold text-sm text-blue-950 dark:text-blue-200">
                  High Precision, Dangerous Time Cost
                </h4>
                <p className="text-xs text-blue-900/90 dark:text-blue-300/90 leading-relaxed font-sans">
                  Correct, but took &gt; 3.0 minutes. Indicates excessive back-and-forth re-reading or lack of paragraph structural confidence.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
                <span className="font-mono uppercase font-bold text-[10px] text-rose-700 dark:text-rose-400 block">
                  Quadrant 4: Slow + Inaccurate (Double Penalty!)
                </span>
                <h4 className="font-serif font-bold text-sm text-rose-950 dark:text-rose-200">
                  The Ego Trap
                </h4>
                <p className="text-xs text-rose-900/90 dark:text-rose-300/90 leading-relaxed font-sans">
                  Took &gt; 3.5 minutes AND got -1 penalty. This single behavior kills VARC percentiles. Learn to SKIP early!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: DANGEROUS SHORTCUTS DEBUNKED */}
      {activeSection === "fallacies" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <Badge variant="danger" className="text-[10px] font-mono uppercase">
                Myth Busting
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
                Dangerous &apos;Shortcuts&apos; Debunked
              </h2>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                Do not rely on superficial coaching gimmicks. Understand why generic shortcuts fail under authentic CAT conditions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
                <h4 className="font-serif font-bold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <X className="h-4 w-4 text-rose-600" />
                  <span>Myth #1: &ldquo;Always eliminate options with extreme words like always/never.&rdquo;</span>
                </h4>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                  <strong>The Reality:</strong> If an academic author is discussing fundamental laws of physics or mathematical proofs (e.g. &ldquo;X is impossible under thermodynamic laws&rdquo;), the extreme option is the ONLY logically sound answer. Always match authorial conviction.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
                <h4 className="font-serif font-bold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <X className="h-4 w-4 text-rose-600" />
                  <span>Myth #2: &ldquo;Just read the first and last paragraph to solve the RC.&rdquo;</span>
                </h4>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                  <strong>The Reality:</strong> CAT passages are dense essays from premier publications. The thesis pivot frequently occurs in paragraph 3, while paragraph 1 is merely background context. Skimming causes fatal distortion errors.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
                <h4 className="font-serif font-bold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <X className="h-4 w-4 text-rose-600" />
                  <span>Myth #3: &ldquo;Never change your initial answer.&rdquo;</span>
                </h4>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                  <strong>The Reality:</strong> If you re-read the text and find concrete textual evidence disproving your initial choice, changing your answer is correct. What you must avoid is changing answers purely due to nervous anxiety without text backing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
