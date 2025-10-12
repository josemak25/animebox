import { renderHook } from "@testing-library/react-hooks";
import React from "react";

import { useTheme } from "@/hooks/useTheme";
import type { DefaultTheme } from "@/providers/theme/colors";
import {
  FONTS,
  DARK_MODE_COLORS,
  LIGHT_MODE_COLORS,
} from "@/providers/theme/colors";
import { ThemeContext } from "@/providers/theme/provider";

describe("useTheme", () => {
  it("returns context value when used inside ThemeProvider", () => {
    // Provide a minimal valid DefaultTheme mock
    const mockTheme: DefaultTheme = {
      layout: {
        radius: 8,
        gutter: 16,
        screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
      },
      s: jest.fn(),
      vs: jest.fn(),
      ms: jest.fn(),
      mode: "light",
      mvs: jest.fn(),
      isDarkMode: false,
      hexToRGB: jest.fn(),
      fonts: { variants: FONTS },
      palette: LIGHT_MODE_COLORS,
      adjustColorBrightness: jest.fn(),
      insets: { top: 0, bottom: 0, left: 0, right: 0 },
      colors: { light: LIGHT_MODE_COLORS, dark: DARK_MODE_COLORS },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockTheme}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current).toBe(mockTheme);
  });
});
