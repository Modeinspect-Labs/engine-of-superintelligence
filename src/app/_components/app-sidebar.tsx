"use client";

import {
  Avatar,
  BareMetalIcon,
  BellIcon,
  CloudIcon,
  CollapseNavIcon,
  DocsIcon,
  DollarIcon,
  ExpandNavIcon,
  FeedbackIcon,
  HomeIcon,
  IconButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  MoonIcon,
  NavGroup,
  NavItem,
  NavSearchButton,
  NotificationPanel,
  NscaleLogo,
  NscaleMark,
  ResetIcon,
  SelectorIcon,
  SettingsIcon,
  SideNavigation,
  SignOutIcon,
  SunIcon,
  SupportIcon,
  ThemeIcon,
  TokenIcon,
  WorkbenchIcon,
} from "@/design-system";
import { ORG, USER } from "@/lib/data";
import { relativeTime } from "@/lib/format";
import { useNscaleStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import type { Theme } from "@/lib/types";
import { useOrg } from "./use-org";

export function AppSidebar() {
  const { href, isActive } = useOrg();
  const collapsed = useNscaleStore((s) => s.navCollapsed);
  const setCollapsed = useNscaleStore((s) => s.setNavCollapsed);
  const notifications = useNscaleStore((s) => s.notifications);
  const markRead = useNscaleStore((s) => s.markNotificationsRead);
  const theme = useNscaleStore((s) => s.theme);
  const setTheme = useNscaleStore((s) => s.setTheme);
  const resetDemo = useNscaleStore((s) => s.resetDemo);
  const toast = useNscaleStore((s) => s.toast);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <SideNavigation isCollapsed={collapsed}>
      <div className="group/logo flex h-8 items-center justify-between px-1">
        <a
          href={href()}
          aria-label="Nscale home"
          className="text-primary-content inline-flex"
        >
          {collapsed ? <NscaleMark size={26} /> : <NscaleLogo height={14} />}
        </a>
        {!collapsed && (
          <IconButton
            size="xs"
            variant="secondary"
            label="Collapse navigation"
            icon={<CollapseNavIcon size={12} />}
            onClick={() => setCollapsed(true)}
            data-action="toggle-sidebar"
            className="opacity-0 transition-opacity group-hover/logo:opacity-100 focus-visible:opacity-100"
          />
        )}
      </div>
      {collapsed && (
        <IconButton
          size="xs"
          variant="secondary"
          label="Expand navigation"
          icon={<ExpandNavIcon size={12} />}
          onClick={() => setCollapsed(false)}
          data-action="toggle-sidebar"
          className="mx-auto"
        />
      )}
      <div className="pt-1 pb-2">
        <NavSearchButton
          isCollapsed={collapsed}
          onClick={() => setSearchOpen(true)}
        />
      </div>
      <NavGroup grow>
        <NavItem
          href={href()}
          icon={<HomeIcon size={16} />}
          label="Dashboard"
          isActive={isActive()}
          isCollapsed={collapsed}
        />
        <NavItem
          href={href("workbench")}
          icon={<WorkbenchIcon size={16} />}
          label="Workbench"
          isActive={isActive("workbench")}
          isCollapsed={collapsed}
        />
        <NavItem
          href={href("serverless")}
          icon={<CloudIcon size={16} />}
          label="Models"
          isActive={isActive("serverless")}
          isCollapsed={collapsed}
        />
        <NavItem
          href={href("gpu-clusters")}
          icon={<BareMetalIcon size={16} />}
          label="Bare Metal"
          isActive={isActive("gpu-clusters")}
          isCollapsed={collapsed}
        />
      </NavGroup>
      <NavGroup>
        <NavItem
          href="https://docs.nscale.com"
          isExternal
          icon={<DocsIcon size={16} />}
          label="Docs"
          isCollapsed={collapsed}
        />
        <NavItem
          href="mailto:helpdesk@nscale.com"
          icon={<SupportIcon size={16} />}
          label="Support"
          isCollapsed={collapsed}
        />
        <NavItem
          href="https://nscale.canny.io/"
          isExternal
          icon={<FeedbackIcon size={16} />}
          label="Give feedback"
          isCollapsed={collapsed}
        />
        <NotificationPanel
          onClose={markRead}
          items={notifications.map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            when: relativeTime(n.createdAt),
            read: n.read,
          }))}
          trigger={
            <NavItem
              icon={<BellIcon size={16} />}
              label="Notifications"
              isCollapsed={collapsed}
              data-action="open-notifications"
              trailing={
                unread > 0 ? (
                  <span className="bg-resources-serverless text-primary-content-inverse inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold">
                    {unread}
                  </span>
                ) : undefined
              }
            />
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-component="OrgSwitcher"
              data-action="open-org-menu"
              aria-label={ORG.name}
              className={`text-primary-content hover:bg-hover-overlay focus-visible:outline-primary-core data-[state=open]:bg-hover-overlay flex h-9 w-full items-center gap-3 rounded-lg border border-transparent px-[5px] text-sm font-semibold outline-none focus-visible:outline-2 ${collapsed ? "justify-center" : ""}`}
            >
              <Avatar
                initials={ORG.initial}
                size="xs"
                variant="org"
                name={ORG.name}
              />
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1 truncate text-left">
                    {ORG.name}
                  </span>
                  <SelectorIcon size={14} className="text-secondary-content" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={10}
            className="w-[208px]"
          >
            <DropdownMenuItem
              href={href("settings?tab=my-account")}
              data-action="open-my-account"
              icon={
                <Avatar
                  initials={USER.initials}
                  size="sm"
                  variant="org"
                  name={USER.name}
                />
              }
              className="h-12"
            >
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-semibold">{USER.name}</span>
                <span className="text-secondary-content truncate text-xs">
                  {USER.email}
                </span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              href={href("settings?tab=service-tokens")}
              data-action="open-service-tokens"
              icon={<TokenIcon size={16} />}
            >
              Service tokens
            </DropdownMenuItem>
            <DropdownMenuItem
              href={href("usage-and-billing")}
              data-action="open-billing"
              icon={<DollarIcon size={16} />}
            >
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem
              href={href("settings?tab=organization")}
              data-action="open-settings"
              icon={<SettingsIcon size={16} />}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="inline-flex items-center gap-2.5">
                  <ThemeIcon size={16} />
                  Theme
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(v) => setTheme(v as Theme)}
                >
                  <DropdownMenuRadioItem
                    value="light"
                    data-action="set-theme-light"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <SunIcon size={16} />
                      Light
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="dark"
                    data-action="set-theme-dark"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <MoonIcon size={16} />
                      Dark
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="system"
                    data-action="set-theme-system"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <ThemeIcon size={16} />
                      System
                    </span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              icon={<ResetIcon size={16} />}
              onSelect={resetDemo}
              data-action="reset-demo"
            >
              Reset demo data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              icon={<SignOutIcon size={16} />}
              onSelect={() =>
                toast({
                  title: "Signed out",
                  description: "This is a demo — you're still here.",
                })
              }
              data-action="sign-out"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavGroup>
    </SideNavigation>
  );
}
