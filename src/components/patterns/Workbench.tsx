"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { NumberInput } from "../ui/Textfield";
import { Slider } from "../ui/Slider";
import { Tooltip } from "../ui/Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { RichText } from "./RichText";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoIcon,
  PresetIcon,
  SearchIcon,
} from "../icons";

/* ── Messages ──────────────────────────────────────────────────────── */

export interface ChatMessageProps extends React.ComponentProps<"div"> {
  role: "user" | "assistant";
  content: string;
  /** Footer meta for assistant replies (tokens, cost, model). */
  meta?: React.ReactNode;
}

/** ChatMessage — user turns right-aligned in a grey pill; model turns plain. */
export function ChatMessage({
  role,
  content,
  meta,
  className,
  ...props
}: ChatMessageProps) {
  return (
    <div
      data-component="ChatMessage"
      data-role={role}
      className={cn(
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-2",
          role === "user"
            ? "bg-tertiary-background text-primary-content rounded-2xl rounded-br-md px-4 py-2.5 text-sm"
            : "text-primary-content text-sm",
        )}
      >
        {role === "user" ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <RichText text={content} />
        )}
        {meta && <div className="text-tertiary-content text-xs">{meta}</div>}
      </div>
    </div>
  );
}

/** TypingIndicator — three pulsing dots while a reply is in flight. */
export function TypingIndicator() {
  return (
    <div
      data-component="TypingIndicator"
      className="flex items-center gap-1 py-2"
      aria-label="Generating"
    >
      <span className="bg-tertiary-content size-1.5 animate-pulse rounded-full" />
      <span className="bg-tertiary-content size-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
      <span className="bg-tertiary-content size-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
    </div>
  );
}

export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

/** ChatComposer — the bordered text area with the Submit button inside. */
export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isLoading = false,
  placeholder = "Enter text",
}: ChatComposerProps) {
  return (
    <form
      data-component="ChatComposer"
      className="border-primary-border bg-primary-background has-[textarea:focus-visible]:border-primary-core flex flex-col gap-2 rounded-xl border p-3 shadow-xs"
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && value.trim()) onSubmit();
          }
        }}
        placeholder={placeholder}
        rows={2}
        aria-label="Message"
        className="text-primary-content placeholder:text-tertiary-content min-h-10 w-full resize-none bg-transparent text-sm outline-none"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={disabled || !value.trim()}
          isLoading={isLoading}
          data-action="submit-message"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

/* ── Parameters ────────────────────────────────────────────────────── */

export interface ParameterControlProps {
  label: string;
  about: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

/** ParameterControl — label with info, mono value box, slider underneath. */
export function ParameterControl({
  label,
  about,
  value,
  min,
  max,
  step,
  onChange,
}: ParameterControlProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div
      data-component="ParameterControl"
      data-parameter={label}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-primary-content inline-flex items-center gap-1.5 text-sm font-semibold">
          {label}
          <Tooltip content={about}>
            <button
              type="button"
              aria-label={`About ${label}`}
              className="text-secondary-content inline-flex"
            >
              <InfoIcon size={13} />
            </button>
          </Tooltip>
        </span>
        <NumberInput
          aria-label={`${label} value`}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            if (!Number.isNaN(n)) onChange(clamp(n));
          }}
        />
      </div>
      <Slider
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onChange}
      />
    </div>
  );
}

/* ── Pickers ───────────────────────────────────────────────────────── */

export interface PickerOption {
  value: string;
  label: string;
  /** Secondary line under the label. */
  detail?: string;
  group?: string;
}

export interface PickerListProps {
  options: PickerOption[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
}

/** PickerList — searchable, grouped option list used inside popovers. */
export function PickerList({
  options,
  value,
  onSelect,
  placeholder = "Search…",
  emptyLabel = "No matches",
}: PickerListProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) =>
        `${o.label} ${o.detail ?? ""}`.toLowerCase().includes(q),
      )
    : options;
  const groups = new Map<string, PickerOption[]>();
  for (const o of filtered) {
    const g = o.group ?? "";
    groups.set(g, [...(groups.get(g) ?? []), o]);
  }
  return (
    <div
      data-component="PickerList"
      className="flex max-h-[420px] w-full flex-col bg-inherit"
    >
      <label className="border-primary-border flex h-10 shrink-0 items-center gap-2 border-b px-3 text-sm">
        <SearchIcon size={14} className="text-secondary-content" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="placeholder:text-tertiary-content min-w-0 flex-1 bg-transparent outline-none"
        />
      </label>
      <div className="min-h-0 flex-1 overflow-y-auto bg-inherit p-1">
        {filtered.length === 0 && (
          <p className="text-secondary-content px-2 py-3 text-xs">
            {emptyLabel}
          </p>
        )}
        {[...groups.entries()].map(([group, items]) => (
          <div key={group} className="bg-inherit">
            {group && (
              <p className="text-secondary-content px-2 pt-2 pb-1 text-[11px] font-semibold">
                {group}
              </p>
            )}
            {items.map((o) => {
              const selected = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-selected={selected || undefined}
                  onClick={() => onSelect(o.value)}
                  className="text-primary-content hover:bg-hover-overlay flex min-h-8 w-full items-center justify-between gap-3 rounded-md px-2 py-1 text-left text-sm"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{o.label}</span>
                    {o.detail && (
                      <span className="text-secondary-content truncate text-xs">
                        {o.detail}
                      </span>
                    )}
                  </span>
                  {selected && <CheckIcon size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ModelPickerProps {
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/** ModelPicker — "Select model" trigger opening a grouped, searchable list. */
export function ModelPicker({
  value,
  options,
  onChange,
  label = "Select model",
  className,
}: ModelPickerProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-component="ModelPicker"
          data-action="open-model-picker"
          aria-label={label}
          className={cn(
            "border-primary-border bg-primary-background text-primary-content hover:bg-secondary-background focus-visible:border-primary-core data-[state=open]:border-primary-core flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 text-sm font-semibold outline-none",
            className,
          )}
        >
          <span className="truncate">{current?.label ?? label}</span>
          <ChevronDownIcon
            size={14}
            className="text-secondary-content shrink-0"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] overflow-hidden p-0">
        <PickerList
          options={options}
          value={value}
          placeholder="Search models..."
          onSelect={(v) => {
            onChange(v);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export interface PresetPickerProps {
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  /** Rendered under the list (Save as new preset). */
  footer?: React.ReactNode;
}

/** PresetPicker — the "default-preset ⌄" header control with its model line. */
export function PresetPicker({
  value,
  options,
  onChange,
  footer,
}: PresetPickerProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-component="PresetPicker"
          data-action="open-preset-picker"
          className="hover:bg-hover-overlay data-[state=open]:bg-hover-overlay flex items-center gap-3 rounded-lg px-2 py-1.5 text-left outline-none"
        >
          <PresetIcon size={20} className="text-primary-content" />
          <span className="flex flex-col">
            <span className="text-primary-content inline-flex items-center gap-2 text-lg leading-6 font-semibold whitespace-nowrap">
              {current?.label ?? "Select a preset"}
              {open ? (
                <ChevronUpIcon size={14} />
              ) : (
                <ChevronDownIcon size={14} />
              )}
            </span>
            <span className="text-secondary-content text-xs">
              {current?.detail}
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[332px] overflow-hidden p-0">
        <PickerList
          options={options}
          value={value}
          placeholder="Select a preset"
          onSelect={(v) => {
            onChange(v);
            setOpen(false);
          }}
        />
        {footer && (
          <div className="border-primary-border border-t p-1">{footer}</div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/** ToolbarButton — icon + label ghost button for the Workbench header. */
export function ToolbarButton({
  icon,
  children,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  icon: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      data-component="ToolbarButton"
      data-active={isActive || undefined}
      className={cn(
        "text-primary-content hover:bg-hover-overlay inline-flex h-8 items-center gap-2 rounded-md px-2 text-sm font-semibold transition-colors duration-(--duration-fast)",
        isActive && "bg-tertiary-background",
        className,
      )}
      {...props}
    >
      <span className="text-secondary-content inline-flex">{icon}</span>
      {children}
    </button>
  );
}

export { IconButton as WorkbenchIconButton };
