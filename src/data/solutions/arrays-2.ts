import type { Solution } from '@/lib/types';

/** Arrays, batch 2. */
export const arrays2Solutions: Solution[] = [
  {
    problemId: 'spiral-matrix',
    statement:
      'Given an m x n matrix, return all its elements in spiral order: left to right across the top, down the right side, right to left across the bottom, up the left side, then inward and repeat.',
    starter: `function spiralOrder(matrix: number[][]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Walk the matrix one step at a time, marking visited cells. Move in the current direction until the next cell is off the edge or already visited, then turn right. Correct, but needs an extra visited grid.',
        time: 'O(m*n)',
        space: 'O(m*n)',
        code: `function spiralOrder(matrix: number[][]): number[] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const visited = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));

  // Directions in spiral order: right, down, left, up.
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let direction = 0;

  let r = 0;
  let c = 0;
  const result: number[] = [];

  for (let step = 0; step < rows * cols; step++) {
    result.push(matrix[r][c]);
    visited[r][c] = true;

    // Where would we go if we kept the current heading?
    const nextR = r + directions[direction][0];
    const nextC = c + directions[direction][1];

    // Off the edge or already taken means it is time to turn right.
    const blocked =
      nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols || visited[nextR][nextC];

    if (blocked) {
      direction = (direction + 1) % 4;
    }

    r += directions[direction][0];
    c += directions[direction][1];
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Track four boundaries — top, bottom, left, right — and peel one full ring at a time, shrinking the boundary you just consumed. No visited grid is needed because the boundaries themselves record what is left. The one subtlety is that after the top row and right column, you must re-check that a row and column still remain before walking back, or a single remaining row gets emitted twice.',
        time: 'O(m*n)',
        space: 'O(1) extra, ignoring the output',
        code: `function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];

  // The untouched rectangle is rows [top..bottom] x columns [left..right].
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // Top row, left to right.
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;

    // Right column, top to bottom.
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;

    // Bottom row, right to left -- but only if a row is actually left.
    // Without this check, a single remaining row would be emitted twice.
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }

    // Left column, bottom to top -- same guard for a single remaining column.
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'first-missing-positive',
    statement:
      'Given an unsorted integer array, find the smallest missing positive integer. You must run in O(n) time and use O(1) auxiliary space.',
    starter: `function firstMissingPositive(nums: number[]): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try 1, then 2, then 3, and for each one scan the whole array to see if it is present. The first one you cannot find is the answer.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function firstMissingPositive(nums: number[]): number {
  // The answer is at most n + 1: n numbers cannot cover 1..n+1.
  for (let candidate = 1; candidate <= nums.length + 1; candidate++) {
    let found = false;
    for (const value of nums) {
      if (value === candidate) {
        found = true;
        break;
      }
    }
    if (!found) return candidate;
  }
  return 1; // unreachable
}`,
      },
      {
        name: 'Better',
        idea:
          'Put every value in a hash set, then count up from 1 until you find one that is missing. Linear time, but it needs O(n) extra memory, which the problem forbids.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function firstMissingPositive(nums: number[]): number {
  const present = new Set(nums);

  for (let candidate = 1; candidate <= nums.length + 1; candidate++) {
    if (!present.has(candidate)) return candidate;
  }

  return 1;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The key observation: with n slots, the answer must be somewhere in 1..n+1. So use the array itself as the hash table — put value v at index v-1 by repeated swapping (cyclic sort). After that, the first index whose value does not match its position is the missing number. Swapping in a while loop rather than an if is what keeps it O(n): every swap places one value permanently, so there can be at most n swaps overall.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function firstMissingPositive(nums: number[]): number {
  const n = nums.length;

  // Place each value v in the range 1..n at index v - 1.
  for (let i = 0; i < n; i++) {
    // A while loop, not an if: after a swap the new value at i may also
    // belong elsewhere, and it must be placed too.
    while (
      nums[i] > 0 &&
      nums[i] <= n &&
      // Already correct? Then stop -- this also prevents an infinite loop
      // when the array holds duplicates.
      nums[nums[i] - 1] !== nums[i]
    ) {
      const target = nums[i] - 1;
      [nums[i], nums[target]] = [nums[target], nums[i]];
    }
  }

  // The first slot holding the wrong value reveals the missing number.
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }

  // 1..n were all present, so the answer is n + 1.
  return n + 1;
}`,
      },
    ],
  },

  {
    problemId: 'corporate-flight-bookings',
    statement:
      'There are n flights labelled 1 to n. Each booking [first, last, seats] reserves that many seats on every flight from first to last inclusive. Return an array of the total seats reserved on each flight.',
    starter: `function corpFlightBookings(bookings: number[][], n: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For each booking, loop over its whole range and add the seats to every flight in it. Simple, but a booking spanning all n flights costs n work, so a large number of wide bookings is slow.',
        time: 'O(bookings * n)',
        space: 'O(1) extra',
        code: `function corpFlightBookings(bookings: number[][], n: number): number[] {
  const answer = new Array<number>(n).fill(0);

  for (const [first, last, seats] of bookings) {
    // Flight labels are 1-based, array indices are 0-based.
    for (let flight = first; flight <= last; flight++) {
      answer[flight - 1] += seats;
    }
  }

  return answer;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A difference array. Instead of writing to every element of a range, record only where the range starts and where it stops: add seats at the start index and subtract it just past the end. A running prefix sum over that difference array then reconstructs every total in one pass. Each booking becomes O(1) work instead of O(range).',
        time: 'O(bookings + n)',
        space: 'O(1) extra, reusing the output array',
        code: `function corpFlightBookings(bookings: number[][], n: number): number[] {
  // diff[i] holds the CHANGE in seat count between flight i-1 and flight i.
  const diff = new Array<number>(n).fill(0);

  for (const [first, last, seats] of bookings) {
    // From flight "first" onward, seats go up by this amount...
    diff[first - 1] += seats;

    // ...and from just after "last", they go back down. The guard handles a
    // booking that runs to the final flight, where there is no "after".
    if (last < n) {
      diff[last] -= seats;
    }
  }

  // Prefix-sum the changes to turn them back into absolute totals.
  for (let i = 1; i < n; i++) {
    diff[i] += diff[i - 1];
  }

  return diff;
}`,
      },
    ],
  },

  {
    problemId: 'majority-element-ii',
    statement:
      'Given an integer array of size n, find all elements that appear more than ⌊n/3⌋ times.',
    starter: `function majorityElement(nums: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'Count every value with a hash map, then collect the ones whose count exceeds n/3. Linear time, but O(n) extra space.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function majorityElement(nums: number[]): number[] {
  const counts = new Map<number, number>();

  for (const value of nums) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const threshold = Math.floor(nums.length / 3);
  const result: number[] = [];

  for (const [value, count] of counts) {
    if (count > threshold) result.push(value);
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Boyer-Moore extended. There can be at most two values appearing more than n/3 times — three such values would need more than n elements. So track two candidates and two counters with the same cancel-out voting rule. Because the guarantee that a majority exists is gone here, a second pass is required to verify each candidate actually clears the threshold.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function majorityElement(nums: number[]): number[] {
  // At most two values can exceed n/3, so two slots suffice.
  let candidate1: number | null = null;
  let candidate2: number | null = null;
  let count1 = 0;
  let count2 = 0;

  for (const value of nums) {
    // Order matters: match an existing candidate before claiming a free slot,
    // otherwise the same value could occupy both slots.
    if (candidate1 === value) {
      count1++;
    } else if (candidate2 === value) {
      count2++;
    } else if (count1 === 0) {
      candidate1 = value;
      count1 = 1;
    } else if (count2 === 0) {
      candidate2 = value;
      count2 = 1;
    } else {
      // A vote against both candidates cancels one supporting vote from each.
      count1--;
      count2--;
    }
  }

  // The voting only narrows the field to two possibilities -- it does not
  // prove either one qualifies. Verify with a real count.
  const threshold = Math.floor(nums.length / 3);
  const result: number[] = [];

  for (const candidate of [candidate1, candidate2]) {
    if (candidate === null) continue;
    const actual = nums.filter((v) => v === candidate).length;
    if (actual > threshold) result.push(candidate);
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'max-consecutive-ones-iii',
    statement:
      'Given a binary array and an integer k, return the length of the longest subarray containing only 1s after flipping at most k zeros.',
    starter: `function longestOnes(nums: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every starting index, extend to the right while counting zeros, and stop when the count exceeds k. Track the longest run seen.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function longestOnes(nums: number[], k: number): number {
  let best = 0;

  for (let start = 0; start < nums.length; start++) {
    let zeros = 0;

    for (let end = start; end < nums.length; end++) {
      if (nums[end] === 0) zeros++;

      // Past the flip budget -- this start cannot reach any further.
      if (zeros > k) break;

      best = Math.max(best, end - start + 1);
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Reframe it: find the longest window containing at most k zeros. Slide a window right, and whenever it holds too many zeros, shrink it from the left until it is valid again. Each index enters and leaves the window once, so it is linear. The nice trick is that the window never needs to shrink below the best length already found, so you can let it grow monotonically and read the answer off the final size.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function longestOnes(nums: number[], k: number): number {
  let left = 0;
  let zeros = 0; // zeros currently inside the window
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    // Extend the window to include nums[right].
    if (nums[right] === 0) zeros++;

    // Too many zeros to flip: shrink from the left until it is affordable.
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }

    // Every window reaching this point is valid.
    best = Math.max(best, right - left + 1);
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'set-mismatch',
    statement:
      'You have a set that should contain 1..n, but one number was duplicated over another, so one value appears twice and one is missing. Return [duplicate, missing].',
    starter: `function findErrorNums(nums: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Better',
        idea: 'Count occurrences in a hash map, then scan 1..n for the value counted twice and the one counted zero times.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function findErrorNums(nums: number[]): number[] {
  const counts = new Map<number, number>();
  for (const value of nums) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  let duplicate = -1;
  let missing = -1;

  for (let value = 1; value <= nums.length; value++) {
    const count = counts.get(value) ?? 0;
    if (count === 2) duplicate = value;
    if (count === 0) missing = value;
  }

  return [duplicate, missing];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Use the sign of each slot as a visited marker. For each value v, negate the number at index |v|-1. If that slot is already negative, v is the duplicate, because something else already marked it. Afterwards the one slot still positive names the missing value. All the bookkeeping lives in the array itself.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function findErrorNums(nums: number[]): number[] {
  let duplicate = -1;

  for (const value of nums) {
    // Read through the absolute value: this slot may already be flipped.
    const index = Math.abs(value) - 1;

    if (nums[index] < 0) {
      // Something already marked this slot, so this value appears twice.
      duplicate = Math.abs(value);
    } else {
      nums[index] = -nums[index]; // mark "seen"
    }
  }

  // Exactly one slot was never marked -- that index is the missing value.
  let missing = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      missing = i + 1;
      break;
    }
  }

  return [duplicate, missing];
}`,
      },
    ],
  },

  {
    problemId: 'plus-one',
    statement:
      'Given a non-negative integer represented as an array of digits, most significant digit first, add one to it and return the resulting digit array.',
    starter: `function plusOne(digits: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Walk from the last digit backwards. A digit below 9 just increments and you are done — no carry can propagate further. A 9 becomes 0 and the carry continues left. If the loop finishes still carrying, every digit was a 9, so the answer is a 1 followed by all zeros and the array grows by one.',
        time: 'O(n)',
        space: 'O(1) extra, except in the all-nines case',
        code: `function plusOne(digits: number[]): number[] {
  // Start at the least significant digit.
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      // No carry out of this position, so nothing to the left can change.
      digits[i]++;
      return digits;
    }

    // 9 + 1 = 10: write the 0 and let the carry move left.
    digits[i] = 0;
  }

  // Still carrying after the first digit means the input was all 9s
  // (999 -> 1000), which is the only case where the length grows.
  return [1, ...digits];
}`,
      },
    ],
  },

  {
    problemId: 'pascals-triangle-ii',
    statement:
      "Given a row index (0-based), return that row of Pascal's triangle, where each element is the sum of the two directly above it.",
    starter: `function getRow(rowIndex: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Build every row from row 0 up to the one asked for, each from the previous. Uses O(k) extra space for rows you then discard.',
        time: 'O(k^2)',
        space: 'O(k)',
        code: `function getRow(rowIndex: number): number[] {
  let row = [1];

  for (let r = 1; r <= rowIndex; r++) {
    const next = new Array<number>(r + 1).fill(1);

    // The ends are always 1; the interior is the sum of the pair above.
    for (let c = 1; c < r; c++) {
      next[c] = row[c - 1] + row[c];
    }

    row = next;
  }

  return row;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Build the row in place in a single array. The trick is to iterate right to left: each position needs the value to its left from the previous row, and going right to left means that value has not been overwritten yet. Going left to right would clobber it.',
        time: 'O(k^2)',
        space: 'O(k) for the output only',
        code: `function getRow(rowIndex: number): number[] {
  const row = new Array<number>(rowIndex + 1).fill(1);

  for (let r = 2; r <= rowIndex; r++) {
    // Right to left is essential: row[c - 1] must still hold the PREVIOUS
    // row's value when we read it. Left to right would overwrite it first.
    for (let c = r - 1; c >= 1; c--) {
      row[c] = row[c] + row[c - 1];
    }
  }

  return row;
}`,
      },
    ],
  },

  {
    problemId: 'excel-sheet-column-title',
    statement:
      'Given a column number, return its Excel column title. 1 maps to A, 26 to Z, 27 to AA, 28 to AB, and so on.',
    starter: `function convertToTitle(columnNumber: number): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'This is base-26 conversion with one wrinkle: the digits run 1..26 rather than 0..25, so there is no zero digit. Subtracting 1 before each modulo shifts the range back into 0..25, which makes the ordinary base conversion work. Forgetting that subtraction is the classic bug — it makes 26 produce "AZ" instead of "Z".',
        time: 'O(log n)',
        space: 'O(1) extra',
        code: `function convertToTitle(columnNumber: number): string {
  let result = '';
  let n = columnNumber;

  while (n > 0) {
    // The shift that makes this work: Excel columns are 1-indexed (A = 1),
    // but modulo arithmetic wants 0-indexed digits. Without this, 26 would
    // give remainder 0 and produce the wrong letter.
    n--;

    const remainder = n % 26;
    result = String.fromCharCode(65 + remainder) + result; // 65 is 'A'

    n = Math.floor(n / 26);
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'factorial-trailing-zeroes',
    statement: 'Given an integer n, return the number of trailing zeroes in n factorial.',
    starter: `function trailingZeroes(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'A trailing zero needs a factor of 2 and a factor of 5, and 5s are always scarcer, so the answer is the total number of 5s in the prime factorisation of n!. Walk every number from 1 to n and count how many times 5 divides it. Correct, but it touches every number.\n\nNote what NOT to do: literally computing n! and counting zeros fails almost immediately, because 21! already exceeds what a double can hold exactly.',
        time: 'O(n log n)',
        space: 'O(1)',
        code: `function trailingZeroes(n: number): number {
  let fives = 0;

  // Every number from 1 to n contributes however many times 5 divides it:
  // 25 contributes two, 125 contributes three, and so on.
  for (let value = 5; value <= n; value += 5) {
    let current = value;

    while (current % 5 === 0) {
      fives++;
      current /= 5;
    }
  }

  return fives;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A trailing zero comes from a factor of 10, which is 2 x 5. In any factorial there are far more 2s than 5s, so the number of 5s is the binding constraint. Count how many multiples of 5 are below n, then multiples of 25 (each contributes a second 5), then 125, and so on — repeatedly dividing by 5 and summing.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function trailingZeroes(n: number): number {
  let zeros = 0;

  // Each pass counts one more power of 5. Multiples of 5 contribute one
  // factor, multiples of 25 contribute an extra one, 125 another, etc.
  for (let divisor = 5; divisor <= n; divisor *= 5) {
    zeros += Math.floor(n / divisor);
  }

  return zeros;
}`,
      },
    ],
  },

  {
    problemId: 'generate-parentheses',
    statement:
      'Given n pairs of parentheses, generate all combinations of well-formed parentheses.',
    starter: `function generateParenthesis(n: number): string[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every string of length 2n over the two characters, then keep the valid ones. That is 2^(2n) candidates, the vast majority of which are thrown away.',
        time: 'O(2^(2n) * n)',
        space: 'O(n) recursion depth',
        code: `function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  const isValid = (s: string): boolean => {
    let open = 0;
    for (const ch of s) {
      open += ch === '(' ? 1 : -1;
      if (open < 0) return false; // closed one that was never opened
    }
    return open === 0;
  };

  const build = (current: string) => {
    if (current.length === 2 * n) {
      if (isValid(current)) result.push(current);
      return;
    }
    build(current + '(');
    build(current + ')');
  };

  build('');
  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Do not generate invalid strings at all. Track how many of each bracket has been used: you may open one whenever fewer than n are open, and you may close one only while there are more opens than closes. Those two rules make every leaf of the recursion a valid string, so nothing is discarded.',
        time: 'O(4^n / sqrt(n)) — the nth Catalan number of results',
        space: 'O(n) recursion depth',
        code: `function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  /**
   * @param current the string built so far
   * @param open    how many '(' have been placed
   * @param close   how many ')' have been placed
   */
  const build = (current: string, open: number, close: number) => {
    // A complete string uses all n pairs.
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }

    // Open a bracket whenever we have not used all n.
    if (open < n) {
      build(current + '(', open + 1, close);
    }

    // Close one only if there is an unmatched open to close. This single
    // condition is what makes every generated string valid by construction.
    if (close < open) {
      build(current + ')', open, close + 1);
    }
  };

  build('', 0, 0);
  return result;
}`,
      },
    ],
  },

  {
    problemId: 'unique-paths-ii',
    statement:
      'A robot starts at the top-left of an m x n grid and can only move right or down. Some cells contain obstacles. Return the number of distinct paths to the bottom-right.',
    starter: `function uniquePathsWithObstacles(grid: number[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Recurse from the start: the paths through a cell are the paths through the cell to its right plus the paths through the cell below. Without memoisation this re-solves the same cells exponentially many times.',
        time: 'O(2^(m+n))',
        space: 'O(m+n) recursion depth',
        code: `function uniquePathsWithObstacles(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  const countFrom = (r: number, c: number): number => {
    // Walked off the grid, or into an obstacle: no paths this way.
    if (r >= rows || c >= cols || grid[r][c] === 1) return 0;

    // Reached the destination: exactly one path ends here.
    if (r === rows - 1 && c === cols - 1) return 1;

    return countFrom(r + 1, c) + countFrom(r, c + 1);
  };

  return countFrom(0, 0);
}`,
      },
      {
        name: 'Better',
        idea:
          'Same recurrence, filled bottom-up into a 2D table. Each cell is the sum of the cell above and the cell to its left, and an obstacle cell is zero. Linear in the grid size.',
        time: 'O(m*n)',
        space: 'O(m*n)',
        code: `function uniquePathsWithObstacles(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  // An obstacle on the start square means there are no paths at all.
  if (grid[0][0] === 1) return 0;

  const paths = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  paths[0][0] = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // An obstacle is unreachable and blocks everything behind it.
      if (grid[r][c] === 1) {
        paths[r][c] = 0;
        continue;
      }

      // Arrivals from above and from the left.
      if (r > 0) paths[r][c] += paths[r - 1][c];
      if (c > 0) paths[r][c] += paths[r][c - 1];
    }
  }

  return paths[rows - 1][cols - 1];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Each row only ever reads the row above it and the value to its left, so one array of width n is enough. Processing left to right, the slot already holds the value from the row above and you add the slot to its left — which is this row. That single array does the work of the whole table.',
        time: 'O(m*n)',
        space: 'O(n)',
        code: `function uniquePathsWithObstacles(grid: number[][]): number {
  const cols = grid[0].length;

  // paths[c] means: before processing row r it holds row r-1's value for
  // column c; after processing, it holds row r's value.
  const paths = new Array<number>(cols).fill(0);
  paths[0] = 1;

  for (const row of grid) {
    for (let c = 0; c < cols; c++) {
      if (row[c] === 1) {
        // Blocked: nothing can pass through here.
        paths[c] = 0;
      } else if (c > 0) {
        // paths[c] is still the cell above; paths[c-1] is already this row.
        paths[c] += paths[c - 1];
      }
      // c === 0 with no obstacle: the value carries down unchanged, which is
      // already what paths[0] holds.
    }
  }

  return paths[cols - 1];
}`,
      },
    ],
  },
];
