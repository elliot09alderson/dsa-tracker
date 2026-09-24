/**
 * POST /api/auth/signup -- create an account and sign in as it.
 *
 * Body: { name, email, password }
 * On success, sets the session cookie and returns { email, name }.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mongoConfigured, usersCollection } from '@/lib/mongo';
import {
  createSessionToken,
  hashPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!mongoConfigured) {
    return NextResponse.json(
      { error: 'Accounts are not configured on this deployment.' },
      { status: 501 },
    );
  }

  let body: { name?: unknown; email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body was not valid JSON' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name) return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }

  try {
    const users = await usersCollection();

    const existing = await users.findOne({ _id: email });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    await users.insertOne({ _id: email, name, passwordHash, createdAt: new Date().toISOString() });

    const token = createSessionToken({ email, name });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json({ email, name });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Signup failed' },
      { status: 500 },
    );
  }
}
