import React, { useState } from "react";
import { X, Zap, Gift, Sparkles, FileSpreadsheet, Lock, RefreshCw } from "lucide-react";

interface LandingPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: () => void;
}

export const LandingPageModal: React.FC<LandingPageModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
}) => {
  // Live Demo Simulator State
  const [demoAmount, setDemoAmount] = useState<number>(1500);
  const [demoPeople, setDemoPeople] = useState<number>(3);

  if (!isOpen) return null;

  const perPerson = Math.round(demoAmount / Math.max(1, demoPeople));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "88vh" }}>
        {/* Header Bar */}
        <div className="flex items-center justify-between" style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border-subtle)", marginBottom: "1.5rem" }}>
          <div className="flex items-center gap-2">
            <Sparkles color="var(--accent-primary)" size={20} />
            <h3 style={{ fontSize: "1.25rem" }}>Splitify Feature Showcase & Concept</h3>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose} style={{ padding: "0.25rem 0.5rem" }}>
            <X size={18} />
          </button>
        </div>

        {/* Hero Section */}
        <div className="card text-center" style={{ backgroundColor: "var(--bg-input)", padding: "2rem 1.5rem", marginBottom: "1.5rem" }}>
          <span className="badge badge-emerald" style={{ marginBottom: "0.75rem" }}>
            100% Free • Browser-First • No Sign Up
          </span>
          <h1 style={{ fontSize: "2.25rem", lineHeight: 1.15, marginBottom: "0.75rem" }}>
            Split Group Expenses Instantly. <br />
            <span style={{ color: "var(--accent-primary)" }}>No Sign-Up. 100% Private.</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
            The fastest, easiest way to track and settle group expenses for trips, dinners, parties, and roommates. Everything stays privately inside your browser.
          </p>

          <div className="flex justify-center gap-3" style={{ flexWrap: "wrap" }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                onClose();
                onStartSession();
              }}
            >
              <Zap size={18} /> Create a Trip — It's Free
            </button>
          </div>
        </div>

        {/* Interactive Live Demo Widget */}
        <div className="card" style={{ marginBottom: "1.5rem", border: "1px solid var(--accent-primary)" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "1rem" }}>
            <h4 className="flex items-center gap-2" style={{ fontSize: "1.1rem" }}>
              <Sparkles size={18} color="var(--accent-primary)" /> Try Interactive Calculator Demo
            </h4>
            <span className="badge badge-subtle">Live Preview</span>
          </div>

          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <div className="form-group">
                <label className="form-label">Expense Amount (₹)</label>
                <input
                  type="number"
                  className="form-input mono"
                  value={demoAmount}
                  onChange={(e) => setDemoAmount(Number(e.target.value))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Group Members: {demoPeople} people</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={demoPeople}
                  onChange={(e) => setDemoPeople(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-primary)" }}
                />
              </div>
            </div>

            <div className="card text-center" style={{ backgroundColor: "var(--bg-input)" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Equal Share Per Person</p>
              <h2 className="mono" style={{ fontSize: "2rem", color: "var(--accent-primary)", margin: "0.25rem 0" }}>
                ₹{perPerson}
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Calculated instantly client-side!</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Why Choose Splitify?</h4>
        <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
          <div className="card">
            <Zap size={24} color="var(--accent-primary)" style={{ marginBottom: "0.5rem" }} />
            <h5 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Zero Registration</h5>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              No email verification or passwords. Open Splitify and start splitting in seconds.
            </p>
          </div>

          <div className="card">
            <Lock size={24} color="var(--accent-primary)" style={{ marginBottom: "0.5rem" }} />
            <h5 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>100% Private</h5>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Your financial records never leave your browser. Zero backend servers or data tracking.
            </p>
          </div>

          <div className="card">
            <RefreshCw size={24} color="var(--accent-primary)" style={{ marginBottom: "0.5rem" }} />
            <h5 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Debt Simplification</h5>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Smart greedy algorithm reduces 15 complex debts into 2 or 3 direct payments.
            </p>
          </div>

          <div className="card">
            <Sparkles size={24} color="var(--accent-primary)" style={{ marginBottom: "0.5rem" }} />
            <h5 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>4 Split Methods</h5>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Equal, Custom %, Share Ratios (2:1), or Exact Custom amounts per person.
            </p>
          </div>

          <div className="card">
            <FileSpreadsheet size={24} color="var(--accent-primary)" style={{ marginBottom: "0.5rem" }} />
            <h5 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Instant CSV & Backup</h5>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Download formatted Excel/Sheets CSVs or save offline JSON backups anytime.
            </p>
          </div>

          <div className="card">
            <Gift size={24} color="var(--accent-primary)" style={{ marginBottom: "0.5rem" }} />
            <h5 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>100% Free Forever</h5>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              No subscriptions, no hidden paywalls, no ads. Built purely for convenience.
            </p>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Splitify vs. Traditional Apps</h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <th style={{ padding: "0.5rem" }}>Feature</th>
                  <th style={{ padding: "0.5rem", color: "var(--accent-primary)" }}>Splitify</th>
                  <th style={{ padding: "0.5rem", color: "var(--text-muted)" }}>Traditional Apps</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "0.5rem" }}>Cost</td>
                  <td style={{ padding: "0.5rem", fontWeight: 700, color: "var(--accent-primary)" }}>100% Free Forever</td>
                  <td style={{ padding: "0.5rem" }}>Paid tiers / Ads</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "0.5rem" }}>Sign-up Required</td>
                  <td style={{ padding: "0.5rem", fontWeight: 700, color: "var(--accent-primary)" }}>None (Instant)</td>
                  <td style={{ padding: "0.5rem" }}>Mandatory Account</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "0.5rem" }}>Data Privacy</td>
                  <td style={{ padding: "0.5rem", fontWeight: 700, color: "var(--accent-primary)" }}>100% Local in Browser</td>
                  <td style={{ padding: "0.5rem" }}>Remote Cloud Databases</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.5rem" }}>CSV / JSON Export</td>
                  <td style={{ padding: "0.5rem", fontWeight: 700, color: "var(--accent-primary)" }}>Free One-Click</td>
                  <td style={{ padding: "0.5rem" }}>Often locked / Pro plan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center" style={{ padding: "1rem" }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              onClose();
              onStartSession();
            }}
          >
            <Zap size={18} /> Launch Splitify Now
          </button>
        </div>
      </div>
    </div>
  );
};
