import { artwork } from "../artwork";
import React, { useState } from "react";
import { View, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../state";
import { useProduct } from "../product-state";
import { likeCount, isFeatured } from "../domain/community";
import { Identity } from "../identity";
import { PostMedia } from "../post-media";
import {
  Page,
  Heading,
  Surface,
  Txt,
  Button,
  Notice,
  Field,
  Section,
  confirmAction,
} from "../ui";
export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { prefs, colors, t, isDark } = useApp();
  const { posts, profile, like, save, reply, removePost } = useProduct();
  const post = posts.find((p) => p.id === id),
    zh = prefs.language === "zh";
  const [body, setBody] = useState(""),
    [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  if (!post)
    return (
      <Page back>
        <Heading
          title={zh ? "帖子暂不可用" : "Story unavailable"}
          body={
            zh
              ? "帖子可能已被删除，或只存在于另一台设备。"
              : "It may have been removed, or belong to another device."
          }
        />
        <Button
          label={zh ? "返回社区" : "Back to community"}
          onPress={() => router.replace("/community")}
        />
      </Page>
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
  return (
    <Page back title={zh ? "社区" : "Community"}>
      <View style={{ gap: 10, marginBottom: 20 }}>
        <Identity name={post.authorName} tier={post.tier} />
        <Txt variant="caption" color={colors.secondary}>
          {post.city} · {new Date(post.createdAt).toLocaleDateString()}
        </Txt>
        {post.sample && (
          <Notice
            text={
              zh
                ? "示例帖子：内容与互动数据用于演示。"
                : "Sample story. Content and engagement are demonstration data."
            }
          />
        )}
        <Heading title={post.title} />
        {isFeatured(post) && (
          <Txt color={colors.accent} variant="caption">
            {zh ? "精华经验 · 示例精选" : "Editor’s pick · sample selection"}
          </Txt>
        )}
        {post.media.map((media) => (
          <PostMedia key={media.id} media={media} />
        ))}
        {post.sample &&
          !post.media.length &&
          post.category === "experience" && (
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
              style={{ width: "100%", height: 210, borderRadius: 22 }}
            />
          )}
        <Txt selectable>{post.body}</Txt>
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <View style={{ flex: 1 }}>
          <Button
            secondary
            icon="heart"
            label={`${post.likedBy.includes(profile?.id || "") ? (zh ? "已赞" : "Liked") : zh ? "点赞" : "Like"} · ${likeCount(post).toLocaleString()}`}
            onPress={() => act(() => like(post.id))}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            secondary
            icon="save"
            label={
              (post.savedBy || []).includes(profile?.id || "")
                ? zh
                  ? "已收藏"
                  : "Saved"
                : zh
                  ? "收藏"
                  : "Save"
            }
            onPress={() => act(() => save(post.id))}
          />
        </View>
      </View>
      {Boolean(error) && <Notice danger text={error} />}
      <Section title={`${zh ? "回复" : "Replies"} · ${post.replies.length}`}>
        {post.replies.map((item) => (
          <Surface
            key={item.id}
            glass
            style={{ padding: 15, gap: 8, marginBottom: 10 }}
          >
            <Identity name={item.authorName} tier={item.tier} compact />
            <Txt>{item.body}</Txt>
            <Txt variant="caption" color={colors.secondary}>
              {new Date(item.createdAt).toLocaleString()}
            </Txt>
          </Surface>
        ))}
        {!post.replies.length && (
          <Txt variant="caption" color={colors.secondary}>
            {zh
              ? "第一条回复，也许就是对方需要的帮助。"
              : "A first reply can make someone’s day easier."}
          </Txt>
        )}
        <View style={{ marginTop: 16 }}>
          <Field
            label={zh ? "写下回复" : "Write a reply"}
            value={body}
            onChangeText={setBody}
            multiline
            maxLength={1000}
          />
          <Button
            label={zh ? "发送回复" : "Send reply"}
            disabled={!body.trim()}
            onPress={() =>
              act(() => {
                reply(post.id, body);
                setBody("");
              })
            }
          />
        </View>
      </Section>
      {post.category === "help" && (
        <Button
          secondary
          label={zh ? "紧急帮助与报警电话" : "Emergency help & phone numbers"}
          onPress={() => router.push("/emergency")}
        />
      )}
      {profile?.id === post.authorId && (
        <View style={{ marginTop: 20 }}>
          <Button
            danger
            label={
              deleting
                ? zh
                  ? "清理附件中…"
                  : "Removing attachments…"
                : zh
                  ? "删除我的帖子"
                  : "Delete my story"
            }
            disabled={deleting}
            onPress={() =>
              confirmAction(
                zh ? "删除帖子？" : "Delete this story?",
                zh
                  ? "从当前设备的社区演示中移除。"
                  : "Remove this story from the on-device demo.",
                () => {
                  setDeleting(true);
                  void removePost(post.id)
                    .then(() => router.replace("/community"))
                    .catch(() => {
                      setError(
                        zh
                          ? "附件清理失败，帖子尚未删除。请重试。"
                          : "Attachment cleanup failed. The story is still available; please retry.",
                      );
                    })
                    .finally(() => setDeleting(false));
                },
                t,
              )
            }
          />
        </View>
      )}
    </Page>
  );
}
