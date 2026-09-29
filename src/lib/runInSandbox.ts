/**
 * Executes practice code in a dedicated Web Worker instead of on the main
 * thread, with a hard timeout. A bug like an infinite `while` loop in the
 * user's solution can then only hang the worker -- it gets terminated and
 * reported as a timeout instead of freezing the whole tab.
 *
 * Each call spins up a fresh worker and terminates it once it settles.
 * Workers are cheap to start, and starting clean avoids any state leaking
 * between one run and the next.
 */
import type { CodeJob, ConsoleRunResult } from './codeWorker';
import type { TestRunResult } from './runTests';
import type { TestCase } from './types';

const TIMEOUT_MS = 3000;

function runJob<T>(job: CodeJob, timeoutMs: number): Promise<T | null> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./codeWorker.ts', import.meta.url));

    const settle = (value: T | null) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(value);
    };

    const timer = setTimeout(() => settle(null), timeoutMs);

    worker.onmessage = (e: MessageEvent<T>) => settle(e.data);
    worker.onerror = () => settle(null);

    worker.postMessage(job);
  });
}

export async function runTestsSandboxed(
  source: string,
  functionName: string,
  tests: TestCase[],
  timeoutMs = TIMEOUT_MS,
): Promise<TestRunResult> {
  const result = await runJob<TestRunResult>(
    { kind: 'test', source, functionName, tests },
    timeoutMs,
  );
  return (
    result ?? {
      outcomes: [],
      error: `Timed out after ${timeoutMs / 1000}s — this usually means an infinite loop.`,
      passedCount: 0,
    }
  );
}

export async function runConsoleSandboxed(
  source: string,
  timeoutMs = TIMEOUT_MS,
): Promise<ConsoleRunResult> {
  const result = await runJob<ConsoleRunResult>({ kind: 'console', source }, timeoutMs);
  return (
    result ?? {
      logs: [],
      error: `Timed out after ${timeoutMs / 1000}s — this usually means an infinite loop.`,
    }
  );
}
