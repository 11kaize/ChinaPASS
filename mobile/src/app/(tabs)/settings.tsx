import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../state";
import { useProduct } from "../../product-state";
import { plans, remainingQuestions } from "../../domain/membership";
import { Identity } from "../../identity";
import {
  Page,
  Heading,
  Surface,
  Row,
  Section,
  Txt,
  Button,
  Icon,
  Notice,
} from "../../ui";
export default function Profile() {
  const { prefs, colors, disconnect } = useApp();
  const { ready, profile, tier, posts, error, logout, usage } = useProduct();
  const zh = prefs.language === "zh";
  if (!ready)
    return (
      <Page>
        <Txt>{zh ? "正在加载个人资料…" : "Loading your profile…"}</Txt>
      </Page>
    );
  return (
    <Page>
      <Heading
        title={zh ? "我的" : "Your little corner."}
        body={
          zh
            ? "你的旅程、灵感，以及更多可能。"
            : "Your journey, your stories, a little more possibility."
        }
      />
      <Surface glass style={{ padding: 20, gap: 13, marginBottom: 20 }}>
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 21,
            backgroundColor: colors.accentSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="profile" size={35} />
        </View>
        <Identity
          name={profile?.name || (zh ? "旅行者" : "Hello, traveller.")}
          tier={tier}
        />
        <Txt variant="caption" color={colors.secondary}>
          {profile?.email ||
            (zh
              ? "登录，保存你的社区身份。"
              : "Sign in to make this place yours.")}
        </Txt>
        {!profile && (
          <Button
            label={zh ? "登录 / 注册" : "Sign in / Create account"}
            onPress={() => router.push("/login")}
          />
        )}
      </Surface>
      {Boolean(error) && <Notice danger text={error} />}
      <Section title={zh ? "CHINAHAND 会员" : "A LITTLE EXTRA"}>
        <Surface glass style={{ padding: 18, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Txt variant="subheading">
              {zh ? "为旅程添一点从容" : "A hand, with a little more."}
            </Txt>
          </View>
          <Txt variant="caption" color={colors.secondary}>
            {zh
              ? "更多 AI 问答额度、回复中的页面快捷按钮，以及专属名字特效。"
              : "More AI questions, in-answer app shortcuts, and a name that shines."}
          </Txt>
          <Button
            label={zh ? "升级会员" : "Upgrade membership"}
            onPress={() => router.push("/upgrade")}
          />
          <Txt variant="caption" color={colors.secondary}>
            Plus $9 / {zh ? "月" : "month"} · Pro $89 / {zh ? "年" : "year"}
          </Txt>
        </Surface>
      </Section>
      <Section title={zh ? "AI 问答额度" : "YOUR AI ALLOWANCE"}>
        <Surface glass style={{ padding: 18, gap: 9 }}>
          <Txt variant="heading">
            {remainingQuestions(tier, usage)}
            <Txt variant="caption" color={colors.secondary}>
              {" "}
              / {plans[tier].monthlyQuestions}{" "}
              {zh ? "本月剩余" : "left this month"}
            </Txt>
          </Txt>
          <Txt variant="caption" color={colors.secondary}>
            {zh
              ? "演示额度。失败或取消会退回；模型调用仍使用你自己的 Key。"
              : "Demo allowance. Failed or cancelled requests are refunded. Your own provider key is still required."}
          </Txt>
          {profile?.membership.expiresAt && (
            <Txt variant="caption">
              {zh ? "当前演示会员有效至" : "Demo membership until"}{" "}
              {new Date(profile.membership.expiresAt).toLocaleDateString()}
            </Txt>
          )}
        </Surface>
      </Section>
      <Section title={zh ? "与你有关" : "MAKE IT YOURS"}>
        <Surface glass>
          <Row
            title={zh ? "我的帖子" : "My stories"}
            subtitle={`${posts.filter((p) => p.authorId === profile?.id).length} ${zh ? "篇发布" : "posts"}`}
            icon="community"
            onPress={() =>
              router.push({
                pathname: "/community",
                params: { filter: "mine" },
              })
            }
          />
          <Row
            title={zh ? "收藏的卡片" : "Saved help cards"}
            subtitle={`${prefs.favorites.length} ${zh ? "张收藏" : "saved"}`}
            icon="save"
            onPress={() => router.push("/cards")}
          />
          <Row
            title={zh ? "偏好与隐私" : "Preferences & privacy"}
            subtitle={
              zh
                ? "语言、外观、API 和本机数据"
                : "Language, appearance, API and device data"
            }
            icon="settings"
            last
            onPress={() => router.push("/preferences")}
          />
        </Surface>
      </Section>
      <Notice
        text={
          zh
            ? "这是本机演示账号：不跨设备同步，不会实际扣费。请勿使用真实账号密码。"
            : "Local demo account. No cross-device sync or real billing. Use a demo password."
        }
      />
      {profile && (
        <Button
          secondary
          label={zh ? "退出登录" : "Sign out"}
          onPress={() => {
            disconnect();
            logout();
          }}
        />
      )}
    </Page>
  );
}
