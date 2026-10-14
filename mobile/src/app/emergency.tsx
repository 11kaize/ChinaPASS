import React from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useApp } from "../state";
import { cards } from "../content";
import { Page, Heading, Section, Surface, Row, Icon, openURL } from "../ui";
export default function Emergency() {
  const { t, colors } = useApp();
  return (
    <Page back title={t("emergency")}>
      <Heading title={t("emergency")} body={t("emergencyBody")} />
      <Surface style={{ marginBottom: 28 }}>
        {(
          [
            { key: "police", num: "110" },
            { key: "ambulance", num: "120" },
            { key: "fire", num: "119" },
            { key: "traffic", num: "122" },
          ] as const
        ).map((item, i) => (
          <Row
            key={item.num}
            title={`${t(item.key)}  ${item.num}`}
            subtitle={`${t("call")} ${item.num}`}
            icon="phone"
            onPress={() =>
              openURL(`tel:${item.num}`, () =>
                Alert.alert(t("emergency"), t("callFailed")),
              )
            }
            trailing={<Icon name="phone" color={colors.danger} />}
            last={i === 3}
          />
        ))}
      </Surface>
      <Section title={t("show")}>
        <Surface>
          {cards
            .filter((c) => ["emergency", "hospital"].includes(c.cat))
            .slice(0, 8)
            .map((card, i, all) => (
              <Row
                key={card.id}
                title={card.en}
                subtitle={card.zh}
                icon="cards"
                onPress={() =>
                  router.push({ pathname: "/card", params: { id: card.id } })
                }
                last={i === all.length - 1}
              />
            ))}
        </Surface>
      </Section>
    </Page>
  );
}
