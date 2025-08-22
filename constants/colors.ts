const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export const LIGHT_MODE_COLORS = {
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  background: "#ffffff",
  backgroundSecondary: "#f5f5f5",
  backgroundTertiary: "#eeeeee",
  border: "#e0e0e0",
  borderLight: "#f0f0f0",
  tint: tintColorLight,
  tabIconDefault: "#cccccc",
  tabIconSelected: tintColorLight,
  primary: "#2f95dc",
  secondary: "#6c757d",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#17a2b8",
  card: "#ffffff",
  shadow: "#000000",
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const DARK_MODE_COLORS = {
  text: "#ffffff",
  textSecondary: "#cccccc",
  textMuted: "#999999",
  background: "#000000",
  backgroundSecondary: "#1a1a1a",
  backgroundTertiary: "#2a2a2a",
  border: "#333333",
  borderLight: "#444444",
  tint: tintColorDark,
  tabIconDefault: "#666666",
  tabIconSelected: tintColorDark,
  primary: "#4fa8e8",
  secondary: "#8e9aaf",
  success: "#3dd365",
  warning: "#ffda3a",
  error: "#ff4757",
  info: "#2ed573",
  card: "#1a1a1a",
  shadow: "#ffffff",
  overlay: "rgba(255, 255, 255, 0.1)",
};

export type Theme = typeof LIGHT_MODE_COLORS;

export default { light: LIGHT_MODE_COLORS, dark: DARK_MODE_COLORS };
