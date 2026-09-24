import type { Solution } from '@/lib/types';

/**
 * Two pointers, part two.
 *
 * More sorted-array and multi-array pointer problems: fixed-difference
 * pairs, minimizing a spread across several arrays, and the k-sum family
 * beyond the basic pair sum. Split from two-pointers.ts purely to keep each
 * file a readable size.
 */
export const twoPointers2Solutions: Solution[] = [
  {
    problemId: 'diffk',
    statement:
      'Given a sorted array of distinct integers A and an integer B, determine whether there exists a pair of indices i != j such that A[i] - A[j] = B (B can be assumed non-negative).',
    starter: `function diffk(a: number[], b: number): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check every pair of indices directly and compare their difference to B. Correct, and simple, but it ignores that the array is already sorted -- information that lets a fixed-difference pair be found without comparing every pair at all.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function diffk(a: number[], b: number): boolean {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (i !== j && a[i] - a[j] === b) return true;
    }
  }
  return false;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Two pointers walking the same sorted array in the same direction. Keep a "low" pointer and a "high" pointer, both starting at the beginning; if the gap between them is too small, advance high to widen it, and if it is too big, advance low to narrow it. Because the array is sorted, the gap changes monotonically as either pointer moves, so each pointer only ever needs to move forward -- never backtrack.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function diffk(a: number[], b: number): boolean {
  let low = 0;
  let high = 1;

  while (low < a.length && high < a.length) {
    if (low === high) {
      high++; // never compare an element with itself
      continue;
    }

    const gap = a[high] - a[low];

    if (gap === b) return true;

    if (gap < b) {
      high++; // gap too small -- widen it by moving the far pointer forward
    } else {
      low++; // gap too big -- narrow it by moving the near pointer forward
    }
  }

  return false;
}`,
      },
    ],
  },
  {
    problemId: 'subarray-with-given-sum',
    statement:
      'Given an array of non-negative integers and a target sum, find the leftmost contiguous subarray that sums to exactly the target, and return its 1-indexed start and end positions (or [-1] if none exists).',
    starter: `function subarrayWithGivenSum(arr: number[], target: number): number[] {
  // your code here
  return [-1];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every possible start position and extend the window rightward, adding as it grows, until the sum meets or exceeds the target. Correct, but every start position re-sums from scratch even though a lot of that work is shared with the previous start position.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function subarrayWithGivenSum(arr: number[], target: number): number[] {
  for (let start = 0; start < arr.length; start++) {
    let sum = 0;
    for (let end = start; end < arr.length; end++) {
      sum += arr[end];
      if (sum === target) return [start + 1, end + 1]; // 1-indexed
      if (sum > target) break; // all values are non-negative, so it only grows
    }
  }
  return [-1];
}`,
      },
      {
        name: 'Optimal',
        idea:
          "A sliding window works here specifically because every element is non-negative: growing the window from the right can only increase the sum, and shrinking from the left can only decrease it, so both directions move monotonically with no need to ever recompute from scratch. Expand right while the sum is too small, and contract left while it is too big, until it matches exactly.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function subarrayWithGivenSum(arr: number[], target: number): number[] {
  let left = 0;
  let sum = 0;

  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];

    // Shrink from the left while the window has overshot the target.
    while (sum > target && left <= right) {
      sum -= arr[left];
      left++;
    }

    if (sum === target) return [left + 1, right + 1]; // 1-indexed
  }

  return [-1];
}`,
      },
    ],
  },
  {
    problemId: 'minimize-the-absolute-difference',
    statement:
      'Given three arrays A, B and C, each sorted, pick one element from each so as to minimize the difference between the largest and smallest of the three chosen values. Return that minimum difference.',
    starter: `function minimizeAbsoluteDifference(a: number[], b: number[], c: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every combination of one element from each array and compute its spread directly. It examines every possibility, so it is trivially correct, but the three nested loops make it cubic in the array sizes.',
        time: 'O(|A| * |B| * |C|)',
        space: 'O(1)',
        code: `function minimizeAbsoluteDifference(a: number[], b: number[], c: number[]): number {
  let best = Infinity;

  for (const x of a) {
    for (const y of b) {
      for (const z of c) {
        const spread = Math.max(x, y, z) - Math.min(x, y, z);
        best = Math.max(0, Math.min(best, spread));
      }
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Three pointers, one per array, all starting at index 0. At each step, compute the spread of the three current elements and update the best answer, then advance ONLY the pointer sitting on the smallest of the three values. That is always the right move: increasing the current minimum is the only way to possibly shrink the spread, since increasing anything else would either widen the spread or do nothing. Because all three arrays are sorted, this greedy step never needs to look back.',
        time: 'O(|A| + |B| + |C|)',
        space: 'O(1)',
        code: `function minimizeAbsoluteDifference(a: number[], b: number[], c: number[]): number {
  let i = 0;
  let j = 0;
  let k = 0;
  let best = Infinity;

  while (i < a.length && j < b.length && k < c.length) {
    const x = a[i];
    const y = b[j];
    const z = c[k];

    const spread = Math.max(x, y, z) - Math.min(x, y, z);
    best = Math.min(best, spread);
    if (best === 0) break; // cannot do better than a spread of zero

    // Advancing the pointer on the current minimum is the only move that
    // can shrink the spread -- moving anything else only widens it.
    if (x <= y && x <= z) i++;
    else if (y <= x && y <= z) j++;
    else k++;
  }

  return best;
}`,
      },
    ],
  },
  {
    problemId: 'valid-triangle-number',
    statement:
      'Given an array of non-negative integers, count the number of triplets that could form the three side lengths of a valid triangle (the sum of any two sides must exceed the third).',
    starter: `function triangleNumber(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check every triplet of indices directly: sort first so the largest-side check reduces to one comparison instead of three, then test every combination of three indices against the triangle inequality. It is a direct reading of the definition, but cubic.',
        time: 'O(n^3)',
        space: 'O(n) for the sort',
        code: `function triangleNumber(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  let count = 0;

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      for (let k = j + 1; k < sorted.length; k++) {
        // Sorted, so sorted[k] is the largest -- only this one inequality
        // needs checking; the other two are automatically satisfied.
        if (sorted[i] + sorted[j] > sorted[k]) count++;
      }
    }
  }

  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Sort, then fix the LARGEST side first and two-pointer the other two from the two ends of everything smaller. For a fixed largest side at index k, walk low from the start and high from k-1: if sorted[low] + sorted[high] > sorted[k], then EVERY index between low and high also works when paired with high (since sorted[low..high-1] are all at least sorted[low]), so add (high - low) triplets at once and move high inward; otherwise low is too small and must move outward. This finds all triplets for a fixed largest side in one linear pass instead of a nested search.",
        time: 'O(n^2)',
        space: 'O(n) for the sort',
        code: `function triangleNumber(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;
  let count = 0;

  // Fix "k" as the index of the largest side of the triplet.
  for (let k = n - 1; k >= 2; k--) {
    let low = 0;
    let high = k - 1;

    while (low < high) {
      if (sorted[low] + sorted[high] > sorted[k]) {
        // sorted[low], sorted[low+1], ..., sorted[high-1] all pair validly
        // with sorted[high] (and sorted[k]), since they are >= sorted[low].
        count += high - low;
        high--;
      } else {
        low++; // too small a pair sum -- need a bigger low value
      }
    }
  }

  return count;
}`,
      },
    ],
  },
  {
    problemId: '3sum-closest',
    statement:
      'Given an array of integers and a target, find the sum of three integers in the array that is closest to the target, and return that sum.',
    starter: `function threeSumClosest(nums: number[], target: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check the sum of every triplet directly and keep whichever is closest to the target so far. Straightforward, but examines every one of the O(n^3) triplets.',
        time: 'O(n^3)',
        space: 'O(1)',
        code: `function threeSumClosest(nums: number[], target: number): number {
  let best = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k];
        if (Math.abs(sum - target) < Math.abs(best - target)) {
          best = sum;
        }
      }
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sort, then fix each number in turn as the first of the triplet and two-pointer the rest of the array for the other two, exactly as in the classic 3Sum. At each pointer position, compare the current sum to target: if it is already an exact match, that is the best possible answer and the search can stop entirely; otherwise move the pointer on the side that nudges the sum toward target (low up to increase it, high down to decrease it), updating the closest-sum-so-far along the way.',
        time: 'O(n^2)',
        space: 'O(n) for the sort',
        code: `function threeSumClosest(nums: number[], target: number): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;
  let best = sorted[0] + sorted[1] + sorted[2];

  for (let i = 0; i < n - 2; i++) {
    let low = i + 1;
    let high = n - 1;

    while (low < high) {
      const sum = sorted[i] + sorted[low] + sorted[high];

      if (Math.abs(sum - target) < Math.abs(best - target)) {
        best = sum;
      }

      if (sum === target) return sum; // cannot get any closer than exact

      if (sum < target) low++; // need a bigger sum
      else high--; // need a smaller sum
    }
  }

  return best;
}`,
      },
    ],
  },
  {
    problemId: '4sum',
    statement:
      'Given an array of integers and a target, return all unique quadruplets [a, b, c, d] such that a + b + c + d equals the target. Each quadruplet’s values must be reported in non-descending order, and the result must not contain duplicate quadruplets.',
    starter: `function fourSum(nums: number[], target: number): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check the sum of every combination of four indices directly, collecting the values into a sorted tuple and using a Set of stringified tuples to avoid duplicates. It works, but the quadruple nested loop is expensive, and the duplicate-suppression is bolted on afterward instead of being avoided by construction.',
        time: 'O(n^4)',
        space: 'O(n^4) in the worst case for the dedup set',
        code: `function fourSum(nums: number[], target: number): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const seen = new Set<string>();
  const results: number[][] = [];

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      for (let k = j + 1; k < sorted.length; k++) {
        for (let l = k + 1; l < sorted.length; l++) {
          if (sorted[i] + sorted[j] + sorted[k] + sorted[l] === target) {
            const quad = [sorted[i], sorted[j], sorted[k], sorted[l]];
            const key = quad.join(',');
            if (!seen.has(key)) {
              seen.add(key);
              results.push(quad);
            }
          }
        }
      }
    }
  }

  return results;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sort once, then fix the first two numbers with nested loops and two-pointer the remaining two -- the same pattern that solves 3Sum, with one more fixed index. Duplicates are avoided by construction rather than by a Set: at each of the four positions, skip straight past a value equal to the one just tried at that same position, which naturally suppresses every repeated quadruplet without ever building one.',
        time: 'O(n^3)',
        space: 'O(n) for the sort, output not counted',
        code: `function fourSum(nums: number[], target: number): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;
  const results: number[][] = [];

  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // skip duplicate first pick

    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && sorted[j] === sorted[j - 1]) continue; // skip duplicate second pick

      let low = j + 1;
      let high = n - 1;

      while (low < high) {
        const sum = sorted[i] + sorted[j] + sorted[low] + sorted[high];

        if (sum === target) {
          results.push([sorted[i], sorted[j], sorted[low], sorted[high]]);

          // Skip past any run of duplicates on both sides before continuing.
          while (low < high && sorted[low] === sorted[low + 1]) low++;
          while (low < high && sorted[high] === sorted[high - 1]) high--;

          low++;
          high--;
        } else if (sum < target) {
          low++;
        } else {
          high--;
        }
      }
    }
  }

  return results;
}`,
      },
    ],
  },
  {
    problemId: 'counting-rectangles',
    statement:
      'Given a sorted array of distinct positive integers A and an integer B, count how many ordered pairs (length, breadth) taken from A produce a rectangle with area strictly less than B. A rectangle of length x, breadth y is a different configuration from length y, breadth x when x != y. Return the count modulo 10^9 + 7.',
    starter: `function countingRectangles(a: number[], b: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every ordered pair of elements from A directly, checking whether their product is less than B. It answers the question exactly as stated, at the cost of examining every one of the O(n^2) ordered pairs.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function countingRectangles(a: number[], b: number): number {
  const MOD = 1_000_000_007;
  let count = 0;

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (a[i] * a[j] < b) count = (count + 1) % MOD;
    }
  }

  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Since A is sorted, fix each value as the "length" and binary search for how many values could serve as a valid "breadth" -- the largest index whose value, multiplied by the fixed length, is still less than B. Because the array is sorted, that count only shrinks as the fixed length grows, so instead of a fresh binary search per element, walk a second pointer inward from the end as the first pointer advances -- each pointer only ever moves in one direction across the whole pass.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function countingRectangles(a: number[], b: number): number {
  const MOD = 1_000_000_007;
  const n = a.length;
  let count = 0;

  // "limit" tracks, for the current length, how many of the smallest
  // values could serve as breadth (a[i] * a[limit-1] < b). As length
  // grows, this can only shrink, so it never needs to move back up.
  let limit = n;

  for (let i = 0; i < n; i++) {
    while (limit > 0 && a[i] * a[limit - 1] >= b) limit--;
    count = (count + limit) % MOD;
  }

  return count;
}`,
      },
    ],
  },
  {
    problemId: 'smallest-sequence-with-given-primes',
    statement:
      'Given three prime numbers A, B and C and an integer D, return the first D positive integers, in ascending order, whose only prime factors are among A, B and C.',
    starter: `function smallestSequenceWithGivenPrimes(a: number, b: number, c: number, d: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Test candidate integers one at a time, starting from 1, checking each for whether repeatedly dividing out A, B and C reduces it all the way to 1 (meaning it has no other prime factors). Collect candidates until D of them are found. Correct, but with no idea of where the D-th valid number actually lies, this can test a great many numbers, most of which fail the check.',
        time: 'Depends on how sparse valid numbers are; each check is O(log(candidate))',
        space: 'O(D)',
        code: `function smallestSequenceWithGivenPrimes(a: number, b: number, c: number, d: number): number[] {
  const hasOnlyTheseFactors = (n: number): boolean => {
    for (const prime of [a, b, c]) {
      while (n % prime === 0) n /= prime;
    }
    return n === 1;
  };

  const result: number[] = [];
  let candidate = 1;

  while (result.length < d) {
    if (hasOnlyTheseFactors(candidate)) result.push(candidate);
    candidate++;
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'This is the classic "ugly number" generation trick: every valid number beyond 1 is exactly A, B or C times a SMALLER valid number, so the sequence can be built forward rather than tested candidate by candidate. Keep three pointers, one into the sequence already built for each of A, B, C, each representing "the next number from this prime’s multiples that has not been used yet." At each step, the next sequence value is the smallest of (sequence[pA]*A, sequence[pB]*B, sequence[pC]*C); whichever pointer(s) produced that minimum advance, since their current candidate has now been consumed.',
        time: 'O(D)',
        space: 'O(D)',
        code: `function smallestSequenceWithGivenPrimes(a: number, b: number, c: number, d: number): number[] {
  const sequence: number[] = [1];
  let pA = 0;
  let pB = 0;
  let pC = 0;

  while (sequence.length < d) {
    const candidateA = sequence[pA] * a;
    const candidateB = sequence[pB] * b;
    const candidateC = sequence[pC] * c;

    const next = Math.min(candidateA, candidateB, candidateC);
    sequence.push(next);

    // Advance every pointer whose candidate was just used -- there can be
    // ties (e.g. 2*3 === 3*2 for different primes), and all of them must
    // move forward to avoid generating the same value twice.
    if (next === candidateA) pA++;
    if (next === candidateB) pB++;
    if (next === candidateC) pC++;
  }

  return sequence;
}`,
      },
    ],
  },
];
