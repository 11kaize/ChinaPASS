import React, { useState } from "react";
import { router } from "expo-router";
import { useApp } from "../state";
import { Page, Heading, Field, Button } from "../ui";
export default function WriteCard() {
  const { t, prefs, update } = useApp();
  const [zh, setZh] = useState(""),
    [en, setEn] = useState("");
  return (
    <Page back title={t("newCard")}>
      <Heading title={t("newCard")} body={t("customHint")} />
      <Field
        label={t("chinese")}
        multiline
        textAlignVertical="top"
        value={zh}
        onChangeText={setZh}
        maxLength={1000}
        style={{ minHeight: 140 }}
      />
      <Field
        label={t("customNote")}
        value={en}
        onChangeText={setEn}
        maxLength={300}
      />
      <Button
        label={t("save")}
        icon="save"
        disabled={!zh.trim()}
        onPress={() => {
          const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          update({
            customCards: [
              ...prefs.customCards,
              { id, zh: zh.trim(), en: en.trim(), cat: "custom", custom: true },
            ],
            favorites: [...prefs.favorites, id],
          });
          router.replace({ pathname: "/card", params: { id } });
        }}
      />
    </Page>
  );
}
