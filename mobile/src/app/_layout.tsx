import React, { useEffect } from "react";
import { Stack, ThemeProvider, DefaultTheme, DarkTheme } from "expo-router";
import { StatusBar, Platform, Appearance, View, ActivityIndicator, ImageBackground, Text } from "react-native";
import { isRunningInExpoGo } from "expo";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProductProvider, useProduct } from "../product-state";
import { AppProvider, useApp } from "../state";
import { useReducedMotion } from "../ui";
void SplashScreen.preventAutoHideAsync().catch(() => {});
function AppNavigation() {
  const { hydrated, colors, isDark, prefs } = useApp();
  const reduce = useReducedMotion();
  const { ready } = useProduct();
  useEffect(() => {
    if (hydrated && ready) {
      if (!isRunningInExpoGo())
        SplashScreen.setOptions({ duration: reduce ? 0 : 350, fade: !reduce });
      void SplashScreen.hideAsync();
    }
  }, [hydrated, ready, reduce]);
  useEffect(() => {
    if (hydrated && Platform.OS !== "web")
      Appearance.setColorScheme(
        prefs.appearance === "system" ? "unspecified" : prefs.appearance,
      );
  }, [hydrated, prefs.appearance]);
  useEffect(() => {
    if (Platform.OS === "web") document.getElementById("phone")?.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);
  if (!hydrated || !ready) return <ImageBackground source={require("../../assets/login-gateway.png")} imageStyle={{width:"100%",height:"100%"}} style={{flex:1,backgroundColor:"#081426",alignItems:"center",justifyContent:"center"}}><View style={{gap:20,alignItems:"center",padding:26,borderRadius:28,backgroundColor:"rgba(5,17,39,0.55)"}}><ActivityIndicator size="large" color="#C4DDFF"/><Text style={{color:"#E1EDFF",fontSize:13,letterSpacing:2}}>CHINAHAND</Text></View></ImageBackground>;
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
          animation: reduce ? "none" : "slide_from_right",
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
        <Stack.Screen name="ai-config" options={{ presentation: "modal", animation: reduce ? "none" : "slide_from_bottom" }} />
        <Stack.Screen name="ports" options={{ presentation: "modal", animation: reduce ? "none" : "slide_from_bottom" }} />
        <Stack.Screen name="trip" options={{ presentation: "modal", animation: reduce ? "none" : "slide_from_bottom" }} />
      </Stack>
    </ThemeProvider>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ProductProvider><AppNavigation /></ProductProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
