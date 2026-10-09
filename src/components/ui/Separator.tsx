import { cn } from "@/lib/cn";

/** Separator — hairline divider. */
export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      data-component="Separator"
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-primary-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}
