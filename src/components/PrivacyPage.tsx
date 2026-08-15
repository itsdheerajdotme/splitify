import React from "react";
import siteConfig from "../config/site.json";
import { ShieldCheck, Lock, EyeOff, HardDrive, UserCheck } from "lucide-react";
import { LandingNav } from "./LandingNav";
import { LandingFooter } from "./LandingFooter";

interface PrivacyPageProps {
  onBackToApp: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateDemo?: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
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
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Privacy Policy — {siteConfig.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            100% Client-Side Architecture. Zero server data collection, zero personal tracking, and complete user data sovereignty.
          </p>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", marginTop: "1rem", fontWeight: 600 }}>
            Effective Date: August 2026
          </div>
        </div>

        {/* Structured Privacy Content */}
        <div className="flex flex-col gap-4">
          {/* Section 1: Zero Server PII Collection & Zero Accounts */}
          <div className="card" style={{ borderColor: "rgba(16, 185, 129, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <EyeOff size={22} color="var(--accent-primary)" /> 1. Zero Server PII Collection & Zero Accounts
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <strong>{siteConfig.name}</strong> is a free tool requiring no account, PII, email, or password. All data processing occurs locally inside your web browser.
            </p>
          </div>

          {/* Section 2: Transaction Links & Exported Data Disclaimer */}
          <div className="card" style={{ borderColor: "rgba(234, 179, 8, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Lock size={22} color="#eab308" /> 2. Transaction Links, Exported Data (JSON/CSV) & User Responsibility
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {siteConfig.name} assumes zero ownership or liability over transaction links, exported JSON files, CSV reports, or any data sharing medium. The user generating or sharing the data is solely responsible for managing recipient access.
            </p>
          </div>

          {/* Section 3: Responsibility for User-Entered Data */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <UserCheck size={22} color="var(--accent-primary)" /> 3. Responsibility for User-Entered Data
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Users are solely responsible for data entered into transaction fields. {siteConfig.name} takes no ownership and disclaims liability for loss or sharing of such data.
            </p>
          </div>

          {/* Section 4: Local Browser Storage (IndexedDB) */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <HardDrive size={22} color="var(--accent-primary)" /> 4. Local Browser Storage (IndexedDB)
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Expense entries stay saved on your device. We do not store or sell your financial figures.
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
