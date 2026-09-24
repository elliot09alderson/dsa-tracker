/**
 * Site-wide constants for SEO: the canonical base URL and a couple of
 * strings reused across every page's metadata.
 *
 * The base URL prefers Vercel's automatically-injected production URL (so
 * this never goes stale if the project is renamed or moved to a custom
 * domain) and falls back to the known deployment for local dev / builds
 * that run outside Vercel.
 */
const VERCEL_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = VERCEL_URL
  ? `https://${VERCEL_URL}`
  : 'https://dsa-tracker-sable-nu.vercel.app';

export const SITE_NAME = 'DSA Tracker';

export const SITE_DESCRIPTION =
  '261 data structures & algorithms interview problems with brute-force, better and optimal solutions, company tags, and a built-in practice editor with a test runner.';
