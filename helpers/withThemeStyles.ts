import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";

export function withThemeStyles<T extends StyleSheet.NamedStyles<T>>(
  getStyles: (payload: ReturnType<typeof useTheme>) => T
): () => ReturnType<typeof useTheme> & { styles: T } {
  return () => {
    const theme = useTheme();

    const styles = useMemo(
      () => StyleSheet.create(getStyles({ ...theme })),
      [theme]
    );

    return { ...theme, styles };
  };
}
