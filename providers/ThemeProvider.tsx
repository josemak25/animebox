import React, { createContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import colors, { Theme } from "@/constants/colors";

type ColorScheme = "light" | "dark" | null;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialColorScheme?: ColorScheme;
}

export function ThemeProvider({
  children,
  initialColorScheme,
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    initialColorScheme ?? systemColorScheme ?? "light"
  );

  useEffect(() => {
    if (!initialColorScheme) {
      setColorScheme(systemColorScheme ?? "light");
    }
  }, [systemColorScheme, initialColorScheme]);

  const effectiveColorScheme = colorScheme ?? "light";
  const theme = colors[effectiveColorScheme];
  const isDark = effectiveColorScheme === "dark";

  const toggleTheme = () => setColorScheme(isDark ? "light" : "dark");

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setColorScheme,
      colorScheme: effectiveColorScheme,
    }),
    [theme, isDark, effectiveColorScheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
