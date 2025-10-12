import { ThemedText, ThemedView } from "@/components/themed-components";
import { renderWithTheme } from "@/jest.utils";

describe("Themed components", () => {
  it("renders ThemedText with variants and colors", () => {
    const { getByText } = renderWithTheme(
      <ThemedText variant="title">Hello World</ThemedText>
    );

    const text = getByText("Hello World");
    expect(text).toBeTruthy();
  });

  it("renders ThemedView with background color", () => {
    const { getByText } = renderWithTheme(
      <ThemedView backgroundColor="background">
        <ThemedText>Inside</ThemedText>
      </ThemedView>
    );

    // Ensure the inner text exists which implies the view rendered
    const inner = getByText("Inside");
    expect(inner).toBeTruthy();
  });
});
