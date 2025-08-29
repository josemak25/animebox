import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

export const Home = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fillRule="evenodd"
      fill={props.color || "#fff"}
      d="M16.67 17.927c.46-.412.75-1.01.75-1.677V9.466a2.25 2.25 0 0 0-.879-1.783l-5.25-4.039a2.25 2.25 0 0 0-2.743 0l-5.25 4.039a2.252 2.252 0 0 0-.879 1.783v6.784c0 .667.29 1.265.75 1.677.396.355.918.57 1.49.573h.76v-5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v5.25h.76a2.242 2.242 0 0 0 1.49-.573Zm3-1.677a4.5 4.5 0 0 1-4.5 4.5H4.67a4.5 4.5 0 0 1-4.5-4.5V9.466A4.5 4.5 0 0 1 1.925 5.9l5.25-4.038a4.5 4.5 0 0 1 5.487 0l5.25 4.038a4.5 4.5 0 0 1 1.756 3.567v6.784Zm-7.5-3a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v5.25h4.5v-5.25Z"
      clipRule="evenodd"
    />
  </Svg>
);

Home.displayName = "HomeComponent";
