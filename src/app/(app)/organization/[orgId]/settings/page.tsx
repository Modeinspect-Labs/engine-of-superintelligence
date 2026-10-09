"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AddIcon,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CopyField,
  Definition,
  DeleteIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  IconButton,
  LockIcon,
  MoreIcon,
  Page,
  PageHeader,
  SettingsIcon,
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
  Textfield,
} from "@/design-system";
import { ORG, USER } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/format";
import { useNscaleStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import { useOrg } from "@/app/_components/use-org";

const TABS = ["organization", "service-tokens", "my-account"] as const;
type TabId = (typeof TABS)[number];

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  );
}

function SettingsInner() {
  const { href, orgId } = useOrg();
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("tab");
  const tab: TabId = TABS.includes(raw as TabId)
    ? (raw as TabId)
    : "organization";
  const tokens = useNscaleStore((s) => s.serviceTokens);
  const deleteToken = useNscaleStore((s) => s.deleteServiceToken);
  const toast = useNscaleStore((s) => s.toast);
  const openTokenModal = useUiStore((s) => s.setTokenModalOpen);

  return (
    <Page>
      <PageHeader
        title="Settings"
        icon={<SettingsIcon size={26} strokeWidth={2.25} />}
      />
      <Tabs
        value={tab}
        onValueChange={(v) => router.replace(href(`settings?tab=${v}`))}
      >
        <TabList>
          <Tab value="organization">Organization</Tab>
          <Tab value="service-tokens">Service Tokens</Tab>
          <Tab value="my-account">My Account</Tab>
        </TabList>

        <TabPanel value="organization" className="pt-8">
          <Card>
            <CardHeader title="General settings" />
            <CardContent>
              <div className="flex items-start gap-5">
                <Avatar
                  initials={ORG.initial}
                  size="lg"
                  variant="org"
                  name={ORG.name}
                  className="size-16 text-3xl"
                />
                <div className="grid flex-1 gap-6 md:grid-cols-[1fr_auto]">
                  <Field label="Display name" htmlFor="display-name">
                    <Textfield
                      id="display-name"
                      value={ORG.name}
                      disabled
                      readOnly
                      suffix={<LockIcon size={13} />}
                    />
                  </Field>
                  <Field label="Organization ID">
                    <CopyField value={orgId} size="md" />
                  </Field>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="service-tokens" className="pt-8">
          <Card>
            <CardHeader
              title="Service Tokens"
              action={
                <Button
                  variant="primary"
                  iconBefore={
                    <AddIcon
                      size={14}
                      className="text-primary-content-inverse"
                    />
                  }
                  onClick={() => openTokenModal(true)}
                  data-action="open-create-token"
                >
                  Add Service Token
                </Button>
              }
            />
            <CardContent>
              {tokens.length === 0 ? (
                <>
                  <Table>
                    <THead>
                      <TR>
                        <TH>Name</TH>
                        <TH>Created by</TH>
                        <TH>Created at</TH>
                        <TH>Expiry date</TH>
                      </TR>
                    </THead>
                  </Table>
                  <EmptyState title="Nothing to show" />
                </>
              ) : (
                <Table>
                  <THead>
                    <TR>
                      <TH className="w-[22%]">Name</TH>
                      <TH className="w-[26%]">Created by</TH>
                      <TH className="w-[22%]">Created at</TH>
                      <TH>Expiry date</TH>
                      <TH className="w-12" />
                    </TR>
                  </THead>
                  <TBody>
                    {tokens.map((t) => (
                      <TR key={t.id} data-token-id={t.id}>
                        <TD>
                          <span className="flex flex-col">
                            <span className="font-semibold">{t.name}</span>
                            <span className="text-secondary-content font-mono text-xs">
                              {t.prefix}…
                            </span>
                          </span>
                        </TD>
                        <TD className="text-secondary-content">
                          {t.createdBy}
                        </TD>
                        <TD>{formatDateTime(t.createdAt)}</TD>
                        <TD>
                          {t.expiresAt ? (
                            formatDate(t.expiresAt)
                          ) : (
                            <span className="text-secondary-content">
                              Never
                            </span>
                          )}
                        </TD>
                        <TD className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <IconButton
                                label="Token actions"
                                icon={<MoreIcon size={16} />}
                                isTooltipDisabled
                                data-action="open-token-actions"
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                isDanger
                                icon={
                                  <DeleteIcon
                                    size={16}
                                    className="text-error-content"
                                  />
                                }
                                onSelect={() => {
                                  deleteToken(t.id);
                                  toast({
                                    title: "Token revoked",
                                    description: t.name,
                                  });
                                }}
                                data-action="revoke-token"
                              >
                                Revoke token
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="my-account" className="flex flex-col gap-4 pt-8">
          <Card>
            <CardHeader title="My profile" />
            <CardContent>
              <div className="flex items-start gap-5">
                <Avatar
                  initials={USER.initials}
                  size="lg"
                  variant="user"
                  name={USER.name}
                  className="size-16 text-2xl"
                />
                <Field
                  label="Preferred name"
                  htmlFor="preferred-name"
                  className="w-64"
                >
                  <Textfield
                    id="preferred-name"
                    value={USER.name}
                    disabled
                    readOnly
                    suffix={<LockIcon size={13} />}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Account Security" />
            <CardContent>
              <dl>
                <Definition
                  label="Email"
                  value={
                    <span className="flex flex-col gap-1">
                      <span>{USER.email}</span>
                      <span className="text-tertiary-content text-xs">
                        Managed by Google
                      </span>
                    </span>
                  }
                />
              </dl>
            </CardContent>
          </Card>
        </TabPanel>
      </Tabs>
    </Page>
  );
}
