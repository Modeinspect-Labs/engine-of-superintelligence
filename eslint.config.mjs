import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Design system governance: app code consumes the barrel only. Deep
  // imports bypass the system's public API and break the /design contract.
  {
    files: ["src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/design-system/*",
                "@/components/icons",
                "@/components/icons/*",
                "@/components/ui",
                "@/components/ui/*",
                "@/components/patterns",
                "@/components/patterns/*",
              ],
              message:
                "Import from the @/design-system barrel only — deep imports bypass the design system's public API.",
            },
          ],
        },
      ],
    },
  },
  // Pages additionally never touch lucide directly — icons are design-system
  // components (AiIcon, AddIcon, …) exported from the barrel.
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/design-system/*",
                "@/components/icons",
                "@/components/icons/*",
                "@/components/ui",
                "@/components/ui/*",
                "@/components/patterns",
                "@/components/patterns/*",
              ],
              message:
                "Import from the @/design-system barrel only — deep imports bypass the design system's public API.",
            },
            {
              group: ["lucide-react", "lucide-react/*"],
              message:
                "Pages don't use lucide directly — import the semantic icon components (AiIcon, AddIcon, …) from @/design-system.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
