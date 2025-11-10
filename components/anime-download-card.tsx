import React from "react";
import { Image, ViewStyle } from "react-native";

import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

import { Bounceable } from "./bounceable";

/**
 * Interface defining the props accepted by the DownloadCard component.
 *
 * - The title of the show or movie.
 *  - Optional text below the title (e.g., "1 Episode" or "18+").
 *  - Status label such as "Downloading..." or "Failed!".
 * - URL for the card's thumbnail image.
 * - Whether there’s an error or failed download state.
 * - Whether the show contains multiple episodes/seasons.
 * - Current download progress (0–1 scale).
 * - Function executed when the card is tapped.
 */
export interface DownloadCardProps {
  title: string;
  subtitle?: string;
  status?: string;
  image: string;
  hasError?: boolean;
  seasonal?: boolean;
  progress?: number;
  onPress?: () => void;
}

/**
 * DownloadCard - A reusable component representing a single download item.
 *
 * Renders a card showing:
 * - Thumbnail image (stacked for seasonal shows)
 * - Download progress bar (Netflix style)
 * - Title, subtitle, and status
 * - Icon showing either "▶" for playable or ">" for seasonal content
 *
 * This component is designed for the "Downloads" screen and is fully theme-aware.
 *
 * @example
 * <DownloadCard
 *   title="Ginny & Georgia"
 *   subtitle="1 Episode"
 *   status="Failed!"
 *   image="https://example.com/image.jpg"
 *   seasonal={true}
 *   progress={0.6}
 *   onPress={() => alert('Opening...')}
 * />
 */
export const DownloadCard: React.FC<DownloadCardProps> = ({
  title,
  subtitle,
  status,
  image,
  hasError,
  seasonal,
  progress = 0,
  onPress,
}) => {
  const { styles } = useStyles();

  return (
    <Bounceable
      onPress={onPress}
      style={styles.cardContainer}
      accessibilityLabel={`Open ${title}`}
    >
      {seasonal ? (
        <ThemedView style={styles.stackWrapper}>
          <ThemedView style={[styles.stackLayer, styles.layer3]} />
          <ThemedView style={[styles.stackLayer, styles.layer2]} />

          <ThemedView style={styles.topLayer}>
            <Image source={{ uri: image }} style={styles.cardImage} />

            <ThemedView style={styles.progressContainer}>
              <ThemedView
                style={[styles.progressBar, { width: `${progress * 100}%` }]}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.cardImage} />

          <ThemedView style={styles.progressContainer}>
            <ThemedView
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.cardInfo}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>

        {subtitle && (
          <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
        )}

        {status ? (
          <ThemedText style={styles.cardStatus}>{status}</ThemedText>
        ) : null}
      </ThemedView>

      {hasError && (
        <ThemedText style={styles.playIcon}>{seasonal ? ">" : "▶"}</ThemedText>
      )}
    </Bounceable>
  );
};

/**
 * useStyles - A theme-aware style sheet generator.
 *
 * Adapts spacing, colors, and typography dynamically using the current theme.
 * Includes styling for:
 * - Layout containers and typography
 * - Layered stack effect for seasonal cards
 * - Netflix-style progress bar
 */
const useStyles = withThemeStyles(({ palette, s, vs, ms }) => ({
  /** Outer container for the entire card row */
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(20),
  },

  /** Thumbnail image styling */
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: ms(6),
    backgroundColor: "#333",
  },

  /** Container holding the progress bar (transparent background) */
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(3),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderBottomLeftRadius: ms(6),
    borderBottomRightRadius: ms(6),
    overflow: "hidden",
  },

  /** Filled portion of the progress bar */
  progressBar: {
    height: "100%",
    backgroundColor: "#e50914", // Netflix red
  },

  /** Wrapper for single flat image (non-seasonal) */
  imageWrapper: {
    position: "relative",
    width: s(90),
    height: vs(60),
  },

  /** Info section next to the image (text content) */
  cardInfo: {
    flex: 1,
    marginLeft: s(12),
  },

  /** Title text styling */
  cardTitle: {
    fontSize: ms(16),
    fontWeight: "600",
    color: palette.text,
  },

  /** Subtitle text styling */
  cardSubtitle: {
    fontSize: ms(13),
    color: palette.text,
    marginTop: vs(2),
  },

  /** Status or error message text */
  cardStatus: {
    fontSize: ms(10),
    color: "#e74c3c",
    marginTop: vs(2),
    fontWeight: "500",
  },

  /** Play or navigation icon styling */
  playIcon: {
    fontSize: ms(20),
    color: palette.text,
    marginRight: s(8),
  },

  // --- Layered Card Stack Styles for Seasonal Cards ---

  /** Wrapper for the layered stack of seasonal cards */
  stackWrapper: {
    width: s(90),
    height: vs(60),
    position: "relative",
  },

  /** Base style for background layers */
  stackLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: ms(6),
    backgroundColor: "#444",
  },

  /** Middle background layer offset slightly */
  layer2: {
    top: 4,
    right: 4,
    backgroundColor: "#555",
  } as ViewStyle,

  /** Bottom-most background layer (deepest shadow) */
  layer3: {
    top: 8,
    right: 8,
    backgroundColor: "#666",
  },

  /** Top layer (main visible image + progress) */
  topLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    borderRadius: ms(6),
    overflow: "hidden",
  },
}));
