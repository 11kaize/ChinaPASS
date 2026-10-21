import React from "react";
import { View, type ViewStyle } from "react-native";

// Native Stack owns the transition. A second focus animation fights its gesture
// and used to shift the contents again when returning to an existing screen.
export function PageMotion({
  children,
  style,
}: {
  children: React.ReactNode;
  style: ViewStyle;
}) {
  return <View style={style}>{children}</View>;
}
