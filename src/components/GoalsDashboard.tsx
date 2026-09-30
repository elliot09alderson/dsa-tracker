'use client';

/**
 * The full Goals page (/goals) -- reached from the SectionNav "Goals" tab,
 * and where signing in lands you (see AuthPanel). Unlike the sidebar summary
 * (GoalsPanel), this is where a goal actually gets created and where every
 * goal you've ever set, not just the current one, is listed.
 */

import { useEffect, useState } from 'react';
import {
  type GoalProgress,
  type GoalStatus,
  computeGoalProgress,
  computeGoalStats,
  formatDate,
  pickCurrentAndUpcoming,
  todayISO,
  topicLabel,
} from '@/lib/goals';
import { topicColor } from '@/lib/topicColors';
import { useProgress } from '@/lib/useProgress';
import CreateGoalForm from './CreateGoalForm';
import SectionNav from './SectionNav';

const STATUS_LABEL: Record<GoalStatus, string> = {
  active: 'Active',
  upcoming: 'Upcoming',
  completed: 'Completed',
  expired: 'Missed',
};

const STATUS_BADGE: Record<GoalStatus, string> = {
  active: 'border-accent text-accent',
  upcoming: 'border-border text-muted',
  completed: 'border-easy text-easy',
  expired: 'border-hard text-hard',
};

const STATUS_RANK: Record<GoalStatus, number> = { active: 0, upcoming: 1, completed: 2, expired: 3 };

function GoalCard({ progress, big, spotlight }: { progress: GoalProgress; big?: boolean; spotlight?: boolean }) {
  const { goal, status, percent, remaining, targetCount, daysLeft, daysUntilStart } = progress;
  const color = topicColor(goal.topic);

  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 ${spotlight ? 'electric-border' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[status]}`}>
            {STATUS_LABEL[status]}
          </span>
          <h3 className={`mt-1.5 font-bold tracking-tight ${big ? 'text-lg' : 'text-base'}`}>
            {topicLabel(goal.topic)}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-2xl font-bold tabular-nums" style={{ color }}>
            {percent}%
          </div>
          <span className="text-[11px] text-muted">
            {formatDate(goal.fromDate)} {'→'} {formatDate(goal.toDate)}
          </span>
        </div>
      </div>

      <p className="mono mt-2 text-xs text-muted italic">&ldquo;{goal.motivation}&rdquo;</p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
        <span>
          {remaining > 0 ? `${remaining} of ${targetCount} left` : `All ${targetCount} solved`}
        </span>
        <span>
          {status === 'completed'
            ? '✓ Done'
            : status === 'expired'
              ? `${Math.abs(daysLeft)}d overdue`
              : status === 'upcoming'
                ? `starts in ${daysUntilStart === 0 ? 'today' : `${daysUntilStart}d`}`
                : daysLeft === 0
                  ? 'due today'
                  : `${daysLeft}d left`}
        </span>
      </div>
    </div>
  );
}

/** A headline number in the stats row -- goals set, active, completed. */
function StatTile({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <div className="flex items-center gap-1.5">
        {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />}
        <p className="truncate text-[10px] font-semibold tracking-wider text-muted uppercase">{label}</p>
      </div>
      <p className="mt-1.5 text-2xl font-bold tabular-nums" style={dot ? { color: dot } : undefined}>
        {value}
      </p>
    </div>
  );
}

/**
 * The overall-completion stat as an SVG ring rather than bare text -- the
 * one number worth a second of visual weight, since it's the summary of
 * every other stat on the page. Draws in from empty on mount/update instead
 * of snapping straight to the target angle.
 */
function CompletionRing({ percent, color }: { percent: number; color: string }) {
  const size = 96;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [drawn, setDrawn] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - drawn / 100)}
          style={{ transition: 'stroke-dashoffset 700ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums" style={{ color }}>
          {percent}%
        </span>
        <span className="text-[9px] font-semibold tracking-wider text-muted uppercase">done</span>
      </div>
    </div>
  );
}

export default function GoalsDashboard() {
  const { ready, solvedIds, goals, addGoal, deleteGoal } = useProgress();
  const [creating, setCreating] = useState(false);

  const today = todayISO();
  const { current, upcoming } = pickCurrentAndUpcoming(goals, solvedIds, today);

  const allProgress = goals
    .map((g) => computeGoalProgress(g, solvedIds, today))
    .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || a.goal.fromDate.localeCompare(b.goal.fromDate));

  const stats = computeGoalStats(goals, solvedIds, today);

  // The drawer overlays the page rather than pushing it -- lock background
  // scroll while it's open, and let Escape close it like the backdrop click.
  useEffect(() => {
    if (!creating) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCreating(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [creating]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="w-full shrink-0 border-b border-border bg-surface p-4 lg:h-screen lg:w-72 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <SectionNav active="goals" />
      </aside>

      <main className="mx-auto w-full max-w-5xl flex-1 p-4 lg:h-screen lg:overflow-y-auto lg:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Your Goals</h1>
            <p className="mt-1 text-sm text-muted">
              Set a <span className="font-semibold text-text">topic</span> and a{' '}
              <span className="font-semibold text-text">deadline</span>, and watch how many{' '}
              <span className="font-semibold text-text">questions are left</span> as you solve.
            </p>
          </div>
          {!creating && ready && (
            <button
              onClick={() => setCreating(true)}
              className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-bg transition hover:opacity-90 active:scale-[0.98]"
            >
              + New goal
            </button>
          )}
        </div>

        {!ready ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <div className="space-y-4">
            {stats.total > 0 && (
              <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                <div className="flex items-center justify-center rounded-lg border border-border bg-surface-2 p-4 sm:px-6">
                  <CompletionRing percent={stats.overallPercent} color="var(--accent)" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatTile label="Goals set" value={String(stats.total)} />
                  <StatTile label="Active now" value={String(stats.active)} dot="var(--accent)" />
                  <StatTile label="Completed" value={String(stats.completed)} dot="var(--easy)" />
                  <StatTile label="Missed" value={String(stats.expired)} dot="var(--hard)" />
                </div>
              </div>
            )}

            {!current && !upcoming && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
                No goals yet. Pick a topic, a question count, and a deadline to work toward.
              </div>
            )}

            {(current || upcoming) && (
              <div className="grid gap-4 lg:grid-cols-2">
                {current && <GoalCard progress={current} big spotlight />}
                {upcoming && upcoming !== current && <GoalCard progress={upcoming} />}
              </div>
            )}

            {allProgress.length > 0 && (
              <div>
                <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">
                  All goals
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {allProgress.map((p) => (
                    <li
                      key={p.goal.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[p.status]}`}
                          >
                            {STATUS_LABEL[p.status]}
                          </span>
                          <span className="truncate text-sm font-medium">{topicLabel(p.goal.topic)}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatDate(p.goal.fromDate)} {'→'} {formatDate(p.goal.toDate)} &middot;{' '}
                          {p.solvedCount}/{p.targetCount} solved
                        </p>
                      </div>
                      <button
                        onClick={() => deleteGoal(p.goal.id)}
                        className="shrink-0 text-xs text-muted transition hover:text-hard hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Right-side drawer: the Goals page behind it stays exactly as-is,
          just dimmed -- creating a goal never pushes or replaces content. */}
      {creating && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="New goal">
          <div
            className="drawer-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCreating(false)}
          />
          <div className="drawer-panel relative flex h-full w-full flex-col bg-surface shadow-2xl sm:w-[640px] lg:w-[760px]">
            <CreateGoalForm
              existingGoals={goals}
              onCancel={() => setCreating(false)}
              onCreate={(input) => {
                addGoal(input);
                setCreating(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
