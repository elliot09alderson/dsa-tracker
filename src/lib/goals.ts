/**
 * Pure goal math, kept separate from the React hook (useProgress.tsx) the
 * same way runTests.ts is kept separate from CodeEditor.tsx.
 *
 * A goal never stores its own progress -- it is a topic, a target count, and
 * a date range. Progress is always recomputed from `solvedIds`, so solving a
 * problem anywhere in the app (not just while a goal is "active") counts
 * toward it, and nothing here can drift out of sync with the real solved set.
 */
import { TOPICS, problemsByTopic } from '@/data/problems';
import type { Goal } from './types';

const TOPIC_LABEL = new Map(TOPICS.map((t) => [t.key, t.label]));

/** Human label for a Topic.key, e.g. "Searching" -> "Searching (Binary Search)". */
export function topicLabel(key: string): string {
  return TOPIC_LABEL.get(key) ?? key;
}

/** Today as a plain "YYYY-MM-DD", in the viewer's local timezone. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "YYYY-MM-DD" -> "30 Sep 2026" -- day-month-year order, but a named month so it's never read as MM/DD. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTH_ABBR[m - 1]} ${y}`;
}

/** Whole days between two "YYYY-MM-DD" dates (b - a), computed in UTC so DST never shifts the count. */
export function daysBetween(aISO: string, bISO: string): number {
  const a = Date.parse(`${aISO}T00:00:00Z`);
  const b = Date.parse(`${bISO}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

export type GoalStatus = 'upcoming' | 'active' | 'completed' | 'expired';

export interface GoalProgress {
  goal: Goal;
  /** Requested count, clamped to how many problems the topic actually has. */
  targetCount: number;
  /** Solved problems from the topic, clamped to targetCount. */
  solvedCount: number;
  remaining: number;
  percent: number;
  status: GoalStatus;
  /** Inclusive days from today to toDate; negative once toDate has passed. */
  daysLeft: number;
  /** Days from today until fromDate; 0 once the goal has started. Meaningful only while status is 'upcoming'. */
  daysUntilStart: number;
}

export function computeGoalProgress(goal: Goal, solvedIds: Set<string>, today: string): GoalProgress {
  const topicProblems = problemsByTopic(goal.topic);
  const targetCount = Math.max(0, Math.min(goal.targetCount, topicProblems.length));
  const solvedCount = Math.min(
    topicProblems.filter((p) => solvedIds.has(p.id)).length,
    targetCount,
  );
  const remaining = targetCount - solvedCount;
  const percent = targetCount === 0 ? 100 : Math.round((solvedCount / targetCount) * 100);
  const daysLeft = daysBetween(today, goal.toDate);
  const daysUntilStart = Math.max(0, daysBetween(today, goal.fromDate));

  let status: GoalStatus;
  if (remaining <= 0) status = 'completed';
  else if (today < goal.fromDate) status = 'upcoming';
  else if (today > goal.toDate) status = 'expired';
  else status = 'active';

  return { goal, targetCount, solvedCount, remaining, percent, status, daysLeft, daysUntilStart };
}

/**
 * The goal to feature (soonest-ending active one, falling back to the
 * nearest completed/expired one so a finished goal doesn't just vanish the
 * day it ends) and the next one queued up after it.
 */
export function pickCurrentAndUpcoming(
  goals: Goal[],
  solvedIds: Set<string>,
  today: string,
): { current: GoalProgress | null; upcoming: GoalProgress | null } {
  const scored = goals
    .map((g) => computeGoalProgress(g, solvedIds, today))
    .sort((a, b) => a.goal.fromDate.localeCompare(b.goal.fromDate));

  const active = scored.filter((g) => g.status === 'active');
  const current =
    active.sort((a, b) => a.daysLeft - b.daysLeft)[0] ??
    scored
      .filter((g) => g.status === 'completed' || g.status === 'expired')
      .sort((a, b) => b.goal.toDate.localeCompare(a.goal.toDate))[0] ??
    null;

  const upcoming =
    scored.find(
      (g) =>
        g.status === 'upcoming' && (!current || g.goal.fromDate > current.goal.toDate) && g !== current,
    ) ?? null;

  return { current, upcoming };
}

export interface GoalStats {
  total: number;
  active: number;
  completed: number;
  expired: number;
  /** Solved / target summed across every goal, not an average of percentages. */
  overallPercent: number;
}

/** Headline numbers for the stats row at the top of the Goals page. */
export function computeGoalStats(goals: Goal[], solvedIds: Set<string>, today: string): GoalStats {
  const progress = goals.map((g) => computeGoalProgress(g, solvedIds, today));
  const totalTarget = progress.reduce((sum, p) => sum + p.targetCount, 0);
  const totalSolved = progress.reduce((sum, p) => sum + p.solvedCount, 0);

  return {
    total: goals.length,
    active: progress.filter((p) => p.status === 'active').length,
    completed: progress.filter((p) => p.status === 'completed').length,
    expired: progress.filter((p) => p.status === 'expired').length,
    overallPercent: totalTarget === 0 ? 0 : Math.round((totalSolved / totalTarget) * 100),
  };
}
