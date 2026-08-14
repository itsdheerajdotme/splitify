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

    it("should handle 100/3 division in full rupees without fractions or errors", () => {
      // ₹100 = 10000 minor units split among 3 participants -> 34, 33, 33 rupees
      const result = calculateEqualSplit(10000, ["p1", "p2", "p3"]);
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 3400 },
        { participantId: "p2", amountMinor: 3300 },
        { participantId: "p3", amountMinor: 3300 },
      ]);
      const total = result.reduce((sum, item) => sum + item.amountMinor, 0);
      expect(total).toBe(10000);
    });

    it("should handle minor unit remainders deterministically", () => {
      const result = calculateEqualSplit(100, ["p1", "p2", "p3"]);
      // Sorted participant IDs: p1, p2, p3. ₹1 (100 minor units) / 3 = ₹1 for p1, ₹0 for p2 & p3
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 100 },
        { participantId: "p2", amountMinor: 0 },
        { participantId: "p3", amountMinor: 0 },
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

    it("should handle 100/3 percentage split (33.33% x 3 = 99.99%) without error", () => {
      const result = calculatePercentageSplit(10000, [
        { participantId: "p1", percentageBps: 3333 }, // 33.33%
        { participantId: "p2", percentageBps: 3333 }, // 33.33%
        { participantId: "p3", percentageBps: 3333 }, // 33.33%
      ]);
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 3400 },
        { participantId: "p2", amountMinor: 3300 },
        { participantId: "p3", amountMinor: 3300 },
      ]);
      const total = result.reduce((s, i) => s + i.amountMinor, 0);
      expect(total).toBe(10000);
    });

    it("should throw error if total percentage bps is 0 or negative", () => {
      expect(() =>
        calculatePercentageSplit(1000, [
          { participantId: "p1", percentageBps: 0 },
          { participantId: "p2", percentageBps: 0 },
        ])
      ).toThrow(SplitCalculationError);
    });
  });

  describe("calculateShareSplit", () => {
    it("should split by ratio of shares", () => {
      const result = calculateShareSplit(10000, [
        { participantId: "p1", shares: 2 },
        { participantId: "p2", shares: 1 },
        { participantId: "p3", shares: 1 },
      ]);
      // Total shares = 4 -> p1 = 5000 (₹50), p2 = 2500 (₹25), p3 = 2500 (₹25)
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 5000 },
        { participantId: "p2", amountMinor: 2500 },
        { participantId: "p3", amountMinor: 2500 },
      ]);
      expect(result.reduce((s, i) => s + i.amountMinor, 0)).toBe(10000);
    });

    it("should handle 100/3 share split (1:1:1) in whole rupees", () => {
      const result = calculateShareSplit(10000, [
        { participantId: "p1", shares: 1 },
        { participantId: "p2", shares: 1 },
        { participantId: "p3", shares: 1 },
      ]);
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 3400 },
        { participantId: "p2", amountMinor: 3300 },
        { participantId: "p3", amountMinor: 3300 },
      ]);
      expect(result.reduce((s, i) => s + i.amountMinor, 0)).toBe(10000);
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
      const result = calculateCustomSplit(15000, [
        { participantId: "p1", amountMinor: 7000 },
        { participantId: "p2", amountMinor: 5000 },
        { participantId: "p3", amountMinor: 3000 },
      ]);
      expect(result).toEqual([
        { participantId: "p1", amountMinor: 7000 },
        { participantId: "p2", amountMinor: 5000 },
        { participantId: "p3", amountMinor: 3000 },
      ]);
    });

    it("should throw error if custom allocations significantly differ from total amount", () => {
      expect(() =>
        calculateCustomSplit(15000, [
          { participantId: "p1", amountMinor: 7000 },
          { participantId: "p2", amountMinor: 5000 },
        ])
      ).toThrow(SplitCalculationError);
    });
  });

  describe("calculateSplitAllocations dispatcher", () => {
    it("should dispatch equal split correctly", () => {
      const result = calculateSplitAllocations(10000, {
        method: "equal",
        participantIds: ["p1", "p2"],
      });
      expect(result).toHaveLength(2);
      expect(result.reduce((s, i) => s + i.amountMinor, 0)).toBe(10000);
    });
  });
});
