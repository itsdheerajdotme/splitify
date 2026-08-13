import React, { useState, useEffect } from "react";
import { Expense, ExpenseSplit, Participant } from "../domain/types";
import { CATEGORIES, suggestCategory } from "../services/category-suggester";
import { Check, Sparkles } from "lucide-react";

interface ExpenseFormProps {
  participants: Participant[];
  initialExpense?: Expense;
  onSave: (expenseData: Omit<Expense, "id" | "sessionId" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  participants,
  initialExpense,
  onSave,
  onCancel,
}) => {
  const [description, setDescription] = useState(initialExpense?.description || "");
  const [amountStr, setAmountStr] = useState(
    initialExpense ? (initialExpense.amountMinor / 100).toString() : ""
  );
  const [paidBy, setPaidBy] = useState(
    initialExpense?.paidBy || (participants[0] ? participants[0].id : "")
  );
  const [date, setDate] = useState(
    initialExpense?.date || new Date().toISOString().split("T")[0]
  );
  const [categoryId, setCategoryId] = useState(
    initialExpense?.categoryId || "food"
  );
  const [tagsStr, setTagsStr] = useState(initialExpense?.tags.join(", ") || "");
  const [notes, setNotes] = useState(initialExpense?.notes || "");

  // Split Method state
  const [splitMethod, setSplitMethod] = useState<"equal" | "percentage" | "share" | "custom">(
    initialExpense?.split.method || "equal"
  );

  // Equal split selection
  const [equalSelectedIds, setEqualSelectedIds] = useState<string[]>(
    initialExpense?.split.method === "equal"
      ? initialExpense.split.participantIds
      : participants.map((p) => p.id)
  );

  // Percentage split allocation (% string per participant)
  const [percAllocations, setPercAllocations] = useState<{ [id: string]: string }>(() => {
    const init: { [id: string]: string } = {};
    if (initialExpense?.split.method === "percentage") {
      initialExpense.split.allocations.forEach((a) => {
        init[a.participantId] = (a.percentageBps / 100).toString();
      });
    } else {
      const defaultPerc = (100 / participants.length).toFixed(2);
      participants.forEach((p) => (init[p.id] = defaultPerc));
    }
    return init;
  });

  // Share split allocation
  const [shareAllocations, setShareAllocations] = useState<{ [id: string]: string }>(() => {
    const init: { [id: string]: string } = {};
    if (initialExpense?.split.method === "share") {
      initialExpense.split.allocations.forEach((a) => {
        init[a.participantId] = a.shares.toString();
      });
    } else {
      participants.forEach((p) => (init[p.id] = "1"));
    }
    return init;
  });

  // Custom split allocation (₹ string per participant)
  const [customAllocations, setCustomAllocations] = useState<{ [id: string]: string }>(() => {
    const init: { [id: string]: string } = {};
    if (initialExpense?.split.method === "custom") {
      initialExpense.split.allocations.forEach((a) => {
        init[a.participantId] = (a.amountMinor / 100).toString();
      });
    } else {
      participants.forEach((p) => (init[p.id] = "0"));
    }
    return init;
  });

  // Category auto-suggestion
  const suggestedCategory = suggestCategory(description);

  useEffect(() => {
    if (description.length > 2 && !initialExpense) {
      setCategoryId(suggestedCategory.id);
    }
  }, [description]);

  const amountMinor = Math.round(parseFloat(amountStr || "0") * 100);

  // Calculations for validations
  const percSum = Object.values(percAllocations).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );
  const customSumMinor = Math.round(
    Object.values(customAllocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) * 100
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) return;
    if (isNaN(amountMinor) || amountMinor <= 0) return;
    if (!paidBy) return;

    let splitPayload: ExpenseSplit;

    if (splitMethod === "equal") {
      if (equalSelectedIds.length === 0) return;
      splitPayload = { method: "equal", participantIds: equalSelectedIds };
    } else if (splitMethod === "percentage") {
      if (Math.abs(percSum - 100) > 0.05) return;
      const allocations = participants.map((p) => ({
        participantId: p.id,
        percentageBps: Math.round((parseFloat(percAllocations[p.id] || "0") * 100)),
      }));
      splitPayload = { method: "percentage", allocations };
    } else if (splitMethod === "share") {
      const allocations = participants.map((p) => ({
        participantId: p.id,
        shares: Math.max(0, parseFloat(shareAllocations[p.id] || "0")),
      }));
      splitPayload = { method: "share", allocations };
    } else {
      // Custom
      if (customSumMinor !== amountMinor) return;
      const allocations = participants.map((p) => ({
        participantId: p.id,
        amountMinor: Math.round(parseFloat(customAllocations[p.id] || "0") * 100),
      }));
      splitPayload = { method: "custom", allocations };
    }

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      description: description.trim(),
      amountMinor,
      currency: "INR",
      paidBy,
      date,
      categoryId,
      tags,
      notes: notes.trim(),
      split: splitPayload,
    });
  };

  return (
    <div className="card" style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>
        {initialExpense ? "Edit Expense" : "Add New Expense"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Expense Description *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dinner at Karim's, Petrol, Hotel stay"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              className="form-input mono"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Paid By *</label>
            <select className="form-select" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {description.length > 2 && (
              <span className="badge badge-emerald flex items-center gap-1" style={{ marginTop: "0.25rem", cursor: "pointer" }} onClick={() => setCategoryId(suggestedCategory.id)}>
                <Sparkles size={12} /> Auto-suggested: {suggestedCategory.icon} {suggestedCategory.name}
              </span>
            )}
          </div>
        </div>

        {/* Split Method Switcher */}
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label className="form-label">Split Method</label>
          <div className="flex gap-2" style={{ marginTop: "0.35rem" }}>
            <button
              type="button"
              className={`btn btn-sm ${splitMethod === "equal" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSplitMethod("equal")}
            >
              Split Equally
            </button>
            <button
              type="button"
              className={`btn btn-sm ${splitMethod === "percentage" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSplitMethod("percentage")}
            >
              By Percentage (%)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${splitMethod === "share" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSplitMethod("share")}
            >
              By Shares
            </button>
            <button
              type="button"
              className={`btn btn-sm ${splitMethod === "custom" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSplitMethod("custom")}
            >
              Custom Amount (₹)
            </button>
          </div>
        </div>

        {/* Dynamic Split Participant Inputs */}
        <div className="card" style={{ backgroundColor: "var(--bg-input)", marginBottom: "1rem", padding: "1rem" }}>
          {splitMethod === "equal" && (
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Select participants involved in this expense:
              </p>
              <div className="flex flex-col gap-2">
                {participants.map((p) => {
                  const isChecked = equalSelectedIds.includes(p.id);
                  return (
                    <label key={p.id} className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: "0.9rem" }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEqualSelectedIds([...equalSelectedIds, p.id]);
                          } else {
                            setEqualSelectedIds(equalSelectedIds.filter((id) => id !== p.id));
                          }
                        }}
                      />
                      <span>{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {splitMethod === "percentage" && (
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Assign percentages (Total must equal 100%):</p>
                <span className={`badge ${Math.abs(percSum - 100) < 0.05 ? "badge-emerald" : "badge-warning"}`}>
                  Total: {percSum.toFixed(2)}%
                </span>
              </div>
              <div className="grid-2">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span style={{ fontSize: "0.85rem", width: "80px" }}>{p.name}</span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input mono"
                      placeholder="0"
                      value={percAllocations[p.id] || ""}
                      onChange={(e) => setPercAllocations({ ...percAllocations, [p.id]: e.target.value })}
                    />
                    <span style={{ fontSize: "0.85rem" }}>%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {splitMethod === "share" && (
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                Assign share weights (e.g., 2 shares vs 1 share):
              </p>
              <div className="grid-2">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span style={{ fontSize: "0.85rem", width: "80px" }}>{p.name}</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      className="form-input mono"
                      placeholder="1"
                      value={shareAllocations[p.id] || ""}
                      onChange={(e) => setShareAllocations({ ...shareAllocations, [p.id]: e.target.value })}
                    />
                    <span style={{ fontSize: "0.85rem" }}>shares</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {splitMethod === "custom" && (
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Enter exact rupee amounts per person:</p>
                <span className={`badge ${customSumMinor === amountMinor ? "badge-emerald" : "badge-warning"}`}>
                  Allocated: ₹{(customSumMinor / 100).toFixed(2)} / ₹{(amountMinor / 100).toFixed(2)}
                </span>
              </div>
              <div className="grid-2">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span style={{ fontSize: "0.85rem", width: "80px" }}>{p.name}</span>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input mono"
                      placeholder="0.00"
                      value={customAllocations[p.id] || ""}
                      onChange={(e) => setCustomAllocations({ ...customAllocations, [p.id]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input type="text" className="form-input" placeholder="e.g. food, dinner, goa" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes (Optional)</label>
          <textarea className="form-textarea" rows={2} placeholder="Add optional details..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="flex gap-3 justify-end" style={{ marginTop: "1.25rem" }}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Check size={16} /> Save Expense
          </button>
        </div>
      </form>
    </div>
  );
};
