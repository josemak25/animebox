import { fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimeCard } from "@/components/anime-card";
import { renderWithTheme } from "@/jest.utils";

const mockAnime: IAnimeResult = {
  id: "card-anime-1",
  title: {
    english: "Card Anime",
    romaji: "Card Anime",
    userPreferred: "Card Anime",
  },
  rating: 8.5,
  releaseDate: "2022",
  type: "TV" as MediaFormat,
  status: "Releasing" as MediaStatus,
  image: "https://example.com/card-image.jpg",
  cover: "https://example.com/card-cover.jpg",
  season: 1,
  episode: 12,
};

describe("AnimeCard", () => {
  it("renders anime title", () => {
    const { getByText } = renderWithTheme(<AnimeCard anime={mockAnime} />);

    expect(getByText("Card Anime")).toBeTruthy();
  });

  it("handles anime with string title", () => {
    const animeWithStringTitle = { ...mockAnime, title: "Simple Card Title" };
    const { getByText } = renderWithTheme(
      <AnimeCard anime={animeWithStringTitle} />
    );

    expect(getByText("Simple Card Title")).toBeTruthy();
  });

  it("shows bookmark button and toggles icon/accessibility when bookmarked state changes", () => {
    const onBookmarkPress = jest.fn();

    const { getByTestId, rerender, getByText } = renderWithTheme(
      <AnimeCard
        anime={mockAnime}
        onBookmarkPress={onBookmarkPress}
        isBookmarked={true}
      />
    );

    // bookmark button should exist
    const bookmark = getByTestId("bookmark-button");
    expect(bookmark).toBeTruthy();

    // accessibility label should indicate removal when bookmarked
    // read the accessibilityLabel prop from the rendered test instance
    expect(
      (bookmark.props as unknown as { accessibilityLabel?: string })
        .accessibilityLabel
    ).toBe(`Remove Card Anime from bookmarks`);

    // icon should show filled star when bookmarked
    expect(getByText("★")).toBeTruthy();

    // pressing bookmark calls handler
    fireEvent.press(bookmark);
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);

    // rerender with not-bookmarked
    rerender(
      <AnimeCard
        anime={mockAnime}
        onBookmarkPress={onBookmarkPress}
        isBookmarked={false}
      />
    );

    const bookmarkAfter = getByTestId("bookmark-button");
    expect(
      (bookmarkAfter.props as unknown as { accessibilityLabel?: string })
        .accessibilityLabel
    ).toBe(`Add Card Anime to bookmarks`);
    expect(getByText("☆")).toBeTruthy();
  });

  it("calls onPress when card is pressed", () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <AnimeCard anime={mockAnime} onPress={onPress} />
    );

    const title = getByText("Card Anime");
    fireEvent.press(title);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
