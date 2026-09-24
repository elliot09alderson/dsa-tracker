import type { Solution } from '@/lib/types';

/**
 * Binary search.
 *
 * Half of this topic is not searching a sorted array at all -- it is binary
 * searching the ANSWER. Whenever a problem asks for a minimum capacity, a
 * smallest largest sum, or a maximum minimum distance, and you can cheaply
 * check "is X feasible", you can binary search over X. Recognising that shape
 * is what the harder problems here are testing.
 */
export const binarySearchSolutions: Solution[] = [
  {
    problemId: 'find-first-and-last-position-of-element-in-sorted-array',
    statement:
      'Given a sorted array, find the first and last index of a target value. Return [-1, -1] if it is absent. Must run in O(log n).',
    starter: `function searchRange(nums: number[], target: number): number[] {
  // your code here
  return [-1, -1];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Scan left to right recording the first and last match. Correct but linear, which the problem forbids.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function searchRange(nums: number[], target: number): number[] {
  let first = -1;
  let last = -1;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== target) continue;

    // Record the first match once, and keep updating the last.
    if (first === -1) first = i;
    last = i;
  }

  return [first, last];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Run two binary searches with a small twist: instead of stopping at any match, record it and keep narrowing toward the side you want. Searching left on a match finds the first occurrence; searching right finds the last.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function searchRange(nums: number[], target: number): number[] {
  /**
   * Standard binary search, except a match does not stop the search -- it is
   * remembered, and the range keeps shrinking toward one side. That is what
   * turns "find any" into "find the first" or "find the last".
   */
  const findEdge = (wantFirst: boolean): number => {
    let low = 0;
    let high = nums.length - 1;
    let found = -1;

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);

      if (nums[mid] === target) {
        found = mid;

        // Keep looking on the side where an earlier/later copy would be.
        if (wantFirst) high = mid - 1;
        else low = mid + 1;
      } else if (nums[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return found;
  };

  return [findEdge(true), findEdge(false)];
}`,
      },
    ],
  },

  {
    problemId: 'search-in-rotated-sorted-array',
    statement:
      'A sorted array of distinct values has been rotated at some pivot. Given the array and a target, return its index or -1. Must run in O(log n).',
    starter: `function search(nums: number[], target: number): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The key observation: after a rotation, at least one half of any window is still properly sorted. Work out which half that is by comparing the midpoint to the left end, then check whether the target lies inside that sorted half. If it does, search there; otherwise search the other half. Every step still halves the range.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function search(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] === target) return mid;

    // Exactly one side is guaranteed to be sorted. Comparing against the
    // left end tells us which one.
    if (nums[low] <= nums[mid]) {
      // Left half is sorted. Is the target inside its range?
      if (nums[low] <= target && target < nums[mid]) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      // Right half is sorted instead.
      if (nums[mid] < target && target <= nums[high]) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return -1;
}`,
      },
    ],
  },

  {
    problemId: 'find-peak-element',
    statement:
      'A peak is an element strictly greater than its neighbours. Given an array where adjacent elements differ, return the index of any peak. Imagine out-of-bounds neighbours as negative infinity. Must run in O(log n).',
    starter: `function findPeakElement(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Binary search on the slope. If the midpoint is lower than its right neighbour you are on an ascending stretch, and an ascent must eventually hit a peak, so a peak exists to the right. Otherwise you are descending and a peak lies at or to the left. No sortedness is required — only the guarantee that the ends fall away.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function findPeakElement(nums: number[]): number {
  let low = 0;
  let high = nums.length - 1;

  // Note "low < high", not "<=": the loop narrows to a single index, which
  // is by construction a peak, so there is nothing to check at the end.
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] < nums[mid + 1]) {
      // Going uphill. Since the array falls off at the far end, continuing
      // uphill must reach a peak somewhere to the right.
      low = mid + 1;
    } else {
      // Going downhill (or flat-topped): mid itself may be the peak, so it
      // stays in the range.
      high = mid;
    }
  }

  return low;
}`,
      },
    ],
  },

  {
    problemId: 'single-element-in-a-sorted-array',
    statement:
      'In a sorted array where every element appears exactly twice except one, find that single element in O(log n) time and O(1) space.',
    starter: `function singleNonDuplicate(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Before the single element, every pair starts at an even index. After it, that alignment shifts by one. So force the midpoint to an even index and compare it with the next element: if they match, the odd one out is further right; if not, it is at or to the left. The parity check is the entire trick.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function singleNonDuplicate(nums: number[]): number {
  let low = 0;
  let high = nums.length - 1;

  while (low < high) {
    let mid = low + Math.floor((high - low) / 2);

    // Snap to an even index so mid always points at the FIRST element of a
    // candidate pair. The whole argument depends on this alignment.
    if (mid % 2 === 1) mid--;

    if (nums[mid] === nums[mid + 1]) {
      // Pairs are still correctly aligned here, so the break is later.
      low = mid + 2;
    } else {
      // Alignment already broken: the single element is at mid or before.
      high = mid;
    }
  }

  return nums[low];
}`,
      },
    ],
  },

  {
    problemId: 'sqrtx',
    statement:
      'Given a non-negative integer x, return the square root truncated to an integer, without using any built-in exponent function.',
    starter: `function mySqrt(x: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Count upward until the square exceeds x, then step back one.',
        time: 'O(sqrt(x))',
        space: 'O(1)',
        code: `function mySqrt(x: number): number {
  let root = 0;

  // Stop as soon as the next square would overshoot.
  while ((root + 1) * (root + 1) <= x) {
    root++;
  }

  return root;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Binary search the answer between 0 and x. A candidate is valid when its square does not exceed x, so remember the largest valid one and keep searching right. This is the simplest instance of "binary search the answer" and a good template for the harder ones.',
        time: 'O(log x)',
        space: 'O(1)',
        code: `function mySqrt(x: number): number {
  if (x < 2) return x;

  let low = 1;
  let high = Math.floor(x / 2); // the root is never larger than x/2 for x >= 2
  let answer = 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const square = mid * mid;

    if (square === x) return mid;

    if (square < x) {
      // Valid, but perhaps not the largest -- record it and try higher.
      answer = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return answer;
}`,
      },
    ],
  },

  {
    problemId: 'search-a-2d-matrix',
    statement:
      'Given an m x n matrix where each row is sorted and the first value of each row exceeds the last value of the previous row, determine whether a target exists. Must run in O(log(m*n)).',
    starter: `function searchMatrix(matrix: number[][], target: number): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Because the rows join end to end, the whole matrix is one sorted sequence that happens to be stored in two dimensions. Binary search the range 0 to m*n-1 and convert each index into a row and column with division and modulo. No separate row search is needed.',
        time: 'O(log(m*n))',
        space: 'O(1)',
        code: `function searchMatrix(matrix: number[][], target: number): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Treat the matrix as a single sorted array of length rows * cols.
  let low = 0;
  let high = rows * cols - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    // Map the flat index back into two dimensions.
    const value = matrix[Math.floor(mid / cols)][mid % cols];

    if (value === target) return true;
    if (value < target) low = mid + 1;
    else high = mid - 1;
  }

  return false;
}`,
      },
    ],
  },

  {
    problemId: 'arranging-coins',
    statement:
      'You have n coins to arrange in a staircase where row i contains exactly i coins. Return the number of complete rows you can build.',
    starter: `function arrangeCoins(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Subtract row sizes one at a time until you run out of coins.',
        time: 'O(sqrt(n))',
        space: 'O(1)',
        code: `function arrangeCoins(n: number): number {
  let row = 1;
  let remaining = n;

  // Each row needs one more coin than the last.
  while (remaining >= row) {
    remaining -= row;
    row++;
  }

  // The loop exits one row past the last complete one.
  return row - 1;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'k complete rows use k(k+1)/2 coins, which grows monotonically, so binary search for the largest k whose total does not exceed n. The monotonicity is exactly the property that makes binary search valid here.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function arrangeCoins(n: number): number {
  let low = 1;
  let high = n;
  let complete = 0;

  while (low <= high) {
    const rows = low + Math.floor((high - low) / 2);

    // Coins needed for this many complete rows: the triangular number.
    const needed = (rows * (rows + 1)) / 2;

    if (needed <= n) {
      // Affordable -- record it and try for more rows.
      complete = rows;
      low = rows + 1;
    } else {
      high = rows - 1;
    }
  }

  return complete;
}`,
      },
    ],
  },

  {
    problemId: 'split-array-largest-sum',
    statement:
      'Split an array into k non-empty contiguous subarrays so that the largest subarray sum is as small as possible. Return that minimised largest sum.',
    starter: `function splitArray(nums: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Binary search the answer. The candidate answers run from the largest single element (no subarray can be smaller than its biggest member) to the total sum (one subarray holding everything). For any candidate cap, greedily count how many subarrays are needed if none may exceed it — that count falls as the cap rises, which is the monotonicity binary search requires. Find the smallest cap needing k or fewer.',
        time: 'O(n log(sum))',
        space: 'O(1)',
        code: `function splitArray(nums: number[], k: number): number {
  /**
   * With no subarray allowed to exceed "cap", how many do we need?
   * Greedy is optimal here: extend the current piece until adding the next
   * value would break the cap, then start a new piece.
   */
  const piecesNeeded = (cap: number): number => {
    let pieces = 1;
    let running = 0;

    for (const value of nums) {
      if (running + value > cap) {
        pieces++;
        running = value; // start a new subarray with this value
      } else {
        running += value;
      }
    }

    return pieces;
  };

  // The answer is at least the largest element (it has to fit somewhere)
  // and at most the total (one subarray holding everything).
  let low = Math.max(...nums);
  let high = nums.reduce((sum, v) => sum + v, 0);

  while (low < high) {
    const cap = low + Math.floor((high - low) / 2);

    if (piecesNeeded(cap) <= k) {
      // This cap is achievable within k pieces, so it is a valid answer --
      // but a smaller one might also be, so keep it in the range.
      high = cap;
    } else {
      // Too tight: it forces more than k pieces.
      low = cap + 1;
    }
  }

  return low;
}`,
      },
    ],
  },

  {
    problemId: 'magnetic-force-between-two-balls',
    statement:
      'Given basket positions and m balls, place the balls so that the minimum distance between any two is as large as possible. Return that maximum minimum distance.',
    starter: `function maxDistance(position: number[], m: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The mirror image of the previous problem — binary search the answer, but maximising instead of minimising. Sort the positions, then for a candidate gap greedily place balls as early as possible and count how many fit. More balls fit as the gap shrinks, giving the monotonicity. Find the largest gap that still fits m balls.',
        time: 'O(n log n + n log(range))',
        space: 'O(1) beyond the sort',
        code: `function maxDistance(position: number[], m: number): number {
  // Sorting is what makes the greedy placement valid.
  const baskets = [...position].sort((a, b) => a - b);

  /** How many balls fit if consecutive balls must be at least gap apart? */
  const ballsPlaced = (gap: number): number => {
    let placed = 1;                 // always put the first ball in basket 0
    let lastPosition = baskets[0];

    for (const basket of baskets) {
      // Greedy: take the earliest basket that respects the gap. Placing any
      // later would only reduce how many fit afterwards.
      if (basket - lastPosition >= gap) {
        placed++;
        lastPosition = basket;
      }
    }

    return placed;
  };

  let low = 1;
  let high = baskets[baskets.length - 1] - baskets[0];
  let best = 0;

  while (low <= high) {
    const gap = low + Math.floor((high - low) / 2);

    if (ballsPlaced(gap) >= m) {
      // This gap works -- record it and try to be greedier.
      best = gap;
      low = gap + 1;
    } else {
      // Too wide: not enough balls fit.
      high = gap - 1;
    }
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'painters-partition-problem',
    statement:
      'Given k painters and boards of given lengths, where each painter must take a contiguous block, minimise the time for the whole job. A painter takes one unit of time per unit of board.',
    starter: `function minTime(boards: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Identical in structure to Split Array Largest Sum — the painters are the subarrays and the completion time is the largest block. Binary search the time limit, and for each candidate greedily count how many painters are needed. This pairing is worth recognising: several named problems reduce to the same search.',
        time: 'O(n log(sum))',
        space: 'O(1)',
        code: `function minTime(boards: number[], k: number): number {
  /** Painters required if none may work longer than "limit". */
  const paintersNeeded = (limit: number): number => {
    let painters = 1;
    let running = 0;

    for (const board of boards) {
      if (running + board > limit) {
        painters++;
        running = board;
      } else {
        running += board;
      }
    }

    return painters;
  };

  // At minimum, someone must paint the longest single board. At maximum,
  // one painter does everything.
  let low = Math.max(...boards);
  let high = boards.reduce((sum, b) => sum + b, 0);

  while (low < high) {
    const limit = low + Math.floor((high - low) / 2);

    if (paintersNeeded(limit) <= k) {
      high = limit; // achievable; try tighter
    } else {
      low = limit + 1;
    }
  }

  return low;
}`,
      },
    ],
  },

  {
    problemId: 'median-of-two-sorted-arrays',
    statement:
      'Given two sorted arrays, return the median of their combined elements. The overall run time must be O(log(m+n)).',
    starter: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Merge the two arrays and read the middle. Simple and linear, which the problem forbids.',
        time: 'O(m + n)',
        space: 'O(m + n)',
        code: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const mid = Math.floor(merged.length / 2);

  // Even length averages the two middle values; odd length takes the middle.
  return merged.length % 2 === 0
    ? (merged[mid - 1] + merged[mid]) / 2
    : merged[mid];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Do not search for the median — search for the correct partition. Cut both arrays so the combined left side holds exactly half the elements and every value on the left is at most every value on the right. Binary search the cut position in the shorter array; the other cut follows from it. Sentinels of infinity at the edges remove every empty-side special case, which is what makes the code manageable.',
        time: 'O(log(min(m, n)))',
        space: 'O(1)',
        code: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // Always binary search the SHORTER array, so the derived cut in the other
  // one can never fall outside its bounds.
  let a = nums1;
  let b = nums2;
  if (a.length > b.length) [a, b] = [b, a];

  const m = a.length;
  const n = b.length;
  const half = Math.floor((m + n + 1) / 2);

  let low = 0;
  let high = m;

  while (low <= high) {
    // cutA elements taken from a, the rest of the half taken from b.
    const cutA = low + Math.floor((high - low) / 2);
    const cutB = half - cutA;

    // Sentinels: an empty left side behaves like -Infinity and an empty
    // right side like +Infinity, so no boundary case needs its own branch.
    const leftA = cutA === 0 ? -Infinity : a[cutA - 1];
    const rightA = cutA === m ? Infinity : a[cutA];
    const leftB = cutB === 0 ? -Infinity : b[cutB - 1];
    const rightB = cutB === n ? Infinity : b[cutB];

    if (leftA <= rightB && leftB <= rightA) {
      // Correct partition: everything left is <= everything right.
      if ((m + n) % 2 === 1) {
        return Math.max(leftA, leftB);
      }
      return (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2;
    }

    if (leftA > rightB) {
      // Took too much from a.
      high = cutA - 1;
    } else {
      // Took too little from a.
      low = cutA + 1;
    }
  }

  return 0; // unreachable for valid sorted inputs
}`,
      },
    ],
  },
];
