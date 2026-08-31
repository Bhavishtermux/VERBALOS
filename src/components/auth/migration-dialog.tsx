"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  CloudUpload,
  CheckCircle2,
  Database,
} from "lucide-react";
import { getAllSessions } from "@/lib/analytics";
import { getSavedVocabWords } from "@/lib/vocabulary";
import {
  syncPracticeSessionCloud,
  syncVocabularyWordCloud,
  syncUserSettingsCloud,
} from "@/lib/supabase/data-service";
import { useRc } from "@/context/rc-context";

export function MigrationDialog() {
  const { user } = useAuth();
  const { settings } = useRc();
  const [isOpen, setIsOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migratedSuccess, setMigratedSuccess] = useState(false);
  const [stats, setStats] = useState({ sessionsCount: 0, vocabCount: 0 });

  useEffect(() => {
    if (!user) return;

    // Check if migration has already been completed for this user
    const migrationKey = `rc_lab_migrated_user_${user.id}`;
    const alreadyMigrated = window.localStorage.getItem(migrationKey);

    if (!alreadyMigrated) {
      const localSessions = getAllSessions();
      const localVocab = getSavedVocabWords();

      if (localSessions.length > 0 || localVocab.length > 0) {
        setStats({
          sessionsCount: localSessions.length,
          vocabCount: localVocab.length,
        });
        setIsOpen(true);
      }
    }
  }, [user]);

  const handleImportProgress = async () => {
    if (!user) return;
    setIsMigrating(true);

    try {
      const localSessions = getAllSessions();
      const localVocab = getSavedVocabWords();

      // 1. Upload historical sessions
      for (const session of localSessions) {
        await syncPracticeSessionCloud(session, user.id);
      }

      // 2. Upload vocabulary
      for (const word of localVocab) {
        await syncVocabularyWordCloud(user.id, word);
      }

      // 3. Upload settings
      await syncUserSettingsCloud(user.id, settings);

      // 4. Mark migration complete in localStorage
      window.localStorage.setItem(`rc_lab_migrated_user_${user.id}`, "true");

      setMigratedSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (e) {
      console.warn("Migration error:", e);
      window.localStorage.setItem(`rc_lab_migrated_user_${user.id}`, "true");
      setIsOpen(false);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleStartFresh = () => {
    if (!user) return;
    // Mark as migrated so we don't ask again
    window.localStorage.setItem(`rc_lab_migrated_user_${user.id}`, "true");
    setIsOpen(false);
  };

  if (!isOpen || !user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Existing VerbalOS progress found."
      description="Would you like to import it into your account?"
      maxWidth="sm"
    >
      <div className="space-y-4 py-2 text-xs">
        {migratedSuccess ? (
          <div className="text-center py-4 space-y-2">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mx-auto">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold font-serif text-zinc-900 dark:text-zinc-50">
              Cloud Synchronization Complete
            </h4>
            <p className="text-zinc-500 font-mono text-[11px]">
              Your history is now securely linked to your account.
            </p>
          </div>
        ) : (
          <>
            {/* Found Data Summary Box */}
            <div className="rounded-lg bg-zinc-50 p-3.5 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                Local History Detected:
              </span>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">RC Sessions</span>
                  <strong className="text-sm text-zinc-900 dark:text-zinc-100">
                    {stats.sessionsCount} Completed
                  </strong>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Vocabulary</span>
                  <strong className="text-sm text-zinc-900 dark:text-zinc-100">
                    {stats.vocabCount} Words
                  </strong>
                </div>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Would you like to import your existing sessions, WPM calibration, and vocabulary words into your account?
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartFresh}
                disabled={isMigrating}
                className="text-xs flex-1"
              >
                Start Fresh
              </Button>
              <Button
                size="sm"
                onClick={handleImportProgress}
                disabled={isMigrating}
                className="text-xs flex-1 gap-1.5 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
              >
                <CloudUpload className="h-3.5 w-3.5" />
                <span>{isMigrating ? "Importing..." : "Import Progress"}</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
