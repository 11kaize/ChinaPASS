import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../state";
import { useProduct } from "../product-state";
import {
  Page,
  Heading,
  Surface,
  Field,
  Txt,
  Button,
  Notice,
  Icon,
} from "../ui";
import { Identity } from "../identity";
export default function Account() {
  const { prefs, colors } = useApp();
  const { profile, tier, editProfile } = useProduct();
  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const zh = prefs.language === "zh";
  return (
    <Page back title={zh ? "个人资料" : "Personal details"}>
      <Heading
        title={zh ? "介绍一下自己" : "Make yourself at home."}
        body={
          zh
            ? "让社区认识你，也让每次交流多一点熟悉。"
            : "A familiar name for every story and conversation."
        }
      />
      {!profile ? (
        <>
          <Notice
            text={zh ? "登录后编辑个人资料。" : "Sign in to edit your profile."}
          />
          <Button
            label={zh ? "登录" : "Sign in"}
            onPress={() => router.push("/login")}
          />
        </>
      ) : (
        <>
          <Surface style={{ padding: 20, gap: 10, marginBottom: 22 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Icon name="profile" size={24} />
              <Identity name={name || profile.name} tier={tier} />
            </View>
            <Txt variant="caption" color={colors.secondary}>
              {profile.email}
            </Txt>
          </Surface>
          <Field
            label={zh ? "昵称" : "Display name"}
            value={name}
            maxLength={40}
            onChangeText={(v) => {
              setName(v);
              setSaved(false);
            }}
            hint={
              zh
                ? "1–40 个字符，将显示在帖子与回复中。"
                : "1–40 characters. Shown on your stories and replies."
            }
          />
          <Field
            label={zh ? "个人简介" : "Bio"}
            value={bio}
            maxLength={160}
            multiline
            onChangeText={(v) => {
              setBio(v);
              setSaved(false);
            }}
            placeholder={
              zh
                ? "来自哪里，喜欢什么，或一句问候…"
                : "Where you’re from, what you love, or a simple hello…"
            }
            hint={`${bio.length} / 160`}
            style={{ minHeight: 100, textAlignVertical: "top" }}
          />
          {Boolean(error) && <Notice danger text={error} />}
          {saved && (
            <Notice
              text={
                zh
                  ? "资料已保存。社区中的昵称也已更新。"
                  : "Profile saved. Your community display name is updated too."
              }
            />
          )}
          <Button
            label={
              saved
                ? zh
                  ? "已保存"
                  : "Saved"
                : zh
                  ? "保存资料"
                  : "Save changes"
            }
            disabled={!name.trim() || saved}
            onPress={() => {
              try {
                editProfile(name, bio);
                setError("");
                setSaved(true);
              } catch {
                setError(
                  zh
                    ? "请输入 1–40 个字符的昵称，简介不超过 160 字。"
                    : "Use a name of 1–40 characters and a bio of up to 160 characters.",
                );
              }
            }}
          />
          <Txt
            variant="caption"
            color={colors.secondary}
            style={{ marginTop: 16 }}
          >
            {zh
              ? "资料仅保存在此设备。邮箱作为演示登录标识，暂不支持修改。"
              : "Profile details stay on this device. Your demo sign-in email cannot be changed here."}
          </Txt>
        </>
      )}
    </Page>
  );
}
