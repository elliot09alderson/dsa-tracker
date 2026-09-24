import type { Solution } from '@/lib/types';

/**
 * Linked lists, part two.
 *
 * The first file covers reversal and the fast/slow pointer pair on their
 * own. This one combines those with a bit more bookkeeping: removing a node
 * relative to another list or a cycle, swapping nodes in place, and finding
 * where two lists meet.
 *
 * Split from linked-lists.ts purely to keep each file a readable size.
 */
export const linkedList2Solutions: Solution[] = [
  {
    problemId: 'nth-node-from-end-of-linked-list',
    statement:
      'Given the head of a singly linked list and an integer n, return the value of the nth node from the end of the list (1-indexed).',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function getNthFromEnd(head: ListNode | null, n: number): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Count the total length first, then walk again to the node at position (length - n) from the front. Two passes, and the length has to be computed before the target index even makes sense.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function getNthFromEnd(head: ListNode | null, n: number): number {
  let length = 0;
  for (let node = head; node !== null; node = node.next) length++;

  // "n from the end" is the same node as "(length - n) from the start".
  let index = length - n;
  let current = head;
  while (index > 0 && current !== null) {
    current = current.next;
    index--;
  }

  return current === null ? -1 : current.val;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'One pass with two pointers kept exactly n nodes apart. Advance the lead pointer n steps first; then move both together. When the lead pointer runs off the end, the trailing pointer sits exactly n nodes from the end -- the gap between them was fixed at n the whole way.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function getNthFromEnd(head: ListNode | null, n: number): number {
  let lead: ListNode | null = head;

  // Open up a gap of n nodes before the second pointer starts moving.
  for (let i = 0; i < n; i++) {
    if (lead === null) return -1; // n is larger than the list
    lead = lead.next;
  }

  let trail = head;
  while (lead !== null) {
    lead = lead.next;
    trail = trail!.next;
  }

  return trail === null ? -1 : trail.val;
}`,
      },
    ],
  },
  {
    problemId: 'swap-nodes-in-pairs',
    statement:
      'Given the head of a linked list, swap every two adjacent nodes and return the new head. Only the links may change -- node values must not be modified.',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function swapPairs(head: ListNode | null): ListNode | null {
  // your code here
  return head;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'The rule against modifying node values is easy to break by accident, so a first version might swap `.val` fields instead of nodes. It passes value-only checks but is not really solving the stated problem; shown here as the tempting shortcut to avoid.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function swapPairs(head: ListNode | null): ListNode | null {
  let node = head;

  // Swaps the DATA of each pair rather than the nodes themselves. Simple,
  // but relies on values being swappable, which the problem forbids when
  // nodes carry more than a bare number.
  while (node !== null && node.next !== null) {
    const temp = node.val;
    node.val = node.next.val;
    node.next.val = temp;
    node = node.next.next;
  }

  return head;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Rewire the actual next pointers, one pair at a time, using a dummy node so the very first pair (which changes the head) needs no special case. For each pair: point "previous" at the second node, point the second node at the first, point the first node at whatever follows, then step forward by the pair.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function swapPairs(head: ListNode | null): ListNode | null {
  // A dummy node ahead of head means swapping the first pair is handled
  // by the same code as every other pair -- no special case needed.
  const dummy = new ListNode(0, head);
  let previous = dummy;

  while (previous.next !== null && previous.next.next !== null) {
    const first = previous.next;
    const second = first.next!;

    // Rewire the three links that make up this swap, in an order that
    // never loses a pointer we still need.
    first.next = second.next;
    second.next = first;
    previous.next = second;

    // "first" is now the second node of the swapped pair, so it is the
    // correct anchor for the next pair.
    previous = first;
  }

  return dummy.next;
}`,
      },
    ],
  },
  {
    problemId: 'remove-duplicates-from-sorted-list',
    statement:
      'Given the head of a sorted singly linked list, delete all duplicate values so each value appears only once, and return the resulting sorted list.',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function deleteDuplicates(head: ListNode | null): ListNode | null {
  // your code here
  return head;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Read every value into a Set, then rebuild the list from the deduplicated values. Correct, but ignores that the list is already sorted -- duplicates are always adjacent -- and pays for a new set of nodes instead of editing links in place.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function deleteDuplicates(head: ListNode | null): ListNode | null {
  const seen = new Set<number>();
  const uniqueValues: number[] = [];

  for (let node = head; node !== null; node = node.next) {
    if (!seen.has(node.val)) {
      seen.add(node.val);
      uniqueValues.push(node.val);
    }
  }

  const dummy = new ListNode(0);
  let tail = dummy;
  for (const value of uniqueValues) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }

  return dummy.next;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Because the list is sorted, a duplicate is always the very next node. Walk once, and whenever the next node repeats the current value, splice it out by skipping it; otherwise move forward. No extra storage and no rebuilding.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function deleteDuplicates(head: ListNode | null): ListNode | null {
  let current = head;

  while (current !== null && current.next !== null) {
    if (current.next.val === current.val) {
      // Skip over the duplicate; "current" itself does not move, since
      // there may be more than one repeat to remove.
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }

  return head;
}`,
      },
    ],
  },
  {
    problemId: 'delete-the-middle-node-of-a-linked-list',
    statement:
      'Given the head of a singly linked list, delete the middle node (the node at index floor(n / 2), 0-indexed) and return the head of the modified list.',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function deleteMiddle(head: ListNode | null): ListNode | null {
  // your code here
  return head;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Count the nodes to find the middle index, then walk again to the node just before it and splice the middle out. Two passes, but easy to reason about since the target index is computed explicitly first.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function deleteMiddle(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return null; // 0 or 1 node

  let length = 0;
  for (let node = head; node !== null; node = node.next) length++;

  const middleIndex = Math.floor(length / 2);

  // Walk to the node just BEFORE the middle so its "next" can be spliced.
  let previous = head;
  for (let i = 0; i < middleIndex - 1; i++) previous = previous.next!;

  previous.next = previous.next!.next;
  return head;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Fast/slow pointers, but start the fast pointer two steps ahead of a "previous" pointer that trails one behind slow. When fast falls off the end, slow sits on the middle node and previous sits right before it -- ready to splice in the same single pass.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function deleteMiddle(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return null;

  let previous: ListNode | null = null;
  let slow: ListNode = head;
  let fast: ListNode | null = head;

  // Fast moves twice as fast as slow, so when fast reaches the end, slow
  // is at the middle -- and previous trails one behind slow, ready to cut.
  while (fast !== null && fast.next !== null) {
    fast = fast.next.next;
    previous = slow;
    slow = slow.next!;
  }

  previous!.next = slow.next; // splice the middle node out
  return head;
}`,
      },
    ],
  },
  {
    problemId: 'intersection-of-two-linked-lists',
    statement:
      'Given the heads of two singly linked lists, return the node at which they intersect (the two lists share a tail), or null if they do not intersect.',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Record every node of list A in a Set, by reference, then walk list B looking for the first node already in that set. Simple and correct, at the cost of memory proportional to the first list.',
        time: 'O(n + m)',
        space: 'O(n)',
        code: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  const nodesInA = new Set<ListNode>();

  for (let node = headA; node !== null; node = node.next) {
    nodesInA.add(node); // identity, not value -- intersection is by node
  }

  for (let node = headB; node !== null; node = node.next) {
    if (nodesInA.has(node)) return node;
  }

  return null;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Two pointers, one starting at each head, each walking their own list and then continuing onto the OTHER list once they reach its end. Both pointers then travel the same total distance (lenA + lenB) before meeting, which lines them up to arrive at the intersection point together -- or both hit null together if there is none.',
        time: 'O(n + m)',
        space: 'O(1)',
        code: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  if (headA === null || headB === null) return null;

  let pointerA: ListNode | null = headA;
  let pointerB: ListNode | null = headB;

  // When a pointer reaches the end of its own list, it hops onto the
  // START of the other one. Doing this exactly once per pointer equalises
  // the distance each has travelled by the time they could meet.
  while (pointerA !== pointerB) {
    pointerA = pointerA === null ? headB : pointerA.next;
    pointerB = pointerB === null ? headA : pointerB.next;
  }

  // Either the intersection node (both pointers equal and non-null) or
  // null (both pointers hit the end at the same step).
  return pointerA;
}`,
      },
    ],
  },
  {
    problemId: 'linked-list-cycle-ii-2',
    statement:
      'Given the head of a singly linked list, return the node where a cycle begins, or null if there is no cycle.',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function detectCycle(head: ListNode | null): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Walk the list remembering every node visited in a Set. The first node encountered a second time is where the cycle begins -- and if the walk reaches null, there is no cycle. Uses memory proportional to the list, which the optimal approach avoids entirely.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function detectCycle(head: ListNode | null): ListNode | null {
  const visited = new Set<ListNode>();

  for (let node = head; node !== null; node = node.next) {
    if (visited.has(node)) return node; // first repeat = cycle start
    visited.add(node);
  }

  return null; // reached the end cleanly, so no cycle
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Floyd's cycle detection in two phases. Phase one: fast/slow pointers meet somewhere inside the cycle if one exists. Phase two -- the part that is easy to forget -- reset one pointer to the head and advance both one step at a time; they now meet exactly at the cycle's start. This works because the distance from the head to the cycle start equals the distance from the meeting point around to the cycle start, a consequence of the arithmetic behind why the two pointers met at all.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function detectCycle(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // Phase 1: detect whether a cycle exists at all.
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break; // they can only meet inside a cycle
  }

  // Fast ran off the end without meeting slow -- no cycle.
  if (fast === null || fast.next === null) return null;

  // Phase 2: find the entry point. Restart one pointer from the head;
  // move both one step at a time until they meet again.
  slow = head;
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
  }

  return slow;
}`,
      },
    ],
  },
  {
    problemId: 'remove-loop-in-linked-list',
    statement:
      'Given the head of a singly linked list that may contain a cycle, remove the cycle (if any) by fixing the appropriate node’s next pointer to null, so the list becomes a straight line again. Do not return anything; modify the list in place.',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function removeLoop(head: ListNode | null): void {
  // your code here -- break the cycle in place, if there is one
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Walk the list remembering the previous node seen at every step in a Set. The moment a node is revisited, its predecessor is the one whose next pointer feeds back into the cycle -- set that pointer to null. Costs memory proportional to the list to detect what the pointer-only method finds for free.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function removeLoop(head: ListNode | null): void {
  const visited = new Set<ListNode>();
  let previous: ListNode | null = null;

  for (let node = head; node !== null; node = node.next) {
    if (visited.has(node)) {
      // "previous" is the last node before re-entering the cycle -- its
      // next pointer is the one creating the loop.
      previous!.next = null;
      return;
    }
    visited.add(node);
    previous = node;
  }

  // Loop finished without a repeat: no cycle, nothing to remove.
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Find the cycle start with Floyd's algorithm (fast/slow meet, then reset one pointer to the head and step both together to find the entry point), exactly as in detecting the entry point. Once that node is known, walk forward from it until the node whose next pointer points back to it, and null that pointer out.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function removeLoop(head: ListNode | null): void {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // Phase 1: does a cycle exist?
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }

  if (fast === null || fast.next === null) return; // no cycle

  // Special case: the cycle starts at the head itself. Then the node
  // whose "next" needs clearing is whichever one currently points back
  // to head -- found by walking until that is true.
  if (slow === head) {
    while (fast!.next !== head) fast = fast!.next;
    fast!.next = null;
    return;
  }

  // Phase 2: find the entry node, same technique as detectCycle.
  slow = head;
  while (slow!.next !== fast!.next) {
    slow = slow!.next;
    fast = fast!.next;
  }

  // "fast" now sits one node before the entry point (they were kept one
  // step apart on purpose), so its next pointer is the loop's source.
  fast!.next = null;
}`,
      },
    ],
  },
];

/**
 * The catalogue lists "Remove Loop in Linked List" twice under two ids, so
 * the same solution is registered under both rather than duplicated by hand.
 */
const removeLoop = linkedList2Solutions.find(
  (s) => s.problemId === 'remove-loop-in-linked-list',
)!;

linkedList2Solutions.push({ ...removeLoop, problemId: 'remove-loop-in-linked-list-2' });
