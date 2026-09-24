/**
 * Password hashing and session tokens -- deliberately built on Node's
 * built-in `crypto` module rather than bcrypt/jsonwebtoken, matching this
 * project's existing preference for zero extra packages (see the comment
 * atop CodeEditor.tsx). scrypt is the standard's own recommended choice for
 * password hashing, and a session token here is just a JSON payload with an
 * HMAC-SHA256 signature -- the same idea a JWT uses, without the library.
 *
 * Server-only: everything here touches Node's crypto module or reads the
 * session secret, so this must never be imported from client components.
 */

import { randomBytes, scrypt as scryptCallback, createHmac, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);

// --- password hashing --------------------------------------------------

const KEY_LENGTH = 64;

/** Hashes a plaintext password into a "salt:hash" string safe to store. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

/** Checks a plaintext password against a "salt:hash" string from hashPassword. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(':');
  if (!salt || !hashHex) return false;

  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const storedKey = Buffer.from(hashHex, 'hex');

  // Constant-time comparison -- a plain === would leak timing information
  // about how many leading bytes matched, which a patient attacker could
  // use to guess the hash byte by byte.
  if (derivedKey.length !== storedKey.length) return false;
  return timingSafeEqual(derivedKey, storedKey);
}

// --- session tokens ------------------------------------------------------

export interface SessionUser {
  email: string;
  name: string;
}

interface SessionPayload extends SessionUser {
  /** Unix seconds; the token is rejected once the clock passes this. */
  exp: number;
}

export const SESSION_COOKIE_NAME = 'dsa_tracker_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error('AUTH_SECRET is not set');
  return value;
}

function sign(encodedPayload: string): string {
  return createHmac('sha256', secret()).update(encodedPayload).digest('base64url');
}

/** Builds a signed, self-contained session token for this user. */
export function createSessionToken(user: SessionUser): string {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

/**
 * Verifies a session token's signature and expiry, returning the user it
 * names, or null if the token is missing, tampered with, or expired.
 */
export function verifySessionToken(token: string | undefined | null): SessionUser | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  const actual = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actual.length !== expectedBuffer.length || !timingSafeEqual(actual, expectedBuffer)) {
    return null; // signature does not match -- tampered or signed with a different secret
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as SessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) return null; // expired

    return { email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}
