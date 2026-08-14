import React, { useRef, useState } from "react";
import { Session } from "../domain/types";
import { downloadFile, exportSessionToCsv, exportSessionToJson, importSessionFromJson } from "../services/export-import";
import { FileSpreadsheet, Download, Upload, Trash2, UserPlus, Users, Edit2, Share2, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react";
import { ShareModal } from "./ShareModal";

interface ExportSettingsProps {
  session: Session;
  onUpdateSessionName: (newName: string) => void;
  onAddParticipant: (name: string) => void;
  onRenameParticipant: (participantId: string, newName: string) => void;
  onRemoveParticipant: (participantId: string) => void;
  onRestoreSession: (importedSession: Session) => void;
  onOpenDeleteModal: () => void;
  isCheckingUpdate?: boolean;
  lastCheckMessage?: string | null;
  onCheckForUpdates?: () => Promise<boolean>;
  onApplyUpdate?: () => void;
  hasUpdate?: boolean;
}

export const ExportSettings: React.FC<ExportSettingsProps> = ({
  session,
  onUpdateSessionName,
  onAddParticipant,
  onRenameParticipant,
  onRemoveParticipant,
  onRestoreSession,
  onOpenDeleteModal,
  isCheckingUpdate = false,
  lastCheckMessage,
  onCheckForUpdates,
  onApplyUpdate,
  hasUpdate = false,
}) => {
  const [sessionNameInput, setSessionNameInput] = useState(session.name);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCsv = () => {
    const csv = exportSessionToCsv(session);
    const filename = `${session.name.toLowerCase().replace(/\s+/g, "_")}_expenses.csv`;
    downloadFile(filename, csv, "text/csv");
  };

  const handleExportJson = () => {
    const jsonStr = exportSessionToJson(session);
    const filename = `${session.name.toLowerCase().replace(/\s+/g, "_")}_backup.json`;
    downloadFile(filename, jsonStr, "application/json");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importSessionFromJson(content);
        onRestoreSession(imported);
        alert("Session successfully restored from JSON backup!");
      } catch (err: any) {
        alert(`Failed to import JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Session Metadata & Rename */}
      <div className="card">
        <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Session Settings</h4>
        <div className="flex gap-2">
          <input
            type="text"
            className="form-input"
            value={sessionNameInput}
            onChange={(e) => setSessionNameInput(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (sessionNameInput.trim()) {
                onUpdateSessionName(sessionNameInput.trim());
              }
            }}
          >
            Rename
          </button>
        </div>
      </div>

      {/* Participants Management */}
      <div className="card">
        <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          Group Participants ({session.participants.length})
        </h4>

        <div className="flex gap-2" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add new participant..."
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newParticipantName.trim()) {
                e.preventDefault();
                onAddParticipant(newParticipantName.trim());
                setNewParticipantName("");
              }
            }}
          />
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (newParticipantName.trim()) {
                onAddParticipant(newParticipantName.trim());
                setNewParticipantName("");
              }
            }}
          >
            <UserPlus size={16} /> Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {session.participants.map((p) => {
            const hasExpenses = session.expenses.some((e) => {
              if (e.paidBy === p.id) return true;
              if (e.split.method === "equal") {
                return e.split.participantIds.includes(p.id);
              }
              return e.split.allocations.some((a) => a.participantId === p.id);
            });

            return (
              <div
                key={p.id}
                className="flex items-center justify-between"
                style={{
                  backgroundColor: "var(--bg-input)",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {editingParticipantId === p.id ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      className="form-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (editingName.trim()) {
                          onRenameParticipant(p.id, editingName.trim());
                          setEditingParticipantId(null);
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>{p.name}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setEditingParticipantId(p.id);
                      setEditingName(p.name);
                    }}
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onRemoveParticipant(p.id)}
                    style={{ padding: "0.25rem 0.5rem", color: "var(--color-danger)" }}
                    disabled={hasExpenses}
                    title={hasExpenses ? "Cannot delete participant with existing expenses" : "Remove participant"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* App Version & Offline PWA Status */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div className="flex items-center gap-2">
            <Smartphone size={20} color="var(--accent-primary)" />
            <h4 style={{ fontSize: "1.1rem" }}>App Version & Offline Status</h4>
          </div>
          <span className="badge badge-emerald flex items-center gap-1" style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}>
            <CheckCircle2 size={12} /> 100% Offline Ready
          </span>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Splitify caches application files automatically in your browser. When online, it checks for updates once a day.
        </p>

        <div className="flex items-center justify-between" style={{ backgroundColor: "var(--bg-input)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Splitify PWA v1.0.0</div>
            {lastCheckMessage && (
              <div style={{ fontSize: "0.75rem", color: "var(--accent-primary)", marginTop: "0.15rem" }}>
                {lastCheckMessage}
              </div>
            )}
          </div>

          {hasUpdate ? (
            <button className="btn btn-primary btn-sm" onClick={onApplyUpdate} style={{ backgroundColor: "#0284c7" }}>
              <RefreshCw size={14} /> Update Now
            </button>
          ) : (
            <button
              className="btn btn-outline btn-sm"
              onClick={onCheckForUpdates}
              disabled={isCheckingUpdate}
            >
              <RefreshCw size={14} className={isCheckingUpdate ? "spin-slow" : ""} />
              {isCheckingUpdate ? "Checking..." : "Check for Updates"}
            </button>
          )}
        </div>
      </div>

      {/* Share & Backup Section */}
      <div className="card">
        <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Share & Export Data</h4>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
          Share your trip session via a 24-hour temporary link, or export CSV and JSON backups.
        </p>

        {/* Share Button Highlight */}
        <div style={{ marginBottom: "1.25rem", padding: "1rem", backgroundColor: "rgba(99, 102, 241, 0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "0.25rem" }}>
                Temporary Share Link (24 Hours)
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Generates a web link to quickly send this trip session to friends.
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setIsShareModalOpen(true)} style={{ whiteSpace: "nowrap" }}>
              <Share2 size={16} /> Share Trip Link
            </button>
          </div>
        </div>

        <div className="grid-2">
          <button className="btn btn-secondary" onClick={handleExportCsv}>
            <FileSpreadsheet size={18} /> Export Formatted CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportJson}>
            <Download size={18} /> Download Backup JSON
          </button>
        </div>

        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--border-subtle)" }}>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()} style={{ width: "100%" }}>
            <Upload size={18} /> Restore Session from JSON File
          </button>
        </div>
      </div>

      <ShareModal session={session} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />

      {/* Danger Zone: Session Deletion */}
      <div className="card" style={{ borderColor: "var(--color-danger-bg)", backgroundColor: "rgba(239, 68, 68, 0.05)" }}>
        <h4 style={{ fontSize: "1.1rem", color: "var(--color-danger)", marginBottom: "0.5rem" }}>Danger Zone</h4>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Permanently remove this session and all recorded expenses from this browser.
        </p>

        <button className="btn btn-danger" onClick={onOpenDeleteModal}>
          <Trash2 size={16} /> Delete Entire Session
        </button>
      </div>
    </div>
  );
};

