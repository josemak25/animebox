import axios, { AxiosAdapter } from "axios";

import { Proxy } from "../proxy";

describe("Proxy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Constructor", () => {
    it("should create a Proxy instance without configuration", () => {
      const proxy = new Proxy();
      expect(proxy).toBeInstanceOf(Proxy);
      expect(axios.create).toHaveBeenCalledTimes(1);
    });

    it("should create a Proxy instance with proxy configuration", () => {
      const proxyConfig: ProxyConfig = {
        key: "test-api-key",
        url: "https://proxy.example.com",
      };

      const proxy = new Proxy(proxyConfig);

      const setProxySpy = jest.spyOn(proxy, "setProxy");
      proxy.setProxy(proxyConfig);

      expect(proxy).toBeInstanceOf(Proxy);
      expect(axios.create).toHaveBeenCalledTimes(1);
      expect(setProxySpy).toHaveBeenCalledWith(proxyConfig);
    });

    it("should create a Proxy instance with custom adapter", () => {
      const mockAdapter: AxiosAdapter = jest.fn();
      const proxy = new Proxy(undefined, mockAdapter);

      expect(proxy).toBeInstanceOf(Proxy);
      expect(axios.create).toHaveBeenCalledTimes(1);
      expect(axios.defaults.adapter).toBe(mockAdapter);
    });

    it("should create a Proxy instance with both config and adapter", () => {
      const proxyConfig: ProxyConfig = {
        key: "test-key",
        url: "https://proxy.example.com",
      };

      const mockAdapter: AxiosAdapter = jest.fn();
      const proxy = new Proxy(proxyConfig, mockAdapter);

      const setProxySpy = jest.spyOn(proxy, "setProxy");
      proxy.setProxy(proxyConfig);

      expect(proxy).toBeInstanceOf(Proxy);
      expect(axios.create).toHaveBeenCalledTimes(1);
      expect(axios.defaults.adapter).toBe(mockAdapter);
      expect(setProxySpy).toHaveBeenCalledWith(proxyConfig);
    });
  });

  describe("setProxy", () => {
    let proxy: Proxy;

    beforeEach(() => {
      proxy = new Proxy();
    });

    it("should return early if proxyConfig is undefined", () => {
      const setProxySpy = jest.spyOn(proxy, "setProxy");

      expect(setProxySpy).not.toHaveBeenCalled();
      expect(axios.interceptors.request.use).not.toHaveBeenCalled();
    });

    it("should return early if proxyConfig.url is undefined", () => {
      proxy.setProxy({ key: "test-key" });

      const setProxySpy = jest.spyOn(proxy, "setProxy");
      expect(setProxySpy).not.toHaveBeenCalled();
      expect(axios.interceptors.request.use).not.toHaveBeenCalled();
    });

    it("should throw error for invalid single proxy URL", () => {
      const invalidConfig: ProxyConfig = {
        url: "invalid-url",
        key: "test-key",
      };

      expect(() => proxy.setProxy(invalidConfig)).toThrow(
        "Proxy URL is invalid!"
      );
    });

    it("should set up interceptor for valid single proxy URL", () => {
      const validConfig: ProxyConfig = {
        key: "test-api-key",
        url: "https://proxy.example.com",
      };

      const setProxySpy = jest.spyOn(proxy, "setProxy");
      proxy.setProxy(validConfig);

      expect(setProxySpy).toHaveBeenCalled();
      expect(setProxySpy).toHaveBeenCalledTimes(1);
      expect(axios.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("should throw error for invalid URL in array", () => {
      const invalidConfig: ProxyConfig = {
        key: "test-key",
        url: ["https://valid.com", "invalid-url", "https://another-valid.com"],
      };

      expect(() => proxy.setProxy(invalidConfig)).toThrow(
        "Proxy URL at index 1 is invalid!"
      );
    });
  });

  describe("setAxiosAdapter", () => {
    it("should set the axios adapter", () => {
      const proxy = new Proxy();
      const mockAdapter: AxiosAdapter = jest.fn();

      proxy.setAxiosAdapter(mockAdapter);

      expect(axios.defaults.adapter).toBe(mockAdapter);
    });
  });

  describe("rotateProxy", () => {
    let proxy: Proxy;

    beforeEach(() => {
      proxy = new Proxy();
    });

    it("should rotate proxy URLs at specified interval", () => {
      const urls = [
        "https://proxy1.com",
        "https://proxy2.com",
        "https://proxy3.com",
      ];

      const proxyConfig: ProxyConfig = {
        url: [...urls],
        key: "test-key",
        rotateInterval: 2000,
      };

      const setProxySpy = jest.spyOn(proxy, "setProxy");
      proxy.setProxy(proxyConfig);

      // Clear the initial setProxy call
      setProxySpy.mockClear();

      // Fast-forward time to trigger rotation
      jest.advanceTimersByTime(2000);

      expect(setProxySpy).toHaveBeenCalledWith({
        url: "https://proxy2.com",
        key: "test-key",
      });

      // Fast-forward again
      jest.advanceTimersByTime(2000);

      expect(setProxySpy).toHaveBeenCalledWith({
        url: "https://proxy3.com",
        key: "test-key",
      });

      // One more time to check it cycles back
      jest.advanceTimersByTime(2000);

      expect(setProxySpy).toHaveBeenCalledWith({
        url: "https://proxy1.com",
        key: "test-key",
      });
    });

    it("should use default rotation interval of 5000ms", () => {
      const urls = ["https://proxy1.com", "https://proxy2.com"];
      const proxyConfig: ProxyConfig = {
        url: [...urls],
        key: "test-key",
      };

      const setProxySpy = jest.spyOn(proxy, "setProxy");
      proxy.setProxy(proxyConfig);
      setProxySpy.mockClear();

      // Fast-forward by default interval
      jest.advanceTimersByTime(5000);

      expect(setProxySpy).toHaveBeenCalledWith({
        url: "https://proxy2.com",
        key: "test-key",
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle HTTP URLs", () => {
      const proxyConfig: ProxyConfig = {
        url: "http://insecure-proxy.com",
        key: "test-key",
      };

      expect(() => new Proxy(proxyConfig)).not.toThrow();
    });

    it("should reject URLs without protocol", () => {
      const proxyConfig: ProxyConfig = {
        url: "proxy.com",
        key: "test-key",
      };

      expect(() => new Proxy(proxyConfig)).toThrow("Proxy URL is invalid!");
    });

    it("should reject empty string URLs", () => {
      const proxyConfig: ProxyConfig = {
        url: "",
        key: "test-key",
      };

      const proxy = new Proxy();
      expect(() => proxy.setProxy(proxyConfig)).not.toThrow(); // Should return early
    });

    it("should handle mixed valid and invalid URLs in array", () => {
      const proxyConfig: ProxyConfig = {
        url: ["https://valid1.com", "invalid-url", "https://valid2.com"],
        key: "test-key",
      };

      expect(() => new Proxy(proxyConfig)).toThrow(
        "Proxy URL at index 1 is invalid!"
      );
    });
  });
});
