import React from "react";
import siteConfig from "../config/site.json";
import { FileText, Lock, Scale, ShieldAlert, HardDrive } from "lucide-react";
import { LandingNav } from "./LandingNav";
import { LandingFooter } from "./LandingFooter";

interface TermsPageProps {
  onBackToApp: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateDemo?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  onBackToApp,
  onNavigateHelp = () => {},
  onNavigateTerms = () => {},
  onNavigatePrivacy = () => {},
  onNavigateDemo,
}) => {
  return (
    <div className="landing-page-root flex flex-col min-h-screen">
      {/* Landing Navigation Header */}
      <LandingNav onLaunchApp={onBackToApp} onNavigateDemo={onNavigateDemo} />

      {/* Main Content Body */}
      <main className="landing-container flex-1" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "850px" }}>
        {/* Main Header Card */}
        <div className="card text-center" style={{ backgroundColor: "var(--bg-card)", padding: "2.5rem 1.5rem", marginBottom: "2rem", border: "1px solid var(--border-subtle)" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <FileText size={28} />
          </div>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Terms & Conditions — {siteConfig.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Software licensing, zero-backend data ownership rules, transaction link and exported JSON/CSV data disclaimers, and legal immunity clauses.
          </p>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", marginTop: "1rem", fontWeight: 600 }}>
            Last Updated: August 2026
          </div>
        </div>

        {/* Structured Terms Content */}
        <div className="flex flex-col gap-4">
          {/* Section 1: Full Agreement & Legal Immunity */}
          <div className="card" style={{ borderColor: "rgba(239, 68, 68, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Scale size={22} color="#ef4444" /> 1. Full User Agreement & Legal Immunity
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              By using <strong>{siteConfig.name}</strong>, you agree to all terms. {siteConfig.name} is provided strictly free <em>"AS IS"</em> without warranties of any kind. {siteConfig.name} and its creators are completely exempt from any legal matters, claims, disputes, liabilities, or lawsuits. {siteConfig.name} does not bind itself to any legal action or liability from users under any circumstances.
            </p>
          </div>

          {/* Section 2: Transaction Links & Exported Data Disclaimer */}
          <div className="card" style={{ borderColor: "rgba(234, 179, 8, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Lock size={22} color="#eab308" /> 2. Transaction Links, Exported Data (JSON/CSV) & Data Handling Disclaimer
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {siteConfig.name} takes zero ownership or responsibility for any data shared or exported through any medium—including transaction links, web URLs, exported JSON backup files, CSV reports, or any other data sharing methods. The user is solely responsible for handling, distributing, and managing transaction links and exported data. Whoever receives, copies, or downloads data acts independently.
            </p>
          </div>

          {/* Section 3: PII & Sensitive Transaction Data Disclaimer */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <ShieldAlert size={22} color="var(--accent-primary)" /> 3. PII & Sensitive Transaction Data Disclaimer
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {siteConfig.name} does not collect Personally Identifiable Information (PII) or banking credentials. Users entering sensitive notes or data into fields assume full responsibility. {siteConfig.name} disclaims all liability for loss or sharing of user-entered data.
            </p>
          </div>

          {/* Section 4: Local Storage & Data Ownership */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <HardDrive size={22} color="var(--accent-primary)" /> 4. Local Storage & Data Ownership
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {siteConfig.name} operates 100% client-side via IndexedDB/LocalStorage inside your device browser. Users maintain full local device control. Clearing browser data or cache will permanently remove local sessions unless previously exported by the user.
            </p>
          </div>
        </div>
      </main>

      {/* Landing Footer */}
      <LandingFooter
        onNavigateHelp={onNavigateHelp}
        onNavigateTerms={onNavigateTerms}
        onNavigatePrivacy={onNavigatePrivacy}
        onNavigateDemo={onNavigateDemo}
      />
    </div>
  );
};
