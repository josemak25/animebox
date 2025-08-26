import { Proxy } from "./proxy";

/**
 * The `VideoExtractor` abstract class defines the contract for all video extraction providers.
 * It enforces a standard interface for extracting video sources from a given URL, and for maintaining provider metadata.
 *
 * ## Features
 * - Requires provider name and sources list.
 * - Enforces an async extraction method for video sources.
 *
 * @example
 * ```typescript
 * class MyExtractor extends VideoExtractor {
 *   protected serverName = "my-provider";
 *   protected sources: IVideo[] = [];
 *   async extract(videoUrl: URL): Promise<IVideo[]> {
 *     // ...
 *   }
 * }
 * ```
 */
abstract class VideoExtractor extends Proxy {
  /**
   * The server name of the video provider.
   * Used for identification and logging.
   */
  protected abstract serverName: string;

  /**
   * List of videos available from the last extraction.
   * Should be updated by the implementation after extraction.
   */
  protected abstract sources: IVideo[];

  /**
   * Extracts video sources from a given video URL.
   *
   * @param videoUrl - The URL of the video page to extract sources from.
   * @param args - Additional arguments for provider-specific needs.
   * @returns A promise resolving to an array of `IVideo` or `ISource` objects representing available video sources.
   */
  protected abstract extract(
    videoUrl: URL,
    ...args: unknown[]
  ): Promise<IVideo[] | ISource>;
}

/**
 * The `Kwik` class extends `Proxy` and provides static methods for extracting video sources from the Kwik video provider.
 * It is designed to fetch and parse video links (e.g., m3u8 streams) from a given video URL, using the provider's specific extraction logic.
 *
 * ## Features
 * - Maintains a static list of extracted video sources.
 * - Provides a static method to extract video links from a given URL.
 * - Sets appropriate headers (e.g., Referer) for provider compatibility.
 *
 * @example
 * ```typescript
 * const sources = await Kwik.extract(new URL("https://kwik.cx/xyz"));
 * ```
 */
export class Kwik extends VideoExtractor {
  /**
   * The server name of the video provider.
   * Used for identification and logging.
   * @protected
   */
  protected serverName = "kwik";

  /**
   * List of videos available from the last extraction.
   * This is a static property and is shared across all usages of the class.
   * @protected
   */
  protected sources: IVideo[] = [];

  /**
   * The host URL of the video provider.
   * Used as the Referer header when making requests.
   * @private
   */
  private readonly host = "https://animepahe.ru/";

  /**
   * Extracts video sources from a given video URL.
   * Fetches the page, evaluates the embedded script, and parses out video links (e.g., m3u8 streams).
   *
   * @param videoUrl - The URL of the video page to extract sources from.
   * @returns A promise resolving to an array of `IVideo` objects representing available video sources.
   * @throws {Error} If extraction fails or the network request encounters an error.
   */
  async extract(videoUrl: URL): Promise<IVideo[]> {
    try {
      const response = await fetch(`${videoUrl.href}`, {
        headers: { Referer: this.host },
      });

      const data = await response.text();

      // Evaluate the obfuscated script and extract the m3u8 URL
      const [url_source] = eval(
        /(eval)(\(f.*?)(\n<\/script>)/s.exec(data)![2].replace("eval", "")
      ).match(/https.*?m3u8/);

      this.sources.push({
        url: url_source,
        isM3U8: url_source.includes(".m3u8"),
      });

      return this.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
