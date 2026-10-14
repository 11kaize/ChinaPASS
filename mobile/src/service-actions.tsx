import React from "react";
import { View, Alert } from "react-native";
import { useApp } from "./state";
import type { ServiceAction } from "./content";
import { actionBadge, actionTarget } from "./service-links";
import { Section, Surface, Tap, Txt, Icon, openURL } from "./ui";
export function ServiceActions({ actions }: { actions: ServiceAction[] }) {
  const { prefs, colors, L, online, t } = useApp();
  if (!actions.length) return null;
  const words = {
    en: [
      "Do it now",
      "Opens the provider's site or app. Websites need internet.",
      "Could not open this link. Try the provider's official app or website.",
    ],
    zh: [
      "直接去办",
      "打开服务商网站或应用。网页跳转需要联网。",
      "无法打开此链接，请使用服务商的官方应用或网站。",
    ],
    ja: [
      "今すぐ手続き",
      "サービス提供者のサイトやアプリを開きます。ウェブには通信が必要です。",
      "リンクを開けません。公式アプリやサイトをお試しください。",
    ],
    ko: [
      "바로 진행",
      "서비스 제공자의 사이트나 앱을 엽니다. 웹사이트에는 인터넷이 필요합니다.",
      "링크를 열 수 없습니다. 공식 앱이나 웹사이트를 이용하세요.",
    ],
  }[prefs.language];
  return (
    <Section title={words[0]}>
      <Surface>
        {actions.map((action, index) => {
          const target = actionTarget(action);
          return (
            <Tap
              key={`${action.kind}:${action.url}`}
              label={L(action.label)}
              onPress={() => {
                if (!target) {
                  Alert.alert(words[0], words[2]);
                  return;
                }
                if (target === "web" && online === false) {
                  Alert.alert(words[0], t("offlineNow"));
                  return;
                }
                openURL(action.url, () =>
                  Alert.alert(
                    words[0],
                    target === "call" ? t("callFailed") : words[2],
                  ),
                );
              }}
              style={{
                padding: 19,
                gap: 9,
                borderBottomWidth: index === actions.length - 1 ? 0 : 0.5,
                borderBottomColor: colors.line,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <Txt variant="label" style={{ flex: 1 }}>
                  {L(action.label)}
                </Txt>
                <View
                  style={{
                    paddingHorizontal: 9,
                    paddingVertical: 4,
                    borderRadius: 10,
                    backgroundColor: colors.accentSoft,
                  }}
                >
                  <Txt variant="caption" color={colors.accent}>
                    {actionBadge(action, prefs.language)}
                  </Txt>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Txt
                  variant="caption"
                  color={colors.secondary}
                  style={{ flex: 1 }}
                >
                  {L(action.note)}
                </Txt>
                <Icon name={target === "call" ? "phone" : "arrow"} size={20} />
              </View>
            </Tap>
          );
        })}
      </Surface>
      <Txt variant="caption" color={colors.secondary}>
        {words[1]}
      </Txt>
    </Section>
  );
}
