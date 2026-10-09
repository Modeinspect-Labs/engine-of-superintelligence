"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

export interface SwitchProps extends React.ComponentProps<
  typeof SwitchPrimitive.Root
> {
  label?: string;
}

/** Switch — 36×20 toggle; the thumb moves with `left` (no transforms). */
export function Switch({ className, label, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-component="Switch"
      aria-label={label}
      className={cn(
        "bg-primary-border focus-visible:outline-primary-core data-[state=checked]:bg-primary-background-inverse relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-(--duration-fast) outline-none focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="bg-primary-background absolute top-0.5 left-0.5 block size-3.5 rounded-full shadow-xs transition-[left] duration-(--duration-fast) data-[state=checked]:left-[18px]" />
    </SwitchPrimitive.Root>
  );
}
