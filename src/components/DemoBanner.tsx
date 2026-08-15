import React from "react";
import { Sparkles, RefreshCw, Zap } from "lucide-react";

interface DemoBannerProps {
  onResetDemo: () => void;
  onCreateRealTrip: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onResetDemo, onCreateRealTrip }) => {
  return (
    <div className="demo-banner-bar">
      <div className="demo-banner-container">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="demo-icon-glow" color="var(--accent-primary)" />
          <span className="demo-banner-text">
            <strong>Demo Mode:</strong> Exploring Goa Trip (12 pre-loaded expenses). Edit, add, or test split math!
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-xs" onClick={onResetDemo} title="Reset demo to fresh initial state">
            <RefreshCw size={13} /> Reset Demo Data
          </button>
          <button className="btn btn-primary btn-xs" onClick={onCreateRealTrip}>
            <Zap size={13} /> Create Real Trip
          </button>
        </div>
      </div>
    </div>
  );
};
