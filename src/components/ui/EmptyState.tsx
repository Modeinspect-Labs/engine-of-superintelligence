import { cn } from "@/lib/cn";
import { TableIcon } from "../icons";

export interface EmptyStateProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/** EmptyState — the console's "Nothing to show": grey disc, bold line. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-component="EmptyState"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10 text-center",
        className,
      )}
      {...props}
    >
      <span className="bg-tertiary-background text-secondary-content inline-flex size-10 items-center justify-center rounded-full">
        {icon ?? <TableIcon size={18} />}
      </span>
      <p className="text-primary-content text-sm font-semibold">{title}</p>
      {description && (
        <p className="text-secondary-content max-w-sm text-sm">{description}</p>
      )}
      {action}
    </div>
  );
}
