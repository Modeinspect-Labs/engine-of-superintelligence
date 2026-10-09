import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const headingVariants = cva("font-semibold text-primary-content", {
  variants: {
    size: {
      display: "text-4xl leading-10",
      xl: "text-2xl leading-8",
      lg: "text-xl leading-7",
      md: "text-lg leading-7",
      sm: "text-base leading-6",
      xs: "text-sm leading-5",
    },
  },
  defaultVariants: { size: "md" },
});

export interface HeadingProps
  extends React.ComponentProps<"h2">, VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4";
}

/** Heading — semibold system sans at the console's steps. */
export function Heading({
  as: Tag = "h2",
  size = "md",
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag
      data-component="Heading"
      className={cn(headingVariants({ size }), className)}
      {...props}
    />
  );
}

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-sm text-primary-content",
      secondary: "text-sm text-secondary-content",
      caption: "text-xs text-secondary-content",
      tertiary: "text-xs text-tertiary-content",
      mono: "font-mono text-xs text-primary-content",
      eyebrow: "font-mono text-xs tracking-wide text-secondary-content",
    },
  },
  defaultVariants: { variant: "body" },
});

export interface TextProps
  extends React.ComponentProps<"p">, VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

/** Text — body, secondary, caption, mono and eyebrow styles. */
export function Text({
  as: Tag = "p",
  variant = "body",
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      data-component="Text"
      data-variant={variant}
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}
