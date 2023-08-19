/**
 * Returns the value restricted by given min and max values.
 * @param min Minimum value
 * @param max Maximum value
 * @param value Input value
 * @returns Input between min and max
 */
export function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}
