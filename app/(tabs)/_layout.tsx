import { Tabs } from "expo-router";
import React from "react";

import { BottomNavigator } from "@/components/bottom-navigator";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigator {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="bookmark" options={{ title: "Bookmark" }} />
      <Tabs.Screen name="download" options={{ title: "Download" }} />
    </Tabs>
  );
}
