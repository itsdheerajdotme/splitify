import { calculateSplitAllocations } from "./split-engine";
import { LedgerEntry, ParticipantBalance, Session } from "./types";

/**
 * Normalizes all expenses in a session into discrete ledger entries.
 */
export function generateSessionLedgers(session: Session): LedgerEntry[] {
  const ledgers: LedgerEntry[] = [];

  for (const expense of session.expenses) {
    const allocations = calculateSplitAllocations(expense.amountMinor, expense.split);

    // Ledger record for payer
    ledgers.push({
      expenseId: expense.id,
      participantId: expense.paidBy,
      paidMinor: expense.amountMinor,
      owedMinor: 0,
    });

    // Ledger records for participants who owe
    for (const alloc of allocations) {
      ledgers.push({
        expenseId: expense.id,
        participantId: alloc.participantId,
        paidMinor: 0,
        owedMinor: alloc.amountMinor,
      });
    }
  }

  return ledgers;
}

/**
 * Calculates net balances for all participants in a session.
 * 
 * Formula:
 * Net = Total Paid - Total Owed + Settlement Net
 * 
 * Positive Net: Participant is owed money (Creditor)
 * Negative Net: Participant owes money (Debtor)
 * Zero Net: Participant is settled
 */
export function calculateBalances(session: Session): ParticipantBalance[] {
  const balanceMap = new Map<string, { paidMinor: number; owedMinor: number }>();

  // Initialize all session participants with zero balances
  for (const participant of session.participants) {
    balanceMap.set(participant.id, { paidMinor: 0, owedMinor: 0 });
  }

  // 1. Accumulate Expenses
  for (const expense of session.expenses) {
    const allocations = calculateSplitAllocations(expense.amountMinor, expense.split);

    // Credit payer
    const payerRecord = balanceMap.get(expense.paidBy) || { paidMinor: 0, owedMinor: 0 };
    payerRecord.paidMinor += expense.amountMinor;
    balanceMap.set(expense.paidBy, payerRecord);

    // Debit split participants
    for (const alloc of allocations) {
      const participantRecord = balanceMap.get(alloc.participantId) || { paidMinor: 0, owedMinor: 0 };
      participantRecord.owedMinor += alloc.amountMinor;
      balanceMap.set(alloc.participantId, participantRecord);
    }
  }

  // 2. Accumulate Direct Settlements
  for (const settlement of session.settlements) {
    // Payer of settlement acts as having paid money towards settling debt
    const senderRecord = balanceMap.get(settlement.fromParticipantId) || { paidMinor: 0, owedMinor: 0 };
    senderRecord.paidMinor += settlement.amountMinor;
    balanceMap.set(settlement.fromParticipantId, senderRecord);

    // Receiver of settlement acts as having owed money (or receiving back their credit)
    const receiverRecord = balanceMap.get(settlement.toParticipantId) || { paidMinor: 0, owedMinor: 0 };
    receiverRecord.owedMinor += settlement.amountMinor;
    balanceMap.set(settlement.toParticipantId, receiverRecord);
  }

  // 3. Construct ParticipantBalance array
  const balances: ParticipantBalance[] = [];
  let totalNet = 0;

  for (const participant of session.participants) {
    const record = balanceMap.get(participant.id) || { paidMinor: 0, owedMinor: 0 };
    const netMinor = record.paidMinor - record.owedMinor;
    totalNet += netMinor;

    balances.push({
      participantId: participant.id,
      paidMinor: record.paidMinor,
      owedMinor: record.owedMinor,
      netMinor,
    });
  }

  // Verification invariant check: sum of all net balances must be 0
  if (totalNet !== 0) {
    throw new Error(`Balance calculation invariant failed: total net balance sum is ${totalNet}, expected 0.`);
  }

  return balances;
}
