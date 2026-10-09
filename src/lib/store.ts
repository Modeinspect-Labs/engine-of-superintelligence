import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_MODEL_ID,
  DEFAULT_PARAMS,
  SEED_BILLING,
  SEED_CARDS,
  SEED_NOTIFICATIONS,
  SEED_PRESETS,
  SEED_TOKENS,
  SEED_TRANSACTIONS,
  USER,
  costFor,
  modelById,
} from "./data";
import type {
  BillingDetails,
  ChatMessage,
  ChatParams,
  ClusterRequest,
  Notification,
  PaymentCard,
  Preset,
  ServiceToken,
  Theme,
  Transaction,
  UsageEvent,
} from "./types";

export const STORAGE_KEY = "nscale-demo-v1";

let counter = 0;
export const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${(counter++).toString(36)}`;

export interface Toast {
  id: string;
  title: string;
  description?: string;
  appearance?: "default" | "success" | "error";
}

export interface NscaleState {
  /* account */
  creditCents: number;
  transactions: Transaction[];
  serviceTokens: ServiceToken[];
  cards: PaymentCard[];
  billingDetails: BillingDetails;
  autoRecharge: {
    enabled: boolean;
    thresholdCents: number;
    topUpCents: number;
  };
  freeCreditRedeemed: boolean;
  onboarding: { credit: boolean; token: boolean; endpoint: boolean };
  clusterRequests: ClusterRequest[];
  /* workbench */
  presets: Preset[];
  activePresetId: string;
  modelId: string;
  systemPrompt: string;
  params: ChatParams;
  messages: ChatMessage[];
  compare: { enabled: boolean; modelId: string; messages: ChatMessage[] };
  /* usage recorded by this session (seed history is computed) */
  usageEvents: UsageEvent[];
  /* shell */
  notifications: Notification[];
  theme: Theme;
  navCollapsed: boolean;
  toasts: Toast[];

  /* actions */
  addCredit: (cents: number, paymentType?: string) => void;
  redeemFreeCredit: () => void;
  createServiceToken: (
    name: string,
    expiresAt: string | null,
  ) => {
    token: ServiceToken;
    secret: string;
  };
  deleteServiceToken: (id: string) => void;
  addCard: (card: Omit<PaymentCard, "id" | "isDefault">) => void;
  setDefaultCard: (id: string) => void;
  removeCard: (id: string) => void;
  updateBillingDetails: (details: BillingDetails) => void;
  setAutoRecharge: (settings: Partial<NscaleState["autoRecharge"]>) => void;
  requestCluster: (req: Omit<ClusterRequest, "id" | "createdAt">) => void;

  setModel: (modelId: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setParams: (params: Partial<ChatParams>) => void;
  selectPreset: (id: string) => void;
  savePreset: (name: string) => void;
  deletePreset: (id: string) => void;
  appendMessage: (message: ChatMessage, column?: "main" | "compare") => void;
  recordUsage: (
    modelId: string,
    inputTokens: number,
    outputTokens: number,
  ) => number;
  resetChat: () => void;
  setCompare: (enabled: boolean) => void;
  setCompareModel: (modelId: string) => void;

  pushNotification: (
    n: Omit<Notification, "id" | "createdAt" | "read">,
  ) => void;
  markNotificationsRead: () => void;
  setTheme: (theme: Theme) => void;
  setNavCollapsed: (collapsed: boolean) => void;
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  resetDemo: () => void;
}

const initialState = () => ({
  creditCents: 2340,
  transactions: SEED_TRANSACTIONS,
  serviceTokens: SEED_TOKENS,
  cards: SEED_CARDS,
  billingDetails: SEED_BILLING,
  autoRecharge: { enabled: false, thresholdCents: 1000, topUpCents: 5000 },
  freeCreditRedeemed: false,
  onboarding: { credit: false, token: false, endpoint: false },
  clusterRequests: [] as ClusterRequest[],
  presets: SEED_PRESETS,
  activePresetId: SEED_PRESETS[0].id,
  modelId: DEFAULT_MODEL_ID,
  systemPrompt: "",
  params: DEFAULT_PARAMS,
  messages: [] as ChatMessage[],
  compare: {
    enabled: false,
    modelId: "Qwen/Qwen3-32B",
    messages: [] as ChatMessage[],
  },
  usageEvents: [] as UsageEvent[],
  notifications: SEED_NOTIFICATIONS,
  theme: "light" as Theme,
  navCollapsed: false,
  toasts: [] as Toast[],
});

const randomSecret = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "nsk_live_";
  for (let i = 0; i < 40; i++)
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
};

export const useNscaleStore = create<NscaleState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      addCredit: (cents, paymentType) => {
        const card = get().cards.find((c) => c.isDefault) ?? get().cards[0];
        const type =
          paymentType ??
          (card ? `${card.brand} •••• ${card.last4}` : "Card payment");
        const txn: Transaction = {
          id: uid("txn"),
          date: new Date().toISOString(),
          amountCents: cents,
          paymentType: type,
          receipt: true,
        };
        set((s) => ({
          creditCents: s.creditCents + cents,
          transactions: [txn, ...s.transactions],
          onboarding: { ...s.onboarding, credit: true },
        }));
        get().pushNotification({
          title: "Credit added",
          body: `${(cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })} was added to your balance from ${type}.`,
        });
      },

      redeemFreeCredit: () => {
        if (get().freeCreditRedeemed) return;
        set({ freeCreditRedeemed: true });
        get().addCredit(500, "Promotional credit");
      },

      createServiceToken: (name, expiresAt) => {
        const secret = randomSecret();
        const token: ServiceToken = {
          id: uid("tok"),
          name,
          createdBy: USER.email,
          createdAt: new Date().toISOString(),
          expiresAt,
          prefix: secret.slice(0, 13),
        };
        set((s) => ({
          serviceTokens: [token, ...s.serviceTokens],
          onboarding: { ...s.onboarding, token: true },
        }));
        get().pushNotification({
          title: "Service token created",
          body: `${name} was created by ${USER.email}.`,
        });
        return { token, secret };
      },

      deleteServiceToken: (id) =>
        set((s) => ({
          serviceTokens: s.serviceTokens.filter((t) => t.id !== id),
        })),

      addCard: (card) =>
        set((s) => ({
          cards: [
            ...s.cards,
            { ...card, id: uid("card"), isDefault: s.cards.length === 0 },
          ],
        })),

      setDefaultCard: (id) =>
        set((s) => ({
          cards: s.cards.map((c) => ({ ...c, isDefault: c.id === id })),
        })),

      removeCard: (id) =>
        set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),

      updateBillingDetails: (details) => set({ billingDetails: details }),

      setAutoRecharge: (settings) =>
        set((s) => ({ autoRecharge: { ...s.autoRecharge, ...settings } })),

      requestCluster: (req) => {
        set((s) => ({
          clusterRequests: [
            { ...req, id: uid("req"), createdAt: new Date().toISOString() },
            ...s.clusterRequests,
          ],
        }));
        get().pushNotification({
          title: "Cluster request received",
          body: `${req.gpuCount}× ${req.gpuType} (${req.orchestration}) in ${req.region}. Sales will reach out within one business day.`,
        });
      },

      setModel: (modelId) => set({ modelId }),
      setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
      setParams: (params) =>
        set((s) => ({ params: { ...s.params, ...params } })),

      selectPreset: (id) => {
        const preset = get().presets.find((p) => p.id === id);
        if (!preset) return;
        set({
          activePresetId: id,
          modelId: preset.modelId,
          systemPrompt: preset.systemPrompt,
          params: preset.params,
        });
      },

      savePreset: (name) => {
        const s = get();
        const preset: Preset = {
          id: uid("preset"),
          name,
          modelId: s.modelId,
          systemPrompt: s.systemPrompt,
          params: s.params,
        };
        set({ presets: [...s.presets, preset], activePresetId: preset.id });
        get().toast({ title: "Preset saved", description: name });
      },

      deletePreset: (id) =>
        set((s) => {
          const presets = s.presets.filter((p) => p.id !== id);
          const fallback = presets[0];
          return {
            presets,
            activePresetId:
              s.activePresetId === id ? fallback.id : s.activePresetId,
          };
        }),

      appendMessage: (message, column = "main") =>
        set((s) =>
          column === "compare"
            ? {
                compare: {
                  ...s.compare,
                  messages: [...s.compare.messages, message],
                },
              }
            : { messages: [...s.messages, message] },
        ),

      recordUsage: (modelId, inputTokens, outputTokens) => {
        const model = modelById(modelId);
        const costUsd = model ? costFor(model, inputTokens, outputTokens) : 0;
        const day = new Date().toISOString().slice(0, 10);
        set((s) => ({
          usageEvents: [
            ...s.usageEvents,
            {
              id: uid("use"),
              day,
              modelId,
              inputTokens,
              outputTokens,
              costUsd,
            },
          ],
          creditCents: Math.max(0, s.creditCents - costUsd * 100),
          onboarding: { ...s.onboarding, endpoint: true },
        }));
        return costUsd;
      },

      resetChat: () =>
        set((s) => ({
          messages: [],
          compare: { ...s.compare, messages: [] },
        })),

      setCompare: (enabled) =>
        set((s) => ({ compare: { ...s.compare, enabled } })),
      setCompareModel: (modelId) =>
        set((s) => ({ compare: { ...s.compare, modelId } })),

      pushNotification: (n) =>
        set((s) => ({
          notifications: [
            {
              ...n,
              id: uid("ntf"),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...s.notifications,
          ],
        })),

      markNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      setTheme: (theme) => set({ theme }),
      setNavCollapsed: (navCollapsed) => set({ navCollapsed }),

      toast: (t) => {
        const id = uid("toast");
        set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
        setTimeout(() => get().dismissToast(id), 4500);
      },
      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      resetDemo: () => {
        set({ ...initialState() });
        get().toast({ title: "Demo data reset" });
      },
    }),
    {
      name: STORAGE_KEY,
      skipHydration: true,
      partialize: (s) => {
        const rest = { ...s } as Partial<NscaleState>;
        delete rest.toasts;
        return rest;
      },
    },
  ),
);
