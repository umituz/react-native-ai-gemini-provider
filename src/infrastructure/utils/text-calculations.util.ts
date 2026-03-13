/**
 * Text Calculation Utilities
 * Reusable functions for text length and character budget calculations
 */

/**
 * Calculate total character count in an array of text objects
 * @param items - Array of objects with text content
 * @param getText - Function to extract text from each item
 * @returns Total character count
 */
export function calculateTotalChars<T>(
  items: readonly T[],
  getItemLength: (item: T) => number
): number {
  return items.reduce((sum, item) => sum + getItemLength(item), 0);
}

/**
 * Check if adding an item would exceed the character budget
 * @param currentTotal - Current total character count
 * @param itemLength - Length of item to add
 * @param maxBudget - Maximum allowed budget
 * @returns true if within budget, false otherwise
 */
export function fitsWithinBudget(
  currentTotal: number,
  itemLength: number,
  maxBudget: number
): boolean {
  return currentTotal + itemLength <= maxBudget;
}

/**
 * Trim array to fit within character budget while keeping minimum items
 * Keeps the last `minItems` regardless of budget, then adds as many as possible from the end
 *
 * @param items - Array to trim
 * @param getItemLength - Function to get length of each item
 * @param maxBudget - Maximum total length allowed
 * @param minItems - Minimum number of items to keep (from the end)
 * @returns Trimmed array
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
