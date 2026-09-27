/**
 * A small, dependency-free TypeScript/JavaScript syntax highlighter.
 *
 * The rest of the app deliberately avoids heavy editor packages (see the
 * comment atop CodeEditor.tsx) -- Monaco or a highlighting library like
 * Prism would work, but they add real weight for what is, here, just
 * colouring a handful of short interview solutions. A single regex pass is
 * plenty: find comments, strings, numbers, keywords and "identifier right
 * before a (" in one scan, colour those, and leave everything else (brackets,
 * operators, plain identifiers) in the surrounding text colour.
 *
 * Brackets and indentation get their own, separate passes (see
 * `bracketColors` and `indentGuideStarts` below) because both need to reason
 * about the *whole* source at once -- a bracket's colour depends on how deep
 * it is nested overall, and an indent guide belongs to a whole line, not a
 * single regex match.
 *
 * This is intentionally not a real parser -- it can be fooled by pathological
 * input (a "/" inside a regex literal, say) -- but for the well-formed
 * solution snippets this app displays, that trade-off is the right one.
 */

import type { ReactNode } from 'react';

const KEYWORDS = new Set([
  'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'default', 'break', 'continue', 'class', 'extends', 'implements',
  'interface', 'type', 'new', 'this', 'super', 'typeof', 'instanceof', 'in', 'of',
  'void', 'delete', 'try', 'catch', 'finally', 'throw', 'import', 'export', 'from',
  'as', 'async', 'await', 'yield', 'static', 'public', 'private', 'protected',
  'readonly', 'enum', 'null', 'undefined', 'true', 'false', 'get', 'set', 'namespace',
]);

// Primitive/utility type names -- coloured distinctly from control-flow
// keywords so a type annotation reads differently from a statement.
const TYPE_KEYWORDS = new Set([
  'number', 'string', 'boolean', 'any', 'unknown', 'never', 'object', 'symbol',
  'bigint', 'Array', 'Map', 'Set', 'Record', 'Promise', 'Partial', 'ReadonlyArray',
]);

const COLOR = {
  comment: '#64748b', // slate -- dimmed and italic, so it visually recedes
  string: '#a3e635', // lime
  number: '#fb923c', // orange
  keyword: '#c084fc', // violet
  type: '#38bdf8', // sky, matches the app's accent colour
  fn: '#60a5fa', // blue -- an identifier immediately followed by "("
  bracketError: '#f87171', // red -- an unclosed opener or a stray closer
} as const;

// Cycled by nesting depth so a matching `(`/`)`, `[`/`]` or `{`/`}` pair
// always shares one colour, and colours repeat only once you're several
// levels deeper than any of these solutions realistically nest.
const BRACKET_DEPTH_COLORS = ['#facc15', '#e879f9', '#2dd4bf', '#818cf8'];

const BRACKET_PAIRS: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
const OPENERS = new Set(Object.keys(BRACKET_PAIRS));
const CLOSERS = new Set(Object.values(BRACKET_PAIRS));

// One alternation, tried in priority order at each position: comments beat
// strings beat numbers beat plain identifiers, so e.g. a "//" inside a
// string never gets mistaken for a comment start.
const TOKEN_RE =
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\.?\d*\b|[A-Za-z_$][A-Za-z0-9_$]*/g;

// Same comment/string alternation, used on its own to find the spans where a
// bracket character is just text (inside a string or a comment) rather than
// real structure -- e.g. the braces in `"{}"` shouldn't affect nesting depth.
const STRING_OR_COMMENT_RE =
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;

function protectedRanges(code: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  STRING_OR_COMMENT_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = STRING_OR_COMMENT_RE.exec(code)) !== null) {
    ranges.push([m.index, m.index + m[0].length]);
  }
  return ranges;
}

/**
 * Walks the whole source with a stack, colouring every real bracket by how
 * deeply it's nested so a matching pair reads at a glance, and marking every
 * bracket that has no partner -- an unclosed opener left on the stack at the
 * end, or a closer that shows up with nothing (or the wrong thing) to
 * match -- in red, so that's the one thing that stands out while hunting
 * for it.
 */
function bracketColors(code: string): Map<number, string> {
  const colors = new Map<number, string>();
  const ranges = protectedRanges(code);
  let rangeIndex = 0;
  const stack: Array<{ char: string; index: number }> = [];

  for (let i = 0; i < code.length; i++) {
    while (rangeIndex < ranges.length && i >= ranges[rangeIndex][1]) rangeIndex++;
    const inProtectedRange = rangeIndex < ranges.length && i >= ranges[rangeIndex][0];
    if (inProtectedRange) {
      i = ranges[rangeIndex][1] - 1; // skip past the string/comment
      continue;
    }

    const char = code[i];
    if (OPENERS.has(char)) {
      stack.push({ char, index: i });
    } else if (CLOSERS.has(char)) {
      const top = stack[stack.length - 1];
      if (top && BRACKET_PAIRS[top.char] === char) {
        stack.pop();
        const color = BRACKET_DEPTH_COLORS[stack.length % BRACKET_DEPTH_COLORS.length];
        colors.set(top.index, color);
        colors.set(i, color);
      } else {
        colors.set(i, COLOR.bracketError);
      }
    }
  }

  // Whatever is still on the stack never got closed.
  for (const { index } of stack) colors.set(index, COLOR.bracketError);

  return colors;
}

const INDENT_SIZE = 2; // matches the two spaces CodeEditor's Tab handler inserts

/**
 * Absolute indices where a two-space indentation group begins. Grouping by
 * *position in the line* rather than by token means the guide lines stay put
 * no matter what's been typed elsewhere on the line.
 */
function indentGuideStarts(code: string): Set<number> {
  const starts = new Set<number>();
  let offset = 0;
  for (const line of code.split('\n')) {
    const leading = /^ */.exec(line)![0].length;
    for (let g = 0; g + INDENT_SIZE <= leading; g += INDENT_SIZE) starts.add(offset + g);
    offset += line.length + 1; // +1 for the newline this split() consumed
  }
  return starts;
}

/**
 * Tokenizes `code` and returns it as an array of React nodes -- coloured
 * spans for the recognised tokens, plain strings for everything between
 * them (whitespace, punctuation, operators) except for the brackets and
 * leading indentation handled below. Concatenating every node's text
 * reproduces `code` exactly, which matters when this backs the
 * transparent-textarea overlay in CodeEditor.
 */
export function highlightCode(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const brColors = bracketColors(code);
  const guideStarts = indentGuideStarts(code);
  let key = 0;

  // Renders a stretch of code that TOKEN_RE didn't claim -- i.e. whitespace,
  // operators, and brackets. Plain characters are batched into one string so
  // this doesn't emit a separate node per character.
  const renderPlain = (text: string, absStart: number) => {
    let plain = '';
    const flushPlain = () => {
      if (plain) nodes.push(plain);
      plain = '';
    };

    for (let i = 0; i < text.length; ) {
      const absIndex = absStart + i;

      if (guideStarts.has(absIndex)) {
        flushPlain();
        nodes.push(
          <span key={key++} style={{ boxShadow: 'inset 1px 0 0 0 var(--border)' }}>
            {text.slice(i, i + INDENT_SIZE)}
          </span>,
        );
        i += INDENT_SIZE;
        continue;
      }

      const color = brColors.get(absIndex);
      if (color) {
        flushPlain();
        nodes.push(
          <span key={key++} style={{ color, fontWeight: 600 }}>
            {text[i]}
          </span>,
        );
        i += 1;
        continue;
      }

      plain += text[i];
      i += 1;
    }

    flushPlain();
  };

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIndex) {
      renderPlain(code.slice(lastIndex, match.index), lastIndex);
    }

    const text = match[0];
    let color: string | null = null;
    let italic = false;

    if (text.startsWith('//') || text.startsWith('/*')) {
      color = COLOR.comment;
      italic = true;
    } else if (text[0] === '`' || text[0] === '"' || text[0] === "'") {
      color = COLOR.string;
    } else if (/^\d/.test(text)) {
      color = COLOR.number;
    } else if (KEYWORDS.has(text)) {
      color = COLOR.keyword;
    } else if (TYPE_KEYWORDS.has(text)) {
      color = COLOR.type;
    } else {
      // A plain identifier reads as a function when a "(" follows it,
      // skipping any spaces in between -- covers both calls (`foo(`) and
      // declarations (`function foo (`).
      let after = TOKEN_RE.lastIndex;
      while (code[after] === ' ') after++;
      if (code[after] === '(') color = COLOR.fn;
    }

    nodes.push(
      color ? (
        <span key={key++} style={{ color, fontStyle: italic ? 'italic' : undefined }}>
          {text}
        </span>
      ) : (
        text
      ),
    );

    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < code.length) renderPlain(code.slice(lastIndex), lastIndex);

  return nodes;
}
