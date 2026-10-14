import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../../state";
import { Icon } from "../../ui";
export default function TabLayout() {
  const { prefs, colors, isDark, t } = useApp();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12);
  if (!prefs.onboarded) return <Redirect href="/welcome" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 4 },
        tabBarStyle: {
          height: 60 + bottom,
          paddingTop: 9,
          paddingBottom: bottom,
          borderTopWidth: 0,
          backgroundColor: colors.surface,
        },
        tabBarItemStyle: { borderRadius: 16 },
        ...(Platform.OS === "ios"
          ? {
              tabBarBackground: () => (
                <BlurView
                  tint={isDark ? "dark" : "light"}
                  intensity={70}
                  style={{ flex: 1, backgroundColor: colors.surface }}
                />
              ),
            }
          : {}),
      }}
    >
      {(["index", "guides", "cards", "chat", "settings"] as const).map(
        (name, i) => {
          const icon = ["today", "guides", "cards", "chat", "settings"][i];
          return (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title: t(icon as "today"),
                tabBarIcon: ({ color, focused }) => (
                  <Icon
                    name={icon}
                    size={25}
                    color={typeof color === "string" ? color : colors.accent}
                    weight={focused ? "fill" : "regular"}
                  />
                ),
              }}
            />
          );
        },
      )}
    </Tabs>
  );
}
