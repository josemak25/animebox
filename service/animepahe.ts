import { load } from "react-native-cheerio";

import { AnimeParser } from "./anime-parser";
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
export class AnimePahe extends AnimeParser {
  /**
   * The provider name (for display and identification).
   * @override
   */
  override readonly name = "AnimePahe";

  /**
   * The base URL for all API and HTML requests.
   * @override
   */
  protected override baseUrl = "https://animepahe.ru";

  /**
   * The logo URL for the provider (used in UI).
   * @override
   */
  protected override logo = "https://animepahe.com/pikacon.ico";

  /**
   * The class path for this provider (used for dynamic loading).
   * @override
   */
  protected override classPath = "ANIME.AnimePahe";

  /**
   * Search for anime by query string.
   *
   * @param query - The search query (anime title or keywords).
   * @returns A promise resolving to a search result object containing an array of anime results.
   */
  override search = async (query: string): Promise<ISearch<IAnimeResult>> => {
    try {
      const { data } = await this.client.get(
        `${this.baseUrl}/api?m=search&q=${encodeURIComponent(query)}`,
        {
          headers: this.Headers(false),
        }
      );

      const results = data.data.map((item: Record<string, PropertyKey>) => ({
        type: item.type,
        id: item.session,
        title: item.title,
        image: item.poster,
        rating: item.score,
        releaseDate: item.year,
      }));

      return results;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   * Fetch detailed anime info, including episodes, recommendations, and relations.
   *
   * @param id - The anime ID (format: id/session).
   * @param episodePage - (Optional) Episode page number. Default: -1 (fetch all pages).
   * @returns A promise resolving to an `IAnimeInfo` object with all metadata and episodes.
   */
  override fetchAnimeInfo = async (
    id: string,
    episodePage: number = -1
  ): Promise<IAnimeInfo> => {
    const animeInfo: IAnimeInfo = { id, title: "" };

    try {
      const { data } = await this.client.get(`${this.baseUrl}/anime/${id}`, {
        headers: this.Headers(id),
      });

      const $ = load(data);

      animeInfo.title = $("div.title-wrapper > h1 > span").first().text();
      animeInfo.image = $("div.anime-poster a").attr("href");
      animeInfo.cover = `https:${$("div.anime-cover").attr("data-src")}`;
      animeInfo.description = $("div.anime-summary").text().trim();
      animeInfo.genres = $("div.anime-genre ul li")
        .map((_i, el) => $(el).find("a").attr("title"))
        .get() as string[];
      animeInfo.hasSub = true;

      animeInfo.externalLinks = [];
      $("p.external-links > a").each((_i, el) => {
        const url = $(el).attr("href")?.trim();
        animeInfo.externalLinks?.push({
          id: url?.includes("?")
            ? url?.split("?")[1].split("=")[1]
            : url?.split("/").pop(),
          url: url,
          sourceName: $(el).text().trim(),
        });
      });

      switch ($('div.anime-info p:icontains("Status:") a').text().trim()) {
        case "Currently Airing":
          animeInfo.status = MediaStatus.ONGOING;
          break;
        case "Finished Airing":
          animeInfo.status = MediaStatus.COMPLETED;
          break;
        default:
          animeInfo.status = MediaStatus.UNKNOWN;
      }
      animeInfo.type = $('div.anime-info > p:contains("Type:") > a')
        .text()
        .trim()
        .toUpperCase() as MediaFormat;
      animeInfo.releaseDate = $('div.anime-info > p:contains("Aired:")')
        .text()
        .split("to")[0]
        .replace("Aired:", "")
        .trim();
      animeInfo.studios = $('div.anime-info > p:contains("Studio:")')
        .text()
        .replace("Studio:", "")
        .trim()
        .split("\n");

      animeInfo.totalEpisodes = parseInt(
        $('div.anime-info > p:contains("Episodes:")')
          .text()
          .replace("Episodes:", "")
      );

      animeInfo.recommendations = [];
      $("div.anime-recommendation .col-sm-6").each((_i, el) => {
        animeInfo.recommendations?.push({
          id: $(el).find(".col-2 > a").attr("href")?.split("/")[2]!,
          title: $(el).find(".col-2 > a").attr("title")!,
          image:
            $(el).find(".col-2 > a > img").attr("src") ||
            $(el).find(".col-2 > a > img").attr("data-src"),
          url: `${this.baseUrl}/anime/${$(el).find(".col-2 > a").attr("href")?.split("/")[2]}`,
          releaseDate: $(el).find("div.col-9 > a").text().trim(),
          status: $(el).find("div.col-9 > strong").text().trim() as MediaStatus,
        } as unknown as IAnimeResult);
      });

      animeInfo.relations = [];
      $("div.anime-relation .col-sm-6").each((_i, el) => {
        animeInfo.relations?.push({
          id: $(el).find(".col-2 > a").attr("href")?.split("/")[2]!,
          title: $(el).find(".col-2 > a").attr("title")!,
          image:
            $(el).find(".col-2 > a > img").attr("src") ||
            $(el).find(".col-2 > a > img").attr("data-src"),
          url: `${this.baseUrl}/anime/${$(el).find(".col-2 > a").attr("href")?.split("/")[2]}`,
          releaseDate: $(el).find("div.col-9 > a").text().trim(),
          status: $(el).find("div.col-9 > strong").text().trim() as MediaStatus,
          relationType: $(el).find("h4 > span").text().trim(),
        } as unknown as IAnimeResult);
      });

      animeInfo.episodes = [];
      if (episodePage < 0) {
        const { last_page, episodes } = await this.fetchEpisodes(id, 1);

        animeInfo.episodePages = last_page;
        animeInfo.episodes.push(...episodes);

        for (let i = 1; i < last_page; i++) {
          const { episodes } = await this.fetchEpisodes(id, i + 1);
          animeInfo.episodes.push(...episodes);
        }
      } else {
        const { episodes } = await this.fetchEpisodes(id, episodePage);
        animeInfo.episodes.push(...episodes);
      }

      return animeInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   * Fetch streaming and download sources for a specific episode.
   *
   * @param episodeId - The episode ID (format: anime/session).
   * @returns A promise resolving to an `ISource` object with video sources and download links.
   */
  override fetchEpisodeSources = async (
    episodeId: string
  ): Promise<ISource> => {
    try {
      const [session] = episodeId.split("/");
      const { data } = await this.client.get(
        `${this.baseUrl}/play/${episodeId}`,
        { headers: this.Headers(session) }
      );

      const $ = load(data);

      const links = $("div#resolutionMenu > button")
        .map((_i, el) => ({
          url: $(el).attr("data-src")!,
          quality: $(el).text(),
          audio: $(el).attr("data-audio"),
        }))
        .get();

      const downloads = $("div#pickDownload > a")
        .map((_i, el) => ({
          url: $(el).attr("href")!,
          quality: $(el).text(),
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
   * Fetches a page of episodes for a given anime session.
   *
   * @param session - The anime session ID.
   * @param page - The page number to fetch.
   * @returns A promise resolving to an object with `last_page` and an array of episodes.
   * @private
   */
  private fetchEpisodes = async (
    session: string,
    page: number
  ): Promise<{ last_page: number; episodes: IAnimeEpisode[] }> => {
    const {
      data: { last_page, data },
    } = await this.client.get<{ last_page: number; data: IRelease[] }>(
      `${this.baseUrl}/api?m=release&id=${session}&sort=episode_asc&page=${page}`,
      { headers: this.Headers(session) }
    );

    const episodes = data.map(
      (item): IAnimeEpisode => ({
        number: item.episode,
        title: item.title,
        image: item.snapshot,
        duration: item.duration,
        id: `${session}/${item.session}`,
        url: `${this.baseUrl}/play/${session}/${item.session}`,
      })
    );

    return { last_page, episodes };
  };

  /**
   * Search for anime by query string.
   *
   * @param query - The search query (anime title or keywords).
   * @returns A promise resolving to a search result object containing an array of anime results.
   */
  override fetchAllAnime = async (): Promise<ICollection> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/anime`, {
        headers: this.Headers(false),
      });

      const $ = load(data);

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
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   * Fetches the latest anime releases from the provider.
   *
   * @param page - (Optional) Page number for pagination. Default: 1.
   * @returns A promise resolving to an array of `IAnimeInfo` objects representing the latest releases.
   */
  override fetchLatestReleases = async (
    page: number = 1
  ): Promise<IPagination & { data: IRelease[] }> => {
    const { data } = await this.client.get(`${this.baseUrl}/?page=${page}`, {
      headers: this.Headers(false),
    });

    const $ = load(data);

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
        url: `${this.baseUrl}${url}`,
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
          url: `${this.baseUrl}${href}`,
        });
      });

    return items;
  }

  /**
   * Returns the HTTP headers for requests to animepahe.ru, including referer and user-agent.
   *
   * @param sessionId - The anime session ID, or `false` for generic requests.
   * @returns An object containing HTTP headers for API/HTML requests.
   * @private
   */
  private Headers(sessionId: string | false) {
    return {
      authority: "animepahe.ru",
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      cookie: "__ddg2_=;",
      dnt: "1",
      "sec-ch-ua":
        '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      referer: sessionId
        ? `${this.baseUrl}/anime/${sessionId}`
        : `${this.baseUrl}`,
      "user-agent": USER_AGENT,
    };
  }

  /**
   * Not supported: AnimePahe does not provide episode server lists.
   *
   * @deprecated
   * @attention AnimePahe doesn't support this method
   * @throws Always throws an error if called.
   */
  override fetchEpisodeServers = (
    _episodeLink: string
  ): Promise<IEpisodeServer[]> => {
    throw new Error("Method not implemented.");
  };
}
