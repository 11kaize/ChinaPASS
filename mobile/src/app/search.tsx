import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { router, type Href } from "expo-router";
import { useApp } from "../state";
import { content } from "../content";
import { placeCatalog } from "../places";
import {
  buildOfflineIndex,
  searchOffline,
  searchExcerpt,
  type SearchGroup,
  type OfflineEntry,
} from "../offline-search";
import {
  Page,
  Heading,
  Search,
  Chips,
  Section,
  Surface,
  Row,
  Txt,
  Notice,
  Button,
  Empty,
} from "../ui";

export default function OfflineSearch() {
  const { prefs, colors } = useApp();
  const zh = prefs.language === "zh";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [cityId, setCityId] = useState<string | null>(null);
  const labels: Record<SearchGroup, string> = {
    guides: zh ? "指南" : "Guides",
    faq: zh ? "常见问题" : "Questions",
    cards: zh ? "沟通卡片" : "Cards",
    phrases: zh ? "短语" : "Phrases",
    places: zh ? "城市与口岸" : "Cities & ports",
  };
  const index = useMemo(
    () => buildOfflineIndex(prefs.language, prefs.customCards),
    [prefs.language, prefs.customCards],
  );
  const results = useMemo(() => searchOffline(index, query), [index, query]);
  const city = content.cities.find((item) => item.id === cityId);
  const open = (entry: OfflineEntry) => {
    if (entry.cityId) setCityId(entry.cityId);
    else if (entry.destination) router.push(entry.destination as Href);
  };
  const changeQuery = (value: string) => {
    setQuery(value.slice(0, 200));
    setExpanded([]);
    setCityId(null);
  };
  const cityDetails = city ? (
    <Surface style={{ padding: 18, gap: 12, marginBottom: 18 }}>
      <Txt variant="subheading">
        {city.name} · {city.zh}
      </Txt>
      <Txt>{city.note}</Txt>
      <Txt variant="caption" color={colors.secondary}>
        {zh
          ? "选择地点，保存到地址钱包。内置名称不含实时导航或航站楼信息。"
          : "Choose a destination to save in your wallet. Bundled names do not include live directions or terminal details."}
      </Txt>
      {[...city.airport, ...city.stations].map((name, i) => (
        <Row
          key={`${name}-${i}`}
          title={name}
          icon={i < city.airport.length ? "customs" : "train"}
          onPress={() => {
            const clean = (value: string) =>
              value.replace(/[（(][A-Z]{3}[）)]/g, "").trim();
            const seed = placeCatalog.find(
              (place) => clean(place.address) === clean(name),
            );
            if (seed)
              router.push({
                pathname: "/place-edit",
                params: { seed: seed.id },
              });
          }}
        />
      ))}
      <Button
        secondary
        label={zh ? "收起城市详情" : "Close city details"}
        onPress={() => setCityId(null)}
      />
    </Surface>
  ) : null;
  return (
    <Page back title={zh ? "离线搜索" : "Offline search"}>
      <Heading
        title={zh ? "找到此刻需要的帮助。" : "Find the help you need."}
        body={
          zh
            ? "指南、问答、中文卡与地点，一次搜索。不需要网络或 AI。"
            : "Guides, answers, Chinese cards and places. No connection or AI needed."
        }
      />
      <Search
        label={
          zh
            ? "搜索指南、问题、短语或地点"
            : "Search guides, questions, phrases or places"
        }
        value={query}
        onChange={changeQuery}
      />
      <Chips
        value={filter}
        onChange={setFilter}
        items={[
          { id: "all", label: zh ? "全部" : "All" },
          ...Object.entries(labels).map(([id, label]) => ({ id, label })),
        ]}
      />
      {!query.trim() ? (
        <>
          <Section title={zh ? "试着搜索" : "Try a search"}>
            <Chips
              value=""
              onChange={changeQuery}
              items={(zh
                ? ["银行卡", "酒店", "虹桥", "充电", "多少钱"]
                : ["foreign card", "hotel", "Hongqiao", "charging", "how much"]
              ).map((value) => ({ id: value, label: value }))}
            />
          </Section>
          <Notice
            text={
              zh
                ? "只搜索内置内容和你的自制卡片，不会发送搜索文字。社区帖子请使用社区搜索。"
                : "Searches bundled content and your custom cards on this device. Search text is not sent anywhere. Find stories using Community search."
            }
          />
        </>
      ) : (
        <>
          <Txt variant="caption" color={colors.secondary}>
            {
              (filter === "all"
                ? results
                : results.filter((item) => item.group === filter)
              ).length
            }{" "}
            {zh ? "条匹配结果" : "matching results"}
          </Txt>
          {(Object.keys(labels) as SearchGroup[])
            .filter((group) => filter === "all" || filter === group)
            .map((group) => {
              const matches = results.filter((item) => item.group === group);
              if (!matches.length) return null;
              const shown = expanded.includes(group)
                ? matches
                : matches.slice(0, 8);
              return (
                <Section
                  key={group}
                  title={`${labels[group]} · ${matches.length}`}
                >
                  <Surface>
                    {shown.map((entry, i) => (
                      <View key={entry.id}>
                        <Row
                          title={entry.title.replace(/%s/g, "___")}
                          subtitle={searchExcerpt(entry.body, query)}
                          icon={
                            group === "guides"
                              ? "guides"
                              : group === "places"
                                ? "address"
                                : group === "faq"
                                  ? "help"
                                  : "cards"
                          }
                          last={i === shown.length - 1}
                          onPress={() => open(entry)}
                        />
                        {entry.cityId && entry.cityId === cityId && cityDetails}
                      </View>
                    ))}
                  </Surface>
                  {shown.length < matches.length && (
                    <View style={{ marginTop: 10 }}>
                      <Button
                        secondary
                        label={
                          zh
                            ? `显示全部 ${matches.length} 条`
                            : `Show all ${matches.length}`
                        }
                        onPress={() => setExpanded((old) => [...old, group])}
                      />
                    </View>
                  )}
                </Section>
              );
            })}
          {!results.some(
            (entry) => filter === "all" || entry.group === filter,
          ) && (
            <Empty
              icon="search"
              title={zh ? "没有找到匹配内容" : "No matching content"}
              body={
                zh
                  ? "试试较短的关键词、中英文名称，或切换到全部分类。"
                  : "Try a shorter keyword, an English or Chinese name, or switch to All."
              }
            />
          )}
        </>
      )}
    </Page>
  );
}
