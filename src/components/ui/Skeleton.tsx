import { cn } from "@/lib/cn";

/** Skeleton — grey block for loading states. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-component="Skeleton"
      aria-hidden="true"
      className={cn(
        "bg-tertiary-background animate-pulse rounded-lg",
        className,
      )}
      {...props}
    />
  );
}
