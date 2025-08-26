import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimePreviewCard, AnimePreviewCardProps } from "../AnimePreviewCard";

describe("AnimePreviewCard", () => {
  const baseProps: AnimePreviewCardProps = {
    imageUrl: "https://cdn.animebox.app/sample-cover.jpg",
    title: "Jujutsu Kaisen",
    season: "Season 2",
    episode: "Episode 12",
    description: "Yuji faces his toughest challenge yet.",
    releaseInfo: "Season 2 concludes Sept 3",
    badges: ["Exclusive"],
    onPlay: jest.fn(),
    onAddToList: jest.fn(),
    isInList: false,
  };

  it("renders all main content", () => {
    const { getByText, getByLabelText } = render(
      <AnimePreviewCard {...baseProps} />
    );
    expect(getByText("Jujutsu Kaisen")).toBeTruthy();
    expect(getByText("Season 2")).toBeTruthy();
    expect(getByText("Episode 12")).toBeTruthy();
    expect(getByText("Yuji faces his toughest challenge yet.")).toBeTruthy();
    expect(getByText("Season 2 concludes Sept 3")).toBeTruthy();
    expect(getByText("Exclusive")).toBeTruthy();
    expect(getByLabelText("Play Jujutsu Kaisen")).toBeTruthy();
    expect(getByLabelText("Add Jujutsu Kaisen to My List")).toBeTruthy();
  });

  it("calls onPlay and onAddToList", () => {
    const onPlay = jest.fn();
    const onAddToList = jest.fn();
    const { getByLabelText } = render(
      <AnimePreviewCard
        {...baseProps}
        onPlay={onPlay}
        onAddToList={onAddToList}
      />
    );
    fireEvent.press(getByLabelText("Play Jujutsu Kaisen"));
    expect(onPlay).toHaveBeenCalled();
    fireEvent.press(getByLabelText("Add Jujutsu Kaisen to My List"));
    expect(onAddToList).toHaveBeenCalled();
  });

  it('shows "In My List" when isInList is true', () => {
    const { getByText } = render(
      <AnimePreviewCard {...baseProps} isInList={true} />
    );
    expect(getByText("In My List")).toBeTruthy();
  });
});
