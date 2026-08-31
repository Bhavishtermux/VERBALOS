"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { useRc } from "@/context/rc-context";
import { useAuth } from "@/context/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useRc();
  const { user, loading } = useAuth();

  const isPublicPage =
    pathname === "/login" ||
    pathname?.startsWith("/auth/callback") ||
    pathname === "/privacy" ||
    pathname === "/terms";

  // Route Protection: Redirect unauthenticated users to /login
  useEffect(() => {
    if (!loading && !user && !isPublicPage) {
      router.push("/login");
    }
  }, [user, loading, isPublicPage, router]);

  const fontClass =
    settings.readingFont === "serif"
      ? "font-sans selection:bg-amber-100 dark:selection:bg-amber-900/30"
      : "font-sans";

  // Public pages layout (login / callback / privacy / terms)
  if (isPublicPage) {
    return (
      <div className={`min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${fontClass}`}>
        {children}
      </div>
    );
  }

  // Loading state while checking cloud session
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100 mb-3" />
        <p className="text-xs text-zinc-400 font-mono">Verifying secure cloud session...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row ${fontClass}`}>
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar className="sticky top-0 h-screen" />
      </div>

      {/* Mobile Nav Top Bar */}
      <MobileNav />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 pb-16 md:pb-6">
        <Header />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
