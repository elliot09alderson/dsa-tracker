import type { AIQuestion } from '@/lib/types';

/** LLM API mechanics, structured outputs and function calling. */
export const apiQuestions: AIQuestion[] = [
  {
    id: 'ai-finish-reason-length',
    category: 'APIs',
    difficulty: 'Easy',
    question: 'You get finish_reason = "length" in an OpenAI response. What happened and how do you fix it?',
    shortAnswer:
      'Generation hit a token ceiling and stopped mid-output — either your max_tokens setting or the remaining room in the context window. The response is truncated, and if you were expecting JSON it is now unparseable. Fix by raising max_tokens, shrinking the prompt, or asking for less output.',
    deepDive:
      'Two distinct causes that need different fixes:\n\n1. max_tokens is too low for what you asked for. Raise it.\n2. The prompt consumed the window. Input and output share the budget, so a 127k-token prompt in a 128k window leaves 1k to generate into. Raising max_tokens cannot help here — you must shrink the input.\n\nDiagnosing which: compare prompt_tokens in the usage object against the model window. If they are close, it is cause 2.\n\nThe fixes, in order of preference:\n\n- Retrieve instead of stuffing. Send the relevant 5k tokens rather than the whole corpus.\n- Map-reduce long documents: summarise chunks separately, then combine.\n- Ask for less. "Summarise in 200 words" produces a response that fits; an open-ended "summarise this" does not have a natural stopping point.\n- Reserve headroom explicitly: count prompt tokens before sending and set max_tokens to what is left minus a margin.\n\nThe production point worth making: always branch on finish_reason. Code that assumes a complete response and calls JSON.parse will throw on truncation, and the error will not obviously point at token limits. Treat "length" as a distinct, handleable outcome — retry with a larger budget, or continue the generation, rather than surfacing a parse error.\n\nThe other values are worth knowing: "stop" is normal completion, "tool_calls" means it wants to invoke a function, "content_filter" means it was blocked.',
    followUps: [
      'How do you tell whether max_tokens or the context window was the limit?',
      'What should your code do when it sees this?',
      'What are the other finish_reason values?',
      'How would you reserve output headroom automatically?',
    ],
  },

  {
    id: 'ai-system-vs-user-role',
    category: 'APIs',
    difficulty: 'Easy',
    question: 'What is the difference between the "system" role and "user" role in the messages array?',
    shortAnswer:
      'The system message sets persistent behaviour — persona, rules, output format — and applies to the whole conversation. User messages are the turns of the actual dialogue. Models are trained to weight system instructions more heavily and to keep following them as the conversation grows.',
    deepDive:
      'Practically, the system message is where you put anything that should hold for every turn: role, tone, output format, refusal rules, available context. It appears once, at the start.\n\nWhy it is weighted differently: instruction-tuning data teaches the model a hierarchy — system above user above tool output. It is a trained tendency, not an enforced boundary, which is exactly why prompt injection works. A sufficiently persuasive user message can override a system instruction, so a system prompt is not a security control.\n\nThings worth knowing beyond the definition:\n\n- Position in the array matters for attention. System instructions at the very start of a long conversation compete with everything after them; for critical constraints, repeating the key rule near the end of the prompt measurably improves adherence.\n- The system prompt is not secret. Users extract them routinely. Never put credentials, internal URLs or anything you would mind seeing published in one.\n- Keep it stable across requests to benefit from prefix caching — providers cache the shared prefix, so a constant system prompt is materially cheaper and faster at scale.\n- Some newer models use "developer" in place of "system", with the same meaning.\n- Retrieved context is usually better placed in a user message than the system prompt, both because it changes per request (cache) and because it is untrusted data rather than your instruction.',
    followUps: [
      'Can a user message override a system instruction?',
      'Where would you put retrieved RAG context, and why?',
      'How does the system prompt interact with prompt caching?',
      'Is anything in the system prompt private?',
    ],
  },

  {
    id: 'ai-streaming-reasons',
    category: 'APIs',
    difficulty: 'Easy',
    question: 'Give two concrete reasons to use streaming over non-streaming for a chat app.',
    shortAnswer:
      'First, perceived latency: time-to-first-token is a few hundred milliseconds versus many seconds for a full response, so the app feels responsive instead of frozen. Second, it lets the user bail early — they can see the answer going wrong and stop it, which saves both their time and your tokens.',
    deepDive:
      'The latency argument is the main one. A 500-token response takes maybe 10 seconds to generate completely. Non-streaming means 10 seconds of a spinner; streaming means text appearing in ~300ms and scrolling as it goes. Total time is identical — the experience is not remotely.\n\nThe cancellation argument matters more than people expect. Users abandon a meaningful fraction of long generations once they see the direction is wrong. Without streaming you pay for every one of those tokens.\n\nOther real reasons: you avoid proxy and gateway timeouts on long generations, and you can process incrementally — render markdown progressively, or start a downstream step on a partial result.\n\nThe tradeoffs an interviewer wants you to raise unprompted:\n\n- You cannot validate before showing. With structured output, the object is only complete at the end — so streaming JSON to the UI means either rendering partial state or buffering anyway.\n- Moderation gets harder. You may have already displayed text that a filter would have caught on the complete response.\n- Error handling is messier: a failure mid-stream leaves partial output on screen and needs an explicit UI state.\n- Token usage arrives in the final chunk, so accounting needs the stream to complete.\n\nImplementation notes: Server-Sent Events is the standard transport, chunks arrive as deltas you accumulate, and you must handle client disconnects by aborting the upstream request — otherwise you keep paying for a generation nobody is reading.',
    followUps: [
      'What are the downsides of streaming?',
      'How do you stream structured JSON output?',
      'How do you handle a client disconnecting mid-stream?',
      'How do you do content moderation on a streamed response?',
    ],
  },

  {
    id: 'ai-api-key-storage',
    category: 'APIs',
    difficulty: 'Easy',
    question: 'What is the correct way to store and load API keys in a Python project?',
    shortAnswer:
      'Environment variables, loaded from a gitignored .env file in development and injected by the platform secret manager in production. Never hardcoded, never committed, never shipped to a browser. Commit a .env.example with the key names and no values.',
    deepDive:
      'The development setup:\n\n  # .env  (add .env to .gitignore before you create it)\n  OPENAI_API_KEY=sk-...\n\n  from dotenv import load_dotenv\n  import os\n  load_dotenv()\n  key = os.environ["OPENAI_API_KEY"]\n\nUse os.environ[...] rather than os.getenv(...) for required keys — you want a loud KeyError at startup, not a None that surfaces as a confusing auth error deep in a request.\n\nIn production, do not ship .env files. Use the platform mechanism: AWS Secrets Manager, GCP Secret Manager, Vercel or Railway environment variables, Kubernetes secrets. These give you rotation and audit logs, which a file does not.\n\nThe rules that actually matter:\n\n1. .gitignore first, create the file second. The common disaster is committing before ignoring.\n2. Never in client-side code. A key in a React bundle is public no matter how it got there. Calls go through your backend, always.\n3. Rotate on exposure, immediately. A key in git history is compromised even after you delete the file — the object is still in the history and in every clone.\n4. Scope and limit. Separate keys per environment, spend limits set at the provider, so a leak is bounded.\n5. Scan for them. git-secrets or a pre-commit hook catches this before it happens; GitHub secret scanning catches it after.\n\nFor teams, the better answer is a secret manager from the start plus short-lived credentials — workload identity rather than long-lived keys, so there is nothing static to leak.',
    followUps: [
      'A key got committed to git. What do you do?',
      'Why is os.environ better than os.getenv for a required key?',
      'How do you handle keys for a frontend app?',
      'How would you rotate keys without downtime?',
    ],
  },

  {
    id: 'ai-temperature-zero-vs-high',
    category: 'APIs',
    difficulty: 'Easy',
    question: 'When should you use temperature=0 vs temperature=0.8?',
    shortAnswer:
      'Use 0 when there is a right answer and two runs should agree: extraction, classification, JSON generation, SQL, routing, evals. Use ~0.8 when variety is the point: conversation, brainstorming, creative drafting, generating multiple options. The question is whether variation is a feature or a bug.',
    deepDive:
      'Temperature 0 (greedy decoding) — anything where output feeds code:\n\n- Structured extraction and function-call arguments. You want the same input to produce the same object.\n- Classification and routing. A label that flickers between runs is a bug.\n- SQL and code generation where correctness is binary.\n- Eval runs, so a score change reflects a prompt change rather than sampling noise.\n- Anything cached — variation defeats the cache.\n\nTemperature 0.7-0.9 — anything a human reads as prose:\n\n- Chat. At 0 the model becomes noticeably stilted and repetitive, and repeated questions get word-identical answers, which feels broken.\n- Brainstorming and naming, where you want ten different options rather than one repeated.\n- Creative writing and marketing copy.\n- Self-consistency sampling, where you deliberately draw several chains and vote.\n\nThe middle, 0.2-0.5, is a reasonable default for RAG answers and factual Q&A: enough variation to read naturally, tight enough to stay grounded.\n\nTwo caveats that make the answer sound experienced. Temperature 0 is not reliably deterministic in production — batched GPU non-determinism, MoE routing, and silent model updates all cause drift, so do not build correctness on byte-identical output. And lowering temperature does not fix hallucination: it makes the model consistently produce its most likely answer, which may be consistently wrong.',
    followUps: [
      'Is temperature 0 genuinely deterministic?',
      'Does lowering temperature reduce hallucination?',
      'What would you use for a RAG answer, and why?',
      'How does top_p interact with this?',
    ],
  },

  {
    id: 'ai-tiktoken-cost',
    category: 'APIs',
    difficulty: 'Medium',
    question: 'How do you calculate the cost of an API call before making it using tiktoken?',
    shortAnswer:
      'Encode the prompt with the tokenizer for that model, count the tokens, and multiply by the input price per token. Add an estimate of output tokens times the output price, which is typically several times higher. Input cost is exact; output cost is a forecast until the call returns.',
    deepDive:
      'The mechanics:\n\n  import tiktoken\n  encoding = tiktoken.encoding_for_model("gpt-4o")\n  input_tokens = len(encoding.encode(prompt))\n  cost = input_tokens * INPUT_PRICE_PER_TOKEN + max_tokens * OUTPUT_PRICE_PER_TOKEN\n\nDetails that make the estimate actually correct:\n\n- Chat messages are not just their content. Each message carries a few tokens of role and delimiter overhead, plus a couple for priming the reply. Counting only the content underestimates — by little on long prompts, by a lot on many short ones.\n- Tool and function definitions are injected into the prompt and are billed. A large tool schema is a real per-call cost that is easy to overlook.\n- Use the right encoding. Getting it from the model name rather than hardcoding a scheme keeps you correct across model changes.\n- Images in multimodal calls are billed as tokens by tile count and resolution, following the provider formula rather than tiktoken.\n\nWhat this is for, which is the interesting half of the question:\n\n1. Guardrails. Reject or truncate a request that would exceed a per-call budget before spending anything.\n2. Choosing a model per request — route to a cheaper one when the prompt is large and the task is simple.\n3. Context budgeting: count retrieved chunks and stop adding them at the limit, reserving room for the response.\n4. Per-user quotas and showing cost in the UI.\n\nThe caveats: output length is genuinely unknown in advance, so use max_tokens as the worst case for budgeting and reconcile against the usage object afterwards. Cached input tokens are billed at a large discount by most providers, so a naive estimate overstates cost for repeated prefixes. And prices change — keep them in config, not in code.',
    followUps: [
      'Why does counting only the message content underestimate?',
      'How do you budget when output length is unknown?',
      'How do tool definitions affect cost?',
      'How does prompt caching change the arithmetic?',
    ],
  },

  {
    id: 'ai-json-mode-vs-prompt',
    category: 'Structured',
    difficulty: 'Medium',
    question:
      'What is the difference between response_format json_object and just asking "return JSON" in the prompt?',
    shortAnswer:
      'Asking in the prompt is a request the model usually honours; json_object is a constraint on decoding that makes invalid JSON impossible to emit. The prompt version fails occasionally — a markdown fence, a preamble, a trailing comment — and those failures are what break production. Schema-constrained mode goes further and guarantees the shape, not just the syntax.',
    deepDive:
      'Three levels, worth distinguishing clearly:\n\n1. Prompt instruction only. "Respond with JSON." Works most of the time. The failures are the problem: text wrapped in triple-backtick fences, "Here is the JSON you asked for:" prefixes, trailing explanations, single quotes, a stray comment. At scale a small failure rate is a constant stream of parse errors.\n\n2. json_object mode. The decoder is constrained so only tokens that keep the output valid JSON can be sampled. You get syntactically valid JSON, guaranteed. What you do NOT get is the right fields — the model can return valid JSON with the wrong keys or nested differently.\n\n3. Structured outputs with a JSON schema (strict mode). The decoder is constrained to your schema, so field names, types, required-ness and enums are all guaranteed. This is what you want for anything feeding code.\n\nThe gotchas that come up as follow-ups:\n\n- json_object mode typically requires the word "JSON" to appear in the prompt anyway, or the API errors.\n- Constrained decoding does not guarantee the values are correct — only the shape. A hallucinated date in a correctly typed date field is still a hallucination.\n- Strict schema mode has restrictions: every field required (use nullable types for optional ones), no open-ended additional properties, limited nesting depth.\n- Truncation still breaks you. finish_reason of "length" mid-object yields invalid JSON regardless of mode, so handle it.\n\nThe production answer layers all of it: strict schema for the shape, temperature 0 for consistency, Pydantic or Zod validation on the parsed result for semantics, and a bounded retry with the validation error fed back.',
    followUps: [
      'Does json_object guarantee the right fields?',
      'What are the restrictions of strict schema mode?',
      'Can constrained decoding still hallucinate?',
      'What happens if the response is truncated?',
    ],
  },

  {
    id: 'ai-pydantic-optional-field',
    category: 'Structured',
    difficulty: 'Medium',
    question:
      'Your Pydantic field is email: Optional[str] = None. The LLM returns a name with no email. Does parsing fail or succeed?',
    shortAnswer:
      'It succeeds. Optional[str] with a default of None means the field may be absent, and Pydantic fills in None. That is exactly the behaviour you want for genuinely optional data — and exactly the behaviour that silently hides a broken extraction if the field was supposed to be there.',
    deepDive:
      'The distinction people get wrong, and it is the point of the question:\n\n  email: Optional[str] = None   -> absent is fine, becomes None\n  email: Optional[str]          -> required, but may be explicitly null\n  email: str                    -> required and must be a string; absence raises ValidationError\n\nIn Pydantic v2 the second form is required-but-nullable. Writing Optional without a default does not make a field optional — a common and confusing bug.\n\nThe design question underneath: should a missing email be an error? If the source document genuinely may not contain one, None is right and the downstream code must handle it. If every document should have one, then None is a silent extraction failure that will surface much later as a null in a database.\n\nThe pattern for that case is to make absence explicit and measurable rather than indistinguishable from a legitimate null: have the model return a confidence or a found flag alongside, or use a sentinel the schema requires, so you can monitor an extraction-miss rate rather than discovering it in a report six weeks later.\n\nA related trap worth mentioning: with OpenAI strict structured outputs, every property must be listed as required. The way to express optionality there is a union with null in the schema rather than omitting the field — so "optional" becomes "required but nullable", which lines up with the second Pydantic form above.',
    followUps: [
      'What is the difference between Optional[str] and Optional[str] = None in Pydantic v2?',
      'How would you distinguish "not present in the document" from "the model missed it"?',
      'How do optional fields work under strict structured outputs?',
      'When should a missing field be a hard error?',
    ],
  },

  {
    id: 'ai-temperature-zero-extraction',
    category: 'Structured',
    difficulty: 'Easy',
    question: 'Why use temperature=0 for data extraction tasks?',
    shortAnswer:
      'Because extraction has a single correct answer and you want the same document to produce the same output every time. Sampling adds variation that can only move you away from the right answer — there is no upside, and it breaks caching, testing and reproducibility.',
    deepDive:
      'Extraction is a lookup, not a generation. The invoice total is a fact in the document; there is nothing to be creative about. Higher temperature means a non-zero chance of sampling a less likely token, which in this setting means a wrong field value.\n\nThe concrete consequences of not doing it:\n\n- Reprocessing the same document gives different results, so you cannot tell whether a change came from your prompt edit or from sampling noise.\n- Tests become flaky. An extraction test suite at temperature 0.7 fails intermittently and teaches the team to ignore failures.\n- Caching is defeated — identical inputs no longer map to identical outputs.\n- Field values drift in format: "1,234.56" one run, "1234.56" the next, which then breaks the parser downstream.\n\nWhat temperature 0 does not give you:\n\n- It is not determinism in the strict sense. Batched inference non-determinism, MoE routing and silent model version changes all cause occasional drift, so pin model versions and do not assert on byte equality in tests.\n- It is not accuracy. The model consistently returns its most likely reading, which may be consistently wrong — a misread column header will be misread the same way every time. That is better for debugging and no better for correctness, which is why validation still matters.\n\nThe one exception worth naming: if you are deliberately sampling several extractions and taking a majority vote to estimate confidence, you need temperature above 0 for the samples to differ. That is a considered choice, not a default.',
    followUps: [
      'Is temperature 0 truly deterministic?',
      'Does it improve extraction accuracy?',
      'When would you deliberately use a non-zero temperature for extraction?',
      'How do you make extraction tests reliable?',
    ],
  },

  {
    id: 'ai-three-layer-reliability',
    category: 'Structured',
    difficulty: 'Hard',
    question: 'Describe the 3-layer reliability approach for structured extraction in production.',
    shortAnswer:
      'Constrain, validate, then recover. Layer one uses schema-constrained decoding so the shape cannot be wrong. Layer two validates semantics with Pydantic or Zod — types, ranges, cross-field rules — which the schema cannot express. Layer three retries with the validation error fed back, and escalates to human review when retries are exhausted.',
    deepDive:
      'Layer 1 — constrain the generation.\nStrict JSON schema in the API call, temperature 0, enums for anything categorical so an invalid value is structurally unreachable. This eliminates malformed JSON and wrong field names entirely. It cannot check that the total equals the sum of the line items.\n\nLayer 2 — validate the semantics.\nParse into a typed model and enforce what the schema cannot: value ranges (a confidence between 0 and 1), formats (a parseable date, a valid currency code), cross-field invariants (subtotal + tax == total, end date after start date), and referential checks against your own data (does this SKU exist). Normalisation belongs here too — coerce "1,234.56", "$1234.56" and "1234.56" into one canonical number. This layer is where most real extraction bugs are caught, and it is the layer people skip.\n\nLayer 3 — recover.\nOn a validation failure, retry with the error message appended: "confidence_score must be between 0 and 1; you returned 95". Models correct well when told specifically what was wrong. Bound it at two or three attempts with backoff. If it still fails, do not write a guess into the database — route to a dead-letter queue and a human review interface.\n\nThe cross-cutting pieces that make it a production system rather than three functions:\n\n- Observability. Log the raw response, the validation errors and the retry count. Your extraction-failure rate by field is the metric that tells you which part of the prompt is weak.\n- Confidence and thresholds. Have the model report per-field confidence, and auto-accept above a threshold while routing the rest to review. This is what makes the human step affordable.\n- A regression suite of labelled documents, run on every prompt or model change. Without it you cannot tell an improvement from a regression.',
    followUps: [
      'What belongs in layer 2 that layer 1 cannot express?',
      'How many retries, and what do you do when they run out?',
      'How would you decide what needs human review?',
      'What would you log to debug a drop in extraction quality?',
    ],
  },

  {
    id: 'ai-pydantic-validator-confidence',
    category: 'Structured',
    difficulty: 'Medium',
    question:
      'The LLM returns confidence_score as 95 instead of 0.95. How do you fix this with a Pydantic validator?',
    shortAnswer:
      'A field validator that runs before type coercion, detects the out-of-range value and divides by 100. In Pydantic v2 that is a field_validator with mode="before". But fix the prompt too — a validator patching a predictable model mistake is a workaround, not a solution.',
    deepDive:
      'The implementation:\n\n  from pydantic import BaseModel, field_validator\n\n  class Extraction(BaseModel):\n      confidence_score: float\n\n      @field_validator("confidence_score", mode="before")\n      @classmethod\n      def normalise(cls, v):\n          value = float(v)\n          # The model sometimes reports a percentage instead of a fraction.\n          if value > 1.0:\n              value = value / 100.0\n          if not 0.0 <= value <= 1.0:\n              raise ValueError("confidence_score out of range after normalisation")\n          return value\n\nWhy mode="before": it runs on the raw input ahead of type coercion, so you can reshape the value before validation rejects it. mode="after" receives the already-validated value, which is right for checks but too late for repair.\n\nThe important judgement, and what the question is really testing: do not silently coerce things whose intent is ambiguous. Here, 95 versus 0.95 is unambiguous because the valid range is 0 to 1 and 95 cannot be legitimate. If a value could plausibly be either, coercing it guesses — and a wrong guess written silently into a database is worse than a loud failure.\n\nThe better fixes, in order:\n\n1. Say it in the schema. A field description of "confidence as a decimal fraction between 0 and 1, for example 0.95" removes most of these. Field descriptions are sent to the model and are underused.\n2. Constrain the type — confloat(ge=0, le=1) — so strict decoding has the bounds.\n3. Keep the validator as a safety net, and log every time it fires. A rising normalisation rate is a signal the prompt or the model changed.\n\nFor cross-field rules, use model_validator(mode="after") instead, since it sees the whole object.',
    followUps: [
      'Why mode="before" rather than "after"?',
      'When is silent coercion the wrong choice?',
      'How would you validate a rule spanning two fields?',
      'How do you stop this happening at the prompt level?',
    ],
  },

  {
    id: 'ai-tool-choice-auto-vs-required',
    category: 'Function Calling',
    difficulty: 'Easy',
    question: 'What is the difference between tool_choice="auto" and tool_choice="required"?',
    shortAnswer:
      'auto lets the model decide whether to call a tool or answer directly. required forces it to call at least one tool, removing the option of a plain text reply. Use auto for conversation, required when a tool call is the only valid outcome — routing, classification, mandatory lookups.',
    deepDive:
      'The options:\n\n- "auto" — model chooses. The default, and right for chat where some turns need a tool and some do not.\n- "required" — must call some tool, model picks which.\n- {"type": "function", "function": {"name": "x"}} — must call that specific function.\n- "none" — no tools; text only.\n\nWhen required earns its place:\n\n- Routing. Every query must be classified into one of several handlers, so a text reply is never correct.\n- Structured extraction via a tool schema (the pattern that predates dedicated structured outputs).\n- Any step where "answering from memory" is exactly the failure you are trying to prevent — forcing a search tool stops the model short-circuiting to its training data.\n\nThe failure mode of required, worth raising: the model must call something, so when nothing is appropriate it calls the nearest tool with invented arguments. Forcing a weather lookup on "hello" produces a call for a hallucinated city. If unhandleable inputs are possible, either use auto or provide an explicit no_op / cannot_handle tool so there is a correct thing to call.\n\nThe failure mode of auto is the opposite: the model answers from memory when it should have looked something up. The fix is prompt-level — state when tools must be used — plus clear tool descriptions, which the model relies on far more than people expect. A vague description is the most common cause of a tool not being called.\n\nNote also that forcing a specific function disables parallel calls on most providers.',
    followUps: [
      'What happens with required when no tool fits the input?',
      'How do you make the model actually use a tool it is ignoring?',
      'When would you force one specific function?',
      'How does tool_choice interact with parallel tool calls?',
    ],
  },

  {
    id: 'ai-parallel-tool-calls',
    category: 'Function Calling',
    difficulty: 'Medium',
    question: 'How do you implement parallel tool calls? Walk through the API round-trip.',
    shortAnswer:
      'The model returns several tool_calls in one assistant message. You execute them concurrently, then append one tool message per call — each carrying its matching tool_call_id — and send the whole list back. The model sees all results together and produces its answer. Two round-trips, not one per tool.',
    deepDive:
      'The round-trip in full:\n\n1. Request. Send messages plus tools. The model decides it needs three independent lookups.\n2. Response. One assistant message whose tool_calls array holds three entries, each with an id, a function name and JSON arguments. finish_reason is "tool_calls".\n3. Your turn. Append that assistant message to the history verbatim — this is the step people miss, and omitting it makes the following tool messages orphaned and the API errors.\n4. Execute all three concurrently: Promise.all in TypeScript, asyncio.gather in Python. Serial execution here is the whole point missed — three 500ms calls should take 500ms, not 1.5s.\n5. Append one tool message per call, each with tool_call_id set to the id it answers. Order within the batch is not critical but every id must be present; a missing result is an API error.\n6. Second request with the extended history. The model now has all observations and replies — or requests more tools, which is why this sits inside a loop.\n\nThe practical details:\n\n- Errors go back as tool message content, not as thrown exceptions. "Error: city not found" lets the model recover and ask the user; an exception ends the run.\n- Bound the concurrency if tools hit rate-limited services — Promise.all on twenty calls can trip a limit.\n- Parallel calls only happen when the model judges the calls independent. A dependent chain ("find the user, then fetch their orders") comes back as sequential single calls across separate round-trips, and that is correct.\n- You can disable it with parallel_tool_calls: false, which is sometimes necessary when tools mutate shared state.\n- Forcing a specific function via tool_choice generally disables parallelism.',
    followUps: [
      'What happens if you omit the assistant message from the history?',
      'What if one of the tools fails?',
      'Why would the model return sequential calls instead of parallel ones?',
      'When would you disable parallel tool calls?',
    ],
  },

  {
    id: 'ai-tool-failure-return',
    category: 'Function Calling',
    difficulty: 'Medium',
    question: 'What should you return from a tool when it fails — and why does it matter?',
    shortAnswer:
      'Return a descriptive error string as the tool result, not an exception. The model can read it, understand what went wrong, and either correct its arguments or tell the user. Throwing ends the run and turns a recoverable situation into a failed one.',
    deepDive:
      'The principle: a tool result is an observation. An error is information about the world, and the agent is built to reason about observations. Take it out of the loop and the agent cannot adapt.\n\nWhat a good error message contains:\n\n  Bad:  "Error"\n  Bad:  "500 Internal Server Error"\n  Good: "No city named Londn. Did you mean London? Valid inputs are city names in English."\n  Good: "Date must be YYYY-MM-DD; received 12/05/2024."\n  Good: "Rate limited. Retry after 30 seconds."\n\nThe good ones say what was wrong and what would be right. Models correct reliably from that and flounder without it — the message is effectively a prompt, so write it as one.\n\nWhen NOT to return the error to the model:\n\n- Authentication and authorisation failures. Do not hand the model "access denied for user X on resource Y" and let it retry creatively — that is an injection-adjacent path. Fail the run and surface it to the application.\n- Anything containing secrets, internal hostnames or stack traces. Sanitise; a raw traceback is both a leak and a waste of context.\n- Genuine bugs in your own code. An unexpected exception should be logged and alerted, not smoothed over by an agent improvising around it.\n\nThe operational half: always log the real error with full detail alongside the sanitised version you return, or you will be debugging from the model paraphrase. Track per-tool failure rates — a tool failing often usually means its schema or description is misleading the model rather than the service being down. And cap retries per tool within a run, since a model handed the same error repeatedly will keep trying variations until the iteration limit.',
    followUps: [
      'Which errors should NOT go back to the model?',
      'How do you stop the agent retrying a failing tool forever?',
      'Why is the error message effectively a prompt?',
      'What would you log versus what would you return?',
    ],
  },
];
