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
} as const;

// One alternation, tried in priority order at each position: comments beat
// strings beat numbers beat plain identifiers, so e.g. a "//" inside a
// string never gets mistaken for a comment start.
const TOKEN_RE =
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\.?\d*\b|[A-Za-z_$][A-Za-z0-9_$]*/g;

/**
 * Tokenizes `code` and returns it as an array of React nodes -- coloured
 * spans for the recognised tokens, plain strings for everything between
 * them (whitespace, punctuation, operators). Concatenating every node's
 * text reproduces `code` exactly, which matters when this backs the
 * transparent-textarea overlay in CodeEditor.
 */
export function highlightCode(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    // Whatever sat between the previous token and this one is punctuation,
    // whitespace, or an operator -- left uncoloured, in the surrounding text.
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
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

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));

  return nodes;
}
