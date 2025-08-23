import { reportError } from "../reportError";

// Mock console.error to track calls
const mockConsoleError = jest.fn();
// eslint-disable-next-line no-console
const originalConsoleError = console.error;

// Mock __DEV__ global
interface DevGlobal {
  __DEV__?: boolean;
}

const originalDev = (globalThis as DevGlobal).__DEV__;

describe("reportError", () => {
  beforeEach(() => {
    mockConsoleError.mockClear();
    // eslint-disable-next-line no-console
    console.error = mockConsoleError;
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = originalConsoleError;
    (globalThis as DevGlobal).__DEV__ = originalDev;
  });

  describe("in development mode", () => {
    beforeEach(() => {
      (globalThis as DevGlobal).__DEV__ = true;
    });

    it("should log Error objects to console in development", () => {
      const testError = new Error("Test error message");

      reportError(testError);

      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Reported Error to our external service:",
        testError
      );
    });

    it("should log string errors to console in development", () => {
      const testErrorMessage = "String error message";

      reportError(testErrorMessage);

      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Reported Error to our external service:",
        testErrorMessage
      );
    });

    it("should handle complex Error objects with stack traces", () => {
      const testError = new TypeError("Type error occurred");
      testError.stack = "Error stack trace here";

      reportError(testError);

      expect(mockConsoleError).toHaveBeenCalledWith(
        "Reported Error to our external service:",
        testError
      );
    });

    it("should handle empty string errors", () => {
      reportError("");

      expect(mockConsoleError).toHaveBeenCalledWith(
        "Reported Error to our external service:",
        ""
      );
    });

    it("should handle custom Error classes", () => {
      class CustomError extends Error {
        constructor(
          message: string,
          public code: number
        ) {
          super(message);
          this.name = "CustomError";
        }
      }

      const customError = new CustomError("Custom error", 500);
      reportError(customError);

      expect(mockConsoleError).toHaveBeenCalledWith(
        "Reported Error to our external service:",
        customError
      );
    });
  });

  describe("in production mode", () => {
    beforeEach(() => {
      (globalThis as DevGlobal).__DEV__ = false;
    });

    it("should not log to console in production", () => {
      const testError = new Error("Production error");

      reportError(testError);

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it("should not log string errors to console in production", () => {
      reportError("Production string error");

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it("should silently handle errors in production", () => {
      // This should not throw or cause any side effects
      expect(() => {
        reportError(new Error("Silent error"));
        reportError("Silent string error");
      }).not.toThrow();

      expect(mockConsoleError).not.toHaveBeenCalled();
    });
  });

  describe("function behavior", () => {
    beforeEach(() => {
      (globalThis as DevGlobal).__DEV__ = true;
    });

    it("should return void (undefined)", () => {
      const result = reportError("test");
      expect(result).toBeUndefined();
    });

    it("should not modify the original error object", () => {
      const originalError = new Error("Original message");
      const originalMessage = originalError.message;
      const originalStack = originalError.stack;

      reportError(originalError);

      expect(originalError.message).toBe(originalMessage);
      expect(originalError.stack).toBe(originalStack);
    });

    it("should handle multiple consecutive calls", () => {
      reportError("Error 1");
      reportError(new Error("Error 2"));
      reportError("Error 3");

      expect(mockConsoleError).toHaveBeenCalledTimes(3);
    });
  });
});
