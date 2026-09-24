import type { Solution } from '@/lib/types';

/** Solutions for the Two Pointers topic. */
export const twoPointersSolutions: Solution[] = [
  {
    problemId: 'container-with-most-water',
    statement:
      'Given an array where each value is the height of a vertical line drawn at that index, pick two lines that together with the x-axis form a container holding the most water. Return that maximum area.',
    starter: `function maxArea(height: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every pair of lines. The area of a pair is the horizontal distance between them multiplied by the shorter of the two heights, because water spills over the lower wall.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function maxArea(height: number[]): number {
  let best = 0;

  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const width = j - i;
      // Water is limited by the shorter wall.
      const depth = Math.min(height[i], height[j]);
      best = Math.max(best, width * depth);
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Start with the widest possible container: one pointer at each end. Moving either pointer inward always loses width, so it is only worth doing if you might gain depth — and depth is capped by the shorter wall. Moving the taller wall in can never help, so always move the shorter one. That discards exactly the pairs that cannot beat what you already have.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const width = right - left;
    const depth = Math.min(height[left], height[right]);
    best = Math.max(best, width * depth);

    // Every remaining pair is narrower than this one, so the only way to do
    // better is to get deeper -- which means replacing the shorter wall.
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: '3sum',
    statement:
      'Given an integer array, return all unique triplets [a, b, c] such that a + b + c === 0. The solution set must not contain duplicate triplets.',
    starter: `function threeSum(nums: number[]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check every combination of three indices. To deal with duplicate triplets, sort each one that sums to zero and keep them in a set keyed by their string form.',
        time: 'O(n^3)',
        space: 'O(number of triplets)',
        code: `function threeSum(nums: number[]): number[][] {
  const seen = new Set<string>();
  const result: number[][] = [];

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] !== 0) continue;

        // Sorting makes [-1,0,1] and [1,-1,0] produce the same key, which is
        // how duplicates get collapsed.
        const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
        const key = triplet.join(',');
        if (!seen.has(key)) {
          seen.add(key);
          result.push(triplet);
        }
      }
    }
  }

  return result;
}`,
      },
      {
        name: 'Better',
        idea:
          'Fix the first number, then the problem reduces to two-sum for the remaining target. A hash set finds the matching pair in one pass instead of a nested loop.',
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function threeSum(nums: number[]): number[][] {
  const seen = new Set<string>();
  const result: number[][] = [];

  for (let i = 0; i < nums.length; i++) {
    // Two-sum over the suffix, looking for -nums[i].
    const target = -nums[i];
    const pool = new Set<number>();

    for (let j = i + 1; j < nums.length; j++) {
      const needed = target - nums[j];
      if (pool.has(needed)) {
        const triplet = [nums[i], needed, nums[j]].sort((a, b) => a - b);
        const key = triplet.join(',');
        if (!seen.has(key)) {
          seen.add(key);
          result.push(triplet);
        }
      }
      pool.add(nums[j]);
    }
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sort the array first. Then fix each number and use two pointers on the sorted remainder: if the sum is too small move the left pointer right, if too large move the right pointer left. Sorting also makes duplicates adjacent, so they can be skipped directly instead of being filtered through a set afterwards.',
        time: 'O(n^2)',
        space: 'O(1) extra, ignoring the output',
        code: `function threeSum(nums: number[]): number[][] {
  // Sorting is what enables both the two-pointer sweep and the duplicate skip.
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    // Once the smallest of the three is positive, no triplet can reach zero.
    if (sorted[i] > 0) break;

    // Skip a repeated first element: it would produce triplets we already have.
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;

    let left = i + 1;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];

      if (sum < 0) {
        left++; // need a bigger sum
      } else if (sum > 0) {
        right--; // need a smaller sum
      } else {
        result.push([sorted[i], sorted[left], sorted[right]]);

        // Move past every copy of the two values we just used, so the same
        // triplet is not emitted again.
        while (left < right && sorted[left] === sorted[left + 1]) left++;
        while (left < right && sorted[right] === sorted[right - 1]) right--;

        left++;
        right--;
      }
    }
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'two-sum-ii-input-array-is-sorted',
    statement:
      'Given a 1-indexed array sorted in non-decreasing order, find two numbers that add up to a target and return their 1-based indices. There is exactly one solution, and you may not use the same element twice.',
    starter: `function twoSum(numbers: number[], target: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Check every pair of indices until one hits the target.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function twoSum(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) {
        // The problem asks for 1-based indices.
        return [i + 1, j + 1];
      }
    }
  }
  return [];
}`,
      },
      {
        name: 'Better',
        idea:
          'For each element, binary search the remainder of the array for its complement. This uses the sortedness, but still pays a log factor per element.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function twoSum(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    const needed = target - numbers[i];

    // Binary search for "needed" strictly to the right of i.
    let lo = i + 1;
    let hi = numbers.length - 1;
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (numbers[mid] === needed) return [i + 1, mid + 1];
      if (numbers[mid] < needed) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return [];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Put one pointer at each end. Their sum is the largest still available at the left pointer and the smallest still available at the right pointer, so a sum that is too big can only be fixed by moving the right pointer in, and one that is too small only by moving the left pointer out. Each step permanently rules out one index, so one pass suffices.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1]; // 1-based, as required
    }

    if (sum < target) {
      // numbers[left] is too small to pair with anything remaining.
      left++;
    } else {
      // numbers[right] is too large to pair with anything remaining.
      right--;
    }
  }

  return [];
}`,
      },
    ],
  },

  {
    problemId: 'remove-duplicates-from-sorted-array',
    statement:
      'Given a sorted array, remove the duplicates in place so each unique value appears once, keeping the relative order. Return the number of unique elements; the first k slots of the array must hold them.',
    starter: `function removeDuplicates(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Collect the distinct values into a set, sort them back into order, and copy them over the front of the array.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function removeDuplicates(nums: number[]): number {
  // A set drops the duplicates; sorting restores the required order.
  const unique = [...new Set(nums)].sort((a, b) => a - b);

  for (let i = 0; i < unique.length; i++) {
    nums[i] = unique[i];
  }

  return unique.length;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Because the array is sorted, duplicates are adjacent. Keep a slow pointer marking the end of the deduplicated prefix and a fast pointer scanning ahead. Whenever the fast pointer finds a value different from the last kept one, append it. Nothing is ever overwritten before it has been read.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  // Everything in nums[0..slow] is unique and in order.
  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    // A new value only ever appears when it differs from the last kept one,
    // because equal values sit next to each other in a sorted array.
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  // slow is the last index of the prefix, so the count is slow + 1.
  return slow + 1;
}`,
      },
    ],
  },
];
