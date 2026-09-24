import type { Solution } from '@/lib/types';

/** Hashing and queues. */
export const hashingQueueSolutions: Solution[] = [
  {
    problemId: 'subarray-sum-equals-k',
    statement:
      'Given an integer array and an integer k, return the number of contiguous subarrays whose sum equals k. Values may be negative.',
    starter: `function subarraySum(nums: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Extend every start index rightward, keeping a running sum, and count whenever it hits k. Note a sliding window does NOT work here, because negative values mean the sum is not monotonic as the window grows.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function subarraySum(nums: number[], k: number): number {
  let count = 0;

  for (let start = 0; start < nums.length; start++) {
    let sum = 0;

    for (let end = start; end < nums.length; end++) {
      sum += nums[end];

      // No break here: negatives mean the sum can dip below k and come
      // back, so later subarrays may still qualify.
      if (sum === k) count++;
    }
  }

  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Prefix sums with a hash map. The sum of a subarray ending here equals the running total minus some earlier running total, so a subarray sums to k exactly when an earlier prefix equals current minus k. Count how many times each prefix has occurred. Seeding the map with prefix 0 counted once is essential — it accounts for subarrays starting at index 0.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function subarraySum(nums: number[], k: number): number {
  // How many times each running total has been seen.
  const prefixCounts = new Map<number, number>();

  // Seed: a prefix sum of 0 has occurred once, before any element. Without
  // this, subarrays starting at index 0 are never counted.
  prefixCounts.set(0, 1);

  let running = 0;
  let count = 0;

  for (const value of nums) {
    running += value;

    // A subarray ending here sums to k when some earlier prefix equalled
    // (running - k). Every such earlier occurrence is a distinct subarray.
    count += prefixCounts.get(running - k) ?? 0;

    prefixCounts.set(running, (prefixCounts.get(running) ?? 0) + 1);
  }

  return count;
}`,
      },
    ],
  },

  {
    problemId: 'subarray-with-0-sum',
    statement:
      'Determine whether an array contains a contiguous subarray summing to zero.',
    starter: `function hasZeroSumSubarray(nums: number[]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The same prefix-sum idea, simplified. If the running total ever repeats a value it has had before, everything between those two points sums to zero. A running total of zero itself also qualifies, which the seeded set handles.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function hasZeroSumSubarray(nums: number[]): boolean {
  // Seeded with 0 so that a running total returning to zero counts as a
  // repeat -- that is a prefix summing to zero.
  const seen = new Set<number>([0]);

  let running = 0;

  for (const value of nums) {
    running += value;

    // Two identical prefix sums mean the stretch between them nets to zero.
    if (seen.has(running)) return true;

    seen.add(running);
  }

  return false;
}`,
      },
    ],
  },

  {
    problemId: 'longest-substring-without-repeating-characters',
    statement:
      'Given a string, find the length of the longest substring without repeating characters.',
    starter: `function lengthOfLongestSubstring(s: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Try every starting position and extend while characters stay unique.',
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function lengthOfLongestSubstring(s: string): number {
  let best = 0;

  for (let start = 0; start < s.length; start++) {
    const seen = new Set<string>();

    for (let end = start; end < s.length; end++) {
      if (seen.has(s[end])) break; // repeat ends this run
      seen.add(s[end]);
    }

    best = Math.max(best, seen.size);
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A sliding window remembering where each character was last seen. On a repeat, jump the window start straight past the previous occurrence rather than stepping one at a time. The Math.max guard matters: a stale index from before the current window must never drag the start backwards.',
        time: 'O(n)',
        space: 'O(alphabet size)',
        code: `function lengthOfLongestSubstring(s: string): number {
  // Character -> the index where it last appeared.
  const lastSeen = new Map<string, number>();

  let start = 0;
  let best = 0;

  for (let end = 0; end < s.length; end++) {
    const previous = lastSeen.get(s[end]);

    // A repeat INSIDE the window means the window must start just past the
    // earlier copy. Math.max guards against an old index from before the
    // current window pulling start backwards, which would admit duplicates.
    if (previous !== undefined && previous >= start) {
      start = previous + 1;
    }

    lastSeen.set(s[end], end);
    best = Math.max(best, end - start + 1);
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'minimum-window-substring',
    statement:
      'Given strings s and t, return the smallest substring of s containing every character of t including duplicates. Return an empty string if none exists.',
    starter: `function minWindow(s: string, t: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A sliding window with a "how many required characters are fully satisfied" counter. Expand until every requirement is met, then contract from the left while it stays valid, recording the best. The counter is what makes validity a constant-time check instead of comparing two maps each step.',
        time: 'O(s + t)',
        space: 'O(alphabet size)',
        code: `function minWindow(s: string, t: string): string {
  if (t.length === 0 || s.length < t.length) return '';

  // How many of each character the window must contain.
  const need = new Map<string, number>();
  for (const char of t) {
    need.set(char, (need.get(char) ?? 0) + 1);
  }

  const windowCounts = new Map<string, number>();

  // How many DISTINCT characters currently meet their full quota. Tracking
  // this means checking validity is one comparison, not a map walk.
  let satisfied = 0;
  const required = need.size;

  let bestLength = Infinity;
  let bestStart = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (need.has(char)) {
      const count = (windowCounts.get(char) ?? 0) + 1;
      windowCounts.set(char, count);

      // Exactly reaching the quota (not exceeding it) is what increments.
      if (count === need.get(char)) satisfied++;
    }

    // Valid window: shrink from the left as far as it stays valid.
    while (satisfied === required) {
      if (right - left + 1 < bestLength) {
        bestLength = right - left + 1;
        bestStart = left;
      }

      const leftChar = s[left];
      if (need.has(leftChar)) {
        const count = windowCounts.get(leftChar)! - 1;
        windowCounts.set(leftChar, count);

        // Dropping below the quota breaks validity and ends the shrink.
        if (count < need.get(leftChar)!) satisfied--;
      }

      left++;
    }
  }

  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
}`,
      },
    ],
  },

  {
    problemId: 'valid-sudoku',
    statement:
      'Determine whether a partially filled 9x9 Sudoku board is valid. Only the filled cells need checking, and the board need not be solvable.',
    starter: `function isValidSudoku(board: string[][]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'One pass, three sets of seen values. The only piece of arithmetic worth pausing on is the box index: dividing both coordinates by three maps every cell to its 3x3 block. Encoding each observation as a string key keeps all three checks in one structure.',
        time: 'O(1) — the board is a fixed 81 cells',
        space: 'O(1)',
        code: `function isValidSudoku(board: string[][]): boolean {
  // One set holding differently-prefixed keys avoids three parallel
  // structures and three near-identical checks.
  const seen = new Set<string>();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value === '.') continue;

      // Integer-dividing both coordinates by 3 identifies the 3x3 box.
      const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      const keys = [
        'row' + row + '-' + value,
        'col' + col + '-' + value,
        'box' + box + '-' + value,
      ];

      for (const key of keys) {
        if (seen.has(key)) return false;
        seen.add(key);
      }
    }
  }

  return true;
}`,
      },
    ],
  },

  {
    problemId: 'consecutive-array-elements',
    statement:
      'Determine whether an array of distinct integers can be rearranged into a sequence of consecutive values.',
    starter: `function areConsecutive(nums: number[]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'No sorting needed. A set of distinct values is consecutive exactly when the gap between its minimum and maximum equals the count minus one. One pass finds both ends, and a set confirms distinctness.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function areConsecutive(nums: number[]): boolean {
  if (nums.length === 0) return false;

  let min = Infinity;
  let max = -Infinity;
  const seen = new Set<number>();

  for (const value of nums) {
    // Any duplicate makes a consecutive run impossible.
    if (seen.has(value)) return false;
    seen.add(value);

    min = Math.min(min, value);
    max = Math.max(max, value);
  }

  // n distinct values spanning exactly n - 1 in range leaves no gaps.
  return max - min === nums.length - 1;
}`,
      },
    ],
  },

  {
    problemId: 'max-points-on-a-line',
    statement:
      'Given points on a plane, return the maximum number that lie on the same straight line.',
    starter: `function maxPoints(points: number[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Anchor each point in turn and group the others by the slope to it — the largest group plus the anchor is the best line through that anchor. The trap is representing slope as a float, where rounding makes distinct slopes collide. Use the reduced rise-over-run pair instead, normalised for sign so that 1/2 and -1/-2 agree.',
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function maxPoints(points: number[][]): number {
  if (points.length <= 2) return points.length;

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  let best = 0;

  for (let i = 0; i < points.length; i++) {
    // Slope key -> how many other points share that slope with point i.
    const slopes = new Map<string, number>();

    for (let j = i + 1; j < points.length; j++) {
      let dx = points[j][0] - points[i][0];
      let dy = points[j][1] - points[i][1];

      // Reduce to lowest terms, so 2/4 and 1/2 produce the same key. Using
      // a floating-point slope here is the classic bug: rounding merges
      // slopes that differ and separates ones that do not.
      const divisor = gcd(Math.abs(dx), Math.abs(dy)) || 1;
      dx /= divisor;
      dy /= divisor;

      // Normalise the sign so 1/2 and -1/-2 are the same direction.
      if (dx < 0 || (dx === 0 && dy < 0)) {
        dx = -dx;
        dy = -dy;
      }

      const key = dx + '/' + dy;
      slopes.set(key, (slopes.get(key) ?? 0) + 1);
    }

    for (const count of slopes.values()) {
      // Plus one for the anchor point itself.
      best = Math.max(best, count + 1);
    }
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'sliding-window-maximum',
    statement:
      'Given an array and a window size k, return the maximum of each sliding window as it moves from left to right.',
    starter: `function maxSlidingWindow(nums: number[], k: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Scan each window for its maximum. Simple and too slow when both n and k are large.',
        time: 'O(n * k)',
        space: 'O(1)',
        code: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];

  for (let start = 0; start + k <= nums.length; start++) {
    let max = -Infinity;
    for (let i = start; i < start + k; i++) {
      max = Math.max(max, nums[i]);
    }
    result.push(max);
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A monotonic deque of indices, kept in decreasing order of value, so the front is always the window maximum. The insight that makes it work: a value with a larger value after it inside the window can never be the maximum again, so it can be discarded permanently. Each index is pushed and popped once, giving a linear total.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];

  // Indices whose values decrease from front to back. The front is always
  // the maximum of the current window.
  const deque: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    // Drop the front if it has slid out of the window.
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // Any smaller value with nums[i] behind it can never be a maximum
    // again -- nums[i] is both larger AND stays in the window longer. So
    // discard them permanently, which is what keeps this linear.
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // Start recording once the first full window exists.
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'implement-queue-using-stacks',
    statement:
      'Implement a FIFO queue using only two stacks, supporting push, pop, peek and empty.',
    starter: `class MyQueue {
  push(x: number): void {}
  pop(): number { return 0; }
  peek(): number { return 0; }
  empty(): boolean { return true; }
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Two stacks: one for arrivals, one for departures. Pouring the input stack into the output stack reverses the order, turning LIFO into FIFO. The important rule is to transfer only when the output stack is empty — that way each element moves at most once, giving amortised constant time even though a single operation can cost O(n).',
        time: 'O(1) amortised per operation',
        space: 'O(n)',
        code: `class MyQueue {
  // Newly pushed elements land here, newest on top.
  private input: number[] = [];

  // Elements ready to leave, OLDEST on top because the transfer reverses.
  private output: number[] = [];

  push(x: number): void {
    this.input.push(x);
  }

  /**
   * Move everything across, but ONLY when output is empty. Transferring
   * early would interleave old and new elements and break the ordering;
   * transferring only when empty also means each element moves exactly
   * once, which is what gives the amortised O(1).
   */
  private transfer(): void {
    if (this.output.length > 0) return;

    while (this.input.length > 0) {
      this.output.push(this.input.pop()!);
    }
  }

  pop(): number {
    this.transfer();
    return this.output.pop()!;
  }

  peek(): number {
    this.transfer();
    return this.output[this.output.length - 1];
  }

  empty(): boolean {
    return this.input.length === 0 && this.output.length === 0;
  }
}`,
      },
    ],
  },

  {
    problemId: 'design-circular-queue',
    statement:
      'Design a circular queue of fixed capacity supporting enqueue, dequeue, front, rear, isEmpty and isFull.',
    starter: `class MyCircularQueue {
  constructor(k: number) {}
  enQueue(value: number): boolean { return false; }
  deQueue(): boolean { return false; }
  Front(): number { return -1; }
  Rear(): number { return -1; }
  isEmpty(): boolean { return true; }
  isFull(): boolean { return false; }
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A fixed array with a head index and a count. Wrapping is just modulo arithmetic. Tracking the count rather than a separate tail pointer avoids the classic ambiguity where a full queue and an empty queue have identical head and tail positions.',
        time: 'O(1) for every operation',
        space: 'O(k)',
        code: `class MyCircularQueue {
  private items: number[];
  private head = 0;

  // Storing the count rather than a tail index sidesteps the classic
  // ambiguity where head === tail could mean either full or empty.
  private count = 0;
  private capacity: number;

  constructor(k: number) {
    this.capacity = k;
    this.items = new Array<number>(k).fill(0);
  }

  enQueue(value: number): boolean {
    if (this.isFull()) return false;

    // The next free slot, wrapping around the end of the array.
    const tail = (this.head + this.count) % this.capacity;
    this.items[tail] = value;
    this.count++;

    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) return false;

    // Move the head forward; the old slot is simply left behind, since
    // count is what defines the live region.
    this.head = (this.head + 1) % this.capacity;
    this.count--;

    return true;
  }

  Front(): number {
    return this.isEmpty() ? -1 : this.items[this.head];
  }

  Rear(): number {
    if (this.isEmpty()) return -1;

    // The last occupied slot, again wrapping.
    return this.items[(this.head + this.count - 1) % this.capacity];
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }
}`,
      },
    ],
  },

  {
    problemId: 'number-of-recent-calls',
    statement:
      'Implement a counter that records pings and returns how many occurred in the past 3000 milliseconds, inclusive. Calls arrive in strictly increasing time order.',
    starter: `class RecentCounter {
  ping(t: number): number { return 0; }
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A queue of timestamps. Because calls arrive in increasing order, anything that falls out of the window will never come back, so expired entries can be discarded permanently from the front. Each timestamp is added and removed once, so the amortised cost is constant.',
        time: 'O(1) amortised',
        space: 'O(calls within the window)',
        code: `class RecentCounter {
  // Timestamps still inside the 3000ms window, oldest first.
  private window: number[] = [];

  ping(t: number): number {
    this.window.push(t);

    // Drop everything older than the window. Since t only ever increases,
    // a discarded timestamp can never become relevant again -- which is
    // why removing rather than skipping is safe.
    while (this.window[0] < t - 3000) {
      this.window.shift();
    }

    return this.window.length;
  }
}`,
      },
    ],
  },

  {
    problemId: 'dota2-senate',
    statement:
      'Two parties, Radiant and Dire, vote in rounds. Each senator may ban one senator of the other party. Predict which party wins.',
    starter: `function predictPartyVictory(senate: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Two queues of indices, one per party. Each round the senator with the smaller index acts first and bans the other; the winner rejoins the queue with its index advanced by the senate size, which puts it correctly in the next round order. When one queue empties, that party has lost.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function predictPartyVictory(senate: string): string {
  const radiant: number[] = [];
  const dire: number[] = [];

  for (let i = 0; i < senate.length; i++) {
    if (senate[i] === 'R') radiant.push(i);
    else dire.push(i);
  }

  const n = senate.length;

  while (radiant.length > 0 && dire.length > 0) {
    const r = radiant.shift()!;
    const d = dire.shift()!;

    // The smaller index acts first and bans the other. The survivor
    // re-queues with its index pushed forward by n, which places it after
    // everyone still acting in the current round -- effectively moving it
    // to the next round while preserving relative order.
    if (r < d) radiant.push(r + n);
    else dire.push(d + n);
  }

  return radiant.length > 0 ? 'Radiant' : 'Dire';
}`,
      },
    ],
  },

  {
    problemId: 'reveal-cards-in-increasing-order',
    statement:
      'Reorder a deck so that, revealing the top card then moving the next to the bottom and repeating, the cards come out in increasing order.',
    starter: `function deckRevealedIncreasing(deck: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Run the process backwards. Sort descending, and rebuild by reversing each step: move the bottom card back to the top, then place the next largest card on top. What remains is the required arrangement — simulating in reverse is much easier than trying to derive the positions directly.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function deckRevealedIncreasing(deck: number[]): number[] {
  // Largest first, because we rebuild the deck from the last card revealed
  // backwards to the first.
  const sorted = [...deck].sort((a, b) => b - a);

  const result: number[] = [];

  for (const card of sorted) {
    // Undo the "move the top card to the bottom" step by doing the reverse:
    // take the bottom card and put it back on top.
    if (result.length > 0) {
      result.unshift(result.pop()!);
    }

    // Then undo the reveal by placing this card on top.
    result.unshift(card);
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'reverse-first-k-elements-of-queue',
    statement:
      'Given a queue and an integer k, reverse the order of the first k elements while leaving the rest in their original order.',
    starter: `function reverseFirstK(queue: number[], k: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Pull the first k elements onto a stack, which reverses them, then push them back onto the queue followed by rotating the untouched remainder around to the back. Using a stack for the reversal is the point of the exercise.',
        time: 'O(n)',
        space: 'O(k)',
        code: `function reverseFirstK(queue: number[], k: number): number[] {
  const working = [...queue];
  const stack: number[] = [];

  // A stack reverses whatever goes into it -- that is the whole trick.
  for (let i = 0; i < k; i++) {
    stack.push(working.shift()!);
  }

  // Putting them back pops in reverse order, which is what we want.
  while (stack.length > 0) {
    working.push(stack.pop()!);
  }

  // The untouched remainder is now in front of the reversed block; rotate
  // it around to restore the intended ordering.
  for (let i = 0; i < working.length - k; i++) {
    working.push(working.shift()!);
  }

  return working;
}`,
      },
    ],
  },
];
