import { describe, expect, it } from "vitest";
import { suggestCategory } from "../services/category-suggester";
import { exportSessionToCsv, exportSessionToJson, importSessionFromJson } from "../services/export-import";
import { Session } from "../domain/types";

describe("Category Suggester Service", () => {
  it("should suggest food category for dinner descriptions", () => {
    const cat = suggestCategory("Dinner at Karim's");
    expect(cat.id).toBe("food");
    expect(cat.icon).toBe("🍔");
  });

  it("should suggest fuel category for petrol descriptions", () => {
    const cat = suggestCategory("Petrol for car");
    expect(cat.id).toBe("fuel");
    expect(cat.icon).toBe("⛽");
  });

  it("should suggest hotel category for stay descriptions", () => {
    const cat = suggestCategory("Resort booking");
    expect(cat.id).toBe("stay");
    expect(cat.icon).toBe("🏨");
  });

  it("should return general category for unknown text", () => {
    const cat = suggestCategory("Random stuff 123");
    expect(cat.id).toBe("other");
  });
});

describe("Export & Import Service", () => {
  const sampleSession: Session = {
    id: "s_01",
    name: "Goa Trip 2026",
    version: 1,
    createdAt: "2026-08-14T00:00:00Z",
    updatedAt: "2026-08-14T00:00:00Z",
    participants: [
      { id: "p1", name: "Dheeraj", createdAt: "", updatedAt: "" },
      { id: "p2", name: "Amit", createdAt: "", updatedAt: "" },
    ],
    expenses: [
      {
        id: "exp_1",
        sessionId: "s_01",
        description: "Dinner, Cafe",
        amountMinor: 2400,
        currency: "INR",
        paidBy: "p1",
        categoryId: "food",
        tags: ["food", "dinner"],
        notes: "Great food!",
        split: { method: "equal", participantIds: ["p1", "p2"] },
        createdAt: "2026-08-14T00:00:00Z",
        updatedAt: "2026-08-14T00:00:00Z",
      },
    ],
    settlements: [],
  };

  it("should format CSV rows properly and handle escaping", () => {
    const csv = exportSessionToCsv(sampleSession);
    expect(csv).toContain("Expense ID,Date,Description");
    expect(csv).toContain('"Dinner, Cafe"'); // escaped due to comma
    expect(csv).toContain("Dheeraj");
    expect(csv).toContain("12"); // 2400 minor = 24 total, 12 per share
  });

  it("should export and re-import JSON correctly without loss of data", () => {
    const jsonStr = exportSessionToJson(sampleSession);
    const restored = importSessionFromJson(jsonStr);
    expect(restored.id).toBe(sampleSession.id);
    expect(restored.name).toBe(sampleSession.name);
    expect(restored.expenses).toHaveLength(1);
    expect(restored.participants).toHaveLength(2);
  });
});
