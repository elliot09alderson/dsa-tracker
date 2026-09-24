import type { Solution } from '@/lib/types';

/**
 * Dynamic programming, part two.
 *
 * Four of the field's standard-bearers: 0/1 knapsack itself, the bitonic
 * variant of longest increasing subsequence, tiling counted by a linear
 * recurrence, and a reachability DP dressed up as a jump game. Split from
 * dynamic-programming.ts purely to keep each file a readable size.
 */
export const dynamicProgramming2Solutions: Solution[] = [
  {
    problemId: '0-1-knapsack-problem',
    statement:
      'Given n items, each with a weight and a value, and a knapsack of capacity W, choose a subset of items (each used at most once) to maximize total value without exceeding the weight capacity.',
    starter: `function knapsack(weights: number[], values: number[], capacity: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every item, try both including it and excluding it, and recurse on the rest -- exactly the definition of "choose a subset." Correct, but the same (item index, remaining capacity) situation is recomputed from scratch every time it is reached by a different sequence of choices.',
        time: 'O(2^n)',
        space: 'O(n) recursion depth',
        code: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;

  const solve = (index: number, remainingCapacity: number): number => {
    if (index === n || remainingCapacity === 0) return 0;

    // Option 1: skip this item.
    let best = solve(index + 1, remainingCapacity);

    // Option 2: take this item, if it fits.
    if (weights[index] <= remainingCapacity) {
      best = Math.max(best, values[index] + solve(index + 1, remainingCapacity - weights[index]));
    }

    return best;
  };

  return solve(0, capacity);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Bottom-up DP over (items considered, capacity used), collapsed to a single 1D array of size capacity+1 by processing capacity in DECREASING order for each item. Walking capacity backward guarantees that dp[c - weight] used while updating dp[c] still holds last item’s (not this item’s) value -- which is exactly the "use this item at most once" rule, achieved without needing a full 2D table.',
        time: 'O(n * capacity)',
        space: 'O(capacity)',
        code: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const dp = new Array<number>(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    // Decreasing order is what keeps this a 0/1 (not unbounded) knapsack:
    // dp[c - weights[i]] here still reflects the state BEFORE item i was
    // considered, so item i cannot be counted into its own update twice.
    for (let c = capacity; c >= weights[i]; c--) {
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
    }
  }

  return dp[capacity];
}`,
      },
    ],
  },
  {
    problemId: 'longest-bitonic-subsequence',
    statement:
      'Given an array of integers, find the length of the longest bitonic subsequence: one that strictly increases and then strictly decreases (either the increasing or decreasing part may be empty, but not both together with length 1 only if that is the whole array).',
    starter: `function longestBitonicSubsequence(arr: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every possible "peak" index, separately find the longest strictly increasing subsequence ending there (scanning everything to its left) and the longest strictly decreasing subsequence starting there (scanning everything to its right), by trying every earlier/later index as a possible predecessor. Combining the two at each peak and taking the best over all peaks answers the question, but each of the two searches is itself the classic O(n^2) longest-increasing-subsequence computation, repeated independently.',
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function longestBitonicSubsequence(arr: number[]): number {
  const n = arr.length;

  // increasing[i] = length of the longest strictly increasing subsequence
  // ending exactly at i.
  const increasing = new Array<number>(n).fill(1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) increasing[i] = Math.max(increasing[i], increasing[j] + 1);
    }
  }

  // decreasing[i] = length of the longest strictly decreasing subsequence
  // starting exactly at i.
  const decreasing = new Array<number>(n).fill(1);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[i]) decreasing[i] = Math.max(decreasing[i], decreasing[j] + 1);
    }
  }

  let best = 0;
  for (let i = 0; i < n; i++) {
    // The peak is counted once, not twice, so subtract 1 from the sum.
    best = Math.max(best, increasing[i] + decreasing[i] - 1);
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Replace each O(n^2) pass with the O(n log n) patience-sorting technique for longest increasing subsequence. The increasing-run-ending-here array can be derived from a single left-to-right pass maintaining the smallest possible tail of every achievable increasing-subsequence length (binary search to place each new value); the decreasing-run-starting-here array is the mirror computation on the reversed array using the same technique. Combining the two peak-by-peak is unchanged, but both supporting passes are now log-linear instead of quadratic.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function longestBitonicSubsequence(arr: number[]): number {
  const n = arr.length;

  // lengthOfLISEndingAt(values) returns, for each index i, the length of
  // the longest strictly increasing subsequence of "values" ending at i,
  // computed via the patience-sorting / binary-search technique.
  const lengthOfLISEndingAt = (values: number[]): number[] => {
    const tails: number[] = []; // tails[len-1] = smallest possible tail value for length len
    const result = new Array<number>(values.length).fill(1);

    for (let i = 0; i < values.length; i++) {
      // Binary search for the first tail >= values[i] (strict increase,
      // so equal values must not extend a run).
      let lo = 0;
      let hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < values[i]) lo = mid + 1;
        else hi = mid;
      }

      if (lo === tails.length) tails.push(values[i]);
      else tails[lo] = values[i];

      result[i] = lo + 1; // the position found is exactly this run's length
    }

    return result;
  };

  const increasing = lengthOfLISEndingAt(arr);

  // Decreasing-from-i on arr is increasing-ending-at on the reversed array,
  // read back in the original order.
  const reversed = [...arr].reverse();
  const increasingOnReversed = lengthOfLISEndingAt(reversed);
  const decreasing = increasingOnReversed.slice().reverse();

  let best = 0;
  for (let i = 0; i < n; i++) {
    best = Math.max(best, increasing[i] + decreasing[i] - 1);
  }

  return best;
}`,
      },
    ],
  },
  {
    problemId: 'ways-to-tile-a-floor',
    statement:
      'Given a floor of size 2 x n and tiles of size 2 x 1, each of which may be placed either upright (vertically) or on its side (horizontally), count the number of distinct ways to completely tile the floor.',
    starter: `function waysToTileFloor(n: number): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Recurse on how much of the floor (measured as columns still to fill, left to right) remains. From a floor of width n, either place one tile vertically (using 1 column) or two tiles side by side horizontally (using 2 columns, since two 2x1 tiles laid on their sides stack to fill a 2-column strip) -- recursing on the smaller remaining width in each case and adding the two counts. This is correct, but re-derives the count for every width from scratch across overlapping recursive calls.',
        time: 'O(2^n) without memoisation',
        space: 'O(n) recursion depth',
        code: `function waysToTileFloor(n: number): number {
  const MOD = 1_000_000_007;

  const solve = (width: number): number => {
    if (width === 0) return 1; // nothing left to tile -- one (empty) way
    if (width === 1) return 1; // only one vertical tile fits

    // Place one vertical tile (uses 1 column), or two horizontal tiles
    // stacked to fill a 2-column strip (uses 2 columns).
    return (solve(width - 1) + solve(width - 2)) % MOD;
  };

  return solve(n);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The recurrence solve(n) = solve(n-1) + solve(n-2) is exactly the Fibonacci recurrence, so build it bottom-up with two running values instead of recursing -- no call stack, no repeated subproblems, and only constant extra memory beyond the two counters carried forward.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function waysToTileFloor(n: number): number {
  const MOD = 1_000_000_007;

  if (n === 0) return 1;
  if (n === 1) return 1;

  let previous = 1; // ways(0)
  let current = 1;  // ways(1)

  for (let width = 2; width <= n; width++) {
    const next = (current + previous) % MOD;
    previous = current;
    current = next;
  }

  return current;
}`,
      },
    ],
  },
  {
    problemId: 'jump-game-v',
    statement:
      'Given an array of integers and an integer d, starting from any index you may jump to index i + x or i - x (for 1 <= x <= d) provided every index strictly between the start and the landing index has a smaller value than the start, and the landing index itself has a smaller value than the start, and the jump stays within array bounds. Return the maximum number of indices you can visit starting from some single index (the starting index counts as visited).',
    starter: `function maxJumps(arr: number[], d: number): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'From every starting index, explore every legal jump with plain recursion (no memoisation), taking the best chain of jumps reachable from there, and keep the overall best across all starts. Each call re-derives everything reachable from its index from scratch, even though the same index is very likely reached again by a different path.',
        time: 'Exponential in the worst case',
        space: 'O(n) recursion depth',
        code: `function maxJumps(arr: number[], d: number): number {
  const n = arr.length;

  const canJumpTo = (from: number, to: number): boolean => {
    const step = to > from ? 1 : -1;
    for (let i = from + step; i !== to; i += step) {
      if (arr[i] >= arr[from]) return false; // a taller bar blocks the path
    }
    return arr[to] < arr[from];
  };

  const longestFrom = (index: number): number => {
    let best = 1; // the starting index itself counts

    for (let x = 1; x <= d; x++) {
      if (index + x < n && canJumpTo(index, index + x)) {
        best = Math.max(best, 1 + longestFrom(index + x));
      }
      if (index - x >= 0 && canJumpTo(index, index - x)) {
        best = Math.max(best, 1 + longestFrom(index - x));
      }
    }

    return best;
  };

  let overallBest = 1;
  for (let i = 0; i < n; i++) {
    overallBest = Math.max(overallBest, longestFrom(i));
  }

  return overallBest;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Memoise longestFrom on the index -- since arr never changes, the longest reachable chain starting at a given index is always the same number regardless of how that index was reached, which is exactly what makes memoisation valid here. Processing indices in order of increasing arr value (rather than relying purely on recursion order) also lets this be computed bottom-up: an index's best chain only depends on indices with SMALLER values, which are guaranteed already finalised by the time this index is processed.",
        time: 'O(n * d)',
        space: 'O(n)',
        code: `function maxJumps(arr: number[], d: number): number {
  const n = arr.length;
  const memo = new Array<number>(n).fill(0);

  const canJumpTo = (from: number, to: number): boolean => {
    const step = to > from ? 1 : -1;
    for (let i = from + step; i !== to; i += step) {
      if (arr[i] >= arr[from]) return false;
    }
    return arr[to] < arr[from];
  };

  // Process indices from SMALLEST value to largest: a taller bar's chain
  // depends only on shorter bars, which are already finalised by then.
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => arr[a] - arr[b]);

  for (const index of order) {
    let best = 1;

    for (let x = 1; x <= d; x++) {
      if (index + x < n && canJumpTo(index, index + x)) {
        best = Math.max(best, 1 + memo[index + x]);
      }
      if (index - x >= 0 && canJumpTo(index, index - x)) {
        best = Math.max(best, 1 + memo[index - x]);
      }
    }

    memo[index] = best;
  }

  return Math.max(...memo);
}`,
      },
    ],
  },
];
