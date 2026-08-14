import { ExpenseSplit, MoneyMinor, SplitAllocation } from "./types";

export class SplitCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SplitCalculationError";
  }
}

/**
 * Calculates equal splits among participants with deterministic remainder distribution in whole rupees.
 */
export function calculateEqualSplit(
  amountMinor: MoneyMinor,
  participantIds: string[]
): SplitAllocation[] {
  if (participantIds.length === 0) {
    throw new SplitCalculationError("Cannot split expense among 0 participants.");
  }
  if (amountMinor < 0) {
    throw new SplitCalculationError("Expense amount cannot be negative.");
  }

  // Work in whole rupee units (rounded off to 0 decimal places, no fractions)
  const amountRupees = Math.round(amountMinor / 100);
  const sortedIds = [...participantIds].sort();
  const count = sortedIds.length;
  const baseRupees = Math.floor(amountRupees / count);
  let remainderRupees = amountRupees % count;

  return sortedIds.map((participantId) => {
    let extraRupees = 0;
    if (remainderRupees > 0) {
      extraRupees = 1;
      remainderRupees--;
    }
    return {
      participantId,
      amountMinor: (baseRupees + extraRupees) * 100,
    };
  });
}

/**
 * Calculates percentage-based splits in whole rupees.
 * Handles minor rounding divergences (e.g., 33.33% x 3 = 99.99%) gracefully.
 */
export function calculatePercentageSplit(
  amountMinor: MoneyMinor,
  allocations: { participantId: string; percentageBps: number }[]
): SplitAllocation[] {
  if (allocations.length === 0) {
    throw new SplitCalculationError("Cannot split expense with empty allocations.");
  }
  if (amountMinor < 0) {
    throw new SplitCalculationError("Expense amount cannot be negative.");
  }

  const totalBps = allocations.reduce((sum, item) => sum + item.percentageBps, 0);
  if (totalBps <= 0) {
    throw new SplitCalculationError("Percentage allocations sum must be greater than 0.");
  }

  const amountRupees = Math.round(amountMinor / 100);
  const sortedAllocations = [...allocations].sort((a, b) => a.participantId.localeCompare(b.participantId));

  let allocatedRupeesTotal = 0;
  const resultRupees = sortedAllocations.map((item) => {
    const rawRupees = Math.floor((amountRupees * item.percentageBps) / totalBps);
    allocatedRupeesTotal += rawRupees;
    return {
      participantId: item.participantId,
      rupees: rawRupees,
      percentageBps: item.percentageBps,
    };
  });

  let remainderRupees = amountRupees - allocatedRupeesTotal;
  if (remainderRupees > 0) {
    // Distribute remainder rupees (1 rupee = 100 minor units at a time) to highest percentage allocations
    const byBps = [...resultRupees].sort(
      (a, b) => b.percentageBps - a.percentageBps || a.participantId.localeCompare(b.participantId)
    );
    for (let i = 0; i < remainderRupees; i++) {
      const target = byBps[i % byBps.length];
      const resItem = resultRupees.find((r) => r.participantId === target.participantId);
      if (resItem) {
        resItem.rupees += 1;
      }
    }
  }

  return resultRupees.map(({ participantId, rupees }) => ({
    participantId,
    amountMinor: rupees * 100,
  }));
}

/**
 * Calculates share-based splits in whole rupees (e.g. 2 shares vs 1 share).
 */
export function calculateShareSplit(
  amountMinor: MoneyMinor,
  allocations: { participantId: string; shares: number }[]
): SplitAllocation[] {
  if (allocations.length === 0) {
    throw new SplitCalculationError("Cannot split expense with empty allocations.");
  }
  if (amountMinor < 0) {
    throw new SplitCalculationError("Expense amount cannot be negative.");
  }

  const totalShares = allocations.reduce((sum, item) => sum + item.shares, 0);
  if (totalShares <= 0) {
    throw new SplitCalculationError("Total shares must be greater than 0.");
  }

  const amountRupees = Math.round(amountMinor / 100);
  const sortedAllocations = [...allocations].sort((a, b) => a.participantId.localeCompare(b.participantId));
  let allocatedRupeesTotal = 0;

  const resultRupees = sortedAllocations.map((item) => {
    if (item.shares < 0) {
      throw new SplitCalculationError("Participant shares cannot be negative.");
    }
    const rawRupees = Math.floor((amountRupees * item.shares) / totalShares);
    allocatedRupeesTotal += rawRupees;
    return {
      participantId: item.participantId,
      rupees: rawRupees,
      shares: item.shares,
    };
  });

  let remainderRupees = amountRupees - allocatedRupeesTotal;
  if (remainderRupees > 0) {
    // Distribute remainder rupees to participants with higher shares first
    const byShares = [...resultRupees].sort(
      (a, b) => b.shares - a.shares || a.participantId.localeCompare(b.participantId)
    );
    for (let i = 0; i < remainderRupees; i++) {
      const target = byShares[i % byShares.length];
      const resItem = resultRupees.find((r) => r.participantId === target.participantId);
      if (resItem) {
        resItem.rupees += 1;
      }
    }
  }

  return resultRupees.map(({ participantId, rupees }) => ({
    participantId,
    amountMinor: rupees * 100,
  }));
}

/**
 * Validates and processes custom exact amount splits in whole rupees.
 */
export function calculateCustomSplit(
  amountMinor: MoneyMinor,
  allocations: { participantId: string; amountMinor: MoneyMinor }[]
): SplitAllocation[] {
  if (allocations.length === 0) {
    throw new SplitCalculationError("Cannot split expense with empty allocations.");
  }
  if (amountMinor < 0) {
    throw new SplitCalculationError("Expense amount cannot be negative.");
  }

  const roundedAllocations = allocations.map((item) => {
    if (item.amountMinor < 0) {
      throw new SplitCalculationError("Custom allocation amount cannot be negative.");
    }
    return {
      participantId: item.participantId,
      amountMinor: Math.round(item.amountMinor / 100) * 100,
    };
  });

  const targetAmount = Math.round(amountMinor / 100) * 100;
  const totalAllocated = roundedAllocations.reduce((sum, item) => sum + item.amountMinor, 0);

  if (totalAllocated !== targetAmount) {
    const diff = targetAmount - totalAllocated;
    if (Math.abs(diff) <= 500 && roundedAllocations.length > 0) {
      roundedAllocations[0].amountMinor += diff;
    } else {
      throw new SplitCalculationError(
        `Custom allocations sum (₹${Math.round(totalAllocated / 100)}) does not match expense amount (₹${Math.round(targetAmount / 100)}). Difference: ₹${Math.round(diff / 100)}.`
      );
    }
  }

  return roundedAllocations;
}

/**
 * Main dispatcher to calculate split allocations for any given expense split method.
 */
export function calculateSplitAllocations(
  amountMinor: MoneyMinor,
  split: ExpenseSplit
): SplitAllocation[] {
  switch (split.method) {
    case "equal":
      return calculateEqualSplit(amountMinor, split.participantIds);
    case "percentage":
      return calculatePercentageSplit(amountMinor, split.allocations);
    case "share":
      return calculateShareSplit(amountMinor, split.allocations);
    case "custom":
      return calculateCustomSplit(amountMinor, split.allocations);
    default:
      throw new SplitCalculationError("Unknown split method.");
  }
}

