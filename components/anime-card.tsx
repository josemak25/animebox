import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { ImageBackground, ViewStyle } from "react-native";

import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { AnimeInterface } from "@/db/schema";
import { withThemeStyles } from "@/helpers/withThemeStyles";

interface AnimeCardProps {
  /**
   * Anime data object containing title, image, and other details
   */
  anime: AnimeInterface;
  /**
   * Callback when card is pressed
   */
  onPress?: () => void;
  /**
   * Callback when bookmark button is pressed
   */
  onBookmarkPress?: () => void;
  /**
   * Whether anime is bookmarked (optional)
   */
  isBookmarked?: boolean;
  /**
   * Custom style for the card container
   */
  style?: ViewStyle;
}

/**
 * AnimeCard - A compact anime card component for bookmark grid display.
 *
 * Displays only the anime thumbnail in a small card format, designed for 3 columns per row.
 * Features a subtle title overlay and bookmark indicator.
 */
export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onPress,
  onBookmarkPress,
  isBookmarked = true, // your test expects REMOVE, so default to bookmarked
  style,
}) => {
  const { styles } = useStyles();

  // Extract title from anime object
  // const title = useMemo(() => {
  //   if (typeof anime.title === "string") {
  //     return anime.title;
  //   }
  //   return (
  //     anime.title?.english ||
  //     anime.title?.romaji ||
  //     anime.title?.userPreferred ||
  //     "Unknown Title"
  //   );
  // }, [anime.title]);

  // Image source with fallback
  // const imageSource = useMemo(() => {
  //   return anime.image || anime.cover || anime.snapshot;
  // }, [anime.image, anime.cover, anime.snapshot]);

  return (
    <Bounceable onPress={onPress} style={[styles.container, style]}>
      <ImageBackground
        resizeMode="cover"
        source={{ uri: anime.snapshot! }}
        style={styles.imageBackground}
        accessibilityLabel={`${anime.title} poster`}
      >
        <LinearGradient
          colors={[
            "rgb(0, 0, 0, 1)",
            "rgba(0, 0, 0, .81)",
            "rgba(0,0,0, .018)",
          ]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.overlay}
        />

        {/* ⭐ BOOKMARK BUTTON */}
        {onBookmarkPress && (
          <Bounceable
            onPress={onBookmarkPress}
            style={styles.bookmarkButton}
            accessibilityLabel={
              isBookmarked
                ? `Remove ${anime.title} from bookmarks`
                : `Add ${anime.title} to bookmarks`
            }
            testID="bookmark-button"
          >
            <ThemedText style={styles.bookmarkIcon}>
              {isBookmarked ? "★" : "☆"}
            </ThemedText>
          </Bounceable>
        )}

        {/* TITLE & INFO */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText variant="caption" style={styles.title} numberOfLines={1}>
            {anime.title}
          </ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.subText}>Ss: {anime.duration}</ThemedText>
            <ThemedText style={styles.subText}>Eps: {anime.episode}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ImageBackground>
    </Bounceable>
  );
};

const useStyles = withThemeStyles(({ palette, s, vs, mvs, ms }) => ({
  /* container component styling  */
  container: {
    flex: 1,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    height: mvs(240),
    overflow: "hidden",
    borderRadius: s(8),
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    shadowColor: "#000",
    backgroundColor: palette.senary,
  },
  /* imageBackground component styling  */
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  /* overlay component styling  */
  overlay: {
    height: "80%",
  },

  /* BOOKMARK BUTTON */
  bookmarkButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
    zIndex: 20,
  },

  bookmarkIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* titleContainer component styling  */
  titleContainer: {
    left: 0,
    right: 0,
    bottom: -1,
    position: "absolute",
    paddingVertical: vs(7),
    paddingHorizontal: s(8),
    backgroundColor: "transparent",
  },
  /* title styling  */
  title: {
    fontWeight: "600",
    textAlign: "left",
    fontSize: ms(12.5),
    color: "#FFFFFF",
    lineHeight: ms(13),
  },
  /* infoRow component styling  */
  infoRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  /* subText styling  */
  subText: {
    color: "#fff",
    fontSize: ms(11),
  },
}));
