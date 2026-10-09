"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { CloseIcon } from "../icons";
import { IconButton } from "./IconButton";

export type ModalWidth = "small" | "medium" | "large";

const widths: Record<ModalWidth, string> = {
  small: "max-w-[440px]",
  medium: "max-w-[560px]",
  large: "max-w-[760px]",
};

/**
 * Modal — dialog on a dimmed overlay. Compose:
 *   <Modal open onOpenChange><ModalContent width="medium">
 *     <ModalHeader title description/><ModalBody/><ModalFooter/>
 */
export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export interface ModalContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Content
> {
  width?: ModalWidth;
  hideClose?: boolean;
}

export function ModalContent({
  width = "medium",
  hideClose = false,
  className,
  children,
  ...props
}: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-component="Overlay"
        className="animate-fade-in bg-overlay fixed inset-0 z-50"
      />
      <DialogPrimitive.Content
        data-component="Modal"
        data-width={width}
        className={cn(
          "animate-modal-in border-primary-border bg-primary-background text-primary-content fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-64px)] w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl border shadow-xl outline-none",
          widths[width],
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close asChild>
            <IconButton
              label="Close"
              icon={<CloseIcon size={16} />}
              className="absolute top-5 right-5"
              isTooltipDisabled
            />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function ModalHeader({
  title,
  description,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-2 px-6 pt-6 pr-14 pb-4",
        className,
      )}
      {...props}
    >
      <DialogPrimitive.Title className="text-primary-content text-lg font-semibold">
        {title}
      </DialogPrimitive.Title>
      {description ? (
        <DialogPrimitive.Description className="text-secondary-content text-sm">
          {description}
        </DialogPrimitive.Description>
      ) : (
        <DialogPrimitive.Description className="sr-only">
          {title}
        </DialogPrimitive.Description>
      )}
    </div>
  );
}

export function ModalBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto bg-inherit px-6 py-2",
        className,
      )}
      {...props}
    />
  );
}

export function ModalFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 px-6 pt-4 pb-6",
        className,
      )}
      {...props}
    />
  );
}
