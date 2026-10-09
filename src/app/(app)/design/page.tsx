"use client";

import { useState } from "react";
import {
  AddIcon,
  Alert,
  ArrowRightIcon,
  Avatar,
  Badge,
  BarChart,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  ChatMessage,
  Checkbox,
  CloudGlyph,
  CloudIllustration,
  CodeBlock,
  CopyField,
  Definition,
  DonutChart,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  GpuGlyph,
  HeroHeader,
  IconButton,
  Kbd,
  LegendRow,
  Link,
  MoreIcon,
  NscaleLogo,
  NscaleMark,
  NumberInput,
  OnboardingStep,
  Page,
  PageHeader,
  Panel,
  ParameterControl,
  PriceLabel,
  SegmentedControl,
  Select,
  SettingsIcon,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Textarea,
  Textfield,
  Toast,
  Tooltip,
  TypingIndicator,
  colorTokens,
  componentRegistry,
  radiusTokens,
  spaceTokens,
  typographyTokens,
} from "@/design-system";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={title.toLowerCase().replace(/\s+/g, "-")}>
      <CardHeader title={title} description={description} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-secondary-content text-xs font-semibold">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignPage() {
  const [temp, setTemp] = useState(0.7);
  const [seg, setSeg] = useState("75");
  const [on, setOn] = useState(true);
  return (
    <Page className="max-w-[1200px] gap-6">
      <PageHeader
        title="Design system"
        icon={<SettingsIcon size={26} strokeWidth={2.25} />}
      />
      <p className="text-secondary-content max-w-2xl text-sm">
        Every token, primitive and pattern Nscale is built from. App code
        imports the <code className="font-mono text-xs">@/design-system</code>{" "}
        barrel only; each root element carries{" "}
        <code className="font-mono text-xs">data-component</code> and wired
        controls carry <code className="font-mono text-xs">data-action</code>.
      </p>

      <Section
        title="Colour tokens"
        description="Console-named semantic tokens on :root and .dark; palette steps are never used directly."
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {colorTokens.map((t) => (
            <div
              key={t}
              className="border-secondary-border flex items-center gap-3 rounded-lg border p-2"
            >
              <span
                className="border-primary-border size-8 shrink-0 rounded-md border"
                style={{ background: `var(${t})` }}
              />
              <span className="text-primary-content truncate font-mono text-[11px]">
                {t.replace("--ns-", "")}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        description="System sans (SF Pro on macOS), semibold headings, mono for ids and code."
      >
        <div className="flex flex-col gap-3">
          {typographyTokens.map((t) => (
            <div
              key={t.name}
              className="border-secondary-border flex items-baseline gap-6 border-b pb-3 last:border-b-0"
            >
              <span className="text-secondary-content w-32 shrink-0 font-mono text-[11px]">
                {t.name}
              </span>
              <span
                style={{
                  fontSize: t.size,
                  lineHeight: t.lineHeight,
                  fontWeight: t.weight,
                }}
                className={t.name === "mono" ? "font-mono" : ""}
              >
                Serverless inference on sovereign GPUs
              </span>
              <span className="text-tertiary-content ml-auto font-mono text-[11px]">
                {t.size} / {t.lineHeight} · {t.weight}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Space & radius">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            {spaceTokens.map(([n, v]) => (
              <div key={n} className="flex items-center gap-3">
                <span className="text-secondary-content w-20 font-mono text-[11px]">
                  {n}
                </span>
                <span
                  className="bg-resources-serverless h-3"
                  style={{ width: v }}
                />
                <span className="text-tertiary-content font-mono text-[11px]">
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {radiusTokens.map(([n, v]) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <span
                  className="border-primary-border bg-tertiary-background size-12 border"
                  style={{ borderRadius: v }}
                />
                <span className="text-secondary-content font-mono text-[11px]">
                  {n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Brand"
        description="The Nscale wordmark and mark inherit currentColor."
      >
        <Row label="Logo">
          <NscaleLogo height={14} />
          <NscaleLogo height={24} />
          <NscaleMark size={30} />
          <span className="bg-banner-background text-banner-content rounded-lg p-3">
            <NscaleLogo height={14} />
          </span>
        </Row>
        <Row label="Glyphs">
          <span className="bg-extensions-background-purple text-resources-serverless inline-flex size-12 items-center justify-center rounded-lg">
            <CloudGlyph size={26} />
          </span>
          <span className="bg-resources-default-secondary text-primary-content inline-flex size-12 items-center justify-center rounded-lg">
            <GpuGlyph size={26} />
          </span>
          <CloudIllustration size={48} className="text-resources-serverless" />
        </Row>
      </Section>

      <Section
        title="Button"
        description="One primary per view. Sizes sm / md / lg; loading and disabled states."
      >
        <Row label="Variants">
          <Button variant="primary">Add credit</Button>
          <Button>Go to billing</Button>
          <Button variant="ghost">View all usage</Button>
          <span className="bg-banner-background rounded-lg p-2">
            <Button variant="inverse">Redeem credit</Button>
          </span>
          <Button variant="danger">Revoke</Button>
          <Button variant="link">Service token</Button>
        </Row>
        <Row label="With icons, sizes, states">
          <Button
            variant="primary"
            iconBefore={
              <AddIcon size={14} className="text-primary-content-inverse" />
            }
          >
            Add Service Token
          </Button>
          <Button iconAfter={<ArrowRightIcon size={14} />}>
            View endpoints
          </Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button isLoading variant="primary">
            Loading
          </Button>
          <Button disabled>Disabled</Button>
          <ButtonGroup>
            <IconButton label="More" icon={<MoreIcon size={16} />} />
            <IconButton
              variant="secondary"
              label="More"
              icon={<MoreIcon size={16} />}
            />
            <span className="bg-code-background rounded-md p-1">
              <IconButton
                variant="code"
                label="Copy"
                icon={<MoreIcon size={14} />}
              />
            </span>
          </ButtonGroup>
        </Row>
      </Section>

      <Section title="Badge, Avatar, Kbd">
        <Row label="Badges">
          <Badge variant="serverless">Serverless</Badge>
          <Badge>Default</Badge>
          <Badge variant="outline">$23.40</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Expiring</Badge>
          <Badge variant="error">Revoked</Badge>
          <Badge variant="purple">Vision</Badge>
        </Row>
        <Row label="Avatars">
          <Avatar initials="M" size="xs" />
          <Avatar initials="MV" size="sm" />
          <Avatar initials="M" size="md" />
          <Avatar initials="M" size="lg" />
          <Avatar initials="MV" size="lg" variant="user" />
        </Row>
        <Row label="Keyboard">
          <Kbd>⌘K</Kbd>
          <Kbd variant="boxed">Esc</Kbd>
        </Row>
      </Section>

      <Section
        title="Inputs"
        description="Textfield with prefix/suffix, invalid and disabled; Textarea; NumberInput; Select; Switch; Checkbox; Slider."
      >
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <Field label="Name" helper="Shown on invoices.">
            <Textfield placeholder="ci-pipeline" />
          </Field>
          <Field label="Amount" error="The minimum top-up is $5.">
            <Textfield prefix="$" defaultValue="2" isInvalid />
          </Field>
          <Field label="Display name">
            <Textfield value="modeinspect" disabled readOnly />
          </Field>
          <Field label="Expiry">
            <Select
              value="90"
              onValueChange={() => undefined}
              options={[
                { value: "90", label: "90 days" },
                { value: "365", label: "1 year" },
              ]}
              aria-label="Expiry"
              className="w-full"
            />
          </Field>
          <Field label="System prompt" className="md:col-span-2">
            <Textarea placeholder="Enter a system prompt" />
          </Field>
          <Row label="Toggles">
            <Switch
              checked={on}
              onCheckedChange={setOn}
              label="Auto-recharge"
            />
            <Checkbox id="ds-check" label="Set as default" defaultChecked />
            <NumberInput defaultValue={3000} aria-label="Max tokens" />
          </Row>
          <Row label="Segmented">
            <SegmentedControl
              value={seg}
              onChange={setSeg}
              options={["50", "75", "100"].map((v) => ({
                value: v,
                label: `$${v}`,
              }))}
              aria-label="Amount"
            />
          </Row>
          <div className="md:col-span-2">
            <ParameterControl
              label="Temperature"
              about="Randomness of the output."
              value={temp}
              min={0}
              max={2}
              step={0.1}
              onChange={setTemp}
            />
          </div>
          <div className="md:col-span-2">
            <Slider
              aria-label="Plain slider"
              value={0.4}
              min={0}
              max={1}
              step={0.1}
              onValueChange={() => undefined}
            />
          </div>
        </div>
      </Section>

      <Section title="Tabs, Table, Empty state">
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a">Overview</Tab>
            <Tab value="b">Credit</Tab>
            <Tab value="c">Billing details</Tab>
          </TabList>
          <TabPanel value="a" className="pt-4">
            <Table>
              <THead>
                <TR>
                  <TH>Model Endpoints</TH>
                  <TH>Developer</TH>
                  <TH>Type</TH>
                  <TH>Price</TH>
                </TR>
              </THead>
              <TBody>
                <TR isClickable>
                  <TD className="font-semibold">Kimi K2.5</TD>
                  <TD>MoonshotAI</TD>
                  <TD>Image-Text-to-Text</TD>
                  <TD>
                    <PriceLabel
                      price="$0.45 input / $2.2 output"
                      unit="per 1M tokens"
                    />
                  </TD>
                </TR>
                <TR isClickable>
                  <TD className="font-semibold">GPT OSS 120B</TD>
                  <TD>OpenAI</TD>
                  <TD>Text Generation</TD>
                  <TD>
                    <PriceLabel
                      price="$0.1 input / $0.4 output"
                      unit="per 1M tokens"
                    />
                  </TD>
                </TR>
              </TBody>
            </Table>
          </TabPanel>
          <TabPanel value="b" className="pt-4">
            <EmptyState title="No transactions yet" />
          </TabPanel>
          <TabPanel value="c" className="pt-4">
            <Panel className="text-secondary-content text-center text-sm">
              No payment methods found
            </Panel>
          </TabPanel>
        </Tabs>
      </Section>

      <Section
        title="Feedback"
        description="Alert strip, Toast, Tooltip, Spinner, Skeleton, Typing indicator."
      >
        <Alert
          title="You need at least $1 to interact with models"
          description="To learn how usage is billed in the workbench view the docs."
          action={
            <Link href="#" variant="action">
              Add credit
            </Link>
          }
        />
        <Row label="Toast">
          <Toast title="Credit added" description="$50.00 is available now." />
          <Toast
            title="Rate limited"
            description="Try again shortly."
            appearance="error"
          />
        </Row>
        <Row label="Tooltip, spinner, skeleton">
          <Tooltip content="Modified MIT License">
            <Button>Hover me</Button>
          </Tooltip>
          <Spinner size="small" />
          <Spinner />
          <Skeleton className="h-9 w-40" />
          <TypingIndicator />
        </Row>
      </Section>

      <Section title="Card, Panel, Definition, CopyField, Code">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader
              title="Billing"
              description="Last 30 days"
              action={
                <Button iconAfter={<ArrowRightIcon size={14} />}>
                  Go to billing
                </Button>
              }
            />
            <CardContent>
              <Panel className="flex items-center gap-6">
                <DonutChart value={18.42} total={18.42} size={80} />
                <div className="flex-1">
                  <LegendRow label="Serverless inference" value="$18.42" />
                </div>
              </Panel>
              <dl className="grid grid-cols-2 gap-4">
                <Definition label="Name" value="Modeinspect s.r.o." />
                <Definition
                  label="Model"
                  value={<CopyField value="moonshotai/Kimi-K2.5" />}
                />
              </dl>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" iconAfter={<ArrowRightIcon size={14} />}>
                View all transactions
              </Button>
            </CardFooter>
          </Card>
          <Card variant="inverse" padding="even" className="justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold">Free $5 credit!</h3>
              <p className="text-banner-content-muted text-sm">
                To help you get started, we&apos;ve given you a helping hand.
              </p>
            </div>
            <div>
              <Button variant="inverse">Redeem credit</Button>
            </div>
          </Card>
        </div>
        <CodeBlock
          collapsedLines={4}
          samples={[
            {
              id: "curl",
              label: "cURL",
              code: 'curl https://inference.api.nscale.com/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $NSCALE_SERVICE_TOKEN" \\\n  -X POST \\\n  -d \'{ "model": "openai/gpt-oss-120b", "messages": [{"role": "user", "content": "Hello"}] }\'',
            },
            {
              id: "python",
              label: "Python",
              code: 'client.chat.completions.create(\n    model="openai/gpt-oss-120b",\n    messages=[{"role": "user", "content": "Hello"}],\n)',
            },
          ]}
        />
      </Section>

      <Section
        title="Patterns"
        description="Headers, onboarding tiles, chart, chat, menu."
      >
        <HeroHeader
          eyebrow="AI Services"
          title="Serverless Models"
          glyph={
            <CloudIllustration size={56} className="text-banner-content" />
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          <OnboardingStep
            step={1}
            title="Add credit to your account"
            description="Load up your account with credit."
            action={
              <Button
                variant="primary"
                size="sm"
                iconAfter={
                  <ArrowRightIcon
                    size={14}
                    className="text-primary-content-inverse"
                  />
                }
              >
                Add credit
              </Button>
            }
          />
          <OnboardingStep
            step={2}
            title="Create a Service Token"
            description="API level access for automation."
            isDone
            action={
              <Button size="sm" iconAfter={<ArrowRightIcon size={14} />}>
                Create Service Token
              </Button>
            }
          />
          <OnboardingStep
            step={3}
            title="Call your first endpoint"
            description="Run popular models on serverless."
            action={
              <Button size="sm" iconAfter={<ArrowRightIcon size={14} />}>
                View endpoints
              </Button>
            }
          />
        </div>
        <div className="border-secondary-border rounded-lg border p-4">
          <BarChart
            height={220}
            data={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (d, i) => ({
                label: d,
                value: [0.2, 1.4, 2.1, 0.9, 3.2, 1.1, 0.3][i],
              }),
            )}
          />
        </div>
        <div className="flex max-w-xl flex-col gap-3">
          <ChatMessage role="user" content="What is the capital of France?" />
          <ChatMessage
            role="assistant"
            content="The capital of France is **Paris**."
            meta="GPT OSS 120B · 12 in / 9 out · $0.0000"
          />
        </div>
        <Row label="Menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button iconAfter={<MoreIcon size={14} />}>
                Resource actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>View model details</DropdownMenuItem>
              <DropdownMenuItem>View code</DropdownMenuItem>
              <DropdownMenuItem isDanger>Revoke token</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      <Section
        title="Registry"
        description={`${componentRegistry.length} components resolvable through data-component.`}
      >
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Layer</TH>
              <TH>Path</TH>
              <TH>Description</TH>
            </TR>
          </THead>
          <TBody>
            {componentRegistry.map((c) => (
              <TR key={c.name}>
                <TD className="h-10 py-2 font-mono text-xs">{c.name}</TD>
                <TD className="h-10 py-2">
                  <Badge
                    variant={c.layer === "primitive" ? "neutral" : "purple"}
                  >
                    {c.layer}
                  </Badge>
                </TD>
                <TD className="text-secondary-content h-10 py-2 font-mono text-[11px]">
                  {c.path}
                </TD>
                <TD className="text-secondary-content h-10 py-2">
                  {c.description}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Section>
    </Page>
  );
}
