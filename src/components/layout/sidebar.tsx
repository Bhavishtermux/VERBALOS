"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Timer,
  BookOpen,
  TrendingUp,
  SpellCheck,
  Settings,
  Flame,
  Target,
  LogOut,
  User as UserIcon,
  Layers,
  FileCheck,
  Compass,
  AlertTriangle,
  Filter,
  Crosshair,
  PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRc } from "@/context/rc-context";
import { useAuth } from "@/context/auth-context";
import { Progress } from "@/components/ui/progress";

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "RC Practice",
    href: "/practice",
    icon: Timer,
  },
  {
    label: "Elimination Lab",
    href: "/elimination-lab",
    icon: Crosshair,
  },
  {
    label: "Selection Lab",
    href: "/selection-lab",
    icon: Target,
  },
  {
    label: "Reading Room",
    href: "/reading-room",
    icon: BookOpen,
  },
  {
    label: "Verbal Ability",
    href: "/verbal-ability",
    icon: Layers,
  },
  {
    label: "VARC Mocks",
    href: "/mocks",
    icon: FileCheck,
  },
  {
    label: "RC Library",
    href: "/library",
    icon: BookOpen,
  },
  {
    label: "Mistake Journal",
    href: "/mistakes",
    icon: AlertTriangle,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: TrendingUp,
  },
  {
    label: "Playbook",
    href: "/strategy",
    icon: Compass,
  },
  {
    label: "Vocabulary",
    href: "/vocabulary",
    icon: SpellCheck,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { stats, settings, activeSession, setPendingNavUrl } = useRc();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/60 select-none",
        className
      )}
    >
      {/* Brand / Logo */}
      <div className="flex h-16 items-center px-6 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <Link
          href="/dashboard"
          onClick={(e) => {
            if (activeSession?.isActive) {
              e.preventDefault();
              setPendingNavUrl("/dashboard");
            }
          }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm shrink-0">
            <img src="/logo.png" alt="VerbalOS Logo" className="h-full w-full object-contain p-0.5" />
          </div>
          <div>
            <span className="font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-base leading-none block">
              VerbalOS
            </span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-tight block mt-0.5">
              CAT VARC Operating System
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (activeSession?.isActive) {
                  e.preventDefault();
                  setPendingNavUrl(item.href);
                }
              }}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                isActive
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-zinc-50 dark:text-zinc-900"
                    : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Account Section & Daily Target Widget */}
      <div className="p-3.5 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
        {/* User Account Info */}
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-2 truncate">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || "Avatar"}
                  className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-700"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {(profile?.displayName || user.email || "A").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="truncate">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block truncate">
                  {profile?.displayName || "Aspirant"}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="w-full py-1.5 px-3 rounded-lg border border-zinc-200/80 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors">
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign In to Sync</span>
            </button>
          </Link>
        )}

        {/* Daily Target Progress Card */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[11px] text-zinc-500 font-semibold flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
              Daily Cadence
            </span>
            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {stats.todayCompleted || 0}/{stats.todayGoal || 3} RCs
            </span>
          </div>
          <Progress
            value={((stats.todayCompleted || 0) / Math.max(stats.todayGoal || 3, 1)) * 100}
            className="h-1.5"
          />
        </div>
      </div>
    </aside>
  );
}
