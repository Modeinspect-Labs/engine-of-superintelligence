import { z } from "zod";

/**
 * Workbench chat — the one real AI integration. The client sends the
 * conversation plus the selected model and parameters; the route answers
 * in the voice of that model. When the API is unavailable the client falls
 * back to `scriptedReply`, so the demo never dead-ends.
 */
export const chatRequestSchema = z.object({
  modelId: z.string(),
  modelName: z.string(),
  developer: z.string(),
  system: z.string(),
  params: z.object({
    temperature: z.number(),
    topP: z.number(),
    maxTokens: z.number(),
    presencePenalty: z.number(),
    frequencyPenalty: z.number(),
  }),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  /** Lightweight markdown: ### headings, "- " bullets, **bold**, `code`, ``` fences. */
  text: z.string(),
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;

export function buildSystem(req: ChatRequest): string {
  const custom = req.system.trim();
  return `You are ${req.modelName} by ${req.developer}, served through the Nscale serverless inference API. Answer as that model would: helpful, direct, concise. Use lightweight markdown only ("### " headings, "- " bullets, **bold**, \`code\`, fenced code blocks). Do not mention being Claude or Anthropic. Keep answers under ${Math.max(120, Math.min(600, Math.round(req.params.maxTokens / 5)))} words unless the user asks for more.${
    custom
      ? `\n\nThe developer set this system prompt — follow it:\n${custom}`
      : ""
  }`;
}

/** Rough token estimate used for usage accounting. */
export const estimateTokens = (text: string) =>
  Math.max(1, Math.ceil(text.length / 4));

const SCRIPTS: Array<[RegExp, string]> = [
  [
    /hello|hi\b|hey/i,
    "Hello! I'm running on Nscale Serverless. Ask me anything — code, analysis, writing, or a quick explanation.",
  ],
  [
    /capital of france/i,
    "The capital of France is **Paris**. It has been the political and cultural centre of the country since the 10th century.",
  ],
  [
    /haiku|poem/i,
    "Cold racks hum at night\nGlomfjord water keeps them calm\nTokens flow like snow",
  ],
  [
    /python|code|function|script/i,
    "Here is a small example:\n\n```python\ndef fibonacci(n: int) -> list[int]:\n    seq = [0, 1]\n    while len(seq) < n:\n        seq.append(seq[-1] + seq[-2])\n    return seq[:n]\n\nprint(fibonacci(10))\n```\n\nIt builds the sequence iteratively, so it runs in O(n) time and O(n) space.",
  ],
  [
    /gpu|cluster|h100|gb200/i,
    "### Picking a GPU\n- **H100** — the proven default for training and inference at scale.\n- **H200** — same compute, 141GB of HBM3e, so larger batches and longer contexts.\n- **GB200 NVL72** — 72 Blackwell GPUs in one NVLink domain for frontier-scale training.\n\nFor serverless inference you don't choose at all: Nscale routes each request to the right hardware.",
  ],
];

/** Deterministic fallback reply when the API isn't reachable. */
export function scriptedReply(prompt: string, modelName: string): string {
  for (const [re, reply] of SCRIPTS) if (re.test(prompt)) return reply;
  const words = prompt.trim().split(/\s+/).length;
  return `Here's a concise answer from **${modelName}**.\n\n${
    words > 12
      ? "You asked a fairly detailed question, so the short version first: the approach that works best is to break the problem into the smallest step that can be verified, do that step, then build on it."
      : "That's a short prompt, so here's a short answer: yes — and the details depend on what you're trying to optimise for."
  }\n\n- Start with the simplest version that could work.\n- Measure before optimising.\n- Keep a log of what you changed.\n\nWant me to go deeper on any of these?`;
}
