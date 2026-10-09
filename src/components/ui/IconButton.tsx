"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Tooltip } from "./Tooltip";

const iconButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-md border outline-none select-none",
    "transition-[background-color,color,border-color] duration-(--duration-fast)",
    "disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        ghost:
          "border-transparent bg-transparent text-primary-content hover:bg-hover-overlay active:bg-pressed-overlay",
        secondary:
          "border-primary-border bg-primary-background text-primary-content shadow-xs hover:bg-secondary-background",
        /** On the dark code surface. */
        code: "border-primary-border-inverse bg-banner-background-raised text-banner-content hover:bg-secondary-background-inverse",
        inverse:
          "border-transparent bg-transparent text-banner-content hover:bg-hover-border-overlay",
      },
      size: {
        xs: "size-[22px]",
        sm: "size-7",
        md: "size-[34px]",
      },
    },
    defaultVariants: { variant: "ghost", size: "sm" },
  },
);

export interface IconButtonProps
  extends
    Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof iconButtonVariants> {
  /** Accessible name; also the tooltip. */
  label: string;
  icon: React.ReactNode;
  isTooltipDisabled?: boolean;
}

/** IconButton — square single-glyph button with a tooltip. */
export function IconButton({
  label,
  icon,
  variant = "ghost",
  size = "sm",
  isTooltipDisabled = false,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  const button = (
    <button
      data-component="IconButton"
      data-variant={variant}
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {icon}
    </button>
  );
  if (isTooltipDisabled) return button;
  return <Tooltip content={label}>{button}</Tooltip>;
}
