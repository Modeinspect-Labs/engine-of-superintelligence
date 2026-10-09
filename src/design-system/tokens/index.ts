/**
 * Token metadata for tooling and the /design route. The values themselves
 * live in tokens.css (loaded globally); this module lists the semantic
 * names so a UI or a script can enumerate them.
 */
export const colorTokens = [
  "--ns-primary-content",
  "--ns-primary-background",
  "--ns-primary-content-inverse",
  "--ns-primary-background-inverse",
  "--ns-primary-border",
  "--ns-primary-border-inverse",
  "--ns-primary-core",
  "--ns-secondary-content",
  "--ns-secondary-background",
  "--ns-secondary-content-inverse",
  "--ns-secondary-background-inverse",
  "--ns-secondary-border",
  "--ns-tertiary-content",
  "--ns-tertiary-background",
  "--ns-tertiary-background-inverse",
  "--ns-tertiary-border",
  "--ns-info-background",
  "--ns-info-content",
  "--ns-info-border",
  "--ns-success-background",
  "--ns-success-content",
  "--ns-success-border",
  "--ns-warning-background",
  "--ns-warning-content",
  "--ns-warning-border",
  "--ns-error-background",
  "--ns-error-content",
  "--ns-error-border",
  "--ns-hover-background-overlay",
  "--ns-hover-active",
  "--ns-pressed-active",
  "--ns-table-hover-primary",
  "--ns-resources-serverless",
  "--ns-resources-kubernetes",
  "--ns-resources-slurm",
  "--ns-resources-compute",
  "--ns-resources-default",
  "--ns-code-background",
  "--ns-code-string",
] as const;

export const typographyTokens = [
  { name: "display", size: "36px", lineHeight: "40px", weight: 600 },
  { name: "heading.large", size: "24px", lineHeight: "32px", weight: 600 },
  { name: "heading.medium", size: "20px", lineHeight: "28px", weight: 600 },
  { name: "heading.small", size: "18px", lineHeight: "28px", weight: 600 },
  { name: "body.large", size: "16px", lineHeight: "24px", weight: 400 },
  { name: "body", size: "14px", lineHeight: "20px", weight: 400 },
  { name: "body.strong", size: "14px", lineHeight: "20px", weight: 600 },
  { name: "caption", size: "12px", lineHeight: "16px", weight: 400 },
  { name: "mono", size: "12px", lineHeight: "16px", weight: 400 },
] as const;

export const spaceTokens = [
  ["space.1", "4px"],
  ["space.2", "8px"],
  ["space.3", "12px"],
  ["space.4", "16px"],
  ["space.5", "20px"],
  ["space.6", "24px"],
  ["space.8", "32px"],
  ["space.10", "40px"],
  ["space.12", "48px"],
] as const;

export const radiusTokens = [
  ["radius.sm", "4px"],
  ["radius.md", "6px"],
  ["radius.lg", "8px"],
  ["radius.xl", "12px"],
  ["radius.2xl", "16px"],
  ["radius.full", "9999px"],
] as const;

export const shadowTokens = [
  "--ns-shadow-xs",
  "--ns-shadow-md",
  "--ns-shadow-lg",
  "--ns-shadow-xl",
] as const;
