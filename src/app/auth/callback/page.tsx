"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const client = getSupabaseClient();
      if (!isSupabaseConfigured || !client) {
        router.replace("/dashboard");
        return;
      }

      try {
        // 1. Check if an error was passed in the URL hash or query params
        if (typeof window !== "undefined") {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const searchParams = new URLSearchParams(window.location.search);

          const errorDesc =
            hashParams.get("error_description") ||
            searchParams.get("error_description") ||
            hashParams.get("error") ||
            searchParams.get("error");

          if (errorDesc) {
            console.error("Supabase OAuth callback error:", errorDesc);
            setErrorMsg(decodeURIComponent(errorDesc));
            setTimeout(() => {
              router.replace(`/login?error=${encodeURIComponent(errorDesc)}`);
            }, 2000);
            return;
          }

          // 2. Handle PKCE authorization code if present in search params
          const code = searchParams.get("code");
          if (code) {
            const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              console.error("PKCE exchange error:", exchangeError);
              setErrorMsg(exchangeError.message);
              setTimeout(() => {
                router.replace(`/login?error=${encodeURIComponent(exchangeError.message)}`);
              }, 2000);
              return;
            }
          }
        }

        // 3. Confirm active session
        const { data: { session } } = await client.auth.getSession();
        if (session) {
          router.replace("/dashboard");
        } else {
          // Listen for onAuthStateChange to finish resolution
          const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
            if (session) {
              subscription.unsubscribe();
              router.replace("/dashboard");
            }
          });
        }
      } catch (err: any) {
        console.error("Callback processing exception:", err);
        router.replace("/dashboard");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="text-center space-y-3 max-w-sm">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent mx-auto dark:border-zinc-100" />
        <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">
          {errorMsg ? "Authentication Error" : "Signing you into VerbalOS…"}
        </h3>
        <p className="text-xs text-zinc-500 font-mono">
          {errorMsg ? errorMsg : "Establishing secure cloud session..."}
        </p>
      </div>
    </div>
  );
}
