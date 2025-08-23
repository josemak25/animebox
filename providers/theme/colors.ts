import { ScaledSize } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import type { s, vs, ms, mvs } from "react-native-size-matters";

// All app colorss
export const LIGHT_MODE_COLORS = {
  red: "#FF0000",
  text: "#25292E",
  blue: "#2C1FA3",
  white: "#FFFFFF",
  black: "#000000",
  purple: "#755BDF",
  success: "#34C759",
  warning: "#FF9500",
  background: "#FFFFFF",
  light_blue: "#007AFF",
  destructive: "#FF3B30",
  transparent: "transparent",
  senary: "rgba(37, 41, 46, 0.2)", // hex text with opacity
  septenary: "rgba(37, 41, 46, 0.1)", // hex text with opacity
  quaternary: "rgba(37, 41, 46, 0.4)", // hex text with opacity
};

export const DARK_MODE_COLORS = {
  red: "#FF0000",
  text: "#FFFFFF",
  blue: "#2C1FA3",
  white: "#000000",
  black: "#FFFFFF",
  purple: "#755BDF",
  success: "#34C759",
  warning: "#FF9500",
  background: "#1A1B1F",
  light_blue: "#007AFF",
  destructive: "#FF3B30",
  transparent: "transparent",
  senary: "rgba(255, 255, 255, 0.2)", // hex white with opacity
  septenary: "rgba(255, 255, 255, 0.1)", // hex white with opacity
  quaternary: "rgba(255, 255, 255, 0.4)", // hex white with opacity
};

// All app font sizes
export enum FONTS {
  spaceMonoLight = "sf_pro_rounded_light",
  spaceMonoMedium = "sf_pro_rounded_medium",
  spaceMonoRegular = "sf_pro_rounded_regular",
  spaceMonoSemibold = "sf_pro_rounded_semibold",
}

export interface DefaultTheme {
  // App dimension
  layout: {
    radius: number;
    gutter: number;
    screen: ScaledSize;
  };
  // App insets
  insets: EdgeInsets;
  // All Global App Font typings
  fonts: {
    variants: typeof FONTS;
  };
  // App dark mode condition
  isDarkMode: boolean;
  // Toggle App theme
  toggleTheme: (theme?: keyof DefaultTheme["colors"]) => void;
  // Scale app horizontally and vertically
  s: typeof s;
  // Scale app vertically
  vs: typeof vs;
  // Scale app moderately on both vertical and horizontal axis
  ms: typeof ms;
  // Scale app moderately on both vertical axis
  mvs: typeof mvs;
  // All Global App palette typings
  palette: typeof DARK_MODE_COLORS | typeof LIGHT_MODE_COLORS;
  // All Global App colors typings
  colors: { light: typeof LIGHT_MODE_COLORS; dark: typeof DARK_MODE_COLORS };
  // App color converter
  hexToRGB: (hexColor: string, alpha?: number | undefined) => string;
  // App color brightness adjuster
  adjustColorBrightness: (hexColor: string, factor: number) => string;
}
