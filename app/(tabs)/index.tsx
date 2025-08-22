import { StyleSheet } from "react-native";

import { ThemedText, ThemedView } from "@/components/themed-components";

export default function TabOneScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="title">Tab One</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
