"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import {
  Alert,
  Badge,
  Button,
  ChatComposer,
  ChatMessage,
  CodeBlock,
  CodeIcon,
  CompactHeader,
  CompareIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ExternalLinkIcon,
  Field,
  IconButton,
  InfoIcon,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModelPicker,
  MoreIcon,
  ParameterControl,
  ParametersIcon,
  PresetPicker,
  ResetIcon,
  Textarea,
  Textfield,
  ToolbarButton,
  Tooltip,
  TypingIndicator,
  WorkbenchIcon,
  cn,
  type PickerOption,
} from "@/design-system";
import { estimateTokens } from "@/lib/chat";
import { askModel } from "@/lib/chat-client";
import { workbenchSamples } from "@/lib/code-samples";
import { MODELS, modelById } from "@/lib/data";
import { formatPrice, formatTokens, formatUsd } from "@/lib/format";
import { uid, useNscaleStore } from "@/lib/store";
import type { ChatMessage as Message, Model } from "@/lib/types";
import { useOrg } from "@/app/_components/use-org";

const PARAMS = [
  {
    key: "temperature",
    label: "Temperature",
    min: 0,
    max: 2,
    step: 0.1,
    about:
      "Higher values make the output more random; lower values make it more focused and deterministic.",
  },
  {
    key: "topP",
    label: "Top P",
    min: 0,
    max: 1,
    step: 0.05,
    about:
      "Nucleus sampling: only tokens within the top P probability mass are considered.",
  },
  {
    key: "maxTokens",
    label: "Max Tokens",
    min: 1,
    max: 16384,
    step: 1,
    about: "The maximum number of tokens the model may generate in a reply.",
  },
  {
    key: "presencePenalty",
    label: "Presence Penalty",
    min: -2,
    max: 2,
    step: 0.1,
    about: "Positive values encourage the model to talk about new topics.",
  },
  {
    key: "frequencyPenalty",
    label: "Frequency Penalty",
    min: -2,
    max: 2,
    step: 0.1,
    about:
      "Positive values discourage the model from repeating the same lines.",
  },
] as const;

const MIN_BALANCE_CENTS = 100;

function modelOptions(): PickerOption[] {
  const order = [
    "Image-Text-to-Text",
    "Text Generation",
    "Embeddings",
    "Text-to-Image",
  ];
  return [...MODELS]
    .filter((m) => m.type !== "Embeddings" && m.type !== "Text-to-Image")
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
    .map((m) => ({
      value: m.id,
      label: m.name,
      group: m.type === "Image-Text-to-Text" ? "Image-Text to Text" : m.type,
    }));
}

export default function WorkbenchPage() {
  const { href } = useOrg();
  const s = useNscaleStore();
  const model = modelById(s.modelId) ?? MODELS[1];
  const compareModel = modelById(s.compare.modelId) ?? MODELS[3];
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState<{ main: boolean; compare: boolean }>({
    main: false,
    compare: false,
  });
  const [codeOpen, setCodeOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const options = useMemo(() => modelOptions(), []);
  const lowBalance = s.creditCents < MIN_BALANCE_CENTS;
  const busy = loading.main || loading.compare;

  const lastUser =
    [...s.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const run = async (
    target: Model,
    column: "main" | "compare",
    history: Message[],
    prompt: string,
  ) => {
    const req = {
      modelId: target.id,
      modelName: target.name,
      developer: target.developer,
      system: s.systemPrompt,
      params: s.params,
      messages: [
        ...history
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: prompt },
      ],
    };
    const { text, scripted } = await askModel(req);
    const inputTokens = estimateTokens(
      req.messages.map((m) => m.content).join(" ") + s.systemPrompt,
    );
    const outputTokens = estimateTokens(text);
    const costUsd = useNscaleStore
      .getState()
      .recordUsage(target.id, inputTokens, outputTokens);
    useNscaleStore.getState().appendMessage(
      {
        id: uid("msg"),
        role: "assistant",
        content: text,
        modelId: target.id,
        createdAt: new Date().toISOString(),
        usage: { inputTokens, outputTokens, costUsd },
        scripted,
      },
      column,
    );
  };

  const submit = async () => {
    const prompt = draft.trim();
    if (!prompt || lowBalance || busy) return;
    setDraft("");
    const base = {
      id: uid("msg"),
      role: "user" as const,
      content: prompt,
      createdAt: new Date().toISOString(),
    };
    s.appendMessage({ ...base, modelId: model.id }, "main");
    if (s.compare.enabled)
      s.appendMessage(
        { ...base, id: uid("msg"), modelId: compareModel.id },
        "compare",
      );
    setLoading({ main: true, compare: s.compare.enabled });
    const jobs = [
      run(model, "main", s.messages, prompt).finally(() =>
        setLoading((l) => ({ ...l, main: false })),
      ),
    ];
    if (s.compare.enabled)
      jobs.push(
        run(compareModel, "compare", s.compare.messages, prompt).finally(() =>
          setLoading((l) => ({ ...l, compare: false })),
        ),
      );
    await Promise.all(jobs);
  };

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    s.savePreset(name);
    setPresetName("");
    setPresetOpen(false);
  };

  return (
    <div
      data-component="WorkbenchLayout"
      className="bg-secondary-background flex h-dvh flex-col"
    >
      <CompactHeader
        eyebrow="Serverless"
        title="Workbench"
        icon={<WorkbenchIcon size={18} />}
        action={
          <>
            <ToolbarButton
              icon={<ResetIcon size={14} />}
              onClick={s.resetChat}
              data-action="reset-chat"
            >
              Reset chat
            </ToolbarButton>
            <ToolbarButton
              icon={<CompareIcon size={14} />}
              isActive={s.compare.enabled}
              onClick={() => s.setCompare(!s.compare.enabled)}
              data-action="toggle-compare"
            >
              Compare
            </ToolbarButton>
            <ToolbarButton
              icon={<CodeIcon size={14} />}
              onClick={() => setCodeOpen(true)}
              data-action="view-code"
            >
              View code
            </ToolbarButton>
          </>
        }
      />

      <div className="bg-secondary-background flex min-h-0 flex-1 gap-4 p-4 pl-6">
        <div
          className={cn(
            "grid min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-4",
            s.compare.enabled ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          <ChatColumn
            isCompact={s.compare.enabled}
            model={model}
            messages={s.messages}
            isLoading={loading.main}
            header={
              <PresetPicker
                value={s.activePresetId}
                options={s.presets.map((p) => ({
                  value: p.id,
                  label: p.name,
                  detail: modelById(p.modelId)?.name,
                }))}
                onChange={s.selectPreset}
                footer={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setPresetOpen(true)}
                    data-action="open-save-preset"
                  >
                    Save current settings as preset
                  </Button>
                }
              />
            }
            onViewCode={() => setCodeOpen(true)}
            detailsHref={href(`serverless/${encodeURIComponent(model.id)}`)}
          />
          {s.compare.enabled && (
            <ChatColumn
              isCompact
              model={compareModel}
              messages={s.compare.messages}
              isLoading={loading.compare}
              header={
                <ModelPicker
                  value={compareModel.id}
                  options={options}
                  onChange={s.setCompareModel}
                  className="w-72"
                />
              }
              onViewCode={() => setCodeOpen(true)}
              detailsHref={href(
                `serverless/${encodeURIComponent(compareModel.id)}`,
              )}
            />
          )}
          <div
            className={cn(
              "col-span-full mx-auto flex w-full max-w-[680px] flex-col gap-4",
              s.compare.enabled && "max-w-none",
            )}
          >
            {lowBalance && (
              <Alert
                variant="warning"
                title="You need at least $1 to interact with models"
                description={
                  <>
                    To learn how usage is billed in the workbench{" "}
                    <Link
                      href="https://docs.nscale.com/docs/manage/monitoring-usage"
                      isExternal
                      className="text-sm"
                    >
                      view the docs
                    </Link>
                    .
                  </>
                }
                action={
                  <NextLink
                    href={href("usage-and-billing?tab=credit")}
                    className="text-primary-content text-sm font-semibold"
                    data-action="go-add-credit"
                  >
                    Add credit
                  </NextLink>
                }
              />
            )}
            <ChatComposer
              value={draft}
              onChange={setDraft}
              onSubmit={submit}
              disabled={lowBalance || busy}
              isLoading={busy}
            />
          </div>
        </div>

        <aside
          data-component="ParametersPanel"
          className="border-primary-border bg-primary-background flex w-[332px] shrink-0 flex-col overflow-hidden rounded-xl border shadow-xs"
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-primary-content text-base font-semibold">
              Parameters
            </h2>
            <Tooltip content="Parameters">
              <button
                type="button"
                aria-label="Parameters"
                className="text-primary-content inline-flex"
              >
                <ParametersIcon size={14} />
              </button>
            </Tooltip>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto bg-inherit px-5 pt-6 pb-6">
            <Field label="Select model">
              <ModelPicker
                value={model.id}
                options={options}
                onChange={s.setModel}
              />
            </Field>
            <Field label="System prompt">
              <Textarea
                value={s.systemPrompt}
                onChange={(e) => s.setSystemPrompt(e.target.value)}
                placeholder="Enter a system prompt"
                rows={3}
                data-action="edit-system-prompt"
              />
            </Field>
            {PARAMS.map((p) => (
              <ParameterControl
                key={p.key}
                label={p.label}
                about={p.about}
                min={p.min}
                max={p.max}
                step={p.step}
                value={s.params[p.key]}
                onChange={(v) => s.setParams({ [p.key]: v })}
              />
            ))}
          </div>
          <div className="border-primary-border flex items-center justify-center border-t bg-inherit px-5 py-3">
            <Link
              href="https://docs.nscale.com/docs/ai-services/workbench"
              isExternal
              variant="action"
              className="text-sm"
            >
              Learn about presets
            </Link>
          </div>
        </aside>
      </div>

      <Modal open={codeOpen} onOpenChange={setCodeOpen}>
        <ModalContent width="medium">
          <ModalHeader
            title="View code"
            description={
              <>
                This uses your chat configuration. To use in your application,
                please configure the parameters to your preferences, and change
                the NSCALE_SERVICE_TOKEN to your{" "}
                <Link href={href("settings?tab=service-tokens")}>
                  Service token
                </Link>
                .
              </>
            }
          />
          <ModalBody>
            <CodeBlock
              samples={workbenchSamples(
                model,
                s.systemPrompt,
                s.params,
                lastUser,
              )}
              collapsedLines={12}
              defaultCollapsed
            />
          </ModalBody>
          <ModalFooter>
            <NextLink
              href={href("settings?tab=service-tokens")}
              className="inline-flex"
              data-action="manage-tokens"
            >
              <Button variant="ghost" tabIndex={-1}>
                Manage Service Tokens
              </Button>
            </NextLink>
            <Button
              variant="ghost"
              onClick={() => setCodeOpen(false)}
              data-action="code-done"
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={presetOpen} onOpenChange={setPresetOpen}>
        <ModalContent width="small">
          <ModalHeader
            title="Save preset"
            description="Stores the current model, system prompt and parameters."
          />
          <ModalBody>
            <Field label="Preset name">
              <Textfield
                autoFocus
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="my-preset"
                onKeyDown={(e) => e.key === "Enter" && savePreset()}
              />
            </Field>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setPresetOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={savePreset}
              disabled={!presetName.trim()}
              data-action="save-preset"
            >
              Save preset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function ChatColumn({
  model,
  messages,
  isLoading,
  header,
  onViewCode,
  detailsHref,
  isCompact = false,
}: {
  model: Model;
  messages: Message[];
  isLoading: boolean;
  header: React.ReactNode;
  onViewCode: () => void;
  detailsHref: string;
  isCompact?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages.length, isLoading]);

  return (
    <section
      data-component="ChatColumn"
      data-model-id={model.id}
      className="bg-secondary-background flex min-h-0 flex-col"
    >
      <div className="flex items-center justify-between gap-4 pb-2">
        {header}
        <div className="flex items-center gap-3">
          <Badge variant="serverless">Serverless</Badge>
          {!isCompact && (
            <span className="text-secondary-content text-xs whitespace-nowrap">
              {formatPrice(model.priceInput, model.priceOutput)}
            </span>
          )}
          {!isCompact && (
            <Tooltip content={model.license}>
              <span className="text-secondary-content inline-flex items-center gap-1 text-xs whitespace-nowrap">
                Licenses <InfoIcon size={13} />
              </span>
            </Tooltip>
          )}
          <span className="bg-primary-border h-5 w-px" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                label="Resource actions"
                icon={<MoreIcon size={16} />}
                isTooltipDisabled
                data-action="open-resource-actions"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                href={detailsHref}
                data-action="view-model-details"
                icon={<ExternalLinkIcon size={16} />}
              >
                View model details
              </DropdownMenuItem>
              <DropdownMenuItem
                icon={<CodeIcon size={16} />}
                onSelect={onViewCode}
                data-action="view-code"
              >
                View code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        ref={scroller}
        className="bg-secondary-background flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-4"
      >
        {messages.length === 0 && !isLoading ? (
          <p className="text-primary-content m-auto text-sm font-semibold">
            Ask me anything...
          </p>
        ) : (
          <div className="mx-auto flex w-full max-w-[680px] flex-col gap-4">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                meta={
                  m.usage
                    ? `${model.name} · ${formatTokens(m.usage.inputTokens)} in / ${formatTokens(m.usage.outputTokens)} out · ${formatUsd(m.usage.costUsd)}${m.scripted ? " · offline reply" : ""}`
                    : undefined
                }
              />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>
    </section>
  );
}
