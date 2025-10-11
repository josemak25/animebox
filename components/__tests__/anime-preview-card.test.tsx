import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimePreviewCard } from "@/components/anime-preview-card";
import { Providers } from "@/providers";

const renderWithProviders = (ui: React.ReactElement) =>
  render(<Providers>{ui}</Providers>);

const mockAnime: IAnimeResult = {
  id: "preview-anime-1",
  title: {
    english: "Preview Anime",
    romaji: "Preview Anime",
    userPreferred: "Preview Anime",
  },
  image: "https://example.com/preview-image.jpg",
  cover: "https://example.com/preview-cover.jpg",
  status: "Completed" as MediaStatus,
  rating: 9.0,
  type: "Movie" as MediaFormat,
  releaseDate: "2023",
};

describe("AnimePreviewCard", () => {
  it("renders anime preview card with title and description", () => {
    const { getByText } = renderWithProviders(
      <AnimePreviewCard
        anime={mockAnime}
        description="An amazing anime story"
      />
    );

    expect(getByText("Preview Anime")).toBeTruthy();
    expect(getByText("An amazing anime story")).toBeTruthy();
  });

  it("renders season and episode information", () => {
    const { getByText } = renderWithProviders(
      <AnimePreviewCard
        anime={mockAnime}
        season="Season 2"
        episode="Episode 8"
      />
    );

    expect(getByText("Season 2")).toBeTruthy();
    expect(getByText("Episode 8")).toBeTruthy();
  });

  it("renders badge when provided", () => {
    const { getByText } = renderWithProviders(
      <AnimePreviewCard anime={mockAnime} badge="NEW" />
    );

    expect(getByText("NEW")).toBeTruthy();
  });

  it("calls onPlay when Play button is pressed", () => {
    const onPlay = jest.fn();
    const { getByText } = renderWithProviders(
      <AnimePreviewCard anime={mockAnime} onPlay={onPlay} />
    );

    const playButton = getByText("Play");
    fireEvent.press(playButton);
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("calls onAddToList when Add to My List button is pressed", () => {
    const onAddToList = jest.fn();
    const { getByText } = renderWithProviders(
      <AnimePreviewCard anime={mockAnime} onAddToList={onAddToList} />
    );

    const addButton = getByText("My List");
    fireEvent.press(addButton);
    expect(onAddToList).toHaveBeenCalledTimes(1);
  });

  it("shows 'My List' with checkmark when isInList is true", () => {
    const { getByText } = renderWithProviders(
      <AnimePreviewCard anime={mockAnime} isInList={true} />
    );

    expect(getByText("My List")).toBeTruthy();
    expect(getByText("✓")).toBeTruthy();
  });

  it("renders release info when provided", () => {
    const { getByText } = renderWithProviders(
      <AnimePreviewCard
        anime={mockAnime}
        releaseInfo="Season 2 concludes Sept 3"
      />
    );

    expect(getByText("(Season 2 concludes Sept 3)")).toBeTruthy();
  });

  it("handles anime with string title", () => {
    const animeWithStringTitle = {
      ...mockAnime,
      title: "Simple Preview Title",
    };

    const { getByText } = renderWithProviders(
      <AnimePreviewCard anime={animeWithStringTitle} />
    );

    expect(getByText("Simple Preview Title")).toBeTruthy();
  });

  it("renders without optional props", () => {
    const { getByText } = renderWithProviders(
      <AnimePreviewCard anime={mockAnime} />
    );

    expect(getByText("Preview Anime")).toBeTruthy();
  });

  it("does not call onPlay when button is not pressed", () => {
    const onPlay = jest.fn();
    renderWithProviders(<AnimePreviewCard anime={mockAnime} onPlay={onPlay} />);

    expect(onPlay).not.toHaveBeenCalled();
  });

  it("does not call onAddToList when button is not pressed", () => {
    const onAddToList = jest.fn();
    renderWithProviders(
      <AnimePreviewCard anime={mockAnime} onAddToList={onAddToList} />
    );

    expect(onAddToList).not.toHaveBeenCalled();
  });
});
