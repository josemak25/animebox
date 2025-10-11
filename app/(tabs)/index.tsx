import React from "react";
import { ScrollView, View } from "react-native";

import { AnimePreviewCard } from "@/components/anime-preview-card";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

// Sample anime data for testing
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

export default function HomeScreen() {
  const { styles } = useStyles();

  const handlePlay = () => {
    // TODO: Implement play functionality
  };

  const handleAddToList = () => {
    // TODO: Implement add to list functionality
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText variant="title" style={styles.headerText}>
          Home
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Card */}
        <AnimePreviewCard
          badge="New"
          season="Season 2"
          episode="Episode 8"
          onPlay={handlePlay}
          style={styles.card}
          onAddToList={handleAddToList}
          anime={sampleAnime as IAnimeResult}
          isInList={false}
          releaseInfo="Season 2 concludes Sept 3"
          description="Wednesday Addams is sent to Nevermore Academy, a boarding school where she attempts to master her psychic powers, stop a monstrous killing spree, and solve the murder mystery that embroiled her parents."
        />
      </ScrollView>
    </ThemedView>
  );
}

const useStyles = withThemeStyles(({ palette, s, vs, ms, layout, insets }) => ({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: insets.top + vs(12),
  },
  scrollView: {
    flex: 1,
    marginBottom: vs(24),
  },
  scrollContent: {
    paddingBottom: vs(20),
  },
  header: {
    paddingHorizontal: s(20),
    marginBottom: vs(16),
  },
  headerText: {
    fontSize: ms(28),
    fontWeight: "bold",
    marginBottom: vs(4),
  },
  card: {
    marginHorizontal: s(20),
    marginBottom: vs(24),
  },
  section: {
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
  },
  sectionTitle: {
    fontSize: ms(22),
    fontWeight: "600",
    marginBottom: vs(12),
  },
  placeholder: {
    fontSize: ms(14),
    textAlign: "center",
    paddingVertical: vs(20),
  },
}));
