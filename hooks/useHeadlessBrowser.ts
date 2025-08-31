import { useContext, useEffect, useRef } from "react";

import {
  IHeadlessBrowser,
  HeadlessBrowserContext,
} from "@/providers/headless-browser/provider";

/**
 * Hook for accessing the headless browser context in React components.
 *
 * Provides access to headless browser state, loading status, error handling,
 * and utility functions for loading web pages in a headless (WebView-based) environment.
 * Must be used within a component tree wrapped by HeadlessBrowserProvider.
 *
 * @returns {IHeadlessBrowser} Headless browser context object
 * @returns {boolean} isLoading - True if a page is currently loading
 * @returns {boolean} isError - True if an error occurred during loading
 * @returns {boolean} isSuccess - True if the page loaded successfully
 * @returns {Error | null} error - Error object if an error occurred, otherwise null
 * @returns {"idle" | "loading" | "success" | "error"} status - Current loading status
 * @returns {(url: string) => void} loadPage - Function to initiate loading a new page by URL
 *
 * @throws {Error} When used outside of HeadlessBrowserProvider context
 *
 * @example
 * ```tsx
 * const { isLoading, isError, error, loadPage, status } = useHeadlessBrowser();
 *
 * useEffect(() => {
 *   loadPage("https://example.com");
 * }, []);
 *
 * if (isLoading) return <ActivityIndicator />;
 * if (isError) return <Text>Error: {error?.message}</Text>;
 * return <Text>Status: {status}</Text>;
 * ```
 */
export function useHeadlessBrowser(
  params: Parameters<IHeadlessBrowser["loadPage"]>[number]
): Omit<IHeadlessBrowser, "loadPage"> {
  const urlRef = useRef<string | null>(null);
  // Access headless browser context from React context
  const context = useContext(HeadlessBrowserContext);

  // Ensure hook is used within proper provider context
  if (context === undefined) {
    throw new Error(
      "useHeadlessBrowser must be used within a HeadlessBrowserProvider"
    );
  }

  useEffect(() => {
    // Check if the URL has changed before loading the page
    if (urlRef.current !== params.url) {
      context.loadPage(params);
      // Update the ref with the new URL
      urlRef.current = params.url;
    }
  }, [context, params]);

  // Return headless browser context object
  return context;
}
