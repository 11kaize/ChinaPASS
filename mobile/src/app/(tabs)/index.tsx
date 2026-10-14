import React from "react";
import { View, Alert } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../state";
import { arrivalText, portCityLabel } from "../../arrival";
import { content } from "../../content";
import {
  Page,
  openURL,
  Heading,
  Section,
  Surface,
  Row,
  Icon,
  Txt,
  Tap,
  Button,
  Notice,
} from "../../ui";
export default function Today() {
  const { colors, prefs, t, online } = useApp();
  const city = content.cities.find((c) => c.id === prefs.city);
  const port = content.ports.find((p) => p.id === prefs.arrivalPort);
  return (
    <Page>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
          marginBottom: 19,
        }}
      >
        <Tap
          label={t("city")}
          onPress={() => router.push("/trip")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            paddingVertical: 8,
          }}
        >
          <Icon name="address" size={17} />
          <Txt variant="caption" color={colors.accent}>
            {city ? `${city.name} / ${city.zh}` : port ? portCityLabel(port,prefs.language) : t("city")}
          </Txt>
          <Icon name="next" size={14} />
        </Tap>
        <Txt variant="caption" color={colors.secondary}>
          {t(prefs.stage)}
        </Txt>
      </View>
      <Heading title={t("welcome")} body={t("tagline")} />
      <Surface glass style={{ marginBottom: 18 }}>
        <Row title={arrivalText("whereLanded",prefs.language)} subtitle={port ? `${port.iata ? `${port.iata} · ` : ""}${port.zh}` : arrivalText("whereLandedHint",prefs.language)} icon="customs" last onPress={() => router.push("/ports")} />
      </Surface>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 18 }}>
        {([{key:"police",num:"110"},{key:"ambulance",num:"120"},{key:"fire",num:"119"},{key:"traffic",num:"122"}] as const).map(item => <Tap key={item.num} label={`${t(item.key)} ${item.num}`} onPress={() => openURL(`tel:${item.num}`, () => Alert.alert(t("emergency"),t("callFailed")))} style={{ flex: 1, minHeight: 54, paddingVertical: 8, borderRadius: 14, backgroundColor: colors.dangerSoft, alignItems: "center", justifyContent: "center", gap: 2 }}><Txt variant="label" color={colors.danger}>{item.num}</Txt><Txt variant="caption" color={colors.danger} style={{fontSize:10}}>{t(item.key)}</Txt></Tap>)}
      </View>
      {port && <View style={{ gap: 10, marginBottom: 18 }}>
        <Button secondary label={t("show")} icon="cards" onPress={() => router.push({pathname:"/card",params:{id:port.id,kind:"port"}})} />
        <Button secondary label={arrivalText("yourRoute",prefs.language)} icon="guides" onPress={() => router.push("/arrival")} />
      </View>}

      {online === false && <Notice text={t("offlineNow")} icon="offline" />}
      {prefs.stage === "before" && !port ? (
        <Surface
          glass
          style={{
            padding: 20,
            backgroundColor: colors.accentSoft,
            marginBottom: 29,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Icon name="prep" size={23} />
            <Txt variant="caption" color={colors.accent}>
              {prefs.prep.length} / {content.prep.length} {t("ready")}
            </Txt>
          </View>
          <Txt variant="subheading">{t("essentials")}</Txt>
          <Txt
            variant="caption"
            color={colors.secondary}
            style={{ marginTop: 8, marginBottom: 16 }}
          >
            {t("essentialsBody")}
          </Txt>
          <Button
            label={t("prepare")}
            onPress={() => router.push("/preparation")}
          />
        </Surface>
      ) : (
        <Surface
          glass
          style={{ marginBottom: 27, backgroundColor: colors.accentSoft }}
        >
          <Row
            title={t("essentials")}
            subtitle={`${prefs.prep.length} / ${content.prep.length} ${t("ready")}`}
            icon="prep"
            last
            onPress={() => router.push("/preparation")}
          />
        </Surface>
      )}
      <Section title={t("now")}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {(["taxi", "pay", "hotel", "food"] as const).map((id) => (
            <View key={id} style={{ width: "48%", flexGrow: 1 }}>
              <Tap
                label={t(id)}
                onPress={() => router.push(`/guide/${id}`)}
                style={{
                  padding: 19,
                  minHeight: 108,
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 22,
                  gap: 15,
                }}
              >
                <Icon name={id} size={22} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 4,
                  }}
                >
                  <Txt variant="label" style={{ flexShrink: 1 }}>
                    {t(id)}
                  </Txt>
                  <Icon name="next" size={17} />
                </View>
              </Tap>
            </View>
          ))}
        </View>
      </Section>
      <Tap
        label={t("ask")}
        onPress={() => router.navigate("/(tabs)/chat")}
        style={{
          paddingVertical: 5,
          marginBottom: 30,
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
        }}
      >
        <View
          style={{
            padding: 15,
            borderRadius: 21,
            backgroundColor: colors.accentSoft,
          }}
        >
          <Icon name="chat" size={22} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Txt variant="subheading">{t("assistant")}</Txt>
          <Txt variant="caption" color={colors.secondary}>
            {t("assistantBody")}
          </Txt>
        </View>
        <Icon name="next" size={20} />
      </Tap>
      <Section title={t("toolkit")}>
        <Surface>
          <Row
            title={t("address")}
            subtitle={t("addressHint")}
            icon="address"
            onPress={() => router.push("/address")}
          />
          <Row
            title={t("cityNotes")}
            subtitle={t("cityHint")}
            icon="train"
            onPress={() => router.push("/city")}
          />
          <Row
            title={t("faq")}
            icon="info"
            onPress={() => router.push("/faq")}
            last
          />
        </Surface>
      </Section>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="privacy" size={15} />
        <Txt variant="caption" color={colors.secondary}>
          {t("offline")}
        </Txt>
      </View>
    </Page>
  );
}
