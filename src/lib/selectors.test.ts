import { describe, expect, it } from "vitest";
import { TODAY, seedUsage } from "./data";
import {
  seedUsageEvents,
  totalCost,
  usageByModel,
  weekStart,
  weeklyBuckets,
  yearlyBuckets,
} from "./selectors";

describe("usage selectors", () => {
  it("seeds deterministic history", () => {
    const a = seedUsage();
    const b = seedUsage();
    expect(a.length).toBeGreaterThan(300);
    expect(a).toEqual(b);
    expect(totalCost(a)).toBeGreaterThan(5);
  });
  it("buckets the current week Sunday-first", () => {
    const start = weekStart(TODAY);
    expect(start.getUTCDay()).toBe(0);
    const buckets = weeklyBuckets(seedUsageEvents(), start);
    expect(buckets.map((b) => b.label)).toEqual([
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]);
    expect(buckets[0].key).toBe("2026-10-04");
  });
  it("returns twelve monthly buckets ending in the demo month", () => {
    const buckets = yearlyBuckets(seedUsageEvents());
    expect(buckets).toHaveLength(12);
    expect(buckets[11].key).toBe("2026-10");
  });
  it("ranks models by spend", () => {
    const rows = usageByModel(seedUsageEvents());
    expect(rows[0].costUsd).toBeGreaterThanOrEqual(rows[1].costUsd);
    expect(rows[0].name).toBeTruthy();
  });
});
