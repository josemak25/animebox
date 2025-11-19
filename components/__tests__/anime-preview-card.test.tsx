import { fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimePreviewCard } from "@/components/anime-preview-card";
import { AnimeInterface } from "@/db/schema";
import { renderWithTheme } from "@/jest.utils";

const mockAnime: AnimeInterface = {
  id: "preview-anime-1",
  title: "Preview Anime",
  snapshot: "https://example.com/preview-image.jpg",
  episode: 1,
  duration: 120,
  session: null,
  edition: null,
  url: "https://example.com/preview",
  created_at: null,
  updated_at: null,
};

describe("AnimePreviewCard", () => {
  it("renders anime preview card with title", () => {
    const { getByText } = renderWithTheme(
      <AnimePreviewCard anime={mockAnime} />
    );

    expect(getByText("Preview Anime")).toBeTruthy();
  });

  it("renders Play and My List buttons", () => {
    const { getByText } = renderWithTheme(
      <AnimePreviewCard anime={mockAnime} />
    );

    expect(getByText("Play")).toBeTruthy();
    expect(getByText("My List")).toBeTruthy();
  });

  it("calls onPlay when Play button is pressed", () => {
    const onPlay = jest.fn();
    const { getByText } = renderWithTheme(
      <AnimePreviewCard anime={mockAnime} onPlay={onPlay} />
    );

    const playButton = getByText("Play");
    fireEvent.press(playButton);
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("calls onAddToList when Add to My List button is pressed", () => {
    const onAddToList = jest.fn();
    const { getByText } = renderWithTheme(
      <AnimePreviewCard anime={mockAnime} onAddToList={onAddToList} />
    );

    const addButton = getByText("My List");
    fireEvent.press(addButton);
    expect(onAddToList).toHaveBeenCalledTimes(1);
  });

  it("shows 'My List' button when isInList is true", () => {
    const { getByText } = renderWithTheme(
      <AnimePreviewCard anime={mockAnime} isInList={true} />
    );

    expect(getByText("My List")).toBeTruthy();
  });

  it("handles anime with string title", () => {
    const animeWithStringTitle = {
      ...mockAnime,
      title: "Simple Preview Title",
    };

    const { getByText } = renderWithTheme(
      <AnimePreviewCard anime={animeWithStringTitle} />
    );

    expect(getByText("Simple Preview Title")).toBeTruthy();
  });

  it("renders without optional props", () => {
    const { getByText } = renderWithTheme(
      <AnimePreviewCard anime={mockAnime} />
    );

    expect(getByText("Preview Anime")).toBeTruthy();
  });

  it("does not call onPlay when button is not pressed", () => {
    const onPlay = jest.fn();
    renderWithTheme(<AnimePreviewCard anime={mockAnime} onPlay={onPlay} />);

    expect(onPlay).not.toHaveBeenCalled();
  });

  it("does not call onAddToList when button is not pressed", () => {
    const onAddToList = jest.fn();
    renderWithTheme(
      <AnimePreviewCard anime={mockAnime} onAddToList={onAddToList} />
    );

    expect(onAddToList).not.toHaveBeenCalled();
  });
});
