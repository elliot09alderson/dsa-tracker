import type { Solution } from '@/lib/types';

/**
 * Dynamic programming.
 *
 * Every one of these follows the same three steps: name what the state means,
 * write the recurrence that relates a state to smaller ones, then decide
 * whether to fill it top-down with memoisation or bottom-up with a table. The
 * space optimisation at the end is almost always "the recurrence only looks
 * back one or two rows, so keep only those".
 */
export const dpSolutions: Solution[] = [
  {
    problemId: 'fibonacci-number',
    statement:
      'Return the nth Fibonacci number, where F(0) = 0, F(1) = 1 and F(n) = F(n-1) + F(n-2).',
    starter: `function fib(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Translate the definition directly into recursion. It is exponential because the same subproblems are recomputed over and over — F(5) computes F(3) twice, F(2) three times, and it gets worse fast.',
        time: 'O(2^n)',
        space: 'O(n) call stack',
        code: `function fib(n: number): number {
  // Base cases end the recursion.
  if (n <= 1) return n;

  // Each call spawns two more, and the two subtrees overlap heavily --
  // that overlap is exactly what memoisation removes.
  return fib(n - 1) + fib(n - 2);
}`,
      },
      {
        name: 'Better',
        idea:
          'Same recursion, but cache each result the first time it is computed. Every value of n is now solved once, turning the exponential tree into a linear walk. This is top-down DP.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function fib(n: number): number {
  // Maps n to its already-computed answer.
  const memo = new Map<number, number>();

  const solve = (k: number): number => {
    if (k <= 1) return k;

    // Seen before: return it instead of recomputing the whole subtree.
    const cached = memo.get(k);
    if (cached !== undefined) return cached;

    const result = solve(k - 1) + solve(k - 2);
    memo.set(k, result);
    return result;
  };

  return solve(n);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The recurrence only ever looks back two steps, so the whole table is unnecessary — two variables suffice. Iterate upward, shifting the pair along. No recursion, no allocation, constant memory.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function fib(n: number): number {
  if (n <= 1) return n;

  // previous = F(k-2), current = F(k-1) as we walk k upward.
  let previous = 0;
  let current = 1;

  for (let k = 2; k <= n; k++) {
    const next = previous + current;

    // Shift the window one step forward.
    previous = current;
    current = next;
  }

  return current;
}`,
      },
    ],
  },

  {
    problemId: 'climbing-stairs',
    statement:
      'You are climbing a staircase of n steps and can take either 1 or 2 steps at a time. How many distinct ways are there to reach the top?',
    starter: `function climbStairs(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'From any step you either take one step or two, so the ways to reach the top from here is the sum of the ways from the next two positions. Recursing directly recomputes the same positions exponentially often.',
        time: 'O(2^n)',
        space: 'O(n)',
        code: `function climbStairs(n: number): number {
  // Reached the top exactly: that is one complete way.
  if (n === 0) return 1;

  // Overshot the top: this path was not valid.
  if (n < 0) return 0;

  return climbStairs(n - 1) + climbStairs(n - 2);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'This is Fibonacci wearing a different hat: ways(n) = ways(n-1) + ways(n-2), because the last move was either a single step or a double. Only the last two values matter, so two variables do the job.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function climbStairs(n: number): number {
  if (n <= 2) return n;

  // oneBack = ways to reach the previous step,
  // twoBack = ways to reach the one before that.
  let twoBack = 1; // ways to reach step 1
  let oneBack = 2; // ways to reach step 2

  for (let step = 3; step <= n; step++) {
    // Arrive here either with a single step from oneBack, or a double
    // step from twoBack.
    const ways = oneBack + twoBack;

    twoBack = oneBack;
    oneBack = ways;
  }

  return oneBack;
}`,
      },
    ],
  },

  {
    problemId: 'house-robber',
    statement:
      'Given an array of house values, return the maximum you can rob without ever robbing two adjacent houses.',
    starter: `function rob(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'At each house the choice is binary: take it and skip the neighbour, or skip it and keep whatever the neighbour allowed. Fill a table where each entry is the best total achievable up to that house.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  // best[i] = most that can be robbed from houses 0..i.
  const best = new Array<number>(nums.length).fill(0);
  best[0] = nums[0];
  best[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    // Rob this house (so add best from two back), or skip it (keep the
    // running best from one back). Whichever is larger.
    best[i] = Math.max(best[i - 1], best[i - 2] + nums[i]);
  }

  return best[nums.length - 1];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The recurrence reads only the two previous entries, so keep those two in variables and drop the array entirely.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function rob(nums: number[]): number {
  // twoBack = best up to the house before last, oneBack = best up to last.
  let twoBack = 0;
  let oneBack = 0;

  for (const value of nums) {
    // Either skip this house (oneBack stands) or rob it and add to the
    // total from two houses back, which is the last non-adjacent option.
    const current = Math.max(oneBack, twoBack + value);

    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}`,
      },
    ],
  },

  {
    problemId: 'coin-change',
    statement:
      'Given coin denominations and a target amount, return the fewest coins needed to make that amount, or -1 if it cannot be made. You have an unlimited supply of each coin.',
    starter: `function coinChange(coins: number[], amount: number): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every coin at every step and recurse on the remainder, taking the minimum. Exponential, because the same remaining amounts are reached by many different coin orders.',
        time: 'O(amount^coins)',
        space: 'O(amount) recursion depth',
        code: `function coinChange(coins: number[], amount: number): number {
  const solve = (remaining: number): number => {
    // Made it exactly: zero further coins needed.
    if (remaining === 0) return 0;

    // Overshot: this branch cannot produce a valid answer.
    if (remaining < 0) return Infinity;

    let fewest = Infinity;
    for (const coin of coins) {
      // Using this coin costs 1, plus whatever the remainder needs.
      fewest = Math.min(fewest, 1 + solve(remaining - coin));
    }

    return fewest;
  };

  const result = solve(amount);
  return result === Infinity ? -1 : result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Bottom-up over the amounts. For every amount from 1 up to the target, the answer is one coin plus the best answer for the amount left after using that coin — minimised over the coins. Because every smaller amount is already solved, each entry is computed once. Infinity marks unreachable amounts so they never pollute a minimum.',
        time: 'O(amount * coins)',
        space: 'O(amount)',
        code: `function coinChange(coins: number[], amount: number): number {
  // fewest[a] = minimum coins to make amount a. Infinity means "not yet
  // reachable", which keeps it out of any Math.min comparison.
  const fewest = new Array<number>(amount + 1).fill(Infinity);

  // Zero requires no coins -- this is the base the rest builds on.
  fewest[0] = 0;

  for (let target = 1; target <= amount; target++) {
    for (const coin of coins) {
      // A coin larger than the target cannot be used here.
      if (coin > target) continue;

      // Unreachable remainder: adding a coin to it is still unreachable.
      if (fewest[target - coin] === Infinity) continue;

      fewest[target] = Math.min(fewest[target], fewest[target - coin] + 1);
    }
  }

  return fewest[amount] === Infinity ? -1 : fewest[amount];
}`,
      },
    ],
  },

  {
    problemId: 'jump-game',
    statement:
      'Given an array where each value is the maximum jump length from that position, determine whether you can reach the last index starting from the first.',
    starter: `function canJump(nums: number[]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'Work backwards. Track the leftmost index from which the end is reachable. Walking right to left, a position qualifies if its jump reaches that marker, and if so it becomes the new marker.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function canJump(nums: number[]): boolean {
  // The leftmost index known to reach the end. Starts as the end itself.
  let target = nums.length - 1;

  for (let i = nums.length - 2; i >= 0; i--) {
    // Can this position jump far enough to land on (or past) the target?
    if (i + nums[i] >= target) {
      target = i; // it becomes the new thing to reach
    }
  }

  // Success means the marker walked all the way back to the start.
  return target === 0;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A single forward pass tracking the furthest index reachable so far. If you ever stand on an index beyond that reach, you are stuck and the answer is no. Otherwise extend the reach. This is really a greedy argument rather than DP, and it is why the problem is easier than it looks.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function canJump(nums: number[]): boolean {
  // The furthest index reachable using everything seen so far.
  let reach = 0;

  for (let i = 0; i < nums.length; i++) {
    // Standing beyond the furthest reachable point means there is a gap
    // no earlier jump could clear.
    if (i > reach) return false;

    reach = Math.max(reach, i + nums[i]);

    // Early exit once the end is within range.
    if (reach >= nums.length - 1) return true;
  }

  return true;
}`,
      },
    ],
  },

  {
    problemId: 'longest-increasing-subsequence',
    statement:
      'Given an integer array, return the length of the longest strictly increasing subsequence. The elements need not be contiguous.',
    starter: `function lengthOfLIS(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'Let each entry hold the length of the longest increasing subsequence ending exactly at that index. For each position, look back at every earlier smaller value and extend the best one found.',
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function lengthOfLIS(nums: number[]): number {
  if (nums.length === 0) return 0;

  // longest[i] = length of the best increasing subsequence ENDING at i.
  // Every element is a subsequence of length 1 on its own.
  const longest = new Array<number>(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      // nums[i] can extend any subsequence ending in a smaller value.
      if (nums[j] < nums[i]) {
        longest[i] = Math.max(longest[i], longest[j] + 1);
      }
    }
  }

  // The answer can end anywhere, so take the best over all endings.
  return Math.max(...longest);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Patience sorting. Keep an array where position i holds the smallest possible value that can end an increasing subsequence of length i+1. For each number, binary search for the first entry that is not smaller and overwrite it — that keeps every ending as small as possible, leaving the most room to grow. The array length is the answer. Note it is not itself a valid subsequence, only the right length.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function lengthOfLIS(nums: number[]): number {
  // tails[i] = the SMALLEST value that can end an increasing subsequence of
  // length i + 1. Keeping these minimal is what leaves maximum room to
  // extend later. tails is always sorted, which is what allows the search.
  const tails: number[] = [];

  for (const value of nums) {
    // Find the first tail that is >= value.
    let low = 0;
    let high = tails.length;

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (tails[mid] < value) low = mid + 1;
      else high = mid;
    }

    if (low === tails.length) {
      // Bigger than every tail: it extends the longest run found so far.
      tails.push(value);
    } else {
      // Replace the first tail it can beat, lowering that ending value.
      // The length does not change -- the potential does.
      tails[low] = value;
    }
  }

  return tails.length;
}`,
      },
    ],
  },

  {
    problemId: 'maximum-product-subarray',
    statement:
      'Given an integer array, find the contiguous subarray with the largest product and return that product.',
    starter: `function maxProduct(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Compute the product of every subarray by extending each start index rightward.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function maxProduct(nums: number[]): number {
  let best = -Infinity;

  for (let start = 0; start < nums.length; start++) {
    let product = 1;
    for (let end = start; end < nums.length; end++) {
      product *= nums[end];
      best = Math.max(best, product);
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Kadane's, with a twist that makes this problem interesting: a negative number flips the ordering, so the smallest product so far can suddenly become the largest. So track both the running maximum and the running minimum, and swap them when the current value is negative.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxProduct(nums: number[]): number {
  let best = nums[0];

  // Largest and smallest products of a subarray ending at the current index.
  // The minimum matters because multiplying it by a negative can produce the
  // new maximum -- that is the whole difference from the sum version.
  let maxHere = nums[0];
  let minHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const value = nums[i];

    // A negative value swaps the roles: the most negative running product
    // becomes the most positive one.
    if (value < 0) {
      [maxHere, minHere] = [minHere, maxHere];
    }

    // Either extend the previous run, or start fresh at this value.
    maxHere = Math.max(value, maxHere * value);
    minHere = Math.min(value, minHere * value);

    best = Math.max(best, maxHere);
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'longest-common-subsequence',
    statement:
      'Given two strings, return the length of their longest common subsequence — characters appearing in both in the same relative order, not necessarily contiguous.',
    starter: `function longestCommonSubsequence(text1: string, text2: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'A classic two-dimensional table. Each cell answers: how long is the LCS of the first i characters of one string and the first j of the other? Matching characters extend the diagonal by one; otherwise take the better of dropping one character from either string.',
        time: 'O(m*n)',
        space: 'O(m*n)',
        code: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;

  // lcs[i][j] = LCS length of text1[0..i-1] and text2[0..j-1].
  // Row and column 0 mean "one string is empty", so they stay 0.
  const lcs = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        // Both strings end in the same character, so it must be in the LCS.
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        // Drop the last character of one string or the other, keep the best.
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  return lcs[m][n];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Each row reads only the row above it, so two rows are enough. The one value that needs care is the diagonal, which is the previous row at the previous column — save it before overwriting.',
        time: 'O(m*n)',
        space: 'O(min(m, n))',
        code: `function longestCommonSubsequence(text1: string, text2: string): number {
  // Iterate with the shorter string across, so the rows stay small.
  const [shorter, longer] = text1.length <= text2.length ? [text1, text2] : [text2, text1];

  let previousRow = new Array<number>(shorter.length + 1).fill(0);

  for (const longChar of longer) {
    const currentRow = new Array<number>(shorter.length + 1).fill(0);

    for (let j = 1; j <= shorter.length; j++) {
      if (longChar === shorter[j - 1]) {
        // The diagonal is the previous row at the previous column.
        currentRow[j] = previousRow[j - 1] + 1;
      } else {
        currentRow[j] = Math.max(previousRow[j], currentRow[j - 1]);
      }
    }

    previousRow = currentRow;
  }

  return previousRow[shorter.length];
}`,
      },
    ],
  },

  {
    problemId: 'edit-distance',
    statement:
      'Given two strings, return the minimum number of single-character insertions, deletions or replacements needed to turn the first into the second.',
    starter: `function minDistance(word1: string, word2: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Levenshtein distance. Each cell is the cheapest way to turn a prefix of one word into a prefix of the other. If the last characters match, nothing new is needed and the cost is the diagonal. Otherwise take the cheapest of the three edits: delete (from above), insert (from the left), or replace (diagonal), plus one. The first row and column are the base cases — turning a prefix into the empty string costs one deletion per character.',
        time: 'O(m*n)',
        space: 'O(m*n)',
        code: `function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  // cost[i][j] = edits to turn word1[0..i-1] into word2[0..j-1].
  const cost = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  // Base cases: turning a prefix into an empty string means deleting every
  // character, and building a prefix from nothing means inserting each one.
  for (let i = 0; i <= m; i++) cost[i][0] = i;
  for (let j = 0; j <= n; j++) cost[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // Characters already agree -- no edit needed at this position.
        cost[i][j] = cost[i - 1][j - 1];
        continue;
      }

      cost[i][j] =
        1 +
        Math.min(
          cost[i - 1][j],     // delete from word1
          cost[i][j - 1],     // insert into word1
          cost[i - 1][j - 1], // replace one character
        );
    }
  }

  return cost[m][n];
}`,
      },
    ],
  },

  {
    problemId: 'word-break',
    statement:
      'Given a string and a dictionary of words, determine whether the string can be segmented into a sequence of one or more dictionary words. Words may be reused.',
    starter: `function wordBreak(s: string, wordDict: string[]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Let each entry answer: can the prefix of this length be segmented? A prefix works if some earlier breakable point leaves a dictionary word behind. Scanning all earlier split points for each position gives a clean quadratic solution, and a Set makes the dictionary check constant time.',
        time: 'O(n^2 * word length)',
        space: 'O(n)',
        code: `function wordBreak(s: string, wordDict: string[]): boolean {
  // A Set turns "is this a word" into a constant-time check.
  const words = new Set(wordDict);

  // breakable[i] = can s[0..i-1] be segmented entirely into words?
  const breakable = new Array<boolean>(s.length + 1).fill(false);

  // The empty prefix is trivially segmentable -- this seeds everything else.
  breakable[0] = true;

  for (let end = 1; end <= s.length; end++) {
    for (let start = 0; start < end; start++) {
      // Only worth checking if everything before "start" already works.
      if (!breakable[start]) continue;

      if (words.has(s.slice(start, end))) {
        breakable[end] = true;
        break; // one valid split is enough
      }
    }
  }

  return breakable[s.length];
}`,
      },
    ],
  },

  {
    problemId: 'partition-equal-subset-sum',
    statement:
      'Given an array of positive integers, determine whether it can be split into two subsets with equal sums.',
    starter: `function canPartition(nums: number[]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'If the total is odd it is immediately impossible. Otherwise the question reduces to a subset-sum problem: can some subset reach exactly half the total? Track which sums are achievable with a boolean array, iterating the sums downward so each number is used at most once — iterating upward would let a number be reused, which is the 0/1 versus unbounded knapsack distinction.',
        time: 'O(n * total/2)',
        space: 'O(total/2)',
        code: `function canPartition(nums: number[]): boolean {
  const total = nums.reduce((sum, v) => sum + v, 0);

  // An odd total cannot split into two equal halves.
  if (total % 2 !== 0) return false;

  const target = total / 2;

  // reachable[s] = can some subset sum to exactly s?
  const reachable = new Array<boolean>(target + 1).fill(false);
  reachable[0] = true; // the empty subset sums to zero

  for (const value of nums) {
    // Iterate DOWNWARD. Going upward would let this same value be added
    // twice within one pass, which would solve the wrong problem.
    for (let sum = target; sum >= value; sum--) {
      if (reachable[sum - value]) {
        reachable[sum] = true;
      }
    }
  }

  return reachable[target];
}`,
      },
    ],
  },

  {
    problemId: 'perfect-squares',
    statement:
      'Given an integer n, return the fewest perfect squares that sum to n.',
    starter: `function numSquares(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The same shape as coin change, where the coins are the perfect squares up to n. For each value, try subtracting each square and take the best result plus one. The inner loop stops as soon as the square exceeds the current value.',
        time: 'O(n * sqrt(n))',
        space: 'O(n)',
        code: `function numSquares(n: number): number {
  // fewest[v] = minimum number of perfect squares summing to v.
  const fewest = new Array<number>(n + 1).fill(Infinity);
  fewest[0] = 0; // zero needs no squares

  for (let value = 1; value <= n; value++) {
    // Try every square that fits, which is why this is sqrt(n) per value.
    for (let root = 1; root * root <= value; root++) {
      const square = root * root;
      fewest[value] = Math.min(fewest[value], fewest[value - square] + 1);
    }
  }

  return fewest[n];
}`,
      },
    ],
  },

  {
    problemId: 'coin-change-ii',
    statement:
      'Given coin denominations and a target amount, return the number of distinct combinations that make up that amount. Order does not matter.',
    starter: `function change(amount: number, coins: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Count combinations, not permutations — and the loop order is what decides which you get. Putting coins in the OUTER loop means each coin is fully considered before the next one, so {1,2} and {2,1} are never counted separately. Swapping the loops would count orderings instead, which is a different problem entirely. This is the single most important detail here.',
        time: 'O(amount * coins)',
        space: 'O(amount)',
        code: `function change(amount: number, coins: number[]): number {
  // ways[a] = number of combinations summing to a.
  const ways = new Array<number>(amount + 1).fill(0);

  // There is exactly one way to make zero: use nothing.
  ways[0] = 1;

  // Coins OUTER. This fixes a coin order, so each combination is counted
  // once. If the loops were swapped, [1,2] and [2,1] would both be counted
  // and you would be solving the permutations problem instead.
  for (const coin of coins) {
    // Ascending, because a coin may be used any number of times.
    for (let target = coin; target <= amount; target++) {
      ways[target] += ways[target - coin];
    }
  }

  return ways[amount];
}`,
      },
    ],
  },

  {
    problemId: 'longest-palindromic-subsequence',
    statement:
      'Given a string, return the length of its longest palindromic subsequence.',
    starter: `function longestPalindromeSubseq(s: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'A palindrome reads the same forwards and backwards, so the longest palindromic subsequence of a string is exactly the longest common subsequence of the string and its reverse. That turns this into a problem already solved.',
        time: 'O(n^2)',
        space: 'O(n^2)',
        code: `function longestPalindromeSubseq(s: string): number {
  const reversed = [...s].reverse().join('');
  const n = s.length;

  const lcs = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === reversed[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  return lcs[n][n];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Solve it directly on intervals. Each cell answers: how long is the longest palindromic subsequence within this substring? Matching ends contribute two plus the inside; otherwise drop one end or the other. The loops must run so that shorter intervals are solved before longer ones, which is why the outer loop goes backwards.',
        time: 'O(n^2)',
        space: 'O(n^2)',
        code: `function longestPalindromeSubseq(s: string): number {
  const n = s.length;

  // best[i][j] = longest palindromic subsequence within s[i..j].
  const best = Array.from({ length: n }, () => new Array<number>(n).fill(0));

  // A single character is a palindrome of length 1.
  for (let i = 0; i < n; i++) best[i][i] = 1;

  // "i" descends so that best[i + 1][...] -- a shorter interval -- is
  // already computed by the time we need it.
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        // Both ends match, so they wrap whatever is best inside.
        best[i][j] = best[i + 1][j - 1] + 2;
      } else {
        // Drop one end or the other.
        best[i][j] = Math.max(best[i + 1][j], best[i][j - 1]);
      }
    }
  }

  return best[0][n - 1];
}`,
      },
    ],
  },
];
