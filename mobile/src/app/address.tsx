import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useApp } from "../state";
import {
  savedPlaces,
  defaultPlaceId,
  walletPatch,
  placeCatalog,
} from "../places";
import {
  Page,
  Heading,
  Surface,
  Txt,
  Tap,
  Button,
  Chips,
  Search,
  Row,
  Icon,
  Notice,
  confirmAction,
} from "../ui";
export default function Address() {
  const { prefs, colors, update, t } = useApp();
  const [tab, setTab] = useState("saved");
  const [query, setQuery] = useState("");
  useFocusEffect(
    useCallback(() => {
      setTab("saved");
      setQuery("");
    }, []),
  );
  const zh = prefs.language === "zh";
  const places = savedPlaces(prefs);
  const active = defaultPlaceId(prefs);
  const category = {
    hotel: zh ? "酒店住处" : "Stay",
    transport: zh ? "机场车站" : "Transport",
    school: zh ? "学校" : "School",
    other: zh ? "其他地点" : "Other",
  };
  const matches = (text: string) =>
    text
      .normalize("NFKC")
      .toLowerCase()
      .includes(query.trim().normalize("NFKC").toLowerCase());
  return (
    <Page back title={zh ? "地址钱包" : "Address wallet"}>
      <Heading
        title={zh ? "常去的地方，随身带着。" : "Your saved places."}
        body={
          zh
            ? "保存多个中文地址，一键出示给司机或工作人员。"
            : "Chinese destinations, ready to show."
        }
      />
      <Button
        label={zh ? "添加地点" : "Add a place"}
        icon="plus"
        onPress={() => router.push("/place-edit")}
        disabled={places.length >= 30}
      />
      <View style={{ height: 18 }} />
      <Chips
        value={tab}
        onChange={(value) => {
          setTab(value);
          setQuery("");
        }}
        items={[
          {
            id: "saved",
            label: `${zh ? "我的地点" : "My places"} ${places.length}/30`,
          },
          { id: "library", label: zh ? "机场与车站" : "Airports & stations" },
        ]}
      />
      <Search
        label={zh ? "搜索地点或城市" : "Search place or city"}
        value={query}
        onChange={setQuery}
      />
      {tab === "saved" ? (
        <>
          {!places.length && (
            <Surface style={{ padding: 24, gap: 12, alignItems: "center" }}>
              <Icon name="address" size={28} />
              <Txt variant="subheading">
                {zh ? "从你的住处开始" : "Start with somewhere to come back to"}
              </Txt>
              <Txt variant="caption" color={colors.secondary}>
                {zh
                  ? "添加中文地址，或从机场与车站中收藏一个地点。"
                  : "Add an address in Chinese, or save a stop from Airports & stations."}
              </Txt>
            </Surface>
          )}
          {places
            .filter((place) => matches(`${place.name} ${place.address}`))
            .map((place) => (
              <Surface
                key={place.id}
                style={{ padding: 18, gap: 10, marginBottom: 14 }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Icon
                    name={
                      place.category === "hotel"
                        ? "hotel"
                        : place.category === "transport"
                          ? "transport"
                          : "address"
                    }
                  />
                  <Txt variant="subheading" style={{ flex: 1 }}>
                    {place.name || category[place.category]}
                  </Txt>
                  {place.id === active && (
                    <Txt variant="caption" color={colors.accent}>
                      {zh ? "默认" : "Default"}
                    </Txt>
                  )}
                </View>
                {place.address !== place.name && (
                  <Txt selectable>{place.address}</Txt>
                )}
                <Txt variant="caption" color={colors.secondary}>
                  {category[place.category]}
                  {place.phone ? ` · ${place.phone}` : ""}
                </Txt>
                <Button
                  label={zh ? "出示中文地址卡" : "Show Chinese address card"}
                  icon="cards"
                  onPress={() =>
                    router.push({
                      pathname: "/card",
                      params: { kind: "place", id: place.id },
                    })
                  }
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Tap
                    label={zh ? "编辑" : "Edit"}
                    onPress={() =>
                      router.push({
                        pathname: "/place-edit",
                        params: { id: place.id },
                      })
                    }
                    style={{
                      flex: 1,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Txt variant="caption" color={colors.accent}>
                      {zh ? "编辑" : "Edit"}
                    </Txt>
                  </Tap>
                  <Tap
                    disabled={place.id === active}
                    label={zh ? "设为默认" : "Make default"}
                    onPress={() => update(walletPatch(prefs, places, place.id))}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Txt variant="caption" color={colors.accent}>
                      {place.id === active
                        ? zh
                          ? "默认地点"
                          : "Default"
                        : zh
                          ? "设为默认"
                          : "Make default"}
                    </Txt>
                  </Tap>
                  <Tap
                    label={zh ? "删除地点" : "Delete place"}
                    onPress={() =>
                      confirmAction(
                        zh ? "删除这个地点？" : "Delete this place?",
                        zh
                          ? "只删除此地点，其他收藏会保留。无法撤销。"
                          : "Only this place will be deleted. Other places stay saved. This cannot be undone.",
                        () =>
                          update(
                            walletPatch(
                              prefs,
                              places.filter((item) => item.id !== place.id),
                              active,
                            ),
                          ),
                        t,
                      )
                    }
                    style={{
                      flex: 1,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Txt variant="caption" color={colors.danger}>
                      {zh ? "删除" : "Delete"}
                    </Txt>
                  </Tap>
                </View>
              </Surface>
            ))}
          {places.length > 0 &&
            !places.some((place) =>
              matches(`${place.name} ${place.address}`),
            ) && (
              <Notice
                text={zh ? "没有匹配的地点。" : "No matching saved places."}
              />
            )}
        </>
      ) : (
        <>
          <Notice
            text={
              zh
                ? "内置的是地点名称，不含实时导航、航站楼或详细街道信息。请核对实际目的地。"
                : "Bundled place names only; no live navigation, terminal details or street-level addresses. Confirm your destination."
            }
          />
          <Surface>
            {placeCatalog
              .filter((place) => matches(`${place.name} ${place.city}`))
              .map((place, i, all) => {
                const saved = places.find(
                  (item) => item.address === place.address,
                );
                return (
                  <Row
                    key={place.id}
                    title={place.name}
                    subtitle={place.city}
                    icon="transport"
                    trailing={saved ? <Icon name="checked" /> : undefined}
                    last={i === all.length - 1}
                    onPress={() =>
                      router.push(
                        saved
                          ? {
                              pathname: "/card",
                              params: { kind: "place", id: saved.id },
                            }
                          : {
                              pathname: "/place-edit",
                              params: { seed: place.id },
                            },
                      )
                    }
                  />
                );
              })}
          </Surface>
        </>
      )}
      <Txt variant="caption" color={colors.secondary} style={{ marginTop: 16 }}>
        {zh
          ? "地点仅保存在此设备，不会自动发给 AI。默认地点会用于已有地址卡与模板。"
          : "Places stay on this device and are not automatically shared with AI. The default place is used by existing address cards and templates."}
      </Txt>
    </Page>
  );
}
