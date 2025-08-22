import { adjustColorBrightness, hexToRGB } from "../color";

describe("Color Utilities", () => {
  describe("hexToRGB", () => {
    it("should convert hex to RGB", () => {
      expect(hexToRGB("#ffffff")).toBe("rgb(255,255,255)");
      expect(hexToRGB("#000000")).toBe("rgb(0,0,0)");
      expect(hexToRGB("#ff0000")).toBe("rgb(255,0,0)");
    });

    it("should convert hex to RGBA with alpha", () => {
      expect(hexToRGB("#ffffff", 0.5)).toBe("rgba(255,255,255,0.5)");
      expect(hexToRGB("#000000", 1)).toBe("rgba(0,0,0,1)");
      expect(hexToRGB("#ff0000", 0.25)).toBe("rgba(255,0,0,0.25)");
    });

    it("should handle hex colors without #", () => {
      expect(hexToRGB("ffffff")).toBe("rgb(255,255,255)");
      expect(hexToRGB("ff0000")).toBe("rgb(255,0,0)");
    });

    it("should handle lowercase hex colors", () => {
      expect(hexToRGB("#abcdef")).toBe("rgb(171,205,239)");
    });

    it("should handle mixed case hex colors", () => {
      expect(hexToRGB("#AbCdEf")).toBe("rgb(171,205,239)");
    });
  });

  describe("adjustColorBrightness", () => {
    it("should make colors lighter with factor > 1", () => {
      const result = adjustColorBrightness("#808080", 1.5);
      expect(result).toBe("#C0C0C0");
    });

    it("should make colors darker with factor < 1", () => {
      const result = adjustColorBrightness("#808080", 0.5);
      expect(result).toBe("#404040");
    });

    it("should return the same color with factor = 1", () => {
      const result = adjustColorBrightness("#808080", 1);
      expect(result).toBe("#808080");
    });

    it("should handle white color", () => {
      const result = adjustColorBrightness("#FFFFFF", 0.5);
      expect(result).toBe("#808080");
    });

    it("should handle black color", () => {
      const result = adjustColorBrightness("#000000", 2);
      expect(result).toBe("#000000");
    });

    it("should clamp values to valid range", () => {
      const result = adjustColorBrightness("#FFFFFF", 2);
      expect(result).toBe("#FFFFFF");
    });

    it("should handle hex colors without #", () => {
      const result = adjustColorBrightness("808080", 1.5);
      expect(result).toBe("#C0C0C0");
    });

    it("should throw error for invalid hex colors", () => {
      expect(() => adjustColorBrightness("invalid", 1)).toThrow(
        "Input must be a valid 6-character hex color."
      );
      expect(() => adjustColorBrightness("#fff", 1)).toThrow(
        "Input must be a valid 6-character hex color."
      );
    });

    it("should handle extreme brightness adjustments", () => {
      const result1 = adjustColorBrightness("#808080", 10);
      expect(result1).toBe("#FFFFFF");

      const result2 = adjustColorBrightness("#808080", 0.01);
      expect(result2).toBe("#010101");
    });

    it("should preserve hex format", () => {
      const result = adjustColorBrightness("#123456", 1.2);
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });
  });
});
