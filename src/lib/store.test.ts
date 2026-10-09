import { beforeEach, describe, expect, it } from "vitest";
import { useNscaleStore } from "./store";

describe("store", () => {
  beforeEach(() => useNscaleStore.getState().resetDemo());

  it("adds credit with a transaction and a notification", () => {
    const before = useNscaleStore.getState();
    before.addCredit(7500);
    const s = useNscaleStore.getState();
    expect(s.creditCents).toBe(before.creditCents + 7500);
    expect(s.transactions[0].amountCents).toBe(7500);
    expect(s.notifications[0].title).toBe("Credit added");
    expect(s.onboarding.credit).toBe(true);
  });

  it("creates a reveal-once service token", () => {
    const { token, secret } = useNscaleStore
      .getState()
      .createServiceToken("ci", null);
    expect(secret.startsWith("nsk_live_")).toBe(true);
    expect(token.prefix).toBe(secret.slice(0, 13));
    expect(useNscaleStore.getState().serviceTokens[0].name).toBe("ci");
    expect(useNscaleStore.getState().onboarding.token).toBe(true);
  });

  it("charges usage against the balance", () => {
    const before = useNscaleStore.getState().creditCents;
    const cost = useNscaleStore
      .getState()
      .recordUsage("openai/gpt-oss-120b", 1_000_000, 1_000_000);
    expect(cost).toBeCloseTo(0.5, 5);
    expect(useNscaleStore.getState().creditCents).toBeCloseTo(before - 50, 5);
    expect(useNscaleStore.getState().usageEvents).toHaveLength(1);
  });

  it("redeems the free credit once", () => {
    useNscaleStore.getState().redeemFreeCredit();
    useNscaleStore.getState().redeemFreeCredit();
    const s = useNscaleStore.getState();
    expect(s.freeCreditRedeemed).toBe(true);
    expect(
      s.transactions.filter(
        (t) => t.paymentType === "Promotional credit" && t.amountCents === 500,
      ),
    ).toHaveLength(1);
  });
});
