import { TOPICS } from '@/data/problems';

/**
 * URL-friendly slugs for topic hub pages (/topics/[slug]), derived from each
 * Topic.key by lowercasing and swapping underscores for hyphens --
 * "Dynamic_Programming" becomes "dynamic-programming". Kept as a lookup
 * table (built once) rather than recomputed per request.
 */
const SLUG_TO_KEY = new Map(TOPICS.map((t) => [slugify(t.key), t.key]));

function slugify(topicKey: string): string {
  return topicKey.toLowerCase().replace(/_/g, '-');
}

export function topicKeyToSlug(topicKey: string): string {
  return slugify(topicKey);
}

/** The Topic for a /topics/[slug] URL, or undefined if the slug is unknown. */
export function topicBySlug(slug: string) {
  const key = SLUG_TO_KEY.get(slug);
  return key ? TOPICS.find((t) => t.key === key) : undefined;
}
