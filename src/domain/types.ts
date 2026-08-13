export type MoneyMinor = number; // Integer representation in minor currency units (e.g. Paise, Cents)

export type Participant = {
  id: string;
  name: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseSplit =
  | { method: "equal"; participantIds: string[] }
  | { method: "percentage"; allocations: { participantId: string; percentageBps: number }[] } // 50.25% = 5025 basis points
  | { method: "share"; allocations: { participantId: string; shares: number }[] }
  | { method: "custom"; allocations: { participantId: string; amountMinor: MoneyMinor }[] };

export type Expense = {
  id: string;
  sessionId: string;
  description: string;
  amountMinor: MoneyMinor;
  currency: string; // Default "INR"
  paidBy: string; // Participant ID
  date?: string;
  categoryId: string;
  tags: string[];
  notes?: string;
  split: ExpenseSplit;
  createdAt: string;
  updatedAt: string;
};

export type Settlement = {
  id: string;
  sessionId: string;
  fromParticipantId: string;
  toParticipantId: string;
  amountMinor: MoneyMinor;
  date: string;
  notes?: string;
  createdAt: string;
};

export type Session = {
  id: string;
  name: string;
  participants: Participant[];
  expenses: Expense[];
  settlements: Settlement[];
  version: number; // Schema version (e.g. 1)
  createdAt: string;
  updatedAt: string;
};

export type SplitAllocation = {
  participantId: string;
  amountMinor: MoneyMinor;
};

export type LedgerEntry = {
  expenseId: string;
  participantId: string;
  paidMinor: MoneyMinor;
  owedMinor: MoneyMinor;
};

export type ParticipantBalance = {
  participantId: string;
  paidMinor: MoneyMinor;
  owedMinor: MoneyMinor;
  netMinor: MoneyMinor; // Positive = should receive money, Negative = owes money
};

export type SettlementSuggestion = {
  fromParticipantId: string;
  toParticipantId: string;
  amountMinor: MoneyMinor;
};
