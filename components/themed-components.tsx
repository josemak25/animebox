import React, { useMemo } from "react";
import {
  ViewStyle,
  TextStyle,
  Text as RNText,
  View as RNView,
} from "react-native";

import { withThemeStyles } from "@/helpers/withThemeStyles";

interface ThemedTextProps extends React.ComponentProps<typeof RNText> {
  variant?: "default" | "title" | "subtitle" | "caption" | "muted";
  color?: keyof ReturnType<typeof useStyles>["palette"];
}

interface ThemedViewProps extends React.ComponentProps<typeof RNView> {
  backgroundColor?: keyof ReturnType<typeof useStyles>["palette"];
}

/**
 * ThemedText - A text component with theme-based styles, font, and color variants.
 *
 * Implementation notes:
 * - Computes text styles for each variant using theme palette and scaling
 *
 * @param {ThemedTextProps} props - Accepts all RNText props plus variant and color.
 * @example
 * <ThemedText variant="title">Title</ThemedText>
 */
export function ThemedText({
  style,
  color,
  variant = "default",
  ...rest
}: ThemedTextProps) {
  const { styles, palette, ms } = useStyles();

  const textStyles: Record<
    NonNullable<ThemedTextProps["variant"]>,
    TextStyle
  > = useMemo(
    () => ({
      muted: { fontSize: ms(16), color: palette[color || "text"] },
      default: { fontSize: ms(16), color: palette[color || "text"] },
      caption: { fontSize: ms(14), color: palette[color || "quaternary"] },
      title: {
        fontSize: ms(24),
        fontWeight: "bold",
        color: palette[color || "text"],
      },
      subtitle: {
        fontSize: ms(18),
        fontWeight: "600",
        color: palette[color || "text"],
      },
    }),
    [color, ms, palette]
  );

  return <RNText style={[textStyles[variant], styles.text, style]} {...rest} />;
}

/**
 * ThemedView - A view component with theme-based background color.
 *
 * Implementation notes:
 * - Uses theme palette for background color
 * - Provides theme styles via withThemeStyles HOC
 *
 * @param {ThemedViewProps} props - Accepts all RNView props plus backgroundColor.
 * @example
 * <ThemedView backgroundColor="primary">...</ThemedView>
 */
export function ThemedView({
  style,
  backgroundColor,
  ...rest
}: ThemedViewProps) {
  const { palette } = useStyles();

  const bgStyle: ViewStyle = {
    backgroundColor: palette[backgroundColor || "background"],
  };

  return <RNView style={[bgStyle, style]} {...rest} />;
}

const useStyles = withThemeStyles(({ fonts }) => ({
  text: {
    fontFamily: fonts.variants.spaceMonoRegular,
  },
}));
