import type { Solution } from '@/lib/types';

/**
 * Stacks. Several of these share one idea -- the monotonic stack -- which is
 * worth recognising: whenever a problem asks for the "next greater" or
 * "previous smaller" element, a stack holding indices in sorted order solves
 * it in one pass.
 */
export const stacksSolutions: Solution[] = [
  {
    problemId: 'valid-parentheses',
    statement:
      "Given a string containing only the characters ()[]{}, determine whether the brackets are correctly matched and properly nested.",
    starter: `function isValid(s: string): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Repeatedly remove any adjacent matching pair from the string. If you end with an empty string it was valid. Correct, but each removal rescans the string, so it is quadratic.',
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function isValid(s: string): boolean {
  let current = s;
  let previousLength = -1;

  // Keep stripping innermost pairs until nothing changes.
  while (current.length !== previousLength) {
    previousLength = current.length;
    current = current.replace('()', '').replace('[]', '').replace('{}', '');
  }

  // Everything cancelled out means every bracket found its partner.
  return current.length === 0;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Push every opening bracket. On a closing bracket, the only thing it can legally match is the most recent unclosed opener — which is exactly what the top of a stack holds. If the top does not match, or the stack is empty, it is invalid. An empty stack at the end means everything was closed.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function isValid(s: string): boolean {
  // Map each closer to the opener it requires.
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

  const stack: string[] = [];

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
      continue;
    }

    // A closing bracket must match the most recently opened one. pop()
    // returns undefined on an empty stack, which correctly fails the check
    // for a closer with nothing open.
    if (stack.pop() !== pairs[char]) {
      return false;
    }
  }

  // Anything left is an opener that was never closed.
  return stack.length === 0;
}`,
      },
    ],
  },

  {
    problemId: 'min-stack',
    statement:
      'Design a stack supporting push, pop, top and retrieving the minimum element, all in constant time.',
    starter: `class MinStack {
  push(val: number): void {}
  pop(): void {}
  top(): number { return 0; }
  getMin(): number { return 0; }
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Keep a plain array and scan it for the minimum whenever getMin is called. Push, pop and top are O(1), but getMin is O(n), which the problem forbids.',
        time: 'O(n) for getMin',
        space: 'O(n)',
        code: `class MinStack {
  private items: number[] = [];

  push(val: number): void {
    this.items.push(val);
  }

  pop(): void {
    this.items.pop();
  }

  top(): number {
    return this.items[this.items.length - 1];
  }

  getMin(): number {
    // Scanning every call is what makes this too slow.
    return Math.min(...this.items);
  }
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Keep a second stack holding the minimum as of each push. Because the two stacks move together, the top of the min stack is always the minimum of everything currently in the main stack — and popping removes exactly the right entry. The key insight is that when a value is popped, the minimum must revert to what it was before that value was pushed, which is precisely the previous entry on the min stack.',
        time: 'O(1) for every operation',
        space: 'O(n)',
        code: `class MinStack {
  private items: number[] = [];

  // mins[i] is the smallest value among items[0..i]. It rises and falls in
  // lockstep with the main stack, so its top is always the current minimum.
  private mins: number[] = [];

  push(val: number): void {
    this.items.push(val);

    // The new minimum is either this value or the one already standing.
    const currentMin = this.mins.length === 0 ? val : Math.min(val, this.mins[this.mins.length - 1]);
    this.mins.push(currentMin);
  }

  pop(): void {
    // Both stacks must stay the same height, so pop them together. This is
    // what makes the minimum revert correctly to its earlier value.
    this.items.pop();
    this.mins.pop();
  }

  top(): number {
    return this.items[this.items.length - 1];
  }

  getMin(): number {
    return this.mins[this.mins.length - 1];
  }
}`,
      },
    ],
  },

  {
    problemId: 'daily-temperatures',
    statement:
      'Given an array of daily temperatures, return an array where each element is the number of days you must wait for a warmer temperature. Use 0 if no warmer day follows.',
    starter: `function dailyTemperatures(temperatures: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'For each day, scan forward until you find a warmer one and record the distance.',
        time: 'O(n^2)',
        space: 'O(1) extra',
        code: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer = new Array<number>(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        answer[i] = j - i;
        break; // the FIRST warmer day is what we want
      }
    }
  }

  return answer;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A monotonic decreasing stack of indices. Each day, any day still waiting on the stack whose temperature is lower than today has just found its answer — pop it and record the distance. Today is then pushed to wait for its own warmer day. Every index is pushed and popped at most once, so despite the inner loop the whole thing is linear.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const answer = new Array<number>(n).fill(0);

  // Indices of days still waiting for a warmer one. Their temperatures are
  // always in decreasing order from bottom to top -- that is the invariant.
  const waiting: number[] = [];

  for (let today = 0; today < n; today++) {
    // Today resolves every colder day still on the stack.
    while (
      waiting.length > 0 &&
      temperatures[today] > temperatures[waiting[waiting.length - 1]]
    ) {
      const coldDay = waiting.pop()!;
      answer[coldDay] = today - coldDay;
    }

    // Today now waits for its own warmer day. Pushing it here keeps the
    // stack decreasing, because everything larger was just popped off.
    waiting.push(today);
  }

  // Indices still on the stack never found a warmer day, and the array was
  // pre-filled with 0 for exactly that case.
  return answer;
}`,
      },
    ],
  },

  {
    problemId: 'largest-rectangle-in-histogram',
    statement:
      'Given an array of bar heights where each bar has width 1, find the area of the largest rectangle that fits entirely within the histogram.',
    starter: `function largestRectangleArea(heights: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Every maximal rectangle is limited by some bar — its shortest one. So for each bar, expand left and right while the bars are at least as tall, and compute that width times this height.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function largestRectangleArea(heights: number[]): number {
  let best = 0;

  for (let i = 0; i < heights.length; i++) {
    const height = heights[i];

    // How far left can a rectangle of this height extend?
    let left = i;
    while (left > 0 && heights[left - 1] >= height) left--;

    // And how far right?
    let right = i;
    while (right < heights.length - 1 && heights[right + 1] >= height) right++;

    best = Math.max(best, height * (right - left + 1));
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The brute force rescans for each bar the two things a monotonic stack can track in one pass: the nearest shorter bar to the left and to the right. Keep a stack of indices with increasing heights. When a shorter bar arrives, every taller bar on the stack has found its right boundary — pop it, and its left boundary is whatever is below it on the stack. Appending a sentinel height of 0 flushes everything at the end without a second loop.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function largestRectangleArea(heights: number[]): number {
  // The trailing 0 is a sentinel: it is shorter than every real bar, so it
  // forces the stack to drain at the end instead of needing a cleanup loop.
  const bars = [...heights, 0];

  // Indices whose heights increase from bottom to top.
  const stack: number[] = [];
  let best = 0;

  for (let right = 0; right < bars.length; right++) {
    // Every bar taller than the current one can extend no further right,
    // so its maximal rectangle is now fully determined.
    while (stack.length > 0 && bars[stack[stack.length - 1]] >= bars[right]) {
      const height = bars[stack.pop()!];

      // The left boundary is the bar below on the stack -- the nearest one
      // that is shorter. With an empty stack, the rectangle reaches index 0,
      // so the width is the full span up to "right".
      const leftBoundary = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = right - leftBoundary - 1;

      best = Math.max(best, height * width);
    }

    stack.push(right);
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'evaluate-reverse-polish-notation',
    statement:
      'Evaluate an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, * and /, division truncates toward zero, and the expression is always valid.',
    starter: `function evalRPN(tokens: string[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'RPN is designed for a stack. Push numbers; on an operator, pop the two most recent operands, apply it, and push the result back. The one detail that catches people is order — the first value popped is the right-hand operand, which matters for subtraction and division.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function evalRPN(tokens: string[]): number {
  const stack: number[] = [];

  for (const token of tokens) {
    // Anything that is not an operator is a number. Checking membership in
    // the operator set is safer than testing for a digit, because negative
    // numbers like "-11" would otherwise look like a minus sign.
    if (token !== '+' && token !== '-' && token !== '*' && token !== '/') {
      stack.push(Number(token));
      continue;
    }

    // Order matters: the SECOND operand comes off first.
    const right = stack.pop()!;
    const left = stack.pop()!;

    let result: number;
    switch (token) {
      case '+':
        result = left + right;
        break;
      case '-':
        result = left - right;
        break;
      case '*':
        result = left * right;
        break;
      default:
        // Truncate toward zero, which differs from Math.floor for negatives:
        // -7 / 2 must be -3, not -4.
        result = Math.trunc(left / right);
    }

    stack.push(result);
  }

  // A valid expression leaves exactly one value behind.
  return stack[0];
}`,
      },
    ],
  },

  {
    problemId: 'asteroid-collision',
    statement:
      'Given an array of asteroids where the value is size and the sign is direction (positive moves right, negative moves left), return the state after all collisions. Two asteroids moving toward each other destroy the smaller; equal sizes destroy both.',
    starter: `function asteroidCollision(asteroids: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A collision happens only when a right-moving asteroid is followed by a left-moving one. Use a stack of surviving asteroids: a left-mover must fight everything right-moving still on the stack, popping while it wins, stopping if it loses, and both vanishing on a tie. Anything else just gets pushed. The control flow is fiddlier than the idea, so the loop uses an explicit "survived" flag rather than trying to be clever.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function asteroidCollision(asteroids: number[]): number[] {
  const stack: number[] = [];

  for (const asteroid of asteroids) {
    let survived = true;

    // A collision requires the incoming asteroid to move left (< 0) and the
    // one on top of the stack to move right (> 0). Any other combination
    // means they are moving apart or in the same direction.
    while (survived && asteroid < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
      const standing = stack[stack.length - 1];

      if (standing < Math.abs(asteroid)) {
        // The standing asteroid is smaller and is destroyed. The incoming
        // one continues and may hit the next one down.
        stack.pop();
        continue;
      }

      if (standing === Math.abs(asteroid)) {
        // Equal sizes: both are destroyed.
        stack.pop();
      }

      // Either it was a tie, or the standing asteroid was larger. Either way
      // the incoming asteroid does not survive.
      survived = false;
    }

    if (survived) stack.push(asteroid);
  }

  return stack;
}`,
      },
    ],
  },

  {
    problemId: 'decode-string',
    statement:
      'Decode a string encoded as k[encoded_string], meaning the bracketed section repeats k times. Encodings may be nested, for example 3[a2[c]] decodes to accaccacc.',
    starter: `function decodeString(s: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Nesting means you need to remember partial work while you go deeper, which is exactly what a stack is for. Keep two stacks — one for the repeat counts, one for the string built so far. On an opening bracket, save the current state and start fresh. On a closing bracket, restore the outer string and append the inner one repeated. Multi-digit numbers need accumulating rather than reading one character.',
        time: 'O(output length)',
        space: 'O(nesting depth)',
        code: `function decodeString(s: string): string {
  // Repeat counts waiting for their closing bracket.
  const counts: number[] = [];
  // Partially built strings from the enclosing levels.
  const parts: string[] = [];

  let current = '';
  let number = 0;

  for (const char of s) {
    if (char >= '0' && char <= '9') {
      // Accumulate: "12[" must read as twelve, not one then two.
      number = number * 10 + Number(char);
      continue;
    }

    if (char === '[') {
      // Descend a level: stash what we have and start a fresh buffer.
      counts.push(number);
      parts.push(current);
      number = 0;
      current = '';
      continue;
    }

    if (char === ']') {
      // Close a level: repeat what we just built and glue it onto the
      // string from the enclosing level.
      const repeat = counts.pop()!;
      const outer = parts.pop()!;
      current = outer + current.repeat(repeat);
      continue;
    }

    // An ordinary character just extends the current buffer.
    current += char;
  }

  return current;
}`,
      },
    ],
  },

  {
    problemId: 'next-greater-element-ii',
    statement:
      'Given a circular array, return the next greater element for each position. Search wraps around past the end, and the answer is -1 where none exists.',
    starter: `function nextGreaterElements(nums: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For each index, walk forward up to n-1 steps using modulo to wrap, and take the first larger value.',
        time: 'O(n^2)',
        space: 'O(1) extra',
        code: `function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n).fill(-1);

  for (let i = 0; i < n; i++) {
    // Check the other n-1 positions, wrapping with modulo.
    for (let step = 1; step < n; step++) {
      const j = (i + step) % n;
      if (nums[j] > nums[i]) {
        answer[i] = nums[j];
        break;
      }
    }
  }

  return answer;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The usual monotonic stack, with one adjustment for circularity: iterate over 2n positions using modulo, so every index gets a second chance to be resolved by an element that comes before it in the original array. Only push during the first pass — the second pass exists purely to resolve what is still waiting.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n).fill(-1);

  // Indices still looking for a greater element, decreasing by value.
  const waiting: number[] = [];

  // Two laps: the second lets elements near the end be resolved by elements
  // near the start, which is what "circular" means here.
  for (let pass = 0; pass < 2 * n; pass++) {
    const i = pass % n;

    while (waiting.length > 0 && nums[i] > nums[waiting[waiting.length - 1]]) {
      answer[waiting.pop()!] = nums[i];
    }

    // Only push on the first lap. Pushing again would duplicate work and
    // could overwrite a correct answer.
    if (pass < n) waiting.push(i);
  }

  return answer;
}`,
      },
    ],
  },
];
