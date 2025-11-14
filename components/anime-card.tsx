import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { ImageBackground, ViewStyle } from "react-native";

import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

interface AnimeCardProps {
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

/**
 * AnimeCard - A compact anime card component for bookmark grid display.
 *
 * Displays only the anime thumbnail in a small card format, designed for 3 columns per row.
 * Features a subtle title overlay and bookmark indicator.
 *
 * @param {AnimeCardProps} props - Card configuration and callbacks
 */
export const AnimeCard: React.FC<AnimeCardProps> = ({
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
    <Bounceable onPress={onPress} style={[styles.container, style]}>
      <ImageBackground
        resizeMode="cover"
        source={{ uri: imageSource }}
        style={styles.imageBackground}
        accessibilityLabel={`${title} poster`}
      >
        <LinearGradient
          colors={["rgb(0, 0, 0,10)", "rgba(0,0,0,0)"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.overlay}
        />

        <ThemedView style={styles.titleContainer}>
          <ThemedText variant="caption" style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.subText}>Ss: {anime.season}</ThemedText>
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
