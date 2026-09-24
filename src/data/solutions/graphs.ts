import type { Solution } from '@/lib/types';

/**
 * Graphs. Nearly everything here is one of four templates: BFS for shortest
 * path on an unweighted graph, DFS for connectivity and cycles, topological
 * sort for ordering with dependencies, and union-find for merging groups.
 * Recognising which one a problem wants is most of the work.
 */
export const graphsSolutions: Solution[] = [
  {
    problemId: 'number-of-islands',
    statement:
      "Given a 2D grid of '1' (land) and '0' (water), count the islands. An island is land connected horizontally or vertically, and the grid edges are surrounded by water.",
    starter: `function numIslands(grid: string[][]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Scan the grid; each time you hit unvisited land you have found a new island, so increment the count and then flood-fill the whole connected region so it is never counted again. Sinking the land as you visit it (writing "0") avoids a separate visited grid, at the cost of mutating the input.',
        time: 'O(rows * cols)',
        space: 'O(rows * cols) worst-case recursion depth',
        code: `function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let islands = 0;

  /** Flood-fill: sink this cell and everything connected to it. */
  const sink = (r: number, c: number) => {
    // Off the grid, or already water -- nothing to do.
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;

    // Marking it water IS the visited check. Doing this before recursing is
    // what prevents infinite mutual recursion between adjacent cells.
    grid[r][c] = '0';

    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        // First time touching this island; everything else in it gets sunk
        // immediately, so it can only ever be counted once.
        islands++;
        sink(r, c);
      }
    }
  }

  return islands;
}`,
      },
    ],
  },

  {
    problemId: 'rotting-oranges',
    statement:
      'In a grid, 0 is empty, 1 is a fresh orange and 2 is rotten. Each minute, any fresh orange adjacent to a rotten one becomes rotten. Return the minutes until none are fresh, or -1 if that never happens.',
    starter: `function orangesRotting(grid: number[][]): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'This is BFS spreading from many sources at once. Seed the queue with every rotten orange, then process the queue one whole level per minute — the level count is the elapsed time. Counting the fresh oranges up front lets you tell "all rotted" from "some were unreachable" at the end without rescanning.',
        time: 'O(rows * cols)',
        space: 'O(rows * cols)',
        code: `function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  // Every rotten orange starts spreading simultaneously, so they all seed
  // the first BFS level together -- this is multi-source BFS.
  let queue: [number, number][] = [];
  let fresh = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  // Nothing fresh means no time passes, even if there are no rotten ones.
  if (fresh === 0) return 0;

  let minutes = 0;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (queue.length > 0 && fresh > 0) {
    const nextQueue: [number, number][] = [];

    // One full level of the BFS equals one minute of spreading.
    for (const [r, c] of queue) {
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue; // empty, or already rotten

        grid[nr][nc] = 2;
        fresh--;
        nextQueue.push([nr, nc]);
      }
    }

    queue = nextQueue;

    // Only count a minute if something actually rotted this round.
    if (nextQueue.length > 0) minutes++;
  }

  // Anything still fresh was unreachable from any rotten orange.
  return fresh === 0 ? minutes : -1;
}`,
      },
    ],
  },

  {
    problemId: 'course-schedule',
    statement:
      'Given a number of courses and a list of prerequisite pairs, determine whether it is possible to finish all courses — that is, whether the dependency graph has no cycle.',
    starter: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          "Kahn's algorithm — a topological sort. Count how many prerequisites each course has, start with the ones that have none, and every time you take a course decrement its dependents. If you manage to take all of them, there is no cycle; if you stall with courses remaining, the leftovers form a cycle and can never be started.",
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // dependents[a] lists the courses that require a to be taken first.
  const dependents: number[][] = Array.from({ length: numCourses }, () => []);

  // How many unmet prerequisites each course still has.
  const remaining = new Array<number>(numCourses).fill(0);

  for (const [course, prerequisite] of prerequisites) {
    dependents[prerequisite].push(course);
    remaining[course]++;
  }

  // Courses with no prerequisites can be taken immediately.
  const queue: number[] = [];
  for (let course = 0; course < numCourses; course++) {
    if (remaining[course] === 0) queue.push(course);
  }

  let taken = 0;

  while (queue.length > 0) {
    const course = queue.pop()!;
    taken++;

    // Taking it satisfies one prerequisite for each dependent course.
    for (const dependent of dependents[course]) {
      remaining[dependent]--;

      // Unblocked, so it can be taken now.
      if (remaining[dependent] === 0) queue.push(dependent);
    }
  }

  // If some courses were never unblocked, they depend on each other in a
  // cycle and the schedule is impossible.
  return taken === numCourses;
}`,
      },
    ],
  },

  {
    problemId: 'course-schedule-ii',
    statement:
      'Given a number of courses and their prerequisites, return an order in which all courses can be taken. Return an empty array if no such order exists.',
    starter: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Identical to Course Schedule I, except you record the order in which courses come off the queue. That sequence is a valid topological ordering. If it is shorter than the course count, a cycle blocked the rest and there is no valid order.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const dependents: number[][] = Array.from({ length: numCourses }, () => []);
  const remaining = new Array<number>(numCourses).fill(0);

  for (const [course, prerequisite] of prerequisites) {
    dependents[prerequisite].push(course);
    remaining[course]++;
  }

  const queue: number[] = [];
  for (let course = 0; course < numCourses; course++) {
    if (remaining[course] === 0) queue.push(course);
  }

  // The order courses leave the queue IS a valid topological order.
  const order: number[] = [];

  while (queue.length > 0) {
    const course = queue.pop()!;
    order.push(course);

    for (const dependent of dependents[course]) {
      remaining[dependent]--;
      if (remaining[dependent] === 0) queue.push(dependent);
    }
  }

  // A short order means some courses were never unblocked -- a cycle.
  return order.length === numCourses ? order : [];
}`,
      },
    ],
  },

  {
    problemId: 'clone-graph',
    statement:
      'Given a reference to a node in a connected undirected graph, return a deep copy of the entire graph.',
    starter: `class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

function cloneGraph(node: GraphNode | null): GraphNode | null {
  // your code here
  return null;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Traverse the graph, and keep a map from each original node to its copy. That map does double duty: it stores the result, and it is the visited check that stops cycles from causing infinite recursion. The essential ordering detail is to put the copy in the map before recursing into neighbours — otherwise a cycle leads straight back before the entry exists.',
        time: 'O(V + E)',
        space: 'O(V)',
        code: `function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;

  // Original node -> its clone. Also serves as the visited set, which is
  // what keeps cycles from looping forever.
  const clones = new Map<GraphNode, GraphNode>();

  const copy = (original: GraphNode): GraphNode => {
    // Already cloned (possibly still mid-construction) -- return the same
    // instance so the copied graph shares structure exactly like the original.
    const existing = clones.get(original);
    if (existing !== undefined) return existing;

    const clone = new GraphNode(original.val);

    // Register BEFORE recursing. A cycle will come back to this node, and it
    // must find the entry already present or the recursion never terminates.
    clones.set(original, clone);

    for (const neighbor of original.neighbors) {
      clone.neighbors.push(copy(neighbor));
    }

    return clone;
  };

  return copy(node);
}`,
      },
    ],
  },

  {
    problemId: 'find-if-path-exists-in-graph',
    statement:
      'Given an undirected graph with n vertices and a list of edges, determine whether a path exists between a source and a destination vertex.',
    starter: `function validPath(n: number, edges: number[][], source: number, destination: number): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Better',
        idea:
          'Build an adjacency list and run a breadth-first search from the source, marking visited vertices. If the destination is reached, a path exists.',
        time: 'O(V + E)',
        space: 'O(V + E)',
        code: `function validPath(n: number, edges: number[][], source: number, destination: number): boolean {
  // Undirected, so every edge goes into both vertices' lists.
  const adjacency: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    adjacency[a].push(b);
    adjacency[b].push(a);
  }

  const visited = new Array<boolean>(n).fill(false);
  const queue = [source];
  visited[source] = true;

  while (queue.length > 0) {
    const vertex = queue.pop()!;
    if (vertex === destination) return true;

    for (const neighbor of adjacency[vertex]) {
      // Marking on enqueue, not on dequeue, stops a vertex being queued
      // several times by different neighbours.
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }

  return false;
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Union-find. Merge the two endpoints of every edge into one set; afterwards, a path exists exactly when the source and destination share a root. With path compression and union by size each operation is effectively constant, and no adjacency list is needed at all.',
        time: 'O(E * α(V)), effectively O(E)',
        space: 'O(V)',
        code: `function validPath(n: number, edges: number[][], source: number, destination: number): boolean {
  // parent[i] points toward the representative of i's group.
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = new Array<number>(n).fill(1);

  /** Find the representative, flattening the path on the way back. */
  const find = (x: number): number => {
    // Path compression: point every node on this chain straight at the root,
    // so later lookups are near-constant.
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  /** Merge two groups, hanging the smaller tree under the larger. */
  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return; // already connected

    // Union by size keeps the trees shallow.
    if (size[rootA] < size[rootB]) {
      parent[rootA] = rootB;
      size[rootB] += size[rootA];
    } else {
      parent[rootB] = rootA;
      size[rootA] += size[rootB];
    }
  };

  for (const [a, b] of edges) union(a, b);

  // Same representative means the same connected component.
  return find(source) === find(destination);
}`,
      },
    ],
  },

  {
    problemId: 'surrounded-regions',
    statement:
      "Given a board of 'X' and 'O', capture every region of 'O' that is fully surrounded by 'X' by flipping it to 'X'. A region touching the border is not captured.",
    starter: `function solve(board: string[][]): void {
  // your code here
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Invert the problem. Rather than testing each region for whether it escapes to the border — which is awkward — flood-fill inward from every border O and mark everything reachable as safe. Whatever O remains unmarked afterwards must be enclosed, so flip it. One pass to mark, one pass to apply.',
        time: 'O(rows * cols)',
        space: 'O(rows * cols) recursion depth',
        code: `function solve(board: string[][]): void {
  const rows = board.length;
  const cols = board[0].length;

  /** Mark this cell and everything connected to it as border-reachable. */
  const markSafe = (r: number, c: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (board[r][c] !== 'O') return; // wall, or already marked

    // A temporary marker distinguishes "safe O" from "captured O" without
    // needing a second grid.
    board[r][c] = 'S';

    markSafe(r + 1, c);
    markSafe(r - 1, c);
    markSafe(r, c + 1);
    markSafe(r, c - 1);
  };

  // Start from every border cell: any O reachable from one escapes capture.
  for (let r = 0; r < rows; r++) {
    markSafe(r, 0);
    markSafe(r, cols - 1);
  }
  for (let c = 0; c < cols; c++) {
    markSafe(0, c);
    markSafe(rows - 1, c);
  }

  // Anything still 'O' was never reached from the border, so it is enclosed.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === 'S') board[r][c] = 'O'; // restore the safe ones
    }
  }
}`,
      },
    ],
  },

  {
    problemId: 'is-graph-bipartite',
    statement:
      'Given an undirected graph as an adjacency list, determine whether it is bipartite — whether the vertices can be split into two sets so that every edge connects a vertex in one set to a vertex in the other.',
    starter: `function isBipartite(graph: number[][]): boolean {
  // your code here
  return false;
}`,
    approaches: [
      {
        name: 'Optimal',
        idea:
          'Two-colouring. Traverse the graph assigning alternating colours; every neighbour must get the opposite colour of the current vertex. A conflict — a neighbour already coloured the same — means an odd-length cycle, which is exactly what makes a graph non-bipartite. The outer loop matters because the graph may be disconnected.',
        time: 'O(V + E)',
        space: 'O(V)',
        code: `function isBipartite(graph: number[][]): boolean {
  const n = graph.length;

  // 0 = uncoloured, 1 and -1 are the two sides.
  const color = new Array<number>(n).fill(0);

  // The graph may be disconnected, so every component needs its own start.
  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue; // already handled

    color[start] = 1;
    const queue = [start];

    while (queue.length > 0) {
      const vertex = queue.pop()!;

      for (const neighbor of graph[vertex]) {
        if (color[neighbor] === 0) {
          // Unseen: it must take the opposite side.
          color[neighbor] = -color[vertex];
          queue.push(neighbor);
          continue;
        }

        // Already coloured the same as this vertex -- the edge between them
        // cannot cross the partition. This is an odd cycle.
        if (color[neighbor] === color[vertex]) return false;
      }
    }
  }

  return true;
}`,
      },
    ],
  },
];
