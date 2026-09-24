import type { Solution } from '@/lib/types';

/**
 * Solutions for the Arrays topic.
 *
 * Every entry gives the approaches in increasing order of quality, so reading
 * the tabs left to right shows how you would actually get to the optimal
 * answer in an interview: start with the obvious brute force, name why it is
 * slow, then improve it.
 */
export const arraysSolutions: Solution[] = [
  {
    problemId: 'trapping-rain-water',
    statement:
      'Given n non-negative integers where each value is the height of a bar of width 1, compute how much rainwater is trapped between the bars after it rains.',
    starter: `function trap(height: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Water sitting on top of one bar is decided by the tallest bar to its left and the tallest bar to its right. The shorter of those two walls is the water level; subtract the bar itself to get the water above it. The direct way to find those two walls is to rescan the array for every position.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function trap(height: number[]): number {
  let total = 0;

  // Consider each bar as the floor of a puddle.
  for (let i = 0; i < height.length; i++) {
    // Tallest bar at or to the left of i.
    let leftMax = 0;
    for (let l = 0; l <= i; l++) {
      leftMax = Math.max(leftMax, height[l]);
    }

    // Tallest bar at or to the right of i.
    let rightMax = 0;
    for (let r = i; r < height.length; r++) {
      rightMax = Math.max(rightMax, height[r]);
    }

    // Water level is capped by the shorter wall; the bar itself takes up space.
    total += Math.min(leftMax, rightMax) - height[i];
  }

  return total;
}`,
      },
      {
        name: 'Better',
        idea:
          'The two rescans repeat work. Precompute, in one left-to-right pass, the tallest bar up to each index, and in one right-to-left pass, the tallest bar from each index onward. Then the answer is a single pass over those tables.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function trap(height: number[]): number {
  const n = height.length;
  if (n === 0) return 0;

  const leftMax = new Array<number>(n);
  const rightMax = new Array<number>(n);

  // leftMax[i] = tallest bar in height[0..i]
  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  }

  // rightMax[i] = tallest bar in height[i..n-1]
  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  }

  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.min(leftMax[i], rightMax[i]) - height[i];
  }

  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'You never need both tables at once. Walk two pointers inward. Whichever side currently has the *shorter* wall is the side whose water level is already decided — the taller side can only stay the same or grow, so it can never be the limiting wall. Settle that side and move its pointer in.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;

  // Tallest bar seen so far from each end.
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      // The left wall is the shorter one, so it decides the water level here.
      if (height[left] >= leftMax) {
        leftMax = height[left]; // new wall, holds no water itself
      } else {
        total += leftMax - height[left];
      }
      left++;
    } else {
      // Symmetric case: the right wall is the limiting one.
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        total += rightMax - height[right];
      }
      right--;
    }
  }

  return total;
}`,
      },
    ],
  },

  {
    problemId: 'maximum-subarray',
    statement:
      'Given an integer array, find the contiguous subarray with the largest sum and return that sum. The array can contain negative numbers, and the subarray must be non-empty.',
    starter: `function maxSubArray(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every possible subarray. Fix a start index, then extend the end index one step at a time, keeping a running sum so you do not re-add the same prefix repeatedly.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function maxSubArray(nums: number[]): number {
  let best = -Infinity;

  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    // Extend the window one element at a time instead of re-summing.
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      best = Math.max(best, sum);
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Kadane's algorithm. Scan once, tracking the best sum of a subarray that *ends at the current index*. At each step you either extend the previous best-ending-here, or start fresh at the current element — whichever is larger. A running prefix that has gone negative can only hurt what follows, so you drop it.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxSubArray(nums: number[]): number {
  // Best sum of a subarray ending exactly at the current index.
  let endingHere = nums[0];
  // Best sum seen anywhere so far.
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either glue nums[i] onto the previous run, or begin a new run at nums[i].
    // Starting fresh wins exactly when the previous run had gone negative.
    endingHere = Math.max(nums[i], endingHere + nums[i]);
    best = Math.max(best, endingHere);
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'majority-element',
    statement:
      'Given an array of size n, return the element that appears more than ⌊n/2⌋ times. You may assume such an element always exists.',
    starter: `function majorityElement(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'For each candidate value, count how many times it occurs by scanning the whole array.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function majorityElement(nums: number[]): number {
  const threshold = Math.floor(nums.length / 2);

  for (const candidate of nums) {
    let count = 0;
    for (const value of nums) {
      if (value === candidate) count++;
    }
    if (count > threshold) return candidate;
  }

  return -1; // unreachable given the problem guarantee
}`,
      },
      {
        name: 'Better',
        idea: 'Count every value in one pass using a hash map, then read off the value whose count crosses n/2.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function majorityElement(nums: number[]): number {
  const counts = new Map<number, number>();
  const threshold = Math.floor(nums.length / 2);

  for (const value of nums) {
    const next = (counts.get(value) ?? 0) + 1;
    // Check as we go, so we can stop the moment the winner is decided.
    if (next > threshold) return value;
    counts.set(value, next);
  }

  return -1;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Boyer-Moore voting. Think of it as every element cancelling out one element of a different value. Because the majority appears more than n/2 times, it cannot be fully cancelled — whatever survives is the answer. Keep one candidate and a counter; matching values increment it, differing values decrement it, and a zero counter means the candidate is replaced.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function majorityElement(nums: number[]): number {
  let candidate = nums[0];
  let count = 0;

  for (const value of nums) {
    if (count === 0) {
      // Everything so far has cancelled out; restart with this value.
      candidate = value;
      count = 1;
    } else if (value === candidate) {
      count++; // a vote for the candidate
    } else {
      count--; // a vote against cancels one supporting vote
    }
  }

  // Guaranteed to be the majority element by the problem statement. If that
  // guarantee were removed, you would verify with one more counting pass.
  return candidate;
}`,
      },
    ],
  },

  {
    problemId: 'set-matrix-zeroes',
    statement:
      'Given an m x n matrix, if any element is 0, set its entire row and column to 0. Do it in place.',
    starter: `function setZeroes(matrix: number[][]): void {
  // your code here
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Copy the matrix, then for every zero in the copy, blank the matching row and column in the original. The copy is what stops freshly written zeroes from triggering more blanking.',
        time: 'O((m*n)*(m+n))',
        space: 'O(m*n)',
        code: `function setZeroes(matrix: number[][]): void {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Snapshot, so zeroes we write do not cascade.
  const copy = matrix.map((row) => [...row]);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (copy[r][c] === 0) {
        for (let k = 0; k < cols; k++) matrix[r][k] = 0;
        for (let k = 0; k < rows; k++) matrix[k][c] = 0;
      }
    }
  }
}`,
      },
      {
        name: 'Better',
        idea:
          'You do not need a full copy — only which rows and which columns contain a zero. Record those in two boolean arrays on a first pass, then blank on a second pass.',
        time: 'O(m*n)',
        space: 'O(m+n)',
        code: `function setZeroes(matrix: number[][]): void {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const zeroRow = new Array<boolean>(rows).fill(false);
  const zeroCol = new Array<boolean>(cols).fill(false);

  // Pass 1: remember which rows and columns must be cleared.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 0) {
        zeroRow[r] = true;
        zeroCol[c] = true;
      }
    }
  }

  // Pass 2: apply.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (zeroRow[r] || zeroCol[c]) matrix[r][c] = 0;
    }
  }
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Reuse the first row and first column of the matrix itself as those two boolean arrays. The one cell they share, matrix[0][0], would have to mean two things at once, so track the first column separately in a single variable. Then write the interior first and the two marker lines last, so the markers are not destroyed while still being read.',
        time: 'O(m*n)',
        space: 'O(1)',
        code: `function setZeroes(matrix: number[][]): void {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // matrix[0][0] can only carry one flag, so the first column gets its own.
  let firstColHasZero = false;

  for (let r = 0; r < rows; r++) {
    if (matrix[r][0] === 0) firstColHasZero = true;

    // Start at column 1: column 0 is handled by the flag above.
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0; // mark this row
        matrix[0][c] = 0; // mark this column
      }
    }
  }

  // Write the interior bottom-up/right-to-left of the markers, so the marker
  // row and column are still intact while we read them.
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 1; c--) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
    // Only now is it safe to clear this row's marker cell.
    if (firstColHasZero) matrix[r][0] = 0;
  }
}`,
      },
    ],
  },

  {
    problemId: 'next-permutation',
    statement:
      'Rearrange the numbers into the lexicographically next greater permutation. If no greater permutation exists, rearrange into the lowest order (sorted ascending). Do it in place with constant extra memory.',
    starter: `function nextPermutation(nums: number[]): void {
  // your code here
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every permutation, sort them, find the current one, and return the one after it. Correct, but factorial time — only worth stating to explain why you move on.',
        time: 'O(n! * n log n)',
        space: 'O(n! * n)',
        code: `function nextPermutation(nums: number[]): void {
  // Build every permutation of the input.
  const all: number[][] = [];
  const build = (current: number[], remaining: number[]) => {
    if (remaining.length === 0) {
      all.push([...current]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      build([...current, remaining[i]], [
        ...remaining.slice(0, i),
        ...remaining.slice(i + 1),
      ]);
    }
  };
  build([], nums);

  // Sort them lexicographically, then step to the one after ours.
  all.sort((a, b) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  });

  // Deduplicate first. With repeated values the same arrangement is generated
  // several times, and stepping to "the next one" would land on an identical
  // permutation instead of a genuinely larger one.
  const unique: number[][] = [];
  let lastKey = '';
  for (const permutation of all) {
    const k = permutation.join(',');
    if (k !== lastKey) {
      unique.push(permutation);
      lastKey = k;
    }
  }
  all.length = 0;
  all.push(...unique);

  const key = nums.join(',');
  const index = all.findIndex((p) => p.join(',') === key);
  // Wrap around to the smallest permutation when we are at the largest.
  const next = all[(index + 1) % all.length];

  for (let i = 0; i < nums.length; i++) nums[i] = next[i];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A permutation that is descending from some point onward is already the largest arrangement of that suffix. So scan from the right to find the first index i where nums[i] < nums[i+1] — that is the digit that must grow. Swap it with the smallest value to its right that still beats it, then reverse the suffix, which turns it from largest-possible into smallest-possible.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function nextPermutation(nums: number[]): void {
  const n = nums.length;

  // Step 1: from the right, find the first value that is smaller than its
  // neighbour. Everything after it is non-increasing, i.e. already maximal.
  let pivot = n - 2;
  while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) {
    pivot--;
  }

  // Step 2: if such a value exists, swap it with the smallest value to its
  // right that is still bigger than it. Scanning from the right finds that
  // value first, because the suffix is non-increasing.
  if (pivot >= 0) {
    let successor = n - 1;
    while (nums[successor] <= nums[pivot]) {
      successor--;
    }
    [nums[pivot], nums[successor]] = [nums[successor], nums[pivot]];
  }

  // Step 3: the suffix is still in descending order, which is its largest
  // arrangement. Reverse it to get the smallest, giving the *next* permutation
  // rather than a much later one. When pivot < 0 this reverses the whole array,
  // which is exactly the "wrap around to sorted ascending" case.
  let left = pivot + 1;
  let right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}`,
      },
    ],
  },
];
