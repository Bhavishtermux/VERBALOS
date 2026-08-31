# VerbalOS — Supabase & Google Authentication Setup Guide

> **Tagline:** *Your personal CAT VARC operating system.*

This guide explains the complete setup procedure to connect **VerbalOS** to your Supabase project for **Google OAuth Single Sign-On (SSO)** and **Cross-Device PostgreSQL Cloud Synchronization** with **Row Level Security (RLS)**.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project**.
3. Choose your organization, set a project name (e.g. `verbalos`), and create a secure database password.
4. Select your preferred region and click **Create new project**.

---

## 2. Run the Database Schema & RLS Policies

1. In your Supabase Dashboard, click the **SQL Editor** tab on the left navigation bar.
2. Click **New Query**.
3. Open the [`supabase/schema.sql`](file:///C:/Users/bhavi/.gemini/antigravity/scratch/rc-lab/supabase/schema.sql) file from this repository and paste the entire SQL content into the editor.
4. Click **Run**.
5. This creates the 9 dedicated tables with strict **Row Level Security (RLS)** ensuring full user data isolation (`auth.uid() = user_id`):
   - `profiles` (Google profile metadata: `avatar_url`, `display_name`, `email`)
   - `practice_sessions` (RC & VA attempt history, WPM calibration, timers, accuracy)
   - `answers` (Per-question answers, correctness, and mistake diagnoses)
   - `vocabulary` (Cloud-synced vocabulary repository, lookup counts, and context sentences)
   - `mocks` (Full 40-minute VARC section mock attempts, scores, and percentile tracking)
   - `mock_answers` (Sectional mock question states and answer palette logs)
   - `mistakes` (Mistake journal entries classified across 12 CAT cognitive trap categories)
   - `user_settings` (Reading typography, font size, timer mode, and dark mode preference)
   - `daily_progress` (Daily practice cadence and streak history)
   - Automated user & profile trigger upon OAuth sign-in.

---

## 3. Configure Google OAuth in Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing project).
3. Navigate to **APIs & Services** → **OAuth consent screen**:
   - User Type: **External** → Click **Create**.
   - App name: `VerbalOS`
   - User support email: Select your email.
   - Developer contact email: Enter your email.
   - Click **Save and Continue**.
   - Under **Scopes**, click **Save and Continue** (default `email`, `profile`, `openid` scopes are sufficient).
4. Navigate to **APIs & Services** → **Credentials**:
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `VerbalOS Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://your-production-app.vercel.app` (when deploying to Vercel)
   - **Authorized redirect URIs**:
     - Paste your Supabase project callback URL:
       `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
       *(You can also find this in Supabase Dashboard → Authentication → Providers → Google)*
   - Click **Create**.
5. Copy your **Client ID** and **Client Secret**.

---

## 4. Enable Google Provider in Supabase

1. In your Supabase Dashboard, go to **Authentication** → **Providers**.
2. Scroll to **Google** and toggle it **Enabled**.
3. Paste the **Client ID** and **Client Secret** obtained from Google Cloud.
4. In Supabase Dashboard, go to **Authentication** → **URL Configuration**:
   - **Site URL**:
     - For local development: `http://localhost:3000`
     - For production: `https://your-production-app.vercel.app`
   - **Redirect URLs (Whitelist)**:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**`
     - `https://*.vercel.app/auth/callback` (for Vercel preview & production deployments)
     - `https://*.vercel.app/**`
5. Click **Save**.

---

## 5. Configure Local Environment Variables

In the project root directory, create or edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-public-key>
```

> [!IMPORTANT]
> - Obtain your **Project URL** and **anon public key** from Supabase Dashboard under **Project Settings** → **API**.
> - **NEVER** expose the `service_role` secret key in frontend code or `.env.local`.

---

## 6. Verification Flow

1. Start VerbalOS:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000/login` in your browser.
3. Click **Continue with Google**.
4. Select your Google account and grant consent.
5. Google will redirect back to `/auth/callback`, establish the session, and take you to `/dashboard`.
6. Open an Incognito / Private window or a secondary device, sign in with the same Google account, and your complete VARC history, vocabulary words, and mock attempts will load seamlessly.
