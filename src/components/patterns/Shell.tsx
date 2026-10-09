"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Modal, ModalContent } from "../ui/Modal";
import { Kbd } from "../ui/Kbd";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { SegmentedControl } from "../ui/Tabs";
import { ChevronRightIcon, SearchIcon } from "../icons";

/* ── Command palette ───────────────────────────────────────────────── */

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon?: React.ReactNode;
  /** Shows a chevron: picking it drills into a sub-list. */
  hasChildren?: boolean;
  keywords?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
}

/**
 * CommandPalette — ⌘K sheet: search field with an Esc chip, grouped rows.
 * Arrow keys move, Enter picks.
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Search resources, commands, and more...",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((it) =>
        `${it.label} ${it.group} ${it.keywords ?? ""}`
          .toLowerCase()
          .includes(q),
      )
    : items;
  const groups = new Map<string, CommandItem[]>();
  for (const it of filtered)
    groups.set(it.group, [...(groups.get(it.group) ?? []), it]);

  const change = (next: boolean) => {
    if (!next) {
      setQuery("");
      setActive(0);
    }
    onOpenChange(next);
  };
  const setSearch = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const pick = (it: CommandItem) => {
    it.onSelect();
    if (it.hasChildren) {
      setQuery("");
      setActive(0);
    } else {
      change(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={change}>
      <ModalContent
        hideClose
        width="medium"
        className="top-[12vh] mt-0 max-h-[396px] min-h-[396px] max-w-[504px]"
        data-component="CommandPalette"
      >
        <label className="border-primary-border flex h-11 shrink-0 items-center gap-2 border-b px-4 text-sm">
          <SearchIcon size={15} className="text-secondary-content" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            aria-label="Search"
            className="placeholder:text-tertiary-content min-w-0 flex-1 bg-transparent outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(filtered.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter" && filtered[active]) {
                e.preventDefault();
                pick(filtered[active]);
              }
            }}
          />
          <Kbd variant="boxed">Esc</Kbd>
        </label>
        <div className="min-h-0 flex-1 overflow-y-auto bg-inherit p-2">
          {filtered.length === 0 && (
            <p className="text-secondary-content px-2 py-6 text-center text-sm">
              No results
            </p>
          )}
          {[...groups.entries()].map(([group, list]) => (
            <div key={group} className="bg-inherit pb-1">
              <p className="text-secondary-content px-2 pt-1 pb-1 text-[11px] font-semibold">
                {group}
              </p>
              {list.map((it) => {
                const index = filtered.indexOf(it);
                const isActive = index === active;
                return (
                  <button
                    key={it.id}
                    type="button"
                    data-action={`command-${it.id}`}
                    data-active={isActive || undefined}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => pick(it)}
                    className={cn(
                      "text-primary-content flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm",
                      isActive && "bg-hover-overlay",
                    )}
                  >
                    {it.icon && (
                      <span className="text-primary-content inline-flex">
                        {it.icon}
                      </span>
                    )}
                    <span className="flex-1 truncate">{it.label}</span>
                    {it.hasChildren && (
                      <ChevronRightIcon
                        size={14}
                        className="text-secondary-content"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
}

/* ── Notifications ─────────────────────────────────────────────────── */

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  when: string;
  read: boolean;
}

export interface NotificationPanelProps {
  items: NotificationItem[];
  trigger: React.ReactNode;
  /** Called when the panel closes (the app marks everything read then). */
  onClose?: () => void;
}

/** NotificationPanel — popover with All / Unread / Read pills and a feed. */
export function NotificationPanel({
  items,
  trigger,
  onClose,
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const list = items.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.read : n.read,
  );
  return (
    <Popover onOpenChange={(o) => !o && onClose?.()}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="w-[390px] overflow-hidden p-0"
        data-component="NotificationPanel"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-primary-content text-lg font-semibold">
            Notifications
          </h2>
          <Kbd>Esc</Kbd>
        </div>
        <div className="px-5 pb-3">
          <SegmentedControl
            aria-label="Filter notifications"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ]}
          />
        </div>
        <div className="border-primary-border max-h-[360px] overflow-y-auto border-t bg-inherit">
          {list.length === 0 ? (
            <p className="text-secondary-content py-6 text-center text-xs">
              No updates
            </p>
          ) : (
            list.map((n) => (
              <div
                key={n.id}
                data-read={n.read || undefined}
                className="border-secondary-border flex gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    n.read ? "bg-transparent" : "bg-resources-serverless",
                  )}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-primary-content text-sm font-semibold">
                    {n.title}
                  </p>
                  <p className="text-secondary-content text-xs">{n.body}</p>
                  <p className="text-tertiary-content text-[11px]">{n.when}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
