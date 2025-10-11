import React, { useMemo } from "react";
import {
  View,
  ImageBackground,
  ViewStyle,
  Pressable,
  Dimensions,
  StyleSheet,
} from "react-native";

import { Bounceable } from "@/components/bounceable";
import { ThemedText } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

interface AnimeBookmarkCardProps {
  /**
   * Anime data object containing title, image, and other details
   */
  anime: IAnimeResult;
  /**
   * Callback when card is pressed
   */
  onPress?: () => void;
  /**
   * Callback when bookmark button is pressed
   */
  onBookmarkPress?: () => void;
  /**
   * Custom style for the card container
   */
  style?: ViewStyle;
}

const { width: screenWidth } = Dimensions.get("window");
const cardMargin = 10;
const cardWidth = (screenWidth - cardMargin * 6) / 3; // 3 columns with margins
const cardHeight = cardWidth * 1.4; // Maintain aspect ratio

/**
 * AnimeBookmarkCard - A compact anime card component for bookmark grid display.
 *
 * Displays only the anime thumbnail in a small card format, designed for 3 columns per row.
 * Features a subtle title overlay and bookmark indicator.
 *
 * @param {AnimeBookmarkCardProps} props - Card configuration and callbacks
 */
export const AnimeBookmarkCard: React.FC<AnimeBookmarkCardProps> = ({
  anime,
  onPress,
  onBookmarkPress,
  style,
}) => {
  const { styles } = useStyles();

  // Extract title from anime object
  const title = useMemo(() => {
    if (typeof anime.title === "string") {
      return anime.title;
    }
    return (
      anime.title?.english ||
      anime.title?.romaji ||
      anime.title?.userPreferred ||
      "Unknown Title"
    );
  }, [anime.title]);

  // Image source with fallback
  const imageSource = useMemo(() => {
    return anime.image || anime.cover || "";
  }, [anime.image, anime.cover]);

  return (
    <Bounceable
      // activeScale={0.95}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={styles.cardContainer}>
        <ImageBackground
          source={{ uri: imageSource }}
          style={styles.imageBackground}
          resizeMode="cover"
          accessibilityLabel={`${title} poster`}
        >
          {/* Gradient overlay for title readability */}
          <View style={styles.overlay} />

          {/* Title overlay at the bottom */}
          <View style={styles.titleContainer}>
            <ThemedText
              variant="caption"
              style={styles.title}
              numberOfLines={1}
            >
              {title}
            </ThemedText>
          </View>

          {/* Bookmark indicator */}
          <Pressable
            style={styles.bookmarkButton}
            onPress={onBookmarkPress}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${title} from bookmarks`}
          >
            <View style={styles.bookmarkIcon}>
              <ThemedText style={styles.bookmarkText}>♥</ThemedText>
            </View>
          </Pressable>
        </ImageBackground>
      </View>
    </Bounceable>
  );
};

const useStyles = withThemeStyles(({ palette, s, vs, ms }) => ({
  container: {
    margin: s(5),
  },
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: s(8),
    overflow: "hidden",
    backgroundColor: palette.senary,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  titleContainer: {
    left: 0,
    right: 0,
    bottom: -1,
    position: "absolute",
    paddingVertical: vs(6),
    paddingHorizontal: s(8),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    fontSize: ms(11),
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: ms(13),
  },
  bookmarkButton: {
    position: "absolute",
    top: s(8),
    right: s(8),
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkIcon: {
    width: s(16),
    height: s(16),
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkText: {
    fontSize: ms(12),
    color: "#FF6B6B",
    fontWeight: "bold",
  },
}));
