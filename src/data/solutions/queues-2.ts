import type { Solution } from '@/lib/types';

/**
 * Queues, part two.
 *
 * A fixed-capacity double-ended queue to implement from scratch, and two
 * problems that both lean on the same trick -- a monotonic deque -- to turn
 * an otherwise quadratic sliding-window question into a linear one. Split
 * from hashing-queues.ts purely to keep each file a readable size.
 */
export const queues2Solutions: Solution[] = [
  {
    problemId: 'design-circular-deque',
    statement:
      'Design a fixed-capacity circular double-ended queue supporting insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty and isFull, each in O(1).',
    starter: `class MyCircularDeque {
  constructor(k: number) {}
  insertFront(value: number): boolean { return false; }
  insertLast(value: number): boolean { return false; }
  deleteFront(): boolean { return false; }
  deleteLast(): boolean { return false; }
  getFront(): number { return -1; }
  getRear(): number { return -1; }
  isEmpty(): boolean { return true; }
  isFull(): boolean { return false; }
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          "A fixed array used as a ring buffer, tracked with a head index and a count -- the same idea as a circular queue, extended to allow insertion and deletion at BOTH ends. Inserting at the front just means stepping the head index backward (wrapping around the end of the array) before writing; inserting at the back writes at (head + count) mod capacity, exactly as in a plain circular queue. Tracking count rather than a separate tail pointer avoids the usual ambiguity between a full and an empty deque, which would otherwise both look like head === tail.",
        time: 'O(1) for every operation',
        space: 'O(k)',
        code: `class MyCircularDeque {
  private items: number[];
  private head = 0;
  private count = 0;
  private capacity: number;

  constructor(k: number) {
    this.capacity = k;
    this.items = new Array<number>(k).fill(0);
  }

  insertFront(value: number): boolean {
    if (this.isFull()) return false;

    // Step the head backward first, wrapping via +capacity to stay
    // non-negative, then write the new front element there.
    this.head = (this.head - 1 + this.capacity) % this.capacity;
    this.items[this.head] = value;
    this.count++;

    return true;
  }

  insertLast(value: number): boolean {
    if (this.isFull()) return false;

    const tail = (this.head + this.count) % this.capacity;
    this.items[tail] = value;
    this.count++;

    return true;
  }

  deleteFront(): boolean {
    if (this.isEmpty()) return false;

    // The old slot is simply left behind; count is what defines the live
    // region, so nothing needs to be cleared.
    this.head = (this.head + 1) % this.capacity;
    this.count--;

    return true;
  }

  deleteLast(): boolean {
    if (this.isEmpty()) return false;

    this.count--; // the last occupied slot just falls outside the live region
    return true;
  }

  getFront(): number {
    return this.isEmpty() ? -1 : this.items[this.head];
  }

  getRear(): number {
    if (this.isEmpty()) return -1;
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
    problemId: 'sum-of-minimum-and-maximum-elements-of-all-subarrays-of-size-k-1171047',
    statement:
      'Given an array of integers and a window size k, for every contiguous subarray of size k, sum its minimum element and its maximum element; return the total of all of those sums across every window.',
    starter: `function sumMinMaxOfSubarrays(arr: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every window of size k, scan its k elements directly to find the minimum and maximum, and add both to a running total. Correct, but every one of the roughly n windows pays O(k) to re-derive its min and max from scratch, even though adjacent windows overlap in all but one element.',
        time: 'O(n * k)',
        space: 'O(1)',
        code: `function sumMinMaxOfSubarrays(arr: number[], k: number): number {
  let total = 0;

  for (let start = 0; start + k <= arr.length; start++) {
    let windowMin = Infinity;
    let windowMax = -Infinity;

    for (let i = start; i < start + k; i++) {
      windowMin = Math.min(windowMin, arr[i]);
      windowMax = Math.max(windowMax, arr[i]);
    }

    total += windowMin + windowMax;
  }

  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Two monotonic deques maintained side by side as the window slides -- one increasing (front holds the window's minimum) and one decreasing (front holds the window's maximum). Before adding a new element, pop off anything from the back of each deque that the new element would make useless (anything the new element beats, from the appropriate side), then push its index; also drop an index from the front whenever it has slid out of the current window. Each element enters and leaves each deque at most once, so the whole scan is linear regardless of k.",
        time: 'O(n)',
        space: 'O(k)',
        code: `function sumMinMaxOfSubarrays(arr: number[], k: number): number {
  const minDeque: number[] = []; // indices, values increasing front to back
  const maxDeque: number[] = []; // indices, values decreasing front to back
  let total = 0;

  for (let i = 0; i < arr.length; i++) {
    // Maintain increasing order for the min-deque.
    while (minDeque.length > 0 && arr[minDeque[minDeque.length - 1]] >= arr[i]) {
      minDeque.pop();
    }
    minDeque.push(i);

    // Maintain decreasing order for the max-deque.
    while (maxDeque.length > 0 && arr[maxDeque[maxDeque.length - 1]] <= arr[i]) {
      maxDeque.pop();
    }
    maxDeque.push(i);

    // Drop indices that have slid out of the current window from the front.
    if (minDeque[0] <= i - k) minDeque.shift();
    if (maxDeque[0] <= i - k) maxDeque.shift();

    // Once the first full window is formed, its min/max are at the fronts.
    if (i >= k - 1) {
      total += arr[minDeque[0]] + arr[maxDeque[0]];
    }
  }

  return total;
}`,
      },
    ],
  },
  {
    problemId: 'shortest-subarray-with-sum-at-least-k',
    statement:
      'Given an integer array (which may contain negative numbers) and an integer k, return the length of the shortest contiguous subarray whose sum is at least k, or -1 if no such subarray exists.',
    starter: `function shortestSubarray(nums: number[], k: number): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check the sum of every contiguous subarray directly, using prefix sums so each individual sum is an O(1) subtraction, and keep the shortest one meeting the target. It examines every possible subarray, so it is trivially correct, but there are O(n^2) of them.',
        time: 'O(n^2)',
        space: 'O(n) for the prefix sums',
        code: `function shortestSubarray(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  let best = Infinity;

  for (let start = 0; start < n; start++) {
    for (let end = start; end < n; end++) {
      const sum = prefix[end + 1] - prefix[start];
      if (sum >= k) {
        best = Math.min(best, end - start + 1);
        break; // this is the SMALLEST end for this start with sum >= k,
               // so it is already the shortest subarray this start can
               // produce -- later ends only make it longer, never shorter.
      }
    }
  }

  return best === Infinity ? -1 : best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Prefix sums plus a monotonic increasing deque of prefix-sum INDICES, processed left to right. For the current prefix sum, first check from the FRONT of the deque: while the earliest stored prefix is small enough that the gap to the current prefix already reaches k, that gives a valid (and, since indices only grow, increasingly short) candidate -- pop it and update the best length. Then, before pushing the current index, pop from the BACK anything whose prefix sum is >= the current one, since a later, smaller-or-equal prefix is strictly more useful as a future window start (shorter distance for the same or better sum). This handles negative numbers correctly, which is exactly where a plain sliding window would fail.",
        time: 'O(n)',
        space: 'O(n)',
        code: `function shortestSubarray(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  const deque: number[] = []; // indices into "prefix", increasing prefix value
  let best = Infinity;

  for (let i = 0; i <= n; i++) {
    // As long as the window from the earliest stored index to here already
    // reaches k, it is a valid candidate -- and popping it only shortens
    // future candidates further, so keep consuming from the front.
    while (deque.length > 0 && prefix[i] - prefix[deque[0]] >= k) {
      best = Math.min(best, i - deque.shift()!);
    }

    // A later index with a prefix sum <= the current one is always at
    // least as good a future window start, so drop the current back
    // entries that the new index dominates before pushing it.
    while (deque.length > 0 && prefix[deque[deque.length - 1]] >= prefix[i]) {
      deque.pop();
    }

    deque.push(i);
  }

  return best === Infinity ? -1 : best;
}`,
      },
    ],
  },
];
