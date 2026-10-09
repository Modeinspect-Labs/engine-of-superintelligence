"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CloudIcon,
  CommandPalette,
  LinkIcon,
  MoonIcon,
  SunIcon,
  ThemeIcon,
  type CommandItem,
} from "@/design-system";
import { MODELS } from "@/lib/data";
import { useNscaleStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import { useOrg } from "./use-org";

/** ⌘K palette: General (theme, copy URL) and Search (models → model page). */
export function GlobalSearch() {
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const [view, setView] = useState<"root" | "theme" | "models">("root");
  const setTheme = useNscaleStore((s) => s.setTheme);
  const toast = useNscaleStore((s) => s.toast);
  const router = useRouter();
  const { href } = useOrg();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const items = useMemo<CommandItem[]>(() => {
    if (view === "theme") {
      return [
        {
          id: "theme-light",
          label: "Light",
          group: "Theme",
          icon: <SunIcon size={16} />,
          onSelect: () => setTheme("light"),
        },
        {
          id: "theme-dark",
          label: "Dark",
          group: "Theme",
          icon: <MoonIcon size={16} />,
          onSelect: () => setTheme("dark"),
        },
        {
          id: "theme-system",
          label: "System",
          group: "Theme",
          icon: <ThemeIcon size={16} />,
          onSelect: () => setTheme("system"),
        },
      ];
    }
    if (view === "models") {
      return MODELS.map((m) => ({
        id: `model-${m.id}`,
        label: m.name,
        group: m.type,
        keywords: `${m.developer} ${m.id}`,
        icon: <CloudIcon size={16} />,
        onSelect: () =>
          router.push(href(`serverless/${encodeURIComponent(m.id)}`)),
      }));
    }
    return [
      {
        id: "change-theme",
        label: "Change Theme",
        group: "General",
        icon: <ThemeIcon size={16} />,
        hasChildren: true,
        onSelect: () => setView("theme"),
      },
      {
        id: "copy-url",
        label: "Copy URL",
        group: "General",
        icon: <LinkIcon size={16} />,
        onSelect: () => {
          navigator.clipboard
            ?.writeText(window.location.href)
            .catch(() => undefined);
          toast({ title: "URL copied" });
        },
      },
      {
        id: "models",
        label: "Models",
        group: "Search",
        icon: <CloudIcon size={16} />,
        hasChildren: true,
        keywords: "serverless endpoints",
        onSelect: () => setView("models"),
      },
    ];
  }, [view, setTheme, router, href, toast]);

  return (
    <CommandPalette
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setView("root");
      }}
      items={items}
      placeholder={
        view === "models"
          ? "Search models..."
          : view === "theme"
            ? "Choose a theme"
            : "Search resources, commands, and more..."
      }
    />
  );
}
