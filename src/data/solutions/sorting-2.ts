import type { Solution } from '@/lib/types';

/**
 * Sorting, part two.
 *
 * A grab-bag that shares one theme: once an array is sorted, several
 * otherwise-tricky questions (matching character counts, the closest points,
 * the widest gaps, the tightest window) reduce to a single linear pass.
 * Split from sorting.ts purely to keep each file a readable size.
 */
export const sorting2Solutions: Solution[] = [
  {
    problemId: 'valid-anagram-2',
    statement: 'Given two strings s and t, determine whether t is an anagram of s (uses exactly the same characters, same counts, in any order).',
    starter: `function isAnagram(s: string, t: string): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Sort both strings into a canonical character order; two strings are anagrams exactly when their sorted forms are identical. Simple and correct, but paying for a full sort is more than this question needs -- an anagram check only cares about character counts, not any particular order.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const sortedS = s.split('').sort().join('');
  const sortedT = t.split('').sort().join('');

  return sortedS === sortedT;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Count characters instead of sorting them. Walk s incrementing a count per character, then walk t decrementing the same counts; if t is a true anagram, every count lands back at exactly zero. A single array of 26 counters (assuming lowercase letters) replaces both the sort and the second string comparison.',
        time: 'O(n)',
        space: 'O(1) -- a fixed 26-slot counter, independent of input size',
        code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const counts = new Array<number>(26).fill(0);
  const code = (ch: string) => ch.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, ...

  for (let i = 0; i < s.length; i++) {
    counts[code(s[i])]++;
    counts[code(t[i])]--;
  }

  // If every increment from s was matched by a decrement from t, every
  // counter is back at zero -- the two strings used identical letters.
  return counts.every((count) => count === 0);
}`,
      },
    ],
  },
  {
    problemId: 'k-closest-points-to-origin-2',
    statement: 'Given an array of points on the plane and an integer k, return the k points closest to the origin (0, 0), in any order.',
    starter: `function kClosest(points: number[][], k: number): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Sort every point by its squared distance from the origin (squaring avoids an unnecessary square root, since it preserves the ordering) and take the first k. Direct, but sorts the whole array when only the k smallest distances are actually needed.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function kClosest(points: number[][], k: number): number[][] {
  const squaredDistance = ([x, y]: number[]): number => x * x + y * y;
  return [...points].sort((a, b) => squaredDistance(a) - squaredDistance(b)).slice(0, k);
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Quickselect: the same partitioning idea behind quicksort, but only recursing into the ONE side that actually contains the k-th position, instead of both. Partition around a pivot distance; if the pivot lands exactly at index k-1, everything to its left is exactly the k closest points (in some order). Otherwise recurse into whichever side still needs narrowing. Each partition step throws away the other half of the work entirely.",
        time: 'O(n) average case (classic quickselect bound)',
        space: 'O(1) beyond the output, done in place',
        code: `function kClosest(points: number[][], k: number): number[][] {
  const squaredDistance = ([x, y]: number[]): number => x * x + y * y;
  const pts = [...points];

  const partition = (low: number, high: number): number => {
    const pivotDist = squaredDistance(pts[high]);
    let boundary = low;

    for (let i = low; i < high; i++) {
      if (squaredDistance(pts[i]) < pivotDist) {
        [pts[boundary], pts[i]] = [pts[i], pts[boundary]];
        boundary++;
      }
    }

    [pts[boundary], pts[high]] = [pts[high], pts[boundary]];
    return boundary;
  };

  const quickselect = (low: number, high: number) => {
    if (low >= high) return;

    const pivotIndex = partition(low, high);

    if (pivotIndex === k - 1) return; // exactly k elements now sit to the left
    if (pivotIndex < k - 1) quickselect(pivotIndex + 1, high); // need more from the right
    else quickselect(low, pivotIndex - 1); // k-th position is further left
  };

  quickselect(0, pts.length - 1);
  return pts.slice(0, k);
}`,
      },
    ],
  },
  {
    problemId: 'sum-of-subsequence-widths-2',
    statement:
      'The width of a subsequence is the difference between its maximum and minimum elements. Given an array of integers, return the sum of the widths of every non-empty subsequence, modulo 10^9 + 7.',
    starter: `function sumSubseqWidths(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every non-empty subsequence directly, compute its width, and add it to a running total. It is exactly what is asked for, but there are 2^n - 1 subsequences, which is only feasible for tiny arrays.',
        time: 'O(2^n)',
        space: 'O(n) recursion depth',
        code: `function sumSubseqWidths(nums: number[]): number {
  const MOD = 1_000_000_007;
  let total = 0;

  const explore = (index: number, chosen: number[]) => {
    if (index === nums.length) {
      if (chosen.length > 0) {
        const width = Math.max(...chosen) - Math.min(...chosen);
        total = (total + width) % MOD;
      }
      return;
    }

    explore(index + 1, chosen); // skip this element
    explore(index + 1, [...chosen, nums[index]]); // include it
  };

  explore(0, []);
  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sort the array, then account for each ELEMENT’s contribution as a maximum or minimum directly, instead of enumerating subsequences. Once sorted, an element at index i can serve as the MAXIMUM of any subsequence built from it plus any subset of the i smaller elements to its left -- that is 2^i subsequences. Symmetrically, it can serve as the MINIMUM of any subsequence built from it plus any subset of the (n-1-i) larger elements to its right -- 2^(n-1-i) subsequences. Summing (value * 2^i) as a max-contribution and subtracting (value * 2^(n-1-i)) as a min-contribution, over every element, gives the total width sum directly -- because every subsequence’s width is exactly (its max’s contribution) minus (its min’s contribution), and this sums both sides across every subsequence at once.',
        time: 'O(n log n)',
        space: 'O(n) for the powers-of-two table',
        code: `function sumSubseqWidths(nums: number[]): number {
  const MOD = 1_000_000_007n;
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;

  // Precompute powers of two mod MOD, up to 2^(n-1).
  const powerOfTwo = new Array<bigint>(n).fill(1n);
  for (let i = 1; i < n; i++) powerOfTwo[i] = (powerOfTwo[i - 1] * 2n) % MOD;

  let total = 0n;

  for (let i = 0; i < n; i++) {
    const value = BigInt(sorted[i]);

    // As the maximum: paired with any subset of the i smaller elements.
    total = (total + value * powerOfTwo[i]) % MOD;

    // As the minimum: paired with any subset of the (n-1-i) larger elements.
    total = (total - value * powerOfTwo[n - 1 - i]) % MOD;
  }

  // JS/TS bigint modulo can come out negative; normalise into [0, MOD).
  return Number(((total % MOD) + MOD) % MOD);
}`,
      },
    ],
  },
  {
    problemId: 'minimum-difference-between-highest-and-lowest-of-k-scores-2',
    statement:
      'Given an array of scores and an integer k, choose exactly k of the scores so that the difference between the highest and lowest chosen score is as small as possible. Return that minimum possible difference.',
    starter: `function minimumDifference(nums: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every combination of k scores from the array, compute each combination’s spread, and keep the smallest. It answers the question by definition, but the number of size-k combinations grows very quickly.',
        time: 'O(C(n, k) * k)',
        space: 'O(k) recursion depth',
        code: `function minimumDifference(nums: number[], k: number): number {
  let best = Infinity;

  const explore = (start: number, chosen: number[]) => {
    if (chosen.length === k) {
      best = Math.min(best, Math.max(...chosen) - Math.min(...chosen));
      return;
    }
    if (start === nums.length) return;

    for (let i = start; i < nums.length; i++) {
      explore(i + 1, [...chosen, nums[i]]);
    }
  };

  explore(0, []);
  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Sort first. In any optimal choice of k scores, they should be k CONSECUTIVE values in the sorted order -- swapping out a non-consecutive choice for the nearest unused value in between can only shrink or hold the spread the same, never grow it. So the answer is just the minimum, over every window of k consecutive sorted elements, of (window's last value - window's first value) -- one pass after the sort.",
        time: 'O(n log n)',
        space: 'O(n) for the sort',
        code: `function minimumDifference(nums: number[], k: number): number {
  if (k <= 1) return 0; // a single score has no spread at all

  const sorted = [...nums].sort((a, b) => a - b);
  let best = Infinity;

  // Every window of k consecutive sorted values is a candidate; the
  // window's own first and last elements give its spread directly.
  for (let start = 0; start + k - 1 < sorted.length; start++) {
    const spread = sorted[start + k - 1] - sorted[start];
    best = Math.min(best, spread);
  }

  return best;
}`,
      },
    ],
  },
];
