import { Link, Stack } from "expo-router";

import { ThemedText, ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

/**
 * NotFoundScreen - Displays a user-friendly 404 page for unknown routes.
 *
 * Shows a themed message and a link to return to the home screen.
 *
 * Implementation notes:
 * - Uses ThemedView and ThemedText for consistent styling
 * - Integrates with expo-router's Stack.Screen for title
 * - Provides a styled link back to the root route
 *
 * @example
 * // Used as the catch-all route in Expo Router
 * <NotFoundScreen />
 */
export default function NotFoundScreen() {
  const { styles } = useStyles();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <ThemedText variant="title">This screen doesn&apos;t exist.</ThemedText>
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
