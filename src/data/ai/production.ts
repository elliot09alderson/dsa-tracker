import type { AIQuestion } from '@/lib/types';

/** Multimodal, reasoning models, guardrails, LangChain and production concerns. */
export const productionQuestions: AIQuestion[] = [
  {
    id: 'ai-pass-image-to-model',
    category: 'Multimodal',
    difficulty: 'Easy',
    question: 'How do you pass an image to a vision model? What are the two input formats?',
    shortAnswer:
      'Either a URL the provider fetches, or a base64 data URI embedded in the request. Both go in the user message content array as an image_url part alongside the text part. URLs are cheaper on request size; base64 works for local or private images that are not publicly reachable.',
    deepDive:
      'The message shape is a content array rather than a plain string:\n\n  { "role": "user", "content": [\n      { "type": "text", "text": "What is in this image?" },\n      { "type": "image_url", "image_url": { "url": "https://example.com/photo.jpg" } }\n  ]}\n\nFor base64 the url field becomes a data URI: "data:image/jpeg;base64,/9j/4AAQ...".\n\nChoosing between them:\n\n- URL — smaller requests, provider caches it, but the image must be publicly reachable. A signed URL with a short expiry is the usual compromise for private content.\n- Base64 — works for anything local and never exposes the image publicly, at the cost of roughly 33% size inflation and a much larger request body.\n\nThe details that matter in practice:\n\n- Detail level. A low setting downsamples to a fixed small size for a flat, cheap token cost; high tiles the image and costs far more. For "is there a person in this photo" low is fine; for reading small text in a screenshot you need high.\n- Images are billed as tokens, by tile count and resolution. A high-detail large image can cost more than several pages of text, which surprises people.\n- You can pass several images in one message and ask comparative questions.\n- Resize before sending. Uploading a 4000px photo when the model downsamples anyway wastes bandwidth and sometimes tokens.\n- Vision models read text in images well but are not a replacement for OCR on dense documents — accuracy on small print and complex tables is materially worse than a dedicated pipeline.',
    followUps: [
      'What does the detail parameter change?',
      'How are image tokens counted?',
      'How would you send a private image without making it public?',
      'When would you use OCR instead of a vision model?',
    ],
  },

  {
    id: 'ai-pdf-vision-extraction',
    category: 'Multimodal',
    difficulty: 'Medium',
    question: 'A user uploads a 50-page PDF. How do you extract information from it using vision AI?',
    shortAnswer:
      'Try text extraction first — most PDFs carry a real text layer and parsing it is faster, cheaper and more accurate than vision. Fall back to rendering pages as images only for scans and layout-heavy pages. Either way, process page by page, then combine, because 50 pages of images will not fit in one call and would be wasteful if they did.',
    deepDive:
      'The decision tree, which is the substance of the answer:\n\n1. Does the PDF have a text layer? pdfplumber, PyMuPDF or similar. If yes, extract directly — near-perfect fidelity, near-zero cost, and it preserves reading order better than vision does on multi-column layouts.\n2. Is it a scan, or does it have complex tables, charts, handwriting, or stamps? Render pages to images at ~150-200 DPI and use the vision model.\n3. A hybrid is usually correct: text layer for the body, vision for the pages that contain tables or figures.\n\nThe pipeline for the vision path:\n\n- Render each page to PNG or JPEG at a resolution that keeps the smallest text legible — under-resolution is the top cause of bad extraction, over-resolution just burns tokens.\n- Process pages in small batches (one to four per call). The whole document in one call blows the context window and degrades accuracy anyway.\n- Extract into a schema per page with structured outputs, keeping the page number in every record so every extracted fact is traceable to a source page.\n- Reduce: merge per-page results, resolving values that span a page break.\n- Run pages concurrently with bounded parallelism; 50 sequential calls is minutes, 50 concurrent is seconds and possibly a rate limit.\n\nThe issues to raise unprompted:\n\n- Cost. 50 high-detail pages is a real per-document cost — worth computing before promising it, and the main argument for the text-layer path.\n- Tables spanning pages need explicit handling; headers repeat and rows continue.\n- Always keep page provenance so a human can verify a number against the original.\n- Cache by document hash. Users reupload the same file constantly.\n\nFor high volume, a dedicated document-AI service (Azure Document Intelligence, AWS Textract, Google Document AI) is usually cheaper and more accurate on forms and tables than a general vision model, with the LLM layered on top for reasoning over what was extracted.',
    followUps: [
      'How do you decide between the text layer and vision?',
      'How do you handle a table that spans two pages?',
      'What resolution would you render at, and why does it matter?',
      'How would you keep the cost down at high volume?',
    ],
  },

  {
    id: 'ai-reasoning-models',
    category: 'Reasoning',
    difficulty: 'Medium',
    question: 'What is different about reasoning models (o-series) vs standard chat models? When should you use them?',
    shortAnswer:
      'Reasoning models are trained with reinforcement learning to generate a long internal chain of thought before answering, spending far more compute at inference. They are markedly better at maths, competitive coding, and multi-step logic, and markedly worse on latency and cost. Use them where the problem is genuinely hard; use a standard model for everything routine.',
    deepDive:
      'What changes mechanically: the model emits reasoning tokens that you are billed for but do not see, then the visible answer. Rather than scaling by training a bigger model, these scale by thinking for longer at inference time — a different axis, often described as test-time compute.\n\nWhere they clearly win: competition mathematics, algorithmic problems, scientific reasoning, complex debugging, planning with interacting constraints, anything where a careful human would need to work through it on paper.\n\nWhere they are the wrong tool: summarisation, extraction, classification, chat, rewriting, simple RAG answers. These gain nothing from extended deliberation and cost several times as much with much worse latency — tens of seconds rather than one.\n\nThe prompting differences, which is where people trip up:\n\n- Do not add chain-of-thought instructions. "Think step by step" is redundant and can degrade output, because the model already does this in a trained way and the instruction interferes.\n- Keep prompts simple and direct. Elaborate few-shot scaffolding that helps a standard model often hurts here; zero-shot with a clear problem statement is the guidance.\n- Give it the goal and the constraints, not a procedure.\n- Budget output tokens generously — reasoning tokens consume the budget and a too-small limit truncates before the answer appears.\n\nThe architecture point worth making: route. Classify difficulty and send the hard minority to a reasoning model while everything else goes to a fast one. Paying reasoning prices on "summarise this email" is the common and expensive mistake. And the reasoning trace is not exposed, so you cannot inspect it for debugging the way you can with prompted chain-of-thought.',
    followUps: [
      'Why does "think step by step" hurt with these models?',
      'How does the billing work for hidden reasoning tokens?',
      'How would you decide per request which model to use?',
      'What can you not debug without access to the reasoning trace?',
    ],
  },

  {
    id: 'ai-cot-prompted-vs-trained',
    category: 'Reasoning',
    difficulty: 'Medium',
    question:
      'What is chain-of-thought reasoning and how does it differ between prompted CoT and reasoning models?',
    shortAnswer:
      'Both spend extra tokens working through a problem before answering. Prompted CoT is you asking a standard model to show its steps, and the steps are visible and editable. In a reasoning model the behaviour is trained in with RL, the trace is long and hidden, and you are billed for tokens you never see.',
    deepDive:
      'The shared mechanism: a transformer does fixed computation per token, so the only way to give it more computation on a hard problem is to have it produce more tokens. Intermediate steps also re-enter the context, so later steps condition on earlier ones — the model is reading its own working.\n\nPrompted CoT:\n- Triggered by the prompt: "let us think step by step", or few-shot examples with worked reasoning.\n- The trace is in the response — visible, inspectable, and you can intervene in it.\n- Cheap, and it works on any model.\n- You control the shape of the reasoning, which is useful when you want a specific procedure followed.\n- Gains are real but bounded; it does not turn a small model into a strong reasoner.\n\nTrained reasoning:\n- Learned through RL on verifiable outcomes, so the model discovers strategies rather than imitating yours — backtracking, self-checking, trying a different approach when one stalls. These emerge, they are not prompted.\n- The trace is long (often thousands of tokens) and hidden by the provider.\n- Much stronger on genuinely hard problems, much more expensive and slower.\n- Additional prompted CoT on top is redundant and can interfere.\n\nThe practical consequences of the difference: with prompted CoT you can audit and debug the reasoning, and you can cache or reuse it; with a reasoning model you cannot see why it went wrong, only that it did. And the caveat that applies to both — the visible chain is not a guaranteed record of the computation. Models produce plausible reasoning that does not match how they actually reached the answer, so it is an aid to accuracy, not an audit trail.',
    followUps: [
      'Why does producing more tokens help at all?',
      'Is the visible chain a faithful record of the computation?',
      'When is prompted CoT still the better choice?',
      'What is self-consistency and where does it fit?',
    ],
  },

  {
    id: 'ai-chatbot-competitors',
    category: 'Guardrails',
    difficulty: 'Medium',
    question:
      "You're building a customer support chatbot. How do you prevent it from discussing competitors?",
    shortAnswer:
      'Layer it. A system instruction sets the default behaviour, an input classifier catches obvious attempts before the model runs, and an output check catches what slips through. Do not rely on the prompt alone — it is a tendency, not a constraint, and anything a user can phrase around will eventually be phrased around.',
    deepDive:
      'Layer 1 — system prompt. State it positively and give it somewhere to go: "You only discuss OurProduct. If asked to compare with other products, say you can only speak to OurProduct and offer to explain the relevant feature." A bare prohibition produces awkward refusals; a redirect produces a usable answer.\n\nLayer 2 — input classification. Before the main call, a cheap classifier (a small model, or keyword matching on a competitor list) flags comparison requests and routes them to a canned response. Faster and more reliable than hoping the main model complies, and it is where you catch the obvious cases at low cost.\n\nLayer 3 — output filtering. Scan the response for competitor names before it reaches the user; regenerate or fall back if found. This catches indirect leakage the input filter missed — the model volunteering a comparison unprompted.\n\nLayer 4 — retrieval hygiene. In a RAG setup, make sure competitor mentions are not sitting in the indexed corpus. Filter at index time. Controlling what the model can retrieve is far more reliable than instructing it what to ignore.\n\nThe judgement an interviewer is listening for:\n\n- This is a brand-safety control, not a security boundary. A determined user will get the model to say something eventually; the goal is that the normal path behaves correctly, not that it is unbreakable.\n- Over-blocking has a cost. A user asking "I am migrating from CompetitorX, how do I import my data?" has a legitimate support question, and a blunt filter fails them. Distinguish comparison and disparagement from a mention.\n- Log what the filters catch. That log is product intelligence — it tells you what people are actually comparing you against.\n- Evaluate it: build a test set of adversarial phrasings and measure both the block rate and the false-positive rate on legitimate questions.',
    followUps: [
      'How do you avoid blocking legitimate migration questions?',
      'Why is the system prompt insufficient on its own?',
      'How would you test that this works?',
      'What do you do with what the filter catches?',
    ],
  },

  {
    id: 'ai-pii-handling',
    category: 'Guardrails',
    difficulty: 'Hard',
    question: 'What is PII and how do you handle it before sending user data to an LLM API?',
    shortAnswer:
      'PII is any data that identifies a person — names, emails, phone numbers, addresses, government IDs, payment details, and combinations that become identifying together. Before sending to a third-party API you detect it, redact or tokenise it, send the sanitised text, and restore the values in the response. What you cannot sanitise, you keep out of the request or process with a model you control.',
    deepDive:
      'Detection: regex for structured identifiers (email, phone, card numbers with a Luhn check, national IDs), NER for names, addresses and organisations, and dictionary matching against your own user data. Regex alone misses names; NER alone misses formats. Use both, and accept that recall is never 100% — which is why detection is one layer rather than the whole answer.\n\nHandling, strongest first:\n\n1. Do not send it. The best control. Ask whether the task needs the name at all — most summarisation and classification does not.\n2. Tokenise reversibly. Replace with stable placeholders (PERSON_1, EMAIL_1), keep the mapping in your own system, and substitute back in the response. This preserves coherence — the model can still refer to "PERSON_1" consistently — which plain redaction destroys.\n3. Redact irreversibly where you never need it back.\n4. Use a self-hosted or in-VPC model for data that must stay in your boundary. No sanitisation needed if the data never leaves.\n\nThe compliance and contractual layer, which matters as much as the technical one:\n\n- Zero-retention or enterprise agreements with the provider, so prompts are not stored or used for training. Check this before building, not after.\n- Data residency: GDPR and similar regimes constrain where processing can happen, and API region matters.\n- Right to deletion is genuinely hard once data has entered a training set — another argument for not sending it.\n- Special categories (health, biometric, financial) carry stricter rules; HIPAA needs a BAA and most consumer LLM APIs do not offer one.\n\nThe operational details people forget: your own logs are a PII store too — sanitise before logging, not only before sending. Retrieved RAG chunks contain PII and bypass an input-only filter. And model output can contain PII the model inferred or hallucinated, so scan responses as well as requests.',
    followUps: [
      'Why tokenise rather than redact?',
      'What about PII inside retrieved RAG context?',
      'How do your own logs fit into this?',
      'When would you self-host a model instead?',
    ],
  },

  {
    id: 'ai-lcel',
    category: 'LangChain',
    difficulty: 'Medium',
    question:
      'What is LCEL? How is "chain = prompt | llm | parser" different from calling the LLM directly?',
    shortAnswer:
      'LCEL is LangChain Expression Language — a pipe syntax that composes components into a runnable. The composed chain gets streaming, batching, async, retries and tracing for free across every step. A direct API call does one thing; the chain is a declarative pipeline you can swap parts of and instrument as a whole.',
    deepDive:
      'What the pipe builds: each component implements a common Runnable interface, so composing them yields another Runnable with the same methods — invoke, batch, stream, and their async forms. The prompt formats variables into messages, the model generates, the parser turns the response into a typed object.\n\nWhat you gain over a raw call:\n\n- Streaming through the whole chain, including incremental parsing, rather than only from the model.\n- batch() with automatic parallelism.\n- Sync and async from one definition.\n- Retries, fallbacks (fall back to another model on failure) and timeouts as composable wrappers.\n- Tracing: every step shows up in LangSmith with its inputs, outputs and latency, which is genuinely useful for debugging a multi-step chain.\n- Swappability — change the model without touching the prompt or parser.\n\nThe honest counterpoint, which is what makes this answer credible rather than promotional: for a single call with a single prompt, LCEL is indirection over three lines of SDK code. It earns its place when you have branching, fallbacks, several steps, or you want the tracing. Many teams start with LangChain, hit the abstraction when debugging something unusual, and end up on the provider SDK plus a few helpers. Knowing the tradeoff — and that the value is mostly observability and composition rather than the pipe syntax itself — is the answer an interviewer is looking for.\n\nRelated pieces worth naming: RunnablePassthrough and RunnableParallel for fanning inputs through multiple branches, and .with_structured_output() which has largely replaced hand-rolled output parsers now that providers support schema-constrained decoding natively.',
    followUps: [
      'When is LCEL not worth it?',
      'How does streaming work through a parser?',
      'How would you add a fallback model to a chain?',
      'What replaced output parsers for structured data?',
    ],
  },

  {
    id: 'ai-langgraph-vs-chains',
    category: 'LangChain',
    difficulty: 'Medium',
    question: "What is LangGraph and how does it differ from LangChain's sequential chains?",
    shortAnswer:
      'LangGraph models the workflow as a state machine — nodes that update a shared state, edges that decide where to go next — so it supports cycles, branching and pausing. LCEL chains are directed acyclic pipelines: data flows one way and cannot loop. Agents need loops, so agents need a graph.',
    deepDive:
      'The core difference is cycles. A chain runs A then B then C. An agent runs "call the model, maybe use a tool, feed the result back, repeat until done" — that is a loop with a conditional exit, which a DAG cannot express.\n\nThe LangGraph model:\n\n- State: a typed object every node reads and writes, with reducers controlling how updates merge (append to a message list rather than replacing it, for instance).\n- Nodes: functions that take state and return an update.\n- Edges: fixed, or conditional — a function that inspects state and returns the next node name. Conditional edges are where the agent logic lives.\n- Compile to a runnable that keeps the LCEL interface, so streaming and tracing still work.\n\nWhat it buys you beyond loops:\n\n- Checkpointing. State is persisted per step, so a run can be resumed after a crash — and, more usefully, a conversation can be resumed days later from a thread id.\n- Human-in-the-loop. Interrupt before a node, surface the pending action for approval, resume or reject. This is the mechanism for gating consequential tool calls, and it is the reason to reach for LangGraph in production rather than a hand-rolled loop.\n- Time travel: rewind to an earlier checkpoint and take a different branch.\n- Multi-agent topologies — supervisor routing to workers, or peer handoff — are just graph shapes.\n\nThe judgement to offer: a simple tool-calling loop is twenty lines of plain code, and writing it yourself is often the better choice for one agent. LangGraph earns its complexity when you need durable state across sessions, approval gates, or several cooperating agents. Reach for it for those, not for the graph syntax.',
    followUps: [
      'Why can a DAG not express an agent loop?',
      'What does checkpointing give you in production?',
      'How would you implement an approval gate?',
      'When would you just write the loop yourself?',
    ],
  },

  {
    id: 'ai-langgraph-memory',
    category: 'LangChain',
    difficulty: 'Medium',
    question: 'How do you add persistent memory to a LangGraph agent?',
    shortAnswer:
      'Attach a checkpointer when compiling the graph and pass a thread id with every invocation. The checkpointer saves state after each step, so the same thread id resumes the conversation. That covers within-thread memory; facts that should persist across threads need a separate store and an explicit write step.',
    deepDive:
      'Two distinct mechanisms, and conflating them is the common mistake:\n\n1. Checkpointer — short-term, within a thread. Compile with a checkpointer (in-memory for development, Postgres or SQLite for production) and invoke with a config carrying a thread_id. State after every node is persisted, so the next call on that thread resumes exactly where it left off — including mid-run after an interrupt or a crash. This is what makes a conversation survive a server restart.\n\n2. Store — long-term, across threads. A separate key-value interface, namespaced by user, for facts that should outlive the conversation: preferences, learned context, profile data. Nodes read from it at the start and write to it when something worth keeping appears. Nothing writes to it automatically; the salience decision is yours.\n\nThe practical design:\n\n- Bound the thread state. Checkpointed message lists grow without limit and eventually exceed the context window, so add a summarisation node that compacts old turns once the list passes a threshold. Persisting is not the same as fitting.\n- Extraction into long-term memory is an explicit node at the end of a turn: ask the model what is worth remembering, validate it against a schema, and write it with a timestamp.\n- Handle conflicts on write. A changed fact should update, not accumulate alongside the old one — newer wins, with the old value retained for provenance rather than for retrieval.\n- Use a real database checkpointer in production. The in-memory one loses everything on restart, which is easy to miss because it works fine in development.\n- Give users visibility and a delete path over the store — both a trust matter and a compliance one.\n\nThe framing worth offering: the checkpointer gives you continuity for free, but genuine memory — deciding what matters, keeping it current, retrieving it selectively — is application logic that no framework supplies.',
    followUps: [
      'What is the difference between a checkpointer and a store?',
      'How do you stop thread state outgrowing the context window?',
      'What happens when a remembered fact becomes untrue?',
      'How would you let a user delete what the agent remembers?',
    ],
  },

  {
    id: 'ai-semantic-caching',
    category: 'Production',
    difficulty: 'Hard',
    question: 'How do you implement semantic caching for LLM responses?',
    shortAnswer:
      'Embed the incoming query, search a vector store of previous queries, and if the nearest one is above a similarity threshold return its cached response. Unlike an exact-match cache it catches paraphrases, which is most of the repeat traffic. The hard part is the threshold — too loose and you return confidently wrong answers.',
    deepDive:
      'The flow: embed the query, ANN search over cached query embeddings, compare the top hit against a threshold, return the cached response on a hit, otherwise call the model and write the new pair back with a TTL.\n\nWhy it beats an exact-match cache: "how do I reset my password" and "I forgot my login" are the same request with no shared keywords. On real support traffic the repeat rate is high and a semantic cache converts a large share of calls into a vector lookup -- a substantial cost and latency win.\n\nThe threshold is the whole problem. Too high and you rarely hit. Too low and you serve the answer to a different question, which is worse than a miss because it is silent and confident. Two examples that should not share a cache entry: "how do I cancel my subscription" versus "how do I cancel my order". These embed very closely and have completely different answers. Do not pick the threshold by intuition -- build a labelled set of query pairs, measure the false-hit rate, and set it from that.\n\nThe things that make it safe:\n\n- Namespace the cache by everything that changes the answer: user permissions, locale, tenant, model version, prompt version, and any retrieved-context version. A shared cache across permission boundaries is a data leak, and this is the failure that matters most.\n- Never cache personalised or stateful responses. Anything referencing the user own data, or anything mid-conversation where the answer depends on prior turns.\n- TTLs, plus explicit invalidation when the underlying documents change. A cached answer citing a superseded policy is a correctness bug.\n- Negative caching for known-unanswerable queries, so they do not hit the model repeatedly.\n\nCheaper relatives worth mentioning: exact-match caching on a normalised query hash catches the truly identical traffic at zero risk, and provider-side prompt caching discounts a shared prefix without any of this machinery. A sensible stack is exact-match first, semantic second, and prompt caching underneath both. Instrument hit rate, and sample cached responses for quality -- a cache that silently degrades answers is hard to notice from metrics alone.',
    followUps: [
      'How would you pick the similarity threshold?',
      'What must the cache key include besides the query?',
      'When should you never cache?',
      'How does this compare to provider-side prompt caching?',
    ],
  },

  {
    id: 'ai-nondeterministic-answers',
    category: 'Production',
    difficulty: 'Hard',
    question:
      'A user reports your AI feature gives different answers to the same question on different days. How do you diagnose and fix it?',
    shortAnswer:
      'Work through the layers that can change between two runs: sampling settings, the model version, the prompt, the retrieved context, and the conversation state. In practice a silent model update or changed retrieval results explain most of it. The fix is pinning and logging — you cannot diagnose this at all without a record of what actually went into each call.',
    deepDive:
      'Diagnose in this order, cheapest first:\n\n1. Temperature. If it is above 0 for a factual task, that alone explains it. Set it to 0 and see if the variation stops.\n2. Model version. "gpt-4o" is a moving alias; providers update it and behaviour shifts without any change on your side. Pin a dated version. This is the single most common cause of "it changed and we did not touch anything".\n3. Retrieved context. In a RAG system the same question retrieves different chunks as the index changes — documents added, reindexed, or an embedding model swapped. Log the retrieved chunk ids per request and diff them across the two runs. This is the most common cause after model drift.\n4. Prompt version. Did a template change ship between the two dates? Prompts need version control and a version id logged per call, exactly like code.\n5. Conversation state. Different history, or a summarisation step that compacted differently, changes the input even when the question is identical.\n6. Residual non-determinism. Even at temperature 0, batched GPU inference and MoE routing produce run-to-run variation. Small, real, and not something you can eliminate.\n\nThe fixes:\n\n- Pin the model to a dated snapshot and upgrade deliberately, with your eval suite run against the new version first.\n- Temperature 0 for anything factual.\n- Version your prompts and log the version with every call.\n- Log the full request context — prompt version, model version, retrieved ids, parameters — for every request. Without this you are guessing, and this is the actual answer to "how do you diagnose"; everything else depends on it.\n- Snapshot the index or version it, so retrieval is reproducible for a given point in time.\n- Add a regression eval suite that runs on every prompt or model change.\n\nThe reframe worth offering at the end: some variation is inherent to these systems, so the goal is consistency where it matters — the same factual question yielding the same substantive answer — rather than byte-identical output. Set the expectation accordingly, and where the user genuinely needs a stable answer, cache it and serve the cached one.',
    followUps: [
      'What would you log to make this diagnosable?',
      'How do you handle a provider updating a model underneath you?',
      'Why does retrieval drift, and how do you make it reproducible?',
      'Is byte-identical output a reasonable goal?',
    ],
  },
];
