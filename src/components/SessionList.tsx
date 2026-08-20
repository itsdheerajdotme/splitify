import React, { useRef, useState } from "react";
import { Session } from "../domain/types";
import { formatCurrency, importSessionFromJson } from "../services/export-import";
import { Plus, Upload, Calendar, Users, ArrowLeftRight, ChevronRight, Trash2, Search, Sparkles } from "lucide-react";
import { DEMO_SESSION_ID } from "../domain/demo-data";

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
    <div className="container" style={{ paddingTop: "1rem", paddingBottom: "3rem" }}>

      {/* Compact Header Bar */}
      <div className="card flex items-center justify-between" style={{ backgroundColor: "var(--bg-input)", marginBottom: "1rem", padding: "0.85rem 1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", lineHeight: 1.1 }}>My Expense Sessions</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.15rem" }}>
            Track shared expenses locally in your browser.
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
          <button className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()} title="Import JSON">
            <Upload size={14} /> <span className="hide-mobile">Import JSON</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenCreateModal}>
            <Plus size={16} /> New Session
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      {sessions.length > 0 && (
        <div style={{ marginBottom: "1rem", position: "relative", maxWidth: "360px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search saved sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.1rem", fontSize: "0.85rem", minHeight: "38px" }}
          />
          <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)" }} />
        </div>
      )}

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem 1rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>No Saved Sessions Found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "360px", margin: "0 auto 1.25rem" }}>
            Start your first trip or import a JSON backup file.
          </p>
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={16} /> Create Your First Session
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredSessions.map((session) => {
            const totalSpending = session.expenses.reduce((sum, e) => sum + e.amountMinor, 0);
            const lastUpdated = new Date(session.updatedAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={session.id}
                className="card card-interactive flex flex-col justify-between"
                onClick={() => onSelectSession(session)}
                style={{ padding: "0.85rem 1rem" }}
              >
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="truncate" style={{ fontSize: "1.1rem" }}>{session.name}</h3>
                      {session.id === DEMO_SESSION_ID && (
                        <span className="badge badge-amber flex items-center gap-1" style={{ fontSize: "0.68rem", padding: "0.15rem 0.45rem", fontWeight: 700, flexShrink: 0 }}>
                          <Sparkles size={11} /> [Demo]
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
                      <button
                        className="btn btn-outline btn-sm btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSessionPrompt(session);
                        }}
                        style={{ width: "28px", height: "28px", minHeight: "28px", minWidth: "28px", padding: 0, color: "var(--color-danger)" }}
                        title="Delete Session"
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                  </div>

                  {/* Clean Icon Badges replacing long text */}
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: "0.75rem", marginTop: "0.25rem" }}>
                    <span className="badge badge-subtle flex items-center gap-1.5" style={{ fontSize: "0.75rem", padding: "0.22rem 0.55rem" }}>
                      <Users size={12} /> {session.participants.length}
                    </span>
                    <span className="badge badge-subtle flex items-center gap-1.5" style={{ fontSize: "0.75rem", padding: "0.22rem 0.55rem" }}>
                      <ArrowLeftRight size={12} /> {session.expenses.length}
                    </span>
                    <span className="badge badge-subtle flex items-center gap-1.5" style={{ fontSize: "0.75rem", padding: "0.22rem 0.55rem" }}>
                      <Calendar size={12} /> {lastUpdated}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between" style={{ paddingTop: "0.5rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    TOTAL SPENT
                  </span>
                  <h4 className="mono" style={{ fontSize: "1.15rem", color: "var(--accent-primary)", fontWeight: 700 }}>
                    {formatCurrency(totalSpending)}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
