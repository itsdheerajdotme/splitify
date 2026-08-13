# Splitify — Project Description

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
