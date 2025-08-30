import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { Bounceable } from "@/components/bounceable";
import { Providers } from "@/providers";

const renderWithProviders = (ui: React.ReactElement) =>
  render(<Providers>{ui}</Providers>);

describe("Bounceable", () => {
  it("renders children and responds to press", () => {
    const onPress = jest.fn();
    const { getByText } = renderWithProviders(
      <Bounceable onPress={onPress} accessibilityLabel="bounceable">
        <Text>Press me</Text>
      </Bounceable>
    );

    const button = getByText("Press me");
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call press when disabled", () => {
    const onPress = jest.fn();
    const { getByText } = renderWithProviders(
      <Bounceable onPress={onPress} disabled>
        <Text>Can&apos;t press</Text>
      </Bounceable>
    );

    const button = getByText("Can't press");
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
