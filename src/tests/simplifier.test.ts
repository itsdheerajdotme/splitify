import { describe, expect, it } from "vitest";
import { simplifyBalances } from "../domain/simplifier";
import { ParticipantBalance } from "../domain/types";

describe("Debt Simplifier Engine", () => {
  it("should return empty recommendations if all balances are zero", () => {
    const balances: ParticipantBalance[] = [
      { participantId: "p1", paidMinor: 100, owedMinor: 100, netMinor: 0 },
      { participantId: "p2", paidMinor: 200, owedMinor: 200, netMinor: 0 },
    ];
    const suggestions = simplifyBalances(balances);
    expect(suggestions).toEqual([]);
  });

  it("should simplify a 1-debtor 1-creditor scenario", () => {
    const balances: ParticipantBalance[] = [
      { participantId: "p1", paidMinor: 1000, owedMinor: 500, netMinor: 500 },
      { participantId: "p2", paidMinor: 0, owedMinor: 500, netMinor: -500 },
    ];

    const suggestions = simplifyBalances(balances);
    expect(suggestions).toEqual([
      { fromParticipantId: "p2", toParticipantId: "p1", amountMinor: 500 },
    ]);
  });

  it("should simplify multi-debtor multi-creditor graph into minimum transactions", () => {
    // p1: +600
    // p2: +200
    // p3: -500
    // p4: -300
    const balances: ParticipantBalance[] = [
      { participantId: "p1", paidMinor: 1000, owedMinor: 400, netMinor: 600 },
      { participantId: "p2", paidMinor: 500, owedMinor: 300, netMinor: 200 },
      { participantId: "p3", paidMinor: 0, owedMinor: 500, netMinor: -500 },
      { participantId: "p4", paidMinor: 0, owedMinor: 300, netMinor: -300 },
    ];

    const suggestions = simplifyBalances(balances);

    // Expected:
    // p3 owes 500 -> pays p1 (600 balance down to 100)
    // p4 owes 300 -> pays p1 100 (p1 net 0), remaining 200 -> pays p2 (200 net 0)
    expect(suggestions).toEqual([
      { fromParticipantId: "p3", toParticipantId: "p1", amountMinor: 500 },
      { fromParticipantId: "p4", toParticipantId: "p1", amountMinor: 100 },
      { fromParticipantId: "p4", toParticipantId: "p2", amountMinor: 200 },
    ]);

    // Verify invariant: total transferred equals total creditor net
    const totalTransferred = suggestions.reduce((sum, s) => sum + s.amountMinor, 0);
    expect(totalTransferred).toBe(800);
  });
});
