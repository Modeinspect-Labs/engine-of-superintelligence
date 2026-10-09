"use client";

import { use } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CloudGlyph,
  CodeBlock,
  CopyField,
  Definition,
  EmptyState,
  Link,
  Page,
  PriceLabel,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/design-system";
import { modelSamples } from "@/lib/code-samples";
import { modelById } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useNscaleStore } from "@/lib/store";
import { useOrg } from "@/app/_components/use-org";

export default function ModelPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = use(params);
  const { href } = useOrg();
  const router = useRouter();
  const setModel = useNscaleStore((s) => s.setModel);
  const model = modelById(decodeURIComponent(modelId));

  if (!model) {
    return (
      <Page>
        <EmptyState
          title="Model not found"
          description="This endpoint isn't in the catalogue."
          action={
            <NextLink href={href("serverless")} className="inline-flex">
              <Button tabIndex={-1}>Back to models</Button>
            </NextLink>
          }
        />
      </Page>
    );
  }

  const openInWorkbench = () => {
    setModel(model.id);
    router.push(href("workbench"));
  };

  return (
    <Page>
      <header data-component="ModelHeader" className="flex items-center gap-4">
        <span className="bg-extensions-background-purple text-resources-serverless inline-flex size-14 shrink-0 items-center justify-center rounded-lg">
          <CloudGlyph size={28} />
        </span>
        <div className="flex flex-col">
          <p className="text-secondary-content text-xs">Serverless</p>
          <h1 className="text-primary-content text-[30px] leading-9 font-semibold">
            {model.name}
          </h1>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabList>
          <Tab value="overview">Overview</Tab>
        </TabList>
        <TabPanel value="overview" className="pt-8">
          <div className="grid gap-4 xl:grid-cols-[1fr_460px]">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader
                  title="Access endpoint"
                  action={
                    <Button
                      onClick={openInWorkbench}
                      data-action="open-in-workbench"
                    >
                      Open in Workbench
                    </Button>
                  }
                />
                <CardContent className="gap-3">
                  <p className="text-primary-content text-sm font-semibold">
                    Using the API
                  </p>
                  <p className="text-secondary-content text-sm">
                    This example uses the default configuration, please
                    configure to your preferences and{" "}
                    <Link href={href("settings?tab=service-tokens")}>
                      Service token
                    </Link>
                  </p>
                  <CodeBlock
                    samples={modelSamples(model)}
                    collapsedLines={10}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Model details" />
                <CardContent>
                  <dl className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                    <Definition label="Name" value={model.name} />
                    <Definition label="Developer" value={model.developer} />
                    <Definition label="Model Type" value={model.type} />
                    <Definition
                      label="Model Size"
                      value={`${model.params} Params`}
                    />
                    <Definition
                      label="Memory Used"
                      value={model.memoryGb.toFixed(2)}
                    />
                    <Definition label="Data Type" value={model.dtype} />
                    <Definition
                      label="Context Window"
                      value={model.contextWindow}
                    />
                    <Definition
                      label="Description"
                      value={model.description}
                      className="max-w-xl sm:col-span-2"
                    />
                  </dl>
                </CardContent>
                <CardFooter>
                  <Link href={model.hfUrl} isExternal variant="action">
                    View on Hugging Face
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader title="Details" />
                <CardContent className="gap-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-primary-content text-xs font-semibold">
                      Price
                    </p>
                    <PriceLabel
                      price={formatPrice(model.priceInput, model.priceOutput)}
                      unit={`per 1M ${model.priceUnit}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-primary-content text-xs font-semibold">
                      Model
                    </p>
                    <CopyField value={model.id} className="self-start" />
                  </div>
                </CardContent>
              </Card>
              <div className="px-6">
                <Link
                  href={model.hfUrl}
                  isExternal
                  variant="action"
                  className="text-xs"
                >
                  {model.license}
                </Link>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </Page>
  );
}
