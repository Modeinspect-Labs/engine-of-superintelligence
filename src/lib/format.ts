const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** $1,234.56 from integer cents. */
export const formatCents = (cents: number) => usd.format(cents / 100);

/** $12.34 from dollars; drops to 4 decimals for sub-cent amounts. */
export function formatUsd(amount: number, opts?: { compact?: boolean }) {
  if (amount === 0) return "$0";
  if (Math.abs(amount) < 0.01 && !opts?.compact) {
    return `$${amount.toFixed(4)}`;
  }
  return usd.format(amount);
}

/** Axis labels: $0.002, $0.6, $12 — short, no trailing zeros. */
export function formatAxisUsd(amount: number) {
  if (amount === 0) return "$0";
  const digits = amount >= 10 ? 0 : amount >= 1 ? 1 : amount >= 0.01 ? 2 : 3;
  return `$${parseFloat(amount.toFixed(digits))}`;
}

/** "$0.45 input / $2.2 output" or "$0.05" — the catalogue's price style. */
export function formatPrice(input: number, output?: number) {
  const n = (v: number) => `$${parseFloat(v.toFixed(4))}`;
  return output === undefined
    ? n(input)
    : `${n(input)} input / ${n(output)} output`;
}

const MONTHS = [
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

const pad = (n: number) => String(n).padStart(2, "0");

/** 04 Oct 2026 */
export function formatDate(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** 04 Oct 2026, 15:14 */
export function formatDateTime(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${formatDate(d)}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** "04 - 11 Oct 2026" or "28 Sep - 04 Oct 2026" */
export function formatRange(start: Date, end: Date) {
  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCFullYear() === end.getUTCFullYear();
  if (sameMonth) {
    return `${pad(start.getUTCDate())} - ${pad(end.getUTCDate())} ${MONTHS[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  }
  return `${pad(start.getUTCDate())} ${MONTHS[start.getUTCMonth()]} - ${pad(end.getUTCDate())} ${MONTHS[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
}

/** "Oct 2026" */
export function formatMonth(d: Date) {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "3 days ago", "just now" — relative to a reference time. */
export function relativeTime(iso: string, now: Date = new Date()) {
  const diff = now.getTime() - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.round(d / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
}

/** 1.2K / 3.4M token counts. */
export function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const monthShort = (i: number) => MONTHS[i];
