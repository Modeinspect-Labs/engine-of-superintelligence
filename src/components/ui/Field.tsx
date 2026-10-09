import { cn } from "@/lib/cn";

export interface FieldProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
  /** Small helper under the control. */
  helper?: React.ReactNode;
  error?: React.ReactNode;
  /** Trailing element next to the label (an info button). */
  labelAddon?: React.ReactNode;
  htmlFor?: string;
}

/** Field — label + control + helper/error, the console's form row. */
export function Field({
  label,
  helper,
  error,
  labelAddon,
  htmlFor,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div
      data-component="Field"
      data-invalid={error ? "true" : undefined}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <label
        htmlFor={htmlFor}
        className="text-primary-content flex items-center gap-1.5 text-sm font-semibold"
      >
        {label}
        {labelAddon}
      </label>
      {children}
      {error ? (
        <p className="text-error-content text-xs">{error}</p>
      ) : helper ? (
        <p className="text-secondary-content text-xs">{helper}</p>
      ) : null}
    </div>
  );
}

/** Definition — read-only label/value pair (billing details, model details). */
export function Definition({
  label,
  value,
  className,
  isMono = false,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  isMono?: boolean;
}) {
  return (
    <div
      data-component="Definition"
      className={cn("flex flex-col gap-1", className)}
    >
      <dt className="text-primary-content text-xs font-semibold">{label}</dt>
      <dd
        className={cn(
          "text-secondary-content text-sm",
          isMono && "text-primary-content font-mono text-xs",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
