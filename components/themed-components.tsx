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
  const { ms, fonts, layout, styles, palette } = useStyles();

  const textStyles: Record<
    NonNullable<ThemedTextProps["variant"]>,
    TextStyle
  > = useMemo(
    () => ({
      /** Styles for the muted variant */
      muted: { fontSize: ms(layout.gutter), color: palette[color || "text"] },
      /** Styles for the default variant */
      default: { fontSize: ms(layout.gutter), color: palette[color || "text"] },
      /** Styles for the caption variant */
      caption: { fontSize: ms(14), color: palette[color || "quaternary"] },
      /** Styles for the title variant */
      title: {
        fontSize: ms(24),
        fontWeight: "700",
        color: palette[color || "text"],
        fontFamily: fonts.variants.Inter700Bold,
      },
      /** Styles for the subtitle variant */
      subtitle: {
        fontSize: ms(18),
        fontWeight: "500",
        color: palette[color || "text"],
        fontFamily: fonts.variants.Inter500Medium,
      },
    }),
    [ms, layout.gutter, palette, color, fonts.variants]
  );

  return <RNText style={[styles.text, textStyles[variant], style]} {...rest} />;
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
  /** Common text styles for ThemedText */
  text: {
    fontFamily: fonts.variants.Inter400Regular,
  },
}));
