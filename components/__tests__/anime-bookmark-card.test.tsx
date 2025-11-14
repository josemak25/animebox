import { fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimeCard } from "@/components/anime-card";
import { renderWithTheme } from "@/jest.utils";

const mockAnime: IAnimeResult = {
  id: "test-anime-1",
  title: {
    english: "Test Anime",
    romaji: "Test Anime",
    userPreferred: "Test Anime",
  },
  image: "https://example.com/image.jpg",
  cover: "https://example.com/cover.jpg",
  status: "Ongoing" as MediaStatus,
  rating: 8.5,
  type: "TV" as MediaFormat,
  releaseDate: "2024",
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
