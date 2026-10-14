import React from "react";
import { Switch, View, Alert } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../state";
import { Language } from "../../content";
import {
  Page,
  Heading,
  Section,
  Chips,
  Surface,
  Row,
  Notice,
  Txt,
  confirmAction,
  Brand,
  Button,
} from "../../ui";
import { providers } from "../../ai/providers";
export default function Settings() {
  const { t, colors, prefs, update, config, clearData, storageError } =
    useApp();
  return (
    <Page>
      <Heading title={t("settings")} />
      <Section title={t("trip")}>
        <Surface>
          <Row
            title={t("city")}
            subtitle={prefs.city || t("noCity")}
            icon="address"
            onPress={() => router.push("/trip")}
          />
          <Row
            title={t("address")}
            icon="address"
            onPress={() => router.push("/address")}
            last
          />
        </Surface>
      </Section>
      <Section title={t("language")}>
        <Chips
          value={prefs.language}
          onChange={(language) => update({ language: language as Language })}
          items={[
            { id: "en", label: "English" },
            { id: "zh", label: "中文" },
            { id: "ja", label: "日本語" },
            { id: "ko", label: "한국어" },
          ]}
        />
        {["ja", "ko"].includes(prefs.language) && (
          <Notice text="Some interface labels are in English. Guide text and card meanings support your language." />
        )}
      </Section>
      <Section title={t("appearance")}>
        <Chips
          value={prefs.appearance}
          onChange={(appearance) =>
            update({ appearance: appearance as typeof prefs.appearance })
          }
          items={(["system", "light", "dark"] as const).map((id) => ({
            id,
            label: t(id),
          }))}
        />
      </Section>
      <Section title={t("connection")}>
        <Surface>
          <Row
            title={config ? providers[config.provider].name : t("configure")}
            subtitle={config?.model || t("sessionOnly")}
            icon="chat"
            onPress={() => router.push("/ai-config")}
            last
          />
        </Surface>
      </Section>
      <Section title={t("privacy")}>
        <Surface style={{ padding: 20, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
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
          <Txt variant="caption" color={colors.secondary}>
            {t("sessionOnly")}
          </Txt>
        </Surface>
      </Section>
      <Section title={t("localData")}>
        <Button
          danger
          label={t("clearData")}
          icon="close"
          onPress={() =>
            confirmAction(
              t("clearData"),
              t("clearDataBody"),
              () => {
                void clearData()
                  .then(() => router.replace("/welcome"))
                  .catch(() =>
                    Alert.alert(
                      t("clearData"),
                      prefs.language === "zh"
                        ? "无法清除本机数据，请稍后重试。"
                        : "Could not clear device data. Please try again.",
                    ),
                  );
              },
              t,
            )
          }
        />
        {storageError && (
          <Notice
            danger
            text={
              prefs.language === "zh"
                ? "本机存储不可用，本次使用不受影响。"
                : "Device storage is unavailable. Changes may last only for this session."
            }
          />
        )}
      </Section>
      <View style={{ gap: 14, marginBottom: 24 }}>
        <Brand />
        <Txt variant="subheading">ChinaHand</Txt>
        <Txt color={colors.secondary}>{t("aboutBody")}</Txt>
        <Txt variant="caption" color={colors.secondary}>
          {t("limitedTranslation")}
        </Txt>
      </View>
    </Page>
  );
}
