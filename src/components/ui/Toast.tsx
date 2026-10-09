"use client";

import { cn } from "@/lib/cn";
import { CheckIcon, CloseIcon, WarningIcon } from "../icons";

export interface ToastProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  appearance?: "default" | "success" | "error";
  onDismiss?: () => void;
}

/** Toast — ink notice that slides in bottom-right. */
export function Toast({
  title,
  description,
  appearance = "default",
  onDismiss,
}: ToastProps) {
  return (
    <div
      data-component="Toast"
      data-appearance={appearance}
      role="status"
      className={cn(
        "animate-toast-in border-banner-border bg-banner-background-raised text-banner-content flex w-80 items-start gap-3 rounded-lg border p-3 shadow-xl",
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
          appearance === "error" ? "bg-error-content" : "bg-success-content",
        )}
      >
        {appearance === "error" ? (
          <WarningIcon size={12} className="text-primary-content-inverse" />
        ) : (
          <CheckIcon
            size={12}
            strokeWidth={3}
            className="text-banner-content"
          />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && (
          <p className="text-banner-content-muted text-xs">{description}</p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="text-banner-content-muted hover:text-banner-content inline-flex shrink-0"
        >
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  );
}

/** ToastStack — fixed bottom-right column of toasts. */
export function ToastStack({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-component="ToastStack"
      className="fixed right-6 bottom-6 z-[60] flex flex-col gap-2"
    >
      {children}
    </div>
  );
}
