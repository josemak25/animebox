import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { ComponentProps } from "react";

import { ThemedView } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

import { Bounceable } from "./bounceable";
import { Icon } from "./icons";

/**
 * Tab configuration for the bottom navigator.
 */
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

/** Width of the bottom navigator container */
const TAB_WIDTH = 192;

/** Height of the bottom navigator container */
const TAB_HEIGHT = 56;

/**
 * BottomNavigator - Custom floating bottom navigation with blur effects.
 *
 * Features:
 * - Floating design with blur background
 * - Smooth touch animations with scale feedback
 * - Theme-aware colors and responsive sizing
 * - Full accessibility support
 *
 * @component
 * @name BottomNavigator props - React Navigation props
 * @example
 * <Tabs tabBar={(props) => <BottomNavigator {...props} />} />
 */
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
                  style: focused ? styles.activeIcon : styles.inActiveIcon,
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

/**
 * Provides themed styles for the BottomNavigator.
 * Uses withThemeStyles HOC for theme integration.
 */
const useStyles = withThemeStyles(({ hexToRGB, ms, layout, palette }) => ({
  /** Positions navigator at bottom of screen */
  fabContainer: {
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
    position: "absolute",
  },

  /** Blur container with rounded corners */
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

  /** Outer container with border and shadow */
  container: {
    borderWidth: ms(1),
    flexDirection: "row",
    width: ms(TAB_WIDTH),
    alignItems: "center",
    height: ms(TAB_HEIGHT),
    justifyContent: "center",
    borderColor: palette.septenary,
    borderRadius: ms(layout.gutter * 2),
    shadowRadius: ms(72),
    shadowOpacity: ms(0.18),
    elevation: ms(layout.gutter / 2),
    shadowOffset: { width: 8, height: 4 },
    shadowColor: hexToRGB(palette.black, 0.6),
  },

  /** Individual tab button container */
  tab: {
    width: ms(48),
    height: ms(48),
    padding: ms(10),
    borderRadius: ms(24),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: ms(4),
  },

  /** Inactive tab icon styling */
  inActiveIcon: {
    opacity: 0.6,
  },

  /** Active tab icon styling */
  activeIcon: {
    opacity: 1,
  },
}));
