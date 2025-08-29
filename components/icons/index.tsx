import React from "react";
import { SvgProps } from "react-native-svg";

import { Home } from "./home";

export const appIcons = {
  home: Home,
};

export type IconType = keyof typeof appIcons;

export type IconProps = SvgProps & {
  size?: number;
  name: IconType;
  color?: string;
};

const IconComponent: React.FC<IconProps> = React.forwardRef((props, _ref) => {
  const inferredProps = props.size
    ? { width: props.size, height: props.size }
    : {};

  const Component = appIcons[props.name];

  return <Component {...props} {...inferredProps} />;
});

IconComponent.displayName = "IconComponent";

export const Icon = React.memo(IconComponent);
