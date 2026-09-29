/**
 * Runs as a Web Worker (spawned from runInSandbox.ts), never on the main
 * thread -- so a bug like an infinite loop in the user's code can only spin
 * this worker, not freeze the tab's UI thread.
 *
 * The project's tsconfig only loads the "dom" lib, not "webworker" (the two
 * declare conflicting globals, e.g. `self`), so this file narrows `self` by
 * hand instead of relying on ambient DedicatedWorkerGlobalScope typings.
 */
import { runTests, stripTypes, type TestRunResult } from './runTests';
import type { TestCase } from './types';

export interface ConsoleRunResult {
  logs: string[];
  error: string | null;
}

export type CodeJob =
  | { kind: 'test'; source: string; functionName: string; tests: TestCase[] }
  | { kind: 'console'; source: string };

function runConsole(source: string): ConsoleRunResult {
  const captured: string[] = [];

  const format = (v: unknown) => {
    if (typeof v === 'string') return v;
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  };

  const sandboxConsole = {
    log: (...args: unknown[]) => captured.push(args.map(format).join(' ')),
    error: (...args: unknown[]) => captured.push(`Error: ${args.map(format).join(' ')}`),
  };

  try {
    new Function('console', stripTypes(source))(sandboxConsole);
    return { logs: captured, error: null };
  } catch (err) {
    return { logs: captured, error: err instanceof Error ? err.message : String(err) };
  }
}

const worker = self as unknown as {
  onmessage: ((e: MessageEvent<CodeJob>) => void) | null;
  postMessage(message: TestRunResult | ConsoleRunResult): void;
};

worker.onmessage = (e) => {
  const job = e.data;
  worker.postMessage(
    job.kind === 'test'
      ? runTests(job.source, job.functionName, job.tests)
      : runConsole(job.source),
  );
};
