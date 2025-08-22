import { formatDate, getRelativeTime, isToday, isYesterday } from "../date";

describe("Date Utilities", () => {
  describe("formatDate", () => {
    it("should format date with default options", () => {
      const date = new Date("2023-12-25");
      const result = formatDate(date);
      expect(result).toContain("December");
      expect(result).toContain("25");
      expect(result).toContain("2023");
    });

    it("should format date with custom options", () => {
      const date = new Date("2023-12-25");
      const options: Intl.DateTimeFormatOptions = {
        year: "2-digit",
        month: "short",
        day: "numeric",
      };
      const result = formatDate(date, options);
      expect(result).toContain("Dec");
      expect(result).toContain("25");
      expect(result).toContain("23");
    });

    it("should handle different date formats", () => {
      const date = new Date(2023, 0, 1); // January 1, 2023
      const result = formatDate(date);
      expect(result).toContain("January");
      expect(result).toContain("1");
      expect(result).toContain("2023");
    });
  });

  describe("getRelativeTime", () => {
    beforeAll(() => {
      // Mock the current time to make tests predictable
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-12-25T12:00:00Z"));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return 'just now' for very recent dates", () => {
      const date = new Date("2023-12-25T11:59:30Z"); // 30 seconds ago
      expect(getRelativeTime(date)).toBe("just now");
    });

    it("should return 'in a moment' for very near future dates", () => {
      const date = new Date("2023-12-25T12:00:30Z"); // 30 seconds from now
      expect(getRelativeTime(date)).toBe("in a moment");
    });

    it("should return minutes ago for recent past", () => {
      const date = new Date("2023-12-25T11:55:00Z"); // 5 minutes ago
      expect(getRelativeTime(date)).toBe("5 minutes ago");
    });

    it("should return singular minute for 1 minute", () => {
      const date = new Date("2023-12-25T11:59:00Z"); // 1 minute ago
      expect(getRelativeTime(date)).toBe("1 minute ago");
    });

    it("should return hours ago for longer past", () => {
      const date = new Date("2023-12-25T09:00:00Z"); // 3 hours ago
      expect(getRelativeTime(date)).toBe("3 hours ago");
    });

    it("should return singular hour for 1 hour", () => {
      const date = new Date("2023-12-25T11:00:00Z"); // 1 hour ago
      expect(getRelativeTime(date)).toBe("1 hour ago");
    });

    it("should return days ago for older dates", () => {
      const date = new Date("2023-12-22T12:00:00Z"); // 3 days ago
      expect(getRelativeTime(date)).toBe("3 days ago");
    });

    it("should return singular day for 1 day", () => {
      const date = new Date("2023-12-24T12:00:00Z"); // 1 day ago
      expect(getRelativeTime(date)).toBe("1 day ago");
    });

    it("should handle future dates with minutes", () => {
      const date = new Date("2023-12-25T12:05:00Z"); // 5 minutes from now
      expect(getRelativeTime(date)).toBe("in 5 minutes");
    });

    it("should handle future dates with hours", () => {
      const date = new Date("2023-12-25T15:00:00Z"); // 3 hours from now
      expect(getRelativeTime(date)).toBe("in 3 hours");
    });

    it("should handle future dates with days", () => {
      const date = new Date("2023-12-28T12:00:00Z"); // 3 days from now
      expect(getRelativeTime(date)).toBe("in 3 days");
    });
  });

  describe("isToday", () => {
    beforeAll(() => {
      // Mock the current time
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-12-25T12:00:00"));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return true for today's date", () => {
      const date = new Date("2023-12-25T08:00:00");
      expect(isToday(date)).toBe(true);
    });

    it("should return true for today's date at different time", () => {
      const date = new Date("2023-12-25T23:59:59");
      expect(isToday(date)).toBe(true);
    });

    it("should return false for yesterday's date", () => {
      const date = new Date("2023-12-24T12:00:00");
      expect(isToday(date)).toBe(false);
    });

    it("should return false for tomorrow's date", () => {
      const date = new Date("2023-12-26T12:00:00");
      expect(isToday(date)).toBe(false);
    });
  });

  describe("isYesterday", () => {
    beforeAll(() => {
      // Mock the current time
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-12-25T12:00:00"));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return true for yesterday's date", () => {
      const date = new Date("2023-12-24T12:00:00");
      expect(isYesterday(date)).toBe(true);
    });

    it("should return true for yesterday at different time", () => {
      const date = new Date("2023-12-24T23:59:59");
      expect(isYesterday(date)).toBe(true);
    });

    it("should return false for today's date", () => {
      const date = new Date("2023-12-25T12:00:00");
      expect(isYesterday(date)).toBe(false);
    });

    it("should return false for two days ago", () => {
      const date = new Date("2023-12-23T12:00:00");
      expect(isYesterday(date)).toBe(false);
    });
  });
});
