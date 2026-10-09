import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const alertVariants = cva(
  "flex items-center justify-between gap-4 rounded-md border-l-4 px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        warning:
          "border-warning-border bg-warning-background text-warning-content",
        info: "border-info-border bg-info-background text-info-content",
        success:
          "border-success-border bg-success-background text-success-content",
        error: "border-error-border bg-error-background text-error-content",
      },
    },
    defaultVariants: { variant: "warning" },
  },
);

export interface AlertProps
  extends
    Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof alertVariants> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

/** Alert — the Workbench's "You need at least $1" strip. */
export function Alert({
  variant = "warning",
  title,
  description,
  action,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      data-component="Alert"
      data-variant={variant}
      role="status"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col">
        <p className="font-semibold">{title}</p>
        {description && <p className="text-primary-content">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
