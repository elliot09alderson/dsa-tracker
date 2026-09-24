import type { Solution } from '@/lib/types';

/**
 * Heaps.
 *
 * JavaScript has no built-in priority queue, so these implement the heap
 * operations directly. The recurring idea: when you need the k best of n
 * things, keep a heap of size k with the WORST of them on top, so the cheapest
 * item to evict is always the one you can see.
 */
export const heapsSolutions: Solution[] = [
  {
    problemId: 'kth-largest-element-in-an-array',
    statement:
      'Return the kth largest element in an unsorted array. Note this is the kth largest in sorted order, not the kth distinct value.',
    starter: `function findKthLargest(nums: number[], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Sort descending and index. Trivially correct, and the sort dominates the cost.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function findKthLargest(nums: number[], k: number): number {
  const sorted = [...nums].sort((a, b) => b - a);

  // k is 1-based, array indices are 0-based.
  return sorted[k - 1];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Keep a min-heap of size k holding the largest k values seen so far. The smallest of them sits at the root, so each new value only needs comparing against that one — push it, and if the heap overflows, drop the root. The root at the end is the kth largest.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function findKthLargest(nums: number[], k: number): number {
  // A MIN-heap of the k largest values. Counter-intuitive at first, but
  // right: the root is the weakest of the current best k, so it is exactly
  // the element to evict when something better arrives.
  const heap: number[] = [];

  const bubbleUp = (index: number) => {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heap[parent] <= heap[index]) break;
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };

  const sinkDown = (index: number) => {
    for (;;) {
      const left = 2 * index + 1;
      const right = left + 1;
      let smallest = index;

      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

      if (smallest === index) break;
      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      index = smallest;
    }
  };

  for (const value of nums) {
    heap.push(value);
    bubbleUp(heap.length - 1);

    // Over capacity: remove the smallest, which is the root.
    if (heap.length > k) {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      sinkDown(0);
    }
  }

  // The heap now holds the k largest values, and its root is the smallest
  // of those -- the kth largest overall.
  return heap[0];
}`,
      },
    ],
  },

  {
    problemId: 'top-k-frequent-elements',
    statement:
      'Given an array and an integer k, return the k most frequent elements in any order.',
    starter: `function topKFrequent(nums: number[], k: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Better',
        idea: 'Count with a hash map, sort the entries by frequency, and take the first k.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const value of nums) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([value]) => value);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Bucket sort by frequency. A value in an array of length n can appear at most n times, so make n+1 buckets indexed by count and drop each value into its bucket. Walking the buckets from the end downward yields values in descending frequency, with no comparison sort at all.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const value of nums) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  // buckets[f] holds every value occurring exactly f times. A frequency can
  // never exceed n, which is what bounds the array and makes this linear.
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);

  for (const [value, count] of counts) {
    buckets[count].push(value);
  }

  const result: number[] = [];

  // Walk from the highest possible frequency downward.
  for (let frequency = buckets.length - 1; frequency >= 0 && result.length < k; frequency--) {
    for (const value of buckets[frequency]) {
      result.push(value);
      if (result.length === k) break;
    }
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'find-median-from-data-stream',
    statement:
      'Design a data structure that accepts a stream of numbers and can report the median of everything added so far.',
    starter: `class MedianFinder {
  addNum(num: number): void {}
  findMedian(): number { return 0; }
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Two heaps facing each other. A max-heap holds the smaller half, a min-heap holds the larger half, so the two roots straddle the middle. Keep the sizes within one of each other and the median is either the larger heap root or the average of both roots. Every insert is logarithmic and the median is constant time.',
        time: 'O(log n) per insert, O(1) for the median',
        space: 'O(n)',
        code: `class MedianFinder {
  // The smaller half, largest of them on top.
  private low: number[] = [];
  // The larger half, smallest of them on top.
  private high: number[] = [];

  private push(heap: number[], value: number, isMaxHeap: boolean) {
    heap.push(value);
    let index = heap.length - 1;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      // One comparison, flipped by the heap's orientation.
      const wrongOrder = isMaxHeap ? heap[parent] < heap[index] : heap[parent] > heap[index];
      if (!wrongOrder) break;

      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  }

  private pop(heap: number[], isMaxHeap: boolean): number {
    const top = heap[0];
    const last = heap.pop()!;

    if (heap.length > 0) {
      heap[0] = last;

      let index = 0;
      for (;;) {
        const left = 2 * index + 1;
        const right = left + 1;
        let best = index;

        const better = (a: number, b: number) => (isMaxHeap ? a > b : a < b);

        if (left < heap.length && better(heap[left], heap[best])) best = left;
        if (right < heap.length && better(heap[right], heap[best])) best = right;

        if (best === index) break;
        [heap[index], heap[best]] = [heap[best], heap[index]];
        index = best;
      }
    }

    return top;
  }

  addNum(num: number): void {
    // Always insert into the low half first, then hand its largest value
    // over to the high half. That single move guarantees every value in low
    // stays <= every value in high without comparing explicitly.
    this.push(this.low, num, true);
    this.push(this.high, this.pop(this.low, true), false);

    // Rebalance so low is never smaller than high. Keeping the extra
    // element in low means the odd-count median is always low's root.
    if (this.high.length > this.low.length) {
      this.push(this.low, this.pop(this.high, false), true);
    }
  }

  findMedian(): number {
    // Odd total: the extra element sits in low, so its root is the median.
    if (this.low.length > this.high.length) return this.low[0];

    // Even total: average the two values straddling the middle.
    return (this.low[0] + this.high[0]) / 2;
  }
}`,
      },
    ],
  },

  {
    problemId: 'merge-k-sorted-lists',
    statement:
      'Merge k sorted linked lists into one sorted linked list and return its head.',
    starter: `function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Merge the lists one at a time into an accumulator. Correct, but the accumulator is rescanned on every merge, so the early elements get walked k times.',
        time: 'O(k^2 * n)',
        space: 'O(1)',
        code: `function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  const mergeTwo = (a: ListNode | null, b: ListNode | null): ListNode | null => {
    const dummy = new ListNode(0);
    let tail = dummy;

    while (a !== null && b !== null) {
      if (a.val <= b.val) {
        tail.next = a;
        a = a.next;
      } else {
        tail.next = b;
        b = b.next;
      }
      tail = tail.next;
    }

    tail.next = a ?? b;
    return dummy.next;
  };

  let merged: ListNode | null = null;

  // Each merge rewalks everything accumulated so far -- that is the waste.
  for (const list of lists) {
    merged = mergeTwo(merged, list);
  }

  return merged;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Merge in pairs, tournament style. Pair up the lists and merge each pair, halving the number of lists each round until one remains. Every element is now touched log k times rather than k times, and it needs no heap.',
        time: 'O(n log k)',
        space: 'O(1)',
        code: `function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;

  const mergeTwo = (a: ListNode | null, b: ListNode | null): ListNode | null => {
    const dummy = new ListNode(0);
    let tail = dummy;

    while (a !== null && b !== null) {
      if (a.val <= b.val) {
        tail.next = a;
        a = a.next;
      } else {
        tail.next = b;
        b = b.next;
      }
      tail = tail.next;
    }

    // One list is exhausted; the other is already sorted.
    tail.next = a ?? b;
    return dummy.next;
  };

  let queue = [...lists];

  // Each round halves the number of lists, so there are log k rounds and
  // every element is copied exactly once per round.
  while (queue.length > 1) {
    const nextRound: (ListNode | null)[] = [];

    for (let i = 0; i < queue.length; i += 2) {
      // The last list in an odd-length round has no partner; carry it over.
      nextRound.push(mergeTwo(queue[i], queue[i + 1] ?? null));
    }

    queue = nextRound;
  }

  return queue[0];
}`,
      },
    ],
  },

  {
    problemId: 'minimum-cost-to-connect-sticks',
    statement:
      'You have sticks of various lengths. Connecting two sticks costs the sum of their lengths. Return the minimum total cost to connect them all into one stick.',
    starter: `function connectSticks(sticks: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Always connect the two shortest sticks available. The reason is that every connection cost is paid again in each later connection involving that stick, so the sticks joined earliest are charged the most times — you want those to be the cheapest. A min-heap supplies the two smallest each round. This is exactly Huffman coding.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function connectSticks(sticks: number[]): number {
  if (sticks.length <= 1) return 0;

  const heap = [...sticks];

  const sinkDown = (index: number) => {
    for (;;) {
      const left = 2 * index + 1;
      const right = left + 1;
      let smallest = index;

      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

      if (smallest === index) break;
      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      index = smallest;
    }
  };

  const bubbleUp = (index: number) => {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heap[parent] <= heap[index]) break;
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };

  const pop = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      sinkDown(0);
    }
    return top;
  };

  // Build the heap in linear time by sinking every internal node.
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) sinkDown(i);

  let totalCost = 0;

  while (heap.length > 1) {
    // The two shortest sticks. Joining these first is what minimises the
    // total, because an early join's cost is re-paid by every later join.
    const combined = pop() + pop();

    totalCost += combined;

    // The joined stick goes back in and competes like any other.
    heap.push(combined);
    bubbleUp(heap.length - 1);
  }

  return totalCost;
}`,
      },
    ],
  },

  {
    problemId: 'k-largest-elements',
    statement: 'Given an array and an integer k, return the k largest elements.',
    starter: `function kLargest(nums: number[], k: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Sort descending and slice. Simple, and the sort costs more than necessary when k is small.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function kLargest(nums: number[], k: number): number[] {
  return [...nums].sort((a, b) => b - a).slice(0, k);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The same bounded min-heap idea as the kth-largest problem, but return the whole heap rather than just its root. Costs log k per element instead of log n.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function kLargest(nums: number[], k: number): number[] {
  // Min-heap of the k largest seen: the weakest survivor sits on top and is
  // the one to evict.
  const heap: number[] = [];

  const bubbleUp = (index: number) => {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heap[parent] <= heap[index]) break;
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };

  const sinkDown = (index: number) => {
    for (;;) {
      const left = 2 * index + 1;
      const right = left + 1;
      let smallest = index;

      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;

      if (smallest === index) break;
      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      index = smallest;
    }
  };

  for (const value of nums) {
    heap.push(value);
    bubbleUp(heap.length - 1);

    if (heap.length > k) {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      sinkDown(0);
    }
  }

  // Descending order for readability; the heap itself is unordered.
  return heap.sort((a, b) => b - a);
}`,
      },
    ],
  },

  {
    problemId: 'merge-k-sorted-arrays',
    statement: 'Given k sorted arrays, merge them into one sorted array.',
    starter: `function mergeKArrays(arrays: number[][]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A min-heap holding one candidate per array — the current front of each. Pop the smallest, append it, and push the next element from whichever array it came from. The heap never exceeds k entries, so each of the n elements costs log k.',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function mergeKArrays(arrays: number[][]): number[] {
  // Each heap entry remembers which array it came from and how far along,
  // so the replacement element can be found after a pop.
  type Entry = { value: number; array: number; index: number };

  const heap: Entry[] = [];

  const bubbleUp = (i: number) => {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent].value <= heap[i].value) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };

  const sinkDown = (i: number) => {
    for (;;) {
      const left = 2 * i + 1;
      const right = left + 1;
      let smallest = i;

      if (left < heap.length && heap[left].value < heap[smallest].value) smallest = left;
      if (right < heap.length && heap[right].value < heap[smallest].value) smallest = right;

      if (smallest === i) break;
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }
  };

  // Seed with the first element of each array. Only k entries are ever in
  // the heap at once, which is what keeps the log factor small.
  arrays.forEach((array, a) => {
    if (array.length > 0) {
      heap.push({ value: array[0], array: a, index: 0 });
      bubbleUp(heap.length - 1);
    }
  });

  const result: number[] = [];

  while (heap.length > 0) {
    const smallest = heap[0];
    result.push(smallest.value);

    const nextIndex = smallest.index + 1;

    if (nextIndex < arrays[smallest.array].length) {
      // Replace the root with the next element from the SAME array, then
      // restore the heap. One operation instead of a pop and a push.
      heap[0] = { value: arrays[smallest.array][nextIndex], array: smallest.array, index: nextIndex };
    } else {
      // That array is exhausted; shrink the heap.
      heap[0] = heap[heap.length - 1];
      heap.pop();
    }

    sinkDown(0);
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'kth-smallest-element-in-a-sorted-matrix',
    statement:
      'Given an n x n matrix where each row and column is sorted ascending, return the kth smallest element.',
    starter: `function kthSmallest(matrix: number[][], k: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Binary search on the value, not the position. For a candidate value, count how many entries are no larger by walking from the bottom-left corner — moving right when the value is too small and up when too large, which is a single linear pass. Narrow the range until the smallest value whose count reaches k remains. That value is guaranteed to be in the matrix.',
        time: 'O(n log(range))',
        space: 'O(1)',
        code: `function kthSmallest(matrix: number[][], k: number): number {
  const n = matrix.length;

  /**
   * How many entries are <= target? Start at the bottom-left corner: moving
   * right increases values, moving up decreases them, so one pass suffices.
   */
  const countNoGreaterThan = (target: number): number => {
    let count = 0;
    let row = n - 1;
    let col = 0;

    while (row >= 0 && col < n) {
      if (matrix[row][col] <= target) {
        // This whole column up to "row" qualifies, in one step.
        count += row + 1;
        col++;
      } else {
        row--;
      }
    }

    return count;
  };

  let low = matrix[0][0];
  let high = matrix[n - 1][n - 1];

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);

    if (countNoGreaterThan(mid) >= k) {
      // Enough values at or below mid, so the answer is mid or smaller.
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  // low converges on an actual matrix entry, not merely a bound, because it
  // is the smallest value whose count reaches k.
  return low;
}`,
      },
    ],
  },
];
