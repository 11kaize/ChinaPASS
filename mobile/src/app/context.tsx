import { languageOptions } from "../i18n";
import { uiText } from "../locale-ui";
import { cityLabel, locationLabel } from "../geography";
import React from "react";
import { Switch, View } from "react-native";
import { useApp } from "../state";
import { describeContext } from "../ai/context";
import { portCityLabel } from "../arrival";
import { content, cards, phrases } from "../content";
import { Page, Heading, Section, Surface, Txt, Notice } from "../ui";
export default function ContextPreview() {
  const { t, L, colors, prefs, update, tripContext } = useApp();
  const context = describeContext(tripContext);
  const zh = prefs.language === "zh";
  const city = content.cities.find((c) => c.id === tripContext.city);
  const port = content.ports.find((p) => p.id === tripContext.arrivalPort);
  const none = zh ? "尚无" : "None yet";
  const language = languageOptions(prefs.language).find(
    (item) => item.id === prefs.language,
  )!.label;
  const rows = [
    [t("language"), language],
    ...(prefs.shareContext
      ? [
          [
            t("city"),
            city
              ? `${cityLabel(city.name, prefs.language)} (${uiText(prefs.language, "manually selected")})`
              : port
                ? portCityLabel(port, prefs.language)
                : t("noCity"),
          ],
          [
            zh ? "入境口岸（手动选择）" : "Arrival port (manually chosen)",
            port ? locationLabel(port.zh, prefs.language) : none,
          ],
          [t("chooseStage"), t(tripContext.stage)],
          [
            t("preparation"),
            content.prep
              .filter((p) => tripContext.checklist.includes(p.id))
              .map((p) => L(p.title))
              .join("\n") || none,
          ],
          [
            zh ? "最近查看的指南" : "Recent guide",
            L(
              content.scenes.find((s) => s.id === tripContext.guideId)?.title,
            ) || none,
          ],
          [
            zh ? "已完成的指南步骤" : "Completed guide steps",
            content.scenes
              .flatMap((s) =>
                (tripContext.completedSteps[s.id] || []).flatMap((i) =>
                  s.steps[i] ? [`${L(s.title)}: ${L(s.steps[i].t)}`] : [],
                ),
              )
              .join("\n") || none,
          ],
          [
            zh ? "设备" : "Device",
            tripContext.platform === "ios"
              ? "iOS"
              : tripContext.platform === "web"
                ? "Desktop interaction preview"
                : "Android",
          ],
          [
            zh ? "网络" : "Network",
            tripContext.online === null
              ? zh
                ? "未知"
                : "Unknown"
              : tripContext.online
                ? zh
                  ? "在线"
                  : "Online"
                : zh
                  ? "离线"
                  : "Offline",
          ],
          [zh ? "设备时区" : "Device time zone", tripContext.timezone],
          [
            zh ? "设备时间" : "Device time",
            context.deviceDate
              ? new Date(context.deviceDate).toLocaleString(prefs.language)
              : none,
          ],
        ]
      : []),
  ];
  return (
    <Page back title={t("context")}>
      <Heading title={t("context")} body={t("contextBody")} />
      <Surface style={{ padding: 20, gap: 12, marginBottom: 25 }}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Txt variant="label" style={{ flex: 1 }}>
            {t("contextShare")}
          </Txt>
          <Switch
            accessibilityLabel={t("contextShare")}
            value={prefs.shareContext}
            onValueChange={(shareContext) => update({ shareContext })}
            trackColor={{ true: colors.accent, false: colors.line }}
          />
        </View>
        <Txt variant="caption" color={colors.secondary}>
          {t("contextShareBody")}
        </Txt>
      </Surface>
      <Section title={zh ? "项目知识" : "Project knowledge"}>
        <Surface style={{ padding: 20, gap: 12 }}>
          <Txt>{t("aboutBody")}</Txt>
          <Txt variant="caption" color={colors.secondary}>
            {zh
              ? `${content.scenes.length} 个任务指南、${cards.length} 张中文卡片、${phrases.length} 条离线短句，以及相关来源与常见问题。`
              : `${content.scenes.length} task guides, ${cards.length} Chinese cards, ${phrases.length} offline phrases, related sources and FAQs.`}
          </Txt>
        </Surface>
      </Section>
      {!prefs.shareContext && (
        <Notice
          text={
            zh
              ? "旅程共享已关闭。仅发送界面语言、相关项目知识和你输入的消息。"
              : "Trip sharing is off. Only the interface language, relevant project knowledge and your messages are sent."
          }
        />
      )}
      <Section title={t("trip")}>
        <Surface style={{ padding: 20, gap: 18 }}>
          {rows.map(([label, value]) => (
            <View key={label} style={{ gap: 6 }}>
              <Txt variant="caption" color={colors.secondary}>
                {label}
              </Txt>
              <Txt selectable>{value}</Txt>
            </View>
          ))}
        </Surface>
      </Section>
      <Notice text={t("sessionOnly")} />
    </Page>
  );
}
