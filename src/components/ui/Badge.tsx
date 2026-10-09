import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-tertiary-background text-primary-content",
        outline:
          "border border-primary-border bg-primary-background text-primary-content",
        /** The Serverless pill: purple fill, mono label. */
        serverless:
          "bg-resources-serverless font-mono text-primary-content-inverse",
        info: "bg-info-background text-info-content",
        success: "bg-success-background text-success-content",
        warning: "bg-warning-background text-warning-content",
        error: "bg-error-background text-error-content",
        purple:
          "bg-extensions-background-purple text-extensions-content-purple",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

/** Badge — small status or category label. */
export function Badge({
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      data-component="Badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
