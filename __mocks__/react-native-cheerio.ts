// __mocks__/react-native-cheerio.ts

/**
 * Jest mock for the `react-native-cheerio` module.
 * Provides a type-safe, overload-compatible Cheerio API for unit testing.
 *
 * This mock is designed to simulate Cheerio's chaining and selector logic,
 * allowing tests to run without a DOM or real HTML parsing.
 */

/**
 * Helper to create a mock Cheerio instance with all common Cheerio methods stubbed.
 * Each method returns either a primitive, a mock value, or another mock Cheerio instance for chaining.
 *
 * @param selector - Optional selector string for context (used in some mock returns)
 * @returns {Cheerio} A fully mocked Cheerio instance
 */
function mockCheerioInstance(selector?: string): Cheerio {
  const instance: Cheerio = {
    length: 1,
    get: jest.fn(() => []),
    text: jest.fn(() => selector || ""),
    html: jest.fn(() => `<div>${selector || ""}</div>`),
    find: jest.fn(() => mockCheerioInstance()),
    first: jest.fn(() => mockCheerioInstance()),
    last: jest.fn(() => mockCheerioInstance()),
    eq: jest.fn(() => mockCheerioInstance()),
    each: jest.fn(() => instance),
    filter: jest.fn(() => mockCheerioInstance()),
    parent: jest.fn(() => mockCheerioInstance()),
    children: jest.fn(() => mockCheerioInstance()),
    siblings: jest.fn(() => mockCheerioInstance()),
    next: jest.fn(() => mockCheerioInstance()),
    prev: jest.fn(() => mockCheerioInstance()),
    remove: jest.fn(() => mockCheerioInstance()),
    toArray: jest.fn(() => []),
    val: jest.fn(() => undefined),
    css: jest.fn(() => undefined),
    hasClass: jest.fn(() => false),
    addClass: jest.fn(() => instance),
    removeClass: jest.fn(() => instance),
    toggleClass: jest.fn(() => instance),
    is: jest.fn(() => false),
    not: jest.fn(() => instance),
    closest: jest.fn(() => instance),
    clone: jest.fn(() => instance),
    data: jest.fn(() => ({})),
    /**
     * Mock for Cheerio's attr overloads:
     * - attr(name: string): string | undefined
     * - attr(): { [attr: string]: string } | undefined
     * Returns a string for a name, or a dummy object for no args.
     */
    attr: jest.fn((name?: string) => {
      if (typeof name === "string") return `${name}-value`;
      return { id: "id-value" };
    }) as Cheerio["attr"],
    /**
     * Mock for Cheerio's map method, supporting generic return types.
     * Always returns a new mock Cheerio instance.
     */
    map: jest.fn(
      <U>(fn: (i: number, el: unknown) => U) =>
        mockCheerioInstance() as unknown as Cheerio<U>
    ),
    [Symbol.iterator]: function* () {},
  };

  return instance;
}

/**
 * Creates a mock CheerioAPI function/object, as returned by `load`.
 * The returned function can be called as $(selector), and has Cheerio static methods attached.
 *
 * @param html - Optional HTML string for the root mock
 * @returns {CheerioAPI} A fully mocked CheerioAPI instance
 */
function createCheerioApiMock(html?: string): CheerioAPI {
  // The CheerioAPI type is both a function and an object
  const $ = ((selector?: string) =>
    mockCheerioInstance(selector)) as CheerioAPI;

  /**
   * Mocks Cheerio's static load method (recursive for test compatibility).
   */
  $.load = createCheerioApiMock as never;
  /**
   * Mocks Cheerio's static text method.
   */
  $.text = jest.fn(() => "");
  /**
   * Mocks Cheerio's static parseHTML method.
   */
  $.parseHTML = jest.fn(() => []);
  /**
   * Mocks Cheerio's static contains method.
   */
  $.contains = jest.fn(() => false);
  /**
   * Mocks Cheerio's static root method.
   */
  $.root = jest.fn(() => mockCheerioInstance());
  /**
   * Mocks Cheerio's static html method.
   */
  $.html = jest.fn(() => html || "<html></html>");

  return $;
}
/**
 * Exported mock for Cheerio's `load` function.
 * Use as: import { load } from 'react-native-cheerio';
 */
export const load = createCheerioApiMock;
