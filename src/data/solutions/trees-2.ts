import type { Solution } from '@/lib/types';

/**
 * Binary trees, part two.
 *
 * The first file covers the traversals and the classic BST properties. This
 * one picks up the problems that build on them: reconstructing a tree from
 * its traversals, walking it by column rather than by level, and the handful
 * of problems that need a canonical *serialisation* of a subtree in order to
 * compare subtrees to each other.
 *
 * Split from trees.ts purely to keep each file a readable size.
 */
export const trees2Solutions: Solution[] = [
  {
    problemId: 'binary-tree-preorder-traversal',
    statement:
      'Given the root of a binary tree, return its preorder traversal: the node first, then the left subtree, then the right subtree.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function preorderTraversal(root: TreeNode | null): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Write the definition out directly: record the node, recurse left, recurse right. Preorder is the easiest of the three to recurse because the node is handled before either child, so there is nothing to remember on the way down.',
        time: 'O(n)',
        space: 'O(h) call stack, up to O(n) on a skewed tree',
        code: `function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  const visit = (node: TreeNode | null) => {
    if (node === null) return;

    result.push(node.val); // the node comes first -- that is what "pre" means
    visit(node.left);
    visit(node.right);
  };

  visit(root);
  return result;
}`,
      },
      {
        name: 'Better',
        idea:
          'An explicit stack. Pop a node, record it, then push its children. The one thing to get right is the push order: a stack hands back the last thing pushed, so the right child has to go on first for the left child to come out first.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function preorderTraversal(root: TreeNode | null): number[] {
  if (root === null) return [];

  const result: number[] = [];
  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val); // recorded the moment it comes off the stack

    // Right first, so that left ends up on top and is processed next.
    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Morris traversal, which needs no stack and no recursion. Thread the rightmost node of the left subtree back to the current node so there is a way home, exactly as in inorder Morris — the only change is *when* the value is recorded: on the first visit to a node rather than the second.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current: TreeNode | null = root;

  while (current !== null) {
    if (current.left === null) {
      // No left subtree, so nothing is owed before this node.
      result.push(current.val);
      current = current.right;
      continue;
    }

    // Find the predecessor: rightmost node of the left subtree.
    let predecessor: TreeNode = current.left;
    while (predecessor.right !== null && predecessor.right !== current) {
      predecessor = predecessor.right;
    }

    if (predecessor.right === null) {
      // First time here. Record now (preorder!), thread, then go left.
      result.push(current.val);
      predecessor.right = current;
      current = current.left;
    } else {
      // Second time: the left subtree is done, so undo the thread and
      // move right. Nothing is recorded -- it already was, on visit one.
      predecessor.right = null;
      current = current.right;
    }
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'binary-tree-postorder-traversal',
    statement:
      'Given the root of a binary tree, return its postorder traversal: the left subtree, then the right subtree, then the node itself.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function postorderTraversal(root: TreeNode | null): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'The recursive definition. Postorder is the order in which a node can finally be *finished* -- both children are complete before the parent is recorded -- which is why it is the natural order for anything that aggregates upward, like deleting a tree or computing subtree sums.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  const visit = (node: TreeNode | null) => {
    if (node === null) return;

    visit(node.left);
    visit(node.right);
    result.push(node.val); // only after both children are done
  };

  visit(root);
  return result;
}`,
      },
      {
        name: 'Better',
        idea:
          'The trick that makes the iterative version easy: run a *modified preorder* that visits node, right, left, then reverse the whole list at the end. Reversing "node, right, left" gives exactly "left, right, node". One stack, no bookkeeping about whether a child has been seen.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function postorderTraversal(root: TreeNode | null): number[] {
  if (root === null) return [];

  const reversed: number[] = [];
  const stack: TreeNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    reversed.push(node.val);

    // Mirror of preorder: push LEFT first so RIGHT is processed first.
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }

  // We collected node-right-left; reversing yields left-right-node.
  return reversed.reverse();
}`,
      },
      {
        name: 'Optimal',
        idea:
          'A true single-pass iterative postorder, for when reversing at the end is not allowed (streaming output, say). Keep a pointer to the node visited last: we may only record the current node once we have come *back* from its right child, which is exactly the case when lastVisited is that right child.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;
  let lastVisited: TreeNode | null = null;

  while (current !== null || stack.length > 0) {
    // Descend as far left as possible, remembering the way back.
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }

    // Peek rather than pop: we may still owe this node its right subtree.
    const peeked = stack[stack.length - 1];

    if (peeked.right !== null && peeked.right !== lastVisited) {
      // Right subtree exists and has not been done yet -- go do it.
      current = peeked.right;
    } else {
      // Both children are finished, so the node can finally be recorded.
      result.push(peeked.val);
      lastVisited = stack.pop()!;
    }
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'all-elements-in-two-binary-search-trees',
    statement:
      'Given the roots of two binary search trees, return every value from both trees in one sorted ascending list.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function getAllElements(root1: TreeNode | null, root2: TreeNode | null): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Collect every value from both trees in any order, then sort. Correct and two lines long, but it throws away the fact that each tree is already sorted, and pays O(n log n) to rediscover it.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function getAllElements(root1: TreeNode | null, root2: TreeNode | null): number[] {
  const values: number[] = [];

  const collect = (node: TreeNode | null) => {
    if (node === null) return;
    values.push(node.val);
    collect(node.left);
    collect(node.right);
  };

  collect(root1);
  collect(root2);

  // Numeric comparator -- the default sort is lexicographic and would put
  // 10 before 9.
  return values.sort((a, b) => a - b);
}`,
      },
      {
        name: 'Better',
        idea:
          'Use the BST property: an inorder traversal of each tree already comes out sorted. Produce the two sorted lists, then merge them the way merge sort does, which is a single linear pass. Sorting disappears from the cost.',
        time: 'O(n + m)',
        space: 'O(n + m)',
        code: `function getAllElements(root1: TreeNode | null, root2: TreeNode | null): number[] {
  // Inorder on a BST yields values in ascending order.
  const inorder = (node: TreeNode | null, out: number[] = []): number[] => {
    if (node === null) return out;
    inorder(node.left, out);
    out.push(node.val);
    inorder(node.right, out);
    return out;
  };

  const a = inorder(root1);
  const b = inorder(root2);

  // Standard two-pointer merge of two sorted arrays.
  const merged: number[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) merged.push(a[i++]);
    else merged.push(b[j++]);
  }

  // At most one of these two loops actually runs.
  while (i < a.length) merged.push(a[i++]);
  while (j < b.length) merged.push(b[j++]);

  return merged;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Same merge, but interleaved with the traversals instead of after them, using two explicit stacks. Each stack holds only the path down to the next unvisited node, so the extra memory is O(h1 + h2) rather than O(n + m) — worth it when the trees are large and the output is streamed rather than stored.',
        time: 'O(n + m)',
        space: 'O(h1 + h2) beyond the output',
        code: `function getAllElements(root1: TreeNode | null, root2: TreeNode | null): number[] {
  const result: number[] = [];
  const stack1: TreeNode[] = [];
  const stack2: TreeNode[] = [];
  let node1: TreeNode | null = root1;
  let node2: TreeNode | null = root2;

  // Descend the left spine, which parks the smallest unseen node on top.
  const pushLeft = (node: TreeNode | null, stack: TreeNode[]) => {
    while (node !== null) {
      stack.push(node);
      node = node.left;
    }
  };

  pushLeft(node1, stack1);
  pushLeft(node2, stack2);

  while (stack1.length > 0 || stack2.length > 0) {
    // Whichever stack's top is smaller holds the next value overall. An
    // empty stack is treated as exhausted, so the other one always wins.
    const takeFromFirst =
      stack2.length === 0 ||
      (stack1.length > 0 &&
        stack1[stack1.length - 1].val <= stack2[stack2.length - 1].val);

    const stack = takeFromFirst ? stack1 : stack2;
    const node = stack.pop()!;
    result.push(node.val);

    // Having consumed the node, its right subtree is what comes next.
    pushLeft(node.right, stack);
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'construct-binary-tree-from-inorder-and-postorder-traversal',
    statement:
      'Given the inorder and postorder traversals of a binary tree with distinct values, rebuild the tree and return its root.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'The defining observation: the LAST value of a postorder slice is the root of that slice. Find that value inside the inorder slice — everything to its left is the left subtree, everything to its right is the right subtree — and recurse on the two halves. The brute-force part is re-scanning inorder with indexOf on every call.',
        time: 'O(n^2) — the linear search is repeated for every node',
        space: 'O(n^2) because each call slices fresh arrays',
        code: `function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  // An empty slice means an empty subtree.
  if (inorder.length === 0) return null;

  // Postorder is left, right, node -- so the node is at the very end.
  const rootValue = postorder[postorder.length - 1];
  const root = new TreeNode(rootValue);

  // In inorder the root splits the values into the two subtrees.
  const split = inorder.indexOf(rootValue);

  // Both traversals list the left subtree before the right one, so the
  // same "split" count cuts the postorder slice in the right place too.
  root.left = buildTree(inorder.slice(0, split), postorder.slice(0, split));
  root.right = buildTree(
    inorder.slice(split + 1),
    postorder.slice(split, postorder.length - 1),
  );

  return root;
}`,
      },
      {
        name: 'Better',
        idea:
          'Same recursion, but fix the two sources of waste. Precompute a value to index map so locating the root in inorder is O(1), and pass index ranges instead of slicing arrays. That alone takes it from quadratic to linear.',
        time: 'O(n)',
        space: 'O(n) for the map plus O(h) recursion',
        code: `function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  // Values are distinct, so one lookup table serves every recursive call.
  const indexOfValue = new Map<number, number>();
  inorder.forEach((value, index) => indexOfValue.set(value, index));

  // Build the subtree whose inorder values sit in [inStart, inEnd] and
  // whose postorder values sit in [postStart, postEnd].
  const build = (
    inStart: number,
    inEnd: number,
    postStart: number,
    postEnd: number,
  ): TreeNode | null => {
    if (inStart > inEnd) return null; // empty range -> no node

    const rootValue = postorder[postEnd]; // last of the postorder range
    const root = new TreeNode(rootValue);

    const split = indexOfValue.get(rootValue)!;
    const leftSize = split - inStart; // how many nodes go left

    root.left = build(inStart, split - 1, postStart, postStart + leftSize - 1);
    root.right = build(split + 1, inEnd, postStart + leftSize, postEnd - 1);

    return root;
  };

  return build(0, inorder.length - 1, 0, postorder.length - 1);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Consume postorder from the back in one sweep, right subtree first. Reading postorder in reverse gives node, right, left — which is exactly the order this construction wants. A boundary value tells each call when its range has run out, so no index arithmetic is needed at all.',
        time: 'O(n)',
        space: 'O(n) for the map plus O(h) recursion',
        code: `function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  const indexOfValue = new Map<number, number>();
  inorder.forEach((value, index) => indexOfValue.set(value, index));

  // Walks backwards through postorder; each call takes the node it needs.
  let postIndex = postorder.length - 1;

  // "limit" is the inorder index of the ancestor that bounds this subtree.
  // When the next node belongs beyond that boundary, this subtree is done.
  const build = (left: number, right: number): TreeNode | null => {
    if (left > right) return null;

    const rootValue = postorder[postIndex--];
    const root = new TreeNode(rootValue);
    const split = indexOfValue.get(rootValue)!;

    // Reverse postorder gives node, RIGHT, left -- so build right first.
    root.right = build(split + 1, right);
    root.left = build(left, split - 1);

    return root;
  };

  return build(0, inorder.length - 1);
}`,
      },
    ],
  },
  {
    problemId: 'flip-equivalent-binary-trees',
    statement:
      'Two binary trees are flip equivalent if one can be turned into the other by swapping the left and right children of any number of nodes. Given two roots, decide whether they are flip equivalent.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function flipEquiv(root1: TreeNode | null, root2: TreeNode | null): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Canonicalise both trees and compare the results. Define a canonical form where, at every node, the child with the smaller root value is written first; two trees are flip equivalent exactly when their canonical forms are identical strings. It is easy to trust but allocates a full serialisation of both trees.',
        time: 'O(n log n) from sorting sibling pairs, O(n) strings built',
        space: 'O(n)',
        code: `function flipEquiv(root1: TreeNode | null, root2: TreeNode | null): boolean {
  // Serialise with children in a fixed order, so flips cannot change it.
  const canonical = (node: TreeNode | null): string => {
    if (node === null) return '#'; // explicit null marker keeps shapes apart

    const a = canonical(node.left);
    const b = canonical(node.right);

    // Order the two child strings consistently -- this is what makes a
    // flip invisible to the comparison.
    const [first, second] = a <= b ? [a, b] : [b, a];

    return \`(\${node.val},\${first},\${second})\`;
  };

  return canonical(root1) === canonical(root2);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Recurse over both trees at once. At each step the roots must match, and then the children must pair up in one of exactly two ways: unflipped (left with left, right with right) or flipped (left with right). Try both and accept if either works — no serialisation, and the search short-circuits as soon as one alignment succeeds.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function flipEquiv(root1: TreeNode | null, root2: TreeNode | null): boolean {
  // Both empty is a match; exactly one empty is not.
  if (root1 === null && root2 === null) return true;
  if (root1 === null || root2 === null) return false;

  // Flipping never changes a node's own value, so this must agree.
  if (root1.val !== root2.val) return false;

  // Case 1: this node was not flipped -- children line up as they are.
  const notFlipped =
    flipEquiv(root1.left, root2.left) && flipEquiv(root1.right, root2.right);

  if (notFlipped) return true; // no need to try the other alignment

  // Case 2: this node was flipped -- match left against right.
  return flipEquiv(root1.left, root2.right) && flipEquiv(root1.right, root2.left);
}`,
      },
    ],
  },
  {
    problemId: 'populating-next-right-pointers-in-each-node',
    statement:
      'Given a perfect binary tree, set each node’s next pointer to the node immediately to its right on the same level. The rightmost node of each level points to null.',
    starter: `class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  next: Node | null;
  constructor(val = 0) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.next = null;
  }
}

function connect(root: Node | null): Node | null {
  // your code here
  return root;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'A plain breadth-first traversal. Process the tree one level at a time and, within a level, point each node at the node dequeued after it. Straightforward, but the queue holds an entire level, which for a perfect tree is about half the nodes.',
        time: 'O(n)',
        space: 'O(n) — the widest level',
        code: `function connect(root: Node | null): Node | null {
  if (root === null) return null;

  let queue: Node[] = [root];

  while (queue.length > 0) {
    const nextLevel: Node[] = [];

    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];

      // The node after this one in the same level array is its neighbour;
      // for the last node there is none, so it stays null.
      node.next = i + 1 < queue.length ? queue[i + 1] : null;

      if (node.left !== null) nextLevel.push(node.left);
      if (node.right !== null) nextLevel.push(node.right);
    }

    queue = nextLevel;
  }

  return root;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Use the pointers already built on the level above as the queue. Standing on a connected level, two links can be set for each node: its own children to each other, and its right child to the left child of its next sibling. Walking the level with the next pointers means no extra memory at all.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function connect(root: Node | null): Node | null {
  // "leftmost" is the head of the level whose next pointers are already set.
  let leftmost: Node | null = root;

  // A perfect tree, so having a left child means having a full level below.
  while (leftmost !== null && leftmost.left !== null) {
    // Walk the current level using the links established last round.
    let node: Node | null = leftmost;

    while (node !== null) {
      // Link 1: the two children of this node are neighbours.
      node.left!.next = node.right;

      // Link 2: bridge the gap to the next parent's subtree. Only
      // possible when this node has a right neighbour.
      if (node.next !== null) {
        node.right!.next = node.next.left;
      }

      node = node.next;
    }

    // Drop to the level we just wired up and repeat.
    leftmost = leftmost.left;
  }

  return root;
}`,
      },
    ],
  },
  {
    problemId: 'top-view-of-binary-tree',
    statement:
      'Given the root of a binary tree, return the nodes visible when it is viewed from directly above, listed left to right. A node is visible if it is the first node encountered in its horizontal column.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function topView(root: TreeNode | null): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Give every node a horizontal distance — root is 0, going left subtracts 1, going right adds 1 — and record (distance, depth, value) for all of them. Then, for each distance, keep the entry with the smallest depth. Correct, but it materialises every node before discarding almost all of them.',
        time: 'O(n log n) from the grouping and sort',
        space: 'O(n)',
        code: `function topView(root: TreeNode | null): number[] {
  if (root === null) return [];

  // Collect one record per node.
  const seen: { distance: number; depth: number; value: number }[] = [];

  const walk = (node: TreeNode | null, distance: number, depth: number) => {
    if (node === null) return;
    seen.push({ distance, depth, value: node.val });
    walk(node.left, distance - 1, depth + 1);  // left shifts the column left
    walk(node.right, distance + 1, depth + 1); // right shifts it right
  };

  walk(root, 0, 0);

  // For each column keep only the shallowest node -- that is the one you
  // would see first looking down.
  const shallowest = new Map<number, { depth: number; value: number }>();
  for (const { distance, depth, value } of seen) {
    const current = shallowest.get(distance);
    if (current === undefined || depth < current.depth) {
      shallowest.set(distance, { depth, value });
    }
  }

  // Columns left to right.
  return [...shallowest.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, entry]) => entry.value);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Traverse breadth-first instead. BFS reaches the shallowest node of every column first, so the first time a horizontal distance is seen is the only time that matters — write it down and never overwrite it. Tracking the minimum and maximum distance lets the answer be assembled without sorting.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function topView(root: TreeNode | null): number[] {
  if (root === null) return [];

  const firstAtDistance = new Map<number, number>();
  let minDistance = 0;
  let maxDistance = 0;

  // BFS visits nodes in non-decreasing depth order, which is exactly the
  // "who is on top" order we need.
  let queue: { node: TreeNode; distance: number }[] = [{ node: root, distance: 0 }];

  while (queue.length > 0) {
    const next: { node: TreeNode; distance: number }[] = [];

    for (const { node, distance } of queue) {
      // First arrival in a column wins; later ones are hidden beneath it.
      if (!firstAtDistance.has(distance)) {
        firstAtDistance.set(distance, node.val);
        if (distance < minDistance) minDistance = distance;
        if (distance > maxDistance) maxDistance = distance;
      }

      if (node.left !== null) next.push({ node: node.left, distance: distance - 1 });
      if (node.right !== null) next.push({ node: node.right, distance: distance + 1 });
    }

    queue = next;
  }

  // Columns are contiguous, so walk the range instead of sorting keys.
  const result: number[] = [];
  for (let d = minDistance; d <= maxDistance; d++) {
    result.push(firstAtDistance.get(d)!);
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'vertical-order-traversal-of-a-binary-tree',
    statement:
      'Give the root column 0, every left move column - 1 and every right move column + 1. Return the values column by column from left to right; within a column, top to bottom, and nodes at the same row and column in ascending value order.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function verticalTraversal(root: TreeNode | null): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Flatten the problem completely: tag every node with its (column, row, value), put them all in one list, then sort that list by column, then row, then value. The tie-break rules of this problem are literally a three-key sort, so writing them as one comparator is the most direct reading of the statement.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function verticalTraversal(root: TreeNode | null): number[][] {
  if (root === null) return [];

  const nodes: { column: number; row: number; value: number }[] = [];

  // Any traversal order works, because the sort below fixes the order.
  const walk = (node: TreeNode | null, column: number, row: number) => {
    if (node === null) return;
    nodes.push({ column, row, value: node.val });
    walk(node.left, column - 1, row + 1);
    walk(node.right, column + 1, row + 1);
  };

  walk(root, 0, 0);

  // The problem's ordering rules, in priority order.
  nodes.sort((a, b) => {
    if (a.column !== b.column) return a.column - b.column; // left to right
    if (a.row !== b.row) return a.row - b.row;             // top to bottom
    return a.value - b.value;                              // then by value
  });

  // Cut the flat sorted list into one group per column.
  const result: number[][] = [];
  let currentColumn: number | null = null;

  for (const { column, value } of nodes) {
    if (column !== currentColumn) {
      result.push([]);          // a new column starts here
      currentColumn = column;
    }
    result[result.length - 1].push(value);
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Traverse breadth-first so rows already come out in order, which removes the row key from the sort. Bucket nodes by column as you go, and the only sorting left is the value tie-break inside a single row of a single column. Tracking the column range means the buckets never have to be sorted by key either.',
        time: 'O(n) plus small per-row sorts',
        space: 'O(n)',
        code: `function verticalTraversal(root: TreeNode | null): number[][] {
  if (root === null) return [];

  const columns = new Map<number, number[]>();
  let minColumn = 0;
  let maxColumn = 0;

  let queue: { node: TreeNode; column: number }[] = [{ node: root, column: 0 }];

  while (queue.length > 0) {
    // Everything in "queue" is one row, so ties here are same-row ties.
    // Sorting the row by column then value settles them before appending.
    queue.sort((a, b) =>
      a.column !== b.column ? a.column - b.column : a.node.val - b.node.val,
    );

    const next: { node: TreeNode; column: number }[] = [];

    for (const { node, column } of queue) {
      if (!columns.has(column)) {
        columns.set(column, []);
        if (column < minColumn) minColumn = column;
        if (column > maxColumn) maxColumn = column;
      }

      // BFS guarantees rows arrive top-down, so plain append is correct.
      columns.get(column)!.push(node.val);

      if (node.left !== null) next.push({ node: node.left, column: column - 1 });
      if (node.right !== null) next.push({ node: node.right, column: column + 1 });
    }

    queue = next;
  }

  // Columns are contiguous, so no key sort is needed.
  const result: number[][] = [];
  for (let c = minColumn; c <= maxColumn; c++) {
    result.push(columns.get(c)!);
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'odd-even-level-difference',
    statement:
      'Given the root of a binary tree, return the sum of the values on odd-numbered levels minus the sum of the values on even-numbered levels, counting the root as level 1.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function getLevelDiff(root: TreeNode | null): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Do it in two visible stages: a breadth-first pass that collects the values of each level into its own array, then a loop that adds or subtracts each level total depending on its index. Slower and heavier than it needs to be, but the intermediate structure makes the definition easy to check.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function getLevelDiff(root: TreeNode | null): number {
  if (root === null) return 0;

  // Stage 1: group values by level.
  const levels: number[][] = [];
  let queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const next: TreeNode[] = [];
    const values: number[] = [];

    for (const node of queue) {
      values.push(node.val);
      if (node.left !== null) next.push(node.left);
      if (node.right !== null) next.push(node.right);
    }

    levels.push(values);
    queue = next;
  }

  // Stage 2: alternate the sign. Index 0 is level 1, which counts as odd.
  let difference = 0;
  for (let i = 0; i < levels.length; i++) {
    const total = levels[i].reduce((sum, value) => sum + value, 0);
    difference += i % 2 === 0 ? total : -total;
  }

  return difference;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The levels never need to be stored. Recurse once, carrying a sign that flips at every step down, and add value * sign into a running total. The whole thing collapses to "root minus the answer for each subtree", which is the neatest way to state it.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function getLevelDiff(root: TreeNode | null): number {
  if (root === null) return 0;

  // Every child sits on the opposite parity to its parent, so whatever the
  // subtree's own odd-minus-even value is, it enters this level negated.
  return root.val - getLevelDiff(root.left) - getLevelDiff(root.right);
}`,
      },
    ],
  },
  {
    problemId: 'find-duplicate-subtrees',
    statement:
      'Given the root of a binary tree, return one root node for every subtree that appears more than once. Two subtrees are duplicates when they have the same structure and the same node values.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function findDuplicateSubtrees(root: TreeNode | null): (TreeNode | null)[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Compare every subtree against every other one with a structural equality check. It is the definition turned into code, and it is far too slow: there are O(n) subtrees, each pair costs up to O(n) to compare, and the comparisons repeat work endlessly.',
        time: 'O(n^2) comparisons, O(n^3) worst case overall',
        space: 'O(n)',
        code: `function findDuplicateSubtrees(root: TreeNode | null): (TreeNode | null)[] {
  const allNodes: TreeNode[] = [];

  const collect = (node: TreeNode | null) => {
    if (node === null) return;
    allNodes.push(node);
    collect(node.left);
    collect(node.right);
  };

  collect(root);

  // Structural equality: same shape and same values everywhere.
  const sameTree = (a: TreeNode | null, b: TreeNode | null): boolean => {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a.val === b.val && sameTree(a.left, b.left) && sameTree(a.right, b.right);
  };

  const duplicates: TreeNode[] = [];

  for (let i = 0; i < allNodes.length; i++) {
    // Has an identical subtree already been reported? If so, skip.
    const alreadyReported = duplicates.some((d) => sameTree(d, allNodes[i]));
    if (alreadyReported) continue;

    // Is there a later subtree identical to this one?
    for (let j = i + 1; j < allNodes.length; j++) {
      if (sameTree(allNodes[i], allNodes[j])) {
        duplicates.push(allNodes[i]);
        break;
      }
    }
  }

  return duplicates;
}`,
      },
      {
        name: 'Better',
        idea:
          'Replace pairwise comparison with a canonical string per subtree. Serialise each subtree once, bottom-up, including explicit null markers so that shape is captured and not just the multiset of values, then count how many times each string occurs. Any string seen exactly twice contributes its node once to the answer.',
        time: 'O(n^2) — each of n serialisations can be O(n) long',
        space: 'O(n^2) to hold them',
        code: `function findDuplicateSubtrees(root: TreeNode | null): (TreeNode | null)[] {
  const countOfShape = new Map<string, number>();
  const duplicates: TreeNode[] = [];

  // Returns the canonical serialisation of the subtree rooted at "node".
  const serialise = (node: TreeNode | null): string => {
    // The null marker matters: without it, a left-only and a right-only
    // child would serialise identically.
    if (node === null) return '#';

    const shape = \`\${node.val},\${serialise(node.left)},\${serialise(node.right)}\`;

    const seen = (countOfShape.get(shape) ?? 0) + 1;
    countOfShape.set(shape, seen);

    // Report on the SECOND sighting only, so each duplicate appears once
    // in the answer no matter how many copies exist.
    if (seen === 2) duplicates.push(node);

    return shape;
  };

  serialise(root);
  return duplicates;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The strings are the bottleneck, so replace them with integer ids. Give each distinct subtree shape a number the first time it is seen, and identify a subtree by the triple (value, left id, right id). That triple is a short fixed-size key regardless of subtree size, so every node costs O(1) instead of O(n).',
        time: 'O(n)',
        space: 'O(n)',
        code: `function findDuplicateSubtrees(root: TreeNode | null): (TreeNode | null)[] {
  // Triple -> the id assigned to that shape. Null is id 0.
  const idOfShape = new Map<string, number>();
  const countOfId = new Map<number, number>();
  const duplicates: TreeNode[] = [];
  let nextId = 1;

  const idFor = (node: TreeNode | null): number => {
    if (node === null) return 0;

    // Children are resolved first, so by the time this key is built both
    // ids are known and each is a single small number.
    const key = \`\${node.val},\${idFor(node.left)},\${idFor(node.right)}\`;

    let id = idOfShape.get(key);
    if (id === undefined) {
      id = nextId++;
      idOfShape.set(key, id);
    }

    const seen = (countOfId.get(id) ?? 0) + 1;
    countOfId.set(id, seen);

    if (seen === 2) duplicates.push(node); // report once, on the second

    return id;
  };

  idFor(root);
  return duplicates;
}`,
      },
    ],
  },
  {
    problemId: 'equal-tree-partition',
    statement:
      'Given the root of a binary tree, decide whether removing exactly one edge can split it into two trees whose node-value sums are equal.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function checkEqualTree(root: TreeNode | null): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Try every edge. For each node other than the root, cut the edge above it, sum that subtree, sum the rest, and compare. Correct, but each cut re-sums a subtree from scratch, so the same additions are performed over and over.',
        time: 'O(n^2)',
        space: 'O(h)',
        code: `function checkEqualTree(root: TreeNode | null): boolean {
  if (root === null) return false;

  const sumOf = (node: TreeNode | null): number =>
    node === null ? 0 : node.val + sumOf(node.left) + sumOf(node.right);

  const total = sumOf(root);

  // Try cutting the edge directly above each non-root node.
  const tryCutBelow = (node: TreeNode | null): boolean => {
    if (node === null) return false;

    const part = sumOf(node);
    // Cutting here leaves "part" on one side and "total - part" on the
    // other; they match exactly when part is half the total.
    if (part * 2 === total) return true;

    return tryCutBelow(node.left) || tryCutBelow(node.right);
  };

  // The root itself is not a valid cut -- that removes no edge.
  return tryCutBelow(root.left) || tryCutBelow(root.right);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'One post-order pass computes every subtree sum, so record them all in a list as they are produced. A valid cut exists exactly when some non-root subtree sums to half the total. The one trap is a total of zero: then half is also zero, and the root’s own sum would falsely match, so it must be excluded — which is why the root’s sum is deliberately not recorded.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function checkEqualTree(root: TreeNode | null): boolean {
  if (root === null) return false;

  // Sums of every subtree EXCEPT the whole tree, collected bottom-up.
  const subtreeSums: number[] = [];

  const sumOf = (node: TreeNode | null, isRoot = false): number => {
    if (node === null) return 0;

    const sum = node.val + sumOf(node.left) + sumOf(node.right);

    // Cutting above the root is not a real cut, so its sum is not a
    // candidate. This also protects the zero-total case below.
    if (!isRoot) subtreeSums.push(sum);

    return sum;
  };

  const total = sumOf(root, true);

  // An odd total can never split evenly into two integer halves.
  if (total % 2 !== 0) return false;

  return subtreeSums.includes(total / 2);
}`,
      },
    ],
  },
  {
    problemId: 'recover-binary-search-tree',
    statement:
      'Exactly two nodes of a binary search tree have had their values swapped. Restore the tree without changing its structure.',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function recoverTree(root: TreeNode | null): void {
  // your code here -- fix the tree in place
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Lean entirely on the defining property: inorder on a BST must be ascending. Collect the values, sort them, then walk the tree in inorder again writing the sorted values back. It repairs the tree without ever identifying which two nodes were wrong.',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `function recoverTree(root: TreeNode | null): void {
  const values: number[] = [];

  // Pass 1: read the values in inorder.
  const read = (node: TreeNode | null) => {
    if (node === null) return;
    read(node.left);
    values.push(node.val);
    read(node.right);
  };

  read(root);
  values.sort((a, b) => a - b); // what inorder SHOULD have produced

  // Pass 2: write them back in the same inorder positions.
  let index = 0;
  const write = (node: TreeNode | null) => {
    if (node === null) return;
    write(node.left);
    node.val = values[index++];
    write(node.right);
  };

  write(root);
}`,
      },
      {
        name: 'Better',
        idea:
          'Find the two offenders instead of rewriting everything. Walk inorder tracking the previous node; every place where previous.val > current.val is a break in the ordering. Two swapped nodes produce either two breaks (when they are far apart — take the first break’s left node and the second break’s right node) or one break (when they are adjacent). Then swap those two values back.',
        time: 'O(n)',
        space: 'O(h) call stack',
        code: `function recoverTree(root: TreeNode | null): void {
  let first: TreeNode | null = null;   // the larger of the swapped pair
  let second: TreeNode | null = null;  // the smaller of the swapped pair
  let previous: TreeNode | null = null;

  const walk = (node: TreeNode | null) => {
    if (node === null) return;

    walk(node.left);

    // An inorder sequence must be ascending, so this is a violation.
    if (previous !== null && previous.val > node.val) {
      // The first violation tells us the bigger value sits too early.
      if (first === null) first = previous;

      // The smaller value is always the current node. Assigning this on
      // EVERY violation handles both the adjacent case (one violation)
      // and the far-apart case (the second violation overwrites).
      second = node;
    }

    previous = node;
    walk(node.right);
  };

  walk(root);

  if (first !== null && second !== null) {
    const temp = (first as TreeNode).val;
    (first as TreeNode).val = (second as TreeNode).val;
    (second as TreeNode).val = temp;
  }
}`,
      },
      {
        name: 'Optimal',
        idea:
          'The same violation-spotting logic, but driven by a Morris inorder traversal so the call stack disappears. Temporary threads from a predecessor back to its successor provide the way home, and every thread is removed once used, leaving the structure untouched. This is the only version that is genuinely O(1) extra space.',
        time: 'O(n)',
        space: 'O(1)',
        code: `function recoverTree(root: TreeNode | null): void {
  let first: TreeNode | null = null;
  let second: TreeNode | null = null;
  let previous: TreeNode | null = null;
  let current: TreeNode | null = root;

  // Called at the moment a node is "visited" in inorder.
  const check = (node: TreeNode) => {
    if (previous !== null && previous.val > node.val) {
      if (first === null) first = previous;
      second = node;
    }
    previous = node;
  };

  while (current !== null) {
    if (current.left === null) {
      check(current);
      current = current.right;
      continue;
    }

    // Rightmost node of the left subtree = inorder predecessor.
    let predecessor: TreeNode = current.left;
    while (predecessor.right !== null && predecessor.right !== current) {
      predecessor = predecessor.right;
    }

    if (predecessor.right === null) {
      // First visit: thread back to here, then descend left.
      predecessor.right = current;
      current = current.left;
    } else {
      // Second visit: left subtree finished. Undo the thread so the tree
      // is left exactly as it was, then visit and move right.
      predecessor.right = null;
      check(current);
      current = current.right;
    }
  }

  if (first !== null && second !== null) {
    const temp = (first as TreeNode).val;
    (first as TreeNode).val = (second as TreeNode).val;
    (second as TreeNode).val = temp;
  }
}`,
      },
    ],
  },
  {
    problemId: 'check-tree-traversal',
    statement:
      'Given three arrays claimed to be the inorder, preorder and postorder traversals of one binary tree, decide whether such a tree actually exists.',
    starter: `function checkTreeTraversal(
  inorder: number[],
  preorder: number[],
  postorder: number[],
): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Build the tree that inorder and preorder imply — that pair always determines a unique tree when values are distinct — then produce its postorder and compare against the third array. Direct and easy to trust; the cost is the repeated indexOf and array slicing while building.',
        time: 'O(n^2)',
        space: 'O(n^2)',
        code: `interface Node { val: number; left: Node | null; right: Node | null }

function checkTreeTraversal(
  inorder: number[],
  preorder: number[],
  postorder: number[],
): boolean {
  // A tree cannot exist unless all three describe the same node count.
  if (inorder.length !== preorder.length || inorder.length !== postorder.length) {
    return false;
  }

  // Inorder + preorder pin down exactly one tree (values assumed distinct).
  const build = (ino: number[], pre: number[]): Node | null => {
    if (ino.length === 0) return null;

    const rootValue = pre[0]; // preorder starts with the root
    const split = ino.indexOf(rootValue);

    // A root that is not present in inorder means the inputs disagree.
    if (split === -1) return null;

    return {
      val: rootValue,
      left: build(ino.slice(0, split), pre.slice(1, split + 1)),
      right: build(ino.slice(split + 1), pre.slice(split + 1)),
    };
  };

  const root = build(inorder, preorder);

  // Read the postorder of the tree we built.
  const actual: number[] = [];
  const readPostorder = (node: Node | null) => {
    if (node === null) return;
    readPostorder(node.left);
    readPostorder(node.right);
    actual.push(node.val);
  };
  readPostorder(root);

  return actual.length === postorder.length &&
    actual.every((value, i) => value === postorder[i]);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Skip building the tree. Verify the three arrays against each other structurally: preorder hands out roots front to back, inorder says where each root splits its range, and the postorder position each root must occupy is then fully determined. A single recursive walk over index ranges checks every constraint in linear time.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function checkTreeTraversal(
  inorder: number[],
  preorder: number[],
  postorder: number[],
): boolean {
  const n = inorder.length;
  if (preorder.length !== n || postorder.length !== n) return false;

  // Distinct values are assumed; if inorder repeats one, the split point
  // is ambiguous and the question is ill-posed.
  const inorderIndex = new Map<number, number>();
  inorder.forEach((value, i) => inorderIndex.set(value, i));
  if (inorderIndex.size !== n) return false;

  let preIndex = 0;

  // Verify the subtree occupying inorder[inStart..inEnd] and, if it is
  // consistent, postorder[postStart..postEnd].
  const verify = (
    inStart: number,
    inEnd: number,
    postStart: number,
    postEnd: number,
  ): boolean => {
    if (inStart > inEnd) return true; // empty subtree, trivially fine

    // Preorder hands out the next root in the order roots are needed.
    const rootValue = preorder[preIndex++];

    // That root must live inside this inorder range.
    const split = inorderIndex.get(rootValue);
    if (split === undefined || split < inStart || split > inEnd) return false;

    // Postorder puts the root LAST in its own range -- non-negotiable.
    if (postorder[postEnd] !== rootValue) return false;

    const leftSize = split - inStart;

    return (
      verify(inStart, split - 1, postStart, postStart + leftSize - 1) &&
      verify(split + 1, inEnd, postStart + leftSize, postEnd - 1)
    );
  };

  // Every preorder value must be consumed exactly once for a full match.
  return verify(0, n - 1, 0, n - 1) && preIndex === n;
}`,
      },
    ],
  },
  {
    problemId: 'binary-tree-longest-consecutive-sequence',
    statement:
      'Given the root of a binary tree, find the length of the longest path where the node values form a strictly increasing sequence by exactly 1 at each step, following parent-to-child links (the path does not need to pass through the root).',
    starter: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function longestConsecutive(root: TreeNode | null): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every node, treat it as the possible start of a run and walk downward as far as the strictly-increasing-by-one pattern holds, tracking the best length seen. Correct, but a node near the top of a long valid chain gets re-walked from every node above it, so the same edges are traversed many times over.',
        time: 'O(n^2) worst case, on a long single chain',
        space: 'O(h) call stack',
        code: `function longestConsecutive(root: TreeNode | null): number {
  if (root === null) return 0;

  let best = 0;

  // Length of the consecutive run starting exactly at "node".
  const runFrom = (node: TreeNode | null): number => {
    if (node === null) return 0;

    let length = 1;

    if (node.left !== null && node.left.val === node.val + 1) {
      length = Math.max(length, 1 + runFrom(node.left));
    }
    if (node.right !== null && node.right.val === node.val + 1) {
      length = Math.max(length, 1 + runFrom(node.right));
    }

    return length;
  };

  // Try every node as a potential run start.
  const visitAll = (node: TreeNode | null) => {
    if (node === null) return;
    best = Math.max(best, runFrom(node));
    visitAll(node.left);
    visitAll(node.right);
  };

  visitAll(root);
  return best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'One post-order pass. Each call returns the length of the longest consecutive run starting AT that node and going downward, computed from its children\'s answers -- no node is ever visited more than once. A running maximum, updated as each node\'s run length is discovered, is the final answer, since the best run overall must start at some node.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function longestConsecutive(root: TreeNode | null): number {
  let best = 0;

  // Returns the length of the longest consecutive run that starts at
  // "node" and moves downward; also updates "best" along the way.
  const runFrom = (node: TreeNode | null): number => {
    if (node === null) return 0;

    // Children are solved first, so their run lengths are ready to use.
    const leftRun = runFrom(node.left);
    const rightRun = runFrom(node.right);

    let length = 1;

    // Extend into a child only if it continues the sequence by exactly 1.
    if (node.left !== null && node.left.val === node.val + 1) {
      length = Math.max(length, 1 + leftRun);
    }
    if (node.right !== null && node.right.val === node.val + 1) {
      length = Math.max(length, 1 + rightRun);
    }

    best = Math.max(best, length);
    return length;
  };

  runFrom(root);
  return best;
}`,
      },
    ],
  },
];

/**
 * The catalogue lists "Recover Binary Search Tree" twice under two ids, so
 * the same solution is registered under both rather than duplicated by hand.
 */
const recoverBst = trees2Solutions.find(
  (s) => s.problemId === 'recover-binary-search-tree',
)!;

trees2Solutions.push({ ...recoverBst, problemId: 'recover-binary-search-tree-2' });
