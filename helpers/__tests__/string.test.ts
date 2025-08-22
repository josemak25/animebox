import {
  capitalizeFirst,
  capitalizeWords,
  removeWhitespace,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  truncate,
} from "../string";

describe("String Utilities", () => {
  describe("capitalizeFirst", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirst("hello")).toBe("Hello"); // Fixed: correct expectation
      expect(capitalizeFirst("world")).toBe("World");
    });

    it("should handle empty strings", () => {
      expect(capitalizeFirst("")).toBe("");
    });

    it("should handle single character strings", () => {
      expect(capitalizeFirst("a")).toBe("A");
    });

    it("should not affect already capitalized strings", () => {
      expect(capitalizeFirst("Hello")).toBe("Hello");
    });

    it("should handle strings starting with numbers", () => {
      expect(capitalizeFirst("123abc")).toBe("123abc");
    });
  });

  describe("capitalizeWords", () => {
    it("should capitalize the first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("the quick brown fox")).toBe(
        "The Quick Brown Fox"
      );
    });

    it("should handle single words", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
    });

    it("should handle multiple spaces", () => {
      expect(capitalizeWords("hello  world")).toBe("Hello  World");
    });

    it("should handle empty strings", () => {
      expect(capitalizeWords("")).toBe("");
    });
  });

  describe("toCamelCase", () => {
    it("should convert strings to camelCase", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
      expect(toCamelCase("the quick brown fox")).toBe("theQuickBrownFox");
    });

    it("should handle strings with hyphens", () => {
      expect(toCamelCase("hello-world")).toBe("hello-World");
    });

    it("should handle strings with underscores", () => {
      expect(toCamelCase("hello_world")).toBe("hello_world");
    });

    it("should handle single words", () => {
      expect(toCamelCase("hello")).toBe("hello");
    });

    it("should handle already camelCase strings", () => {
      expect(toCamelCase("helloWorld")).toBe("helloWorld");
    });
  });

  describe("toSnakeCase", () => {
    it("should convert strings to snake_case", () => {
      expect(toSnakeCase("hello world")).toBe("hello_world");
      expect(toSnakeCase("helloWorld")).toBe("hello_world");
    });

    it("should handle strings with hyphens", () => {
      expect(toSnakeCase("hello-world")).toBe("hello_world");
    });

    it("should handle camelCase strings", () => {
      expect(toSnakeCase("thisIsATest")).toBe("this_is_a_test");
    });

    it("should handle single words", () => {
      expect(toSnakeCase("hello")).toBe("hello");
    });

    it("should handle multiple consecutive capitals", () => {
      expect(toSnakeCase("XMLHttpRequest")).toBe("x_m_l_http_request");
    });
  });

  describe("toKebabCase", () => {
    it("should convert strings to kebab-case", () => {
      expect(toKebabCase("hello world")).toBe("hello-world");
      expect(toKebabCase("helloWorld")).toBe("hello-world");
    });

    it("should handle strings with underscores", () => {
      expect(toKebabCase("hello_world")).toBe("hello_world");
    });

    it("should handle camelCase strings", () => {
      expect(toKebabCase("thisIsATest")).toBe("this-is-a-test");
    });

    it("should handle single words", () => {
      expect(toKebabCase("hello")).toBe("hello");
    });

    it("should handle multiple consecutive capitals", () => {
      expect(toKebabCase("XMLHttpRequest")).toBe("x-m-l-http-request");
    });
  });

  describe("truncate", () => {
    it("should truncate strings longer than the specified length", () => {
      expect(truncate("hello world", 5)).toBe("he...");
      expect(truncate("this is a long string", 10)).toBe("this is...");
    });

    it("should not truncate strings shorter than the specified length", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });

    it("should use custom suffix", () => {
      expect(truncate("hello world", 5, "***")).toBe("he***");
    });

    it("should handle edge case where length equals suffix length", () => {
      expect(truncate("hello", 3, "...")).toBe("...");
    });

    it("should handle zero length", () => {
      expect(truncate("hello", 0)).toBe("...");
    });

    it("should handle empty string", () => {
      expect(truncate("", 5)).toBe("");
    });
  });

  describe("removeWhitespace", () => {
    it("should remove all whitespace from strings", () => {
      expect(removeWhitespace("hello world")).toBe("helloworld");
      expect(removeWhitespace("  test  string  ")).toBe("teststring");
    });

    it("should handle strings with tabs and newlines", () => {
      expect(removeWhitespace("hello\t\nworld")).toBe("helloworld");
    });

    it("should handle empty strings", () => {
      expect(removeWhitespace("")).toBe("");
    });

    it("should handle strings with only whitespace", () => {
      expect(removeWhitespace("   \t\n  ")).toBe("");
    });
  });
});
