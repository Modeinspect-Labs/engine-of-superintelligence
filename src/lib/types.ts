export type ModelType =
  "Text Generation" | "Image-Text-to-Text" | "Embeddings" | "Text-to-Image";

export interface Model {
  /** Endpoint id, e.g. "moonshotai/Kimi-K2.5". */
  id: string;
  name: string;
  developer: string;
  type: ModelType;
  /** USD per 1M units (tokens or pixels). */
  priceInput: number;
  /** USD per 1M output tokens; absent when the model has a single rate. */
  priceOutput?: number;
  priceUnit: "tokens" | "pixels";
  params: string;
  memoryGb: number;
  dtype: string;
  contextWindow: string;
  description: string;
  license: string;
  hfUrl: string;
}

export interface Transaction {
  id: string;
  /** ISO timestamp. */
  date: string;
  amountCents: number;
  paymentType: string;
  receipt: boolean;
}

export interface ServiceToken {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  /** First characters of the secret, shown in the table. */
  prefix: string;
}

export interface PaymentCard {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface BillingDetails {
  name: string;
  email: string;
  address: string;
  taxId: string;
}

export interface ChatParams {
  temperature: number;
  topP: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
}

export interface Preset {
  id: string;
  name: string;
  modelId: string;
  systemPrompt: string;
  params: ChatParams;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelId: string;
  createdAt: string;
  /** Set on assistant replies. */
  usage?: { inputTokens: number; outputTokens: number; costUsd: number };
  /** True when the reply came from the local script instead of the API. */
  scripted?: boolean;
}

export interface UsageEvent {
  id: string;
  /** ISO day, e.g. "2026-10-04". */
  day: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface ClusterRequest {
  id: string;
  gpuType: string;
  gpuCount: number;
  orchestration: "Kubernetes" | "Slurm" | "GPU Nodes";
  region: string;
  notes: string;
  createdAt: string;
}

export type Theme = "light" | "dark" | "system";
