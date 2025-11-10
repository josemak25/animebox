import { useRouter } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

import { withThemeStyles } from "@/helpers/withThemeStyles";

import { DownloadCard } from "../../components/anime-download-card";

/**
 * DownloadScreen - Displays all downloaded or downloading shows.
 *
 * This screen provides users with a quick overview of their downloads, including:
 * - Titles, episode info, and progress indicators
 * - Error states (e.g., failed downloads)
 * - Interactive navigation for multi-episode (seasonal) shows
 *
 * Features:
 * - Netflix-inspired progress bar visuals
 * - Dynamic card rendering through `DownloadCard` component
 * - Conditional navigation for seasonal vs. single-play titles
 *
 * Navigation Behavior:
 * - Clicking a seasonal show → navigates to `/season-detail` screen
 * - Clicking a single episode → triggers a "play" action placeholder
 *
 * The rendered download screen component.
 */

const downloads = [
  {
    id: "ginny-georgia",
    title: "Ginny & Georgia",
    subtitle: "1 Episode",
    status: "Failed!",
    seasonal: true,
    image:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRC_QffBHDVguQ1-2opqT0G-Qvm6OJWq19NR5sm9iIxIqxis2er",
    hasError: true,
    progress: 0,
  },
  {
    id: "the-deliverance",
    title: "The Deliverance",
    subtitle: "18+",
    status: "",
    seasonal: false,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6PE7QQtPhk3ImtEcnWwuU5IjL2SNEMchC-9RQNGvnNRYRJu4o",
    hasError: true,
    progress: 0.6,
  },
];

export default function DownloadScreen() {
  const router = useRouter();
  const { styles } = useStyles();

  return (
    <FlatList
      data={downloads}
      renderItem={({ item }) => (
        <DownloadCard
          {...item}
          onPress={() => {
            if (item.seasonal) {
              // ✅ Pass the title properly through params
              router.push({
                pathname: "/season-detail",
                params: { title: item.title },
              });
            } else {
              alert(`Playing ${item.title}...`);
            }
          }}
        />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
}

/**
 * useStyles - Theme-aware style generator for the DownloadScreen.
 *
 * Uses the `withThemeStyles` higher-order helper to provide consistent
 * spacing, color palette integration, and safe area padding across devices.
 *
 * Key Design Details:
 * - Background color adapts to current theme (light/dark)
 * - PaddingTop accounts for notch/dynamic island safe area
 * - Horizontal margins match overall app layout spacing
 *
 */

const useStyles = withThemeStyles(({ palette, s, layout, mvs, insets }) => ({
  contentContainerStyle: {
    flex: 1,
    paddingHorizontal: s(20),
    backgroundColor: palette.background,
    paddingTop: mvs(insets?.top + layout.gutter),
  },
}));
