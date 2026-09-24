'use client';

/**
 * A dependency-free practice editor.
 *
 * Deliberately a styled <textarea> rather than Monaco or CodeMirror: it adds
 * no packages, loads instantly, and for typing out an interview solution the
 * editor behaviours that matter are Tab-to-indent and the code surviving a
 * reload. Both are handled here.
 *
 * Two ways to execute:
 *   Run tests -- calls your function against the problem's cases and reports
 *                pass/fail. Available when the problem ships test cases.
 *   Run       -- plain execution, capturing console.log. Useful for poking at
 *                something without a harness.
 */

import { useState } from 'react';
import { runTests, stripTypes, type TestOutcome } from '@/lib/runTests';
import type { TestCase } from '@/lib/types';

interface Props {
  value: string;
  onChange(next: string): void;
  onReset(): void;
  /** Cases to check against; omitted for problems without a harness. */
  tests?: TestCase[];
  /** The function the runner should call. Required alongside `tests`. */
  functionName?: string;
}

export default function CodeEditor({ value, onChange, onReset, tests, functionName }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [outcomes, setOutcomes] = useState<TestOutcome[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canTest = Boolean(tests?.length && functionName);

  /** Tab should indent, not move focus out of the editor. */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();

    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;
    onChange(`${value.slice(0, start)}  ${value.slice(end)}`);

    // Put the caret after the two spaces we just inserted.
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2;
    });
  };

  const clearOutput = () => {
    setLogs([]);
    setOutcomes(null);
    setError(null);
  };

  const handleRunTests = () => {
    if (!tests || !functionName) return;
    clearOutput();

    const result = runTests(value, functionName, tests);
    setError(result.error);
    setOutcomes(result.outcomes);
  };

  const handleRun = () => {
    clearOutput();
    const captured: string[] = [];

    const format = (v: unknown) => {
      if (typeof v === 'string') return v;
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    };

    try {
      // Give the snippet its own console so output is captured here rather
      // than disappearing into the browser devtools.
      const sandboxConsole = {
        log: (...args: unknown[]) => captured.push(args.map(format).join(' ')),
        error: (...args: unknown[]) => captured.push(`Error: ${args.map(format).join(' ')}`),
      };

      new Function('console', stripTypes(value))(sandboxConsole);

      setLogs(
        captured.length
          ? captured
          : ['(ran with no output — call your function and console.log the result)'],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLogs(captured);
    }
  };

  const passed = outcomes?.filter((o) => o.passed).length ?? 0;
  const total = outcomes?.length ?? 0;
  const allPassed = outcomes !== null && total > 0 && passed === total;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-semibold text-muted">Your attempt</span>
        <div className="flex gap-2">
          {canTest && (
            <button
              onClick={handleRunTests}
              className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-bg transition hover:opacity-90"
            >
              Run tests
            </button>
          )}
          <button
            onClick={handleRun}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              canTest
                ? 'border border-border text-muted hover:border-muted hover:text-text'
                : 'bg-accent text-bg hover:opacity-90'
            }`}
          >
            Run
          </button>
          <button
            onClick={() => {
              onReset();
              clearOutput();
            }}
            className="rounded-md border border-border px-3 py-1 text-xs text-muted transition hover:border-muted hover:text-text"
          >
            Reset
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        placeholder="Write your solution here…"
        className="mono min-h-70 flex-1 resize-none bg-surface p-3 text-[13px] leading-relaxed outline-none placeholder:text-muted"
      />

      {/* A compile error or a missing function name, shown before any results. */}
      {error !== null && (
        <div className="border-t border-border bg-bg px-3 py-2">
          <pre className="mono text-xs whitespace-pre-wrap text-hard">{error}</pre>
        </div>
      )}

      {/* Test results */}
      {outcomes !== null && outcomes.length > 0 && (
        <div className="max-h-56 overflow-auto border-t border-border bg-bg px-3 py-2">
          <p
            className={`mb-1.5 text-xs font-semibold ${allPassed ? 'text-easy' : 'text-hard'}`}
          >
            {allPassed ? '✓ ' : ''}
            {passed} / {total} passed
          </p>

          <ul className="space-y-1.5">
            {outcomes.map((o) => (
              <li key={o.label} className="text-[11px] leading-relaxed">
                <span className={o.passed ? 'text-easy' : 'text-hard'}>
                  {o.passed ? '✓' : '✗'} {o.label}
                </span>
                {/* Only failures need the detail; passes stay compact. */}
                {!o.passed && (
                  <div className="mono mt-0.5 ml-3 text-muted">
                    <div>in {o.args}</div>
                    <div>expected {o.expected}</div>
                    <div className="text-hard">got {o.actual}</div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Plain console output from the Run button */}
      {logs.length > 0 && (
        <div className="border-t border-border bg-bg px-3 py-2">
          <p className="mb-1 text-[10px] font-semibold tracking-wider text-muted uppercase">
            Output
          </p>
          <pre className="mono max-h-40 overflow-auto text-xs whitespace-pre-wrap">
            {logs.join('\n')}
          </pre>
        </div>
      )}

      <p className="border-t border-border px-3 py-1.5 text-[10px] text-muted">
        {canTest
          ? 'Run tests calls your function against real cases. Keep the function name.'
          : 'Runs in your browser as JavaScript. Call your function and console.log the result.'}
      </p>
    </div>
  );
}
