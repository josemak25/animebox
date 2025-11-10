import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, ListRenderItem } from "react-native";

import { AnimePreviewCard } from "@/components/anime-preview-card";
import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";
import { useLatestReleases } from "@/hooks/useLatestReleases";

/**
 * Sample anime data for testing and demonstration purposes.
 *
 * This represents the structure expected by AnimePreviewCard component.
 * In production, this would be fetched from an API or database.
 * The data follows the IAnimeResult interface with Netflix-style metadata.
 */
const sampleAnime = {
  id: "wednesday-2022",
  title: "Wednesday",
  image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
  cover:
    "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
  status: "Completed",
  rating: 8.1,
  type: "TV",
  releaseDate: "2022",
};

export default function HomeScreen() {
  const { styles, palette } = useStyles();
  const { error, isError, isLoading } = useLatestReleases();

  const renderItem: ListRenderItem<IAnimeResult> = useCallback(
    ({ item }) => (
      <AnimePreviewCard
        anime={item}
        isInList={false}
        onPlay={() => {}}
        onAddToList={() => {}}
      />
    ),
    []
  );

  /** Display loading indicator while fetching data */
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="small" color={palette.text} />
        <ThemedText variant="caption" style={styles.placeholder}>
          Loading latest releases...
        </ThemedText>
      </ThemedView>
    );
  }

  /** Display error message if data fetching fails */
  if (isError) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ThemedText variant="caption" style={styles.placeholder}>
          Error: {error?.message || "Failed to load latest releases."}
        </ThemedText>

        <Bounceable onPress={() => {}} style={styles.retryButton}>
          <ThemedText variant="caption" style={styles.retryText}>
            Try Again
          </ThemedText>
        </Bounceable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={[]}
        renderItem={renderItem}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponentStyle={styles.headerComponentStyle}
        ListHeaderComponent={
          <AnimePreviewCard
            isInList={false}
            onPlay={() => {}}
            onAddToList={() => {}}
            anime={sampleAnime as IAnimeResult}
          />
        }
      />
    </ThemedView>
  );
}

// Set display name for debugging
HomeScreen.displayName = "HomeScreen";

/**
 * Provides themed styles for the Home screen.
 * Uses withThemeStyles HOC for theme integration.
 */
const useStyles = withThemeStyles(
  ({ palette, layout, colors, mvs, ms, insets }) => ({
    /* Overall container for the home screen */
    container: {
      flex: 1,
      paddingTop: mvs(insets.top),
      backgroundColor: palette.background,
    },

    /* Scrollable area for all home screen content */
    scrollView: {
      flex: 1,
    },

    /* Content container within the scroll view */
    contentContainerStyle: {
      flexGrow: 1,
      paddingHorizontal: ms(layout.gutter),
    },

    /* Section container for future content areas */
    section: {
      paddingHorizontal: ms(20),
      paddingVertical: mvs(layout.gutter),
    },

    /* Section title styling for headers */
    sectionTitle: {
      fontSize: ms(22),
      fontWeight: "600",
      marginBottom: mvs(12),
    },

    /* Placeholder text styling for empty states */
    placeholder: {
      textAlign: "center",
      paddingVertical: mvs(20),
    },

    /* Header component styling with bottom margin */
    headerComponentStyle: {
      marginHorizontal: mvs(layout.gutter / 2),
    },

    /* Centered loading indicator container */
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
    },

    /* Retry button text styling */
    retryText: {
      color: colors.light.white,
    },

    /* Retry button styling */
    retryButton: {
      backgroundColor: palette.light_blue,
      borderRadius: ms(layout.gutter / 2),
      paddingVertical: mvs(layout.gutter / 2),
      paddingHorizontal: mvs(layout.gutter * 1.2),
    },
  })
);
