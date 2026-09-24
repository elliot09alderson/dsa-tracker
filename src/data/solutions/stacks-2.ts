import type { Solution } from '@/lib/types';

/**
 * Stacks, part two.
 *
 * More monotonic-stack problems (next/nearest greater and smaller element,
 * in both single- and two-array form), an expression-parsing classic, and a
 * greedy problem whose cleanest proof happens to run through a stack-like
 * running total. Split from stacks.ts purely to keep each file a readable
 * size.
 */
export const stacks2Solutions: Solution[] = [
  {
    problemId: 'nearest-smaller-element',
    statement:
      'Given an array A, for every element find the nearest element to its LEFT that is strictly smaller than it. If no such element exists, use -1 for that position.',
    starter: `function nearestSmallerElement(a: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every position, scan leftward one element at a time until a smaller value turns up (or the start of the array is reached). Direct, but for an array with no smaller elements to the left of most positions -- e.g. a strictly increasing array -- this rescans a long stretch for every single index.',
        time: 'O(n^2)',
        space: 'O(1) beyond the output',
        code: `function nearestSmallerElement(a: number[]): number[] {
  const result = new Array<number>(a.length).fill(-1);

  for (let i = 0; i < a.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (a[j] < a[i]) {
        result[i] = a[j];
        break;
      }
    }
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A monotonic increasing stack of values seen so far. Before processing a new element, pop off everything on the stack that is greater than or equal to it -- those values can never be the answer for anything later, since the current element is both closer and smaller. Whatever remains on top of the stack after popping is exactly the nearest smaller element to the left; then push the current element for future positions to compare against.',
        time: 'O(n) -- each element is pushed and popped at most once',
        space: 'O(n)',
        code: `function nearestSmallerElement(a: number[]): number[] {
  const result = new Array<number>(a.length).fill(-1);
  const stack: number[] = []; // values, kept increasing bottom to top

  for (let i = 0; i < a.length; i++) {
    // Discard everything that cannot be the answer for a[i] -- it is not
    // smaller, so it is useless here, and being farther away than a[i]
    // itself would be, it is useless for everything after a[i] too.
    while (stack.length > 0 && stack[stack.length - 1] >= a[i]) {
      stack.pop();
    }

    result[i] = stack.length > 0 ? stack[stack.length - 1] : -1;
    stack.push(a[i]);
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'next-greater-element-i',
    statement:
      'Given two arrays nums1 and nums2, where nums1 is a subset of nums2 (all elements distinct), for each element of nums1 find its next greater element to the right in nums2 (the first element in nums2 to its right that is larger). Use -1 where none exists.',
    starter: `function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For each value in nums1, locate it inside nums2, then scan rightward from there until a larger value appears. It answers the question directly, but both the search for the value and the rightward scan cost time proportional to nums2’s length, for every element of nums1.',
        time: 'O(|nums1| * |nums2|)',
        space: 'O(1) beyond the output',
        code: `function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  return nums1.map((target) => {
    const startIndex = nums2.indexOf(target);
    for (let j = startIndex + 1; j < nums2.length; j++) {
      if (nums2[j] > target) return nums2[j];
    }
    return -1;
  });
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Precompute the next-greater-to-the-right answer for EVERY element of nums2 in one pass, using a monotonic decreasing stack: walk nums2 left to right, and whenever the current value exceeds whatever is on top of the stack, that stack element has just found its answer -- pop it and record the current value as its next greater element, repeating until the stack top is bigger (or empty). Store all of these answers in a hash map, then answer each nums1 query with a single O(1) lookup.',
        time: 'O(|nums1| + |nums2|)',
        space: 'O(|nums2|)',
        code: `function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const nextGreater = new Map<number, number>();
  const stack: number[] = []; // values waiting for their next greater element

  for (const value of nums2) {
    // Every stack value smaller than "value" has just found its answer.
    while (stack.length > 0 && stack[stack.length - 1] < value) {
      nextGreater.set(stack.pop()!, value);
    }
    stack.push(value);
  }
  // Anything left on the stack never found a greater element to its right.
  for (const value of stack) nextGreater.set(value, -1);

  return nums1.map((target) => nextGreater.get(target) ?? -1);
}`,
      },
    ],
  },
  {
    problemId: 'infix-to-postfix',
    statement:
      'Given a valid infix arithmetic expression containing single-letter or single-digit operands, the operators +, -, *, /, ^, and parentheses, convert it to postfix (Reverse Polish) notation.',
    starter: `function infixToPostfix(expression: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Recursive descent over index ranges, re-deriving structure from scratch at every call instead of remembering anything between calls. To convert a range: strip a fully-wrapping pair of parentheses if the range has one; otherwise re-scan the whole range left to right, tracking a paren-depth counter, to find the LAST operator sitting at depth 0 with the lowest precedence (scanning left to right and taking every candidate, so the last -- rightmost -- one at the lowest precedence wins, matching left-to-right evaluation order); then recursively convert the two sides around it and concatenate them with that operator appended. Correct, but the depth-tracking scan across the whole range is redone at every one of the O(n) recursive calls.',
        time: 'O(n^2) -- an O(n) rescan at each of O(n) recursive calls',
        space: 'O(n) recursion depth plus the output',
        code: `function infixToPostfix(expression: string): string {
  const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
  const isOperator = (ch: string) => ch in precedence;

  // Converts expression[lo..hi] (inclusive) to postfix.
  const convert = (lo: number, hi: number): string => {
    // A single operand needs no further work.
    if (lo === hi) return expression[lo];

    // Strip one fully-wrapping pair of parentheses, if present -- checked
    // by re-walking the whole range and confirming depth never returns to
    // zero before the very last character.
    if (expression[lo] === '(' && expression[hi] === ')') {
      let depth = 0;
      let fullyWraps = true;
      for (let i = lo; i <= hi; i++) {
        if (expression[i] === '(') depth++;
        else if (expression[i] === ')') depth--;
        if (depth === 0 && i !== hi) { fullyWraps = false; break; }
      }
      if (fullyWraps) return convert(lo + 1, hi - 1);
    }

    // Re-scan the range for the last lowest-precedence operator at depth 0.
    let depth = 0;
    let splitIndex = -1;
    let splitPrecedence = Infinity;

    for (let i = lo; i <= hi; i++) {
      const ch = expression[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (depth === 0 && isOperator(ch) && precedence[ch] <= splitPrecedence) {
        splitPrecedence = precedence[ch];
        splitIndex = i; // keep the LAST match at this precedence
      }
    }

    const left = convert(lo, splitIndex - 1);
    const right = convert(splitIndex + 1, hi);
    return left + right + expression[splitIndex];
  };

  return convert(0, expression.length - 1);
}`,
      },
      {
        name: 'Optimal',
        idea:
          "The classic shunting-yard-style single pass with an operator stack. Read the expression left to right: an operand goes straight to the output; '(' is pushed; ')' pops operators to the output until the matching '(' is found and discarded; any other operator pops everything of GREATER OR EQUAL precedence from the stack to the output first (this is what enforces evaluation order without ever re-scanning), then pushes itself. At the end, drain whatever remains on the stack to the output.",
        time: 'O(n)',
        space: 'O(n)',
        code: `function infixToPostfix(expression: string): string {
  const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
  const isOperator = (ch: string) => ch in precedence;

  const output: string[] = [];
  const operatorStack: string[] = [];

  for (const ch of expression) {
    if (ch === ' ') continue;

    if (/[a-zA-Z0-9]/.test(ch)) {
      output.push(ch); // operand goes straight to output
      continue;
    }

    if (ch === '(') {
      operatorStack.push(ch);
      continue;
    }

    if (ch === ')') {
      // Pop everything back to the matching '(' -- it is discarded, not output.
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        output.push(operatorStack.pop()!);
      }
      operatorStack.pop(); // discard the '('
      continue;
    }

    // ch is an operator: first flush anything of >= precedence already
    // waiting, since it must be applied before this new operator.
    while (
      operatorStack.length > 0 &&
      operatorStack[operatorStack.length - 1] !== '(' &&
      precedence[operatorStack[operatorStack.length - 1]] >= precedence[ch]
    ) {
      output.push(operatorStack.pop()!);
    }
    operatorStack.push(ch);
  }

  // Drain whatever operators remain.
  while (operatorStack.length > 0) {
    output.push(operatorStack.pop()!);
  }

  return output.join('');
}`,
      },
    ],
  },
  {
    problemId: 'gas-station',
    statement:
      'There are n gas stations in a circle. gas[i] is the fuel available at station i, and cost[i] is the fuel needed to travel from station i to station i+1. Starting with an empty tank at one station, determine the starting station index from which a complete circuit is possible, or -1 if none exists (the answer, if it exists, is unique).',
    starter: `function canCompleteCircuit(gas: number[], cost: number[]): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every station as a starting point, and for each one simulate the whole trip around the circle, tracking the tank level and failing the moment it would go negative. Direct, but simulating a full circuit for every one of the n candidate starts is quadratic.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function canCompleteCircuit(gas: number[], cost: number[]): number {
  const n = gas.length;

  for (let start = 0; start < n; start++) {
    let tank = 0;
    let feasible = true;

    for (let step = 0; step < n; step++) {
      const station = (start + step) % n;
      tank += gas[station] - cost[station];
      if (tank < 0) { feasible = false; break; }
    }

    if (feasible) return start;
  }

  return -1;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "One linear pass, using two facts together. First, a solution can only exist at all if the total gas across the whole circuit is at least the total cost -- otherwise no starting point works, since the whole trip is a net loss regardless of order. Second, if the running tank total (accumulated from a candidate start) ever goes negative at some station, NONE of the stations between the current start and that failing station could have been a valid start either -- starting closer to the failure only means arriving at it with even less fuel. So the moment the running total dips below zero, discard every station tried so far and restart the candidate at the very next station -- the whole array is scanned only once.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function canCompleteCircuit(gas: number[], cost: number[]): number {
  let totalSurplus = 0; // gas - cost, summed over the WHOLE circuit
  let runningTank = 0;  // gas - cost, summed since the current candidate start
  let candidateStart = 0;

  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    totalSurplus += diff;
    runningTank += diff;

    // Running dry means no station from candidateStart through i could
    // have worked -- the next station is the only hope left to try.
    if (runningTank < 0) {
      candidateStart = i + 1;
      runningTank = 0;
    }
  }

  // A feasible circuit exists at all only if the trip nets non-negative.
  return totalSurplus >= 0 ? candidateStart : -1;
}`,
      },
    ],
  },
];
