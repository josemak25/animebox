import React from "react";
import { View } from "react-native";

import {
  AnimePreviewCard,
  AnimePreviewCardProps,
} from "../../components/AnimePreviewCard";
import { withThemeStyles } from "../../helpers/withThemeStyles";

const mockAnime: AnimePreviewCardProps = {
  imageUrl: "https://cdn.animebox.app/sample-cover.jpg",
  title: "Attack on Titan: The Final Season",
  season: "Season 4",
  episode: "Episode 24",
  description:
    "The battle for humanity reaches its climax. Titans clash, secrets unravel.",
  releaseInfo: "Season 4 concludes Sept 3",
  badges: ["Trending", "New Release"],
  onPlay: () => {},
  onAddToList: () => {},
  isInList: false,
};
const AnimePreviewCardDemo = () => {
  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <AnimePreviewCard {...mockAnime} />
    </View>
  );
};

const useStyles = withThemeStyles(({ palette }) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: palette.background,
  },
}));

export default AnimePreviewCardDemo;
