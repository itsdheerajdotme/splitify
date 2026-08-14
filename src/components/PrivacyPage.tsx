import React from "react";
import siteConfig from "../config/site.json";
import { ShieldCheck, Lock, EyeOff, Server, AlertCircle, Scale } from "lucide-react";
import { InfoPageNav } from "./InfoPageNav";
import { InfoPageFooter } from "./InfoPageFooter";

interface PrivacyPageProps {
  onBackToApp: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  onBackToApp,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
}) => {
  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "800px" }}>
      {/* Consistent Top Navigation Header */}
      <InfoPageNav
        activePage="privacy"
        onBackToApp={onBackToApp}
        onNavigateHelp={onNavigateHelp}
        onNavigateTerms={onNavigateTerms}
        onNavigatePrivacy={onNavigatePrivacy}
      />

      {/* Main Header Card */}
      <div className="card text-center" style={{ backgroundColor: "var(--bg-input)", padding: "2rem 1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>Privacy Policy</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "550px", margin: "0 auto" }}>
          100% Client-Side Architecture. Zero server PII collection, user responsibility for transaction links & exported files, and complete privacy disclaimers.
        </p>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
          Effective Date: August 2026
        </div>
      </div>

      {/* Structured Privacy Content */}
      <div className="flex flex-col gap-4">
        {/* Section 1: Zero Data Collection */}
        <div className="card" style={{ borderColor: "rgba(16, 185, 129, 0.3)", backgroundColor: "rgba(16, 185, 129, 0.03)" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <EyeOff size={20} color="#10b981" /> 1. Zero Server PII Collection & Zero Accounts
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            <strong>{siteConfig.name}</strong> is a free tool that does not collect, request, sell, or store your Personally Identifiable Information (PII), phone number, email address, or banking credentials. No user accounts or passwords exist.
          </p>
        </div>

        {/* Section 2: Transaction Links & Exported Data Disclaimer */}
        <div className="card" style={{ borderColor: "rgba(234, 179, 8, 0.3)", backgroundColor: "rgba(234, 179, 8, 0.03)" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
            <Lock size={20} color="#eab308" /> 2. Transaction Links, Exported Data (JSON/CSV) & User Responsibility
          </h2>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-2">
            <p>
              When you generate a <strong>Transaction Link</strong>, export a <strong>JSON backup file</strong>, or download a <strong>CSV report</strong>, you are taking explicit control of your local data payload.
            </p>
            <p>
              <strong>{siteConfig.name} assumes zero ownership or liability over transaction links, exported JSON files, CSV reports, or any other data sharing mediums</strong>. Whoever receives, views, copies, imports, or downloads data from a transaction link or exported file acts independently. The user who generates, exports, or distributes the data is solely responsible for managing recipient access and link/file distribution.
            </p>
          </div>
        </div>

        {/* Section 3: User Input & Sensitive Information Responsibility */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={20} color="var(--accent-primary)" /> 3. Responsibility for User-Entered Data
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Users are solely responsible for all titles, descriptions, and details entered into transaction fields. {siteConfig.name} does not inspect, moderate, or recommend adding sensitive financial or personal information. {siteConfig.name} disclaims all liability and ownership regarding loss or unauthorized sharing of data entered by users.
          </p>
        </div>

        {/* Section 4: Browser Local Storage */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Server size={20} color="var(--accent-primary)" /> 4. Local Browser Storage (IndexedDB)
          </h2>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-2">
            <p>
              Your session titles, friends' names, and individual expense line items stay saved exclusively inside your browser's persistent IndexedDB storage engine.
            </p>
            <ul style={{ paddingLeft: "1.25rem" }} className="flex flex-col gap-1">
              <li>Our web servers never see, read, or process your expense figures.</li>
              <li>You can export a full offline <code>JSON</code> backup or clean CSV report anytime.</li>
              <li>Clearing your site data in browser settings completely wipes all local sessions.</li>
            </ul>
          </div>
        </div>

        {/* Section 5: Legal Immunity & Disclaimer */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Scale size={20} color="var(--accent-primary)" /> 5. Legal Disclaimer & Immunity
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            By using this application, you agree that {siteConfig.name} and its creators are completely exempt from any legal matters, claims, or disputes arising from user activity, transaction link distribution, exported data sharing, or data handling.
          </p>
        </div>
      </div>

      {/* Consistent Footer */}
      <InfoPageFooter
        activePage="privacy"
        onNavigateHelp={onNavigateHelp}
        onNavigateTerms={onNavigateTerms}
        onNavigatePrivacy={onNavigatePrivacy}
      />
    </div>
  );
};
