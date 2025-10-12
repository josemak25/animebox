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
    | null
    | boolean
    | undefined
    | unknown[]
    | PropertyKey
    | Record<string, unknown>
): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
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

/**
 * Deep equality check between two values
 *
 * @param {unknown} a - First value to compare
 * @param {unknown} b - Second value to compare
 * @returns {boolean} True if values are deeply equal, false otherwise
 *
 * @example
 * isDeepEqual({a:1, b:{c:2}}, {a:1, b:{c:2}}) // true
 * isDeepEqual([1,2,3], [1,2,3]) // true
 * isDeepEqual(42, 42) // true
 * isDeepEqual(null, undefined) // false
 * isDeepEqual({a:1}, {a:1, b:2}) // false
 * isDeepEqual({a:1}, {a:2}) // false
 * isDeepEqual([1,2], [2,1]) // false
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object" || a === null || b === null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false;
    if (
      !isDeepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    ) {
      return false;
    }
  }

  return true;
}

/**
 *
 * @param obj
 * @param keys
 * @returns Omit<T, K>
 *
 * @example
 * omit({a:1, b:2, c:3}, ['b', 'c']) // {a:1}
 * omit({name: 'Alice', age: 30, city: 'Wonderland'}, ['age']) // {name: 'Alice', city: 'Wonderland'}
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K | K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of Array.isArray(keys) ? keys : [keys]) {
    delete result[key];
  }
  return result;
}
