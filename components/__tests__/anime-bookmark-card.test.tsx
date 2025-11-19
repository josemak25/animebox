import { fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimeCard } from "@/components/anime-card";
import { AnimeInterface } from "@/db/schema";
import { renderWithTheme } from "@/jest.utils";

const mockAnime: AnimeInterface = {
  episode: 1,
  duration: 24,
  session: null,
  edition: null,
  created_at: null,
  updated_at: null,
  id: "test-anime-1",
  title: "Test Anime",
  url: "https://example.com/test-anime-1",
  snapshot: "https://example.com/image.jpg",
};

describe("AnimeCard", () => {
  it("renders anime card with title", () => {
    const { getByText } = renderWithTheme(<AnimeCard anime={mockAnime} />);

    expect(getByText("Test Anime")).toBeTruthy();
  });

  it("calls onPress when card is pressed", () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <AnimeCard anime={mockAnime} onPress={onPress} />
    );

    const card = getByText("Test Anime");
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onBookmarkPress when bookmark button is pressed", () => {
    const onBookmarkPress = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <AnimeCard anime={mockAnime} onBookmarkPress={onBookmarkPress} />
    );

    const bookmarkButton = getByLabelText("Remove Test Anime from bookmarks");
    fireEvent.press(bookmarkButton);
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
  });

  it("renders without onPress callback", () => {
    const { getByText } = renderWithTheme(<AnimeCard anime={mockAnime} />);

    expect(getByText("Test Anime")).toBeTruthy();
  });

  it("handles anime with string title", () => {
    const animeWithStringTitle = {
      ...mockAnime,
      title: "Simple Title",
    };

    const { getByText } = renderWithTheme(
      <AnimeCard anime={animeWithStringTitle} />
    );

    expect(getByText("Simple Title")).toBeTruthy();
  });
});
