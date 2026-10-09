"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CheckIcon, CopyIcon, MinusIcon, AddIcon } from "../icons";
import { IconButton } from "./IconButton";
import { Select } from "./Select";

export interface CodeSample {
  /** Select value, e.g. "curl". */
  id: string;
  label: string;
  code: string;
}

export interface CodeBlockProps extends React.ComponentProps<"div"> {
  samples: CodeSample[];
  /** Lines shown while collapsed. */
  collapsedLines?: number;
  /** Starts collapsed (the View code dialog). */
  defaultCollapsed?: boolean;
}

const STRING = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;

/** Highlights quoted strings and $VARS the way the console does. */
function highlight(line: string, key: number) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(STRING)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(line.slice(last, i));
    parts.push(
      <span key={`${key}-${i}`} className="text-code-string">
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

/**
 * CodeBlock — the dark snippet surface: numbered lines, string
 * highlighting, a language picker, copy, and a collapse pill.
 */
export function CodeBlock({
  samples,
  collapsedLines = 8,
  defaultCollapsed = false,
  className,
  ...props
}: CodeBlockProps) {
  const [id, setId] = useState(samples[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const sample = samples.find((s) => s.id === id) ?? samples[0];
  const lines = sample.code.split("\n");
  const visible = collapsed ? lines.slice(0, collapsedLines) : lines;
  const canCollapse = lines.length > collapsedLines;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sample.code);
    } catch {
      /* no clipboard in this context */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      data-component="CodeBlock"
      data-language={sample.id}
      data-collapsed={collapsed || undefined}
      className={cn(
        "bg-code-background text-code-content relative overflow-hidden rounded-lg",
        className,
      )}
      {...props}
    >
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {samples.length > 1 && (
          <Select
            size="sm"
            variant="code"
            value={sample.id}
            onValueChange={setId}
            options={samples.map((s) => ({ value: s.id, label: s.label }))}
            aria-label="Language"
          />
        )}
        <IconButton
          variant="code"
          size="sm"
          label={copied ? "Copied" : "Copy code"}
          icon={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          onClick={copy}
          data-action="copy-code"
        />
      </div>
      <pre className="overflow-x-auto px-4 pt-4 pb-10 font-mono text-xs leading-[19px]">
        <code className="block">
          {visible.map((line, i) => (
            <span key={i} className="flex gap-4">
              <span className="text-code-muted w-5 shrink-0 text-right italic select-none">
                {i + 1}
              </span>
              <span className="whitespace-pre">{highlight(line, i)}</span>
            </span>
          ))}
        </code>
      </pre>
      {canCollapse && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <button
            type="button"
            data-action="toggle-collapse"
            onClick={() => setCollapsed((c) => !c)}
            className="border-primary-border-inverse bg-banner-background-raised text-banner-content hover:bg-secondary-background-inverse inline-flex h-6 items-center gap-2 rounded-md border px-2.5 text-xs font-semibold"
          >
            {collapsed ? "Expand" : "Collapse"}
            {collapsed ? <AddIcon size={12} /> : <MinusIcon size={12} />}
          </button>
        </div>
      )}
    </div>
  );
}
