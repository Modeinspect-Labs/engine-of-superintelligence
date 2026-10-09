import { TODAY, modelById, seedUsage } from "./data";
import type { UsageEvent } from "./types";

let seedCache: UsageEvent[] | null = null;
export function seedUsageEvents(): UsageEvent[] {
  if (!seedCache) seedCache = seedUsage();
  return seedCache;
}

/** Seed history plus whatever this session recorded. */
export function allUsage(session: UsageEvent[]): UsageEvent[] {
  return [...seedUsageEvents(), ...session];
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

/** Sunday-start week containing `d`. */
export function weekStart(d: Date) {
  const out = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  out.setUTCDate(out.getUTCDate() - out.getUTCDay());
  return out;
}

export function monthStart(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export interface Bucket {
  label: string;
  /** ISO day of the bucket start. */
  key: string;
  costUsd: number;
}

/** Seven daily buckets from `start` (Sun…Sat). */
export function weeklyBuckets(events: UsageEvent[], start: Date): Bucket[] {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totals = new Map<string, number>();
  for (const e of events)
    totals.set(e.day, (totals.get(e.day) ?? 0) + e.costUsd);
  return names.map((label, i) => {
    const key = dayKey(addDays(start, i));
    return { label, key, costUsd: totals.get(key) ?? 0 };
  });
}

/** Daily buckets for the calendar month containing `start`. */
export function monthlyBuckets(events: UsageEvent[], start: Date): Bucket[] {
  const first = monthStart(start);
  const next = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 1),
  );
  const days = Math.round((next.getTime() - first.getTime()) / 86_400_000);
  const totals = new Map<string, number>();
  for (const e of events)
    totals.set(e.day, (totals.get(e.day) ?? 0) + e.costUsd);
  return Array.from({ length: days }, (_, i) => {
    const d = addDays(first, i);
    return {
      label: String(d.getUTCDate()),
      key: dayKey(d),
      costUsd: totals.get(dayKey(d)) ?? 0,
    };
  });
}

/** Twelve monthly buckets ending in the month of `end`. */
export function yearlyBuckets(
  events: UsageEvent[],
  end: Date = TODAY,
): Bucket[] {
  const totals = new Map<string, number>();
  for (const e of events) {
    const k = e.day.slice(0, 7);
    totals.set(k, (totals.get(k) ?? 0) + e.costUsd);
  }
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const out: Bucket[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - i, 1),
    );
    const k = d.toISOString().slice(0, 7);
    out.push({
      label: names[d.getUTCMonth()],
      key: k,
      costUsd: totals.get(k) ?? 0,
    });
  }
  return out;
}

export function usageSince(events: UsageEvent[], since: Date) {
  const key = dayKey(since);
  return events.filter((e) => e.day >= key);
}

export function totalCost(events: UsageEvent[]) {
  return events.reduce((sum, e) => sum + e.costUsd, 0);
}

export interface ResourceRow {
  modelId: string;
  name: string;
  developer: string;
  type: string;
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
}

/** Spend per model, highest first. */
export function usageByModel(events: UsageEvent[]): ResourceRow[] {
  const map = new Map<string, ResourceRow>();
  for (const e of events) {
    const model = modelById(e.modelId);
    if (!model) continue;
    const row = map.get(e.modelId) ?? {
      modelId: e.modelId,
      name: model.name,
      developer: model.developer,
      type: model.type,
      costUsd: 0,
      inputTokens: 0,
      outputTokens: 0,
    };
    row.costUsd += e.costUsd;
    row.inputTokens += e.inputTokens;
    row.outputTokens += e.outputTokens;
    map.set(e.modelId, row);
  }
  return [...map.values()].sort((a, b) => b.costUsd - a.costUsd);
}
