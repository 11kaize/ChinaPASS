import React, { useState } from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { useApp } from "../../state";
import { arrivalText } from "../../arrival";
import { orderedScenes, content } from "../../content";
import {
  Page,
  Button,
  Heading,
  Search,
  Chips,
  Surface,
  Row,
  Empty,
  Txt,
  Icon,
} from "../../ui";
export default function Guides() {
  const { t, L, prefs, colors } = useApp();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const groups: Record<string, string[]> = {
    arrival: ["customs", "sim", "pay", "taxi", "hotel"],
    gettingAround: ["taxi", "metro", "train"],
    daily: ["food", "hotel", "emergency"],
  };
  const scenes = orderedScenes.filter(
    (s) =>
      (filter === "all" || groups[filter]?.includes(s.id)) &&
      `${L(s.title)} ${L(s.subtitle)} ${s.id}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <Page>
      <Heading title={t("guideTitle")} body={t("guideBody")} />
      <View style={{ marginBottom: 16 }}><Button secondary label={arrivalText("yourRoute",prefs.language)} icon="guides" onPress={() => router.push("/arrival")} /></View>
      <Search value={query} onChange={setQuery} label={t("searchGuides")} />
      <Chips
        value={filter}
        onChange={setFilter}
        items={(["all", "arrival", "gettingAround", "daily"] as const).map(
          (id) => ({ id, label: t(id) }),
        )}
      />
      <Surface>
        {scenes.map((s, i) => (
          <Row
            key={s.id}
            title={L(s.title)}
            subtitle={L(s.subtitle)}
            icon={s.id}
            onPress={() => router.push(`/guide/${s.id}`)}
            trailing={
              <View style={{ gap: 5, alignItems: "flex-end" }}>
                {(prefs.steps[s.id] || []).length > 0 ? (
                  <Txt variant="caption" color={colors.accent}>
                    {(prefs.steps[s.id] || []).length}/{s.steps.length}
                  </Txt>
                ) : (
                  <Icon name="next" size={18} color={colors.secondary} />
                )}
              </View>
            }
            last={i === scenes.length - 1}
          />
        ))}
      </Surface>
      {!scenes.length && (
        <Empty title={t("noResults")} body={t("noResultsBody")} icon="guides" />
      )}
      <View style={{ marginTop: 28, gap: 13 }}>
        <Txt variant="subheading">{t("prep")}</Txt>
        <Surface>
          <Row
            title={t("preparation")}
            icon="prep"
            onPress={() => router.push("/preparation")}
          />
          {content.shortGuides.map((g, i) => (
            <Row
              key={g.id}
              title={g.title}
              icon="guides"
              onPress={() => router.push(`/guide/${g.id}`)}
              last={i === content.shortGuides.length - 1}
            />
          ))}
        </Surface>
      </View>
    </Page>
  );
}
