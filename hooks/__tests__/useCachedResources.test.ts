import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { renderHook } from "@testing-library/react-hooks";
import * as SplashScreen from "expo-splash-screen";

import { useCachedResources } from "../useCachedResources";
import { useMigrations } from "../useMigrations";

// Mock useMigrations locally (not in global setup)
jest.mock("../useMigrations", () => ({
  useMigrations: jest.fn(),
}));

const mockedUseMigrations = useMigrations as jest.Mock;
const mockUseFonts = useFonts as jest.Mock;

describe("useCachedResources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns appIsReady true when fonts and migrations are ready", async () => {
    mockUseFonts.mockReturnValue([true]);
    mockedUseMigrations.mockReturnValue({ success: true, error: null });
    const { result } = renderHook(() => useCachedResources());
    expect(result.current.appIsReady).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("returns appIsReady false if fonts are not loaded", () => {
    mockUseFonts.mockReturnValue([false]);
    mockedUseMigrations.mockReturnValue({ success: true, error: null });
    const { result } = renderHook(() => useCachedResources());
    expect(result.current.appIsReady).toBe(false);
  });

  it("returns appIsReady false if migrations are not successful", () => {
    mockUseFonts.mockReturnValue([true]);
    mockedUseMigrations.mockReturnValue({ success: false, error: null });
    const { result } = renderHook(() => useCachedResources());
    expect(result.current.appIsReady).toBe(false);
  });

  it("returns error if migrations error exists", () => {
    mockUseFonts.mockReturnValue([true]);
    mockedUseMigrations.mockReturnValue({
      success: false,
      error: new Error("Migration failed"),
    });
    const { result } = renderHook(() => useCachedResources());
    expect(result.current.error).toEqual(new Error("Migration failed"));
  });

  it("calls SplashScreen.hideAsync when fonts are loaded", async () => {
    mockUseFonts.mockReturnValue([true]);
    mockedUseMigrations.mockReturnValue({ success: true, error: null });
    renderHook(() => useCachedResources());
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });
});
