import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Expense, Participant } from "../domain/types";
import { formatCurrency } from "../services/export-import";

interface DeleteExpenseModalProps {
  expense: Expense | null;
  participants: Participant[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (expenseId: string) => void;
}

export const DeleteExpenseModal: React.FC<DeleteExpenseModalProps> = ({
  expense,
  participants,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !expense) return null;

  const payer = participants.find((p) => p.id === expense.paidBy);
  const payerName = payer ? payer.name : expense.paidBy;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px" }}>
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
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.15rem", color: "var(--text-main)" }}>Delete Expense?</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>This transaction will be removed from net balance calculations.</p>
          </div>
        </div>

        <div className="card" style={{ backgroundColor: "var(--bg-input)", marginBottom: "1.25rem", padding: "0.85rem 1rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem", color: "var(--text-main)" }}>
            {expense.description}
          </div>
          <div className="flex items-center justify-between" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <span>Amount: <strong style={{ color: "var(--accent-primary)" }}>{formatCurrency(expense.amountMinor, expense.currency)}</strong></span>
            <span>Paid by: <strong>{payerName}</strong></span>
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              onConfirmDelete(expense.id);
              onClose();
            }}
          >
            <Trash2 size={16} /> Delete Expense
          </button>
        </div>
      </div>
    </div>
  );
};
