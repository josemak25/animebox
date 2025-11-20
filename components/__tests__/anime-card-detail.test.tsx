import React from "react";

import AnimeCardDetail from "@/app/anime-card-detail";
import { renderWithTheme } from "@/jest.utils";

describe("AnimeCardDetail", () => {
  it("renders within a ThemedView container", () => {
    renderWithTheme(<AnimeCardDetail />);
  });
});
