import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "./state";
import { useProduct } from "./product-state";
import { plans } from "./domain/membership";
import { Surface, Tap, Txt, Icon } from "./ui";

export function CommunicationTools() {
  const { prefs, colors } = useApp();
  const { tier } = useProduct();
  const zh = prefs.language === "zh";
  return (
    <Surface style={{ marginBottom: 17, overflow: "hidden" }}>
      <Tap
        label={zh ? "面对面翻译" : "Face-to-face translation"}
        onPress={() => router.push("/translate")}
        style={{ padding: 16, gap: 12, backgroundColor: colors.accentSoft }}
      >
        <View style={{ flexDirection: "row", gap: 11, alignItems: "center" }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 13,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="cards" size={21} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Txt variant="subheading" style={{ fontSize: 16 }}>
              {zh ? "面对面翻译" : "Face-to-face translation"}
            </Txt>
            <Txt variant="caption" color={colors.secondary}>
              {plans[tier].faceToFace
                ? zh
                  ? "已包含在你的会员中"
                  : "Included in your membership"
                : zh
                  ? "Plus 与 Pro 专属"
                  : "Included with Plus & Pro"}
            </Txt>
          </View>
          <Icon name="next" size={16} />
        </View>
        <Txt variant="caption" color={colors.secondary}>
          {zh
            ? "一部手机，两边朝向。输入中英文字，译文同步到对面。"
            : "One phone, two sides. Type in either language; read the translation across the table."}
        </Txt>
      </Tap>
      <Tap
        label={zh ? "免费离线双向沟通板" : "Free offline two-way talk"}
        onPress={() => router.push("/talk")}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 13,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Icon name="chat" size={17} />
        <Txt variant="caption" style={{ flex: 1 }}>
          {zh ? "离线沟通板" : "Offline two-way talk"}
        </Txt>
        <Txt variant="caption" color={colors.secondary}>
          {zh ? "免费 · 固定答复" : "Free · preset replies"}
        </Txt>
        <Icon name="next" size={14} />
      </Tap>
    </Surface>
  );
}
