import {
  deepClone,
  isEmpty,
  isFunction,
  isNotNullish,
  noop,
  safeGet,
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

  describe("deepClone", () => {
    it("should clone primitive values", () => {
      expect(deepClone("hello")).toBe("hello");
      expect(deepClone(42)).toBe(42);
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it("should clone dates", () => {
      const date = new Date("2023-12-25");
      const cloned = deepClone(date);
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });

    it("should clone arrays", () => {
      const arr = [1, 2, [3, 4], { a: 5 }];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
      expect(cloned[3]).not.toBe(arr[3]);
    });

    it("should clone objects", () => {
      const obj = {
        name: "test",
        nested: { value: 42 },
        items: [1, 2, 3],
      };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.nested).not.toBe(obj.nested);
      expect(cloned.items).not.toBe(obj.items);
    });

    it("should handle circular references gracefully", () => {
      const obj: { name: string; self?: unknown } = { name: "test" };
      obj.self = obj;
      // This would cause infinite recursion, so we expect the function to handle it
      // Note: Our current implementation doesn't handle circular refs, so this test documents the limitation
      expect(() => deepClone(obj)).toThrow();
    });
  });

  describe("safeGet", () => {
    const testObj = {
      user: {
        profile: {
          name: "John",
          age: 30,
        },
        preferences: {
          theme: "dark",
        },
      },
      items: [1, 2, 3],
    };

    it("should get nested properties safely", () => {
      expect(safeGet(testObj, "user.profile.name")).toBe("John");
      expect(safeGet(testObj, "user.profile.age")).toBe(30);
      expect(safeGet(testObj, "user.preferences.theme")).toBe("dark");
    });

    it("should return undefined for non-existent paths", () => {
      expect(safeGet(testObj, "user.profile.email")).toBeUndefined();
      expect(safeGet(testObj, "nonexistent.path")).toBeUndefined();
    });

    it("should return default value when path doesn't exist", () => {
      expect(safeGet(testObj, "user.profile.email", "default@email.com")).toBe(
        "default@email.com"
      );
      expect(safeGet(testObj, "nonexistent.path", "default")).toBe("default");
    });

    it("should handle null/undefined objects", () => {
      expect(safeGet(null, "some.path", "default")).toBe("default");
      expect(safeGet(undefined, "some.path", "default")).toBe("default");
    });

    it("should handle single-level properties", () => {
      expect(safeGet(testObj, "items")).toEqual([1, 2, 3]);
    });

    it("should handle empty path", () => {
      expect(safeGet(testObj, "")).toBeUndefined();
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
});
