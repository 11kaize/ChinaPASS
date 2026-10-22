import { artwork } from "../../artwork";
import React, { useState } from "react";
import { View, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../../state";
import { useProduct } from "../../product-state";
import { Post, isFeatured, likeCount } from "../../domain/community";
import {
  Page,
  Heading,
  Surface,
  Txt,
  Tap,
  Icon,
  Button,
  Chips,
  Notice,
} from "../../ui";
import { Identity } from "../../identity";
import { PostMedia } from "../../post-media";
export default function Community() {
  const { prefs, colors, isDark } = useApp(),
    { posts, profile, like, save } = useProduct();
  const zh = prefs.language === "zh";
  const params = useLocalSearchParams<{ filter?: string }>();
  const filter = params.filter || "all";
  const setFilter = (value: string) => router.setParams({ filter: value });
  const [error, setError] = useState("");
  const visible = posts.filter((p) =>
    filter === "help"
      ? p.category === "help"
      : filter === "featured"
        ? isFeatured(p)
        : filter === "mine"
          ? p.authorId === profile?.id
          : filter === "saved"
            ? (p.savedBy || []).includes(profile?.id || "")
            : filter === "activity"
              ? p.likedBy.includes(profile?.id || "") ||
                p.replies.some((r) => r.authorId === profile?.id)
              : true,
  );
  const act = (fn: () => void) => {
    if (!profile) {
      router.push("/login");
      return;
    }
    try {
      fn();
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const card = (post: Post) => (
    <Surface
      key={post.id}
      glass
      style={{ marginBottom: 12, overflow: "hidden" }}
    >
      <Tap
        label={post.title}
        onPress={() =>
          router.push({ pathname: "/post", params: { id: post.id } })
        }
      >
        {post.media[0] ? (
          <PostMedia media={post.media[0]} compact />
        ) : post.sample && post.category === "experience" ? (
          <Image
            source={
              post.id === "sample-food"
                ? isDark
                  ? artwork.foodNight
                  : artwork.foodDay
                : post.id === "sample-pay"
                  ? isDark
                    ? artwork.arrivalNight
                    : artwork.arrivalDay
                  : isDark
                    ? artwork.homeNight
                    : artwork.skyline
            }
            accessibilityLabel={
              post.id === "sample-food"
                ? "Illustrative Chinese food sample"
                : post.id === "sample-pay"
                  ? "Illustrative airport arrival sample"
                  : "Illustrative Shanghai skyline"
            }
            style={{
              width: "100%",
              height: post.id === "sample-food" ? 164 : 125,
            }}
          />
        ) : null}
        <View style={{ padding: 13, gap: 8 }}>
          <Txt
            style={{
              fontSize: 10,
              color: post.category === "help" ? "#D4715C" : colors.accent,
              fontWeight: "700",
              letterSpacing: 0.3,
            }}
          >
            {post.category === "help"
              ? zh
                ? "救助贴"
                : "HELP NEARBY"
              : zh
                ? "生活经验"
                : "LIFE NOTES"}
            {post.sample ? " · DEMO" : ""}
          </Txt>
          <Txt
            variant="label"
            style={{ fontSize: 14, lineHeight: 20 }}
            numberOfLines={3}
          >
            {post.title}
          </Txt>
          <Txt variant="caption" color={colors.secondary} numberOfLines={2}>
            {post.body}
          </Txt>
          <Txt
            variant="caption"
            color={colors.secondary}
            style={{ fontSize: 10 }}
          >
            {post.city}
          </Txt>
          <Identity name={post.authorName} tier={post.tier} compact />
        </View>
      </Tap>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingBottom: 8,
        }}
      >
        <Tap
          label={`Like ${post.title}`}
          onPress={() => act(() => like(post.id))}
          style={{
            flexDirection: "row",
            gap: 4,
            minHeight: 36,
            alignItems: "center",
            paddingHorizontal: 4,
          }}
        >
          <Icon
            name="heart"
            size={15}
            color={
              post.likedBy.includes(profile?.id || "")
                ? "#E66D83"
                : colors.secondary
            }
            weight={
              post.likedBy.includes(profile?.id || "") ? "fill" : "regular"
            }
          />
          <Txt style={{ fontSize: 10 }}>
            {likeCount(post) >= 1000
              ? `${(likeCount(post) / 1000).toFixed(1)}k`
              : likeCount(post)}
          </Txt>
        </Tap>
        <Tap
          label={`Save ${post.title}`}
          onPress={() => act(() => save(post.id))}
          style={{
            minHeight: 36,
            paddingHorizontal: 5,
            justifyContent: "center",
          }}
        >
          <Icon
            name="save"
            size={16}
            weight={
              (post.savedBy || []).includes(profile?.id || "")
                ? "fill"
                : "regular"
            }
          />
        </Tap>
      </View>
    </Surface>
  );
  return (
    <Page>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Heading
            title={zh ? "在这里，遇见同行的人。" : "A little local company."}
            body={
              zh
                ? "分享经验，也接住彼此的问题。"
                : "Small stories. Real questions. Shared discoveries."
            }
          />
        </View>
        <Tap
          label={zh ? "发布帖子" : "Create post"}
          onPress={() => router.push(profile ? "/create-post" : "/login")}
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            backgroundColor: colors.accent,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <Icon name="plus" color={colors.onAccent} size={22} />
        </Tap>
      </View>
      <Tap
        label={zh ? "搜索社区" : "Search community"}
        onPress={() => router.push("/community-search")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 15,
          minHeight: 46,
          borderRadius: 17,
          backgroundColor: colors.raised,
          marginBottom: 18,
        }}
      >
        <Icon name="search" size={18} color={colors.secondary} />
        <Txt variant="label" color={colors.secondary} numberOfLines={1} style={{ flex: 1 }}>
          {zh
            ? "搜索帖子、城市和生活经验"
            : "Search stories, places & everyday tips"}
        </Txt>
      </Tap>
      <Chips
        value={filter}
        onChange={setFilter}
        items={[
          { id: "all", label: zh ? "发现" : "Discover" },
          { id: "help", label: zh ? "救助贴" : "Help nearby" },
          { id: "featured", label: zh ? "精华贴" : "Editor's picks" },
          { id: "saved", label: zh ? "收藏" : "Saved" },
          { id: "mine", label: zh ? "我的" : "Mine" },
          { id: "activity", label: zh ? "互动" : "Activity" },
        ]}
      />
      {Boolean(error) && <Notice danger text={error} />}
      {filter === "help" && (
        <Notice
          text={
            zh
              ? "社区求助不保证响应。紧急情况请立即使用紧急帮助与当地电话。"
              : "Community help has no guaranteed response. For emergencies, use Emergency help and local phone numbers."
          }
        />
      )}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        {[0, 1].map((column) => (
          <View key={column} style={{ flex: 1 }}>
            {visible.filter((_, index) => index % 2 === column).map(card)}
          </View>
        ))}
      </View>
      {!visible.length && (
        <Surface glass style={{ padding: 22, gap: 12 }}>
          <Txt>
            {zh ? "这里还没有匹配的帖子。" : "No matching stories here yet."}
          </Txt>
          <Button
            secondary
            label={zh ? "分享第一篇" : "Share a story"}
            onPress={() => router.push(profile ? "/create-post" : "/login")}
          />
        </Surface>
      )}
    </Page>
  );
}
