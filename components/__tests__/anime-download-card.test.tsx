import { fireEvent } from "@testing-library/react-native";

import {
  DownloadCard,
  DownloadCardProps,
} from "@/components/anime-download-card";
import { renderWithTheme } from "@/jest.utils";

const defaultProps: DownloadCardProps = {
  title: "Ginny & Georgia",
  subtitle: "1 Episode",
  status: "Downloading...",
  image: "https://example.com/image.jpg",
  hasError: false,
  seasonal: false,
  progress: 0.6,
  onPress: jest.fn(),
};

describe("DownloadCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the card with all props", () => {
      const { getByText } = renderWithTheme(<DownloadCard {...defaultProps} />);

      expect(getByText("Ginny & Georgia")).toBeTruthy();
      expect(getByText("1 Episode")).toBeTruthy();
      expect(getByText("Downloading...")).toBeTruthy();
    });

    it("renders title without optional props", () => {
      const { getByText, queryByText } = renderWithTheme(
        <DownloadCard title="Test Show" image="https://example.com/test.jpg" />
      );

      expect(getByText("Test Show")).toBeTruthy();
      expect(queryByText("1 Episode")).toBeNull();
    });

    it("renders subtitle when provided", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          subtitle="5 Episodes"
          image="https://example.com/test.jpg"
        />
      );

      expect(getByText("5 Episodes")).toBeTruthy();
    });

    it("does not render subtitle when not provided", () => {
      const { queryByText } = renderWithTheme(
        <DownloadCard title="Test Show" image="https://example.com/test.jpg" />
      );

      expect(queryByText("Episode")).toBeNull();
    });

    it("renders status message when provided", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          status="Failed!"
          image="https://example.com/test.jpg"
        />
      );

      expect(getByText("Failed!")).toBeTruthy();
    });

    it("does not render status when not provided", () => {
      const { queryByText } = renderWithTheme(
        <DownloadCard title="Test Show" image="https://example.com/test.jpg" />
      );

      expect(queryByText("Failed!")).toBeNull();
      expect(queryByText("Downloading...")).toBeNull();
    });
  });

  describe("Seasonal vs Non-seasonal", () => {
    it("renders play icon (▶) for non-seasonal content with error", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          seasonal={false}
          hasError={true}
        />
      );

      expect(getByText("▶")).toBeTruthy();
    });

    it("renders chevron icon (>) for seasonal content with error", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          seasonal={true}
          hasError={true}
        />
      );

      expect(getByText(">")).toBeTruthy();
    });

    it("does not render icon when hasError is false", () => {
      const { queryByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          hasError={false}
        />
      );

      expect(queryByText("▶")).toBeNull();
      expect(queryByText(">")).toBeNull();
    });

    it("does not render icon when hasError is undefined", () => {
      const { queryByText } = renderWithTheme(
        <DownloadCard title="Test Show" image="https://example.com/test.jpg" />
      );

      expect(queryByText("▶")).toBeNull();
      expect(queryByText(">")).toBeNull();
    });
  });

  describe("Progress Bar", () => {
    it("renders with 0% progress", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          progress={0}
        />
      );

      expect(getByText("Test Show")).toBeTruthy();
    });

    it("renders with 50% progress", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          progress={0.5}
        />
      );

      expect(getByText("Test Show")).toBeTruthy();
    });

    it("renders with 100% progress", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          progress={1}
        />
      );

      expect(getByText("Test Show")).toBeTruthy();
    });

    it("defaults to 0 progress when not provided", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard title="Test Show" image="https://example.com/test.jpg" />
      );

      expect(getByText("Test Show")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("calls onPress when card is pressed", () => {
      const onPress = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          onPress={onPress}
        />
      );

      const card = getByLabelText("Open Test Show");
      fireEvent.press(card);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not throw when onPress is not provided", () => {
      const { getByLabelText } = renderWithTheme(
        <DownloadCard title="Test Show" image="https://example.com/test.jpg" />
      );

      const card = getByLabelText("Open Test Show");

      expect(() => fireEvent.press(card)).not.toThrow();
    });

    it("does not call onPress when not pressed", () => {
      const onPress = jest.fn();
      renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          onPress={onPress}
        />
      );

      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByLabelText } = renderWithTheme(
        <DownloadCard
          title="My Favorite Show"
          image="https://example.com/test.jpg"
        />
      );

      expect(getByLabelText("Open My Favorite Show")).toBeTruthy();
    });

    it("is accessible as a pressable element", () => {
      const onPress = jest.fn();
      const { getByLabelText } = renderWithTheme(
        <DownloadCard
          title="Test Show"
          image="https://example.com/test.jpg"
          onPress={onPress}
        />
      );

      const card = getByLabelText("Open Test Show");
      expect(card).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty title gracefully", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard title="" image="https://example.com/test.jpg" />
      );

      expect(getByText("")).toBeTruthy();
    });

    it("handles long titles", () => {
      const longTitle =
        "This is a very long title that might wrap to multiple lines";
      const { getByText } = renderWithTheme(
        <DownloadCard title={longTitle} image="https://example.com/test.jpg" />
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it("handles special characters in title", () => {
      const specialTitle = "Show & Movie: The 'Quotation' Test!";
      const { getByText } = renderWithTheme(
        <DownloadCard
          title={specialTitle}
          image="https://example.com/test.jpg"
        />
      );

      expect(getByText(specialTitle)).toBeTruthy();
    });

    it("handles missing image URL", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard title="Test Show" image="" />
      );

      expect(getByText("Test Show")).toBeTruthy();
    });

    it("renders correctly with all optional props undefined", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Minimal Show"
          image="https://example.com/test.jpg"
        />
      );

      expect(getByText("Minimal Show")).toBeTruthy();
    });
  });

  describe("Complex Scenarios", () => {
    it("renders seasonal card with error and full progress", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Seasonal Show"
          subtitle="12 Episodes"
          status="Complete"
          image="https://example.com/test.jpg"
          seasonal={true}
          hasError={true}
          progress={1}
        />
      );

      expect(getByText("Seasonal Show")).toBeTruthy();
      expect(getByText("12 Episodes")).toBeTruthy();
      expect(getByText("Complete")).toBeTruthy();
      expect(getByText(">")).toBeTruthy();
    });

    it("renders failed download state", () => {
      const onPress = jest.fn();
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Failed Show"
          subtitle="Season 1"
          status="Failed!"
          image="https://example.com/test.jpg"
          hasError={true}
          progress={0.3}
          onPress={onPress}
        />
      );

      expect(getByText("Failed Show")).toBeTruthy();
      expect(getByText("Season 1")).toBeTruthy();
      expect(getByText("Failed!")).toBeTruthy();
      expect(getByText("▶")).toBeTruthy();
    });

    it("renders downloading state with partial progress", () => {
      const { getByText } = renderWithTheme(
        <DownloadCard
          title="Downloading Show"
          subtitle="Episode 5"
          status="Downloading... 60%"
          image="https://example.com/test.jpg"
          progress={0.6}
        />
      );

      expect(getByText("Downloading Show")).toBeTruthy();
      expect(getByText("Episode 5")).toBeTruthy();
      expect(getByText("Downloading... 60%")).toBeTruthy();
    });

    it("handles multiple cards with different states", () => {
      const { getByText } = renderWithTheme(
        <>
          <DownloadCard
            title="Show 1"
            image="https://example.com/1.jpg"
            progress={0.2}
          />
          <DownloadCard
            title="Show 2"
            image="https://example.com/2.jpg"
            progress={0.8}
            hasError={true}
          />
        </>
      );

      expect(getByText("Show 1")).toBeTruthy();
      expect(getByText("Show 2")).toBeTruthy();
    });
  });
});
