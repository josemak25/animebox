import { renderWithProviders } from "@/jest.utils";

import DownloadScreen from "../download";

describe("DownloadScreen", () => {
  it("renders the Downloads title", () => {
    const { getByText } = renderWithProviders(<DownloadScreen />);
    expect(getByText("Downloads")).toBeTruthy();
  });
});
