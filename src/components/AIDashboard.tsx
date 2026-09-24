'use client';

/**
 * The AI/ML question bank: categories on the left, filtered question list on
 * the right. Same filter model and progress store as the DSA dashboard.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AI_CATEGORIES, AI_QUESTIONS, TOTAL_AI_QUESTIONS } from '@/data/ai';
import { useProgress } from '@/lib/useProgress';
import SectionNav from '@/components/SectionNav';
import type { Difficulty } from '@/lib/types';

type StatusFilter = 'all' | 'solved' | 'unsolved' | 'revisit';

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: 'text-easy',
  Medium: 'text-medium',
  Hard: 'text-hard',
};

export default function AIDashboard() {
  const { solvedIds, revisitIds, toggleSolved, ready } = useProgress();

  const [category, setCategory] = useState<string | null>(null);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return AI_QUESTIONS.filter((q) => {
      if (category && q.category !== category) return false;
      if (difficulties.length && !difficulties.includes(q.difficulty)) return false;
      if (status === 'solved' && !solvedIds.has(q.id)) return false;
      if (status === 'unsolved' && solvedIds.has(q.id)) return false;
      if (status === 'revisit' && !revisitIds.has(q.id)) return false;
      if (needle && !q.question.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [category, difficulties, status, search, solvedIds, revisitIds]);

  // Count only AI ids, so this progress bar is not polluted by DSA progress.
  const doneCount = AI_QUESTIONS.filter((q) => solvedIds.has(q.id)).length;
  const percent = Math.round((doneCount / TOTAL_AI_QUESTIONS) * 100);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="w-full shrink-0 border-b border-border bg-surface p-4 lg:h-screen lg:w-72 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <SectionNav active="ai" />

        <div className="mb-5 rounded-lg border border-border bg-surface-2 p-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-medium text-muted">Reviewed</span>
            <span className="text-sm font-semibold">
              {doneCount} / {TOTAL_AI_QUESTIONS}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted uppercase">
            Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'unsolved', 'solved', 'revisit'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  status === s
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border text-muted hover:border-muted hover:text-text'
                }`}
              >
                {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted uppercase">
            Difficulty
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() =>
                  setDifficulties((prev) =>
                    prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
                  )
                }
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  difficulties.includes(d)
                    ? 'border-accent bg-accent/15'
                    : 'border-border hover:border-muted'
                }`}
              >
                <span className={DIFFICULTY_COLOR[d]}>{d}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted uppercase">
            Topics
          </p>
          <button
            onClick={() => setCategory(null)}
            className={`mb-1 w-full rounded-md px-2.5 py-1.5 text-left text-sm transition ${
              category === null ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-surface-2'
            }`}
          >
            All topics
          </button>
          {AI_CATEGORIES.map((c) => {
            const inCategory = AI_QUESTIONS.filter((q) => q.category === c);
            if (inCategory.length === 0) return null;
            const done = inCategory.filter((q) => solvedIds.has(q.id)).length;
            return (
              <button
                key={c}
                onClick={() => setCategory(category === c ? null : c)}
                className={`mb-0.5 flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition ${
                  category === c ? 'bg-accent/15 text-accent' : 'text-text hover:bg-surface-2'
                }`}
              >
                <span className="truncate">{c}</span>
                <span className="ml-2 shrink-0 rounded bg-bg px-1.5 py-0.5 text-[10px] text-muted tabular-nums">
                  {done}/{inCategory.length}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 p-4 lg:h-screen lg:overflow-y-auto lg:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <span className="text-sm text-muted tabular-nums">{visible.length} shown</span>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
            No questions match these filters.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-lg border border-border bg-surface">
            {visible.map((q) => {
              const done = solvedIds.has(q.id);
              return (
                <li
                  key={q.id}
                  className="flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0 hover:bg-surface-2"
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleSolved(q.id)}
                    disabled={!ready}
                    aria-label={`Mark reviewed: ${q.question}`}
                    className="size-4 shrink-0 cursor-pointer accent-[var(--accent)]"
                  />
                  <Link href={`/ai/${q.id}`} className="min-w-0 flex-1 text-sm hover:text-accent">
                    <span className={done ? 'text-muted line-through' : ''}>{q.question}</span>
                  </Link>
                  <span className="hidden shrink-0 rounded bg-bg px-1.5 py-0.5 text-[10px] text-muted sm:inline">
                    {q.category}
                  </span>
                  <span className={`w-14 shrink-0 text-right text-xs ${DIFFICULTY_COLOR[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
