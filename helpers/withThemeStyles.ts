import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";

export function withThemeStyles<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
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
