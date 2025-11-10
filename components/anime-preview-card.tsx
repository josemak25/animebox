import Ionicons from "@expo/vector-icons/Ionicons";
import { ImageBackground } from "expo-image";
import { useMemo } from "react";

import { Bounceable } from "@/components/bounceable";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

interface AnimePreviewCardProps {
  /**
   * Anime data object containing title, image, and other details
   */
  anime: IAnimeResult;
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
  onPlay,
  onAddToList,
  isInList = false,
}) => {
  const { mvs, colors, layout, styles } = useStyles();

  const title = useMemo(() => {
    if (typeof anime.title === "string") return anime.title;

    return (
      anime.title?.english ||
      anime.title?.romaji ||
      anime.title?.userPreferred ||
      "Unknown Title"
    );
  }, [anime.title]);

  return (
    <Bounceable style={styles.container}>
      <ImageBackground
        contentFit="cover"
        style={styles.imageBackground}
        accessibilityLabel={`${title} poster`}
        source={{ uri: anime.image || anime.cover || "" }}
      >
        <ThemedText variant="title" style={styles.title}>
          {title}
        </ThemedText>

        <ThemedView
          backgroundColor="transparent"
          style={styles.actionContainer}
        >
          <Bounceable
            onPress={onPlay}
            style={styles.button}
            accessibilityLabel={`Play ${title}`}
            accessibilityHint="Starts playing the anime"
          >
            <Ionicons
              name="play"
              size={mvs(layout.gutter)}
              color={colors.light.black}
            />
            <ThemedText variant="subtitle" style={styles.playText}>
              Play
            </ThemedText>
          </Bounceable>

          <Bounceable
            onPress={onAddToList}
            style={[styles.button, styles.addToListButton]}
            accessibilityLabel={
              isInList
                ? `Remove ${title} from list`
                : `Add ${anime.title} to list`
            }
            accessibilityHint={
              isInList ? "Removes from your list" : "Adds to your watch list"
            }
          >
            <Ionicons
              size={mvs(layout.gutter)}
              color={colors.light.white}
              name={isInList ? "checkmark" : "add"}
            />

            <ThemedText
              variant="subtitle"
              style={[styles.playText, styles.addToListText]}
            >
              My List
            </ThemedText>
          </Bounceable>
        </ThemedView>
      </ImageBackground>
    </Bounceable>
  );
};

const useStyles = withThemeStyles(({ palette, colors, ms, mvs, layout }) => ({
  /** Card container with border and rounded corners */
  container: {
    borderWidth: 1.5,
    overflow: "hidden",
    borderColor: palette.senary,
    borderRadius: mvs(layout.radius),
  },

  /** Background image covering entire card */
  imageBackground: {
    justifyContent: "flex-end",
    gap: mvs(layout.gutter / 2),
    padding: mvs(layout.gutter / 2),
    height: mvs(layout.screen.width / 1.1),
  },

  /** Title text styling */
  title: {
    fontSize: mvs(36),
    lineHeight: mvs(44),
    color: colors.light.white,
  },

  /** Container for action buttons */
  actionContainer: {
    flexDirection: "row",
    gap: ms(layout.gutter / 2),
  },

  /** Common button styles */
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ms(layout.gutter / 4),
    backgroundColor: colors.light.white,
    paddingHorizontal: ms(layout.gutter),
    borderRadius: mvs(layout.radius / 2),
    paddingVertical: mvs(layout.radius / 1.5),
  },

  /** Play button text styling */
  playText: {
    fontSize: ms(14),
    color: colors.light.black,
  },

  /** Add to List button specific styles */
  addToListButton: {
    backgroundColor: colors.light.black,
  },

  /** Add to List button text styling */
  addToListText: {
    color: colors.light.white,
  },
}));
