import { useNavigation, NavigationProp } from "@react-navigation/native";

import { AnimeGrid, AnimeGridItem } from "@/components/AnimeGrid";
import { ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";
import { useAnimes } from "@/hooks/useAnimes";

import { AnimePreviewCard } from "../../components/AnimePreviewCard";

export default function TabOneScreen() {
  const { styles } = useStyles();
  const { data: animes } = useAnimes();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();

  // Use the first anime as featured, rest in the grid
  let featured: AnimeGridItem | null, rest: AnimeGridItem[];
  if (animes && animes.length > 0) {
    [featured, ...rest] = animes;
  } else {
    featured = null;
    rest = [];
  }

  return (
    <ThemedView style={styles.container}>
      <AnimePreviewCard
        title={featured ? featured.anime_title : "No anime available"}
        season={featured ? featured.anime_session : undefined}
        episode={
          featured && featured.episode ? `Ep. ${featured.episode}` : undefined
        }
        imageUrl={featured ? featured.snapshot : ""}
        badges={
          featured ? (featured.completed ? ["Completed"] : ["Ongoing"]) : []
        }
        onPlay={() => {
          if (featured && navigation.navigate) {
            navigation.navigate("AnimeDetails", { id: featured.id });
          }
        }}
        onAddToList={() => {}}
        isInList={false}
        accessibilityLabel={
          featured
            ? `${featured.anime_title} preview card`
            : "No anime preview card"
        }
      />
      <AnimeGrid
        data={rest}
        onAnimePress={(id) => {
          if (navigation.navigate) {
            navigation.navigate("AnimeDetails", { id });
          }
        }}
      />
    </ThemedView>
  );
}

const useStyles = withThemeStyles(({ palette }) => ({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: 8,
  },
  gridContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 18,
  },
}));
