import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { buildProvidersTree } from "@/helpers/buildProvidersTree";

import { HeadlessBrowserProvider } from "./headless-browser/provider";
import { ThemeProvider } from "./theme/provider";

export const Providers = buildProvidersTree([
  GestureHandlerRootView,
  SafeAreaProvider,
  ThemeProvider,
  BottomSheetModalProvider,
  HeadlessBrowserProvider,
]);
