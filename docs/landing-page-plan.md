# Splitly Landing Page, Demo Mode & SEO Strategy Implementation Plan

This document details the creation of the dedicated **Splitly** landing page (`splitly.in`), interactive demo session mode (`app.splitly.in/demo`), SEO strategy, routing architecture, page structure (`/`, `/demo`, `/terms`, `/privacy`, `/help`), and content configuration via `landing.json`.

---

## 1. Overview & Positioning

- **App Name**: Splitly
- **Landing Domain**: `splitly.in`
- **Web App Link (CTA target)**: `https://app.splitly.in`
- **Demo Mode Link**: `https://app.splitly.in/demo`
- **Core Value Proposition**: A fast, 100% private, device-only, browser-first group expense calculator. Zero sign-ups, zero backend PII tracking, zero subscription paywalls, 100% offline ready, and 1-tap "Add to Home Screen" for a native app experience.

---

## 2. 100% Data-Driven Content System (`src/config/landing.json`)

To ensure all copy, headlines, feature descriptions, comparison metrics, FAQs, CTAs, and footer details can be updated without modifying component code, all landing page content is stored in `src/config/landing.json`.

### Schema Structure of `landing.json`:
```json
{
  "hero": {
    "trustPill": "🔒 Zero Sign-Up • 100% Local Storage • 📲 Add to Home Screen",
    "headline": "Split Group Expenses Instantly. Completely Private.",
    "subheadline": "The zero-nonsense expense calculator for trips, dinners, roommates, and events. Everything stays safely inside your browser — no account, no tracking, no subscription fees.",
    "primaryCtaText": "Start Splitting Free →",
    "secondaryCtaText": "Try Interactive Demo →"
  },
  "interactiveDemoWidget": {
    "badge": "LIVE DEMO CALCULATOR",
    "title": "Test Instant Bill Splitting",
    "subtitle": "Drag the slider to test split calculations in real-time.",
    "defaultAmount": 2400,
    "defaultPeople": 4,
    "currencySymbol": "₹"
  },
  "features": [
    {
      "id": "device_only",
      "icon": "Lock",
      "title": "100% Device-Only Storage",
      "description": "All sessions reside in IndexedDB inside your browser. No server database ever touches your money data."
    },
    {
      "id": "no_account",
      "icon": "Zap",
      "title": "Zero Account Required",
      "description": "Start creating trips in under 3 seconds. No email, phone number, or password required."
    },
    {
      "id": "debt_simplification",
      "icon": "Sparkles",
      "title": "Smart Debt Simplification",
      "description": "Built-in greedy balance graph algorithm reduces 10 cross-payments down to the fewest direct settlements."
    },
    {
      "id": "flexible_modes",
      "icon": "Sliders",
      "title": "Flexible Split Modes",
      "description": "Equal splits, exact percentages (%), weighted shares, or custom amounts for complex bills."
    },
    {
      "id": "offline_ready",
      "icon": "WifiOff",
      "title": "100% Offline Ready",
      "description": "Install on your home screen with 1 tap. Use Splitly on remote flights, hikes, or road trips with zero internet connection."
    },
    {
      "id": "temp_links",
      "icon": "Clock",
      "title": "24-Hour Encrypted Share Links",
      "description": "Generate temporary trip snapshot links that automatically expire and self-destruct after 24 hours."
    }
  ],
  "comparisonTable": {
    "title": "Why Choose Splitly?",
    "subtitle": "See how Splitly compares to cloud-based expense apps.",
    "rows": [
      {
        "feature": "Account / Sign-Up Required",
        "splitly": "❌ No (Instant Start)",
        "others": "✅ Mandatory Email/Phone"
      },
      {
        "feature": "Data Storage Location",
        "splitly": "🔒 100% Local Device (IndexedDB)",
        "others": "☁ Central Cloud Servers"
      },
      {
        "feature": "Subscription & Paywalls",
        "splitly": "🆓 100% Forever Free",
        "others": "💰 Pro Tiers & Daily Limits"
      },
      {
        "feature": "Offline Experience",
        "splitly": "⚡ 100% Offline (Add to Home Screen)",
        "others": "⚠️ Limited / Internet Needed"
      },
      {
        "feature": "Data Privacy & Tracking",
        "splitly": "🛡️ Zero Tracking / Ads",
        "others": "📊 Behavioral & Ad Analytics"
      }
    ]
  },
  "howItWorks": {
    "title": "How Splitly Works in 3 Steps",
    "steps": [
      {
        "step": "01",
        "title": "Create a Trip",
        "description": "Enter your trip or event name and add member names — no login required."
      },
      {
        "step": "02",
        "title": "Add Expenses",
        "description": "Select who paid and choose Equal, Percentage, Shares, or Custom split."
      },
      {
        "step": "03",
        "title": "Settle Up",
        "description": "View minimal payment settlements and share summary text or link."
      }
    ]
  },
  "faqs": [
    {
      "question": "Is Splitly really 100% free?",
      "answer": "Yes. Splitly is completely free with no pro subscriptions, daily limits, or hidden fees."
    },
    {
      "question": "Where is my expense data stored?",
      "answer": "Your financial data is stored 100% locally inside your browser using IndexedDB. No backend database collects your data."
    },
    {
      "question": "Can I use Splitly offline or install it as an app?",
      "answer": "Yes! You can add Splitly to your home screen with 1 tap for a full native experience. Once added, it runs 100% offline without cellular or Wi-Fi connectivity."
    },
    {
      "question": "How do temporary share links work?",
      "answer": "Temporary share links let you send trip snapshots to friends. The link expires and automatically self-destructs after 24 hours."
    }
  ],
  "ctaBanner": {
    "title": "Stop stressing over split bills. Start splitting free today.",
    "buttonText": "Launch Splitly App Now →",
    "demoButtonText": "Explore Interactive Demo →"
  }
}
```

---

## 3. Subpages & Demo Mode Architecture

1. **Interactive Demo Session (`/demo`)**: Pre-loaded with 12 rich, realistic expenses across 4 members (*Alex, Priya, Rohan, Sneha*). See [`docs/demo-plan.md`](file:///Volumes/Development/projects/splitify/docs/demo-plan.md).
2. **Terms & Conditions Page (`/terms`)**: Standalone legal terms page on `splitly.in/terms`.
3. **Privacy Policy Page (`/privacy`)**: Standalone privacy policy on `splitly.in/privacy`.
4. **Help & Guide Page (`/help`)**: User instructions, "Add to Home Screen" installation guide, and FAQ documentation on `splitly.in/help`.

---

## 4. Verification Plan

### Manual Verification
1. **No "PWA" Technical Jargon**: Verify all copy displays "100% Offline Ready", "Add to Home Screen", and "Install for Native Experience".
2. **Configurable Content Test**: Update a title in `landing.json` and verify landing page renders correctly.
