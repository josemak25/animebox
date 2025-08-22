import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useCachedResources } from "@/hooks/useCachedResources";
import { useTheme } from "@/hooks/useTheme";
import { ThemeProvider } from "@/providers/ThemeProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isDark, colorScheme } = useTheme();
  const { appIsReady } = useCachedResources();

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider initialColorScheme={colorScheme}>
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
