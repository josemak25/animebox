// types/react-native-cheerio.d.ts

// Comprehensive CheerioAPI and Cheerio type definitions for react-native-cheerio

interface Cheerio<T = unknown> extends Iterable<T> {
  length: number;
  [index: number]: T;
  text(): string;
  html(): string | null;
  attr(name: string): string | undefined;
  attr(): { [name: string]: string };
  find(selector: string): Cheerio<T>;
  first(): Cheerio<T>;
  last(): Cheerio<T>;
  eq(index: number): Cheerio<T>;
  get(): T[];
  get(index: number): T;
  map<U>(fn: (i: number, el: T) => U): Cheerio<U>;
  each(fn: (i: number, el: T) => void): Cheerio<T>;
  filter(selector: string): Cheerio<T>;
  parent(selector?: string): Cheerio<T>;
  children(selector?: string): Cheerio<T>;
  siblings(selector?: string): Cheerio<T>;
  next(selector?: string): Cheerio<T>;
  prev(selector?: string): Cheerio<T>;
  remove(): Cheerio<T>;
  toArray(): T[];
  val(): string | string[] | undefined;
  css(prop: string): string | undefined;
  hasClass(className: string): boolean;
  addClass(classNames: string): Cheerio<T>;
  removeClass(classNames?: string): Cheerio<T>;
  toggleClass(className: string, state?: boolean): Cheerio<T>;
  is(selector: string): boolean;
  not(selector: string): Cheerio<T>;
  closest(selector: string): Cheerio<T>;
  clone(): Cheerio<T>;
  data(name: string): unknown;
  data(): { [key: string]: unknown };
}

interface CheerioAPI {
  <T = never>(selector: string): Cheerio<T>;
  load(html: string): CheerioAPI;
  html(selector?: string | Cheerio): string;
  text(selector?: string | Cheerio): string;
  root(): Cheerio;
  contains(container: unknown, contained: unknown): boolean;
  parseHTML(data: string, context?: unknown, keepScripts?: boolean): Cheerio[];
}

declare module "react-native-cheerio" {
  export function load(html: string): CheerioAPI;
}
