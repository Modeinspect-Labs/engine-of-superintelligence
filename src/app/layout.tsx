import type { Metadata } from "next";
import { StoreSync } from "@/app/_components/store-sync";
import { ThemeSync } from "@/app/_components/theme-sync";
import { TooltipProvider } from "@/design-system";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nscale Cloud",
  description:
    "Nscale Cloud console: serverless inference, the Workbench, and sovereign GPU clusters.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <TooltipProvider>
          <StoreSync />
          <ThemeSync />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
