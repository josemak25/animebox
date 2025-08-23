import { Link, type Href } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Platform } from "react-native";

/**
 * ExternalLink - A cross-platform external link component for Expo Router.
 *
 * Opens links in a new tab on web, or in an in-app browser on native platforms.
 *
 * Implementation notes:
 * - Uses expo-router's Link for navigation
 * - On native, intercepts press to open with expo-web-browser
 * - Accepts all Link props except 'href', which is required as a string
 *
 * @example
 * <ExternalLink href="https://example.com">Visit Example</ExternalLink>
 *
 * @param props - All Link props except 'href', plus a required string href
 */
export function ExternalLink(
  props: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }
) {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href as Href}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href);
        }
      }}
    />
  );
}
