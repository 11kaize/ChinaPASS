import { useSyncExternalStore } from "react";
import { AccessibilityInfo, AppState, Platform } from "react-native";

// One system subscription for the whole app, rather than one per button/card.
const listeners = new Set<() => void>();
// Native accessibility preferences arrive asynchronously. Stay quiet until
// their first value is known, including when the platform query fails.
let reduced = true;
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

const activityListeners = new Set<() => void>();
let stopActivity: (() => void) | undefined;
function activitySnapshot() {
  if (Platform.OS === "web")
    return typeof document !== "undefined" && !document.hidden;
  return (
    AppState.currentState !== "background" &&
    AppState.currentState !== "inactive"
  );
}
function subscribeActivity(listener: () => void) {
  activityListeners.add(listener);
  if (activityListeners.size === 1) {
    const changed = () => activityListeners.forEach((notify) => notify());
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.addEventListener("visibilitychange", changed);
      stopActivity = () =>
        document.removeEventListener("visibilitychange", changed);
    } else {
      const event = AppState.addEventListener("change", changed);
      stopActivity = () => event.remove();
    }
  }
  return () => {
    activityListeners.delete(listener);
    if (!activityListeners.size) {
      stopActivity?.();
      stopActivity = undefined;
    }
  };
}
// Share one foreground listener across every icon; no per-icon AppState subscriptions.
export function useMotionActive() {
  return useSyncExternalStore(subscribeActivity, activitySnapshot, () => false);
}
