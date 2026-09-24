import type { Solution } from '@/lib/types';

/**
 * Arrays, part three.
 *
 * A grab-bag of the remaining array and number-theory problems from the
 * sheet: index/value tricks, greedy parity counting, classic divisor and
 * primality routines, and a couple of calendar/simulation problems. Split
 * from arrays.ts / arrays-2.ts purely to keep each file a readable size.
 */
export const arrays3Solutions: Solution[] = [
  {
    problemId: 'maximum-value-of-difference-of-a-pair-of-elements-and-their-index',
    statement:
      'Given an unsorted array arr of n integers, find the maximum value of |arr[i] - arr[j]| + |i - j| over all pairs of indices i, j.',
    starter: `function maxDiffValueAndIndex(arr: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'The definition, computed directly: try every pair of indices, evaluate |arr[i] - arr[j]| + |i - j|, and keep the largest. Correct and easy to trust, but it examines every one of the n^2 pairs even though most of them cannot be the answer.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function maxDiffValueAndIndex(arr: number[]): number {
  let best = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      const value = Math.abs(arr[i] - arr[j]) + Math.abs(i - j);
      best = Math.max(best, value);
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Expand the absolute values by case. Whichever of i, j is larger, the expression |arr[i]-arr[j]| + |i-j| always equals one of two forms depending only on the SIGN choices: max over all pairs of ((arr[i] + i) - (arr[j] + j)) or ((arr[i] - i) - (arr[j] - j)) -- one of these two always reproduces the true value for the pair that attains the maximum, because the two remaining sign combinations are just the same two expressions with i and j swapped. So build two derived arrays, A = arr[i] + i and B = arr[i] - i, and the answer is the larger of (max(A) - min(A)) and (max(B) - min(B)) -- a single linear pass.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function maxDiffValueAndIndex(arr: number[]): number {
  let maxA = -Infinity;
  let minA = Infinity;
  let maxB = -Infinity;
  let minB = Infinity;

  for (let i = 0; i < arr.length; i++) {
    const a = arr[i] + i; // captures the "same-sign" case
    const b = arr[i] - i; // captures the "opposite-sign" case

    maxA = Math.max(maxA, a);
    minA = Math.min(minA, a);
    maxB = Math.max(maxB, b);
    minB = Math.min(minB, b);
  }

  // Whichever pair actually maximises the expression, it is captured by
  // one of these two ranges spanning its own max and min.
  return Math.max(maxA - minA, maxB - minB);
}`,
      },
    ],
  },
  {
    problemId: 'max-non-negative-subarray',
    statement:
      'Given an array of integers, find the contiguous subarray made entirely of non-negative numbers with the largest sum. On a tie in sum, prefer the longer subarray, and on a further tie, prefer the one starting earliest. Return the subarray itself.',
    starter: `function maxNonNegativeSubarray(arr: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Consider every contiguous run of non-negative numbers as a candidate: scan all start points, and for each, extend as far right as the numbers stay non-negative, checking every resulting segment against the best seen so far under the tie-break rules. Segments overlap heavily, so the same numbers get summed again and again.',
        time: 'O(n^2)',
        space: 'O(n) for the returned segment',
        code: `function maxNonNegativeSubarray(arr: number[]): number[] {
  let bestStart = -1;
  let bestEnd = -1; // exclusive
  let bestSum = -1; // any real non-negative segment beats "no segment"

  for (let start = 0; start < arr.length; start++) {
    if (arr[start] < 0) continue; // a segment cannot start on a negative

    let sum = 0;
    let end = start;

    while (end < arr.length && arr[end] >= 0) {
      sum += arr[end];
      end++;

      const length = end - start;
      const bestLength = bestEnd - bestStart;

      const better =
        sum > bestSum || (sum === bestSum && length > bestLength);

      if (better) {
        bestSum = sum;
        bestStart = start;
        bestEnd = end;
      }
    }
  }

  return bestStart === -1 ? [] : arr.slice(bestStart, bestEnd);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A single left-to-right pass. Track the current all-non-negative run as it grows; the moment a negative number appears, the run is over and a fresh one starts after it. Compare each finished run against the best only when it strictly improves on sum, or matches on sum with a strictly longer length -- leaving the comparison untouched on any other tie automatically keeps the earliest-starting winner, since it was recorded first.',
        time: 'O(n)',
        space: 'O(n) for the returned segment',
        code: `function maxNonNegativeSubarray(arr: number[]): number[] {
  let bestStart = -1;
  let bestEnd = -1; // exclusive
  let bestSum = -1;

  let currentStart = -1; // -1 means "no run open right now"
  let currentSum = 0;

  const closeRun = (end: number) => {
    if (currentStart === -1) return; // nothing open to close

    const length = end - currentStart;
    const bestLength = bestEnd - bestStart;

    // Strict improvement only, so the first of any tied segment sticks.
    if (currentSum > bestSum || (currentSum === bestSum && length > bestLength)) {
      bestSum = currentSum;
      bestStart = currentStart;
      bestEnd = end;
    }

    currentStart = -1;
    currentSum = 0;
  };

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) {
      closeRun(i); // the run, if any, ends right before this element
      continue;
    }

    if (currentStart === -1) currentStart = i; // start a new run here
    currentSum += arr[i];
  }

  closeRun(arr.length); // the array may end mid-run

  return bestStart === -1 ? [] : arr.slice(bestStart, bestEnd);
}`,
      },
    ],
  },
  {
    problemId: 'reading-newspaper',
    statement:
      'A newspaper has A lines. Starting on Monday, a reader gets through B[d] lines on day d of the week (index 0 = Monday, ... 6 = Sunday), repeating the weekly pattern indefinitely. Return the day of the week (1 = Monday, ... 7 = Sunday) on which the last line is read.',
    starter: `function readingNewspaper(lines: number, dailyCapacity: number[]): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          "Simulate day by day. Subtract each day's capacity from the remaining line count and stop the moment it would finish that day. Correct, but for a large line count and small daily capacities, it walks through every day of every week one at a time instead of skipping whole weeks at once.",
        time: 'O(lines / minDailyCapacity)',
        space: 'O(1)',
        code: `function readingNewspaper(lines: number, dailyCapacity: number[]): number {
  let remaining = lines;
  let day = 0; // 0 = Monday ... 6 = Sunday

  while (true) {
    const today = dailyCapacity[day];

    // Enough capacity today to finish the whole newspaper.
    if (today >= remaining) return day + 1;

    remaining -= today;
    day = (day + 1) % 7;
  }
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Skip whole weeks at once. A full week always removes the same total, so divide it out up front with a single integer division and modulo, leaving only the leftover lines that a partial final week has to cover -- at most 7 more days of simulation regardless of how large the input is.",
        time: 'O(1) arithmetic plus at most 7 simulated days',
        space: 'O(1)',
        code: `function readingNewspaper(lines: number, dailyCapacity: number[]): number {
  const weeklyTotal = dailyCapacity.reduce((sum, pages) => sum + pages, 0);

  // Skip every full week in one step; only the remainder still needs a
  // day-by-day walk.
  let remaining = lines % weeklyTotal;
  if (remaining === 0) remaining = weeklyTotal; // finishes exactly on Sunday

  let day = 0;
  while (true) {
    const today = dailyCapacity[day];
    if (today >= remaining) return day + 1;
    remaining -= today;
    day++;
  }
}`,
      },
    ],
  },
  {
    problemId: 'minimum-elements-to-be-removed-such-that-sum-of-adjacent-elements-is-always-even',
    statement:
      'Given an array of integers, find the minimum number of elements to remove so that every pair of adjacent elements in what remains sums to an even number.',
    starter: `function minRemovalsForEvenAdjacentSums(arr: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          "Two adjacent numbers sum to an even number exactly when they share the same parity. By transitivity, if every adjacent pair in the surviving sequence must match, EVERY surviving element must share one single parity -- so filter the array down to just the even elements, and separately down to just the odd elements, and see which filtered copy is longer. That copy needs the fewest removals to reach.",
        time: 'O(n)',
        space: 'O(n) for the two filtered copies',
        code: `function minRemovalsForEvenAdjacentSums(arr: number[]): number {
  const evens = arr.filter((value) => value % 2 === 0);
  const odds = arr.filter((value) => Math.abs(value % 2) === 1);

  // Keeping whichever group is bigger removes the fewest elements.
  const keep = Math.max(evens.length, odds.length);
  return arr.length - keep;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The two filtered arrays above were never actually needed -- only their lengths are. Count even and odd elements in one pass, and removals is the size of the smaller group, since keeping the larger one preserves the most elements while satisfying the same-parity requirement.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function minRemovalsForEvenAdjacentSums(arr: number[]): number {
  let evenCount = 0;
  let oddCount = 0;

  for (const value of arr) {
    // A negative odd number in JS/TS gives a remainder of -1, not 1, so
    // compare the absolute value rather than against 1 directly.
    if (value % 2 === 0) evenCount++;
    else oddCount++;
  }

  // Remove whichever group is smaller; the other group can stay intact.
  return Math.min(evenCount, oddCount);
}`,
      },
    ],
  },
  {
    problemId: 'gcd-of-two-numbers',
    statement: 'Given two positive integers, return their greatest common divisor.',
    starter: `function gcdOfTwoNumbers(a: number, b: number): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'The definition, checked directly: walk every candidate divisor from the smaller of the two numbers down to 1, and return the first one that divides both. Correct, but a candidate is tried for every single value down to 1 even when the real answer is found almost immediately by a smarter method.',
        time: 'O(min(a, b))',
        space: 'O(1)',
        code: `function gcdOfTwoNumbers(a: number, b: number): number {
  const smaller = Math.min(a, b);

  for (let candidate = smaller; candidate >= 1; candidate--) {
    if (a % candidate === 0 && b % candidate === 0) return candidate;
  }

  return 1; // unreachable when a, b >= 1, since 1 always divides both
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The Euclidean algorithm: the gcd of (a, b) equals the gcd of (b, a mod b), because any common divisor of a and b also divides a - kb for any integer k, and a mod b is exactly a reduced this way. Repeating this shrinks the pair rapidly -- each step at least halves the larger value -- until the remainder hits zero, at which point the other number is the answer.',
        time: 'O(log(min(a, b)))',
        space: 'O(1)',
        code: `function gcdOfTwoNumbers(a: number, b: number): number {
  while (b !== 0) {
    // gcd(a, b) = gcd(b, a mod b) -- shrink the pair, keep the gcd fixed.
    [a, b] = [b, a % b];
  }

  return a;
}`,
      },
    ],
  },
  {
    problemId: 'all-factors',
    statement: 'Given a positive integer A, return all of its divisors in ascending order.',
    starter: `function allFactors(a: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Test every integer from 1 to A for divisibility. Simple and obviously correct, but wasteful: divisors always come in pairs (d, A/d), and this approach discovers each pair one member at a time instead of both at once.',
        time: 'O(A)',
        space: 'O(number of divisors)',
        code: `function allFactors(a: number): number[] {
  const factors: number[] = [];

  for (let candidate = 1; candidate <= a; candidate++) {
    if (a % candidate === 0) factors.push(candidate);
  }

  return factors; // already ascending, since candidate counts up
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Only check candidates up to sqrt(A). Every divisor d <= sqrt(A) pairs with a matching divisor A/d >= sqrt(A), so finding one side of the pair finds both at once, and nothing past sqrt(A) needs to be tried directly. Collect the small divisors on the way up and the large ones as their pairs, then sort once at the end.',
        time: 'O(sqrt(A) log(sqrt(A))) -- the sort dominates a sqrt(A) scan',
        space: 'O(number of divisors)',
        code: `function allFactors(a: number): number[] {
  const factors: number[] = [];

  for (let candidate = 1; candidate * candidate <= a; candidate++) {
    if (a % candidate !== 0) continue;

    factors.push(candidate);

    const pair = a / candidate;
    if (pair !== candidate) factors.push(pair); // avoid double-counting sqrt(A)
  }

  return factors.sort((x, y) => x - y);
}`,
      },
    ],
  },
  {
    problemId: 'prime-numbers',
    statement: 'Given a positive integer A, return every prime number less than or equal to A, in ascending order.',
    starter: `function primeNumbers(a: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Test each number from 2 to A for primality on its own, by trial division up to its square root. Straightforward, but every number pays for its own primality check from scratch, none of the work is shared between numbers.',
        time: 'O(A * sqrt(A))',
        space: 'O(number of primes)',
        code: `function primeNumbers(a: number): number[] {
  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) return false;
    }
    return true;
  };

  const primes: number[] = [];
  for (let n = 2; n <= a; n++) {
    if (isPrime(n)) primes.push(n);
  }

  return primes;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Sieve of Eratosthenes. Instead of asking of each number 'are you prime?', flip the question around: for each prime found, cross out every one of its multiples in one sweep. By the time the sieve reaches a composite number, it has already been crossed out by one of its smaller factors, so no per-number primality test is needed at all.",
        time: 'O(A log log A)',
        space: 'O(A)',
        code: `function primeNumbers(a: number): number[] {
  if (a < 2) return [];

  // composite[n] starts false ("innocent until proven composite").
  const composite = new Array<boolean>(a + 1).fill(false);

  for (let p = 2; p * p <= a; p++) {
    if (composite[p]) continue; // already crossed out by a smaller prime

    // Start crossing out at p*p: every smaller multiple of p was already
    // crossed out as a multiple of a smaller prime.
    for (let multiple = p * p; multiple <= a; multiple += p) {
      composite[multiple] = true;
    }
  }

  const primes: number[] = [];
  for (let n = 2; n <= a; n++) {
    if (!composite[n]) primes.push(n);
  }

  return primes;
}`,
      },
    ],
  },
  {
    problemId: 'largest-coprime-divisor',
    statement:
      'Given two positive integers A and B, find the largest divisor of A that shares no common factor with B (their gcd is 1).',
    starter: `function largestCoprimeDivisor(a: number, b: number): number {
  // your code here
  return a;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Walk every divisor of A from largest to smallest and return the first one whose gcd with B is 1. Direct, but finding all of A’s divisors and checking each against B costs more than the structure of the problem requires.',
        time: 'O(sqrt(A) + A / candidate * log B) in the worst case',
        space: 'O(1)',
        code: `function largestCoprimeDivisor(a: number, b: number): number {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));

  for (let candidate = a; candidate >= 1; candidate--) {
    if (a % candidate === 0 && gcd(candidate, b) === 1) return candidate;
  }

  return 1;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Peel off shared factors directly instead of searching for them. gcd(A, B) captures every prime factor A currently has in common with B; dividing it out removes exactly that overlap. Repeating -- recomputing the gcd against the new, smaller A -- keeps removing shared factors (including repeated ones) until nothing A has left is shared with B at all, at which point gcd(A, B) is 1 and A itself is the answer.',
        time: 'O((log A)^2) -- each gcd call is O(log A), repeated O(log A) times',
        space: 'O(1)',
        code: `function largestCoprimeDivisor(a: number, b: number): number {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));

  let remaining = a;
  let shared = gcd(remaining, b);

  // Keep dividing out whatever factor is still shared with B. This also
  // handles repeated prime factors, since the gcd is recomputed each time.
  while (shared !== 1) {
    remaining /= shared;
    shared = gcd(remaining, b);
  }

  return remaining;
}`,
      },
    ],
  },
  {
    problemId: 'sum-of-all-submatrices-of-a-given-matrix',
    statement:
      'Given an n x m matrix, compute the sum of the sums of every possible submatrix (a submatrix is any contiguous rectangular block of cells).',
    starter: `function sumOfAllSubmatrices(matrix: number[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Build a 2D prefix-sum table so any single submatrix sum is O(1), then literally enumerate every choice of top-left and bottom-right corner and add up all of their sums. Correct, but there are O(n^2 m^2) submatrices to visit even though each one’s sum is now cheap to compute.',
        time: 'O(n^2 * m^2)',
        space: 'O(n * m) for the prefix table',
        code: `function sumOfAllSubmatrices(matrix: number[][]): number {
  const n = matrix.length;
  const m = matrix[0]?.length ?? 0;
  if (n === 0 || m === 0) return 0;

  // prefix[i][j] = sum of the rectangle from (0,0) to (i-1,j-1).
  const prefix: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      prefix[i][j] =
        matrix[i - 1][j - 1] + prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1];
    }
  }

  const rectangleSum = (r1: number, c1: number, r2: number, c2: number): number =>
    prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];

  let total = 0;

  for (let r1 = 0; r1 < n; r1++) {
    for (let r2 = r1; r2 < n; r2++) {
      for (let c1 = 0; c1 < m; c1++) {
        for (let c2 = c1; c2 < m; c2++) {
          total += rectangleSum(r1, c1, r2, c2);
        }
      }
    }
  }

  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Skip the submatrices altogether and ask, for each individual CELL, how many submatrices contain it -- then add value times that count. A cell at (row, col), 0-indexed, can have its top-left corner chosen in (row + 1) * (col + 1) ways and its bottom-right corner chosen in (n - row) * (m - col) ways, independently; multiplying those gives exactly the number of submatrices containing that cell. Summing value * count over all cells reaches the same total in one pass instead of enumerating rectangles at all.',
        time: 'O(n * m)',
        space: 'O(1)',
        code: `function sumOfAllSubmatrices(matrix: number[][]): number {
  const n = matrix.length;
  const m = matrix[0]?.length ?? 0;

  let total = 0;

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < m; col++) {
      // Choices for the top-left corner (at or above/left of this cell)
      // times choices for the bottom-right corner (at or below/right).
      const submatricesContainingThisCell = (row + 1) * (n - row) * (col + 1) * (m - col);
      total += matrix[row][col] * submatricesContainingThisCell;
    }
  }

  return total;
}`,
      },
    ],
  },
  {
    problemId: 'day-of-the-week',
    statement:
      'Given a date as day, month and year (all valid, year between 1971 and 2100), return the day of the week it falls on as one of "Sunday", "Monday", ..., "Saturday".',
    starter: `function dayOfTheWeek(day: number, month: number, year: number): string {
  // your code here
  return 'Sunday';
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Count the total number of days between a known anchor date and the target date, then take that count modulo 7 to find the offset from the anchor’s known weekday. January 1, 1971 was a Friday, so walk year by year and month by month from there, adding up days (accounting for leap years) until reaching the target date.',
        time: 'O(year - 1971)',
        space: 'O(1)',
        code: `function dayOfTheWeek(day: number, month: number, year: number): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const isLeapYear = (y: number): boolean => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  const daysInMonth = (y: number, m: number): number => {
    const lengths = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return lengths[m - 1];
  };

  let totalDays = 0; // days elapsed since 1971-01-01

  for (let y = 1971; y < year; y++) {
    totalDays += isLeapYear(y) ? 366 : 365;
  }
  for (let m = 1; m < month; m++) {
    totalDays += daysInMonth(year, m);
  }
  totalDays += day - 1; // days elapsed WITHIN the target month before "day"

  // 1971-01-01 was a Friday, which is index 5 in dayNames.
  const anchorIndex = 5;
  return dayNames[(anchorIndex + totalDays) % 7];
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Sakamoto's algorithm, a closed-form weekday formula. It adjusts the month index so that January/February are treated as the last two months of the PREVIOUS year (this sidesteps having to special-case leap days at the very start of the year), then combines the year, a small per-month offset table, and the day itself into one modulo-7 computation -- no loop over years or months at all.",
        time: 'O(1)',
        space: 'O(1)',
        code: `function dayOfTheWeek(day: number, month: number, year: number): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Per-month correction table for Sakamoto's algorithm (Jan = index 0).
  const monthOffset = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

  let adjustedYear = year;
  // Treat Jan/Feb as months 13/14 of the PRECEDING year, which is the trick
  // that makes the leap-day handling below correct without a special case.
  if (month < 3) adjustedYear -= 1;

  const weekdayIndex =
    (adjustedYear +
      Math.floor(adjustedYear / 4) -
      Math.floor(adjustedYear / 100) +
      Math.floor(adjustedYear / 400) +
      monthOffset[month - 1] +
      day) %
    7;

  return dayNames[weekdayIndex];
}`,
      },
    ],
  },
];
