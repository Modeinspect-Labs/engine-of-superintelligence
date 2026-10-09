import { cn } from "@/lib/cn";

export interface PageHeaderProps extends Omit<
  React.ComponentProps<"header">,
  "title"
> {
  title: React.ReactNode;
  /** 56px icon tile on the left (a glyph, or an Avatar for the org). */
  icon?: React.ReactNode;
  /** Right-aligned actions. */
  action?: React.ReactNode;
}

/** PageHeader — soft icon tile + 36px display title. */
export function PageHeader({
  title,
  icon,
  action,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-component="PageHeader"
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <span className="bg-resources-default-secondary text-primary-content inline-flex size-14 shrink-0 items-center justify-center rounded-lg">
            {icon}
          </span>
        )}
        <h1 className="text-primary-content text-4xl leading-10 font-semibold">
          {title}
        </h1>
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      )}
    </header>
  );
}

export interface HeroHeaderProps extends Omit<
  React.ComponentProps<"header">,
  "title"
> {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  /** Big glyph in the tinted square. */
  glyph: React.ReactNode;
  tone?: "serverless" | "clusters";
  action?: React.ReactNode;
}

/**
 * HeroHeader — the product banner: purple for Serverless, ink for GPU
 * clusters. Mono eyebrow, 30px white title, glyph in a lighter square.
 */
export function HeroHeader({
  eyebrow,
  title,
  glyph,
  tone = "serverless",
  action,
  className,
  ...props
}: HeroHeaderProps) {
  return (
    <header
      data-component="HeroHeader"
      data-tone={tone}
      className={cn(
        "text-banner-content flex h-[120px] items-center justify-between gap-4 overflow-hidden rounded-xl pr-6",
        tone === "serverless"
          ? "bg-resources-serverless"
          : "bg-banner-background",
        className,
      )}
      {...props}
    >
      <div className="flex h-full items-center gap-8">
        <span
          className={cn(
            "inline-flex h-full w-[136px] shrink-0 items-center justify-center",
            tone === "serverless"
              ? "bg-hover-border-overlay"
              : "bg-banner-background-raised",
          )}
        >
          {glyph}
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-banner-content-muted font-mono text-xs">
            {eyebrow}
          </p>
          <h1 className="text-banner-content text-[30px] leading-9 font-semibold">
            {title}
          </h1>
        </div>
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      )}
    </header>
  );
}

/** CompactHeader — the Workbench's slim bar: small tile, eyebrow, title. */
export function CompactHeader({
  eyebrow,
  title,
  icon,
  action,
  className,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header
      data-component="CompactHeader"
      className={cn(
        "border-primary-border bg-secondary-background flex items-center justify-between gap-4 border-b px-6 py-2",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <span className="bg-resources-default-secondary text-primary-content inline-flex size-9 items-center justify-center rounded-md">
          {icon}
        </span>
        <div className="flex flex-col">
          <p className="text-secondary-content font-mono text-[11px] leading-4">
            {eyebrow}
          </p>
          <h1 className="text-primary-content text-base leading-5 font-semibold">
            {title}
          </h1>
        </div>
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-1">{action}</div>
      )}
    </header>
  );
}

/** Page — content frame: 24px padding, 16px vertical rhythm, max width. */
export function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-component="Page"
      className={cn(
        "bg-secondary-background flex w-full flex-col gap-4 p-6",
        className,
      )}
      {...props}
    />
  );
}
