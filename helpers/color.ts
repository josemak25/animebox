/**
 *
 * @description hexToRGB a method for converting hex colors to rgb and rgba colors
 * @function hexToRGB
 * @property hexColor {string}
 * @property alpha {number}
 * @returns string
 */

export const hexToRGB = (hexColor: string, alpha?: number): string => {
  const [r, g, b] = hexColor.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return alpha ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
};

// Adjust each channel
const adjustChannel = (channel: number, factor: number): number =>
  Math.min(Math.max(Math.round(channel * factor), 0), 255);

export const adjustColorBrightness = (
  hexColor: string,
  factor: number
): string => {
  /**
   * Adjust the brightness of a hex color.
   *
   * @param hexColor - A hex color string, e.g., "#RRGGBB".
   * @param factor - A number where >1 makes the color lighter,
   *                 <1 makes it darker, and 1 returns the same color.
   * @returns The adjusted hex color.
   */

  // Remove the leading '#' if present
  hexColor = hexColor.replace(/^#/, "");

  if (hexColor.length !== 6) {
    throw new Error("Input must be a valid 6-character hex color.");
  }

  // Convert hex color to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  const newR = adjustChannel(r, factor);
  const newG = adjustChannel(g, factor);
  const newB = adjustChannel(b, factor);

  // Convert back to hex
  const newHexColor = `#${newR.toString(16).padStart(2, "0")}${newG
    .toString(16)
    .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`.toUpperCase();

  return newHexColor;
};
