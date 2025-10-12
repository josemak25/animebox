import { renderHook, act } from "@testing-library/react-hooks";
import { AppState } from "react-native";

import { useAppState } from "../useAppState";

describe("useAppState", () => {
  let listeners: { [key: string]: Function[] } = {};
  const addEventListenerMock = jest.spyOn(AppState, "addEventListener");
  const removeMock = jest.fn();

  beforeEach(() => {
    listeners = {};
    AppState.currentState = "background";
    addEventListenerMock.mockImplementation((event, handler) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(handler);
      return { remove: removeMock };
    });
    removeMock.mockClear();
  });

  afterAll(() => {
    addEventListenerMock.mockRestore();
  });

  it("should call onForeground when app comes to foreground", () => {
    const onForeground = jest.fn();
    renderHook(() => useAppState({ onForeground }));
    act(() => {
      listeners["change"].forEach((fn) => fn("active"));
    });
    expect(onForeground).toHaveBeenCalled();
  });

  it("should call onBackground when app goes to background", () => {
    const onBackground = jest.fn();
    renderHook(() => useAppState({ onBackground }));
    act(() => {
      listeners["change"].forEach((fn) => fn("background"));
    });
    expect(onBackground).toHaveBeenCalled();
  });

  it("should call onChange on any state change", () => {
    const onChange = jest.fn();
    renderHook(() => useAppState({ onChange }));
    act(() => {
      listeners["change"].forEach((fn) => fn("inactive"));
    });
    expect(onChange).toHaveBeenCalledWith("inactive");
  });

  it("should clean up event listener on unmount", () => {
    const { unmount } = renderHook(() => useAppState({}));
    unmount();
    expect(removeMock).toHaveBeenCalled();
  });
});
