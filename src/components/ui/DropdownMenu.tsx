"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { CheckIcon, ChevronRightIcon } from "../icons";

/**
 * DropdownMenu — Radix menu with the console's white sheet, 36px items.
 * Compose: DropdownMenu > DropdownMenuTrigger, DropdownMenuContent > Item…
 */
export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuGroup = Menu.Group;
export const DropdownMenuSub = Menu.Sub;
export const DropdownMenuRadioGroup = Menu.RadioGroup;

const sheet =
  "animate-menu-in z-50 min-w-[200px] overflow-hidden rounded-lg border border-primary-border bg-primary-background p-1 text-primary-content shadow-lg";

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof Menu.Content>) {
  return (
    <Menu.Portal>
      <Menu.Content
        data-component="DropdownMenu"
        sideOffset={sideOffset}
        className={cn(sheet, className)}
        {...props}
      />
    </Menu.Portal>
  );
}

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.SubTrigger>) {
  return (
    <Menu.SubTrigger
      data-component="DropdownMenuSubTrigger"
      className={cn(itemClass, "justify-between", className)}
      {...props}
    >
      {children}
      <ChevronRightIcon size={14} className="text-secondary-content" />
    </Menu.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof Menu.SubContent>) {
  return (
    <Menu.Portal>
      <Menu.SubContent
        data-component="DropdownMenuSubContent"
        sideOffset={8}
        className={cn(sheet, "min-w-[160px]", className)}
        {...props}
      />
    </Menu.Portal>
  );
}

const itemClass =
  "relative flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm text-primary-content outline-none select-none data-[highlighted]:bg-hover-overlay data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:shrink-0";

export interface DropdownMenuItemProps extends React.ComponentProps<
  typeof Menu.Item
> {
  icon?: React.ReactNode;
  isDanger?: boolean;
  /** Renders the row as a link. */
  href?: string;
  "data-action"?: string;
}

export function DropdownMenuItem({
  icon,
  isDanger = false,
  href,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  const body = (
    <>
      {icon && <span className="text-primary-content inline-flex">{icon}</span>}
      {children}
    </>
  );
  const classes = cn(itemClass, isDanger && "text-error-content", className);
  if (href) {
    return (
      <Menu.Item
        data-component="DropdownMenuItem"
        className={classes}
        asChild
        {...props}
      >
        <NextLink href={href}>{body}</NextLink>
      </Menu.Item>
    );
  }
  return (
    <Menu.Item data-component="DropdownMenuItem" className={classes} {...props}>
      {body}
    </Menu.Item>
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.RadioItem>) {
  return (
    <Menu.RadioItem
      data-component="DropdownMenuRadioItem"
      className={cn(itemClass, "justify-between", className)}
      {...props}
    >
      {children}
      <Menu.ItemIndicator>
        <CheckIcon size={14} />
      </Menu.ItemIndicator>
    </Menu.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Label>) {
  return (
    <Menu.Label
      className={cn(
        "text-secondary-content px-2 pt-2 pb-1 text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      className={cn("bg-primary-border my-1 h-px", className)}
      {...props}
    />
  );
}
