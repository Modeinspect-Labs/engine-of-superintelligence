"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

/**
 * Tabs — the console's page tabs: 14px labels, the selected tab sits in a
 * soft grey pill with a 2px ink underline on the list's hairline.
 * Compose: Tabs > TabList > Tab, TabPanel.
 */
export const Tabs = TabsPrimitive.Root;

export function TabList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-component="TabList"
      className={cn(
        "border-primary-border flex items-end gap-1 border-b",
        className,
      )}
      {...props}
    />
  );
}

export function Tab({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-component="Tab"
      className={cn(
        "text-secondary-content -mb-px inline-flex h-9 cursor-pointer items-center gap-2 rounded-t-md border-b-2 border-transparent px-3.5 text-sm font-medium whitespace-nowrap outline-none",
        "hover:text-primary-content transition-colors duration-(--duration-fast)",
        "data-[state=active]:border-primary-content data-[state=active]:bg-tertiary-background data-[state=active]:text-primary-content",
        className,
      )}
      {...props}
    />
  );
}

export function TabPanel({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-component="TabPanel"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

/** SegmentedControl — pill group (All / Unread / Read, $50 / $75 / $100). */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: React.ReactNode }>;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      data-component="SegmentedControl"
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "border-primary-border bg-secondary-background inline-flex items-center gap-0.5 rounded-lg border p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            data-selected={selected || undefined}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-7 min-w-14 rounded-md px-3 text-sm font-medium transition-colors duration-(--duration-fast)",
              selected
                ? "bg-primary-background text-primary-content shadow-xs"
                : "text-secondary-content hover:text-primary-content",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
