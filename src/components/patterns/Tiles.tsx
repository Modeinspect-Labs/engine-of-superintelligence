import { cn } from "@/lib/cn";
import { Panel } from "../ui/Card";
import { CheckIcon } from "../icons";

export interface OnboardingStepProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  step: number;
  title: React.ReactNode;
  description: React.ReactNode;
  action: React.ReactNode;
  isDone?: boolean;
}

/** OnboardingStep — numbered task tile with a radio-style done marker. */
export function OnboardingStep({
  step,
  title,
  description,
  action,
  isDone = false,
  className,
  ...props
}: OnboardingStepProps) {
  return (
    <Panel
      data-component="OnboardingStep"
      data-done={isDone || undefined}
      className={cn("flex gap-3", className)}
      {...props}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border",
          isDone
            ? "border-success-border bg-success-content text-primary-content-inverse"
            : "border-primary-border bg-primary-background",
        )}
      >
        {isDone && <CheckIcon size={10} strokeWidth={3} />}
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-primary-content text-sm font-semibold">
          {step}. {title}
        </p>
        <p className="text-secondary-content text-sm">{description}</p>
        <div className="mt-2">{action}</div>
      </div>
    </Panel>
  );
}

export interface ServiceTileProps extends React.ComponentProps<"div"> {
  glyph: React.ReactNode;
  name: React.ReactNode;
  headline: React.ReactNode;
  description: React.ReactNode;
  tone?: "kubernetes" | "slurm" | "nodes";
}

const tones = {
  kubernetes: "text-resources-kubernetes",
  slurm: "text-resources-slurm",
  nodes: "text-primary-content",
};

/** ServiceTile — the GPU clusters trio: glyph on a faded tile, name, pitch. */
export function ServiceTile({
  glyph,
  name,
  headline,
  description,
  tone = "nodes",
  className,
  ...props
}: ServiceTileProps) {
  return (
    <div
      data-component="ServiceTile"
      data-tone={tone}
      className={cn("flex flex-col gap-4 px-8 py-4", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "relative inline-flex size-12 items-center justify-center",
            tones[tone],
          )}
        >
          <span className="bg-resources-default-secondary absolute inset-0 rounded-lg" />
          <span className="relative inline-flex">{glyph}</span>
        </span>
        <h3 className="text-primary-content text-2xl leading-8 font-semibold">
          {name}
        </h3>
      </div>
      <p className="text-primary-content text-lg leading-7 font-semibold">
        {headline}
      </p>
      <p className="text-secondary-content text-sm">{description}</p>
    </div>
  );
}

export interface PriceLabelProps extends React.ComponentProps<"div"> {
  price: string;
  unit: string;
  align?: "left" | "right";
}

/** PriceLabel — "$0.45 input / $2.2 output" over "per 1M tokens". */
export function PriceLabel({
  price,
  unit,
  align = "left",
  className,
  ...props
}: PriceLabelProps) {
  return (
    <div
      data-component="PriceLabel"
      className={cn(
        "flex flex-col",
        align === "right" && "items-end text-right",
        className,
      )}
      {...props}
    >
      <span className="text-primary-content text-sm font-medium">{price}</span>
      <span className="text-secondary-content text-xs">{unit}</span>
    </div>
  );
}

export interface GetStartedTileProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  illustration: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  action: React.ReactNode;
}

/** GetStartedTile — illustration panel on the left, copy and CTA on the right. */
export function GetStartedTile({
  illustration,
  title,
  description,
  action,
  className,
  ...props
}: GetStartedTileProps) {
  return (
    <div
      data-component="GetStartedTile"
      className={cn(
        "border-secondary-border bg-primary-background flex overflow-hidden rounded-lg border",
        className,
      )}
      {...props}
    >
      <div className="bg-secondary-background flex w-32 shrink-0 items-center justify-center">
        {illustration}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3 className="text-primary-content text-lg leading-7 font-semibold">
          {title}
        </h3>
        <p className="text-secondary-content text-xs">{description}</p>
        <div className="mt-2">{action}</div>
      </div>
    </div>
  );
}
