import React, { useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useApp } from "../state";
import { useProduct, plans } from "../product-state";
import { Identity } from "../identity";
import { Page, Heading, Surface, Txt, Tap, Icon, Button, Notice } from "../ui";
export default function Upgrade() {
  const { prefs, colors, isDark } = useApp();
  const { profile, tier, upgrade } = useProduct();
  const [selected, setSelected] = useState<"plus" | "pro">("plus"),
    [done, setDone] = useState(false);
  const zh = prefs.language === "zh";
  return (
    <Page back title={zh ? "会员" : "Membership"}>
      <View style={{ alignItems: "center", paddingVertical: 14, gap: 12 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 24,
            backgroundColor: colors.accentSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="ai" size={30} weight="fill" />
        </View>
        <Heading
          title={zh ? "更多可能，随你同行。" : "A little more possibility."}
          body={
            zh
              ? "让每一个下一步，都更从容。"
              : "For the everyday moments that make a journey."
          }
        />
      </View>
      <View style={{ gap: 12, marginBottom: 20 }}>
        {(["plus", "pro"] as const).map((id) => (
          <Tap
            key={id}
            label={`Choose ${id}`}
            onPress={() => {
              setSelected(id);
              setDone(false);
            }}
          >
            <LinearGradient
              colors={
                isDark
                  ? id === "pro"
                    ? ["#182D4E", "#302444", "#392B30"]
                    : ["#202D40", "#34445B", "#202D40"]
                  : id === "pro"
                    ? ["#E5F0FF", "#F2E8F8", "#FFF0E7"]
                    : ["#FFFFFF", "#DCE6F2", "#F9FCFF"]
              }
              style={{
                padding: 20,
                borderRadius: 25,
                borderWidth: selected === id ? 2 : 1,
                borderColor: selected === id ? "#528CE7" : "#FFFFFF",
                gap: 13,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Identity
                  name={`ChinaHand ${plans[id].name}`}
                  tier={id}
                  compact
                />
                <Icon
                  name={selected === id ? "checked" : "unchecked"}
                  size={23}
                  color="#4773B7"
                />
              </View>
              <Txt
                style={{
                  color: colors.ink,
                  fontSize: 32,
                  lineHeight: 38,
                  fontWeight: "700",
                }}
              >
                ${plans[id].priceUSD}
                <Txt style={{ color: colors.secondary, fontSize: 13 }}>
                  {" "}
                  / {id === "plus" ? (zh ? "月" : "month") : zh ? "年" : "year"}
                </Txt>
              </Txt>
              <Txt
                style={{
                  color: colors.secondary,
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {plans[id].monthlyQuestions.toLocaleString()}{" "}
                {zh ? "次 AI 问答 / 月" : "AI questions / month"} ·{" "}
                {zh ? "AI 页面快捷按钮" : "in-answer app shortcuts"}
              </Txt>
            </LinearGradient>
          </Tap>
        ))}
      </View>
      <Surface glass style={{ padding: 18, gap: 14, marginBottom: 18 }}>
        {[
          zh ? "AI 回复中的页面跳转按钮" : "Useful app buttons in AI replies",
          zh
            ? "银色 Plus / 彩色 Pro 专属名字特效"
            : "Silver Plus / prismatic Pro identity",
          zh
            ? "在个人页与帖子中展示会员身份"
            : "Membership identity on your profile and stories",
          zh ? "更高的月度 AI 问答额度" : "A larger monthly AI allowance",
        ].map((text) => (
          <View
            key={text}
            style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
          >
            <Icon name="checks" size={18} />
            <Txt variant="caption" style={{ flex: 1 }}>
              {text}
            </Txt>
          </View>
        ))}
      </Surface>
      <Notice
        text={
          zh
            ? "演示升级：不会扣款，也不包含服务商 API 费用。正式付费与云端权益尚未启用。"
            : "Demo upgrade. No charge is made and provider API fees are not included. Live payments and cloud entitlements are not enabled."
        }
      />
      {done ? (
        <>
          <Notice
            text={
              zh
                ? `${plans[tier].name} 演示会员已启用。`
                : `${plans[tier].name} demo membership is active.`
            }
          />
          <Button
            label={zh ? "返回个人中心" : "Back to Me"}
            onPress={() => router.replace("/settings")}
          />
        </>
      ) : (
        <Button
          label={
            profile
              ? zh
                ? `体验 ${plans[selected].name} 演示升级`
                : `Try ${plans[selected].name} demo upgrade`
              : zh
                ? "登录后升级"
                : "Sign in to upgrade"
          }
          onPress={() => {
            if (!profile) {
              router.push("/login");
              return;
            }
            upgrade(selected);
            setDone(true);
          }}
        />
      )}
    </Page>
  );
}
