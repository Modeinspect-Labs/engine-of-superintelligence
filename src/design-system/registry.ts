/**
 * Machine-readable component registry.
 *
 * Tooling that inspects or drives the app resolves rendered elements back
 * to components through the `data-component` attribute each entry's `name`
 * matches; this registry maps those names to source files and intent.
 *
 * Keep entries in sync when adding a component: root element gets
 * `data-component="<Name>"`, and interactive elements the app wires up get
 * `data-action="<verb-phrase>"`.
 */
export interface ComponentMeta {
  name: string;
  layer: "primitive" | "pattern";
  path: string;
  description: string;
  attributes?: string[];
}

const ui = (
  name: string,
  file: string,
  description: string,
  attributes?: string[],
): ComponentMeta => ({
  name,
  layer: "primitive",
  path: `src/components/ui/${file}.tsx`,
  description,
  attributes,
});

const pattern = (
  name: string,
  file: string,
  description: string,
  attributes?: string[],
): ComponentMeta => ({
  name,
  layer: "pattern",
  path: `src/components/patterns/${file}.tsx`,
  description,
  attributes,
});

export const componentRegistry: ComponentMeta[] = [
  /* ── primitives ── */
  ui(
    "Button",
    "Button",
    "Console button: secondary (default), primary, ghost, inverse, danger, link.",
    ["data-variant", "data-size"],
  ),
  ui("ButtonGroup", "Button", "Row of buttons with an 8px gap."),
  ui("IconButton", "IconButton", "Square single-glyph button with tooltip.", [
    "data-variant",
  ]),
  ui("Tooltip", "Tooltip", "Ink bubble shown on hover."),
  ui(
    "Badge",
    "Badge",
    "Small label: neutral, outline, serverless (purple mono), info, success, warning, error.",
    ["data-variant"],
  ),
  ui("Card", "Card", "Section surface: rounded-xl, hairline, soft shadow.", [
    "data-variant",
  ]),
  ui("CardHeader", "Card", "Title, description and right-aligned action."),
  ui("CardContent", "Card", "Card body with 24px side padding."),
  ui("CardFooter", "Card", "Centred footer row."),
  ui("Panel", "Card", "Nested flat panel inside a Card."),
  ui("Textfield", "Textfield", "36px input with prefix/suffix adornments.", [
    "data-invalid",
  ]),
  ui("Textarea", "Textfield", "Multi-line input."),
  ui("NumberInput", "Textfield", "Compact mono number box."),
  ui("Field", "Field", "Label + control + helper/error.", ["data-invalid"]),
  ui("Definition", "Field", "Read-only label/value pair."),
  ui("Tabs", "Tabs", "Radix tabs root."),
  ui("TabList", "Tabs", "Tab strip on a hairline."),
  ui("Tab", "Tabs", "Tab trigger; active gets a grey pill and ink underline.", [
    "data-state",
  ]),
  ui("TabPanel", "Tabs", "Tab content."),
  ui("SegmentedControl", "Tabs", "Pill radio group.", ["data-selected"]),
  ui("Table", "Table", "Data table wrapper."),
  ui("TR", "Table", "Row; hover tint when clickable."),
  ui("EmptyState", "EmptyState", "Grey disc + bold line for empty lists."),
  ui("Modal", "Modal", "Dialog on a dimmed overlay.", ["data-width"]),
  ui("Overlay", "Modal", "Dialog backdrop."),
  ui("DropdownMenu", "DropdownMenu", "Radix menu sheet."),
  ui("DropdownMenuItem", "DropdownMenu", "36px menu row with optional icon."),
  ui("DropdownMenuSubTrigger", "DropdownMenu", "Row that opens a submenu."),
  ui("DropdownMenuRadioItem", "DropdownMenu", "Checkable menu row."),
  ui("Popover", "Popover", "Anchored white sheet."),
  ui("Select", "Select", "Single-choice picker.", ["data-variant"]),
  ui("Slider", "Slider", "Parameter slider with square ink thumb."),
  ui("Switch", "Switch", "36×20 toggle.", ["data-state"]),
  ui("Checkbox", "Checkbox", "16px checkbox.", ["data-state"]),
  ui("Skeleton", "Skeleton", "Loading block."),
  ui("Spinner", "Spinner", "Thin arc spinner.", ["data-size"]),
  ui("Alert", "Alert", "Left-bordered notice strip.", ["data-variant"]),
  ui("Avatar", "Avatar", "Square monogram.", ["data-size", "data-variant"]),
  ui("Kbd", "Kbd", "Keyboard hint.", ["data-variant"]),
  ui("Heading", "Text", "Semibold heading scale."),
  ui("Text", "Text", "Body/secondary/caption/mono text.", ["data-variant"]),
  ui("Link", "Link", "Inline or action link.", ["data-variant"]),
  ui("CopyField", "CopyField", "Mono chip with copy button.", ["data-copied"]),
  ui(
    "CodeBlock",
    "CodeBlock",
    "Dark numbered snippet with language picker, copy and collapse.",
    ["data-language", "data-collapsed"],
  ),
  ui("Toast", "Toast", "Ink notice.", ["data-appearance"]),
  ui("ToastStack", "Toast", "Bottom-right toast column."),
  ui("Separator", "Separator", "Hairline divider."),

  /* ── patterns ── */
  pattern(
    "SideNavigation",
    "SideNavigation",
    "240px left rail; collapses to 56px.",
    ["data-state"],
  ),
  pattern(
    "NavItem",
    "SideNavigation",
    "38px nav row; active gets the bordered pill.",
    ["data-active"],
  ),
  pattern("NavSearchButton", "SideNavigation", "Search ⌘K trigger."),
  pattern("NavGroup", "SideNavigation", "Stack of nav rows."),
  pattern("PageHeader", "PageHeader", "Icon tile + 36px title."),
  pattern(
    "HeroHeader",
    "PageHeader",
    "Product banner: purple (serverless) or ink (clusters).",
    ["data-tone"],
  ),
  pattern("CompactHeader", "PageHeader", "Workbench's slim header bar."),
  pattern("Page", "PageHeader", "Content frame."),
  pattern("OnboardingStep", "Tiles", "Numbered task tile with done marker.", [
    "data-done",
  ]),
  pattern("ServiceTile", "Tiles", "GPU clusters service pitch tile.", [
    "data-tone",
  ]),
  pattern("PriceLabel", "Tiles", "Price over unit."),
  pattern("GetStartedTile", "Tiles", "Illustration + copy + CTA."),
  pattern("BarChart", "Charts", "Purple bars with $ axis.", ["data-empty"]),
  pattern("DonutChart", "Charts", "Single-series ring."),
  pattern("LegendRow", "Charts", "Dot, label, leader, value."),
  pattern("ChatMessage", "Workbench", "User pill or model reply.", [
    "data-role",
  ]),
  pattern("TypingIndicator", "Workbench", "Pulsing dots."),
  pattern("ChatComposer", "Workbench", "Bordered composer with Submit."),
  pattern("ParameterControl", "Workbench", "Labelled slider + number box.", [
    "data-parameter",
  ]),
  pattern("PickerList", "Workbench", "Searchable grouped option list."),
  pattern("ModelPicker", "Workbench", "Select model trigger + list."),
  pattern("PresetPicker", "Workbench", "Preset header control."),
  pattern("ToolbarButton", "Workbench", "Icon + label header action.", [
    "data-active",
  ]),
  pattern("RichText", "RichText", "Lightweight markdown renderer."),
  pattern("CommandPalette", "Shell", "⌘K search sheet."),
  pattern("NotificationPanel", "Shell", "Notifications popover with filters."),
];
