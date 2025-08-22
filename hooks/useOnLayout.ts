import { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

export const useOnLayout = () => {
  const [layout, setLayout] = useState<LayoutRectangle>();

  const onLayout = (e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout);

  return [layout, onLayout] as const;
};
