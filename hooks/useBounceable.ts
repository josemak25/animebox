import { useCallback } from "react";
import {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  WithSpringConfig,
} from "react-native-reanimated";

type BounceableParam = Partial<WithSpringConfig & { scaleInValue: number }>;

export function useBounceable({
  scaleInValue = 0.95,
  ...config
}: Partial<BounceableParam> = {}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleInValue, config);
  }, [scale, scaleInValue, config]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, config);
  }, [config, scale]);

  return {
    onPressIn,
    onPressOut,
    animatedStyle,
  };
}
