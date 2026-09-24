// AUTO-GENERATED problem catalogue -- 261 interview problems across 16 topics.
// Each entry is a *reference* to a problem hosted on LeetCode / GeeksforGeeks /
// InterviewBit: title, link, topic, difficulty and the companies known to ask
// it. We deliberately do not store the problem statements themselves, which
// belong to the hosting platforms -- the app links out for the statement and
// supplies its own explanations and solutions.
//
// To add a problem: append an entry here, then add its solution under
// src/data/solutions/. Nothing else needs to change.

import type { Company, Problem, Topic } from '@/lib/types';

export const TOPICS: Topic[] = [
  {
    "key": "Arrays",
    "label": "Arrays"
  },
  {
    "key": "Two_Pointers",
    "label": "Two Pointers"
  },
  {
    "key": "Bit_Manipulation",
    "label": "Bit Manipulation"
  },
  {
    "key": "Searching",
    "label": "Searching (Binary Search)"
  },
  {
    "key": "Backtracking",
    "label": "Backtracking"
  },
  {
    "key": "Sorting",
    "label": "Sorting"
  },
  {
    "key": "Hashing",
    "label": "Hashing"
  },
  {
    "key": "Strings",
    "label": "Strings"
  },
  {
    "key": "Stacks",
    "label": "Stacks"
  },
  {
    "key": "Queues",
    "label": "Queues"
  },
  {
    "key": "Linked_Lists",
    "label": "Linked Lists"
  },
  {
    "key": "Trees",
    "label": "Trees"
  },
  {
    "key": "Heaps",
    "label": "Heaps"
  },
  {
    "key": "Greedy_Algorithm",
    "label": "Greedy Algorithm"
  },
  {
    "key": "Dynamic_Programming",
    "label": "Dynamic Programming"
  },
  {
    "key": "Graphs",
    "label": "Graphs"
  }
];

/** Companies whose previous-year questions are tagged onto the sheet. */
export const COMPANIES: Company[] = [
  {
    "key": "google",
    "name": "Google",
    "color": "#4285F4",
    "category": "faang"
  },
  {
    "key": "amazon",
    "name": "Amazon",
    "color": "#FF9900",
    "category": "faang"
  },
  {
    "key": "microsoft",
    "name": "Microsoft",
    "color": "#00A4EF",
    "category": "faang"
  },
  {
    "key": "meta",
    "name": "Meta",
    "color": "#0467DF",
    "category": "faang"
  },
  {
    "key": "apple",
    "name": "Apple",
    "color": "#555555",
    "category": "faang"
  },
  {
    "key": "netflix",
    "name": "Netflix",
    "color": "#E50914",
    "category": "faang"
  },
  {
    "key": "flipkart",
    "name": "Flipkart",
    "color": "#2874F0",
    "category": "india"
  },
  {
    "key": "swiggy",
    "name": "Swiggy",
    "color": "#FC8019",
    "category": "india"
  },
  {
    "key": "zomato",
    "name": "Zomato",
    "color": "#E23744",
    "category": "india"
  },
  {
    "key": "razorpay",
    "name": "Razorpay",
    "color": "#3395FF",
    "category": "india"
  },
  {
    "key": "cred",
    "name": "CRED",
    "color": "#1C1C3A",
    "category": "india"
  },
  {
    "key": "meesho",
    "name": "Meesho",
    "color": "#9B2FAE",
    "category": "india"
  },
  {
    "key": "uber",
    "name": "Uber",
    "color": "#000000",
    "category": "global"
  },
  {
    "key": "airbnb",
    "name": "Airbnb",
    "color": "#FF5A5F",
    "category": "global"
  },
  {
    "key": "linkedin",
    "name": "LinkedIn",
    "color": "#0A66C2",
    "category": "global"
  },
  {
    "key": "twitter",
    "name": "Twitter/X",
    "color": "#000000",
    "category": "global"
  },
  {
    "key": "adobe",
    "name": "Adobe",
    "color": "#FF0000",
    "category": "global"
  },
  {
    "key": "salesforce",
    "name": "Salesforce",
    "color": "#00A1E0",
    "category": "global"
  }
];

/** Human labels for the company category groupings shown in the sidebar. */
export const COMPANY_CATEGORIES: { key: string; label: string }[] = [
  { key: 'faang', label: 'FAANG+' },
  { key: 'india', label: 'Indian Tech' },
  { key: 'global', label: 'Global Tech' },
];

export const PROBLEMS: Problem[] = [
  {
    "id": "maximum-value-of-difference-of-a-pair-of-elements-and-their-index",
    "title": "Maximum Value of Difference of a Pair of Elements and Their Index",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 1,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/maximum-value-of-difference-of-a-pair-of-elements-and-their-index/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/trapping-rain-water/",
    "difficulty": "Hard",
    "companies": [
      "amazon",
      "apple",
      "google",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "corporate-flight-bookings",
    "title": "Corporate Flight Bookings",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/corporate-flight-bookings/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "spiral-matrix",
    "title": "Spiral Matrix",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/spiral-matrix/",
    "difficulty": "Medium",
    "companies": [
      "adobe",
      "amazon",
      "apple",
      "microsoft"
    ]
  },
  {
    "id": "maximum-subarray",
    "title": "Maximum Subarray",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/maximum-subarray/",
    "difficulty": "Easy",
    "companies": [
      "adobe",
      "airbnb",
      "amazon",
      "apple",
      "cred",
      "flipkart",
      "google",
      "linkedin",
      "meesho",
      "meta",
      "microsoft",
      "netflix",
      "razorpay",
      "salesforce",
      "swiggy",
      "twitter",
      "uber",
      "zomato"
    ]
  },
  {
    "id": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/set-matrix-zeroes/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "next-permutation",
    "title": "Next Permutation",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/next-permutation/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "cred",
      "google",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "max-non-negative-subarray",
    "title": "Max Non Negative Subarray",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 8,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/max-non-negative-subarray/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "reading-newspaper",
    "title": "Reading Newspaper",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 9,
    "platform": "GitHub",
    "url": "https://github.com/rajnish952/InterviewBit/blob/master/ReadingNewspaper.cpp",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "first-missing-positive",
    "title": "First Missing Positive",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/first-missing-positive/",
    "difficulty": "Hard",
    "companies": [
      "google"
    ]
  },
  {
    "id": "set-mismatch",
    "title": "Set Mismatch",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/set-mismatch/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "flipkart"
    ]
  },
  {
    "id": "majority-element",
    "title": "Majority Element",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/majority-element/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "flipkart",
      "google",
      "linkedin",
      "meesho",
      "meta",
      "microsoft",
      "razorpay",
      "swiggy",
      "zomato"
    ]
  },
  {
    "id": "majority-element-ii",
    "title": "Majority Element II",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/majority-element-ii/",
    "difficulty": "Easy",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "minimum-elements-to-be-removed-such-that-sum-of-adjacent-elements-is-always-even",
    "title": "Minimum Elements to Be Removed Such That Sum of Adjacent Elements is Always Even",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 14,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/minimum-elements-to-be-removed-such-that-sum-of-adjacent-elements-is-always-even/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "plus-one",
    "title": "Plus One",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 15,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/plus-one/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "pascals-triangle-ii",
    "title": "Pascals Triangle II",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 16,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/pascals-triangle-ii/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "apple",
      "microsoft"
    ]
  },
  {
    "id": "gcd-of-two-numbers",
    "title": "Gcd of Two Numbers",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 17,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/gcd-of-two-numbers3459/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "max-consecutive-ones-iii",
    "title": "Max Consecutive Ones III",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 18,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/max-consecutive-ones-iii/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "all-factors",
    "title": "All Factors",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 19,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/all-factors/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "prime-numbers",
    "title": "Prime Numbers",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 20,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/prime-numbers/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "largest-coprime-divisor",
    "title": "Largest Coprime Divisor",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 21,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/largest-coprime-divisor/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "sum-of-all-submatrices-of-a-given-matrix",
    "title": "Sum of All Submatrices of a Given Matrix",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 22,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/sum-of-all-submatrices-of-a-given-matrix/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "day-of-the-week",
    "title": "Day of the Week",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 23,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/day-of-the-week/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "bulb-switcher",
    "title": "Bulb Switcher",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 24,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/bulb-switcher/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "rectangle-overlap",
    "title": "Rectangle Overlap",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 25,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/rectangle-overlap/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "city-tour",
    "title": "City Tour",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 26,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/city-tour/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "excel-sheet-column-title",
    "title": "Excel Sheet Column Title",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 27,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/excel-sheet-column-title/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "range-sum-query-2d-immutable",
    "title": "Range Sum Query 2d Immutable",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 28,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/range-sum-query-2d-immutable/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "generate-parentheses",
    "title": "Generate Parentheses",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 29,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/generate-parentheses/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "unique-paths-ii",
    "title": "Unique Paths II",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 30,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/unique-paths-ii/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google"
    ]
  },
  {
    "id": "nth-magical-number",
    "title": "Nth Magical Number",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 31,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/nth-magical-number/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "sorted-permutation-rank",
    "title": "Sorted Permutation Rank",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 32,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/sorted-permutation-rank/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "kingdom-war",
    "title": "Kingdom War",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 33,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/kingdom-war/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "count-pairs-in-array-divisible-by-k",
    "title": "Count Pairs in Array Divisible By K",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 34,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/count-pairs-in-array-divisible-by-k/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "number-of-digit-one",
    "title": "Number of Digit One",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 35,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/number-of-digit-one/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "nth-catalan-number",
    "title": "Nth Catalan Number",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 36,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/nth-catalan-number0817/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "factorial-trailing-zeroes",
    "title": "Factorial Trailing Zeroes",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 37,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/factorial-trailing-zeroes/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "number-of-divisible-triplet-sums",
    "title": "Number of Divisible Triplet Sums",
    "topic": "Arrays",
    "topicLabel": "Arrays",
    "num": 38,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/number-of-divisible-triplet-sums/",
    "premium": true,
    "freeUrl": "https://www.geeksforgeeks.org/subsequences-size-three-array-whose-sum-divisible-m/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "diffk",
    "title": "Diffk",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 1,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/diffk/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "counting-rectangles",
    "title": "Counting Rectangles",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 2,
    "platform": "GitHub",
    "url": "https://github.com/rajnish952/InterviewBit/blob/master/CountingRectangles.cpp",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "minimize-the-absolute-difference",
    "title": "Minimize the Absolute Difference",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 3,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/minimize-the-absolute-difference/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "subarray-with-given-sum",
    "title": "Subarray with Given Sum",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 4,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart"
    ]
  },
  {
    "id": "smallest-sequence-with-given-primes",
    "title": "Smallest Sequence with Given Primes",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 5,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/smallest-sequence-with-given-primes/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "container-with-most-water",
    "title": "Container with Most Water",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/container-with-most-water/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "meesho",
      "meta",
      "microsoft",
      "swiggy",
      "uber"
    ]
  },
  {
    "id": "valid-triangle-number",
    "title": "Valid Triangle Number",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/valid-triangle-number/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "two-sum-ii-input-array-is-sorted",
    "title": "Two Sum II Input Array is Sorted",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "3sum",
    "title": "3sum",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/3sum/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "3sum-closest",
    "title": "3sum Closest",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/3sum-closest/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "4sum",
    "title": "4sum",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/4sum/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "remove-duplicates-from-sorted-array",
    "title": "Remove Duplicates from Sorted Array",
    "topic": "Two_Pointers",
    "topicLabel": "Two Pointers",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "pairs-with-given-xor",
    "title": "Pairs with Given Xor",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 1,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/pairs-with-given-xor/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "single-number",
    "title": "Single Number",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/single-number/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "apple",
      "microsoft"
    ]
  },
  {
    "id": "single-number-ii",
    "title": "Single Number II",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/single-number-ii/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "min-xor-value",
    "title": "Min Xor Value",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 4,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/min-xor-value/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "total-hamming-distance",
    "title": "Total Hamming Distance",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/total-hamming-distance/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "reverse-bits",
    "title": "Reverse Bits",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/reverse-bits/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "apple"
    ]
  },
  {
    "id": "divide-two-integers",
    "title": "Divide Two Integers",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/divide-two-integers/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google"
    ]
  },
  {
    "id": "maximum-xor-of-two-numbers-in-an-array",
    "title": "Maximum Xor of Two Numbers in an Array",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
    "difficulty": "Medium",
    "companies": [
      "google"
    ]
  },
  {
    "id": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/number-of-1-bits/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "counting-bits",
    "title": "Counting Bits",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/counting-bits/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "single-number-iii",
    "title": "Single Number III",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/single-number-iii/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "bitwise-and-of-numbers-range",
    "title": "Bitwise and of Numbers Range",
    "topic": "Bit_Manipulation",
    "topicLabel": "Bit Manipulation",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "find-first-and-last-position-of-element-in-sorted-array",
    "title": "Find First and Last Position of Element in Sorted Array",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "difficulty": "Medium",
    "companies": [
      "adobe",
      "amazon",
      "google",
      "linkedin",
      "meta",
      "microsoft",
      "razorpay"
    ]
  },
  {
    "id": "find-peak-element",
    "title": "Find Peak Element",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/find-peak-element/",
    "difficulty": "Medium",
    "companies": [
      "google",
      "microsoft"
    ]
  },
  {
    "id": "single-element-in-a-sorted-array",
    "title": "Single Element in a Sorted Array",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "arranging-coins",
    "title": "Arranging Coins",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/arranging-coins/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "median-of-a-row-wise-sorted-matrix",
    "title": "Median of a Row Wise Sorted Matrix",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/median-of-a-row-wise-sorted-matrix/",
    "premium": true,
    "freeUrl": "https://www.interviewbit.com/problems/matrix-median/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "difficulty": "Hard",
    "companies": [
      "amazon",
      "apple",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "find-repeating-element-sorted-array-size-n",
    "title": "Find Repeating Element Sorted Array Size N",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 8,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/find-repeating-element-sorted-array-size-n/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "magnetic-force-between-two-balls",
    "title": "Magnetic Force Between Two Balls",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/magnetic-force-between-two-balls/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "smallest-good-base",
    "title": "Smallest Good Base",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/smallest-good-base/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "split-array-largest-sum",
    "title": "Split Array Largest Sum",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/split-array-largest-sum/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "painters-partition-problem",
    "title": "Painters Partition Problem",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 12,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/painters-partition-problem/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "sqrtx",
    "title": "Sqrtx",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sqrtx/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "search-a-2d-matrix",
    "title": "Search a 2d Matrix",
    "topic": "Searching",
    "topicLabel": "Searching (Binary Search)",
    "num": 14,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/search-a-2d-matrix/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "valid-palindrome",
    "title": "Valid Palindrome",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/valid-palindrome/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "tower-of-hanoi",
    "title": "Tower of Hanoi",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 2,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/tower-of-hanoi-1587115621/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "permutations",
    "title": "Permutations",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/permutations/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "permutations-ii",
    "title": "Permutations II",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/permutations-ii/",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "maximum-depth-of-binary-tree",
    "title": "Maximum Depth of Binary Tree",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "combination-sum-ii",
    "title": "Combination Sum II",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/combination-sum-ii/",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "subsets",
    "title": "Subsets",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/subsets/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "modular-expression",
    "title": "Modular Expression",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 8,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/modular-expression/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "number-of-squareful-arrays",
    "title": "Number of Squareful Arrays",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/number-of-squareful-arrays/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "gray-code",
    "title": "Gray Code",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/gray-code/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "subsets-ii",
    "title": "Subsets II",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/subsets-ii/",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "sudoku-solver",
    "title": "Sudoku Solver",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sudoku-solver/",
    "difficulty": "Hard",
    "companies": [
      "google",
      "microsoft"
    ]
  },
  {
    "id": "permutation-sequence",
    "title": "Permutation Sequence",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/permutation-sequence/",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "generate-parentheses-2",
    "title": "Generate Parentheses",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 14,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/generate-parentheses/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "letter-combinations-of-a-phone-number",
    "title": "Letter Combinations of a Phone Number",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 15,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "n-queens",
    "title": "N Queens",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 16,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/n-queens/",
    "difficulty": "Hard",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "valid-anagram",
    "title": "Valid Anagram",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 17,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/valid-anagram/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "k-closest-points-to-origin",
    "title": "K Closest Points to Origin",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 18,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "sum-of-subsequence-widths",
    "title": "Sum of Subsequence Widths",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 19,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sum-of-subsequence-widths/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "minimum-difference-between-highest-and-lowest-of-k-scores",
    "title": "Minimum Difference Between Highest and Lowest of K Scores",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 20,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "matchsticks-to-square",
    "title": "Matchsticks to Square",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 21,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/matchsticks-to-square/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "partition-to-k-equal-sum-subsets",
    "title": "Partition to K Equal Sum Subsets",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 22,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "closest-dessert-cost",
    "title": "Closest Dessert Cost",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 23,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/closest-dessert-cost/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "construct-the-lexicographically-largest-valid-sequence",
    "title": "Construct the Lexicographically Largest Valid Sequence",
    "topic": "Backtracking",
    "topicLabel": "Backtracking",
    "num": 24,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/construct-the-lexicographically-largest-valid-sequence/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "valid-anagram-2",
    "title": "Valid Anagram",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/valid-anagram/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "k-closest-points-to-origin-2",
    "title": "K Closest Points to Origin",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google"
    ]
  },
  {
    "id": "sum-of-subsequence-widths-2",
    "title": "Sum of Subsequence Widths",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sum-of-subsequence-widths/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "minimum-difference-between-highest-and-lowest-of-k-scores-2",
    "title": "Minimum Difference Between Highest and Lowest of K Scores",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "inversions",
    "title": "Inversions",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 5,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/inversions/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "sort-colors",
    "title": "Sort Colors",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sort-colors/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "reverse-pairs",
    "title": "Reverse Pairs",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/reverse-pairs/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "merge-intervals",
    "title": "Merge Intervals",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/merge-intervals/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "insert-interval",
    "title": "Insert Interval",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/insert-interval/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "sort-an-array",
    "title": "Sort an Array",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sort-an-array/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "largest-number",
    "title": "Largest Number",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/largest-number/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "h-index",
    "title": "H Index",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/h-index/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "relative-sort-array",
    "title": "Relative Sort Array",
    "topic": "Sorting",
    "topicLabel": "Sorting",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/relative-sort-array/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "subarray-with-0-sum",
    "title": "Subarray with 0 Sum",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 1,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/subarray-with-0-sum-1587115621/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart",
      "razorpay"
    ]
  },
  {
    "id": "consecutive-array-elements",
    "title": "Consecutive Array Elements",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 2,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/consecutive-array-elements2711/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "equal",
    "title": "Equal",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 3,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/equal/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "a",
    "title": "A",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 4,
    "platform": "Codeforces",
    "url": "https://codeforces.com/problemset/problem/713/A",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "subarray-sum-equals-k",
    "title": "Subarray Sum Equals K",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "cred",
      "flipkart",
      "google",
      "microsoft",
      "razorpay",
      "swiggy",
      "zomato"
    ]
  },
  {
    "id": "valid-anagram-2-2",
    "title": "Valid Anagram",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/valid-anagram/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "valid-sudoku",
    "title": "Valid Sudoku",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/valid-sudoku/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "core4",
    "title": "Core4",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 8,
    "platform": "CodeChef",
    "url": "https://www.codechef.com/problems/CORE4",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "max-points-on-a-line",
    "title": "Max Points on a Line",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/max-points-on-a-line/",
    "difficulty": "Hard",
    "companies": [
      "google"
    ]
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "difficulty": "Medium",
    "companies": [
      "adobe",
      "airbnb",
      "amazon",
      "apple",
      "cred",
      "flipkart",
      "google",
      "linkedin",
      "meesho",
      "meta",
      "microsoft",
      "netflix",
      "razorpay",
      "salesforce",
      "swiggy",
      "twitter",
      "uber",
      "zomato"
    ]
  },
  {
    "id": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/minimum-window-substring/",
    "difficulty": "Hard",
    "companies": [
      "adobe",
      "airbnb",
      "amazon",
      "google",
      "meta",
      "microsoft",
      "netflix",
      "twitter"
    ]
  },
  {
    "id": "palindrome-pairs",
    "title": "Palindrome Pairs",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/palindrome-pairs/",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "grid-illumination",
    "title": "Grid Illumination",
    "topic": "Hashing",
    "topicLabel": "Hashing",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/grid-illumination/",
    "difficulty": "Medium",
    "companies": [
      "google"
    ]
  },
  {
    "id": "longest-common-prefix",
    "title": "Longest Common Prefix",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/longest-common-prefix/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "reverse-words-in-a-string",
    "title": "Reverse Words in a String",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/reverse-words-in-a-string/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "b",
    "title": "B",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 3,
    "platform": "Codeforces",
    "url": "https://codeforces.com/problemset/problem/1156/B",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "integer-to-roman",
    "title": "Integer to Roman",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/integer-to-roman/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "is-subsequence",
    "title": "Is Subsequence",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/is-subsequence/",
    "difficulty": "Medium",
    "companies": [
      "google"
    ]
  },
  {
    "id": "roman-to-integer",
    "title": "Roman to Integer",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/roman-to-integer/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "shortest-palindrome",
    "title": "Shortest Palindrome",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/shortest-palindrome/",
    "difficulty": "Hard",
    "companies": [
      "google"
    ]
  },
  {
    "id": "sum-of-scores-of-built-strings",
    "title": "Sum of Scores of Built Strings",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sum-of-scores-of-built-strings/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "longest-happy-prefix",
    "title": "Longest Happy Prefix",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/longest-happy-prefix/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "repeated-string-match",
    "title": "Repeated String Match",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/repeated-string-match/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google"
    ]
  },
  {
    "id": "search-pattern",
    "title": "Search Pattern",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 11,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/search-pattern0205/1",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "string-to-integer-atoi",
    "title": "String to Integer Atoi",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/string-to-integer-atoi/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "group-anagrams",
    "title": "Group Anagrams",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/group-anagrams/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "string-compression",
    "title": "String Compression",
    "topic": "Strings",
    "topicLabel": "Strings",
    "num": 14,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/string-compression/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "evaluate-reverse-polish-notation",
    "title": "Evaluate Reverse Polish Notation",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "linkedin",
      "microsoft"
    ]
  },
  {
    "id": "largest-rectangle-in-histogram",
    "title": "Largest Rectangle in Histogram",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "difficulty": "Hard",
    "companies": [
      "adobe",
      "amazon",
      "google",
      "linkedin",
      "microsoft"
    ]
  },
  {
    "id": "nearest-smaller-element",
    "title": "Nearest Smaller Element",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 3,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/nearest-smaller-element/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart"
    ]
  },
  {
    "id": "infix-to-postfix",
    "title": "Infix to Postfix",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 4,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/infix-to-postfix-1587115620/1",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "gas-station",
    "title": "Gas Station",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/gas-station/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "uber"
    ]
  },
  {
    "id": "valid-parentheses",
    "title": "Valid Parentheses",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/valid-parentheses/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "min-stack",
    "title": "Min Stack",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/min-stack/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "daily-temperatures",
    "title": "Daily Temperatures",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/daily-temperatures/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "next-greater-element-i",
    "title": "Next Greater Element I",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/next-greater-element-i/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "next-greater-element-ii",
    "title": "Next Greater Element II",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/next-greater-element-ii/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "asteroid-collision",
    "title": "Asteroid Collision",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/asteroid-collision/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "decode-string",
    "title": "Decode String",
    "topic": "Stacks",
    "topicLabel": "Stacks",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/decode-string/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "sliding-window-maximum",
    "title": "Sliding Window Maximum",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/sliding-window-maximum/",
    "difficulty": "Hard",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "sum-of-minimum-and-maximum-elements-of-all-subarrays-of-size-k-1171047",
    "title": "Sum of Minimum and Maximum Elements of All Subarrays of Size K_1171047",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 2,
    "platform": "CodingNinjas",
    "url": "https://www.codingninjas.com/studio/problems/sum-of-minimum-and-maximum-elements-of-all-subarrays-of-size-k_1171047",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "reverse-first-k-elements-of-queue",
    "title": "Reverse First K Elements of Queue",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 3,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/reverse-first-k-elements-of-queue/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "implement-queue-using-stacks",
    "title": "Implement Queue Using Stacks",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/implement-queue-using-stacks/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "design-circular-queue",
    "title": "Design Circular Queue",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/design-circular-queue/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "design-circular-deque",
    "title": "Design Circular Deque",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/design-circular-deque/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "number-of-recent-calls",
    "title": "Number of Recent Calls",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/number-of-recent-calls/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "dota2-senate",
    "title": "Dota2 Senate",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/dota2-senate/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "reveal-cards-in-increasing-order",
    "title": "Reveal Cards in Increasing Order",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/reveal-cards-in-increasing-order/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "shortest-subarray-with-sum-at-least-k",
    "title": "Shortest Subarray with Sum at Least K",
    "topic": "Queues",
    "topicLabel": "Queues",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "nth-node-from-end-of-linked-list",
    "title": "Nth Node from End of Linked List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 1,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "linked-list-cycle",
    "title": "Linked List Cycle",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/linked-list-cycle/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "linked-list-cycle-ii",
    "title": "Linked List Cycle II",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google"
    ]
  },
  {
    "id": "middle-of-the-linked-list",
    "title": "Middle of the Linked List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/middle-of-the-linked-list/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "apple",
      "cred",
      "flipkart",
      "google",
      "meesho",
      "meta",
      "microsoft",
      "razorpay",
      "swiggy",
      "twitter",
      "uber",
      "zomato"
    ]
  },
  {
    "id": "intersection-of-two-linked-lists",
    "title": "Intersection of Two Linked Lists",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "flipkart",
      "microsoft"
    ]
  },
  {
    "id": "remove-nth-node-from-end-of-list",
    "title": "Remove Nth Node from End of List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "swap-nodes-in-pairs",
    "title": "Swap Nodes in Pairs",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/swap-nodes-in-pairs/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "add-two-numbers",
    "title": "Add Two Numbers",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/add-two-numbers/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "meta",
      "microsoft",
      "razorpay"
    ]
  },
  {
    "id": "delete-the-middle-node-of-a-linked-list",
    "title": "Delete the Middle Node of a Linked List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "remove-loop-in-linked-list",
    "title": "Remove Loop in Linked List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 11,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "remove-duplicates-from-sorted-list",
    "title": "Remove Duplicates from Sorted List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "remove-loop-in-linked-list-2",
    "title": "Remove Loop in Linked List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 13,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "linked-list-cycle-ii-2",
    "title": "Linked List Cycle II",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 14,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "reverse-linked-list",
    "title": "Reverse Linked List",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 15,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/reverse-linked-list/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "apple",
      "cred",
      "flipkart",
      "google",
      "meesho",
      "meta",
      "microsoft",
      "razorpay",
      "swiggy",
      "twitter",
      "uber",
      "zomato"
    ]
  },
  {
    "id": "reverse-nodes-in-k-group",
    "title": "Reverse Nodes in K Group",
    "topic": "Linked_Lists",
    "topicLabel": "Linked Lists",
    "num": 16,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "difficulty": "Hard",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "binary-tree-inorder-traversal",
    "title": "Binary Tree Inorder Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "binary-tree-postorder-traversal",
    "title": "Binary Tree Postorder Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "binary-tree-preorder-traversal",
    "title": "Binary Tree Preorder Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    "difficulty": "Easy",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "difficulty": "Easy",
    "companies": [
      "adobe",
      "airbnb",
      "amazon",
      "apple",
      "cred",
      "flipkart",
      "google",
      "linkedin",
      "meesho",
      "meta",
      "microsoft",
      "netflix",
      "razorpay",
      "salesforce",
      "swiggy",
      "twitter",
      "uber",
      "zomato"
    ]
  },
  {
    "id": "binary-tree-zigzag-level-order-traversal",
    "title": "Binary Tree Zigzag Level Order Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "vertical-order-traversal-of-a-binary-tree",
    "title": "Vertical Order Traversal of a Binary Tree",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google"
    ]
  },
  {
    "id": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "construct-binary-tree-from-inorder-and-postorder-traversal",
    "title": "Construct Binary Tree from Inorder and Postorder Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "balanced-binary-tree",
    "title": "Balanced Binary Tree",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/balanced-binary-tree/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "apple",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "check-tree-traversal",
    "title": "Check Tree Traversal",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 10,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/check-tree-traversal--141628/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "lowest-common-ancestor-of-a-binary-tree",
    "title": "Lowest Common Ancestor of a Binary Tree",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    "difficulty": "Medium",
    "companies": [
      "adobe",
      "airbnb",
      "amazon",
      "apple",
      "cred",
      "flipkart",
      "google",
      "linkedin",
      "meesho",
      "meta",
      "microsoft",
      "netflix",
      "razorpay",
      "salesforce",
      "swiggy",
      "twitter",
      "uber",
      "zomato"
    ]
  },
  {
    "id": "flip-equivalent-binary-trees",
    "title": "Flip Equivalent Binary Trees",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/flip-equivalent-binary-trees/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "binary-tree-longest-consecutive-sequence",
    "title": "Binary Tree Longest Consecutive Sequence",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/binary-tree-longest-consecutive-sequence/",
    "premium": true,
    "freeUrl": "https://www.geeksforgeeks.org/problems/longest-consecutive-sequence-in-binary-tree/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "populating-next-right-pointers-in-each-node",
    "title": "Populating Next Right Pointers in Each Node",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 14,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "find-duplicate-subtrees",
    "title": "Find Duplicate Subtrees",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 15,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/find-duplicate-subtrees/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "binary-tree-right-side-view",
    "title": "Binary Tree Right Side View",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 16,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/binary-tree-right-side-view/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "top-view-of-binary-tree",
    "title": "Top View of Binary Tree",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 17,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart"
    ]
  },
  {
    "id": "equal-tree-partition",
    "title": "Equal Tree Partition",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 18,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/equal-tree-partition/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "odd-even-level-difference",
    "title": "Odd Even Level Difference",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 19,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/odd-even-level-difference/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "recover-binary-search-tree",
    "title": "Recover Binary Search Tree",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 20,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/recover-binary-search-tree/",
    "difficulty": "Hard",
    "companies": [
      "amazon",
      "microsoft"
    ]
  },
  {
    "id": "recover-binary-search-tree-2",
    "title": "Recover Binary Search Tree",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 21,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/recover-binary-search-tree/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 22,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/validate-binary-search-tree/",
    "difficulty": "Medium",
    "companies": [
      "adobe",
      "amazon",
      "google",
      "linkedin",
      "meta",
      "microsoft",
      "razorpay",
      "swiggy",
      "zomato"
    ]
  },
  {
    "id": "all-elements-in-two-binary-search-trees",
    "title": "All Elements in Two Binary Search Trees",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 23,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/all-elements-in-two-binary-search-trees/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "range-sum-of-bst",
    "title": "Range Sum of Bst",
    "topic": "Trees",
    "topicLabel": "Trees",
    "num": 24,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/range-sum-of-bst/",
    "difficulty": "Easy",
    "companies": []
  },
  {
    "id": "k-largest-elements",
    "title": "K Largest Elements",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 1,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/k-largest-elements4206/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart"
    ]
  },
  {
    "id": "k-closest-points-to-origin-2-2",
    "title": "K Closest Points to Origin",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "minimum-cost-to-connect-sticks",
    "title": "Minimum Cost to Connect Sticks",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/minimum-cost-to-connect-sticks/",
    "premium": true,
    "freeUrl": "https://www.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "merge-k-sorted-arrays",
    "title": "Merge K Sorted Arrays",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 4,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/merge-k-sorted-arrays/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "n-max-pair-combinations",
    "title": "N Max Pair Combinations",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 5,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/n-max-pair-combinations/",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "largest-element-after-k-operations-on-array",
    "title": "Largest Element After K Operations on Array",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 6,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/largest-element-after-k-operations-on-array/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "ways-to-form-max-heap",
    "title": "Ways to Form Max Heap",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 7,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/ways-to-form-max-heap/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "kth-largest-element-in-an-array",
    "title": "Kth Largest Element in an Array",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart",
      "google",
      "meta",
      "microsoft"
    ]
  },
  {
    "id": "magician-and-chocolates",
    "title": "Magician and Chocolates",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 9,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/magician-and-chocolates/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/top-k-frequent-elements/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "find-median-from-data-stream",
    "title": "Find Median from Data Stream",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/find-median-from-data-stream/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "merge-k-sorted-lists",
    "title": "Merge K Sorted Lists",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "find-k-pairs-with-smallest-sums",
    "title": "Find K Pairs with Smallest Sums",
    "topic": "Heaps",
    "topicLabel": "Heaps",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "maximum-sum-combinations",
    "title": "Maximum Sum Combinations",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 1,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/maximum-sum-combinations/",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "find-the-largest-pair-sum-in-an-unsorted-array",
    "title": "Find the Largest Pair Sum in an Unsorted Array",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 2,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/find-the-largest-pair-sum-in-an-unsorted-array/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "kth-smallest-element-in-a-sorted-matrix",
    "title": "Kth Smallest Element in a Sorted Matrix",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
    "difficulty": "Medium",
    "companies": [
      "google"
    ]
  },
  {
    "id": "task-scheduler",
    "title": "Task Scheduler",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/task-scheduler/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft",
      "swiggy"
    ]
  },
  {
    "id": "fractional-knapsack",
    "title": "Fractional Knapsack",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 5,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
    "difficulty": "Medium",
    "companies": [
      "amazon"
    ]
  },
  {
    "id": "activity-selection",
    "title": "Activity Selection",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 6,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart",
      "google"
    ]
  },
  {
    "id": "job-sequencing-problem",
    "title": "Job Sequencing Problem",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 7,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart"
    ]
  },
  {
    "id": "candy",
    "title": "Candy",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/candy/",
    "difficulty": "Hard",
    "companies": [
      "amazon",
      "google",
      "meta"
    ]
  },
  {
    "id": "meeting-rooms-ii",
    "title": "Meeting Rooms II",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/meeting-rooms-ii/",
    "premium": true,
    "freeUrl": "https://www.interviewbit.com/problems/meeting-rooms/",
    "difficulty": "Medium",
    "companies": [
      "airbnb",
      "amazon",
      "flipkart",
      "google",
      "meta",
      "microsoft",
      "swiggy",
      "uber",
      "zomato"
    ]
  },
  {
    "id": "seats",
    "title": "Seats",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 10,
    "platform": "InterviewBit",
    "url": "https://www.interviewbit.com/problems/seats/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "jump-game-ii",
    "title": "Jump Game II",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/jump-game-ii/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "partition-labels",
    "title": "Partition Labels",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/partition-labels/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "minimum-number-of-arrows-to-burst-balloons",
    "title": "Minimum Number of Arrows to Burst Balloons",
    "topic": "Greedy_Algorithm",
    "topicLabel": "Greedy Algorithm",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "fibonacci-number",
    "title": "Fibonacci Number",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/fibonacci-number/",
    "difficulty": "Easy",
    "companies": [
      "amazon",
      "apple",
      "microsoft"
    ]
  },
  {
    "id": "climbing-stairs",
    "title": "Climbing Stairs",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/climbing-stairs/",
    "difficulty": "Easy",
    "companies": [
      "adobe",
      "amazon",
      "apple",
      "cred",
      "flipkart",
      "google",
      "meesho",
      "microsoft",
      "razorpay",
      "salesforce",
      "swiggy",
      "zomato"
    ]
  },
  {
    "id": "ways-to-tile-a-floor",
    "title": "Ways to Tile a Floor",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 3,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/ways-to-tile-a-floor5836/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "coin-change",
    "title": "Coin Change",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/coin-change/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "uber"
    ]
  },
  {
    "id": "jump-game",
    "title": "Jump Game",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/jump-game/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "0-1-knapsack-problem",
    "title": "0 1 Knapsack Problem",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 6,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "flipkart"
    ]
  },
  {
    "id": "house-robber",
    "title": "House Robber",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/house-robber/",
    "difficulty": "Medium",
    "companies": [
      "airbnb",
      "amazon",
      "cred",
      "netflix",
      "razorpay",
      "salesforce",
      "swiggy",
      "twitter",
      "uber"
    ]
  },
  {
    "id": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "difficulty": "Medium",
    "companies": [
      "adobe",
      "airbnb",
      "amazon",
      "flipkart",
      "google",
      "linkedin",
      "microsoft",
      "netflix",
      "zomato"
    ]
  },
  {
    "id": "longest-bitonic-subsequence",
    "title": "Longest Bitonic Subsequence",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 9,
    "platform": "GeeksforGeeks",
    "url": "https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0824/1",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "jump-game-v",
    "title": "Jump Game V",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/jump-game-v/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/maximum-product-subarray/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "linkedin",
      "meta",
      "microsoft",
      "razorpay"
    ]
  },
  {
    "id": "perfect-squares",
    "title": "Perfect Squares",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/perfect-squares/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "longest-common-subsequence",
    "title": "Longest Common Subsequence",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/longest-common-subsequence/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "edit-distance",
    "title": "Edit Distance",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 14,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/edit-distance/",
    "difficulty": "Hard",
    "companies": []
  },
  {
    "id": "partition-equal-subset-sum",
    "title": "Partition Equal Subset Sum",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 15,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/partition-equal-subset-sum/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "word-break",
    "title": "Word Break",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 16,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/word-break/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "coin-change-ii",
    "title": "Coin Change II",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 17,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/coin-change-ii/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "longest-palindromic-subsequence",
    "title": "Longest Palindromic Subsequence",
    "topic": "Dynamic_Programming",
    "topicLabel": "Dynamic Programming",
    "num": 18,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/longest-palindromic-subsequence/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "course-schedule",
    "title": "Course Schedule",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 1,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/course-schedule/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft"
    ]
  },
  {
    "id": "is-graph-bipartite",
    "title": "Is Graph Bipartite",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 2,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/is-graph-bipartite/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google"
    ]
  },
  {
    "id": "network-delay-time",
    "title": "Network Delay Time",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 3,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/network-delay-time/",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "uber"
    ]
  },
  {
    "id": "course-schedule-ii",
    "title": "Course Schedule II",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 4,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/course-schedule-ii/",
    "difficulty": "Medium",
    "companies": [
      "airbnb",
      "amazon",
      "google",
      "meta",
      "microsoft",
      "netflix",
      "uber"
    ]
  },
  {
    "id": "connecting-cities-with-minimum-cost",
    "title": "Connecting Cities with Minimum Cost",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 5,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",
    "premium": true,
    "freeUrl": "https://algo.monster/liteproblems/1135",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "number-of-islands",
    "title": "Number of Islands",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 6,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/number-of-islands/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "clone-graph",
    "title": "Clone Graph",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 7,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/clone-graph/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "rotting-oranges",
    "title": "Rotting Oranges",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 8,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/rotting-oranges/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 9,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "surrounded-regions",
    "title": "Surrounded Regions",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 10,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/surrounded-regions/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "word-ladder",
    "title": "Word Ladder",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 11,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/word-ladder/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "redundant-connection",
    "title": "Redundant Connection",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 12,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/redundant-connection/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "find-if-path-exists-in-graph",
    "title": "Find If Path Exists in Graph",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 13,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "cheapest-flights-within-k-stops",
    "title": "Cheapest Flights Within K Stops",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 14,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    "difficulty": "Medium",
    "companies": []
  },
  {
    "id": "accounts-merge",
    "title": "Accounts Merge",
    "topic": "Graphs",
    "topicLabel": "Graphs",
    "num": 15,
    "platform": "LeetCode",
    "url": "https://leetcode.com/problems/accounts-merge/",
    "difficulty": "Medium",
    "companies": []
  }
];

export const TOTAL_PROBLEMS = PROBLEMS.length;

/** Fast id -> problem lookup, built once at module load. */
export const PROBLEM_BY_ID = new Map(PROBLEMS.map((p) => [p.id, p]));

export const COMPANY_BY_KEY = new Map(COMPANIES.map((c) => [c.key, c]));

/** Problems belonging to one topic, in sheet order. */
export function problemsByTopic(topicKey: string): Problem[] {
  return PROBLEMS.filter((p) => p.topic === topicKey);
}
