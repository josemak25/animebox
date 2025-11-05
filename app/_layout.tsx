import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { TouchableOpacity, Text } from "react-native";

import { useCachedResources } from "@/hooks/useCachedResources";
import { Providers } from "@/providers";

import { withThemeStyles } from "../helpers/withThemeStyles";

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
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.headerText}>‹</Text>
              </TouchableOpacity>
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
