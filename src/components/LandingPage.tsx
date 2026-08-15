import React, { useState } from "react";
import landingConfig from "../config/landing.json";
import siteConfig from "../config/site.json";
import { LandingNav } from "./LandingNav";
import { LandingFooter } from "./LandingFooter";
import {
  Lock,
  Zap,
  Sparkles,
  Sliders,
  WifiOff,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Users,
  Receipt,
  Smartphone,
} from "lucide-react";

interface LandingPageProps {
  onLaunchApp: () => void;
  onNavigateDemo: () => void;
  onNavigateHelp: () => void;
  onNavigateTerms: () => void;
  onNavigatePrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onNavigateDemo,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
}) => {
  // Interactive Calculator Widget State
  const [demoAmount, setDemoAmount] = useState<number>(landingConfig.interactiveDemoWidget.defaultAmount);
  const [demoPeople, setDemoPeople] = useState<number>(landingConfig.interactiveDemoWidget.defaultPeople);
  const [demoSplitMode, setDemoSplitMode] = useState<"equal" | "custom">("equal");

  // Accordion FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const perPersonAmount = Math.round(demoAmount / Math.max(1, demoPeople));

  // Map icon string names to Lucide icon components
  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case "Lock":
        return <Lock size={24} color="var(--accent-primary)" />;
      case "Zap":
        return <Zap size={24} color="var(--accent-primary)" />;
      case "Sparkles":
        return <Sparkles size={24} color="var(--accent-primary)" />;
      case "Sliders":
        return <Sliders size={24} color="var(--accent-primary)" />;
      case "WifiOff":
        return <WifiOff size={24} color="var(--accent-primary)" />;
      case "Clock":
        return <Clock size={24} color="var(--accent-primary)" />;
      default:
        return <Sparkles size={24} color="var(--accent-primary)" />;
    }
  };

  return (
    <div className="landing-page-root">
      {/* Navigation Header */}
      <LandingNav onLaunchApp={onLaunchApp} onNavigateDemo={onNavigateDemo} />

      {/* Hero Section */}
      <section className="landing-section hero-section">
        <div className="landing-container text-center">
          {/* Trust Badge */}
          <div className="trust-pill-badge">
            <span>{landingConfig.hero.trustPill}</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            Split Group Expenses Instantly. <br />
            <span className="text-gradient">{landingConfig.hero.headline.split(".")[1] || "Completely Private."}</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subtitle">{landingConfig.hero.subheadline}</p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 flex-wrap" style={{ marginBottom: "3rem" }}>
            <button className="btn btn-primary btn-lg" onClick={onLaunchApp}>
              <Zap size={20} /> {landingConfig.hero.primaryCtaText}
            </button>
            <button className="btn btn-outline btn-lg" onClick={onNavigateDemo}>
              <Sparkles size={18} /> {landingConfig.hero.secondaryCtaText}
            </button>
          </div>

          {/* Visual Hero Mock Preview Box */}
          <div className="hero-preview-card">
            <div className="hero-preview-header">
              <div className="flex items-center gap-2">
                <span className="status-dot"></span>
                <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>🌴 Goa Weekend Trip (Sample Session)</span>
              </div>
              <span className="badge badge-subtle">4 Members • ₹14,200 Total</span>
            </div>

            <div className="hero-preview-body grid-2">
              {/* Left Sample Expense List */}
              <div className="hero-sample-list">
                <div className="hero-sample-item">
                  <div className="flex items-center gap-2">
                    <Receipt size={16} color="var(--accent-primary)" />
                    <span>Beach Villa (2 Nights)</span>
                  </div>
                  <span className="mono bold">₹8,000</span>
                </div>
                <div className="hero-sample-item">
                  <div className="flex items-center gap-2">
                    <Receipt size={16} color="var(--accent-primary)" />
                    <span>Seafood Dinner</span>
                  </div>
                  <span className="mono bold">₹4,200</span>
                </div>
                <div className="hero-sample-item">
                  <div className="flex items-center gap-2">
                    <Receipt size={16} color="var(--accent-primary)" />
                    <span>Highway Toll & Petrol</span>
                  </div>
                  <span className="mono bold">₹2,000</span>
                </div>
              </div>

              {/* Right Debt Simplification Output */}
              <div className="hero-sample-resolution">
                <div className="resolution-badge">
                  <Sparkles size={14} color="var(--accent-primary)" />
                  <span>Debt Simplification Active</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.5rem 0" }}>
                  Optimized 6 cross-debts into just 2 minimal settlements:
                </p>
                <div className="settlement-pill">
                  <span>Rahul → Priya</span>
                  <span className="mono bold color-emerald">₹1,850</span>
                </div>
                <div className="settlement-pill">
                  <span>Sneha → Alex</span>
                  <span className="mono bold color-emerald">₹1,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Calculator Widget Section */}
      <section id="demo-calculator" className="landing-section demo-widget-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="badge badge-emerald" style={{ marginBottom: "0.75rem" }}>
              {landingConfig.interactiveDemoWidget.badge}
            </span>
            <h2 className="section-title">{landingConfig.interactiveDemoWidget.title}</h2>
            <p className="section-subtitle">{landingConfig.interactiveDemoWidget.subtitle}</p>
          </div>

          <div className="card demo-calculator-card">
            <div className="grid-2" style={{ alignItems: "center" }}>
              {/* Input Controls */}
              <div>
                <div className="form-group">
                  <label className="form-label flex items-center justify-between">
                    <span>Total Expense Amount (₹)</span>
                    <span className="mono color-emerald" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                      ₹{demoAmount.toLocaleString()}
                    </span>
                  </label>
                  <input
                    type="number"
                    className="form-input mono"
                    value={demoAmount}
                    onChange={(e) => setDemoAmount(Math.max(0, Number(e.target.value)))}
                    placeholder="Enter total bill amount"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center justify-between">
                    <span>Group Members: {demoPeople} People</span>
                    <span className="mono" style={{ color: "var(--text-muted)" }}>
                      2 - 10 members
                    </span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={demoPeople}
                    onChange={(e) => setDemoPeople(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Split Method</label>
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-sm ${demoSplitMode === "equal" ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setDemoSplitMode("equal")}
                      style={{ flex: 1 }}
                    >
                      Equal Share
                    </button>
                    <button
                      className={`btn btn-sm ${demoSplitMode === "custom" ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setDemoSplitMode("custom")}
                      style={{ flex: 1 }}
                    >
                      Weighted / % Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculated Result Output Box */}
              <div className="card text-center demo-result-box">
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Equal Share Per Person
                </span>
                <h2 className="mono demo-result-amount">₹{perPersonAmount.toLocaleString()}</h2>

                <div className="demo-breakdown-pills">
                  <div className="demo-person-chip">
                    <Users size={14} /> Member 1: ₹{perPersonAmount}
                  </div>
                  <div className="demo-person-chip">
                    <Users size={14} /> Member 2: ₹{perPersonAmount}
                  </div>
                </div>

                <button className="btn btn-primary btn-block" onClick={onNavigateDemo} style={{ marginTop: "1.25rem" }}>
                  <Sparkles size={16} /> Explore Full 12-Expense Demo App →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section (6 Cards) */}
      <section id="features" className="landing-section features-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <h2 className="section-title">Built for Privacy, Speed & Zero Hassle</h2>
            <p className="section-subtitle">
              Everything you need to split group bills without passwords, central cloud storage, or subscriptions.
            </p>
          </div>

          <div className="grid-3" style={{ gap: "1.5rem" }}>
            {landingConfig.features.map((feat) => (
              <div key={feat.id} className="card feature-card">
                <div className="feature-icon-wrapper">{renderFeatureIcon(feat.icon)}</div>
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.description}</p>
              </div>
            ))}
          </div>

          {/* Add to Home Screen Native App Spotlight Banner */}
          <div className="card text-center" style={{ marginTop: "2.5rem", backgroundColor: "rgba(16, 185, 129, 0.08)", borderColor: "var(--accent-primary)", padding: "2rem 1.5rem" }}>
            <div className="flex items-center justify-center gap-2" style={{ marginBottom: "0.5rem" }}>
              <Smartphone size={24} color="var(--accent-primary)" />
              <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Install as an App for a 100% Native Experience</h3>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "650px", margin: "0.5rem auto 1.25rem", lineHeight: 1.6 }}>
              Add Splitly to your phone's home screen with 1 tap. Launch instantly like a native app, split expenses anywhere completely offline, and enjoy zero lag.
            </p>
            <button className="btn btn-primary btn-sm" onClick={onLaunchApp}>
              <Zap size={16} /> Add to Home Screen & Start Free
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Section (Splitly vs Traditional Apps) */}
      <section id="comparison" className="landing-section comparison-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <h2 className="section-title">{landingConfig.comparisonTable.title}</h2>
            <p className="section-subtitle">{landingConfig.comparisonTable.subtitle}</p>
          </div>

          <div className="card comparison-card">
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature / Comparison</th>
                    <th className="highlight-column">{siteConfig.name} ⚡</th>
                    <th>Traditional Cloud Apps ☁</th>
                  </tr>
                </thead>
                <tbody>
                  {landingConfig.comparisonTable.rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="feature-label">{row.feature}</td>
                      <td className="highlight-column splitly-cell">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                          <span>{row.splitly}</span>
                        </div>
                      </td>
                      <td className="others-cell">
                        <div className="flex items-center gap-2">
                          <XCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                          <span>{row.others}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (3 Steps) */}
      <section id="how-it-works" className="landing-section how-it-works-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <h2 className="section-title">{landingConfig.howItWorks.title}</h2>
            <p className="section-subtitle">{landingConfig.howItWorks.subtitle}</p>
          </div>

          <div className="grid-3" style={{ gap: "2rem" }}>
            {landingConfig.howItWorks.steps.map((step, idx) => (
              <div key={idx} className="card step-card">
                <span className="step-number">{step.step}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy Guarantee Section */}
      <section className="landing-section security-section">
        <div className="landing-container">
          <div className="card security-guarantee-card">
            <div className="flex items-center gap-3" style={{ marginBottom: "1rem" }}>
              <ShieldCheck size={28} color="var(--accent-primary)" />
              <div>
                <h3 style={{ fontSize: "1.35rem", margin: 0 }}>{landingConfig.securityGuarantee.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                  {landingConfig.securityGuarantee.subtitle}
                </p>
              </div>
            </div>

            <div className="grid-2" style={{ gap: "1rem", marginTop: "1.5rem" }}>
              {landingConfig.securityGuarantee.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <CheckCircle2 size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="landing-section faq-section">
        <div className="landing-container" style={{ maxWidth: "800px" }}>
          <div className="section-header text-center">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about Splitly and client-side privacy.</p>
          </div>

          <div className="faq-accordion-list">
            {landingConfig.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button className="faq-question-btn" onClick={() => toggleFaq(idx)}>
                    <span className="flex items-center gap-2">
                      <HelpCircle size={18} color="var(--accent-primary)" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown size={18} className={`faq-arrow ${isOpen ? "rotate" : ""}`} />
                  </button>
                  {isOpen && <div className="faq-answer-content">{faq.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-section cta-banner-section">
        <div className="landing-container">
          <div className="card cta-banner-card text-center">
            <h2 className="cta-banner-title">{landingConfig.ctaBanner.title}</h2>
            <p className="cta-banner-subtitle">{landingConfig.ctaBanner.subtitle}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button className="btn btn-primary btn-lg" onClick={onLaunchApp}>
                <Zap size={20} /> {landingConfig.ctaBanner.primaryButtonText}
              </button>
              <button className="btn btn-outline btn-lg" onClick={onNavigateDemo}>
                <Sparkles size={18} /> {landingConfig.ctaBanner.secondaryButtonText}
              </button>
            </div>
          </div>
        </div>
      </section>

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
