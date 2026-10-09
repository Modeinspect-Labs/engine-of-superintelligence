"use client";

import { cn } from "@/lib/cn";

export interface TextfieldProps extends Omit<
  React.ComponentProps<"input">,
  "prefix"
> {
  /** Leading adornment (a search glyph, a "$" prefix). */
  prefix?: React.ReactNode;
  /** Trailing adornment (a lock glyph, a copy button). */
  suffix?: React.ReactNode;
  isInvalid?: boolean;
  /** Mono text for ids and tokens. */
  isMono?: boolean;
}

const base =
  "flex h-9 w-full items-center gap-2 rounded-lg border bg-primary-background px-3 text-sm text-primary-content transition-colors duration-(--duration-fast) has-[input:focus-visible]:border-primary-core has-[input:disabled]:bg-secondary-background has-[input:disabled]:text-tertiary-content";

/** Textfield — 36px input with optional prefix/suffix. */
export function Textfield({
  prefix,
  suffix,
  isInvalid = false,
  isMono = false,
  className,
  ...props
}: TextfieldProps) {
  return (
    <label
      data-component="Textfield"
      data-invalid={isInvalid || undefined}
      className={cn(
        base,
        isInvalid ? "border-error-border" : "border-primary-border",
        className,
      )}
    >
      {prefix && (
        <span className="text-secondary-content inline-flex shrink-0">
          {prefix}
        </span>
      )}
      <input
        className={cn(
          "placeholder:text-tertiary-content min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed",
          isMono && "font-mono text-xs",
        )}
        {...props}
      />
      {suffix && (
        <span className="text-secondary-content inline-flex shrink-0">
          {suffix}
        </span>
      )}
    </label>
  );
}

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  isInvalid?: boolean;
}

/** Textarea — multi-line input, vertically resizable. */
export function Textarea({
  isInvalid = false,
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-component="Textarea"
      data-invalid={isInvalid || undefined}
      className={cn(
        "bg-primary-background text-primary-content placeholder:text-tertiary-content focus-visible:border-primary-core disabled:bg-secondary-background min-h-20 w-full resize-y rounded-lg border px-3 py-2 text-sm transition-colors duration-(--duration-fast) outline-none",
        isInvalid ? "border-error-border" : "border-primary-border",
        className,
      )}
      {...props}
    />
  );
}

export type NumberInputProps = Omit<React.ComponentProps<"input">, "type">;

/** NumberInput — compact mono number box (parameter values). */
export function NumberInput({ className, ...props }: NumberInputProps) {
  return (
    <input
      data-component="NumberInput"
      type="number"
      className={cn(
        "border-primary-border bg-primary-background text-primary-content focus-visible:border-primary-core h-6 w-14 rounded-md border px-1.5 text-center font-mono text-xs outline-none",
        className,
      )}
      {...props}
    />
  );
}
