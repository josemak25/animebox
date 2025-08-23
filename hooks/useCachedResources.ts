import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";

import { FONTS } from "@/providers/theme/colors";

import { useMigrations } from "./useMigrations";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const useCachedResources = () => {
  const { success, error } = useMigrations();

  const [isLoaded] = useFonts({
    [FONTS.spaceMonoRegular]: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const onAppIsReady = useCallback(async () => {
    if (isLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  useEffect(() => {
    onAppIsReady();
  }, [isLoaded, onAppIsReady]);

  return { appIsReady: isLoaded && success, error };
};
