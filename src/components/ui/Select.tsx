"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/cn";
import { CheckIcon, SelectorIcon } from "../icons";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  "aria-label"?: string;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
  /** Dark trigger for the code-block language picker. */
  variant?: "default" | "code";
}

/** Select — single-choice picker with the console's chevron trigger. */
export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  size = "md",
  variant = "default",
  className,
  disabled,
  "aria-label": ariaLabel,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        data-component="Select"
        data-variant={variant}
        aria-label={ariaLabel}
        className={cn(
          "focus-visible:border-primary-core inline-flex items-center justify-between gap-2 rounded-lg border text-sm transition-colors duration-(--duration-fast) outline-none disabled:opacity-50",
          size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3",
          variant === "code"
            ? "border-primary-border-inverse bg-banner-background-raised text-banner-content hover:bg-secondary-background-inverse font-semibold"
            : "border-primary-border bg-primary-background text-primary-content hover:bg-secondary-background",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <SelectorIcon
            size={14}
            className={
              variant === "code"
                ? "text-banner-content"
                : "text-secondary-content"
            }
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="animate-menu-in border-primary-border bg-primary-background text-primary-content z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border p-1 shadow-lg"
        >
          <SelectPrimitive.Viewport>
            {options.map((o) => (
              <SelectPrimitive.Item
                key={o.value}
                value={o.value}
                className="data-[highlighted]:bg-hover-overlay relative flex h-9 cursor-pointer items-center justify-between gap-2 rounded-md px-2 text-sm outline-none select-none"
              >
                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <CheckIcon size={14} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
