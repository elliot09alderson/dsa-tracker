import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PROBLEMS, TOPICS } from '@/data/problems';
import { SOLVED_PROBLEM_IDS } from '@/data/solutions';
import { SITE_URL } from '@/lib/site';
import { topicBySlug, topicKeyToSlug } from '@/lib/topicSlug';
import type { Difficulty } from '@/lib/types';

/**
 * One indexable hub page per topic (e.g. /topics/dynamic-programming),
 * listing every problem in it. These didn't exist before -- topics were
 * only a client-side filter on the dashboard, so a search engine had no
 * URL to rank for "dynamic programming interview questions" against. This
 * is the hub in a hub-and-spoke structure: it links out to every problem
 * page (a spoke) in the topic, and is itself linked from the sidebar.
 */
export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: topicKeyToSlug(t.key) }));
}

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: 'text-easy',
  Medium: 'text-medium',
  Hard: 'text-hard',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) return {};

  const count = PROBLEMS.filter((p) => p.topic === topic.key).length;
  const title = `${topic.label} Interview Questions`;
  const description = `${count} ${topic.label} interview problems with brute-force, better and optimal solutions -- company tags included, and a practice editor for each one.`;
  const url = `${SITE_URL}/topics/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { title, description },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) notFound();

  const problems = PROBLEMS.filter((p) => p.topic === topic.key);
  const solvedCount = problems.filter((p) => SOLVED_PROBLEM_IDS.has(p.id)).length;
  const url = `${SITE_URL}/topics/${slug}`;

  // ItemList is the schema match for "this page is a list of N things" --
  // each list item points at its own problem page.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `${topic.label} Interview Questions`,
        url,
        numberOfItems: problems.length,
        itemListElement: problems.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/problems/${p.id}`,
          name: p.title,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSA Tracker', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: topic.label, item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl p-4 lg:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="text-sm text-muted transition hover:text-accent">
        ← All problems
      </Link>

      <h1 className="mt-3 mb-2 text-2xl font-bold tracking-tight">{topic.label} Interview Questions</h1>
      <p className="mb-6 text-sm text-muted">
        {problems.length} problems with written solutions where available, sourced from LeetCode,
        GeeksforGeeks and InterviewBit. {solvedCount} solved so far in this browser.
      </p>

      <ul className="overflow-hidden rounded-lg border border-border bg-surface">
        {problems.map((p) => (
          <li key={p.id} className="border-b border-border last:border-b-0">
            <Link
              href={`/problems/${p.id}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition hover:bg-surface-2 hover:text-accent"
            >
              <span className="min-w-0 flex-1 truncate">{p.title}</span>
              <span className={`w-14 shrink-0 text-right text-xs ${DIFFICULTY_COLOR[p.difficulty]}`}>
                {p.difficulty}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">
        Browse{' '}
        <Link href="/" className="text-accent hover:underline">
          every topic
        </Link>{' '}
        or the{' '}
        <Link href="/ai" className="text-accent hover:underline">
          AI/ML interview question bank
        </Link>
        .
      </p>
    </div>
  );
}
