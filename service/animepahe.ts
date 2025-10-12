import { load } from "react-native-cheerio";

import { Proxy } from "./proxy";

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
 * ```
 */
export class AnimePahe extends Proxy {
  /**
   * The base URL for all API and HTML requests.
   * @property
   */
  private static baseUrl = "https://animepahe.ru";

  /**
   * Search for anime by query string.
   *
   * @param query - The search query (anime title or keywords).
   * @returns A promise resolving to a search result object containing an array of anime results.
   */
  search = async (query: string): Promise<ISearch<IAnimeResult>> => {
    try {
      const { data } = await this.client.get(
        `${AnimePahe.baseUrl}/api?m=search&q=${encodeURIComponent(query)}`,
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
  fetchAnimeInfo = async (
    id: string,
    episodePage: number = -1
  ): Promise<IAnimeInfo> => {
    const animeInfo: IAnimeInfo = { id, title: "" };

    try {
      const { data } = await this.client.get(
        `${AnimePahe.baseUrl}/anime/${id}`,
        { headers: this.Headers(id) }
      );

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
          url: `${AnimePahe.baseUrl}/anime/${$(el).find(".col-2 > a").attr("href")?.split("/")[2]}`,
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
          url: `${AnimePahe.baseUrl}/anime/${$(el).find(".col-2 > a").attr("href")?.split("/")[2]}`,
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
      `${AnimePahe.baseUrl}/api?m=release&id=${session}&sort=episode_asc&page=${page}`,
      { headers: this.Headers(session) }
    );

    const episodes = data.map(
      (item): IAnimeEpisode => ({
        number: item.episode,
        title: item.title,
        image: item.snapshot,
        duration: item.duration,
        id: `${session}/${item.session}`,
        url: `${AnimePahe.baseUrl}/play/${session}/${item.session}`,
      })
    );

    return { last_page, episodes };
  };

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
        ? `${AnimePahe.baseUrl}/anime/${sessionId}`
        : `${AnimePahe.baseUrl}`,
      "user-agent": USER_AGENT,
    };
  }
}
