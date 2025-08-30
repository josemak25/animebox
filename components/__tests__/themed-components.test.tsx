import { render } from "@testing-library/react-native";
import React from "react";

import { ThemedText, ThemedView } from "@/components/themed-components";
import { Providers } from "@/providers";

const renderWithProviders = (ui: React.ReactElement) =>
  render(<Providers>{ui}</Providers>);

describe("Themed components", () => {
  it("renders ThemedText with variants and colors", () => {
    const { getByText } = renderWithProviders(
      <ThemedText variant="title">Hello World</ThemedText>
    );

    const text = getByText("Hello World");
    expect(text).toBeTruthy();
  });

  it("renders ThemedView with background color", () => {
    const { getByText } = renderWithProviders(
      <ThemedView backgroundColor="background">
        <ThemedText>Inside</ThemedText>
      </ThemedView>
    );

    // Ensure the inner text exists which implies the view rendered
    const inner = getByText("Inside");
    expect(inner).toBeTruthy();
  });
});
