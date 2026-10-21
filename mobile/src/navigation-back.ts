import type { Href, router } from "expo-router";

type BackNavigation = Pick<typeof router, "canGoBack" | "back" | "replace">;

// Direct URLs and refreshed screens can be the first route in their navigator.
export function backOrReplace(
  navigation: BackNavigation,
  fallback: Href = "/(tabs)",
) {
  if (navigation.canGoBack()) navigation.back();
  else navigation.replace(fallback);
}
