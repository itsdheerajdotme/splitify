import React from "react";
import siteConfig from "../config/site.json";
import { ShieldCheck, Mail } from "lucide-react";
import { InfoPageType } from "./InfoPageNav";

interface InfoPageFooterProps {
  activePage: InfoPageType;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export const InfoPageFooter: React.FC<InfoPageFooterProps> = ({
  activePage,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
}) => {
  return (
    <div className="card" style={{ backgroundColor: "var(--bg-input)", marginTop: "2rem" }}>
      <div className="flex items-center gap-2" style={{ marginBottom: "0.5rem" }}>
        <ShieldCheck size={18} color="var(--accent-primary)" />
        <h4 style={{ fontSize: "1rem" }}>{siteConfig.privacyNotice}</h4>
      </div>

      <div className="flex flex-col gap-1" style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        <div className="flex items-center gap-2">
          <Mail size={14} /> Support Email:{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} style={{ color: "var(--accent-primary)" }}>
            {siteConfig.supportEmail}
          </a>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.8rem" }}>
          <span>{siteConfig.copyright}</span>
          <div className="flex items-center gap-2">
            {onNavigateHelp && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={onNavigateHelp}
                style={activePage === "help" ? { color: "var(--accent-primary)", fontWeight: 700 } : {}}
              >
                Help & FAQ
              </button>
            )}
            {onNavigateTerms && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={onNavigateTerms}
                style={activePage === "terms" ? { color: "var(--accent-primary)", fontWeight: 700 } : {}}
              >
                Terms
              </button>
            )}
            {onNavigatePrivacy && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={onNavigatePrivacy}
                style={activePage === "privacy" ? { color: "var(--accent-primary)", fontWeight: 700 } : {}}
              >
                Privacy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
