import { generateShortId, generateTimestampId, generateUUID } from "../uuid";

describe("UUID Utilities", () => {
  describe("generateUUID", () => {
    it("should generate a valid UUID format", () => {
      const uuid = generateUUID();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it("should generate unique UUIDs", () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it("should always have version 4 marker", () => {
      const uuid = generateUUID();
      expect(uuid.charAt(14)).toBe("4");
    });

    it("should have correct variant bits", () => {
      const uuid = generateUUID();
      const variantChar = uuid.charAt(19);
      expect(["8", "9", "a", "b"].includes(variantChar.toLowerCase())).toBe(
        true
      );
    });
  });

  describe("generateShortId", () => {
    it("should generate ID with default length of 8", () => {
      const shortId = generateShortId();
      expect(shortId).toHaveLength(8);
    });

    it("should generate ID with custom length", () => {
      const shortId = generateShortId(12);
      expect(shortId).toHaveLength(12);
    });

    it("should only contain alphanumeric characters", () => {
      const shortId = generateShortId(20);
      const alphanumericRegex = /^[A-Za-z0-9]+$/;
      expect(shortId).toMatch(alphanumericRegex);
    });

    it("should generate unique short IDs", () => {
      const id1 = generateShortId();
      const id2 = generateShortId();
      expect(id1).not.toBe(id2);
    });

    it("should handle zero length", () => {
      const shortId = generateShortId(0);
      expect(shortId).toBe("");
    });
  });

  describe("generateTimestampId", () => {
    it("should start with a timestamp", () => {
      const timestampId = generateTimestampId();
      const parts = timestampId.split("-");
      const timestamp = parseInt(parts[0]);
      expect(timestamp).toBeGreaterThan(0);
      expect(timestamp.toString()).toBe(parts[0]);
    });

    it("should have the correct format", () => {
      const timestampId = generateTimestampId();
      const formatRegex = /^\d+-[a-z0-9]{9}$/;
      expect(timestampId).toMatch(formatRegex);
    });

    it("should generate unique timestamp IDs", () => {
      const id1 = generateTimestampId();
      const id2 = generateTimestampId();
      expect(id1).not.toBe(id2);
    });

    it("should have increasing timestamps when generated in sequence", () => {
      const id1 = generateTimestampId();
      const id2 = generateTimestampId();
      const timestamp1 = parseInt(id1.split("-")[0]);
      const timestamp2 = parseInt(id2.split("-")[0]);
      expect(timestamp2).toBeGreaterThanOrEqual(timestamp1);
    });
  });
});
