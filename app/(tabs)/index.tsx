import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
} from "react-native";

import { AnimePreviewCard } from "@/components/anime-preview-card";
import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";
import { useLatestReleases } from "@/hooks/useLatestReleases";

import { AnimeCard } from "../../components/anime-card";

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

/**
 * todays Top Picks anime data for testing and demonstration purposes.
 *
 * This represents the structure expected by AnimePreviewCard component.
 * In production, this would be fetched from an API or database.
 * The data follows the IAnimeResult interface with Netflix-style metadata.
 */
const todaysTopPicks: IAnimeResult[] = [
  {
    id: "one-piece-1",
    title: {
      english: "One Piece",
      romaji: "One Piece",
      userPreferred: "One Piece",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg",
    status: "Ongoing" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "1999",
    season: 1,
    episode: 50,
  },
  {
    id: "one-piece-2",
    title: {
      english: "One Piece",
      romaji: "One Piece",
      userPreferred: "One Piece",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg",
    status: "Ongoing" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "1999",
    season: 1,
    episode: 1100,
  },
  {
    id: "one-piece-3",
    title: {
      english: "One Piece",
      romaji: "One Piece",
      userPreferred: "One Piece",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg",
    status: "Ongoing" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "1999",
    season: 1,
    episode: 1460,
  },
  {
    id: "attack-on-titan-1",
    title: {
      english: "Attack on Titan",
      romaji: "Shingeki no Kyojin",
      userPreferred: "Attack on Titan",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg",
    status: "Completed" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "2013",
    season: 1,
    episode: 25,
  },
  {
    id: "spirited-away",
    title: {
      english: "Spirited Away",
      romaji: "Sen to Chihiro no Kamikakushi",
      userPreferred: "Spirited Away",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/199-H5uL7MdIbOPj.jpg",
    status: "Completed" as MediaStatus,
    rating: 9.3,
    type: "Movie" as MediaFormat,
    releaseDate: "2001",
    season: 1,
    episode: 1,
  },
];

export default function HomeScreen() {
  const { styles, mvs, layout, palette } = useStyles();
  const tabBarHeight = useBottomTabBarHeight();
  const { error, isError, isLoading } = useLatestReleases();

  const renderItem: ListRenderItem<IAnimeResult> = useCallback(
    ({ item }) => (
      <AnimeCard anime={item} onPress={() => handleAnimePress(item)} />
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

  const handleAnimePress = (anime: IAnimeResult) => {
    // TODO: Navigate to anime details page
    Alert.alert(
      "Anime Selected",
      `Selected: ${typeof anime.title === "string" ? anime.title : anime.title?.english || "Unknown"}`
    );
  };

  return (
    <FlatList
      numColumns={2}
      data={todaysTopPicks}
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
        <AnimePreviewCard
          isInList={false}
          onPlay={() => {}}
          onAddToList={() => {}}
          anime={sampleAnime as IAnimeResult}
        />
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
