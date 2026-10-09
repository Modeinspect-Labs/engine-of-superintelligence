import { describe, expect, it } from "vitest";
import {
  formatAxisUsd,
  formatCents,
  formatPrice,
  formatRange,
  formatUsd,
} from "./format";

describe("format", () => {
  it("formats cents and dollars", () => {
    expect(formatCents(2340)).toBe("$23.40");
    expect(formatUsd(0)).toBe("$0");
    expect(formatUsd(0.0042)).toBe("$0.0042");
    expect(formatUsd(9.14)).toBe("$9.14");
  });
  it("formats catalogue prices like the console", () => {
    expect(formatPrice(0.45, 2.2)).toBe("$0.45 input / $2.2 output");
    expect(formatPrice(0.05)).toBe("$0.05");
  });
  it("formats axis ticks without trailing zeros", () => {
    expect(formatAxisUsd(0.002)).toBe("$0.002");
    expect(formatAxisUsd(0.6)).toBe("$0.6");
    expect(formatAxisUsd(12)).toBe("$12");
  });
  it("formats week ranges", () => {
    expect(
      formatRange(
        new Date("2026-10-04T00:00:00Z"),
        new Date("2026-10-11T00:00:00Z"),
      ),
    ).toBe("04 - 11 Oct 2026");
    expect(
      formatRange(
        new Date("2026-09-27T00:00:00Z"),
        new Date("2026-10-04T00:00:00Z"),
      ),
    ).toBe("27 Sep - 04 Oct 2026");
  });
});
