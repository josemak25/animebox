/**
 * Generate a simple checksum for string content to detect changes.
 * Uses a basic hashCode algorithm (not cryptographically secure, but fast for change detection)
 *
 * @param {string} str - The string to hash (e.g., HTML)
 * @returns {string} The checksum as a string
 *
 * @example
 * getChecksum('<html>...</html>') // "123456789"
 */
export function getChecksum(str: string): string {
  let hash = 0;
  if (!str) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

/**
 * Splits an array into batches (chunks) of a specified size.
 *
 * @template T
 * @param {T[]} array - The array to split into batches
 * @param {number} size - The maximum size of each batch
 * @returns {T[][]} An array of batches (arrays)
 *
 * @example
 * batch([1,2,3,4,5], 2) // [[1,2],[3,4],[5]]
 */
export function batch<T>(array: T[], size: number): T[][] {
  if (!Array.isArray(array)) {
    throw new TypeError("Input must be an array");
  }
  if (typeof size !== "number" || size <= 0) {
    throw new RangeError("Size must be a positive number");
  }
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Check if value is not null or undefined
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if value is empty (null, undefined, empty string, or empty array)
 */
export function isEmpty(
  value:
    | number
    | string
    | null
    | boolean
    | undefined
    | unknown[]
    | Record<string, unknown>
): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  const cloned: Record<string, unknown> = {};
  for (const key in obj as object) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned as T;
}

/**
 * Get nested object property safely
 */
export function safeGet<T>(
  obj: Record<string, unknown> | null | undefined,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== "object") {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result === undefined ? defaultValue : (result as T);
}

/**
 * Check if value is a function
 */
export function isFunction<T extends (...args: unknown[]) => unknown>(
  value: unknown
): value is T {
  return typeof value === "function";
}

/**
 * A no-operation function that does nothing
 */
export function noop(): void {
  // Intentionally empty
}
