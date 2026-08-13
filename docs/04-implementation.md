# Splitify — Implementation Plan

## 1. Implementation Strategy

Build Splitify in this order:

```text
Domain
  ↓
Tests
  ↓
Storage
  ↓
Application Services
  ↓
UI
  ↓
Export
  ↓
Offline
  ↓
Polish
```

Do not start with pages and forms before the calculation engine is stable.

---

## 2. Repository Setup

Suggested project:

```text
splitify/
├── src/
├── public/
├── tests/
├── docs/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Recommended scripts:

```json
{
  "dev": "...",
  "build": "...",
  "test": "...",
  "test:watch": "...",
  "lint": "...",
  "format": "..."
}
```

---

## 3. Domain Implementation Order

### Step 1 — IDs

Use opaque IDs rather than names.

Example:

```text
session_01...
participant_01...
expense_01...
```

UUIDs or UUID-like IDs are sufficient.

Never use participant names as primary keys.

---

## 4. Session Service

Implement:

```ts
createSession(name)
getSession(id)
renameSession(id, name)
deleteSession(id)
listSessions()
```

The service should delegate persistence to the repository.

---

## 5. Participant Service

Implement:

```ts
addParticipant(sessionId, participant)
updateParticipant(sessionId, participant)
removeParticipant(sessionId, participantId)
```

Do not allow deletion if an existing expense references the participant unless the application explicitly handles historical references.

A safer first implementation is:

```text
Participant remains in historical session
```

even if they are no longer active.

---

## 6. Expense Service

Implement:

```ts
createExpense(sessionId, input)
updateExpense(sessionId, expenseId, input)
deleteExpense(sessionId, expenseId)
```

Before saving:

```text
Validate expense
    ↓
Calculate split
    ↓
Verify allocation == total
    ↓
Persist expense
```

---

## 7. Split Calculator

Create independent functions:

```ts
calculateEqualSplit(...)
calculatePercentageSplit(...)
calculateShareSplit(...)
calculateCustomSplit(...)
```

All should return a common result:

```ts
type SplitAllocation = {
  participantId: string;
  amountMinor: number;
};
```

This means the rest of the system does not care how the expense was split.

---

## 8. Equal Split

Input:

```text
amount = 1000
participants = [A, B, C]
```

Output:

```text
A = 334
B = 333
C = 333
```

The remainder strategy must be deterministic.

---

## 9. Percentage Split

Input:

```text
1000

A 50%
B 30%
C 20%
```

Output:

```text
A 500
B 300
C 200
```

Validation:

```text
sum(percentages) === 100%
```

Do not accept invalid totals.

---

## 10. Share Split

Input:

```text
A = 2
B = 1
C = 1
```

Total shares:

```text
4
```

Each share:

```text
1000 / 4 = 250
```

Output:

```text
A = 500
B = 250
C = 250
```

---

## 11. Custom Split

Input:

```text
A = 500
B = 300
C = 200
```

Validation:

```text
500 + 300 + 200 === 1000
```

If not:

```text
Show remaining/difference
```

Example:

```text
Allocated ₹900 of ₹1,000
Remaining ₹100
```

This is better UX than a generic validation error.

---

## 12. Balance Engine

Create:

```ts
calculateBalances(session)
```

Algorithm:

```text
for each expense:
    payer.paid += expense.amount
    for each allocation:
        participant.owed += allocation.amount

for each participant:
    net = paid - owed
```

Return:

```ts
type ParticipantBalance = {
  participantId: string;
  paidMinor: number;
  owedMinor: number;
  netMinor: number;
};
```

---

## 13. Settlement Simplifier

Create:

```ts
simplifyBalances(balances)
```

Return:

```ts
type SettlementSuggestion = {
  fromParticipantId: string;
  toParticipantId: string;
  amountMinor: number;
};
```

The algorithm should terminate when all remaining balances are zero.

Test with:

```text
A +300
B +200
C -500
```

Expected:

```text
C → A 300
C → B 200
```

---

## 14. UI Implementation

Build pages in this order:

### Page 1 — Sessions

```text
My Sessions

[+ New Session]
```

### Page 2 — Create Session

```text
Session name
Participants

[Create]
```

### Page 3 — Session Overview

```text
Goa Trip

5 people
₹24,500 spent

[Add Expense]

Overview | Transactions | Balances
```

### Page 4 — Add Expense

Fields:

```text
Description
Amount
Paid by
Date
Category
Split method
Participants
Split values
Tags
Notes
```

---

## 15. Expense Form UX

The split selector:

```text
Split equally
Split by %
Split by shares
Custom amounts
```

should dynamically change the allocation UI.

Example:

```text
Split equally

☑ Dheeraj
☑ Amit
☑ Rahul
```

For percentage:

```text
Dheeraj    50%
Amit       30%
Rahul      20%
```

For shares:

```text
Dheeraj    2
Amit       1
Rahul      1
```

For custom:

```text
Dheeraj    ₹500
Amit       ₹300
Rahul      ₹200
```

---

## 16. Transactions UI

Recommended card:

```text
🍽️ Dinner
₹2,400

Dheeraj paid

Dheeraj ₹800
Amit    ₹800
Rahul   ₹800

13 Aug 2026
```

Actions:

```text
Edit
Delete
```

---

## 17. Balance UI

Display both:

### Detailed

```text
A owes B ₹500
B owes C ₹300
C owes A ₹200
```

### Simplified

```text
C pays A ₹300
C pays B ₹200
```

Toggle:

```text
[ Detailed ] [ Simplified ]
```

Never delete the detailed calculation when simplified mode is enabled.

---

## 18. Session Storage

On save:

```text
Application
    ↓
SessionRepository
    ↓
IndexedDB
```

On open:

```text
IndexedDB
    ↓
SessionRepository
    ↓
Application
```

Do not directly manipulate IndexedDB from React components.

---

## 19. Autosave

For the MVP, autosave is recommended.

Flow:

```text
User changes session
       ↓
Debounce
       ↓
Repository.save()
```

This prevents accidental data loss.

A visible status can say:

```text
Saved locally
```

or:

```text
Saving...
```

---

## 20. CSV Export

Implement:

```ts
downloadSessionCsv(session)
```

Use:

```text
Blob
URL.createObjectURL()
<a download>
```

No backend endpoint is necessary.

---

## 21. JSON Backup

Implement:

```ts
exportSessionJson(session)
importSessionJson(file)
```

The JSON should include:

```text
schemaVersion
session
participants
expenses
settlements
metadata
```

Validate imported files before writing them into IndexedDB.

---

## 22. Delete Flow

When deleting:

```text
if session.expenses.length > 0
```

show:

```text
This session contains financial records.

[Export CSV]
[Export Backup]
[Cancel]
[Delete]
```

The export buttons should not automatically delete the session.

---

## 23. Category Suggestion

Start with a static dictionary.

Example:

```ts
const categories = [
  {
    id: "food",
    name: "Food",
    icon: "🍔",
    keywords: ["food", "meal", "lunch", "breakfast", "dinner"]
  },
  {
    id: "fuel",
    name: "Fuel",
    icon: "⛽",
    keywords: ["petrol", "diesel", "fuel", "cng"]
  }
];
```

The suggestion service returns:

```ts
suggestCategory(description)
```

The UI displays:

```text
Suggested: 🍔 Food
```

The user can change it.

---

## 24. Testing Checklist

### Split engine

- [ ] Equal split
- [ ] Equal split with remainder
- [ ] Percentage exact
- [ ] Percentage rounding
- [ ] Share split
- [ ] Custom split
- [ ] Invalid custom total
- [ ] Invalid percentage total
- [ ] No participants

### Balance engine

- [ ] Single payer
- [ ] Multiple payers
- [ ] Participant pays own share
- [ ] Participant pays nothing
- [ ] Multiple expenses
- [ ] Zero net balance
- [ ] Negative balances
- [ ] Positive balances

### Simplifier

- [ ] One debtor / one creditor
- [ ] Multiple debtors
- [ ] Multiple creditors
- [ ] Exact settlement
- [ ] Remainder settlement
- [ ] Already settled session

### Storage

- [ ] Create
- [ ] Read
- [ ] Update
- [ ] Delete
- [ ] Reload browser
- [ ] Multiple sessions
- [ ] Migration

### Export

- [ ] CSV generation
- [ ] CSV escaping
- [ ] Unicode names
- [ ] Commas in descriptions
- [ ] Quotes in descriptions
- [ ] JSON export/import

---

## 25. Definition of Done — MVP

The MVP is complete when:

- [ ] A user can open the app without logging in.
- [ ] A session can be created.
- [ ] Participants can be added.
- [ ] Expenses can be added.
- [ ] All four split methods work.
- [ ] Expenses can be edited/deleted.
- [ ] Transactions can be reviewed.
- [ ] Balances are mathematically correct.
- [ ] Simplified settlements are available.
- [ ] Detailed/simplified view can be toggled.
- [ ] Sessions persist across browser refreshes.
- [ ] Multiple sessions can be stored.
- [ ] Sessions can be resumed.
- [ ] CSV can be downloaded.
- [ ] JSON backup can be downloaded.
- [ ] Delete has export protection.
- [ ] Category suggestions work.
- [ ] Core calculations have strong automated test coverage.
- [ ] No backend is required.

---

## 26. Recommended First Build Sequence

### Sprint 1

```text
Project setup
Domain types
Split engine
Balance engine
Simplifier
Unit tests
```

### Sprint 2

```text
IndexedDB
Repository abstraction
Session management
Participant management
```

### Sprint 3

```text
Expense form
Transactions
Balances
Edit/delete
```

### Sprint 4

```text
Categories
Suggestions
CSV export
JSON backup
Delete protection
```

### Sprint 5

```text
Responsive UI
PWA
Offline testing
Error handling
Polish
```

The goal should be a usable local-only product as early as possible, not a complete collaborative platform.

---

## 27. Architecture Rule for Future Work

When adding any feature, ask:

> Can this feature be implemented without coupling the domain model to the browser, server, or UI?

If yes, keep it in the domain/application layer.

If no, isolate the dependency behind an adapter.

This rule will allow the local-only MVP to evolve into a cloud collaboration platform without rebuilding the core product.
