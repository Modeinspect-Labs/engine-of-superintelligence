"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon, CopyIcon } from "../icons";

export interface CopyFieldProps extends React.ComponentProps<"div"> {
  value: string;
  /** Hides the value behind dots (revealed secrets). */
  isSecret?: boolean;
  size?: "sm" | "md";
}

/** CopyField — mono value in a soft chip with a copy button. */
export function CopyField({
  value,
  isSecret = false,
  size = "sm",
  className,
  ...props
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable: still show feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div
      data-component="CopyField"
      data-copied={copied || undefined}
      className={cn(
        "border-primary-border bg-secondary-background text-primary-content inline-flex max-w-full items-center gap-2 rounded-md border",
        size === "sm"
          ? "h-7 px-2 font-mono text-xs"
          : "h-9 px-3 font-mono text-sm",
        className,
      )}
      {...props}
    >
      <span className="truncate">
        {isSecret ? value.replace(/./g, "•") : value}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy"}
        data-action="copy"
        className="text-secondary-content hover:text-primary-content inline-flex shrink-0 rounded"
      >
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
    </div>
  );
}
