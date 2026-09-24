import type { Solution } from '@/lib/types';

/**
 * Heaps, part two.
 *
 * More "keep the k best things visible" problems, plus two problems whose
 * heap use is less obvious: counting distinct max-heap SHAPES rather than
 * building one, and simulating repeated removal-and-replace operations
 * efficiently. Split from heaps.ts purely to keep each file a readable size.
 */
export const heaps2Solutions: Solution[] = [
  {
    problemId: 'k-closest-points-to-origin-2-2',
    statement: 'Given an array of points on the plane and an integer k, return the k points closest to the origin (0, 0), in any order.',
    starter: `function kClosest(points: number[][], k: number): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Compute every point’s squared distance from the origin (no need for an actual square root -- it does not change the ordering), sort all points by that distance, and take the first k. Correct and simple, but sorts the entire array when only the k smallest distances actually matter.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function kClosest(points: number[][], k: number): number[][] {
  const squaredDistance = ([x, y]: number[]): number => x * x + y * y;

  return [...points]
    .sort((a, b) => squaredDistance(a) - squaredDistance(b))
    .slice(0, k);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Keep a max-heap of size k, ordered by distance, holding the k closest points seen so far -- with the FARTHEST of those k sitting on top, ready to be evicted. Process every point once: if the heap has room, add it; otherwise compare it to the heap’s current farthest point and replace that point if the new one is closer. The heap never grows past size k, so each operation costs O(log k) instead of O(log n).',
        time: 'O(n log k)',
        space: 'O(k)',
        code: `function kClosest(points: number[][], k: number): number[][] {
  const squaredDistance = ([x, y]: number[]): number => x * x + y * y;

  // Max-heap of [distance, point] pairs, keyed on distance.
  const heap: [number, number[]][] = [];

  const siftUp = (i: number) => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] >= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const siftDown = (i: number) => {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < heap.length && heap[left][0] > heap[largest][0]) largest = left;
      if (right < heap.length && heap[right][0] > heap[largest][0]) largest = right;
      if (largest === i) break;
      [heap[i], heap[largest]] = [heap[largest], heap[i]];
      i = largest;
    }
  };

  for (const point of points) {
    const d = squaredDistance(point);

    if (heap.length < k) {
      heap.push([d, point]);
      siftUp(heap.length - 1);
    } else if (d < heap[0][0]) {
      // Closer than the current farthest of our k -- evict it and insert.
      heap[0] = [d, point];
      siftDown(0);
    }
  }

  return heap.map(([, point]) => point);
}`,
      },
    ],
  },
  {
    problemId: 'n-max-pair-combinations',
    statement:
      'Given two arrays A and B, each of size n, form all n^2 possible sums A[i] + B[j]. Return the n largest of those sums, in descending order.',
    starter: `function maxPairCombinations(a: number[], b: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Generate every one of the n^2 pairwise sums, sort them all, and take the top n. It is exactly what is asked for, computed directly, but generating and sorting all n^2 sums is far more work than the n answers actually require.',
        time: 'O(n^2 log(n^2))',
        space: 'O(n^2)',
        code: `function maxPairCombinations(a: number[], b: number[]): number[] {
  const n = a.length;
  const sums: number[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sums.push(a[i] + b[j]);
    }
  }

  return sums.sort((x, y) => y - x).slice(0, n);
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Sort both arrays descending, so the single largest sum is guaranteed to be A[0] + B[0]. Use a max-heap seeded with the n pairs (A[i], 0) for every i -- each representing the best possible partner from B for that A value. Popping the heap's max gives the next largest sum; after using pair (i, j), the next-best candidate involving A[i] is (i, j+1), so push that as its replacement. This produces the n largest sums in sorted order while only ever holding O(n) candidates at a time.",
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function maxPairCombinations(a: number[], b: number[]): number[] {
  const n = a.length;
  const sortedA = [...a].sort((x, y) => y - x);
  const sortedB = [...b].sort((x, y) => y - x);

  // Max-heap of [sum, i, j], keyed on sum.
  const heap: [number, number, number][] = [];
  const siftUp = (idx: number) => {
    let i = idx;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] >= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const siftDown = () => {
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < heap.length && heap[left][0] > heap[largest][0]) largest = left;
      if (right < heap.length && heap[right][0] > heap[largest][0]) largest = right;
      if (largest === i) break;
      [heap[i], heap[largest]] = [heap[largest], heap[i]];
      i = largest;
    }
  };
  const push = (item: [number, number, number]) => {
    heap.push(item);
    siftUp(heap.length - 1);
  };
  const pop = (): [number, number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown();
    }
    return top;
  };

  // Seed with the best partner (index 0 in B) for every A value.
  for (let i = 0; i < n; i++) {
    push([sortedA[i] + sortedB[0], i, 0]);
  }

  const result: number[] = [];
  while (result.length < n) {
    const [sum, i, j] = pop();
    result.push(sum);

    // The next-best candidate that still uses A[i] is its next B partner.
    if (j + 1 < n) {
      push([sortedA[i] + sortedB[j + 1], i, j + 1]);
    }
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'largest-element-after-k-operations-on-array',
    statement:
      'Given an array A, you may perform at most k operations. Each operation chooses an index i (1-indexed, i from 1 to n-1) such that A[i] <= A[i+1], and increases A[i] by 1. Return the largest value achievable anywhere in the array after at most k operations.',
    starter: `function largestElementAfterKOperations(arr: number[], k: number): number {
  // your code here
  return arr[0];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Simulate directly: repeat up to k times, each time scanning the array for a position that currently allows an increment (A[i] <= A[i+1]) and performing it -- prioritising positions that build toward the maximum first is not obvious to get right by hand, so a simple version just performs any valid increment each round and tracks the best value seen. This mirrors the operation literally, but re-scans the whole array on every single one of the k operations.',
        time: 'O(k * n)',
        space: 'O(n)',
        code: `function largestElementAfterKOperations(arr: number[], k: number): number {
  const a = [...arr];
  const n = a.length;

  for (let op = 0; op < k; op++) {
    // Prefer incrementing the rightmost eligible position each round --
    // this tends to build up the last element, which can always absorb
    // an increment since it has no right neighbour to be bounded by.
    let target = -1;
    for (let i = n - 2; i >= 0; i--) {
      if (a[i] <= a[i + 1]) { target = i; break; }
    }
    if (target === -1) break; // no valid move left
    a[target]++;
  }

  return Math.max(...a);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Binary search on the ANSWER. For a candidate target value V, check greedily from right to left whether the array can be pushed so that some position reaches V using at most k total increments: walking right to left, whenever the current element is smaller than what is needed to eventually support V (the minimum of V and the requirement carried from its right neighbour, minus one step of slack), add the needed increments. That check runs in O(n), and the true answer is the largest V for which the check succeeds -- found by binary searching over V.',
        time: 'O(n log(max(A) + k))',
        space: 'O(1)',
        code: `function largestElementAfterKOperations(arr: number[], k: number): number {
  const n = arr.length;

  // Can some position be pushed up to at least "target" using <= k total
  // increments, respecting that A[i] can only rise while A[i] <= A[i+1]?
  const canReach = (target: number): boolean => {
    let opsNeeded = 0;
    // "required" is the minimum value the position to the right must be
    // able to sit at or above for the chain of increments to reach target
    // all the way through; walking right to left keeps that chain valid.
    let required = target;

    for (let i = n - 1; i >= 0; i--) {
      const need = Math.max(0, required - arr[i]);
      opsNeeded += need;
      if (opsNeeded > k) return false; // already too expensive, stop early

      // The neighbour to the left only needs to support one less than
      // whatever this position ends up at (since it just needs A[i] <= A[i+1]).
      required = Math.max(arr[i], required) - 1;
      if (required < 0) required = 0;
    }

    return opsNeeded <= k;
  };

  let low = Math.max(...arr);
  let high = low + k;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (canReach(mid)) low = mid; // mid is achievable -- try for higher
    else high = mid - 1; // mid is too ambitious
  }

  return low;
}`,
      },
    ],
  },
  {
    problemId: 'ways-to-form-max-heap',
    statement:
      'Given n distinct keys, count the number of distinct binary max-heaps that can be formed using all of them, modulo 10^9 + 7. (A max-heap here is the usual array-based complete binary tree where every parent is larger than its children; two heaps are distinct if their shapes or key placements differ.)',
    starter: `function waysToFormMaxHeap(n: number): number {
  // your code here
  return 1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Build every possible max-heap directly with backtracking: place the largest remaining key at the current root (it always must be the largest, by the heap property), then recursively try every way to split the remaining keys between the left and right subtree sizes dictated by a complete binary tree of this size, counting the ways for each side and combining them. It is correct and mirrors the definition exactly, but re-derives subtree sizes and choose-counts from scratch at every call with no memoisation.',
        time: 'Exponential without memoisation',
        space: 'O(n) recursion depth',
        code: `function waysToFormMaxHeap(n: number): number {
  const MOD = 1_000_000_007;

  // Size of the left subtree of a complete binary tree with "size" nodes.
  const leftSubtreeSize = (size: number): number => {
    if (size <= 1) return 0;
    const height = Math.floor(Math.log2(size));
    const nodesAboveLastLevel = 2 ** height - 1;
    const lastLevelCount = size - nodesAboveLastLevel;
    const maxLastLevel = 2 ** height;
    const leftLastLevel = Math.min(lastLevelCount, maxLastLevel / 2);
    return nodesAboveLastLevel / 2 + leftLastLevel;
  };

  const choose = (n: number, k: number): number => {
    let result = 1;
    for (let i = 0; i < k; i++) result = (result * (n - i)) / (i + 1);
    return Math.round(result);
  };

  const ways = (size: number): number => {
    if (size <= 1) return 1;

    const leftSize = leftSubtreeSize(size);
    const rightSize = size - 1 - leftSize;

    // Choose which of the (size - 1) non-root keys go left; the rest go
    // right. Both sides are then filled recursively in every valid way.
    const waysToChoose = choose(size - 1, leftSize);
    return (waysToChoose * ways(leftSize) * ways(rightSize)) % MOD;
  };

  return ways(n);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The same recursive structure, but with a proper modular binomial coefficient (using precomputed factorials and modular inverses, since the brute-force floating point division above breaks down and loses precision for larger n) and memoisation on subtree size -- crucially, the number of ways only depends on how many nodes a subtree has, not on which specific keys, so results for a given size are computed once and reused everywhere that size recurs.',
        time: 'O(n) with memoisation (each distinct subtree size is solved once)',
        space: 'O(n)',
        code: `function waysToFormMaxHeap(n: number): number {
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

  const factorial = new Array<bigint>(n + 1).fill(1n);
  for (let i = 1; i <= n; i++) factorial[i] = (factorial[i - 1] * BigInt(i)) % MOD;

  const choose = (total: number, pick: number): bigint => {
    if (pick < 0 || pick > total) return 0n;
    const denom = (factorial[pick] * factorial[total - pick]) % MOD;
    return (factorial[total] * modInverse(denom)) % MOD;
  };

  const leftSubtreeSize = (size: number): number => {
    if (size <= 1) return 0;
    const height = Math.floor(Math.log2(size));
    const nodesAboveLastLevel = 2 ** height - 1;
    const lastLevelCount = size - nodesAboveLastLevel;
    const maxLastLevel = 2 ** height;
    const leftLastLevel = Math.min(lastLevelCount, maxLastLevel / 2);
    return nodesAboveLastLevel / 2 + leftLastLevel;
  };

  // Memoised on subtree size -- the key insight that avoids recomputation.
  const memo = new Map<number, bigint>();

  const ways = (size: number): bigint => {
    if (size <= 1) return 1n;
    if (memo.has(size)) return memo.get(size)!;

    const leftSize = leftSubtreeSize(size);
    const rightSize = size - 1 - leftSize;

    const result =
      (choose(size - 1, leftSize) * ways(leftSize) % MOD) * ways(rightSize) % MOD;

    memo.set(size, result);
    return result;
  };

  return Number(ways(n));
}`,
      },
    ],
  },
  {
    problemId: 'magician-and-chocolates',
    statement:
      'There are B bags of chocolates, the ith bag containing A[i] chocolates. Each day you take all the chocolates from whichever bag currently has the most, and that bag is then refilled to floor(that amount / 2). Given the number of days D, return the total number of chocolates collected after D days, modulo 10^9 + 7.',
    starter: `function magicianAndChocolates(a: number[], d: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Simulate exactly what is described: on each of the D days, scan every bag to find the current maximum, take it, add it to the running total, and refill that bag to half its value. Direct and easy to check against the definition, but re-scanning all B bags on every one of D days repeats the same comparisons over and over.',
        time: 'O(D * B)',
        space: 'O(B)',
        code: `function magicianAndChocolates(a: number[], d: number): number {
  const MOD = 1_000_000_007;
  const bags = [...a];
  let total = 0;

  for (let day = 0; day < d; day++) {
    let maxIndex = 0;
    for (let i = 1; i < bags.length; i++) {
      if (bags[i] > bags[maxIndex]) maxIndex = i;
    }

    total = (total + bags[maxIndex]) % MOD;
    bags[maxIndex] = Math.floor(bags[maxIndex] / 2);
  }

  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          '"Find and remove the current maximum, then reinsert a derived value" is exactly what a max-heap is for. Build the heap once from the initial bag counts; each day, pop the maximum, add it to the total, and push back its halved value. Every operation is O(log B) instead of an O(B) linear scan.',
        time: 'O((B + D) log B)',
        space: 'O(B)',
        code: `function magicianAndChocolates(a: number[], d: number): number {
  const MOD = 1_000_000_007;

  // Max-heap, built from the initial bag counts.
  const heap = [...a];
  const siftDown = (i: number) => {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < heap.length && heap[left] > heap[largest]) largest = left;
      if (right < heap.length && heap[right] > heap[largest]) largest = right;
      if (largest === i) break;
      [heap[i], heap[largest]] = [heap[largest], heap[i]];
      i = largest;
    }
  };
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i);

  let total = 0;

  for (let day = 0; day < d; day++) {
    const max = heap[0];
    total = (total + max) % MOD;

    heap[0] = Math.floor(max / 2); // refill, in place at the root
    siftDown(0); // restore the heap property after the change
  }

  return total;
}`,
      },
    ],
  },
  {
    problemId: 'find-k-pairs-with-smallest-sums',
    statement:
      'Given two integer arrays nums1 and nums2, both sorted ascending, and an integer k, return the k pairs (u, v) with u from nums1 and v from nums2 that have the smallest sums u + v.',
    starter: `function kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Form every possible pair, sort them all by sum, and take the first k. It answers the question directly, but generates and sorts the full |nums1| * |nums2| set of pairs when only k of them are ever needed.',
        time: 'O(nm log(nm))',
        space: 'O(nm)',
        code: `function kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {
  const pairs: number[][] = [];

  for (const u of nums1) {
    for (const v of nums2) {
      pairs.push([u, v]);
    }
  }

  return pairs.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).slice(0, k);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Because both arrays are sorted, the globally smallest sum is always nums1[0] + nums2[0]. Use a min-heap seeded with the pair (i, 0) for every index i in nums1 up to k of them (there is never a need to look further into nums1 than the first k values, since each contributes at most one pair to the final answer among the k smallest) -- each representing the best current partner from nums2 for that nums1 value. Popping the smallest sum and pushing its successor (i, j+1) as replacement, k times, produces exactly the k pairs with the smallest sums.',
        time: 'O(k log(min(k, n)))',
        space: 'O(min(k, n))',
        code: `function kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {
  if (nums1.length === 0 || nums2.length === 0 || k === 0) return [];

  // Min-heap of [sum, i, j].
  const heap: [number, number, number][] = [];
  const siftUp = (idx: number) => {
    let i = idx;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] <= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const siftDown = () => {
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < heap.length && heap[left][0] < heap[smallest][0]) smallest = left;
      if (right < heap.length && heap[right][0] < heap[smallest][0]) smallest = right;
      if (smallest === i) break;
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }
  };
  const push = (item: [number, number, number]) => {
    heap.push(item);
    siftUp(heap.length - 1);
  };
  const pop = (): [number, number, number] => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown();
    }
    return top;
  };

  // Seed with the best partner (index 0 in nums2) for the first
  // min(k, nums1.length) values of nums1.
  const seedCount = Math.min(k, nums1.length);
  for (let i = 0; i < seedCount; i++) {
    push([nums1[i] + nums2[0], i, 0]);
  }

  const result: number[][] = [];
  while (result.length < k && heap.length > 0) {
    const [, i, j] = pop();
    result.push([nums1[i], nums2[j]]);

    if (j + 1 < nums2.length) {
      push([nums1[i] + nums2[j + 1], i, j + 1]);
    }
  }

  return result;
}`,
      },
    ],
  },
];
