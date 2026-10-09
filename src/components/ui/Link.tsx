import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { ArrowUpRightIcon } from "../icons";

export interface LinkProps extends React.ComponentProps<typeof NextLink> {
  /** Adds the ↗ glyph and opens in a new tab. */
  isExternal?: boolean;
  /** `inline` underlines like body links; `action` is the bold label style. */
  variant?: "inline" | "action";
}

/** Link — Next link with the console's two link styles. */
export function Link({
  isExternal = false,
  variant = "inline",
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <NextLink
      data-component="Link"
      data-variant={variant}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 outline-none",
        variant === "inline"
          ? "text-primary-content font-semibold underline underline-offset-2"
          : "text-primary-content text-sm font-semibold hover:underline",
        className,
      )}
      {...props}
    >
      {children}
      {isExternal && (
        <ArrowUpRightIcon size={14} className="text-secondary-content" />
      )}
    </NextLink>
  );
}
