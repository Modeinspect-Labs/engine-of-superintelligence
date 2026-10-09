import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  xs: "size-5 rounded text-[10px]",
  sm: "size-7 rounded-md text-xs",
  md: "size-9 rounded-md text-sm",
  lg: "size-14 rounded-lg text-2xl",
};

export interface AvatarProps extends React.ComponentProps<"span"> {
  /** One or two letters. */
  initials: string;
  size?: AvatarSize;
  /** `org` is the ink square; `user` the soft grey square. */
  variant?: "org" | "user";
  name?: string;
}

/** Avatar — square monogram (the console uses letters, not photos). */
export function Avatar({
  initials,
  size = "sm",
  variant = "org",
  name,
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      data-component="Avatar"
      data-size={size}
      data-variant={variant}
      role="img"
      aria-label={name ?? initials}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold select-none",
        variant === "org"
          ? "bg-primary-background-inverse text-primary-content-inverse"
          : "bg-tertiary-background text-primary-content",
        sizes[size],
        className,
      )}
      {...props}
    >
      {initials}
    </span>
  );
}
