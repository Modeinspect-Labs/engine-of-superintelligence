"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { formatAxisUsd, formatUsd } from "@/lib/format";

/**
 * Reads token values from the document so SVG marks can be written as
 * literal attributes (a lifted <svg> keeps its colours without the
 * cascade). Re-resolves when the theme class on <html> changes; the
 * server snapshot is the light-theme fallback.
 */
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;
const cache = new WeakMap<
  object,
  { theme: string; values: Record<string, string> }
>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1 && typeof MutationObserver !== "undefined") {
    observer = new MutationObserver(() => listeners.forEach((l) => l()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

function snapshot<K extends string>(
  tokens: Record<K, string>,
  fallback: Record<K, string>,
): Record<K, string> {
  const theme = document.documentElement.className;
  const hit = cache.get(tokens);
  if (hit && hit.theme === theme) return hit.values as Record<K, string>;
  const style = getComputedStyle(document.documentElement);
  const next = { ...fallback };
  for (const key of Object.keys(tokens) as K[]) {
    const v = style.getPropertyValue(tokens[key]).trim();
    if (v) next[key] = v;
  }
  cache.set(tokens, { theme, values: next });
  return next;
}

export function useTokenValues<K extends string>(
  tokens: Record<K, string>,
  fallback: Record<K, string>,
): Record<K, string> {
  return useSyncExternalStore(
    subscribe,
    () => snapshot(tokens, fallback),
    () => fallback,
  );
}

const CHART_TOKENS = {
  mark: "--ns-chart-serverless",
  track: "--ns-chart-track",
  grid: "--ns-chart-grid",
  text: "--ns-secondary-content",
} as const;
const CHART_FALLBACK = {
  mark: "#751a8c",
  track: "#e4e4e7",
  grid: "#f4f4f5",
  text: "#71717a",
} as const;

export interface BarDatum {
  label: string;
  value: number;
}

export interface BarChartProps extends React.ComponentProps<"div"> {
  data: BarDatum[];
  height?: number;
  /** Shown centred when every value is zero. */
  emptyLabel?: string;
  /** Hide every nth label when there are many bars. */
  labelEvery?: number;
}

/** BarChart — purple bars on a light grid with a $ axis, the usage chart. */
export function BarChart({
  data,
  height = 300,
  emptyLabel = "No data yet",
  labelEvery = 1,
  className,
  ...props
}: BarChartProps) {
  const c = useTokenValues(CHART_TOKENS, CHART_FALLBACK);
  const width = 720;
  const left = 56;
  const bottom = 28;
  const top = 12;
  const max = Math.max(...data.map((d) => d.value), 0);
  const niceMax = max === 0 ? 0.01 : niceCeil(max);
  const ticks = [niceMax, niceMax * 0.6, niceMax * 0.2];
  const plotW = width - left - 8;
  const plotH = height - top - bottom;
  const slot = plotW / data.length;
  const barW = Math.max(6, Math.min(40, slot * 0.5));
  const y = (v: number) => top + plotH - (v / niceMax) * plotH;
  const empty = max === 0;

  return (
    <div
      data-component="BarChart"
      data-empty={empty || undefined}
      className={cn("relative w-full", className)}
      {...props}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Spend by period"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={left}
              x2={width - 8}
              y1={y(t)}
              y2={y(t)}
              stroke={c.grid}
              strokeWidth="1"
            />
            <text
              x={left - 10}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill={c.text}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {formatAxisUsd(t)}
            </text>
          </g>
        ))}
        <line
          x1={left}
          x2={width - 8}
          y1={y(0)}
          y2={y(0)}
          stroke={c.track}
          strokeWidth="1"
        />
        {data.map((d, i) => {
          const x = left + slot * i + (slot - barW) / 2;
          const h = Math.max(0, y(0) - y(d.value));
          return (
            <g key={d.label + i}>
              {d.value > 0 && (
                <rect
                  x={x}
                  y={y(d.value)}
                  width={barW}
                  height={h}
                  rx="2"
                  fill={c.mark}
                >
                  <title>{`${d.label}: ${formatUsd(d.value)}`}</title>
                </rect>
              )}
              {i % labelEvery === 0 && (
                <text
                  x={x + barW / 2}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill={c.text}
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {empty && (
        <p className="text-secondary-content absolute inset-0 m-auto flex h-fit w-fit items-center justify-center text-xs">
          {emptyLabel}
        </p>
      )}
    </div>
  );
}

function niceCeil(v: number) {
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const n = v / base;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return nice * base;
}

export interface DonutChartProps extends React.ComponentProps<"div"> {
  value: number;
  /** 0 → empty grey ring. */
  total: number;
  size?: number;
}

/** DonutChart — single-series ring: purple arc on a grey track. */
export function DonutChart({
  value,
  total,
  size = 118,
  className,
  ...props
}: DonutChartProps) {
  const c = useTokenValues(CHART_TOKENS, CHART_FALLBACK);
  const r = 48;
  const circ = 2 * Math.PI * r;
  const frac = total > 0 ? Math.min(1, value / total) : 0;
  return (
    <div
      data-component="DonutChart"
      className={cn("inline-flex shrink-0", className)}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        role="img"
        aria-label="Share of spend"
      >
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={c.track}
          strokeWidth="8"
        />
        {frac > 0 && (
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={c.mark}
            strokeWidth="8"
            strokeLinecap="butt"
            strokeDasharray={`${circ * frac} ${circ * (1 - frac)}`}
            strokeDashoffset={circ * 0.25}
          />
        )}
      </svg>
    </div>
  );
}

export interface LegendRowProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: "serverless" | "neutral";
}

/** LegendRow — dot, label, dotted leader, value. */
export function LegendRow({
  label,
  value,
  tone = "serverless",
  className,
  ...props
}: LegendRowProps) {
  return (
    <div
      data-component="LegendRow"
      className={cn("flex items-center gap-2 text-xs", className)}
      {...props}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          tone === "serverless" ? "bg-chart-serverless" : "bg-tertiary-content",
        )}
      />
      <span className="text-primary-content shrink-0">{label}</span>
      <span className="bg-secondary-border mx-1 h-px flex-1" />
      <span className="text-primary-content shrink-0 font-medium">{value}</span>
    </div>
  );
}
