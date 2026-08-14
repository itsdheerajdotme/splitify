import React, { useRef, useState, useEffect } from "react";
import { LayoutDashboard, ListFilter, Plus, Scale, Settings, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";

type TabType = "overview" | "transactions" | "add-expense" | "balances" | "settings" | "help";

interface NavTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  expenseCount: number;
}

export const NavTabs: React.FC<NavTabsProps> = ({
  activeTab,
  onTabChange,
  expenseCount,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [expenseCount]);

  const handleScrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -180, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 180, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-1 desktop-only" style={{ position: "relative", marginBottom: "1rem" }}>
      {/* Left Scroll Arrow */}
      {canScrollLeft && (
        <button
          className="btn btn-outline btn-sm btn-icon"
          onClick={handleScrollLeft}
          title="Scroll Left"
          style={{
            zIndex: 10,
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            minWidth: "32px",
            minHeight: "32px",
            padding: 0,
            backgroundColor: "var(--bg-card)",
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={18} color="var(--accent-primary)" />
        </button>
      )}

      {/* Scrollable Tabs Bar */}
      <div
        ref={tabsRef}
        className="tabs flex-1"
        onScroll={checkScroll}
        style={{ marginBottom: 0, borderBottom: "1px solid var(--border-subtle)", scrollBehavior: "smooth" }}
      >
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => onTabChange("overview")}
        >
          <LayoutDashboard size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Overview
        </button>

        <button
          className={`tab-btn ${activeTab === "transactions" ? "active" : ""}`}
          onClick={() => onTabChange("transactions")}
        >
          <ListFilter size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Transactions ({expenseCount})
        </button>

        <button
          className={`tab-btn ${activeTab === "add-expense" ? "active" : ""}`}
          onClick={() => onTabChange("add-expense")}
        >
          <Plus size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Add Expense
        </button>

        <button
          className={`tab-btn ${activeTab === "balances" ? "active" : ""}`}
          onClick={() => onTabChange("balances")}
        >
          <Scale size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Balances & Settlement
        </button>

        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => onTabChange("settings")}
        >
          <Settings size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Export & Settings
        </button>

        <button
          className={`tab-btn ${(activeTab as string) === "help" ? "active" : ""}`}
          onClick={() => onTabChange("help")}
        >
          <HelpCircle size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Help & Guide
        </button>
      </div>

      {/* Right Scroll Arrow */}
      {canScrollRight && (
        <button
          className="btn btn-outline btn-sm btn-icon"
          onClick={handleScrollRight}
          title="Scroll Right"
          style={{
            zIndex: 10,
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            minWidth: "32px",
            minHeight: "32px",
            padding: 0,
            backgroundColor: "var(--bg-card)",
            flexShrink: 0,
          }}
        >
          <ChevronRight size={18} color="var(--accent-primary)" />
        </button>
      )}
    </div>
  );
};
