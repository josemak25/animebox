const store: Record<string, string> = {};

export const getItem: jest.Mock<Promise<string | null>, [string]> = jest.fn(
  async (key: string) => {
    return store[key] ?? null;
  }
);

export const setItem: jest.Mock<Promise<void>, [string, string]> = jest.fn(
  async (key: string, value: string) => {
    store[key] = value;
  }
);

export const deleteItem: jest.Mock<Promise<void>, [string]> = jest.fn(
  async (key: string) => {
    delete store[key];
  }
);

export const getAllKeys: jest.Mock<Promise<string[]>, []> = jest.fn(
  async () => {
    return Object.keys(store);
  }
);

export const clear: jest.Mock<Promise<void>, []> = jest.fn(async () => {
  Object.keys(store).forEach((key) => delete store[key]);
});

const kvStore = {
  clear,
  getItem,
  setItem,
  deleteItem,
  getAllKeys,
};

export default kvStore;
