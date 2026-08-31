"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  User,
  Sliders,
  Type,
  Database,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
  BookOpen,
  Cloud,
  LogOut,
  ShieldCheck,
  Key,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { useAuth } from "@/context/auth-context";
import { syncUserSettingsCloud } from "@/lib/supabase/data-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/ui/modal";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, isConfigured, signOut } = useAuth();
  const {
    settings,
    updateSettings,
    stats,
    resetToDefaults,
    resetAllProgress,
    exportDataJson,
    importDataJson,
  } = useRc();

  const [savedToast, setSavedToast] = useState(false);
  const [resetToast, setResetToast] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetAllProgress();
      setIsResetModalOpen(false);
      setResetToast(true);
      setTimeout(() => setResetToast(false), 3000);
    } catch (e) {
      console.error("Error resetting progress:", e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleUpdate = (partial: any) => {
    updateSettings(partial);
    if (user?.id) {
      syncUserSettingsCloud(user.id, partial);
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportDataJson());
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rc_lab_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importDataJson(importJsonText);
    if (success) {
      setImportStatus("success");
      setImportJsonText("");
    } else {
      setImportStatus("error");
    }
    setTimeout(() => setImportStatus(null), 3000);
  };

  const isDarkMode = settings.theme === "dark";

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Configuration
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 font-mono">Personal Preferences & Cloud Sync</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Personalize your training targets, typography, appearance, and manage cloud account cross-device synchronization.
        </p>
      </div>

      {savedToast && (
        <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4" /> Preferences saved and synchronized to cloud account.
        </div>
      )}

      {resetToast && (
        <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
          <Check className="h-4 w-4" /> All practice progress, scores, and vocabulary have been cleanly reset.
        </div>
      )}

      {/* 1. Cloud Account & Authentication Status */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-base font-serif">Cloud Account & Sync Status</CardTitle>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              {user ? "Cloud Synced" : "Local Mode"}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Personal data isolation secured via Supabase Row Level Security (RLS)
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {user ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-3">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName || "Avatar"}
                    className="h-10 w-10 rounded-full object-cover shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-700"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-sm font-bold shrink-0">
                    {(profile?.displayName || user.email || "A").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-0.5">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block font-serif">
                    {profile?.displayName || "CAT Aspirant"}
                  </span>
                  <span className="text-zinc-400 font-mono text-[11px] block">
                    Email: <strong>{user.email}</strong>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    User ID: {user.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-xs h-8 gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-200">
              <div className="space-y-0.5">
                <span className="font-semibold block font-serif">Not Currently Signed In</span>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Sign in with Google to sync practice sessions and vocabulary across devices.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => router.push("/login")}
                className="text-xs h-8"
              >
                Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Appearance Section: Dark Mode ON / OFF */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-zinc-500" />
            <CardTitle className="text-base font-serif">Appearance</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Customize the interface lighting for comfortable reading in low light
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 transition-colors">
            <div className="space-y-0.5 pr-4">
              <label
                htmlFor="dark-mode-switch"
                className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block font-serif cursor-pointer"
              >
                Dark Mode
              </label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Use a darker interface for comfortable reading in low light.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 select-none">
                {isDarkMode ? "ON" : "OFF"}
              </span>
              <Switch
                id="dark-mode-switch"
                aria-label="Dark Mode Toggle"
                checked={isDarkMode}
                onCheckedChange={(checked) => {
                  handleUpdate({ theme: checked ? "dark" : "light" });
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Target & Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-zinc-500" />
            <CardTitle className="text-base font-serif">Aspirant Profile & Targets</CardTitle>
          </div>
          <CardDescription>
            Set your target examination goals and daily preparation cadence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Aspirant Display Name
              </label>
              <Input
                type="text"
                value={settings.userName}
                onChange={(e) => handleUpdate({ userName: e.target.value })}
                placeholder="Your Name"
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Target Exam
              </label>
              <Input
                type="text"
                value={settings.targetExam}
                onChange={(e) => handleUpdate({ targetExam: e.target.value })}
                placeholder="CAT 2026"
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Daily Passage Target (RCs / Day)
              </label>
              <Select
                value={settings.dailyGoalPassages.toString()}
                onChange={(e) => handleUpdate({ dailyGoalPassages: Number(e.target.value) })}
                className="text-xs"
              >
                <option value="2">2 Passages (~18 mins)</option>
                <option value="3">3 Passages (~27 mins)</option>
                <option value="4">4 Passages (~36 mins) [Standard CAT]</option>
                <option value="6">6 Passages (~54 mins) [Intensive]</option>
                <option value="8">8 Passages (~72 mins) [Mock Marathon]</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Target Reading Speed (WPM)
              </label>
              <Select
                value={settings.targetWpm.toString()}
                onChange={(e) => handleUpdate({ targetWpm: Number(e.target.value) })}
                className="text-xs"
              >
                <option value="250">250 WPM (Careful Analysis)</option>
                <option value="280">280 WPM (Moderate Academic)</option>
                <option value="300">300 WPM (CAT Benchmark)</option>
                <option value="350">350 WPM (Speed Skim)</option>
                <option value="400">400 WPM (Advanced Sprint)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Reading Typography */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-zinc-500" />
            <CardTitle className="text-base font-serif">Reading Typography</CardTitle>
          </div>
          <CardDescription>
            Configure passage font family and reading size
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Passage Font Family
              </label>
              <Select
                value={settings.readingFont}
                onChange={(e) => handleUpdate({ readingFont: e.target.value as any })}
                className="text-xs"
              >
                <option value="serif">Academic Serif (Editorial)</option>
                <option value="sans">Clean Sans-Serif</option>
                <option value="mono">Technical Monospace</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Font Size
              </label>
              <Select
                value={settings.fontSize}
                onChange={(e) => handleUpdate({ fontSize: e.target.value as any })}
                className="text-xs"
              >
                <option value="sm">Compact (Small)</option>
                <option value="base">Standard (Medium)</option>
                <option value="lg">Spacious (Large)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Local Backup & Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-zinc-500" />
            <CardTitle className="text-base font-serif">Data Backup & Export</CardTitle>
          </div>
          <CardDescription>
            Download your full progress history as portable JSON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadBackup}
              className="w-full sm:w-auto text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download JSON Backup</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 6. Danger Zone: Reset Practice Progress */}
      <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10">
        <CardHeader className="pb-3 border-b border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <CardTitle className="text-base font-serif text-rose-950 dark:text-rose-200">
              Reset Practice Progress
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-rose-800/80 dark:text-rose-300/80">
            Permanently clear all completed RC attempts, Verbal Ability drills, mock scores, vocabulary words, and mistake diagnostics.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
              Use this if you wish to start your CAT VARC preparation from a completely clean slate. Your Google account and settings will remain active.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(true)}
              className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40 text-xs shrink-0 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset All Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Practice Progress?"
      >
        <div className="space-y-4 pt-1">
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/50 p-3.5 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold font-serif">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Warning: This action is permanent!</span>
            </div>
            <p className="leading-relaxed">
              This will permanently delete:
            </p>
            <ul className="list-disc pl-5 space-y-0.5 font-mono text-[11px]">
              <li>All completed RC reading sessions and WPM calibration logs</li>
              <li>All Verbal Ability drill answers (Para Summary, Jumbles, Odd Sentence)</li>
              <li>All Sectional Mock test records and scores</li>
              <li>All Mistake Journal entries and cognitive error rankings</li>
              <li>All saved vocabulary words from this device and Supabase Cloud</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isResetting}
              onClick={() => setIsResetModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isResetting}
              onClick={handleConfirmReset}
              className="bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-700 text-xs font-semibold gap-1.5"
            >
              {isResetting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Yes, Reset Progress</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
