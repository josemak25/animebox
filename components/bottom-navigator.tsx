import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { ComponentProps } from "react";

import { ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

import { Bounceable } from "./bounceable";
import { Icon } from "./icons";

const TABS = [
  {
    key: "index",
    accessibilityLabel: "Home Tab",
    icon: (props: Omit<ComponentProps<typeof Icon>, "name">) => (
      <Icon {...props} name="home" />
    ),
  },
  {
    key: "Bookmark",
    accessibilityLabel: "Bookmark Tab",
    icon: (
      props: Omit<ComponentProps<typeof MaterialCommunityIcons>, "name">
    ) => <MaterialCommunityIcons {...props} name="bookshelf" />,
  },
  {
    key: "Download",
    accessibilityLabel: "Download Tab",
    icon: (
      props: Omit<ComponentProps<typeof MaterialCommunityIcons>, "name">
    ) => <MaterialCommunityIcons {...props} name="progress-download" />,
  },
] as const;

const TAB_WIDTH = 192;
const TAB_HEIGHT = 56;

export const BottomNavigator: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const { styles, insets, mode, palette, ms } = useStyles();

  return (
    <ThemedView
      pointerEvents="box-none"
      style={[styles.fabContainer, { bottom: insets.bottom }]}
    >
      <ThemedView style={styles.container} backgroundColor="transparent">
        <BlurView tint={mode} intensity={ms(60)} style={styles.blurView}>
          {TABS.map((tab, idx) => {
            const focused = state.index === idx;
            return (
              <Bounceable
                key={tab.key}
                style={styles.tab}
                accessibilityRole="button"
                animationProps={{ scaleInValue: 0.7 }}
                accessibilityLabel={tab.accessibilityLabel}
                accessibilityState={focused ? { selected: true } : {}}
                onPress={() => navigation.navigate(tab.key.toLowerCase())}
              >
                {tab.icon({
                  size: ms(24),
                  color: focused ? palette.text : palette.senary,
                  style: focused ? styles.iconActive : styles.icon,
                })}
              </Bounceable>
            );
          })}
        </BlurView>
      </ThemedView>
    </ThemedView>
  );
};

BottomNavigator.displayName = "BottomNavigator";

const useStyles = withThemeStyles(({ hexToRGB, ms, layout, palette }) => ({
  fabContainer: {
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
    position: "absolute",
  },
  blurView: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    width: ms(TAB_WIDTH - 2),
    justifyContent: "center",
    height: ms(TAB_HEIGHT - 2),
    backgroundColor: palette.septenary,
    borderRadius: ms(layout.gutter * 2),
  },
  container: {
    borderWidth: ms(1),
    flexDirection: "row",
    width: ms(TAB_WIDTH),
    alignItems: "center",
    height: ms(TAB_HEIGHT),
    justifyContent: "center",
    borderColor: palette.septenary,
    borderRadius: ms(layout.gutter * 2),

    // --- Apply Shadows ---
    shadowRadius: ms(72),
    shadowOpacity: ms(0.18),
    elevation: ms(layout.gutter / 2),
    shadowOffset: { width: 8, height: 4 },
    shadowColor: hexToRGB(palette.black, 0.6),
  },
  tab: {
    width: ms(48),
    height: ms(48),
    padding: ms(10),
    borderRadius: ms(24),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: ms(4),
  },
  tabCenter: {
    marginHorizontal: ms(12),
  },
  icon: {
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
}));
