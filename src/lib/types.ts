/** Shared domain types for the DSA tracker. */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Topic {
  /** Stable key used in URLs and progress records, e.g. "Dynamic_Programming". */
  key: string;
  /** Human label shown in the sidebar, e.g. "Dynamic Programming". */
  label: string;
}

export interface Company {
  key: string;
  name: string;
  /** Brand colour, used for the tag chip accent. */
  color: string;
  /** Grouping shown in the sidebar: 'faang' | 'india' | 'global'. */
  category: string;
}

export interface Problem {
  /** Slug derived from the problem title; unique across the sheet. */
  id: string;
  title: string;
  topic: string;
  topicLabel: string;
  /** 1-based position within its topic, as printed in the list. */
  num: number;
  /** Where the original problem lives: LeetCode, GeeksforGeeks, ... */
  platform: string;
  url: string;
  difficulty: Difficulty;
  /** Company keys known to ask this problem. May be empty. */
  companies: string[];
  /** True when the LeetCode original is behind their paywall. */
  premium?: boolean;
  /** A free mirror of the statement, when the original is premium. */
  freeUrl?: string;
}

/**
 * One way of solving a problem. Every problem carries several of these,
 * ordered worst-to-best so the tabs read as a progression:
 * brute force -> better -> optimal.
 */
export interface Approach {
  /** Tab label, e.g. "Brute Force", "Better", "Optimal". */
  name: string;
  /** Plain-English explanation of the idea, written to be read before the code. */
  idea: string;
  /** Big-O time complexity, e.g. "O(n log n)". */
  time: string;
  /** Big-O auxiliary space. */
  space: string;
  /** Commented, runnable TypeScript. */
  code: string;
}

/**
 * One test case for the practice editor. The runner calls the solution
 * function with `args` and checks the result against `expected`.
 */
export interface TestCase {
  /** Arguments passed to the function, in order. */
  args: unknown[];
  /** What the call should produce. */
  expected: unknown;
  /**
   * For problems that mutate an argument in place and return nothing
   * (setZeroes, nextPermutation), the index of the argument to inspect
   * afterwards instead of the return value.
   */
  mutates?: number;
  /**
   * For problems whose result order is unspecified (3Sum, group anagrams),
   * compare as an unordered collection rather than element by element.
   */
  unordered?: boolean;
  /** Shown beside the case so a failure says what was being checked. */
  label?: string;
}

export interface Solution {
  /** Matches Problem.id. */
  problemId: string;
  /**
   * Our own short restatement of the task, so the page is useful without
   * leaving for the original site.
   */
  statement: string;
  approaches: Approach[];
  /** Skeleton the practice editor starts from. */
  starter: string;
  /**
   * Name of the function the test runner should call. Required for `tests`
   * to work, since the runner has to find it after evaluating the code.
   */
  functionName?: string;
  /** Cases the Run tests button checks the user's code against. */
  tests?: TestCase[];
}

/** What we remember about the user's progress on a single problem. */
export interface ProblemProgress {
  solved: boolean;
  /** Flagged for another pass later. */
  revisit: boolean;
  /** Free-text notes the user typed on the problem page. */
  notes: string;
  /** The user's own attempt, kept so the editor survives a reload. */
  code: string;
  /** ISO timestamp of the last change, used for the activity feed. */
  updatedAt: string;
}

/** The whole progress document -- this is what will live in MongoDB later. */
export interface ProgressDoc {
  version: 1;
  problems: Record<string, ProblemProgress>;
  updatedAt: string;
}

// --- AI / ML interview section ---------------------------------------------

/**
 * One AI/ML interview question. The three tabs mirror how these are actually
 * assessed: a crisp spoken answer first, the reasoning behind it second, and
 * the follow-ups an interviewer reaches for third.
 */
export interface AIQuestion {
  /** Slug, prefixed "ai-" so it can share the progress store with DSA ids. */
  id: string;
  /** Grouping shown in the sidebar, e.g. "RAG", "LLMs", "Guardrails". */
  category: string;
  question: string;
  difficulty: Difficulty;
  /** The 30-second version you would actually say out loud. */
  shortAnswer: string;
  /** The fuller explanation, including the "why", in markdown-ish plain text. */
  deepDive: string;
  /** What the interviewer asks next, once the first answer lands. */
  followUps: string[];
  /** Present on implementation questions; drives the extra Code tab. */
  code?: {
    language: 'typescript' | 'python';
    source: string;
  };
  /** Skeleton for the practice editor on implementation questions. */
  starter?: string;
}
