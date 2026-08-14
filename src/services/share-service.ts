import { Session } from "../domain/types";
import { importSessionFromJson } from "./export-import";

import siteConfig from "../config/site.json";

export interface ShareResult {
  shareId: string;
  shareUrl: string;
  expiresAt: string;
}

export interface SharedTripPayload {
  schemaVersion: number;
  createdAt: string;
  expiresAt: string;
  session: Session;
}

const DEFAULT_WORKER_URL = "https://splitify-share-worker.dheeraj-cb9.workers.dev";

export function getShareWorkerApiUrl(): string {
  const envUrl = import.meta.env.VITE_SHARE_API_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return DEFAULT_WORKER_URL;
}

/**
 * Uploads a trip session to Cloudflare Worker KV and generates a 24h short link.
 */
export async function createSharedTripLink(session: Session): Promise<ShareResult> {
  const apiUrl = getShareWorkerApiUrl();

  const response = await fetch(`${apiUrl}/api/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session }),
  });

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMessage = errJson.error;
    } catch (_) {
      // fallback message
    }
    throw new Error(`Failed to create share link: ${errorMessage}`);
  }

  const data = (await response.json()) as { shareId: string; expiresAt: string };
  
  // Construct the full share URL
  const baseUrl = typeof window !== "undefined" && window.location.origin
    ? window.location.origin + window.location.pathname
    : siteConfig.domainUrl;
  const shareUrl = `${baseUrl}?share=${data.shareId}`;

  return {
    shareId: data.shareId,
    shareUrl,
    expiresAt: data.expiresAt,
  };
}

/**
 * Fetches a shared trip payload from Cloudflare Worker KV by share ID.
 */
export async function fetchSharedTripLink(shareId: string): Promise<SharedTripPayload> {
  const apiUrl = getShareWorkerApiUrl();

  const response = await fetch(`${apiUrl}/api/share/${encodeURIComponent(shareId)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (response.status === 404) {
    throw new Error("This share link has expired or does not exist.");
  }

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMessage = errJson.error;
    } catch (_) {
      // fallback
    }
    throw new Error(`Failed to load shared trip: ${errorMessage}`);
  }

  const rawJson = await response.json();
  const session = importSessionFromJson(JSON.stringify(rawJson));

  return {
    schemaVersion: rawJson.schemaVersion || 1,
    createdAt: rawJson.createdAt || new Date().toISOString(),
    expiresAt: rawJson.expiresAt || new Date().toISOString(),
    session,
  };
}
