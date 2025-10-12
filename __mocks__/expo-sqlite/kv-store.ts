/* global jest */

/**
 * This is a custom mock for expo-sqlite's key-value store to be used in tests.
 * It provides mock implementations for common key-value store methods.
 * You can extend this mock with more methods or custom behavior as needed.
 */

/**
 * In-memory store to simulate key-value storage.
 */
const store: Record<string, string> = {};

/**
 * Mock implementation for getItem method.
 * Retrieves the value from the in-memory store.
 */
export const getItem: jest.Mock<Promise<string | null>, [string]> = jest.fn(
  async (key: string) => {
    return store[key] ?? null;
  }
);

/**
 * Mock implementation for setItem method.
 * Stores the value in the in-memory store.
 */
export const setItem: jest.Mock<Promise<void>, [string, string]> = jest.fn(
  async (key: string, value: string) => {
    store[key] = value;
  }
);

/**
 * Mock implementation for deleteItem method.
 * Deletes the item from the in-memory store.
 */
export const deleteItem: jest.Mock<Promise<void>, [string]> = jest.fn(
  async (key: string) => {
    delete store[key];
  }
);

/**
 * Mock implementation for getAllKeys method.
 * Returns all keys currently stored in the in-memory store.
 */
export const getAllKeys: jest.Mock<Promise<string[]>, []> = jest.fn(
  async () => {
    return Object.keys(store);
  }
);

/**
 * Mock implementation for clear method.
 * Clears all items from the in-memory store.
 */
export const clear: jest.Mock<Promise<void>, []> = jest.fn(async () => {
  Object.keys(store).forEach((key) => delete store[key]);
});

/**
 * Mock implementation for getItemAsync method.
 * Retrieves the value from the in-memory store.
 */
export const getItemAsync: jest.Mock<
  Promise<string | null>,
  [string]
> = jest.fn(async (key: string) => {
  return store[key] ?? null;
});

/**
 * Mock implementation for setItemAsync method.
 * Stores the value in the in-memory store.
 */
export const setItemAsync: jest.Mock<Promise<void>, [string, string]> = jest.fn(
  async (key: string, value: string) => {
    store[key] = value;
  }
);

/**
 * Mock key-value store for testing purposes.
 * Provides asynchronous methods to get, set, delete, and clear items.
 */
const kvStore = {
  clear,
  getItem,
  setItem,
  deleteItem,
  getAllKeys,
  getItemAsync,
  setItemAsync,
};

// Default export for the mock module.
export default kvStore;
