import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AnimeGrid, AnimeGridItem } from "../AnimeGrid";

const mockData: AnimeGridItem[] = [
  {
    id: 1,
    anime_title: "Naruto",
    anime_session: "S1",
    episode: 183,
    snapshot: "https://cdn.animebox.app/sample-naruto.jpg",
    completed: 0,
  },
  {
    id: 2,
    anime_title: "Attack on Titan",
    anime_session: "2022 ON AIR",
    episode: 24,
    snapshot: "https://cdn.animebox.app/sample-aot.jpg",
    completed: 1,
  },
];

describe("AnimeGrid", () => {
  it("renders a 2-column grid of anime cards", () => {
    const { getByText } = render(
      <AnimeGrid data={mockData} onAnimePress={() => {}} />
    );
    expect(getByText("Naruto")).toBeTruthy();
    expect(getByText("Attack on Titan")).toBeTruthy();
    expect(getByText("Ep. 183")).toBeTruthy();
    expect(getByText("Ep. 24")).toBeTruthy();
    expect(getByText("S1")).toBeTruthy();
    expect(getByText("2022 ON AIR")).toBeTruthy();
  });

  it("calls onAnimePress when a card is pressed", () => {
    const onAnimePress = jest.fn();
    const { getAllByLabelText } = render(
      <AnimeGrid data={mockData} onAnimePress={onAnimePress} />
    );
    const cards = getAllByLabelText(/preview card/);
    fireEvent.press(cards[0]);
    expect(onAnimePress).toHaveBeenCalledWith(1);
  });

  it("shows empty state if no data", () => {
    const { getByText } = render(
      <AnimeGrid data={[]} onAnimePress={() => {}} />
    );
    expect(getByText("No anime found.")).toBeTruthy();
  });
});
