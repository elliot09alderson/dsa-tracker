'use client';

/**
 * The "set a goal" form. Rendered by GoalsDashboard as the content of a
 * right-side slide-over drawer -- the Goals page underneath stays exactly as
 * it was, dimmed behind the backdrop, rather than being pushed around.
 *
 * Two panes: the calendar (which owns both date picks) on the left, and the
 * topic/count/motivation fields on the right, with a sticky header/footer so
 * the Create/Cancel actions stay reachable even if the fields pane scrolls.
 */

import { useMemo, useState } from 'react';
import { TOPICS, problemsByTopic } from '@/data/problems';
import { formatDate, todayISO } from '@/lib/goals';
import type { Goal } from '@/lib/types';
import GoalCalendar from './GoalCalendar';

interface Props {
  /** Already-booked goals, shown as tinted ranges so a new one doesn't overlap unknowingly. */
  existingGoals: Goal[];
  onCreate(input: Omit<Goal, 'id' | 'createdAt'>): void;
  onCancel(): void;
}

export default function CreateGoalForm({ existingGoals, onCreate, onCancel }: Props) {
  const [motivation, setMotivation] = useState('');
  const [topic, setTopic] = useState(TOPICS[0].key);
  const topicTotal = useMemo(() => problemsByTopic(topic).length, [topic]);
  const [count, setCount] = useState(topicTotal);
  const [range, setRange] = useState<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  });
  const [month, setMonth] = useState(() => new Date());
  const [error, setError] = useState<string | null>(null);

  const handleTopicChange = (nextTopic: string) => {
    setTopic(nextTopic);
    // The old count may no longer fit the new topic's catalogue size.
    setCount((prev) => Math.min(prev, problemsByTopic(nextTopic).length));
  };

  const handleSelectDate = (dateISO: string) => {
    setRange((prev) => {
      if (!prev.from || prev.to) return { from: dateISO, to: null };
      if (dateISO < prev.from) return { from: dateISO, to: null };
      return { from: prev.from, to: dateISO };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivation.trim()) return setError('Add a reason -- it gets shown back to you while the goal runs.');
    if (!range.from || !range.to) return setError('Pick a start and end date on the calendar.');
    if (count < 1) return setError('Pick at least one question.');

    onCreate({
      topic,
      targetCount: count,
      fromDate: range.from,
      toDate: range.to,
      motivation: motivation.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-bold tracking-tight">New goal</h2>
          <p className="text-xs text-muted">Pick dates on the calendar, then fill in the details.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="shrink-0 rounded-md p-1.5 text-muted transition hover:bg-surface-2 hover:text-text"
        >
          ✕
        </button>
      </div>

      <div className="grid flex-1 overflow-y-auto sm:grid-cols-[1fr_18rem]">
        {/* Calendar pane -- picks both dates and shows what's already booked. */}
        <div className="border-b border-border p-5 sm:border-r sm:border-b-0">
          <span className="mb-2 block text-xs font-medium text-muted">
            {range.from && range.to
              ? `${formatDate(range.from)} → ${formatDate(range.to)}`
              : range.from
                ? `${formatDate(range.from)} → pick an end date`
                : 'Pick a start date, then an end date'}
          </span>
          <GoalCalendar
            month={month}
            onMonthChange={setMonth}
            goals={existingGoals}
            today={todayISO()}
            selection={range}
            selectionTopic={topic}
            onSelectDate={handleSelectDate}
          />
        </div>

        {/* Details pane -- topic, count, and the reason shown back later. */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="goal-topic" className="text-xs font-medium text-muted">
              Topic
            </label>
            <select
              id="goal-topic"
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              {TOPICS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="goal-count" className="text-xs font-medium text-muted">
              Questions
            </label>
            <select
              id="goal-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-md border border-border bg-bg px-2.5 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              {Array.from({ length: topicTotal }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n === topicTotal ? `${n} (all)` : n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="goal-motivation" className="text-xs font-medium text-muted">
              Motivation
            </label>
            <textarea
              id="goal-motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Why this goal? e.g. Binary search keeps tripping me up in interviews."
              rows={4}
              className="mono flex-1 resize-none rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {error && <p className="text-[11px] text-hard">{error}</p>}
        </div>
      </div>

      <div className="flex shrink-0 gap-2 border-t border-border px-5 py-4">
        <button
          type="submit"
          className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-bg transition hover:opacity-90 active:scale-[0.98]"
        >
          Create goal
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-3 py-2 text-sm text-muted transition hover:border-muted hover:text-text active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
