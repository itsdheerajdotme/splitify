import React from "react";
import { AlertTriangle, Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { Session } from "../domain/types";
import { downloadFile, exportSessionToCsv, exportSessionToJson } from "../services/export-import";

interface DeleteShieldModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (sessionId: string) => void;
}

export const DeleteShieldModal: React.FC<DeleteShieldModalProps> = ({
  session,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !session) return null;

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3" style={{ marginBottom: "1rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--color-danger-bg)",
              color: "var(--color-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", color: "var(--text-main)" }}>Delete "{session.name}"?</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>This action cannot be undone once deleted.</p>
          </div>
        </div>

        <div className="card" style={{ backgroundColor: "var(--bg-input)", marginBottom: "1.25rem", padding: "1rem" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600, marginBottom: "0.5rem" }}>
            This session currently contains:
          </p>
          <ul style={{ paddingLeft: "1.25rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <li>{session.participants.length} Participants</li>
            <li>{session.expenses.length} Expense transactions</li>
            <li>{session.settlements.length} Recorded settlements</li>
          </ul>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          We strongly recommend exporting a backup before deleting your data from browser storage:
        </p>

        <div className="flex gap-2" style={{ marginBottom: "1.5rem" }}>
          <button className="btn btn-secondary btn-sm flex-1" onClick={handleExportCsv}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button className="btn btn-secondary btn-sm flex-1" onClick={handleExportJson}>
            <Download size={16} /> Download Backup JSON
          </button>
        </div>

        <div className="flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={() => onConfirmDelete(session.id)}>
            <Trash2 size={16} /> Delete Session
          </button>
        </div>
      </div>
    </div>
  );
};
