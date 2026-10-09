import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const cardVariants = cva(
  "animate-card-in flex shrink-0 flex-col overflow-hidden rounded-xl border shadow-xs",
  {
    variants: {
      variant: {
        default:
          "bg-primary-background border-primary-border text-primary-content",
        /** Ink banner (free credit strip). */
        inverse:
          "bg-banner-background-raised border-banner-border text-banner-content",
        /** Deep ink hero (GPU clusters). */
        hero: "bg-banner-background border-banner-border text-banner-content",
      },
      padding: {
        /** The console's section card: 24px top, 32px bottom, 24px sides. */
        section: "gap-6 pt-6 pb-8",
        /** Even 24px. */
        even: "p-6",
        none: "",
      },
    },
    defaultVariants: { variant: "default", padding: "section" },
  },
);

export interface CardProps
  extends React.ComponentProps<"section">, VariantProps<typeof cardVariants> {}

/**
 * Card — the console's section surface. Compose:
 *   <Card><CardHeader title description action/><CardContent/><CardFooter/></Card>
 */
export function Card({
  variant = "default",
  padding = "section",
  className,
  ...props
}: CardProps) {
  return (
    <section
      data-component="Card"
      data-variant={variant}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

export interface CardHeaderProps extends Omit<
  React.ComponentProps<"header">,
  "title"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned slot (a button, a date picker). */
  action?: React.ReactNode;
  /** Leading icon next to the title. */
  icon?: React.ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  icon,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <header
      data-component="CardHeader"
      className={cn("flex items-start justify-between gap-4 px-6", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="flex items-center gap-2 text-lg leading-7 font-semibold text-inherit">
          {icon && <span className="inline-flex">{icon}</span>}
          {title}
        </h2>
        {description && (
          <p className="text-secondary-content text-sm">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      )}
    </header>
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-component="CardContent"
      className={cn("flex flex-col gap-6 bg-inherit px-6", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer
      data-component="CardFooter"
      className={cn("flex items-center justify-center gap-2 px-6", className)}
      {...props}
    />
  );
}

/** Panel — a nested, flatter surface inside a Card (credit balance, onboarding steps). */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-component="Panel"
      className={cn(
        "border-secondary-border bg-secondary-background rounded-lg border p-6",
        className,
      )}
      {...props}
    />
  );
}
