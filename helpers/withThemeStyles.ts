import { useCallback, useMemo } from "react";
import { ScaledSize, StyleSheet, useWindowDimensions } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { s, vs, ms, mvs } from "react-native-size-matters";

import { useTheme } from "@/hooks";
import { adjustColorBrightness, hexToRGB } from "./color";
import { DARK_MODE_COLORS, LIGHT_MODE_COLORS, Theme } from "@/constants/colors";

type DefaultTheme = {
  palette: Theme;
  isDark: boolean;
  insets: EdgeInsets;
  dimension: ScaledSize;
  s: (size: number) => number;
  vs: (size: number) => number;
  colors: { light: Theme; dark: Theme };
  ms: (size: number, factor?: number) => number;
  mvs: (size: number, factor?: number) => number;
  hexToRGB: (hexColor: string, alpha?: number) => string;
  adjustColorBrightness: (hexColor: string, factor: number) => string;
  layout: { radius: number; gutter: number; screen: ScaledSize };
};

export function withThemeStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>
>(getStyles: (payload: DefaultTheme) => T): () => DefaultTheme & { styles: T } {
  return () => {
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const dimension = useWindowDimensions();

    const theme = useMemo(
      () => ({
        s,
        vs,
        ms,
        mvs,
        insets,
        isDark,
        hexToRGB,
        dimension,
        adjustColorBrightness,
        layout: { radius: 8, gutter: 16, screen: dimension },
        palette: isDark ? DARK_MODE_COLORS : LIGHT_MODE_COLORS,
        colors: { light: LIGHT_MODE_COLORS, dark: DARK_MODE_COLORS },
      }),
      [dimension, insets, isDark]
    );

    const styles = useMemo(
      () => StyleSheet.create(getStyles({ ...theme })),
      [theme]
    );

    return { ...theme, styles };
  };
}
