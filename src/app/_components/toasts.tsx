"use client";

import { Toast, ToastStack } from "@/design-system";
import { useNscaleStore } from "@/lib/store";

export function Toasts() {
  const toasts = useNscaleStore((s) => s.toasts);
  const dismiss = useNscaleStore((s) => s.dismissToast);
  if (toasts.length === 0) return null;
  return (
    <ToastStack>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          title={t.title}
          description={t.description}
          appearance={t.appearance}
          onDismiss={() => dismiss(t.id)}
        />
      ))}
    </ToastStack>
  );
}
