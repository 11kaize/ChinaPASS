import React, { useEffect } from "react";
import { Animated, View, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useApp } from "../state";
import { Brand, Button, Chips, Icon, Txt, useReducedMotion, useMotionValue } from "../ui";
import { Language } from "../content";
export default function Welcome() {
  const { colors, prefs, update, t } = useApp();
  const opacity = useMotionValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: reduce ? 0 : 450,
      useNativeDriver: Platform.OS !== "web",
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, reduce]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 26, paddingTop: 18, flexGrow: 1 }}
      >
        <Animated.View style={{ opacity, flex: 1, gap: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
            <Brand />
            <Txt variant="subheading">ChinaHand</Txt>
          </View>
          <View style={{ marginTop: 18, gap: 16 }}>
            <Brand large />
            <Txt
              variant="title"
              style={{ fontSize: 32, lineHeight: 38, letterSpacing: -0.9 }}
            >
              {t("welcomeHeadline")}
            </Txt>
            <Txt color={colors.secondary} style={{ maxWidth: 320 }}>
              {t("welcomeBody")}
            </Txt>
          </View>
          <View style={{ gap: 12, marginVertical: 4 }}>
            {(["welcomeGuides", "welcomeCards", "welcomeAI"] as const).map(
              (key, i) => (
                <View
                  key={key}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      width: 43,
                      height: 43,
                      borderRadius: 14,
                      backgroundColor: colors.accentSoft,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name={["guides", "cards", "chat"][i]} />
                  </View>
                  <Txt variant="label">{t(key)}</Txt>
                </View>
              ),
            )}
          </View>
        </Animated.View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 26,
          paddingBottom: 12,
          paddingTop: 12,
          gap: 12,
          backgroundColor: colors.bg,
        }}
      >
        <Chips
          value={prefs.language}
          onChange={(language) => update({ language: language as Language })}
          items={[
            { id: "en", label: "English" },
            { id: "zh", label: "中文" },
            { id: "ja", label: "日本語" },
            { id: "ko", label: "한국어" },
          ]}
        />
        <Button
          label={t("start")}
          onPress={() => {
            update({ onboarded: true });
            router.replace("/(tabs)");
          }}
        />
        <Txt
          variant="caption"
          color={colors.secondary}
          style={{ textAlign: "center" }}
        >
          {t("welcomePrivacy")}
        </Txt>
      </View>
    </SafeAreaView>
  );
}
