import React, { useState } from "react";
import siteConfig from "../config/site.json";
import { ChevronDown, ChevronUp, Smartphone, Download, RefreshCw, HelpCircle } from "lucide-react";
import { InfoPageNav } from "./InfoPageNav";
import { InfoPageFooter } from "./InfoPageFooter";

interface HelpPageProps {
  onBackToApp: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
  onPromptInstall?: () => void;
  isCheckingUpdate?: boolean;
  onCheckForUpdates?: () => Promise<boolean>;
  hasUpdate?: boolean;
  onApplyUpdate?: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({
  onBackToApp,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
  isInstallable = false,
  isInstalled = false,
  onPromptInstall,
  isCheckingUpdate = false,
  onCheckForUpdates,
  hasUpdate = false,
  onApplyUpdate,
}) => {
  const [openSection, setOpenSection] = useState<number | null>(1);

  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "800px" }}>
      {/* Consistent Top Navigation Header */}
      <InfoPageNav
        activePage="help"
        onBackToApp={onBackToApp}
        onNavigateHelp={onNavigateHelp}
        onNavigateTerms={onNavigateTerms}
        onNavigatePrivacy={onNavigatePrivacy}
      />

      {/* Main Page Header */}
      <div className="card text-center" style={{ backgroundColor: "var(--bg-input)", padding: "2rem 1.25rem", marginBottom: "1.5rem" }}>
        <img
          src="/logo-128.png"
          alt={siteConfig.name}
          style={{ width: "64px", height: "64px", borderRadius: "16px", margin: "0 auto 0.75rem", border: "1px solid var(--border-subtle)" }}
        />
        <h1 style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>How To Use {siteConfig.name} & FAQs</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "580px", margin: "0 auto 1.25rem" }}>
          Comprehensive guide on splitting expenses across 4 calculation modes (Equal, %, Shares, Custom), offline PWA usage, temporary 24-hr link sharing, and data privacy.
        </p>
      </div>

      {/* Frequently Asked Questions Section */}
      <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <HelpCircle size={20} color="var(--accent-primary)" /> Frequently Asked Questions (FAQ)
      </h2>

      {/* Interactive Guide Accordion */}
      <div className="flex flex-col gap-3" style={{ marginBottom: "2rem" }}>
        {/* Step 1 */}
        <div className="card">
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(1)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                1
              </div>
              <h3 style={{ fontSize: "1.1rem" }}>Creating a Trip & Adding Friends</h3>
            </div>
            {openSection === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 1 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Click <strong>New Session / Trip</strong> from the home dashboard.</li>
                <li>Enter a title (e.g. <em>"Goa Vacation"</em>, <em>"Roommates August"</em>, <em>"Friday Dinner"</em>).</li>
                <li>Type your group members' names and click <strong>Add</strong>.</li>
                <li>Click <strong>Create Session</strong> to launch your trip workspace immediately. No accounts required!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="card">
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(2)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                2
              </div>
              <h3 style={{ fontSize: "1.1rem" }}>Adding Expenses & 4 Split Methods</h3>
            </div>
            {openSection === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 2 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.75rem" }}>Click <strong>Add Expense</strong> inside your trip and select your preferred split mode:</p>
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li><strong>Equal Split</strong>: Divides the total bill evenly among selected friends.</li>
                <li><strong>Percentage (%)</strong>: Assign exact percentage shares for each person (must sum to 100%).</li>
                <li><strong>By Shares</strong>: Assign relative ratios (e.g., 2 shares for couples vs 1 share for singles).</li>
                <li><strong>Custom Amount (₹)</strong>: Specify exact custom figures per participant down to the penny.</li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>
                💡 <em>Tip: Splitify automatically suggests categories and icons (🍔 Restaurant, ⛽ Fuel, 🏨 Hotel) as you type the expense description!</em>
              </p>
            </div>
          )}
        </div>

        {/* Step 3 */}
        <div className="card">
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(3)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                3
              </div>
              <h3 style={{ fontSize: "1.1rem" }}>How does Splitify calculate balances & simplify debt?</h3>
            </div>
            {openSection === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 3 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.75rem" }}>
                Instead of making 15 back-and-forth money transfers between friends, navigate to the <strong>Balances</strong> tab.
              </p>
              <p>
                Splitify’s intelligent greedy debt algorithm calculates the minimum direct payments needed to settle everyone’s net position cleanly. You can toggle between <em>Simplified View</em> and <em>Detailed Net View</em> anytime.
              </p>
            </div>
          )}
        </div>

        {/* Step 4 */}
        <div className="card">
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(4)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                4
              </div>
              <h3 style={{ fontSize: "1.1rem" }}>Recording Settlements</h3>
            </div>
            {openSection === 4 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 4 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p>
                When a friend transfers money to settle their debt, simply click <strong>Record Settlement</strong> next to their recommended payment in the <strong>Balances</strong> tab. This automatically records a settlement transaction and updates net balances.
              </p>
            </div>
          )}
        </div>

        {/* Step 5 */}
        <div className="card">
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(5)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                5
              </div>
              <h3 style={{ fontSize: "1.1rem" }}>Sharing Trips via Temporary 24-Hour Links</h3>
            </div>
            {openSection === 5 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 5 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.75rem" }}>
                Splitify allows you to share an entire trip session with friends using a secure web link without requiring any user registration:
              </p>
              <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <li>Navigate to the <strong>Settings & Export</strong> tab inside your active trip.</li>
                <li>Click <strong>Share Trip Link</strong> under the <em>Share & Export Data</em> card.</li>
                <li>Splitify generates a short link (e.g. <code>{siteConfig.domainUrl}/?share=x7k9p2</code>).</li>
                <li>Use <strong>Copy Link</strong> or click <strong>Send via App</strong> to share directly via WhatsApp, Telegram, or Email.</li>
              </ol>

              <div className="card" style={{ backgroundColor: "var(--bg-input)", padding: "0.75rem 1rem", marginTop: "0.75rem", marginBottom: "0.75rem", borderLeft: "3px solid #eab308" }}>
                <strong style={{ color: "var(--text-main)", display: "block", marginBottom: "0.25rem" }}>⚡ 24-Hour Expiration & Privacy:</strong>
                Share links auto-expire and hard-delete automatically from cloud storage after <strong>24 hours</strong>.
              </div>
            </div>
          )}
        </div>

        {/* Step 6 */}
        <div className="card">
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(6)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--accent-light)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                6
              </div>
              <h3 style={{ fontSize: "1.1rem" }}>CSV Export & Offline JSON Backup</h3>
            </div>
            {openSection === 6 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 6 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.75rem" }}>
                Because all data stays local to your browser, Splitify provides backup and reporting tools under <strong>Settings</strong>:
              </p>
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li><strong>Export Formatted CSV</strong>: Downloads an Excel & Google Sheets ready report containing participant shares, dates, categories, notes, and totals.</li>
                <li><strong>Download Backup JSON</strong>: Downloads a full JSON backup file of your trip session.</li>
                <li><strong>Restore Session from JSON File</strong>: Upload any previously saved <code>.json</code> backup file on a new device to restore all records.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Step 7 */}
        <div className="card" style={{ borderColor: "rgba(16, 185, 129, 0.3)", backgroundColor: "rgba(16, 185, 129, 0.04)" }}>
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(7)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                7
              </div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>Is my financial expense data stored on a central server?</h3>
            </div>
            {openSection === 7 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 7 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.75rem" }}>
                No! Splitify is built with a strict <strong>Privacy-First Philosophy</strong>:
              </p>
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <li><strong>Stored in Your Browser</strong>: All your trip names, friends, and expenses stay saved directly inside your device browser (IndexedDB).</li>
                <li><strong>No Accounts Required</strong>: Zero accounts, zero emails, zero passwords.</li>
                <li><strong>Complete Data Ownership</strong>: Export CSVs or JSON backups anytime, or wipe data with a single click.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Step 8: PWA Installation & Offline Support */}
        <div className="card" style={{ borderColor: "rgba(59, 130, 246, 0.3)", backgroundColor: "rgba(59, 130, 246, 0.04)" }}>
          <div
            className="flex items-center justify-between"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection(8)}
          >
            <div className="flex items-center gap-3">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                8
              </div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>Can I use Splitify without an internet connection?</h3>
            </div>
            {openSection === 8 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 8 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.75rem" }}>
                Yes! You can install Splitify directly onto your iPhone, Android phone, or computer to use it as a native Progressive Web App (PWA) that works <strong>100% offline with zero internet access required</strong>:
              </p>

              <div className="flex flex-col gap-3" style={{ marginBottom: "1rem" }}>
                <div style={{ backgroundColor: "var(--bg-input)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                  <strong style={{ color: "var(--text-main)", display: "block", marginBottom: "0.25rem" }}>🤖 Android & Desktop (Chrome / Edge / Brave):</strong>
                  Click the <strong>Install App</strong> button in the top navigation bar or home screen banner. Select <em>Install</em> when prompted by your browser.
                </div>

                <div style={{ backgroundColor: "var(--bg-input)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                  <strong style={{ color: "var(--text-main)", display: "block", marginBottom: "0.25rem" }}>🍏 iPhone & iPad (Safari):</strong>
                  Tap the <strong>Share</strong> button (square & arrow up icon ↗️) in Safari, scroll down, and select <strong>Add to Home Screen ➕</strong>.
                </div>
              </div>

              {/* Action Buttons inside Help Guide */}
              <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed var(--border-subtle)" }}>
                {hasUpdate ? (
                  <button className="btn btn-primary" onClick={onApplyUpdate} style={{ backgroundColor: "#0284c7" }}>
                    <RefreshCw size={16} /> Update Ready — Reload Now
                  </button>
                ) : isInstallable && !isInstalled && onPromptInstall ? (
                  <button className="btn btn-primary" onClick={onPromptInstall}>
                    <Download size={16} /> Install Splitify App Now
                  </button>
                ) : (
                  <span className="badge badge-emerald flex items-center gap-1" style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}>
                    <Smartphone size={14} /> App Installed / Ready Offline
                  </span>
                )}

                {onCheckForUpdates && (
                  <button className="btn btn-outline" onClick={onCheckForUpdates} disabled={isCheckingUpdate}>
                    <RefreshCw size={14} className={isCheckingUpdate ? "spin-slow" : ""} />
                    {isCheckingUpdate ? "Checking..." : "Check for Updates"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support & Consistent Privacy Footer */}
      <InfoPageFooter
        activePage="help"
        onNavigateHelp={onNavigateHelp}
        onNavigateTerms={onNavigateTerms}
        onNavigatePrivacy={onNavigatePrivacy}
      />
    </div>
  );
};
