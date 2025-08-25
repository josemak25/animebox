import { Proxy } from "./proxy";

/**
 * The `BaseProvider` abstract class defines the core contract for all content providers (anime, manga, etc).
 * It standardizes required metadata, configuration, and status reporting for provider implementations.
 *
 * ## Features
 * - Enforces provider metadata (name, baseUrl, logo, etc).
 * - Supports language and NSFW flags.
 * - Provides a standard stats object via `toString`.
 *
 * @example
 * ```typescript
 * class MyProvider extends BaseProvider {
 *   // Implement required members...
 * }
 * ```
 */
abstract class BaseProvider extends Proxy {
  /**
   * Name of the provider.
   * Used for display and identification.
   */
  abstract readonly name: string;

  /**
   * The main URL of the provider.
   * Used for API requests and linking.
   */
  protected abstract readonly baseUrl: string;

  /**
   * Language(s) supported by the provider.
   * Override if not English. Must be ISO 639-1 code or array of codes.
   * @default "en"
   */
  protected readonly languages: string[] | string = "en";

  /**
   * Set to `true` if the provider only supports NSFW content.
   * @default false
   */
  readonly isNSFW: boolean = false;

  /**
   * Logo of the provider (used in the website) or `undefined` if not available.
   * 128x128px is preferred. Must be a valid URL (not a data URL).
   */
  protected readonly logo: string =
    "https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-neon-effect-png-image_2928214.jpg";

  /**
   * The class's path is determined by the provider's directory structure.
   * For example: MangaDex class path is `MANGA.MangaDex` (case sensitive).
   */
  protected abstract readonly classPath: string;

  /**
   * Set to `false` if the provider is down or not working.
   * @default true
   */
  readonly isWorking: boolean = true;

  /**
   * Returns provider stats as an `IProviderStats` object.
   * Useful for diagnostics and display.
   */
  get toString(): IProviderStats {
    return {
      name: this.name,
      baseUrl: this.baseUrl,
      lang: this.languages,
      isNSFW: this.isNSFW,
      logo: this.logo,
      classPath: this.classPath,
      isWorking: this.isWorking,
    };
  }
}

/**
 * The `BaseParser` abstract class extends `BaseProvider` and defines the contract for search functionality.
 * All parser implementations must provide a `search` method for querying content.
 *
 * ## Features
 * - Enforces a standard search interface for all providers.
 *
 * @example
 * ```typescript
 * class MyParser extends BaseParser {
 *   async search(query: string): Promise<unknown> {
 *     // ...
 *   }
 * }
 * ```
 */
export abstract class BaseParser extends BaseProvider {
  /**
   * Search for books/anime/manga/etc using the given query.
   *
   * @param query - The search query string.
   * @param args - Additional arguments for provider-specific needs.
   * @returns A promise resolving to a data object (provider-specific shape).
   */
  abstract search(query: string, ...args: unknown[]): Promise<unknown>;
}
