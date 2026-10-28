import React from "react";
import { View } from "react-native";
import { router, type Href } from "expo-router";
import { useApp } from "../state";
import { content } from "../content";
import { arrivalText } from "../arrival";
import { locationLabel } from "../geography";
import {
  arrivalGuideTitle,
  arrivalGuideBody,
  arrivalStages,
  arrivalSources,
} from "../arrival-guide";
import {
  Page,
  Heading,
  Section,
  Surface,
  Txt,
  Notice,
  Tap,
  Icon,
  Button,
  openURL,
} from "../ui";
export default function Arrival() {
  const { prefs, L, t, colors, update } = useApp();
  const port = content.ports.find((p) => p.id === prefs.arrivalPort);
  const stages = arrivalStages.filter(
    (stage) => !stage.airOnly || !port || port.kind === "air",
  );
  const completed = prefs.steps.arrival || [];
  return (
    <Page back title={L(arrivalGuideTitle)}>
      <Heading title={L(arrivalGuideTitle)} body={L(arrivalGuideBody)} />
      <Button
        secondary
        label={arrivalText(port ? "changePort" : "whereLanded", prefs.language)}
        icon="customs"
        onPress={() => router.push("/ports")}
      />
      {port && (
        <Txt
          variant="caption"
          color={colors.secondary}
          style={{ marginTop: 10 }}
        >
          {locationLabel(port.zh, prefs.language)}
        </Txt>
      )}
      <View style={{ height: 18 }} />
      <Notice
        text={L({
          en: "Airport route shown unless you select a rail, sea or land port. Local order and opening hours may differ; follow on-site signs.",
          zh: "未选择铁路、海港或陆路口岸时显示机场流程。各地顺序和营业时间可能不同，请遵循现场标识。",
          ja: "鉄道・海港・陸路の入境地を選ばない場合は空港の手順を表示します。現地の順序や営業時間は案内表示で確認してください。",
          ko: "철도·항만·육로 입국지를 선택하지 않으면 공항 절차가 표시됩니다. 현장 순서와 운영 시간은 안내 표지판을 확인하세요.",
        })}
      />
      <Txt variant="caption" color={colors.secondary}>
        {
          stages.filter((s) => completed.includes(arrivalStages.indexOf(s)))
            .length
        }
        /{stages.length} {t("completed")}
      </Txt>
      {stages.map((stage, i) => {
        const index = arrivalStages.indexOf(stage),
          checked = completed.includes(index);
        const target =
          stage.tool || (stage.guide ? `/guide/${stage.guide}` : undefined);
        return (
          <Section key={stage.id} title={`${i + 1}. ${L(stage.title)}`}>
            <Surface style={{ padding: 18, gap: 16 }}>
              <Txt>{L(stage.body)}</Txt>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <Tap
                  label={t("completed")}
                  selected={checked}
                  onPress={() =>
                    update({
                      steps: {
                        ...prefs.steps,
                        arrival: checked
                          ? completed.filter((n) => n !== index)
                          : [...completed, index],
                      },
                    })
                  }
                  style={{
                    minHeight: 44,
                    flexDirection: "row",
                    gap: 9,
                    alignItems: "center",
                  }}
                >
                  <Icon name={checked ? "checked" : "unchecked"} size={20} />
                  <Txt variant="label">{t("completed")}</Txt>
                </Tap>
                {(target || stage.url) && (
                  <Tap
                    label={stage.url ? t("sources") : t("continue")}
                    onPress={() =>
                      target
                        ? router.push(target as Href)
                        : void openURL(stage.url!)
                    }
                    style={{
                      minHeight: 44,
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Txt color={colors.accent}>
                      {stage.url ? t("sources") : t("continue")}
                    </Txt>
                    <Icon name="arrow" size={17} />
                  </Tap>
                )}
              </View>
            </Surface>
          </Section>
        );
      })}
      <Section title={t("sources")}>
        <Surface style={{ padding: 18, gap: 10 }}>
          <Txt variant="caption" color={colors.secondary}>
            {t("reviewed")}: 2026-10-28
          </Txt>
          {arrivalSources.map((source) => (
            <Tap
              key={source.url}
              label={L(source.label)}
              onPress={() => void openURL(source.url)}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <Txt color={colors.accent}>{L(source.label)}</Txt>
            </Tap>
          ))}
        </Surface>
      </Section>
    </Page>
  );
}
