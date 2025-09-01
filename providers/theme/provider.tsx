import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import React, { useMemo, createContext, PropsWithChildren } from "react";
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
  DARK_MODE_COLORS,
  LIGHT_MODE_COLORS,
  type DefaultTheme,
} from "./colors";

export type { DefaultTheme }; // Exporting DefaultTheme type

export const ThemeContext = createContext<DefaultTheme>({} as DefaultTheme);

/**
 * ThemeProvider - Provides theme context and navigation theming for the app.
 *
 * Supplies a theme object (colors, fonts, layout, palette, etc.) to all children via React context,
 * and integrates with React Navigation's theme provider for consistent navigation theming.
 *
 * Implementation notes:
 * - Uses system color scheme to determine dark/light mode
 * - Exposes theme utilities (palette, fonts, layout, safe area insets, etc.)
 * - Wraps children with both ThemeContext and NavigationThemeProvider
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * @param children - React children to receive theme context
 */
export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const dimension = useWindowDimensions();
  const systemTheme = useColorScheme() as NonNullable<ColorSchemeName>;

  const isDarkMode = systemTheme === "dark";

  const theme: DefaultTheme = useMemo(
    () => ({
      s,
      vs,
      ms,
      mvs,
      insets,
      hexToRGB,
      isDarkMode,
      mode: systemTheme,
      adjustColorBrightness,
      fonts: { variants: FONTS },
      palette: isDarkMode ? DARK_MODE_COLORS : LIGHT_MODE_COLORS,
      layout: { radius: ms(8), gutter: ms(16), screen: dimension },
      colors: { light: LIGHT_MODE_COLORS, dark: DARK_MODE_COLORS },
    }),
    [dimension, insets, systemTheme, isDarkMode]
  );

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
