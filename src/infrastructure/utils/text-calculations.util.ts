/**
 * Text Calculation Utilities
 * Reusable functions for text length and character budget calculations
 */

function calculateTotalChars<T>(
  items: readonly T[],
  getItemLength: (item: T) => number
): number {
  return items.reduce((sum, item) => sum + getItemLength(item), 0);
}

function fitsWithinBudget(
  currentTotal: number,
  itemLength: number,
  maxBudget: number
): boolean {
  return currentTotal + itemLength <= maxBudget;
}

/**
 * Trim array to fit within character budget while keeping minimum items
 * Keeps the last `minItems` regardless of budget, then adds as many as possible from the end
 */
export function trimArrayByCharBudget<T>(
  items: readonly T[],
  getItemLength: (item: T) => number,
  maxBudget: number,
  minItems: number
): T[] {
  if (items.length <= minItems) return [...items];

  // First, guarantee minimum items (from the end)
  const guaranteedMin = items.slice(-minItems);
  const remaining = items.slice(0, -minItems);

  // Calculate current total
  let totalChars = calculateTotalChars(guaranteedMin, getItemLength);
  const trimmed: T[] = [...guaranteedMin];

  // Add older items in reverse order until budget is exceeded
  for (let i = remaining.length - 1; i >= 0; i--) {
    const itemLength = getItemLength(remaining[i]);
    if (!fitsWithinBudget(totalChars, itemLength, maxBudget)) break;

    trimmed.unshift(remaining[i]);
    totalChars += itemLength;
  }

  return trimmed;
}
