import React, { useState } from "react";
import { Expense, Participant } from "../domain/types";
import { CATEGORIES } from "../services/category-suggester";
import { formatCurrency } from "../services/export-import";
import { calculateSplitAllocations } from "../domain/split-engine";
import { Search, Edit2, Trash2, Calendar, User } from "lucide-react";

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
    <div className="flex flex-col gap-3">
      {/* Search & Filter Bar */}
      <div className="flex gap-2 items-center justify-between" style={{ flexWrap: "wrap", marginBottom: "0.5rem" }}>
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: "160px" }}>
          <div className="form-group" style={{ margin: 0, width: "100%", position: "relative" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "2.1rem", fontSize: "0.85rem" }}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </div>

        <div style={{ minWidth: "130px" }}>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: "0.85rem" }}
          >
            <option value="all">All ({expenses.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses List Cards with Margins */}
      {filteredExpenses.length === 0 ? (
        <div className="card text-center" style={{ padding: "2.5rem 1rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No expenses recorded yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredExpenses.map((expense) => {
            const categoryDef = CATEGORIES.find((c) => c.id === expense.categoryId);
            const icon = categoryDef ? categoryDef.icon : "📦";
            const payerName = participantMap.get(expense.paidBy) || expense.paidBy;
            const allocations = calculateSplitAllocations(expense.amountMinor, expense.split);

            return (
              <div
                key={expense.id}
                className="card"
                style={{
                  padding: "0.95rem 1rem",
                  margin: "0.25rem 0",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Top Row: Category Icon (with spacing) + Title + Amount */}
                <div className="flex items-start justify-between min-w-0" style={{ gap: "0.75rem" }}>
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Icon Container with Spacing */}
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-input)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.35rem",
                        border: "1px solid var(--border-subtle)",
                        flexShrink: 0,
                        marginRight: "0.25rem",
                      }}
                    >
                      {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Title with bottom margin */}
                      <h4 className="truncate" style={{ fontSize: "1rem", lineHeight: 1.25, marginBottom: "0.35rem" }}>
                        {expense.description}
                      </h4>

                      {/* Sub-row: Payer, Date, Split Method with proper spacing */}
                      <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--text-main)" }}>
                          <User size={13} color="var(--accent-primary)" /> {payerName}
                        </span>

                        <span style={{ opacity: 0.4 }}>•</span>

                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {expense.date || expense.createdAt.split("T")[0]}
                        </span>

                        <span style={{ opacity: 0.4 }}>•</span>

                        <span className="badge badge-subtle" style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem", textTransform: "capitalize" }}>
                          {expense.split.method}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount + Action Buttons */}
                  <div className="flex flex-col items-end" style={{ flexShrink: 0, gap: "0.35rem" }}>
                    <span className="mono" style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                      {formatCurrency(expense.amountMinor, expense.currency)}
                    </span>

                    <div className="flex gap-1.5">
                      <button
                        className="btn btn-outline btn-sm btn-icon"
                        onClick={() => onEditExpense(expense)}
                        style={{ width: "30px", height: "30px", minHeight: "30px", minWidth: "30px", padding: 0 }}
                        title="Edit Expense"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-outline btn-sm btn-icon"
                        onClick={() => onDeleteExpense(expense.id)}
                        style={{ width: "30px", height: "30px", minHeight: "30px", minWidth: "30px", padding: 0, color: "var(--color-danger)" }}
                        title="Delete Expense"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Split Breakdown Pills with Spacing */}
                <div style={{ marginTop: "0.75rem", paddingTop: "0.6rem", borderTop: "1px dashed var(--border-subtle)" }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    {allocations.map((a) => {
                      const pName = participantMap.get(a.participantId) || a.participantId;
                      return (
                        <span key={a.participantId} className="badge badge-subtle mono" style={{ fontSize: "0.73rem", padding: "0.2rem 0.5rem" }}>
                          {pName}: {formatCurrency(a.amountMinor, expense.currency)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
