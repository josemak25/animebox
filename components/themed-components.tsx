import React, { useMemo } from "react";
import { TextStyle, Text as RNText, View as RNView } from "react-native";

import { withThemeStyles } from "@/helpers/withThemeStyles";

interface ThemedTextProps extends React.ComponentProps<typeof RNText> {
  variant?: "default" | "title" | "subtitle" | "caption" | "muted";
  color?: keyof ReturnType<typeof useStyles>["palette"];
}

interface ThemedViewProps extends React.ComponentProps<typeof RNView> {
  backgroundColor?: keyof ReturnType<typeof useStyles>["palette"];
}

export function ThemedText({
  style,
  color,
  variant = "default",
  ...rest
}: ThemedTextProps) {
  const { palette, ms } = useStyles();

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

  return (
    <RNText
      style={[textStyles[variant], { fontFamily: "SpaceMono" }, style]}
      {...rest}
    />
  );
}

export function ThemedView({
  style,
  backgroundColor,
  ...rest
}: ThemedViewProps) {
  const { palette } = useStyles();

  return (
    <RNView
      style={[
        { backgroundColor: palette[backgroundColor || "background"] },
        style,
      ]}
      {...rest}
    />
  );
}

const useStyles = withThemeStyles(() => ({}));
