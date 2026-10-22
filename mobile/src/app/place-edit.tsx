import React, { useRef, useState } from "react";
import { View } from "react-native";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../state";
import { SavedPlace, savedPlaces, walletPatch, placeCatalog } from "../places";
import { backOrReplace } from "../navigation-back";
import { Page, Heading, Field, Chips, Button, Notice, Txt } from "../ui";
export default function PlaceEdit() {
  const { id, seed } = useLocalSearchParams<{ id?: string; seed?: string }>();
  const { prefs, update, colors } = useApp();
  const places = savedPlaces(prefs);
  const existing = places.find((place) => place.id === id);
  const template = placeCatalog.find((place) => place.id === seed);
  const source = existing || template;
  const [name, setName] = useState(source?.name || "");
  const [address, setAddress] = useState(source?.address || "");
  const [phone, setPhone] = useState(source?.phone || "");
  const [category, setCategory] = useState<SavedPlace["category"]>(
    source?.category || "hotel",
  );
  const [error, setError] = useState("");
  const saving = useRef(false);
  const zh = prefs.language === "zh";
  const save = (show: boolean) => {
    if (!address.trim() || saving.current) return;
    if (!existing && places.length >= 30) {
      setError(
        zh
          ? "最多保存 30 个地点，请先删除不需要的地点。"
          : "You can save up to 30 places. Remove one before adding another.",
      );
      return;
    }
    saving.current = true;
    const place: SavedPlace = {
      id: existing?.id || Crypto.randomUUID(),
      category,
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
    };
    update(
      walletPatch(
        prefs,
        existing
          ? places.map((item) => (item.id === place.id ? place : item))
          : [...places, place],
      ),
    );
    if (show)
      router.replace({
        pathname: "/card",
        params: { kind: "place", id: place.id },
      });
    else backOrReplace(router, "/address");
  };
  return (
    <Page
      back
      title={
        zh
          ? existing
            ? "编辑地点"
            : "添加地点"
          : existing
            ? "Edit place"
            : "Add a place"
      }
    >
      <Heading
        title={
          zh ? "下一次，直接出示中文。" : "Next time, just show the address."
        }
      />
      {id && !existing ? (
        <Notice
          danger
          text={
            zh
              ? "地点已不存在，请返回地址钱包。"
              : "This saved place no longer exists. Return to the address wallet."
          }
        />
      ) : (
        <>
          <Chips
            value={category}
            onChange={(value) => setCategory(value as SavedPlace["category"])}
            items={[
              { id: "hotel", label: zh ? "酒店住处" : "Stay" },
              { id: "transport", label: zh ? "机场车站" : "Transport" },
              { id: "school", label: zh ? "学校" : "School" },
              { id: "other", label: zh ? "其他" : "Other" },
            ]}
          />
          <Field
            label={zh ? "地点名称" : "Place name"}
            value={name}
            onChangeText={setName}
            maxLength={150}
            placeholder={zh ? "例如：我的酒店" : "For example: my hotel"}
          />
          <Field
            label={
              zh ? "中文地址或地点名称" : "Address or destination in Chinese"
            }
            value={address}
            onChangeText={setAddress}
            multiline
            maxLength={500}
            style={{ minHeight: 110, textAlignVertical: "top" }}
            hint={
              zh
                ? "请从酒店确认单或可信来源复制，应用不会自动翻译。"
                : "Copy it from your hotel confirmation or a trusted source. The app does not translate addresses."
            }
          />
          <Field
            label={zh ? "地点电话（可选）" : "Venue phone (optional)"}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={25}
          />
          {Boolean(error) && <Notice danger text={error} />}
          <View style={{ gap: 12 }}>
            <Button
              label={zh ? "保存地点" : "Save place"}
              disabled={!address.trim()}
              onPress={() => save(false)}
            />
            <Button
              secondary
              label={zh ? "保存并出示中文卡" : "Save & show Chinese card"}
              disabled={!address.trim()}
              onPress={() => save(true)}
            />
          </View>
          <Txt
            variant="caption"
            color={colors.secondary}
            style={{ marginTop: 18 }}
          >
            {zh
              ? "只保存在本机。不要填写房间号或不希望向他人展示的信息。"
              : "Saved on this device only. Omit room numbers or details you do not want to show others."}
          </Txt>
        </>
      )}
    </Page>
  );
}
