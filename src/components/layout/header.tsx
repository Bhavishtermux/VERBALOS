"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  Target,
  Sparkles,
  BookOpen,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  LogIn,
} from "lucide-react";
import { useRc } from "@/context/rc-context";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard",
    subtitle: "CAT VARC readiness overview & diagnostics",
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle: "CAT VARC readiness overview & diagnostics",
  },
  "/practice": {
    title: "RC Practice",
    subtitle: "Calibrated reading speed & comprehensive RC question drills",
  },
  "/verbal-ability": {
    title: "Verbal Ability",
    subtitle: "Para Summary, Para Jumbles & Odd Sentence Out mastery",
  },
  "/mocks": {
    title: "VARC Section Mocks",
    subtitle: "Timed 40-minute simulated sectional tests with question palette",
  },
  "/library": {
    title: "RC Library",
    subtitle: "Original CAT passages across Philosophy, Economics, Science & Culture",
  },
  "/vocabulary": {
    title: "My Vocabulary",
    subtitle: "Cloud-synced academic word repository with daily review",
  },
  "/mistakes": {
    title: "Mistake Journal",
    subtitle: "Cognitive error diagnostics, trap classifications & prescriptions",
  },
  "/progress": {
    title: "Progress & Analytics",
    subtitle: "Speed vs accuracy matrix, topic trends & diagnostic diagnostics",
  },
  "/strategy": {
    title: "Strategy & Selection",
    subtitle: "RC triage drills, question prediction & 40-minute attempt strategy",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Dark mode, typography preferences & cloud account sync",
  },
};

export function Header({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { stats } = useRc();
  const { user, profile, signOut } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const meta = pageTitles[pathname] || {
    title: "VerbalOS",
    subtitle: "Your personal CAT VARC operating system.",
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsAccountOpen(false);
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div>
        <h1 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-serif">
          {meta.title}
        </h1>
        <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Goal Status */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
          <Target className="h-3.5 w-3.5 text-zinc-500" />
          <span>Daily:</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {stats.todayCompleted}/{stats.todayGoal} RCs
          </span>
        </div>

        {/* Streak Badge */}
        <Badge
          variant="secondary"
          className="gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-900 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
        >
          <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>{stats.currentStreak || 5}d Streak</span>
        </Badge>

        {/* Account Menu Dropdown */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || "Avatar"}
                  className="h-5 w-5 rounded-full object-cover shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-700"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {(profile?.displayName || user.email || "A").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline font-mono truncate max-w-[110px]">
                {profile?.displayName || user.email?.split("@")[0]}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200/80 bg-white p-2 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900 text-xs animate-in fade-in-50 zoom-in-95 duration-100 z-50">
                <div className="border-b border-zinc-100 dark:border-zinc-800 p-2 flex items-center gap-2.5">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName || "Avatar"}
                      className="h-8 w-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-xs font-bold shrink-0">
                      {(profile?.displayName || user.email || "A").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-0.5 truncate">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block font-serif truncate">
                      {profile?.displayName || "CAT Aspirant"}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono block truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="py-1 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Settings</span>
                  </Link>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
