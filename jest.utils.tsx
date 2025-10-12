import { render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

import { Providers } from "@/providers";
import { ThemeProvider } from "@/providers/theme/provider";

// Custom render function that includes all necessary providers
export const renderWithProviders = (ui: React.ReactElement) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Providers>{children}</Providers>
  );

  return render(ui, { wrapper: Wrapper });
};

// Renderer that includes only ThemeProvider for isolated component tests
export const renderWithTheme = (ui: React.ReactElement) => {
  const Providers = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Providers });
};

// Alternative renderer that includes SessionProvider for integration tests
export const renderWithSession = (ui: React.ReactElement) => {
  const Providers = ({ children }: { children: React.ReactNode }) => (
    <View>{children}</View>
  );

  return render(ui, { wrapper: Providers });
};
