import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "../../state";
import { useProduct } from "../../product-state";
import { plans, remainingQuestions } from "../../domain/membership";
import { Identity } from "../../identity";
import {
  Page,
  Surface,
  Row,
  Section,
  Txt,
  Button,
  Icon,
  Notice,
  Tap,
  IconButton,
  confirmAction,
} from "../../ui";

export default function Profile() {
  const { prefs, colors, disconnect, config, isDark, t } = useApp();
  const { ready, profile, tier, posts, error, logout, usage } = useProduct();
  const zh = prefs.language === "zh";
  const text = (cn: string, en: string) => (zh ? cn : en);
  const own = posts.filter((p) => profile && p.authorId === profile.id).length;
  const saved = posts.filter((p) =>
    (p.savedBy || []).includes(profile?.id || ""),
  ).length;
  const left = remainingQuestions(tier, usage);
  const community = (filter: string) => {
    if (!profile) {
      router.push("/login");
      return;
    }
    router.push({ pathname: "/community", params: { filter } });
  };
  if (!ready)
    return (
      <Page>
        <Txt>{text("正在加载个人资料…", "Loading your profile…")}</Txt>
      </Page>
    );
  return (
    <Page>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <View>
          <Txt variant="title">{text("我的", "My ChinaHand")}</Txt>
          <Txt variant="caption" color={colors.secondary}>
            {text(
              "为在中国的每一天，做好准备。",
              "A little more at home, every day.",
            )}
          </Txt>
        </View>
        <IconButton
          name="settings"
          label={text("偏好设置", "Preferences")}
          onPress={() => router.push("/preferences")}
        />
      </View>
      <Surface style={{ padding: 18, gap: 18, marginBottom: 16 }}>
        <Tap
          label={text("编辑个人资料", "Edit profile")}
          onPress={() => router.push(profile ? "/account" : "/login")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 13 }}>
            <LinearGradient
              colors={isDark ? ["#3C67A4", "#283B65"] : ["#D6EAFF", "#B6D2FE"]}
              style={{
                width: 54,
                height: 54,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {profile ? (
                <Txt
                  style={{
                    fontSize: 23,
                    fontWeight: "700",
                    color: isDark ? "#E3EFFF" : "#245AB8",
                  }}
                >
                  {Array.from(profile.name)[0]?.toUpperCase()}
                </Txt>
              ) : (
                <Icon name="profile" size={26} />
              )}
            </LinearGradient>
            <View style={{ flex: 1, gap: 3 }}>
              <Identity
                name={profile?.name || text("你好，旅行者", "Hello, traveller")}
                tier={tier}
              />
              <Txt variant="caption" color={colors.secondary} numberOfLines={1}>
                {profile?.bio ||
                  (profile
                    ? profile.email
                    : text(
                        "登录，建立你的旅行身份",
                        "Sign in to make this place yours",
                      ))}
              </Txt>
            </View>
            <Icon name="next" size={16} color={colors.secondary} />
          </View>
        </Tap>
        {!profile && (
          <Button
            label={text("登录 / 注册", "Sign in / Create account")}
            onPress={() => router.push("/login")}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: colors.line,
            paddingTop: 13,
          }}
        >
          {[
            {
              label: text("我的帖子", "Stories"),
              value: own,
              press: () => community("mine"),
            },
            {
              label: text("收藏帖子", "Saved stories"),
              value: saved,
              press: () => community("saved"),
            },
            {
              label: text("收藏卡片", "Saved cards"),
              value: prefs.favorites.length,
              press: () =>
                router.push({
                  pathname: "/cards",
                  params: { filter: "saved" },
                }),
            },
          ].map((item) => (
            <Tap
              key={item.label}
              label={item.label}
              onPress={item.press}
              style={{ flex: 1, alignItems: "center", gap: 3, minHeight: 44 }}
            >
              <Txt style={{ fontSize: 21, fontWeight: "700" }}>
                {item.value}
              </Txt>
              <Txt variant="caption" color={colors.secondary}>
                {item.label}
              </Txt>
            </Tap>
          ))}
        </View>
      </Surface>
      {Boolean(error) && <Notice danger text={error} />}
      <Tap
        label={text("会员与充值", "Membership & plans")}
        onPress={() => router.push("/upgrade")}
        style={{ marginBottom: 20 }}
      >
        <LinearGradient
          colors={
            isDark
              ? ["#243A60", "#26304F", "#343149"]
              : ["#D7E9FF", "#E6E9FB", "#F3E8F3"]
          }
          style={{
            borderRadius: 24,
            padding: 18,
            gap: 14,
            borderWidth: 1,
            borderColor: isDark ? "#465579" : "#FFFFFF",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Identity
                name={
                  tier === "free"
                    ? "ChinaHand membership"
                    : `ChinaHand ${plans[tier].name}`
                }
                tier={tier}
                compact
              />
              <Txt variant="caption" color={colors.secondary}>
                {tier === "free"
                  ? text(
                      "让下一步，多一点从容",
                      "A little extra for every next step",
                    )
                  : text(
                      "会员权益与演示开通记录",
                      "Your benefits and demo activations",
                    )}
              </Txt>
            </View>
            <Icon name="arrow" size={19} />
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}
          >
            <Txt style={{ fontSize: 28, lineHeight: 34, fontWeight: "700" }}>
              {left.toLocaleString()}
            </Txt>
            <Txt variant="caption" color={colors.secondary}>
              {text("次 AI 问答剩余 / 本月", "AI questions left this month")}
            </Txt>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Txt variant="caption" color={colors.secondary}>
              {text("已用", "Used")} {plans[tier].monthlyQuestions - left} /{" "}
              {plans[tier].monthlyQuestions.toLocaleString()}
            </Txt>
            <Txt variant="label" color={colors.accent}>
              {tier === "free"
                ? text("探索会员", "Explore plans")
                : text("管理会员", "Manage plan")}{" "}
              ›
            </Txt>
          </View>
        </LinearGradient>
      </Tap>
      <Section title={text("随身工具", "Your everyday essentials")}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            {
              icon: "address",
              label: text("地址钱包", "Places"),
              path: "/address",
              color: "#2E91AF",
            },
            {
              icon: "prep",
              label: text("我的行程", "My trip"),
              path: "/trip",
              color: "#5276C9",
            },
            {
              icon: "cards",
              label: text("自制卡片", "My cards"),
              path: "/cards",
              color: "#8A65BD",
            },
          ].map((item) => (
            <Surface key={item.path} style={{ flex: 1 }}>
              <Tap
                label={item.label}
                onPress={() =>
                  router.push(
                    item.path === "/cards"
                      ? { pathname: "/cards", params: { filter: "custom" } }
                      : (item.path as "/trip" | "/address"),
                  )
                }
                style={{ paddingVertical: 16, alignItems: "center", gap: 9 }}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  color={isDark ? colors.accent : item.color}
                />
                <Txt variant="caption">{item.label}</Txt>
              </Tap>
            </Surface>
          ))}
        </View>
      </Section>
      <Section title={text("离线沟通工具", "Offline communication")}>
        <Surface>
          <Row
            title={text("双向沟通板", "Two-way talk")}
            subtitle={text(
              "中文提问，固定答复与金额回显",
              "Show Chinese; get a preset reply or CNY amount",
            )}
            icon="chat"
            last
            onPress={() => router.push("/talk")}
          />
        </Surface>
      </Section>
      <Section title={text("账户与服务", "Account & services")}>
        <Surface>
          <Row
            title={text("个人资料", "Personal details")}
            subtitle={text("昵称与个人简介", "Your display name and bio")}
            icon="profile"
            onPress={() => router.push(profile ? "/account" : "/login")}
          />
          <Row
            title={text("我的互动", "My activity")}
            subtitle={text(
              "点赞过、回复过的帖子",
              "Stories you liked or replied to",
            )}
            icon="heart"
            onPress={() => community("activity")}
          />
          <Row
            title={text("开通记录", "Activation history")}
            subtitle={text(
              "查看本机会员演示记录",
              "Membership activity on this device",
            )}
            icon="prep"
            onPress={() => router.push("/orders")}
          />
          <Row
            title={text("AI 连接与隐私", "AI connection & privacy")}
            subtitle={
              config
                ? text(
                    "已连接 · 密钥仅本次会话有效",
                    "Connected · key held for this session only",
                  )
                : text("配置自己的模型服务", "Connect your own model provider")
            }
            icon="privacy"
            onPress={() => router.push("/ai-config")}
          />
          <Row
            title={text("帮助中心", "Help centre")}
            subtitle={text(
              "常见问题与使用指南",
              "Answers and practical guides",
            )}
            icon="help"
            last
            onPress={() => router.push("/faq")}
          />
        </Surface>
      </Section>
      <Txt
        variant="caption"
        color={colors.secondary}
        style={{ textAlign: "center", marginBottom: 18 }}
      >
        {text(
          "本机演示账户 · 不跨设备同步 · 无实际扣款",
          "Local demo account · no cloud sync or real billing",
        )}
      </Txt>
      {profile && (
        <Button
          secondary
          label={text("退出登录", "Sign out")}
          onPress={() =>
            confirmAction(
              text("退出登录？", "Sign out?"),
              text(
                "将清除当前 AI 连接与聊天；本机资料会保留。",
                "Your AI session and chat will clear. Local profile data will remain.",
              ),
              () => {
                disconnect();
                logout();
              },
              t,
            )
          }
        />
      )}
    </Page>
  );
}
