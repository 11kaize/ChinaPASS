import { uiText } from "../locale-ui";
import { backOrReplace } from "../navigation-back";
import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useApp } from "../state";
import { cards, phrases, content } from "../content";
import {
  IconButton,
  Button,
  Txt,
  Field,
  Notice,
  Brand,
  confirmAction,
} from "../ui";
import { savedPlaces, placeLines } from "../places";
import { cardBlanks, fillCard } from "../card-template";
export default function Card() {
  const { id, kind } = useLocalSearchParams<{ id: string; kind?: string }>();
  const { colors, t, prefs, update, L } = useApp();
  const [hide, setHide] = useState(prefs.language === "zh"),
    [fill, setFill] = useState<Record<string, string>>({
      "[中文地址]": prefs.address.address,
    }),
    [filled, setFilled] = useState(false),
    [copiedContent, setCopiedContent] = useState<string | null>(null);
  const card = [...cards, ...phrases, ...prefs.customCards].find(
    (c) => c.id === id,
  );
  const scene =
    kind === "scene" ? content.scenes.find((s) => s.id === id) : null;
  const address =
    kind === "place"
      ? savedPlaces(prefs).find((place) => place.id === id)
      : kind === "address"
        ? prefs.address
        : null;
  const port = kind === "port" ? content.ports.find((p) => p.id === id) : null;
  const raw = address
    ? address.address.trim()
      ? `你好，我不太会说中文。\n请带我去：\n${placeLines(address)}${address.phone ? `\n联系电话：${address.phone}` : ""}\n谢谢！`
      : ""
    : port?.zh || scene?.showCard?.lines.join("\n") || card?.zh || "";
  const blanks = address ? [] : cardBlanks(raw);
  const isTemplate = blanks.length > 0;
  const payload = isTemplate ? fillCard(raw, fill) : raw;
  // Tie feedback to the exact card and text that reached the clipboard.
  // A slow copy finishing after an edit must not mark the new content copied.
  const copyIdentity = JSON.stringify([kind, id, payload]);
  const copied = copiedContent === copyIdentity;
  const gloss = address
    ? t("address")
    : port
      ? `${port.city || port.cityZh || ""}${port.iata ? ` · ${port.iata}` : ""}`
      : scene
        ? L(scene.showCard?.title)
        : card
          ? fillCard(L(card), fill)
          : t("noResults");
  const bookmarked = card && prefs.favorites.includes(card.id);
  const close = () =>
    backOrReplace(
      router,
      kind === "place" || kind === "address"
        ? "/address"
        : kind === "port"
          ? "/(tabs)"
          : "/(tabs)/cards",
    );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingTop: 7,
          paddingBottom: 15,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Brand />
          <Txt variant="caption" color={colors.secondary}>
            ChinaBuddy
          </Txt>
        </View>
        <View style={{ flexDirection: "row", gap: 9 }}>
          <IconButton
            name="emergency"
            label={t("emergency")}
            danger
            onPress={() => router.push("/emergency")}
          />
          {card && (
            <IconButton
              name="edit"
              label={
                card.custom
                  ? prefs.language === "zh"
                    ? "编辑我的卡片"
                    : "Edit my card"
                  : prefs.language === "zh"
                    ? "编辑模板"
                    : "Edit template"
              }
              onPress={() =>
                router.push({
                  pathname: "/write-card",
                  params: { id: card.id },
                })
              }
            />
          )}
          {card && (
            <IconButton
              name="save"
              selected={!!bookmarked}
              label={bookmarked ? t("unsave") : t("save")}
              onPress={() =>
                update({
                  favorites: bookmarked
                    ? prefs.favorites.filter((x) => x !== id)
                    : [...prefs.favorites, id],
                })
              }
            />
          )}
          <IconButton name="close" label={t("close")} onPress={close} />
        </View>
      </View>
      {isTemplate && !filled ? (
        <ScrollView contentContainerStyle={{ padding: 26, gap: 14 }}>
          <Txt variant="heading">{t("template")}</Txt>
          <Txt verbatim style={{ fontSize: 27, lineHeight: 38 }}>
            {raw.replace(/%s/g, "___")}
          </Txt>
          {blanks.map((blank) => (
            <Field
              key={blank}
              label={
                blank === "%s"
                  ? t("fill")
                  : blank === "[中文地址]"
                    ? t("addressLabel")
                    : blank === "[地点]"
                      ? prefs.language === "zh"
                        ? "你的位置（中文）"
                        : "Your location in Chinese"
                      : blank.slice(1, -1)
              }
              hint={t("fillHint")}
              value={fill[blank] || ""}
              onChangeText={(value) =>
                setFill((old) => ({ ...old, [blank]: value }))
              }
              autoCorrect={false}
              maxLength={500}
            />
          ))}
          <Button
            label={t("preview")}
            disabled={blanks.some((blank) => !fill[blank]?.trim())}
            onPress={() => setFilled(true)}
          />
        </ScrollView>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 28,
              justifyContent: "center",
              gap: 26,
            }}
          >
            {!payload ? (
              <Notice text={t("addressRequired")} />
            ) : (
              <Txt
                verbatim
                selectable
                style={{
                  fontSize:
                    payload.length > 120 ? 30 : payload.length > 50 ? 36 : 46,
                  lineHeight:
                    payload.length > 120 ? 45 : payload.length > 50 ? 52 : 65,
                  fontWeight: "600",
                  letterSpacing: 1.2,
                }}
              >
                {payload}
              </Txt>
            )}
            {!hide && (
              <Txt
                verbatim={card?.custom}
                color={colors.secondary}
                style={{ fontSize: 15, lineHeight: 23 }}
              >
                {gloss}
              </Txt>
            )}
          </ScrollView>
          <View style={{ padding: 24, gap: 12 }}>
            {payload && (
              <Button
                label={copied ? t("copied") : t("copy")}
                icon={copied ? "check" : "copy"}
                animated
                onPress={() => {
                  setCopiedContent(null);
                  void Clipboard.setStringAsync(payload)
                    .then((saved) => {
                      // Web can resolve false rather than rejecting on failure.
                      if (!saved) throw new Error("Clipboard write failed");
                      setCopiedContent(copyIdentity);
                    })
                    .catch(() =>
                      Alert.alert(
                        t("copy"),
                        uiText(
                          prefs.language,
                          "Copy failed. Long-press the Chinese to select it.",
                        ),
                      ),
                    );
                }}
              />
            )}
            {payload && !isTemplate && (
              <Button
                secondary
                icon="chat"
                label={
                  prefs.language === "zh" ? "让对方点选答复" : "Let them reply"
                }
                onPress={() =>
                  router.push({ pathname: "/talk", params: { id, kind } })
                }
              />
            )}
            {prefs.language !== "zh" && (
              <Button
                secondary
                label={hide ? t("showTranslation") : t("hide")}
                icon="cards"
                onPress={() => setHide(!hide)}
              />
            )}
            {card?.custom && (
              <Button
                danger
                secondary
                icon="close"
                label={
                  prefs.language === "zh" ? "删除这张卡片" : "Delete this card"
                }
                onPress={() =>
                  confirmAction(
                    prefs.language === "zh"
                      ? "删除这张卡片"
                      : "Delete this card",
                    card.zh,
                    () => {
                      update({
                        customCards: prefs.customCards.filter(
                          (c) => c.id !== id,
                        ),
                        favorites: prefs.favorites.filter((x) => x !== id),
                      });
                      close();
                    },
                    t,
                  )
                }
              />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
