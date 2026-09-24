import type { Solution } from '@/lib/types';

/** Sorting, and problems that become easy once the input is sorted. */
export const sortingSolutions: Solution[] = [
  {
    problemId: 'sort-colors',
    statement:
      'Sort an array containing only 0s, 1s and 2s in place, in a single pass and with constant extra space.',
    starter: `function sortColors(nums: number[]): void {
  // your code here
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Count how many of each value there are, then overwrite the array with that many of each. Correct and simple, but it reads the array twice.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function sortColors(nums: number[]): void {
  const counts = [0, 0, 0];

  // Pass 1: tally.
  for (const value of nums) counts[value]++;

  // Pass 2: rewrite the array in order.
  let write = 0;
  for (let colour = 0; colour < 3; colour++) {
    for (let i = 0; i < counts[colour]; i++) {
      nums[write] = colour;
      write++;
    }
  }
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The Dutch national flag partition. Three pointers carve the array into "known 0s", "known 1s", unexplored, and "known 2s". The subtlety is that swapping a 2 into place brings back an unknown value, so the scan pointer must not advance in that case — whereas swapping a 0 brings back an already-examined 1, so it can.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function sortColors(nums: number[]): void {
  // Everything before "low" is 0, everything after "high" is 2, and
  // [low..mid) is 1. [mid..high] is still unexplored.
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      // Swapping with "low" brings back a 1 we have already classified,
      // so it is safe to advance mid as well.
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      // Already in the right region.
      mid++;
    } else {
      // Swapping with "high" brings back an UNEXAMINED value, so mid must
      // stay put and inspect it next iteration. Advancing here is the
      // classic bug in this problem.
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
      },
    ],
  },

  {
    problemId: 'merge-intervals',
    statement:
      'Given a collection of intervals, merge all overlapping ones and return the non-overlapping intervals that cover the same ranges.',
    starter: `function merge(intervals: number[][]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort by start. Once sorted, an interval can only overlap the one immediately before it, so a single pass suffices: either extend the last merged interval or begin a new one. Without sorting you would have to compare every pair.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];

  // Sorting by start is what reduces this to a single linear sweep: an
  // interval can now only overlap its immediate predecessor.
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    const last = merged[merged.length - 1];

    if (start <= last[1]) {
      // Overlaps: stretch the previous interval. Math.max matters because
      // this interval may be entirely contained within the last one.
      last[1] = Math.max(last[1], end);
    } else {
      // A clean gap, so start a new interval.
      merged.push([start, end]);
    }
  }

  return merged;
}`,
      },
    ],
  },

  {
    problemId: 'insert-interval',
    statement:
      'Given a sorted list of non-overlapping intervals and a new interval, insert it and merge where necessary.',
    starter: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The input is already sorted, so no sort is needed — just three phases. Copy everything ending before the new interval, absorb everything that overlaps by widening the new interval, then copy the rest. Splitting it into three loops is what keeps the logic readable.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  const result: number[][] = [];
  let [newStart, newEnd] = newInterval;
  let i = 0;

  // Phase 1: everything entirely BEFORE the new interval passes through.
  while (i < intervals.length && intervals[i][1] < newStart) {
    result.push(intervals[i]);
    i++;
  }

  // Phase 2: absorb every overlapping interval by widening the new one
  // rather than pushing them individually.
  while (i < intervals.length && intervals[i][0] <= newEnd) {
    newStart = Math.min(newStart, intervals[i][0]);
    newEnd = Math.max(newEnd, intervals[i][1]);
    i++;
  }
  result.push([newStart, newEnd]);

  // Phase 3: everything entirely AFTER passes through unchanged.
  while (i < intervals.length) {
    result.push(intervals[i]);
    i++;
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'sort-an-array',
    statement:
      'Sort an array of integers ascending without using any built-in sort function.',
    starter: `function sortArray(nums: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Merge sort. Split in half, sort each half recursively, then merge the two sorted halves in linear time. Unlike quicksort it is worst-case O(n log n) with no adversarial input, and it is stable — which is why it is the safe answer when an interviewer asks you to implement a sort.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function sortArray(nums: number[]): number[] {
  // A single element is already sorted -- the recursion bottoms out here.
  if (nums.length <= 1) return nums;

  const middle = Math.floor(nums.length / 2);

  // Sort each half independently.
  const left = sortArray(nums.slice(0, middle));
  const right = sortArray(nums.slice(middle));

  // Merge two sorted halves by repeatedly taking the smaller front element.
  const merged: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    // <= keeps the sort STABLE: equal elements retain their original order.
    if (left[i] <= right[j]) {
      merged.push(left[i]);
      i++;
    } else {
      merged.push(right[j]);
      j++;
    }
  }

  // One side is exhausted; the remainder of the other is already sorted.
  while (i < left.length) { merged.push(left[i]); i++; }
  while (j < right.length) { merged.push(right[j]); j++; }

  return merged;
}`,
      },
    ],
  },

  {
    problemId: 'inversions',
    statement:
      'Count the inversions in an array — pairs of indices i < j where the value at i is greater than the value at j.',
    starter: `function countInversions(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Check every pair directly.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function countInversions(nums: number[]): number {
  let count = 0;

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) count++;
    }
  }

  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Piggyback on merge sort. During the merge, when an element from the right half is taken before elements remain in the left half, every one of those remaining left elements forms an inversion with it — so add them all at once. That batch count is what turns a quadratic problem into n log n.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function countInversions(nums: number[]): number {
  let inversions = 0;

  const sortAndCount = (array: number[]): number[] => {
    if (array.length <= 1) return array;

    const middle = Math.floor(array.length / 2);
    const left = sortAndCount(array.slice(0, middle));
    const right = sortAndCount(array.slice(middle));

    const merged: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i++;
      } else {
        // left[i] > right[j], and left is sorted -- so EVERY remaining
        // element in left is also greater than right[j]. That is
        // (left.length - i) inversions counted in one step, which is the
        // whole reason this is faster than checking pairs.
        inversions += left.length - i;

        merged.push(right[j]);
        j++;
      }
    }

    while (i < left.length) { merged.push(left[i]); i++; }
    while (j < right.length) { merged.push(right[j]); j++; }

    return merged;
  };

  sortAndCount(nums);
  return inversions;
}`,
      },
    ],
  },

  {
    problemId: 'largest-number',
    statement:
      'Given a list of non-negative integers, arrange them to form the largest possible number and return it as a string.',
    starter: `function largestNumber(nums: number[]): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort with a custom comparator that asks, for any two numbers, which concatenation order is larger: compare b+a against a+b as strings. That pairwise rule is provably a valid total ordering, which is what makes sorting by it produce the global optimum. The only edge case is an array of all zeros, which would otherwise render as "000".',
        time: 'O(n log n * digits)',
        space: 'O(n)',
        code: `function largestNumber(nums: number[]): string {
  const asStrings = nums.map(String);

  // The comparator is the whole problem: for two candidates, whichever
  // CONCATENATION is larger decides the order. Comparing the numbers
  // themselves gives the wrong answer -- 9 before 30 beats 30 before 9,
  // even though 9 < 30.
  asStrings.sort((a, b) => (b + a).localeCompare(a + b));

  // All zeros would otherwise produce "000" instead of "0".
  if (asStrings[0] === '0') return '0';

  return asStrings.join('');
}`,
      },
    ],
  },

  {
    problemId: 'h-index',
    statement:
      'Given an array of citation counts, compute the h-index: the largest h such that the researcher has at least h papers with at least h citations each.',
    starter: `function hIndex(citations: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'Sort descending. Walking the list, the paper at position i has at least i+1 papers citing it at least as much, so the answer is the largest i+1 where the citation count still reaches i+1.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function hIndex(citations: number[]): number {
  const sorted = [...citations].sort((a, b) => b - a);

  let h = 0;

  for (let i = 0; i < sorted.length; i++) {
    // At position i there are i + 1 papers with at least sorted[i]
    // citations. That qualifies as an h-index of i + 1 only if the count
    // itself reaches i + 1.
    if (sorted[i] >= i + 1) h = i + 1;
    else break; // sorted descending, so it only gets worse
  }

  return h;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Counting sort removes the comparison sort. The h-index can never exceed the number of papers, so bucket every citation count, clamping anything above n into the last bucket. Then walk buckets from the top accumulating a running total; the first point where the total reaches the bucket index is the answer.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function hIndex(citations: number[]): number {
  const n = citations.length;

  // buckets[c] = how many papers have exactly c citations. Anything above n
  // is clamped into buckets[n], because the h-index cannot exceed n anyway.
  const buckets = new Array<number>(n + 1).fill(0);

  for (const count of citations) {
    buckets[Math.min(count, n)]++;
  }

  let papersWithAtLeast = 0;

  // Walk down from the highest possible h.
  for (let h = n; h >= 0; h--) {
    papersWithAtLeast += buckets[h];

    // Enough papers have at least h citations.
    if (papersWithAtLeast >= h) return h;
  }

  return 0;
}`,
      },
    ],
  },

  {
    problemId: 'relative-sort-array',
    statement:
      'Sort the first array so its elements follow the order given in the second. Elements not in the second array go at the end in ascending order.',
    starter: `function relativeSortArray(arr1: number[], arr2: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Build a rank lookup from the second array, then sort with a comparator that uses that rank when both values have one. Values with no rank sort after everything ranked, and among themselves numerically. Using Infinity as the default rank handles both rules in one comparison.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function relativeSortArray(arr1: number[], arr2: number[]): number[] {
  // Value -> its position in the desired ordering.
  const rank = new Map<number, number>();
  arr2.forEach((value, index) => rank.set(value, index));

  return [...arr1].sort((a, b) => {
    // Unranked values get Infinity, which pushes them past everything
    // ranked without needing a separate branch.
    const rankA = rank.get(a) ?? Infinity;
    const rankB = rank.get(b) ?? Infinity;

    // Different ranks: the ordering from arr2 decides.
    if (rankA !== rankB) return rankA - rankB;

    // Both unranked (both Infinity): fall back to numeric order. Two
    // ranked values can never tie, since ranks are unique.
    return a - b;
  });
}`,
      },
    ],
  },

  {
    problemId: 'reverse-pairs',
    statement:
      'Count the pairs of indices i < j where the value at i is more than twice the value at j.',
    starter: `function reversePairs(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Merge sort again, but the counting cannot ride along inside the merge because the condition involves doubling. Instead count with a separate two-pointer sweep over the two sorted halves before merging them. Both halves are sorted, so that sweep is linear and the pointer never rewinds.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function reversePairs(nums: number[]): number {
  let pairs = 0;

  const sortAndCount = (array: number[]): number[] => {
    if (array.length <= 1) return array;

    const middle = Math.floor(array.length / 2);
    const left = sortAndCount(array.slice(0, middle));
    const right = sortAndCount(array.slice(middle));

    // Count BEFORE merging, with its own sweep. The "> 2 * x" condition
    // does not align with the merge comparison, so it cannot be folded in.
    let j = 0;
    for (const value of left) {
      // Advance j while right[j] is small enough to pair with this value.
      // Because left is sorted ascending, j never needs to move back --
      // that is what keeps this linear rather than quadratic.
      while (j < right.length && value > 2 * right[j]) j++;
      pairs += j;
    }

    // Now the ordinary merge.
    const merged: number[] = [];
    let a = 0;
    let b = 0;

    while (a < left.length && b < right.length) {
      if (left[a] <= right[b]) { merged.push(left[a]); a++; }
      else { merged.push(right[b]); b++; }
    }
    while (a < left.length) { merged.push(left[a]); a++; }
    while (b < right.length) { merged.push(right[b]); b++; }

    return merged;
  };

  sortAndCount(nums);
  return pairs;
}`,
      },
    ],
  },

  {
    problemId: 'minimum-difference-between-highest-and-lowest-of-k-scores',
    statement:
      'Given an array of scores and an integer k, pick k scores so the difference between the highest and lowest chosen is minimised. Return that difference.',
    starter: `function minimumDifference(nums: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort, then the k chosen scores must be contiguous in the sorted order — inserting a gap could only widen the spread. So slide a window of width k and take the smallest first-to-last difference. Recognising the contiguity is the entire problem.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function minimumDifference(nums: number[], k: number): number {
  // Picking one score has no spread at all.
  if (k <= 1) return 0;

  const sorted = [...nums].sort((a, b) => a - b);

  let best = Infinity;

  // After sorting, the best k scores are always ADJACENT: skipping a value
  // to reach a further one can only widen the range, never narrow it.
  for (let i = 0; i + k - 1 < sorted.length; i++) {
    const spread = sorted[i + k - 1] - sorted[i];
    best = Math.min(best, spread);
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'sum-of-subsequence-widths',
    statement:
      'The width of a sequence is its maximum minus its minimum. Return the sum of widths over all non-empty subsequences, modulo 1e9+7.',
    starter: `function sumSubseqWidths(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Do not enumerate subsequences — count contributions. Sort, and then each element is the maximum of every subsequence drawn from the elements before it (2^i of them) and the minimum for the 2^(n-1-i) drawn from those after. So its net contribution is value times (2^i − 2^(n-1-i)), summed over all elements. Sorting is what makes those counts computable.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function sumSubseqWidths(nums: number[]): number {
  const MOD = 1000000007n;
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;

  // Precompute powers of two, since each is needed twice.
  const powers: bigint[] = new Array(n);
  powers[0] = 1n;
  for (let i = 1; i < n; i++) {
    powers[i] = (powers[i - 1] * 2n) % MOD;
  }

  let total = 0n;

  for (let i = 0; i < n; i++) {
    // sorted[i] is the MAXIMUM of any subsequence chosen from the i smaller
    // elements before it: 2^i such subsequences.
    // It is the MINIMUM for any chosen from the n-1-i larger elements
    // after it: 2^(n-1-i) of them.
    const asMax = powers[i];
    const asMin = powers[n - 1 - i];

    const contribution = (BigInt(sorted[i]) * (asMax - asMin)) % MOD;
    total = (total + contribution) % MOD;
  }

  // The subtraction can go negative under the modulus; bring it back.
  return Number(((total % MOD) + MOD) % MOD);
}`,
      },
    ],
  },
];
