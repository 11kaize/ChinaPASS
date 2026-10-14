import React, { useEffect, useState } from "react";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { useApp } from "./state";

export function GlassMaterial({ radius = 24 }: { radius?: number }) {
  const { colors, isDark } = useApp();
  const [solid, setSolid] = useState(Platform.OS === "ios");
  useEffect(() => {
    if (Platform.OS === "ios") {
      void AccessibilityInfo.isReduceTransparencyEnabled().then(setSolid).catch(() => setSolid(true));
      const listener = AccessibilityInfo.addEventListener("reduceTransparencyChanged", setSolid);
      return () => listener.remove();
    }
    if (Platform.OS === "web") {
      const media = window.matchMedia("(prefers-reduced-transparency: reduce)");
      const change = () => setSolid(media.matches);
      change();
      media.addEventListener("change", change);
      return () => media.removeEventListener("change", change);
    }
  }, []);
  const style = [StyleSheet.absoluteFill, { borderRadius: radius }];
  if (solid || Platform.OS === "android")
    return <View pointerEvents="none" style={[style, { backgroundColor: colors.surface }]} />;
  if (Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable())
    return <GlassView pointerEvents="none" colorScheme={isDark ? "dark" : "light"} glassEffectStyle="regular" style={style} />;
  return (
    <BlurView pointerEvents="none" tint={isDark ? "systemChromeMaterialDark" : "systemChromeMaterialLight"} intensity={65} style={[style, { overflow: "hidden", backgroundColor: isDark ? "rgba(23,39,31,0.48)" : "rgba(250,255,252,0.55)" }]} />
  );
}
