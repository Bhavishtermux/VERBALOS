-- ============================================================================
-- VARC LAB: SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRACTICE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    practice_type TEXT NOT NULL DEFAULT 'rc', -- 'rc', 'para-summary', 'para-jumbles', 'odd-sentence-out'
    content_id TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    reading_time_seconds INTEGER NOT NULL DEFAULT 0,
    question_time_seconds INTEGER NOT NULL DEFAULT 0,
    total_time_seconds INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 5,
    accuracy INTEGER NOT NULL DEFAULT 0,
    wpm INTEGER NOT NULL DEFAULT 0,
    source TEXT,
    topic TEXT,
    difficulty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    selected_answer TEXT,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    question_type TEXT NOT NULL,
    difficulty TEXT,
    mistake_type TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. VOCABULARY TABLE
CREATE TABLE IF NOT EXISTS public.vocabulary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    part_of_speech TEXT,
    pronunciation TEXT,
    abbreviation TEXT DEFAULT 'No commonly used abbreviation',
    example TEXT,
    synonyms TEXT[] DEFAULT '{}',
    antonyms TEXT[] DEFAULT '{}',
    lookup_count INTEGER NOT NULL DEFAULT 1,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, word)
);

-- 5. MOCKS TABLE (Timed VARC Section Simulations)
CREATE TABLE IF NOT EXISTS public.mocks (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    total_time_seconds INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    attempted INTEGER NOT NULL DEFAULT 0,
    correct INTEGER NOT NULL DEFAULT 0,
    incorrect INTEGER NOT NULL DEFAULT 0,
    unattempted INTEGER NOT NULL DEFAULT 0,
    accuracy INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. MOCK ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.mock_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mock_id TEXT NOT NULL REFERENCES public.mocks(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    selected_answer TEXT,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    question_type TEXT NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. MISTAKES TABLE (Mistake Journal Log)
CREATE TABLE IF NOT EXISTS public.mistakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    question_type TEXT NOT NULL,
    mistake_type TEXT NOT NULL,
    user_answer TEXT,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    font_size TEXT DEFAULT 'base',
    reading_width TEXT DEFAULT 'normal',
    dark_mode BOOLEAN DEFAULT false,
    timer_visible BOOLEAN DEFAULT true,
    reading_font TEXT DEFAULT 'serif',
    daily_goal_passages INTEGER DEFAULT 3,
    target_wpm INTEGER DEFAULT 300,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. DAILY PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.daily_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    rc_completed INTEGER NOT NULL DEFAULT 0,
    va_completed INTEGER NOT NULL DEFAULT 0,
    mock_completed INTEGER NOT NULL DEFAULT 0,
    daily_goal INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, date)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_created ON public.practice_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_user_session ON public.answers(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_user_last_seen ON public.vocabulary(user_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_mocks_user_created ON public.mocks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mock_answers_user_mock ON public.mock_answers(user_id, mock_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_user_type ON public.mistakes(user_id, mistake_type);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON public.daily_progress(user_id, date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 2. Practice Sessions
CREATE POLICY "Users can view their own practice sessions" ON public.practice_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own practice sessions" ON public.practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own practice sessions" ON public.practice_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own practice sessions" ON public.practice_sessions FOR DELETE USING (auth.uid() = user_id);

-- 3. Answers
CREATE POLICY "Users can view their own answers" ON public.answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own answers" ON public.answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own answers" ON public.answers FOR UPDATE USING (auth.uid() = user_id);

-- 4. Vocabulary
CREATE POLICY "Users can view their own vocabulary" ON public.vocabulary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vocabulary" ON public.vocabulary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vocabulary" ON public.vocabulary FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vocabulary" ON public.vocabulary FOR DELETE USING (auth.uid() = user_id);

-- 5. Mocks
CREATE POLICY "Users can view their own mocks" ON public.mocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mocks" ON public.mocks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mocks" ON public.mocks FOR UPDATE USING (auth.uid() = user_id);

-- 6. Mock Answers
CREATE POLICY "Users can view their own mock answers" ON public.mock_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mock answers" ON public.mock_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Mistakes
CREATE POLICY "Users can view their own mistakes" ON public.mistakes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mistakes" ON public.mistakes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. User Settings
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- 9. Daily Progress
CREATE POLICY "Users can view their own daily progress" ON public.daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own daily progress" ON public.daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily progress" ON public.daily_progress FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- AUTOMATED USER & PROFILE CREATION TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, email, avatar_url)
    VALUES (
        new.id,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            new.raw_user_meta_data->>'display_name',
            split_part(new.email, '@', 1)
        ),
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'avatar_url',
            new.raw_user_meta_data->>'picture'
        )
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
        display_name = EXCLUDED.display_name,
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = timezone('utc'::text, now());

    INSERT INTO public.user_settings (user_id)
    VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
