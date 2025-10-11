import React from "react";
import { FlatList, View, Alert } from "react-native";

import { AnimeBookmarkCard } from "@/components/anime-bookmark-card";
import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

const bookmarkedAnime: IAnimeResult[] = [
  {
    id: "one-piece-1",
    title: {
      english: "One Piece",
      romaji: "One Piece",
      userPreferred: "One Piece",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg",
    status: "Ongoing" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "1999",
  },
  {
    id: "one-piece-2",
    title: {
      english: "One Piece",
      romaji: "One Piece",
      userPreferred: "One Piece",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg",
    status: "Ongoing" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "1999",
  },
  {
    id: "one-piece-3",
    title: {
      english: "One Piece",
      romaji: "One Piece",
      userPreferred: "One Piece",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg",
    status: "Ongoing" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "1999",
  },
  {
    id: "attack-on-titan-1",
    title: {
      english: "Attack on Titan",
      romaji: "Shingeki no Kyojin",
      userPreferred: "Attack on Titan",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg",
    status: "Completed" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "2013",
  },
  {
    id: "attack-on-titan-2",
    title: {
      english: "Attack on Titan",
      romaji: "Shingeki no Kyojin",
      userPreferred: "Attack on Titan",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg",
    status: "Completed" as MediaStatus,
    rating: 9.0,
    type: "TV" as MediaFormat,
    releaseDate: "2013",
  },
  {
    id: "spirited-away",
    title: {
      english: "Spirited Away",
      romaji: "Sen to Chihiro no Kamikakushi",
      userPreferred: "Spirited Away",
    },
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg",
    cover:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/199-H5uL7MdIbOPj.jpg",
    status: "Completed" as MediaStatus,
    rating: 9.3,
    type: "Movie" as MediaFormat,
    releaseDate: "2001",
  },
];

export default function BookmarkScreen() {
  const { styles } = useStyles();

  const handleAnimePress = (anime: IAnimeResult) => {
    // TODO: Navigate to anime details page
    Alert.alert(
      "Anime Selected",
      `Selected: ${typeof anime.title === "string" ? anime.title : anime.title?.english || "Unknown"}`
    );
  };

  const renderAnimeCard = ({ item }: { item: IAnimeResult }) => (
    <AnimeBookmarkCard anime={item} onPress={() => handleAnimePress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText variant="title" style={styles.emptyTitle}>
        No Bookmarks Yet
      </ThemedText>
      <ThemedText variant="subtitle" style={styles.emptySubtitle}>
        Start adding anime to your bookmarks to see them here!
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText variant="title" style={styles.headerText}>
          My Bookmarks
        </ThemedText>
        {bookmarkedAnime.length > 0 && (
          <ThemedText variant="caption" style={styles.countText}>
            {bookmarkedAnime.length} anime
            {bookmarkedAnime.length !== 1 ? "s" : ""}
          </ThemedText>
        )}
      </View>

      {/* Grid of bookmarked anime */}
      <FlatList
        data={bookmarkedAnime}
        renderItem={renderAnimeCard}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const useStyles = withThemeStyles(({ palette, s, vs, ms, insets }) => ({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: insets.top + vs(12),
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
  countText: {
    fontSize: ms(14),
    opacity: 0.7,
  },
  listContent: {
    paddingHorizontal: s(15),
    paddingBottom: vs(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: s(40),
    paddingTop: vs(100),
  },
  emptyTitle: {
    fontSize: ms(24),
    fontWeight: "600",
    marginBottom: vs(12),
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: ms(16),
    textAlign: "center",
    opacity: 0.7,
    lineHeight: ms(22),
  },
}));
