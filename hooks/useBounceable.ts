import { useCallback } from "react";
import {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  WithSpringConfig,
} from "react-native-reanimated";

/**
 * Configuration options for bounce animation
 * @typedef {Object} BounceableParam
 * @property {number} scaleInValue - Scale factor when pressed (default: 0.95)
 * @property {WithSpringConfig} ...config - Additional spring animation config
 */
type BounceableParam = Partial<WithSpringConfig & { scaleInValue: number }>;

/**
 * Hook for creating bounce animations on touch interactions.
 *
 * Provides smooth scale animations for press feedback using Reanimated.
 * Automatically handles press in/out states with spring animations.
 *
 * @param {BounceableParam} config - Animation configuration
 * @param {number} config.scaleInValue - Scale factor when pressed (0.0-1.0, default: 0.95)
 * @param {WithSpringConfig} config - Additional spring animation options
 *
 * @returns {Object} Animation handlers and styles
 * @returns {Function} onPressIn - Handler for press start
 * @returns {Function} onPressOut - Handler for press end
 * @returns {Object} animatedStyle - Animated style object for transform
 *
 * @example
 * ```tsx
 * const { onPressIn, onPressOut, animatedStyle } = useBounceable({
 *   scaleInValue: 0.9,
 *   damping: 15
 * });
 *
 * return (
 *   <Animated.View style={animatedStyle}>
 *     <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
 *       <Text>Press me!</Text>
 *     </TouchableOpacity>
 *   </Animated.View>
 * );
 * ```
 */
export function useBounceable({
  scaleInValue = 0.95,
  ...config
}: Partial<BounceableParam> = {}) {
  // Shared value for scale animation
  const scale = useSharedValue(1);

  // Create animated style that transforms based on scale value
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /**
   * Handles press start - scales down with spring animation
   */
  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleInValue, config);
  }, [scale, scaleInValue, config]);

  /**
   * Handles press end - scales back to normal with spring animation
   */
  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, config);
  }, [config, scale]);

  return {
    onPressIn,
    onPressOut,
    animatedStyle,
  };
}
