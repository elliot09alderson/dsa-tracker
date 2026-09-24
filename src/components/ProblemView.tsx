'use client';

/**
 * A single problem: statement, the approaches behind one click, and a practice
 * editor beside them.
 *
 * The solution starts hidden on purpose. The whole point of the tracker is to
 * attempt the problem first, so revealing it is one deliberate click -- and
 * once revealed, the tabs step through brute force -> better -> optimal.
 */

import Link from 'next/link';
import { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { COMPANY_BY_KEY } from '@/data/problems';
import { useProgress } from '@/lib/useProgress';
import type { Problem, Solution } from '@/lib/types';

const DIFFICULTY_COLOR = {
  Easy: 'text-easy',
  Medium: 'text-medium',
  Hard: 'text-hard',
} as const;

interface Props {
  problem: Problem;
  solution: Solution | undefined;
  /** Previous/next in the same topic, for keyboard-free navigation. */
  prevId: string | null;
  nextId: string | null;
}

export default function ProblemView({ problem, solution, prevId, nextId }: Props) {
  const { get, update, ready } = useProgress();
  const progress = get(problem.id);

  const [showSolution, setShowSolution] = useState(false);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const approach = solution?.approaches[tab];
  // Fall back to the solution's starter until the user has typed anything.
  const code = progress.code || solution?.starter || '';

  const copy = async () => {
    if (!approach) return;
    await navigator.clipboard.writeText(approach.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-[1400px] p-4 lg:p-6">
      {/* ---------- header ---------- */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/" className="text-sm text-muted transition hover:text-accent">
          ← All problems
        </Link>
        <span className="text-muted">/</span>
        <span className="text-sm text-muted">{problem.topicLabel}</span>

        <div className="ml-auto flex gap-2">
          {prevId && (
            <Link
              href={`/problems/${prevId}`}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted transition hover:border-muted hover:text-text"
            >
              ← Prev
            </Link>
          )}
          {nextId && (
            <Link
              href={`/problems/${nextId}`}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted transition hover:border-muted hover:text-text"
            >
              Next →
            </Link>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">{problem.title}</h1>
          <span className={`text-sm font-semibold ${DIFFICULTY_COLOR[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Link out to the original statement and test harness. */}
          <a
            href={problem.premium && problem.freeUrl ? problem.freeUrl : problem.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition hover:border-accent hover:text-accent"
          >
            Open on {problem.premium && problem.freeUrl ? 'GeeksforGeeks' : problem.platform} ↗
          </a>

          {problem.companies.map((key) => {
            const c = COMPANY_BY_KEY.get(key);
            if (!c) return null;
            return (
              <span
                key={key}
                className="rounded px-2 py-1 text-[11px]"
                style={{ backgroundColor: `${c.color}22`, color: c.color }}
              >
                {c.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* ---------- status toggles ---------- */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          disabled={!ready}
          onClick={() => update(problem.id, { solved: !progress.solved })}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
            progress.solved
              ? 'border-easy bg-easy/15 text-easy'
              : 'border-border text-muted hover:border-muted hover:text-text'
          }`}
        >
          {progress.solved ? '✓ Solved' : 'Mark solved'}
        </button>
        <button
          disabled={!ready}
          onClick={() => update(problem.id, { revisit: !progress.revisit })}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
            progress.revisit
              ? 'border-medium bg-medium/15 text-medium'
              : 'border-border text-muted hover:border-muted hover:text-text'
          }`}
        >
          {progress.revisit ? '★ Marked for revision' : 'Revisit later'}
        </button>
      </div>

      {/* ---------- statement ---------- */}
      {solution && (
        <div className="mb-4 rounded-lg border border-border bg-surface p-4">
          <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted uppercase">
            Problem
          </p>
          <p className="text-sm leading-relaxed">{solution.statement}</p>
        </div>
      )}

      {/* ---------- two columns: solution | practice ---------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Solution side */}
        <section className="rounded-lg border border-border bg-surface">
          {!solution ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted">
                The written solution for this problem is not in yet.
              </p>
              <a
                href={problem.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-accent hover:underline"
              >
                Read it on {problem.platform} ↗
              </a>
            </div>
          ) : !showSolution ? (
            <div className="p-8 text-center">
              <p className="mb-3 text-sm text-muted">
                Try it yourself first — the editor on the right is for that.
              </p>
              <button
                onClick={() => setShowSolution(true)}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:opacity-90"
              >
                Show solution ({solution.approaches.length} approaches)
              </button>
            </div>
          ) : (
            <>
              {/* Tabs: brute force -> better -> optimal */}
              <div className="flex items-center gap-1 border-b border-border px-2 pt-2">
                {solution.approaches.map((a, i) => (
                  <button
                    key={a.name}
                    onClick={() => setTab(i)}
                    className={`rounded-t-md px-3 py-2 text-xs font-medium transition ${
                      tab === i
                        ? 'bg-surface-2 text-accent'
                        : 'text-muted hover:text-text'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
                <button
                  onClick={() => setShowSolution(false)}
                  className="ml-auto px-2 py-2 text-xs text-muted transition hover:text-text"
                >
                  Hide
                </button>
              </div>

              {approach && (
                <div className="p-4">
                  {/* Complexity badges, the first thing an interviewer asks. */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded bg-bg px-2 py-1 text-[11px] text-muted">
                      Time <span className="mono text-text">{approach.time}</span>
                    </span>
                    <span className="rounded bg-bg px-2 py-1 text-[11px] text-muted">
                      Space <span className="mono text-text">{approach.space}</span>
                    </span>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-text/90">{approach.idea}</p>

                  <div className="relative">
                    <button
                      onClick={copy}
                      className="absolute top-2 right-2 rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted transition hover:text-text"
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <pre className="mono max-h-[480px] overflow-auto rounded-md bg-bg p-3 text-[13px] leading-relaxed">
                      {approach.code}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Practice side */}
        <section className="flex flex-col gap-4">
          <div className="min-h-[420px] flex-1">
            <CodeEditor
              value={code}
              onChange={(next) => update(problem.id, { code: next })}
              onReset={() => update(problem.id, { code: solution?.starter ?? '' })}
            />
          </div>

          {/* Notes travel with the problem and sync to Atlas like everything else. */}
          <div className="rounded-lg border border-border bg-surface">
            <p className="border-b border-border px-3 py-2 text-xs font-semibold text-muted">
              Notes
            </p>
            <textarea
              value={progress.notes}
              onChange={(e) => update(problem.id, { notes: e.target.value })}
              placeholder="What tripped you up? What is the trick to remember?"
              className="min-h-24 w-full resize-y bg-surface p-3 text-sm outline-none placeholder:text-muted"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
