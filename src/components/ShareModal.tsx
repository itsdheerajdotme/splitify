import React, { useEffect, useState } from "react";
import { Share2, Copy, Check, Clock, AlertCircle, Loader2, Link } from "lucide-react";
import { Session } from "../domain/types";
import { createSharedTripLink, ShareResult } from "../services/share-service";
import { DEMO_SESSION_ID } from "../domain/demo-data";

interface ShareModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ session, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      handleGenerateLink();
    } else {
      setShareData(null);
      setError(null);
      setCopied(false);
    }
  }, [isOpen, session?.id]);

  if (!isOpen || !session) return null;

  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createSharedTripLink(session);
      setShareData(res);
    } catch (err: any) {
      setError(err?.message || "Failed to generate share link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareData) return;
    try {
      await navigator.clipboard.writeText(shareData.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      // Fallback input selection
      const input = document.getElementById("share-url-input") as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleNativeShare = async () => {
    if (!shareData || !navigator.share) return;
    try {
      await navigator.share({
        title: `Splitify - ${session.name}`,
        text: `View and import expenses for "${session.name}" on Splitify:`,
        url: shareData.shareUrl,
      });
    } catch (err) {
      // User cancelled share action
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
        <div className="flex items-center gap-3" style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Share2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", color: "var(--text-main)", fontWeight: 700 }}>
              Share "{session.name}"
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {session.id === DEMO_SESSION_ID
                ? "Static share link for the interactive demo session."
                : "Create a temporary link to share this session with your group."}
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center" style={{ padding: "2rem 1rem" }}>
            <Loader2 className="animate-spin" size={32} color="var(--color-primary)" style={{ marginBottom: "1rem" }} />
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Generating secure 24-hour share link...</p>
          </div>
        )}

        {error && (
          <div className="card" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", borderColor: "var(--color-danger)", marginBottom: "1.25rem" }}>
            <div className="flex items-center gap-2" style={{ color: "var(--color-danger)", marginBottom: "0.5rem" }}>
              <AlertCircle size={18} />
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Could not create link</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>{error}</p>
            <button className="btn btn-secondary btn-sm" onClick={handleGenerateLink}>
              Try Again
            </button>
          </div>
        )}

        {!loading && shareData && (
          <div className="flex flex-col gap-4">
            <div className="card" style={{ backgroundColor: "var(--bg-input)", padding: "1rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
                {session.id === DEMO_SESSION_ID ? "STATIC DEMO LINK" : "SHAREABLE TRIP LINK"}
              </label>
              <div className="flex gap-2">
                <div
                  className="flex items-center gap-2 flex-1"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.5rem 0.75rem",
                    overflow: "hidden",
                  }}
                >
                  <Link size={16} color="var(--text-muted)" />
                  <input
                    id="share-url-input"
                    type="text"
                    readOnly
                    value={shareData.shareUrl}
                    style={{
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      color: "var(--text-main)",
                      fontSize: "0.85rem",
                      fontFamily: "monospace",
                      width: "100%",
                    }}
                  />
                </div>

                <button className="btn btn-primary" onClick={handleCopyLink} style={{ minWidth: "90px" }}>
                  {copied ? (
                    <>
                      <Check size={16} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expiration Notice & Web Share API */}
            <div className="flex items-center justify-between" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <div className="flex items-center gap-1.5" style={{ color: session.id === DEMO_SESSION_ID ? "var(--accent-primary)" : "#eab308" }}>
                <Clock size={16} />
                <span>
                  {session.id === DEMO_SESSION_ID
                    ? "Static Demo Link (never expires)"
                    : "Expires automatically in 24 hours"}
                </span>
              </div>

              {Boolean(navigator.share) && (
                <button className="btn btn-outline btn-sm" onClick={handleNativeShare}>
                  <Share2 size={14} /> Send via App
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end" style={{ marginTop: "1.5rem" }}>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
