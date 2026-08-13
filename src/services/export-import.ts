import { calculateSplitAllocations } from "../domain/split-engine";
import { Session } from "../domain/types";
import { CATEGORIES } from "./category-suggester";

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function formatCurrency(amountMinor: number, currency: string = "INR"): string {
  return (amountMinor / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 2,
  });
}

/**
 * Generates a clean, multi-row CSV string representation of a Session.
 */
export function exportSessionToCsv(session: Session): string {
  const headers = [
    "Expense ID",
    "Date",
    "Description",
    "Category",
    "Total Expense",
    "Paid By",
    "Split Method",
    "Participant",
    "Participant Share",
    "Tags",
    "Notes",
  ];

  const rows: string[] = [headers.map(escapeCsvField).join(",")];

  const participantMap = new Map<string, string>();
  session.participants.forEach((p) => participantMap.set(p.id, p.name));

  for (const expense of session.expenses) {
    const categoryDef = CATEGORIES.find((c) => c.id === expense.categoryId);
    const categoryLabel = categoryDef ? `${categoryDef.icon} ${categoryDef.name}` : expense.categoryId;
    const payerName = participantMap.get(expense.paidBy) || expense.paidBy;
    const totalFormatted = (expense.amountMinor / 100).toFixed(2);
    const dateStr = expense.date || expense.createdAt.split("T")[0];
    const tagsStr = expense.tags.join("; ");

    const allocations = calculateSplitAllocations(expense.amountMinor, expense.split);

    for (const alloc of allocations) {
      const participantName = participantMap.get(alloc.participantId) || alloc.participantId;
      const shareFormatted = (alloc.amountMinor / 100).toFixed(2);

      const row = [
        expense.id,
        dateStr,
        expense.description,
        categoryLabel,
        totalFormatted,
        payerName,
        expense.split.method,
        participantName,
        shareFormatted,
        tagsStr,
        expense.notes || "",
      ];

      rows.push(row.map(escapeCsvField).join(","));
    }
  }

  return rows.join("\n");
}

/**
 * Triggers a browser file download for a string content.
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports full session as JSON backup string.
 */
export function exportSessionToJson(session: Session): string {
  const backupObject = {
    schemaVersion: 1,
    exportTimestamp: new Date().toISOString(),
    session,
  };
  return JSON.stringify(backupObject, null, 2);
}

/**
 * Validates and restores a Session from a JSON string.
 */
export function importSessionFromJson(jsonContent: string): Session {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonContent);
  } catch (err) {
    throw new Error("Invalid JSON file format.");
  }

  const session = parsed.session || parsed;

  if (!session || typeof session !== "object" || !session.id || !session.name || !Array.isArray(session.participants) || !Array.isArray(session.expenses)) {
    throw new Error("Invalid Splitify session structure in JSON file.");
  }

  return session as Session;
}
