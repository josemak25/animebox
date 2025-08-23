import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { View, Text } from "react-native";

import { buildProvidersTree } from "../buildProvidersTree";

describe("helper / buildProvidersTree", () => {
  it("composes multiple providers and renders children correctly", () => {
    const ProviderA: React.FC<React.PropsWithChildren<{ value: string }>> = ({
      children,
      value,
    }) => (
      <View testID="provider-a">
        <Text>A-{value}</Text>
        {children}
      </View>
    );

    const ProviderB: React.FC<React.PropsWithChildren<{ count: number }>> = ({
      children,
      count,
    }) => (
      <View testID="provider-b">
        <Text>B-{count}</Text>
        {children}
      </View>
    );

    const Providers = buildProvidersTree([
      [ProviderA, { value: "react-native" }],
      [ProviderB, { count: 99 }],
    ] as const);

    render(
      <Providers>
        <Text testID="child">Hello RN</Text>
      </Providers>
    );

    expect(screen.getByTestId("provider-a")).toBeTruthy();
    expect(screen.getByTestId("provider-b")).toBeTruthy();
    expect(screen.getByText("A-react-native")).toBeTruthy();
    expect(screen.getByText("B-99")).toBeTruthy();
    expect(screen.getByText("Hello RN")).toBeTruthy();
  });

  it("handles a single provider as a plain component", () => {
    const SingleProvider: React.FC<React.PropsWithChildren> = ({
      children,
    }) => <View testID="single-provider">{children}</View>;

    const Providers = buildProvidersTree([SingleProvider]);

    render(
      <Providers>
        <Text testID="child">Only One</Text>
      </Providers>
    );

    expect(screen.getByTestId("single-provider")).toBeTruthy();
    expect(screen.getByTestId("child")).toHaveTextContent("Only One");
  });
});
