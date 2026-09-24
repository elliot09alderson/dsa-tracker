import type { Solution } from '@/lib/types';

/** Strings. */
export const stringsSolutions: Solution[] = [
  {
    problemId: 'longest-common-prefix',
    statement:
      'Find the longest common prefix shared by an array of strings. Return an empty string if there is none.',
    starter: `function longestCommonPrefix(strs: string[]): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Take the first string as a candidate prefix, then trim it one character at a time until every other string starts with it.',
        time: 'O(total characters)',
        space: 'O(1)',
        code: `function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return '';

  let prefix = strs[0];

  for (const word of strs) {
    // Shrink the candidate until this word agrees with it.
    while (!word.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);

      // Nothing left in common.
      if (prefix === '') return '';
    }
  }

  return prefix;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Compare column by column instead. Walk character positions, checking every string at that position, and stop at the first mismatch or the first string that runs out. It exits as early as possible rather than trimming a full candidate repeatedly.',
        time: 'O(shortest string * count)',
        space: 'O(1)',
        code: `function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return '';

  // Walk one character position at a time across ALL strings.
  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i];

    for (const word of strs) {
      // Either this string ended, or it disagrees here. Either way the
      // prefix stops just before this position.
      if (i === word.length || word[i] !== char) {
        return strs[0].slice(0, i);
      }
    }
  }

  // Never mismatched, so the whole first string is the prefix.
  return strs[0];
}`,
      },
    ],
  },

  {
    problemId: 'reverse-words-in-a-string',
    statement:
      'Given a string of words separated by spaces, reverse the order of the words. Remove leading, trailing and duplicated spaces.',
    starter: `function reverseWords(s: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Split on whitespace, drop the empty pieces that multiple spaces produce, reverse, and rejoin with a single space. The filter is the part people forget — splitting "a  b" on a single space yields an empty middle element.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function reverseWords(s: string): string {
  return s
    .split(' ')
    // Consecutive spaces produce empty strings; drop them. This is what
    // collapses "a   b" into "b a" rather than "b   a".
    .filter((word) => word.length > 0)
    .reverse()
    .join(' ');
}`,
      },
    ],
  },

  {
    problemId: 'roman-to-integer',
    statement: 'Convert a Roman numeral string to an integer.',
    starter: `function romanToInt(s: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Roman numerals add left to right, except when a smaller symbol sits before a larger one, which means subtract. So scan once: if the current value is less than the next, subtract it, otherwise add it. That one rule handles IV, IX, XL, XC, CD and CM without special-casing any of them.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function romanToInt(s: string): number {
  const values: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
  };

  let total = 0;

  for (let i = 0; i < s.length; i++) {
    const current = values[s[i]];
    const next = values[s[i + 1]];

    // A smaller symbol before a larger one is the subtractive form (IV, IX,
    // XL, ...). One rule covers all six cases.
    if (next !== undefined && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  return total;
}`,
      },
    ],
  },

  {
    problemId: 'integer-to-roman',
    statement: 'Convert an integer to a Roman numeral.',
    starter: `function intToRoman(num: number): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Greedy, with one preparation step that makes it trivial: include the subtractive forms (900, 400, 90, 40, 9, 4) in the value table alongside the plain symbols. Then simply take the largest value that fits, repeatedly. No special cases in the loop at all.',
        time: 'O(1) — the table is fixed and the answer is bounded',
        space: 'O(1)',
        code: `function intToRoman(num: number): string {
  // Listing the subtractive forms as first-class entries is the whole trick.
  // Without them the greedy loop would produce IIII instead of IV.
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];

  let remaining = num;
  let result = '';

  for (const [value, symbol] of table) {
    // Take this symbol as many times as it fits before moving on.
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'is-subsequence',
    statement:
      'Given two strings s and t, determine whether s is a subsequence of t — whether s can be formed by deleting some characters of t without reordering.',
    starter: `function isSubsequence(s: string, t: string): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Two pointers. Walk through the longer string, advancing the shorter one only when the characters match. If the shorter pointer reaches the end, everything was found in order. Greedy matching is safe here: taking the earliest possible match never rules out a later one.',
        time: 'O(t length)',
        space: 'O(1)',
        code: `function isSubsequence(s: string, t: string): boolean {
  // How much of s has been matched so far.
  let matched = 0;

  for (const char of t) {
    // Already found all of s -- nothing left to look for.
    if (matched === s.length) break;

    // Match greedily: taking the earliest occurrence is always at least as
    // good as waiting for a later one.
    if (char === s[matched]) matched++;
  }

  return matched === s.length;
}`,
      },
    ],
  },

  {
    problemId: 'group-anagrams',
    statement:
      'Given an array of strings, group the anagrams together. The answer may be in any order.',
    starter: `function groupAnagrams(strs: string[]): string[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Sort each word letters to produce a canonical key — anagrams sort to the same string — and bucket by that key.',
        time: 'O(n * k log k)',
        space: 'O(n * k)',
        code: `function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const word of strs) {
    // Anagrams share the same sorted letters, so that is the group key.
    const key = [...word].sort().join('');

    const bucket = groups.get(key);
    if (bucket) bucket.push(word);
    else groups.set(key, [word]);
  }

  return [...groups.values()];
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Build the key from a letter-frequency count instead of sorting. Counting is linear in the word length, so the log factor disappears. The key is the 26 counts joined together.',
        time: 'O(n * k)',
        space: 'O(n * k)',
        code: `function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const word of strs) {
    // Count letters rather than sorting: linear instead of k log k.
    const counts = new Array<number>(26).fill(0);
    for (const char of word) {
      counts[char.charCodeAt(0) - 97]++;
    }

    // A separator matters: without it, counts of 1,11 and 11,1 would both
    // stringify to "111" and collide.
    const key = counts.join('#');

    const bucket = groups.get(key);
    if (bucket) bucket.push(word);
    else groups.set(key, [word]);
  }

  return [...groups.values()];
}`,
      },
    ],
  },

  {
    problemId: 'string-compression',
    statement:
      'Compress an array of characters in place by replacing each run with the character followed by its length when the run is longer than one. Return the new length.',
    starter: `function compress(chars: string[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A read pointer and a write pointer over the same array. The write pointer always trails the read pointer, because a run of length n compresses to at most n characters — that is what makes the in-place overwrite safe. Digits of a multi-character count must be written individually.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function compress(chars: string[]): number {
  let write = 0; // where the next output character goes
  let read = 0;  // where we are scanning

  while (read < chars.length) {
    const char = chars[read];
    let runLength = 0;

    // Consume the whole run of this character.
    while (read < chars.length && chars[read] === char) {
      read++;
      runLength++;
    }

    // The character itself is always written.
    chars[write] = char;
    write++;

    // A run of 1 is left bare; longer runs get their length appended.
    if (runLength > 1) {
      // Multi-digit counts must be split into separate characters:
      // 12 becomes '1','2', not the single entry '12'.
      for (const digit of String(runLength)) {
        chars[write] = digit;
        write++;
      }
    }
  }

  // write trails read throughout, so this overwrite is always safe.
  return write;
}`,
      },
    ],
  },

  {
    problemId: 'string-to-integer-atoi',
    statement:
      'Implement atoi: skip leading whitespace, read an optional sign, read digits until a non-digit, and clamp the result to the 32-bit signed integer range.',
    starter: `function myAtoi(s: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'A small state machine in four ordered steps: whitespace, sign, digits, clamp. The order is the specification, and each step must be done exactly once — a second sign, or whitespace after a sign, ends the parse. Clamping rather than overflowing is the part most people miss.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function myAtoi(s: string): number {
  const INT_MAX = 2147483647;   // 2^31 - 1
  const INT_MIN = -2147483648;  // -2^31

  let i = 0;

  // Step 1: skip leading whitespace only. Any whitespace after this point
  // terminates the number.
  while (i < s.length && s[i] === ' ') i++;

  // Step 2: at most ONE sign. A second one is not a sign, it ends parsing.
  let sign = 1;
  if (s[i] === '+' || s[i] === '-') {
    if (s[i] === '-') sign = -1;
    i++;
  }

  // Step 3: digits until the first non-digit.
  let value = 0;
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    value = value * 10 + (s.charCodeAt(i) - 48);

    // Step 4: clamp as we go rather than overflowing first. Checking inside
    // the loop keeps very long digit strings from losing precision.
    if (sign === 1 && value > INT_MAX) return INT_MAX;
    if (sign === -1 && -value < INT_MIN) return INT_MIN;

    i++;
  }

  return sign * value;
}`,
      },
    ],
  },

  {
    problemId: 'repeated-string-match',
    statement:
      'Given strings a and b, return the minimum number of times a must be repeated so that b is a substring of it, or -1 if impossible.',
    starter: `function repeatedStringMatch(a: string, b: string): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The bound is the whole insight. You need at least enough copies to cover b length, and at most one extra on each side to handle b starting partway into a copy. So test that count and that count plus one — if neither contains b, no number ever will.',
        time: 'O(n * m)',
        space: 'O(n * m)',
        code: `function repeatedStringMatch(a: string, b: string): number {
  // The fewest copies that could possibly be long enough to hold b.
  let count = Math.ceil(b.length / a.length);

  let repeated = a.repeat(count);
  if (repeated.includes(b)) return count;

  // One more copy covers the case where b starts partway into a copy and
  // therefore spills past the end. Beyond this, more copies add nothing
  // new -- the pattern has already fully repeated.
  repeated += a;
  if (repeated.includes(b)) return count + 1;

  return -1;
}`,
      },
    ],
  },

  {
    problemId: 'longest-happy-prefix',
    statement:
      'Given a string, return the longest prefix that is also a suffix, excluding the whole string itself.',
    starter: `function longestPrefix(s: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'This is exactly the failure function from KMP. Build an array where each entry is the length of the longest proper prefix of that prefix which is also a suffix. The last entry answers the question. When characters mismatch, fall back through previously computed lengths rather than restarting — that fallback is what keeps it linear.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function longestPrefix(s: string): string {
  const n = s.length;

  // border[i] = length of the longest proper prefix of s[0..i] that is
  // also a suffix of it. This is the KMP failure function.
  const border = new Array<number>(n).fill(0);

  let length = 0; // current matched border length

  for (let i = 1; i < n; i++) {
    // On a mismatch, fall back to the border of the border rather than
    // starting over. This fallback is what makes the whole build linear.
    while (length > 0 && s[i] !== s[length]) {
      length = border[length - 1];
    }

    if (s[i] === s[length]) length++;

    border[i] = length;
  }

  return s.slice(0, border[n - 1]);
}`,
      },
    ],
  },

  {
    problemId: 'search-pattern',
    statement:
      'Find all starting indices where a pattern occurs in a text, in linear time.',
    starter: `function searchPattern(text: string, pattern: string): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every starting position and compare character by character. Fine in practice, but worst case is the product of the two lengths.',
        time: 'O(n * m)',
        space: 'O(1)',
        code: `function searchPattern(text: string, pattern: string): number[] {
  const matches: number[] = [];

  // Only start where the pattern could still fit.
  for (let start = 0; start + pattern.length <= text.length; start++) {
    let offset = 0;

    while (offset < pattern.length && text[start + offset] === pattern[offset]) {
      offset++;
    }

    if (offset === pattern.length) matches.push(start);
  }

  return matches;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'KMP. Precompute the failure function for the pattern, then scan the text without ever moving backwards. On a mismatch, the failure function says how much of the pattern is still validly matched, so the text pointer never rewinds — which is exactly what makes it linear.',
        time: 'O(n + m)',
        space: 'O(m)',
        code: `function searchPattern(text: string, pattern: string): number[] {
  const matches: number[] = [];
  if (pattern.length === 0) return matches;

  // --- Build the failure function for the pattern ---
  const border = new Array<number>(pattern.length).fill(0);
  let length = 0;

  for (let i = 1; i < pattern.length; i++) {
    while (length > 0 && pattern[i] !== pattern[length]) {
      length = border[length - 1];
    }
    if (pattern[i] === pattern[length]) length++;
    border[i] = length;
  }

  // --- Scan the text, never rewinding ---
  let matched = 0; // how much of the pattern currently matches

  for (let i = 0; i < text.length; i++) {
    // On a mismatch, drop back to the longest border still valid. The text
    // index i never decreases, which is the source of the linear bound.
    while (matched > 0 && text[i] !== pattern[matched]) {
      matched = border[matched - 1];
    }

    if (text[i] === pattern[matched]) matched++;

    if (matched === pattern.length) {
      matches.push(i - pattern.length + 1);

      // Continue from the border so overlapping matches are found too.
      matched = border[matched - 1];
    }
  }

  return matches;
}`,
      },
    ],
  },

  {
    problemId: 'shortest-palindrome',
    statement:
      'Given a string, form the shortest palindrome by adding characters only in front of it.',
    starter: `function shortestPalindrome(s: string): string {
  // your code here
  return '';
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'You want the longest palindromic prefix, because only the part after it needs mirroring in front. Finding it reduces to a neat trick: concatenate the string, a separator, and its reverse, then run the KMP failure function. The final border length is exactly the longest palindromic prefix. The separator prevents the two halves from matching through each other.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function shortestPalindrome(s: string): string {
  if (s.length === 0) return '';

  const reversed = [...s].reverse().join('');

  // The separator is essential: without it the border could run past the
  // boundary and match characters of s against characters of reversed in a
  // way that does not correspond to a real palindromic prefix.
  const combined = s + '#' + reversed;

  // KMP failure function over the combined string.
  const border = new Array<number>(combined.length).fill(0);
  let length = 0;

  for (let i = 1; i < combined.length; i++) {
    while (length > 0 && combined[i] !== combined[length]) {
      length = border[length - 1];
    }
    if (combined[i] === combined[length]) length++;
    border[i] = length;
  }

  // The last border length is the longest prefix of s that is also a suffix
  // of reversed(s) -- which is precisely the longest palindromic prefix.
  const palindromicPrefix = border[combined.length - 1];

  // Everything after that prefix must be mirrored in front.
  const toAdd = s.slice(palindromicPrefix);

  return [...toAdd].reverse().join('') + s;
}`,
      },
    ],
  },
];
