import React, { useState } from "react";
import { View } from "react-native";
import { useApp } from "../state";
import { content } from "../content";
import { Page, Heading, Surface, Tap, Txt, Icon } from "../ui";
export default function FAQ() {
  const { t, L, colors } = useApp();
  const [expanded, set] = useState<number | null>(0);
  return (
    <Page back>
      <Heading title={t("faq")} />
      <Surface>
        {content.faq.map((f, i) => (
          <View
            key={i}
            style={{
              padding: 20,
              borderBottomWidth: i === content.faq.length - 1 ? 0 : 0.5,
              borderBottomColor: colors.line,
            }}
          >
            <Tap
              label={L(f.q)}
              onPress={() => set(expanded === i ? null : i)}
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Txt variant="label" style={{ flex: 1 }}>
                {L(f.q)}
              </Txt>
              <Icon name="next" size={17} />
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
