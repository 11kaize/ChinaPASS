import { uiText } from "../locale-ui";
import { locationLabel, cityLabel } from "../geography";
import React from "react";
import { router } from "expo-router";
import { useApp } from "../state";
import { content } from "../content";
import { arrivalText } from "../arrival";
import { mapSearchURL } from "../service-links";
import { Alert } from "react-native";
import {
  Page,
  Heading,
  Surface,
  Section,
  Row,
  Notice,
  Button,
  openURL,
} from "../ui";
export default function City() {
  const { t, L, prefs, online } = useApp();
  const search = (name: string) => {
    if (online === false) {
      Alert.alert(t("cityNotes"), t("offlineNow"));
      return;
    }
    openURL(mapSearchURL(name), () =>
      Alert.alert(
        t("cityNotes"),
        uiText(prefs.language, "Could not open the map search."),
      ),
    );
  };
  const city = content.cities.find((c) => c.id === prefs.city);
  const port = content.ports.find((p) => p.id === prefs.arrivalPort);
  return (
    <Page back title={t("cityNotes")}>
      <Heading
        title={city ? cityLabel(city.name, prefs.language) : t("cityNotes")}
        body={t("cityHint")}
      />
      {!city && port ? (
        <Surface style={{ padding: 18, gap: 12 }}>
          <Heading
            title={locationLabel(port.zh, prefs.language)}
            body={arrivalText("portNoDetail", prefs.language)}
          />
          <Button
            label={t("show")}
            onPress={() =>
              router.push({
                pathname: "/card",
                params: { id: port.id, kind: "port" },
              })
            }
          />
          <Button
            secondary
            label={
              prefs.language === "zh"
                ? "在地图上搜索这个口岸"
                : "Find this port on a map"
            }
            onPress={() => search(port.zh)}
          />
        </Surface>
      ) : !city ? (
        <Button
          label={t("chooseCity")}
          icon="address"
          onPress={() => router.push("/trip")}
        />
      ) : (
        <>
          <Notice text={L(city.note)} />
          <Section title={prefs.language === "zh" ? "机场" : "Airports"}>
            <Surface>
              {city.airport.map((name, i) => (
                <Row
                  key={name}
                  title={locationLabel(name, prefs.language)}
                  icon="customs"
                  onPress={() => search(name)}
                  last={i === city.airport.length - 1}
                />
              ))}
            </Surface>
          </Section>
          <Section
            title={prefs.language === "zh" ? "火车站" : "Railway stations"}
          >
            <Surface>
              {city.stations.map((name, i) => (
                <Row
                  key={name}
                  title={locationLabel(name, prefs.language)}
                  icon="train"
                  onPress={() => search(name)}
                  last={i === city.stations.length - 1}
                />
              ))}
            </Surface>
          </Section>
          <Button
            label={L(city.source.label)}
            secondary
            onPress={() => openURL(city.source.url)}
          />
        </>
      )}
    </Page>
  );
}
