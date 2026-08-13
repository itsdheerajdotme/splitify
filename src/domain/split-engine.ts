import { ExpenseSplit, MoneyMinor, SplitAllocation } from "./types";

export class SplitCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SplitCalculationError";
  }
}

/**
 * Calculates equal splits among participants with deterministic remainder distribution.
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

  // Sort participant IDs deterministically to ensure stable remainder distribution
  const sortedIds = [...participantIds].sort();
  const count = sortedIds.length;
  const baseShare = Math.floor(amountMinor / count);
  let remainder = amountMinor % count;

  return sortedIds.map((participantId) => {
    let extra = 0;
    if (remainder > 0) {
      extra = 1;
      remainder--;
    }
    return {
      participantId,
      amountMinor: baseShare + extra,
    };
  });
}

/**
 * Calculates percentage-based splits. Percentage allocations must sum to 10,000 basis points (100.00%).
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
  if (totalBps !== 10000) {
    throw new SplitCalculationError(
      `Percentage split allocations must sum to 100% (10,000 bps). Got ${(totalBps / 100).toFixed(2)}%.`
    );
  }

  const sortedAllocations = [...allocations].sort((a, b) => a.participantId.localeCompare(b.participantId));
  let allocatedTotal = 0;

  const result = sortedAllocations.map((item) => {
    const rawAmount = Math.floor((amountMinor * item.percentageBps) / 10000);
    allocatedTotal += rawAmount;
    return {
      participantId: item.participantId,
      amountMinor: rawAmount,
      percentageBps: item.percentageBps,
    };
  });

  let remainder = amountMinor - allocatedTotal;
  if (remainder > 0) {
    // Distribute remainder one minor unit at a time to highest percentage allocations
    const byBps = [...result].sort((a, b) => b.percentageBps - a.percentageBps || a.participantId.localeCompare(b.participantId));
    for (let i = 0; i < remainder; i++) {
      const target = byBps[i % byBps.length];
      const resItem = result.find((r) => r.participantId === target.participantId);
      if (resItem) {
        resItem.amountMinor += 1;
      }
    }
  }

  return result.map(({ participantId, amountMinor }) => ({ participantId, amountMinor }));
}

/**
 * Calculates share-based splits (e.g. 2 shares vs 1 share).
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

  const sortedAllocations = [...allocations].sort((a, b) => a.participantId.localeCompare(b.participantId));
  let allocatedTotal = 0;

  const result = sortedAllocations.map((item) => {
    if (item.shares < 0) {
      throw new SplitCalculationError("Participant shares cannot be negative.");
    }
    const rawAmount = Math.floor((amountMinor * item.shares) / totalShares);
    allocatedTotal += rawAmount;
    return {
      participantId: item.participantId,
      amountMinor: rawAmount,
      shares: item.shares,
    };
  });

  let remainder = amountMinor - allocatedTotal;
  if (remainder > 0) {
    // Distribute remainder to participants with higher shares first
    const byShares = [...result].sort((a, b) => b.shares - a.shares || a.participantId.localeCompare(b.participantId));
    for (let i = 0; i < remainder; i++) {
      const target = byShares[i % byShares.length];
      const resItem = result.find((r) => r.participantId === target.participantId);
      if (resItem) {
        resItem.amountMinor += 1;
      }
    }
  }

  return result.map(({ participantId, amountMinor }) => ({ participantId, amountMinor }));
}

/**
 * Validates and processes custom exact amount splits.
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

  const totalAllocated = allocations.reduce((sum, item) => sum + item.amountMinor, 0);
  if (totalAllocated !== amountMinor) {
    const diff = amountMinor - totalAllocated;
    throw new SplitCalculationError(
      `Custom allocations sum (${totalAllocated}) does not match expense amount (${amountMinor}). Difference: ${diff}.`
    );
  }

  return allocations.map((item) => {
    if (item.amountMinor < 0) {
      throw new SplitCalculationError("Custom allocation amount cannot be negative.");
    }
    return {
      participantId: item.participantId,
      amountMinor: item.amountMinor,
    };
  });
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
