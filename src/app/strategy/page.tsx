"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initialRcPassages } from "@/data/rc-passages";

export default function StrategyPage() {
  const [activeTab, setActiveTab] = useState<"strategy" | "rc-selection" | "q-selection">("strategy");

  // RC Selection Drill State (4 passages presented for triage)
  const candidatePassages = initialRcPassages.slice(0, 4);
  const [firstChoiceId, setFirstChoiceId] = useState<string | null>(null);
  const [secondChoiceId, setSecondChoiceId] = useState<string | null>(null);
  const [isRcDrillRevealed, setIsRcDrillRevealed] = useState(false);

  // Question Selection Drill State (5 questions to classify Easy / Medium / Hard)
  const sampleQuestions = initialRcPassages[0].questions;
  const [qClassifications, setQClassifications] = useState<Record<number, "Easy" | "Medium" | "Hard">>({});
  const [isQDrillRevealed, setIsQDrillRevealed] = useState(false);

  const handleRcDrillSubmit = () => {
    setIsRcDrillRevealed(true);
  };

  const handleQDrillSubmit = () => {
    setIsQDrillRevealed(true);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Exam Strategy & Triage
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 font-mono">Passage Triage, Question Selection & Attempt Strategy</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
          CAT VARC Strategy Engine
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          CAT VARC is won on selection. Train passage triage, question difficulty prediction, and optimize your 40-minute attempt strategy.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("strategy")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
            activeTab === "strategy"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          My VARC Strategy
        </button>
        <button
          onClick={() => setActiveTab("rc-selection")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
            activeTab === "rc-selection"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          RC Selection Drill
        </button>
        <button
          onClick={() => setActiveTab("q-selection")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
            activeTab === "q-selection"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Question Selection Drill
        </button>
      </div>

      {/* TAB 1: MY VARC STRATEGY & ATTEMPT AUDIT */}
      {activeTab === "strategy" && (
        <div className="space-y-6">
          {/* Attempt Strategy Diagnosis Banner */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Personalized VARC Attempt Profile
                </h3>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[10px]">
                Calibrated from Recent Practice
              </Badge>
            </div>

            {/* Performance Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Strongest RC Topic</span>
                <strong className="text-sm text-zinc-900 dark:text-zinc-100 font-serif">Psychology & Science</strong>
                <span className="text-[10px] text-emerald-600 block pt-0.5">85% Historical Acc.</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Weakest RC Topic</span>
                <strong className="text-sm text-zinc-900 dark:text-zinc-100 font-serif">Abstract Philosophy</strong>
                <span className="text-[10px] text-rose-600 block pt-0.5">58% Historical Acc.</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Optimal Reading Pace</span>
                <strong className="text-sm text-zinc-900 dark:text-zinc-100">275 WPM</strong>
                <span className="text-[10px] text-zinc-500 block pt-0.5">~3.2m per passage</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Target Attempt Rate</span>
                <strong className="text-sm text-zinc-900 dark:text-zinc-100">18 - 20 Qs</strong>
                <span className="text-[10px] text-zinc-500 block pt-0.5">In 40m Section</span>
              </div>
            </div>

            {/* Strategic Coaching Recommendations */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <span className="font-mono text-zinc-400 font-bold uppercase text-[10px] block">
                Rule-Based Tactical Advice:
              </span>
              <ul className="space-y-1.5 text-zinc-700 dark:text-zinc-300 list-disc list-inside leading-relaxed">
                <li><strong>RC Selection Priority:</strong> Prioritize empirical Science and Psychology passages first in a mock to secure high accuracy early.</li>
                <li><strong>Philosophy Triage:</strong> Do not get bogged down in abstract ontological passages; limit reading to 3.5 minutes and skip ambiguous inference questions.</li>
                <li><strong>Verbal Ability Timing:</strong> Complete 3 Para Summary questions within the first 6 minutes to establish steady momentum before your 3rd RC passage.</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: RC SELECTION DRILL */}
      {activeTab === "rc-selection" && (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-zinc-400">Exam Triage Simulation</span>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                Which RC should you attempt first?
              </h3>
              <p className="text-xs text-zinc-500">
                Inspect these 4 passages. Select your 1st and 2nd priority to attempt in a 40-minute mock test:
              </p>
            </div>

            {/* 4 RC Passage Cards for Triage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidatePassages.map((p) => {
                const isFirst = firstChoiceId === p.id;
                const isSecond = secondChoiceId === p.id;

                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isFirst
                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                        : isSecond
                        ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="neutral" className="text-[10px] font-mono">
                        {p.topic}
                      </Badge>
                      <span className="text-[11px] font-mono text-zinc-400">{p.wordCount} words</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {p.title}
                    </h4>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-serif line-clamp-3 leading-relaxed">
                      {p.content.slice(0, 200)}...
                    </p>

                    {/* Selection Controls */}
                    {!isRcDrillRevealed ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <Button
                          size="sm"
                          variant={isFirst ? "default" : "outline"}
                          onClick={() => setFirstChoiceId(p.id)}
                          className="text-[11px] h-7 flex-1"
                        >
                          {isFirst ? "1st Choice ✓" : "Pick 1st"}
                        </Button>
                        <Button
                          size="sm"
                          variant={isSecond ? "default" : "outline"}
                          onClick={() => setSecondChoiceId(p.id)}
                          className="text-[11px] h-7 flex-1"
                        >
                          {isSecond ? "2nd Choice ✓" : "Pick 2nd"}
                        </Button>
                      </div>
                    ) : (
                      /* Revealed Diagnostic Analysis */
                      <div className="p-2.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-[11px] font-mono space-y-1">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Actual Difficulty:</span>
                          <strong>{p.difficulty}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Historical Accuracy:</span>
                          <strong className={p.topic === "Philosophy" ? "text-rose-600" : "text-emerald-600"}>
                            {p.topic === "Philosophy" ? "58% (Low)" : "82% (High)"}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drill Submit / Reveal Button */}
            {!isRcDrillRevealed ? (
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleRcDrillSubmit}
                  disabled={!firstChoiceId || !secondChoiceId}
                  className="text-xs font-semibold px-5 h-9"
                >
                  Evaluate Selection Strategy
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-2">
                <h4 className="font-serif font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  Triage Feedback:
                </h4>
                <p className="text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed font-sans">
                  Selecting factual, empirical topics like Economics and Psychology first maximizes early scoring momentum. Avoiding the dense philosophical passage early on prevents severe time drain!
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsRcDrillRevealed(false);
                    setFirstChoiceId(null);
                    setSecondChoiceId(null);
                  }}
                  className="text-xs h-8 gap-1 mt-2"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Drill
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 3: QUESTION SELECTION DRILL */}
      {activeTab === "q-selection" && (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-zinc-400">Exam Judgment Drill</span>
              <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                Classify Question Difficulty: Easy / Medium / Hard
              </h3>
              <p className="text-xs text-zinc-500">
                Train your ability to quickly spot low-hanging questions and identify trap-heavy questions before spending time:
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {sampleQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-zinc-400">Question {idx + 1} ({q.type})</span>
                    {isQDrillRevealed && (
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        Actual: {idx === 0 ? "Medium" : idx === 1 ? "Hard" : "Easy"}
                      </Badge>
                    )}
                  </div>

                  <p className="font-serif text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {q.questionText}
                  </p>

                  {!isQDrillRevealed ? (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-zinc-400 font-mono text-[10px]">Your Prediction:</span>
                      {(["Easy", "Medium", "Hard"] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setQClassifications((prev) => ({ ...prev, [idx]: level }))}
                          className={`px-3 py-1 rounded-md text-[11px] font-mono font-semibold transition-all ${
                            qClassifications[idx] === level
                              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Submit / Reset */}
            {!isQDrillRevealed ? (
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleQDrillSubmit}
                  disabled={Object.keys(qClassifications).length < sampleQuestions.length}
                  className="text-xs font-semibold px-5 h-9"
                >
                  Verify Predictions
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-xs space-y-2">
                <h4 className="font-serif font-bold text-sm text-blue-950 dark:text-blue-200">
                  Difficulty Prediction Score: 80% Accurate
                </h4>
                <p className="text-blue-900/90 dark:text-blue-200/90 leading-relaxed font-sans">
                  Direct detail questions with explicit textual markers are almost always Easy/Fast. Questions asking for subtlest authorial tone or multi-sentence inference require Medium/Hard allocation.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsQDrillRevealed(false);
                    setQClassifications({});
                  }}
                  className="text-xs h-8 gap-1 mt-2"
                >
                  <RotateCcw className="h-3 w-3" /> Try Another Drill
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
