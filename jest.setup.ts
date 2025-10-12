import { jest } from "@jest/globals";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

beforeAll(() => {
  const consoleFuncs = ["error", "warn"] as const;
  // Suppress console.error output during tests
  consoleFuncs.forEach((func) =>
    jest.spyOn(console, func).mockImplementation(() => {})
  );
});

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
  useFonts: jest.fn().mockReturnValue([true]),
}));

jest.mock("expo-splash-screen", () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
