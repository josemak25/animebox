import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import React, {
  useMemo,
  useCallback,
  PropsWithChildren,
  createContext,
} from "react";
import {
  ColorSchemeName,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s, vs, ms, mvs } from "react-native-size-matters";

import { adjustColorBrightness, hexToRGB } from "@/helpers/color";

import {
  FONTS,
  DefaultTheme,
  DARK_MODE_COLORS,
  LIGHT_MODE_COLORS,
} from "./colors";

export const ThemeContext = createContext<DefaultTheme>({} as DefaultTheme);

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const systemTheme = useColorScheme();
  const dimension = useWindowDimensions();

  const isDarkMode = systemTheme === "dark";

  const toggleTheme = useCallback((_mode?: ColorSchemeName) => {
    // const theme = mode || isDarkMode ? IColorMode.LIGHT : IColorMode.DARK;
    // return settingsActions.changeColorMode(theme);
  }, []);

  const theme: DefaultTheme = useMemo(
    () => ({
      s,
      vs,
      ms,
      mvs,
      insets,
      hexToRGB,
      isDarkMode,
      toggleTheme,
      adjustColorBrightness,
      fonts: { variants: FONTS },
      layout: { radius: 8, gutter: 16, screen: dimension },
      palette: isDarkMode ? DARK_MODE_COLORS : LIGHT_MODE_COLORS,
      colors: { light: LIGHT_MODE_COLORS, dark: DARK_MODE_COLORS },
    }),
    [dimension, insets, isDarkMode, toggleTheme]
  );

  // useEffect(() => {
  //   if (systemTheme !== settings.colorMode) {
  //     toggleTheme(systemTheme);
  //   }
  // }, [systemTheme, settings.colorMode]);

  return (
    <ThemeContext.Provider value={theme}>
      <NavigationThemeProvider
        value={isDarkMode ? NavigationDarkTheme : NavigationDefaultTheme}
      >
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
};
