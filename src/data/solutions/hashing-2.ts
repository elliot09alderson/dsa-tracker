import type { Solution } from '@/lib/types';

/**
 * Hashing, part two.
 *
 * Problems where a hash map turns an otherwise quadratic (or worse) search
 * into a linear one: matching two-pair sums, digit-parity patterns, word
 * reversals, and a 2D "does a query point line up with a lit cell" question.
 * Split from hashing-queues.ts purely to keep each file a readable size.
 */
export const hashing2Solutions: Solution[] = [
  {
    problemId: 'valid-anagram-2-2',
    statement: 'Given two strings s and t, determine whether t is an anagram of s (uses exactly the same characters, same counts, in any order).',
    starter: `function isAnagram(s: string, t: string): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Sort both strings into a canonical order and compare the results directly -- two strings are anagrams exactly when their sorted forms match. Correct, but pays for a full sort of both strings when a hash map of character counts answers the same question in one linear pass.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A hash map of character counts. Add one to a character’s count for every occurrence in s, subtract one for every occurrence in t; if t truly is an anagram, every count returns to exactly zero, and no character appears in the map that was not accounted for by both strings.',
        time: 'O(n)',
        space: 'O(k) for k distinct characters',
        code: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const counts = new Map<string, number>();

  for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  for (const ch of t) {
    const remaining = counts.get(ch) ?? 0;
    if (remaining === 0) return false; // t uses a character s did not, or too many of one
    counts.set(ch, remaining - 1);
  }

  return true;
}`,
      },
    ],
  },
  {
    problemId: 'equal',
    statement:
      'Given an array A, find four distinct indices A1 < B1 and C1 < D1 (with A1 < C1, and B1 different from both C1 and D1) such that A[A1] + A[B1] = A[C1] + A[D1]. Among all valid solutions, return the lexicographically smallest quadruple of indices (comparing A1 first, then B1, then C1, then D1).',
    starter: `function equal(a: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Check every combination of four valid indices directly, verifying the sum condition and the ordering constraints, and keep whichever satisfies them with the lexicographically smallest tuple found so far. It matches the definition exactly, but there are O(n^4) index combinations to consider.',
        time: 'O(n^4)',
        space: 'O(1)',
        code: `function equal(a: number[]): number[] {
  let best: number[] | null = null;

  const isSmaller = (candidate: number[]): boolean => {
    if (best === null) return true;
    for (let i = 0; i < 4; i++) {
      if (candidate[i] !== best[i]) return candidate[i] < best[i];
    }
    return false;
  };

  for (let a1 = 0; a1 < a.length; a1++) {
    for (let b1 = a1 + 1; b1 < a.length; b1++) {
      for (let c1 = a1 + 1; c1 < a.length; c1++) {
        for (let d1 = c1 + 1; d1 < a.length; d1++) {
          if (b1 === c1 || b1 === d1) continue; // indices must be distinct

          if (a[a1] + a[b1] === a[c1] + a[d1]) {
            const candidate = [a1, b1, c1, d1];
            if (isSmaller(candidate)) best = candidate;
          }
        }
      }
    }
  }

  return best ?? [];
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Group pairs by their sum instead of comparing every quadruple. Walk every pair (i, j) with i < j, in order, and for each sum encountered check whether an EARLIER pair (k, l) already produced the same sum with l != i and l != j -- if so, (k, l, i, j) is a valid quadruple candidate right now. Because pairs are processed in increasing order of their second index, the very first quadruple found this way is guaranteed lexicographically smallest, so the search can stop immediately.",
        time: 'O(n^2)',
        space: 'O(n^2) for the sum-to-pair map in the worst case',
        code: `function equal(a: number[]): number[] {
  const n = a.length;
  // sum -> the FIRST pair [i, j] (i < j) seen with that sum so far.
  const firstPairWithSum = new Map<number, [number, number]>();

  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      const sum = a[i] + a[j];
      const earlier = firstPairWithSum.get(sum);

      // A valid quadruple needs four DISTINCT indices, and since earlier
      // pairs are always processed before this one, checking against the
      // first-seen pair for this sum is enough to guarantee lexicographic
      // minimality among all matches for that sum.
      if (earlier && earlier[1] !== i && earlier[1] !== j) {
        return [earlier[0], earlier[1], i, j];
      }

      if (!firstPairWithSum.has(sum)) {
        firstPairWithSum.set(sum, [i, j]);
      }
    }
  }

  return [];
}`,
      },
    ],
  },
  {
    problemId: 'a',
    statement:
      'Sonya keeps a multiset of non-negative integers, supporting insertions ("+ x"), deletions of one occurrence ("- x"), and queries ("? pattern") where pattern is a string of 0s and 1s. A number matches a query pattern if, reading both from the right, the ith digit of the number is even exactly when the ith character of the pattern is "0" (and odd when it is "1"), for every position covered by the pattern -- the number must have exactly as many digits as the pattern. For each query, output how many numbers currently in the multiset match.',
    starter: `function processSonyaQueries(operations: string[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Keep the multiset as a plain list of numbers. For every "?" query, scan the entire multiset, check each number’s digit count and parity pattern against the query directly, and count the matches. Correct, but every query re-examines every number currently stored.',
        time: 'O(q * m) where m is the multiset size at query time',
        space: 'O(m)',
        code: `function processSonyaQueries(operations: string[]): number[] {
  const multiset: number[] = [];

  const parityPattern = (num: number, length: number): string => {
    let pattern = '';
    let n = num;
    for (let i = 0; i < length; i++) {
      pattern = (n % 2) + pattern;
      n = Math.floor(n / 10);
    }
    return pattern;
  };

  const digitCount = (num: number): number => (num === 0 ? 1 : String(num).length);

  const results: number[] = [];

  for (const op of operations) {
    const [kind, arg] = op.split(' ');

    if (kind === '+') {
      multiset.push(Number(arg));
    } else if (kind === '-') {
      const idx = multiset.indexOf(Number(arg));
      if (idx !== -1) multiset.splice(idx, 1);
    } else {
      let count = 0;
      for (const num of multiset) {
        if (digitCount(num) === arg.length && parityPattern(num, arg.length) === arg) {
          count++;
        }
      }
      results.push(count);
    }
  }

  return results;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Index numbers by their exact parity pattern in a hash map from pattern string to a running count, so every query is a single lookup. Adding a number computes its pattern once and increments that pattern’s counter; removing does the reverse; a query is then just reading the counter for the requested pattern (0 if it has never been seen). All the per-number work happens once, at insertion or deletion time, rather than being repeated on every query.',
        time: 'O(q * L) where L is the pattern length (at most 18)',
        space: 'O(q) for the pattern counts',
        code: `function processSonyaQueries(operations: string[]): number[] {
  const countByPattern = new Map<string, number>();

  const parityPattern = (num: number, length: number): string => {
    let pattern = '';
    let n = num;
    for (let i = 0; i < length; i++) {
      pattern = (n % 2) + pattern;
      n = Math.floor(n / 10);
    }
    return pattern;
  };

  const digitCount = (num: number): number => (num === 0 ? 1 : String(num).length);

  const results: number[] = [];

  for (const op of operations) {
    const [kind, arg] = op.split(' ');

    if (kind === '+') {
      const num = Number(arg);
      const pattern = parityPattern(num, digitCount(num));
      countByPattern.set(pattern, (countByPattern.get(pattern) ?? 0) + 1);
    } else if (kind === '-') {
      const num = Number(arg);
      const pattern = parityPattern(num, digitCount(num));
      countByPattern.set(pattern, (countByPattern.get(pattern) ?? 0) - 1);
    } else {
      results.push(countByPattern.get(arg) ?? 0);
    }
  }

  return results;
}`,
      },
    ],
  },
  {
    problemId: 'palindrome-pairs',
    statement:
      'Given a list of unique words, find every pair of indices (i, j), i != j, such that concatenating words[i] and words[j] produces a palindrome.',
    starter: `function palindromePairs(words: string[]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every ordered pair of distinct words, concatenate them, and check whether the result reads the same backward as forward. It checks the definition exactly, but every one of the O(n^2) pairs is concatenated and scanned in full.',
        time: 'O(n^2 * L) where L is the average word length',
        space: 'O(L) per check',
        code: `function palindromePairs(words: string[]): number[][] {
  const isPalindrome = (s: string): boolean => {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  };

  const results: number[][] = [];

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i !== j && isPalindrome(words[i] + words[j])) {
        results.push([i, j]);
      }
    }
  }

  return results;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Index every word’s REVERSE in a hash map to its position, then for each word try every way of splitting it into a prefix and a suffix (including the empty split at both ends). Two cases each make a valid pair: if the prefix is itself a palindrome, then (reverse of the suffix) + this word is a palindrome pair -- because the reversed suffix cancels the suffix, leaving the palindromic prefix mirrored around the center; symmetrically, if the suffix is a palindrome, this word + (reverse of the prefix) works. Looking up "does this exact reversed piece exist as its own word" is an O(1) hash lookup, turning what would be a quadratic search into linear work per word.',
        time: 'O(n * L^2) -- L splits per word, each doing O(L) palindrome checks and O(1) lookups',
        space: 'O(n * L) for the reverse-word map',
        code: `function palindromePairs(words: string[]): number[][] {
  const indexOfWord = new Map<string, number>();
  words.forEach((word, i) => indexOfWord.set(word, i));

  const isPalindrome = (s: string, lo: number, hi: number): boolean => {
    while (lo < hi) {
      if (s[lo] !== s[hi]) return false;
      lo++;
      hi--;
    }
    return true;
  };

  const reverse = (s: string): string => s.split('').reverse().join('');

  const results: number[][] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const n = word.length;

    for (let splitPoint = 0; splitPoint <= n; splitPoint++) {
      const prefix = word.slice(0, splitPoint);
      const suffix = word.slice(splitPoint);

      // Case 1: prefix is a palindrome -- pair with (reversed suffix) + word.
      if (isPalindrome(word, 0, splitPoint - 1)) {
        const candidate = reverse(suffix);
        const j = indexOfWord.get(candidate);
        // splitPoint === n means suffix is empty, which duplicates case 2;
        // skip it here to avoid reporting the same pair twice.
        if (j !== undefined && j !== i && splitPoint !== n) {
          results.push([j, i]);
        }
      }

      // Case 2: suffix is a palindrome -- pair with word + (reversed prefix).
      if (isPalindrome(word, splitPoint, n - 1)) {
        const candidate = reverse(prefix);
        const j = indexOfWord.get(candidate);
        if (j !== undefined && j !== i) {
          results.push([i, j]);
        }
      }
    }
  }

  return results;
}`,
      },
    ],
  },
  {
    problemId: 'grid-illumination',
    statement:
      'An n x n grid starts fully dark. Given lamps as [row, col] positions, each lamp illuminates its entire row, column, and both diagonals. Given a list of queries [row, col], for each query report whether that cell is currently illuminated, then turn off that lamp and its 8 neighbouring cells (if they hold lamps), before moving to the next query.',
    starter: `function gridIllumination(n: number, lamps: number[][], queries: number[][]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Keep the actual lit/dark state of every cell in an n x n grid. Turning on a lamp lights its entire row, column and both diagonals directly; a query is a single lookup, but turning a lamp off requires re-darkening a whole row/column/diagonal -- and since another lamp sharing that line must keep it lit, that means rechecking every other lamp on the line each time one is removed.',
        time: 'O(n) per lamp toggle in the worst case, O(n^2) grid memory',
        space: 'O(n^2)',
        code: `function gridIllumination(n: number, lamps: number[][], queries: number[][]): number[] {
  const lit = Array.from({ length: n }, () => new Array(n).fill(false));
  const hasLamp = new Set(lamps.map(([r, c]) => \`\${r},\${c}\`));

  const paint = (value: boolean) => {
    lit.forEach((row) => row.fill(value));
    for (const key of hasLamp) {
      const [r, c] = key.split(',').map(Number);
      for (let i = 0; i < n; i++) {
        lit[r][i] = true;
        lit[i][c] = true;
      }
      for (let d = -n; d <= n; d++) {
        if (r + d >= 0 && r + d < n && c + d >= 0 && c + d < n) lit[r + d][c + d] = true;
        if (r + d >= 0 && r + d < n && c - d >= 0 && c - d < n) lit[r + d][c - d] = true;
      }
    }
  };

  const results: number[] = [];

  for (const [qr, qc] of queries) {
    paint(false);
    paint(true); // recompute the whole grid from the currently active lamps

    results.push(lit[qr][qc] ? 1 : 0);

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const key = \`\${qr + dr},\${qc + dc}\`;
        hasLamp.delete(key);
      }
    }
  }

  return results;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Never materialise the grid at all -- track only COUNTS. A row (or column, or either diagonal) is lit exactly when at least one lamp lies on it, so a hash map from row index to how many lamps are in that row (and similarly for columns and both diagonal families, identified by row - col and row + col) answers a query in O(1): illuminated iff any of the four counts for this cell's row/column/diagonals is positive. Turning off a lamp just decrements those same four counters; only the up-to-9 lamps at or adjacent to the query cell are ever inspected, never a whole line.",
        time: 'O(1) amortised per query (a fixed handful of hash operations)',
        space: 'O(number of lamps)',
        code: `function gridIllumination(n: number, lamps: number[][], queries: number[][]): number[] {
  const rowCount = new Map<number, number>();
  const colCount = new Map<number, number>();
  const diagCount = new Map<number, number>(); // keyed by row - col
  const antiDiagCount = new Map<number, number>(); // keyed by row + col
  const activeLamps = new Set<string>(); // "row,col" for lamps currently on

  const bump = (map: Map<number, number>, key: number, delta: number) => {
    const next = (map.get(key) ?? 0) + delta;
    if (next === 0) map.delete(key);
    else map.set(key, next);
  };

  const turnOn = (r: number, c: number) => {
    const key = \`\${r},\${c}\`;
    if (activeLamps.has(key)) return; // no duplicate lamps at one cell
    activeLamps.add(key);
    bump(rowCount, r, 1);
    bump(colCount, c, 1);
    bump(diagCount, r - c, 1);
    bump(antiDiagCount, r + c, 1);
  };

  const turnOff = (r: number, c: number) => {
    const key = \`\${r},\${c}\`;
    if (!activeLamps.has(key)) return;
    activeLamps.delete(key);
    bump(rowCount, r, -1);
    bump(colCount, c, -1);
    bump(diagCount, r - c, -1);
    bump(antiDiagCount, r + c, -1);
  };

  for (const [r, c] of lamps) turnOn(r, c);

  const results: number[] = [];

  for (const [qr, qc] of queries) {
    const illuminated =
      (rowCount.get(qr) ?? 0) > 0 ||
      (colCount.get(qc) ?? 0) > 0 ||
      (diagCount.get(qr - qc) ?? 0) > 0 ||
      (antiDiagCount.get(qr + qc) ?? 0) > 0;

    results.push(illuminated ? 1 : 0);

    // Only the query cell and its 8 neighbours can possibly hold a lamp
    // that needs switching off -- nothing else is ever touched.
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        turnOff(qr + dr, qc + dc);
      }
    }
  }

  return results;
}`,
      },
    ],
  },
];
