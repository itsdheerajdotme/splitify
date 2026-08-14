import React from "react";
import siteConfig from "../config/site.json";
import { Zap, HelpCircle, FileText, Lock } from "lucide-react";

export type InfoPageType = "help" | "terms" | "privacy";

interface InfoPageNavProps {
  activePage: InfoPageType;
  onBackToApp: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export const InfoPageNav: React.FC<InfoPageNavProps> = ({
  activePage,
  onBackToApp,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: "1.5rem" }}>
      {/* Primary App Launch Action Button */}
      <button className="btn btn-primary btn-sm" onClick={onBackToApp}>
        <Zap size={16} /> Launch {siteConfig.name} App
      </button>

      {/* 3 Consistent Navigation Option Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {onNavigateHelp && (
          <button
            className={`btn btn-sm ${activePage === "help" ? "btn-secondary" : "btn-outline"}`}
            onClick={onNavigateHelp}
            style={activePage === "help" ? { borderColor: "var(--accent-primary)", color: "var(--accent-primary)", fontWeight: 700 } : {}}
          >
            <HelpCircle size={14} /> Help & FAQ
          </button>
        )}
        {onNavigateTerms && (
          <button
            className={`btn btn-sm ${activePage === "terms" ? "btn-secondary" : "btn-outline"}`}
            onClick={onNavigateTerms}
            style={activePage === "terms" ? { borderColor: "var(--accent-primary)", color: "var(--accent-primary)", fontWeight: 700 } : {}}
          >
            <FileText size={14} /> Terms & Conditions
          </button>
        )}
        {onNavigatePrivacy && (
          <button
            className={`btn btn-sm ${activePage === "privacy" ? "btn-secondary" : "btn-outline"}`}
            onClick={onNavigatePrivacy}
            style={activePage === "privacy" ? { borderColor: "var(--accent-primary)", color: "var(--accent-primary)", fontWeight: 700 } : {}}
          >
            <Lock size={14} /> Privacy Policy
          </button>
        )}
      </div>
    </div>
  );
};
