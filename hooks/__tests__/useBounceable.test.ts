import { act, renderHook } from "@testing-library/react-hooks";

import { useBounceable } from "../useBounceable";

describe("useBounceable", () => {
  it("returns handlers and animatedStyle", () => {
    const { result } = renderHook(() => useBounceable());
    expect(typeof result.current.onPressIn).toBe("function");
    expect(typeof result.current.onPressOut).toBe("function");
    expect(typeof result.current.animatedStyle).toBe("object");
  });

  it("calls onPressIn and onPressOut without error", () => {
    const { result } = renderHook(() => useBounceable({ scaleInValue: 0.8 }));
    act(() => {
      result.current.onPressIn();
      result.current.onPressOut();
    });
  });
});
