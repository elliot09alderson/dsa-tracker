'use client';

/**
 * A dependency-free practice editor.
 *
 * Deliberately a styled <textarea> rather than Monaco or CodeMirror: it adds
 * no packages, loads instantly, and for typing out an interview solution the
 * editor behaviours that matter are Tab-to-indent and the code surviving a
 * reload. Both are handled here.
 *
 * Syntax colouring is the classic transparent-textarea trick, not a real
 * editor widget: a highlighted <pre> sits behind the textarea, the textarea's
 * own text is painted transparent (only its caret stays visible), and the two
 * are kept pixel-aligned by sharing identical font/padding and by copying the
 * textarea's scroll position onto the <pre> on every scroll. Typing, the
 * caret, and text selection are all still the browser's native textarea
 * behaviour -- only the paint colour changes.
 *
 * Two ways to execute:
 *   Run tests -- calls your function against the problem's cases and reports
 *                pass/fail. Available when the problem ships test cases.
 *   Run       -- plain execution, capturing console.log. Useful for poking at
 *                something without a harness.
 *
 * Format hands the current text to Prettier and swaps in the result. Prettier
 * itself is dynamically imported so it never costs anything until the button
 * is actually clicked -- the editor's own bundle stays as small as the rest
 * of this file's dependency-free approach promises.
 */

import { useRef, useState } from 'react';
import type { TestOutcome } from '@/lib/runTests';
import { runTestsSandboxed, runConsoleSandboxed } from '@/lib/runInSandbox';
import { highlightCode } from '@/lib/highlightCode';
import type { TestCase } from '@/lib/types';

/** Opener -> matching closer, for auto-pairing and indent-on-Enter. */
const OPEN_TO_CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
const CLOSERS = new Set(Object.values(OPEN_TO_CLOSE));
const QUOTES = new Set(['"', "'"]);

interface Props {
  value: string;
  onChange(next: string): void;
  onReset(): void;
  /** Cases to check against; omitted for problems without a harness. */
  tests?: TestCase[];
  /** The function the runner should call. Required alongside `tests`. */
  functionName?: string;
  /** Current solved state, shown as a toggle right in the editor toolbar. */
  solved?: boolean;
  /** Flips solved state; omitted where the caller has no progress to track. */
  onToggleSolved?(): void;
}

export default function CodeEditor({
  value,
  onChange,
  onReset,
  tests,
  functionName,
  solved,
  onToggleSolved,
}: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [outcomes, setOutcomes] = useState<TestOutcome[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formatting, setFormatting] = useState(false);
  const [running, setRunning] = useState(false);
  const highlightRef = useRef<HTMLPreElement>(null);

  const canTest = Boolean(tests?.length && functionName);

  /** Keeps the highlighted layer scrolled to match the (invisible) textarea text on top of it. */
  const syncHighlightScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = e.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
  };

  /**
   * Classic editor behaviours layered onto the plain textarea:
   *  - Tab indents instead of moving focus out.
   *  - Enter continues the current line's indent, and adds a level after an
   *    opener; Enter right inside an empty `{}`/`[]`/`()` pair splits it onto
   *    three lines with the closer dedented, caret left on the middle line.
   *  - Typing an opening bracket or quote inserts its match and leaves the
   *    caret between them; typing the closing character where one is already
   *    sitting (from auto-pairing) types over it instead of doubling up.
   *  - Backspace on an empty pair (caret between `{` and `}` etc.) removes
   *    both sides at once.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;

    if (e.key === 'Tab') {
      e.preventDefault();
      onChange(`${value.slice(0, start)}  ${value.slice(end)}`);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();

      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const indent = value.slice(lineStart, start).match(/^[ \t]*/)?.[0] ?? '';
      const charBefore = value[start - 1];
      const charAfter = value[end];
      const opensNewBlock = charBefore !== undefined && charBefore in OPEN_TO_CLOSE;

      if (opensNewBlock && charAfter === OPEN_TO_CLOSE[charBefore]) {
        // Caret is right inside a freshly-opened, still-empty pair: split
        // it onto three lines instead of just continuing the indent.
        const inner = `${indent}  `;
        const insertion = `\n${inner}\n${indent}`;
        onChange(value.slice(0, start) + insertion + value.slice(end));
        const caret = start + 1 + inner.length;
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = caret;
        });
        return;
      }

      const insertion = `\n${indent}${opensNewBlock ? '  ' : ''}`;
      onChange(value.slice(0, start) + insertion + value.slice(end));
      const caret = start + insertion.length;
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = caret;
      });
      return;
    }

    if (e.key in OPEN_TO_CLOSE) {
      const opener = e.key;
      const closer = OPEN_TO_CLOSE[opener];
      const isQuote = QUOTES.has(opener);

      if (start !== end) {
        // Wrap the selection in the pair rather than replacing it.
        e.preventDefault();
        const selected = value.slice(start, end);
        onChange(`${value.slice(0, start)}${opener}${selected}${closer}${value.slice(end)}`);
        requestAnimationFrame(() => {
          el.selectionStart = start + 1;
          el.selectionEnd = start + 1 + selected.length;
        });
        return;
      }

      if (isQuote && value[start] === opener) {
        // A matching quote is already sitting here (from auto-pairing) --
        // type over it instead of inserting a second one.
        e.preventDefault();
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start + 1;
        });
        return;
      }

      // Typing a quote right after a letter/number is usually an apostrophe
      // (don't, it's) rather than the start of a string -- don't auto-pair.
      if (isQuote && /[A-Za-z0-9_]/.test(value[start - 1] ?? '')) {
        return;
      }

      e.preventDefault();
      onChange(`${value.slice(0, start)}${opener}${closer}${value.slice(start)}`);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 1;
      });
      return;
    }

    if (CLOSERS.has(e.key) && start === end && value[start] === e.key) {
      // Closing character already sits here (auto-inserted) -- step over it.
      e.preventDefault();
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 1;
      });
      return;
    }

    if (e.key === 'Backspace' && start === end && start > 0) {
      const before = value[start - 1];
      const after = value[start];
      if (OPEN_TO_CLOSE[before] === after) {
        e.preventDefault();
        onChange(value.slice(0, start - 1) + value.slice(start + 1));
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = start - 1;
        });
      }
    }
  };

  const clearOutput = () => {
    setLogs([]);
    setOutcomes(null);
    setError(null);
  };

  const handleRunTests = async () => {
    if (!tests || !functionName) return;
    clearOutput();
    setRunning(true);
    const result = await runTestsSandboxed(value, functionName, tests);
    setRunning(false);
    setError(result.error);
    setOutcomes(result.outcomes);
  };

  const handleRun = async () => {
    clearOutput();
    setRunning(true);
    // Runs in a Web Worker (see runInSandbox.ts) rather than inline, so a
    // stray infinite loop in the snippet times out instead of freezing the tab.
    const result = await runConsoleSandboxed(value);
    setRunning(false);
    setError(result.error);
    setLogs(
      result.error
        ? result.logs
        : result.logs.length
          ? result.logs
          : ['(ran with no output — call your function and console.log the result)'],
    );
  };

  const handleFormat = async () => {
    setFormatting(true);
    setError(null);
    try {
      const [{ format }, tsPlugin, estreePlugin] = await Promise.all([
        import('prettier/standalone'),
        import('prettier/plugins/typescript'),
        import('prettier/plugins/estree'),
      ]);
      const formatted = await format(value, {
        parser: 'typescript',
        plugins: [tsPlugin, estreePlugin],
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        printWidth: 90,
      });
      onChange(formatted.replace(/\n+$/, ''));
    } catch (err) {
      // Almost always a syntax error in what's currently typed -- Prettier
      // can't format code it can't parse.
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setFormatting(false);
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
          {onToggleSolved && (
            <button
              onClick={onToggleSolved}
              className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                solved
                  ? 'border-easy bg-easy/15 text-easy'
                  : 'border-border text-muted hover:border-muted hover:text-text'
              }`}
            >
              {solved ? '✓ Solved' : 'Mark solved'}
            </button>
          )}
          {canTest && (
            <button
              onClick={() => void handleRunTests()}
              disabled={running}
              className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-bg transition hover:opacity-90 disabled:opacity-60"
            >
              {running ? 'Running…' : 'Run tests'}
            </button>
          )}
          <button
            onClick={() => void handleRun()}
            disabled={running}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition disabled:opacity-60 ${
              canTest
                ? 'border border-border text-muted hover:border-muted hover:text-text'
                : 'bg-accent text-bg hover:opacity-90'
            }`}
          >
            {running ? 'Running…' : 'Run'}
          </button>
          <button
            onClick={() => void handleFormat()}
            disabled={formatting}
            className="rounded-md border border-border px-3 py-1 text-xs text-muted transition hover:border-muted hover:text-text disabled:opacity-60"
          >
            {formatting ? 'Formatting…' : 'Format'}
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

      {/* The highlighted <pre> sits behind the textarea; the textarea's own
          text is transparent, so this shows through as the "colour" of what
          you type. Both share identical font/padding so they line up. */}
      <div className="relative min-h-70 flex-1 bg-surface">
        <pre
          ref={highlightRef}
          aria-hidden="true"
          className="mono pointer-events-none absolute inset-0 overflow-hidden p-3 text-[13px] leading-relaxed whitespace-pre-wrap"
        >
          <code>{highlightCode(value)}</code>
          {'\n' /* keeps a trailing blank line from visually collapsing */}
        </pre>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncHighlightScroll}
          spellCheck={false}
          placeholder="Write your solution here…"
          className="mono absolute inset-0 resize-none bg-transparent p-3 text-[13px] leading-relaxed text-transparent caret-[var(--text)] outline-none placeholder:text-muted"
        />
      </div>

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
