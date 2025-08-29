import { render } from "@testing-library/react-native";
import React from "react";

import { Providers } from "@/providers";

import DownloadScreen from "../download";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<Providers>{ui}</Providers>);

describe("DownloadScreen", () => {
  it("renders the Downloads title", () => {
    const { getByText } = renderWithTheme(<DownloadScreen />);
    expect(getByText("Downloads")).toBeTruthy();
  });
});
