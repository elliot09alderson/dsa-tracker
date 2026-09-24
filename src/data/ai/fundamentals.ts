import type { AIQuestion } from '@/lib/types';

/** ML Basics and LLM fundamentals -- the rapid-fire opening of most AI rounds. */
export const fundamentalsQuestions: AIQuestion[] = [
  {
    id: 'ai-overfitting',
    category: 'ML Basics',
    difficulty: 'Easy',
    question: 'What is overfitting? How do you fix it?',
    shortAnswer:
      'Overfitting is when a model learns the noise in the training set rather than the underlying pattern, so training error keeps dropping while validation error starts climbing. The fixes fall into three buckets: give it more or better data, reduce its capacity to memorise, or stop it before it gets the chance.',
    deepDive:
      'The tell is the gap. Training accuracy 99%, validation accuracy 71% means the model has memorised examples it will never see again. The opposite failure, underfitting, shows up as both numbers being bad together.\n\nWhy it happens: the model has more capacity than the problem needs, and nothing is pushing it toward the simpler explanation. With enough parameters a network can fit random labels perfectly — which is exactly the point that memorisation and learning look identical on the training set.\n\nThe fixes, roughly in the order worth reaching for:\n\n1. More data, or better augmentation. The most reliable fix and usually the most expensive. Augmentation (crops, flips, paraphrases) is the cheap version.\n2. Regularisation. L2 / weight decay pulls weights toward zero; dropout randomly removes units during training so no single path can be relied on.\n3. Early stopping. Watch validation loss and stop at its minimum, not at the end of your epoch budget.\n4. Reduce capacity. Fewer layers or narrower ones. Underrated, and free at inference time.\n5. Cross-validation. Not a fix so much as a way to stop fooling yourself about how big the gap is.\n\nFor LLM fine-tuning specifically this shows up as catastrophic forgetting: the model gets good at your 500 examples and worse at everything it used to know. LoRA helps because it constrains how far the weights can move in the first place.',
    followUps: [
      'How is this different from underfitting, and how would you tell them apart from the loss curves alone?',
      'You have 500 training examples and cannot get more. What do you do?',
      'Does regularisation help if the real problem is label noise?',
      'Why does dropout work? What is it approximating?',
    ],
  },

  {
    id: 'ai-accuracy-paradox',
    category: 'ML Basics',
    difficulty: 'Easy',
    question: 'A fraud detection model has 99% accuracy. Is it good?',
    shortAnswer:
      'Almost certainly not. If 1% of transactions are fraudulent, a model that predicts "not fraud" for everything scores 99% and catches zero fraud. On imbalanced problems accuracy is close to meaningless — you want precision, recall, and the PR-AUC instead.',
    deepDive:
      'This is the classic trap question, and the interviewer is checking whether you reach for the confusion matrix without being prompted.\n\nTake 1,000,000 transactions with 10,000 frauds (1%). The always-say-no model gets 990,000 right: 99% accuracy, and a completely useless product.\n\nWhat to ask for instead:\n\n- Recall (of the actual frauds, how many did we catch?) — this is what the business loses money on.\n- Precision (of the transactions we flagged, how many were really fraud?) — this is what annoys legitimate customers.\n- PR-AUC rather than ROC-AUC. ROC-AUC looks flattering under heavy imbalance because the true-negative count dominates the false-positive rate.\n\nThen the real question is the cost asymmetry. A missed fraud costs the chargeback amount; a false positive costs a declined card and a support call. Those are not equal, and they are not equal in the same way for a $10 transaction and a $10,000 one. That is a threshold decision, not a model decision — you tune the operating point on the PR curve to match the cost ratio, and you usually route the uncertain band to manual review rather than forcing a binary call.',
    followUps: [
      'What metric would you actually report to the business?',
      'How would you pick the decision threshold?',
      'Why is ROC-AUC misleading here but fine on a balanced problem?',
      'How would you handle the class imbalance during training?',
    ],
  },

  {
    id: 'ai-precision-vs-recall',
    category: 'ML Basics',
    difficulty: 'Easy',
    question: 'When do you use precision vs recall? Give real examples.',
    shortAnswer:
      'Precision is "of what I flagged, how much was right" — optimise it when acting on a false positive is expensive. Recall is "of what was there, how much did I find" — optimise it when missing a true positive is expensive. You trade one against the other by moving the decision threshold.',
    deepDive:
      'Definitions, in terms of the confusion matrix:\n\n  precision = TP / (TP + FP)   — how trustworthy a positive prediction is\n  recall    = TP / (TP + FN)   — how complete the positive predictions are\n\nWhen recall matters more:\n\n- Cancer screening. A missed tumour is fatal; a false alarm costs a second test. Screening is deliberately over-sensitive and a confirmatory test supplies the precision.\n- Security and abuse detection at the first stage. Catch everything suspicious, then filter.\n\nWhen precision matters more:\n\n- Spam filtering. A promotional email in the inbox is a minor irritation; a real invoice in the spam folder loses money. Gmail is tuned hard toward precision.\n- Anything auto-actioned without a human: auto-banning accounts, auto-declining payments, auto-deleting content.\n\nThe RAG version of this question, which comes up a lot now: retrieval recall matters more than retrieval precision, because the LLM can ignore an irrelevant chunk it was handed, but it cannot use a relevant chunk it never received. So retrieve generously (top-k of 20) and let a reranker supply precision.\n\nIf you are forced to one number, F1 is the harmonic mean of the two — harmonic, so a model cannot game it by pushing one to 1.0 and abandoning the other.',
    followUps: [
      'Where does F1 hide something important?',
      'How does moving the threshold trade one for the other?',
      'For a RAG retriever, which one would you optimise and why?',
      'What is F-beta and when would you use beta = 2?',
    ],
  },

  {
    id: 'ai-data-leakage',
    category: 'ML Basics',
    difficulty: 'Medium',
    question: 'What is data leakage? Give a concrete example.',
    shortAnswer:
      'Data leakage is when information that will not exist at prediction time gets into training, so offline metrics look excellent and production performance collapses. The usual culprits are fitting preprocessing before the split, target leakage from features that encode the answer, and temporal leakage from random-splitting time series.',
    deepDive:
      'Three kinds, in rough order of how often they bite:\n\n1. Preprocessing leakage. You call the scaler fit on the whole dataset, then split. The mean and variance now carry information from the test rows. The fix is to fit every transformer on the training fold only and apply it to the others — this is exactly why sklearn Pipelines exist.\n\n2. Target leakage. A feature that is a consequence of the label, not a cause. The classic: predicting hospital readmission with a "number of follow-up appointments booked" feature, which only gets populated after the readmission decision. Or churn prediction using "account_closed_date". The model looks brilliant and is useless.\n\n3. Temporal leakage. Random train/test split on time series means you train on Thursday to predict Tuesday. For anything time-ordered you need a chronological split, and for cross-validation a forward-chaining scheme where every fold trains only on the past.\n\nThe modern LLM version is test-set contamination: benchmark questions that were in the pretraining corpus. A model scoring well on a public benchmark may just be reciting. This is why teams increasingly build private held-out evals, and why a suspiciously high score on a well-known benchmark is worth distrusting.\n\nThe smell test: if a model is far better than the problem should allow, assume leakage before you assume genius.',
    followUps: [
      'How would you split a dataset of user sessions to avoid leakage?',
      'What is group leakage and when does it appear?',
      'How would you detect leakage you did not anticipate?',
      'How does contamination affect how you read LLM benchmark scores?',
    ],
  },

  {
    id: 'ai-cross-entropy-vs-mse',
    category: 'ML Basics',
    difficulty: 'Medium',
    question: 'Why use cross-entropy loss for classification, not MSE?',
    shortAnswer:
      'Two reasons. Cross-entropy gives much healthier gradients — paired with a sigmoid or softmax, the derivative simplifies to (prediction − target), so a confidently wrong prediction produces a large gradient instead of a vanishing one. And cross-entropy is the right thing to optimise for probabilities: it is the negative log-likelihood of the data under the model.',
    deepDive:
      'The gradient argument is the one to lead with.\n\nWith sigmoid output and MSE, the gradient carries a factor of the sigmoid derivative, which goes to nearly zero when the output saturates near 0 or 1. So the model that is most wrong — predicting 0.001 when the answer is 1 — learns the slowest. That is exactly backwards.\n\nWith sigmoid plus binary cross-entropy, the sigmoid derivative cancels algebraically and the gradient becomes simply (prediction − target). Confidently wrong now means a large gradient and fast correction.\n\nThe probabilistic argument is the deeper one. Minimising cross-entropy is maximising the likelihood of the observed labels under the model distribution. Equivalently, it minimises the KL divergence between the true label distribution and the predicted one. MSE corresponds to a Gaussian likelihood, which is the right assumption for continuous targets and the wrong one for a categorical variable.\n\nThere is also a shape argument: with softmax outputs, MSE is non-convex, so optimisation has more local minima to get stuck in.\n\nWhere MSE is correct: regression. And note the middle ground — for ordinal targets (a 1-to-5 rating) neither is quite right, since cross-entropy treats predicting 1 for a true 5 as no worse than predicting 4.',
    followUps: [
      'Write the binary cross-entropy formula.',
      'Why does the sigmoid derivative cancel? Show the algebra.',
      'What is focal loss and what problem with cross-entropy does it fix?',
      'What is label smoothing and why does it help?',
    ],
  },

  {
    id: 'ai-attention-mechanism',
    category: 'LLMs',
    difficulty: 'Medium',
    question: 'Explain the attention mechanism in one minute.',
    shortAnswer:
      'Attention lets every token look at every other token and pull in what is relevant. Each token emits a query, a key, and a value. You score a query against all keys with a dot product, softmax the scores into weights, and return the weighted sum of values. The result is a representation of each token that is informed by the context it sits in.',
    deepDive:
      'The retrieval analogy is what makes this land in an interview. Think of a lookup table: the query is what I am looking for, the keys are the labels on each entry, and the values are the contents. Ordinary lookup matches one key exactly; attention matches all of them softly and blends the results by how well they match.\n\nThe formula:\n\n  Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V\n\nPiece by piece:\n\n- QK^T gives every query-key pair a similarity score. For a sequence of n tokens this is an n x n matrix — which is where the quadratic cost comes from.\n- Dividing by sqrt(d_k) is the "scaled" part. Without it, dot products in high dimensions grow large, softmax saturates into a near one-hot distribution, and the gradients vanish.\n- softmax turns the row of scores into weights that sum to 1.\n- Multiplying by V returns a weighted blend of the value vectors.\n\nConcretely, in "the animal did not cross the street because it was too tired", when the model processes "it" the attention weights on "animal" are high and on "street" low — that is how the pronoun gets resolved.\n\nMulti-head attention runs several of these in parallel with different learned projections, so one head can track syntax while another tracks coreference, and their outputs are concatenated.\n\nThe two follow-ups that always come: causal masking (set future positions to -infinity before the softmax so a decoder cannot see ahead) and the O(n^2) memory cost that motivates FlashAttention, sliding-window attention, and the whole long-context research line.',
    followUps: [
      'Why divide by sqrt(d_k) specifically?',
      'What does causal masking do and where is it applied?',
      'Why multiple heads instead of one big one?',
      'What makes attention O(n^2) and what have people done about it?',
    ],
  },

  {
    id: 'ai-bert-vs-gpt',
    category: 'LLMs',
    difficulty: 'Medium',
    question: 'What is the difference between BERT and GPT architectures?',
    shortAnswer:
      'BERT is an encoder: bidirectional attention, trained by masking tokens and predicting them, which makes it good at understanding a piece of text you already have. GPT is a decoder: causal attention that only looks left, trained to predict the next token, which makes it good at generating text. Encoder for classification and embeddings, decoder for generation.',
    deepDive:
      'The architectural difference is the attention mask, and nearly everything else follows from it.\n\nBERT (encoder-only):\n- Every token attends to every other token, in both directions.\n- Pretrained with masked language modelling: blank out ~15% of tokens and predict them from both sides of context.\n- Produces a rich representation of an existing sequence. You add a small head for classification, NER, or sentence embeddings.\n- Cannot generate text naturally, because it has no left-to-right factorisation to sample from.\n\nGPT (decoder-only):\n- Causal mask — position i attends only to positions <= i.\n- Pretrained on next-token prediction over raw text.\n- Generates by sampling one token at a time and feeding it back in.\n- The causal mask is also what makes KV caching possible, since past tokens never need recomputing.\n\nWhy decoder-only won for general-purpose models: next-token prediction is a task you can run on literally any text with no labelling, it scales cleanly, and in-context learning turned out to emerge from it. BERT-style masked modelling wastes signal — you only get a learning signal on the 15% you masked.\n\nWhere encoders still win, and this matters practically: embeddings for retrieval. A bidirectional encoder produces better fixed-length representations of a chunk than a causal decoder does, which is why most production embedding models are still encoder-based even when the generator alongside them is a decoder. There is also T5-style encoder-decoder, which keeps both halves and remains strong for translation and summarisation.',
    followUps: [
      'Why did decoder-only architectures win for general-purpose models?',
      'If you needed sentence embeddings for RAG, which would you pick?',
      'What is an encoder-decoder model and when is it the right choice?',
      'How does the causal mask enable KV caching?',
    ],
  },

  {
    id: 'ai-context-window',
    category: 'LLMs',
    difficulty: 'Easy',
    question: 'What is a context window? What happens when you exceed it?',
    shortAnswer:
      'The context window is the maximum number of tokens the model can attend to in one forward pass — the prompt and the generated output together. Exceed it and you do not get a graceful degradation: the API returns an error, or the framework silently truncates, usually from the middle or the start, and the model answers confidently using whatever survived.',
    deepDive:
      'The critical detail people get wrong in interviews: input and output share the budget. If the window is 128k and your prompt is 127k tokens, you have 1k left to generate into. This is exactly the cause of a finish_reason of "length" on a long document summarisation.\n\nWhat actually happens on overflow depends on the layer:\n\n- Raw API: a hard 400 error telling you the token count exceeded the maximum.\n- Most frameworks: silent truncation. This is more dangerous than the error, because the model still produces a fluent answer based on a document whose middle went missing, and nothing in the output signals it.\n\nThe mitigations, roughly in order:\n\n1. Do not stuff the window. Retrieve the relevant 5k tokens instead of pasting 200k. This is the main argument for RAG over long-context prompting.\n2. Summarise older turns in a long conversation rather than carrying raw history — rolling summarisation.\n3. Map-reduce for long documents: summarise chunks independently, then summarise the summaries.\n4. Count tokens before you send, with tiktoken or the provider equivalent, and reserve headroom for the response.\n\nWorth knowing even with large windows: "lost in the middle". Retrieval accuracy is measurably worse for content buried in the middle of a long context than for content at the beginning or end. A 1M-token window does not mean 1M tokens of reliable attention, so position your most important context deliberately. Cost and latency also scale with context length, so a full window is rarely the cheap option.',
    followUps: [
      'How do you handle a conversation that outgrows the window?',
      'What is "lost in the middle" and how do you design around it?',
      'Does a 1M-token window remove the need for RAG?',
      'How would you count tokens before sending a request?',
    ],
  },

  {
    id: 'ai-hallucination',
    category: 'LLMs',
    difficulty: 'Medium',
    question: 'What is hallucination and how do you mitigate it?',
    shortAnswer:
      'A hallucination is output that is fluent and confident but not grounded in fact or in the provided source. It happens because the model is trained to produce likely text, not true text — it has no separate notion of knowing versus guessing. You mitigate it by grounding (RAG with citations), by constraining (structured outputs, tool calls for anything factual), and by verifying (a checking pass, or refusing when retrieval is weak).',
    deepDive:
      'This is the most-asked LLM question, so a structured answer stands out.\n\nWhy it happens. Next-token prediction optimises for plausibility. "The capital of Australia is Sydney" is a highly likely sentence; truth was never a term in the objective. Worse, RLHF can reward confident-sounding answers, because human raters prefer them — so the model is nudged away from saying "I do not know".\n\nThe mitigations, strongest first:\n\n1. Ground it. Retrieve real source text and instruct the model to answer only from it. Require inline citations, so an unsupported claim is visible rather than hidden.\n2. Let it refuse. Explicitly permit "the provided context does not answer this". Without permission, the model will invent something — and a retrieval-confidence threshold below which you do not call the model at all is often the single highest-leverage fix.\n3. Constrain the output. Enum fields and JSON schemas make an invented value structurally impossible in a way a prompt instruction never does.\n4. Use tools for facts. Arithmetic, current dates, prices, database lookups — route to code, never to the model weights.\n5. Verify. A second pass that checks each claim against the source. Expensive; worth it in high-stakes domains.\n6. Lower temperature for factual tasks. A smaller effect than people expect — temperature 0 gives you consistent hallucinations rather than fewer of them.\n\nThe honest framing to close on: these reduce the rate, none eliminate it. Anything with real consequences needs a human in the loop, and your eval suite should measure groundedness (is every claim supported by the retrieved context) as a first-class metric rather than judging fluency.',
    followUps: [
      'Does temperature 0 stop hallucination?',
      'How would you measure the hallucination rate of your system?',
      'What is "groundedness" and how would you evaluate it automatically?',
      'Why can RLHF make the problem worse?',
    ],
  },

  {
    id: 'ai-temperature',
    category: 'LLMs',
    difficulty: 'Easy',
    question: 'What does temperature control in LLM text generation?',
    shortAnswer:
      'Temperature rescales the logits before the softmax, which sharpens or flattens the next-token probability distribution. Low temperature concentrates probability on the top candidates and makes output near-deterministic; high temperature flattens it and lets unlikely tokens through. It is a creativity-versus-consistency dial, not a quality dial.',
    deepDive:
      'Mechanically: each logit is divided by T before the softmax.\n\n- T < 1 makes the gaps between logits bigger, so the distribution gets peakier and the top token dominates.\n- T = 1 is the model distribution as trained.\n- T > 1 compresses the gaps, so the tail gets more probability mass.\n- T = 0 is a special case implemented as greedy decoding: always take the argmax.\n\nWhat to use where:\n\n- 0 for extraction, classification, structured JSON, SQL generation, routing decisions. Anything where two runs should agree.\n- 0.2 to 0.5 for factual Q&A and RAG answers — a little variation, still tight.\n- 0.7 to 1.0 for conversational tone, brainstorming, creative drafting.\n- Above 1.2 output degrades quickly into incoherence.\n\nTwo details that separate a good answer from a memorised one.\n\nFirst, temperature 0 is not truly deterministic in practice. Floating-point non-associativity in batched GPU inference, MoE routing that depends on what else is in the batch, and silent model version updates all produce run-to-run variation. Design for it rather than assuming it away.\n\nSecond, temperature interacts with top_p (nucleus sampling), which truncates to the smallest set of tokens whose cumulative probability exceeds p. They are different mechanisms — temperature reshapes the distribution, top_p cuts its tail — and the usual advice is to tune one and leave the other at its default rather than fighting both at once.',
    followUps: [
      'What is top_p and how does it differ from temperature?',
      'Is temperature 0 actually deterministic in production?',
      'Does lowering temperature reduce hallucination?',
      'What is top_k sampling?',
    ],
  },

  {
    id: 'ai-lora',
    category: 'LLMs',
    difficulty: 'Medium',
    question: 'What is LoRA and why does it matter for SDEs?',
    shortAnswer:
      'LoRA (Low-Rank Adaptation) freezes the base model and trains small low-rank matrices alongside the existing weights. A weight update that would be a full d x d matrix is approximated as the product of two thin matrices, cutting trainable parameters by orders of magnitude. It means you can fine-tune a large model on one GPU, and ship adapters of a few megabytes instead of full model copies.',
    deepDive:
      'The idea: the weight change needed to adapt a pretrained model to a narrow task has low intrinsic rank. So instead of learning a full update matrix, learn B x A where the inner dimension r is small (typically 8 to 64). The forward pass becomes W x + B A x, with W frozen.\n\nThe arithmetic is the selling point. A 4096 x 4096 layer is ~16.8M parameters. At rank 8, the two LoRA matrices total 4096x8 + 8x4096 = ~65k — roughly 0.4%. Across a 7B model you typically train well under 1% of the parameters.\n\nWhy an SDE should care, which is what the question is really asking:\n\n1. It fits. Full fine-tuning of a 7B model needs ~80GB+ for optimizer state; LoRA brings it onto a single consumer GPU, and QLoRA (4-bit quantised base plus LoRA) pushes it further.\n2. Adapters are small and swappable. Ship one base model and a 20MB adapter per customer or per task, loaded at request time, rather than an 14GB copy each.\n3. It forgets less. Because the base weights are frozen, the catastrophic forgetting you get from full fine-tuning is much reduced.\n4. It is reversible. Merge the adapter for inference speed, or keep it separate and turn it off.\n\nThe framing that lands best in an interview is knowing when NOT to use it. Fine-tuning of any kind teaches form, not facts — tone, output format, a domain vocabulary, a classification boundary. If the need is "the model should know our internal documentation", that is RAG, and LoRA will produce a model that confidently makes things up in your house style. Reach for prompting first, RAG second, and fine-tuning only when the first two have actually failed.',
    followUps: [
      'When would you fine-tune instead of using RAG?',
      'What is QLoRA and what does it add?',
      'What does the rank hyperparameter trade off?',
      'Can you serve multiple LoRA adapters from one base model at once?',
    ],
  },
];
