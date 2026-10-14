import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../state";
import { content } from "../content";
import {
  Page,
  Heading,
  Section,
  Surface,
  Row,
  Icon,
  Button,
  Chips,
} from "../ui";
export default function Trip() {
  const { t, prefs, update } = useApp();
  return (
    <Page back title={t("trip")}>
      <Heading title={t("chooseCity")} body={t("cityBody")} />
      <Section title={t("chooseStage")}>
        <Chips
          value={prefs.stage}
          onChange={(stage) => update({ stage: stage as typeof prefs.stage })}
          items={(["before", "arrived", "settled"] as const).map((id) => ({
            id,
            label: t(id),
          }))}
        />
      </Section>
      <Surface>
        {content.cities.map((city, i) => (
          <Row
            key={city.id}
            title={`${city.name} / ${city.zh}`}
            icon="address"
            trailing={
              prefs.city === city.id ? <Icon name="checked" /> : undefined
            }
            onPress={() => update({ city: city.id })}
            last={i === content.cities.length - 1}
          />
        ))}
      </Surface>
      <View style={{ marginTop: 23, gap: 12 }}>
        <Button label={t("done")} icon="check" onPress={() => router.back()} />
        <Button
          label={t("noCity")}
          secondary
          icon="close"
          onPress={() => update({ city: null })}
        />
      </View>
    </Page>
  );
}
