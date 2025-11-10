import React from "react";
import { FlatList, Image } from "react-native";

import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

/**
 * Episode interface
 * -----------------
 * Defines the structure for each episode item in the list.
 *
 * @property {string} id - Unique episode identifier.
 * @property {string} title - Episode title or name.
 * @property {string} duration - Length of the episode (e.g. "57m" or "1h 2m").
 * @property {string} image - URL for the episode’s preview thumbnail.
 * @property {number} season - Season number the episode belongs to.
 * @property {number} progress - Episode watch progress (0 to 1).
 */
interface Episode {
  id: string;
  title: string;
  duration: string;
  image: string;
  season: number;
  progress: number; // Progress percentage (0 → 1)
}

/**
 * Mock episode data for preview and testing.
 * In production, this would typically be fetched from an API or local database.
 */
const sampleEpisodes: Episode[] = [
  {
    id: "ep1",
    title: "1. This Wouldn’t Even Be a Podcast",
    duration: "57m",
    image: "https://picsum.photos/400/200?random=1",
    progress: 0.35,
    season: 3,
  },
  {
    id: "ep2",
    title: "2. Beep Beep Freaking Beep",
    duration: "1h",
    image: "https://picsum.photos/400/200?random=2",
    progress: 0.8,
    season: 3,
  },
  {
    id: "ep3",
    title: "3. Friends Can Dance",
    duration: "1h 5m",
    image: "https://picsum.photos/400/200?random=3",
    progress: 0,
    season: 3,
  },
  {
    id: "ep4",
    title: "4. The Bitch Is Back",
    duration: "1h 2m",
    image: "https://picsum.photos/400/200?random=4",
    progress: 1,
    season: 3,
  },
];

/**
 * SeasonalEpisodes Screen
 * ------------------------
 * Displays a list of episodes for a selected season.
 *
 * - Each episode is shown with its image, title, duration, and a Netflix-style progress bar.
 * - Uses `FlatList` for efficient rendering and scrolling.
 * - Uses `Bounceable` for subtle press animations.
 * - Adapts to app themes (light/dark) using `ThemedView` and `ThemedText`.
 *
 * Route params:
 * - title: (optional) title of the show passed through navigation.
 */
export default function SeasonalEpisodes() {
  const { styles } = useStyles();

  // Get current season number from first episode (fallback to 1)
  const seasonNumber = sampleEpisodes[0]?.season ?? 1;

  return (
    <ThemedView style={styles.container}>
      {/* 🏷 Header section - displays "Season X" */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          Season {seasonNumber}
        </ThemedText>
      </ThemedView>

      {/* 🎬 List of all episodes */}
      <FlatList
        data={sampleEpisodes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Bounceable
            style={styles.episodeCard}
            onPress={() => alert(`Playing ${item.title}`)}
          >
            {/* Thumbnail image with progress bar */}
            <ThemedView style={styles.imageWrapper}>
              <Image source={{ uri: item.image }} style={styles.episodeImage} />

              {/* ✅ Netflix-style progress bar overlay */}
              <ThemedView style={styles.progressContainer}>
                <ThemedView
                  style={[
                    styles.progressBar,
                    { width: `${item.progress * 100}%` },
                  ]}
                />
              </ThemedView>
            </ThemedView>

            {/* Episode title and duration info */}
            <ThemedView style={styles.episodeInfo}>
              <ThemedText style={styles.episodeTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.episodeDuration}>
                {item.duration}
              </ThemedText>
            </ThemedView>

            {/* ▶ Play icon */}
            <ThemedText style={styles.playIcon}>▶</ThemedText>
          </Bounceable>
        )}
      />
    </ThemedView>
  );
}

/**
 * useStyles
 * ----------
 * Theme-aware styles using dynamic scaling (s, vs, ms) and palette colors.
 * Automatically adapts padding and colors to current theme context.
 */
const useStyles = withThemeStyles(({ palette, s, vs, ms }) => ({
  /** Root container for the screen */
  container: {
    flex: 1,
    backgroundColor: palette.background,
    // paddingTop: mvs(insets.top), // Uncomment if you want to respect safe area
  },

  /** Header container for the "Season X" text */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    marginBottom: vs(12),
  },

  /** Header title text */
  headerTitle: {
    fontSize: ms(16),
    fontWeight: "bold",
  },

  /** Main list padding */
  listContent: {
    paddingHorizontal: s(16),
    paddingBottom: vs(100),
  },

  /** Each episode row container */
  episodeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(14),
  },

  /** Wrapper around episode image (for absolute progress bar) */
  imageWrapper: {
    position: "relative",
  },

  /** Thumbnail image styling */
  episodeImage: {
    width: s(120),
    height: vs(70),
    borderRadius: ms(6),
    backgroundColor: "#333",
  },

  /** Progress bar container positioned at image bottom */
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(3),
    backgroundColor: "rgba(255,255,255,0.2)", // Track background
    borderBottomLeftRadius: ms(6),
    borderBottomRightRadius: ms(6),
    overflow: "hidden",
  },

  /** Filled progress bar (foreground) */
  progressBar: {
    height: "100%",
    backgroundColor: "#e50914", // Netflix red
  },

  /** Episode info section (title + duration) */
  episodeInfo: {
    flex: 1,
    marginLeft: s(10),
  },

  /** Episode title */
  episodeTitle: {
    fontSize: ms(15),
    fontWeight: "600",
    color: palette.text,
  },

  /** Episode duration text (smaller and lighter) */
  episodeDuration: {
    fontSize: ms(13),
    color: "#aaa",
    marginTop: vs(2),
  },

  /** ▶ Play icon styling */
  playIcon: {
    fontSize: ms(20),
    color: palette.text,
    marginLeft: s(8),
  },
}));
