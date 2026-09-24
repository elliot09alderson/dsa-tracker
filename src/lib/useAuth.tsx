'use client';

/**
 * Account state for the whole app: who (if anyone) is signed in, plus the
 * signup/login/logout actions. One provider at the root, same pattern as
 * ProgressProvider.
 *
 * Signing in is optional -- the tracker works fully anonymously, local-only
 * (see storage.ts). An account only adds cloud sync of your progress; it is
 * never required to use the app.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface AuthUser {
  email: string;
  name: string;
}

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: AuthUser | null;
  /** False once the initial "am I already signed in?" check has completed. */
  loading: boolean;
  login(email: string, password: string): Promise<AuthResult>;
  signup(name: string, email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function errorFrom(res: Response, fallback: string): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((body: { user: AuthUser | null }) => {
        if (!cancelled) setUser(body.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return { ok: false, error: await errorFrom(res, 'Login failed') };

    const body = (await res.json()) as AuthUser;
    setUser(body);
    return { ok: true };
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) return { ok: false, error: await errorFrom(res, 'Signup failed') };

      const body = (await res.json()) as AuthUser;
      setUser(body);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
