/**
 * AI / ML interview question bank.
 *
 * Split by theme into a few files so each stays readable. Ids are prefixed
 * "ai-" so they share the progress store with the DSA problems without any
 * chance of collision.
 */

import type { AIQuestion } from '@/lib/types';
import { fundamentalsQuestions } from './fundamentals';
import { ragAgentQuestions } from './rag-agents';
import { codingQuestions } from './coding';
import { apiQuestions } from './apis';
import { productionQuestions } from './production';

export const AI_QUESTIONS: AIQuestion[] = [
  ...fundamentalsQuestions,
  ...ragAgentQuestions,
  ...codingQuestions,
  ...apiQuestions,
  ...productionQuestions,
];

export const TOTAL_AI_QUESTIONS = AI_QUESTIONS.length;

export const AI_QUESTION_BY_ID = new Map(AI_QUESTIONS.map((q) => [q.id, q]));

/**
 * Categories in a deliberate order: fundamentals first, then retrieval, then
 * the building and production concerns. This is also a sensible study order.
 */
export const AI_CATEGORIES: string[] = [
  'ML Basics',
  'LLMs',
  'RAG',
  'Prompting',
  'Agents',
  'System Design',
  'Code',
  'APIs',
  'Structured',
  'Function Calling',
  'Multimodal',
  'Reasoning',
  'Guardrails',
  'LangChain',
  'Production',
];

export function aiQuestionsByCategory(category: string): AIQuestion[] {
  return AI_QUESTIONS.filter((q) => q.category === category);
}
