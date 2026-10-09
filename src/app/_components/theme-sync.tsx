"use client";

import { useEffect } from "react";
import { useNscaleStore } from "@/lib/store";

/** Applies the stored theme as the `dark` class on <html>; `system` follows the OS. */
export function ThemeSync() {
  const theme = useNscaleStore((s) => s.theme);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  return null;
}
