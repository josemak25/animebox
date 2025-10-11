import { render } from "@testing-library/react-native";
import React from "react";

import { Providers } from "@/providers";

import BookmarkScreen from "../bookmark";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<Providers>{ui}</Providers>);

describe("BookmarkScreen", () => {
  it("renders the Bookmarks title", () => {
    const { getByText } = renderWithTheme(<BookmarkScreen />);
    expect(getByText("My Bookmarks")).toBeTruthy();
  });
});
