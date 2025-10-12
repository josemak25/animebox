/* global jest */
const mockAxios = jest.createMockFromModule("axios");

/**
 * This is a custom mock for axios to be used in tests.
 * It provides mock implementations for common HTTP methods.
 * You can extend this mock with more methods or custom behavior as needed.
 */

/**
 * Mock implementation for axios.get method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.get = jest.fn();
/**
 * Mock implementation for axios.put method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.put = jest.fn();
/**
 * Mock implementation for axios.post method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.post = jest.fn();
/**
 * Mock implementation for axios.patch method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.patch = jest.fn();
/**
 * Mock implementation for axios.delete method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.delete = jest.fn();
/**
 * Mock implementation for axios.create method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.create = jest.fn(() => mockAxios);
/**
 * Mock implementation for axios.interceptors method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.interceptors = { request: { use: jest.fn() } };
/**
 * Mock implementation for axios.defaults method.
 * You can customize the behavior of this mock as needed for your tests.
 */
mockAxios.defaults = { adapter: undefined };

/**
 * Export the mocked axios instance.
 * This allows you to import axios in your tests and use the mocked methods.
 */
module.exports = mockAxios;
