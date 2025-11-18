import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useCallback } from "react";
import { FlatList, Alert, ListRenderItem } from "react-native";

import { AnimeCard } from "@/components/anime-card";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { AnimeInterface } from "@/db/schema";
import { withThemeStyles } from "@/helpers/withThemeStyles";
import { useLatestReleases } from "@/hooks/useLatestReleases";

/**
 * BookmarkScreen - User's personal anime bookmarks collection display.
 *
 * This screen serves as the main bookmark management interface, displaying
 * all user-saved anime in a responsive 3-column grid layout. Features include:
 *
 * - Grid-based bookmark display (3 columns)
 * - Bookmark count indicator in header
 * - Empty state messaging for new users
 * - Tap-to-view anime details (placeholder functionality)
 * - Consistent theming with app-wide design system
 *
 * The layout is optimized for mobile viewing with appropriate spacing,
 * responsive sizing, and accessibility support.
 *
 * @returns {JSX.Element} The rendered bookmark screen component
 */
export default function BookmarkScreen() {
  const { styles } = useStyles();
  const { data } = useLatestReleases();

  /**
   * Handles anime card press events.
   * Currently shows an alert with anime title for demonstration.
   * In production, this would navigate to the anime details screen.
   *
   * @param {IAnimeResult} anime - The selected anime object
   */
  const handleAnimePress = (anime: AnimeInterface) => {
    // TODO: Navigate to anime details page
    Alert.alert(
      "Anime Selected",
      `Selected: ${typeof anime.title === "string" ? anime.title : anime.title}`
    );
  };

  const renderItem: ListRenderItem<AnimeInterface> = useCallback(
    ({ item, index }) => {
      if (data.length - 1 === index && index % 2 !== 0) {
        return <ThemedView style={styles.emptyCardPlaceholder} />;
      }

      return <AnimeCard anime={item} onPress={() => handleAnimePress(item)} />;
    },
    [data.length, styles.emptyCardPlaceholder]
  );
  /**
   * Renders empty state when no bookmarks exist.
   * Provides helpful messaging to guide new users.
   *
   * @returns {JSX.Element} Empty state component with title and subtitle
   */
  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText variant="title" style={styles.emptyTitle}>
        No Bookmarks Yet
      </ThemedText>
      <ThemedText variant="subtitle" style={styles.emptySubtitle}>
        Start adding anime to your bookmarks to see them here!
      </ThemedText>
    </ThemedView>
  );

  const { mvs, layout } = useStyles();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <ThemedView style={styles.container}>
      {/* Main content area - 3-column grid of bookmarked anime */}
      <FlatList
        data={data}
        numColumns={2} // Fixed 3-column layout for optimal mobile viewing
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false} // Cleaner visual appearance
        ListEmptyComponent={renderEmptyState}
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={[
          styles.contentContainerStyle,
          { paddingBottom: mvs(tabBarHeight + layout.gutter * 2) },
        ]}
        ListHeaderComponentStyle={styles.headerComponentStyle}
        ListHeaderComponent={
          <ThemedView style={styles.header}>
            <ThemedText variant="title" style={styles.headerText}>
              My Bookmarks
            </ThemedText>
            {/* Dynamic count indicator - only shown when bookmarks exist */}
            {data.length > 0 && (
              <ThemedText variant="caption" style={styles.countText}>
                {data.length} anime
                {data.length !== 1 ? "s" : ""}
              </ThemedText>
            )}
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

/**
 * Style definitions using the app's theme system.
 *
 * Utilizes withThemeStyles HOC for consistent theming across the app.
 * Includes responsive scaling (s, vs, ms) and theme-aware colors.
 *
 * Key style groups:
 * - container: Main screen layout with safe area handling
 * - header: Title and count display area
 * - contentContainerStyle: FlatList content styling with appropriate padding
 * - empty state: Centered messaging for users with no bookmarks
 */
const useStyles = withThemeStyles(
  ({ palette, layout, mvs, s, vs, ms, insets }) => ({
    container: {
      flex: 1,
      backgroundColor: palette.background,
      paddingTop: insets.top + vs(12), // Safe area + additional spacing
    },
    /* Header component styling  */
    header: {
      // paddingHorizontal: s(20),
      // marginBottom: vs(16),
    },
    /* Header text styling */
    headerText: {
      fontSize: ms(28),
      fontWeight: "bold",
      marginBottom: vs(4),
    },
    /* countText styling  */
    countText: {
      fontSize: ms(14),
      opacity: 0.7, // Subtle secondary text appearance
    },
    /* contentContainerStyle styling  */
    contentContainerStyle: {
      paddingBottom: vs(20), // Bottom padding for scroll comfort
      flexGrow: 1,
      gap: mvs(12),
      backgroundColor: palette.background,
      paddingHorizontal: ms(layout.gutter),
    },
    /* Header component styling with bottom margin */
    headerComponentStyle: {
      // marginBottom: mvs(layout.gutter),
    },
    /* columnWrapperStyle styling  with gap */
    columnWrapperStyle: {
      gap: mvs(12),
    },
    /* emptyContainer styling  */
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: s(40), // Generous horizontal padding for text readability
      paddingTop: vs(100), // Vertical offset for better visual balance
    },
    /* emptyTitle styling  */
    emptyTitle: {
      fontSize: ms(24),
      fontWeight: "600",
      marginBottom: vs(12),
      textAlign: "center",
    },
    /* emptySubtitle styling  */
    emptySubtitle: {
      fontSize: ms(16),
      textAlign: "center",
      opacity: 0.7, // Consistent with countText for hierarchy
      lineHeight: ms(22), // Improved readability for longer text
    },

    /* emptyCardPlaceholder container styling for empty card */
    emptyCardPlaceholder: {
      flex: 1,
      opacity: 0,
    },
  })
);
