import React from "react";
import { Zap, Layout, ShieldCheck, Sparkles } from "lucide-react";

interface NavbarProps {
  onGoHome: () => void;
  onOpenLandingPage: () => void;
  currentSessionName?: string;
  autoSaveStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenLandingPage,
  currentSessionName,
  autoSaveStatus = "Saved locally",
}) => {
  return (
    <header style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="container flex items-center justify-between" style={{ height: "64px" }}>
        <div className="flex items-center gap-3" style={{ cursor: "pointer" }} onClick={onGoHome}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "var(--accent-primary)",
              color: "var(--text-inverse)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            <Zap size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", lineHeight: 1 }}>
              Splitify <span style={{ fontSize: "0.75rem", color: "var(--accent-primary)", fontWeight: 600 }}>MVP</span>
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Zero-Backend Expense Splitter</p>
          </div>
        </div>

        {currentSessionName && (
          <div className="flex items-center gap-2" style={{ backgroundColor: "var(--bg-input)", padding: "0.35rem 0.85rem", borderRadius: "9999px", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{currentSessionName}</span>
            <span className="badge badge-emerald flex items-center gap-1" style={{ fontSize: "0.7rem" }}>
              <ShieldCheck size={12} /> {autoSaveStatus}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button className="btn btn-outline btn-sm" onClick={onOpenLandingPage}>
            <Sparkles size={16} color="var(--accent-primary)" /> Landing Page Concept
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onGoHome}>
            <Layout size={16} /> My Sessions
          </button>
        </div>
      </div>
    </header>
  );
};
