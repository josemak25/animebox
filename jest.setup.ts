/**
 * Jest Setup Configuration
 *
 * This file contains global mocks and setup configuration for all Jest tests.
 * It mocks external dependencies to ensure tests run in isolation without
 * requiring native modules or external services.
 *
 * Organization:
 * - Console suppression for cleaner test output
 * - Font loading mocks (Expo Font, Google Fonts)
 * - UI/UX mocks (Splash Screen, Haptics, Blur)
 * - Navigation mocks (React Navigation)
 * - Database mocks (Drizzle ORM)
 * - Platform mocks (React Native APIs)
 */

import { jest } from "@jest/globals";
import type { ReactNode } from "react";
import * as RN from "react-native";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

/**
 * Mock expo-font to prevent font loading during tests
 * Returns true to simulate successful font loading
 */
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
  useFonts: jest.fn().mockReturnValue([true]),
}));

/**
 * Mock expo-splash-screen to prevent native splash screen operations
 */
jest.mock("expo-splash-screen", () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

/**
 * Mock safe area context for consistent insets across test environments
 */
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

/**
 * Mock expo-blur to render children without blur effect during tests
 */
jest.mock("expo-blur", () => ({
  BlurView: ({ children }: { children: ReactNode }) => children,
}));

/**
 * Mock expo-haptics to prevent haptic feedback calls during tests
 * Provides all haptic feedback methods without triggering device vibrations
 */
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: "Medium" },
}));

/**
 * Mock React Navigation to provide navigation context without router
 * Includes theme providers and hooks used throughout the app
 */
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

/**
 * Mock React Native platform APIs with consistent test values
 * - useColorScheme: Always returns 'light' mode for consistent theming
 * - useWindowDimensions: Returns iPhone 8 dimensions (375x667) with 2x scale
 */
jest.spyOn(RN, "useColorScheme").mockReturnValue("light");
jest.spyOn(RN, "useWindowDimensions").mockReturnValue({
  scale: 2,
  width: 375,
  height: 667,
  fontScale: 2,
});

/**
 * Mock @gorhom/bottom-sheet to render children without sheet animations
 * Simplifies testing of components that use bottom sheet modals
 */
jest.mock("@gorhom/bottom-sheet", () => ({
  BottomSheetBackdrop: () => null,
  BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
  BottomSheetModal: ({ children }: { children: React.ReactNode }) => children,
}));

/**
 * Mock @expo-google-fonts/inter to simulate successful font loading
 * The useFonts hook returns [true] to indicate fonts are loaded
 */
jest.mock("@expo-google-fonts/inter/useFonts", () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}));

/**
 * Mock Drizzle ORM for database operations
 * - useLiveQuery: Returns empty data array for reactive queries
 * - useMigrations: Simulates successful database migrations
 */
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

/**
 * Mock expo-drizzle-studio-plugin to prevent studio initialization
 * Drizzle Studio is only needed during development, not in tests
 */
jest.mock("expo-drizzle-studio-plugin", () => ({
  useDrizzleStudio: jest.fn(),
}));
