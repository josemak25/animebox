import {
  noop,
  omit,
  isEmpty,
  isFunction,
  isNotNullish,
  isDeepEqual,
} from "../common";

describe("Common Utilities", () => {
  describe("isNotNullish", () => {
    it("should return true for non-null/undefined values", () => {
      expect(isNotNullish("hello")).toBe(true);
      expect(isNotNullish(0)).toBe(true);
      expect(isNotNullish(false)).toBe(true);
      expect(isNotNullish([])).toBe(true);
      expect(isNotNullish({})).toBe(true);
    });

    it("should return false for null and undefined", () => {
      expect(isNotNullish(null)).toBe(false);
      expect(isNotNullish(undefined)).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("should return true for empty values", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it("should return false for non-empty values", () => {
      expect(isEmpty("hello")).toBe(false);
      expect(isEmpty("0")).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: "value" })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe("isFunction", () => {
    it("should return true for functions", () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function test() {})).toBe(true);
      expect(isFunction(Array.prototype.map)).toBe(true);
    });

    it("should return false for non-functions", () => {
      expect(isFunction("hello")).toBe(false);
      expect(isFunction(42)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });

  describe("noop", () => {
    it("should be a function", () => {
      expect(typeof noop).toBe("function");
    });

    it("should return undefined", () => {
      expect(noop()).toBeUndefined();
    });

    it("should not throw when called", () => {
      expect(() => noop()).not.toThrow();
    });
  });

  describe("isDeepEqual", () => {
    it("should return true for deeply equal objects", () => {
      expect(isDeepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(
        true
      );
      expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isDeepEqual(42, 42)).toBe(true);
      expect(isDeepEqual("test", "test")).toBe(true);
    });

    it("should return false for different objects", () => {
      expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isDeepEqual([1, 2], [2, 1])).toBe(false);
      expect(isDeepEqual(null, undefined)).toBe(false);
      expect(isDeepEqual([1, 2, 3], [1, 2])).toBe(false);
    });
  });

  describe("omit", () => {
    it("should omit a single key from an object", () => {
      expect(omit({ a: 1, b: 2, c: 3 }, "b")).toEqual({ a: 1, c: 3 });
    });

    it("should omit multiple keys from an object", () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ["b", "c"])).toEqual({ a: 1 });
    });

    it("should handle empty keys array", () => {
      expect(omit({ a: 1, b: 2 }, [])).toEqual({ a: 1, b: 2 });
    });
  });
});
