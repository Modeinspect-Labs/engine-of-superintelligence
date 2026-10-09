"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CloudIllustration,
  EmptyState,
  HeroHeader,
  Page,
  PriceLabel,
  SearchIcon,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from "@/design-system";
import { MODELS } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useOrg } from "@/app/_components/use-org";

export default function ModelsPage() {
  const { href } = useOrg();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const models = q
    ? MODELS.filter((m) =>
        `${m.name} ${m.developer} ${m.type} ${m.id}`.toLowerCase().includes(q),
      )
    : MODELS;

  return (
    <Page>
      <HeroHeader
        eyebrow="AI Services"
        title="Serverless Models"
        glyph={<CloudIllustration size={64} className="text-banner-content" />}
      />
      <Card>
        <CardContent className="gap-4">
          <h2 className="text-primary-content text-lg font-semibold">
            All Models
          </h2>
          <label className="text-primary-content flex h-9 items-center gap-2 text-sm">
            <SearchIcon size={15} className="text-primary-content" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search models"
              data-action="search-models"
              className="placeholder:text-primary-content min-w-0 flex-1 bg-transparent font-medium outline-none placeholder:font-medium"
            />
          </label>
          {models.length === 0 ? (
            <EmptyState
              title="No models match"
              description={`Nothing in the catalogue matches “${query}”.`}
            />
          ) : (
            <Table className="-mt-2">
              <THead>
                <TR>
                  <TH className="w-[45%] pl-1.5">Model Endpoints</TH>
                  <TH className="w-[13%]">Developer</TH>
                  <TH className="w-[13%]">Type</TH>
                  <TH>Price</TH>
                </TR>
              </THead>
              <TBody>
                {models.map((m) => (
                  <TR
                    key={m.id}
                    isClickable
                    data-model-id={m.id}
                    onClick={() =>
                      router.push(
                        href(`serverless/${encodeURIComponent(m.id)}`),
                      )
                    }
                  >
                    <TD className="pl-1.5 font-semibold">{m.name}</TD>
                    <TD>{m.developer}</TD>
                    <TD>{m.type}</TD>
                    <TD>
                      <PriceLabel
                        price={formatPrice(m.priceInput, m.priceOutput)}
                        unit={`per 1M ${m.priceUnit}`}
                      />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Page>
  );
}
