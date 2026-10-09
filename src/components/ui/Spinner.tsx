import { cn } from "@/lib/cn";

export type SpinnerSize = "small" | "medium" | "large";

const sizes: Record<SpinnerSize, string> = {
  small: "size-3.5 border-[1.5px]",
  medium: "size-5 border-2",
  large: "size-8 border-2",
};

/** Spinner — a thin arc in the current text colour. */
export function Spinner({
  size = "medium",
  className,
}: {
  size?: SpinnerSize;
  className?: string;
}) {
  return (
    <span
      data-component="Spinner"
      data-size={size}
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-r-transparent",
        sizes[size],
        className,
      )}
    />
  );
}
