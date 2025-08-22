import React from "react";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { isFunction, noop } from "@/helpers/common";

export interface AppStateHookSettings {
  onForeground?: () => void;
  onBackground?: () => void;
  onChange?: (status: AppStateStatus) => void;
}

export const useAppState = (
  settings: AppStateHookSettings,
  extraDeps: React.DependencyList = []
) => {
  const appState = useRef(AppState.currentState);
  const {
    onForeground = noop,
    onBackground = noop,
    onChange = noop,
  } = settings;

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to the foreground
        isFunction(onForeground) && onForeground();
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        isFunction(onBackground) && onBackground();
      }

      appState.current = nextAppState;
      // App state has changed
      isFunction(onChange) && onChange(nextAppState);
    };

    // Add app state change listener
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Clean up the listener and clear interval on unmount
    return () => subscription.remove();
  }, [onBackground, onForeground, onChange, ...extraDeps]);

  return { appState };
};
