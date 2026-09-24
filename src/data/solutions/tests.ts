import type { TestCase } from '@/lib/types';

/**
 * Test cases for the practice editor, keyed by problem id.
 *
 * Kept separate from the solution text so cases can be added for any problem
 * without editing the solution files. The registry merges these in.
 *
 * `fn` must match the function name in the problem's starter, because the
 * runner looks it up by name after evaluating the code.
 */
export const PROBLEM_TESTS: Record<string, { fn: string; cases: TestCase[] }> = {
  'trapping-rain-water': {
    fn: 'trap',
    cases: [
      { label: 'classic example', args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { label: 'descending then ascending', args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { label: 'no dips', args: [[1, 2, 3, 4]], expected: 0 },
      { label: 'empty', args: [[]], expected: 0 },
    ],
  },

  'maximum-subarray': {
    fn: 'maxSubArray',
    cases: [
      { label: 'mixed signs', args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { label: 'single element', args: [[1]], expected: 1 },
      { label: 'all negative', args: [[-3, -2, -5]], expected: -2 },
      { label: 'all positive', args: [[5, 4, -1, 7, 8]], expected: 23 },
    ],
  },

  'majority-element': {
    fn: 'majorityElement',
    cases: [
      { label: 'clear majority', args: [[3, 2, 3]], expected: 3 },
      { label: 'longer input', args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
      { label: 'single element', args: [[1]], expected: 1 },
    ],
  },

  'set-matrix-zeroes': {
    fn: 'setZeroes',
    cases: [
      {
        label: 'one zero in the middle',
        args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
        expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
        mutates: 0,
      },
      {
        label: 'zeros on the first row',
        args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
        expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]],
        mutates: 0,
      },
    ],
  },

  'next-permutation': {
    fn: 'nextPermutation',
    cases: [
      { label: 'simple step', args: [[1, 2, 3]], expected: [1, 3, 2], mutates: 0 },
      { label: 'wraps around from largest', args: [[3, 2, 1]], expected: [1, 2, 3], mutates: 0 },
      { label: 'with a duplicate', args: [[1, 1, 5]], expected: [1, 5, 1], mutates: 0 },
      { label: 'longer', args: [[1, 3, 2]], expected: [2, 1, 3], mutates: 0 },
    ],
  },

  'container-with-most-water': {
    fn: 'maxArea',
    cases: [
      { label: 'classic example', args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { label: 'two bars', args: [[1, 1]], expected: 1 },
      { label: 'ascending', args: [[1, 2, 3, 4, 5]], expected: 6 },
    ],
  },

  '3sum': {
    fn: 'threeSum',
    cases: [
      {
        label: 'two triplets',
        args: [[-1, 0, 1, 2, -1, -4]],
        expected: [[-1, -1, 2], [-1, 0, 1]],
        unordered: true,
      },
      { label: 'no triplet', args: [[0, 1, 1]], expected: [], unordered: true },
      { label: 'all zeros', args: [[0, 0, 0]], expected: [[0, 0, 0]], unordered: true },
    ],
  },

  'two-sum-ii-input-array-is-sorted': {
    fn: 'twoSum',
    cases: [
      { label: 'first and second', args: [[2, 7, 11, 15], 9], expected: [1, 2] },
      { label: 'middle pair', args: [[2, 3, 4], 6], expected: [1, 3] },
      { label: 'negatives', args: [[-1, 0], -1], expected: [1, 2] },
    ],
  },

  'remove-duplicates-from-sorted-array': {
    fn: 'removeDuplicates',
    cases: [
      { label: 'one duplicate', args: [[1, 1, 2]], expected: 2 },
      { label: 'several duplicates', args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 },
      { label: 'already unique', args: [[1, 2, 3]], expected: 3 },
    ],
  },

  'spiral-matrix': {
    fn: 'spiralOrder',
    cases: [
      {
        label: '3x3',
        args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
        expected: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      },
      {
        label: '3x4',
        args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]],
        expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
      },
      { label: 'single row', args: [[[1, 2, 3]]], expected: [1, 2, 3] },
    ],
  },

  'first-missing-positive': {
    fn: 'firstMissingPositive',
    cases: [
      { label: 'missing 3', args: [[1, 2, 0]], expected: 3 },
      { label: 'missing 2', args: [[3, 4, -1, 1]], expected: 2 },
      { label: 'all above range', args: [[7, 8, 9, 11, 12]], expected: 1 },
      { label: 'with duplicates', args: [[1, 1]], expected: 2 },
    ],
  },

  'corporate-flight-bookings': {
    fn: 'corpFlightBookings',
    cases: [
      {
        label: 'overlapping ranges',
        args: [[[1, 2, 10], [2, 3, 20], [2, 5, 25]], 5],
        expected: [10, 55, 45, 25, 25],
      },
      { label: 'two bookings', args: [[[1, 2, 10], [2, 2, 15]], 2], expected: [10, 25] },
    ],
  },

  'majority-element-ii': {
    fn: 'majorityElement',
    cases: [
      { label: 'one winner', args: [[3, 2, 3]], expected: [3], unordered: true },
      { label: 'none qualify', args: [[1]], expected: [1], unordered: true },
      { label: 'two winners', args: [[1, 2]], expected: [1, 2], unordered: true },
      { label: 'longer', args: [[2, 2, 1, 3]], expected: [2], unordered: true },
    ],
  },

  'max-consecutive-ones-iii': {
    fn: 'longestOnes',
    cases: [
      { label: 'k = 2', args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], expected: 6 },
      {
        label: 'k = 3',
        args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3],
        expected: 10,
      },
      { label: 'k = 0', args: [[1, 1, 0, 1], 0], expected: 2 },
    ],
  },

  'set-mismatch': {
    fn: 'findErrorNums',
    cases: [
      { label: 'duplicate 2, missing 3', args: [[1, 2, 2, 4]], expected: [2, 3] },
      { label: 'duplicate 1, missing 2', args: [[1, 1]], expected: [1, 2] },
      { label: 'longer', args: [[2, 2]], expected: [2, 1] },
    ],
  },

  'plus-one': {
    fn: 'plusOne',
    cases: [
      { label: 'no carry', args: [[1, 2, 3]], expected: [1, 2, 4] },
      { label: 'single carry', args: [[4, 3, 2, 9]], expected: [4, 3, 3, 0] },
      { label: 'all nines grows the array', args: [[9, 9]], expected: [1, 0, 0] },
      { label: 'zero', args: [[0]], expected: [1] },
    ],
  },

  'pascals-triangle-ii': {
    fn: 'getRow',
    cases: [
      { label: 'row 0', args: [0], expected: [1] },
      { label: 'row 1', args: [1], expected: [1, 1] },
      { label: 'row 3', args: [3], expected: [1, 3, 3, 1] },
      { label: 'row 5', args: [5], expected: [1, 5, 10, 10, 5, 1] },
    ],
  },

  'excel-sheet-column-title': {
    fn: 'convertToTitle',
    cases: [
      { label: '1 -> A', args: [1], expected: 'A' },
      { label: '26 -> Z (the off-by-one trap)', args: [26], expected: 'Z' },
      { label: '28 -> AB', args: [28], expected: 'AB' },
      { label: '701 -> ZY', args: [701], expected: 'ZY' },
    ],
  },

  'factorial-trailing-zeroes': {
    fn: 'trailingZeroes',
    cases: [
      { label: '3! = 6', args: [3], expected: 0 },
      { label: '5! = 120', args: [5], expected: 1 },
      { label: '25 has an extra power of 5', args: [25], expected: 6 },
      { label: 'zero', args: [0], expected: 0 },
    ],
  },

  'generate-parentheses': {
    fn: 'generateParenthesis',
    cases: [
      { label: 'n = 1', args: [1], expected: ['()'], unordered: true },
      {
        label: 'n = 3',
        args: [3],
        expected: ['((()))', '(()())', '(())()', '()(())', '()()()'],
        unordered: true,
      },
    ],
  },

  'unique-paths-ii': {
    fn: 'uniquePathsWithObstacles',
    cases: [
      { label: 'one obstacle', args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], expected: 2 },
      { label: 'small grid', args: [[[0, 1], [0, 0]]], expected: 1 },
      { label: 'blocked start', args: [[[1, 0], [0, 0]]], expected: 0 },
    ],
  },

  'valid-parentheses': {
    fn: 'isValid',
    cases: [
      { label: 'simple pair', args: ['()'], expected: true },
      { label: 'all three kinds', args: ['()[]{}'], expected: true },
      { label: 'mismatched', args: ['(]'], expected: false },
      { label: 'wrong nesting order', args: ['([)]'], expected: false },
      { label: 'unclosed', args: ['('], expected: false },
    ],
  },

  'daily-temperatures': {
    fn: 'dailyTemperatures',
    cases: [
      {
        label: 'classic example',
        args: [[73, 74, 75, 71, 69, 72, 76, 73]],
        expected: [1, 1, 4, 2, 1, 1, 0, 0],
      },
      { label: 'strictly rising', args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { label: 'plateau', args: [[30, 60, 90]], expected: [1, 1, 0] },
    ],
  },

  'largest-rectangle-in-histogram': {
    fn: 'largestRectangleArea',
    cases: [
      { label: 'classic example', args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { label: 'two bars', args: [[2, 4]], expected: 4 },
      { label: 'flat', args: [[3, 3, 3]], expected: 9 },
    ],
  },

  'evaluate-reverse-polish-notation': {
    fn: 'evalRPN',
    cases: [
      { label: 'addition then division', args: [['2', '1', '+', '3', '*']], expected: 9 },
      { label: 'negative truncation', args: [['4', '13', '5', '/', '+']], expected: 6 },
      { label: 'single value', args: [['42']], expected: 42 },
    ],
  },

  'asteroid-collision': {
    fn: 'asteroidCollision',
    cases: [
      { label: 'smaller destroyed', args: [[5, 10, -5]], expected: [5, 10] },
      { label: 'equal sizes annihilate', args: [[8, -8]], expected: [] },
      { label: 'chain of collisions', args: [[10, 2, -5]], expected: [10] },
      { label: 'moving apart', args: [[-2, -1, 1, 2]], expected: [-2, -1, 1, 2] },
    ],
  },

  'decode-string': {
    fn: 'decodeString',
    cases: [
      { label: 'simple repeat', args: ['3[a]2[bc]'], expected: 'aaabcbc' },
      { label: 'nested', args: ['3[a2[c]]'], expected: 'accaccacc' },
      { label: 'mixed with literals', args: ['2[abc]3[cd]ef'], expected: 'abcabccdcdcdef' },
    ],
  },

  'next-greater-element-ii': {
    fn: 'nextGreaterElements',
    cases: [
      { label: 'wraps around', args: [[1, 2, 1]], expected: [2, -1, 2] },
      { label: 'with duplicates', args: [[1, 2, 3, 4, 3]], expected: [2, 3, 4, -1, 4] },
      { label: 'all equal', args: [[5, 5]], expected: [-1, -1] },
    ],
  },

  // --- Dynamic Programming ---

  'fibonacci-number': {
    fn: 'fib',
    cases: [
      { label: 'F(0)', args: [0], expected: 0 },
      { label: 'F(2)', args: [2], expected: 1 },
      { label: 'F(10)', args: [10], expected: 55 },
      { label: 'F(20)', args: [20], expected: 6765 },
    ],
  },

  'climbing-stairs': {
    fn: 'climbStairs',
    cases: [
      { label: 'n = 2', args: [2], expected: 2 },
      { label: 'n = 3', args: [3], expected: 3 },
      { label: 'n = 10', args: [10], expected: 89 },
    ],
  },

  'house-robber': {
    fn: 'rob',
    cases: [
      { label: 'skip the middle', args: [[1, 2, 3, 1]], expected: 4 },
      { label: 'take first and last', args: [[2, 7, 9, 3, 1]], expected: 12 },
      { label: 'single house', args: [[5]], expected: 5 },
      { label: 'empty street', args: [[]], expected: 0 },
    ],
  },

  'coin-change': {
    fn: 'coinChange',
    cases: [
      { label: 'classic example', args: [[1, 2, 5], 11], expected: 3 },
      { label: 'impossible', args: [[2], 3], expected: -1 },
      { label: 'zero amount', args: [[1], 0], expected: 0 },
      { label: 'exact single coin', args: [[1, 5, 10], 10], expected: 1 },
    ],
  },

  'jump-game': {
    fn: 'canJump',
    cases: [
      { label: 'reachable', args: [[2, 3, 1, 1, 4]], expected: true },
      { label: 'blocked by a zero', args: [[3, 2, 1, 0, 4]], expected: false },
      { label: 'single element', args: [[0]], expected: true },
    ],
  },

  'longest-increasing-subsequence': {
    fn: 'lengthOfLIS',
    cases: [
      { label: 'classic example', args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { label: 'with duplicates', args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { label: 'all equal', args: [[7, 7, 7, 7]], expected: 1 },
    ],
  },

  'maximum-product-subarray': {
    fn: 'maxProduct',
    cases: [
      { label: 'positive run', args: [[2, 3, -2, 4]], expected: 6 },
      { label: 'zero resets', args: [[-2, 0, -1]], expected: 0 },
      { label: 'two negatives multiply up', args: [[-2, 3, -4]], expected: 24 },
    ],
  },

  'longest-common-subsequence': {
    fn: 'longestCommonSubsequence',
    cases: [
      { label: 'ace in abcde', args: ['abcde', 'ace'], expected: 3 },
      { label: 'identical', args: ['abc', 'abc'], expected: 3 },
      { label: 'nothing shared', args: ['abc', 'def'], expected: 0 },
    ],
  },

  'edit-distance': {
    fn: 'minDistance',
    cases: [
      { label: 'horse to ros', args: ['horse', 'ros'], expected: 3 },
      { label: 'intention to execution', args: ['intention', 'execution'], expected: 5 },
      { label: 'empty source', args: ['', 'abc'], expected: 3 },
      { label: 'identical', args: ['same', 'same'], expected: 0 },
    ],
  },

  'word-break': {
    fn: 'wordBreak',
    cases: [
      { label: 'leetcode', args: ['leetcode', ['leet', 'code']], expected: true },
      { label: 'reuses a word', args: ['applepenapple', ['apple', 'pen']], expected: true },
      { label: 'cannot segment', args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
    ],
  },

  'partition-equal-subset-sum': {
    fn: 'canPartition',
    cases: [
      { label: 'splits evenly', args: [[1, 5, 11, 5]], expected: true },
      { label: 'odd total', args: [[1, 2, 3, 5]], expected: false },
      { label: 'two equal', args: [[2, 2]], expected: true },
    ],
  },

  'perfect-squares': {
    fn: 'numSquares',
    cases: [
      { label: '12 = 4+4+4', args: [12], expected: 3 },
      { label: '13 = 4+9', args: [13], expected: 2 },
      { label: 'perfect square', args: [16], expected: 1 },
    ],
  },

  'coin-change-ii': {
    fn: 'change',
    cases: [
      { label: 'four combinations', args: [5, [1, 2, 5]], expected: 4 },
      { label: 'impossible', args: [3, [2]], expected: 0 },
      { label: 'zero amount', args: [0, [1]], expected: 1 },
    ],
  },

  'longest-palindromic-subsequence': {
    fn: 'longestPalindromeSubseq',
    cases: [
      { label: 'bbbab', args: ['bbbab'], expected: 4 },
      { label: 'cbbd', args: ['cbbd'], expected: 2 },
      { label: 'single character', args: ['a'], expected: 1 },
    ],
  },

  // --- Binary Search ---

  'find-first-and-last-position-of-element-in-sorted-array': {
    fn: 'searchRange',
    cases: [
      { label: 'two occurrences', args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
      { label: 'absent', args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
      { label: 'empty array', args: [[], 0], expected: [-1, -1] },
    ],
  },

  'search-in-rotated-sorted-array': {
    fn: 'search',
    cases: [
      { label: 'in the right half', args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { label: 'absent', args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { label: 'single element', args: [[1], 1], expected: 0 },
    ],
  },

  'single-element-in-a-sorted-array': {
    fn: 'singleNonDuplicate',
    cases: [
      { label: 'in the middle', args: [[1, 1, 2, 3, 3, 4, 4, 8, 8]], expected: 2 },
      { label: 'near the end', args: [[3, 3, 7, 7, 10, 11, 11]], expected: 10 },
      { label: 'single element', args: [[1]], expected: 1 },
    ],
  },

  'sqrtx': {
    fn: 'mySqrt',
    cases: [
      { label: 'perfect square', args: [4], expected: 2 },
      { label: 'truncates', args: [8], expected: 2 },
      { label: 'zero', args: [0], expected: 0 },
      { label: 'large', args: [2147395599], expected: 46339 },
    ],
  },

  'search-a-2d-matrix': {
    fn: 'searchMatrix',
    cases: [
      { label: 'present', args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
      { label: 'absent', args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
    ],
  },

  'arranging-coins': {
    fn: 'arrangeCoins',
    cases: [
      { label: '5 coins', args: [5], expected: 2 },
      { label: '8 coins', args: [8], expected: 3 },
      { label: '1 coin', args: [1], expected: 1 },
    ],
  },

  'split-array-largest-sum': {
    fn: 'splitArray',
    cases: [
      { label: 'k = 2', args: [[7, 2, 5, 10, 8], 2], expected: 18 },
      { label: 'k = 2 small', args: [[1, 2, 3, 4, 5], 2], expected: 9 },
      { label: 'k = 1', args: [[1, 4, 4], 3], expected: 4 },
    ],
  },

  'magnetic-force-between-two-balls': {
    fn: 'maxDistance',
    cases: [
      { label: 'three balls', args: [[1, 2, 3, 4, 7], 3], expected: 3 },
      { label: 'two balls', args: [[5, 4, 3, 2, 1, 1000000000], 2], expected: 999999999 },
    ],
  },

  'painters-partition-problem': {
    fn: 'minTime',
    cases: [
      { label: 'two painters', args: [[10, 20, 30, 40], 2], expected: 60 },
      { label: 'three painters', args: [[10, 10, 10], 3], expected: 10 },
    ],
  },

  'median-of-two-sorted-arrays': {
    fn: 'findMedianSortedArrays',
    cases: [
      { label: 'odd total', args: [[1, 3], [2]], expected: 2 },
      { label: 'even total', args: [[1, 2], [3, 4]], expected: 2.5 },
      { label: 'one empty', args: [[], [1]], expected: 1 },
    ],
  },
};
