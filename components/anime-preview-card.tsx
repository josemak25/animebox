import React, { useMemo } from "react";
import {
  Text,
  ImageBackground,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import Svg, {
  Defs,
  Stop,
  Rect,
  LinearGradient as SVGLinearGradient,
} from "react-native-svg";

import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";
interface AnimePreviewCardProps {
  /**
   * Anime data object containing title, image, and other details
   */
  anime: IAnimeResult;
  /**
   * Season information (e.g., "Season 2")
   */
  season?: string;
  /**
   * Episode information (e.g., "Episode 8" or "Season 2 concludes Sept 3")
   */
  episode?: string;
  /**
   * Release or status information
   */
  releaseInfo?: string;
  /**
   * Optional short description or tagline
   */
  description?: string;
  /**
   * Callback when Play button is pressed
   */
  onPlay?: () => void;
  /**
   * Callback when Add to My List button is pressed
   */
  onAddToList?: () => void;
  /**
   * Whether the anime is already in the user's list
   */
  isInList?: boolean;
  /**
   * Optional badge text (e.g., "NEW", "TRENDING")
   */
  badge?: string;
  /**
   * Custom style for the card container
   */
  style?: ViewStyle;
}

/**
 * AnimePreviewCard - A featured anime card component with play and list actions.
 *
 * Displays anime artwork, title, season/episode info, and interactive buttons.
 * Follows the dark theme design pattern from the reference image.
 *
 * Features:
 * - Responsive design using react-native-size-matters
 * - Accessibility support for screen readers
 * - Haptic feedback on interactions
 * - Gradient overlay for text readability
 * - Error handling for image loading
 *
 * @param {AnimePreviewCardProps} props - Card configuration and callbacks
 * @example
 * <AnimePreviewCard
 *   anime={animeData}
 *   season="Season 2"
 *   episode="Episode 8"
 *   releaseInfo="Season 2 concludes Sept 3"
 *   onPlay={() => handlePlay()}
 *   onAddToList={() => handleAddToList()}
 * />
 */
export const AnimePreviewCard: React.FC<AnimePreviewCardProps> = ({
  anime,
  season,
  episode,
  releaseInfo,
  description,
  onPlay,
  onAddToList,
  isInList = false,
  badge,
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
    <ThemedView style={[styles.container, style]}>
      <ImageBackground
        source={{ uri: imageSource }}
        style={styles.imageBackground}
        resizeMode="cover"
        accessibilityLabel={`${title} poster`}
      >
        {/* Gradient overlay starting from the middle, darkening toward bottom */}
        <ThemedView style={styles.overlay}>
          <Svg width="100%" height="100%">
            <Defs>
              <SVGLinearGradient id="overlayGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000" stopOpacity={0} />
                <Stop offset="1" stopColor="#000" stopOpacity={1} />
              </SVGLinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#overlayGrad)"
            />
          </Svg>
        </ThemedView>

        {/* Badge */}
        {badge && (
          <ThemedView style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </ThemedView>
        )}

        {/* Content Container */}
        <ThemedView style={styles.contentContainer}>
          {/* Series Label */}
          {season && (
            <ThemedView style={styles.seriesLabel}>
              <Text style={styles.seriesText}>SERIES</Text>
            </ThemedView>
          )}

          {/* Title */}
          <ThemedText variant="title" style={styles.title}>
            {title}
          </ThemedText>

          {/* Season and Episode Info */}
          {(season || episode) && (
            <ThemedView style={styles.infoContainer}>
              {season && (
                <ThemedText variant="subtitle" style={styles.season}>
                  {season}
                </ThemedText>
              )}
              {episode && (
                <ThemedText variant="subtitle" style={styles.episode}>
                  {episode}
                </ThemedText>
              )}
            </ThemedView>
          )}

          {/* Description */}
          {description && (
            <ThemedText
              variant="default"
              style={styles.description}
              //   color="quaternary"
              numberOfLines={2}
            >
              {description}
            </ThemedText>
          )}

          {/* Release Info */}
          {releaseInfo && (
            <ThemedText
              variant="subtitle"
              style={styles.releaseInfo}
              //   color="quaternary"
            >
              ({releaseInfo})
            </ThemedText>
          )}

          {/* Action Buttons */}
          <ThemedView style={styles.actionContainer}>
            {/* Play Button */}
            <Bounceable
              style={styles.playButton}
              onPress={onPlay}
              accessibilityLabel={`Play ${title}`}
              accessibilityHint="Starts playing the anime"
            >
              <Text style={styles.playIcon}>▶</Text>
              <ThemedText
                variant="default"
                style={styles.playText}
                color="black"
              >
                Play
              </ThemedText>
            </Bounceable>

            {/* Add to List Button */}
            <Bounceable
              style={styles.listButton}
              onPress={onAddToList}
              accessibilityLabel={
                isInList ? `Remove ${title} from list` : `Add ${title} to list`
              }
              accessibilityHint={
                isInList ? "Removes from your list" : "Adds to your watch list"
              }
            >
              <Text style={styles.listIcon}>{isInList ? "✓" : "+"}</Text>
              <ThemedText
                variant="default"
                style={styles.listText}
                // color="white"
              >
                My List
              </ThemedText>
            </Bounceable>
          </ThemedView>
        </ThemedView>
      </ImageBackground>
    </ThemedView>
  );
};

const useStyles = withThemeStyles(({ palette, ms, s, vs, layout }) => ({
  container: {
    borderRadius: layout.radius * 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.senary,
    backgroundColor: palette.background,
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: vs(4),
    },
    shadowOpacity: 0.25,
    shadowRadius: ms(6),
    elevation: 8,
  } as ViewStyle,

  imageBackground: {
    width: "100%",
    height: vs(400),
    justifyContent: "flex-end",
  } as ImageStyle,

  overlay: {
    position: "absolute",
    top: vs(240),
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: "none",
  } as ViewStyle,

  badge: {
    position: "absolute",
    top: vs(16),
    right: s(16),
    backgroundColor: "#E50914",
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(4),
  } as ViewStyle,

  badgeText: {
    fontSize: ms(12),
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: palette.static_white,
  } as TextStyle,

  contentContainer: {
    padding: s(24),
    paddingBottom: vs(16),
    position: "relative",
    zIndex: 1,
  } as ViewStyle,

  seriesLabel: {
    marginBottom: vs(8),
  } as ViewStyle,

  seriesText: {
    color: palette.static_white,
    fontSize: ms(14),
    fontWeight: "bold",
    letterSpacing: 2,
  } as TextStyle,

  title: {
    fontSize: ms(36),
    fontWeight: "bold",
    lineHeight: ms(44),
    marginBottom: vs(2),
    textShadowRadius: 2,
    color: palette.static_white,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
  } as TextStyle,

  infoContainer: {
    gap: s(8),
    display: "flex",
    marginBottom: vs(4),
    alignItems: "center",
    flexDirection: "row",
    color: palette.static_white,
  } as ViewStyle,

  season: {
    fontSize: ms(16),
    fontWeight: "600",
    marginBottom: vs(4),
    color: palette.static_white,
  } as TextStyle,

  episode: {
    opacity: 1,
    fontSize: ms(14),
    color: palette.static_white,
  } as TextStyle,

  description: {
    fontSize: ms(14),
    lineHeight: ms(20),
    marginBottom: vs(8),
    color: palette.static_white,
  } as TextStyle,

  releaseInfo: {
    opacity: 1,
    fontSize: ms(14),
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: vs(10),
    color: palette.static_white,
  } as TextStyle,

  actionContainer: {
    flexDirection: "row",
    gap: s(12),
  } as ViewStyle,

  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.white,
    paddingHorizontal: s(24),
    paddingVertical: vs(6),
    borderRadius: ms(6),
    flex: 1,
    justifyContent: "center",
  } as ViewStyle,

  playIcon: {
    fontSize: ms(16),
    color: palette.black,
    marginRight: s(8),
  } as TextStyle,

  playText: {
    fontSize: ms(16),
    fontWeight: "600",
  } as TextStyle,

  listButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.black,
    paddingHorizontal: s(24),
    paddingVertical: vs(6),
    borderRadius: ms(6),
    flex: 1,
    justifyContent: "center",
  } as ViewStyle,

  listIcon: {
    fontSize: ms(20),
    color: palette.white,
    marginRight: s(8),
    fontWeight: "300",
  } as TextStyle,

  listText: {
    fontSize: ms(16),
    fontWeight: "400",
    color: palette.white,
  } as TextStyle,
}));
