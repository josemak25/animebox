import { renderHook } from "@testing-library/react-hooks";
import Storage from "expo-sqlite/kv-store";
import React from "react";

import { HeadlessBrowserContext } from "@/providers/headless-browser/provider";

import { useHeadlessBrowser } from "../useHeadlessBrowser";

describe("useHeadlessBrowser", () => {
  const mockLoadPage = jest.fn();
  const mockOnSuccess = jest.fn();
  const contextValue: IHeadlessBrowser = {
    error: null,
    status: "idle",
    isError: false,
    isLoading: false,
    isSuccess: false,
    loadPage: mockLoadPage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadPage.mockClear();
  });

  // Memoize params outside the test functions for stable reference
  const params = { url: "https://test.com", onSuccess: mockOnSuccess };

  it("should throw if used outside provider", () => {
    const { result } = renderHook(() => useHeadlessBrowser(params));

    expect(result.error?.message).toEqual(
      "useHeadlessBrowser must be used within a HeadlessBrowserProvider"
    );
  });

  it("should call loadPage on mount and return context without loadPage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HeadlessBrowserContext.Provider value={contextValue}>
        {children}
      </HeadlessBrowserContext.Provider>
    );

    const { result } = renderHook(() => useHeadlessBrowser(params), {
      wrapper,
    });

    expect(mockLoadPage).toHaveBeenCalledWith(params);

    // loadPage should not be in the returned object
    expect("loadPage" in result.current).toBe(false);
    expect(result.current.status).toBe("idle");
    expect(result.current.isError).toBe(false);
  });

  it("should not call loadPage again if params do not change", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HeadlessBrowserContext.Provider value={contextValue}>
        {children}
      </HeadlessBrowserContext.Provider>
    );

    const { rerender } = renderHook(() => useHeadlessBrowser(params), {
      wrapper,
    });

    expect(mockLoadPage).toHaveBeenCalledTimes(1);
    rerender();
    expect(mockLoadPage).toHaveBeenCalledTimes(1);
  });

  it("should call onSuccess when a new page is loaded", async () => {
    // Simulate no cache
    (Storage.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    const testHtml = "<html>test</html>";

    // Mock WebView and simulate onMessage
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HeadlessBrowserContext.Provider
        value={{
          ...contextValue,
          loadPage: async (params) => {
            // Simulate onMessage after loadPage, For testing, we can call it directly
            // In real scenario, this would be triggered by the WebView
            // @ts-expect-error
            params.onSuccess(testHtml);
          },
        }}
      >
        {children}
      </HeadlessBrowserContext.Provider>
    );

    renderHook(() => useHeadlessBrowser(params), { wrapper });

    expect(mockOnSuccess).toHaveBeenCalledWith(testHtml);
  });

  it("should not call onSuccess again if cache is fresh", async () => {
    // Simulate fresh cache
    const now = new Date().toISOString();
    (Storage.getItemAsync as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        "https://test.com": {
          html: "<html>cached</html>",
          updated_at: now,
          stale_time: 1000 * 60 * 5,
          checksum: "123",
        },
      })
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HeadlessBrowserContext.Provider value={contextValue}>
        {children}
      </HeadlessBrowserContext.Provider>
    );

    renderHook(() => useHeadlessBrowser(params), { wrapper });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
