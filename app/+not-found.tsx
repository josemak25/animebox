import { Link, Stack } from "expo-router";

import { withThemeStyles } from "@/helpers/withThemeStyles";
import { ThemedText, ThemedView } from "@/components/themed-components";

export default function NotFoundScreen() {
  const { styles } = useStyles();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <ThemedText variant="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText variant="caption">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const useStyles = withThemeStyles(({ ms, palette, layout }) => ({
  container: {
    flex: 1,
    alignItems: "center",
    padding: layout.gutter,
    justifyContent: "center",
  },
  link: {
    marginTop: layout.gutter,
    paddingVertical: layout.gutter,
  },
}));
