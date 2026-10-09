/**
 * Nscale design system — public API.
 *
 * App code imports from "@/design-system" only; never deep-import a
 * component file. Layers:
 *
 *   src/design-system/tokens/     console-named tokens (colour, type,
 *                                 space, radius, shadow) — the source of truth
 *   src/components/icons/         the semantic icon set + product marks
 *   src/components/ui/            primitives (Button, Card, Modal, Slider, …)
 *   src/components/patterns/      product-aware compositions (SideNavigation,
 *                                 HeroHeader, BarChart, ModelPicker, …)
 *
 * The living reference for everything exported here is the /design route.
 */
export * from "./tokens";
export * from "@/components/icons";
export * from "@/components/ui";
export * from "@/components/patterns";
export { cn } from "@/lib/cn";
export { componentRegistry, type ComponentMeta } from "./registry";
