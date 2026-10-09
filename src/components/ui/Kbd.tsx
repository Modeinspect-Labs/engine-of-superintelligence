import { cn } from "@/lib/cn";

export interface KbdProps extends React.ComponentProps<"kbd"> {
  /** `plain` is the bare ⌘K in the sidebar; `boxed` the Esc chip in dialogs. */
  variant?: "plain" | "boxed";
}

/** Kbd — keyboard hint. */
export function Kbd({ variant = "plain", className, ...props }: KbdProps) {
  return (
    <kbd
      data-component="Kbd"
      data-variant={variant}
      className={cn(
        "text-secondary-content inline-flex items-center font-sans text-[11px]",
        variant === "boxed" &&
          "border-primary-border bg-secondary-background h-5 rounded border px-1.5",
        className,
      )}
      {...props}
    />
  );
}
