import type { Solution } from '@/lib/types';

/**
 * Bit manipulation.
 *
 * Two facts carry most of this topic: XOR cancels equal values (x ^ x === 0)
 * and n & (n - 1) clears the lowest set bit. Almost every problem here is one
 * of those two in disguise.
 */
export const bitManipulationSolutions: Solution[] = [
  {
    problemId: 'single-number',
    statement:
      'Every element in an array appears twice except for one. Find that single element using linear time and constant space.',
    starter: `function singleNumber(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Count occurrences in a hash map and return the value counted once. Linear, but it uses O(n) memory, which the problem forbids.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function singleNumber(nums: number[]): number {
  const counts = new Map<number, number>();

  for (const value of nums) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  for (const [value, count] of counts) {
    if (count === 1) return value;
  }

  return 0;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'XOR everything together. A value XORed with itself is zero, and zero XORed with anything is that thing — so every pair cancels and only the lone value survives. XOR is also order-independent, so the pairs do not need to be adjacent.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function singleNumber(nums: number[]): number {
  let result = 0;

  for (const value of nums) {
    // x ^ x === 0 cancels every pair, and 0 ^ y === y leaves the loner.
    // XOR is commutative, so the pairs need not be next to each other.
    result ^= value;
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'single-number-ii',
    statement:
      'Every element appears three times except for one, which appears once. Find it in linear time and constant space.',
    starter: `function singleNumber(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'Plain XOR fails because three copies do not cancel. Instead count how many numbers have each bit set. Every bit belonging to a tripled value is counted a multiple of three times, so taking each bit count modulo 3 leaves exactly the bits of the lone value.',
        time: 'O(32n)',
        space: 'O(1)',
        code: `function singleNumber(nums: number[]): number {
  let result = 0;

  // Examine one bit position at a time across all 32 bits.
  for (let bit = 0; bit < 32; bit++) {
    let setCount = 0;

    for (const value of nums) {
      if ((value >> bit) & 1) setCount++;
    }

    // Tripled values contribute a multiple of 3 to this count, so anything
    // left over must belong to the single value.
    if (setCount % 3 !== 0) {
      result |= 1 << bit;
    }
  }

  // Bit 31 set means the answer is negative in 32-bit two's complement.
  return result | 0;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A two-variable state machine that counts each bit modulo three in parallel. "ones" holds bits seen once so far, "twos" holds bits seen twice; when a bit reaches three it is cleared from both. One pass, no inner loop.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function singleNumber(nums: number[]): number {
  // ones = bits that have appeared 1 time (mod 3)
  // twos = bits that have appeared 2 times (mod 3)
  let ones = 0;
  let twos = 0;

  for (const value of nums) {
    // A bit enters "ones" if it is in value and not already held by twos.
    ones = (ones ^ value) & ~twos;

    // Then a bit enters "twos" if it is in value and no longer in ones --
    // which happens exactly on its second appearance.
    twos = (twos ^ value) & ~ones;

    // On the third appearance a bit is in neither, which is the mod-3 reset.
  }

  // The lone value appeared once, so it is what remains in ones.
  return ones;
}`,
      },
    ],
  },

  {
    problemId: 'single-number-iii',
    statement:
      'Exactly two elements appear once and all others appear twice. Return the two single elements in any order, in linear time and constant space.',
    starter: `function singleNumber(nums: number[]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'XOR everything to get the XOR of the two answers. Any set bit in that result is a bit where the two differ, so pick one — the lowest, via x & -x — and use it to split the array into two groups. Each group now contains exactly one of the answers plus pairs, so XOR each group separately.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function singleNumber(nums: number[]): number[] {
  // Everything pairs off except the two answers, so this is a ^ b.
  let xorBoth = 0;
  for (const value of nums) xorBoth ^= value;

  // Isolate the lowest set bit. x & -x is the standard idiom for this, and
  // any set bit works -- it marks a position where a and b DISAGREE, which
  // is exactly what we need to separate them.
  const differingBit = xorBoth & -xorBoth;

  let first = 0;
  let second = 0;

  for (const value of nums) {
    // Split into two groups by that bit. Each paired value lands in the
    // same group as its twin and cancels; a and b land in different groups.
    if (value & differingBit) first ^= value;
    else second ^= value;
  }

  return [first, second];
}`,
      },
    ],
  },

  {
    problemId: 'number-of-1-bits',
    statement: 'Return the number of set bits in the binary representation of an integer.',
    starter: `function hammingWeight(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Check all 32 bit positions one at a time.',
        time: 'O(32)',
        space: 'O(1)',
        code: `function hammingWeight(n: number): number {
  let count = 0;

  for (let bit = 0; bit < 32; bit++) {
    // Shift the bit of interest down and mask it off.
    if ((n >>> bit) & 1) count++;
  }

  return count;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Brian Kernighan's trick. n & (n - 1) clears the lowest set bit, because subtracting one flips that bit to zero and every bit below it to one, so the AND wipes them all. Loop until n is zero and the iteration count is the answer — proportional to the number of set bits rather than the word size.",
        time: 'O(number of set bits)',
        space: 'O(1)',
        code: `function hammingWeight(n: number): number {
  let count = 0;
  let value = n;

  while (value !== 0) {
    // n - 1 turns the lowest set bit into 0 and everything below it into 1.
    // ANDing therefore removes exactly that one bit.
    value &= value - 1;
    count++;
  }

  return count;
}`,
      },
    ],
  },

  {
    problemId: 'counting-bits',
    statement:
      'Given an integer n, return an array where each entry i holds the number of set bits in i, for every i from 0 to n.',
    starter: `function countBits(n: number): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Dynamic programming over the bits. Dropping the lowest bit of i gives a smaller number already solved, so the count for i is the count for i >> 1 plus whether i is odd. One pass, no per-number bit loop.',
        time: 'O(n)',
        space: 'O(1) beyond the output',
        code: `function countBits(n: number): number[] {
  const counts = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    // i >> 1 is i with its lowest bit removed -- a smaller number whose
    // answer is already computed. Add back the lowest bit itself.
    counts[i] = counts[i >> 1] + (i & 1);
  }

  return counts;
}`,
      },
    ],
  },

  {
    problemId: 'reverse-bits',
    statement: 'Reverse the bits of a 32-bit unsigned integer.',
    starter: `function reverseBits(n: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Pull bits off the bottom of the input and push them onto the bottom of the result, shifting the result left each time. After 32 rounds the order is reversed. The unsigned right shift and the final >>> 0 matter because JavaScript bitwise operators work on signed 32-bit values.',
        time: 'O(32)',
        space: 'O(1)',
        code: `function reverseBits(n: number): number {
  let result = 0;
  let value = n;

  for (let i = 0; i < 32; i++) {
    // Make room, then take the current lowest bit of the input.
    result = (result << 1) | (value & 1);

    // Unsigned shift: a plain >> would propagate the sign bit and loop
    // forever on negative inputs.
    value >>>= 1;
  }

  // JavaScript bitwise ops produce SIGNED 32-bit results, so convert back
  // to unsigned before returning.
  return result >>> 0;
}`,
      },
    ],
  },

  {
    problemId: 'bitwise-and-of-numbers-range',
    statement:
      'Given a range [left, right], return the bitwise AND of every number in it, inclusive.',
    starter: `function rangeBitwiseAnd(left: number, right: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Any bit that changes anywhere in the range gets ANDed to zero, so the answer is just the common binary prefix of the two endpoints. Shift both right until they agree, counting the shifts, then shift back. Iterating over the range would be far too slow for large ranges.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function rangeBitwiseAnd(left: number, right: number): number {
  let shifts = 0;
  let low = left;
  let high = right;

  // Strip differing low bits. Any bit position where the endpoints differ
  // must flip somewhere in between, and a bit that is ever 0 ANDs to 0.
  while (low !== high) {
    low >>= 1;
    high >>= 1;
    shifts++;
  }

  // What remains is the shared prefix; put it back in position.
  return low << shifts;
}`,
      },
    ],
  },

  {
    problemId: 'divide-two-integers',
    statement:
      'Divide two integers without using multiplication, division or the modulo operator. Truncate toward zero and clamp to the 32-bit signed range.',
    starter: `function divide(dividend: number, divisor: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Repeated subtraction is too slow, so subtract in doubling chunks: find the largest shifted multiple of the divisor that still fits, subtract it, and record the corresponding power of two. That is long division in binary. The only special case is the single overflow value, which has no positive counterpart.',
        time: 'O(log n)',
        space: 'O(1)',
        code: `function divide(dividend: number, divisor: number): number {
  const INT_MAX = 2147483647;
  const INT_MIN = -2147483648;

  // The one case that overflows: -2^31 / -1 is 2^31, one past the maximum.
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;

  // Work in positives and reapply the sign at the end.
  const negative = (dividend < 0) !== (divisor < 0);
  let remaining = Math.abs(dividend);
  const absDivisor = Math.abs(divisor);

  let quotient = 0;

  while (remaining >= absDivisor) {
    // Find the largest doubling of the divisor that still fits. Doubling
    // rather than subtracting once at a time is what makes this logarithmic.
    let chunk = absDivisor;
    let multiple = 1;

    while (remaining >= chunk + chunk) {
      chunk += chunk;      // double the chunk
      multiple += multiple; // and the count it represents
    }

    remaining -= chunk;
    quotient += multiple;
  }

  return negative ? -quotient : quotient;
}`,
      },
    ],
  },

  {
    problemId: 'total-hamming-distance',
    statement:
      'Return the sum of the Hamming distances between every pair of numbers in an array.',
    starter: `function totalHammingDistance(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Compare every pair, XOR them and count the set bits. Quadratic in the array length.',
        time: 'O(n^2 * 32)',
        space: 'O(1)',
        code: `function totalHammingDistance(nums: number[]): number {
  let total = 0;

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      // XOR sets exactly the bits where the two numbers differ.
      let differing = nums[i] ^ nums[j];

      while (differing !== 0) {
        differing &= differing - 1; // clear lowest set bit
        total++;
      }
    }
  }

  return total;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Count per bit position instead of per pair. At a given position, if k numbers have the bit set and n-k do not, every set/unset pairing contributes exactly one to the distance — so that position adds k * (n - k). Summing over 32 positions makes it linear.',
        time: 'O(32n)',
        space: 'O(1)',
        code: `function totalHammingDistance(nums: number[]): number {
  const n = nums.length;
  let total = 0;

  for (let bit = 0; bit < 32; bit++) {
    let setCount = 0;

    for (const value of nums) {
      if ((value >> bit) & 1) setCount++;
    }

    // Each of the setCount numbers differs at this bit from each of the
    // (n - setCount) others, and every such pair contributes 1.
    total += setCount * (n - setCount);
  }

  return total;
}`,
      },
    ],
  },

  {
    problemId: 'maximum-xor-of-two-numbers-in-an-array',
    statement:
      'Given an array of integers, return the maximum XOR of any two elements.',
    starter: `function findMaximumXOR(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'XOR every pair and keep the largest.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function findMaximumXOR(nums: number[]): number {
  let best = 0;

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      best = Math.max(best, nums[i] ^ nums[j]);
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Build the answer greedily from the highest bit down. At each step, assume the next bit can be 1 and check whether any pair of prefixes actually achieves it — using the identity that a ^ b === target implies a ^ target === b, so a hash set of prefixes answers the question in one pass. Keep the bit if achievable.',
        time: 'O(32n)',
        space: 'O(n)',
        code: `function findMaximumXOR(nums: number[]): number {
  let best = 0;
  let mask = 0;

  // Decide the answer one bit at a time, most significant first.
  for (let bit = 31; bit >= 0; bit--) {
    // Consider only the bits decided so far, plus this one.
    mask |= 1 << bit;

    const prefixes = new Set<number>();
    for (const value of nums) prefixes.add(value & mask);

    // Optimistically assume this bit can be 1 on top of what we have.
    const candidate = best | (1 << bit);

    // a ^ b === candidate is equivalent to a ^ candidate === b, so this
    // checks every pair at once instead of looping over pairs.
    let achievable = false;
    for (const prefix of prefixes) {
      if (prefixes.has(prefix ^ candidate)) {
        achievable = true;
        break;
      }
    }

    if (achievable) best = candidate;
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'min-xor-value',
    statement:
      'Given an array, find the pair of elements whose XOR is smallest, and return that value.',
    starter: `function findMinXor(nums: number[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Check every pair and keep the smallest XOR.',
        time: 'O(n^2)',
        space: 'O(1)',
        code: `function findMinXor(nums: number[]): number {
  let best = Infinity;

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      best = Math.min(best, nums[i] ^ nums[j]);
    }
  }

  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Sort first. Two numbers with a small XOR must share a long high-bit prefix, and sorting puts such numbers next to each other — so the minimum XOR is always between adjacent elements. That reduces the whole problem to one pass over neighbours.',
        time: 'O(n log n)',
        space: 'O(1) beyond the sort',
        code: `function findMinXor(nums: number[]): number {
  // The key fact: a small XOR means a long shared high-bit prefix, and
  // sorting groups numbers with shared prefixes together. So the best pair
  // is guaranteed to be adjacent -- no need to look at distant pairs.
  const sorted = [...nums].sort((a, b) => a - b);

  let best = Infinity;

  for (let i = 0; i + 1 < sorted.length; i++) {
    best = Math.min(best, sorted[i] ^ sorted[i + 1]);
  }

  return best;
}`,
      },
    ],
  },

  {
    problemId: 'pairs-with-given-xor',
    statement:
      'Given an array of distinct integers and a value x, count the pairs whose XOR equals x.',
    starter: `function countPairsWithXor(nums: number[], x: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Use the same identity as the maximum-XOR problem: a ^ b === x means a ^ x === b. So walk the array keeping a set of values already seen, and for each element check whether its required partner is in that set. Checking against already-seen values counts each pair exactly once.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function countPairsWithXor(nums: number[], x: number): number {
  const seen = new Set<number>();
  let pairs = 0;

  for (const value of nums) {
    // a ^ b === x rearranges to b === a ^ x, so the partner is computable
    // directly rather than searched for.
    const partner = value ^ x;

    // Only look at earlier elements, so each pair is counted once rather
    // than twice.
    if (seen.has(partner)) pairs++;

    seen.add(value);
  }

  return pairs;
}`,
      },
    ],
  },
];
