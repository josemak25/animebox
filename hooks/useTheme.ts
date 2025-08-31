import { useContext } from "react";

import { ThemeContext, type DefaultTheme } from "@/providers/theme/provider";

/**
 * Hook for accessing the current theme context in React components.
 *
 * Provides access to theme colors, palette, layout, fonts, scaling functions, insets, and utility functions.
 * Must be used within a component tree wrapped by ThemeProvider.
 *
 * @returns {DefaultTheme} Theme context object
 * @returns {Object} colors - All color palettes for light and dark mode (`{ light, dark }`)
 * @returns {Object} palette - The active color palette (light or dark)
 * @returns {Object} layout - Theme layout values (e.g., `radius`, `gutter`, `screen`)
 * @returns {Object} insets - Safe area insets for the device
 * @returns {Object} fonts - Font variants used in the app
 * @returns {boolean} isDarkMode - Whether the current theme is dark mode
 * @returns {string} mode - The current color scheme ("light" | "dark")
 * @returns {Function} s - Scale horizontally (from react-native-size-matters)
 * @returns {Function} vs - Scale vertically (from react-native-size-matters)
 * @returns {Function} ms - Moderate scale (from react-native-size-matters)
 * @returns {Function} mvs - Moderate vertical scale (from react-native-size-matters)
 * @returns {Function} hexToRGB - Convert hex color to RGBA string
 * @returns {Function} adjustColorBrightness - Adjust color brightness by a factor
 *
 * @throws {Error} When used outside of ThemeProvider context
 *
 * @example
 * ```tsx
 * const { palette, layout, hexToRGB, isDarkMode } = useTheme();
 *
 * return (
 *   <View style={{
 *     backgroundColor: palette.background,
 *     padding: layout.gutter,
 *     borderColor: hexToRGB(palette.primary, 0.8)
 *   }}>
 *     <Text style={{ color: palette.text }}>
 *       Themed component (Dark mode: {isDarkMode ? 'Yes' : 'No'})
 *     </Text>
 *   </View>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Using with StyleSheet
 * const { palette, s, vs } = useTheme();
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: palette.background,
 *     borderColor: palette.senary,
 *     padding: s(16),
 *     marginVertical: vs(8),
 *   },
 *   text: {
 *     color: palette.text,
 *   }
 * });
 * ```
 */
export function useTheme(): DefaultTheme {
  // Access theme context from React context
  const context = useContext(ThemeContext);

  // Ensure hook is used within proper provider context
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  // Return theme context object
  return context;
}
