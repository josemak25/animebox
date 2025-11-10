import { jest } from "@jest/globals";
import type { ReactNode } from "react";
import * as RN from "react-native";
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

jest.mock("expo-blur", () => ({
  BlurView: ({ children }: { children: ReactNode }) => children,
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: "Medium" },
}));

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...(typeof actualNav === "object" ? actualNav : {}),
    DarkTheme: {},
    DefaultTheme: {},
    useNavigation: () => ({}),
    useTheme: () => ({ dark: false }),
    ThemeProvider: ({ children }: { children: ReactNode }) => children,
  };
});

jest.spyOn(RN, "useColorScheme").mockReturnValue("light");
jest.spyOn(RN, "useWindowDimensions").mockReturnValue({
  scale: 2,
  width: 375,
  height: 667,
  fontScale: 2,
});

jest.mock("@gorhom/bottom-sheet", () => ({
  BottomSheetBackdrop: () => null,
  BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
  BottomSheetModal: ({ children }: { children: React.ReactNode }) => children,
}));

// // Mock @expo-google-fonts/inter
jest.mock("@expo-google-fonts/inter/useFonts", () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}));

// Mock drizzle-orm
jest.mock("drizzle-orm/expo-sqlite", () => ({
  useLiveQuery: jest.fn().mockReturnValue({ data: [] }),
}));

jest.mock("drizzle-orm/expo-sqlite/migrator", () => ({
  useMigrations: jest.fn().mockReturnValue({
    success: true,
    error: null,
    pending: false,
  }),
}));

// Mock expo-drizzle-studio-plugin
jest.mock("expo-drizzle-studio-plugin", () => ({
  useDrizzleStudio: jest.fn(),
}));
