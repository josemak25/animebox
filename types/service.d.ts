interface ISubtitle {
  /**
   * The id of the subtitle. **not** required
   */
  id?: string;
  /**
   * The **url** that should take you to the subtitle **directly**.
   */
  url: string;
  /**
   * The language of the subtitle
   */
  lang: string;
}

interface IVideo {
  /**
   * The **MAIN URL** of the video provider that should take you to the video
   */
  url: string;
  /**
   * The Quality of the video should include the `p` suffix
   */
  quality?: string;
  /**
   * make sure to set this to `true` if the video is hls
   */
  isM3U8?: boolean;
  /**
   * set this to `true` if the video is dash (mpd)
   */
  isDASH?: boolean;
  /**
   * size of the video in **bytes**
   */
  size?: number;
  [x: string]: unknown; // other fields
}

interface ISource {
  /**
   * Headers to include in the request
   */
  headers?: { [k: string]: string };
  /**
   * The start, and the end of the intro or opening in seconds.
   */
  intro?: Intro;
  /**
   * The start, and the end of the outro or closing in seconds.
   */
  outro?: Intro;
  /**
   * The subtitles available for the video
   */
  subtitles?: ISubtitle[];
  /**
   * The sources available for the video
   */
  sources: IVideo[];
  /**
   * The download link for the video
   */
  download?: string | { url?: string; quality?: string }[];
  /**
   * The embed link for the video
   */
  embedURL?: string;
}

/**
 * The start, and the end of the intro or opening in seconds.
 */
interface Intro {
  /**
   * The start time of the intro in seconds.
   */
  start: number;
  /**
   * The end time of the intro in seconds.
   */
  end: number;
}

interface ProxyConfig {
  /**
   * The proxy URL
   * @example https://proxy.com
   **/
  url: string | string[];
  /**
   * X-API-Key header value (if any)
   **/
  key?: string;
  /**
   * The proxy rotation interval in milliseconds. (default: 5000)
   */
  rotateInterval?: number;
}

interface IProviderStats {
  /**
   * The name of the provider
   */
  name: string;
  /**
   * The main URL of the provider
   */
  baseUrl: string;
  /**
   * The languages supported by the provider
   */
  lang: string[] | string;
  /**
   * override as `true` if the provider **only** supports NSFW content
   */
  isNSFW: boolean;
  /**
   * The logo of the provider
   */
  logo: string;
  /**
   * The class path of the provider
   */
  classPath: string;
  /**
   * override as `false` if the provider is **down** or **not working**
   */
  isWorking: boolean;
}

interface ISearch<T> {
  /**
   * The current page of the search results
   */
  currentPage?: number;
  /**
   * Whether there is a next page of results
   */
  hasNextPage?: boolean;
  /**
   * The total number of pages available
   */
  totalPages?: number;
  /**
   * total results must include results from all pages
   */
  totalResults?: number;
  /**
   * The results of the search
   */
  results: T[];
}

interface IRelease {
  /**
   * The session id of the release
   */
  session: string;
  /**
   * The episode number of the release
   */
  episode: number;
  /**
   * The title of the release
   */
  title: string;
  /**
   * The snapshot image of the release
   */
  snapshot: string;
  /**
   * The duration of the release
   */
  duration: number;
  /**
   * The URL of the release
   */
  url: string;
}

interface ICollection {
  [key: string]: {
    /**
     * The title of the release
     */
    title: string;
    /**
     * The URL of the release
     */
    url: string;
    /**
     * The badge of the release
     */
    badge: {
      /**
       * The text displayed on the badge
       */
      text: string;
      /**
       * The type of the badge
       */
      type: "BD" | "DVD" | "WEB" | "UNKNOWN";
    } | null;
  }[];
}
