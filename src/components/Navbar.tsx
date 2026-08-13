import React from "react";
import siteConfig from "../config/site.json";
import { Layout, ShieldCheck, HelpCircle } from "lucide-react";

interface NavbarProps {
  onGoHome: () => void;
  onOpenHelp: () => void;
  currentSessionName?: string;
  autoSaveStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenHelp,
  currentSessionName,
  autoSaveStatus = "Saved locally",
}) => {
  return (
    <header style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)", position: "sticky", top: 0, zIndex: 800 }}>
      <div className="container flex items-center justify-between" style={{ height: "64px" }}>
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3" style={{ cursor: "pointer" }} onClick={onGoHome}>
          <img
            src="/logo-64.png"
            alt={siteConfig.name}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              objectFit: "cover",
              border: "1px solid var(--border-subtle)",
            }}
          />
          <div>
            <h2 style={{ fontSize: "1.25rem", lineHeight: 1 }}>
              {siteConfig.name} <span style={{ fontSize: "0.75rem", color: "var(--accent-primary)", fontWeight: 600 }}>MVP</span>
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{siteConfig.tagline}</p>
          </div>
        </div>

        {/* Active Session Status Badge */}
        {currentSessionName && (
          <div className="flex items-center gap-2 desktop-only" style={{ backgroundColor: "var(--bg-input)", padding: "0.35rem 0.85rem", borderRadius: "9999px", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{currentSessionName}</span>
            <span className="badge badge-emerald flex items-center gap-1" style={{ fontSize: "0.7rem" }}>
              <ShieldCheck size={12} /> {autoSaveStatus}
            </span>
          </div>
        )}

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm" onClick={onOpenHelp}>
            <HelpCircle size={16} color="var(--accent-primary)" /> <span className="desktop-only">Help & Guide</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onGoHome}>
            <Layout size={16} /> <span className="desktop-only">My Sessions</span>
          </button>
        </div>
      </div>
    </header>
  );
};
