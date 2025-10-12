/**
 * Interface representing the structure of the headless browser.
 */
interface IHeadlessBrowser {
  /**
   * Whether the last page load resulted in an error.
   */
  isError: boolean;
  /**
   * Whether the current page is being loaded.
   */
  isLoading: boolean;
  /**
   * Whether the last page load was successful.
   */
  isSuccess: boolean;
  /**
   * Any error encountered during the loading process.
   */
  error: Error | null;
  /**
   * The current status of the loading process.
   */
  status: "idle" | "loading" | "success" | "error";
  /**
   * A callback on when page load is successful that returns the HTML content of the loaded page.
   */
  onSuccess?: (html: string) => void;
  /**
   * Loads a new page by URL.
   */
  loadPage: (params: {
    /**
     * The URL of the page to load.
     */
    url: string;
    /**
     * Whether to enable caching for the loaded page.
     */
    enabled?: boolean;
    /**
     * The time at which the cached HTML content is considered stale.
     */
    staleTime?: number;
  }) => void;
}

/**
 * Interface representing the structure of the headless browser cache.
 */
interface IHeadlessCache {
  [url: string]: {
    /**
     * The checksum of the cached HTML content.
     */
    checksum: string;
    /**
     * The time at which the cached HTML content was last updated.
     */
    updated_at: string;
    /**
     * The time at which the cached HTML content is considered stale.
     */
    stale_time: number;
    /**
     * The cached HTML content.
     */
    html: string | null;
    /**
     * Optional callback when page load is successful that returns the HTML content of the loaded page.
     */
    onSuccess: (html: string) => void;
  } | null;
}
