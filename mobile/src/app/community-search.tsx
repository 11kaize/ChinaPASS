import { localeTag } from "../locale-ui";
import { TextInput, type InputRef } from "../localized-input";
import React, { useMemo, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../state";
import { useProduct } from "../product-state";
import { hotPosts, likeCount, searchPosts } from "../domain/community";
import { backOrReplace } from "../navigation-back";
import { Identity } from "../identity";
import {
  Page,
  Surface,
  Section,
  Txt,
  Tap,
  Icon,
  IconButton,
  Chips,
  Button,
} from "../ui";

export default function CommunitySearch() {
  const { prefs, colors } = useApp();
  const { posts } = useProduct();
  const zh = prefs.language === "zh";
  const text = (cn: string, en: string) => (zh ? cn : en);
  const input = useRef<InputRef>(null);
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const ranked = useMemo(() => hotPosts(posts), [posts]);
  const matches = useMemo(() => searchPosts(posts, draft), [posts, draft]);
  const results = useMemo(
    () =>
      searchPosts(posts, submitted || "").filter(
        (post) => filter === "all" || post.category === filter,
      ),
    [posts, submitted, filter],
  );
  const search = (value = draft) => {
    const query = value.trim();
    if (!query) return;
    setDraft(query);
    setSubmitted(query);
    setFilter("all");
    setRecent((old) =>
      [
        query,
        ...old.filter(
          (q) =>
            q.normalize("NFKC").toLowerCase() !==
            query.normalize("NFKC").toLowerCase(),
        ),
      ].slice(0, 6),
    );
    Keyboard.dismiss();
  };
  const clear = () => {
    setDraft("");
    setSubmitted(null);
    input.current?.focus();
  };
  return (
    <Page
      back
      header={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <IconButton
            name="back"
            label={text("返回社区", "Back to community")}
            onPress={() => {
              Keyboard.dismiss();
              backOrReplace(router, "/community");
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.raised,
              borderRadius: 16,
              paddingLeft: 12,
              gap: 7,
            }}
          >
            <Icon name="search" size={17} color={colors.secondary} />
            <TextInput
              ref={input}
              autoFocus
              accessibilityLabel={text(
                "搜索社区内容",
                "Search community content",
              )}
              placeholder={text(
                "搜索你感兴趣的内容",
                "Search stories & places",
              )}
              placeholderTextColor={colors.placeholder}
              value={draft}
              onChangeText={(value) => {
                setDraft(value);
                setSubmitted(null);
              }}
              onSubmitEditing={() => search()}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={160}
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 44,
                fontSize: 14,
                color: colors.ink,
                paddingVertical: 10,
              }}
            />
            {Boolean(draft) && (
              <Tap
                label={text("清空搜索", "Clear search")}
                onPress={clear}
                style={{
                  minWidth: 36,
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="close" size={15} color={colors.secondary} />
              </Tap>
            )}
          </View>
          <Tap
            label={text("搜索", "Search")}
            disabled={!draft.trim()}
            onPress={() => search()}
            style={{
              minWidth: 44,
              minHeight: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Txt variant="label" color={colors.accent}>
              {text("搜索", "Search")}
            </Txt>
          </Tap>
        </View>
      }
    >
      {submitted !== null ? (
        <>
          <Chips
            value={filter}
            onChange={setFilter}
            items={[
              { id: "all", label: text("综合", "Top") },
              { id: "experience", label: text("生活经验", "Experiences") },
              { id: "help", label: text("求助", "Help nearby") },
            ]}
          />
          <Txt
            variant="caption"
            color={colors.secondary}
            style={{ marginBottom: 16 }}
          >
            {text(
              `“${submitted}” · ${results.length} 条结果`,
              `“${submitted}” · ${results.length} results`,
            )}
          </Txt>
          {results.map((post) => (
            <Surface key={post.id} style={{ marginBottom: 12 }}>
              <Tap
                label={post.title}
                verbatim={!post.sample}
                onPress={() =>
                  router.push({ pathname: "/post", params: { id: post.id } })
                }
                style={{ padding: 17, gap: 9 }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Icon
                    name={post.category === "help" ? "help" : "community"}
                    size={15}
                  />
                  <Txt variant="caption" color={colors.secondary}>
                    {post.category === "help"
                      ? text("求助", "Help nearby")
                      : text("生活经验", "Experience")}
                    {post.sample ? " · DEMO" : ""}
                  </Txt>
                </View>
                <Txt
                  variant="subheading"
                  numberOfLines={2}
                  verbatim={!post.sample}
                >
                  {post.title}
                </Txt>
                <Txt
                  variant="caption"
                  color={colors.secondary}
                  numberOfLines={3}
                  verbatim={!post.sample}
                >
                  {post.body}
                </Txt>
                <Identity name={post.authorName} tier={post.tier} compact />
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
                >
                  <Icon name="address" size={13} color={colors.secondary} />
                  <Txt
                    variant="caption"
                    color={colors.secondary}
                    style={{ flex: 1 }}
                  >
                    {post.city}
                  </Txt>
                  <Icon name="heart" size={13} color={colors.secondary} />
                  <Txt variant="caption" color={colors.secondary}>
                    {likeCount(post).toLocaleString(localeTag(prefs.language))}
                  </Txt>
                </View>
              </Tap>
            </Surface>
          ))}
          {!results.length && (
            <Surface style={{ padding: 24, alignItems: "center", gap: 12 }}>
              <Icon name="search" size={26} />
              <Txt variant="subheading">
                {text("暂时没有找到", "No matches yet")}
              </Txt>
              <Txt variant="caption" color={colors.secondary}>
                {text(
                  "试试城市、机场名称，或换一个关键词。",
                  "Try a city, an airport, or a different keyword.",
                )}
              </Txt>
              <Button
                secondary
                label={text("重新搜索", "Try another search")}
                onPress={clear}
              />
            </Surface>
          )}
        </>
      ) : draft.trim() ? (
        <>
          <Txt
            variant="caption"
            color={colors.secondary}
            style={{ marginVertical: 12 }}
          >
            {text("搜索建议", "Suggestions")}
          </Txt>
          <Tap
            label={text(`搜索 ${draft.trim()}`, `Search for ${draft.trim()}`)}
            onPress={() => search()}
            style={{
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
              minHeight: 54,
            }}
          >
            <Icon name="search" size={18} />
            <Txt variant="label" style={{ flex: 1 }} numberOfLines={1}>
              {draft.trim()}
            </Txt>
            <Icon name="arrow" size={16} />
          </Tap>
          {matches.slice(0, 6).map((post) => (
            <Tap
              key={post.id}
              label={post.title}
              verbatim={!post.sample}
              onPress={() => search(post.title)}
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                minHeight: 54,
                paddingVertical: 10,
              }}
            >
              <Icon name="search" size={16} color={colors.secondary} />
              <Txt
                variant="label"
                numberOfLines={2}
                style={{ flex: 1 }}
                verbatim={!post.sample}
              >
                {post.title}
              </Txt>
              <Icon name="next" size={14} color={colors.secondary} />
            </Tap>
          ))}
        </>
      ) : (
        <>
          {recent.length > 0 && (
            <Section
              title={text("最近搜索", "Recent searches")}
              action={{
                label: text("清除", "Clear"),
                onPress: () => setRecent([]),
              }}
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {recent.map((query) => (
                  <Tap
                    key={query}
                    label={query}
                    onPress={() => search(query)}
                    style={{
                      backgroundColor: colors.raised,
                      borderRadius: 13,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      maxWidth: "100%",
                    }}
                  >
                    <Txt variant="caption" numberOfLines={1}>
                      {query}
                    </Txt>
                  </Tap>
                ))}
              </View>
            </Section>
          )}
          <Section title={text("社区热榜", "Trending in the community")}>
            <Txt variant="caption" color={colors.secondary}>
              {text(
                "近 7 天热门帖子 · TOP 10",
                "Popular stories from the past 7 days · TOP 10",
              )}
            </Txt>
            <Surface>
              {ranked.map((post, index) => (
                <Tap
                  key={post.id}
                  label={`Trending ${index + 1}: ${post.title}`}
                  onPress={() => search(post.title)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    borderBottomWidth: index === ranked.length - 1 ? 0 : 0.5,
                    borderColor: colors.line,
                  }}
                >
                  <Txt
                    style={{
                      width: 21,
                      fontSize: 18,
                      fontWeight: "700",
                      color:
                        index < 3
                          ? index === 0
                            ? "#E5695C"
                            : "#C48A36"
                          : colors.secondary,
                    }}
                  >
                    {index + 1}
                  </Txt>
                  <View style={{ flex: 1, gap: 5 }}>
                    <Txt
                      variant="label"
                      numberOfLines={2}
                      verbatim={!post.sample}
                    >
                      {post.title}
                    </Txt>
                    <Txt variant="caption" color={colors.secondary}>
                      {post.city}
                      {post.sample ? " · DEMO" : ""}
                    </Txt>
                  </View>
                  <Icon name="next" size={14} color={colors.secondary} />
                </Tap>
              ))}
            </Surface>
            {!ranked.length && (
              <Txt variant="caption" color={colors.secondary}>
                {text(
                  "最近七天暂无活跃帖子，可以直接搜索社区。",
                  "No trending activity in the past seven days. You can still search the community.",
                )}
              </Txt>
            )}
            <Txt variant="caption" color={colors.secondary}>
              {text(
                "根据近期点赞、收藏与评论综合排序。示例帖包含演示数据。",
                "Ranked by recent likes, saves and replies. Sample posts include demo activity.",
              )}
            </Txt>
          </Section>
        </>
      )}
    </Page>
  );
}
