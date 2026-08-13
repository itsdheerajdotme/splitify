import React from "react";
import { LayoutDashboard, ListFilter, PlusCircle, Scale, HelpCircle } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: "overview" | "transactions" | "add-expense" | "balances" | "help" | "settings";
  onTabChange: (tab: "overview" | "transactions" | "add-expense" | "balances" | "help" | "settings") => void;
  hasActiveSession: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  hasActiveSession,
}) => {
  return (
    <nav className="mobile-bottom-nav">
      {hasActiveSession ? (
        <>
          <button
            className={`mobile-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => onTabChange("overview")}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>

          <button
            className={`mobile-nav-item ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => onTabChange("transactions")}
          >
            <ListFilter size={20} />
            <span>Expenses</span>
          </button>

          <button
            className={`mobile-nav-item ${activeTab === "add-expense" ? "active" : ""}`}
            onClick={() => onTabChange("add-expense")}
          >
            <PlusCircle size={24} color="var(--accent-primary)" />
            <span>Add</span>
          </button>

          <button
            className={`mobile-nav-item ${activeTab === "balances" ? "active" : ""}`}
            onClick={() => onTabChange("balances")}
          >
            <Scale size={20} />
            <span>Balances</span>
          </button>

          <button
            className={`mobile-nav-item ${activeTab === "help" ? "active" : ""}`}
            onClick={() => onTabChange("help")}
          >
            <HelpCircle size={20} />
            <span>Help</span>
          </button>
        </>
      ) : (
        <>
          <button
            className={`mobile-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => onTabChange("overview")}
          >
            <LayoutDashboard size={20} />
            <span>My Trips</span>
          </button>

          <button
            className={`mobile-nav-item ${activeTab === "help" ? "active" : ""}`}
            onClick={() => onTabChange("help")}
          >
            <HelpCircle size={20} />
            <span>Help & Guide</span>
          </button>
        </>
      )}
    </nav>
  );
};
