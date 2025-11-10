import { renderHook } from "@testing-library/react-hooks";
import React, { useContext } from "react";

import {
  HeadlessBrowserProvider,
  HeadlessBrowserContext,
} from "@/providers/headless-browser/provider";

describe("HeadlessBrowserProvider", () => {
  it("exposes headless browser context with expected API", () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <HeadlessBrowserProvider>{children}</HeadlessBrowserProvider>
    );

    const { result } = renderHook(() => useContext(HeadlessBrowserContext), {
      wrapper,
    });

    expect(result.current).toBeDefined();
    expect(typeof result.current.loadPage).toBe("function");
    expect(typeof result.current.isLoading).toBe("boolean");
    expect(typeof result.current.isSuccess).toBe("boolean");
    expect(typeof result.current.isError).toBe("boolean");
  });
});
