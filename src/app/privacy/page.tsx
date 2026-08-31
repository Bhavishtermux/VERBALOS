import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Database, UserCheck, EyeOff } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | VerbalOS",
  description: "Privacy Policy for VerbalOS — Your personal CAT VARC operating system.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to VerbalOS
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Last Updated: August 2026</span>
          </div>
        </div>

        {/* Brand Banner */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-1">
            <img src="/logo.png" alt="VerbalOS Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-zinc-500 font-mono">VerbalOS — Your personal CAT VARC operating system</p>
          </div>
        </div>

        {/* Privacy Notice Box */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-950 dark:text-emerald-100">Your Privacy is Protected</p>
            <p className="text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
              VerbalOS is a personal educational tool for CAT preparation. We never sell, monetize, or share your personal study data with third-party advertisers.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 1. Information We Collect
            </h2>
            <p>When you create an account and practice on VerbalOS, we collect:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li><strong>Google Account Information:</strong> Your name, email address, and profile picture provided via Google OAuth Single Sign-On.</li>
              <li><strong>Academic Practice Data:</strong> Reading speed (WPM), Reading Comprehension attempts, question answers, Verbal Ability answers, and sectional mock scores.</li>
              <li><strong>Mistake Journal Logs:</strong> Cognitive error categories and incorrect option selections to power your personalized weakness diagnostics.</li>
              <li><strong>Vocabulary Repository:</strong> Words looked up during passage reading and your recall flashcard review history.</li>
              <li><strong>User Preferences:</strong> Font typography, dark mode toggle, and daily passage goals.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Database className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 2. How We Use Your Information
            </h2>
            <p>Your data is used solely to provide and improve your personal CAT preparation experience:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li>To synchronize your study progress and vocabulary seamlessly across all your devices.</li>
              <li>To calculate authentic speed, accuracy, topic, and difficulty analytics.</li>
              <li>To generate transparent, rule-based practice recommendations based on your weakest skills.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Lock className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 3. Data Storage & Row Level Security
            </h2>
            <p>
              Your data is stored in a secure cloud PostgreSQL database managed by <strong>Supabase</strong>. All database tables are protected by strict <strong>Row Level Security (RLS)</strong> policies, ensuring that your study records and personal history can only be queried by your authenticated Google account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 4. Third-Party Services
            </h2>
            <p>We use trusted industry-standard infrastructure to operate VerbalOS:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li><strong>Google OAuth:</strong> For secure authentication without storing passwords.</li>
              <li><strong>Supabase:</strong> For database hosting, authentication token verification, and real-time cloud synchronization.</li>
              <li><strong>Vercel:</strong> For fast, SSL-encrypted global application hosting.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
              5. Your Rights & Data Deletion
            </h2>
            <p>
              You maintain complete ownership of your data. You may sign out at any time or request permanent deletion of your profile and study records by contacting us.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
              6. Contact Information
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              For any questions regarding this Privacy Policy, contact: <strong>bhavishyasatwal@gmail.com</strong>
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>© 2026 VerbalOS</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/login" className="hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
