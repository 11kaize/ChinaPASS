import { cityLabel } from "../geography";
import { content } from "../content";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import { useApp } from "../state";
import { useProduct } from "../product-state";
import type { Media, Post } from "../domain/community";
import { persistMedia, deleteMedia } from "../local-media";
import { PostMedia } from "../post-media";
import {
  Page,
  Heading,
  Field,
  Chips,
  Button,
  Notice,
  Tap,
  Txt,
  Icon,
} from "../ui";
export default function CreatePost() {
  const { prefs } = useApp(),
    { profile, publish } = useProduct();
  const zh = prefs.language === "zh";
  const [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [city, setCity] = useState(
      prefs.city
        ? cityLabel(
            content.cities.find((city) => city.id === prefs.city)?.name ||
              prefs.city,
            prefs.language,
          )
        : "",
    ),
    [category, setCategory] = useState<Post["category"]>("experience"),
    [media, setMedia] = useState<Media[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const publishing = useRef(false);
  const mounted = useRef(true),
    attachments = useRef<Media[]>([]),
    published = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (!published.current)
        for (const item of attachments.current)
          void deleteMedia(item).catch(() => {});
    };
  }, []);
  const attach = async () => {
    if (busy || media.length >= 6) return;
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsMultipleSelection: true,
        selectionLimit: 6 - media.length,
        quality: 0.8,
      });
      if (result.canceled || !mounted.current) return;
      setBusy(true);
      const added: Media[] = [];
      try {
        for (const asset of result.assets.slice(0, 6 - media.length))
          added.push(await persistMedia(asset, Crypto.randomUUID()));
        if (!mounted.current) {
          for (const item of added) await deleteMedia(item).catch(() => {});
          return;
        }
        attachments.current = [...attachments.current, ...added];
        setMedia(attachments.current);
      } catch (e) {
        for (const item of added) await deleteMedia(item).catch(() => {});
        throw e;
      }
    } catch (e) {
      if (mounted.current) setError((e as Error).message);
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const submit = () => {
    if (publishing.current) return;
    publishing.current = true;
    try {
      const id = publish(title, body, city, category, media);
      published.current = true;
      router.replace({ pathname: "/post", params: { id } });
    } catch (e) {
      setError((e as Error).message);
      publishing.current = false;
    }
  };
  return (
    <Page back title={zh ? "发布帖子" : "New story"}>
      <Heading
        title={zh ? "一点经验，一份帮助。" : "Something worth sharing."}
        body={
          zh
            ? "分享你的真实体验，或告诉大家你需要什么帮助。"
            : "Share what you learned, or ask for a little help."
        }
      />
      {!profile ? (
        <>
          <Notice
            text={zh ? "登录后可以发布帖子。" : "Sign in to publish a story."}
          />
          <Button
            label={zh ? "登录" : "Sign in"}
            onPress={() => router.push("/login")}
          />
        </>
      ) : (
        <>
          <Chips
            value={category}
            onChange={(v) => setCategory(v as Post["category"])}
            items={[
              { id: "experience", label: zh ? "经验帖" : "Experience" },
              { id: "help", label: zh ? "救助贴" : "Help request" },
            ]}
          />
          <View style={{ marginTop: 18 }}>
            <Field
              label={zh ? "标题" : "Title"}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Field
              label={zh ? "你想分享什么？" : "Your story or question"}
              value={body}
              onChangeText={setBody}
              multiline
              maxLength={5000}
              style={{ minHeight: 140, textAlignVertical: "top" }}
            />
            <Field
              label={zh ? "大致位置（可选）" : "General location (optional)"}
              hint={
                zh
                  ? "不要公开房间号、联系方式或证件信息。"
                  : "Avoid room numbers, contact details and identity documents."
              }
              value={city}
              onChangeText={setCity}
              maxLength={100}
            />
          </View>
          {media.map((item, index) => (
            <View key={item.id} style={{ marginBottom: 14, gap: 6 }}>
              <PostMedia media={item} />
              <Tap
                label={`Remove attachment ${index + 1}`}
                disabled={busy}
                onPress={() => {
                  setBusy(true);
                  void deleteMedia(item)
                    .then(() => {
                      attachments.current = attachments.current.filter(
                        (x) => x.id !== item.id,
                      );
                      if (mounted.current) setMedia(attachments.current);
                    })
                    .catch(() => {
                      if (mounted.current)
                        setError(
                          zh
                            ? "附件删除失败，请重试。"
                            : "Could not remove the attachment. Please retry.",
                        );
                    })
                    .finally(() => {
                      if (mounted.current) setBusy(false);
                    });
                }}
                style={{
                  minHeight: 36,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Icon name="close" size={14} />
                <Txt variant="caption">
                  {zh ? "移除附件" : "Remove attachment"}
                </Txt>
              </Tap>
            </View>
          ))}
          <Button
            secondary
            icon="image"
            label={
              busy
                ? zh
                  ? "保存附件中…"
                  : "Saving attachment…"
                : zh
                  ? `添加图片或视频 (${media.length}/6)`
                  : `Add photos or videos (${media.length}/6)`
            }
            onPress={() => {
              void attach();
            }}
            disabled={busy || media.length >= 6}
          />
          <View style={{ height: 14 }} />
          {Boolean(error) && <Notice danger text={error} />}
          <Notice
            text={
              zh
                ? "这是本机社区演示：帖子及附件仅保存在当前设备，不会发布到公共网络。"
                : "On-device community demo. Stories and attachments stay on this device and are not published publicly."
            }
          />
          <Button
            label={zh ? "发布到本机演示" : "Publish to this demo"}
            disabled={busy}
            onPress={submit}
          />
        </>
      )}
    </Page>
  );
}
