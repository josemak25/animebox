import { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

/**
 * Hook for tracking component layout dimensions and position.
 *
 * Provides a convenient way to get layout information (width, height, x, y)
 * when a component's layout changes. Useful for responsive design, animations,
 * or conditional rendering based on component size.
 *
 * @returns {Array} Tuple containing layout info and layout handler
 * @returns {LayoutRectangle | undefined} layout - Current layout dimensions
 * @returns {Function} onLayout - Handler to attach to component's onLayout prop
 *
 * @example
 * ```tsx
 * const [layout, onLayout] = useOnLayout();
 *
 * return (
 *   <View onLayout={onLayout}>
 *     {layout && (
 *       <Text>
 *         Size: {layout.width}x{layout.height}
 *       </Text>
 *     )}
 *   </View>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Using with conditional rendering
 * const [layout, onLayout] = useOnLayout();
 *
 * return (
 *   <View onLayout={onLayout}>
 *     {layout?.width > 400 ? (
 *       <WideLayout />
 *     ) : (
 *       <NarrowLayout />
 *     )}
 *   </View>
 * );
 * ```
 */
export const useOnLayout = () => {
  // State to store current layout information
  const [layout, setLayout] = useState<LayoutRectangle>();

  /**
   * Layout change handler - updates layout state with new dimensions
   * @param {LayoutChangeEvent} e - React Native layout change event
   */
  const onLayout = (e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout);

  // Return as const tuple for destructuring consistency
  return [layout, onLayout] as const;
};
