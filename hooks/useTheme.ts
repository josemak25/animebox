import { useContext } from "react";

import { ThemeContext } from "@/providers/theme/ThemeProvider";

/**
 * Hook for accessing the current theme context in React components.
 *
 * Provides access to theme colors, layout, and other design tokens.
 * Must be used within a component tree wrapped by ThemeProvider.
 *
 * @returns {Object} Theme context object
 * @returns {Object} colors - Theme color palette
 * @returns {Object} layout - Theme layout values
 * @returns {Object} typography - Theme typography settings
 *
 * @throws {Error} When used outside of ThemeProvider context
 *
 * @example
 * ```tsx
 * const { colors, layout, hexToRGB } = useTheme();
 *
 * return (
 *   <View style={{
 *     backgroundColor: colors.background,
 *     padding: layout.gutter,
 *     borderColor: hexToRGB(colors.primary, 0.8)
 *   }}>
 *     <Text style={{ color: colors.text }}>
 *       Themed component
 *     </Text>
 *   </View>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Using with StyleSheet
 * const { palette } = useTheme();
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: palette.background,
 *     borderColor: palette.border,
 *   },
 *   text: {
 *     color: palette.text,
 *   }
 * });
 * ```
 */
export function useTheme() {
  // Access theme context from React context
  const context = useContext(ThemeContext);

  // Ensure hook is used within proper provider context
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  // Return theme context object
  return context;
}
