import * as Haptics from "expo-haptics";
import React, {
  useMemo,
  ComponentClass,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import { Pressable, PressableProps, TouchableOpacityProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

import { useBounceable } from "@/hooks/useBounceable";

type AnimatedComponentType<P> = ComponentClass<P> | FunctionComponent<P>;

type AnimatedComponentProps<P = PressableProps | TouchableOpacityProps> = {
  createAnimatedComponent?: AnimatedComponentType<P>;
};

type BounceableProps = Omit<
  AnimatedProps<PressableProps | TouchableOpacityProps>,
  "children"
> & {
  isBounceable?: boolean;
  isWithHaptics?: boolean;
  animationProps?: Parameters<typeof useBounceable>[0];
} & AnimatedComponentProps;

/**
 * Bounceable - A Pressable/Touchable wrapper with bounce animation and optional haptics.
 *
 * Provides a reusable animated button-like component for React Native, with:
 * - Bounce animation on press (using react-native-reanimated)
 * - Optional haptic feedback (using expo-haptics)
 * - Accessibility role/label support
 * - Can wrap any Pressable or Touchable component
 *
 * Implementation notes:
 * - Controls animation, haptics, and underlying component
 * - Memoizes the animated component to avoid recreation on every render
 * - Handles press, press-in, and press-out events for animation and haptics
 * - Renders the animated component with all props, accessibility, and animation
 *
 * @example
 * <Bounceable onPress={...}>Click me</Bounceable>
 *
 * @param {BounceableProps} props - See type for all options.
 */
const BounceableComponent: React.FC<PropsWithChildren<BounceableProps>> = ({
  style,
  onPress,
  children,
  onPressIn,
  onPressOut,
  animationProps,
  isBounceable = true,
  isWithHaptics = true,
  createAnimatedComponent = Pressable,
  ...rest
}) => {
  const {
    animatedStyle,
    onPressIn: animatedOnPressIn,
    onPressOut: animatedOnPressOut,
  } = useBounceable(animationProps);

  const AnimatedComponent = useMemo(() => {
    // Type-safe creation of animated component
    return Animated.createAnimatedComponent(
      createAnimatedComponent as React.ComponentType<
        PressableProps | TouchableOpacityProps
      >
    );
  }, [createAnimatedComponent]);

  const handlePress: typeof onPress = (e) => {
    if (isWithHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    //@ts-ignore
    onPress?.(e);
  };

  const handlePressIn: typeof onPressIn = (e) => {
    if (isBounceable) {
      animatedOnPressIn();
    }
    //@ts-ignore
    onPressIn?.(e);
  };

  const handlePressOut: typeof onPressOut = (e) => {
    if (isBounceable) {
      animatedOnPressOut();
    }
    //@ts-ignore
    onPressOut?.(e);
  };

  return (
    <AnimatedComponent
      {...rest}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      disabled={rest?.disabled || !onPress}
      accessibilityRole={onPress ? "button" : "none"}
      accessibilityLabel={
        rest?.accessibilityLabel ||
        (typeof children === "string" ? children : undefined)
      }
    >
      {children}
    </AnimatedComponent>
  );
};

export const Bounceable = React.memo(BounceableComponent);
