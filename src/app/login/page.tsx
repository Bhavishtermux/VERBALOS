"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Compass,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const { user, isConfigured, signInWithGoogle, demoLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle OAuth error messages passed in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error_description") || params.get("error");
      if (urlError) {
        setErrorMsg(decodeURIComponent(urlError));
      }
    }
  }, []);

  // Handle Official Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Google sign-in could not be initiated.");
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    if (demoLogin) {
      demoLogin();
      router.push("/dashboard");
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F2EB] dark:bg-[#0E0E10]">
        <div className="max-w-md w-full text-center p-8 space-y-4 rounded-3xl bg-[#FAF8F5] dark:bg-[#18181B] border border-[#E5DFD3] dark:border-zinc-800 shadow-xl">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 mx-auto">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
            Welcome to VerbalOS
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Signed in as <strong>{user.email || user.user_metadata?.display_name || "Aspirant"}</strong>
          </p>
          <div className="pt-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full text-xs font-semibold h-11 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-md gap-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#EFECE6] dark:bg-[#0E0E11] text-zinc-900 dark:text-zinc-100 selection:bg-[#E2D8C3] dark:selection:bg-amber-900/40 relative overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#E6DECE]/60 via-[#EFECE6]/20 to-transparent dark:from-[#2A241C]/30 dark:via-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Classical Editorial Container Card */}
      <div className="w-full max-w-4xl rounded-[28px] sm:rounded-[36px] bg-[#FAF8F5] dark:bg-[#161619] border border-[#E4DEC8]/90 dark:border-zinc-800/80 shadow-[0_20px_60px_-15px_rgba(45,35,20,0.09)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 relative z-10">
        
        {/* 1. Top Branding & Academic Pillars */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE7D9] dark:border-zinc-800/70 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-[#E0D8C3] dark:border-zinc-700 shadow-sm shrink-0 p-1 flex items-center justify-center">
              <img src="/logo.png" alt="VerbalOS Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-serif font-bold text-base sm:text-lg tracking-[0.18em] uppercase text-zinc-900 dark:text-zinc-50 block leading-none">
                VERBALOS
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono tracking-tight block mt-1">
                Your personal CAT VARC operating system
              </span>
            </div>
          </div>

          {/* Academic Core Pillars */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-center font-mono text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
            <span className="px-2 py-0.5 rounded-full bg-[#EFEBE1] dark:bg-zinc-800/60 border border-[#E0D9C7] dark:border-zinc-700/60">
              Read
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EFEBE1] dark:bg-zinc-800/60 border border-[#E0D9C7] dark:border-zinc-700/60">
              Think
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EFEBE1] dark:bg-zinc-800/60 border border-[#E0D9C7] dark:border-zinc-800/60">
              Solve
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EFEBE1] dark:bg-zinc-800/60 border border-[#E0D9C7] dark:border-zinc-800/60 text-[#8C6B2D] dark:text-amber-400">
              Improve
            </span>
          </div>
        </div>

        {/* 2. Hero Visual Section (Editorial Study Atmosphere) */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E4DEC8]/80 dark:border-zinc-800 shadow-inner group">
          <img
            src="/hero-study.jpg"
            alt="VerbalOS Classical Study Environment"
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
          {/* Subtle Warm Editorial Vignette & Atmosphere Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
          
          {/* Subtle Quote / Aesthetic Overlay Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white/90 text-xs font-mono drop-shadow-sm">
            <span className="text-[11px] sm:text-xs tracking-wider uppercase font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              Classical Reading • Critical Inference • Cognitive Stamina
            </span>
          </div>
        </div>

        {/* 3. Hero Editorial Typography & Login Callout */}
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 pt-1 sm:pt-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
            Read better. Think sharper.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-xl mx-auto">
            Build the reading, reasoning and decision-making skills you need for CAT VARC with authentic editorial journalism, elimination triage, and live speed analytics.
          </p>
        </div>

        {/* Error Notification (if OAuth failed) */}
        {errorMsg && (
          <div className="max-w-md mx-auto rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3.5 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* 4. Primary Sign In Action: Continue with Google */}
        <div className="max-w-md mx-auto w-full space-y-4 pt-1 sm:pt-2">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 sm:h-13 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] border border-zinc-800 dark:border-zinc-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-100 dark:border-zinc-500 dark:border-t-zinc-900" />
                <span>Signing you in…</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                {/* Official Google Multi-Color SVG Icon */}
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 20.4 7.5 23 12 23z"
                  />
                </svg>
                <span className="font-sans font-bold tracking-wide">Continue with Google</span>
              </div>
            )}
          </Button>

          {/* Quick Demo Option for Instant Exploration */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1 group"
            >
              <span>Or explore as guest with demo data</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 5. Security Trust & Legal Footer */}
        <div className="pt-4 sm:pt-6 border-t border-[#EDE7D9] dark:border-zinc-800/70 space-y-2 text-center text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Secure account sync &amp; preparation history encrypted via Supabase RLS</span>
          </div>

          <div className="flex items-center justify-center gap-4 pt-1">
            <Link
              href="/privacy"
              className="hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-4 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-4 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
