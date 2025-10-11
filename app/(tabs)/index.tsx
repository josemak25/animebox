import React from "react";
import { ScrollView, View } from "react-native";

import { AnimePreviewCard } from "@/components/anime-preview-card";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

/**
 * Sample anime data for testing and demonstration purposes.
 *
 * This represents the structure expected by AnimePreviewCard component.
 * In production, this would be fetched from an API or database.
 * The data follows the IAnimeResult interface with Netflix-style metadata.
 */
const sampleAnime = {
  id: "wednesday-2022",
  title: {
    english: "Wednesday",
    romaji: "Wednesday",
    userPreferred: "Wednesday",
  },
  image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
  cover:
    "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
  status: "Completed",
  rating: 8.1,
  type: "TV",
  releaseDate: "2022",
};

/**
 * HomeScreen - Main landing page of the anime streaming application.
 *
 * This is the primary discovery interface where users first interact with
 * the app's content. Currently features a single featured anime card with
 * Netflix-inspired design patterns.
 *
 * Key features:
 * - Featured anime preview with rich metadata display
 * - Play and "My List" action buttons
 * - Scrollable content area for future content sections
 * - Responsive design with proper safe area handling
 * - Consistent theming throughout the interface
 *
 * Future enhancements could include:
 * - Multiple featured content sections
 * - Trending/popular anime carousels
 * - User personalized recommendations
 * - Continue watching section
 *
 * @returns {JSX.Element} The rendered home screen component
 */
export default function HomeScreen() {
  const { styles } = useStyles();

  /**
   * Handles the play button press event.
   * In production, this would initiate video playback,
   * potentially navigating to a video player screen.
   */
  const handlePlay = () => {
    // TODO: Implement play functionality
    // - Navigate to video player
    // - Track user engagement analytics
    // - Handle offline/online playback logic
  };

  /**
   * Handles the "My List" button press event.
   * Manages adding/removing anime from user's personal watchlist.
   * Should update local state and sync with backend storage.
   */
  const handleAddToList = () => {
    // TODO: Implement add to list functionality
    // - Toggle bookmark state in database
    // - Update UI to reflect current state
    // - Show confirmation feedback to user
  };

  return (
    <ThemedView style={styles.container}>
      {/* Main header with app title */}
      <View style={styles.header}>
        <ThemedText variant="title" style={styles.headerText}>
          Home
        </ThemedText>
      </View>

      {/* Scrollable content area for all home screen sections */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} // Clean appearance without scroll indicator
      >
        {/* Featured anime card - Netflix-style hero section */}
        <AnimePreviewCard
          badge="New" // Promotional badge for new content
          season="Season 2" // Current season information
          episode="Episode 8" // Latest episode available
          onPlay={handlePlay} // Primary action - start watching
          style={styles.card} // Custom spacing and positioning
          onAddToList={handleAddToList} // Secondary action - save for later
          anime={sampleAnime as IAnimeResult} // Main anime data
          isInList={false} // Current bookmark status
          releaseInfo="Season 2 concludes Sept 3" // Release schedule info
          description="Wednesday Addams is sent to Nevermore Academy, a boarding school where she attempts to master her psychic powers, stop a monstrous killing spree, and solve the murder mystery that embroiled her parents." // Plot synopsis
        />
        {/* Future sections could include:
            - Continue Watching carousel
            - Trending Now section
            - Recommended for You
            - New Releases grid
        */}
      </ScrollView>
    </ThemedView>
  );
}

/**
 * Style definitions for the home screen using theme-aware styling.
 *
 * Leverages the withThemeStyles HOC for consistent theming and responsive
 * scaling across different device sizes. The layout prioritizes content
 * discovery with generous spacing and clear visual hierarchy.
 *
 * Key design principles:
 * - Mobile-first responsive design using scaling functions (s, vs, ms)
 * - Safe area handling for modern devices with notches/dynamic islands
 * - Consistent spacing system throughout the interface
 * - Theme-aware colors that adapt to light/dark modes
 *
 * Style categories:
 * - Layout: Container, scroll view, and content structure
 * - Header: Title and navigation area styling
 * - Content: Featured card and future section preparations
 */
const useStyles = withThemeStyles(({ palette, s, vs, ms, layout, insets }) => ({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: insets.top + vs(12), // Safe area + additional top spacing
  },
  scrollView: {
    flex: 1,
    marginBottom: vs(24), // Bottom spacing for tab bar clearance
  },
  scrollContent: {
    paddingBottom: vs(20), // Additional bottom padding for comfortable scrolling
  },
  header: {
    paddingHorizontal: s(20), // Standard horizontal page margins
    marginBottom: vs(16), // Separation between header and content
  },
  headerText: {
    fontSize: ms(28), // Large, prominent title size
    fontWeight: "bold", // Strong visual weight for primary heading
    marginBottom: vs(4), // Minimal bottom spacing
  },
  card: {
    marginHorizontal: s(20), // Consistent with header padding
    marginBottom: vs(24), // Generous spacing below featured content
  },
  // Reserved styles for future content sections
  section: {
    paddingHorizontal: s(20), // Consistent horizontal alignment
    paddingVertical: vs(16), // Vertical section spacing
  },
  sectionTitle: {
    fontSize: ms(22), // Secondary heading size
    fontWeight: "600", // Medium weight for section headers
    marginBottom: vs(12), // Space before section content
  },
  placeholder: {
    fontSize: ms(14), // Smaller text for placeholder content
    textAlign: "center", // Centered alignment for empty states
    paddingVertical: vs(20), // Vertical padding for placeholder spacing
  },
}));
