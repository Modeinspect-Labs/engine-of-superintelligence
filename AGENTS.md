# Nscale — conventions

Nscale is a replica of the Nscale Cloud console (console.nscale.com), built
as a sales-call demo for modeinspect. It runs the fictional **modeinspect**
organization: serverless inference (23 models), the Workbench, GPU clusters,
usage & billing, and settings. Design quality is the point: the look
follows the real console pixel for pixel (its own token values, system
sans, ink buttons, purple = Serverless). Don't introduce a custom palette.

All data is mock. `src/lib/store.ts` is the single mock backend (Zustand,
persisted to `localStorage` as `nscale-demo-v1`, rehydrated by
`src/app/_components/store-sync.tsx`). Usage history is computed
deterministically (`seedUsage` in `src/lib/data.ts`, demo "now" = `TODAY`,
2026-10-09) and merged with whatever the session records. "Reset demo
data" is in the org menu (bottom-left).

## Routes (mirroring the console)

`/organization/<orgId>` dashboard · `workbench` · `serverless` (models) ·
`serverless/<modelId>` · `gpu-clusters` · `usage-and-billing?tab=overview|
credit|billing-details` · `settings?tab=organization|service-tokens|
my-account` · `/design` (design-system reference). `/` redirects to the
org dashboard. `useOrg()` in `src/app/_components/use-org.ts` builds hrefs.

## The demo loop (the money moment)

1. **Add credit** (Credit tab, $50/$75/$100 or custom) → balance, transaction
   with receipt, notification, onboarding step 1 ticks.
2. **Create a Service Token** (Settings or dashboard checklist) → reveal-once
   secret with copy, row lands in the table, step 2 ticks.
3. **Call a model** in the Workbench → `POST /api/chat` (real Claude call
   answering as the selected Nscale model; scripted fallback when offline)
   → tokens and cost shown under the reply, credit is charged, a usage
   event is recorded, step 3 ticks.
4. **See it land**: dashboard donut/table, Usage & Billing bar chart (week /
   month, prev/next), At a glance, transactions.

Also: Compare mode (two models, one composer), presets (pick / save),
View code (cURL/Python/JS from the live config), model pages with code
samples + "Open in Workbench", Request Cluster form, payment cards,
billing details edit, auto-recharge, ⌘K palette (theme, copy URL, models),
notifications panel, light/dark/system theme, collapsible navigation.

## Design system (three layers)

1. **Tokens** — `src/design-system/tokens/tokens.css`: the console's own
   values under `--ns-*` (`--ns-primary-content`, `--ns-secondary-background`,
   `--ns-resources-serverless`, `--ns-banner-background` …) on `:root` and
   `.dark`. Tailwind utilities come from `@theme inline` in `globals.css`
   (`text-primary-content`, `text-secondary-content`, `bg-primary-background`,
   `bg-secondary-background`, `bg-tertiary-background`, `border-primary-border`,
   `bg-primary-background-inverse`, `bg-resources-serverless`,
   `bg-code-background`, `shadow-xs` …). Never use raw hex or palette steps
   in components. Font stacks are literal system stacks (what the real
   console uses).
2. **Primitives** — `src/components/ui/`: Button, IconButton, Badge, Card
   (+CardHeader/Content/Footer, Panel), Textfield/Textarea/NumberInput,
   Field/Definition, Tabs/SegmentedControl, Table, EmptyState, Modal,
   DropdownMenu, Popover, Select, Slider, Switch, Checkbox, Skeleton,
   Spinner, Alert, Avatar, Kbd, Heading/Text, Link, CopyField, CodeBlock,
   Toast, Tooltip, Separator. Radix + CVA.
3. **Patterns** — `src/components/patterns/`: SideNavigation (+NavItem,
   NavSearchButton, NavGroup), PageHeader/HeroHeader/CompactHeader/Page,
   OnboardingStep, ServiceTile, PriceLabel, GetStartedTile, BarChart,
   DonutChart, LegendRow, ChatMessage, TypingIndicator, ChatComposer,
   ParameterControl, PickerList, ModelPicker, PresetPicker, ToolbarButton,
   RichText, CommandPalette, NotificationPanel.

App code imports the `@/design-system` barrel **only** (ESLint-enforced);
inside `src/components` siblings import by relative path. Icons are
design-system components (`CloudIcon`, `TokenIcon`, `NscaleLogo`,
`CloudGlyph`, `RackIllustration` …); pages never import lucide.
`src/components/` holds the design system and nothing else — app-level
compositions that read the store live in `src/app/_components/`.

Write components as named `export function X(...)`, give variant props
literal unions, and put defaults in the destructuring — modeinspect's
prop parser reads those.

## Hard rules

- Ink (`primary`) Button = the page's main action; **one per view**.
  Everything else is the white `secondary` or `ghost`. `inverse` only on
  dark banners.
- Purple (`resources-serverless`) is the Serverless product colour: hero,
  badge, chart marks, unread dots. Nothing else is purple.
- Controls are 34px / 8px radius; nav rows 38px; cards `rounded-xl` with
  the hairline + `shadow-xs`; section cards pad 24px top / 32px bottom.
- New components get: `data-component`, `data-action` on wired controls,
  an entry in `src/design-system/registry.ts`, a barrel export, and a
  section on `/design`.

## Capture-safe markup (modeinspect lifts elements out of the page)

- Surfaces repeat their background on inner rows (`bg-inherit`); layout
  wrappers that show the page colour carry `bg-secondary-background`.
- No `var()` or utility classes inside `<svg>`: charts resolve tokens with
  `useTokenValues` (re-reads on theme change) and set attributes; the rack
  illustration uses fixed hex.
- The document scrolls (`min-h-dvh` shell, sticky sidebar). Only the
  Workbench uses a viewport-height frame.
- Position without transforms (`inset-0 m-auto`, `inset-x-0`); the Switch
  thumb moves with `left`; transforms only in enter animations.
- No `opacity-*` on a box that directly contains text at rest.
- No commas in arbitrary size values; no `display: contents`; no
  `::before/::after` decoration; chips are `inline-flex`.
- Tokens live on `:root`/`.dark`; font stacks are literal in `@theme`.

## Operator contract

`data-component` on every design-system root; `data-action` on app
controls (`open-search`, `toggle-sidebar`, `open-notifications`,
`open-org-menu`, `redeem-credit`, `add-credit`, `open-create-token`,
`submit-token`, `revoke-token`, `add-card`, `submit-card`, `edit-billing`,
`save-billing`, `toggle-auto-recharge`, `download-receipt`,
`request-cluster`, `submit-cluster-request`, `submit-message`,
`toggle-compare`, `view-code`, `reset-chat`, `open-model-picker`,
`open-preset-picker`, `save-preset`, `open-in-workbench`, `search-models`,
`set-theme-*`, `reset-demo` …); state mirrored via `data-model-id`,
`data-token-id`, `data-card-id`, `data-role`, `data-done`, `data-active`,
`data-selected`, `data-state`. `componentRegistry` in
`src/design-system/registry.ts` is the index.

## AI integration

`src/app/api/chat/route.ts` → `@anthropic-ai/sdk`, model `claude-opus-5-5`
(no `temperature` — deprecated for this model; the slider still shapes the
system prompt and the generated code), `effort: "low"`, server-side
fallback beta. Contract in `src/lib/chat.ts`; `src/lib/chat-client.ts`
falls back to `scriptedReply` when the route fails. Key resolution
(`src/lib/env.ts`): env vars → `.env.local` → committed `env.demo`.
Identity-linked keys also need `ANTHROPIC_WORKSPACE_ID`.

## Quality gates

`npm run lint`, `typecheck`, `format:check`, `test`, and `build` must all
pass. Dev: `PORT=3006 npm run dev` (port 3000 is usually taken). Note that
Chrome throttles background tabs: a driven tab that isn't focused resolves
streamed Suspense boundaries late, so take a screenshot (which focuses the
tab) before clicking when automating QA.
