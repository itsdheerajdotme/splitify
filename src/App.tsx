import { useState, useEffect } from "react";
import { Session, Expense, Settlement, Participant } from "./domain/types";
import { calculateBalances } from "./domain/balance-engine";
import { simplifyBalances } from "./domain/simplifier";
import { IndexedDBSessionRepository, InMemorySessionRepository } from "./repositories/indexeddb-repository";
import siteConfig from "./config/site.json";

import { Navbar } from "./components/Navbar";
import { SessionList } from "./components/SessionList";
import { CreateSessionModal } from "./components/CreateSessionModal";
import { ExpenseForm } from "./components/ExpenseForm";
import { TransactionsList } from "./components/TransactionsList";
import { BalancesView } from "./components/BalancesView";
import { ExportSettings } from "./components/ExportSettings";
import { DeleteShieldModal } from "./components/DeleteShieldModal";
import { HelpPage } from "./components/HelpPage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { LandingPage } from "./components/LandingPage";
import { DemoBanner } from "./components/DemoBanner";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { NavTabs } from "./components/NavTabs";
import { PWAInstallBanner } from "./components/PWAInstallBanner";

import { usePWAInstall } from "./hooks/usePWAInstall";
import { useServiceWorkerUpdate } from "./hooks/useServiceWorkerUpdate";
import { ImportModal } from "./components/ImportModal";
import { applySEO } from "./utils/seo";
import { DEMO_SESSION_ID, loadOrResetDemoSession } from "./domain/demo-data";

export type TabType =
  | "landing"
  | "overview"
  | "transactions"
  | "add-expense"
  | "balances"
  | "settings"
  | "help"
  | "terms"
  | "privacy";

// Repository instance (IndexedDB with memory fallback)
const repository = typeof indexedDB !== "undefined"
  ? new IndexedDBSessionRepository()
  : new InMemorySessionRepository();

export function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const homeIsLanding = siteConfig.routing?.homeMode === "landing";
  const [activeTab, setActiveTab] = useState<TabType>(homeIsLanding ? "landing" : "overview");

  // PWA & Service Worker hooks
  const pwaInstall = usePWAInstall();
  const swUpdate = useServiceWorkerUpdate();

  // Shared Trip Link state
  const [pendingShareId, setPendingShareId] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Auto-save feedback
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved locally");

  const isDemoActive = activeSession?.id === DEMO_SESSION_ID;

  // Route & SEO Sync helper
  const navigateToTab = (tab: TabType, updateHistory = true) => {
    setActiveTab(tab);

    let targetPath = "/";
    if (tab === "help") targetPath = "/help";
    else if (tab === "terms") targetPath = "/terms";
    else if (tab === "privacy") targetPath = "/privacy";
    else if (tab === "landing") targetPath = "/";

    if (updateHistory && typeof window !== "undefined" && window.history && window.history.pushState) {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, "", targetPath);
      }
    }

    applySEO(tab === "help" ? "help" : tab === "terms" ? "terms" : tab === "privacy" ? "privacy" : "home");
  };

  // Launch real app or navigate to app URL from site.json
  const handleLaunchApp = () => {
    if (siteConfig.appUrl) {
      try {
        const targetUrl = new URL(siteConfig.appUrl, window.location.href).href;
        if (window.location.href !== targetUrl && !window.location.href.startsWith(targetUrl)) {
          window.location.href = siteConfig.appUrl;
          return;
        }
      } catch (_) {
        window.location.href = siteConfig.appUrl;
        return;
      }
    }
    setActiveTab("overview");
    if (window.history && window.history.pushState) {
      window.history.pushState({}, "", "/");
    }
    applySEO("home");
  };

  // Handle Demo Mode launch / reset or navigate to demo URL from site.json
  const handleTriggerDemo = async () => {
    if (siteConfig.demoUrl) {
      try {
        const targetUrl = new URL(siteConfig.demoUrl, window.location.href).href;
        if (window.location.href !== targetUrl && !window.location.href.startsWith(targetUrl)) {
          window.location.href = siteConfig.demoUrl;
          return;
        }
      } catch (_) {
        window.location.href = siteConfig.demoUrl;
        return;
      }
    }
    try {
      const demoSess = await loadOrResetDemoSession(repository);
      await loadSessions();
      setActiveSession(demoSess);
      setActiveTab("overview");
      if (window.history && window.history.pushState) {
        window.history.pushState({}, "", "/demo");
      }
      applySEO("demo");
    } catch (err) {
      console.error("Failed to load demo:", err);
    }
  };

  // Load sessions & check for share link / pathname route parameters on mount
  useEffect(() => {
    loadSessions();

    const pathname = window.location.pathname.replace(/\/$/, "") || "/";
    if (pathname === "/demo") {
      handleTriggerDemo();
    } else if (pathname === "/help") {
      setActiveTab("help");
      applySEO("help");
    } else if (pathname === "/terms") {
      setActiveTab("terms");
      applySEO("terms");
    } else if (pathname === "/privacy") {
      setActiveTab("privacy");
      applySEO("privacy");
    } else {
      if (homeIsLanding) {
        setActiveTab("landing");
      } else {
        setActiveTab("overview");
      }
      applySEO("home");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get("share");
    if (shareParam) {
      setPendingShareId(shareParam);
    }

    // Handle browser Back/Forward navigation
    const handlePopState = () => {
      const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
      if (currentPath === "/demo") {
        handleTriggerDemo();
      } else if (currentPath === "/help") {
        setActiveTab("help");
        applySEO("help");
      } else if (currentPath === "/terms") {
        setActiveTab("terms");
        applySEO("terms");
      } else if (currentPath === "/privacy") {
        setActiveTab("privacy");
        applySEO("privacy");
      } else {
        if (homeIsLanding) {
          setActiveTab("landing");
        } else {
          setActiveTab("overview");
        }
        applySEO("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCloseImportModal = () => {
    setPendingShareId(null);
    if (window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("share");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  };

  const loadSessions = async () => {
    try {
      const list = await repository.list();
      setSessions(list);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  // Helper to persist active session updates
  const saveActiveSession = async (updatedSession: Session) => {
    setAutoSaveStatus("Saving...");
    setActiveSession(updatedSession);
    try {
      await repository.save(updatedSession);
      await loadSessions();
      setAutoSaveStatus("Saved locally");
    } catch (err) {
      console.error("Save error:", err);
      setAutoSaveStatus("Error saving");
    }
  };

  // Create new session handler
  const handleCreateSession = async (name: string, participantNames: string[]) => {
    const now = new Date().toISOString();
    const participants: Participant[] = participantNames.map((pName, idx) => ({
      id: `p_${Date.now()}_${idx}`,
      name: pName,
      createdAt: now,
      updatedAt: now,
    }));

    const newSession: Session = {
      id: `sess_${Date.now()}`,
      name,
      participants,
      expenses: [],
      settlements: [],
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    await saveActiveSession(newSession);
    navigateToTab("overview");
  };

  // Delete session handler
  const handleConfirmDelete = async (sessionId: string) => {
    try {
      await repository.delete(sessionId);
      setSessionToDelete(null);
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
      }
      await loadSessions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Add / Edit Expense
  const handleSaveExpense = async (
    expenseData: Omit<Expense, "id" | "sessionId" | "createdAt" | "updatedAt">
  ) => {
    if (!activeSession) return;

    const now = new Date().toISOString();
    let updatedExpenses: Expense[];

    if (editingExpense) {
      updatedExpenses = activeSession.expenses.map((e) =>
        e.id === editingExpense.id
          ? { ...editingExpense, ...expenseData, updatedAt: now }
          : e
      );
      setEditingExpense(null);
    } else {
      const newExpense: Expense = {
        ...expenseData,
        id: `exp_${Date.now()}`,
        sessionId: activeSession.id,
        createdAt: now,
        updatedAt: now,
      };
      updatedExpenses = [newExpense, ...activeSession.expenses];
    }

    const updatedSession: Session = {
      ...activeSession,
      expenses: updatedExpenses,
      updatedAt: now,
    };

    await saveActiveSession(updatedSession);
    navigateToTab("transactions");
  };

  // Delete Expense
  const handleDeleteExpense = async (expenseId: string) => {
    if (!activeSession) return;
    const updatedSession: Session = {
      ...activeSession,
      expenses: activeSession.expenses.filter((e) => e.id !== expenseId),
      updatedAt: new Date().toISOString(),
    };
    await saveActiveSession(updatedSession);
  };

  // Add Settlement
  const handleAddSettlement = async (
    settlementData: Omit<Settlement, "id" | "sessionId" | "createdAt">
  ) => {
    if (!activeSession) return;

    const newSettlement: Settlement = {
      ...settlementData,
      id: `stl_${Date.now()}`,
      sessionId: activeSession.id,
      createdAt: new Date().toISOString(),
    };

    const updatedSession: Session = {
      ...activeSession,
      settlements: [newSettlement, ...activeSession.settlements],
      updatedAt: new Date().toISOString(),
    };

    await saveActiveSession(updatedSession);
  };

  // Participant Management
  const handleAddParticipant = async (name: string) => {
    if (!activeSession) return;
    const now = new Date().toISOString();
    const newP: Participant = {
      id: `p_${Date.now()}`,
      name,
      createdAt: now,
      updatedAt: now,
    };
    const updatedSession: Session = {
      ...activeSession,
      participants: [...activeSession.participants, newP],
      updatedAt: now,
    };
    await saveActiveSession(updatedSession);
  };

  const handleRenameParticipant = async (participantId: string, newName: string) => {
    if (!activeSession) return;
    const updatedSession: Session = {
      ...activeSession,
      participants: activeSession.participants.map((p) =>
        p.id === participantId ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
      ),
      updatedAt: new Date().toISOString(),
    };
    await saveActiveSession(updatedSession);
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (!activeSession) return;
    const hasExpenses = activeSession.expenses.some(
      (e) => e.paidBy === participantId
    );
    if (hasExpenses) {
      alert("Cannot remove participant who has recorded expenses.");
      return;
    }
    const updatedSession: Session = {
      ...activeSession,
      participants: activeSession.participants.filter((p) => p.id !== participantId),
      updatedAt: new Date().toISOString(),
    };
    await saveActiveSession(updatedSession);
  };

  const handleRenameSession = async (newName: string) => {
    if (!activeSession) return;
    const updatedSession: Session = {
      ...activeSession,
      name: newName,
      updatedAt: new Date().toISOString(),
    };
    await saveActiveSession(updatedSession);
  };

  // Calculations for Active Session
  const balances = activeSession ? calculateBalances(activeSession) : [];

  const simplifiedSuggestions = simplifyBalances(balances);

  const currentTab = activeTab;

  // Render Landing Page if home mode is landing and activeTab === "landing"
  if (currentTab === "landing") {
    return (
      <LandingPage
        onLaunchApp={handleLaunchApp}
        onNavigateDemo={handleTriggerDemo}
        onNavigateHelp={() => navigateToTab("help")}
        onNavigateTerms={() => navigateToTab("terms")}
        onNavigatePrivacy={() => navigateToTab("privacy")}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Demo Mode Top Banner */}
      {isDemoActive && (
        <DemoBanner
          onResetDemo={handleTriggerDemo}
          onCreateRealTrip={() => {
            setIsCreateModalOpen(true);
          }}
        />
      )}

      {/* Main Top Header Navbar (Hidden on Standalone Info Pages) */}
      {currentTab !== "help" && currentTab !== "terms" && currentTab !== "privacy" && (
        <Navbar
          onGoHome={() => navigateToTab(homeIsLanding ? "landing" : "overview")}
          onOpenHelp={() => navigateToTab("help")}
          currentSessionName={activeSession?.name}
          autoSaveStatus={autoSaveStatus}
          isInstallable={pwaInstall.isInstallable}
          isInstalled={pwaInstall.isInstalled}
          hasUpdate={swUpdate.hasUpdate}
          onPromptInstall={pwaInstall.promptInstall}
          onApplyUpdate={swUpdate.applyUpdate}
        />
      )}

      {/* PWA Update notification toast banner */}
      {swUpdate.hasUpdate && (
        <div
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--text-inverse)",
            padding: "0.5rem 1rem",
            textAlign: "center",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          <span>⚡ A new version of Splitly is available!</span>
          <button
            onClick={swUpdate.applyUpdate}
            style={{
              backgroundColor: "var(--text-inverse)",
              color: "var(--accent-primary)",
              border: "none",
              padding: "0.25rem 0.65rem",
              borderRadius: "4px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Update Now
          </button>
        </div>
      )}

      {/* PWA Install Banner */}
      {currentTab !== "help" && currentTab !== "terms" && currentTab !== "privacy" && (
        <PWAInstallBanner
          isInstallable={pwaInstall.isInstallable}
          isInstalled={pwaInstall.isInstalled}
          isIOS={pwaInstall.isIOS}
          showIOSGuide={pwaInstall.showIOSGuide}
          onCloseIOSGuide={() => pwaInstall.setShowIOSGuide(false)}
          onPromptInstall={pwaInstall.promptInstall}
          hasUpdate={swUpdate.hasUpdate}
          onApplyUpdate={swUpdate.applyUpdate}
        />
      )}

      {/* Main Content Body */}
      <main style={{ flex: 1 }}>
        {currentTab === "help" ? (
          <HelpPage
            onBackToApp={() => navigateToTab("overview")}
            onNavigateHelp={() => navigateToTab("help")}
            onNavigateTerms={() => navigateToTab("terms")}
            onNavigatePrivacy={() => navigateToTab("privacy")}
            isInstallable={pwaInstall.isInstallable}
            isInstalled={pwaInstall.isInstalled}
            onPromptInstall={pwaInstall.promptInstall}
            isCheckingUpdate={swUpdate.isChecking}
            onCheckForUpdates={swUpdate.checkForUpdates}
            hasUpdate={swUpdate.hasUpdate}
            onApplyUpdate={swUpdate.applyUpdate}
          />
        ) : currentTab === "terms" ? (
          <TermsPage
            onBackToApp={() => navigateToTab("overview")}
            onNavigateHelp={() => navigateToTab("help")}
            onNavigateTerms={() => navigateToTab("terms")}
            onNavigatePrivacy={() => navigateToTab("privacy")}
          />
        ) : currentTab === "privacy" ? (
          <PrivacyPage
            onBackToApp={() => navigateToTab("overview")}
            onNavigateHelp={() => navigateToTab("help")}
            onNavigateTerms={() => navigateToTab("terms")}
            onNavigatePrivacy={() => navigateToTab("privacy")}
          />
        ) : !activeSession ? (
          <SessionList
            sessions={sessions}
            onSelectSession={(s) => {
              setActiveSession(s);
              navigateToTab("overview");
            }}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onRestoreSession={async (imported) => {
              await saveActiveSession(imported);
              setActiveSession(imported);
              navigateToTab("overview");
            }}
            onDeleteSessionPrompt={(s) => setSessionToDelete(s)}
            isInstallable={pwaInstall.isInstallable}
            isInstalled={pwaInstall.isInstalled}
            onPromptInstall={pwaInstall.promptInstall}
          />
        ) : (
          <div className="container" style={{ paddingTop: "1.25rem", paddingBottom: "3rem" }}>
            {/* NavTabs */}
            <NavTabs
              activeTab={currentTab as "overview" | "transactions" | "add-expense" | "balances" | "settings"}
              onTabChange={(tab) => {
                if (tab === "add-expense") {
                  setEditingExpense(null);
                }
                navigateToTab(tab as TabType);
              }}
              expenseCount={activeSession.expenses.length}
            />

            {/* Active Tab Views */}
            {currentTab === "overview" && (
              <BalancesView
                participants={activeSession.participants}
                balances={balances}
                simplifiedSuggestions={simplifiedSuggestions}
                onAddSettlement={handleAddSettlement}
              />
            )}

            {currentTab === "transactions" && (
              <TransactionsList
                expenses={activeSession.expenses}
                participants={activeSession.participants}
                onEditExpense={(expense) => {
                  setEditingExpense(expense);
                  navigateToTab("add-expense");
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {currentTab === "add-expense" && (
              <ExpenseForm
                participants={activeSession.participants}
                initialExpense={editingExpense || undefined}
                onSave={handleSaveExpense}
                onCancel={() => navigateToTab("transactions")}
              />
            )}

            {currentTab === "balances" && (
              <BalancesView
                participants={activeSession.participants}
                balances={balances}
                simplifiedSuggestions={simplifiedSuggestions}
                onAddSettlement={handleAddSettlement}
              />
            )}

            {currentTab === "settings" && (
              <ExportSettings
                session={activeSession}
                onUpdateSessionName={handleRenameSession}
                onAddParticipant={handleAddParticipant}
                onRenameParticipant={handleRenameParticipant}
                onRemoveParticipant={handleRemoveParticipant}
                onRestoreSession={async (imported) => {
                  await saveActiveSession(imported);
                }}
                onOpenDeleteModal={() => setSessionToDelete(activeSession)}
                isCheckingUpdate={swUpdate.isChecking}
                lastCheckMessage={swUpdate.lastCheckMessage}
                onCheckForUpdates={swUpdate.checkForUpdates}
                onApplyUpdate={swUpdate.applyUpdate}
                hasUpdate={swUpdate.hasUpdate}
              />
            )}
          </div>
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={currentTab}
        onTabChange={(tab) => {
          if (tab === "add-expense") {
            setEditingExpense(null);
          }
          navigateToTab(tab);
        }}
        hasActiveSession={Boolean(activeSession)}
      />

      {/* Modals */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateSession}
      />

      <DeleteShieldModal
        session={sessionToDelete}
        isOpen={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      <ImportModal
        shareId={pendingShareId}
        isOpen={Boolean(pendingShareId)}
        onClose={handleCloseImportModal}
        onImportSession={async (imported) => {
          await saveActiveSession(imported);
          setActiveSession(imported);
          navigateToTab("overview");
        }}
      />
    </div>
  );
}

export default App;
