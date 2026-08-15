import { Session, Participant, Expense, Settlement } from "./types";
import { SessionRepository } from "../repositories/session-repository";

export const DEMO_SESSION_ID = "sess_demo_goa_2026";

const now = new Date().toISOString();

const alex: Participant = { id: "p_alex", name: "Alex", createdAt: now, updatedAt: now };
const priya: Participant = { id: "p_priya", name: "Priya", createdAt: now, updatedAt: now };
const rohan: Participant = { id: "p_rohan", name: "Rohan", createdAt: now, updatedAt: now };
const sneha: Participant = { id: "p_sneha", name: "Sneha", createdAt: now, updatedAt: now };

const demoParticipants: Participant[] = [alex, priya, rohan, sneha];

const demoExpenses: Expense[] = [
  {
    id: "exp_demo_1",
    sessionId: DEMO_SESSION_ID,
    description: "Highway Toll & Fuel",
    amountMinor: 240000, // ₹2,400
    currency: "INR",
    paidBy: alex.id,
    categoryId: "transport",
    tags: ["travel", "roadtrip"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_2",
    sessionId: DEMO_SESSION_ID,
    description: "Beachfront Villa Stay (2 Nights)",
    amountMinor: 1600000, // ₹16,000
    currency: "INR",
    paidBy: priya.id,
    categoryId: "stay",
    tags: ["hotel", "villa"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_3",
    sessionId: DEMO_SESSION_ID,
    description: "Seafood Shack Dinner & Drinks",
    amountMinor: 480000, // ₹4,800
    currency: "INR",
    paidBy: rohan.id,
    categoryId: "food",
    tags: ["dinner", "beach"],
    split: {
      method: "percentage",
      allocations: [
        { participantId: alex.id, percentageBps: 3000 }, // 30%
        { participantId: priya.id, percentageBps: 2500 }, // 25%
        { participantId: rohan.id, percentageBps: 2500 }, // 25%
        { participantId: sneha.id, percentageBps: 2000 }, // 20%
      ],
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_4",
    sessionId: DEMO_SESSION_ID,
    description: "Scooter Rentals (4 Bikes, 2 Days)",
    amountMinor: 320000, // ₹3,200
    currency: "INR",
    paidBy: sneha.id,
    categoryId: "transport",
    tags: ["bikes"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_5",
    sessionId: DEMO_SESSION_ID,
    description: "Scuba Diving & Watersports",
    amountMinor: 960000, // ₹9,600
    currency: "INR",
    paidBy: alex.id,
    categoryId: "activity",
    tags: ["scuba", "sports"],
    split: {
      method: "custom",
      allocations: [
        { participantId: alex.id, amountMinor: 480000 }, // ₹4,800
        { participantId: rohan.id, amountMinor: 480000 }, // ₹4,800
      ],
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_6",
    sessionId: DEMO_SESSION_ID,
    description: "Breakfast & Specialty Coffee",
    amountMinor: 140000, // ₹1,400
    currency: "INR",
    paidBy: priya.id,
    categoryId: "food",
    tags: ["cafe", "breakfast"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_7",
    sessionId: DEMO_SESSION_ID,
    description: "Supermarket Groceries & Snacks",
    amountMinor: 185000, // ₹1,850
    currency: "INR",
    paidBy: rohan.id,
    categoryId: "groceries",
    tags: ["snacks", "villa"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_8",
    sessionId: DEMO_SESSION_ID,
    description: "Sunset Catamaran Cruise",
    amountMinor: 500000, // ₹5,000
    currency: "INR",
    paidBy: sneha.id,
    categoryId: "activity",
    tags: ["cruise", "sunset"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_9",
    sessionId: DEMO_SESSION_ID,
    description: "Cocktails at Thalassa",
    amountMinor: 620000, // ₹6,200
    currency: "INR",
    paidBy: alex.id,
    categoryId: "drinks",
    tags: ["nightlife", "drinks"],
    split: {
      method: "share",
      allocations: [
        { participantId: alex.id, shares: 2 },
        { participantId: priya.id, shares: 2 },
        { participantId: rohan.id, shares: 1 },
        { participantId: sneha.id, shares: 1 },
      ],
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_10",
    sessionId: DEMO_SESSION_ID,
    description: "Return Airport Taxi",
    amountMinor: 220000, // ₹2,200
    currency: "INR",
    paidBy: priya.id,
    categoryId: "transport",
    tags: ["taxi", "airport"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp_demo_11",
    sessionId: DEMO_SESSION_ID,
    description: "Late Night Pizza Delivery",
    amountMinor: 110000, // ₹1,100
    currency: "INR",
    paidBy: rohan.id,
    categoryId: "food",
    tags: ["pizza"],
    split: { method: "equal", participantIds: [alex.id, priya.id, rohan.id, sneha.id] },
    createdAt: now,
    updatedAt: now,
  },
];

const demoSettlements: Settlement[] = [
  {
    id: "stl_demo_1",
    sessionId: DEMO_SESSION_ID,
    fromParticipantId: priya.id,
    toParticipantId: alex.id,
    amountMinor: 100000, // ₹1,000
    date: now,
    notes: "Pre-trip advance cash transfer",
    createdAt: now,
  },
];

export const DEMO_SESSION_DATA: Session = {
  id: DEMO_SESSION_ID,
  name: "🌴 Goa Beach Villa & Road Trip (Demo)",
  participants: demoParticipants,
  expenses: demoExpenses,
  settlements: demoSettlements,
  version: 1,
  createdAt: now,
  updatedAt: now,
};

/**
 * Saves or resets the demo session in IndexedDB and returns the demo session object.
 */
export async function loadOrResetDemoSession(repository: SessionRepository): Promise<Session> {
  const freshDemoSession: Session = {
    ...DEMO_SESSION_DATA,
    updatedAt: new Date().toISOString(),
  };
  await repository.save(freshDemoSession);
  return freshDemoSession;
}
