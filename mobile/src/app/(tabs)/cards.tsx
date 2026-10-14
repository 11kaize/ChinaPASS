import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../state";
import { cards, phrases, searchPhrases, content } from "../../content";
import {
  Page,
  Heading,
  Search,
  Chips,
  Surface,
  Tap,
  Txt,
  Icon,
  Empty,
  IconButton,
} from "../../ui";
export default function Cards() {
  const { t, colors, prefs, L, update } = useApp();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const bank = useMemo(
    () => [...cards, ...prefs.customCards, ...phrases],
    [prefs.customCards],
  );
  const data = useMemo(() => {
    const subset =
      filter === "saved"
        ? prefs.favorites
            .map((id) => bank.find((c) => c.id === id))
            .filter((c): c is (typeof bank)[number] => !!c)
        : filter === "phrases"
          ? phrases
          : filter === "custom"
            ? prefs.customCards
            : filter === "all"
              ? cards
              : cards.filter((c) => c.cat === filter);
    return searchPhrases(
      query,
      query.trim() && filter === "all" ? bank : subset,
    );
  }, [bank, prefs.favorites, prefs.customCards, filter, query]);
  return (
    <Page scroll={false}>
      <FlatList
        data={data}
        keyExtractor={(c) => c.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 22,
          paddingTop: 9,
          paddingBottom: 40,
        }}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Heading title={t("cardTitle")} body={t("cardBody")} />
              </View>
              <IconButton
                name="plus"
                label={t("newCard")}
                onPress={() => router.push("/write-card")}
              />
            </View>
            <Search
              value={query}
              onChange={setQuery}
              label={t("searchCards")}
            />
            <Chips
              value={filter}
              onChange={setFilter}
              items={[
                { id: "all", label: t("all") },
                { id: "saved", label: t("saved") },
                { id: "phrases", label: t("phrases") },
                { id: "custom", label: t("custom") },
                ...Object.entries(content.groups).map(([id, g]) => ({
                  id,
                  label: L(g.title),
                })),
              ]}
            />
          </>
        }
        ListEmptyComponent={
          <Empty
            title={filter === "saved" ? t("noSaved") : t("noResults")}
            body={filter === "saved" ? t("noSavedBody") : t("noResultsBody")}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item, index }) => (
          <Surface>
            <Tap
              label={item.en}
              onPress={() =>
                router.push({ pathname: "/card", params: { id: item.id } })
              }
              style={{ padding: 17, gap: 5 }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 9 }}
              >
                <Txt
                  style={{
                    flex: 1,
                    fontSize: 19,
                    lineHeight: 26,
                    fontWeight: "600",
                  }}
                >
                  {item.en.replace(/%s/g, "___")}
                </Txt>
                {prefs.favorites.includes(item.id) && (
                  <Icon name="save" weight="fill" size={16} />
                )}
              </View>
              <Txt variant="caption" color={colors.secondary}>
                {item.zh.replace(/%s/g, "___")}
              </Txt>
            </Tap>
            {filter === "saved" && index > 0 && (
              <Tap
                label={
                  prefs.language === "zh" ? "上移收藏" : "Move bookmark up"
                }
                onPress={() => {
                  const next = [...prefs.favorites];
                  const pos = next.indexOf(item.id);
                  [next[pos - 1], next[pos]] = [next[pos], next[pos - 1]];
                  update({ favorites: next });
                }}
                style={{ paddingHorizontal: 20, paddingBottom: 14 }}
              >
                <Txt variant="caption" color={colors.accent}>
                  {prefs.language === "zh" ? "上移" : "Move up"}
                </Txt>
              </Tap>
            )}
          </Surface>
        )}
      />
    </Page>
  );
}
