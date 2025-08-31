import { load } from "react-native-cheerio";

import { KwikExtractor } from "./extractor";

export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

/**
 * The `AnimePahe` class extends `AnimeParser` and implements scraping and API logic for the animepahe.ru provider.
 * It supports searching, fetching anime info, episode sources, and more, using both API and HTML parsing.
 *
 * ## Features
 * - Search anime by query
 * - Fetch detailed anime info, episodes, and recommendations
 * - Extract streaming/download sources for episodes
 * - Handles multi-page episode lists and relations
 *
 * @example
 * ```typescript
 * const animepahe = new AnimePahe();
 * const search = await animepahe.search('Naruto');
 * const info = await animepahe.fetchAnimeInfo(search.results[0].id);
 * const sources = await animepahe.fetchEpisodeSources(info.episodes[0].id);
 * ```
 */
export class HeaderLessParser {
  /**
   * The base URL for all API and HTML requests.
   * @override
   */
  public static BASE_URL = "https://animepahe.ru";

  /**
   * Fetch streaming and download sources for a specific episode.
   *
   * @param episodeId - The episode ID (format: anime/session).
   * @returns A promise resolving to an `ISource` object with video sources and download links.
   */
  fetchEpisodeSources = async (html: string): Promise<ISource> => {
    try {
      const $ = load(html);

      const links = $("div#resolutionMenu > button")
        .map((_i, el) => ({
          url: $(el).attr("data-src")!,
          quality: $(el).text(),
          audio: $(el).attr("data-audio"),
        }))
        .get();

      const downloads = $("div#pickDownload > a")
        .map((_i, el) => ({
          quality: $(el).text(),
          url: $(el).attr("href")!,
        }))
        .get();

      const iSource: ISource = {
        sources: [],
        headers: { Referer: "https://kwik.cx/" },
      };

      for (const link of links) {
        const [source] = await new KwikExtractor().extract(new URL(link.url));

        iSource.sources.push({
          ...source,
          quality: link.quality,
          isDub: link.audio === "eng",
        });
      }
      iSource.download = downloads;

      return iSource;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   * Search for anime by query string.
   *
   * @param query - The search query (anime title or keywords).
   * @returns A promise resolving to a search result object containing an array of anime results.
   */
  fetchAllAnime = (html: string): ICollection => {
    const $ = load(html);
    const result: ICollection = {};

    // Find all tab panes within tab-content
    $(".tab-content .tab-pane").each((_, tabPane) => {
      const $tabPane = $(tabPane);
      const tabId = $tabPane.attr("id");

      if (!tabId) return;

      // Convert tab ID to display format (hash -> #)
      const tabKey = tabId === "hash" ? "#" : tabId.toUpperCase();

      // Extract data for this tab
      const tabData = this.extractFetchAllAnimeTabData($, tabPane);

      if (tabData.length > 0) {
        result[tabKey] = tabData;
      }
    });

    return result;
  };

  /**
   * Fetches the latest anime releases from the provider.
   *
   * @param page - (Optional) Page number for pagination. Default: 1.
   * @returns A promise resolving to an array of `IAnimeInfo` objects representing the latest releases.
   */
  fetchLatestReleases = async (
    html: string
  ): Promise<IPagination & { data: IRelease[] }> => {
    const $ = load(html);

    const results: IRelease[] = [];
    const pagination = this.extractFetchLatestReleasesPaginationData($);

    $(".episode-wrap").each((_i, element) => {
      const $episode = $(element);

      // Extract title from the anime title link
      const $titleLink = $episode.find(".episode-title a");
      const title = $titleLink.attr("title") || $titleLink.text().trim();

      // Extract anime URL
      const url = $titleLink.attr("href")!;

      // Extract image URL
      const $image = $episode.find(".episode-snapshot img");
      const image = ($image.attr("src") || $image.attr("data-src"))!;

      // Extract video/watch URL and remove /play/ prefix
      const $playLink = $episode.find(".episode-snapshot a.play");
      const video_url = $playLink.attr("href")?.replace("/play/", "/")!;

      // Extract episode number
      const $episodeNumber = $episode.find(".episode-number");
      let episodeNumber = null;
      if ($episodeNumber.length > 0) {
        // Get the text and extract just the number part
        const episodeText = $episodeNumber.text().trim();
        const numberMatch = episodeText.match(/(\d+)$/);
        if (numberMatch) {
          episodeNumber = parseInt(numberMatch[1]);
        }
      }

      results.push({
        title,
        duration: 0,
        snapshot: image,
        session: video_url,
        episode: episodeNumber || 0,
        url: `${HeaderLessParser.BASE_URL}${url}`,
      });
    });

    return { ...pagination, data: results };
  };

  /**
   * Extracts data from a tab pane element.
   *
   * @param $ - The CheerioAPI instance.
   * @param tabPane - The tab pane element to extract data from.
   * @returns An array of extracted data items.
   * @private
   */
  private extractFetchLatestReleasesPaginationData($: CheerioAPI) {
    const pagination: IPagination = {
      totalPages: 0,
      currentPage: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: undefined,
      nextPage: undefined,
    };

    // Find pagination container
    const $paginationNav = $('nav[aria-label="Page navigation"]');
    const $paginationItems = $paginationNav.find(".page-item");

    $paginationItems.each((_i, item) => {
      const $item = $(item);
      const $link = $item.find(".page-link");

      // Check if it's the current page (active item)
      if ($item.hasClass("active")) {
        const pageText = $link.text().trim();
        pagination.currentPage = parseInt(pageText);
      }

      // Check for prev page
      if ($link.hasClass("prev-page") && !$item.hasClass("disabled")) {
        pagination.hasPrevPage = true;
        const prevPageNum = $link.attr("data-page");
        if (prevPageNum) {
          pagination.prevPage = parseInt(prevPageNum);
        }
      }

      // Check for next page
      if ($link.hasClass("next-page") && !$item.hasClass("disabled")) {
        pagination.hasNextPage = true;
        const nextPageNum = $link.attr("data-page");
        if (nextPageNum) {
          pagination.nextPage = parseInt(nextPageNum);
        }
      }

      // Check for last page to get total pages
      if ($link.attr("title")?.includes("Go to the Last Page")) {
        const totalPagesNum = $link.attr("data-page");
        if (totalPagesNum) {
          pagination.totalPages = parseInt(totalPagesNum);
        }
      }
    });

    return pagination;
  }

  /**
   * Extracts data from a tab pane element.
   *
   * @param $ - The CheerioAPI instance.
   * @param tabPane - The tab pane element to extract data from.
   * @returns An array of extracted data items.
   * @private
   */
  private extractFetchAllAnimeTabData($: CheerioAPI, tabPane: never) {
    const items: ICollection[string] = [];

    // Find all rows within this tab pane
    $(tabPane)
      .find(".row > div")
      .each((_i, element) => {
        const $element = $(element);
        const $link = $element.find("a");

        // Skip if no link found or link has no title
        if ($link.length === 0) return;

        const href = $link.attr("href")?.trim()!;
        const title = $link.attr("title")?.trim() || $link.text().trim();

        // Skip if no title or empty title
        if (!title || title.trim() === "") return;

        // Extract badge information
        const $badge = $element.find(".badge");
        let badge: ICollection[string][number]["badge"] = null;

        if ($badge.length > 0) {
          const badgeText = $badge.text().trim();
          const badgeClass = $badge.attr("class")?.trim()!;

          badge = {
            text: badgeText,
            type: badgeClass.includes("badge-primary")
              ? "BD"
              : badgeClass.includes("badge-warning")
                ? "DVD"
                : (badgeText as NonNullable<typeof badge>["type"]),
          };
        }

        items.push({
          badge,
          title: title.trim(),
          url: `${HeaderLessParser.BASE_URL}${href}`,
        });
      });

    return items;
  }
}
