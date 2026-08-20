import React from "react";
import siteConfig from "../config/site.json";
import { FileText, Lock, Scale, HardDrive, AlertTriangle, EyeOff } from "lucide-react";
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
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "650px", margin: "0 auto", lineHeight: 1.6 }}>
            Software licensing terms, 100% user data sovereignty, transaction link and exported JSON/CSV data disclaimers, sensitive information guidelines, and complete legal immunity clauses.
          </p>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", marginTop: "1rem", fontWeight: 600 }}>
            Last Updated: August 2026
          </div>
        </div>

        {/* Structured Terms Content */}
        <div className="flex flex-col gap-4">
          {/* Section 1: Full User Agreement & Legal Immunity */}
          <div className="card" style={{ borderColor: "rgba(239, 68, 68, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Scale size={22} color="#ef4444" /> 1. Full User Agreement & Complete Legal Immunity
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                By accessing or using <strong>{siteConfig.name}</strong> ({siteConfig.domainUrl}), you acknowledge, understand, and fully agree to all terms and conditions set forth in this agreement. {siteConfig.name} is provided strictly as a free-to-use utility tool on an <em>"AS IS"</em> and <em>"AS AVAILABLE"</em> basis without warranties or guarantees of any kind, whether express or implied.
              </p>
              <p>
                By using this application, you explicitly agree that {siteConfig.name}, its creator(s), contributors, and affiliates are <strong>completely exempt and immune from any and all legal matters, claims, disputes, liabilities, financial losses, or lawsuits</strong>. {siteConfig.name} does not bind itself to any legal action or financial liability from users or third parties under any circumstances.
              </p>
            </div>
          </div>

          {/* Section 2: Transaction Links, Exported JSON/CSV Data & Data Handling Disclaimer */}
          <div className="card" style={{ borderColor: "rgba(234, 179, 8, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Lock size={22} color="#eab308" /> 2. Transaction Links, Exported Data (JSON/CSV) & User Responsibility
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                While {siteConfig.name} is built to prioritize user privacy by processing all expense math locally in the browser, <strong>{siteConfig.name} takes zero ownership or legal responsibility for any data shared, transmitted, or exported through any medium</strong>—including generated 24-hour transaction share links, web URLs, exported JSON backup files, CSV reports, or messaging platforms.
              </p>
              <ul style={{ paddingLeft: "1.25rem" }} className="flex flex-col gap-2">
                <li>
                  <strong>User Responsibility:</strong> The user initiating, generating, or sharing any data link or file is solely responsible for handling, distributing, securing, and managing recipient access.
                </li>
                <li>
                  <strong>Independent Action of Recipients:</strong> Anyone who receives, copies, downloads, views, imports, or forwards data from a transaction link or exported JSON/CSV report acts entirely independently. {siteConfig.name} assumes zero liability for third-party access, misuse, or redistribution.
                </li>
                <li>
                  <strong>Temporary Storage:</strong> Temporary share payloads uploaded for 24-hour trip sharing are automatically deleted upon expiration. {siteConfig.name} provides no guarantees regarding uptime, accessibility, or backup of temporary share links.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: PII & Sensitive Transaction Data Disclaimer */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <EyeOff size={22} color="var(--accent-primary)" /> 3. PII & Sensitive Transaction Data Disclaimer
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                {siteConfig.name} is a free group bill calculator requiring <strong>zero account registration, zero credit card details, zero bank account links, and zero passwords</strong>.
              </p>
              <p>
                If a user voluntarily inputs sensitive personal details, confidential financial notes, account numbers, or banking credentials into session titles or expense notes fields, <strong>the user assumes 100% full responsibility for doing so</strong>. {siteConfig.name} strongly advises against entering sensitive personal or financial information, takes zero ownership over user-entered text, and disclaims all liability for loss, exposure, or unauthorized sharing of such user-input data.
              </p>
            </div>
          </div>

          {/* Section 4: Local Storage & Data Sovereignty */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <HardDrive size={22} color="var(--accent-primary)" /> 4. Browser Storage & Local Data Sovereignty
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                {siteConfig.name} operates as a 100% Client-Side Web Application. All session titles, member names, expense items, and debt calculations are stored locally inside your web browser via <code>IndexedDB</code> / <code>LocalStorage</code>.
              </p>
              <ul style={{ paddingLeft: "1.25rem" }} className="flex flex-col gap-2">
                <li>You maintain full, sovereign control over your device's local browser data.</li>
                <li>{siteConfig.name} does not maintain central user accounts, server databases, or automated cloud backups of your expense records.</li>
                <li>Clearing your device browser cache, site data, or uninstalling your browser will permanently delete local trip records unless you have previously downloaded a JSON backup file.</li>
              </ul>
            </div>
          </div>

          {/* Section 5: General Limitation of Liability */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <AlertTriangle size={22} color="var(--accent-primary)" /> 5. General Limitation of Liability
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Under no circumstances shall {siteConfig.name}, its developers, maintainers, or affiliates be held liable for any direct, indirect, incidental, special, consequential, or punitive damages, financial calculation disagreements, interpersonal disputes, or data loss resulting from the use of or inability to use this free software.
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
