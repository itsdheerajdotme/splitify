import React, { useState } from "react";
import { Expense, Participant } from "../domain/types";
import { CATEGORIES } from "../services/category-suggester";
import { formatCurrency } from "../services/export-import";
import { calculateSplitAllocations } from "../domain/split-engine";
import { Search, Edit2, Trash2, Calendar, Tag, FileText } from "lucide-react";

interface TransactionsListProps {
  expenses: Expense[];
  participants: Participant[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  expenses,
  participants,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const participantMap = new Map<string, string>();
  participants.forEach((p) => participantMap.set(p.id, p.name));

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || e.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="flex gap-3 items-center justify-between" style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: "240px" }}>
          <div className="form-group" style={{ margin: 0, width: "100%", position: "relative" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search expenses by name, tags, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "2.25rem" }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </div>

        <div style={{ minWidth: "180px" }}>
          <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories ({expenses.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Cards List */}
      {filteredExpenses.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem 1.5rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>No expenses recorded yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredExpenses.map((expense) => {
            const categoryDef = CATEGORIES.find((c) => c.id === expense.categoryId);
            const icon = categoryDef ? categoryDef.icon : "📦";
            const payerName = participantMap.get(expense.paidBy) || expense.paidBy;
            const allocations = calculateSplitAllocations(expense.amountMinor, expense.split);

            return (
              <div key={expense.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-input)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      {icon}
                    </div>

                    <div>
                      <h4 style={{ fontSize: "1.1rem", marginBottom: "0.15rem" }}>{expense.description}</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }} className="flex items-center gap-2">
                        <span>Paid by <strong style={{ color: "var(--text-main)" }}>{payerName}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {expense.date || expense.createdAt.split("T")[0]}
                        </span>
                        <span>•</span>
                        <span className="badge badge-subtle" style={{ textTransform: "capitalize" }}>
                          Split: {expense.split.method}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="mono" style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                      {formatCurrency(expense.amountMinor, expense.currency)}
                    </span>

                    <div className="flex gap-1" style={{ marginTop: "0.35rem" }}>
                      <button className="btn btn-outline btn-sm" onClick={() => onEditExpense(expense)} style={{ padding: "0.25rem 0.5rem" }}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => onDeleteExpense(expense.id)} style={{ padding: "0.25rem 0.5rem", color: "var(--color-danger)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Individual Split Breakdown */}
                <div style={{ marginTop: "0.85rem", paddingTop: "0.75rem", borderTop: "1px dashed var(--border-subtle)" }}>
                  <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>SPLIT BREAKDOWN:</span>
                      {allocations.map((a) => {
                        const pName = participantMap.get(a.participantId) || a.participantId;
                        return (
                          <span key={a.participantId} className="badge badge-subtle mono" style={{ fontSize: "0.75rem" }}>
                            {pName}: {formatCurrency(a.amountMinor, expense.currency)}
                          </span>
                        );
                      })}
                    </div>

                    {expense.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag size={12} color="var(--text-muted)" />
                        {expense.tags.map((t, idx) => (
                          <span key={idx} style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {expense.notes && (
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }} className="flex items-center gap-1">
                      <FileText size={12} /> {expense.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
