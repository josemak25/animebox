import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

export default function DownloadScreen() {
  const { styles } = useStyles();
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="title">Downloads</ThemedText>
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
