import dayjs from "dayjs";
import Storage from "expo-sqlite/kv-store";
import React, {
  useRef,
  useMemo,
  useState,
  createContext,
  PropsWithChildren,
} from "react";
import { StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import { ThemedView } from "@/components/themed-components";
import { getChecksum } from "@/helpers/common";
import { withThemeStyles } from "@/helpers/withThemeStyles";

export interface IHeadlessBrowser {
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
   * The HTML content of the loaded page.
   */
  html: string | null;
  /**
   * Any error encountered during the loading process.
   */
  error: Error | null;
  /**
   * The current status of the loading process.
   */
  status: "idle" | "loading" | "success" | "error";
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

export interface IHeadlessCache {
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
  };
}

export const HeadlessBrowserContext = createContext<IHeadlessBrowser>(
  {} as IHeadlessBrowser
);

const INJECTED_JAVASCRIPT = `
    (function() {
      window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);
    })();
    true;
  `;

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const CACHE_STORAGE_KEY = "HEADLESS_CACHE_KEY";

/**
 * HeadlessBrowserProvider is a React context provider component that manages the state and logic
 * for loading and interacting with web pages in a headless browser environment using a WebView.
 *
 * @remarks
 * This provider exposes context values such as the loaded HTML, error state, loading status,
 * and utility functions to trigger page loads. It is designed to wrap application components
 * that require headless browser capabilities, such as scraping or automated page interaction.
 *
 * @example
 * ```tsx
 * <HeadlessBrowserProvider>
 *   <MyComponent />
 * </HeadlessBrowserProvider>
 * ```
 *
 * @context
 * Provides the following context values:
 * - `html`: The HTML string returned from the loaded web page.
 * - `error`: Any error encountered during the loading process.
 * - `status`: The current status of the loading process ("idle", "loading", "success", "error").
 * - `isError`: Boolean indicating if the current status is "error".
 * - `isLoading`: Boolean indicating if the current status is "loading".
 * - `isSuccess`: Boolean indicating if the current status is "success".
 * - `loadPage`: Function to initiate loading of a new page by URL.
 *
 * @see {@link HeadlessBrowserContext} for consuming the context values.
 */
export const HeadlessBrowserProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { styles } = useStyles();
  const mainCacheRef = useRef<IHeadlessCache>({});
  const [enabled, setEnabled] = useState(true);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // Temporary cache reference to be discarded after each page load
  const tempCacheRef = useRef<IHeadlessCache>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const isError = status === "error";
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const loadCacheAsync = async () => {
    // Load headless cached contents from storage
    const result = await Storage.getItemAsync(CACHE_STORAGE_KEY);
    const cache: IHeadlessCache = JSON.parse(result || "{}");
    return cache;
  };

  const loadPage = React.useCallback(
    async (params: Parameters<IHeadlessBrowser["loadPage"]>[number]) => {
      const cache = await loadCacheAsync();
      // Check if the URL is already cached
      const cachedPage = cache[params.url];
      // Determine the stale time and last updated time
      const staleTime = cachedPage?.stale_time || DEFAULT_STALE_TIME;
      // Add the stale time to the last updated time
      const lastUpdatedAt = dayjs(cachedPage?.updated_at)
        .add(staleTime, "millisecond")
        .toISOString();

      // Determine if the cache exists and not expired
      const isCacheFresh = !!cachedPage && dayjs().isBefore(lastUpdatedAt);

      // If cached content is still fresh, use it
      if (isCacheFresh) {
        setUrl(null);
        setEnabled(false);
        return;
      }

      // If the cache is stale, load the new page
      setUrl(params.url);
      setEnabled(params?.enabled ?? true);

      // Update the temporary cache with the new parameters
      tempCacheRef.current = {
        ...cache,
        // Update the stale time for the temporary cached page
        [params.url]: {
          ...cachedPage,
          stale_time: params.staleTime ?? DEFAULT_STALE_TIME,
        },
      };
    },
    []
  );

  const onMessage = async (e: WebViewMessageEvent) => {
    // Cache the HTML content
    const html = e.nativeEvent.data;
    // Get the checksum of the HTML content
    const checksum = getChecksum(html);
    //  temporarily cached page data via url
    const temporaryCachedPage = tempCacheRef.current[url as string];

    if (checksum === temporaryCachedPage?.checksum) {
      /** If the checksum matches, we return and not update the main cache
       * This means no changes were made to the page content
       * And since we already have the latest contents stored to DB we can use DB
       */
      return;
    }

    const payload: IHeadlessCache[string] = {
      // Preserve existing temporary cache data
      ...temporaryCachedPage,
      html,
      checksum,
      updated_at: dayjs().toISOString(),
    };

    // Update the main cache reference for the current URL
    mainCacheRef.current[url as string] = payload;

    // Update the cache in storage
    await Storage.setItemAsync(
      CACHE_STORAGE_KEY,
      JSON.stringify(mainCacheRef.current)
    );
  };

  const value: IHeadlessBrowser = useMemo(
    () => ({
      error,
      status,
      isError,
      loadPage,
      isLoading,
      isSuccess,
      html: mainCacheRef.current[url as string]?.html || null,
    }),
    [error, status, isError, loadPage, isLoading, isSuccess, url]
  );

  return (
    <HeadlessBrowserContext.Provider value={value}>
      {children}

      {url && enabled ? (
        <ThemedView style={styles.container}>
          <WebView
            source={{ uri: url }}
            onMessage={onMessage}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            onLoadStart={() => setStatus("loading")}
            onError={(e) => {
              setError(new Error(e.nativeEvent.description));
              setStatus("error");
            }}
            onLoadEnd={(e) => {
              // Determine the status based on the presence of a title
              // If the title is present, set status to "success", otherwise "error"
              setStatus(e.nativeEvent.title ? "success" : "error");
            }}
          />
        </ThemedView>
      ) : null}
    </HeadlessBrowserContext.Provider>
  );
};

const useStyles = withThemeStyles(() => ({
  container: {
    width: 0,
    height: 0,
    opacity: 0,
    ...StyleSheet.absoluteFillObject,
  },
}));
