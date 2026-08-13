# 01 Project Description


## 1. Overview

**Splitify** is a browser-first expense-splitting web application inspired by products such as Splitwise, but deliberately designed around a **zero-backend MVP**.

The initial product should work entirely inside the user's browser:

- No account or login
- No server-side database
- No API required
- No server-side session
- No personal data leaving the browser
- Sessions/trips stored locally in browser storage
- All expense calculations performed client-side
- CSV export generated client-side
- A saved session can be reopened and edited from the same browser

The product should feel like a lightweight, privacy-friendly expense ledger for trips, outings, parties, dinners, shared purchases, roommates, and similar situations.

The architecture must, however, avoid coupling the domain logic to browser storage so that a future version can introduce accounts, cloud persistence, and collaboration without rewriting the core application.

---

## 2. Core Product Concept

The primary unit of the application is a **Session**.

A session represents a temporary shared-expense context such as:

- Goa Trip
- Office Dinner
- Weekend Outing
- Birthday Party
- Roommates — August
- Family Vacation
- Road Trip
- Group Shopping

A user creates a session, adds participants, records expenses, and views the resulting balances.

### Basic flow

```text
Create Session
    ↓
Give Session a Name
    ↓
Add Participants
    ↓
Add Expenses
    ↓
Choose Split Method
    ↓
Review Transactions
    ↓
View Balances
    ↓
Optionally Simplify Balances
    ↓
Export CSV / Save Locally
```

---

## 3. Participants

Each session contains participants.

### Participant fields

- `id`
- `name`
- `phone` — optional
- `createdAt`
- `updatedAt`

Phone numbers are initially only metadata and should not be used for authentication or communication.

The UI should allow:

- Add participant
- Edit participant
- Remove participant if they have no associated transactions
- Search/select participants while creating expenses

---

## 4. Expense Model

Each expense represents one real-world transaction.

Example:

> Dheeraj paid ₹2,400 for dinner for Dheeraj, Amit and Rahul.

### Expense fields

- `id`
- `sessionId`
- `amount`
- `description`
- `paidBy`
- `date` — optional
- `category`
- `notes` — optional
- `tags` — optional
- `splitMethod`
- `participants`
- `splits`
- `createdAt`
- `updatedAt`

### Supported split methods

#### Equal

Amount is divided equally among selected participants.

Example:

₹1,000 / 4 people = ₹250 each.

#### Percentage

Participants receive explicit percentage allocations.

Example:

- A — 50%
- B — 30%
- C — 20%

The application must validate that the total equals exactly 100%.

#### Share

Participants receive relative shares.

Example:

- A — 2 shares
- B — 1 share
- C — 1 share

₹1,000 is divided into four shares:

- A — ₹500
- B — ₹250
- C — ₹250

#### Custom

The user directly specifies how much each participant owes for that expense.

The total must equal the expense amount.

---

## 5. Expense Participants

An expense can apply to:

- All participants
- A manually selected subset
- Multiple selected participants

The payer does not have to be one of the participants benefiting from the expense, although normally they will be.

Example:

A pays ₹5,000 for a group activity involving B, C and D.

A can be the payer while the expense is split only among B, C and D.

---

## 6. Transactions View

The Transactions section provides a chronological view of every expense.

Each transaction should display:

- Expense name
- Amount
- Payer
- Date/time if provided
- Category/icon
- Participants
- Split method
- Individual shares
- Tags
- Notes

Example:

```text
🍽️ Dinner
₹2,400
Paid by Dheeraj

Split:
Dheeraj  ₹800
Amit     ₹800
Rahul    ₹800

Tags: food, dinner
```

Transactions should be editable and deletable.

Deleting an expense must immediately recalculate balances.

---

## 7. Automatic Categories and Icons

The application should maintain a separate category dictionary.

Example categories:

| Category | Icon |
|---|---|
| Food | 🍔 |
| Restaurant | 🍽️ |
| Coffee | ☕ |
| Travel | 🚗 |
| Fuel | ⛽ |
| Hotel | 🏨 |
| Flight | ✈️ |
| Train | 🚆 |
| Shopping | 🛍️ |
| Entertainment | 🎬 |
| Groceries | 🛒 |
| Utilities | 💡 |
| Medical | 💊 |
| Tickets | 🎟️ |
| Other | 📦 |

When the user enters:

```text
Dinner at Karim's
```

the application can suggest:

```text
🍽️ Restaurant
```

When they enter:

```text
Petrol
```

suggest:

```text
⛽ Fuel
```

### Important architecture decision

Category suggestions should be isolated from the transaction model.

Use:

```text
Category Dictionary
        ↓
Suggestion Engine
        ↓
Expense Form
        ↓
Expense.categoryId
```

This allows the suggestion engine to evolve later without changing historical expenses.

---

## 8. Balance Calculation

The calculation engine should be completely independent of UI and storage.

For every participant:

```text
Net Balance = Total Paid - Total Owed
```

Positive balance:

> Others owe this person money.

Negative balance:

> This person owes money to others.

Example:

```text
A paid: ₹1,000
A's share: ₹400

A net = +₹600
```

So A should receive ₹600.

---

## 9. Debt Graph

The application should internally represent obligations as directed edges.

Example:

```text
A → B ₹500
B → C ₹300
C → A ₹200
```

Meaning:

- A owes B ₹500
- B owes C ₹300
- C owes A ₹200

This graph becomes the foundation for the optional simplification feature.

---

## 10. Simplification

The application should provide two views:

### Original / Detailed

Show the obligations generated from individual transactions.

This is useful for auditability.

### Simplified

Reduce the number of payments while preserving each participant's final net position.

Example:

```text
Original:

A → B ₹500
B → C ₹300
C → A ₹200
```

Net:

```text
A receives ₹300
B receives ₹200
C owes ₹500
```

Simplified:

```text
C → A ₹300
C → B ₹200
```

The simplified view must never change the underlying transactions.

It is only a presentation/payment-settlement layer.

---

## 11. Settlement

A future version can add explicit settlement transactions.

Example:

```text
C paid A ₹300
```

This should be represented separately from an expense.

Important distinction:

```text
Expense
= money spent on something

Settlement
= money transferred to settle an existing debt
```

This distinction will make future collaborative functionality much easier.

---

## 12. Local Persistence

The initial MVP should persist data entirely in the browser.

Recommended abstraction:

```text
Repository Interface
       ↓
Browser Storage Adapter
       ↓
IndexedDB
```

The UI and calculation engine should never directly call `localStorage` or IndexedDB.

### Why?

Later:

```text
Browser Storage Adapter
```

can be replaced by:

```text
API / Cloud Storage Adapter
```

without changing the expense calculation domain.

### Storage recommendation

Use **IndexedDB** as the primary storage layer.

`localStorage` can be used for small UI preferences, such as:

- Last opened session
- Theme
- Simplified-view preference
- UI settings

IndexedDB should contain the actual sessions.

---

## 13. Saved Sessions

The application should have a Sessions / Trips page.

Example:

```text
My Sessions

┌──────────────────────────────┐
│ Goa Trip                     │
│ 5 people · 23 expenses       │
│ Last updated 2 hours ago     │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Office Dinner                │
│ 8 people · 6 expenses        │
│ Last updated yesterday       │
└──────────────────────────────┘
```

Actions:

- Open
- Rename
- Export
- Delete

---

## 14. Delete Protection

Before deleting a session:

```text
Delete "Goa Trip"?

This session contains:
5 participants
23 expenses

Export a backup before deleting?

[Export CSV] [Cancel] [Delete Anyway]
```

The export prompt should be especially visible when the session contains transactions.

---

## 15. CSV Export

CSV export must happen entirely in the browser.

Recommended CSV structure:

```text
expense_id,
date,
description,
category,
amount,
paid_by,
split_method,
participant,
share_amount,
percentage,
shares,
tags,
notes
```

One expense may occupy multiple CSV rows.

Example:

```csv
expense_id,date,description,category,amount,paid_by,split_method,participant,share_amount
exp_1,2026-08-13,Dinner,restaurant,2400,Dheeraj,equal,Dheeraj,800
exp_1,2026-08-13,Dinner,restaurant,2400,Dheeraj,equal,Amit,800
exp_1,2026-08-13,Dinner,restaurant,2400,Dheeraj,equal,Rahul,800
```

No server is required.

Use a lightweight frontend CSV utility if needed, but native `Blob` + browser download APIs are sufficient for the MVP.

---

## 16. Privacy Model

The MVP should clearly communicate:

> Your expenses stay in this browser. No account or server is required.

However, the UI should also explain that browser storage is not equivalent to a permanent backup.

Users can lose local data if:

- Browser site data is cleared
- Browser profile is removed
- Device is lost
- Private/incognito browsing is used
- Storage is manually deleted

Therefore export/import should be considered an important safety feature.

---

## 17. Import

Although not strictly required for the first version, the architecture should reserve space for:

```text
Export Session
        ↓
JSON backup
        ↓
Import Session
```

CSV should primarily be treated as a reporting/export format.

JSON should be the preferred backup/restore format because it can preserve the complete application model.

---

## 18. Future Collaborative Version

The browser-only MVP should evolve into:

```text
Anonymous Local App
        ↓
Optional Account
        ↓
Cloud Sync
        ↓
Shared Sessions
        ↓
Real-time Collaboration
```

Future capabilities:

- Login
- Cloud sessions
- Share session with users
- Invite participants
- Permission control
- Real-time updates
- Settlement tracking
- Cross-device access
- Notifications
- User identity
- Phone/email matching
- Activity history

---

## 19. Product Principle

The central product principle is:

> **Make expense splitting useful before asking the user to create an account.**

The first version should be fast, private, simple and disposable.

A user should be able to open the application and create a trip in seconds.

No:

- Registration wall
- Email verification
- Backend dependency
- API key
- Server setup
- Subscription

---

## 20. MVP Success Criteria

A successful MVP should allow a user to:

1. Create a session.
2. Add participants.
3. Add expenses.
4. Split expenses using all four split methods.
5. Select all or specific participants.
6. View transaction history.
7. View net balances.
8. View simplified settlement suggestions.
9. Toggle simplification on/off.
10. Edit/delete expenses.
11. Save sessions locally.
12. Resume saved sessions.
13. Export transactions to CSV.
14. Delete sessions with export protection.
15. Use the application completely offline after initial load where technically possible.

---

## 21. Non-Goals for MVP

Do not build initially:

- Login
- User accounts
- Cloud database
- Collaboration
- Real-time sync
- Notifications
- Payments
- WhatsApp integration
- Email integration
- Server-side category learning
- Mobile native applications

These belong to later phases.

---

## 22. Long-Term Product Positioning

Splitify can eventually become:

> **A privacy-first, frictionless shared-expense platform that starts as a browser calculator and grows into a collaborative financial coordination tool.**


---

# 02 Architecture


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


---

# 03 Future Plan


## 1. Product Evolution

Splitify should evolve in stages rather than starting with a backend.

```text
Phase 0
Foundation

        ↓

Phase 1
Local Expense Splitter

        ↓

Phase 2
Offline-first + Backup

        ↓

Phase 3
Optional Accounts + Cloud Sync

        ↓

Phase 4
Shared Sessions

        ↓

Phase 5
Real-time Collaboration

        ↓

Phase 6
Intelligent Expense Management
```

The product should remain fully useful at every stage.

---

## 2. Phase 0 — Foundation

### Objective

Build the calculation and data model correctly before spending significant time on UI polish.

### Deliverables

- Project setup
- TypeScript types
- Session model
- Participant model
- Expense model
- Split engine
- Balance engine
- Settlement simplifier
- Repository interface
- Unit tests

### Exit criteria

Given a session JSON object, the application can correctly calculate:

```text
expense shares
+
participant balances
+
simplified settlements
```

without any browser APIs.

---

## 3. Phase 1 — Local MVP

### Objective

Build the complete browser-only product.

### Features

#### Sessions

- Create session
- Rename
- List saved sessions
- Open session
- Delete session

#### Participants

- Add participant
- Optional phone
- Edit participant
- Remove participant

#### Expenses

- Add expense
- Amount
- Description
- Optional date
- Category
- Tags
- Payer
- All/selected participants
- Equal
- Percentage
- Share
- Custom

#### Transactions

- List
- Search
- Filter
- Edit
- Delete

#### Summary

- Total spending
- Participant balances
- Detailed obligations
- Simplified obligations
- Toggle simplification

#### Export

- CSV
- JSON backup

### Exit criteria

A user can manage an entire trip from start to finish without logging in.

---

## 4. Phase 2 — Offline and Backup

### Objective

Make local persistence safer and more robust.

### Features

- PWA
- Service worker
- Offline application shell
- Import JSON
- Export JSON
- Schema migration
- Storage health indicator
- Backup reminder when deleting
- Session duplication

### Important UX

The app should tell users:

> Your data is stored only in this browser. Export a backup if the session is important.

---

## 5. Phase 3 — Optional Account

### Objective

Introduce cloud persistence without breaking local-first usage.

Possible flow:

```text
Continue without account
```

or:

```text
Sign in to sync
```

A user who never logs in should still have the full local experience.

### Sync architecture

```text
Local Session
     ↓
Sync Engine
     ↓
Cloud Session
```

The browser remains the source of immediate UI state.

---

## 6. Phase 4 — Shared Sessions

### Objective

Allow multiple people to participate in one session.

Example:

```text
Goa Trip

Members:
Dheeraj
Amit
Rahul
Priya
```

Each authenticated person can access the same session.

### Features

- Invite member
- Accept invitation
- Session membership
- Read/write permissions
- Participant mapping
- Cloud expense storage

---

## 7. Phase 5 — Real-time Collaboration

### Objective

Multiple people can edit a session simultaneously.

Example:

```text
Dheeraj adds hotel expense
        ↓
Amit's browser updates
        ↓
Rahul sees new balance
```

Potential technologies:

- WebSockets
- Server-sent events
- Managed realtime database
- Event-driven backend

Do not choose the technology until collaborative requirements are known.

---

## 8. Phase 6 — Settlement Tracking

Add:

```text
Settlement
```

as a first-class domain entity.

Example:

```text
C owes A ₹500

C paid A ₹500
```

The application then marks that obligation as settled.

Potential statuses:

```text
Suggested
Pending
Confirmed
Settled
Cancelled
```

---

## 9. Phase 7 — Intelligent Categorization

The category engine can evolve from keyword matching to:

```text
Keyword matching
        ↓
User history
        ↓
Fuzzy matching
        ↓
Local ML/AI suggestion
        ↓
Optional cloud AI
```

Example:

```text
"uber to hotel"

→ Travel
→ Taxi / Cab
```

The selected category should always remain user-editable.

---

## 10. Phase 8 — Receipt Capture

Future feature:

```text
Upload receipt
      ↓
OCR
      ↓
Extract:
merchant
amount
date
items
category
      ↓
Create draft expense
```

The user confirms before saving.

This should be optional because the original product value does not depend on OCR.

---

## 11. Phase 9 — Smart Expense Creation

Eventually the user could type:

> Dinner at Barbeque Nation, ₹2,850, paid by Dheeraj, split between Dheeraj, Amit and Rahul.

The application could convert it into a draft expense.

Important:

```text
AI generates draft
        ↓
User verifies
        ↓
Expense saved
```

Never silently create financial records from AI output.

---

## 12. Phase 10 — Cross-device Sync

Once accounts exist:

```text
Laptop
   ↕
Cloud
   ↕
Phone
```

A user can start a trip on desktop and continue on mobile.

---

## 13. Potential Business Model

The basic expense splitter can remain free.

Potential premium capabilities:

### Free

- Local sessions
- Unlimited expenses
- CSV export
- JSON backup
- Simplification
- Offline use

### Premium

- Cloud sync
- Shared sessions
- Advanced history
- Receipt OCR
- AI categorization
- Cross-device access
- Advanced reports

Avoid monetizing the core calculation unnecessarily.

---

## 14. Product Metrics

Early MVP metrics should focus on utility rather than vanity.

### Activation

```text
Session created
```

### Engagement

```text
Expenses added per session
```

### Completion

```text
Session reaches summary
```

### Utility

```text
CSV/JSON export used
```

### Retention

```text
Existing session reopened
```

### Collaboration readiness

Later:

```text
Session shared
```

---

## 15. Feature Prioritization

### Must have

- Session creation
- Participants
- Expense creation
- Equal split
- Percentage split
- Share split
- Custom split
- Balance calculation
- Simplification
- Local persistence
- Transactions
- CSV export
- Delete/export protection

### Should have

- JSON backup
- Import
- Search
- Filters
- Categories
- Automatic category suggestions
- PWA

### Could have

- Receipt OCR
- Charts
- Advanced analytics
- Themes
- AI expense parsing

### Not now

- Payments
- Social feed
- Chat
- Notifications
- Complex account system
- Native mobile apps

---

## 16. Key Product Risks

### Risk 1 — Data loss

Mitigation:

- JSON export
- Clear local-storage warning
- Export before delete
- Versioned storage

### Risk 2 — Calculation errors

Mitigation:

- Pure calculation engine
- Integer money
- Strong unit tests
- Invariant tests

### Risk 3 — Scope explosion

Mitigation:

Keep the first release:

```text
Session
→ Expense
→ Balance
→ Export
```

### Risk 4 — Premature backend

Mitigation:

Do not introduce authentication or a database until cloud persistence is actually needed.

---

## 17. Strategic Principle

The roadmap should preserve this principle:

> **Local-first is a product capability, not merely a temporary technical shortcut.**

Even after cloud features exist, Splitify can continue to support:

```text
No account
+
Local sessions
+
Private usage
```

This can become a meaningful product differentiator.


---

# 04 Implementation


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


---

# 05 Product Vision


## 1. Vision

### One-line vision

> **Split expenses without friction, accounts, or servers — and grow into a collaborative expense platform when you actually need it.**

Splitify should make shared-expense management feel closer to using a calculator than opening a financial application.

The user should not have to:

- Register
- Verify an email
- Invite people
- Install an app
- Configure anything
- Hand over their financial data

They should be able to open Splitify, create a trip, enter expenses, and immediately understand who owes whom.

---

## 2. Problem

Shared expenses are deceptively difficult.

During a trip or group activity, people repeatedly ask:

```text
Who paid?
Who participated?
How much did everyone owe?
Who owes whom?
Can we reduce the number of payments?
Did I already add that expense?
```

Existing expense-sharing applications can introduce friction through:

- Account creation
- Mandatory synchronization
- Heavy interfaces
- Complex collaboration flows
- Unnecessary personal-data collection

Splitify begins with a much simpler proposition:

> **Give me a private space to calculate and remember this one shared-expense context.**

---

## 3. Target Users

### Primary

People participating in:

- Trips
- Road trips
- Weekend outings
- Restaurant dinners
- Parties
- Family events
- Roommate expenses
- Group shopping
- Office outings

### Secondary

People who need a temporary financial ledger without wanting a full finance application.

---

## 4. Core User Story

> I am going on a trip with friends. I want to record shared expenses as they happen, see who owes whom, and settle everything at the end without doing calculations manually.

The ideal experience:

```text
Open Splitify
   ↓
"Goa Trip"
   ↓
Add 5 people
   ↓
Add expense
   ↓
Choose split
   ↓
Continue enjoying trip
   ↓
Check balances later
   ↓
Settle with minimal payments
```

---

## 5. Product Philosophy

### Principle 1 — Zero friction

No account before value.

### Principle 2 — Local by default

The user's temporary expense data should remain in their browser.

### Principle 3 — Calculation correctness over visual complexity

A beautiful UI is useless if the balance is wrong.

### Principle 4 — History and settlement are different

Never destroy transaction history merely to simplify payments.

### Principle 5 — Future-ready, not future-heavy

Design extension points now, but don't build the backend before it is needed.

---

## 6. Product Promise

Splitify should promise:

> **Fast, private and transparent expense splitting.**

Every result should be explainable.

If Splitify says:

```text
Rahul owes Dheeraj ₹740
```

the user should be able to trace that number back to the underlying expenses.

---

## 7. Core Experience

The application revolves around four concepts:

```text
Session
Participant
Expense
Settlement
```

Everything else is a view or supporting service.

---

## 8. Information Architecture

```text
Splitify
│
├── Sessions
│   ├── New Session
│   └── Saved Sessions
│
└── Session
    ├── Overview
    ├── Transactions
    ├── Add Expense
    ├── Balances
    └── Settings
```

Keep navigation shallow.

The user should rarely be more than one or two actions away from:

```text
Add Expense
```

---

## 9. UX Principles

### Expense entry must be fast

The common flow should require only:

```text
What?
How much?
Who paid?
Who shares?
```

Everything else is optional.

### Smart defaults

Examples:

- Date defaults to today.
- Payer defaults to the last selected payer.
- Split defaults to equal.
- Participants can default to all.
- Category can be suggested automatically.

### Never hide calculations

Users should always be able to inspect:

```text
Total
Paid by
Split between
Individual shares
```

---

## 10. Session as a Mental Model

Do not call it only a "group".

A session is broader.

Examples:

```text
Goa Trip
Birthday Party
Apartment Expenses — August
Delhi Road Trip
Office Dinner
```

This makes Splitify useful beyond travel.

---

## 11. Privacy as a Feature

Local-only operation is not merely a technical implementation.

It should be part of the product identity.

Potential messaging:

> No account. No cloud. Your session stays in your browser.

The user should know exactly where their data lives.

---

## 12. Transparency

Every derived number should be explainable.

For example:

```text
Dheeraj owes Amit ₹1,200
```

should have an optional explanation:

```text
From:
Dinner       ₹400
Hotel        ₹500
Fuel         ₹300

Total        ₹1,200
```

This is especially important in financial calculations.

---

## 13. Collaboration Philosophy

Collaboration should be optional rather than fundamental to the first experience.

The evolution should be:

```text
I need to calculate something
        ↓
I create a local session
        ↓
I find the product useful
        ↓
I want to access it elsewhere
        ↓
I optionally create an account
        ↓
I want to share the session
```

This creates a natural product funnel.

---

## 14. Future Differentiation

Splitify can differentiate itself through:

### Privacy-first

Local data by default.

### Frictionless

No signup for basic usage.

### Explainable

Every balance can be traced.

### Flexible

Equal, percentage, shares and custom splits.

### Portable

CSV and JSON export.

### Extensible

Can grow into cloud collaboration.

---

## 15. AI Direction

AI should not be the core of the initial product.

The basic calculation engine should be deterministic.

AI can later improve convenience:

```text
"Rahul paid 1200 for dinner for me, Rahul and Amit"
```

→ generate expense draft.

Or:

```text
"Uber from airport to hotel"
```

→ suggest:

```text
🚕 Travel
```

The AI layer should always remain advisory.

---

## 16. Long-Term Vision

The long-term product could become a shared financial coordination platform.

Potential capabilities:

```text
Expenses
+
Settlements
+
Receipts
+
Shared sessions
+
Cloud sync
+
Cross-device access
+
Smart categorization
+
Reports
```

But the product should retain the original simplicity.

The long-term challenge is:

> **How much functionality can be added without making expense splitting feel complicated?**

---

## 17. Success Definition

Splitify succeeds when a user can finish a complicated shared-expense scenario and say:

> "I didn't have to calculate anything."

And ideally:

> "I didn't even need to create an account."

---

## 18. Product North Star

### North Star Metric

**Completed shared-expense sessions with a calculated settlement.**

A session counts when:

```text
Session created
+
At least one expense
+
Balance calculated
```

A stronger completion signal is:

```text
Balance viewed
+
Exported or settlement reviewed
```

---

## 19. Strategic Constraint

Do not turn Splitify into a general personal-finance application too early.

Its strength is:

```text
Shared expenses
```

not:

```text
Budgeting
Investments
Bank aggregation
Credit cards
Tax planning
```

Those are different products.

---

## 20. Final Product Statement

> **Splitify is a local-first, privacy-friendly expense splitter for trips, outings and shared expenses. It lets people create a temporary session, record expenses, split them flexibly, calculate balances, simplify settlements and export their records — entirely in the browser, without requiring an account or backend.**
