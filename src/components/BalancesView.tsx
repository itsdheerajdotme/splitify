import { useState } from "react";
import { Participant, ParticipantBalance, Settlement, SettlementSuggestion } from "../domain/types";
import { formatCurrency } from "../services/export-import";
import { ArrowRight, CheckCircle2, SlidersHorizontal, RefreshCw } from "lucide-react";

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

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Metric Bar */}
      <div className="grid-3">
        <div className="card">
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Total Group Spending</p>
          <h3 className="mono" style={{ fontSize: "1.75rem", color: "var(--accent-primary)", marginTop: "0.25rem" }}>
            {formatCurrency(totalSpent)}
          </h3>
        </div>

        <div className="card">
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Active Creditors</p>
          <h3 className="mono" style={{ fontSize: "1.75rem", marginTop: "0.25rem" }}>
            {balances.filter((b) => b.netMinor > 0).length} People
          </h3>
        </div>

        <div className="card">
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Simplified Settlements</p>
          <h3 className="mono" style={{ fontSize: "1.75rem", marginTop: "0.25rem" }}>
            {simplifiedSuggestions.length} Transfers
          </h3>
        </div>
      </div>

      {/* Net Balances per Participant Card */}
      <div className="card">
        <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Participant Net Balances</h4>

        <div className="flex flex-col gap-3">
          {balances.map((b) => {
            const name = participantMap.get(b.participantId) || b.participantId;
            const isCreditor = b.netMinor > 0;
            const isDebtor = b.netMinor < 0;
            const isSettled = b.netMinor === 0;

            return (
              <div
                key={b.participantId}
                className="flex items-center justify-between"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  <h5 style={{ fontSize: "1rem" }}>{name}</h5>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Paid {formatCurrency(b.paidMinor)} • Owed {formatCurrency(b.owedMinor)}
                  </p>
                </div>

                <div>
                  {isCreditor && (
                    <span className="badge badge-emerald mono" style={{ fontSize: "0.9rem", padding: "0.35rem 0.75rem" }}>
                      Gets back {formatCurrency(b.netMinor)}
                    </span>
                  )}
                  {isDebtor && (
                    <span className="badge badge-warning mono" style={{ fontSize: "0.9rem", padding: "0.35rem 0.75rem" }}>
                      Owes {formatCurrency(Math.abs(b.netMinor))}
                    </span>
                  )}
                  {isSettled && (
                    <span className="badge badge-subtle flex items-center gap-1" style={{ fontSize: "0.85rem", padding: "0.35rem 0.75rem" }}>
                      <CheckCircle2 size={14} color="var(--accent-primary)" /> Settled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settlements Recommendation Engine View */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h4 style={{ fontSize: "1.1rem" }}>Payment Settlement Plan</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {viewMode === "simplified"
                ? "Smart algorithm reduces transaction count to minimum payments."
                : "Detailed breakdown of original debt pairs."}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${viewMode === "simplified" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("simplified")}
            >
              <RefreshCw size={14} /> Simplified View
            </button>
            <button
              className={`btn btn-sm ${viewMode === "detailed" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("detailed")}
            >
              <SlidersHorizontal size={14} /> Detailed Net View
            </button>
          </div>
        </div>

        {simplifiedSuggestions.length === 0 ? (
          <div className="text-center" style={{ padding: "2rem", color: "var(--text-muted)" }}>
            <CheckCircle2 size={36} color="var(--accent-primary)" style={{ margin: "0 auto 0.5rem" }} />
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-main)" }}>Everyone is fully settled!</p>
            <p style={{ fontSize: "0.85rem" }}>No outstanding payments are required for this session.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {simplifiedSuggestions.map((s, idx) => {
              const debtorName = participantMap.get(s.fromParticipantId) || s.fromParticipantId;
              const creditorName = participantMap.get(s.toParticipantId) || s.toParticipantId;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1rem" }}>{debtorName}</span>
                    <ArrowRight size={18} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1rem" }}>{creditorName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="mono" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                      {formatCurrency(s.amountMinor)}
                    </span>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        onAddSettlement({
                          fromParticipantId: s.fromParticipantId,
                          toParticipantId: s.toParticipantId,
                          amountMinor: s.amountMinor,
                          date: new Date().toISOString().split("T")[0],
                          notes: `Settlement payment from ${debtorName} to ${creditorName}`,
                        });
                      }}
                    >
                      Record Settlement
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
