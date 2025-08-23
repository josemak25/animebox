import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useCachedResources } from "@/hooks/useCachedResources";
import { Providers } from "@/providers";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { appIsReady } = useCachedResources();

  if (!appIsReady) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}
