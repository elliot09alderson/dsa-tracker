import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProblemView from '@/components/ProblemView';
import { PROBLEM_BY_ID, PROBLEMS, problemsByTopic } from '@/data/problems';
import { getSolution } from '@/data/solutions';
import { SITE_URL } from '@/lib/site';
import { topicKeyToSlug } from '@/lib/topicSlug';

/**
 * Pre-render every problem page at build time. The catalogue is static, so
 * this makes navigation instant and costs nothing at runtime.
 */
export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const problem = PROBLEM_BY_ID.get(id);
  if (!problem) return {};

  const solution = getSolution(id);
  // A per-problem description, not a repeated generic one -- this is what
  // actually shows in a search result snippet.
  const description = solution
    ? truncate(solution.statement, 155)
    : `${problem.title} (${problem.difficulty}) -- a ${problem.topicLabel} interview problem from ${problem.platform}.`;

  const url = `${SITE_URL}/problems/${problem.id}`;
  const title = `${problem.title} (${problem.difficulty})`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { title, description },
  };
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = PROBLEM_BY_ID.get(id);
  if (!problem) notFound();

  // Prev/next walk within the current topic, which is how you actually work
  // through a sheet.
  const siblings = problemsByTopic(problem.topic);
  const index = siblings.findIndex((p) => p.id === problem.id);

  const url = `${SITE_URL}/problems/${problem.id}`;
  const solution = getSolution(problem.id);

  // TechArticle for the solution write-up itself, plus a BreadcrumbList so
  // search engines understand this page's place in the site (Home > Topic >
  // Problem), which is also what can surface as the breadcrumb trail in a
  // search result instead of a raw URL.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: problem.title,
        description: solution ? truncate(solution.statement, 200) : problem.title,
        url,
        proficiencyLevel: problem.difficulty,
        about: problem.topicLabel,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSA Tracker', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: problem.topicLabel,
            item: `${SITE_URL}/topics/${topicKeyToSlug(problem.topic)}`,
          },
          { '@type': 'ListItem', position: 3, name: problem.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProblemView
        problem={problem}
        solution={solution}
        prevId={index > 0 ? siblings[index - 1].id : null}
        nextId={index < siblings.length - 1 ? siblings[index + 1].id : null}
      />
    </>
  );
}
