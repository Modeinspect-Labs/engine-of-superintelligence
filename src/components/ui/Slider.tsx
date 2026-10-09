"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/cn";

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  "aria-label": string;
  className?: string;
}

/**
 * Slider — the Workbench parameter slider: hairline track with end dots
 * and a square ink thumb carrying two grip lines.
 */
export function Slider({
  value,
  min,
  max,
  step,
  onValueChange,
  className,
  "aria-label": ariaLabel,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      data-component="Slider"
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([v]) => onValueChange(v)}
      className={cn(
        "relative flex h-5 w-full touch-none items-center select-none",
        className,
      )}
    >
      <SliderPrimitive.Track className="bg-primary-border relative h-0.5 grow rounded-full">
        <SliderPrimitive.Range className="bg-primary-content absolute h-full rounded-full" />
      </SliderPrimitive.Track>
      <span className="bg-primary-content pointer-events-none absolute inset-y-0 left-0 my-auto size-1.5 rounded-full" />
      <span className="bg-primary-content pointer-events-none absolute inset-y-0 right-0 my-auto size-1.5 rounded-full" />
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        className="bg-primary-background-inverse focus-visible:outline-primary-core flex size-3.5 cursor-grab items-center justify-center rounded-[4px] outline-none focus-visible:outline-2 active:cursor-grabbing"
      >
        <span className="flex flex-col gap-0.5">
          <span className="bg-primary-content-inverse block h-px w-1.5" />
          <span className="bg-primary-content-inverse block h-px w-1.5" />
        </span>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
}
