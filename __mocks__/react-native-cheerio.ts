// __mocks__/react-native-cheerio.ts

// Helper to create a mock Cheerio instance
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
    attr: jest.fn((name?: string) => {
      if (typeof name === "string") return `${name}-value`;
      return { id: "id-value" };
    }) as Cheerio["attr"],
    map: jest.fn(
      <U>(fn: (i: number, el: unknown) => U) =>
        mockCheerioInstance() as unknown as Cheerio<U>
    ),
    [Symbol.iterator]: function* () {},
  };

  return instance;
}

// Main CheerioAPI mock
function createCheerioApiMock(html?: string): CheerioAPI {
  // The CheerioAPI type is both a function and an object
  const $ = ((selector?: string) =>
    mockCheerioInstance(selector)) as CheerioAPI;

  $.load = createCheerioApiMock as never;
  $.text = jest.fn(() => "");
  $.parseHTML = jest.fn(() => []);
  $.contains = jest.fn(() => false);
  $.root = jest.fn(() => mockCheerioInstance());
  $.html = jest.fn(() => html || "<html></html>");

  return $;
}

export const load = createCheerioApiMock;
