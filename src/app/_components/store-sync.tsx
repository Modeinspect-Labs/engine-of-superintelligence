"use client";

import { useEffect } from "react";
import { STORAGE_KEY, useNscaleStore } from "@/lib/store";

/**
 * Rehydrates the persisted store on mount (persist uses `skipHydration` so
 * the server render is deterministic) and re-reads it when another tab
 * writes, so two open tabs stay in step.
 */
export function StoreSync() {
  useEffect(() => {
    void useNscaleStore.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) void useNscaleStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
