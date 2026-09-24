import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AIQuestionView from '@/components/AIQuestionView';
import { AI_QUESTIONS, AI_QUESTION_BY_ID } from '@/data/ai';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return AI_QUESTIONS.map((q) => ({ id: q.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const question = AI_QUESTION_BY_ID.get(id);
  if (!question) return {};

  const description = truncate(question.shortAnswer, 155);
  const url = `${SITE_URL}/ai/${question.id}`;

  return {
    title: question.question,
    description,
    alternates: { canonical: url },
    openGraph: { title: question.question, description, url, type: 'article' },
    twitter: { title: question.question, description },
  };
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

export default async function AIQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = AI_QUESTION_BY_ID.get(id);
  if (!question) notFound();

  const index = AI_QUESTIONS.findIndex((q) => q.id === id);
  const url = `${SITE_URL}/ai/${question.id}`;

  // QAPage/Question is the schema Google looks for to show a direct
  // question-and-answer rich result -- a close match for how this page is
  // actually structured (one question, one accepted answer).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.shortAnswer,
        url,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AIQuestionView
        question={question}
        prevId={index > 0 ? AI_QUESTIONS[index - 1].id : null}
        nextId={index < AI_QUESTIONS.length - 1 ? AI_QUESTIONS[index + 1].id : null}
      />
    </>
  );
}
