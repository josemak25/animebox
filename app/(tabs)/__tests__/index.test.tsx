import { render, waitFor } from "@testing-library/react-native";
import React from "react";

import { Providers } from "@/providers";

import HomeScreen from "../index";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<Providers>{ui}</Providers>);

describe("HomeScreen", () => {
  it("renders the Home title", async () => {
    const { getByText } = renderWithTheme(<HomeScreen />);
    await waitFor(() => {
      expect(getByText("Home")).toBeTruthy();
    });
  });
});
