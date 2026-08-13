import { useState, useEffect } from "react";
import { Session, Expense, Settlement, Participant } from "./domain/types";
import { calculateBalances } from "./domain/balance-engine";
import { simplifyBalances } from "./domain/simplifier";
import { IndexedDBSessionRepository, InMemorySessionRepository } from "./repositories/indexeddb-repository";

import { Navbar } from "./components/Navbar";
import { SessionList } from "./components/SessionList";
import { CreateSessionModal } from "./components/CreateSessionModal";
import { ExpenseForm } from "./components/ExpenseForm";
import { TransactionsList } from "./components/TransactionsList";
import { BalancesView } from "./components/BalancesView";
import { ExportSettings } from "./components/ExportSettings";
import { DeleteShieldModal } from "./components/DeleteShieldModal";
import { LandingPageModal } from "./components/LandingPageModal";

import { Plus, ListFilter, Scale, Settings, LayoutDashboard } from "lucide-react";

// Repository instance (IndexedDB with memory fallback)
const repository = typeof indexedDB !== "undefined"
  ? new IndexedDBSessionRepository()
  : new InMemorySessionRepository();

export function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "add-expense" | "balances" | "settings">("overview");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLandingPageOpen, setIsLandingPageOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Auto-save feedback
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved locally");

  // Load sessions from repository on mount
  useEffect(() => {
    loadSessions();
  }, []);

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
    setActiveTab("overview");
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
    setActiveTab("transactions");
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

  // Rename Session
  const handleRenameSession = async (newName: string) => {
    if (!activeSession) return;
    const updatedSession: Session = {
      ...activeSession,
      name: newName,
      updatedAt: new Date().toISOString(),
    };
    await saveActiveSession(updatedSession);
  };

  // Participant CRUD
  const handleAddParticipant = async (name: string) => {
    if (!activeSession) return;
    const now = new Date().toISOString();
    const newParticipant: Participant = {
      id: `p_${Date.now()}`,
      name,
      createdAt: now,
      updatedAt: now,
    };
    const updatedSession: Session = {
      ...activeSession,
      participants: [...activeSession.participants, newParticipant],
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
    const updatedSession: Session = {
      ...activeSession,
      participants: activeSession.participants.filter((p) => p.id !== participantId),
      updatedAt: new Date().toISOString(),
    };
    await saveActiveSession(updatedSession);
  };

  // Calculations for Active Session
  const balances = activeSession ? calculateBalances(activeSession) : [];
  const simplifiedSuggestions = simplifyBalances(balances);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        onGoHome={() => setActiveSession(null)}
        onOpenLandingPage={() => setIsLandingPageOpen(true)}
        currentSessionName={activeSession?.name}
        autoSaveStatus={autoSaveStatus}
      />

      <main style={{ flex: 1 }}>
        {!activeSession ? (
          <SessionList
            sessions={sessions}
            onSelectSession={(s) => {
              setActiveSession(s);
              setActiveTab("overview");
            }}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onRestoreSession={async (imported) => {
              await saveActiveSession(imported);
              setActiveSession(imported);
              setActiveTab("overview");
            }}
            onDeleteSessionPrompt={(s) => setSessionToDelete(s)}
          />
        ) : (
          <div className="container" style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}>
            {/* Session Tabs Navigation */}
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >

                <LayoutDashboard size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Overview
              </button>
              <button
                className={`tab-btn ${activeTab === "transactions" ? "active" : ""}`}
                onClick={() => setActiveTab("transactions")}
              >
                <ListFilter size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Transactions ({activeSession.expenses.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "add-expense" ? "active" : ""}`}
                onClick={() => {
                  setEditingExpense(null);
                  setActiveTab("add-expense");
                }}
              >
                <Plus size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Add Expense
              </button>
              <button
                className={`tab-btn ${activeTab === "balances" ? "active" : ""}`}
                onClick={() => setActiveTab("balances")}
              >
                <Scale size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Balances & Settlement
              </button>
              <button
                className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} /> Export & Settings
              </button>
            </div>

            {/* Active Tab Views */}
            {activeTab === "overview" && (
              <BalancesView
                participants={activeSession.participants}
                balances={balances}
                simplifiedSuggestions={simplifiedSuggestions}
                onAddSettlement={handleAddSettlement}
              />
            )}

            {activeTab === "transactions" && (
              <TransactionsList
                expenses={activeSession.expenses}
                participants={activeSession.participants}
                onEditExpense={(expense) => {
                  setEditingExpense(expense);
                  setActiveTab("add-expense");
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {activeTab === "add-expense" && (
              <ExpenseForm
                participants={activeSession.participants}
                initialExpense={editingExpense || undefined}
                onSave={handleSaveExpense}
                onCancel={() => setActiveTab("transactions")}
              />
            )}

            {activeTab === "balances" && (
              <BalancesView
                participants={activeSession.participants}
                balances={balances}
                simplifiedSuggestions={simplifiedSuggestions}
                onAddSettlement={handleAddSettlement}
              />
            )}

            {activeTab === "settings" && (
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
              />
            )}
          </div>
        )}
      </main>

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

      <LandingPageModal
        isOpen={isLandingPageOpen}
        onClose={() => setIsLandingPageOpen(false)}
        onStartSession={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}

export default App;
