"use client";

import { Suspense, useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRightIcon,
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Definition,
  DollarIcon,
  DonutChart,
  DownloadIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  IconButton,
  LegendRow,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  MoreIcon,
  Page,
  PageHeader,
  Panel,
  SegmentedControl,
  Select,
  SupportIcon,
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
} from "@/design-system";
import { TODAY } from "@/lib/data";
import {
  formatCents,
  formatDate,
  formatMonth,
  formatRange,
  formatUsd,
} from "@/lib/format";
import {
  addDays,
  allUsage,
  monthStart,
  monthlyBuckets,
  totalCost,
  usageSince,
  weekStart,
  weeklyBuckets,
} from "@/lib/selectors";
import { useNscaleStore } from "@/lib/store";
import type { BillingDetails, PaymentCard } from "@/lib/types";
import { useOrg } from "@/app/_components/use-org";

const TABS = ["overview", "credit", "billing-details"] as const;
type TabId = (typeof TABS)[number];

export default function BillingPage() {
  return (
    <Suspense>
      <BillingInner />
    </Suspense>
  );
}

function BillingInner() {
  const { href } = useOrg();
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("tab");
  const tab: TabId = TABS.includes(raw as TabId) ? (raw as TabId) : "overview";
  const setTab = (next: string) =>
    router.replace(
      href(
        next === "overview"
          ? "usage-and-billing"
          : `usage-and-billing?tab=${next}`,
      ),
    );

  return (
    <Page>
      <PageHeader
        title="Usage & Billing"
        icon={<DollarIcon size={26} strokeWidth={2.25} />}
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="credit">Credit</Tab>
          <Tab value="billing-details">Billing details</Tab>
        </TabList>
        <TabPanel value="overview" className="pt-8">
          <OverviewTab
            onGoCredit={() => setTab("credit")}
            onGoBilling={() => setTab("billing-details")}
          />
        </TabPanel>
        <TabPanel value="credit" className="pt-8">
          <CreditTab onGoBilling={() => setTab("billing-details")} />
        </TabPanel>
        <TabPanel value="billing-details" className="pt-8">
          <BillingDetailsTab />
        </TabPanel>
      </Tabs>
    </Page>
  );
}

/* ── Overview ──────────────────────────────────────────────────────── */

function OverviewTab({
  onGoCredit,
  onGoBilling,
}: {
  onGoCredit: () => void;
  onGoBilling: () => void;
}) {
  const usageEvents = useNscaleStore((s) => s.usageEvents);
  const cards = useNscaleStore((s) => s.cards);
  const [granularity, setGranularity] = useState<"week" | "month">("week");
  const [offset, setOffset] = useState(0);
  const events = allUsage(usageEvents);

  const anchor =
    granularity === "week"
      ? addDays(weekStart(TODAY), offset * 7)
      : new Date(
          Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + offset, 1),
        );
  const buckets =
    granularity === "week"
      ? weeklyBuckets(events, anchor)
      : monthlyBuckets(events, anchor);
  const rangeLabel =
    granularity === "week"
      ? formatRange(anchor, addDays(anchor, 7))
      : formatMonth(monthStart(anchor));
  const last30 = totalCost(usageSince(events, addDays(TODAY, -30)));
  const defaultCard = cards.find((c) => c.isDefault) ?? cards[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_464px]">
      <Card>
        <CardHeader
          title="AI services usage"
          description="This is how much you're spending on inference."
        />
        <CardContent className="gap-4">
          <div className="flex items-center justify-end gap-3">
            <span className="text-secondary-content text-sm">{rangeLabel}</span>
            <span className="border-primary-border bg-primary-background inline-flex items-center gap-0.5 rounded-md border">
              <IconButton
                size="sm"
                label="Previous period"
                icon={<ChevronLeftIcon size={14} />}
                onClick={() => setOffset((o) => o - 1)}
                data-action="usage-prev"
              />
              <IconButton
                size="sm"
                label="Next period"
                icon={<ChevronRightIcon size={14} />}
                onClick={() => setOffset((o) => Math.min(0, o + 1))}
                disabled={offset >= 0}
                data-action="usage-next"
              />
            </span>
            <Select
              size="sm"
              value={granularity}
              onValueChange={(v) => {
                setGranularity(v as "week" | "month");
                setOffset(0);
              }}
              options={[
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ]}
              aria-label="Granularity"
              className="w-24"
            />
          </div>
          <div className="border-secondary-border bg-primary-background rounded-lg border p-4">
            <BarChart
              data={buckets.map((b) => ({ label: b.label, value: b.costUsd }))}
              height={320}
              labelEvery={granularity === "week" ? 1 : 3}
            />
            <div className="text-primary-content flex items-center justify-center gap-2 pt-3 text-xs">
              <span className="bg-chart-serverless size-2.5 rounded-[2px]" />
              Serverless inference
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader
            title="At a glance"
            description="Last 30 days"
            action={
              <Button
                iconAfter={<ArrowRightIcon size={14} />}
                onClick={onGoCredit}
                data-action="see-credit"
              >
                See Credit
              </Button>
            }
          />
          <CardContent>
            <Panel className="bg-primary-background flex items-center gap-6">
              <DonutChart value={last30} total={last30} size={96} />
              <div className="flex-1">
                <LegendRow
                  label="Serverless inference"
                  value={formatUsd(last30)}
                />
              </div>
            </Panel>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Payment methods"
            action={
              <Button
                iconAfter={<ArrowRightIcon size={14} />}
                onClick={onGoBilling}
                data-action="manage-payment"
              >
                Manage payment
              </Button>
            }
          />
          <CardContent>
            <Panel className="py-5">
              {defaultCard ? (
                <CardRow card={defaultCard} compact />
              ) : (
                <p className="text-secondary-content text-xs">
                  No payment methods
                </p>
              )}
            </Panel>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ── Credit ────────────────────────────────────────────────────────── */

const PRESETS = ["50", "75", "100"] as const;

function CreditTab({ onGoBilling }: { onGoBilling: () => void }) {
  const creditCents = useNscaleStore((s) => s.creditCents);
  const transactions = useNscaleStore((s) => s.transactions);
  const cards = useNscaleStore((s) => s.cards);
  const autoRecharge = useNscaleStore((s) => s.autoRecharge);
  const setAutoRecharge = useNscaleStore((s) => s.setAutoRecharge);
  const addCredit = useNscaleStore((s) => s.addCredit);
  const toast = useNscaleStore((s) => s.toast);
  const [amount, setAmount] = useState("75");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const preset = PRESETS.find((p) => p === amount) ?? "";

  const submit = () => {
    const n = Math.round(parseFloat(amount) * 100);
    if (!n || n < 500) {
      setError("The minimum top-up is $5.");
      return;
    }
    if (cards.length === 0) {
      setError("Add a payment card first.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      addCredit(n);
      setBusy(false);
      toast({
        title: "Credit added",
        description: `${formatCents(n)} is available now.`,
      });
    }, 700);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card
        padding="even"
        className="flex-row items-start justify-between gap-6"
      >
        <div className="flex flex-col gap-2">
          <h2
            className="text-primary-content text-2xl font-semibold"
            data-component="BalanceHeading"
          >
            Balance {formatCents(creditCents)}
          </h2>
          <p className="text-secondary-content text-sm">
            {creditCents < 100
              ? "To use our AI services, you'll need to top up your credit."
              : "Credit is spent on serverless inference as you go."}
          </p>
        </div>
        <Panel className="flex w-[596px] max-w-full flex-col gap-3 p-3">
          <p className="text-primary-content text-sm font-semibold">
            Add credit
          </p>
          <div className="flex items-center gap-3">
            <SegmentedControl
              aria-label="Amount"
              value={preset}
              onChange={(v) => {
                setAmount(v);
                setError("");
              }}
              options={PRESETS.map((p) => ({ value: p, label: `$${p}` }))}
            />
            <Textfield
              prefix={<span className="text-sm">$</span>}
              type="number"
              min={5}
              value={amount}
              isInvalid={!!error}
              aria-label="Custom amount"
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={submit}
              isLoading={busy}
              data-action="add-credit"
            >
              Add credit
            </Button>
          </div>
          {error && <p className="text-error-content text-xs">{error}</p>}
        </Panel>
      </Card>

      <Card>
        <CardHeader
          title="Auto-recharge"
          description="Recharge your credit automatically when your balance runs low, so your AI services keep running."
          action={
            cards.length === 0 ? (
              <Button onClick={onGoBilling} data-action="add-payment-method">
                Add a payment method
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-secondary-content text-sm">
                  {autoRecharge.enabled ? "On" : "Off"}
                </span>
                <Switch
                  label="Auto-recharge"
                  checked={autoRecharge.enabled}
                  onCheckedChange={(enabled) => setAutoRecharge({ enabled })}
                  data-action="toggle-auto-recharge"
                />
              </div>
            )
          }
        />
        {autoRecharge.enabled && (
          <CardContent>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <Field label="When balance drops below">
                <Select
                  value={String(autoRecharge.thresholdCents)}
                  onValueChange={(v) =>
                    setAutoRecharge({ thresholdCents: Number(v) })
                  }
                  options={[500, 1000, 2500].map((c) => ({
                    value: String(c),
                    label: formatCents(c),
                  }))}
                  aria-label="Threshold"
                  className="w-full"
                />
              </Field>
              <Field label="Top up by">
                <Select
                  value={String(autoRecharge.topUpCents)}
                  onValueChange={(v) =>
                    setAutoRecharge({ topUpCents: Number(v) })
                  }
                  options={[2500, 5000, 10000].map((c) => ({
                    value: String(c),
                    label: formatCents(c),
                  }))}
                  aria-label="Top-up amount"
                  className="w-full"
                />
              </Field>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader
          title="Latest transactions"
          description="Review your billing details and download your invoices. If you have any questions regarding your payments or charges, feel free to reach out to our support team."
        />
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState title="No transactions yet" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH className="w-1/4">Date</TH>
                  <TH className="w-1/4">Amount</TH>
                  <TH className="w-1/4">Payment type</TH>
                  <TH>Receipts</TH>
                </TR>
              </THead>
              <TBody>
                {transactions.map((t) => (
                  <TR key={t.id} data-transaction-id={t.id}>
                    <TD>{formatDate(t.date)}</TD>
                    <TD className="font-semibold">
                      {formatCents(t.amountCents)}
                    </TD>
                    <TD className="text-secondary-content">{t.paymentType}</TD>
                    <TD>
                      {t.receipt ? (
                        <Button
                          size="sm"
                          iconBefore={<DownloadIcon size={13} />}
                          onClick={() =>
                            toast({
                              title: "Receipt downloaded",
                              description: `${formatDate(t.date)} · ${formatCents(t.amountCents)}`,
                            })
                          }
                          data-action="download-receipt"
                        >
                          Download
                        </Button>
                      ) : (
                        <span className="text-tertiary-content text-xs">—</span>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SupportCard />
    </div>
  );
}

/* ── Billing details ───────────────────────────────────────────────── */

function BillingDetailsTab() {
  const cards = useNscaleStore((s) => s.cards);
  const details = useNscaleStore((s) => s.billingDetails);
  const [cardOpen, setCardOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader
          title="Payment cards"
          description={
            <>
              {cards.length === 0
                ? "You have no cards available"
                : `You have ${cards.length} card${cards.length === 1 ? "" : "s"} available`}
              <br />
              <span className="text-primary-content">
                Your default card is charged for credit purchases and
                auto-recharge. To remove it, make another card the default
                first.
              </span>
            </>
          }
          action={
            <Button onClick={() => setCardOpen(true)} data-action="add-card">
              Add new card
            </Button>
          }
        />
        <CardContent>
          {cards.length === 0 ? (
            <Panel className="text-secondary-content py-8 text-center text-sm">
              No payment methods found
            </Panel>
          ) : (
            <Panel className="divide-primary-border flex flex-col divide-y p-0">
              {cards.map((c) => (
                <CardRow key={c.id} card={c} />
              ))}
            </Panel>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Billing details"
          action={
            <Button
              onClick={() => setEditOpen(true)}
              data-action="edit-billing"
            >
              Edit billing details
            </Button>
          }
        />
        <CardContent>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Definition
              label="Name"
              value={
                <span className="text-primary-content font-semibold">
                  {details.name}
                </span>
              }
            />
            <Definition
              label="Email"
              value={
                <span className="text-primary-content font-semibold">
                  {details.email}
                </span>
              }
            />
            <Definition label="Address" value={details.address || "—"} />
            <Definition label="Tax ID" value={details.taxId || "—"} />
          </dl>
        </CardContent>
      </Card>

      <SupportCard />

      <AddCardModal open={cardOpen} onOpenChange={setCardOpen} />
      <EditBillingModal
        open={editOpen}
        onOpenChange={setEditOpen}
        details={details}
      />
    </div>
  );
}

function CardRow({
  card,
  compact = false,
}: {
  card: PaymentCard;
  compact?: boolean;
}) {
  const setDefault = useNscaleStore((s) => s.setDefaultCard);
  const remove = useNscaleStore((s) => s.removeCard);
  const toast = useNscaleStore((s) => s.toast);
  return (
    <div
      data-component="PaymentCardRow"
      data-card-id={card.id}
      data-default={card.isDefault || undefined}
      className={
        compact
          ? "flex items-center gap-3"
          : "flex items-center gap-3 px-5 py-4"
      }
    >
      <span className="border-primary-border bg-primary-background text-primary-content inline-flex size-9 items-center justify-center rounded-md border">
        <CardIcon size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-primary-content text-sm font-semibold">
          {card.brand} •••• {card.last4}
        </span>
        <span className="text-secondary-content text-xs">
          Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}
        </span>
      </div>
      {card.isDefault && <Badge variant="neutral">Default</Badge>}
      {!compact && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              label="Card actions"
              icon={<MoreIcon size={16} />}
              isTooltipDisabled
              data-action="open-card-actions"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={card.isDefault}
              onSelect={() => setDefault(card.id)}
              data-action="make-default-card"
            >
              Make default
            </DropdownMenuItem>
            <DropdownMenuItem
              isDanger
              disabled={card.isDefault}
              onSelect={() => {
                remove(card.id);
                toast({ title: "Card removed" });
              }}
              data-action="remove-card"
            >
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function AddCardModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addCard = useNscaleStore((s) => s.addCard);
  const toast = useNscaleStore((s) => s.toast);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const digits = number.replace(/\s+/g, "");
    const [mm, yy] = expiry.split("/").map((p) => parseInt(p, 10));
    if (digits.length < 12 || !name.trim() || !mm || !yy || cvc.length < 3) {
      setError("Check the card details — this is a demo, any test card works.");
      return;
    }
    const brand: PaymentCard["brand"] = digits.startsWith("3")
      ? "Amex"
      : digits.startsWith("5")
        ? "Mastercard"
        : "Visa";
    addCard({
      brand,
      last4: digits.slice(-4),
      expMonth: mm,
      expYear: yy < 100 ? 2000 + yy : yy,
    });
    toast({
      title: "Card added",
      description: `${brand} •••• ${digits.slice(-4)}`,
    });
    onOpenChange(false);
    setNumber("");
    setName("");
    setExpiry("");
    setCvc("");
    setError("");
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent width="small">
        <ModalHeader
          title="Add new card"
          description="Cards are tokenised by our payment provider; Nscale never stores the number."
        />
        <ModalBody className="flex flex-col gap-4 py-2">
          <Field label="Cardholder name">
            <Textfield
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Martin Vrba"
              autoFocus
            />
          </Field>
          <Field label="Card number">
            <Textfield
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              isMono
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry">
              <Textfield
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="08/29"
                isMono
              />
            </Field>
            <Field label="CVC">
              <Textfield
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                isMono
                inputMode="numeric"
              />
            </Field>
          </div>
          {error && <p className="text-error-content text-xs">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} data-action="submit-card">
            Add card
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function EditBillingModal({
  open,
  onOpenChange,
  details,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  details: BillingDetails;
}) {
  const update = useNscaleStore((s) => s.updateBillingDetails);
  const toast = useNscaleStore((s) => s.toast);
  const [form, setForm] = useState(details);
  const set =
    (k: keyof BillingDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    update(form);
    toast({ title: "Billing details updated" });
    onOpenChange(false);
  };
  return (
    <Modal
      open={open}
      onOpenChange={(o) => {
        if (o) setForm(details);
        onOpenChange(o);
      }}
    >
      <ModalContent width="medium">
        <ModalHeader
          title="Edit billing details"
          description="These appear on your invoices."
        />
        <ModalBody className="grid gap-4 py-2 sm:grid-cols-2">
          <Field label="Name">
            <Textfield value={form.name} onChange={set("name")} />
          </Field>
          <Field label="Email">
            <Textfield
              type="email"
              value={form.email}
              onChange={set("email")}
            />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <Textarea value={form.address} onChange={set("address")} rows={2} />
          </Field>
          <Field label="Tax ID" helper="VAT or company registration number.">
            <Textfield value={form.taxId} onChange={set("taxId")} isMono />
          </Field>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} data-action="save-billing">
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SupportCard() {
  return (
    <Card>
      <CardHeader
        icon={<SupportIcon size={20} />}
        title="Get support"
        description="Need assistance? Reach out to our support team for quick and effective help. We're here to answer your questions and resolve any issues you might have."
        action={
          <NextLink
            href="mailto:helpdesk@nscale.com"
            className="inline-flex"
            data-action="contact-support"
          >
            <Button tabIndex={-1}>Contact our team</Button>
          </NextLink>
        }
      />
    </Card>
  );
}
