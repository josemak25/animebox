import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import { isFunction, noop } from "@/helpers/common";

/**
 * Configuration options for app state monitoring
 */
export interface AppStateHookSettings {
  onForeground?: () => void;
  onBackground?: () => void;
  onChange?: (status: AppStateStatus) => void;
}

/**
 * Hook for monitoring and responding to React Native app state changes.
 *
 * Tracks app lifecycle events (foreground/background) and provides callbacks
 * for state transitions. Useful for managing resources, analytics, or UI
 * state based on app visibility.
 *
 * @param {AppStateHookSettings} settings - Configuration object
 * @param {Function} settings.onForeground - Called when app becomes active
 * @param {Function} settings.onBackground - Called when app goes to background
 * @param {Function} settings.onChange - Called on any state change
 * @param {React.DependencyList} extraDeps - Additional dependencies for effect
 *
 * @returns {Object} Current app state information
 * @returns {AppStateStatus} appState - Current app state ('active', 'background', 'inactive')
 *
 * @example
 * ```tsx
 * const { appState } = useAppState({
 *   onForeground: () => {
 *     console.log('App is now active');
 *     // Resume timers, refresh data, etc.
 *   },
 *   onBackground: () => {
 *     console.log('App is in background');
 *     // Pause timers, save state, etc.
 *   },
 *   onChange: (status) => {
 *     console.log('App state changed to:', status);
 *   }
 * });
 *
 * return <Text>Current state: {appState}</Text>;
 * ```
 */
export const useAppState = (
  settings: AppStateHookSettings,
  extraDeps: React.DependencyList = []
) => {
  // Track current app state using ref to avoid unnecessary re-renders
  const appState = useRef(AppState.currentState);

  // Extract callback functions with default no-op functions
  const {
    onForeground = noop,
    onBackground = noop,
    onChange = noop,
  } = settings;

  useEffect(() => {
    /**
     * Handles app state change events from React Native
     * @param {AppStateStatus} nextAppState - New app state
     */
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Check if app is coming from background/inactive to active (foreground)
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to the foreground - trigger foreground callback
        isFunction(onForeground) && onForeground();
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background - trigger background callback
        isFunction(onBackground) && onBackground();
      }

      // Update current state reference
      appState.current = nextAppState;

      // Always trigger change callback with new state
      isFunction(onChange) && onChange(nextAppState);
    };

    // Register app state change listener with React Native
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup: Remove listener when component unmounts or dependencies change
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBackground, onForeground, onChange, ...extraDeps]);

  // Return current app state for component usage
  return { appState: appState.current };
};
