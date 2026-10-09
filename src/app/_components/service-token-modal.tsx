"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  CopyField,
  Field,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Textfield,
} from "@/design-system";
import { useNscaleStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";

const EXPIRY = [
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "1 year" },
  { value: "never", label: "No expiry" },
];

/**
 * Add Service Token — name + expiry, then the one-time reveal of the
 * secret. Opened from Settings and the dashboard checklist.
 */
export function ServiceTokenModal() {
  const open = useUiStore((s) => s.tokenModalOpen);
  const setOpen = useUiStore((s) => s.setTokenModalOpen);
  const create = useNscaleStore((s) => s.createServiceToken);
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("90");
  const [error, setError] = useState("");
  const [secret, setSecret] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setExpiry("90");
      setError("");
      setSecret(null);
    }, 200);
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a name for the token.");
      return;
    }
    const expiresAt =
      expiry === "never"
        ? null
        : new Date(Date.now() + Number(expiry) * 86_400_000).toISOString();
    const result = create(trimmed, expiresAt);
    setSecret(result.secret);
  };

  return (
    <Modal open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <ModalContent width="small">
        {secret ? (
          <>
            <ModalHeader
              title="Service token created"
              description={`Copy the token for ${name.trim()} now. For security it won't be shown again.`}
            />
            <ModalBody className="flex flex-col gap-4 py-2">
              <CopyField
                value={secret}
                size="md"
                className="w-full"
                data-component="ServiceTokenSecret"
              />
              <Alert
                variant="warning"
                title="Store this token securely"
                description="Anyone with it can call your endpoints and spend your credit."
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="primary"
                onClick={close}
                data-action="token-done"
              >
                Done
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader
              title="Add Service Token"
              description="Service tokens give API access to your organization for CLI and CI automation."
            />
            <ModalBody className="flex flex-col gap-4 py-2">
              <Field label="Name" error={error}>
                <Textfield
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="ci-pipeline"
                  isInvalid={!!error}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </Field>
              <Field
                label="Expiry"
                helper="Expired tokens stop working immediately."
              >
                <Select
                  value={expiry}
                  onValueChange={setExpiry}
                  options={EXPIRY}
                  aria-label="Expiry"
                  className="w-full"
                />
              </Field>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={submit}
                data-action="submit-token"
              >
                Create token
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
