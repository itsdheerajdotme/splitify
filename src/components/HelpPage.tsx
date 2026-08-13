import React, { useState } from "react";
import siteConfig from "../config/site.json";
import { Zap, ShieldCheck, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";

interface HelpPageProps {
  onBackToApp: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onBackToApp }) => {
  const [openSection, setOpenSection] = useState<number | null>(1);

  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "800px" }}>
      {/* Page Header */}
      <div className="card text-center" style={{ backgroundColor: "var(--bg-input)", padding: "2rem 1.25rem", marginBottom: "1.5rem" }}>
        <img
          src="/logo-128.png"
          alt={siteConfig.name}
          style={{ width: "64px", height: "64px", borderRadius: "16px", margin: "0 auto 0.75rem", border: "1px solid var(--border-subtle)" }}
        />
        <h1 style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>How To Use {siteConfig.name}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "550px", margin: "0 auto 1.25rem" }}>
          Step-by-step guide on creating trips, adding expenses across 4 split methods, simplifying debt, and backing up your data offline.
        </p>
        <button className="btn btn-primary" onClick={onBackToApp}>
          <Zap size={16} /> Open {siteConfig.name} App
        </button>
      </div>

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
                <li><strong>Custom Amount (₹)</strong>: Specify exact custom rupee figures per participant down to the penny.</li>
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
              <h3 style={{ fontSize: "1.1rem" }}>Understanding Debt Simplification</h3>
            </div>
            {openSection === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 3 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: "0.75rem" }}>
                Instead of making 15 back-and-forth money transfers between friends, navigate to the <strong>Balances</strong> tab.
              </p>
              <p>
                Splitify’s intelligent greedy algorithm calculates the minimum direct payments needed to settle everyone’s net position. You can toggle between <em>Simplified View</em> and <em>Detailed Net View</em> anytime.
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
              <h3 style={{ fontSize: "1.1rem" }}>CSV Export & Offline JSON Backup</h3>
            </div>
            {openSection === 5 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {openSection === 5 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li><strong>Export CSV</strong>: Generates an Excel/Google Sheets compatible spreadsheet report of all expenses.</li>
                <li><strong>Download Backup JSON</strong>: Downloads your full session state to transfer to another device or keep as a safe backup.</li>
                <li><strong>Restore Session</strong>: Use <em>Import JSON Backup</em> on any browser to restore your saved trips instantly.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Support & Privacy Footer */}
      <div className="card" style={{ backgroundColor: "var(--bg-input)" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "0.5rem" }}>
          <ShieldCheck size={18} color="var(--accent-primary)" />
          <h4 style={{ fontSize: "1rem" }}>{siteConfig.privacyNotice}</h4>
        </div>

        <div className="flex flex-col gap-1" style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
          <div className="flex items-center gap-2">
            <Mail size={14} /> Support Email: <a href={`mailto:${siteConfig.supportEmail}`} style={{ color: "var(--accent-primary)" }}>{siteConfig.supportEmail}</a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} /> Support Phone: <span>{siteConfig.supportPhone}</span>
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
            {siteConfig.copyright}
          </div>
        </div>
      </div>
    </div>
  );
};
