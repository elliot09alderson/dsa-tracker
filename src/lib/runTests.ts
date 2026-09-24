/**
 * Test runner for the practice editor.
 *
 * The user's code is evaluated in a Function sandbox, the solution function is
 * pulled out by name, and each case is called and compared. This is a practice
 * aid, not a security boundary -- it runs the user's own code in their own
 * browser, which is exactly what they asked for.
 */

import type { TestCase } from './types';

export interface TestOutcome {
  passed: boolean;
  label: string;
  /** Arguments as written, for display on failure. */
  args: string;
  expected: string;
  actual: string;
}

export interface TestRunResult {
  outcomes: TestOutcome[];
  /** Set when the code failed to compile or the function was not found. */
  error: string | null;
  passedCount: number;
}

/**
 * Strip the common TypeScript annotations so TS-flavoured practice code can be
 * executed by the browser. Not a real compiler -- it handles the forms the
 * starters and solutions use.
 *
 * Comments are removed first. That matters more than it looks: a comment
 * containing a colon ("// Directions in spiral order: right, down") would
 * otherwise be treated as a type annotation and the regex would swallow the
 * code that follows it.
 */
export function stripTypes(source: string): string {
  // Horizontal whitespace only -- never let an annotation match run across a
  // newline and eat the following statement.
  const TYPE = "[A-Za-z_$][\\w$.<>\\[\\]|,'\" \\t]*";

  return (
    source
      // Comments first, for the reason above.
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')
      // Generic type arguments: new Map<string, number>() -> new Map()
      .replace(/new\s+(Map|Set|Array|WeakMap|WeakSet)\s*<[^>]*>/g, 'new $1')
      // Return annotations before a body or an arrow:
      //   ): number[] {   ->  ) {
      //   ): boolean =>   ->  ) =>
      .replace(new RegExp(`\\)[ \\t]*:[ \\t]*${TYPE}(?=[ \\t]*(\\{|=>))`, 'g'), ')')
      // Parameter and variable annotations: (a: number[], b: string) -> (a, b)
      .replace(new RegExp(`([A-Za-z_$][\\w$]*)[ \\t]*:[ \\t]*${TYPE}(?=[,)=])`, 'g'), '$1')
      // Standalone declarations, with or without an initializer:
      //   let x: number | null = null;   and   let result: number;
      .replace(new RegExp(`\\b(let|const|var)[ \\t]+([A-Za-z_$][\\w$]*)[ \\t]*:[ \\t]*${TYPE}(?=[=;])`, 'g'), '$1 $2 ')
      // "as T" casts.
      .replace(/\s+as\s+[A-Za-z_$][\w$.<>[\]|]*/g, '')
      // Non-null assertions: stack.pop()! and node!.next
      .replace(/!(?=[.;,)\]}\s])/g, '')
  );
}

/** Readable rendering of a value for the results table. */
function show(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

/** Deep structural equality, good enough for the value shapes these use. */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
    );
  }

  return false;
}

/**
 * Compare two arrays ignoring order, including the order of nested arrays.
 * Used for problems like 3Sum where any ordering of the triplets is correct.
 */
function unorderedEqual(a: unknown, b: unknown): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return deepEqual(a, b);
  if (a.length !== b.length) return false;

  // Canonicalise by sorting the serialised form of each element, so two
  // collections holding the same items in any order compare equal.
  const key = (v: unknown) => show(Array.isArray(v) ? [...v].sort() : v);
  const sortedA = a.map(key).sort();
  const sortedB = b.map(key).sort();

  return sortedA.every((v, i) => v === sortedB[i]);
}

export function runTests(
  source: string,
  functionName: string,
  tests: TestCase[],
): TestRunResult {
  let solution: unknown;

  try {
    // Evaluate the code, then hand back the named function. Returning it by
    // name is why `functionName` has to be declared alongside the tests.
    const factory = new Function(
      `${stripTypes(source)}\n;return typeof ${functionName} === 'function' ? ${functionName} : null;`,
    );
    solution = factory();
  } catch (err) {
    return {
      outcomes: [],
      error: err instanceof Error ? err.message : String(err),
      passedCount: 0,
    };
  }

  if (typeof solution !== 'function') {
    return {
      outcomes: [],
      error: `No function named "${functionName}" was found. Keep that name so the tests can call it.`,
      passedCount: 0,
    };
  }

  const outcomes: TestOutcome[] = tests.map((test, index) => {
    // Deep-clone the arguments so a mutating solution cannot corrupt the
    // case definitions for the runs that follow.
    const args = JSON.parse(JSON.stringify(test.args)) as unknown[];
    const label = test.label ?? `Case ${index + 1}`;

    try {
      const returned = (solution as (...a: unknown[]) => unknown)(...args);

      // In-place problems are judged on the mutated argument, not the return.
      const actual = test.mutates !== undefined ? args[test.mutates] : returned;

      const passed = test.unordered
        ? unorderedEqual(actual, test.expected)
        : deepEqual(actual, test.expected);

      return {
        passed,
        label,
        args: show(test.args),
        expected: show(test.expected),
        actual: show(actual),
      };
    } catch (err) {
      return {
        passed: false,
        label,
        args: show(test.args),
        expected: show(test.expected),
        actual: `threw: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  });

  return {
    outcomes,
    error: null,
    passedCount: outcomes.filter((o) => o.passed).length,
  };
}
