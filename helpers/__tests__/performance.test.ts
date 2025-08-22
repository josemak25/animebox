import { debounce, throttle } from "../performance";

describe("Performance Utilities", () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("debounce", () => {
    it("should call the function after the specified delay", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should cancel previous calls when called multiple times", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(500);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should pass arguments correctly", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn("arg1", "arg2", 123);
      jest.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", 123);
    });

    it("should handle zero delay", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn();
      jest.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("throttle", () => {
    it("should call the function immediately on first call", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should not call function again until throttle period passes", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should pass arguments correctly", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      throttledFn("test", 42, true);
      expect(mockFn).toHaveBeenCalledWith("test", 42, true);
    });

    it("should handle zero limit", () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 0);

      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(0);
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
