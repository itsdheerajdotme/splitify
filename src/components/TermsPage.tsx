import React from "react";
import siteConfig from "../config/site.json";
import { FileText, Lock, HardDrive, AlertTriangle, Scale, EyeOff } from "lucide-react";
import { InfoPageNav } from "./InfoPageNav";
import { InfoPageFooter } from "./InfoPageFooter";

interface TermsPageProps {
  onBackToApp: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({
  onBackToApp,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
}) => {
  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "800px" }}>
      {/* Consistent Top Navigation Header */}
      <InfoPageNav
        activePage="terms"
        onBackToApp={onBackToApp}
        onNavigateHelp={onNavigateHelp}
        onNavigateTerms={onNavigateTerms}
        onNavigatePrivacy={onNavigatePrivacy}
      />

      {/* Main Header Card */}
      <div className="card text-center" style={{ backgroundColor: "var(--bg-input)", padding: "2rem 1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <FileText size={28} />
        </div>
        <h1 style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>Terms & Conditions</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "550px", margin: "0 auto" }}>
          Usage guidelines, 100% user responsibility for transaction links & exported JSON/CSV data, sensitive data disclaimers, and legal immunity clauses.
        </p>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
          Last Updated: August 2026
        </div>
      </div>

      {/* Structured Terms Content */}
      <div className="flex flex-col gap-4">
        {/* Section 1: Full Agreement & Complete Legal Disconnection */}
        <div className="card" style={{ borderColor: "rgba(239, 68, 68, 0.3)", backgroundColor: "rgba(239, 68, 68, 0.03)" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
            <Scale size={20} color="#ef4444" /> 1. Full User Agreement & Legal Immunity
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            By accessing or using <strong>{siteConfig.name}</strong> ({siteConfig.domainUrl}), you acknowledge and fully agree to all terms and conditions set forth herein. {siteConfig.name} is provided strictly as a free-to-use utility tool on an <em>"AS IS"</em> basis. By using this application, you agree that {siteConfig.name} and its creators are completely exempt from any legal matters, claims, disputes, liabilities, or lawsuits. {siteConfig.name} does not bind itself to any legal action or liability from users under any circumstances.
          </p>
        </div>

        {/* Section 2: Transaction Links, Exported JSON/CSV Data & Data Handling Disclaimer */}
        <div className="card" style={{ borderColor: "rgba(234, 179, 8, 0.3)", backgroundColor: "rgba(234, 179, 8, 0.03)" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
            <Lock size={20} color="#eab308" /> 2. Transaction Links, Exported Data (JSON/CSV) & Data Handling Disclaimer
          </h2>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-2">
            <p>
              While {siteConfig.name} strives best to provide a free service and keep your local browser data private, <strong>{siteConfig.name} takes zero ownership or responsibility for any data shared or exported through any medium—including transaction links, web URLs, exported JSON backup files, CSV reports, or any other data sharing methods</strong>.
            </p>
            <ul style={{ paddingLeft: "1.25rem" }} className="flex flex-col gap-1">
              <li>The user is solely responsible for handling, distributing, securing, and managing all transaction links, exported JSON files, and CSV data reports.</li>
              <li>Whoever receives, copies, downloads, views, imports, or forwards data from a transaction link or exported file operates entirely independently. {siteConfig.name} assumes zero liability for third-party access, distribution, or handling of such shared data.</li>
              <li>You are solely responsible for ensuring that transaction links and exported files are shared only with authorized and trusted recipients.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Sensitive Information & PII Disclaimer */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <EyeOff size={20} color="var(--accent-primary)" /> 3. PII & Sensitive Transaction Data Disclaimer
          </h2>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-2">
            <p>
              {siteConfig.name} is a free tool and does not collect or request any Personally Identifiable Information (PII), bank details, or passwords.
            </p>
            <p>
              If a user voluntarily inputs sensitive personal details, confidential transaction notes, or financial figures into any text field, <strong>the user assumes full responsibility for doing so</strong>. {siteConfig.name} strictly advises against including sensitive information in transaction titles or notes, takes no ownership over such data, and assumes no liability for any loss, exposure, or sharing of such information.
            </p>
          </div>
        </div>

        {/* Section 4: Browser Local Storage */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <HardDrive size={20} color="var(--accent-primary)" /> 4. Local Storage & Data Ownership
          </h2>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-2">
            <p>
              {siteConfig.name} operates as a 100% Client-Side Web Application. All sessions and expenses are saved locally on your device via browser IndexedDB/LocalStorage.
            </p>
            <ul style={{ paddingLeft: "1.25rem" }} className="flex flex-col gap-1">
              <li>You maintain full control over local device data.</li>
              <li>{siteConfig.name} does not maintain central user accounts, server databases, or automated cloud backups.</li>
              <li>If you clear your browser storage without saving a <code>JSON</code> backup, local data cannot be recovered by us.</li>
            </ul>
          </div>
        </div>

        {/* Section 5: Software Disclaimer & Limitation of Liability */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={20} color="var(--accent-primary)" /> 5. General Limitation of Liability
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Under no circumstances shall {siteConfig.name}, its developers, or affiliates be liable for any direct, indirect, incidental, or consequential damages, financial losses, transaction disputes, or data loss resulting from the use of or inability to use this free software.
          </p>
        </div>
      </div>

      {/* Consistent Footer */}
      <InfoPageFooter
        activePage="terms"
        onNavigateHelp={onNavigateHelp}
        onNavigateTerms={onNavigateTerms}
        onNavigatePrivacy={onNavigatePrivacy}
      />
    </div>
  );
};
