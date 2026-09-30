'use client';

/**
 * The Goals summary card: shown at the top of the DSA sidebar, above the
 * filters, so it's the first thing visible. Read-only at a glance -- the
 * full page at /goals is where a goal actually gets created, listed, or
 * removed.
 *
 * Progress is never read from the goal itself -- see goals.ts -- so this
 * component only has to combine `solvedIds` with the goal's topic and dates
 * on every render; there is nothing to keep in sync.
 */

import Link from 'next/link';
import { formatDate, pickCurrentAndUpcoming, todayISO, topicLabel } from '@/lib/goals';
import { topicColor } from '@/lib/topicColors';
import { useProgress } from '@/lib/useProgress';

export default function GoalsPanel() {
  const { ready, solvedIds, goals } = useProgress();

  // Avoids a flash of the empty state before the saved goals have loaded.
  if (!ready) return null;

  const { current, upcoming } = pickCurrentAndUpcoming(goals, solvedIds, todayISO());

  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted">Goals</span>
        <Link href="/goals" className="text-xs text-accent transition hover:underline">
          {current || upcoming ? 'Manage' : '+ Set a goal'}
        </Link>
      </div>

      {current ? (
        <Link
          href="/goals"
          className="electric-border block rounded-lg border border-border bg-surface-2 p-3 transition hover:border-muted"
        >
          <p className="mono text-[11px] text-muted italic">&ldquo;{current.goal.motivation}&rdquo;</p>

          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold">{topicLabel(current.goal.topic)}</span>
            <span
              className={`shrink-0 text-xs ${
                current.status === 'completed'
                  ? 'text-easy'
                  : current.status === 'expired'
                    ? 'text-hard'
                    : 'text-muted'
              }`}
            >
              {current.status === 'completed'
                ? '✓ Done'
                : current.status === 'expired'
                  ? `${Math.abs(current.daysLeft)}d overdue`
                  : current.daysLeft === 0
                    ? 'Due today'
                    : `${current.daysLeft}d left`}
            </span>
          </div>

          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${current.percent}%`, backgroundColor: topicColor(current.goal.topic) }}
            />
          </div>
          <p className="mt-1 text-[11px] text-muted">
            {current.remaining > 0
              ? `${current.remaining} of ${current.targetCount} left`
              : `All ${current.targetCount} solved`}
          </p>

          {upcoming && (
            <p className="mt-2 border-t border-border pt-1.5 text-[11px] text-muted">
              Next: {topicLabel(upcoming.goal.topic)} from {formatDate(upcoming.goal.fromDate)}
            </p>
          )}
        </Link>
      ) : upcoming ? (
        <Link
          href="/goals"
          className="electric-border block rounded-lg border border-border bg-surface-2 p-3 text-[11px] text-muted transition hover:border-muted"
        >
          Next up: <span className="text-text">{topicLabel(upcoming.goal.topic)}</span> starting{' '}
          {formatDate(upcoming.goal.fromDate)}.
        </Link>
      ) : (
        <Link
          href="/goals"
          className="block rounded-lg border border-dashed border-border p-3 text-center text-[11px] text-muted transition hover:border-muted"
        >
          No goals yet -- set a weekly target to work toward.
        </Link>
      )}
    </div>
  );
}
