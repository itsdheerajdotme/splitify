import React, { useState } from "react";
import { Participant, ParticipantBalance, Settlement, SettlementSuggestion } from "../domain/types";
import { formatCurrency } from "../services/export-import";
import { ArrowRight, CheckCircle2, SlidersHorizontal, RefreshCw, Check } from "lucide-react";

interface BalancesViewProps {
  participants: Participant[];
  balances: ParticipantBalance[];
  simplifiedSuggestions: SettlementSuggestion[];
  onAddSettlement: (settlement: Omit<Settlement, "id" | "sessionId" | "createdAt">) => void;
}

export const BalancesView: React.FC<BalancesViewProps> = ({
  participants,
  balances,
  simplifiedSuggestions,
  onAddSettlement,
}) => {
  const [viewMode, setViewMode] = useState<"simplified" | "detailed">("simplified");

  const participantMap = new Map<string, string>();
  participants.forEach((p) => participantMap.set(p.id, p.name));

  const totalSpent = balances.reduce((sum, b) => sum + b.paidMinor, 0);
  const activeCreditors = balances.filter((b) => b.netMinor > 0).length;

  return (
    <div className="flex flex-col gap-3">
      {/* Compact 3-Column Metrics Bar */}
      <div className="grid-3">
        <div className="card flex flex-col justify-center" style={{ padding: "0.6rem 0.75rem" }}>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Spent</span>
          <span className="mono truncate" style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--accent-primary)" }}>
            {formatCurrency(totalSpent)}
          </span>
        </div>

        <div className="card flex flex-col justify-center" style={{ padding: "0.6rem 0.75rem" }}>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Creditors</span>
          <span className="mono truncate" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {activeCreditors} {activeCreditors === 1 ? "Person" : "People"}
          </span>
        </div>

        <div className="card flex flex-col justify-center" style={{ padding: "0.6rem 0.75rem" }}>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Settlements</span>
          <span className="mono truncate" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {simplifiedSuggestions.length} {simplifiedSuggestions.length === 1 ? "Transfer" : "Transfers"}
          </span>
        </div>
      </div>

      {/* Participant Net Balances Card */}
      <div className="card">
        <h4 style={{ fontSize: "0.95rem", marginBottom: "0.65rem" }}>Participant Balances</h4>

        <div className="flex flex-col gap-2">
          {balances.map((b) => {
            const name = participantMap.get(b.participantId) || b.participantId;
            const isCreditor = b.netMinor > 0;
            const isDebtor = b.netMinor < 0;
            const isSettled = b.netMinor === 0;

            return (
              <div
                key={b.participantId}
                className="flex items-center justify-between min-w-0"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="min-w-0 flex-1" style={{ paddingRight: "0.5rem" }}>
                  <h5 className="truncate" style={{ fontSize: "0.9rem", fontWeight: 700 }}>{name}</h5>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Paid {formatCurrency(b.paidMinor)} • Owed {formatCurrency(b.owedMinor)}
                  </p>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isCreditor && (
                    <span className="badge badge-emerald mono" style={{ fontSize: "0.8rem", padding: "0.25rem 0.55rem" }}>
                      Gets back {formatCurrency(b.netMinor)}
                    </span>
                  )}
                  {isDebtor && (
                    <span className="badge badge-warning mono" style={{ fontSize: "0.8rem", padding: "0.25rem 0.55rem" }}>
                      Owes {formatCurrency(Math.abs(b.netMinor))}
                    </span>
                  )}
                  {isSettled && (
                    <span className="badge badge-subtle flex items-center gap-1" style={{ fontSize: "0.75rem", padding: "0.25rem 0.55rem" }}>
                      <CheckCircle2 size={12} color="var(--accent-primary)" /> Settled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Settlement Plan Card */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem", gap: "0.5rem" }}>
          <h4 style={{ fontSize: "0.95rem" }}>Settlement Plan</h4>

          <div className="flex gap-1">
            <button
              className={`btn btn-sm ${viewMode === "simplified" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("simplified")}
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
            >
              <RefreshCw size={12} /> Simplified
            </button>
            <button
              className={`btn btn-sm ${viewMode === "detailed" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("detailed")}
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
            >
              <SlidersHorizontal size={12} /> Detailed
            </button>
          </div>
        </div>

        {simplifiedSuggestions.length === 0 ? (
          <div className="text-center" style={{ padding: "1.5rem 1rem", color: "var(--text-muted)" }}>
            <CheckCircle2 size={32} color="var(--accent-primary)" style={{ margin: "0 auto 0.35rem" }} />
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Everyone is settled!</p>
            <p style={{ fontSize: "0.75rem" }}>No outstanding payments are required.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {simplifiedSuggestions.map((s, idx) => {
              const debtorName = participantMap.get(s.fromParticipantId) || s.fromParticipantId;
              const creditorName = participantMap.get(s.toParticipantId) || s.toParticipantId;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between min-w-0 flex-wrap"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    gap: "0.5rem",
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    <span className="truncate" style={{ maxWidth: "80px" }}>{debtorName}</span>
                    <ArrowRight size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                    <span className="truncate" style={{ maxWidth: "80px" }}>{creditorName}</span>
                  </div>

                  <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                    <span className="mono" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                      {formatCurrency(s.amountMinor)}
                    </span>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onAddSettlement({
                          fromParticipantId: s.fromParticipantId,
                          toParticipantId: s.toParticipantId,
                          amountMinor: s.amountMinor,
                          date: new Date().toISOString().split("T")[0],
                          notes: `Settlement payment from ${debtorName} to ${creditorName}`,
                        });
                      }}
                      style={{ fontSize: "0.75rem", padding: "0.25rem 0.55rem" }}
                      title="Record Settlement"
                    >
                      <Check size={13} /> Settle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
