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

interface IEpisodeServer {
  /**
   * The name of the server
   */
  name: string;
  /**
   * The URL of the server
   */
  url: string;
  /**
   * Additional metadata about the server
   */
  [x: string]: unknown;
}

interface ExternalLink {
  /**
   * The ID of the external link
   */
  id?: string;
  /**
   * The URL of the external link
   */
  url?: string;
  /**
   * The name of the source providing the external link
   */
  sourceName?: string;
}

interface FuzzyDate {
  /**
   * The year of the date
   */
  year?: number;
  /**
   * The month of the date
   */
  month?: number;
  /**
   * The day of the date
   */
  day?: number;
}

interface ITitle {
  /**
   * The romaji title of the anime
   */
  romaji?: string;
  /**
   * The english title of the anime
   */
  english?: string;
  /**
   * The native title of the anime
   */
  native?: string;
  /**
   * The user preferred title of the anime
   */
  userPreferred?: string;
}

interface IAnimeEpisode {
  /**
   * The ID of the episode
   */
  id: string;
  /**
   * The episode number
   */
  number: number;
  /**
   * The title of the episode
   */
  title?: string;
  /**
   * The description of the episode
   */
  description?: string;
  /**
   * Whether the episode is filler
   */
  isFiller?: boolean;
  /**
   * Whether the episode is subbed
   */
  isSubbed?: boolean;
  /**
   * Whether the episode is dubbed
   */
  isDubbed?: boolean;
  /**
   * The URL of the episode
   */
  url?: string;
  /**
   * The image of the episode
   */
  image?: string;
  /**
   * The hash of the image
   */
  imageHash?: string;
  /**
   * The release date of the episode
   */
  releaseDate?: string;
  /**
   * Other fields
   */
  [x: string]: PropertyKey;
}

enum MediaStatus {
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  HIATUS = "Hiatus",
  CANCELLED = "Cancelled",
  NOT_YET_AIRED = "Not yet aired",
  UNKNOWN = "Unknown",
}

enum MediaFormat {
  TV = "TV",
  TV_SHORT = "TV_SHORT",
  TV_SPECIAL = "TV_SPECIAL",
  MOVIE = "MOVIE",
  SPECIAL = "SPECIAL",
  OVA = "OVA",
  ONA = "ONA",
  MUSIC = "MUSIC",
  MANGA = "MANGA",
  NOVEL = "NOVEL",
  ONE_SHOT = "ONE_SHOT",
  PV = "PV",
  COMIC = "COMIC",
}

interface IAnimeResult {
  /**
   * The ID of the anime
   */
  id: string;
  /**
   * The title of the anime
   */
  title: string | ITitle;
  /**
   * The URL of the anime
   */
  url?: string;
  /**
   * The image of the anime
   */
  image?: string;
  /**
   * The hash of the image
   */
  imageHash?: string;
  /**
   * The cover image of the anime
   */
  cover?: string;
  /**
   * The hash of the cover image
   */
  coverHash?: string;
  /**
   * The status of the anime
   */
  status?: MediaStatus;
  /**
   * The rating of the anime
   */
  rating?: number;
  /**
   * The type of the anime
   */
  type?: MediaFormat;
  /**
   * The release date of the anime
   */
  releaseDate?: string;
  /**
   * The relation type of the anime
   */
  relationType?: string;
  /**
   * Other fields
   */
  [x: string]: PropertyKey;
}

interface IAnimeInfo extends IAnimeResult {
  /**
   * The MAL ID of the anime
   */
  malId?: number | string;
  /**
   * The genres of the anime
   */
  genres?: string[];
  /**
   * The description of the anime
   */
  description?: string;
  /**
   * The status of the anime
   */
  status?: MediaStatus;
  /**
   * The total number of episodes
   */
  totalEpisodes?: number;
  /**
   * Whether the anime has a subbed version
   */
  hasSub?: boolean;
  /**
   * Whether the anime has a dubbed version
   */
  hasDub?: boolean;
  /**
   * The synonyms of the anime
   */
  synonyms?: string[];
  /**
   * two letter representation of country: e.g JP for japan
   */
  countryOfOrigin?: string;
  /**
   * Whether the anime is adult content
   */
  isAdult?: boolean;
  /**
   * Whether the anime is licensed
   */
  isLicensed?: boolean;
  /**
   * `FALL`, `WINTER`, `SPRING`, `SUMMER`
   */
  season?: string;
  /**
   * The studios involved in the anime
   */
  studios?: string[];
  /**
   * The color palette of the anime
   */
  color?: string;
  /**
   * The cover image of the anime
   */
  cover?: string;
  /**
   * The external links for the anime
   */
  externalLinks?: ExternalLink[];
  /**
   * The trailer for the anime
   */
  trailer?: Trailer;
  /**
   * The episodes of the anime
   */
  episodes?: IAnimeEpisode[];
  /**
   * The start date of the anime
   */
  startDate?: FuzzyDate;
  /**
   * The end date of the anime
   */
  endDate?: FuzzyDate;
  /**
   * The recommendations for the anime
   */
  recommendations?: IAnimeResult[];
  /**
   * The relations for the anime
   */
  relations?: IAnimeResult[];
}
