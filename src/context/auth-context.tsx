"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { flushPendingSyncQueue } from "@/lib/supabase/data-service";

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error: AuthError | null; user: User | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  demoLogin: (displayName?: string, email?: string, avatarUrl?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_STORAGE_KEY = "rc_lab_local_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    const client = getSupabaseClient();

    if (isSupabaseConfigured && client) {
      // 1. Get initial Supabase session
      client.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (!isMounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          fetchOrCreateProfile(currentSession.user);
          flushPendingSyncQueue(currentSession.user.id);
        }
        setLoading(false);
      });

      // 2. Listen to Supabase auth changes
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange(async (_event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          fetchOrCreateProfile(newSession.user);
          flushPendingSyncQueue(newSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Fallback: Check local storage for persistent guest/demo session
      try {
        const localRaw = window.localStorage.getItem(LOCAL_USER_STORAGE_KEY);
        if (localRaw) {
          const parsed = JSON.parse(localRaw);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch (e) {
        console.warn("Could not read local demo auth", e);
      }
      setLoading(false);
    }
  }, []);

  // Helper to fetch or create user profile from Google / Supabase
  const fetchOrCreateProfile = async (currentUser: User) => {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const googleAvatar =
        currentUser.user_metadata?.avatar_url ||
        currentUser.user_metadata?.picture ||
        undefined;

      const googleName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        currentUser.user_metadata?.display_name ||
        currentUser.email?.split("@")[0] ||
        "Aspirant";

      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (data) {
        setProfile({
          id: data.id,
          userId: data.user_id,
          displayName: data.display_name || googleName,
          email: data.email || currentUser.email || "",
          avatarUrl: data.avatar_url || googleAvatar,
          createdAt: data.created_at,
        });
      } else {
        const { data: newProf } = await client
          .from("profiles")
          .insert({
            user_id: currentUser.id,
            display_name: googleName,
            email: currentUser.email || "",
            avatar_url: googleAvatar,
          })
          .select()
          .single();

        if (newProf) {
          setProfile({
            id: newProf.id,
            userId: newProf.user_id,
            displayName: newProf.display_name,
            email: newProf.email || currentUser.email || "",
            avatarUrl: newProf.avatar_url || googleAvatar,
            createdAt: newProf.created_at,
          });
        }
      }
    } catch (e) {
      console.warn("Error resolving user profile in Supabase", e);
    }
  };

  // Sign In with Google OAuth (Official flow through Supabase Auth)
  const signInWithGoogle = async () => {
    const client = getSupabaseClient();
    if (!client) {
      demoLogin("CAT Aspirant", "aspirant@gmail.com");
      return { error: null };
    }

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  // Optional Email + Password Sign In
  const signInWithEmail = async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) {
      demoLogin(email.split("@")[0], email);
      return { error: null };
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // Optional Email + Password Sign Up
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const client = getSupabaseClient();
    if (!client) {
      demoLogin(displayName || email.split("@")[0], email);
      return { error: null, user: null };
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    return { error, user: data.user };
  };

  // Forgot Password Reset Email
  const resetPassword = async (email: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: null };
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    return { error };
  };

  // Sign Out
  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    window.localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Demo Login (when in setup/local mode)
  const demoLogin = (displayName = "CAT Aspirant", email = "aspirant@verbalos.app", avatarUrl?: string) => {
    const mockId = "user-demo-personal-01";
    const mockUser: User = {
      id: mockId,
      app_metadata: {},
      user_metadata: { display_name: displayName, avatar_url: avatarUrl },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email,
    } as any;

    const mockProfile: UserProfile = {
      id: `prof-${mockId}`,
      userId: mockId,
      displayName,
      email,
      avatarUrl,
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setProfile(mockProfile);
    try {
      window.localStorage.setItem(
        LOCAL_USER_STORAGE_KEY,
        JSON.stringify({ user: mockUser, profile: mockProfile })
      );
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
