'use client';

/**
 * The dashboard: sidebar of topics and company tags on the left, the filtered
 * problem list on the right.
 *
 * All filter state lives here rather than in the sidebar, because both halves
 * of the screen need to read it. Filters combine with AND -- picking "Graphs"
 * and "Google" and "Hard" shows the hard graph problems Google asks.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  COMPANIES,
  COMPANY_BY_KEY,
  COMPANY_CATEGORIES,
  PROBLEMS,
  TOPICS,
  TOTAL_PROBLEMS,
} from '@/data/problems';
import { SOLUTION_COUNT } from '@/data/solutions';
import { useProgress } from '@/lib/useProgress';
import SectionNav from '@/components/SectionNav';
import type { Difficulty } from '@/lib/types';

type StatusFilter = 'all' | 'solved' | 'unsolved' | 'revisit';

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: 'text-easy',
  Medium: 'text-medium',
  Hard: 'text-hard',
};

export default function Dashboard() {
  const { solvedIds, revisitIds, toggleSolved, ready } = useProgress();

  // --- filter state ---
  const [topic, setTopic] = useState<string | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const toggleIn = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return PROBLEMS.filter((p) => {
      if (topic && p.topic !== topic) return false;

      // A problem matches the company filter if it is asked by ANY of the
      // selected companies -- selecting more companies widens the net.
      if (companies.length && !companies.some((c) => p.companies.includes(c))) return false;

      if (difficulties.length && !difficulties.includes(p.difficulty)) return false;

      if (status === 'solved' && !solvedIds.has(p.id)) return false;
      if (status === 'unsolved' && solvedIds.has(p.id)) return false;
      if (status === 'revisit' && !revisitIds.has(p.id)) return false;

      if (needle && !p.title.toLowerCase().includes(needle)) return false;

      return true;
    });
  }, [topic, companies, difficulties, status, search, solvedIds, revisitIds]);

  // solvedIds spans both sections, so count only problems in this catalogue.
  const solvedCount = PROBLEMS.filter((p) => solvedIds.has(p.id)).length;
  const percent = Math.round((solvedCount / TOTAL_PROBLEMS) * 100);

  const activeFilters =
    (topic ? 1 : 0) + companies.length + difficulties.length + (status !== 'all' ? 1 : 0);

  const clearAll = () => {
    setTopic(null);
    setCompanies([]);
    setDifficulties([]);
    setStatus('all');
    setSearch('');
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-full shrink-0 border-b border-border bg-surface p-4 lg:h-screen lg:w-72 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <SectionNav active="dsa" />

        <p className="mb-4 text-xs text-muted">
          {TOTAL_PROBLEMS} problems · {SOLUTION_COUNT} with written solutions
        </p>

        {/* Overall progress */}
        <div className="mb-5 rounded-lg border border-border bg-surface-2 p-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-medium text-muted">Progress</span>
            <span className="text-sm font-semibold">
              {solvedCount} / {TOTAL_PROBLEMS}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Status filter */}
        <FilterGroup label="Status">
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'unsolved', 'solved', 'revisit'] as StatusFilter[]).map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {/* Difficulty filter */}
        <FilterGroup label="Difficulty">
          <div className="flex flex-wrap gap-1.5">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
              <Chip
                key={d}
                active={difficulties.includes(d)}
                onClick={() => setDifficulties((prev) => toggleIn(prev, d))}
              >
                <span className={DIFFICULTY_COLOR[d]}>{d}</span>
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {/* Topics */}
        <FilterGroup label="Topics">
          <button
            onClick={() => setTopic(null)}
            className={`mb-1 w-full rounded-md px-2.5 py-1.5 text-left text-sm transition ${
              topic === null ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-surface-2'
            }`}
          >
            All topics
          </button>
          {TOPICS.map((t) => {
            const inTopic = PROBLEMS.filter((p) => p.topic === t.key);
            const done = inTopic.filter((p) => solvedIds.has(p.id)).length;
            return (
              <button
                key={t.key}
                onClick={() => setTopic(topic === t.key ? null : t.key)}
                className={`mb-0.5 flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition ${
                  topic === t.key ? 'bg-accent/15 text-accent' : 'text-text hover:bg-surface-2'
                }`}
              >
                <span className="truncate">{t.label}</span>
                <span className="ml-2 shrink-0 rounded bg-bg px-1.5 py-0.5 text-[10px] text-muted tabular-nums">
                  {done}/{inTopic.length}
                </span>
              </button>
            );
          })}
        </FilterGroup>

        {/* Company tags, grouped the way interview prep lists usually group them */}
        <FilterGroup label="Company PYQs">
          {COMPANY_CATEGORIES.map((cat) => (
            <div key={cat.key} className="mb-2.5">
              <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-muted uppercase">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COMPANIES.filter((c) => c.category === cat.key).map((c) => {
                  const active = companies.includes(c.key);
                  const count = PROBLEMS.filter((p) => p.companies.includes(c.key)).length;
                  return (
                    <button
                      key={c.key}
                      onClick={() => setCompanies((prev) => toggleIn(prev, c.key))}
                      title={`${count} problems`}
                      className={`rounded-full border px-2.5 py-1 text-xs transition ${
                        active
                          ? 'border-transparent text-bg'
                          : 'border-border text-muted hover:border-muted hover:text-text'
                      }`}
                      style={active ? { backgroundColor: c.color } : undefined}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </FilterGroup>
      </aside>

      {/* ---------------- Problem list ---------------- */}
      <main className="flex-1 p-4 lg:h-screen lg:overflow-y-auto lg:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems…"
            className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <span className="text-sm text-muted tabular-nums">
            {visible.length} shown
          </span>
          {activeFilters > 0 && (
            <button
              onClick={clearAll}
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:border-muted hover:text-text"
            >
              Clear filters ({activeFilters})
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
            No problems match these filters.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-lg border border-border bg-surface">
            {visible.map((p) => {
              const solved = solvedIds.has(p.id);
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0 hover:bg-surface-2"
                >
                  {/* Checkbox marks the problem solved without leaving the list. */}
                  <input
                    type="checkbox"
                    checked={solved}
                    onChange={() => toggleSolved(p.id)}
                    disabled={!ready}
                    aria-label={`Mark ${p.title} solved`}
                    className="size-4 shrink-0 cursor-pointer accent-[var(--accent)]"
                  />

                  <Link
                    href={`/problems/${p.id}`}
                    className="min-w-0 flex-1 truncate text-sm hover:text-accent"
                  >
                    <span className={solved ? 'text-muted line-through' : ''}>{p.title}</span>
                  </Link>

                  {/* Company chips, capped so one row stays readable. */}
                  <span className="hidden shrink-0 gap-1 md:flex">
                    {p.companies.slice(0, 3).map((key) => {
                      const c = COMPANY_BY_KEY.get(key);
                      if (!c) return null;
                      return (
                        <span
                          key={key}
                          className="rounded px-1.5 py-0.5 text-[10px]"
                          style={{ backgroundColor: `${c.color}22`, color: c.color }}
                        >
                          {c.name}
                        </span>
                      );
                    })}
                    {p.companies.length > 3 && (
                      <span className="rounded bg-bg px-1.5 py-0.5 text-[10px] text-muted">
                        +{p.companies.length - 3}
                      </span>
                    )}
                  </span>

                  <span
                    className={`w-14 shrink-0 text-right text-xs ${DIFFICULTY_COLOR[p.difficulty]}`}
                  >
                    {p.difficulty}
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

/** A labelled block in the sidebar. */
function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted uppercase">{label}</p>
      {children}
    </div>
  );
}

/** Small toggle pill used by the status and difficulty filters. */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition ${
        active
          ? 'border-accent bg-accent/15 text-accent'
          : 'border-border text-muted hover:border-muted hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}
