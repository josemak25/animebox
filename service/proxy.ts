import axios, { AxiosAdapter, AxiosInstance } from "axios";

/**
 * The `Proxy` class provides a wrapper around Axios to facilitate HTTP requests through a configurable proxy server.
 * It supports both single and multiple proxy URLs, with optional automatic rotation between multiple proxies at a specified interval.
 * The class also allows for dynamic configuration of the Axios adapter and proxy settings, including custom headers and user-agent manipulation.
 *
 * ## Features
 * - Validates and sets proxy URLs (single or multiple).
 * - Automatically rotates between multiple proxy URLs at a configurable interval.
 * - Allows setting a custom Axios adapter.
 * - Injects proxy-specific headers (e.g., API key, User-Agent) into outgoing requests.
 * - Provides an Axios instance for making proxied HTTP requests.
 *
 * @example
 * ```typescript
 * const proxy = new Proxy({ url: "https://my-proxy.com", key: "API_KEY" });
 * const response = await proxy.client.get("/endpoint");
 * ```
 */
export class Proxy {
  /**
   * Regular expression to validate URLs.
   * Ensures that provided proxy URLs are valid HTTP or HTTPS URLs.
   */
  private validUrl = /^https?:\/\/.+/;

  /**
   * Constructs a new Proxy instance.
   *
   * @param proxyConfig - Optional configuration for the proxy, including URL(s), API key, and rotation interval.
   * @param adapter - Optional custom Axios adapter for advanced request handling.
   */
  constructor(
    protected proxyConfig?: ProxyConfig,
    protected adapter?: AxiosAdapter
  ) {
    this.client = axios.create();

    if (proxyConfig) this.setProxy(proxyConfig);
    if (adapter) this.setAxiosAdapter(adapter);
  }

  /**
   * Sets or updates the proxy configuration.
   * Validates the provided proxy URL(s) and applies them to the Axios instance.
   * If multiple URLs are provided, initiates automatic proxy rotation.
   *
   * @param proxyConfig - The proxy configuration object containing URL(s), API key, and optional rotation interval.
   * @throws {Error} If any provided proxy URL is invalid.
   */
  setProxy(proxyConfig: ProxyConfig) {
    if (!proxyConfig?.url) return;

    if (typeof proxyConfig?.url === "string") {
      if (!this.validUrl.test(proxyConfig.url)) {
        throw new Error("Proxy URL is invalid!");
      }
    }

    if (Array.isArray(proxyConfig?.url)) {
      for (const [i, url] of this.toMap<string>(proxyConfig.url))
        if (!this.validUrl.test(url))
          throw new Error(`Proxy URL at index ${i} is invalid!`);

      this.rotateProxy({ ...proxyConfig, urls: proxyConfig.url });

      return;
    }

    this.client.interceptors.request.use((config) => {
      if (proxyConfig?.url) {
        config.headers.set("x-api-key", proxyConfig?.key ?? "");
        config.url = `${proxyConfig.url}${config?.url ? config?.url : ""}`;
      }

      if (config?.url?.includes("anify")) {
        config.headers.set("User-Agent", "consumet");
      }

      return config;
    });
  }

  /**
   * Sets or updates the Axios adapter for the internal Axios instance.
   * Useful for customizing request handling, such as for testing or advanced use cases.
   *
   * @param adapter - The Axios adapter to use for HTTP requests.
   */
  setAxiosAdapter(adapter: AxiosAdapter) {
    this.client.defaults.adapter = adapter;
  }

  /**
   * Initiates automatic rotation of proxy URLs.
   * At each interval, updates the proxy configuration to use the next URL in the list.
   *
   * @param proxy - The proxy configuration object, excluding the `url` property but including an array of URLs and optional rotation interval.
   * @private
   */
  private rotateProxy = (
    proxy: Omit<ProxyConfig, "url"> & { urls: string[] }
  ) => {
    setInterval(() => {
      const url = proxy.urls.shift();
      if (url) proxy.urls.push(url);

      this.setProxy({ url: proxy.urls[0], key: proxy.key });
    }, proxy?.rotateInterval ?? 5000);
  };

  /**
   * Converts an array into a mapped array of index-value pairs.
   * Useful for iterating with both index and value.
   *
   * @param arr - The array to map.
   * @returns An array of tuples containing the index and value.
   * @private
   */
  private toMap = <T>(arr: T[]): [number, T][] => arr.map((v, i) => [i, v]);

  /**
   * The internal Axios instance used for making HTTP requests through the configured proxy.
   * Can be accessed for making requests or further customization.
   */
  protected client: AxiosInstance;
}
