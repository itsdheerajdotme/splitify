import React, { useEffect, useState } from "react";
import { Download, Users, FileText, DollarSign, Clock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Session } from "../domain/types";
import { fetchSharedTripLink, SharedTripPayload } from "../services/share-service";
import { formatCurrency } from "../services/export-import";

interface ImportModalProps {
  shareId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onImportSession: (session: Session) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ shareId, isOpen, onClose, onImportSession }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<SharedTripPayload | null>(null);

  useEffect(() => {
    if (isOpen && shareId) {
      handleFetchSharedTrip(shareId);
    } else {
      setPayload(null);
      setError(null);
    }
  }, [isOpen, shareId]);

  if (!isOpen || !shareId) return null;

  const handleFetchSharedTrip = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSharedTripLink(id);
      setPayload(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load shared trip session.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!payload?.session) return;
    onImportSession(payload.session);
    onClose();
  };

  const totalSpentMinor = payload?.session.expenses.reduce((acc, e) => acc + e.amountMinor, 0) || 0;
  const currency = payload?.session.expenses[0]?.currency || "INR";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        {loading && (
          <div className="flex flex-col items-center justify-center" style={{ padding: "3rem 1rem" }}>
            <Loader2 className="animate-spin" size={36} color="var(--color-primary)" style={{ marginBottom: "1rem" }} />
            <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Fetching Shared Trip...</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading session details from secure Cloudflare link.</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center text-center" style={{ padding: "1.5rem 1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "var(--color-danger)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <AlertCircle size={26} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Link Unavailable</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: "380px" }}>
              {error}
            </p>
            <button className="btn btn-secondary" onClick={onClose}>
              Dismiss
            </button>
          </div>
        )}

        {!loading && !error && payload && (
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Download size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)", fontWeight: 700 }}>
                  Import "{payload.session.name}"?
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Someone shared this trip session with you on Splitify.
                </p>
              </div>
            </div>

            {/* Trip Preview Card */}
            <div
              className="card"
              style={{
                backgroundColor: "var(--bg-input)",
                padding: "1.25rem",
                marginBottom: "1.25rem",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="flex items-center gap-2.5">
                  <Users size={18} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Participants
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700 }}>{payload.session.participants.length} People</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <FileText size={18} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Expenses
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700 }}>{payload.session.expenses.length} Recorded</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <DollarSign size={18} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Total Expenses
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700 }}>{formatCurrency(totalSpentMinor, currency)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock size={18} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Shared On
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      {new Date(payload.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Participant Pills */}
              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed var(--border-subtle)" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>
                  Group Members:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {payload.session.participants.map((p) => (
                    <span
                      key={p.id}
                      style={{
                        fontSize: "0.8rem",
                        backgroundColor: "var(--bg-card)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "12px",
                        border: "1px solid var(--border-subtle)",
                        fontWeight: 500,
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Importing will save this trip session into your browser's local storage so you can view, edit, and calculate balances offline.
            </p>

            <div className="flex justify-end gap-3">
              <button className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmImport}>
                <CheckCircle2 size={16} /> Import & Open Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
