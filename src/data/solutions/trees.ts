import type { Solution } from '@/lib/types';

/**
 * Binary trees. Most of this topic reduces to choosing a traversal order and
 * deciding what each node returns to its parent. Inorder on a BST yielding a
 * sorted sequence is the single most reusable fact here.
 */
export const treesSolutions: Solution[] = [
  {
    problemId: 'binary-tree-inorder-traversal',
    statement:
      'Given the root of a binary tree, return the inorder traversal of its node values: left subtree, then node, then right subtree.',
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

function inorderTraversal(root: TreeNode | null): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'The recursive definition written directly: traverse the left subtree, visit the node, traverse the right subtree. Clear and short, but it uses the call stack, which is O(h) memory and can overflow on a degenerate tree.',
        time: 'O(n)',
        space: 'O(h) call stack, up to O(n) on a skewed tree',
        code: `function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  const visit = (node: TreeNode | null) => {
    if (node === null) return;

    visit(node.left);        // everything smaller, in order
    result.push(node.val);   // then this node
    visit(node.right);       // then everything larger
  };

  visit(root);
  return result;
}`,
      },
      {
        name: 'Better',
        idea:
          'The same order with an explicit stack instead of recursion. Walk left as far as possible pushing nodes, then pop one, record it, and switch to its right subtree. This is literally what the recursive version does, with the stack made visible.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;

  // Two things keep the loop alive: nodes we still have to descend into
  // (current), and nodes we descended past and still owe a visit (stack).
  while (current !== null || stack.length > 0) {
    // Go as far left as possible, remembering the way back.
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }

    // No further left, so the top of the stack is the next node in order.
    const node = stack.pop()!;
    result.push(node.val);

    // Its left subtree is finished; the right subtree comes next.
    current = node.right;
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Morris traversal, which uses no extra memory at all. Before descending left, find the rightmost node of the left subtree — the node that would be visited immediately before this one — and temporarily point its right pointer back here. That thread is how you return without a stack. On the second visit the thread is removed, restoring the tree exactly.",
        time: 'O(n)',
        space: 'O(1)',
        code: `function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current: TreeNode | null = root;

  while (current !== null) {
    if (current.left === null) {
      // Nothing smaller remains, so this node is next in order.
      result.push(current.val);
      current = current.right;
      continue;
    }

    // Find the inorder predecessor: rightmost node of the left subtree.
    let predecessor = current.left;
    while (predecessor.right !== null && predecessor.right !== current) {
      predecessor = predecessor.right;
    }

    if (predecessor.right === null) {
      // First visit: thread the predecessor back to us so we can return
      // here after the left subtree is done, then go left.
      predecessor.right = current;
      current = current.left;
    } else {
      // Second visit: the thread is already there, so the left subtree is
      // finished. Remove the thread to leave the tree unmodified.
      predecessor.right = null;
      result.push(current.val);
      current = current.right;
    }
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'binary-tree-level-order-traversal',
    statement:
      'Return the level order traversal of a binary tree as an array of arrays, one inner array per level, from left to right.',
    starter: `function levelOrder(root: TreeNode | null): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Breadth-first search with a queue. The trick that makes the levels separable is to record the queue length before processing a level — that count is exactly how many nodes are on the current level, so consuming that many produces one level per outer iteration.',
        time: 'O(n)',
        space: 'O(width of the tree)',
        code: `function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];

  const result: number[][] = [];
  let queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const level: number[] = [];
    const nextQueue: TreeNode[] = [];

    // Everything currently in the queue is exactly one level.
    for (const node of queue) {
      level.push(node.val);

      // Children form the next level, kept left to right.
      if (node.left !== null) nextQueue.push(node.left);
      if (node.right !== null) nextQueue.push(node.right);
    }

    result.push(level);
    queue = nextQueue;
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'binary-tree-zigzag-level-order-traversal',
    statement:
      'Return the zigzag level order traversal: the first level left to right, the next right to left, alternating for each level.',
    starter: `function zigzagLevelOrder(root: TreeNode | null): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Do an ordinary level order traversal and reverse the values on alternate levels. Resist the temptation to alternate the order in which you enqueue children — that corrupts the shape of subsequent levels. Collect each level normally, then flip the finished array.',
        time: 'O(n)',
        space: 'O(width)',
        code: `function zigzagLevelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];

  const result: number[][] = [];
  let queue: TreeNode[] = [root];
  let leftToRight = true;

  while (queue.length > 0) {
    const level: number[] = [];
    const nextQueue: TreeNode[] = [];

    for (const node of queue) {
      level.push(node.val);

      // Always enqueue children in normal left-to-right order. Alternating
      // here instead would scramble the ordering of the level after next.
      if (node.left !== null) nextQueue.push(node.left);
      if (node.right !== null) nextQueue.push(node.right);
    }

    // Flip only the collected values, not the traversal itself.
    result.push(leftToRight ? level : level.reverse());
    leftToRight = !leftToRight;

    queue = nextQueue;
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'balanced-binary-tree',
    statement:
      'Determine whether a binary tree is height-balanced: for every node, the heights of its two subtrees differ by at most one.',
    starter: `function isBalanced(root: TreeNode | null): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every node, compute the height of each subtree and check the difference. The waste is that computing a height walks the whole subtree, and that walk is repeated at every ancestor.',
        time: 'O(n^2) on a skewed tree',
        space: 'O(h)',
        code: `function isBalanced(root: TreeNode | null): boolean {
  const height = (node: TreeNode | null): number => {
    if (node === null) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  };

  if (root === null) return true;

  // Check this node, then recurse -- each height() call rewalks the subtree.
  if (Math.abs(height(root.left) - height(root.right)) > 1) return false;

  return isBalanced(root.left) && isBalanced(root.right);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Compute the height and check the balance in the same pass, bottom-up. Each call returns the subtree height, or a sentinel of -1 meaning "something below me is already unbalanced". Once that sentinel appears it propagates straight to the root, so the tree is walked only once.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function isBalanced(root: TreeNode | null): boolean {
  /**
   * Returns the height of this subtree, or -1 if it (or anything inside it)
   * is unbalanced. Folding the failure into the return value is what makes
   * one pass sufficient.
   */
  const heightOrFail = (node: TreeNode | null): number => {
    if (node === null) return 0;

    const left = heightOrFail(node.left);
    if (left === -1) return -1; // bail out early, no point continuing

    const right = heightOrFail(node.right);
    if (right === -1) return -1;

    // This node is the first point where the imbalance is visible.
    if (Math.abs(left - right) > 1) return -1;

    return 1 + Math.max(left, right);
  };

  return heightOrFail(root) !== -1;
}`,
      },
    ],
  },

  {
    problemId: 'validate-binary-search-tree',
    statement:
      'Determine whether a binary tree is a valid binary search tree: every node in the left subtree is strictly smaller, every node in the right subtree is strictly larger, and both subtrees are themselves valid BSTs.',
    starter: `function isValidBST(root: TreeNode | null): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'The tempting wrong answer is to compare each node only with its two children. That fails on a tree where a deep node violates an ancestor bound — 5 sitting in the right subtree of 3 but the left subtree of 4. The fix is to check every node against every ancestor constraint, which is what the bounds approach does properly.',
        time: 'O(n^2) checking each subtree exhaustively',
        space: 'O(h)',
        code: `function isValidBST(root: TreeNode | null): boolean {
  // For each node, verify the whole left subtree is smaller and the whole
  // right subtree is larger. Correct, but every node rescans its subtrees.
  const allNodes = (node: TreeNode | null): number[] =>
    node === null ? [] : [node.val, ...allNodes(node.left), ...allNodes(node.right)];

  if (root === null) return true;

  const leftValues = allNodes(root.left);
  const rightValues = allNodes(root.right);

  if (leftValues.some((v) => v >= root.val)) return false;
  if (rightValues.some((v) => v <= root.val)) return false;

  return isValidBST(root.left) && isValidBST(root.right);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Carry an open interval down the tree. The root may be anything; moving left tightens the upper bound to the parent value, moving right tightens the lower bound. Each node is then a single comparison against bounds that already encode every ancestor. This is the approach that handles the deep-violation case naturally.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function isValidBST(root: TreeNode | null): boolean {
  /**
   * Every node must lie strictly inside (low, high). The bounds accumulate
   * as we descend, so a node is checked against ALL its ancestors at once --
   * not merely its parent, which is the classic bug in this problem.
   */
  const validate = (
    node: TreeNode | null,
    low: number,
    high: number,
  ): boolean => {
    if (node === null) return true; // an empty subtree is always valid

    // Strict inequalities: a BST here holds no duplicates.
    if (node.val <= low || node.val >= high) return false;

    return (
      // Going left, this node becomes the new ceiling.
      validate(node.left, low, node.val) &&
      // Going right, it becomes the new floor.
      validate(node.right, node.val, high)
    );
  };

  return validate(root, -Infinity, Infinity);
}`,
      },
    ],
  },

  {
    problemId: 'lowest-common-ancestor-of-a-binary-tree',
    statement:
      'Given a binary tree and two nodes p and q, find their lowest common ancestor — the deepest node having both as descendants, where a node may be a descendant of itself.',
    starter: `function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Find the root-to-node path for each target, then walk the two paths together and take the last node they share.',
        time: 'O(n)',
        space: 'O(n) for the two paths',
        code: `function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  // Build the path from the root down to a target, or return null.
  const pathTo = (node: TreeNode | null, target: TreeNode): TreeNode[] | null => {
    if (node === null) return null;
    if (node === target) return [node];

    const left = pathTo(node.left, target);
    if (left !== null) return [node, ...left];

    const right = pathTo(node.right, target);
    if (right !== null) return [node, ...right];

    return null;
  };

  const pathP = pathTo(root, p);
  const pathQ = pathTo(root, q);
  if (pathP === null || pathQ === null) return null;

  // Walk both paths in step; the last shared node is the answer.
  let ancestor: TreeNode | null = null;
  for (let i = 0; i < Math.min(pathP.length, pathQ.length); i++) {
    if (pathP[i] !== pathQ[i]) break;
    ancestor = pathP[i];
  }

  return ancestor;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'One recursive pass. Each call reports back whether it found either target somewhere below. If a node hears back from both sides, it is the split point and therefore the answer. If only one side reports, pass that report upward. Finding a target itself counts as a hit, which handles the case where one node is the ancestor of the other.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  // Returns: the LCA if found, otherwise p or q if exactly one was seen
  // below, otherwise null.
  if (root === null) return null;

  // Finding a target counts as a hit and stops the descent. This is what
  // makes "p is an ancestor of q" resolve to p correctly.
  if (root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // Reports from both sides mean the two targets are split across this
  // node's subtrees, so this node is the lowest one containing both.
  if (left !== null && right !== null) return root;

  // Otherwise pass along whichever side found something (or null).
  return left !== null ? left : right;
}`,
      },
    ],
  },

  {
    problemId: 'binary-tree-right-side-view',
    statement:
      'Imagine standing to the right of a binary tree. Return the values of the nodes you can see, ordered from top to bottom.',
    starter: `function rightSideView(root: TreeNode | null): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'What you see from the right is the last node on each level, so a level order traversal taking the final element of each level answers it directly. A depth-first alternative also works: visit the right child first and record the first node encountered at each new depth.',
        time: 'O(n)',
        space: 'O(width)',
        code: `function rightSideView(root: TreeNode | null): number[] {
  if (root === null) return [];

  const result: number[] = [];
  let queue: TreeNode[] = [root];

  while (queue.length > 0) {
    // The rightmost node of this level is the one visible from the side.
    result.push(queue[queue.length - 1].val);

    const nextQueue: TreeNode[] = [];
    for (const node of queue) {
      if (node.left !== null) nextQueue.push(node.left);
      if (node.right !== null) nextQueue.push(node.right);
    }

    queue = nextQueue;
  }

  return result;
}`,
      },
    ],
  },

  {
    problemId: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    statement:
      'Given the preorder and inorder traversals of a binary tree with distinct values, reconstruct the tree.',
    starter: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Preorder gives the root first; find that value in the inorder array and everything to its left is the left subtree, everything to its right the right subtree. Recurse on the slices. Correct, but the linear search plus array copying makes it quadratic.',
        time: 'O(n^2)',
        space: 'O(n^2) from the slicing',
        code: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  if (preorder.length === 0) return null;

  // Preorder visits the root before either subtree.
  const rootValue = preorder[0];
  const root = new TreeNode(rootValue);

  // In inorder, everything before the root is its left subtree.
  const splitAt = inorder.indexOf(rootValue);

  // Both subtrees have the same size in both traversals, which is what lets
  // us slice preorder by a length taken from inorder.
  root.left = buildTree(preorder.slice(1, splitAt + 1), inorder.slice(0, splitAt));
  root.right = buildTree(preorder.slice(splitAt + 1), inorder.slice(splitAt + 1));

  return root;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Remove both sources of waste. A hash map from value to inorder index makes the split lookup O(1), and passing index ranges instead of slices removes the copying. A single moving pointer into the preorder array consumes roots in exactly the order preorder produces them, so no preorder arithmetic is needed at all.',
        time: 'O(n)',
        space: 'O(n)',
        code: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // Value -> its position in inorder, so the split is a lookup not a scan.
  const inorderIndex = new Map<number, number>();
  inorder.forEach((value, index) => inorderIndex.set(value, index));

  // Preorder is consumed strictly left to right: every recursive call takes
  // the next value as its root, which is exactly preorder's definition.
  let preorderPosition = 0;

  /** Builds the subtree covering inorder[left..right]. */
  const build = (left: number, right: number): TreeNode | null => {
    // An empty range means there is no subtree here.
    if (left > right) return null;

    const rootValue = preorder[preorderPosition];
    preorderPosition++;

    const root = new TreeNode(rootValue);
    const split = inorderIndex.get(rootValue)!;

    // Order matters: the left subtree must consume its preorder values
    // before the right subtree starts taking them.
    root.left = build(left, split - 1);
    root.right = build(split + 1, right);

    return root;
  };

  return build(0, inorder.length - 1);
}`,
      },
    ],
  },

  {
    problemId: 'range-sum-of-bst',
    statement:
      'Given the root of a binary search tree and two values low and high, return the sum of all node values in the inclusive range [low, high].',
    starter: `function rangeSumBST(root: TreeNode | null, low: number, high: number): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea: 'Visit every node and add the ones inside the range, ignoring the BST ordering entirely.',
        time: 'O(n)',
        space: 'O(h)',
        code: `function rangeSumBST(root: TreeNode | null, low: number, high: number): number {
  if (root === null) return 0;

  const self = root.val >= low && root.val <= high ? root.val : 0;

  // Descends into both subtrees regardless of whether they can contribute.
  return self + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Use the ordering to prune. If a node is already below the range, nothing in its left subtree can qualify, so skip that side entirely — and symmetrically above the range. On a balanced tree this discards most of the work instead of walking every node.',
        time: 'O(number of nodes in range + h)',
        space: 'O(h)',
        code: `function rangeSumBST(root: TreeNode | null, low: number, high: number): number {
  if (root === null) return 0;

  // Too small: everything to the left is smaller still, so prune that side.
  if (root.val < low) return rangeSumBST(root.right, low, high);

  // Too large: everything to the right is larger still.
  if (root.val > high) return rangeSumBST(root.left, low, high);

  // Inside the range, so this node counts and both sides may contain more.
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`,
      },
    ],
  },
];
