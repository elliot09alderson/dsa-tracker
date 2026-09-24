/**
 * Solution registry.
 *
 * Solutions are split into one file per topic so the files stay a readable
 * size. This module stitches them into a single lookup. A problem with no
 * solution written yet simply returns undefined, and the UI shows a
 * "not written yet" state rather than breaking -- so the catalogue and the
 * solution set can grow independently.
 */

import type { Solution } from '@/lib/types';
import { PROBLEM_TESTS } from './tests';
import { arraysSolutions } from './arrays';
import { arrays3Solutions } from './arrays-3';
import { arrays4Solutions } from './arrays-4';
import { arrays2Solutions } from './arrays-2';
import { twoPointersSolutions } from './two-pointers';
import { twoPointers2Solutions } from './two-pointers-2';
import { stacksSolutions } from './stacks';
import { stacks2Solutions } from './stacks-2';
import { linkedListSolutions } from './linked-lists';
import { linkedList2Solutions } from './linked-lists-2';
import { treesSolutions } from './trees';
import { trees2Solutions } from './trees-2';
import { graphsSolutions } from './graphs';
import { graphs2Solutions } from './graphs-2';
import { dpSolutions } from './dynamic-programming';
import { dynamicProgramming2Solutions } from './dynamic-programming-2';
import { binarySearchSolutions } from './binary-search';
import { searching2Solutions } from './searching-2';
import { backtrackingSolutions } from './backtracking';
import { backtracking2Solutions } from './backtracking-2';
import { stringsSolutions } from './strings';
import { strings2Solutions } from './strings-2';
import { bitManipulationSolutions } from './bit-manipulation';
import { heapsSolutions } from './heaps';
import { heaps2Solutions } from './heaps-2';
import { greedySolutions } from './greedy';
import { greedy2Solutions } from './greedy-2';
import { sortingSolutions } from './sorting';
import { sorting2Solutions } from './sorting-2';
import { hashingQueueSolutions } from './hashing-queues';
import { hashing2Solutions } from './hashing-2';
import { queues2Solutions } from './queues-2';

const ALL: Solution[] = [
  ...arraysSolutions,
  ...arrays3Solutions,
  ...arrays4Solutions,
  ...arrays2Solutions,
  ...twoPointersSolutions,
  ...twoPointers2Solutions,
  ...stacksSolutions,
  ...stacks2Solutions,
  ...linkedListSolutions,
  ...linkedList2Solutions,
  ...treesSolutions,
  ...trees2Solutions,
  ...graphsSolutions,
  ...graphs2Solutions,
  ...dpSolutions,
  ...dynamicProgramming2Solutions,
  ...binarySearchSolutions,
  ...searching2Solutions,
  ...backtrackingSolutions,
  ...backtracking2Solutions,
  ...stringsSolutions,
  ...strings2Solutions,
  ...bitManipulationSolutions,
  ...heapsSolutions,
  ...heaps2Solutions,
  ...greedySolutions,
  ...greedy2Solutions,
  ...sortingSolutions,
  ...sorting2Solutions,
  ...hashingQueueSolutions,
  ...hashing2Solutions,
  ...queues2Solutions,
];

// Merge the test cases in, so a solution file never has to carry them.
const WITH_TESTS: Solution[] = ALL.map((solution) => {
  const harness = PROBLEM_TESTS[solution.problemId];
  if (!harness) return solution;
  return { ...solution, functionName: harness.fn, tests: harness.cases };
});

const BY_ID = new Map(WITH_TESTS.map((s) => [s.problemId, s]));

/** How many problems have a runnable test harness. */
export const TESTED_PROBLEM_COUNT = Object.keys(PROBLEM_TESTS).length;

/** The written solution for a problem, or undefined if it is still pending. */
export function getSolution(problemId: string): Solution | undefined {
  return BY_ID.get(problemId);
}

/** Ids of every problem that currently has a written solution. */
export const SOLVED_PROBLEM_IDS: ReadonlySet<string> = new Set(BY_ID.keys());

/** How many solutions are written, for the "coverage" line on the dashboard. */
export const SOLUTION_COUNT = ALL.length;
