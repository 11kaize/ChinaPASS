import React, { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useApp } from "../state";
import { content } from "../content";
import { Page, Heading, Surface, Tap, Txt, Icon } from "../ui";
export default function FAQ() {
  const { t, L, colors, prefs } = useApp();
  const { item } = useLocalSearchParams<{ item?: string }>();
  const selected =
    typeof item === "string" &&
    /^\d+$/.test(item) &&
    Number(item) < content.faq.length
      ? Number(item)
      : null;
  const [choice, setChoice] = useState<{
    route: number | null;
    value: number | null;
  }>({ route: selected, value: selected ?? 0 });
  const expanded = choice.route === selected ? choice.value : (selected ?? 0);
  const set = (value: number | null) => setChoice({ route: selected, value });
  const ordered = content.faq
    .map((f, i) => ({ f, i }))
    .sort((a, b) => Number(b.i === selected) - Number(a.i === selected));
  return (
    <Page back>
      <Heading title={t("faq")} />
      <Surface>
        {ordered.map(({ f, i }, position) => (
          <View
            key={i}
            style={{
              padding: 20,
              borderBottomWidth: position === content.faq.length - 1 ? 0 : 0.5,
              borderBottomColor: colors.line,
            }}
          >
            {i === selected && (
              <Txt
                variant="caption"
                color={colors.accent}
                style={{ marginBottom: 8 }}
              >
                {prefs.language === "zh" ? "搜索定位" : "Search match"}
              </Txt>
            )}
            <Tap
              label={L(f.q)}
              expanded={expanded === i}
              onPress={() => set(expanded === i ? null : i)}
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Txt variant="label" style={{ flex: 1 }}>
                {L(f.q)}
              </Txt>
              <Icon
                name={expanded === i ? "down" : "next"}
                animated
                size={17}
              />
            </Tap>
            {expanded === i && (
              <Txt color={colors.secondary} style={{ marginTop: 13 }}>
                {L(f.a)}
              </Txt>
            )}
          </View>
        ))}
      </Surface>
    </Page>
  );
}
