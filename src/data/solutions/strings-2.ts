import type { Solution } from '@/lib/types';

/**
 * Strings, part two.
 *
 * A string-rearrangement feasibility check, and a self-similarity counting
 * problem solved with the Z-function. Split from strings.ts purely to keep
 * each file a readable size.
 */
export const strings2Solutions: Solution[] = [
  {
    problemId: 'b',
    statement:
      'A pair of adjacent letters is "ugly" if the two letters are also adjacent in the alphabet (in either direction) -- for example "a" and "b", or "n" and "m". The letters "a" and "z" are NOT considered adjacent. Given a string, determine whether its letters can be rearranged (using every letter, adding none, removing none) so that no ugly pair appears, and if so return one such arrangement (any valid one); otherwise report that no answer exists.',
    starter: `function rearrangeNoUglyPairs(s: string): string | null {
  // your code here -- return a valid rearrangement, or null if impossible
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every distinct permutation of the letters (skipping ones identical to an already-tried arrangement, since the input may repeat letters) and check each one directly for any adjacent alphabet-neighbour pair. The first valid permutation found is returned. Correct by exhaustion, but the number of permutations grows factorially with the string length.',
        time: 'O(n! * n)',
        space: 'O(n! * n)',
        code: `function rearrangeNoUglyPairs(s: string): string | null {
  const isUglyPair = (a: string, b: string): boolean => {
    const diff = Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
    return diff === 1; // 'a'/'z' both map to diff 25, so they never trigger this
  };

  const hasNoUglyPair = (str: string): boolean => {
    for (let i = 0; i + 1 < str.length; i++) {
      if (isUglyPair(str[i], str[i + 1])) return false;
    }
    return true;
  };

  const chars = s.split('');
  const used = new Array<boolean>(chars.length).fill(false);
  const seenPermutations = new Set<string>();

  const build = (current: string[]): string | null => {
    if (current.length === chars.length) {
      const candidate = current.join('');
      if (seenPermutations.has(candidate)) return null;
      seenPermutations.add(candidate);
      return hasNoUglyPair(candidate) ? candidate : null;
    }

    for (let i = 0; i < chars.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(chars[i]);
      const result = build(current);
      current.pop();
      used[i] = false;
      if (result !== null) return result;
    }

    return null;
  };

  return build([]);
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Split the letters by the PARITY of their position in the alphabet (a, c, e, ... are \"even\"; b, d, f, ... are \"odd\"). Two letters that are adjacent in the alphabet always differ in position by exactly 1, so they always fall into DIFFERENT parity groups -- which means, crucially, that within a single parity group no two distinct letters can ever form an ugly pair, no matter how that group is internally ordered. So sort each group and glue them together as two solid blocks; the only place an ugly pair could possibly still occur is the single seam where the two blocks meet, and there are only two ways to form that seam (even-block-then-odd-block, or odd-block-then-even-block). Trying both and taking whichever seam is clean answers the question -- and if neither seam works, no rearrangement exists at all, since every other adjacency in either candidate is already guaranteed safe by construction.",
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function rearrangeNoUglyPairs(s: string): string | null {
  const isUglyPair = (a: string, b: string): boolean =>
    Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) === 1;

  const hasNoUglyPair = (str: string): boolean => {
    for (let i = 0; i + 1 < str.length; i++) {
      if (isUglyPair(str[i], str[i + 1])) return false;
    }
    return true;
  };

  // Adjacent-in-alphabet letters always land in opposite parity groups,
  // so within one group every pairing is automatically safe.
  let evenGroup = '';
  let oddGroup = '';
  for (const ch of s) {
    const position = ch.charCodeAt(0) - 'a'.charCodeAt(0);
    if (position % 2 === 0) evenGroup += ch;
    else oddGroup += ch;
  }

  const sortedEven = [...evenGroup].sort().join('');
  const sortedOdd = [...oddGroup].sort().join('');

  // Only the single seam between the two blocks can possibly be unsafe,
  // so only these two concatenations need to be tried.
  const candidateA = sortedEven + sortedOdd;
  if (hasNoUglyPair(candidateA)) return candidateA;

  const candidateB = sortedOdd + sortedEven;
  if (hasNoUglyPair(candidateB)) return candidateB;

  return null;
}`,
      },
    ],
  },
  {
    problemId: 'sum-of-scores-of-built-strings',
    statement:
      'A string t of length n is built up one character at a time, front to back: s[0] = t[n-1..n-1], s[1] = t[n-2..n-1], ..., s[n-1] = t[0..n-1] = t itself. The score of s[i] is the length of the longest common prefix between s[i] and t. Given t, return the sum of the scores of every s[i].',
    starter: `function sumScores(s: string): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every suffix s[i] = t[n-1-i..n-1], compare it character by character against the front of t (which is the full string t itself), counting how far the match extends before the first mismatch or the shorter string runs out. Direct translation of the definition, but comparing a suffix of length up to n against a prefix of length up to n, for every one of the n suffixes, is quadratic.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function sumScores(t: string): number {
  const n = t.length;
  let total = 0;

  for (let i = 0; i < n; i++) {
    const suffixStart = n - 1 - i; // s[i] = t[suffixStart..n-1]
    let matchLength = 0;

    while (matchLength < n - suffixStart && t[matchLength] === t[suffixStart + matchLength]) {
      matchLength++;
    }

    total += matchLength;
  }

  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'This is exactly what the Z-function computes: for every position i, z[i] is the length of the longest common prefix between t itself and the suffix of t starting at i. Computing it with the standard linear-time algorithm -- maintaining a window [zBoxLeft, zBoxRight] representing the rightmost-reaching match found so far, and reusing previously computed z-values to skip already-known matching characters whenever the current position falls inside that window -- gives every score in one pass instead of comparing each suffix from scratch.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function sumScores(t: string): number {
  const n = t.length;
  const z = new Array<number>(n).fill(0);
  z[0] = n; // by convention, the whole string matches itself

  let zBoxLeft = 0;
  let zBoxRight = 0;

  for (let i = 1; i < n; i++) {
    if (i < zBoxRight) {
      // i falls inside a previously found matching window, so at least
      // this much is already known to match -- reuse it as a head start.
      z[i] = Math.min(zBoxRight - i, z[i - zBoxLeft]);
    }

    // Try to extend the match past whatever was reused (or from scratch).
    while (i + z[i] < n && t[z[i]] === t[i + z[i]]) {
      z[i]++;
    }

    // If this match reaches further right than any seen before, remember
    // it as the new window for future positions to reuse.
    if (i + z[i] > zBoxRight) {
      zBoxLeft = i;
      zBoxRight = i + z[i];
    }
  }

  // s[i] corresponds to suffix index (n-1-i); its score is z[n-1-i].
  return z.reduce((sum, value) => sum + value, 0);
}`,
      },
    ],
  },
];
