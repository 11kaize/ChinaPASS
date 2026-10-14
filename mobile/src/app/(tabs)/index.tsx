import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../state";
import { content } from "../../content";
import {
  Page,
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
            {city ? `${city.name} / ${city.zh}` : t("city")}
          </Txt>
          <Icon name="next" size={14} />
        </Tap>
        <Txt variant="caption" color={colors.secondary}>
          {t(prefs.stage)}
        </Txt>
      </View>
      <Heading title={t("welcome")} body={t("tagline")} />
      {online === false && <Notice text={t("offlineNow")} icon="offline" />}
      {prefs.stage === "before" ? (
        <Surface
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
            <Icon name="prep" size={31} />
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
                  minHeight: 126,
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 22,
                  gap: 15,
                }}
              >
                <Icon name={id} size={28} />
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
          <Icon name="chat" size={29} />
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
