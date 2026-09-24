'use client';

/**
 * A single AI/ML question.
 *
 * The tabs mirror how these are actually assessed: the crisp spoken answer
 * first, the reasoning behind it second, the follow-ups an interviewer reaches
 * for third, and -- on implementation questions -- the code. Everything starts
 * hidden so you can attempt the answer before reading one.
 */

import Link from 'next/link';
import { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { useProgress } from '@/lib/useProgress';
import type { AIQuestion } from '@/lib/types';

const DIFFICULTY_COLOR = {
  Easy: 'text-easy',
  Medium: 'text-medium',
  Hard: 'text-hard',
} as const;

interface Props {
  question: AIQuestion;
  prevId: string | null;
  nextId: string | null;
}

export default function AIQuestionView({ question, prevId, nextId }: Props) {
  const { get, update, ready } = useProgress();
  const progress = get(question.id);

  const [revealed, setRevealed] = useState(false);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);

  // Tabs are built from what this question actually has -- the Code tab only
  // exists on implementation questions.
  const tabs = [
    { key: 'short', label: 'Short answer' },
    { key: 'deep', label: 'Deep dive' },
    { key: 'follow', label: 'Follow-ups' },
    ...(question.code ? [{ key: 'code', label: 'Code' }] : []),
  ];

  const copyCode = async () => {
    if (!question.code) return;
    await navigator.clipboard.writeText(question.code.source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const active = tabs[tab]?.key;
  const isCodeQuestion = Boolean(question.code);

  return (
    <div className="mx-auto max-w-[1400px] p-4 lg:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/ai" className="text-sm text-muted transition hover:text-accent">
          ← All AI questions
        </Link>
        <span className="text-muted">/</span>
        <span className="text-sm text-muted">{question.category}</span>

        <div className="ml-auto flex gap-2">
          {prevId && (
            <Link
              href={`/ai/${prevId}`}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted transition hover:border-muted hover:text-text"
            >
              ← Prev
            </Link>
          )}
          {nextId && (
            <Link
              href={`/ai/${nextId}`}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted transition hover:border-muted hover:text-text"
            >
              Next →
            </Link>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="mb-2 text-xl font-bold tracking-tight">{question.question}</h1>
        <span className={`text-sm font-semibold ${DIFFICULTY_COLOR[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          disabled={!ready}
          onClick={() => update(question.id, { solved: !progress.solved })}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
            progress.solved
              ? 'border-easy bg-easy/15 text-easy'
              : 'border-border text-muted hover:border-muted hover:text-text'
          }`}
        >
          {progress.solved ? '✓ Reviewed' : 'Mark reviewed'}
        </button>
        <button
          disabled={!ready}
          onClick={() => update(question.id, { revisit: !progress.revisit })}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
            progress.revisit
              ? 'border-medium bg-medium/15 text-medium'
              : 'border-border text-muted hover:border-muted hover:text-text'
          }`}
        >
          {progress.revisit ? '★ Marked for revision' : 'Revisit later'}
        </button>
      </div>

      <div className={`grid gap-4 ${isCodeQuestion ? 'lg:grid-cols-2' : ''}`}>
        <section className="rounded-lg border border-border bg-surface">
          {!revealed ? (
            <div className="p-8 text-center">
              <p className="mb-3 text-sm text-muted">
                Say your answer out loud first — then check it against this.
              </p>
              <button
                onClick={() => setRevealed(true)}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:opacity-90"
              >
                Show answer
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 pt-2">
                {tabs.map((t, i) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(i)}
                    className={`rounded-t-md px-3 py-2 text-xs font-medium transition ${
                      tab === i ? 'bg-surface-2 text-accent' : 'text-muted hover:text-text'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  onClick={() => setRevealed(false)}
                  className="ml-auto px-2 py-2 text-xs text-muted transition hover:text-text"
                >
                  Hide
                </button>
              </div>

              <div className="p-4">
                {active === 'short' && (
                  <p className="text-sm leading-relaxed">{question.shortAnswer}</p>
                )}

                {active === 'deep' && (
                  // whitespace-pre-line keeps the paragraph and list breaks
                  // written into the source string.
                  <p className="text-sm leading-relaxed whitespace-pre-line text-text/90">
                    {question.deepDive}
                  </p>
                )}

                {active === 'follow' && (
                  <ul className="space-y-2">
                    {question.followUps.map((f) => (
                      <li key={f} className="flex gap-2 text-sm leading-relaxed">
                        <span className="text-accent">→</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {active === 'code' && question.code && (
                  <div className="relative">
                    <button
                      onClick={copyCode}
                      className="absolute top-2 right-2 rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted transition hover:text-text"
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <pre className="mono max-h-[560px] overflow-auto rounded-md bg-bg p-3 text-[13px] leading-relaxed">
                      {question.code.source}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Implementation questions get an editor; discussion questions get notes only. */}
        {isCodeQuestion && (
          <section className="flex flex-col gap-4">
            <div className="min-h-[420px] flex-1">
              <CodeEditor
                value={progress.code || question.starter || ''}
                onChange={(next) => update(question.id, { code: next })}
                onReset={() => update(question.id, { code: question.starter ?? '' })}
              />
            </div>
          </section>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface">
        <p className="border-b border-border px-3 py-2 text-xs font-semibold text-muted">Notes</p>
        <textarea
          value={progress.notes}
          onChange={(e) => update(question.id, { notes: e.target.value })}
          placeholder="How would you phrase this in your own words?"
          className="min-h-24 w-full resize-y bg-surface p-3 text-sm outline-none placeholder:text-muted"
        />
      </div>
    </div>
  );
}
