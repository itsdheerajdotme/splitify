# Splitify — Future Plan & Roadmap

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
