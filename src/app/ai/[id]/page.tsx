import { notFound } from 'next/navigation';
import AIQuestionView from '@/components/AIQuestionView';
import { AI_QUESTIONS, AI_QUESTION_BY_ID } from '@/data/ai';

export function generateStaticParams() {
  return AI_QUESTIONS.map((q) => ({ id: q.id }));
}

export default async function AIQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = AI_QUESTION_BY_ID.get(id);
  if (!question) notFound();

  // Prev/next walk the bank in order rather than within a category, so you can
  // work straight through it.
  const index = AI_QUESTIONS.findIndex((q) => q.id === id);

  return (
    <AIQuestionView
      question={question}
      prevId={index > 0 ? AI_QUESTIONS[index - 1].id : null}
      nextId={index < AI_QUESTIONS.length - 1 ? AI_QUESTIONS[index + 1].id : null}
    />
  );
}
