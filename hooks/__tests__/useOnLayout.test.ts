import { renderHook, act } from "@testing-library/react-hooks";
import { LayoutChangeEvent } from "react-native";

import { useOnLayout } from "../useOnLayout";

describe("useOnLayout", () => {
  it("should return undefined layout initially", () => {
    const { result } = renderHook(() => useOnLayout());
    const [layout] = result.current;
    expect(layout).toBeUndefined();
  });

  it("should update layout when onLayout is called", () => {
    const { result } = renderHook(() => useOnLayout());
    const [, onLayout] = result.current;
    const fakeEvent = {
      nativeEvent: {
        layout: { x: 10, y: 20, width: 100, height: 200 },
      },
    } as LayoutChangeEvent;
    act(() => {
      onLayout(fakeEvent);
    });
    const [layout] = result.current;
    expect(layout).toEqual({ x: 10, y: 20, width: 100, height: 200 });
  });
});
