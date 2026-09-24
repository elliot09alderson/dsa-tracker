import type { AIQuestion } from '@/lib/types';

/**
 * Implementation questions. These are whiteboard-sized on purpose -- the
 * interviewer is checking that you understand the mechanics well enough to
 * write them from memory, not that you have memorised a library API.
 */
export const codingQuestions: AIQuestion[] = [
  {
    id: 'ai-cosine-similarity',
    category: 'Code',
    difficulty: 'Easy',
    question: 'Implement cosine similarity between two vectors.',
    shortAnswer:
      'Dot product divided by the product of the two magnitudes. It measures the angle between the vectors and ignores their length, which is what you want for comparing meaning rather than text length. Note that if both vectors are already unit-normalised — as most embedding APIs return them — the dot product alone is the answer.',
    deepDive:
      'cos(a, b) = (a · b) / (||a|| · ||b||)\n\nThe range is -1 to 1 for arbitrary vectors, but embeddings from the same model are almost always in a cone, so in practice you see roughly 0 to 1 and a "similar" threshold lands somewhere around 0.7-0.8 — model-specific, and something you calibrate rather than assume.\n\nWhy cosine rather than Euclidean: magnitude in an embedding often tracks length or token count, not meaning. A one-line summary and a three-paragraph version of the same idea point the same direction with different magnitudes. Cosine ignores that; Euclidean does not.\n\nThings the interviewer is watching for:\n\n1. Do you guard the zero vector? Dividing by zero magnitude gives NaN, which then silently poisons a sort.\n2. Do you check the lengths match? Mismatched dimensions usually mean two different embedding models got mixed, which is a real and common bug.\n3. Do you make one pass rather than three? Minor, but it shows you think about the inner loop.\n4. Do you notice the normalisation shortcut? Saying "if these are already normalised, this reduces to a dot product, and here is why that matters at scale" is the answer that stands out.',
    code: {
      language: 'typescript',
      source: `/**
 * Cosine similarity: the cosine of the angle between two vectors.
 * Returns a value in [-1, 1]; higher means more similar in direction.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  // Mismatched dimensions almost always mean two different embedding models
  // got mixed together -- fail loudly rather than returning a garbage score.
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length: " + a.length + " vs " + b.length);
  }

  let dot = 0;        // a . b
  let magA = 0;       // ||a||^2, square-rooted at the end
  let magB = 0;       // ||b||^2

  // One pass computes all three accumulators.
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denominator = Math.sqrt(magA) * Math.sqrt(magB);

  // A zero vector has no direction, so similarity is undefined. Returning 0
  // rather than NaN keeps downstream sorting well behaved.
  if (denominator === 0) return 0;

  return dot / denominator;
}

/**
 * When vectors are already unit length -- which most embedding APIs
 * guarantee -- the denominator is 1 and the dot product IS the cosine.
 * Worth knowing: it removes two square roots from every comparison, which
 * matters when you are scoring millions of vectors.
 */
export function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}`,
    },
    starter: `function cosineSimilarity(a, b) {
  // your code here
}

// Try it: should print 1 (identical direction), then 0 (perpendicular).
console.log(cosineSimilarity([1, 2, 3], [2, 4, 6]));
console.log(cosineSimilarity([1, 0], [0, 1]));`,
    followUps: [
      'Why cosine rather than Euclidean distance for embeddings?',
      'What do you return for a zero vector, and why does it matter?',
      'If the vectors are pre-normalised, what changes?',
      'How would you find the top-k most similar out of a million vectors?',
    ],
  },

  {
    id: 'ai-text-chunking',
    category: 'Code',
    difficulty: 'Medium',
    question: 'Implement a text chunking function with overlap.',
    shortAnswer:
      'Slide a window of fixed size across the text, advancing by (size − overlap) each step. The two details that matter are that the stride must be strictly positive or you loop forever, and that splitting mid-sentence is what makes naive chunkers retrieve badly — so snap boundaries to a separator where you can.',
    deepDive:
      'The naive version is four lines and is what most people write. The version that gets a follow-up right respects boundaries.\n\nWhy overlap exists: a fact that straddles a chunk boundary is lost from both chunks. Overlap of 10-20% means boundary content appears in two chunks and survives retrieval. Too much overlap inflates the index and returns near-duplicate results.\n\nWhy boundaries matter: "The contract does not apply to" / "subsidiaries incorporated abroad" split across two chunks is worse than useless — the first half reads as a complete and wrong statement. Snapping to a sentence or paragraph break avoids that.\n\nThe bug the interviewer is looking for: if overlap >= chunkSize, the stride is zero or negative and the loop never terminates. Guard it explicitly.\n\nThe second thing they listen for: characters are not tokens. Chunk sizes are budgets against a context window, and that budget is in tokens. A rough rule is ~4 characters per token for English, but you should measure with the real tokenizer for anything production — code and non-English text have very different ratios.',
    code: {
      language: 'typescript',
      source: `interface ChunkOptions {
  /** Target chunk size in characters. */
  chunkSize?: number;
  /** How much each chunk repeats from the previous one. */
  overlap?: number;
  /**
   * Boundaries to prefer, best first. The chunker tries to end a chunk on
   * one of these rather than mid-word.
   */
  separators?: string[];
}

/**
 * Split text into overlapping chunks, preferring natural boundaries.
 * Overlap keeps facts that straddle a boundary retrievable.
 */
export function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const { chunkSize = 1000, overlap = 200, separators = ["\\n\\n", "\\n", ". ", " "] } = options;

  // Without this guard the stride below is <= 0 and the loop never ends.
  if (overlap >= chunkSize) {
    throw new Error("overlap must be smaller than chunkSize");
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);

    // If this is not the final chunk, try to pull the end back to a natural
    // boundary so we do not cut a sentence in half.
    if (end < text.length) {
      // Only look in the last quarter of the window -- searching the whole
      // window could shrink the chunk drastically for a single early newline.
      const searchFrom = start + Math.floor(chunkSize * 0.75);

      for (const separator of separators) {
        const found = text.lastIndexOf(separator, end);
        if (found > searchFrom) {
          end = found + separator.length;
          break; // separators are in priority order, so stop at the first hit
        }
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) chunks.push(chunk);

    // Advance by the stride. Because end may have moved back to a boundary,
    // compute the next start from the actual end, not from start + chunkSize.
    const nextStart = end - overlap;

    // Defensive: never move backwards, even if a boundary landed oddly.
    start = nextStart > start ? nextStart : end;
  }

  return chunks;
}`,
    },
    starter: `function chunkText(text, chunkSize = 100, overlap = 20) {
  // your code here
  return [];
}

const sample = "Sentence one here. Sentence two follows. And a third one to finish.";
console.log(chunkText(sample, 40, 10));`,
    followUps: [
      'What happens if overlap is larger than the chunk size?',
      'Why is chunking by characters a problem, and what would you do instead?',
      'How would you chunk Markdown differently from plain prose?',
      'How would you pick the chunk size for a given corpus?',
    ],
  },

  {
    id: 'ai-scaled-dot-product-attention',
    category: 'Code',
    difficulty: 'Hard',
    question: 'Implement the scaled dot-product attention formula.',
    shortAnswer:
      'softmax(QK^T / sqrt(d_k))V. Score every query against every key with a dot product, divide by the square root of the key dimension to keep the softmax from saturating, softmax each row into weights, then multiply by V to get a weighted blend of the value vectors.',
    deepDive:
      'Shapes are what people get wrong under pressure, so state them first:\n\n  Q: (n_q, d_k)\n  K: (n_k, d_k)\n  V: (n_k, d_v)\n  QK^T: (n_q, n_k)   — the score matrix\n  output: (n_q, d_v)\n\nThe scaling. Dot products of d_k-dimensional vectors with unit-variance components have variance d_k, so they grow with dimension. Feed large values into softmax and it saturates to nearly one-hot, and the gradient through it vanishes. Dividing by sqrt(d_k) normalises the variance back to ~1. This is the single most likely follow-up.\n\nThe softmax must be numerically stable: subtract the row max before exponentiating. exp(1000) overflows to Infinity and the result becomes NaN. Writing the naive version and then saying "and in practice you subtract the max" is fine; writing it stable first is better.\n\nCausal masking: for a decoder, set scores where j > i to -Infinity before the softmax, so they receive exactly zero weight. Masking after the softmax is wrong — the weights would no longer sum to one.\n\nThe complexity point to volunteer: the score matrix is n x n, so both time and memory are quadratic in sequence length. That is the whole reason FlashAttention (which never materialises the full matrix) and sliding-window attention exist.',
    code: {
      language: 'typescript',
      source: `type Matrix = number[][];

/** Numerically stable softmax over one row. */
function softmax(row: number[]): number[] {
  // Subtracting the max prevents exp() from overflowing to Infinity.
  // It does not change the result: softmax is shift-invariant.
  const max = Math.max(...row);
  const exps = row.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/**
 * Scaled dot-product attention.
 *
 *   Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V
 *
 * Q: (n_q, d_k)  K: (n_k, d_k)  V: (n_k, d_v)  ->  (n_q, d_v)
 */
export function attention(Q: Matrix, K: Matrix, V: Matrix, causal = false): Matrix {
  const nQ = Q.length;
  const nK = K.length;
  const dK = Q[0].length;
  const dV = V[0].length;

  // Large dot products push softmax into saturation, where gradients vanish.
  // Dividing by sqrt(d_k) keeps the score variance near 1.
  const scale = 1 / Math.sqrt(dK);

  const output: Matrix = [];

  for (let i = 0; i < nQ; i++) {
    // --- score this query against every key ---
    const scores = new Array<number>(nK);
    for (let j = 0; j < nK; j++) {
      let dot = 0;
      for (let d = 0; d < dK; d++) {
        dot += Q[i][d] * K[j][d];
      }

      // In a decoder, position i must not see positions after it. -Infinity
      // becomes exactly 0 after softmax. Masking BEFORE softmax matters:
      // zeroing afterwards would leave the weights not summing to 1.
      scores[j] = causal && j > i ? -Infinity : dot * scale;
    }

    // --- turn scores into weights that sum to 1 ---
    const weights = softmax(scores);

    // --- blend the value vectors by those weights ---
    const blended = new Array<number>(dV).fill(0);
    for (let j = 0; j < nK; j++) {
      if (weights[j] === 0) continue; // masked or negligible
      for (let d = 0; d < dV; d++) {
        blended[d] += weights[j] * V[j][d];
      }
    }

    output.push(blended);
  }

  return output;
}`,
    },
    starter: `function softmax(row) {
  // your code here
}

function attention(Q, K, V) {
  // your code here
}

const Q = [[1, 0]], K = [[1, 0], [0, 1]], V = [[10, 0], [0, 10]];
console.log(attention(Q, K, V));`,
    followUps: [
      'Why divide by sqrt(d_k) and not d_k?',
      'Why subtract the max in softmax?',
      'Where exactly does the causal mask go, and why not after softmax?',
      'What is the time and memory complexity, and what does FlashAttention change?',
    ],
  },

  {
    id: 'ai-brute-force-knn',
    category: 'Code',
    difficulty: 'Medium',
    question: 'Implement a brute-force KNN vector search.',
    shortAnswer:
      'Score the query against every stored vector, then take the top k. The straightforward version sorts everything — O(n log n) — but you only need the top k, so a bounded min-heap gives O(n log k) and holds k items instead of n.',
    deepDive:
      'This is the baseline that HNSW and IVF-PQ are approximating, and interviewers ask it to see whether you understand why approximate indexes exist at all.\n\nExact cost: n vectors of d dimensions is O(n·d) multiply-adds per query, plus the selection. At n = 10,000 that is genuinely fine and you should not reach for a vector database. At n = 100,000,000 it is hopeless. Knowing where the crossover sits — and saying "brute force is correct until roughly the hundred-thousand mark, then it is worth an index" — is the answer that sounds like production experience rather than recital.\n\nThe optimisation to mention: sorting all n scores to take k of them is wasteful. A min-heap of size k, where you compare against the smallest kept score before deciding to insert, is O(n log k). In practice most candidates fail that comparison immediately.\n\nThe second optimisation, which matters more than the algorithm: normalise all vectors once at insert time, then similarity is a plain dot product with no square roots in the query path. And in a real system this inner loop is SIMD or GPU work, not a JavaScript for-loop — the interesting engineering is memory layout and batching, not the comparison itself.\n\nWorth flagging: brute force is exact. Every approximate index trades a few percent of recall for orders of magnitude of speed, and for RAG that trade is almost always correct because a reranker sits downstream anyway.',
    code: {
      language: 'typescript',
      source: `interface VectorRecord {
  id: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

interface SearchResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

/**
 * Exact k-nearest-neighbour search by cosine similarity.
 *
 * O(n*d) to score plus O(n log k) to select. Exact, and entirely reasonable
 * up to the low hundreds of thousands of vectors -- past that you want an
 * approximate index such as HNSW.
 */
export function knnSearch(
  query: number[],
  records: VectorRecord[],
  k: number,
  filter?: (record: VectorRecord) => boolean,
): SearchResult[] {
  // A bounded array kept sorted descending. For the small k that retrieval
  // uses (5 to 50) this beats a heap in practice -- less overhead, and the
  // insert below exits immediately for the vast majority of candidates.
  const top: SearchResult[] = [];

  for (const record of records) {
    // Metadata filtering happens BEFORE scoring: no point computing a
    // similarity for a document this user is not allowed to see.
    if (filter && !filter(record)) continue;

    const score = cosineSimilarity(query, record.vector);

    // Fast reject: once we have k results, anything not beating the worst
    // one cannot make the list.
    if (top.length === k && score <= top[top.length - 1].score) continue;

    // Insert in sorted position.
    const entry: SearchResult = { id: record.id, score, metadata: record.metadata };
    let position = top.length;
    while (position > 0 && top[position - 1].score < score) position--;
    top.splice(position, 0, entry);

    // Keep the list bounded at k.
    if (top.length > k) top.pop();
  }

  return top;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denominator = Math.sqrt(magA) * Math.sqrt(magB);
  return denominator === 0 ? 0 : dot / denominator;
}`,
    },
    starter: `function knnSearch(query, records, k) {
  // records look like { id, vector }
  // your code here
  return [];
}

const records = [
  { id: "a", vector: [1, 0] },
  { id: "b", vector: [0.9, 0.1] },
  { id: "c", vector: [0, 1] },
];
console.log(knnSearch([1, 0], records, 2));`,
    followUps: [
      'At what corpus size would you stop doing this and add an index?',
      'How would you avoid sorting all n scores?',
      'Why apply the metadata filter before scoring rather than after?',
      'What does HNSW give up compared to this?',
    ],
  },

  {
    id: 'ai-react-agent-loop',
    category: 'Code',
    difficulty: 'Hard',
    question: 'Implement a simple ReAct agent loop (no external libraries).',
    shortAnswer:
      'ReAct is Reason + Act in a loop: the model thinks, picks a tool, you execute it, you feed the observation back, and it repeats until it produces a final answer. The whole thing is a while loop over a growing message list with a hard iteration cap — the framework adds nothing conceptually.',
    deepDive:
      'The loop:\n\n1. Send the conversation plus the tool definitions to the model.\n2. If the response contains tool calls, execute them and append the results as tool messages.\n3. If it contains a final answer instead, stop.\n4. Repeat, bounded by a maximum number of iterations.\n\nThe details that separate a working agent from a demo, and that interviewers probe:\n\n- Always cap iterations. Without it, a model that keeps calling the same failing tool loops until your budget is gone. Ten is a reasonable default.\n- Return tool errors to the model rather than throwing. "Error: city not found, valid values are..." lets the agent recover; an exception ends the run. This is the single most common design mistake.\n- Every tool result must be appended to the message list, in order, with the id it corresponds to. The model needs to see what happened.\n- Execute parallel tool calls concurrently. The model can request several at once and they are usually independent.\n- Validate arguments before executing. The model produces JSON that matches the schema loosely, not strictly, and a hallucinated argument should be rejected with a useful message rather than passed into your code.\n- Never let the loop take consequential actions unsupervised. This is the same blast-radius argument as prompt injection: the tools an agent can call without a human is exactly the damage a bad step can do.\n\nThe historical note worth a sentence: the original ReAct paper parsed Thought/Action/Observation out of raw text. Native tool calling replaced that — structured, more reliable, no brittle parsing — but the control flow is identical.',
    code: {
      language: 'typescript',
      source: `interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
  execute(args: Record<string, unknown>): Promise<string>;
}

interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: { id: string; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
}

/**
 * A ReAct loop: reason, act, observe, repeat.
 *
 * "callModel" is whatever chat-completions call you use. Everything else
 * here is the entire agent -- frameworks add ergonomics, not concepts.
 */
export async function runAgent(
  userMessage: string,
  tools: ToolDefinition[],
  callModel: (messages: Message[], tools: ToolDefinition[]) => Promise<Message>,
  maxIterations = 10,
): Promise<string> {
  const messages: Message[] = [
    { role: "system", content: "You are a helpful assistant. Use the tools available to you." },
    { role: "user", content: userMessage },
  ];

  const byName = new Map(tools.map((t) => [t.name, t]));

  // The cap is not optional. Without it, a model that keeps calling a failing
  // tool will loop until it exhausts your budget.
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const response = await callModel(messages, tools);
    messages.push(response);

    // No tool calls means the model produced its final answer.
    if (!response.tool_calls || response.tool_calls.length === 0) {
      return response.content ?? "";
    }

    // The model may request several tools at once; they are independent, so
    // run them concurrently rather than serially.
    const results = await Promise.all(
      response.tool_calls.map(async (call) => {
        const tool = byName.get(call.function.name);

        // A hallucinated tool name goes back to the model as a message, not
        // as an exception -- it can then correct itself.
        if (!tool) {
          return {
            role: "tool" as const,
            tool_call_id: call.id,
            content: "Error: no tool named " + call.function.name,
          };
        }

        try {
          const args = JSON.parse(call.function.arguments) as Record<string, unknown>;
          const output = await tool.execute(args);
          return { role: "tool" as const, tool_call_id: call.id, content: output };
        } catch (err) {
          // Returning the error as an observation is what lets the agent
          // recover. Throwing here would end the run instead.
          const detail = err instanceof Error ? err.message : String(err);
          return {
            role: "tool" as const,
            tool_call_id: call.id,
            content: "Error running " + call.function.name + ": " + detail,
          };
        }
      }),
    );

    // Order matters: each tool result must follow the call it answers.
    messages.push(...results);
  }

  // Hitting the cap is a real outcome, not an exception -- say so plainly.
  return "Stopped after " + maxIterations + " iterations without reaching a final answer.";
}`,
    },
    starter: `async function runAgent(userMessage, tools, callModel, maxIterations = 10) {
  // Build the message list, loop, execute tool calls, feed results back.
  // your code here
}`,
    followUps: [
      'What happens without an iteration cap?',
      'Should a failing tool throw or return the error to the model? Why?',
      'How do you handle several tool calls in one response?',
      'How would you make this loop safe against prompt injection in tool output?',
    ],
  },

  {
    id: 'ai-exponential-backoff',
    category: 'Code',
    difficulty: 'Medium',
    question: 'Implement exponential backoff retry for OpenAI API rate limit errors.',
    shortAnswer:
      'Retry on 429 and 5xx with a delay that doubles each attempt, capped at a maximum, plus random jitter so concurrent clients do not retry in lockstep. Honour the Retry-After header when the server sends one, and never retry a 400 — a malformed request will fail identically every time.',
    deepDive:
      'The parts, and why each exists:\n\n- Exponential growth. base * 2^attempt. Backing off linearly under sustained load does not shed enough traffic to let the service recover.\n- A cap. Without one, attempt 10 is a 17-minute wait. Cap at something like 30-60 seconds.\n- Jitter. This is the part that gets left out and is the most important. If a thousand clients are rate-limited at the same instant and all retry at exactly 1s, 2s, 4s, you have rebuilt the thundering herd you were trying to avoid. Full jitter — a uniform random value between 0 and the computed delay — is the standard choice.\n- Retry-After. When the server tells you when to come back, that beats any formula you compute. Honour it.\n\nWhat to retry, which is the discrimination the interviewer is testing:\n\n- 429 rate limited — retry.\n- 500, 502, 503, 504 — retry, transient.\n- Network timeouts and connection resets — retry.\n- 400 bad request, 401 unauthorised, 404 — do NOT retry. The request is wrong and will stay wrong; retrying wastes time and hides the bug.\n- 409 and 422 — generally not retryable.\n\nFor LLM APIs specifically there are two extra considerations. A retried request costs tokens again, so a retry loop on an expensive long-context call can get expensive quietly — budget for it. And for anything that mutates state, pass an idempotency key so a retry after a timeout does not double-charge or double-send.\n\nThe production-grade version adds a circuit breaker: after repeated failures, stop trying for a cooldown window rather than hammering a service that is down.',
    code: {
      language: 'typescript',
      source: `interface RetryOptions {
  maxRetries?: number;
  /** First delay in ms; each attempt doubles from here. */
  baseDelayMs?: number;
  /** Ceiling, so attempt 10 is not a 17-minute wait. */
  maxDelayMs?: number;
}

/** Errors worth retrying: rate limits, server errors, and network blips. */
function isRetryable(error: unknown): boolean {
  const status = (error as { status?: number }).status;

  // A 400 or 401 will fail identically next time -- retrying only hides the bug.
  if (status === 429) return true;
  if (status !== undefined && status >= 500) return true;

  // No status usually means the request never completed (timeout, reset).
  if (status === undefined) return true;

  return false;
}

/** Respect the server's own instruction when it sends one. */
function retryAfterMs(error: unknown): number | null {
  const header = (error as { headers?: Record<string, string> }).headers?.["retry-after"];
  if (!header) return null;
  const seconds = Number(header);
  return Number.isFinite(seconds) ? seconds * 1000 : null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Run an async operation, retrying transient failures with exponential
 * backoff and full jitter.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxRetries = 5, baseDelayMs = 1000, maxDelayMs = 30000 } = options;

  let lastError: unknown;

  // maxRetries retries means maxRetries + 1 total attempts.
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Permanent failures should surface immediately.
      if (!isRetryable(error)) throw error;

      // Out of attempts -- rethrow rather than returning something misleading.
      if (attempt === maxRetries) break;

      // Exponential growth, capped.
      const exponential = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);

      // Full jitter. Without this, every client rate-limited at the same
      // moment retries at the same moment and the herd arrives together.
      const jittered = Math.random() * exponential;

      // The server's own Retry-After beats anything we compute.
      const serverDelay = retryAfterMs(error);
      const delay = serverDelay ?? jittered;

      await sleep(delay);
    }
  }

  throw lastError;
}`,
    },
    starter: `function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry(operation, maxRetries = 5) {
  // your code here
}

// Fails twice, then succeeds.
let calls = 0;
withRetry(async () => {
  calls++;
  if (calls < 3) throw Object.assign(new Error("rate limited"), { status: 429 });
  return "ok after " + calls + " calls";
}).then(console.log);`,
    followUps: [
      'Why is jitter necessary? What breaks without it?',
      'Which status codes should never be retried?',
      'How does Retry-After interact with your computed delay?',
      'What is a circuit breaker and when would you add one?',
    ],
  },
];
