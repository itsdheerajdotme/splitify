import React from "react";
import siteConfig from "../config/site.json";
import { Zap, ShieldCheck } from "lucide-react";

interface LandingNavProps {
  onLaunchApp: () => void;
  onNavigateDemo?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onLaunchApp, onNavigateDemo }) => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="landing-nav-header">
      <div className="landing-nav-container">
        {/* Brand Logo & Pill */}
        <div
          className="flex items-center gap-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (window.history && window.history.pushState) {
                const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
                const target = isLocalHost ? "/landing" : "/";
                if (window.location.pathname !== target) {
                  window.history.pushState({}, "", target);
                }
              }
            }
          }}
        >
          <div className="brand-logo-badge">
            <img
              src="/logo-64.png"
              alt={siteConfig.name}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                objectFit: "cover",
                border: "1px solid var(--border-subtle)",
                flexShrink: 0,
              }}
            />
            <span className="brand-logo-text">{siteConfig.name}</span>
          </div>
          <span className="badge badge-emerald hidden-mobile">
            <ShieldCheck size={13} /> 100% Device-Only
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="landing-nav-links hidden-mobile">
          <button className="landing-nav-link" onClick={() => handleScrollTo("features")}>
            Features
          </button>
          <button className="landing-nav-link" onClick={() => handleScrollTo("demo-calculator")}>
            Live Calculator
          </button>
          <button className="landing-nav-link" onClick={() => handleScrollTo("comparison")}>
            Why Splitly
          </button>
          <button className="landing-nav-link" onClick={() => handleScrollTo("how-it-works")}>
            How It Works
          </button>
          <button className="landing-nav-link" onClick={() => handleScrollTo("faq")}>
            FAQ
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onNavigateDemo && (
            <button className="btn btn-outline btn-sm hidden-mobile" onClick={onNavigateDemo}>
              Try Demo
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={onLaunchApp}>
            <Zap size={16} /> Launch App →
          </button>
        </div>
      </div>
    </header>
  );
};
