import { fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimeCard } from "@/components/anime-card";
import { AnimeInterface } from "@/db/schema";
import { renderWithTheme } from "@/jest.utils";

const mockAnime: AnimeInterface = {
  id: "card-anime-1",
  title: "Card Anime",
  snapshot: "https://example.com/card-image.jpg",
  episode: 12,
  duration: 24,
  session: null,
  edition: null,
  url: "https://example.com/card-anime-1",
  created_at: null,
  updated_at: null,
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
