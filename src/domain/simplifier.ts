import { ParticipantBalance, SettlementSuggestion } from "./types";

/**
 * Greedy debt simplification algorithm.
 * Converts a set of participant net balances into the minimal number of direct settlement recommendations.
 */
export function simplifyBalances(balances: ParticipantBalance[]): SettlementSuggestion[] {
  // Separate into creditors (> 0) and debtors (< 0)
  const creditors = balances
    .filter((b) => b.netMinor > 0)
    .map((b) => ({ participantId: b.participantId, amountMinor: b.netMinor }))
    .sort((a, b) => b.amountMinor - a.amountMinor || a.participantId.localeCompare(b.participantId));

  const debtors = balances
    .filter((b) => b.netMinor < 0)
    .map((b) => ({ participantId: b.participantId, amountMinor: Math.abs(b.netMinor) }))
    .sort((a, b) => b.amountMinor - a.amountMinor || a.participantId.localeCompare(b.participantId));

  const suggestions: SettlementSuggestion[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settlementAmount = Math.min(creditor.amountMinor, debtor.amountMinor);

    if (settlementAmount > 0) {
      suggestions.push({
        fromParticipantId: debtor.participantId,
        toParticipantId: creditor.participantId,
        amountMinor: settlementAmount,
      });

      creditor.amountMinor -= settlementAmount;
      debtor.amountMinor -= settlementAmount;
    }

    if (creditor.amountMinor === 0) {
      creditorIndex++;
    }
    if (debtor.amountMinor === 0) {
      debtorIndex++;
    }
  }

  return suggestions;
}
