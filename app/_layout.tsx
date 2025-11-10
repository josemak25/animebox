import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { Bounceable } from "@/components/bounceable";
import { ThemedText } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";
import { useCachedResources } from "@/hooks/useCachedResources";
import { Providers } from "@/providers";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { appIsReady } = useCachedResources();
  const router = useRouter();
  const { styles } = useStyles();

  if (!appIsReady) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="season-detail"
          options={{
            headerShown: true,
            title: "",
            headerShadowVisible: false,
            headerBackTitle: "",
            // ✅ Custom back arrow
            headerLeft: () => (
              <Bounceable onPress={() => router.back()}>
                <ThemedText style={styles.headerText}>‹</ThemedText>
              </Bounceable>
            ),
          }}
        />
      </Stack>
    </Providers>
  );
}

const useStyles = withThemeStyles(({ palette, s }) => ({
  headerText: {
    fontSize: 35,
    color: "#0084ff",
  },
}));
