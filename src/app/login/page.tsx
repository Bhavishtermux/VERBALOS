"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const { user, isConfigured, signInWithGoogle, demoLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect directly to dashboard
  if (user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-6 space-y-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-50">
            Signed in to VerbalOS
          </h2>
          <p className="text-xs text-zinc-500 font-mono">
            Signed in as <strong>{user.email || user.user_metadata?.display_name || "Aspirant"}</strong>
          </p>
          <div className="pt-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full text-xs font-semibold gap-1.5"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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

  // Instant Demo Access (for previewing cloud sync functionality if keys in setup mode)
  const handleInstantDemoAccess = () => {
    demoLogin("CAT Aspirant", "aspirant@verbalos.app");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-serif font-bold text-sm shadow-sm mb-1">
            VOS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50">
            VerbalOS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans">
            Your personal CAT VARC operating system.
          </p>
        </div>

        {/* Configuration Notice (if Supabase credentials in local setup mode) */}
        {!isConfigured && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1 font-mono text-[11px]">
                <Zap className="h-3.5 w-3.5 text-amber-600" /> Supabase Connection
              </span>
              <Badge variant="secondary" className="text-[9px] font-mono">
                Setup Required
              </Badge>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-200/80">
              Set <code className="bg-amber-100/80 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100/80 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in <code className="bg-amber-100/80 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[10px]">.env.local</code>. See <code className="bg-amber-100/80 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[10px]">SUPABASE_SETUP.md</code>.
            </p>
          </div>
        )}

        {/* Primary Login Card */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-md">
          <CardHeader className="pb-4 text-center border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-serif">Aspirant Sign In</CardTitle>
            <CardDescription className="text-xs">
              Sign in with your Google account to securely save and sync your progress across devices
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Primary Action: Continue with Google */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-11 text-xs sm:text-sm font-semibold gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-100 dark:border-zinc-500 dark:border-t-zinc-900" />
                  <span>Signing you in…</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            {/* Quick Demo Preview fallback */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleInstantDemoAccess}
                className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors underline underline-offset-4"
              >
                Instant Access Demo Account →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy Badge */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-zinc-400 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Personal account data protected by Supabase Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
