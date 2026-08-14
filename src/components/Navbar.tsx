import React from "react";
import siteConfig from "../config/site.json";
import { Layout, ShieldCheck, HelpCircle, Download, RefreshCw } from "lucide-react";

interface NavbarProps {
  onGoHome: () => void;
  onOpenHelp: () => void;
  currentSessionName?: string;
  autoSaveStatus?: string;
  isInstallable?: boolean;
  isInstalled?: boolean;
  hasUpdate?: boolean;
  onPromptInstall?: () => void;
  onApplyUpdate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenHelp,
  currentSessionName,
  autoSaveStatus = "Saved locally",
  isInstallable = false,
  isInstalled = false,
  hasUpdate = false,
  onPromptInstall,
  onApplyUpdate,
}) => {
  return (
    <header style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)", position: "sticky", top: 0, zIndex: 800 }}>
      <div className="container flex items-center justify-between" style={{ height: "56px" }}>
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2" style={{ cursor: "pointer", minWidth: 0 }} onClick={onGoHome}>
          <img
            src="/logo-64.png"
            alt={siteConfig.name}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              objectFit: "cover",
              border: "1px solid var(--border-subtle)",
              flexShrink: 0,
            }}
          />
          <div className="min-w-0">
            <h2 className="truncate" style={{ fontSize: "1.1rem", lineHeight: 1.1 }}>
              {siteConfig.name} <span style={{ fontSize: "0.65rem", color: "var(--accent-primary)", fontWeight: 700, verticalAlign: "middle" }}>PWA</span>
            </h2>
            <p className="hide-mobile truncate" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{siteConfig.tagline}</p>
          </div>
        </div>

        {/* Active Session Name Badge */}
        {currentSessionName && (
          <div className="flex items-center gap-1 min-w-0" style={{ backgroundColor: "var(--bg-input)", padding: "0.25rem 0.6rem", borderRadius: "9999px", border: "1px solid var(--border-subtle)", maxWidth: "160px" }}>
            <span className="truncate" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{currentSessionName}</span>
            <span className="badge badge-emerald hide-mobile" style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem" }}>
              <ShieldCheck size={10} /> {autoSaveStatus}
            </span>
          </div>
        )}

        {/* Header Right Action Navigation Buttons */}
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          {hasUpdate ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={onApplyUpdate}
              title="Update to Newest Version"
              style={{ backgroundColor: "#0284c7" }}
            >
              <RefreshCw size={15} />
              <span>Update Ready</span>
            </button>
          ) : isInstallable && !isInstalled && onPromptInstall ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={onPromptInstall}
              title="Install Splitify App"
            >
              <Download size={15} />
              <span>Install App</span>
            </button>
          ) : null}

          <button className="btn btn-outline btn-sm" onClick={onOpenHelp} title="Help & Guide">
            <HelpCircle size={16} color="var(--accent-primary)" />
            <span className="hide-mobile">Help & Guide</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onGoHome} title="My Trips">
            <Layout size={16} />
            <span className="hide-mobile">My Trips</span>
          </button>
        </div>
      </div>
    </header>
  );
};

