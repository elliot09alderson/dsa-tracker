import { notFound } from 'next/navigation';
import ProblemView from '@/components/ProblemView';
import { PROBLEM_BY_ID, PROBLEMS, problemsByTopic } from '@/data/problems';
import { getSolution } from '@/data/solutions';

/**
 * Pre-render every problem page at build time. The catalogue is static, so
 * this makes navigation instant and costs nothing at runtime.
 */
export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ id: p.id }));
}

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = PROBLEM_BY_ID.get(id);
  if (!problem) notFound();

  // Prev/next walk within the current topic, which is how you actually work
  // through a sheet.
  const siblings = problemsByTopic(problem.topic);
  const index = siblings.findIndex((p) => p.id === problem.id);

  return (
    <ProblemView
      problem={problem}
      solution={getSolution(problem.id)}
      prevId={index > 0 ? siblings[index - 1].id : null}
      nextId={index < siblings.length - 1 ? siblings[index + 1].id : null}
    />
  );
}
