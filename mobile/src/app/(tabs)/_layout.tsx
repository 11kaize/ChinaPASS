import React from "react";
import { Tabs, Redirect } from "expo-router";
import { GlassMaterial } from "../../material";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../../state";
import { Icon } from "../../ui";
import { uiText } from "../../locale-ui";
export default function TabLayout() {
  const { prefs, colors, t } = useApp();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(10, insets.bottom - 10);
  if (!prefs.onboarded) return <Redirect href="/welcome" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelStyle: {
          fontSize: 10,
          lineHeight: 12,
          fontWeight: "600",
          marginTop: 0,
        },
        tabBarStyle: {
          position: "absolute",
          bottom,
          left: 12,
          right: 12,
          height: 68,
          borderRadius: 30,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.line,
          paddingTop: 7,
          paddingBottom: 7,
          borderTopWidth: 0,
          backgroundColor: "transparent",
        },
        tabBarIconStyle: { height: 24, width: 24 },
        tabBarItemStyle: { borderRadius: 16, paddingVertical: 0 },
        tabBarBackground: () => <GlassMaterial radius={30} />,
        // Glass must not sit under a parent whose opacity animates to zero.
        // Native tab changes stay immediate; PageMotion owns the short web transition.
        animation: "none",
      }}
    >
      <Tabs.Screen name="guides" options={{ href: null }} />
      {(["index", "community", "cards", "chat", "settings"] as const).map(
        (name, i) => {
          const icon = ["today", "community", "cards", "chat", "profile"][i];
          return (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title:
                  name === "community"
                    ? uiText(prefs.language, "Community")
                    : name === "settings"
                      ? uiText(prefs.language, "Me")
                      : t(icon as "today"),
                tabBarIcon: ({ color, focused }) => (
                  <Icon
                    animated
                    name={icon}
                    size={21}
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
