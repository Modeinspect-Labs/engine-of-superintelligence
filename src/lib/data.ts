import type {
  BillingDetails,
  ChatParams,
  Model,
  Notification,
  PaymentCard,
  Preset,
  ServiceToken,
  Transaction,
  UsageEvent,
} from "./types";

/** The demo's fixed "now" (seed data is dated relative to this). */
export const TODAY = new Date("2026-10-09T10:30:00Z");

export const ORG = {
  id: "7d3f1c2e-9a4b-4c8d-b5e6-1f2a3b4c5d6e",
  name: "modeinspect",
  initial: "M",
};

export const USER = {
  name: "Martin Vrba",
  email: "martin@modeinspect.com",
  initials: "MV",
};

export const DEFAULT_PARAMS: ChatParams = {
  temperature: 0.7,
  topP: 1,
  maxTokens: 3000,
  presencePenalty: 0,
  frequencyPenalty: 0,
};

const hf = (id: string) => `https://huggingface.co/${id}`;

export const MODELS: Model[] = [
  {
    id: "moonshotai/Kimi-K2.5",
    name: "Kimi K2.5",
    developer: "MoonshotAI",
    type: "Image-Text-to-Text",
    priceInput: 0.45,
    priceOutput: 2.2,
    priceUnit: "tokens",
    params: "1058.6B",
    memoryGb: 595.23,
    dtype: "INT4",
    contextWindow: "262K",
    description:
      "MoonshotAI's Kimi K2.5 is a 1T+ parameter multimodal model supporting image and text inputs. Designed for long-context understanding with a 262K token context window, it excels at visual reasoning, document analysis, and complex multimodal tasks.",
    license: "Modified MIT License",
    hfUrl: hf("moonshotai/Kimi-K2.5"),
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    developer: "OpenAI",
    type: "Text Generation",
    priceInput: 0.1,
    priceOutput: 0.4,
    priceUnit: "tokens",
    params: "116.8B",
    memoryGb: 65.3,
    dtype: "MXFP4",
    contextWindow: "131K",
    description:
      "OpenAI's open-weight mixture-of-experts model with 5.1B active parameters. Built for strong reasoning, agentic tool use and long-form generation at a fraction of the cost of frontier models.",
    license: "Apache 2.0",
    hfUrl: hf("openai/gpt-oss-120b"),
  },
  {
    id: "openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    developer: "OpenAI",
    type: "Text Generation",
    priceInput: 0.05,
    priceOutput: 0.2,
    priceUnit: "tokens",
    params: "20.9B",
    memoryGb: 13.8,
    dtype: "MXFP4",
    contextWindow: "131K",
    description:
      "The compact sibling of GPT OSS 120B, with 3.6B active parameters. Fast, cheap and strong at structured output and function calling.",
    license: "Apache 2.0",
    hfUrl: hf("openai/gpt-oss-20b"),
  },
  {
    id: "Qwen/Qwen3-235B-A22B",
    name: "Qwen3 235B A22B",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.2,
    priceOutput: 0.6,
    priceUnit: "tokens",
    params: "235B",
    memoryGb: 128.4,
    dtype: "FP8",
    contextWindow: "131K",
    description:
      "Qwen's flagship mixture-of-experts model with 22B active parameters and a switchable thinking mode for deep reasoning or fast dialogue.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-235B-A22B"),
  },
  {
    id: "Qwen/Qwen3-235B-A22B-Instruct-2507",
    name: "Qwen3 235B A22B Instruct 2507",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.2,
    priceOutput: 0.6,
    priceUnit: "tokens",
    params: "235B",
    memoryGb: 128.4,
    dtype: "FP8",
    contextWindow: "262K",
    description:
      "The July 2025 instruct refresh of Qwen3 235B: non-thinking mode only, with large gains in instruction following, coding, maths and 256K-context tasks.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-235B-A22B-Instruct-2507"),
  },
  {
    id: "Qwen/Qwen3-4B-Thinking-2507",
    name: "Qwen3 4B Thinking 2507",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.01,
    priceOutput: 0.03,
    priceUnit: "tokens",
    params: "4B",
    memoryGb: 8.1,
    dtype: "BF16",
    contextWindow: "262K",
    description:
      "A small reasoning model that always thinks before answering. Surprisingly strong on maths and code for its size.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-4B-Thinking-2507"),
  },
  {
    id: "Qwen/Qwen3-4B-Instruct-2507",
    name: "Qwen3 4B Instruct 2507",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.01,
    priceOutput: 0.03,
    priceUnit: "tokens",
    params: "4B",
    memoryGb: 8.1,
    dtype: "BF16",
    contextWindow: "262K",
    description:
      "The direct-answer variant of Qwen3 4B. Ideal for high-volume, latency-sensitive workloads such as classification and extraction.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-4B-Instruct-2507"),
  },
  {
    id: "Qwen/Qwen3-8B",
    name: "Qwen3 8B",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.07,
    priceOutput: 0.18,
    priceUnit: "tokens",
    params: "8.2B",
    memoryGb: 16.4,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "A dense 8B model with thinking and non-thinking modes, 119 languages and solid agentic capabilities.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-8B"),
  },
  {
    id: "Qwen/Qwen3-14B",
    name: "Qwen3 14B",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.07,
    priceOutput: 0.2,
    priceUnit: "tokens",
    params: "14.8B",
    memoryGb: 29.6,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "Dense 14B model balancing quality and cost; a strong default for RAG and assistants.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-14B"),
  },
  {
    id: "Qwen/Qwen3-32B",
    name: "Qwen3 32B",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.08,
    priceOutput: 0.25,
    priceUnit: "tokens",
    params: "32.8B",
    memoryGb: 65.6,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "The largest dense Qwen3 model. Near-frontier reasoning with a single-GPU-class footprint.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-32B"),
  },
  {
    id: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    name: "Llama 4 Scout 17B 16E Instruct",
    developer: "Meta",
    type: "Image-Text-to-Text",
    priceInput: 0.09,
    priceOutput: 0.29,
    priceUnit: "tokens",
    params: "109B",
    memoryGb: 60.2,
    dtype: "FP8",
    contextWindow: "327K",
    description:
      "Meta's natively multimodal mixture-of-experts model with 16 experts and 17B active parameters. Handles text and images with an industry-leading context window.",
    license: "Llama 4 Community License",
    hfUrl: hf("meta-llama/Llama-4-Scout-17B-16E-Instruct"),
  },
  {
    id: "Qwen/Qwen2.5-Coder-3B-Instruct",
    name: "Qwen2.5 Coder 3B Instruct",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.01,
    priceOutput: 0.03,
    priceUnit: "tokens",
    params: "3.1B",
    memoryGb: 6.2,
    dtype: "BF16",
    contextWindow: "32K",
    description:
      "A tiny code model for autocompletion and quick edits. Trained on 5.5T tokens of code and code-adjacent text.",
    license: "Qwen Research License",
    hfUrl: hf("Qwen/Qwen2.5-Coder-3B-Instruct"),
  },
  {
    id: "Qwen/Qwen2.5-Coder-7B-Instruct",
    name: "Qwen2.5 Coder 7B Instruct",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.01,
    priceOutput: 0.03,
    priceUnit: "tokens",
    params: "7.6B",
    memoryGb: 15.2,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "Mid-size code model with strong repository-level understanding, fill-in-the-middle and 40+ languages.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen2.5-Coder-7B-Instruct"),
  },
  {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    name: "Qwen2.5 Coder 32B Instruct",
    developer: "Qwen",
    type: "Text Generation",
    priceInput: 0.06,
    priceOutput: 0.2,
    priceUnit: "tokens",
    params: "32.5B",
    memoryGb: 65.1,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "The flagship open code model of its generation, matching proprietary coders on repair, reasoning and generation benchmarks.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen2.5-Coder-32B-Instruct"),
  },
  {
    id: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
    name: "DeepSeek R1 Llama Distill 8B",
    developer: "DeepSeek",
    type: "Text Generation",
    priceInput: 0.05,
    priceUnit: "tokens",
    params: "8B",
    memoryGb: 16.1,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "Llama 3.1 8B fine-tuned on 800K reasoning samples from DeepSeek R1. Chain-of-thought quality far above its size.",
    license: "MIT",
    hfUrl: hf("deepseek-ai/DeepSeek-R1-Distill-Llama-8B"),
  },
  {
    id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    name: "DeepSeek R1 Qwen Distill 7B",
    developer: "DeepSeek",
    type: "Text Generation",
    priceInput: 0.15,
    priceUnit: "tokens",
    params: "7.6B",
    memoryGb: 15.2,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "Qwen2.5 Math 7B distilled from DeepSeek R1. Excellent on competition maths at a very small footprint.",
    license: "MIT",
    hfUrl: hf("deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"),
  },
  {
    id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
    name: "DeepSeek R1 Qwen Distill 14B",
    developer: "DeepSeek",
    type: "Text Generation",
    priceInput: 0.2,
    priceUnit: "tokens",
    params: "14.8B",
    memoryGb: 29.5,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "The 14B R1 distillation. Outperforms many 70B models on AIME and MATH-500.",
    license: "MIT",
    hfUrl: hf("deepseek-ai/DeepSeek-R1-Distill-Qwen-14B"),
  },
  {
    id: "mistralai/Devstral-Small-2505",
    name: "Devstral Small 2505",
    developer: "Mistral AI",
    type: "Text Generation",
    priceInput: 0.1,
    priceOutput: 0.3,
    priceUnit: "tokens",
    params: "23.6B",
    memoryGb: 47.1,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "An agentic coding model built with All Hands AI, tuned for exploring codebases, editing multiple files and powering software-engineering agents.",
    license: "Apache 2.0",
    hfUrl: hf("mistralai/Devstral-Small-2505"),
  },
  {
    id: "mistralai/Mixtral-8x22B-Instruct-v0.1",
    name: "Mixtral 8x22B Instruct v0.1",
    developer: "Mistral AI",
    type: "Text Generation",
    priceInput: 1.2,
    priceUnit: "tokens",
    params: "141B",
    memoryGb: 281.2,
    dtype: "BF16",
    contextWindow: "65K",
    description:
      "A sparse mixture-of-experts with 39B active parameters, native function calling and fluency in five European languages.",
    license: "Apache 2.0",
    hfUrl: hf("mistralai/Mixtral-8x22B-Instruct-v0.1"),
  },
  {
    id: "meta-llama/Llama-3.1-8B-Instruct",
    name: "Llama 3.1 8B Instruct",
    developer: "Meta",
    type: "Text Generation",
    priceInput: 0.06,
    priceUnit: "tokens",
    params: "8B",
    memoryGb: 16.1,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "The workhorse small Llama: multilingual, tool-capable and widely supported across the ecosystem.",
    license: "Llama 3.1 Community License",
    hfUrl: hf("meta-llama/Llama-3.1-8B-Instruct"),
  },
  {
    id: "nvidia/Nemotron-3-Nano-30B-A3B",
    name: "Nemotron 3 Nano 30B A3B",
    developer: "NVIDIA",
    type: "Text Generation",
    priceInput: 0.05,
    priceOutput: 0.2,
    priceUnit: "tokens",
    params: "30B",
    memoryGb: 31.4,
    dtype: "BF16",
    contextWindow: "131K",
    description:
      "NVIDIA's hybrid Mamba-Transformer MoE with 3B active parameters, designed for high-throughput agentic workloads.",
    license: "NVIDIA Open Model License",
    hfUrl: hf("nvidia/Nemotron-3-Nano-30B-A3B"),
  },
  {
    id: "Qwen/Qwen3-Embedding-8B",
    name: "Qwen3 Embedding 8B",
    developer: "Qwen",
    type: "Embeddings",
    priceInput: 0.04,
    priceUnit: "tokens",
    params: "8B",
    memoryGb: 16.4,
    dtype: "BF16",
    contextWindow: "32K",
    description:
      "Top of the MTEB multilingual leaderboard at release. 4096-dimensional embeddings with instruction-aware encoding.",
    license: "Apache 2.0",
    hfUrl: hf("Qwen/Qwen3-Embedding-8B"),
  },
  {
    id: "black-forest-labs/FLUX.1-schnell",
    name: "FLUX.1 [schnell]",
    developer: "Black Forest Labs",
    type: "Text-to-Image",
    priceInput: 0.0013,
    priceUnit: "pixels",
    params: "12B",
    memoryGb: 24.2,
    dtype: "BF16",
    contextWindow: "—",
    description:
      "A 12B rectified-flow transformer that generates high-quality images in 1–4 steps. The fastest FLUX variant.",
    license: "Apache 2.0",
    hfUrl: hf("black-forest-labs/FLUX.1-schnell"),
  },
];

export const modelById = (id: string): Model | undefined =>
  MODELS.find((m) => m.id === id);

export const DEFAULT_MODEL_ID = "openai/gpt-oss-120b";

const iso = (daysAgo: number, hour = 9) => {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(hour, 14, 0, 0);
  return d.toISOString();
};

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_01",
    date: iso(3, 15),
    amountCents: 5000,
    paymentType: "Visa •••• 4242",
    receipt: true,
  },
  {
    id: "txn_02",
    date: iso(34, 11),
    amountCents: 7500,
    paymentType: "Visa •••• 4242",
    receipt: true,
  },
  {
    id: "txn_03",
    date: iso(71, 16),
    amountCents: 10000,
    paymentType: "Visa •••• 4242",
    receipt: true,
  },
  {
    id: "txn_04",
    date: iso(98, 10),
    amountCents: 2500,
    paymentType: "Promotional credit",
    receipt: false,
  },
];

export const SEED_TOKENS: ServiceToken[] = [
  {
    id: "tok_01",
    name: "ci-pipeline",
    createdBy: USER.email,
    createdAt: iso(41, 14),
    expiresAt: iso(-324, 14),
    prefix: "nsk_live_8f2a",
  },
  {
    id: "tok_02",
    name: "notebook-dev",
    createdBy: USER.email,
    createdAt: iso(12, 9),
    expiresAt: null,
    prefix: "nsk_live_c91d",
  },
];

export const SEED_CARDS: PaymentCard[] = [
  {
    id: "card_01",
    brand: "Visa",
    last4: "4242",
    expMonth: 8,
    expYear: 2029,
    isDefault: true,
  },
];

export const SEED_BILLING: BillingDetails = {
  name: "Modeinspect s.r.o.",
  email: USER.email,
  address: "Rohanské nábřeží 678/29, 186 00 Prague, Czechia",
  taxId: "CZ09871234",
};

export const SEED_PRESETS: Preset[] = [
  {
    id: "preset_default",
    name: "default-preset",
    modelId: DEFAULT_MODEL_ID,
    systemPrompt: "",
    params: DEFAULT_PARAMS,
  },
  {
    id: "preset_support",
    name: "support-triage",
    modelId: "Qwen/Qwen3-32B",
    systemPrompt:
      "You are a support triage assistant for a GPU cloud. Classify each message as billing, quota, outage or other, then answer in two sentences.",
    params: { ...DEFAULT_PARAMS, temperature: 0.2, maxTokens: 600 },
  },
  {
    id: "preset_coder",
    name: "code-review",
    modelId: "Qwen/Qwen2.5-Coder-32B-Instruct",
    systemPrompt:
      "You review pull requests. Point out correctness bugs first, then style. Be terse.",
    params: { ...DEFAULT_PARAMS, temperature: 0.1, maxTokens: 2000 },
  },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "ntf_01",
    title: "Credit added",
    body: "$50.00 was added to your balance from Visa •••• 4242.",
    createdAt: iso(3, 15),
    read: true,
  },
  {
    id: "ntf_02",
    title: "New model available",
    body: "Kimi K2.5 (MoonshotAI) is now live on Serverless.",
    createdAt: iso(6, 8),
    read: false,
  },
  {
    id: "ntf_03",
    title: "Service token created",
    body: "notebook-dev was created by martin@modeinspect.com.",
    createdAt: iso(12, 9),
    read: true,
  },
];

/* ── Usage history ───────────────────────────────────────────────────── */

/** Small deterministic PRNG so the seed is identical on every load. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const USAGE_MIX: Array<[string, number]> = [
  ["openai/gpt-oss-120b", 0.34],
  ["Qwen/Qwen3-32B", 0.2],
  ["moonshotai/Kimi-K2.5", 0.14],
  ["Qwen/Qwen2.5-Coder-32B-Instruct", 0.12],
  ["meta-llama/Llama-4-Scout-17B-16E-Instruct", 0.08],
  ["Qwen/Qwen3-Embedding-8B", 0.07],
  ["openai/gpt-oss-20b", 0.05],
];

export function costFor(
  model: Model,
  inputTokens: number,
  outputTokens: number,
): number {
  const out = model.priceOutput ?? model.priceInput;
  return (inputTokens / 1e6) * model.priceInput + (outputTokens / 1e6) * out;
}

/** Last 300 days of inference spend, ramping up over time; ~ $190 total. */
export function seedUsage(): UsageEvent[] {
  const rand = mulberry32(20261009);
  const events: UsageEvent[] = [];
  for (let daysAgo = 300; daysAgo >= 1; daysAgo--) {
    const d = new Date(TODAY);
    d.setUTCDate(d.getUTCDate() - daysAgo);
    const day = d.toISOString().slice(0, 10);
    const weekday = d.getUTCDay();
    const ramp = 0.25 + ((300 - daysAgo) / 300) * 0.95;
    const weekend = weekday === 0 || weekday === 6 ? 0.3 : 1;
    const burst = rand() > 0.93 ? 2.6 : 1;
    if (rand() > 0.9 * weekend + 0.05) continue;
    for (const [modelId, share] of USAGE_MIX) {
      if (rand() > share * 2.2) continue;
      const model = modelById(modelId);
      if (!model) continue;
      const scale = ramp * weekend * burst * (0.4 + rand());
      const inputTokens = Math.round(120_000 * scale * (0.5 + rand()));
      const outputTokens = Math.round(28_000 * scale * (0.5 + rand()));
      events.push({
        id: `use_${day}_${modelId}`,
        day,
        modelId,
        inputTokens,
        outputTokens,
        costUsd: costFor(model, inputTokens, outputTokens),
      });
    }
  }
  return events;
}

export const GPU_TYPES = ["GB200 NVL72", "H200", "H100", "B200"] as const;
export const REGIONS = [
  "Glomfjord, Norway (glo1)",
  "Austin, Texas (aus1)",
  "Kalundborg, Denmark (kal1)",
] as const;
