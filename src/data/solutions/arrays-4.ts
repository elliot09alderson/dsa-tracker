import type { Solution } from '@/lib/types';

/**
 * Arrays, part four.
 *
 * The remaining, harder problems from the sheet: a mix of number theory
 * (nth magical number, digit DP, Catalan numbers), matrix DP (Kingdom War,
 * 2D range sums), and combinatorial counting (City Tour, permutation rank,
 * divisible triplets). Split from arrays.ts / arrays-2.ts / arrays-3.ts
 * purely to keep each file a readable size.
 */
export const arrays4Solutions: Solution[] = [
  {
    problemId: 'bulb-switcher',
    statement:
      'There are n light bulbs, all initially off, numbered 1 to n. On round i (1 <= i <= n), toggle every bulb whose number is a multiple of i. After all n rounds, return how many bulbs are on.',
    starter: `function bulbSwitch(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Simulate exactly what is described: an array of n bulbs, and for each round toggle every multiple of that round number. Correct by definition, but round i alone touches n/i bulbs, and summing that over every round is quadratic.',
        time: 'O(n log n) -- the harmonic sum of n/i over i = 1..n',
        space: 'O(n)',
        code: `function bulbSwitch(n: number): number {
  const isOn = new Array<boolean>(n + 1).fill(false);

  for (let round = 1; round <= n; round++) {
    for (let bulb = round; bulb <= n; bulb += round) {
      isOn[bulb] = !isOn[bulb];
    }
  }

  let onCount = 0;
  for (let bulb = 1; bulb <= n; bulb++) {
    if (isOn[bulb]) onCount++;
  }

  return onCount;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Bulb k is toggled once for every divisor it has (round i touches bulb k exactly when i divides k), so it ends up ON only if it has an ODD number of divisors. Divisors normally pair up as (d, k/d), which is even -- UNLESS k is a perfect square, where one divisor pairs with itself (sqrt(k)). So the bulbs left on are exactly the perfect squares from 1 to n, and there are floor(sqrt(n)) of those.',
        time: 'O(1)',
        space: 'O(1)',
        code: `function bulbSwitch(n: number): number {
  // Only perfect squares end up with an odd divisor count, so only
  // perfect-square-numbered bulbs are on. Count how many of those exist.
  return Math.floor(Math.sqrt(n));
}`,
      },
    ],
  },
  {
    problemId: 'rectangle-overlap',
    statement:
      'Given two axis-aligned rectangles as [x1, y1, x2, y2] (bottom-left and top-right corners), determine whether they overlap in a region of positive area.',
    starter: `function isRectangleOverlap(rec1: number[], rec2: number[]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Explicitly construct the overlap rectangle by intersecting the two ranges on each axis -- the overlap’s left edge is the larger of the two left edges, its right edge is the smaller of the two right edges, and likewise for top and bottom. The rectangles overlap exactly when this constructed rectangle has positive width AND positive height.',
        time: 'O(1)',
        space: 'O(1)',
        code: `function isRectangleOverlap(rec1: number[], rec2: number[]): boolean {
  const [ax1, ay1, ax2, ay2] = rec1;
  const [bx1, by1, bx2, by2] = rec2;

  // The intersection's own left/right/bottom/top edges.
  const overlapLeft = Math.max(ax1, bx1);
  const overlapRight = Math.min(ax2, bx2);
  const overlapBottom = Math.max(ay1, by1);
  const overlapTop = Math.min(ay2, by2);

  const width = overlapRight - overlapLeft;
  const height = overlapTop - overlapBottom;

  // Positive area on both axes -- zero width/height means only touching
  // at an edge or corner, which does not count as overlap.
  return width > 0 && height > 0;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Check for the ABSENCE of overlap instead of constructing it. Two rectangles fail to overlap exactly when one sits entirely to one side of the other on some axis -- entirely left, entirely right, entirely below, or entirely above. If none of those four separating conditions hold, the rectangles must overlap. This skips building an intersection rectangle at all.",
        time: 'O(1)',
        space: 'O(1)',
        code: `function isRectangleOverlap(rec1: number[], rec2: number[]): boolean {
  const [ax1, ay1, ax2, ay2] = rec1;
  const [bx1, by1, bx2, by2] = rec2;

  // Four ways the rectangles could be cleanly separated; if none apply,
  // there is nowhere left for them to NOT overlap.
  const separatedHorizontally = ax2 <= bx1 || bx2 <= ax1;
  const separatedVertically = ay2 <= by1 || by2 <= ay1;

  return !(separatedHorizontally || separatedVertically);
}`,
      },
    ],
  },
  {
    problemId: 'range-sum-query-2d-immutable',
    statement:
      'Given a fixed 2D matrix, support many queries of sumRegion(row1, col1, row2, col2), each returning the sum of the elements inside that rectangle (inclusive corners).',
    starter: `class NumMatrix {
  constructor(matrix: number[][]) {
    // your code here
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    // your code here
    return 0;
  }
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Store the matrix as given, and for every query, walk every cell inside the requested rectangle and add it up directly. The constructor is instant, but a query over a large rectangle re-adds the same numbers on every call, which is wasteful when many queries are expected against the same fixed matrix.',
        time: 'Construction O(1); each query O(rows * cols) in the worst case',
        space: 'O(n * m) to store the matrix',
        code: `class NumMatrix {
  private matrix: number[][];

  constructor(matrix: number[][]) {
    this.matrix = matrix;
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    let sum = 0;

    for (let r = row1; r <= row2; r++) {
      for (let c = col1; c <= col2; c++) {
        sum += this.matrix[r][c];
      }
    }

    return sum;
  }
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Pay once, up front, for a 2D prefix-sum table -- prefix[i][j] holds the sum of everything from the top-left corner to (i-1, j-1). Any rectangle sum can then be read off with inclusion-exclusion over four corner lookups: the big rectangle, minus the strip above it, minus the strip to its left, plus back the corner that got subtracted twice. Every query after that is O(1).',
        time: 'Construction O(n * m); each query O(1)',
        space: 'O(n * m)',
        code: `class NumMatrix {
  private prefix: number[][];

  constructor(matrix: number[][]) {
    const n = matrix.length;
    const m = matrix[0]?.length ?? 0;

    // prefix[i][j] = sum of the rectangle from (0,0) to (i-1, j-1).
    this.prefix = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        this.prefix[i][j] =
          matrix[i - 1][j - 1] +
          this.prefix[i - 1][j] +
          this.prefix[i][j - 1] -
          this.prefix[i - 1][j - 1]; // the overlap was added twice above
      }
    }
  }

  sumRegion(row1: number, col1: number, row2: number, col2: number): number {
    // Inclusion-exclusion over the four prefix-sum corners.
    return (
      this.prefix[row2 + 1][col2 + 1] -
      this.prefix[row1][col2 + 1] -
      this.prefix[row2 + 1][col1] +
      this.prefix[row1][col1]
    );
  }
}`,
      },
    ],
  },
  {
    problemId: 'nth-magical-number',
    statement:
      'A positive integer is "magical" if it is divisible by A or by B. Given n, a and b, return the nth magical number, modulo 10^9 + 7.',
    starter: `function nthMagicalNumber(n: number, a: number, b: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Walk the positive integers one at a time, and count one whenever it is divisible by A or B, stopping at the nth such number. Simple, but the nth magical number can be astronomically large -- this loop is only feasible for small n.',
        time: 'O(nth magical number itself)',
        space: 'O(1)',
        code: `function nthMagicalNumber(n: number, a: number, b: number): number {
  const MOD = 1_000_000_007;
  let count = 0;
  let candidate = 0;

  while (count < n) {
    candidate++;
    if (candidate % a === 0 || candidate % b === 0) count++;
  }

  return candidate % MOD;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Binary search on the ANSWER itself. For any candidate value x, the count of magical numbers up to x can be computed directly with inclusion-exclusion: floor(x/A) + floor(x/B) - floor(x/lcm(A,B)) -- no enumeration needed. That count only grows as x grows, so binary search for the smallest x whose count is at least n; that x is exactly the nth magical number. BigInt keeps the arithmetic exact even though x itself can be huge, and the modulo is applied only at the very end.",
        time: 'O(log(upper bound)) with O(1) counting per step',
        space: 'O(1)',
        code: `function nthMagicalNumber(n: number, a: number, b: number): number {
  const MOD = 1_000_000_007n;

  const gcd = (x: bigint, y: bigint): bigint => (y === 0n ? x : gcd(y, x % y));
  const bigA = BigInt(a);
  const bigB = BigInt(b);
  const lcm = (bigA / gcd(bigA, bigB)) * bigB; // divide first to avoid overflow risk

  // How many magical numbers lie in [1, x].
  const countUpTo = (x: bigint): bigint => x / bigA + x / bigB - x / lcm;

  let low = 1n;
  let high = BigInt(n) * (bigA < bigB ? bigA : bigB); // a safe upper bound

  while (low < high) {
    const mid = low + (high - low) / 2n;
    if (countUpTo(mid) >= BigInt(n)) {
      high = mid; // mid might be the answer, or the answer is smaller
    } else {
      low = mid + 1n; // mid is too small to reach n magical numbers yet
    }
  }

  return Number(low % MOD);
}`,
      },
    ],
  },
  {
    problemId: 'sorted-permutation-rank',
    statement:
      'Given a string A whose characters are all distinct, find the rank (1-indexed) of A among all of its permutations sorted in lexicographic order. Return the answer modulo 1000003.',
    starter: `function findRank(a: string): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every permutation of the characters, sort them lexicographically, and find the position of the original string in that sorted list. It answers the question directly, but the number of permutations grows factorially, so this only works for very short strings.',
        time: 'O(k! * k log(k!)) for a string of length k',
        space: 'O(k! * k)',
        code: `function findRank(a: string): number {
  const MOD = 1000003;

  const permute = (chars: string[]): string[] => {
    if (chars.length <= 1) return [chars.join('')];

    const results: string[] = [];
    for (let i = 0; i < chars.length; i++) {
      const rest = [...chars.slice(0, i), ...chars.slice(i + 1)];
      for (const tail of permute(rest)) {
        results.push(chars[i] + tail);
      }
    }
    return results;
  };

  const allPermutations = permute(a.split('')).sort();
  const index = allPermutations.indexOf(a);

  return (index + 1) % MOD; // rank is 1-indexed
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Determine the rank position by position, without ever building a permutation. At each position, count how many of the STILL-UNUSED characters are smaller than the one actually placed there -- each such character could have gone in this slot instead, and every choice of it would be followed by (remaining length - 1)! ways to arrange everything after it. Summing "smaller-count times factorial-of-what-is-left" over every position, then adding 1 for the 1-indexed rank, gives the exact answer without generating a single permutation.',
        time: 'O(k^2) for a string of length k (O(k) per position to count smaller unused characters)',
        space: 'O(k)',
        code: `function findRank(a: string): number {
  const MOD = 1000003;
  const characters = a.split('');
  const k = characters.length;

  // Precompute factorials up to k, taken modulo up front.
  const factorial = new Array<number>(k + 1).fill(1);
  for (let i = 1; i <= k; i++) {
    factorial[i] = (factorial[i - 1] * i) % MOD;
  }

  const used = new Array<boolean>(k).fill(false);
  let rank = 0;

  for (let position = 0; position < k; position++) {
    let smallerUnusedCount = 0;

    for (let j = 0; j < k; j++) {
      if (!used[j] && characters[j] < characters[position]) {
        smallerUnusedCount++;
      }
    }

    // Each smaller unused character, placed here instead, would allow
    // (k - position - 1)! arrangements of everything after it.
    rank = (rank + smallerUnusedCount * factorial[k - position - 1]) % MOD;

    used[position] = true;
  }

  return (rank + 1) % MOD; // +1 converts a 0-indexed count to a rank
}`,
      },
    ],
  },
  {
    problemId: 'kingdom-war',
    statement:
      'Given an N x M grid of village strengths (which may be negative), find the largest possible sum obtainable from a single contiguous rectangular submatrix.',
    starter: `function kingdomWar(grid: number[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Build a 2D prefix-sum table so any rectangle’s sum is O(1), then try every pair of corners and keep the best. Straightforward, but there are O(N^2 M^2) rectangles to check even though each individual check is cheap.',
        time: 'O(N^2 * M^2)',
        space: 'O(N * M)',
        code: `function kingdomWar(grid: number[][]): number {
  const n = grid.length;
  const m = grid[0]?.length ?? 0;

  const prefix: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      prefix[i][j] =
        grid[i - 1][j - 1] + prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1];
    }
  }

  const rectangleSum = (r1: number, c1: number, r2: number, c2: number): number =>
    prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];

  let best = -Infinity;

  for (let r1 = 0; r1 < n; r1++) {
    for (let r2 = r1; r2 < n; r2++) {
      for (let c1 = 0; c1 < m; c1++) {
        for (let c2 = c1; c2 < m; c2++) {
          best = Math.max(best, rectangleSum(r1, c1, r2, c2));
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
          "Reduce the 2D search to a series of 1D ones. Fix a pair of rows (top and bottom); collapsing every column's values between those rows into a single running total turns the whole strip into a 1D array, where the best contiguous run is exactly the best submatrix using those rows -- found in one linear pass with Kadane's algorithm. Trying every pair of rows this way is the standard efficient technique for the general maximum-sum-submatrix problem, and reaches the answer in one order of magnitude less work than enumerating every rectangle by hand.",
        time: 'O(N^2 * M)',
        space: 'O(M)',
        code: `function kingdomWar(grid: number[][]): number {
  const n = grid.length;
  const m = grid[0]?.length ?? 0;

  // Best contiguous-sum run in a 1D array (classic Kadane's algorithm).
  const bestSubarraySum = (values: number[]): number => {
    let best = values[0];
    let current = values[0];

    for (let i = 1; i < values.length; i++) {
      // Either extend the running run, or abandon it and restart here.
      current = Math.max(values[i], current + values[i]);
      best = Math.max(best, current);
    }

    return best;
  };

  let best = -Infinity;

  for (let top = 0; top < n; top++) {
    // Running column totals for the strip of rows [top, bottom].
    const columnTotals = new Array<number>(m).fill(0);

    for (let bottom = top; bottom < n; bottom++) {
      for (let col = 0; col < m; col++) {
        columnTotals[col] += grid[bottom][col];
      }

      // Best submatrix using exactly these rows is the best run in the
      // collapsed 1D array.
      best = Math.max(best, bestSubarraySum(columnTotals));
    }
  }

  return best;
}`,
      },
    ],
  },
  {
    problemId: 'count-pairs-in-array-divisible-by-k',
    statement:
      'Given an array of integers and an integer k, count the number of pairs (i, j) with i < j such that (arr[i] + arr[j]) is divisible by k.',
    starter: `function countPairsDivisibleByK(arr: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check every pair directly: for each i < j, test whether their sum is a multiple of k. It is exactly the definition, but every pair is examined individually even though what actually matters about each number is only its remainder mod k.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function countPairsDivisibleByK(arr: number[], k: number): number {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if ((arr[i] + arr[j]) % k === 0) count++;
    }
  }

  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Group numbers by remainder mod k instead of comparing them pairwise. Two remainders r1 and r2 combine to a multiple of k exactly when r1 + r2 == k or both are 0 -- so once the remainder counts are known, the total is assembled from a few group-vs-group products: pairs within the remainder-0 group, pairs within the remainder-(k/2) group when k is even, and cross pairs between every complementary pair of remainder groups elsewhere.",
        time: 'O(n + k)',
        space: 'O(k)',
        code: `function countPairsDivisibleByK(arr: number[], k: number): number {
  const remainderCount = new Array<number>(k).fill(0);

  for (const value of arr) {
    // JS/TS modulo can be negative for negative inputs; normalise into
    // the [0, k) range that the remainder buckets expect.
    const remainder = ((value % k) + k) % k;
    remainderCount[remainder]++;
  }

  const choosePairs = (count: number): number => (count * (count - 1)) / 2;

  let total = 0;

  // Remainder 0 pairs only with itself.
  total += choosePairs(remainderCount[0]);

  // When k is even, remainder k/2 also only pairs with itself.
  if (k % 2 === 0) {
    total += choosePairs(remainderCount[k / 2]);
  }

  // Every other remainder r < k/2 pairs with its complement k - r.
  for (let r = 1; r < Math.ceil(k / 2); r++) {
    if (r === k - r) continue; // already handled as the k even midpoint
    total += remainderCount[r] * remainderCount[k - r];
  }

  return total;
}`,
      },
    ],
  },
  {
    problemId: 'number-of-digit-one',
    statement:
      'Given an integer n, count the total number of times the digit 1 appears in all non-negative integers less than or equal to n.',
    starter: `function countDigitOne(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Walk every number from 1 to n and count the 1s in its digits directly, by repeated modulo-10 division. Easy to trust, but it revisits every number individually instead of exploiting any pattern in how digit-1 counts accumulate.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function countDigitOne(n: number): number {
  let total = 0;

  for (let number = 1; number <= n; number++) {
    let value = number;
    while (value > 0) {
      if (value % 10 === 1) total++;
      value = Math.floor(value / 10);
    }
  }

  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Count contributions one DIGIT POSITION at a time instead of one number at a time. For the position with place value p, split n into "high" (the digits above this position), "current" (the digit at this position) and "low" (the digits below it). The count of 1s contributed by this position across all numbers up to n follows a standard three-case formula depending on whether "current" is less than, equal to, or greater than 1 -- and summing that formula over every position (units, tens, hundreds, ...) gives the total directly.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function countDigitOne(n: number): number {
  let total = 0;

  // "placeValue" walks 1, 10, 100, ... over every digit position of n.
  for (let placeValue = 1; placeValue <= n; placeValue *= 10) {
    const higher = Math.floor(n / (placeValue * 10));
    const current = Math.floor(n / placeValue) % 10;
    const lower = n % placeValue;

    if (current === 0) {
      // This position is never 1 unless a higher digit is smaller, which
      // "higher" already ranges over completely.
      total += higher * placeValue;
    } else if (current === 1) {
      // Higher digits can be anything smaller (full ranges of placeValue
      // each), plus the numbers that match up through "lower" exactly.
      total += higher * placeValue + (lower + 1);
    } else {
      // current > 1: every "higher" prefix gets a FULL range of placeValue
      // numbers where this position is 1, one extra full range included.
      total += (higher + 1) * placeValue;
    }
  }

  return total;
}`,
      },
    ],
  },
  {
    problemId: 'nth-catalan-number',
    statement: 'Given a non-negative integer n, return the nth Catalan number, modulo 10^9 + 7.',
    starter: `function nthCatalanNumber(n: number): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          "Use the defining recurrence directly: C(0) = 1, and C(k+1) = sum over i of C(i) * C(k-i) for i from 0 to k. Build the sequence bottom-up in a DP array. It never needs division, which keeps the modular arithmetic simple, but computing C(k+1) itself costs O(k) work, so the whole table costs O(n^2).",
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function nthCatalanNumber(n: number): number {
  const MOD = 1_000_000_007;
  const catalan = new Array<number>(n + 1).fill(0);
  catalan[0] = 1;

  for (let k = 1; k <= n; k++) {
    let sum = 0;
    // C(k) = sum of C(i) * C(k-1-i) for i = 0 .. k-1.
    for (let i = 0; i < k; i++) {
      sum = (sum + catalan[i] * catalan[k - 1 - i]) % MOD;
    }
    catalan[k] = sum;
  }

  return catalan[n];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Use the closed form instead: C(n) = C(2n, n) / (n + 1), a single binomial coefficient. Computing it under a modulus needs a modular inverse in place of division -- since the modulus is prime, Fermat’s little theorem gives that inverse as a^(mod-2) mod, computed with fast exponentiation. With factorials (and their modular inverses) precomputed once up to 2n, the whole answer is then a handful of O(1) lookups and multiplications.',
        time: 'O(n) to build factorial tables, O(log(mod)) for the modular inverse',
        space: 'O(n)',
        code: `function nthCatalanNumber(n: number): number {
  const MOD = 1_000_000_007n;

  const power = (base: bigint, exponent: bigint, mod: bigint): bigint => {
    let result = 1n;
    base %= mod;
    while (exponent > 0n) {
      if (exponent & 1n) result = (result * base) % mod;
      base = (base * base) % mod;
      exponent >>= 1n;
    }
    return result;
  };

  // Fermat's little theorem: since MOD is prime, a^(MOD-2) is a's inverse.
  const modInverse = (a: bigint): bigint => power(a, MOD - 2n, MOD);

  const limit = 2 * n;
  const factorial = new Array<bigint>(limit + 1).fill(1n);
  for (let i = 1; i <= limit; i++) {
    factorial[i] = (factorial[i - 1] * BigInt(i)) % MOD;
  }

  // C(n) = (2n)! / (n! * (n+1)!)
  const numerator = factorial[limit];
  const denominator = (factorial[n] * factorial[n + 1]) % MOD;
  const result = (numerator * modInverse(denominator)) % MOD;

  return Number(result);
}`,
      },
    ],
  },
  {
    problemId: 'number-of-divisible-triplet-sums',
    statement:
      'Given an array of integers and an integer m, count the number of index triplets (i, j, k) with i < j < k such that (arr[i] + arr[j] + arr[k]) is divisible by m.',
    starter: `function numDivisibleTripletSums(arr: number[], m: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check every ordered triple of indices directly. It answers the question by definition, but there are O(n^3) triples, and most of the information needed to answer faster -- how many pairs before a given index have each possible remainder -- gets recomputed from nothing every time.',
        time: 'O(n^3)',
        space: 'O(1)',
        code: `function numDivisibleTripletSums(arr: number[], m: number): number {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      for (let k = j + 1; k < arr.length; k++) {
        if ((arr[i] + arr[j] + arr[k]) % m === 0) count++;
      }
    }
  }

  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sweep left to right maintaining two remainder-frequency tables: how many single elements have been seen so far with each remainder mod m, and how many PAIRS (formed entirely from earlier elements) have each remainder mod m. For each new element, first use the pair table to count how many existing pairs it completes into a divisible triplet -- this has to happen BEFORE the tables are updated, so that every counted triplet still respects i < j < k. Then fold the new element into the pair table (pairing it with every earlier single), and finally record it in the single table for future elements to pair with.',
        time: 'O(n * m)',
        space: 'O(m)',
        code: `function numDivisibleTripletSums(arr: number[], m: number): number {
  // singleCount[r]: elements seen so far with remainder r.
  // pairCount[r]: pairs of EARLIER elements (i < j) whose sum has remainder r.
  const singleCount = new Array<number>(m).fill(0);
  const pairCount = new Array<number>(m).fill(0);

  let total = 0;

  for (const value of arr) {
    const r = ((value % m) + m) % m; // normalise negative remainders

    // Step 1: count triplets that FINISH at this element, using pairs
    // built entirely from elements before it.
    const neededRemainder = (m - r) % m;
    total += pairCount[neededRemainder];

    // Step 2: this element can now pair with every single seen so far,
    // extending the pair table for elements still to come.
    for (let singleRemainder = 0; singleRemainder < m; singleRemainder++) {
      if (singleCount[singleRemainder] === 0) continue;
      const pairRemainder = (singleRemainder + r) % m;
      pairCount[pairRemainder] += singleCount[singleRemainder];
    }

    // Step 3: only now does this element become available as a "single"
    // for anything that comes after it.
    singleCount[r]++;
  }

  return total;
}`,
      },
    ],
  },
  {
    problemId: 'city-tour',
    statement:
      'There are A cities on a line, numbered 1 to A. M of them, given by the array B, are already visited. From an already-visited city i you may next visit city i-1 or city i+1 if it is not yet visited; you keep doing this until every city has been visited. Count the number of distinct orders in which the remaining cities can be visited, modulo 10^9 + 7.',
    starter: `function citiesTour(a: number, b: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Simulate the process directly with backtracking: maintain the set of currently reachable-but-unvisited cities (the "frontier"), and for every choice available at each step, recurse into visiting one of them next, counting a completed sequence once every city is visited. It explores every valid order one branch at a time -- correct for small inputs, but the branching factor makes it explode quickly.',
        time: 'Exponential in the number of unvisited cities',
        space: 'O(A) for the recursion and visited tracking',
        code: `function citiesTour(a: number, b: number[]): number {
  const MOD = 1_000_000_007;
  const visited = new Array<boolean>(a + 1).fill(false);
  for (const city of b) visited[city] = true;

  const remaining = a - b.length;
  if (remaining === 0) return 1; // nothing left to order

  let sequences = 0;

  const frontierMoves = (): number[] => {
    const moves: number[] = [];
    for (let city = 1; city <= a; city++) {
      if (visited[city]) continue;
      const leftVisited = city > 1 && visited[city - 1];
      const rightVisited = city < a && visited[city + 1];
      if (leftVisited || rightVisited) moves.push(city);
    }
    return moves;
  };

  const explore = (visitedCount: number) => {
    if (visitedCount === a) {
      sequences = (sequences + 1) % MOD;
      return;
    }

    for (const city of frontierMoves()) {
      visited[city] = true;
      explore(visitedCount + 1);
      visited[city] = false; // backtrack
    }
  };

  explore(b.length);
  return sequences;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Recognise that the unvisited cities split into independent GAPS between (or beside) the already-visited ones, sorted by position. A gap sandwiched between two visited cities can be filled from either end at each step until only one city remains, giving 2^(length - 1) internal orders; a gap at either end of the whole line has only one direction to grow from, giving exactly 1 internal order. Across different gaps, their individual move-sequences can freely interleave with each other, which is counted by a multinomial coefficient over the gap lengths. Multiplying the multinomial by each gap's own internal-order count gives the total in one pass, using precomputed factorials and modular inverses instead of any search.",
        time: 'O(A) to build factorial tables and scan the gaps',
        space: 'O(A)',
        code: `function citiesTour(a: number, b: number[]): number {
  const MOD = 1_000_000_007n;

  const power = (base: bigint, exponent: bigint, mod: bigint): bigint => {
    let result = 1n;
    base %= mod;
    while (exponent > 0n) {
      if (exponent & 1n) result = (result * base) % mod;
      base = (base * base) % mod;
      exponent >>= 1n;
    }
    return result;
  };
  const modInverse = (x: bigint): bigint => power(x, MOD - 2n, MOD);

  const factorial = new Array<bigint>(a + 1).fill(1n);
  for (let i = 1; i <= a; i++) factorial[i] = (factorial[i - 1] * BigInt(i)) % MOD;

  const sorted = [...b].sort((x, y) => x - y);
  const totalUnvisited = a - b.length;
  if (totalUnvisited === 0) return 1;

  // Gap lengths, in the order they occur along the line, tagged with
  // whether they are bounded on both sides (interior) or just one (edge).
  const gaps: { length: number; boundedBothSides: boolean }[] = [];

  const leftEdge = sorted[0] - 1;
  if (leftEdge > 0) gaps.push({ length: leftEdge, boundedBothSides: false });

  for (let i = 0; i + 1 < sorted.length; i++) {
    const between = sorted[i + 1] - sorted[i] - 1;
    if (between > 0) gaps.push({ length: between, boundedBothSides: true });
  }

  const rightEdge = a - sorted[sorted.length - 1];
  if (rightEdge > 0) gaps.push({ length: rightEdge, boundedBothSides: false });

  // Multinomial coefficient: ways to interleave the independent gap
  // sequences into one overall order, ignoring each gap's own internals.
  let interleavings = factorial[totalUnvisited];
  for (const gap of gaps) {
    interleavings = (interleavings * modInverse(factorial[gap.length])) % MOD;
  }

  // Each interior gap of length L can be filled from either end at each
  // of its first L-1 steps (the last step is forced), giving 2^(L-1).
  // Edge gaps have only one direction to grow from: exactly 1 way.
  let internalWays = 1n;
  for (const gap of gaps) {
    if (gap.boundedBothSides && gap.length > 0) {
      internalWays = (internalWays * power(2n, BigInt(gap.length - 1), MOD)) % MOD;
    }
  }

  return Number((interleavings * internalWays) % MOD);
}`,
      },
    ],
  },
];
