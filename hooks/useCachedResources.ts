import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";

import { FONTS } from "@/providers/theme/colors";

import { useMigrations } from "./useMigrations";

// Prevent splash screen from auto-hiding during resource loading
SplashScreen.preventAutoHideAsync();

/**
 * Hook for loading and caching essential app resources.
 *
 * Handles the complete app initialization process including:
 * - Font loading (custom fonts and FontAwesome)
 * - Database migrations
 * - Splash screen management
 *
 * @returns {Object} Resource loading state
 * @returns {boolean} appIsReady - True when all resources are loaded and migrations successful
 * @returns {Error|null} error - Any error that occurred during loading
 *
 * @example
 * ```tsx
 * const { appIsReady, error } = useCachedResources();
 *
 * if (!appIsReady) {
 *   return <AppLoading />;
 * }
 *
 * if (error) {
 *   return <ErrorScreen error={error} />;
 * }
 *
 * return <App />;
 * ```
 */
export const useCachedResources = () => {
  // Check database migration status
  const { success, error } = useMigrations();

  // Load fonts asynchronously
  const [isLoaded] = useFonts({
    [FONTS.spaceMonoRegular]: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  /**
   * Callback to hide splash screen when app is ready
   * Ensures smooth transition from splash to app content
   */
  const onAppIsReady = useCallback(async () => {
    if (isLoaded) {
      // Hide splash screen immediately to prevent blank screen
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  // Trigger splash screen hiding when fonts are loaded
  useEffect(() => {
    onAppIsReady();
  }, [isLoaded, onAppIsReady]);

  return {
    appIsReady: isLoaded && success, // App is ready when fonts loaded AND migrations successful
    error, // Pass through any migration errors
  };
};
