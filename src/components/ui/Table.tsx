import { cn } from "@/lib/cn";

/**
 * Table — 12px secondary headers on a hairline, 56px rows separated by
 * the softer secondary hairline. Compose with THead/TBody/TR/TH/TD.
 */
export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-component="Table" className="w-full overflow-x-auto bg-inherit">
      <table
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function THead({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("bg-inherit", className)} {...props} />;
}

export function TBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("bg-inherit", className)} {...props} />;
}

export interface TRProps extends React.ComponentProps<"tr"> {
  isClickable?: boolean;
}

export function TR({ isClickable = false, className, ...props }: TRProps) {
  return (
    <tr
      data-component="TR"
      className={cn(
        "border-secondary-border border-b bg-inherit last:border-b-0",
        isClickable &&
          "hover:bg-table-hover-primary cursor-pointer transition-colors duration-(--duration-fast)",
        className,
      )}
      {...props}
    />
  );
}

export function TH({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-primary-border text-secondary-content h-10 border-b px-2 text-xs font-normal whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

export function TD({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "text-primary-content h-14 px-2 py-3 align-middle",
        className,
      )}
      {...props}
    />
  );
}
