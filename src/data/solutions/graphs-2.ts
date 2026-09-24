import type { Solution } from '@/lib/types';

/**
 * Graphs, part two.
 *
 * Weighted-graph problems this time: shortest paths with Dijkstra, minimum
 * spanning trees, union-find for cycle detection, and a couple of
 * grid/word problems that are really BFS in disguise. Split from graphs.ts
 * purely to keep each file a readable size.
 */
export const graphs2Solutions: Solution[] = [
  {
    problemId: 'network-delay-time',
    statement:
      'There are n network nodes labelled 1 to n. Given travel times as directed edges times[i] = [source, target, weight], and a starting node k, return the minimum time for a signal sent from k to reach every node, or -1 if some node is unreachable.',
    starter: `function networkDelayTime(times: number[][], n: number, k: number): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Bellman-Ford: relax every edge, up to n-1 times. Each pass tries to improve every node’s distance using every edge; after n-1 passes, the shortest path to any node (which uses at most n-1 edges) is guaranteed found. Simple to write and handles negative weights, though this problem does not need that generality.',
        time: 'O(V * E)',
        space: 'O(V)',
        code: `function networkDelayTime(times: number[][], n: number, k: number): number {
  const distance = new Array<number>(n + 1).fill(Infinity);
  distance[k] = 0;

  // n-1 rounds is always enough: the longest possible shortest path uses
  // at most n-1 edges.
  for (let round = 0; round < n - 1; round++) {
    for (const [u, v, w] of times) {
      if (distance[u] + w < distance[v]) {
        distance[v] = distance[u] + w;
      }
    }
  }

  let maxDistance = 0;
  for (let node = 1; node <= n; node++) {
    if (distance[node] === Infinity) return -1; // unreachable node
    maxDistance = Math.max(maxDistance, distance[node]);
  }

  return maxDistance;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Dijkstra's algorithm. Always expand the closest not-yet-finalised node next, using a min-heap keyed by distance -- once a node is popped, its shortest distance is final, because anything reached later can only be farther (all weights are non-negative). This settles every node in one pass instead of Bellman-Ford's repeated full sweeps.",
        time: 'O(E log V)',
        space: 'O(V + E)',
        code: `function networkDelayTime(times: number[][], n: number, k: number): number {
  const adjacency = new Map<number, [number, number][]>(); // node -> [neighbour, weight]
  for (const [u, v, w] of times) {
    if (!adjacency.has(u)) adjacency.set(u, []);
    adjacency.get(u)!.push([v, w]);
  }

  const distance = new Array<number>(n + 1).fill(Infinity);
  distance[k] = 0;

  // Min-heap of [distance, node], implemented as a simple binary heap.
  const heap: [number, number][] = [[0, k]];
  const siftUp = (i: number) => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] <= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const siftDown = (i: number) => {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < heap.length && heap[left][0] < heap[smallest][0]) smallest = left;
      if (right < heap.length && heap[right][0] < heap[smallest][0]) smallest = right;
      if (smallest === i) break;
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }
  };

  while (heap.length > 0) {
    const [d, node] = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    siftDown(0);

    if (d > distance[node]) continue; // a better path was already found

    for (const [neighbour, weight] of adjacency.get(node) ?? []) {
      const candidate = d + weight;
      if (candidate < distance[neighbour]) {
        distance[neighbour] = candidate;
        heap.push([candidate, neighbour]);
        siftUp(heap.length - 1);
      }
    }
  }

  let maxDistance = 0;
  for (let node = 1; node <= n; node++) {
    if (distance[node] === Infinity) return -1;
    maxDistance = Math.max(maxDistance, distance[node]);
  }

  return maxDistance;
}`,
      },
    ],
  },
  {
    problemId: 'connecting-cities-with-minimum-cost',
    statement:
      'There are n cities labelled 1 to n. Given a list of connections [city1, city2, cost] describing possible roads, return the minimum total cost to connect every city, or -1 if it is impossible.',
    starter: `function minimumCost(n: number, connections: number[][]): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          "Prim's algorithm, grown from an arbitrary starting city. Keep a frontier of edges leaving the tree built so far; at each step scan the whole frontier for the cheapest edge that reaches a new city, add it, and repeat. This is the direct MST-building idea, just without a heap to speed up the frontier scan.",
        time: 'O(V * E)',
        space: 'O(V + E)',
        code: `function minimumCost(n: number, connections: number[][]): number {
  const adjacency = new Map<number, [number, number][]>();
  for (const [a, b, cost] of connections) {
    if (!adjacency.has(a)) adjacency.set(a, []);
    if (!adjacency.has(b)) adjacency.set(b, []);
    adjacency.get(a)!.push([b, cost]);
    adjacency.get(b)!.push([a, cost]);
  }

  const inTree = new Array<boolean>(n + 1).fill(false);
  inTree[1] = true;
  let citiesConnected = 1;
  let totalCost = 0;

  while (citiesConnected < n) {
    let bestCost = Infinity;
    let bestCity = -1;

    // Scan every edge leaving the current tree for the cheapest one that
    // reaches a city not yet in it.
    for (let city = 1; city <= n; city++) {
      if (!inTree[city]) continue;
      for (const [neighbour, cost] of adjacency.get(city) ?? []) {
        if (!inTree[neighbour] && cost < bestCost) {
          bestCost = cost;
          bestCity = neighbour;
        }
      }
    }

    if (bestCity === -1) return -1; // no edge can extend the tree further

    inTree[bestCity] = true;
    totalCost += bestCost;
    citiesConnected++;
  }

  return totalCost;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Kruskal's algorithm with union-find. Sort every candidate edge by cost, cheapest first, and greedily accept an edge whenever it connects two cities that are not already in the same component -- rejecting it otherwise, since that would only create a cycle. Union-find with path compression makes each connectivity check and merge nearly O(1), so the sort dominates.",
        time: 'O(E log E)',
        space: 'O(V + E)',
        code: `function minimumCost(n: number, connections: number[][]): number {
  const parent = Array.from({ length: n + 1 }, (_, i) => i);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
    return parent[x];
  };

  const union = (a: number, b: number): boolean => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return false; // already connected -- would form a cycle
    parent[rootA] = rootB;
    return true;
  };

  // Cheapest edges first, so the greedy choice is always safe.
  const sorted = [...connections].sort((a, b) => a[2] - b[2]);

  let totalCost = 0;
  let edgesUsed = 0;

  for (const [a, b, cost] of sorted) {
    if (union(a, b)) {
      totalCost += cost;
      edgesUsed++;
      if (edgesUsed === n - 1) break; // a spanning tree needs exactly n-1 edges
    }
  }

  return edgesUsed === n - 1 ? totalCost : -1;
}`,
      },
    ],
  },
  {
    problemId: 'pacific-atlantic-water-flow',
    statement:
      'Given an m x n grid of heights, water can flow from a cell to a neighbouring cell with height less than or equal to its own. The Pacific touches the top and left edges, the Atlantic the bottom and right edges. Return every cell from which water can reach both oceans.',
    starter: `function pacificAtlantic(heights: number[][]): number[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For every single cell, run its own search (BFS or DFS) following the downhill-or-equal flow rule, and check whether that search can reach the top/left border and, separately, the bottom/right border. Correct, but the flow reachability from nearby cells overlaps enormously and is recomputed from scratch for every starting cell.',
        time: 'O((rows * cols)^2)',
        space: 'O(rows * cols)',
        code: `function pacificAtlantic(heights: number[][]): number[][] {
  const rows = heights.length;
  const cols = heights[0].length;

  // Can water starting at (r, c) reach the border satisfying "isTarget"?
  const canReach = (startR: number, startC: number, isTarget: (r: number, c: number) => boolean): boolean => {
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const stack = [[startR, startC]];
    visited[startR][startC] = true;

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      if (isTarget(r, c)) return true;

      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
          !visited[nr][nc] &&
          heights[nr][nc] <= heights[r][c] // water flows downhill or flat
        ) {
          visited[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
    }

    return false;
  };

  const result: number[][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const reachesPacific = canReach(r, c, (rr, cc) => rr === 0 || cc === 0);
      const reachesAtlantic = canReach(r, c, (rr, cc) => rr === rows - 1 || cc === cols - 1);
      if (reachesPacific && reachesAtlantic) result.push([r, c]);
    }
  }

  return result;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Flip the direction of the search. Instead of asking each cell whether water can flow FROM it TO the ocean, start from the ocean borders and flood-fill UPHILL (or flat) -- which reaches exactly the set of cells that could flow down to that ocean. Two flood-fills, one per ocean, run once each; a cell belongs in the answer exactly when it is marked reachable by both.",
        time: 'O(rows * cols)',
        space: 'O(rows * cols)',
        code: `function pacificAtlantic(heights: number[][]): number[][] {
  const rows = heights.length;
  const cols = heights[0].length;

  const floodFromBorder = (starts: number[][]): boolean[][] => {
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const stack = [...starts];
    for (const [r, c] of starts) visited[r][c] = true;

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;

      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        const nc = c + dc;
        // Walking OUTWARD from the ocean, a neighbour is reachable if
        // water could flow from it DOWN into the current cell -- i.e. the
        // neighbour is at least as high.
        if (
          nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
          !visited[nr][nc] &&
          heights[nr][nc] >= heights[r][c]
        ) {
          visited[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
    }

    return visited;
  };

  const pacificStarts: number[][] = [];
  const atlanticStarts: number[][] = [];
  for (let r = 0; r < rows; r++) {
    pacificStarts.push([r, 0]);
    atlanticStarts.push([r, cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    pacificStarts.push([0, c]);
    atlanticStarts.push([rows - 1, c]);
  }

  const reachesPacific = floodFromBorder(pacificStarts);
  const reachesAtlantic = floodFromBorder(atlanticStarts);

  const result: number[][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (reachesPacific[r][c] && reachesAtlantic[r][c]) result.push([r, c]);
    }
  }

  return result;
}`,
      },
    ],
  },
  {
    problemId: 'word-ladder',
    statement:
      'Given a beginWord, an endWord, and a word list, find the length of the shortest transformation sequence from beginWord to endWord, changing one letter at a time, where every intermediate word must appear in the word list. Return 0 if no such sequence exists.',
    starter: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  // your code here
  return 0;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          "Treat every pair of words in the list as potentially connected: two words are neighbours if they differ in exactly one letter. Build that adjacency explicitly by comparing every pair, then run a plain BFS from beginWord counting steps. Correct, but comparing every pair of words costs O(n^2 * wordLength) before the search even starts.",
        time: 'O(n^2 * L)',
        space: 'O(n^2)',
        code: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  // The end word has to actually be reachable through the list at all.
  if (!wordList.includes(endWord)) return 0;

  const allWords = [beginWord, ...wordList];
  const differsByOne = (a: string, b: string): boolean => {
    let diffs = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) diffs++;
      if (diffs > 1) return false;
    }
    return diffs === 1;
  };

  const adjacency = new Map<string, string[]>();
  for (let i = 0; i < allWords.length; i++) {
    adjacency.set(allWords[i], []);
    for (let j = 0; j < allWords.length; j++) {
      if (i !== j && differsByOne(allWords[i], allWords[j])) {
        adjacency.get(allWords[i])!.push(allWords[j]);
      }
    }
  }

  const visited = new Set([beginWord]);
  let queue = [beginWord];
  let steps = 1;

  while (queue.length > 0) {
    const next: string[] = [];
    for (const word of queue) {
      if (word === endWord) return steps;
      for (const neighbour of adjacency.get(word) ?? []) {
        if (!visited.has(neighbour)) {
          visited.add(neighbour);
          next.push(neighbour);
        }
      }
    }
    queue = next;
    steps++;
  }

  return 0;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Skip discovering neighbours by comparison entirely. For a word of length L, ALL of its one-letter-away neighbours can be generated directly -- for every position, try every other letter of the alphabet in that slot and check whether the result is in the word set. That is O(26 * L) candidates per word instead of O(n) comparisons, which is a large win once the word list is big. BFS from beginWord over these generated neighbours finds the shortest ladder.",
        time: 'O(n * L * 26)',
        space: 'O(n * L)',
        code: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const visited = new Set([beginWord]);
  let queue = [beginWord];
  let steps = 1;

  while (queue.length > 0) {
    const next: string[] = [];

    for (const word of queue) {
      if (word === endWord) return steps;

      // Generate every one-letter-changed variant of "word" directly.
      for (let i = 0; i < word.length; i++) {
        for (let code = 97; code <= 122; code++) { // 'a' to 'z'
          const letter = String.fromCharCode(code);
          if (letter === word[i]) continue;

          const candidate = word.slice(0, i) + letter + word.slice(i + 1);
          if (wordSet.has(candidate) && !visited.has(candidate)) {
            visited.add(candidate);
            next.push(candidate);
          }
        }
      }
    }

    queue = next;
    steps++;
  }

  return 0;
}`,
      },
    ],
  },
  {
    problemId: 'redundant-connection',
    statement:
      'A tree with n nodes had one extra edge added, turning it into a graph with exactly one cycle. Given the n edges as [u, v] pairs, return the one edge that can be removed to restore a tree. If several edges could be removed, return the one that appears last in the input.',
    starter: `function findRedundantConnection(edges: number[][]): number[] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'For each edge in order, imagine removing it and check with a fresh traversal whether the remaining n-1 edges still connect all nodes into a single tree without a cycle. The LAST edge whose removal fixes it is not what is asked for directly -- instead, walk forward through the edges adding each one and, the moment an edge would connect two nodes already connected by earlier edges, that edge is the answer (checked here by re-running a full connectivity search rather than incremental union-find).',
        time: 'O(n^2)',
        space: 'O(n)',
        code: `function findRedundantConnection(edges: number[][]): number[] {
  const adjacency = new Map<number, number[]>();

  const areConnected = (start: number, target: number, avoidEdge: number[]): boolean => {
    const visited = new Set<number>([start]);
    const stack = [start];

    while (stack.length > 0) {
      const node = stack.pop()!;
      if (node === target) return true;

      for (const neighbour of adjacency.get(node) ?? []) {
        // Skip the edge under consideration -- it has not been added yet.
        const isAvoided =
          (node === avoidEdge[0] && neighbour === avoidEdge[1]) ||
          (node === avoidEdge[1] && neighbour === avoidEdge[0]);
        if (isAvoided || visited.has(neighbour)) continue;

        visited.add(neighbour);
        stack.push(neighbour);
      }
    }

    return false;
  };

  for (const [u, v] of edges) {
    if (!adjacency.has(u)) adjacency.set(u, []);
    if (!adjacency.has(v)) adjacency.set(v, []);

    // If u and v are already connected through edges added so far, this
    // new edge is the one that creates the cycle.
    if (areConnected(u, v, [u, v])) return [u, v];

    adjacency.get(u)!.push(v);
    adjacency.get(v)!.push(u);
  }

  return [];
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Union-find, processing edges in order. Add each edge by union-ing its two endpoints; the first edge whose endpoints are ALREADY in the same component is the redundant one, since every edge before it built a valid tree and this one is the extra connection that creates the cycle. Path compression keeps each check and merge close to O(1).",
        time: 'O(n * α(n)) -- effectively linear',
        space: 'O(n)',
        code: `function findRedundantConnection(edges: number[][]): number[] {
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_, i) => i);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  for (const [u, v] of edges) {
    const rootU = find(u);
    const rootV = find(v);

    // Already in the same tree -- this edge is the one that closes a cycle.
    if (rootU === rootV) return [u, v];

    parent[rootU] = rootV;
  }

  return [];
}`,
      },
    ],
  },
  {
    problemId: 'cheapest-flights-within-k-stops',
    statement:
      'There are n cities connected by flights[i] = [from, to, price]. Given src, dst and k, return the cheapest price to fly from src to dst using at most k stops (k+1 flights), or -1 if no such route exists.',
    starter: `function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  // your code here
  return -1;
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Explore every possible route with DFS, tracking the number of flights taken so far and pruning a branch once it exceeds k+1 flights or its running cost already exceeds the best found. Correct, but the number of possible routes can grow combinatorially with the number of stops.',
        time: 'Exponential in k in the worst case',
        space: 'O(V + E) for the adjacency list plus recursion depth',
        code: `function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  const adjacency = new Map<number, [number, number][]>();
  for (const [from, to, price] of flights) {
    if (!adjacency.has(from)) adjacency.set(from, []);
    adjacency.get(from)!.push([to, price]);
  }

  let best = Infinity;

  const explore = (city: number, flightsUsed: number, costSoFar: number) => {
    if (costSoFar >= best) return; // this path cannot possibly improve on best
    if (city === dst) {
      best = costSoFar;
      return;
    }
    if (flightsUsed > k) return; // out of allowed stops

    for (const [next, price] of adjacency.get(city) ?? []) {
      explore(next, flightsUsed + 1, costSoFar + price);
    }
  };

  explore(src, 0, 0);
  return best === Infinity ? -1 : best;
}`,
      },
      {
        name: 'Optimal',
        idea:
          "Bellman-Ford, deliberately capped at k+1 rounds. Each round represents allowing one more flight; relaxing every edge using only the PREVIOUS round's distances (a fresh copy each round) ensures a route is never credited with more flights than the round count allows, which a plain in-place Bellman-Ford could otherwise do by chaining several relaxations within one round.",
        time: 'O(k * E)',
        space: 'O(V)',
        code: `function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  let distance = new Array<number>(n).fill(Infinity);
  distance[src] = 0;

  // k stops means at most k+1 flights, so at most k+1 relaxation rounds.
  for (let round = 0; round <= k; round++) {
    const next = [...distance]; // frozen snapshot -- this round's updates
                                  // must not feed into each other

    for (const [from, to, price] of flights) {
      if (distance[from] === Infinity) continue;
      const candidate = distance[from] + price;
      if (candidate < next[to]) next[to] = candidate;
    }

    distance = next;
  }

  return distance[dst] === Infinity ? -1 : distance[dst];
}`,
      },
    ],
  },
  {
    problemId: 'accounts-merge',
    statement:
      'Given a list of accounts, each a name followed by a list of emails, merge accounts that share at least one email (they belong to the same person, even if names match by coincidence across different people). Return the merged accounts, each with the name followed by its emails sorted ascending.',
    starter: `function accountsMerge(accounts: string[][]): string[][] {
  // your code here
  return [];
}`,
    approaches: [
      {
        name: 'Brute Force',
        idea:
          'Model shared emails as a graph problem solved by repeated passes: keep merging any two accounts that share an email into one, and repeat the whole scan until a full pass produces no more merges. Correct, but a chain of accounts linked A-B-C-D can require as many passes as there are accounts in the chain, and each pass rescans everything.',
        time: 'O(n^2 * average emails per account) in the worst case, across all passes',
        space: 'O(n * average emails per account)',
        code: `function accountsMerge(accounts: string[][]): string[][] {
  let groups = accounts.map((account) => ({
    name: account[0],
    emails: new Set(account.slice(1)),
  }));

  let mergedSomething = true;

  while (mergedSomething) {
    mergedSomething = false;

    outer: for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const shareEmail = [...groups[i].emails].some((email) => groups[j].emails.has(email));
        if (shareEmail) {
          for (const email of groups[j].emails) groups[i].emails.add(email);
          groups.splice(j, 1);
          mergedSomething = true;
          break outer; // restart the scan since indices have shifted
        }
      }
    }
  }

  return groups.map(({ name, emails }) => [name, ...[...emails].sort()]);
}`,
      },
      {
        name: 'Optimal',
        idea:
          'Union-find over emails, using each account index as a union operation trigger: union the first email of an account with every other email it lists, so all emails belonging to one identity end up under one root regardless of how many accounts separate them. A single pass groups every email by its root, and the name attached to any account touching that root is used for the merged entry (all such accounts share a name by the problem’s guarantee).',
        time: 'O(n * α(n) * average emails) for the union-find work, plus O(total emails log total emails) to sort each group',
        space: 'O(n * average emails per account)',
        code: `function accountsMerge(accounts: string[][]): string[][] {
  const parent = new Map<string, string>();
  const emailToName = new Map<string, string>();

  const find = (email: string): string => {
    if (parent.get(email) !== email) {
      parent.set(email, find(parent.get(email)!)); // path compression
    }
    return parent.get(email)!;
  };

  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootA, rootB);
  };

  for (const [name, ...emails] of accounts) {
    for (const email of emails) {
      if (!parent.has(email)) parent.set(email, email);
      emailToName.set(email, name);
    }
    // Union every email in this account with the first one, so they all
    // end up in the same component.
    for (let i = 1; i < emails.length; i++) {
      union(emails[0], emails[i]);
    }
  }

  // Group every email by the root of its component.
  const groups = new Map<string, string[]>();
  for (const email of parent.keys()) {
    const root = find(email);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(email);
  }

  const result: string[][] = [];
  for (const [root, emails] of groups) {
    result.push([emailToName.get(root)!, ...emails.sort()]);
  }

  return result;
}`,
      },
    ],
  },
];
