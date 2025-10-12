import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimeBookmarkCard } from "@/components/anime-bookmark-card";
import { Providers } from "@/providers";

const renderWithProviders = (ui: React.ReactElement) =>
  render(<Providers>{ui}</Providers>);

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

describe("AnimeBookmarkCard", () => {
  it("renders anime card with title", () => {
    const { getByText } = renderWithProviders(
      <AnimeBookmarkCard anime={mockAnime} />
    );

    expect(getByText("Test Anime")).toBeTruthy();
  });

  it("calls onPress when card is pressed", () => {
    const onPress = jest.fn();
    const { getByText } = renderWithProviders(
      <AnimeBookmarkCard anime={mockAnime} onPress={onPress} />
    );

    const card = getByText("Test Anime");
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onBookmarkPress when bookmark button is pressed", () => {
    const onBookmarkPress = jest.fn();
    const { getByLabelText } = renderWithProviders(
      <AnimeBookmarkCard anime={mockAnime} onBookmarkPress={onBookmarkPress} />
    );

    const bookmarkButton = getByLabelText("Remove Test Anime from bookmarks");
    fireEvent.press(bookmarkButton);
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
  });

  it("renders without onPress callback", () => {
    const { getByText } = renderWithProviders(
      <AnimeBookmarkCard anime={mockAnime} />
    );

    expect(getByText("Test Anime")).toBeTruthy();
  });

  it("handles anime with string title", () => {
    const animeWithStringTitle = {
      ...mockAnime,
      title: "Simple Title",
    };

    const { getByText } = renderWithProviders(
      <AnimeBookmarkCard anime={animeWithStringTitle} />
    );

    expect(getByText("Simple Title")).toBeTruthy();
  });
});
