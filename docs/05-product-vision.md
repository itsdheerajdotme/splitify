# Splitify — Product Vision Document

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
