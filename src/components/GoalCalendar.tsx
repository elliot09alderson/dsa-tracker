'use client';

/**
 * A small, dependency-free month calendar for picking a goal's date range
 * and for seeing which days are already booked by existing goals.
 *
 * Deliberately hand-rolled rather than a calendar library, matching the rest
 * of the editor/highlighter in this app: it is a fixed 6x7 day grid with no
 * date-math dependency, built from plain `Date` arithmetic.
 *
 * Visually modelled on Google Calendar's month view: hairline grid lines
 * between cells, today's number in a filled circle, and multi-day ranges
 * drawn as one continuous coloured bar with rounded caps only at the range's
 * real start/end -- a bar that continues past a week's edge stays square
 * there and picks back up flush on the next row, the same way Calendar
 * redraws a multi-day event per week.
 *
 * Selection is controlled from the parent (the create-goal form owns
 * from/to state) -- this component only renders the grid and reports clicks.
 */

import { formatDate, topicLabel } from '@/lib/goals';
import { topicColor } from '@/lib/topicColors';
import type { Goal } from '@/lib/types';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface Props {
  /** Any date within the month to display; only the year/month are read. */
  month: Date;
  onMonthChange(next: Date): void;
  /** Existing goals, rendered as tinted "booked" ranges. */
  goals: Goal[];
  /** "YYYY-MM-DD", for marking past days as elapsed. */
  today: string;
  /** In-progress selection for the goal being created. */
  selection: { from: string | null; to: string | null };
  /** Topic chosen so far, to colour the pending selection; null while unset. */
  selectionTopic: string | null;
  onSelectDate(dateISO: string): void;
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The 42 cells (6 full weeks) covering `month`, including the leading/trailing days of neighbouring months. */
function buildGrid(month: Date): Date[] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(firstOfMonth);
  start.setDate(start.getDate() - start.getDay()); // back up to the preceding Sunday

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/** A range's bar caps round only at its true edges; a week boundary always cuts it square. */
function capClasses(isRowStart: boolean, isRowEnd: boolean, isRangeStart: boolean, isRangeEnd: boolean) {
  const left = isRangeStart || isRowStart ? 'rounded-l-full' : '';
  const right = isRangeEnd || isRowEnd ? 'rounded-r-full' : '';
  return `${left} ${right}`;
}

export default function GoalCalendar({
  month,
  onMonthChange,
  goals,
  today,
  selection,
  selectionTopic,
  onSelectDate,
}: Props) {
  const grid = buildGrid(month);
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToMonth = (delta: number) =>
    onMonthChange(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <div className="rounded-lg border border-border bg-surface-2 p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Previous month"
          className="rounded-full px-2 py-0.5 text-muted transition hover:bg-surface hover:text-text"
        >
          ‹
        </button>
        <span className="text-xs font-semibold">{monthLabel}</span>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="Next month"
          className="rounded-full px-2 py-0.5 text-muted transition hover:bg-surface hover:text-text"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-medium tracking-wide text-muted uppercase">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="pb-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md border border-border bg-border">
        {grid.map((date, i) => {
          const dateISO = toISODate(date);
          const inCurrentMonth = date.getMonth() === month.getMonth();
          const booked = goals.find((g) => dateISO >= g.fromDate && dateISO <= g.toDate);
          const isPastBooked = booked !== undefined && dateISO < today;
          const isToday = dateISO === today;

          const pendingFrom = selection.from;
          const pendingTo = selection.to;
          const inPending =
            pendingFrom !== null &&
            (pendingTo !== null
              ? dateISO >= pendingFrom && dateISO <= pendingTo
              : dateISO === pendingFrom);

          const bar = inPending
            ? {
                color: selectionTopic ? topicColor(selectionTopic) : 'var(--accent)',
                label: selectionTopic ? topicLabel(selectionTopic) : 'New goal',
                rangeStart: pendingFrom,
                rangeEnd: pendingTo ?? pendingFrom,
              }
            : booked
              ? {
                  color: topicColor(booked.topic),
                  label: topicLabel(booked.topic),
                  rangeStart: booked.fromDate,
                  rangeEnd: booked.toDate,
                }
              : null;

          const isRowStart = i % 7 === 0;
          const isRowEnd = i % 7 === 6;
          const isRangeStart = bar ? dateISO === bar.rangeStart : false;
          const isRangeEnd = bar ? dateISO === bar.rangeEnd : false;

          // Repeat the label at the start of every visual row, the same way
          // Calendar restates a multi-day event's title each time it wraps.
          const showLabel = bar !== null && (isRangeStart || isRowStart);
          // How many cells this row's segment of the bar actually covers, so
          // the label text clips at the real end of the range instead of
          // bleeding into unrelated days.
          const rowEndDate = grid[i - (i % 7) + 6];
          const segmentEndDate =
            bar && new Date(`${bar.rangeEnd}T00:00:00`) < rowEndDate
              ? new Date(`${bar.rangeEnd}T00:00:00`)
              : rowEndDate;
          const spanCols = showLabel
            ? Math.round((segmentEndDate.getTime() - date.getTime()) / 86_400_000) + 1
            : 1;

          return (
            <button
              type="button"
              key={i}
              onClick={() => onSelectDate(dateISO)}
              title={
                booked
                  ? `${topicLabel(booked.topic)} · ${formatDate(booked.fromDate)} → ${formatDate(booked.toDate)}`
                  : undefined
              }
              className={`relative flex aspect-square min-h-9 flex-col items-center gap-0.5 bg-surface pt-1 transition hover:brightness-110 sm:min-h-11 ${
                inCurrentMonth ? '' : 'opacity-40'
              } ${showLabel ? 'z-10' : ''}`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                  isToday ? 'bg-accent font-bold text-bg' : 'text-text'
                } ${isPastBooked ? 'opacity-50 line-through' : ''}`}
              >
                {date.getDate()}
              </span>

              {bar &&
                (showLabel ? (
                  <span
                    className={`pointer-events-none absolute top-6 h-4 overflow-hidden text-ellipsis whitespace-nowrap px-1.5 text-left text-[9px] leading-4 font-semibold text-bg sm:top-7 sm:h-5 sm:text-[10px] sm:leading-5 ${capClasses(
                      isRowStart,
                      isRowEnd,
                      isRangeStart,
                      isRangeEnd,
                    )} ${isPastBooked ? 'opacity-40' : ''}`}
                    style={{ backgroundColor: bar.color, left: 0, width: `${spanCols * 100}%` }}
                  >
                    {bar.label}
                  </span>
                ) : (
                  <span
                    className={`absolute inset-x-0 top-6 h-2 sm:top-7 ${capClasses(
                      isRowStart,
                      isRowEnd,
                      isRangeStart,
                      isRangeEnd,
                    )} ${isPastBooked ? 'opacity-40' : ''}`}
                    style={{ backgroundColor: bar.color }}
                  />
                ))}
            </button>
          );
        })}
      </div>

      {/* The coloured bars on their own don't say whose goal they are --
          spell it out here instead of relying on the slow native tooltip. */}
      {goals.length > 0 && (
        <ul className="mt-2 space-y-1 border-t border-border pt-2">
          {goals.map((g) => (
            <li key={g.id} className="flex items-center gap-2 text-[11px]">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: topicColor(g.topic) }}
              />
              <span className="min-w-0 flex-1 truncate text-text">{topicLabel(g.topic)}</span>
              <span className="shrink-0 text-muted tabular-nums">
                {formatDate(g.fromDate)} → {formatDate(g.toDate)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
