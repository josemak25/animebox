import React, { FC, useRef } from "react";
import { WebView } from "react-native-webview";

import { withThemeStyles } from "@/helpers/withThemeStyles";

type HeadlessWebViewProps = {
  url: string;
  onHTML: (html: string) => void;
};

export const HeadlessWebView: FC<HeadlessWebViewProps> = ({ url, onHTML }) => {
  const webviewRef = useRef(null);
  const { styles } = useStyles();

  const injectedJS = `
    (function() {
      window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);
    })();
    true;
  `;

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: url }}
      style={styles.container}
      injectedJavaScript={injectedJS}
      onMessage={(e) => onHTML(e.nativeEvent.data)}
    />
  );
};

const useStyles = withThemeStyles(() => ({
  container: {
    width: 0,
    height: 0,
    opacity: 0,
  },
}));
