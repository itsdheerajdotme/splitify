import { describe, expect, it } from "vitest";
import { calculateBalances } from "../domain/balance-engine";
import { Session } from "../domain/types";

describe("Balance Engine", () => {
  const dummySession: Session = {
    id: "s1",
    name: "Goa Trip",
    version: 1,
    createdAt: "2026-08-14T00:00:00Z",
    updatedAt: "2026-08-14T00:00:00Z",
    participants: [
      { id: "p1", name: "Dheeraj", createdAt: "", updatedAt: "" },
      { id: "p2", name: "Amit", createdAt: "", updatedAt: "" },
      { id: "p3", name: "Rahul", createdAt: "", updatedAt: "" },
    ],
    expenses: [],
    settlements: [],
  };

  it("should return zero net balance for session with no expenses", () => {
    const balances = calculateBalances(dummySession);
    expect(balances).toHaveLength(3);
    balances.forEach((b) => {
      expect(b.netMinor).toBe(0);
      expect(b.paidMinor).toBe(0);
      expect(b.owedMinor).toBe(0);
    });
  });

  it("should calculate correct net balances for a single equal expense", () => {
    const session: Session = {
      ...dummySession,
      expenses: [
        {
          id: "e1",
          sessionId: "s1",
          description: "Dinner",
          amountMinor: 2400, // ₹24.00
          currency: "INR",
          paidBy: "p1", // Dheeraj paid 2400
          categoryId: "food",
          tags: [],
          split: { method: "equal", participantIds: ["p1", "p2", "p3"] }, // 800 each
          createdAt: "",
          updatedAt: "",
        },
      ],
    };

    const balances = calculateBalances(session);
    const p1 = balances.find((b) => b.participantId === "p1")!;
    const p2 = balances.find((b) => b.participantId === "p2")!;
    const p3 = balances.find((b) => b.participantId === "p3")!;

    expect(p1).toEqual({ participantId: "p1", paidMinor: 2400, owedMinor: 800, netMinor: 1600 });
    expect(p2).toEqual({ participantId: "p2", paidMinor: 0, owedMinor: 800, netMinor: -800 });
    expect(p3).toEqual({ participantId: "p3", paidMinor: 0, owedMinor: 800, netMinor: -800 });

    // Invariant: sum of net balances is 0
    const sumNet = balances.reduce((sum, b) => sum + b.netMinor, 0);
    expect(sumNet).toBe(0);
  });

  it("should correctly combine multiple expenses and direct settlements", () => {
    const session: Session = {
      ...dummySession,
      expenses: [
        {
          id: "e1",
          sessionId: "s1",
          description: "Dinner",
          amountMinor: 3000,
          currency: "INR",
          paidBy: "p1", // p1 paid 3000, owed 1000 each by p1, p2, p3
          categoryId: "food",
          tags: [],
          split: { method: "equal", participantIds: ["p1", "p2", "p3"] },
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "e2",
          sessionId: "s1",
          description: "Cab",
          amountMinor: 1200,
          currency: "INR",
          paidBy: "p2", // p2 paid 1200, owed 600 each by p2, p3
          categoryId: "travel",
          tags: [],
          split: { method: "equal", participantIds: ["p2", "p3"] },
          createdAt: "",
          updatedAt: "",
        },
      ],
      settlements: [
        {
          id: "st1",
          sessionId: "s1",
          fromParticipantId: "p3", // p3 pays 500 to p1
          toParticipantId: "p1",
          amountMinor: 500,
          date: "",
          createdAt: "",
        },
      ],
    };

    const balances = calculateBalances(session);

    // p1: paid 3000 (expense) + 0 (settlement send) = 3000. owed 1000 (expense) + 500 (settlement receive) = 1500. net = +1500
    // p2: paid 1200 (expense). owed 1000 + 600 = 1600. net = -400
    // p3: paid 0 + 500 (settlement send) = 500. owed 1000 + 600 = 1600. net = -1100
    const p1 = balances.find((b) => b.participantId === "p1")!;
    const p2 = balances.find((b) => b.participantId === "p2")!;
    const p3 = balances.find((b) => b.participantId === "p3")!;

    expect(p1.netMinor).toBe(1500);
    expect(p2.netMinor).toBe(-400);
    expect(p3.netMinor).toBe(-1100);

    // Invariant check
    const sumNet = balances.reduce((sum, b) => sum + b.netMinor, 0);
    expect(sumNet).toBe(0);
  });
});
