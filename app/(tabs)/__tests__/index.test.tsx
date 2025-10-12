import { waitFor } from "@testing-library/react-native";

import { renderWithProviders } from "@/jest.utils";

import HomeScreen from "../index";

describe("HomeScreen", () => {
  it("renders the Home title", async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText(/Home/)).toBeTruthy();
    });
  });
});
