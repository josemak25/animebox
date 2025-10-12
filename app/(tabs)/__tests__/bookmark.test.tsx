import { renderWithProviders } from "@/jest.utils";

import BookmarkScreen from "../bookmark";

describe("BookmarkScreen", () => {
  it("renders the Bookmarks title", () => {
    const { getByText } = renderWithProviders(<BookmarkScreen />);
    expect(getByText("Bookmarks")).toBeTruthy();
  });
});
