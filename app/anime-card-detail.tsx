import React from "react";

import { withThemeStyles } from "@/helpers/withThemeStyles";

import { ThemedView, ThemedText } from "../components/themed-components";

function AnimeCardDetail() {
  const { styles } = useStyles();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>flying</ThemedText>
    </ThemedView>
  );
}

export default AnimeCardDetail;

/**
 * Provides themed styles for the Home screen.
 * Uses withThemeStyles HOC for theme integration.
 */
const useStyles = withThemeStyles(
  ({ palette, layout, colors, mvs, ms, insets }) => ({
    /* Overall container for the home screen */
    container: {
      flex: 1,
    },
  })
);
