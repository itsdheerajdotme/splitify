import React, { useState } from "react";
import siteConfig from "../config/site.json";
import { ChevronDown, HelpCircle, Smartphone, RefreshCw, Zap } from "lucide-react";
import { LandingNav } from "./LandingNav";
import { LandingFooter } from "./LandingFooter";

interface HelpPageProps {
  onBackToApp: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateDemo?: () => void;
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
  onNavigateHelp = () => {},
  onNavigateTerms = () => {},
  onNavigatePrivacy = () => {},
  onNavigateDemo,
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
    <div className="landing-page-root flex flex-col min-h-screen">
      {/* Landing Navigation Header */}
      <LandingNav onLaunchApp={onBackToApp} onNavigateDemo={onNavigateDemo} />

      {/* Main Content Body */}
      <main className="landing-container flex-1" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "850px" }}>
        {/* Main Page Header */}
        <div className="card text-center" style={{ backgroundColor: "var(--bg-card)", padding: "2.5rem 1.5rem", marginBottom: "2rem", border: "1px solid var(--border-subtle)" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <HelpCircle size={28} />
          </div>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Help & User Guide — {siteConfig.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto 1.25rem", lineHeight: 1.6 }}>
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

        {/* Accordion Guide Sections from help/index.html */}
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
