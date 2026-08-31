"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Flame, Target } from "lucide-react";
import { navItems } from "./sidebar";
import { cn } from "@/lib/utils";
import { useRc } from "@/context/rc-context";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { stats, settings } = useRc();

  return (
    <>
      {/* Mobile Top Header */}
      <div className="flex md:hidden h-14 items-center justify-between border-b border-zinc-200/80 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 font-serif font-bold text-xs dark:bg-zinc-100 dark:text-zinc-900">
            VOS
          </div>
          <span className="font-serif font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
            VerbalOS
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{stats.currentStreak}d</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 text-zinc-700 dark:text-zinc-300"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white dark:bg-zinc-950">
          <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 font-serif font-bold text-xs dark:bg-zinc-100 dark:text-zinc-900">
                VOS
              </div>
              <span className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
                VerbalOS
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname === "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              {settings.targetExam} Preparation
            </p>
            <p className="mt-1">
              Today&apos;s progress: {stats.todayCompleted} of {stats.todayGoal} RCs completed
            </p>
          </div>
        </div>
      )}

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden h-14 items-center justify-around border-t border-zinc-200/90 bg-white/95 px-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
        {navItems.slice(0, 5).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 mb-0.5",
                  isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
