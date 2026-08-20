import React from "react";
import siteConfig from "../config/site.json";
import { ShieldCheck, Lock, EyeOff, HardDrive, Smartphone, Cpu } from "lucide-react";
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
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "650px", margin: "0 auto", lineHeight: 1.6 }}>
            100% Client-Side Architecture. Zero central database tracking, zero server account requirements, zero personal data collection, and total local browser sovereignty.
          </p>
          <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", marginTop: "1rem", fontWeight: 600 }}>
            Effective Date: August 2026
          </div>
        </div>

        {/* Structured Privacy Content */}
        <div className="flex flex-col gap-4">
          {/* Section 1: 100% Client-Side Architecture */}
          <div className="card" style={{ borderColor: "rgba(16, 185, 129, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Cpu size={22} color="var(--accent-primary)" /> 1. 100% Client-Side Architecture & Zero Accounts
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                <strong>{siteConfig.name}</strong> is engineered from the ground up as a privacy-first, client-side Progressive Web Application (PWA). Unlike traditional financial or expense-tracking platforms, {siteConfig.name} requires <strong>no user accounts, no login credentials, no email verification, no phone numbers, and no passwords</strong>.
              </p>
              <p>
                All mathematical calculations, debt simplifications, split ratios, and trip session records are computed 100% locally inside your web browser engine on your own device.
              </p>
            </div>
          </div>

          {/* Section 2: Zero Server PII Collection */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <EyeOff size={22} color="var(--accent-primary)" /> 2. Zero Server PII Collection & Zero Tracking
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                We do not collect, monetize, sell, or rent your Personally Identifiable Information (PII) or financial figures to advertisers, data brokers, or third-party corporations.
              </p>
              <ul style={{ paddingLeft: "1.25rem" }} className="flex flex-col gap-2">
                <li>
                  <strong>No Central Database:</strong> Your trip names, participant names, and expense items are never stored on a central backend database.
                </li>
                <li>
                  <strong>No Third-Party Advertising Trackers:</strong> {siteConfig.name} does not load intrusive ad networks, behavioral tracking pixels, or cross-site profiling scripts.
                </li>
                <li>
                  <strong>Standard Analytics:</strong> We use basic, privacy-preserving website performance measurements solely to monitor software uptime and page render speeds.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Shared Trip Links & Temporary Storage */}
          <div className="card" style={{ borderColor: "rgba(234, 179, 8, 0.3)", backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Lock size={22} color="#eab308" /> 3. Shared Trip Links & 24-Hour Temporary Storage
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                When you explicitly click <strong>"Share Trip Link"</strong>, a temporary encrypted copy of your trip data is uploaded to a serverless KV storage node solely to allow your friends to import the session.
              </p>
              <ul style={{ paddingLeft: "1.25rem" }} className="flex flex-col gap-2">
                <li>
                  <strong>Automatic 24-Hour Expiration:</strong> All shared trip link payloads automatically self-destruct and clear from memory after 24 hours.
                </li>
                <li>
                  <strong>User Sovereignty:</strong> Once a friend imports the trip via link, the data is saved directly into their device's browser, and no server connection remains open.
                </li>
                <li>
                  <strong>Sharing Responsibility:</strong> The user generating the share link is solely responsible for distributing the URL to trusted individuals.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4: Local Storage (IndexedDB) & Data Control */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <HardDrive size={22} color="var(--accent-primary)" /> 4. Local Storage (IndexedDB) & User Data Sovereignty
            </h2>
            <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }} className="flex flex-col gap-3">
              <p>
                Your saved trips, custom expense entries, and debt settlement figures remain stored strictly on your local physical device using browser <code>IndexedDB</code> and <code>LocalStorage</code>.
              </p>
              <p>
                You can export a full <code>.json</code> backup file or formatted <code>.csv</code> spreadsheet at any time from the Export & Settings tab to maintain personal offline archives. Clearing your browser site data will reset your local workspace.
              </p>
            </div>
          </div>

          {/* Section 5: Offline PWA & Device Rights */}
          <div className="card" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-main)" }}>
              <Smartphone size={22} color="var(--accent-primary)" /> 5. Offline PWA & Device Rights
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {siteConfig.name} installs directly onto your Android, iOS, or Desktop home screen via Service Workers. The application operates 100% offline without cellular or Wi-Fi data access. You retain 100% data ownership and control over your software instance.
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
