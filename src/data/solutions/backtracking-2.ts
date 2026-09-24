import type { Solution } from '@/lib/types';

/**
 * Backtracking, part two.
 *
 * More of the same core skill -- explore a choice, recurse, undo -- applied
 * to permutations with a rank shortcut, partitioning into equal groups, and
 * a couple of constructive/combinatorial problems that only look like they
 * need backtracking until a pattern is spotted. Split from backtracking.ts
 * purely to keep each file a readable size.
 */
export const backtracking2Solutions: Solution[] = [
  {
    problemId: 'maximum-depth-of-binary-tree',
    statement: 'Given the root of a binary tree, return its maximum depth: the number of nodes along the longest path from the root down to the farthest leaf.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxDepth(root: TreeNode | null): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Explore every root-to-leaf path explicitly with backtracking, tracking the current path length and updating a running maximum whenever a leaf is reached. It works, but revisiting the idea as a general path search obscures how directly this reduces to a simpler recursive question.',
        time: 'O(n)',
        space: 'O(h) recursion',
        code: `function maxDepth(root: TreeNode | null): number {
  let best = 0;

  const explore = (node: TreeNode | null, depth: number) => {
    if (node === null) return;

    if (node.left === null && node.right === null) {
      best = Math.max(best, depth); // a leaf -- record the path length
      return;
    }

    explore(node.left, depth + 1);
    explore(node.right, depth + 1);
  };

  explore(root, 1);
  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The depth of a tree is just 1 (for the node itself) plus the deeper of its two subtrees’ depths -- a one-line recurrence with no path tracking or running maximum needed at all.',
        time: 'O(n)',
        space: 'O(h) recursion',
        code: `function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      },
    ],
  },
  {
    problemId: 'generate-parentheses-2',
    statement: 'Given n pairs of parentheses, generate all combinations of well-formed parentheses strings.',
    starter: `function generateParenthesis(n: number): string[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every possible string of 2n characters from the alphabet {"(", ")"}, then filter down to the ones that are actually well-formed by scanning each with a simple balance counter. Correct, but the vast majority of the 2^(2n) strings generated are invalid and get thrown away.',
        time: 'O(2^(2n) * n)',
        space: 'O(2^(2n) * n)',
        code: `function generateParenthesis(n: number): string[] {
  const isValid = (s: string): boolean => {
    let balance = 0;
    for (const ch of s) {
      balance += ch === '(' ? 1 : -1;
      if (balance < 0) return false; // more ")" than "(" so far
    }
    return balance === 0;
  };

  const all: string[] = [];
  const build = (current: string) => {
    if (current.length === 2 * n) {
      if (isValid(current)) all.push(current);
      return;
    }
    build(current + '(');
    build(current + ')');
  };

  build('');
  return all;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Backtrack while only ever making moves that COULD lead to a valid string. Track how many open and close brackets have been used: an open bracket can be added whenever fewer than n have been used; a close bracket can be added only when doing so would not outnumber the opens so far. This never even builds an invalid prefix, let alone an invalid full string.',
        time: 'O(4^n / sqrt(n)) -- the nth Catalan number, which is how many valid strings exist',
        space: 'O(n) recursion depth, output not counted',
        code: `function generateParenthesis(n: number): string[] {
  const results: string[] = [];

  const build = (current: string, openCount: number, closeCount: number) => {
    if (current.length === 2 * n) {
      results.push(current);
      return;
    }

    // Add "(" whenever there is still one available to use.
    if (openCount < n) {
      build(current + '(', openCount + 1, closeCount);
    }

    // Add ")" only when it would not exceed the opens placed so far --
    // otherwise the prefix could never become balanced.
    if (closeCount < openCount) {
      build(current + ')', openCount, closeCount + 1);
    }
  };

  build('', 0, 0);
  return results;
}`,
      },
    ],
  },
  {
    problemId: 'permutation-sequence',
    statement:
      'Given n and k, return the kth permutation (1-indexed) of the sequence [1, 2, ..., n] in lexicographic order.',
    starter: `function getPermutation(n: number, k: number): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every permutation of [1..n] with standard backtracking, collect them all, sort lexicographically (they are naturally generated close to that order already, but sorting guarantees it), and index into position k-1. Simple, but the number of permutations is n!, which is only feasible for small n.',
        time: 'O(n! * n)',
        space: 'O(n! * n)',
        code: `function getPermutation(n: number, k: number): string {
  const digits = Array.from({ length: n }, (_, i) => String(i + 1));
  const results: string[] = [];
  const used = new Array<boolean>(n).fill(false);

  const build = (current: string[]) => {
    if (current.length === n) {
      results.push(current.join(''));
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(digits[i]);
      build(current);
      current.pop();
      used[i] = false;
    }
  };

  build([]);
  results.sort();
  return results[k - 1];
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Determine each digit directly using factorials, without generating anything. With n digits remaining, there are (n-1)! permutations for each choice of the first digit -- so the first digit is the one at index floor((k-1) / (n-1)!) among the still-unused digits, and the remaining problem reduces to the same question one size smaller with an updated k. Repeating this n times picks every digit in O(n) total work.",
        time: 'O(n^2) -- removing a used digit from a list is O(n), done n times',
        space: 'O(n)',
        code: `function getPermutation(n: number, k: number): string {
  const factorial = new Array<number>(n + 1).fill(1);
  for (let i = 1; i <= n; i++) factorial[i] = factorial[i - 1] * i;

  const digits = Array.from({ length: n }, (_, i) => String(i + 1));
  let remainingK = k - 1; // switch to 0-indexed, which matches array indices
  let result = '';

  for (let position = n; position >= 1; position--) {
    // Each choice of the next digit "uses up" (position - 1)! permutations.
    const block = factorial[position - 1];
    const index = Math.floor(remainingK / block);

    result += digits[index];
    digits.splice(index, 1); // that digit is used; remove it from the pool
    remainingK %= block; // narrow k to within the chosen block
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'number-of-squareful-arrays',
    statement:
      'An array is squareful if the sum of every pair of adjacent elements is a perfect square. Given an array of integers (which may contain duplicates), count the number of distinct permutations that are squareful.',
    starter: `function numSquarefulPerms(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every permutation of the array (skipping ones identical to an already-seen arrangement via a Set of stringified results), and check each one fully for the squareful property. Duplicates in the input mean many generated permutations are literally the same sequence, and they still all get built before being deduplicated.',
        time: 'O(n! * n)',
        space: 'O(n! * n)',
        code: `function numSquarefulPerms(nums: number[]): number {
  const isSquare = (x: number): boolean => {
    const root = Math.round(Math.sqrt(x));
    return root * root === x;
  };

  const seen = new Set<string>();
  const used = new Array<boolean>(nums.length).fill(false);
  let count = 0;

  const build = (current: number[]) => {
    if (current.length === nums.length) {
      let ok = true;
      for (let i = 0; i + 1 < current.length; i++) {
        if (!isSquare(current[i] + current[i + 1])) { ok = false; break; }
      }
      const key = current.join(',');
      if (ok && !seen.has(key)) {
        seen.add(key);
        count++;
      }
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      build(current);
      current.pop();
      used[i] = false;
    }
  };

  build([]);
  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sort first so identical values sit together, then prune duplicate branches at the source: at any recursion level, never place the same value in the same slot twice (skip a candidate if an identical, not-yet-used value was already tried at this level). Layer on the squareful check as an early constraint -- only try placing a number next if it actually forms a perfect square with the number just placed -- so invalid branches die immediately instead of being discovered only at the end.',
        time: 'O(n! ) in the worst case, but pruned heavily by both the duplicate skip and the square check',
        space: 'O(n)',
        code: `function numSquarefulPerms(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = sorted.length;
  const used = new Array<boolean>(n).fill(false);
  let count = 0;

  const isSquare = (x: number): boolean => {
    const root = Math.round(Math.sqrt(x));
    return root * root === x;
  };

  const build = (current: number[]) => {
    if (current.length === n) {
      count++;
      return;
    }

    for (let i = 0; i < n; i++) {
      if (used[i]) continue;

      // Skip a duplicate value tried in this same slot already -- with
      // sorted input, that means the previous identical value is unused.
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;

      // Prune immediately if this choice would not form a perfect square
      // with whatever was placed right before it.
      if (current.length > 0 && !isSquare(current[current.length - 1] + sorted[i])) continue;

      used[i] = true;
      current.push(sorted[i]);
      build(current);
      current.pop();
      used[i] = false;
    }
  };

  build([]);
  return count;
}`,
      },
    ],
  },
  {
    problemId: 'matchsticks-to-square',
    statement:
      'Given an array of matchstick lengths, determine whether all of them can be used exactly once to form a square (each matchstick contributes to exactly one side, with no bending or breaking).',
    starter: `function makesquare(matchsticks: number[]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try assigning each matchstick, one at a time, to any of the 4 sides, backtracking whenever a side’s running total exceeds the target side length. This is correct but explores sides in a fixed order and re-derives the same failing combinations repeatedly, since it has no way to skip equivalent states.',
        time: 'O(4^n)',
        space: 'O(n)',
        code: `function makesquare(matchsticks: number[]): boolean {
  const total = matchsticks.reduce((sum, x) => sum + x, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;

  const sides = [0, 0, 0, 0];

  const assign = (index: number): boolean => {
    if (index === matchsticks.length) {
      return sides.every((s) => s === side);
    }

    for (let s = 0; s < 4; s++) {
      if (sides[s] + matchsticks[index] > side) continue;

      sides[s] += matchsticks[index];
      if (assign(index + 1)) return true;
      sides[s] -= matchsticks[index];
    }

    return false;
  };

  return assign(0);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Two pruning ideas on top of the same backtracking shape make a large difference in practice. First, sort matchsticks largest first, so a stick that cannot possibly fit anywhere is discovered as early as possible instead of after trying many smaller sticks. Second, skip a side if it currently has the exact same running total as a side just tried and rejected -- trying the same stick on two sides with identical totals can never produce a different outcome, so that branch is redundant.',
        time: 'O(4^n) worst case, but with substantially smaller constants from pruning',
        space: 'O(n)',
        code: `function makesquare(matchsticks: number[]): boolean {
  const total = matchsticks.reduce((sum, x) => sum + x, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;

  // Largest first: a stick too big for any side is caught immediately.
  const sorted = [...matchsticks].sort((a, b) => b - a);
  if (sorted[0] > side) return false;

  const sides = [0, 0, 0, 0];

  const assign = (index: number): boolean => {
    if (index === sorted.length) return true; // all sticks placed within limits

    const stick = sorted[index];
    const triedTotals = new Set<number>();

    for (let s = 0; s < 4; s++) {
      if (sides[s] + stick > side) continue;

      // Skip a side whose current total we already tried and failed with
      // at this same recursion level -- it would fail identically again.
      if (triedTotals.has(sides[s])) continue;
      triedTotals.add(sides[s]);

      sides[s] += stick;
      if (assign(index + 1)) return true;
      sides[s] -= stick;
    }

    return false;
  };

  return assign(0);
}`,
      },
    ],
  },
  {
    problemId: 'closest-dessert-cost',
    statement:
      'You must buy exactly one base ice cream from baseCosts, then may add any number of toppings from toppingCosts, each topping used 0, 1, or 2 times. Given a target cost, return the closest achievable total cost to target; on a tie, return the smaller cost.',
    starter: `function closestCost(baseCosts: number[], toppingCosts: number[], target: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For each base flavour, backtrack over every topping deciding to use it 0, 1, or 2 times, tracking the running cost and comparing every resulting total against the closest found so far. This tries every combination directly -- correct, and with at most 10 toppings and 3 choices each it is fine in practice, but it is still exponential in the number of toppings.',
        time: 'O(bases * 3^toppings)',
        space: 'O(toppings) recursion depth',
        code: `function closestCost(baseCosts: number[], toppingCosts: number[], target: number): number {
  let best = Infinity;

  const consider = (cost: number) => {
    const currentDiff = Math.abs(cost - target);
    const bestDiff = Math.abs(best - target);
    // Strictly closer wins; an exact tie prefers the smaller cost.
    if (currentDiff < bestDiff || (currentDiff === bestDiff && cost < best)) {
      best = cost;
    }
  };

  const explore = (index: number, cost: number) => {
    if (index === toppingCosts.length) {
      consider(cost);
      return;
    }

    for (let count = 0; count <= 2; count++) {
      explore(index + 1, cost + count * toppingCosts[index]);
    }
  };

  for (const base of baseCosts) {
    explore(0, base);
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Prune branches that cannot possibly help. As soon as the running cost reaches or passes the target, adding more toppings can only move it further away, so stop descending that branch and just record the total reached so far -- there is no need to also try every remaining topping combination on top of an already-too-expensive total. Sorting toppings does not change the asymptotics here, but stopping the recursion the moment cost >= target trims the search tree substantially in practice.',
        time: 'O(bases * 2 * 3^toppings) worst case, materially smaller in practice from the early cutoff',
        space: 'O(toppings) recursion depth',
        code: `function closestCost(baseCosts: number[], toppingCosts: number[], target: number): number {
  let best = Infinity;

  const consider = (cost: number) => {
    const currentDiff = Math.abs(cost - target);
    const bestDiff = Math.abs(best - target);
    if (currentDiff < bestDiff || (currentDiff === bestDiff && cost < best)) {
      best = cost;
    }
  };

  const explore = (index: number, cost: number) => {
    consider(cost); // every partial total is itself a valid final total

    // Once cost has reached the target, every topping added from here
    // only moves further away -- nothing more to gain by continuing.
    if (cost >= target || index === toppingCosts.length) return;

    explore(index + 1, cost); // skip this topping
    explore(index + 1, cost + toppingCosts[index]); // use it once
    explore(index + 1, cost + 2 * toppingCosts[index]); // use it twice
  };

  for (const base of baseCosts) {
    explore(0, base);
  }

  return best;
}`,
      },
    ],
  },
  {
    problemId: 'construct-the-lexicographically-largest-valid-sequence',
    statement:
      'Given n, construct a sequence of length 2n - 1 that contains the number 1 exactly once and every number from 2 to n exactly twice, such that for every number i from 2 to n, the distance between its two occurrences is exactly i. Return the lexicographically largest such sequence.',
    starter: `function constructDistancedSequence(n: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Fill the sequence left to right; at each empty position, try the LARGEST still-available number first (this greedily biases toward the lexicographically largest answer), place it (and its required second occurrence, if the number is not 1 and the second slot is free and empty), recurse, and undo on failure. Trying largest-first means the first complete sequence found is guaranteed to be the answer, but a naive version still leaves a good deal of redundant exploration through positions that are already determined by an earlier placement.',
        time: 'Exponential in n in the worst case',
        space: 'O(n)',
        code: `function constructDistancedSequence(n: number): number[] {
  const length = 2 * n - 1;
  const sequence = new Array<number>(length).fill(0);
  const used = new Array<boolean>(n + 1).fill(false);

  const build = (position: number): boolean => {
    if (position === length) return true;
    if (sequence[position] !== 0) return build(position + 1); // already placed

    // Try the largest available number first for lexicographic maximality.
    for (let value = n; value >= 1; value--) {
      if (used[value]) continue;

      if (value === 1) {
        sequence[position] = 1;
        used[1] = true;
        if (build(position + 1)) return true;
        sequence[position] = 0;
        used[1] = false;
        continue;
      }

      const secondPosition = position + value;
      if (secondPosition >= length || sequence[secondPosition] !== 0) continue;

      sequence[position] = value;
      sequence[secondPosition] = value;
      used[value] = true;

      if (build(position + 1)) return true;

      sequence[position] = 0;
      sequence[secondPosition] = 0;
      used[value] = false;
    }

    return false;
  };

  build(0);
  return sequence;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The same greedy-largest-first backtracking, with one addition that matters in practice: always fill the FIRST still-empty position rather than scanning forward from the start each time. Once a position is filled (either directly, or as the forced second occurrence of an earlier number), it is never revisited, and the search always makes progress on the leftmost gap -- which is exactly what lexicographic maximality requires, since an earlier position dominates every later one in the comparison.',
        time: 'Exponential in the worst case, but explores far fewer dead branches thanks to always advancing the leftmost gap',
        space: 'O(n)',
        code: `function constructDistancedSequence(n: number): number[] {
  const length = 2 * n - 1;
  const sequence = new Array<number>(length).fill(0);
  const used = new Array<boolean>(n + 1).fill(false);

  // Find the first empty slot from "from" onward.
  const nextEmpty = (from: number): number => {
    let i = from;
    while (i < length && sequence[i] !== 0) i++;
    return i;
  };

  const build = (from: number): boolean => {
    const position = nextEmpty(from);
    if (position === length) return true; // every slot filled

    for (let value = n; value >= 1; value--) {
      if (used[value]) continue;

      if (value === 1) {
        sequence[position] = 1;
        used[1] = true;
        if (build(position)) return true;
        sequence[position] = 0;
        used[1] = false;
        continue;
      }

      const secondPosition = position + value;
      if (secondPosition >= length || sequence[secondPosition] !== 0) continue;

      sequence[position] = value;
      sequence[secondPosition] = value;
      used[value] = true;

      if (build(position)) return true;

      sequence[position] = 0;
      sequence[secondPosition] = 0;
      used[value] = false;
    }

    return false;
  };

  build(0);
  return sequence;
}`,
      },
    ],
  },
  {
    problemId: 'modular-expression',
    statement: 'Given three integers A, B and C, compute (A^B) mod C.',
    starter: `function modularExpression(a: number, b: number, c: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Multiply A into a running result B times, taking the modulus after every multiplication to keep the numbers small. This is the literal definition of exponentiation, and it works, but the number of multiplications grows linearly with the exponent B, which can be very large.',
        time: 'O(B)',
        space: 'O(1)',
        code: `function modularExpression(a: number, b: number, c: number): number {
  let result = 1;
  let base = a % c;

  for (let i = 0; i < b; i++) {
    result = (result * base) % c;
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Binary (fast) exponentiation, which is really just backtracking on the bits of the exponent: A^B can be built by repeatedly squaring A while walking through the bits of B, multiplying the running result by the current squared value only when that bit is 1. This is the standard "divide the exponent in half each step" trick, turning a linear number of multiplications into a logarithmic one.',
        time: 'O(log B)',
        space: 'O(1)',
        code: `function modularExpression(a: number, b: number, c: number): number {
  let result = 1;
  let base = a % c;
  let exponent = b;

  while (exponent > 0) {
    // If the current lowest bit of the exponent is 1, fold this power
    // of the base into the result.
    if (exponent & 1) {
      result = (result * base) % c;
    }

    // Square the base for the next bit position, and shift the exponent
    // down to look at that next bit.
    base = (base * base) % c;
    exponent = Math.floor(exponent / 2);
  }

  return result;
}`,
      },
    ],
  },
];
