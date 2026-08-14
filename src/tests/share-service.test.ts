import { describe, expect, it, vi, beforeEach } from "vitest";
import { createSharedTripLink, fetchSharedTripLink } from "../services/share-service";
import { Session } from "../domain/types";

describe("Share Service (Cloudflare Worker Integration)", () => {
  const sampleSession: Session = {
    id: "sess_test_100",
    name: "Manali Trip",
    version: 1,
    createdAt: "2026-08-14T00:00:00Z",
    updatedAt: "2026-08-14T00:00:00Z",
    participants: [
      { id: "p1", name: "Rahul", createdAt: "", updatedAt: "" },
      { id: "p2", name: "Priya", createdAt: "", updatedAt: "" },
    ],
    expenses: [
      {
        id: "exp_1",
        sessionId: "sess_test_100",
        description: "Hotel stay",
        amountMinor: 500000,
        currency: "INR",
        paidBy: "p1",
        categoryId: "stay",
        tags: [],
        split: { method: "equal", participantIds: ["p1", "p2"] },
        createdAt: "2026-08-14T00:00:00Z",
        updatedAt: "2026-08-14T00:00:00Z",
      },
    ],
    settlements: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a share link via POST request to Cloudflare Worker", async () => {
    const mockShareId = "x7k9p2";
    const mockExpiresAt = new Date(Date.now() + 86400 * 1000).toISOString();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ shareId: mockShareId, expiresAt: mockExpiresAt }),
    } as Response);

    vi.stubGlobal("fetch", fetchMock);

    const result = await createSharedTripLink(sampleSession);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.shareId).toBe("x7k9p2");
    expect(result.shareUrl).toContain("?share=x7k9p2");
    expect(result.expiresAt).toBe(mockExpiresAt);
  });

  it("should fetch shared trip payload via GET request", async () => {
    const mockShareId = "x7k9p2";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        schemaVersion: 1,
        createdAt: "2026-08-14T00:00:00Z",
        expiresAt: "2026-08-15T00:00:00Z",
        session: sampleSession,
      }),
    } as Response);

    vi.stubGlobal("fetch", fetchMock);

    const payload = await fetchSharedTripLink(mockShareId);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(payload.session.id).toBe(sampleSession.id);
    expect(payload.session.name).toBe("Manali Trip");
    expect(payload.session.participants).toHaveLength(2);
  });

  it("should throw friendly error when share link has expired (404)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: "Shared link has expired or does not exist." }),
    } as Response);

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchSharedTripLink("expired123")).rejects.toThrow("This share link has expired or does not exist.");
  });
});
