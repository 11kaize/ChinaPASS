import { previewCopy } from "../preview-copy";
import React, { useEffect, useState } from "react";
import { Stack, ThemeProvider, DefaultTheme, DarkTheme } from "expo-router";
import {
  StatusBar,
  Platform,
  Appearance,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { isRunningInExpoGo } from "expo";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProductProvider, useProduct } from "../product-state";
import { AppProvider, useApp } from "../state";
import { useReducedMotion } from "../ui";
import { prepareArtwork } from "../prepare-artwork";
void SplashScreen.preventAutoHideAsync().catch(() => {});
function AppNavigation() {
  const { hydrated, colors, isDark, prefs } = useApp();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const copy = previewCopy[prefs.language];
    document.documentElement.lang = prefs.language;
    document.title = "ChinaBuddy";
    document
      .querySelectorAll<HTMLElement>("[data-preview-copy]")
      .forEach((node) => {
        const key = node.dataset.previewCopy as keyof typeof copy;
        if (copy[key]) node.textContent = copy[key];
      });
    document.getElementById("phone")?.setAttribute("aria-label", copy.phone);
  }, [prefs.language]);
  const { ready } = useProduct();
  const [artworkReady, setArtworkReady] = useState(false);
  useEffect(() => {
    let live = true;
    void prepareArtwork().finally(() => {
      if (live) setArtworkReady(true);
    });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (hydrated && ready && artworkReady) {
      if (!isRunningInExpoGo())
        SplashScreen.setOptions({ duration: reduce ? 0 : 350, fade: !reduce });
      void SplashScreen.hideAsync();
    }
  }, [hydrated, ready, artworkReady, reduce]);
  useEffect(() => {
    if (hydrated && Platform.OS !== "web")
      Appearance.setColorScheme(
        prefs.appearance === "system" ? "unspecified" : prefs.appearance,
      );
  }, [hydrated, prefs.appearance]);
  useEffect(() => {
    if (Platform.OS === "web")
      document
        .getElementById("phone")
        ?.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);
  if (!hydrated || !ready || !artworkReady)
    return (
      <View
        accessibilityLabel={previewCopy[prefs.language].loading}
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.ink, fontSize: 13, letterSpacing: 2 }}>
          CHINABUDDY
        </Text>
        <Text style={{ color: colors.secondary, fontSize: 12 }}>
          {previewCopy[prefs.language].loading}
        </Text>
      </View>
    );
  const base = isDark ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: colors.accent,
          background: colors.bg,
          card: colors.surface,
          text: colors.ink,
          border: colors.line,
          notification: colors.danger,
        },
      }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        {...(Platform.OS === "android" && Number(Platform.Version) < 35
          ? { backgroundColor: colors.bg, translucent: true }
          : {})}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: reduce
            ? "none"
            : Platform.OS === "ios"
              ? "simple_push"
              : "slide_from_right",
          animationDuration: 280,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="welcome"
          options={{
            animation: reduce ? "none" : "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="card"
          options={{
            presentation: "fullScreenModal",
            animation: reduce ? "none" : "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="ai-config"
          options={{
            presentation: "modal",
            animation: reduce ? "none" : "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="ports"
          options={{
            presentation: "modal",
            animation: reduce ? "none" : "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="trip"
          options={{
            presentation: "modal",
            animation: reduce ? "none" : "slide_from_bottom",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ProductProvider>
          <AppNavigation />
        </ProductProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
