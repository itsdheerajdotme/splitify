import React, { useState } from "react";
import { Smartphone, Download, Share, PlusSquare, X, RefreshCw, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import siteConfig from "../config/site.json";

interface PWAInstallBannerProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  showIOSGuide: boolean;
  onCloseIOSGuide: () => void;
  onPromptInstall: () => void;
  hasUpdate: boolean;
  onApplyUpdate: () => void;
  isInstallModalOpen: boolean;
  onOpenInstallModal: () => void;
  onCloseInstallModal: () => void;
}

const BANNER_SNOOZE_KEY = "pwa_banner_dismissed_until";
const SNOOZE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days Snooze

const checkIsDismissed = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const until = localStorage.getItem(BANNER_SNOOZE_KEY);
    if (!until) return false;
    const untilTime = parseInt(until, 10);
    return Date.now() < untilTime;
  } catch (_) {
    return false;
  }
};

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isInstallable,
  isInstalled,
  isIOS,
  showIOSGuide,
  onCloseIOSGuide,
  onPromptInstall,
  hasUpdate,
  onApplyUpdate,
  isInstallModalOpen,
  onOpenInstallModal,
  onCloseInstallModal,
}) => {
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(checkIsDismissed);

  const handleDismissBanner = () => {
    setIsBannerDismissed(true);
    try {
      const snoozeUntil = Date.now() + SNOOZE_DURATION_MS;
      localStorage.setItem(BANNER_SNOOZE_KEY, snoozeUntil.toString());
    } catch (_) {}
  };

  return (
    <>
      {/* 1. Update Available Banner Toast */}
      {hasUpdate && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "90%",
            maxWidth: "500px",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            padding: "0.85rem 1.1rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={20} className="spin-slow" />
            <div>
              <strong style={{ fontSize: "0.9rem", display: "block", color: "#ffffff" }}>
                New Version Available!
              </strong>
              <span style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.9)" }}>
                Tap to load the latest features.
              </span>
            </div>
          </div>
          <button
            className="btn"
            style={{
              backgroundColor: "#ffffff",
              color: "#0284c7",
              fontWeight: 700,
              padding: "0.4rem 0.85rem",
              fontSize: "0.82rem",
              borderRadius: "8px",
              border: "none",
            }}
            onClick={onApplyUpdate}
          >
            Update Now
          </button>
        </div>
      )}

      {/* 2. Dismissable Single Desktop / Mobile Install Banner */}
      {isInstallable && !isInstalled && !isBannerDismissed && (
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "0.65rem 1rem",
            color: "var(--text-main)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 790,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Smartphone size={20} color="var(--accent-primary)" />
            </div>
            <div className="min-w-0">
              <div className="truncate" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                Install {siteConfig.name} App
              </div>
              <div className="truncate" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Works 100% offline with shortcut on your home screen
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenInstallModal}
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
            >
              <Download size={14} /> Install
            </button>
            <button
              onClick={handleDismissBanner}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              title="Dismiss for 7 days"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Interactive App Installation Feature Dialogue / Modal */}
      {isInstallModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={onCloseInstallModal}
        >
          <div
            className="card"
            style={{
              backgroundColor: "var(--bg-card)",
              maxWidth: "460px",
              width: "100%",
              borderRadius: "16px",
              padding: "1.5rem",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCloseInstallModal}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <div className="text-center" style={{ marginBottom: "1.25rem" }}>
              <img
                src="/logo-128.png"
                alt={`${siteConfig.name} Logo`}
                style={{ width: "56px", height: "56px", borderRadius: "14px", margin: "0 auto 0.5rem" }}
              />
              <h3 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>
                Install {siteConfig.name} App
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Enjoy fast, 100% offline group expense calculations directly from your home screen.
              </p>
            </div>

            <div className="flex flex-col gap-3" style={{ fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              {/* Feature 1 */}
              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ color: "#10b981", flexShrink: 0 }}>
                  <Zap size={22} />
                </div>
                <div>
                  <strong>100% Offline Access</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Works anytime without internet connection or cellular data.
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ color: "#3b82f6", flexShrink: 0 }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <strong>100% Private & Device-Only</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    No accounts or servers. Your data stays saved inside your browser.
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ color: "#8b5cf6", flexShrink: 0 }}>
                  <Smartphone size={22} />
                </div>
                <div>
                  <strong>Home Screen Shortcut</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Launches like a native mobile or desktop app in 1 tap.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-outline flex-1"
                onClick={onCloseInstallModal}
              >
                Maybe Later
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={() => {
                  onCloseInstallModal();
                  onPromptInstall();
                }}
              >
                <Download size={16} /> Install App Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. iOS Add to Home Screen Instructions Modal */}
      {showIOSGuide && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={onCloseIOSGuide}
        >
          <div
            className="card"
            style={{
              backgroundColor: "var(--bg-card)",
              maxWidth: "440px",
              width: "100%",
              borderRadius: "16px",
              padding: "1.5rem",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCloseIOSGuide}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <div className="text-center" style={{ marginBottom: "1.25rem" }}>
              <img
                src="/logo-128.png"
                alt={`${siteConfig.name} Logo`}
                style={{ width: "56px", height: "56px", borderRadius: "14px", margin: "0 auto 0.5rem" }}
              />
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                Add {siteConfig.name} to Home Screen
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {isIOS
                  ? "Follow these simple steps in Safari on your iPhone or iPad:"
                  : "Follow these simple steps in your web browser:"}
              </p>
            </div>

            <div className="flex flex-col gap-3" style={{ fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ color: "#3b82f6", flexShrink: 0 }}>
                  <Share size={22} />
                </div>
                <div>
                  <strong>1. Tap the Share icon</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Located at the bottom Safari navigation bar.
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ color: "#10b981", flexShrink: 0 }}>
                  <PlusSquare size={22} />
                </div>
                <div>
                  <strong>2. Select 'Add to Home Screen'</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Scroll down the popup list and tap ➕ Add to Home Screen.
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ color: "#8b5cf6", flexShrink: 0 }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <strong>3. Tap 'Add' in Top Right</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {siteConfig.name} will appear on your home screen and work 100% offline!
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={onCloseIOSGuide}>
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
