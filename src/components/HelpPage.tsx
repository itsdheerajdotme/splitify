import React, { useState } from "react";
import siteConfig from "../config/site.json";
import { ChevronDown, HelpCircle, Smartphone, RefreshCw, Zap, ArrowLeft, ExternalLink } from "lucide-react";

interface HelpPageProps {
  onBackToApp: () => void;
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
  onNavigateTerms,
  onNavigatePrivacy,
  isInstallable = false,
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
    <div className="container flex flex-col min-h-screen" style={{ paddingTop: "1.25rem", paddingBottom: "3rem", maxWidth: "850px" }}>
      {/* Top Header Bar with Back Button */}
      <div className="card flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: "var(--bg-card)", padding: "0.85rem 1rem", marginBottom: "1.5rem", border: "1px solid var(--border-subtle)" }}>
        <button className="btn btn-secondary btn-sm flex items-center gap-2" onClick={onBackToApp}>
          <ArrowLeft size={16} /> Back to App
        </button>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
          {siteConfig.name} User Guide & FAQ
        </span>
      </div>

      {/* Main Content Body */}
      <main className="flex-1">
        {/* Main Page Header Card */}
        <div className="card text-center" style={{ backgroundColor: "var(--bg-card)", padding: "2rem 1.25rem", marginBottom: "1.5rem", border: "1px solid var(--border-subtle)" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <HelpCircle size={26} />
          </div>
          <h1 style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>Help & User Guide — {siteConfig.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto 1.25rem", lineHeight: 1.6 }}>
            Step-by-step guide on creating trips, adding expenses across 4 split methods, installing home screen app, and working 100% offline.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            {isInstallable && onPromptInstall && (
              <button className="btn btn-emerald btn-sm" onClick={onPromptInstall}>
                <Smartphone size={16} /> Install Offline App
              </button>
            )}

            {onCheckForUpdates && (
              <button className="btn btn-outline btn-sm" onClick={onCheckForUpdates} disabled={isCheckingUpdate}>
                <RefreshCw size={15} className={isCheckingUpdate ? "spin" : ""} />
                {isCheckingUpdate ? "Checking..." : "Check for Updates"}
              </button>
            )}

            {hasUpdate && onApplyUpdate && (
              <button className="btn btn-primary btn-sm" onClick={onApplyUpdate}>
                <Zap size={15} /> Apply New Update
              </button>
            )}
          </div>
        </div>

        {/* Accordion Guide Sections */}
        <div className="flex flex-col gap-3">
          {/* Section 1: Creating a Trip & Adding Friends */}
          <div className={`faq-item ${openSection === 1 ? "open" : ""}`}>
            <button className="faq-question-btn" onClick={() => toggleSection(1)}>
              <span>1. Creating a Trip & Adding Friends</span>
              <ChevronDown size={18} className={`faq-arrow ${openSection === 1 ? "rotate" : ""}`} />
            </button>
            {openSection === 1 && (
              <div className="faq-answer-content">
                <p>
                  Click <strong>New Session / Trip</strong> from the home dashboard. Enter a title and member names to launch your trip workspace.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: 4 Expense Split Methods */}
          <div className={`faq-item ${openSection === 2 ? "open" : ""}`}>
            <button className="faq-question-btn" onClick={() => toggleSection(2)}>
              <span>2. 4 Expense Split Methods</span>
              <ChevronDown size={18} className={`faq-arrow ${openSection === 2 ? "rotate" : ""}`} />
            </button>
            {openSection === 2 && (
              <div className="faq-answer-content">
                <p>
                  Choose between <strong>Equal Split</strong>, <strong>Percentage (%)</strong>, <strong>By Shares</strong>, or <strong>Custom Rupee Amounts</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Debt Simplification */}
          <div className={`faq-item ${openSection === 3 ? "open" : ""}`}>
            <button className="faq-question-btn" onClick={() => toggleSection(3)}>
              <span>3. Debt Simplification</span>
              <ChevronDown size={18} className={`faq-arrow ${openSection === 3 ? "rotate" : ""}`} />
            </button>
            {openSection === 3 && (
              <div className="faq-answer-content">
                <p>
                  {siteConfig.name}'s algorithm calculates minimum direct payments needed to settle everyone's net position cleanly.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Add to Home Screen & 100% Offline Experience */}
          <div className={`faq-item ${openSection === 4 ? "open" : ""}`}>
            <button className="faq-question-btn" onClick={() => toggleSection(4)}>
              <span>4. Add to Home Screen & 100% Offline Experience</span>
              <ChevronDown size={18} className={`faq-arrow ${openSection === 4 ? "rotate" : ""}`} />
            </button>
            {openSection === 4 && (
              <div className="faq-answer-content">
                <p>
                  Add {siteConfig.name} to your phone's home screen with 1 tap for a full native app experience on Android, iPhone (Safari Share → Add to Home Screen), or Desktop. Track shared expenses 100% offline without cellular or Wi-Fi connectivity.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* In-App Footer Bar with Terms & Privacy in New Window */}
      <div className="card flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: "var(--bg-card)", marginTop: "2rem", padding: "0.85rem 1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <button className="btn btn-secondary btn-sm flex items-center gap-2" onClick={onBackToApp}>
          <ArrowLeft size={15} /> Back to App
        </button>

        <div className="flex items-center gap-3">
          {onNavigateTerms && (
            <button className="btn btn-ghost btn-sm flex items-center gap-1" onClick={onNavigateTerms} style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Terms & Conditions <ExternalLink size={12} />
            </button>
          )}
          {onNavigatePrivacy && (
            <button className="btn btn-ghost btn-sm flex items-center gap-1" onClick={onNavigatePrivacy} style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Privacy Policy <ExternalLink size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
