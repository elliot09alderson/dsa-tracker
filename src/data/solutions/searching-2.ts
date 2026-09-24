import type { Solution } from '@/lib/types';

/**
 * Searching, part two.
 *
 * Binary search applied to progressively less obvious targets: a 2D matrix
 * of sorted rows (rather than a fully sorted grid), a repeated element
 * hidden by an XOR-pairing trick, and a search over what BASE would make a
 * number's digits equal a target -- binary search on the answer rather than
 * on an array. Split from binary-search.ts purely to keep each file a
 * readable size.
 */
export const searching2Solutions: Solution[] = [
  {
    problemId: 'median-of-a-row-wise-sorted-matrix',
    statement:
      'Given an m x n matrix where each row is sorted in ascending order and m * n is odd, return the median of all the elements in the matrix.',
    starter: `function matrixMedian(matrix: number[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Flatten every element into a single array, sort it, and read off the middle element directly. It is exactly the definition of a median, computed the most literal way possible, at the cost of a full sort of every element.',
        time: 'O(mn log(mn))',
        space: 'O(mn)',
        code: `function matrixMedian(matrix: number[][]): number {
  const flat = matrix.flat().sort((a, b) => a - b);
  return flat[Math.floor(flat.length / 2)];
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Binary search on the ANSWER value itself. For a candidate value V, count how many elements in the whole matrix are <= V by binary searching within each row (since every row is sorted) -- that per-row count sums to the total rank of V in the matrix in O(m log n). The true median is the smallest value whose count-of-elements-<=-it reaches more than half of the total element count; binary searching V over the full range of possible values (the global min to the global max) finds it without ever sorting or materialising the flattened array.",
        time: 'O(m log n * log(maxValue - minValue))',
        space: 'O(1)',
        code: `function matrixMedian(matrix: number[][]): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const half = Math.floor((m * n) / 2); // index of the median in 0-indexed sorted order

  let low = Math.min(...matrix.map((row) => row[0]));
  let high = Math.max(...matrix.map((row) => row[n - 1]));

  // Count how many elements across the whole matrix are <= value.
  const countLessOrEqual = (value: number): number => {
    let count = 0;
    for (const row of matrix) {
      // Binary search for the first index where row[index] > value;
      // everything before it is <= value.
      let lo = 0;
      let hi = n;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (row[mid] <= value) lo = mid + 1;
        else hi = mid;
      }
      count += lo;
    }
    return count;
  };

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    // If at most "half" elements are <= mid, the median must be larger.
    if (countLessOrEqual(mid) <= half) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}`,
      },
    ],
  },
  {
    problemId: 'find-repeating-element-sorted-array-size-n',
    statement:
      'Given a sorted array of n elements where the values come from 1 to n-1 and exactly one value repeats (appearing twice, with every other value appearing exactly once), find the repeating element.',
    starter: `function findRepeatingElement(arr: number[]): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Scan the array looking for the first place where an element equals its neighbour, which is guaranteed to happen exactly once since the array is sorted and only one value repeats. Correct and simple, but does not make use of binary search even though the sortedness supports it.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function findRepeatingElement(arr: number[]): number {
  for (let i = 0; i + 1 < arr.length; i++) {
    if (arr[i] === arr[i + 1]) return arr[i];
  }
  return -1; // should not happen given the problem's guarantee
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Binary search using an index-vs-value mismatch. Before the repeated value appears, arr[i] === i (0-indexed values line up with their positions, since everything up to that point is present exactly once and in order); from the point where the repeat has already occurred onward, arr[i] > i, because one extra copy has pushed everything after it one position later than its value. So the first index where arr[mid] > mid marks entry into the "after the repeat" region, and binary search finds that boundary directly.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function findRepeatingElement(arr: number[]): number {
  let low = 0;
  let high = arr.length - 1;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === mid) {
      // Still before the repeat -- everything so far lines up perfectly.
      low = mid + 1;
    } else {
      // arr[mid] > mid: the repeat has already happened at or before mid.
      high = mid;
    }
  }

  return arr[low];
}`,
      },
    ],
  },
  {
    problemId: 'smallest-good-base',
    statement:
      'Given a string representation of a positive integer n, find the smallest base k >= 2 such that n, written in base k, consists of all 1s (i.e. n = 1 + k + k^2 + ... + k^(m-1) for some m >= 1). Return that base k as a string.',
    starter: `function smallestGoodBase(n: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every base k from 2 up to n-1 directly: repeatedly divide n by k, checking whether every resulting digit is 1 (equivalently, keep subtracting powers of k while the number in base k stays "all ones") until n is fully consumed or a non-1 digit appears. The largest possible base to try is n-1 (which always represents n as "11" in base n-1, since 1 + (n-1) = n), so this checks up to n-2 candidate bases, each costing up to O(log n) work.',
        time: 'O(n log n) in the worst case -- infeasible for large n, shown for comparison',
        space: 'O(1)',
        code: `function smallestGoodBase(n: string): string {
  const target = BigInt(n);

  const isAllOnesInBase = (base: bigint): boolean => {
    let remaining = target;
    while (remaining > 0n) {
      if (remaining % base !== 1n) return false;
      remaining = (remaining - 1n) / base;
    }
    return true;
  };

  for (let base = 2n; base < target; base++) {
    if (isAllOnesInBase(base)) return base.toString();
  }

  return (target - 1n).toString(); // base n-1 always works: "11"
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Search by the NUMBER OF DIGITS m instead of by base, from most digits down to the fewest (largest m first means the smallest base is found first, since more digits of all 1s implies a smaller base for the same total). For a fixed digit count m, the equation 1 + k + k^2 + ... + k^(m-1) = n has at most one positive real root k, found directly with binary search on k, since the sum is strictly increasing in k. m only needs to range down to 2 (m=1 alone -- a single digit '1' -- only represents n=1, handled as a base case), and m cannot exceed about log2(n) + 1, since even base 2 caps the achievable value for large m.",
        time: 'O(log^2(n)) -- O(log n) candidate digit counts, each with an O(log n) binary search',
        space: 'O(1)',
        code: `function smallestGoodBase(n: string): string {
  const target = BigInt(n);
  if (target === 1n) return '1'; // conventionally, 1 in "base" 1 style is a degenerate case

  // Try the largest possible digit count first (most 1s => smallest base).
  const maxDigits = Math.floor(Math.log2(Number(target))) + 1;

  for (let m = maxDigits; m >= 2; m--) {
    // Sum 1 + k + ... + k^(m-1) is strictly increasing in k, so binary
    // search for the k, if any, where it exactly equals target.
    let low = 2n;
    let high = target - 1n; // an upper bound safe for any m >= 2

    while (low <= high) {
      const mid = low + (high - low) / 2n;

      // Evaluate the geometric sum at base "mid" with m digits, stopping
      // early if it already exceeds target (guards against overflow-like
      // blowup for a base that is clearly too large for this m).
      let sum = 0n;
      let power = 1n;
      for (let digit = 0; digit < m; digit++) {
        sum += power;
        if (sum > target) break;
        power *= mid;
      }

      if (sum === target) return mid.toString();
      if (sum < target) low = mid + 1n;
      else high = mid - 1n;
    }
  }

  return (target - 1n).toString(); // fallback: m = 2, base n-1, always valid
}`,
      },
    ],
  },
];
