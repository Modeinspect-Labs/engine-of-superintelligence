"use client";

import { useState } from "react";
import {
  AddIcon,
  Button,
  Card,
  Field,
  GpuGlyph,
  HeroHeader,
  KubernetesGlyph,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Page,
  RackIllustration,
  Select,
  ServiceTile,
  SlurmGlyph,
  Textarea,
  Textfield,
} from "@/design-system";
import { GPU_TYPES, REGIONS } from "@/lib/data";
import { useNscaleStore } from "@/lib/store";

export default function ClustersPage() {
  const [open, setOpen] = useState(false);
  const request = useNscaleStore((s) => s.requestCluster);
  const toast = useNscaleStore((s) => s.toast);
  const [gpuType, setGpuType] = useState<string>(GPU_TYPES[0]);
  const [gpuCount, setGpuCount] = useState("1024");
  const [orchestration, setOrchestration] = useState<
    "Kubernetes" | "Slurm" | "GPU Nodes"
  >("Kubernetes");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const n = parseInt(gpuCount, 10);
    if (!n || n < 8) {
      setError("Clusters start at 8 GPUs.");
      return;
    }
    request({ gpuType, gpuCount: n, orchestration, region, notes });
    setOpen(false);
    setNotes("");
    toast({
      title: "Request sent",
      description: `${n}× ${gpuType} · ${orchestration}`,
    });
  };

  const requestButton = (
    <Button
      variant="inverse"
      iconBefore={<AddIcon size={14} className="text-banner-content" />}
      onClick={() => setOpen(true)}
      data-action="request-cluster"
    >
      Request Cluster
    </Button>
  );

  return (
    <Page>
      <HeroHeader
        eyebrow="AI Clusters"
        title="GPU Clusters"
        tone="clusters"
        glyph={<GpuGlyph size={56} className="text-banner-content" />}
        action={requestButton}
      />

      <Card padding="even" className="gap-12 py-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-primary-content text-[28px] leading-9 font-semibold">
            Sovereign GPU clusters for large scale deployments of 1K to 20K+
            GPUs
          </h2>
          <p className="text-secondary-content max-w-xl text-base">
            Access thousands of GB200s, H200s and H100s, and deploy
            infrastructure at scale using Nscale&apos;s sovereign AI cloud
            platform. Talk to sales for access.
          </p>
        </div>
        <div className="divide-primary-border grid divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <ServiceTile
            tone="kubernetes"
            glyph={<KubernetesGlyph size={28} />}
            name="Kubernetes"
            headline="Dynamically manage AI workloads and resources at scale"
            description="Nscale's Kubernetes services simplify containerised workload deployment with auto-scaling and self-healing capabilities."
          />
          <ServiceTile
            tone="slurm"
            glyph={<SlurmGlyph size={26} />}
            name="Slurm"
            headline="Maximize efficiency with batch workload scheduling in Slurm"
            description="Nscale's Slurm service optimizes batch scheduling and resource allocation for efficient large-scale training."
          />
          <ServiceTile
            tone="nodes"
            glyph={<GpuGlyph size={28} />}
            name="GPU Nodes"
            headline="Get the raw performance of bare metal nodes"
            description="Direct access to bare metal GPU nodes, optimized for low-latency AI training and inference."
          />
        </div>
      </Card>

      <Card
        variant="hero"
        padding="none"
        className="min-h-[416px] flex-row items-center gap-8 px-14"
      >
        <div className="flex max-w-md flex-col gap-6 py-12">
          <h2 className="text-banner-content text-[28px] leading-9 font-semibold">
            Industry leading GPU clusters at all scales
          </h2>
          <p className="text-banner-content-muted text-base">
            Our GPU clusters, powered by the latest hardware like GB200s and
            H100s, are flexible and scalable to meet training needs of all types
            and sizes. Whether you&apos;re scaling up for large projects or
            training models, our clusters provide the power and efficiency
            required.
          </p>
          <div>{requestButton}</div>
        </div>
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <RackIllustration className="h-[340px] w-auto" />
        </div>
      </Card>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent width="medium">
          <ModalHeader
            title="Request a cluster"
            description="Tell us what you need and sales will come back with availability and pricing within one business day."
          />
          <ModalBody className="grid gap-4 py-2 sm:grid-cols-2">
            <Field label="GPU type">
              <Select
                value={gpuType}
                onValueChange={setGpuType}
                options={GPU_TYPES.map((g) => ({ value: g, label: g }))}
                aria-label="GPU type"
                className="w-full"
              />
            </Field>
            <Field label="Number of GPUs" error={error}>
              <Textfield
                type="number"
                min={8}
                step={8}
                value={gpuCount}
                isInvalid={!!error}
                onChange={(e) => {
                  setGpuCount(e.target.value);
                  setError("");
                }}
              />
            </Field>
            <Field label="Orchestration">
              <Select
                value={orchestration}
                onValueChange={(v) =>
                  setOrchestration(v as typeof orchestration)
                }
                options={["Kubernetes", "Slurm", "GPU Nodes"].map((o) => ({
                  value: o,
                  label: o,
                }))}
                aria-label="Orchestration"
                className="w-full"
              />
            </Field>
            <Field label="Region">
              <Select
                value={region}
                onValueChange={setRegion}
                options={REGIONS.map((r) => ({ value: r, label: r }))}
                aria-label="Region"
                className="w-full"
              />
            </Field>
            <Field
              label="Workload notes"
              className="sm:col-span-2"
              helper="Training, fine-tuning, inference — anything that helps us size it."
            >
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Pre-training a 70B model, 3 month reservation, InfiniBand required."
              />
            </Field>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={submit}
              data-action="submit-cluster-request"
            >
              Send request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
}
