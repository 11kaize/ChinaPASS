import { useSyncExternalStore } from "react";
import { AccessibilityInfo, Platform } from "react-native";

// One system subscription for the whole app, rather than one per button/card.
const listeners = new Set<() => void>();
let reduced = false;
let stop: (() => void) | undefined;
function publish(value: boolean) {
  if (reduced === value) return;
  reduced = value;
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const change = () => publish(media.matches);
      media.addEventListener("change", change);
      change();
      stop = () => media.removeEventListener("change", change);
    } else {
      let live = true;
      const event = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        publish,
      );
      void AccessibilityInfo.isReduceMotionEnabled()
        .then((value) => {
          if (live) publish(value);
        })
        .catch(() => {});
      stop = () => {
        live = false;
        event.remove();
      };
    }
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      stop?.();
      stop = undefined;
    }
  };
}
function snapshot() {
  return Platform.OS === "web" && typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : reduced;
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
