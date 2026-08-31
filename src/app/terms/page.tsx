import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShieldCheck, Scale, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | VerbalOS",
  description: "Terms of Service for VerbalOS — Your personal CAT VARC operating system.",
};

export default function TermsOfServicePage() {
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
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Terms of Service</h1>
            <p className="text-xs text-zinc-500 font-mono">VerbalOS — Your personal CAT VARC operating system</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Scale className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using <strong>VerbalOS</strong> (located at <code>https://verbalos.vercel.app</code> or any related local/cloud deployment), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 2. Academic Purpose & Permitted Use
            </h2>
            <p>
              VerbalOS is designed exclusively as a personal learning and training platform for the Indian Common Admission Test (CAT) Verbal Ability and Reading Comprehension (VARC) section. You may use the service for your personal, non-commercial educational preparation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 3. User Accounts & Google Authentication
            </h2>
            <p>
              You access VerbalOS by authenticating via your Google account. You are responsible for maintaining the security of your Google account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
              4. Intellectual Property
            </h2>
            <p>
              The design, software, algorithms, diagnostic rule engines, strategy tools, and question explanations in VerbalOS are the intellectual property of the application creators. Reading passage excerpts from public intellectual publications (e.g., Aeon, The Atlantic) are used under fair educational use for critical reading practice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> 5. Disclaimer of Warranties
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              VerbalOS is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. While we strive to provide authentic CAT-grade questions and analytical accuracy, we do not guarantee specific percentile scores or exam outcomes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
              6. Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes become effective immediately upon posting to this page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
              7. Contact
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              For any questions regarding these Terms of Service, reach out to: <strong>bhavishyasatwal@gmail.com</strong>
            </p>
          </section>
        </div>

        {/* Footer links */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>© 2026 VerbalOS</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/login" className="hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
