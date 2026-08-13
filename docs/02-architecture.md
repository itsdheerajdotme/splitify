# Splitify — Architecture Document

## 1. Architecture Goals

The architecture is designed around five principles:

1. **Frontend-first**
2. **No backend dependency for MVP**
3. **Domain logic independent of storage**
4. **Offline-friendly**
5. **Backend-ready without a domain rewrite**

The most important architectural boundary is:

```text
UI
 │
 ▼
Application Services
 │
 ▼
Domain / Calculation Engine
 │
 ├── Expense Rules
 ├── Split Calculators
 ├── Balance Engine
 └── Settlement Simplifier
 │
 ▼
Repository Interface
 │
 ▼
IndexedDB Adapter
```

Later:

```text
Repository Interface
 │
 ├── IndexedDB Adapter
 │
 └── API / Cloud Adapter
```

---

## 2. Recommended Frontend Stack

The implementation can use:

- TypeScript
- React
- Vite
- Tailwind CSS
- A lightweight component system
- IndexedDB
- Vitest
- Playwright

The exact UI framework can change, but the domain layer must remain framework-independent.

A good project structure is:

```text
src/
├── app/
├── components/
├── features/
│   ├── sessions/
│   ├── participants/
│   ├── expenses/
│   ├── transactions/
│   ├── balances/
│   ├── settlements/
│   └── export/
├── domain/
│   ├── session/
│   ├── participant/
│   ├── expense/
│   ├── split/
│   ├── balance/
│   └── settlement/
├── repositories/
│   ├── session-repository.ts
│   ├── indexeddb-session-repository.ts
│   └── repository-types.ts
├── services/
│   ├── category-suggestion/
│   ├── export/
│   └── import/
├── storage/
├── utils/
└── tests/
```

---

## 3. Core Domain Entities

### Session

```ts
type Session = {
  id: string;
  name: string;
  participants: Participant[];
  expenses: Expense[];
  settlements: Settlement[];
  createdAt: string;
  updatedAt: string;
  version: number;
};
```

### Participant

```ts
type Participant = {
  id: string;
  name: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Expense

```ts
type Expense = {
  id: string;
  description: string;
  amountMinor: number;
  currency: string;
  paidBy: string;
  date?: string;
  categoryId: string;
  tags: string[];
  notes?: string;
  split: ExpenseSplit;
  createdAt: string;
  updatedAt: string;
};
```

---

## 4. Money Representation

Never use floating-point decimal arithmetic for money.

Prefer the smallest currency unit:

```text
₹100.50 → 10050 paise
```

Therefore:

```ts
amountMinor: number;
currency: "INR";
```

This prevents errors such as:

```text
0.1 + 0.2 !== 0.3
```

### Rounding

Every split method must define a deterministic rounding rule.

For equal splits:

```text
100 / 3
```

may produce:

```text
33
33
34
```

The system should distribute the remainder deterministically.

A recommended rule:

1. Calculate floor amount.
2. Calculate remainder.
3. Assign remainder one minor unit at a time.
4. Use stable participant ordering.

This ensures calculations are reproducible.

---

## 5. Split Model

Use a discriminated union.

```ts
type ExpenseSplit =
  | {
      method: "equal";
      participantIds: string[];
    }
  | {
      method: "percentage";
      allocations: {
        participantId: string;
        percentageBps: number;
      }[];
    }
  | {
      method: "share";
      allocations: {
        participantId: string;
        shares: number;
      }[];
    }
  | {
      method: "custom";
      allocations: {
        participantId: string;
        amountMinor: number;
      }[];
    };
```

Percentage should preferably be stored in basis points:

```text
50.25% = 5025 bps
```

rather than floating-point values.

---

## 6. Calculation Pipeline

Expense calculation should follow:

```text
Expense
  ↓
Validate
  ↓
Resolve Selected Participants
  ↓
Calculate Individual Shares
  ↓
Produce Ledger Entries
  ↓
Aggregate Participant Balances
  ↓
Generate Settlement Suggestions
```

The calculation engine should have no dependency on React, browser APIs, IndexedDB, or HTTP.

---

## 7. Ledger Representation

Internally, normalize expenses into ledger entries.

Example:

```ts
type LedgerEntry = {
  expenseId: string;
  participantId: string;
  paidMinor: number;
  owedMinor: number;
};
```

For:

```text
A pays ₹1,000
A and B split equally
```

produce:

```text
A paid 1000, owed 500
B paid 0,    owed 500
```

Net:

```text
A +500
B -500
```

This normalized representation makes balance calculations simple.

---

## 8. Balance Engine

For each participant:

```text
net = totalPaid - totalOwed
```

Example:

```text
A: +500
B: -300
C: -200
```

Interpretation:

```text
A should receive ₹500
B should pay ₹300
C should pay ₹200
```

The balance engine should expose:

```ts
calculateBalances(session): ParticipantBalance[]
```

---

## 9. Settlement Simplifier

The simplifier receives net balances, not raw expenses.

Separate:

```text
Transaction history
```

from:

```text
Settlement recommendation
```

Algorithm:

1. Separate creditors and debtors.
2. Sort both deterministically.
3. Match debtor with creditor.
4. Transfer the minimum of the outstanding amounts.
5. Continue until all balances reach zero.

Example:

```text
Creditors:
A +600
B +200

Debtors:
C -500
D -300
```

Possible result:

```text
C → A 500
D → A 100
D → B 200
```

The exact matching strategy can be optimized later, but the first version should prioritize correctness, determinism and simplicity.

---

## 10. Why Simplification Should Not Mutate Expenses

Suppose the user has:

```text
10 expenses
```

and the simplifier produces:

```text
3 suggested payments
```

Those three payments are not original transactions.

Therefore:

```text
Expenses = immutable financial history
Settlement Suggestions = derived view
```

This distinction is essential for future collaboration and auditability.

---

## 11. Repository Pattern

Define an interface:

```ts
interface SessionRepository {
  list(): Promise<Session[]>;
  get(id: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
  delete(id: string): Promise<void>;
}
```

The application should depend only on this interface.

### MVP implementation

```text
SessionRepository
       ↓
IndexedDBSessionRepository
```

### Future implementation

```text
SessionRepository
       ↓
ApiSessionRepository
```

This is the primary future-proofing mechanism.

---

## 12. IndexedDB Design

Suggested database:

```text
Database: splitify
```

Object stores:

```text
sessions
categories
settings
```

Initially, sessions can contain participants and expenses as nested structures.

If data volume grows, the model can be normalized into:

```text
sessions
participants
expenses
expense_splits
settlements
```

Do not prematurely normalize the MVP.

---

## 13. Storage Versioning

Every persisted session should contain:

```ts
version: number;
```

Example:

```text
version: 1
```

Future schema migration:

```text
version 1 → version 2
version 2 → version 3
```

This prevents application upgrades from corrupting old local sessions.

---

## 14. Category Suggestion Engine

Keep category data separate.

```ts
type Category = {
  id: string;
  name: string;
  icon: string;
  keywords: string[];
  priority: number;
};
```

Example:

```ts
{
  id: "fuel",
  name: "Fuel",
  icon: "⛽",
  keywords: ["petrol", "diesel", "fuel", "gas", "cng"],
  priority: 10
}
```

Suggestion algorithm:

```text
Input description
      ↓
Normalize text
      ↓
Tokenize
      ↓
Match keywords
      ↓
Calculate score
      ↓
Return top category
```

The user must always be able to override the suggestion.

Historical expenses must store the selected category ID rather than relying on recalculation.

---

## 15. UI Architecture

Recommended primary navigation:

```text
Sessions
   │
   └── Session
        ├── Overview
        ├── Transactions
        ├── Add Expense
        ├── Balances
        └── Settings
```

### Session overview

Show:

- Session name
- Participant count
- Expense count
- Total spending
- Net balances
- Simplified settlement preview

### Transactions

Show:

- Expense list
- Filters
- Search
- Category
- Date
- Payer
- Amount

### Balances

Show:

```text
Detailed
Simplified
```

with a toggle.

---

## 16. Validation Rules

### Session

- Name required
- Name length bounded
- At least one participant recommended

### Participant

- Name required
- Phone optional
- Duplicate names should be allowed internally because IDs are authoritative
- UI should warn about duplicate names

### Expense

- Amount > 0
- Payer must exist
- At least one split participant
- Split must equal total amount
- Percentage total = 100%
- Share total > 0
- Custom total = expense amount

---

## 17. CSV Export Architecture

Create:

```ts
exportSessionToCsv(session): Blob
```

The export service should:

1. Receive a session.
2. Flatten expenses.
3. Escape CSV values.
4. Create a Blob.
5. Trigger browser download.

No server required.

Also consider:

```text
Export JSON
```

for full backup/restore.

---

## 18. Offline Capability

The application should be designed as a PWA eventually.

Possible architecture:

```text
Browser
  ↓
Service Worker
  ↓
Cached Application Shell
  ↓
IndexedDB
```

Then:

```text
No internet
   ↓
App still opens
   ↓
Existing sessions still work
   ↓
New expenses still work
```

This is a natural extension of the browser-first model.

---

## 19. Security and Privacy

Because there is no backend:

- No server-side personal data
- No authentication required
- No API exposure
- No database credentials
- No network persistence

However:

- Browser storage is accessible to scripts running under the same origin.
- XSS protection remains important.
- Never render user-entered content as raw HTML.
- Avoid storing unnecessary personal information.
- Phone numbers should be treated as optional sensitive metadata.

---

## 20. Testing Strategy

### Unit tests

The calculation engine deserves the highest test coverage.

Test:

- Equal split
- Unequal participant selection
- Percentage split
- Share split
- Custom split
- Rounding
- Zero/invalid amounts
- Balance calculation
- Simplification
- Multiple creditors
- Multiple debtors
- Fully settled sessions

### Property-style invariants

For every valid expense:

```text
sum(all participant shares) == expense amount
```

For every session:

```text
sum(all net balances) == 0
```

For simplified settlements:

```text
sum(creditor balances) == sum(debtor balances)
```

These invariants are more important than UI tests.

---

## 21. Future Backend Boundary

Future architecture:

```text
                    ┌───────────────┐
                    │   React App   │
                    └───────┬───────┘
                            │
                  ┌─────────▼─────────┐
                  │ Application Layer │
                  └─────────┬─────────┘
                            │
                    ┌───────▼───────┐
                    │ Domain Engine │
                    └───────┬───────┘
                            │
                    Repository API
                            │
                 ┌──────────▼──────────┐
                 │ Cloud/API Adapter   │
                 └──────────┬──────────┘
                            │
                 ┌──────────▼──────────┐
                 │ Backend + Database  │
                 └─────────────────────┘
```

The domain engine should remain usable on both client and server.

---

## 22. Future Collaborative Data Model

Eventually:

```text
User
Session
SessionMember
Participant
Expense
ExpenseSplit
Settlement
Category
Activity
```

Potential relationships:

```text
User
 └── SessionMember
       └── Session
            ├── Participants
            ├── Expenses
            └── Settlements
```

The MVP should not require this database model yet.

---

## 23. Architecture Decision Summary

| Decision | MVP |
|---|---|
| Backend | None |
| Database | None server-side |
| Browser storage | IndexedDB |
| UI | React + TypeScript |
| Money | Integer minor units |
| Calculation | Pure TypeScript |
| State | UI state + persisted repository |
| Export | Client-side |
| Auth | None |
| Collaboration | Future |
| Cloud sync | Future |
| PWA | Phase 2 |
| API | Future |
| Database | Future |
