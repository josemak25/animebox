/* global jest */
const mockAxios = jest.createMockFromModule("axios");

mockAxios.get = jest.fn();
mockAxios.put = jest.fn();
mockAxios.post = jest.fn();
mockAxios.patch = jest.fn();
mockAxios.delete = jest.fn();
mockAxios.create = jest.fn(() => mockAxios);
mockAxios.interceptors = { request: { use: jest.fn() } };
mockAxios.defaults = { adapter: undefined };

module.exports = mockAxios;
