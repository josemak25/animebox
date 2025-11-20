import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, ListRenderItem } from "react-native";

import { AnimeCard } from "@/components/anime-card";
import { AnimePreviewCard } from "@/components/anime-preview-card";
import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { AnimeInterface } from "@/db/schema";
import { withThemeStyles } from "@/helpers/withThemeStyles";
import { useLatestReleases } from "@/hooks/useLatestReleases";

/**
 * todays Top Picks anime data for testing and demonstration purposes.
 *
 * This represents the structure expected by AnimePreviewCard component.
 * In production, this would be fetched from an API or database.
 * The data follows the IAnimeResult interface with Netflix-style metadata.
 */

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { styles, mvs, layout, palette } = useStyles();
  const { data, error, isError, isLoading } = useLatestReleases();

  const renderItem: ListRenderItem<AnimeInterface> = useCallback(
    ({ item, index }) => {
      if (data.length - 1 === index && index % 2 !== 0) {
        return <ThemedView style={styles.emptyCardPlaceholder} />;
      }

      return (
        <AnimeCard
          anime={item}
          onPress={() =>
            router.push({
              pathname: "/anime-card-detail",
              params: { id: item.id }, // pass any details you need
            })
          }
        />
      );
    },
    [data.length, router, styles.emptyCardPlaceholder]
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

  /** Display error message if data fetching fails for featured */
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
    <FlatList
      data={data}
      numColumns={2}
      renderItem={renderItem}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.columnWrapperStyle}
      contentContainerStyle={[
        styles.contentContainerStyle,
        { paddingBottom: mvs(tabBarHeight + layout.gutter * 2) },
      ]}
      ListHeaderComponentStyle={styles.headerComponentStyle}
      ListHeaderComponent={
        data[0] ? (
          <AnimePreviewCard
            anime={data[0]}
            isInList={false}
            onPlay={() => {}}
            onAddToList={() => {}}
          />
        ) : null
      }
    />
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
    },

    /* Content container within the scroll view */
    contentContainerStyle: {
      flexGrow: 1,
      gap: mvs(12),
      paddingTop: mvs(insets.top),
      backgroundColor: palette.background,
      paddingHorizontal: ms(layout.gutter),
    },

    columnWrapperStyle: {
      gap: mvs(12),
    },

    /* Section container for future content areas */
    section: {
      paddingHorizontal: ms(20),
      paddingVertical: mvs(layout.gutter),
    },

    /* Section title styling for headers */
    sectionTitle: {
      fontSize: ms(15),
      fontWeight: "600",
      marginBottom: mvs(5),
      paddingHorizontal: ms(layout.gutter),
    },

    /* Placeholder text styling for empty states */
    placeholder: {
      textAlign: "center",
      paddingVertical: mvs(20),
    },

    /* emptyCardPlaceholder container styling for empty card */
    emptyCardPlaceholder: {
      flex: 1,
      opacity: 0,
    },

    /* Header component styling with bottom margin */
    headerComponentStyle: {
      marginBottom: mvs(layout.gutter),
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
