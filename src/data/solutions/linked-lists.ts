import type { Solution } from '@/lib/types';

/**
 * Linked lists. Two techniques cover most of this topic: the fast/slow pointer
 * pair (cycle detection, finding the middle, finding the nth from the end) and
 * iterative pointer reversal. Both are worth being able to write without
 * thinking.
 */
export const linkedListSolutions: Solution[] = [
  {
    problemId: 'reverse-linked-list',
    statement: 'Given the head of a singly linked list, reverse it and return the new head.',
    starter: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Walk the list collecting values into an array, then build a brand new list from the array backwards. Works, but allocates a second list and does not teach the pointer manipulation the question is really about.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function reverseList(head: ListNode | null): ListNode | null {
  const values: number[] = [];

  for (let node = head; node !== null; node = node.next) {
    values.push(node.val);
  }

  // Rebuild from the back, each new node pointing at what we built so far.
  let newHead: ListNode | null = null;
  for (const value of values) {
    newHead = new ListNode(value, newHead);
  }

  return newHead;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Reverse the links in place with three pointers. Walk forward, and at each node flip its next pointer to point backwards. The only subtlety is that flipping the pointer destroys your way forward, so you must save the next node before you overwrite it — that single line is what the whole problem is testing.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function reverseList(head: ListNode | null): ListNode | null {
  // Everything before "current" has already been reversed; "previous" is the
  // head of that reversed portion.
  let previous: ListNode | null = null;
  let current: ListNode | null = head;

  while (current !== null) {
    // Save the way forward BEFORE we overwrite current.next -- without this
    // line the rest of the list becomes unreachable.
    const nextNode: ListNode | null = current.next;

    // Flip this node's pointer to face backwards.
    current.next = previous;

    // Shuffle both pointers one step along.
    previous = current;
    current = nextNode;
  }

  // current is null, so previous is the last node visited -- the new head.
  return previous;
}`,
      },
    ],
  },

  {
    problemId: 'linked-list-cycle',
    statement:
      'Given the head of a linked list, determine whether it contains a cycle — that is, whether any node can be reached again by following next pointers.',
    starter: `function hasCycle(head: ListNode | null): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'Record every node you visit in a set. If you arrive at a node already in the set, there is a cycle; if you reach the end, there is not. Linear time but linear extra memory.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function hasCycle(head: ListNode | null): boolean {
  // Store node references, not values -- values can repeat legitimately.
  const seen = new Set<ListNode>();

  for (let node = head; node !== null; node = node.next) {
    if (seen.has(node)) return true;
    seen.add(node);
  }

  // Reached a null next pointer, so the list terminates.
  return false;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Floyd's cycle detection. Move one pointer a step at a time and another two steps at a time. On a straight list the fast one runs off the end. Inside a loop the fast pointer gains exactly one position per iteration on the slow one, so it must eventually land on it — it cannot jump past. No extra memory at all.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function hasCycle(head: ListNode | null): boolean {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // fast moves two steps, so BOTH fast and fast.next must exist before we
  // dereference them -- this condition is the whole safety check.
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;       // one step
    fast = fast.next.next;   // two steps

    // Inside a loop the gap closes by one each iteration, so a meeting is
    // guaranteed. It can never be skipped over.
    if (slow === fast) return true;
  }

  // Ran off the end: no cycle.
  return false;
}`,
      },
    ],
  },

  {
    problemId: 'linked-list-cycle-ii',
    statement:
      'Given a linked list containing a cycle, return the node where the cycle begins. Return null if there is no cycle.',
    starter: `function detectCycle(head: ListNode | null): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Better',
        idea: 'Walk the list recording nodes in a set. The first node you see twice is the entry point of the cycle.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function detectCycle(head: ListNode | null): ListNode | null {
  const seen = new Set<ListNode>();

  for (let node = head; node !== null; node = node.next) {
    // The first repeat is exactly where the loop closes back on itself.
    if (seen.has(node)) return node;
    seen.add(node);
  }

  return null;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Floyd's algorithm, phase two. Once slow and fast meet, reset one pointer to the head and advance both one step at a time — they meet again precisely at the cycle entrance. The reason: if the entrance is F steps from the head and the meeting point is a steps into the cycle of length C, the arithmetic of the two-versus-one speeds works out so that F and the remaining distance from the meeting point back to the entrance are congruent modulo C.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function detectCycle(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // --- Phase 1: find a meeting point inside the cycle (or prove none) ---
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }

  // Exited because the list ended, not because they met.
  if (fast === null || fast.next === null) return null;

  // --- Phase 2: walk one pointer from the head at the same speed ---
  // The distance from the head to the entrance equals the distance from the
  // meeting point to the entrance (mod cycle length), so they converge there.
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
    problemId: 'middle-of-the-linked-list',
    statement:
      'Return the middle node of a linked list. If there are two middle nodes, return the second one.',
    starter: `function middleNode(head: ListNode | null): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Walk the list once to count the nodes, then walk again to the halfway index. Two passes.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function middleNode(head: ListNode | null): ListNode | null {
  let length = 0;
  for (let node = head; node !== null; node = node.next) length++;

  // Integer division lands on the second middle for even lengths, which is
  // what the problem asks for.
  let node = head;
  for (let i = 0; i < Math.floor(length / 2); i++) {
    node = node!.next;
  }

  return node;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Fast and slow pointers, one pass. When the fast pointer reaches the end having moved twice as far, the slow pointer is exactly halfway. Starting both at the head and using this loop condition naturally returns the second middle on an even-length list, which is what the problem wants.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  // fast covers twice the ground, so when it finishes, slow is at the middle.
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  // For an even length, fast becomes null exactly when slow sits on the
  // SECOND middle node -- which is the one requested.
  return slow;
}`,
      },
    ],
  },

  {
    problemId: 'remove-nth-node-from-end-of-list',
    statement:
      'Given a linked list, remove the nth node counting from the end and return the head.',
    starter: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Count the length, then walk to the node just before position (length - n) and unlink. Two passes, and it needs a special case when removing the head.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  let length = 0;
  for (let node = head; node !== null; node = node.next) length++;

  // Removing the first node has no predecessor to rewire.
  if (length === n) return head!.next;

  let node = head;
  for (let i = 0; i < length - n - 1; i++) {
    node = node!.next;
  }

  node!.next = node!.next!.next;
  return head;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'One pass with two pointers held n+1 apart. Advance the lead pointer n+1 steps first, then move both together; when the lead falls off the end, the trailing pointer sits just before the node to remove. A dummy node in front of the head removes the special case for deleting the first node — the same code then handles every position.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // The dummy gives the real head a predecessor, so removing the first node
  // needs no special branch.
  const dummy = new ListNode(0, head);

  let lead: ListNode | null = dummy;
  let trail: ListNode | null = dummy;

  // Open a gap of n + 1, so that when lead hits null, trail is one BEFORE
  // the target rather than on it.
  for (let i = 0; i <= n; i++) {
    lead = lead!.next;
  }

  // Move in lockstep; the gap is preserved.
  while (lead !== null) {
    lead = lead.next;
    trail = trail!.next;
  }

  // trail.next is the node to drop.
  trail!.next = trail!.next!.next;

  // Return dummy.next, not head -- head may have been the node removed.
  return dummy.next;
}`,
      },
    ],
  },

  {
    problemId: 'merge-two-sorted-lists',
    statement:
      'Merge two sorted linked lists into one sorted list, splicing the existing nodes together rather than allocating new ones.',
    starter: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'The merge step of merge sort. Repeatedly take whichever list has the smaller head and append it to the result. A dummy head node means you never have to special-case the first append, and once one list runs out the other is already sorted so it can be attached wholesale.',
        time: 'O(m + n)',
        space: 'O(1)',
        code: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // The dummy holds the list together while we build; its next is the real
  // answer. Without it, the first append needs its own special case.
  const dummy = new ListNode(0);
  let tail = dummy;

  while (list1 !== null && list2 !== null) {
    // <= rather than < keeps the merge stable, preserving the relative order
    // of equal values.
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  // One list is exhausted; the remainder of the other is already sorted, so
  // attach it in one move rather than node by node.
  tail.next = list1 !== null ? list1 : list2;

  return dummy.next;
}`,
      },
    ],
  },

  {
    problemId: 'add-two-numbers',
    statement:
      'Two numbers are represented as linked lists of digits in reverse order. Add them and return the sum as a linked list in the same format.',
    starter: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Because the digits are already reversed, the list heads are the least significant digits — exactly the order you add by hand. Walk both lists together carrying as you go. The loop condition must also test the carry, otherwise a final carry out of the most significant digit (99 + 1) is silently dropped.',
        time: 'O(max(m, n))',
        space: 'O(max(m, n)) for the result',
        code: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;

  // Keep going while EITHER list has digits left or a carry is outstanding.
  // Dropping the carry from this condition is the classic bug: 99 + 1 would
  // produce 00 instead of 001.
  while (l1 !== null || l2 !== null || carry > 0) {
    // A shorter list contributes 0 once it runs out.
    const digit1 = l1?.val ?? 0;
    const digit2 = l2?.val ?? 0;

    const sum = digit1 + digit2 + carry;

    // Keep the ones place here; the tens place carries into the next node.
    tail.next = new ListNode(sum % 10);
    carry = Math.floor(sum / 10);

    tail = tail.next;
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }

  return dummy.next;
}`,
      },
    ],
  },

  {
    problemId: 'reverse-nodes-in-k-group',
    statement:
      'Reverse the nodes of a linked list k at a time and return the modified list. If the remaining nodes are fewer than k, leave them as they are.',
    starter: `function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'For each group: first check that k nodes actually remain, because a short tail must be left untouched. Then reverse exactly k nodes with the standard three-pointer loop, and rewire the boundaries — the previous group tail points at the new group head, and the old group head becomes the tail pointing at whatever comes next. A dummy node makes the first group behave like every other one.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0, head);

  // The tail of the last fully reversed group -- its next must be rewired
  // to the head of the group we are about to reverse.
  let groupPrev = dummy;

  for (;;) {
    // --- Do k nodes actually remain? A short tail is left alone. ---
    let check: ListNode | null = groupPrev;
    for (let i = 0; i < k && check !== null; i++) {
      check = check.next;
    }
    if (check === null) break;

    // The node after this group; reversal stops when it is reached.
    const groupNext = check.next;

    // --- Reverse exactly k nodes, standard three-pointer walk ---
    // Seeding "previous" with groupNext means the last node of the reversed
    // group ends up pointing at the rest of the list automatically.
    let previous: ListNode | null = groupNext;
    let current: ListNode | null = groupPrev.next;

    for (let i = 0; i < k; i++) {
      const nextNode: ListNode | null = current!.next;
      current!.next = previous;
      previous = current;
      current = nextNode;
    }

    // --- Rewire the boundary ---
    // The old group head is now its tail; remember it before overwriting.
    const oldGroupHead = groupPrev.next;
    groupPrev.next = previous; // "previous" is the new head of this group
    groupPrev = oldGroupHead!; // and the old head is the tail for next time
  }

  return dummy.next;
}`,
      },
    ],
  },
];
