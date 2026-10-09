"use client";

import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { Kbd } from "../ui/Kbd";
import { SearchIcon } from "../icons";

/**
 * SideNavigation — the console's 240px left rail: logo, search trigger,
 * primary links, a spacer, then the utility links and the org switcher.
 * Collapsed, it narrows to 56px and shows icons only.
 */
export interface SideNavigationProps extends React.ComponentProps<"nav"> {
  isCollapsed?: boolean;
}

export function SideNavigation({
  isCollapsed = false,
  className,
  children,
  ...props
}: SideNavigationProps) {
  return (
    <nav
      data-component="SideNavigation"
      data-state={isCollapsed ? "collapsed" : "expanded"}
      aria-label="Primary"
      className={cn(
        "border-primary-border bg-secondary-background sticky top-0 flex h-dvh shrink-0 flex-col gap-1 border-r p-2 transition-[width] duration-(--duration-medium)",
        isCollapsed ? "w-14" : "w-60",
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

export interface NavItemProps extends Omit<
  React.ComponentProps<typeof NextLink>,
  "href"
> {
  href?: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  isExternal?: boolean;
  /** Trailing content (a count, a chevron). */
  trailing?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const itemBase =
  "flex h-[38px] w-full items-center gap-2 rounded-lg border px-2 text-left text-sm font-semibold text-primary-content outline-none transition-colors duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-primary-core [&_svg]:shrink-0";

/** NavItem — 38px row; the active page gets the bordered secondary pill. */
export function NavItem({
  href,
  icon,
  label,
  isActive = false,
  isCollapsed = false,
  isExternal = false,
  trailing,
  className,
  onClick,
  ...props
}: NavItemProps) {
  const classes = cn(
    itemBase,
    isActive
      ? "border-primary-border bg-secondary-background shadow-xs"
      : "border-transparent hover:bg-hover-overlay",
    isCollapsed && "justify-center px-0",
    className,
  );
  const body = (
    <>
      <span className="text-primary-content inline-flex">{icon}</span>
      {!isCollapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!isCollapsed && trailing}
    </>
  );
  if (!href) {
    const buttonProps = props as unknown as React.ComponentProps<"button">;
    return (
      <button
        type="button"
        data-component="NavItem"
        data-active={isActive || undefined}
        aria-label={isCollapsed ? label : undefined}
        className={classes}
        onClick={onClick}
        {...buttonProps}
      >
        {body}
      </button>
    );
  }
  return (
    <NextLink
      data-component="NavItem"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      aria-label={isCollapsed ? label : undefined}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={classes}
      onClick={onClick}
      {...props}
    >
      {body}
    </NextLink>
  );
}

/** NavSearchButton — the bordered "Search ⌘K" trigger under the logo. */
export function NavSearchButton({
  isCollapsed = false,
  onClick,
}: {
  isCollapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-component="NavSearchButton"
      data-action="open-search"
      aria-label="Search"
      onClick={onClick}
      className={cn(
        "border-primary-border text-primary-content hover:bg-hover-overlay focus-visible:outline-primary-core flex h-[38px] w-full items-center gap-2 rounded-lg border px-2 text-sm font-semibold transition-colors duration-(--duration-fast) outline-none focus-visible:outline-2",
        isCollapsed && "justify-center px-0",
      )}
    >
      <SearchIcon size={16} className="text-primary-content" />
      {!isCollapsed && (
        <>
          <span className="text-tertiary-content flex-1 text-left font-normal">
            Search
          </span>
          <Kbd>⌘K</Kbd>
        </>
      )}
    </button>
  );
}

/** NavGroup — vertical stack of items; `grow` pushes the footer down. */
export function NavGroup({
  grow = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { grow?: boolean }) {
  return (
    <div
      data-component="NavGroup"
      className={cn(
        "flex flex-col gap-0.5 bg-inherit",
        grow && "flex-1",
        className,
      )}
      {...props}
    />
  );
}
