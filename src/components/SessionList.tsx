import React, { useRef, useState } from "react";
import { Session } from "../domain/types";
import { formatCurrency, importSessionFromJson } from "../services/export-import";
import { Plus, Upload, Calendar, Users, DollarSign, ArrowRight, Trash2, Search, Zap } from "lucide-react";

interface SessionListProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onOpenCreateModal: () => void;
  onRestoreSession: (importedSession: Session) => void;
  onDeleteSessionPrompt: (session: Session) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onSelectSession,
  onOpenCreateModal,
  onRestoreSession,
  onDeleteSessionPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSessions = sessions.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importSessionFromJson(content);
        onRestoreSession(imported);
      } catch (err: any) {
        alert(`Failed to import session JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
      {/* Welcome Banner */}
      <div className="card flex items-center justify-between" style={{ backgroundColor: "var(--bg-input)", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>My Expense Sessions</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Track shared expenses for trips, dinners, and events. Stored 100% locally in your browser.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} /> Import JSON Backup
          </button>
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={18} /> New Session / Trip
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      {sessions.length > 0 && (
        <div style={{ marginBottom: "1.25rem", position: "relative", maxWidth: "400px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search saved sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
        </div>
      )}

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <Zap size={48} color="var(--accent-primary)" style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Saved Sessions Found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
            Start your first expense session or import an existing JSON backup file.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onOpenCreateModal}>
            <Plus size={18} /> Create Your First Session
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredSessions.map((session) => {
            const totalSpending = session.expenses.reduce((sum, e) => sum + e.amountMinor, 0);
            const lastUpdated = new Date(session.updatedAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={session.id}
                className="card card-interactive flex flex-col justify-between"
                onClick={() => onSelectSession(session)}
              >
                <div>
                  <div className="flex items-start justify-between" style={{ marginBottom: "0.75rem" }}>
                    <h3 style={{ fontSize: "1.25rem" }}>{session.name}</h3>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSessionPrompt(session);
                      }}
                      style={{ padding: "0.25rem 0.5rem", color: "var(--color-danger)" }}
                      title="Delete Session"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: "1rem" }}>
                    <span className="badge badge-subtle flex items-center gap-1">
                      <Users size={12} /> {session.participants.length} Participants
                    </span>
                    <span className="badge badge-subtle flex items-center gap-1">
                      <DollarSign size={12} /> {session.expenses.length} Expenses
                    </span>
                    <span className="badge badge-subtle flex items-center gap-1">
                      <Calendar size={12} /> {lastUpdated}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between" style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                      Total Spent
                    </span>
                    <h4 className="mono" style={{ fontSize: "1.25rem", color: "var(--accent-primary)" }}>
                      {formatCurrency(totalSpending)}
                    </h4>
                  </div>

                  <span className="btn btn-secondary btn-sm flex items-center gap-1">
                    Open Trip <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
