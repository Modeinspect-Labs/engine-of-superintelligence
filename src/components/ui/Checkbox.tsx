"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/cn";
import { CheckIcon } from "../icons";

export interface CheckboxProps extends React.ComponentProps<
  typeof CheckboxPrimitive.Root
> {
  label?: React.ReactNode;
}

/** Checkbox — 16px square; ink fill when checked. */
export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const box = (
    <CheckboxPrimitive.Root
      data-component="Checkbox"
      id={id}
      className={cn(
        "border-primary-border bg-primary-background focus-visible:outline-primary-core data-[state=checked]:border-primary-background-inverse data-[state=checked]:bg-primary-background-inverse data-[state=checked]:text-primary-content-inverse inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border outline-none focus-visible:outline-2",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <CheckIcon size={12} strokeWidth={2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!label) return box;
  return (
    <label
      htmlFor={id}
      className="text-primary-content inline-flex cursor-pointer items-center gap-2 text-sm"
    >
      {box}
      {label}
    </label>
  );
}
