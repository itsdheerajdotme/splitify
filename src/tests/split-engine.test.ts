import { describe, expect, it } from "vitest";
import {
  calculateCustomSplit,
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateShareSplit,
  calculateSplitAllocations,
  SplitCalculationError,
} from "../domain/split-engine";

describe("Split Engine", () => {
  describe("calculateEqualSplit", () => {
    it("should split evenly when amount is divisible by participant count", () => {
      const result = calculateEqualSplit(3000, ["p1", "p2", "p3"]);
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 1000 },
        { participantId: "p2", amountMinor: 1000 },
        { participantId: "p3", amountMinor: 1000 },
      ]);
      const total = result.reduce((sum, item) => sum + item.amountMinor, 0);
      expect(total).toBe(3000);
    });

    it("should handle remainders deterministically when amount is not evenly divisible", () => {
      // 100 / 3 = 33 floor, remainder 1
      const result = calculateEqualSplit(100, ["p1", "p2", "p3"]);
      // Sorted participant IDs: p1, p2, p3. p1 gets extra 1 minor unit.
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 34 },
        { participantId: "p2", amountMinor: 33 },
        { participantId: "p3", amountMinor: 33 },
      ]);
      const total = result.reduce((sum, item) => sum + item.amountMinor, 0);
      expect(total).toBe(100);
    });

    it("should throw error if 0 participants are provided", () => {
      expect(() => calculateEqualSplit(1000, [])).toThrow(SplitCalculationError);
    });
  });

  describe("calculatePercentageSplit", () => {
    it("should correctly split exact percentages", () => {
      const result = calculatePercentageSplit(10000, [
        { participantId: "p1", percentageBps: 5000 }, // 50%
        { participantId: "p2", percentageBps: 3000 }, // 30%
        { participantId: "p3", percentageBps: 2000 }, // 20%
      ]);
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 5000 },
        { participantId: "p2", amountMinor: 3000 },
        { participantId: "p3", amountMinor: 2000 },
      ]);
      expect(result.reduce((s, i) => s + i.amountMinor, 0)).toBe(10000);
    });

    it("should distribute minor unit remainders for fractional percentage calculations", () => {
      const result = calculatePercentageSplit(100, [
        { participantId: "p1", percentageBps: 3333 }, // 33.33%
        { participantId: "p2", percentageBps: 3333 }, // 33.33%
        { participantId: "p3", percentageBps: 3334 }, // 33.34%
      ]);
      const total = result.reduce((s, i) => s + i.amountMinor, 0);
      expect(total).toBe(100);
    });

    it("should throw error if percentages do not sum to 10,000 bps (100%)", () => {
      expect(() =>
        calculatePercentageSplit(1000, [
          { participantId: "p1", percentageBps: 5000 },
          { participantId: "p2", percentageBps: 4000 },
        ])
      ).toThrow(SplitCalculationError);
    });
  });

  describe("calculateShareSplit", () => {
    it("should split by ratio of shares", () => {
      const result = calculateShareSplit(1000, [
        { participantId: "p1", shares: 2 },
        { participantId: "p2", shares: 1 },
        { participantId: "p3", shares: 1 },
      ]);
      // Total shares = 4 -> p1 = 500, p2 = 250, p3 = 250
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 500 },
        { participantId: "p2", amountMinor: 250 },
        { participantId: "p3", amountMinor: 250 },
      ]);
      expect(result.reduce((s, i) => s + i.amountMinor, 0)).toBe(1000);
    });

    it("should throw error if total shares is 0", () => {
      expect(() =>
        calculateShareSplit(1000, [
          { participantId: "p1", shares: 0 },
          { participantId: "p2", shares: 0 },
        ])
      ).toThrow(SplitCalculationError);
    });
  });

  describe("calculateCustomSplit", () => {
    it("should accept valid custom allocations matching total amount", () => {
      const result = calculateCustomSplit(1500, [
        { participantId: "p1", amountMinor: 700 },
        { participantId: "p2", amountMinor: 500 },
        { participantId: "p3", amountMinor: 300 },
      ]);
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 700 },
        { participantId: "p2", amountMinor: 500 },
        { participantId: "p3", amountMinor: 300 },
      ]);
    });

    it("should throw error if custom allocations do not match total amount", () => {
      expect(() =>
        calculateCustomSplit(1500, [
          { participantId: "p1", amountMinor: 700 },
          { participantId: "p2", amountMinor: 500 },
        ])
      ).toThrow(SplitCalculationError);
    });
  });

  describe("calculateSplitAllocations dispatcher", () => {
    it("should dispatch equal split correctly", () => {
      const result = calculateSplitAllocations(1000, {
        method: "equal",
        participantIds: ["p1", "p2"],
      });
      expect(result).toHaveLength(2);
      expect(result.reduce((s, i) => s + i.amountMinor, 0)).toBe(1000);
    });
  });
});
