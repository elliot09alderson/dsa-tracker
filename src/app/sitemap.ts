import type { MetadataRoute } from 'next';
import { PROBLEMS, TOPICS } from '@/data/problems';
import { AI_QUESTIONS } from '@/data/ai';
import { SOLVED_PROBLEM_IDS } from '@/data/solutions';
import { topicKeyToSlug } from '@/lib/topicSlug';
import { SITE_URL } from '@/lib/site';

/**
 * Every crawlable URL in the app, generated at build time from the same
 * catalogue that drives generateStaticParams elsewhere -- so a new problem
 * or topic added to the data automatically appears here too, with no
 * separate list to keep in sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/ai`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const topicPages: MetadataRoute.Sitemap = TOPICS.map((t) => ({
    url: `${SITE_URL}/topics/${topicKeyToSlug(t.key)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const problemPages: MetadataRoute.Sitemap = PROBLEMS.map((p) => ({
    url: `${SITE_URL}/problems/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    // A problem with a written solution is a materially more complete page
    // than one that just links out -- worth a small priority bump.
    priority: SOLVED_PROBLEM_IDS.has(p.id) ? 0.7 : 0.5,
  }));

  const aiPages: MetadataRoute.Sitemap = AI_QUESTIONS.map((q) => ({
    url: `${SITE_URL}/ai/${q.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...topicPages, ...problemPages, ...aiPages];
}
