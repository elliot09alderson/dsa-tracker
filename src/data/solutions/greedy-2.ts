import type { Solution } from '@/lib/types';

/**
 * Greedy, part two.
 *
 * One problem: minimizing total movement to group scattered items together,
 * which turns out to reduce to a median-based argument once the seats are
 * relabelled cleverly. Split from greedy.ts purely to keep each file a
 * readable size.
 */
export const greedy2Solutions: Solution[] = [
  {
    problemId: 'seats',
    statement:
      'A row of N seats is given as a string of "x" (occupied) and "." (empty). Move the occupied seats so that everyone ends up sitting together with no gaps, using the minimum total number of single-seat hops (a hop moves one person to an adjacent seat). Return that minimum total, modulo 10^7 + 3.',
    starter: `function seats(row: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every possible block of consecutive seats the group could end up occupying, compute the total number of hops needed to move each occupied seat to its assigned position within that block (matching people to positions in order, since crossing over another person never helps), and keep the smallest total across all candidate blocks. Correct, but trying every possible target block and recomputing its cost from scratch is expensive.',
        time: 'O(N^2)',
        space: 'O(N)',
        code: `function seats(row: string): number {
  const MOD = 10_000_003;
  const positions: number[] = [];
  for (let i = 0; i < row.length; i++) {
    if (row[i] === 'x') positions.push(i);
  }
  if (positions.length <= 1) return 0;

  const k = positions.length;
  let best = Infinity;

  // Try every possible starting seat for the contiguous block of k people.
  for (let blockStart = 0; blockStart + k - 1 < row.length; blockStart++) {
    let cost = 0;
    for (let i = 0; i < k; i++) {
      const targetSeat = blockStart + i;
      cost += Math.abs(positions[i] - targetSeat);
    }
    best = Math.min(best, cost);
  }

  return best % MOD;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Relabel each occupied seat’s position by subtracting its RANK among the occupied seats: adjustedPosition[i] = originalPosition[i] - i. Once seats end up contiguous, moving person i to be the i-th seat of the final block is equivalent to making every adjustedPosition equal to the same constant (the block’s start position minus 0) -- so the whole problem collapses to "move every adjusted position to a single common value with minimum total distance," and that classic result is: the optimal common value is the MEDIAN of the adjusted positions, since a median minimizes the sum of absolute distances to a set of points on a line.',
        time: 'O(N) to find the occupied seats and their median (no full sort needed for the median of an already-monotonic-adjustment sequence)',
        space: 'O(N)',
        code: `function seats(row: string): number {
  const MOD = 10_000_003;
  const positions: number[] = [];
  for (let i = 0; i < row.length; i++) {
    if (row[i] === 'x') positions.push(i);
  }
  const k = positions.length;
  if (k <= 1) return 0;

  // Subtract each person's rank from their position -- this reframes
  // "end up contiguous" as "end up all equal", since a contiguous block
  // starting at S puts person i at S + i, i.e. adjusted value S for all i.
  const adjusted = positions.map((pos, i) => pos - i);

  // The median minimizes total absolute movement to a common point.
  // adjusted is non-decreasing (positions are strictly increasing and we
  // subtract a strictly increasing index), so the middle ELEMENT is
  // already the median -- no sort required.
  const median = adjusted[Math.floor(k / 2)];

  let totalCost = 0;
  for (const value of adjusted) {
    totalCost = (totalCost + Math.abs(value - median)) % MOD;
  }

  return totalCost;
}`,
      },
    ],
  },
];
