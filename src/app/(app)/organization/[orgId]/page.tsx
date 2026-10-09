"use client";

import NextLink from "next/link";
import {
  ArrowRightIcon,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CloudIllustration,
  DonutChart,
  EmptyState,
  GetStartedTile,
  LegendRow,
  OnboardingStep,
  Page,
  PageHeader,
  Panel,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from "@/design-system";
import { ORG, TODAY } from "@/lib/data";
import { formatCents, formatDate, formatUsd } from "@/lib/format";
import { allUsage, totalCost, usageByModel, usageSince } from "@/lib/selectors";
import { useNscaleStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import { useOrg } from "@/app/_components/use-org";

export default function DashboardPage() {
  const { href } = useOrg();
  const creditCents = useNscaleStore((s) => s.creditCents);
  const transactions = useNscaleStore((s) => s.transactions);
  const usageEvents = useNscaleStore((s) => s.usageEvents);
  const onboarding = useNscaleStore((s) => s.onboarding);
  const redeemed = useNscaleStore((s) => s.freeCreditRedeemed);
  const redeem = useNscaleStore((s) => s.redeemFreeCredit);
  const openTokenModal = useUiStore((s) => s.setTokenModalOpen);

  const since = new Date(TODAY);
  since.setUTCFullYear(since.getUTCFullYear() - 1);
  const year = usageSince(allUsage(usageEvents), since);
  const yearTotal = totalCost(year);
  const byModel = usageByModel(year).slice(0, 5);
  const allDone = onboarding.credit && onboarding.token && onboarding.endpoint;

  return (
    <Page>
      <PageHeader
        title={ORG.name}
        icon={
          <Avatar
            initials={ORG.initial}
            size="md"
            variant="org"
            name={ORG.name}
          />
        }
      />

      {!redeemed && (
        <Card
          variant="inverse"
          padding="even"
          className="flex-row items-center justify-between gap-6"
          data-component="CreditBanner"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl leading-8 font-semibold">
              Free $5 credit!
            </h2>
            <p className="text-banner-content-muted text-sm">
              To help you get started, we&apos;ve given you a helping hand.
            </p>
          </div>
          <Button
            variant="inverse"
            onClick={redeem}
            data-action="redeem-credit"
          >
            Redeem credit
          </Button>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Welcome to the product dashboard"
          description={
            allDone
              ? "You're all set — every onboarding task is complete."
              : "Complete your onboarding by finishing these tasks."
          }
        />
        <CardContent>
          <div className="grid gap-5 lg:grid-cols-3">
            <OnboardingStep
              step={1}
              title="Add credit to your account"
              description="Load up your account with credit, which can then be used to provision Nscale services."
              isDone={onboarding.credit}
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
                  data-action="go-add-credit"
                  onClick={() =>
                    (window.location.href = href(
                      "usage-and-billing?tab=credit",
                    ))
                  }
                >
                  Add credit
                </Button>
              }
            />
            <OnboardingStep
              step={2}
              title="Create a Service Token"
              description="Provide API level access to your organization for command line automation."
              isDone={onboarding.token}
              action={
                <Button
                  size="sm"
                  iconAfter={<ArrowRightIcon size={14} />}
                  onClick={() => openTokenModal(true)}
                  data-action="open-create-token"
                >
                  Create Service Token
                </Button>
              }
            />
            <OnboardingStep
              step={3}
              title="Call your first endpoint"
              description="Access and run popular models hosted by Nscale with our serverless inference platform."
              isDone={onboarding.endpoint}
              action={
                <NextLink
                  href={href("serverless")}
                  data-action="go-endpoints"
                  className="inline-flex"
                >
                  <Button
                    size="sm"
                    iconAfter={<ArrowRightIcon size={14} />}
                    tabIndex={-1}
                  >
                    View endpoints
                  </Button>
                </NextLink>
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="AI services usage" description="Last 12 months" />
          <CardContent>
            <Panel className="border-secondary-border bg-primary-background flex items-center gap-8">
              <DonutChart value={yearTotal} total={yearTotal} />
              <div className="flex-1">
                <LegendRow
                  label="Serverless inference"
                  value={formatUsd(yearTotal)}
                />
              </div>
            </Panel>
            {byModel.length === 0 ? (
              <EmptyState title="Nothing to show" />
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Resource</TH>
                    <TH>Developer</TH>
                    <TH>Type</TH>
                    <TH className="text-right">Spend</TH>
                  </TR>
                </THead>
                <TBody>
                  {byModel.map((row) => (
                    <TR
                      key={row.modelId}
                      isClickable
                      onClick={() =>
                        (window.location.href = href(
                          `serverless/${encodeURIComponent(row.modelId)}`,
                        ))
                      }
                      data-model-id={row.modelId}
                    >
                      <TD className="font-semibold">{row.name}</TD>
                      <TD>{row.developer}</TD>
                      <TD>{row.type}</TD>
                      <TD className="text-right">{formatUsd(row.costUsd)}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
          <CardFooter>
            <NextLink
              href={href("usage-and-billing")}
              className="inline-flex"
              data-action="view-all-usage"
            >
              <Button
                variant="ghost"
                iconAfter={<ArrowRightIcon size={14} />}
                tabIndex={-1}
              >
                View all usage
              </Button>
            </NextLink>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader
              title="Billing"
              action={
                <NextLink
                  href={href("usage-and-billing?tab=billing-details")}
                  className="inline-flex"
                  data-action="go-billing"
                >
                  <Button
                    iconAfter={<ArrowRightIcon size={14} />}
                    tabIndex={-1}
                  >
                    Go to billing
                  </Button>
                </NextLink>
              }
            />
            <CardContent>
              <Panel className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-primary-content text-lg font-semibold">
                      Credit balance
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-sm font-normal"
                      data-component="CreditBalance"
                    >
                      {formatCents(creditCents)}
                    </Badge>
                  </div>
                  <NextLink
                    href={href("usage-and-billing?tab=credit")}
                    className="inline-flex"
                    data-action="go-add-credit"
                  >
                    <Button tabIndex={-1}>Add credit</Button>
                  </NextLink>
                </div>
                <p className="text-secondary-content text-sm">
                  To use our services, you&apos;ll need to top up your credit.
                  Please note that you can only use credit for inference,
                  you&apos;ll need to purchase a plan to provision AI compute.
                </p>
              </Panel>
              {transactions.length === 0 ? (
                <EmptyState title="No transactions yet" />
              ) : (
                <Table>
                  <THead>
                    <TR>
                      <TH>Date</TH>
                      <TH>Amount</TH>
                      <TH>Payment type</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {transactions.slice(0, 4).map((t) => (
                      <TR key={t.id}>
                        <TD>{formatDate(t.date)}</TD>
                        <TD className="font-semibold">
                          {formatCents(t.amountCents)}
                        </TD>
                        <TD className="text-secondary-content">
                          {t.paymentType}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <NextLink
                href={href("usage-and-billing?tab=credit")}
                className="inline-flex"
                data-action="view-all-transactions"
              >
                <Button
                  variant="ghost"
                  iconAfter={<ArrowRightIcon size={14} />}
                  tabIndex={-1}
                >
                  View all transactions
                </Button>
              </NextLink>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader title="Get started" />
            <CardContent>
              <GetStartedTile
                illustration={
                  <CloudIllustration
                    size={60}
                    className="text-resources-serverless"
                  />
                }
                title="Get started with Serverless"
                description="Simple, ready-to-use inference endpoints that are paid for per request. No commitments, only pay for what you use with Nscale Serverless."
                action={
                  <NextLink
                    href={href("serverless")}
                    className="inline-flex"
                    data-action="view-models"
                  >
                    <Button size="sm" tabIndex={-1}>
                      View Models
                    </Button>
                  </NextLink>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  );
}
