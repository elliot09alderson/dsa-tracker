'use client';

/**
 * Sign in / sign up / signed-in status, shown in the sidebar under the
 * section switcher. Small and unobtrusive on purpose -- an account only
 * unlocks cloud sync of your progress; the tracker works fully anonymously
 * without one (see the comment atop useAuth.tsx).
 */

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';

export default function AuthPanel() {
  const { user, loading, login, signup, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = mode === 'login' ? await login(email, password) : await signup(name, email, password);

    setSubmitting(false);
    if (result.ok) {
      setOpen(false);
      reset();
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    // A fixed-height placeholder avoids a layout jump once the session
    // check (a single fast fetch) resolves.
    return <div className="mb-5 h-8" />;
  }

  if (user) {
    return (
      <div className="mb-5 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">{user.name}</p>
          <p className="truncate text-[10px] text-muted">Synced to your account</p>
        </div>
        <button
          onClick={() => void logout()}
          className="shrink-0 rounded-md border border-border px-2 py-1 text-[10px] text-muted transition hover:border-muted hover:text-text"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-left text-xs text-muted transition hover:border-muted hover:text-text"
        >
          Sign in to sync progress across devices
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-surface-2 p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-1 rounded-md border border-border bg-bg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`rounded px-2 py-1 font-medium transition ${
                  mode === 'login' ? 'bg-accent text-bg' : 'text-muted'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`rounded px-2 py-1 font-medium transition ${
                  mode === 'signup' ? 'bg-accent text-bg' : 'text-muted'
                }`}
              >
                Sign up
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); reset(); }}
              className="text-xs text-muted transition hover:text-text"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {mode === 'signup' && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                autoComplete="name"
                required
                className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs outline-none focus:border-accent"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs outline-none focus:border-accent"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={mode === 'signup' ? 'Password (min 8 characters)' : 'Password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={mode === 'signup' ? 8 : undefined}
              required
              className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs outline-none focus:border-accent"
            />
          </div>

          {error && <p className="mt-2 text-[11px] text-hard">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2.5 w-full rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-bg transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      )}
    </div>
  );
}
