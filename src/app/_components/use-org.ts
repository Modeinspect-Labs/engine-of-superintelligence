"use client";

import { useParams, usePathname } from "next/navigation";
import { ORG } from "@/lib/data";

/** Org-scoped hrefs, mirroring the console's /organization/<id>/… routes. */
export function useOrg() {
  const params = useParams<{ orgId?: string }>();
  const pathname = usePathname();
  const orgId = params?.orgId ?? ORG.id;
  const base = `/organization/${orgId}`;
  const href = (path = "") =>
    path ? `${base}/${path.replace(/^\//, "")}` : base;
  const isActive = (path = "") => {
    const target = href(path);
    return path ? pathname.startsWith(target) : pathname === target;
  };
  return { orgId, base, href, isActive, pathname };
}

export const orgHref = (path = "") =>
  path
    ? `/organization/${ORG.id}/${path.replace(/^\//, "")}`
    : `/organization/${ORG.id}`;
