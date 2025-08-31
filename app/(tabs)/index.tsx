import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";
import { useAnimeCollection } from "@/hooks/useAnimeCollection";

export default function HomeScreen() {
  const { styles } = useStyles();
  const { data } = useAnimeCollection();

  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="title">Home</ThemedText>
    </ThemedView>
  );
}

const useStyles = withThemeStyles(() => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}));
