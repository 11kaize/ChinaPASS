import React, { useLayoutEffect, useRef } from "react";
import { View, type ViewStyle } from "react-native";
import { useIsFocused, useNavigation } from "expo-router";
import { useReducedMotion } from "./motion";

export function PageMotion({
  children,
  style,
}: {
  children: React.ReactNode;
  style: ViewStyle;
}) {
  const ref = useRef<View>(null);
  const navigation = useNavigation();
  const reduced = useReducedMotion();
  const focused = useIsFocused();
  // Begin before paint so the first frame cannot flash at its resting position.
  useLayoutEffect(() => {
    const node = ref.current as unknown as HTMLElement | null;
    if (
      !focused ||
      reduced ||
      document.hidden ||
      !node ||
      typeof node.animate !== "function"
    )
      return;
    const tab = navigation.getState()?.type === "tab";
    // Transform only: no layout animation, JS frame loop or opacity on glass.
    // NativeStackView has no browser transition; this is the sole web owner.
    const animation = node.animate(
      [
        { transform: `translate3d(${tab ? 4 : 12}px, 0, 0)` },
        { transform: "translate3d(0, 0, 0)" },
      ],
      { duration: tab ? 160 : 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    // No persistent will-change layer. Cancellation leaves the underlying view
    // at its final, visible position, including on rapid navigation or blur.
    const cancelWhenHidden = () => {
      if (document.hidden) animation.cancel();
    };
    document.addEventListener("visibilitychange", cancelWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", cancelWhenHidden);
      animation.cancel();
    };
  }, [focused, navigation, reduced]);
  return (
    <View ref={ref} style={style}>
      {children}
    </View>
  );
}
