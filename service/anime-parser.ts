import { BaseParser } from "./base-parser";

/**
 * The `AnimeParser` abstract class extends `BaseParser` and defines the contract for anime provider implementations.
 * It enforces a consistent interface for fetching anime information, episode sources, and episode servers.
 *
 * ## Features
 * - Standardizes the API for anime providers.
 * - Supports optional dub/sub separation flag.
 * - Ensures all anime providers implement info, source, and server fetching methods.
 *
 * @example
 * ```typescript
 * class MyAnimeProvider extends AnimeParser {
 *   // Implement abstract methods...
 * }
 * ```
 */
export abstract class AnimeParser extends BaseParser {
  /**
   * Indicates if the provider offers dubbed anime separately from subbed content.
   * Override and set to `true` if dubs are available as a distinct option.
   *
   * @default false
   */
  protected readonly isDubAvailableSeparately: boolean = false;

  /**
   * Fetches detailed anime information, including episodes, for a given anime ID.
   *
   * @param animeId - The unique identifier for the anime.
   * @param args - Additional arguments for provider-specific needs.
   * @returns A promise resolving to an `IAnimeInfo` object containing anime metadata and episodes.
   */
  abstract fetchAnimeInfo(
    animeId: string,
    ...args: unknown[]
  ): Promise<IAnimeInfo>;

  /**
   * Fetches streaming or download sources for a specific episode.
   *
   * @param episodeId - The unique identifier for the episode.
   * @param args - Additional arguments for provider-specific needs.
   * @returns A promise resolving to an `ISource` object containing video sources.
   */
  abstract fetchEpisodeSources(
    episodeId: string,
    ...args: unknown[]
  ): Promise<ISource>;

  /**
   * Fetches available streaming servers for a specific episode.
   *
   * @param episodeId - The unique identifier for the episode.
   * @param args - Additional arguments for provider-specific needs.
   * @returns A promise resolving to an array of `IEpisodeServer` objects.
   */
  abstract fetchEpisodeServers(
    episodeId: string,
    ...args: unknown[]
  ): Promise<IEpisodeServer[]>;

  /**
   * Fetches the full list of anime available from the provider.
   *
   * @param args - Additional arguments for provider-specific needs (e.g., pagination, filters).
   * @returns A promise resolving to an array of `ICollection` objects representing all anime.
   */
  abstract fetchAllAnime(...args: unknown[]): Promise<ICollection>;

  /**
   * Fetches the latest anime releases from the provider.
   *
   * @param args - Additional arguments for provider-specific needs (e.g., pagination, filters).
   * @returns A promise resolving to a paginated response containing an array of `IRelease` objects.
   */
  abstract fetchLatestReleases(
    page: number
  ): Promise<IPagination & { data: IRelease[] }>;
}
