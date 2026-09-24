import type { Solution } from '@/lib/types';

/**
 * Greedy algorithms.
 *
 * The hard part is never the code -- it is justifying that the local choice is
 * safe. Each solution below names the exchange argument that makes the greedy
 * step provably optimal, because that is what an interviewer is listening for.
 */
export const greedySolutions: Solution[] = [
  {
    problemId: 'activity-selection',
    statement:
      'Given start and finish times of activities, select the maximum number that can be performed by one person, assuming only one activity at a time.',
    starter: `function activitySelection(starts: number[], finishes: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort by finish time and always take the next activity that starts after the last one taken. The exchange argument: the activity finishing earliest leaves the most room for everything after it, so any optimal schedule can be rewritten to start with it without getting worse. Sorting by start time or by duration both fail.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function activitySelection(starts: number[], finishes: number[]): number {
  // Pair them up so sorting keeps each start with its finish.
  const activities = starts.map((start, i) => ({ start, finish: finishes[i] }));

  // Sort by FINISH time. This is the whole algorithm -- sorting by start
  // time or by duration gives wrong answers.
  activities.sort((a, b) => a.finish - b.finish);

  let count = 0;
  let lastFinish = -Infinity;

  for (const activity of activities) {
    // Compatible with everything chosen so far.
    if (activity.start >= lastFinish) {
      count++;
      lastFinish = activity.finish;
    }
  }

  return count;
}`,
      },
    ],
  },

  {
    problemId: 'minimum-number-of-arrows-to-burst-balloons',
    statement:
      'Balloons are given as horizontal intervals. An arrow shot at position x bursts every balloon whose interval contains x. Return the minimum arrows needed to burst them all.',
    starter: `function findMinArrowShots(points: number[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The same shape as activity selection. Sort by end coordinate and shoot at the end of the first balloon — that position bursts the maximum number of overlapping balloons, because any balloon still unburst must start after it. Then skip everything that arrow covered and repeat.',
        time: 'O(n log n)',
        space: 'O(1) beyond the sort',
        code: `function findMinArrowShots(points: number[][]): number {
  if (points.length === 0) return 0;

  // Sort by the END coordinate, exactly as in activity selection.
  const balloons = [...points].sort((a, b) => a[1] - b[1]);

  let arrows = 1;

  // Shooting at the first balloon's END maximises what else it catches:
  // anything overlapping this balloon must contain that point.
  let arrowAt = balloons[0][1];

  for (const [start, end] of balloons) {
    // This balloon starts after the last arrow, so it survived and needs
    // one of its own.
    if (start > arrowAt) {
      arrows++;
      arrowAt = end;
    }
  }

  return arrows;
}`,
      },
    ],
  },

  {
    problemId: 'meeting-rooms-ii',
    statement:
      'Given meeting time intervals, return the minimum number of conference rooms required.',
    starter: `function minMeetingRooms(intervals: number[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The answer is the maximum number of meetings overlapping at any instant. Separate the start and end times into two sorted lists and sweep them together, incrementing on a start and decrementing on an end. The peak count is the answer. Ties matter: process an end before a start at the same time, since a room frees up exactly as the next meeting begins.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function minMeetingRooms(intervals: number[][]): number {
  if (intervals.length === 0) return 0;

  // The two endpoints no longer need to stay paired -- only the timeline
  // of events matters, so sort them independently.
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let rooms = 0;
  let peak = 0;
  let endIndex = 0;

  for (const start of starts) {
    // Free every room whose meeting has already finished. Using <= means a
    // meeting ending exactly when another starts releases its room first,
    // so they can share.
    while (ends[endIndex] <= start) {
      rooms--;
      endIndex++;
    }

    rooms++;
    peak = Math.max(peak, rooms);
  }

  return peak;
}`,
      },
    ],
  },

  {
    problemId: 'jump-game-ii',
    statement:
      'Given an array where each value is the maximum jump length from that position, return the minimum number of jumps to reach the last index. The end is always reachable.',
    starter: `function jump(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A breadth-first search done implicitly. Think in levels: with one jump you can reach some range of indices, with two jumps a further range, and so on. Sweep forward tracking the end of the current level and the furthest reachable overall; when you reach the current level end, that is one jump spent and the next level begins.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function jump(nums: number[]): number {
  let jumps = 0;

  // The furthest index reachable with the jumps already counted.
  let currentEnd = 0;

  // The furthest index reachable with one more jump from anything seen.
  let furthest = 0;

  // Stop before the last index: stepping onto it is what the final counted
  // jump achieves, and looping to it would count one jump too many.
  for (let i = 0; i < nums.length - 1; i++) {
    furthest = Math.max(furthest, i + nums[i]);

    // Exhausted the current level: every index up to currentEnd has been
    // considered, so commit to a jump and move the boundary out.
    if (i === currentEnd) {
      jumps++;
      currentEnd = furthest;
    }
  }

  return jumps;
}`,
      },
    ],
  },

  {
    problemId: 'partition-labels',
    statement:
      'Partition a string into as many parts as possible so that each letter appears in at most one part. Return the sizes of those parts.',
    starter: `function partitionLabels(s: string): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Record the last index of every character first. Then sweep, extending the current partition end to the furthest last-occurrence seen so far. When the scan position reaches that end, no character inside the partition appears later, so it can be closed.',
        time: 'O(n)',
        space: 'O(1) — at most 26 entries',
        code: `function partitionLabels(s: string): number[] {
  // Last position each character appears. Written repeatedly, so the final
  // value for each character is its last index.
  const lastIndex = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    lastIndex.set(s[i], i);
  }

  const sizes: number[] = [];
  let partitionStart = 0;
  let partitionEnd = 0;

  for (let i = 0; i < s.length; i++) {
    // The partition must stretch at least to this character's last use.
    partitionEnd = Math.max(partitionEnd, lastIndex.get(s[i])!);

    // Reached the furthest commitment: nothing inside recurs later, so the
    // partition can close here.
    if (i === partitionEnd) {
      sizes.push(partitionEnd - partitionStart + 1);
      partitionStart = i + 1;
    }
  }

  return sizes;
}`,
      },
    ],
  },

  {
    problemId: 'task-scheduler',
    statement:
      'Given task labels and a cooldown n, where identical tasks must be separated by at least n intervals, return the least time needed to finish all tasks.',
    starter: `function leastInterval(tasks: string[], n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A counting argument rather than a simulation. The most frequent task forces the skeleton: it creates (maxCount - 1) gaps of length n+1, plus a final slot for each task tied at that maximum. Other tasks fill the idle slots. If there are more tasks than slots, there is no idle time at all and the answer is simply the task count — hence the max.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function leastInterval(tasks: string[], n: number): number {
  const counts = new Map<string, number>();
  for (const task of tasks) {
    counts.set(task, (counts.get(task) ?? 0) + 1);
  }

  const maxCount = Math.max(...counts.values());

  // How many distinct tasks are tied for most frequent -- each needs its own
  // slot in the final block.
  let tiedAtMax = 0;
  for (const count of counts.values()) {
    if (count === maxCount) tiedAtMax++;
  }

  // The most frequent task lays down a frame: (maxCount - 1) blocks of
  // length (n + 1), then a final block holding every tied task.
  const framed = (maxCount - 1) * (n + 1) + tiedAtMax;

  // If there are more tasks than the frame has slots, the extras fill every
  // idle gap and the schedule is completely packed -- so it simply takes
  // as long as there are tasks.
  return Math.max(framed, tasks.length);
}`,
      },
    ],
  },

  {
    problemId: 'candy',
    statement:
      'Children stand in a line with ratings. Each gets at least one candy, and a child with a higher rating than an immediate neighbour must get more candies than that neighbour. Return the minimum total.',
    starter: `function candy(ratings: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Two sweeps, because each child has two constraints pulling in opposite directions and one pass can only satisfy one of them. Left to right enforces the left-neighbour rule; right to left enforces the right-neighbour rule, taking the maximum so the first pass work is not destroyed. That max is the crux.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function candy(ratings: number[]): number {
  const n = ratings.length;

  // Everyone starts with the minimum of one candy.
  const candies = new Array<number>(n).fill(1);

  // Left to right: satisfy "more than my LEFT neighbour".
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      candies[i] = candies[i - 1] + 1;
    }
  }

  // Right to left: satisfy "more than my RIGHT neighbour". Math.max is
  // essential -- assigning directly would undo the first pass and break
  // the left-side constraint.
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }

  return candies.reduce((sum, c) => sum + c, 0);
}`,
      },
    ],
  },

  {
    problemId: 'fractional-knapsack',
    statement:
      'Given item weights and values and a knapsack capacity, maximise the value carried. Items may be broken into fractions.',
    starter: `function fractionalKnapsack(weights: number[], values: number[], capacity: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort by value per unit weight and take greedily, splitting the last item to fill the remaining space exactly. Greedy is provably optimal here precisely because fractions are allowed — swapping any amount of a lower-density item for a higher-density one never loses. Note the 0/1 version, where items cannot be split, is NOT solvable this way and needs DP.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function fractionalKnapsack(weights: number[], values: number[], capacity: number): number {
  const items = weights.map((weight, i) => ({
    weight,
    value: values[i],
    // Value per unit weight is the only thing that matters here.
    density: values[i] / weight,
  }));

  // Densest first.
  items.sort((a, b) => b.density - a.density);

  let remaining = capacity;
  let total = 0;

  for (const item of items) {
    if (remaining === 0) break;

    if (item.weight <= remaining) {
      // Fits whole.
      total += item.value;
      remaining -= item.weight;
    } else {
      // Take the fraction that exactly fills the bag. This is what makes
      // greedy optimal -- in the 0/1 version you cannot do this, and the
      // greedy answer is then wrong.
      total += item.density * remaining;
      remaining = 0;
    }
  }

  return total;
}`,
      },
    ],
  },

  {
    problemId: 'job-sequencing-problem',
    statement:
      'Each job has a deadline and a profit, and takes one unit of time. Only one job runs at a time. Maximise total profit.',
    starter: `function jobSequencing(deadlines: number[], profits: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Sort by profit descending and schedule each job as LATE as its deadline allows. Scheduling late keeps the early slots free for jobs with tighter deadlines, which is what makes the greedy safe. Taking the most profitable first guarantees no better arrangement exists.',
        time: 'O(n * maxDeadline)',
        space: 'O(maxDeadline)',
        code: `function jobSequencing(deadlines: number[], profits: number[]): number {
  const jobs = deadlines.map((deadline, i) => ({ deadline, profit: profits[i] }));

  // Most profitable first -- take the big wins while slots are plentiful.
  jobs.sort((a, b) => b.profit - a.profit);

  const maxDeadline = Math.max(...deadlines);

  // slots[t] = is time unit t already taken? Index 0 is unused so slot
  // numbers line up with deadlines.
  const slots = new Array<boolean>(maxDeadline + 1).fill(false);

  let totalProfit = 0;

  for (const job of jobs) {
    // Search backwards from the deadline for a free slot. Scheduling as
    // LATE as possible preserves early slots for tighter-deadline jobs,
    // which is exactly why this greedy works.
    for (let t = job.deadline; t > 0; t--) {
      if (slots[t]) continue;

      slots[t] = true;
      totalProfit += job.profit;
      break;
    }
  }

  return totalProfit;
}`,
      },
    ],
  },

  {
    problemId: 'find-the-largest-pair-sum-in-an-unsorted-array',
    statement:
      'Given an unsorted array, find the largest sum of any two distinct elements.',
    starter: `function largestPairSum(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Sort descending and add the first two.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function largestPairSum(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[0] + sorted[1];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Only the two largest values matter, so track them in a single pass. The ordering of the two updates matters — the old maximum must be demoted to second place before the new value takes its spot.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function largestPairSum(nums: number[]): number {
  let largest = -Infinity;
  let second = -Infinity;

  for (const value of nums) {
    if (value > largest) {
      // Order matters: demote the old maximum BEFORE overwriting it, or it
      // is lost and second place ends up wrong.
      second = largest;
      largest = value;
    } else if (value > second) {
      second = value;
    }
  }

  return largest + second;
}`,
      },
    ],
  },

  {
    problemId: 'maximum-sum-combinations',
    statement:
      'Given two arrays of equal length and an integer k, return the k largest sums formed by taking one element from each array.',
    starter: `function maxSumCombinations(a: number[], b: number[], k: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Form all n^2 sums, sort descending and take the first k. Fine for small inputs, wasteful otherwise.',
        time: 'O(n^2 log n)',
        space: 'O(n^2)',
        code: `function maxSumCombinations(a: number[], b: number[], k: number): number[] {
  const sums: number[] = [];

  for (const x of a) {
    for (const y of b) sums.push(x + y);
  }

  return sums.sort((x, y) => y - x).slice(0, k);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sort both arrays descending. The largest sum is necessarily the two largest elements, and from any pair of indices the next candidates are only one step down in either array. Explore that lattice with a max-heap, guarding against revisiting the same index pair. Only k pops are needed.',
        time: 'O(n log n + k log k)',
        space: 'O(k)',
        code: `function maxSumCombinations(a: number[], b: number[], k: number): number[] {
  // Descending, so index 0 in each array holds the largest value.
  const x = [...a].sort((p, q) => q - p);
  const y = [...b].sort((p, q) => q - p);

  // Max-heap of candidate index pairs, ordered by their sum.
  const heap: { sum: number; i: number; j: number }[] = [];
  const seen = new Set<string>();

  const push = (i: number, j: number) => {
    const key = i + ',' + j;

    // Each index pair can be reached from two directions, so this guard
    // prevents counting the same combination twice.
    if (seen.has(key)) return;
    seen.add(key);

    heap.push({ sum: x[i] + y[j], i, j });

    let index = heap.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heap[parent].sum >= heap[index].sum) break;
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };

  const pop = () => {
    const top = heap[0];
    const last = heap.pop()!;

    if (heap.length > 0) {
      heap[0] = last;
      let index = 0;
      for (;;) {
        const left = 2 * index + 1;
        const right = left + 1;
        let largest = index;

        if (left < heap.length && heap[left].sum > heap[largest].sum) largest = left;
        if (right < heap.length && heap[right].sum > heap[largest].sum) largest = right;

        if (largest === index) break;
        [heap[index], heap[largest]] = [heap[largest], heap[index]];
        index = largest;
      }
    }

    return top;
  };

  // The single largest sum pairs the largest of each array.
  push(0, 0);

  const result: number[] = [];

  while (result.length < k && heap.length > 0) {
    const { sum, i, j } = pop();
    result.push(sum);

    // From (i, j) the next best candidates step down one position in
    // either array -- everything larger has already been considered.
    if (i + 1 < x.length) push(i + 1, j);
    if (j + 1 < y.length) push(i, j + 1);
  }

  return result;
}`,
      },
    ],
  },
];
