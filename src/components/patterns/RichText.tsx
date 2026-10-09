import { Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * RichText — renders the lightweight markdown the chat route emits:
 * "### " headings, "- " bullets, "1. " lists, **bold**, `code` and
 * fenced code blocks. No HTML, no links.
 */
export function RichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = parseBlocks(text);
  return (
    <div
      data-component="RichText"
      className={cn(
        "text-primary-content flex flex-col gap-2.5 text-sm leading-6",
        className,
      )}
    >
      {blocks.map((b, i) => {
        if (b.kind === "code") {
          return (
            <pre
              key={i}
              className="bg-code-background text-code-content overflow-x-auto rounded-lg p-3 font-mono text-xs leading-5"
            >
              <code>{b.lines.join("\n")}</code>
            </pre>
          );
        }
        if (b.kind === "heading") {
          return (
            <p key={i} className="pt-1 font-semibold">
              {inline(b.text)}
            </p>
          );
        }
        if (b.kind === "ul") {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </ul>
          );
        }
        if (b.kind === "ol") {
          return (
            <ol key={i} className="list-decimal space-y-1 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{inline(b.text)}</p>;
      })}
    </div>
  );
}

type Block =
  | { kind: "p"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; lines: string[] };

function parseBlocks(text: string): Block[] {
  const out: Block[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```"))
        code.push(lines[i++]);
      i++;
      out.push({ kind: "code", lines: code });
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      out.push({ kind: "heading", text: line.replace(/^#{1,6}\s+/, "") });
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
      out.push({ kind: "ul", items });
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      out.push({ kind: "ol", items });
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6}\s|\s*[-*]\s|\s*\d+[.)]\s|```)/.test(lines[i])
    )
      para.push(lines[i++]);
    out.push({ kind: "p", text: para.join(" ") });
  }
  return out;
}

function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={i}
          className="bg-tertiary-background rounded px-1 py-0.5 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });
}
