import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Inter_300Light } from "@expo-google-fonts/inter/300Light";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Inter_800ExtraBold } from "@expo-google-fonts/inter/800ExtraBold";
import { Inter_900Black } from "@expo-google-fonts/inter/900Black";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
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
    [FONTS.Inter300Light]: Inter_300Light,
    [FONTS.Inter400Regular]: Inter_400Regular,
    [FONTS.Inter500Medium]: Inter_500Medium,
    [FONTS.Inter600SemiBold]: Inter_600SemiBold,
    [FONTS.Inter700Bold]: Inter_700Bold,
    [FONTS.Inter800ExtraBold]: Inter_800ExtraBold,
    [FONTS.Inter900Black]: Inter_900Black,
    ...FontAwesome.font, // Load FontAwesome icons
    ...Ionicons.font, // Load Ionicons icons
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
