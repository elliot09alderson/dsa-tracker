import type { Solution } from '@/lib/types';

/**
 * Backtracking.
 *
 * Every one of these is the same skeleton: choose an option, recurse, then
 * undo the choice. What differs is the pruning -- the condition that lets you
 * abandon a branch early -- and the duplicate-skipping rule. Those two details
 * are what an interviewer is actually watching for.
 */
export const backtrackingSolutions: Solution[] = [
  {
    problemId: 'subsets',
    statement:
      'Given an array of distinct integers, return all possible subsets (the power set). The solution may be in any order.',
    starter: `function subsets(nums: number[]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'There are 2^n subsets, and each corresponds to an n-bit number where bit i decides whether element i is included. Count from 0 to 2^n - 1 and read off the bits. No recursion at all.',
        time: 'O(n * 2^n)',
        space: 'O(1) beyond the output',
        code: `function subsets(nums: number[]): number[][] {
  const n = nums.length;
  const result: number[][] = [];

  // Each number from 0 to 2^n - 1 is one distinct inclusion pattern.
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset: number[] = [];

    for (let i = 0; i < n; i++) {
      // Is bit i set in this mask? Then element i is in this subset.
      if (mask & (1 << i)) subset.push(nums[i]);
    }

    result.push(subset);
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The standard backtracking shape. At each index the choice is include or skip. Record the current path at every node of the recursion tree, not only at the leaves, because every prefix is itself a valid subset. The push-recurse-pop is the whole pattern.',
        time: 'O(n * 2^n)',
        space: 'O(n) recursion depth',
        code: `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const explore = (start: number) => {
    // Every node of the tree is a valid subset, not just the leaves, so we
    // record on entry rather than at a base case. A copy is essential --
    // path keeps mutating underneath us.
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // Choose.
      path.push(nums[i]);

      // Explore, starting past i so each element is considered once and
      // subsets come out in a consistent order rather than as permutations.
      explore(i + 1);

      // Un-choose: this is the "backtrack" that makes the loop reusable.
      path.pop();
    }
  };

  explore(0);
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'subsets-ii',
    statement:
      'Given an array that may contain duplicates, return all possible subsets without any duplicate subsets.',
    starter: `function subsetsWithDup(nums: number[]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort first so equal values sit next to each other, then inside the loop skip any value equal to the previous one — but only when it is not the first pick at this level. That condition is the crux: skipping always would lose legitimate subsets like [2,2], while never skipping produces duplicates.',
        time: 'O(n * 2^n)',
        space: 'O(n)',
        code: `function subsetsWithDup(nums: number[]): number[][] {
  // Sorting puts equal values adjacent, which is what makes the skip below
  // possible at all.
  const sorted = [...nums].sort((a, b) => a - b);

  const result: number[][] = [];
  const path: number[] = [];

  const explore = (start: number) => {
    result.push([...path]);

    for (let i = start; i < sorted.length; i++) {
      // Skip a repeat ONLY when it is not the first choice at this level.
      // i > start means we already tried this value in this position, so
      // picking it again would rebuild an identical subset. When i === start
      // the value is being used at a new depth, which is legitimate and is
      // how [2,2] still gets produced.
      if (i > start && sorted[i] === sorted[i - 1]) continue;

      path.push(sorted[i]);
      explore(i + 1);
      path.pop();
    }
  };

  explore(0);
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'permutations',
    statement: 'Given an array of distinct integers, return all possible permutations.',
    starter: `function permute(nums: number[]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Unlike subsets, order matters and every element must be used, so each level considers all unused elements rather than only those after an index. A used-flag array tracks what is already in the current path, and a complete path of full length is recorded.',
        time: 'O(n * n!)',
        space: 'O(n)',
        code: `function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  // Which elements are already in the current path.
  const used = new Array<boolean>(nums.length).fill(false);

  const explore = () => {
    // Only a COMPLETE arrangement counts, unlike subsets where every
    // prefix was an answer.
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    // Every level scans from 0: any unused element may come next.
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      path.push(nums[i]);

      explore();

      // Undo both pieces of state.
      path.pop();
      used[i] = false;
    }
  };

  explore();
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'permutations-ii',
    statement:
      'Given a collection that may contain duplicates, return all unique permutations.',
    starter: `function permuteUnique(nums: number[]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort, then skip a duplicate value unless its identical predecessor is already used in the current path. That rule forces equal values to always be placed in left-to-right order, so each distinct arrangement is generated exactly once. Getting the condition backwards is the classic error here.',
        time: 'O(n * n!)',
        space: 'O(n)',
        code: `function permuteUnique(nums: number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);

  const result: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(sorted.length).fill(false);

  const explore = () => {
    if (path.length === sorted.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < sorted.length; i++) {
      if (used[i]) continue;

      // The duplicate rule: only place a repeated value if its identical
      // predecessor is ALREADY placed. That forces equal values to be used
      // left to right, so a given arrangement is built exactly one way.
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;

      used[i] = true;
      path.push(sorted[i]);

      explore();

      path.pop();
      used[i] = false;
    }
  };

  explore();
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'combination-sum-ii',
    statement:
      'Given a collection of candidate numbers (which may repeat) and a target, find all unique combinations summing to the target. Each number may be used at most once.',
    starter: `function combinationSum2(candidates: number[], target: number): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort so duplicates are adjacent and so the loop can break early: once a candidate exceeds the remaining target, every later candidate does too. Use the same "skip a repeat unless it is the first pick at this level" rule as Subsets II, and advance by i+1 so each element is consumed once.',
        time: 'O(2^n)',
        space: 'O(n)',
        code: `function combinationSum2(candidates: number[], target: number): number[][] {
  // Sorting enables both the duplicate skip and the early break below.
  const sorted = [...candidates].sort((a, b) => a - b);

  const result: number[][] = [];
  const path: number[] = [];

  const explore = (start: number, remaining: number) => {
    // Hit the target exactly.
    if (remaining === 0) {
      result.push([...path]);
      return;
    }

    for (let i = start; i < sorted.length; i++) {
      // Sorted, so if this one overshoots then so does everything after it.
      if (sorted[i] > remaining) break;

      // Same-level duplicate skip as in Subsets II.
      if (i > start && sorted[i] === sorted[i - 1]) continue;

      path.push(sorted[i]);

      // i + 1, not i: each element may be used only once.
      explore(i + 1, remaining - sorted[i]);

      path.pop();
    }
  };

  explore(0, target);
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'letter-combinations-of-a-phone-number',
    statement:
      'Given a string of digits from 2 to 9, return all letter combinations the number could spell, using the standard phone keypad mapping.',
    starter: `function letterCombinations(digits: string): string[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'One recursion level per digit, looping over that digit letters. The only thing worth being careful about is the empty input, which must return an empty array rather than an array containing the empty string.',
        time: 'O(4^n * n)',
        space: 'O(n)',
        code: `function letterCombinations(digits: string): string[] {
  // An empty input has NO combinations -- not one empty combination.
  if (digits.length === 0) return [];

  const keypad: Record<string, string> = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz',
  };

  const result: string[] = [];

  const explore = (index: number, current: string) => {
    // One character chosen per digit means a full-length string is done.
    if (index === digits.length) {
      result.push(current);
      return;
    }

    // Try every letter on this digit's key.
    for (const letter of keypad[digits[index]]) {
      explore(index + 1, current + letter);
    }
  };

  explore(0, '');
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'n-queens',
    statement:
      'Place n queens on an n x n board so no two attack each other. Return all distinct solutions, each as a list of strings where Q is a queen and . is empty.',
    starter: `function solveNQueens(n: number): string[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Place one queen per row, so rows never conflict by construction. For columns and the two diagonal directions, keep sets of occupied lines — the trick is that every cell on a down-right diagonal has a constant row minus column, and every cell on a down-left diagonal has a constant row plus column. That turns the attack check into three constant-time lookups instead of scanning the board.',
        time: 'O(n!)',
        space: 'O(n)',
        code: `function solveNQueens(n: number): string[][] {
  const result: string[][] = [];

  // queenInRow[r] = which column holds row r's queen.
  const queenInRow = new Array<number>(n).fill(-1);

  // Occupied lines. The diagonal keys are the insight here: every cell on a
  // "\\" diagonal shares the same (row - col), and every cell on a "/"
  // diagonal shares the same (row + col).
  const usedColumns = new Set<number>();
  const usedDownRight = new Set<number>();
  const usedDownLeft = new Set<number>();

  const placeRow = (row: number) => {
    // A queen in every row means a complete, valid board.
    if (row === n) {
      result.push(
        queenInRow.map((col) => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)),
      );
      return;
    }

    for (let col = 0; col < n; col++) {
      const downRight = row - col;
      const downLeft = row + col;

      // Three constant-time checks replace scanning the whole board.
      if (usedColumns.has(col) || usedDownRight.has(downRight) || usedDownLeft.has(downLeft)) {
        continue;
      }

      // Choose.
      queenInRow[row] = col;
      usedColumns.add(col);
      usedDownRight.add(downRight);
      usedDownLeft.add(downLeft);

      placeRow(row + 1);

      // Un-choose -- every piece of state added above must come back out.
      usedColumns.delete(col);
      usedDownRight.delete(downRight);
      usedDownLeft.delete(downLeft);
      queenInRow[row] = -1;
    }
  };

  placeRow(0);
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'sudoku-solver',
    statement:
      "Solve a 9x9 Sudoku by filling the empty cells, marked '.', so every row, column and 3x3 box contains the digits 1-9 exactly once.",
    starter: `function solveSudoku(board: string[][]): void {
  // your code here
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Find the next empty cell, try each digit that does not conflict, recurse, and undo if the branch fails. The difference from the other problems here is that the recursion returns a boolean: the moment one complete solution is found, unwind immediately rather than exploring further, because the puzzle has a unique answer.',
        time: 'O(9^(empty cells)) worst case, far less in practice',
        space: 'O(1) beyond recursion',
        code: `function solveSudoku(board: string[][]): void {
  /** Can this digit legally go here? */
  const isValid = (row: number, col: number, digit: string): boolean => {
    // Top-left corner of this cell's 3x3 box.
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 9; i++) {
      // Row and column checks share one loop.
      if (board[row][i] === digit) return false;
      if (board[i][col] === digit) return false;

      // Walk the 3x3 box by turning i into an offset pair.
      if (board[boxRow + Math.floor(i / 3)][boxCol + (i % 3)] === digit) return false;
    }

    return true;
  };

  /** Returns true once the whole board is filled successfully. */
  const solve = (): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== '.') continue;

        for (let digit = 1; digit <= 9; digit++) {
          const candidate = String(digit);
          if (!isValid(row, col, candidate)) continue;

          board[row][col] = candidate;

          // Returning true propagates all the way up and stops the search,
          // which is what makes this different from collecting every answer.
          if (solve()) return true;

          // Dead end: undo and try the next digit.
          board[row][col] = '.';
        }

        // No digit worked here, so an earlier choice was wrong.
        return false;
      }
    }

    // No empty cell left means the board is solved.
    return true;
  };

  solve();
}`,
      },
    ],
  },

  {
    problemId: 'gray-code',
    statement:
      'Return an n-bit Gray code sequence: a permutation of 0 to 2^n - 1 where consecutive values (including the last and first) differ in exactly one bit.',
    starter: `function grayCode(n: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Build it recursively. The n-bit sequence is the (n-1)-bit sequence, followed by the same sequence reversed with the new high bit set. Reflecting is what guarantees the join in the middle changes only one bit.',
        time: 'O(2^n)',
        space: 'O(2^n)',
        code: `function grayCode(n: number): number[] {
  let sequence = [0];

  for (let bit = 0; bit < n; bit++) {
    const highBit = 1 << bit;

    // Mirror the sequence and set the new bit on every mirrored entry. The
    // reflection means the two halves meet at a pair differing only in the
    // bit we just added.
    const mirrored = [...sequence].reverse().map((v) => v | highBit);

    sequence = [...sequence, ...mirrored];
  }

  return sequence;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'There is a closed form: the ith Gray code is i XOR (i >> 1). Each step changes exactly one bit, which falls out of the arithmetic. One line, no recursion, no reflection.',
        time: 'O(2^n)',
        space: 'O(1) beyond the output',
        code: `function grayCode(n: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < (1 << n); i++) {
    // XOR-ing a number with itself shifted right by one flips exactly the
    // bits where adjacent bits differ, which yields a single-bit change
    // between consecutive i.
    result.push(i ^ (i >> 1));
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'valid-palindrome',
    statement:
      'Given a string, determine whether it is a palindrome considering only alphanumeric characters and ignoring case.',
    starter: `function isPalindrome(s: string): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Filter out non-alphanumeric characters, lowercase the rest, and compare with the reverse.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function isPalindrome(s: string): boolean {
  // Keep only letters and digits, folded to lower case.
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const reversed = [...cleaned].reverse().join('');

  return cleaned === reversed;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Two pointers walking inward, skipping non-alphanumeric characters in place. No cleaned copy is built, so it uses constant extra memory.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function isPalindrome(s: string): boolean {
  const isAlphanumeric = (ch: string) => /[a-z0-9]/i.test(ch);

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Skip anything that does not count, from both ends.
    while (left < right && !isAlphanumeric(s[left])) left++;
    while (left < right && !isAlphanumeric(s[right])) right--;

    // Compare case-insensitively.
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;

    left++;
    right--;
  }

  return true;
}`,
      },
    ],
  },

  {
    problemId: 'valid-anagram',
    statement:
      'Given two strings, determine whether one is an anagram of the other.',
    starter: `function isAnagram(s: string, t: string): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Sort both strings and compare. Simple and obviously correct, at the cost of the sort.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function isAnagram(s: string, t: string): boolean {
  // Different lengths can never be anagrams -- cheap early exit.
  if (s.length !== t.length) return false;

  const sortString = (str: string) => [...str].sort().join('');

  return sortString(s) === sortString(t);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Count characters once. Increment for the first string, decrement for the second, and every count must land back on zero. One pass over each, no sorting.',
        time: 'O(n)',
        space: 'O(alphabet size)',
        code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const counts = new Map<string, number>();

  // Up for the first string...
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }

  // ...and down for the second.
  for (const ch of t) {
    const remaining = counts.get(ch);

    // Never seen, or already used up: t has a character s does not.
    if (remaining === undefined || remaining === 0) return false;

    counts.set(ch, remaining - 1);
  }

  // Equal lengths plus every character matched means all counts are zero.
  return true;
}`,
      },
    ],
  },

  {
    problemId: 'k-closest-points-to-origin',
    statement:
      'Given an array of points on a plane and an integer k, return the k closest points to the origin.',
    starter: `function kClosest(points: number[][], k: number): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Sort every point by distance and take the first k. Note you can compare squared distances and skip the square root entirely, since the ordering is identical and the root only costs time.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function kClosest(points: number[][], k: number): number[][] {
  // Squared distance orders points exactly like real distance, so the
  // square root is pure wasted work.
  const squaredDistance = (p: number[]) => p[0] * p[0] + p[1] * p[1];

  return [...points]
    .sort((a, b) => squaredDistance(a) - squaredDistance(b))
    .slice(0, k);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sorting orders all n points when only the k smallest matter. Keep a bounded max-heap of size k: push each point, and once the heap exceeds k, drop the furthest. Each operation costs log k rather than log n.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function kClosest(points: number[][], k: number): number[][] {
  const squaredDistance = (p: number[]) => p[0] * p[0] + p[1] * p[1];

  // A max-heap keyed by distance: the WORST of the current best k sits on
  // top, so it is the one to evict when a closer point arrives.
  const heap: number[][] = [];

  const swap = (i: number, j: number) => {
    [heap[i], heap[j]] = [heap[j], heap[i]];
  };

  const bubbleUp = (index: number) => {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (squaredDistance(heap[parent]) >= squaredDistance(heap[index])) break;
      swap(parent, index);
      index = parent;
    }
  };

  const sinkDown = (index: number) => {
    for (;;) {
      const left = 2 * index + 1;
      const right = left + 1;
      let largest = index;

      if (left < heap.length && squaredDistance(heap[left]) > squaredDistance(heap[largest])) {
        largest = left;
      }
      if (right < heap.length && squaredDistance(heap[right]) > squaredDistance(heap[largest])) {
        largest = right;
      }

      if (largest === index) break;
      swap(index, largest);
      index = largest;
    }
  };

  for (const point of points) {
    heap.push(point);
    bubbleUp(heap.length - 1);

    // Over capacity: remove the furthest, which is the root.
    if (heap.length > k) {
      swap(0, heap.length - 1);
      heap.pop();
      sinkDown(0);
    }
  }

  return heap;
}`,
      },
    ],
  },

  {
    problemId: 'partition-to-k-equal-sum-subsets',
    statement:
      'Given an array and an integer k, determine whether it can be partitioned into k non-empty subsets all having the same sum.',
    starter: `function canPartitionKSubsets(nums: number[], k: number): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Backtracking that only works once it is pruned properly. Reject immediately if the total does not divide by k or any element exceeds the target. Sort descending so large values fail fast. Then fill one bucket at a time, and apply two prunes: skip a value equal to the one just rejected, and abandon the whole branch if a value exactly completes a bucket yet the recursion still fails.',
        time: 'O(k * 2^n) with pruning',
        space: 'O(n)',
        code: `function canPartitionKSubsets(nums: number[], k: number): boolean {
  const total = nums.reduce((sum, v) => sum + v, 0);

  // Cannot split evenly at all.
  if (total % k !== 0) return false;

  const target = total / k;

  // Descending order makes large, hard-to-place values fail early instead
  // of deep in the recursion. This single line is the difference between
  // fast and unusable.
  const sorted = [...nums].sort((a, b) => b - a);

  // Any single value bigger than a bucket makes it impossible.
  if (sorted[0] > target) return false;

  const buckets = new Array<number>(k).fill(0);

  const place = (index: number): boolean => {
    // Every value placed, so all buckets must be exactly full.
    if (index === sorted.length) return true;

    const value = sorted[index];

    for (let b = 0; b < k; b++) {
      if (buckets[b] + value > target) continue;

      buckets[b] += value;
      if (place(index + 1)) return true;
      buckets[b] -= value;

      // Two prunes that matter enormously:
      // 1. An empty bucket that failed means every other empty bucket will
      //    fail identically, so stop trying them.
      // 2. If this value exactly filled a bucket and the rest still failed,
      //    no other arrangement of this value helps either.
      if (buckets[b] === 0 || buckets[b] + value === target) break;
    }

    return false;
  };

  return place(0);
}`,
      },
    ],
  },

  {
    problemId: 'tower-of-hanoi',
    statement:
      'Move n disks from a source peg to a destination peg using an auxiliary peg, never placing a larger disk on a smaller one. Return the sequence of moves.',
    starter: `function towerOfHanoi(n: number, from: string, to: string, via: string): string[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The recursive definition is the solution. To move n disks, move the top n-1 out of the way onto the spare peg, move the largest disk across, then move those n-1 on top of it. The recursion handles all the sub-arrangements, and the move count is 2^n - 1.',
        time: 'O(2^n)',
        space: 'O(n) recursion depth',
        code: `function towerOfHanoi(n: number, from: string, to: string, via: string): string[] {
  const moves: string[] = [];

  const move = (count: number, source: string, destination: string, spare: string) => {
    // No disks left to move.
    if (count === 0) return;

    // 1. Get the smaller stack out of the way, onto the spare peg. Note the
    //    destination and spare swap roles for this sub-problem.
    move(count - 1, source, spare, destination);

    // 2. The largest disk of this sub-problem now moves freely.
    moves.push(source + '->' + destination);

    // 3. Bring the smaller stack back on top of it.
    move(count - 1, spare, destination, source);
  };

  move(n, from, to, via);
  return moves;
}`,
      },
    ],
  },
];
