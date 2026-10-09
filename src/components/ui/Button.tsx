"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg border text-sm font-semibold outline-none select-none",
    "transition-[background-color,color,border-color,box-shadow] duration-(--duration-fast)",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Default — white, hairline border, soft shadow. */
        secondary:
          "bg-primary-background border-primary-border text-primary-content shadow-xs hover:bg-secondary-background active:bg-tertiary-background",
        /** The page's main action — ink fill. */
        primary:
          "bg-primary-background-inverse border-primary-border-inverse text-primary-content-inverse hover:bg-secondary-background-inverse active:bg-primary-border-inverse",
        /** Transparent until hovered. */
        ghost:
          "bg-transparent border-transparent text-primary-content hover:bg-hover-overlay active:bg-pressed-overlay",
        /** On dark banners: translucent fill, light border. */
        inverse:
          "bg-primary-opacity border-banner-content text-banner-content hover:bg-hover-border-overlay",
        /** Destructive. */
        danger:
          "bg-error-content border-error-content text-primary-content-inverse hover:brightness-110",
        /** Reads as a link, sized like a button. */
        link: "bg-transparent border-transparent text-primary-content underline-offset-4 hover:underline px-0!",
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-[34px] px-2.5",
        lg: "h-10 px-4",
        icon: "size-[34px] p-0",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends
    Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  /** Leading icon. */
  iconBefore?: React.ReactNode;
  /** Trailing icon (arrows for navigation buttons). */
  iconAfter?: React.ReactNode;
  /** Shows a spinner in place of the label. */
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * Button — the console's button. Variants: `secondary` (default),
 * `primary` (one per view), `ghost`, `inverse` (dark banners), `danger`,
 * `link`. Sizes: `sm` (28px), `md` (34px), `lg` (40px), `icon`.
 */
export function Button({
  className,
  variant = "secondary",
  size = "md",
  isLoading = false,
  iconBefore,
  iconAfter,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      data-component="Button"
      data-variant={variant}
      data-size={size}
      type={type}
      className={cn(
        buttonVariants({ variant, size }),
        isLoading && "text-transparent",
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && (
        <span className="text-primary-content-inverse absolute inset-0 m-auto inline-flex size-4 items-center justify-center">
          <Spinner size="small" className="text-current" />
        </span>
      )}
      {iconBefore && (
        <span className="text-secondary-content inline-flex">{iconBefore}</span>
      )}
      {children}
      {iconAfter && (
        <span className="text-secondary-content inline-flex">{iconAfter}</span>
      )}
    </button>
  );
}

/** ButtonGroup — lays buttons out with an 8px gap. */
export function ButtonGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-component="ButtonGroup"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}
