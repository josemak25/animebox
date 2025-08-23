import { describe, expect, it } from "@jest/globals";
import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react-native";

import { ThemeProvider } from "@/providers/theme/ThemeProvider";

import { withThemeStyles } from "../withThemeStyles";

describe("helper / withThemeStyles", () => {
  it("should return hook handler", () => {
    const useStyles = withThemeStyles(() => ({ container: { flex: 1 } }));

    expect(useStyles).toBeInstanceOf(Function);
  });

  it("should return styles object", async () => {
    const styles = { container: { flex: 1 } };
    const useStyles = withThemeStyles(() => styles);

    const { result } = renderHook(() => useStyles(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      // wait until the palette is available (indicates state is settled)
      expect(result.current.palette).toBeTruthy();
    });

    expect(result.current).toHaveProperty("styles");
    // Check that the styles object has the correct keys
    expect(result.current.styles).toHaveProperty("container");
    // Check that the styles object matches the expected structure
    expect(result.current.styles).toEqual(styles);
  });
});
