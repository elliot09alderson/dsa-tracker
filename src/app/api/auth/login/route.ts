/**
 * POST /api/auth/login -- sign in to an existing account.
 *
 * Body: { email, password }
 * On success, sets the session cookie and returns { email, name }.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mongoConfigured, usersCollection } from '@/lib/mongo';
import { createSessionToken, verifyPassword, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!mongoConfigured) {
    return NextResponse.json(
      { error: 'Accounts are not configured on this deployment.' },
      { status: 501 },
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body was not valid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  // Same message either way -- do not reveal whether the email exists at
  // all, which would let an attacker enumerate real accounts.
  const invalidCredentials = () =>
    NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });

  try {
    const users = await usersCollection();
    const user = await users.findOne({ _id: email });
    if (!user) return invalidCredentials();

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return invalidCredentials();

    const token = createSessionToken({ email: user._id, name: user.name });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json({ email: user._id, name: user.name });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Login failed' },
      { status: 500 },
    );
  }
}
