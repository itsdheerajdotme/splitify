import React from "react";
import siteConfig from "../config/site.json";
import { Mail, ShieldCheck, Heart } from "lucide-react";

interface LandingFooterProps {
  onNavigateHelp: () => void;
  onNavigateTerms: () => void;
  onNavigatePrivacy: () => void;
  onNavigateDemo?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
  onNavigateDemo,
}) => {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-container">
        <div className="grid-3" style={{ gap: "2rem", marginBottom: "2rem" }}>
          {/* Brand Info */}
          <div>
            <h3 style={{ fontSize: "1.25rem", color: "var(--accent-primary)", marginBottom: "0.5rem" }}>
              {siteConfig.name}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1rem" }}>
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <ShieldCheck size={16} color="var(--accent-primary)" />
              <span>{siteConfig.privacyNotice}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Navigation
            </h4>
            <ul className="footer-link-list">
              <li>
                <button onClick={onNavigateHelp} className="footer-link-btn">
                  Help & User Guide
                </button>
              </li>
              {onNavigateDemo && (
                <li>
                  <button onClick={onNavigateDemo} className="footer-link-btn">
                    Interactive Demo Session
                  </button>
                </li>
              )}
              <li>
                <button onClick={onNavigateTerms} className="footer-link-btn">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={onNavigatePrivacy} className="footer-link-btn">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Support & Contact
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="btn btn-outline btn-sm flex items-center gap-2"
              style={{ display: "inline-flex" }}
            >
              <Mail size={15} /> {siteConfig.supportEmail}
            </a>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="landing-footer-bottom">
          <span>{siteConfig.copyright}</span>
          <span className="flex items-center gap-1">
            Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> for effortless group finance
          </span>
        </div>
      </div>
    </footer>
  );
};
