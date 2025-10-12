import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { BottomNavigator } from "@/components/bottom-navigator";
import { renderWithTheme } from "@/jest.utils";

const mockProps = {
  state: { index: 0, type: "tab", key: "tab-state-0" },
  navigation: {
    navigate: jest.fn(),
  } as unknown as BottomTabBarProps["navigation"],
} as BottomTabBarProps;

describe("BottomNavigator", () => {
  it("renders all three tabs", async () => {
    const { getByLabelText } = renderWithTheme(
      <BottomNavigator {...mockProps} />
    );
    await waitFor(() => {
      expect(getByLabelText("Home Tab")).toBeTruthy();
      expect(getByLabelText("Bookmark Tab")).toBeTruthy();
      expect(getByLabelText("Download Tab")).toBeTruthy();
    });
  });

  it("calls navigation.navigate on tab press", async () => {
    const { getByLabelText } = renderWithTheme(
      <BottomNavigator {...mockProps} />
    );
    fireEvent.press(getByLabelText("Bookmark Tab"));
    expect(mockProps.navigation.navigate).toHaveBeenCalledWith("bookmark");
  });

  it("sets accessibilityState selected on active tab", () => {
    const { getByLabelText } = renderWithTheme(
      <BottomNavigator
        {...mockProps}
        state={{ ...mockProps.state, index: 2 }}
      />
    );
    expect(
      getByLabelText("Download Tab").props.accessibilityState.selected
    ).toBe(true);
  });
});
