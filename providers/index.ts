import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { buildProvidersTree } from "@/helpers/buildProvidersTree";

import { ThemeProvider } from "./theme/ThemeProvider";

export const Providers = buildProvidersTree([
  SafeAreaProvider,
  ThemeProvider,
  BottomSheetModalProvider,
  KeyboardProvider,
]);
