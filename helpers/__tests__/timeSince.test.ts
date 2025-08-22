import dayjs from "dayjs";

import { dayjsTimeSince } from "../timeSince";

// Extend dayjs with the plugin
dayjs.extend(dayjsTimeSince);

describe("timeSince plugin", () => {
  beforeAll(() => {
    // Extend dayjs with our custom plugin
    dayjs.extend(dayjsTimeSince);
  });

  it("should be defined", () => {
    expect(dayjsTimeSince).toBeDefined();
    expect(typeof dayjsTimeSince).toBe("function");
  });

  it("should extend dayjs with timeSince method", () => {
    expect(dayjs.timeSince).toBeDefined();
    expect(typeof dayjs.timeSince).toBe("function");
  });

  it("should return time since for a past date", () => {
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const result = dayjs.timeSince(pastDate);

    expect(typeof result).toBe("string");
    expect(result).toMatch(/ago$/); // Should end with "ago"
  });

  it("should return time since for current date", () => {
    const now = new Date();
    const result = dayjs.timeSince(now);

    expect(typeof result).toBe("string");
    expect(result).toMatch(/second|minute|hour|day|month|year/); // Should contain time units
  });

  it("should handle different date formats", () => {
    // Test with ISO string
    const isoDate = "2024-01-01T00:00:00.000Z";
    const result1 = dayjs.timeSince(isoDate);
    expect(typeof result1).toBe("string");

    // Test with timestamp
    const timestamp = Date.now() - 24 * 60 * 60 * 1000; // 1 day ago
    const result2 = dayjs.timeSince(timestamp);
    expect(typeof result2).toBe("string");
    expect(result2).toMatch(/ago$/);
  });

  it("should handle edge cases gracefully", () => {
    // Test with undefined (should handle gracefully)
    expect(() => dayjs.timeSince(undefined)).not.toThrow();

    // Test with null (should handle gracefully)
    expect(() => dayjs.timeSince(null)).not.toThrow();

    // Test with empty string (should handle gracefully)
    expect(() => dayjs.timeSince("")).not.toThrow();
  });

  it("should return consistent format", () => {
    const testDate = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
    const result = dayjs.timeSince(testDate);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
