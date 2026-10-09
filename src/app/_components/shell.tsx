"use client";

import { AppSidebar } from "./app-sidebar";
import { GlobalSearch } from "./global-search";
import { ServiceTokenModal } from "./service-token-modal";
import { Toasts } from "./toasts";

/** Shell — sticky left rail + scrolling content column. */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-component="Shell"
      className="bg-secondary-background flex min-h-dvh"
    >
      <AppSidebar />
      <main className="bg-secondary-background flex min-h-dvh min-w-0 flex-1 flex-col">
        {children}
      </main>
      <GlobalSearch />
      <ServiceTokenModal />
      <Toasts />
    </div>
  );
}
