import React, { useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useApp } from "../state";
import { useProduct, plans } from "../product-state";
import { remainingQuestions } from "../domain/membership";
import { Identity } from "../identity";
import { Page, Surface, Txt, Tap, Icon, Button, Notice, Row } from "../ui";

export default function Upgrade() {
  const { prefs, colors, isDark } = useApp();
  const { profile, tier, usage, upgrade } = useProduct();
  const [selected, setSelected] = useState<"plus" | "pro">(
    tier === "pro" ? "pro" : "plus",
  );
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const zh = prefs.language === "zh";
  const text = (cn: string, en: string) => (zh ? cn : en);
  const active = tier === selected;
  const plan = plans[selected];
  const date = (value: string) =>
    new Date(value).toLocaleDateString(zh ? "zh-CN" : "en-US");
  const benefits = [
    {
      title: text("每月 AI 问答", "Monthly AI questions"),
      free: "20",
      plus: "500",
      pro: "2,000",
    },
    {
      title: text("回复内页面跳转", "In-answer app shortcuts"),
      free: "—",
      plus: "✓",
      pro: "✓",
    },
    {
      title: text("专属昵称效果", "Display-name finish"),
      free: text("标准", "Standard"),
      plus: text("银色", "Silver"),
      pro: text("彩色", "Prismatic"),
    },
    {
      title: text("指南、卡片与社区", "Guides, cards & community"),
      free: "✓",
      plus: "✓",
      pro: "✓",
    },
  ];
  const questions = [
    [
      text("充值后还需要 API Key 吗？", "Do I still need my own API key?"),
      text(
        "需要。会员提供应用内问答额度与功能权益；模型费用由你选择的服务商另行收取，套餐不含 API 余额。密钥仅保存在本次运行内存中。",
        "Yes. Membership covers app features and question limits. Your provider bills model usage separately; no API credit is included. Your key stays in memory for this session only.",
      ),
    ],
    [
      text("额度什么时候刷新？", "When does my allowance reset?"),
      text(
        "额度按 UTC 自然月计算，每月刷新，不累积。取消或失败的请求会退还本次额度。Pro 年付也按月获得 2,000 次额度。",
        "Limits reset each UTC calendar month and do not roll over. Failed or cancelled requests are refunded. Annual Pro still includes 2,000 questions per month.",
      ),
    ],
    [
      text("现在会扣款或自动续费吗？", "Will I be charged or auto-renewed?"),
      text(
        "不会。这是本机演示升级，没有真实支付、自动续费或云端同步。切换套餐会替换当前演示会员，有效期从本次开通起计算。",
        "No. This is a local demo with no payment, auto-renewal or cloud sync. Switching plans replaces the current demo membership; validity starts from this activation.",
      ),
    ],
  ];
  return (
    <Page back title={text("会员与充值", "Membership & plans")}>
      <LinearGradient
        colors={
          isDark
            ? ["#223D6B", "#27304D", "#37304B"]
            : ["#D3E8FF", "#E6E9FB", "#F7E9EF"]
        }
        style={{
          borderRadius: 28,
          padding: 23,
          gap: 13,
          marginBottom: 18,
          borderWidth: 1,
          borderColor: isDark ? "#425477" : "#FFFFFF",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name="crown" size={20} />
          <Identity name={`ChinaHand ${plan.name}`} tier={selected} />
        </View>
        <Txt
          style={{
            fontSize: 27,
            lineHeight: 33,
            fontWeight: "700",
            letterSpacing: -0.7,
          }}
        >
          {text(
            "每个下一步，\n都多一点从容。",
            "More confidence.\nEvery next step.",
          )}
        </Txt>
        <Txt variant="caption" color={colors.secondary}>
          {text(
            "更多 AI 问答、实用快捷跳转，让中国生活更顺手。",
            "More room to ask, useful shortcuts, and a smoother everyday life in China.",
          )}
        </Txt>
        <View
          style={{
            borderTopWidth: 1,
            borderColor: colors.line,
            paddingTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Txt variant="caption" color={colors.secondary}>
            {text("当前套餐", "Current plan")} · {plans[tier].name}
          </Txt>
          <Txt variant="caption">
            {remainingQuestions(tier, usage).toLocaleString()}{" "}
            {text("次剩余", "questions left")}
          </Txt>
        </View>
        {profile?.membership.expiresAt && tier !== "free" && (
          <Txt variant="caption" color={colors.secondary}>
            {text("有效至", "Valid until")} {date(profile.membership.expiresAt)}
          </Txt>
        )}
      </LinearGradient>
      <Txt variant="subheading" style={{ marginBottom: 12 }}>
        {text("选择适合你的陪伴", "Find your everyday fit")}
      </Txt>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        {(["plus", "pro"] as const).map((id) => (
          <Tap
            key={id}
            label={`Choose ${id}`}
            selected={selected === id}
            onPress={() => {
              setSelected(id);
              setDone(false);
              setError("");
            }}
            style={{ flex: 1 }}
          >
            <Surface
              glass={false}
              style={{
                padding: 16,
                gap: 9,
                borderWidth: 2,
                borderColor: selected === id ? colors.accent : colors.line,
                height: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Identity name={plans[id].name} tier={id} compact />
                <Icon
                  name={selected === id ? "checked" : "unchecked"}
                  size={18}
                />
              </View>
              <Txt style={{ fontSize: 31, lineHeight: 38, fontWeight: "700" }}>
                ${plans[id].priceUSD}
                <Txt variant="caption" color={colors.secondary}>
                  {" "}
                  / {id === "plus" ? text("月", "mo") : text("年", "yr")}
                </Txt>
              </Txt>
              <Txt variant="caption" color={colors.secondary}>
                {id === "plus"
                  ? text("月度灵活体验", "A flexible monthly plan")
                  : text(
                      "约 $7.42 / 月，按年计价",
                      "About $7.42/mo, billed yearly",
                    )}
              </Txt>
              <Txt variant="label">
                {plans[id].monthlyQuestions.toLocaleString()}{" "}
                {text("次 / 月", "asks / mo")}
              </Txt>
            </Surface>
          </Tap>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <Icon name="checks" size={18} />
        <Txt variant="subheading">
          {text("权益一目了然", "The benefits, at a glance")}
        </Txt>
      </View>
      <Surface style={{ padding: 16, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", paddingBottom: 12 }}>
          <View style={{ flex: 1.8 }} />
          <Txt variant="caption" style={{ flex: 1, textAlign: "center" }}>
            Free
          </Txt>
          <Txt variant="caption" style={{ flex: 1, textAlign: "center" }}>
            Plus
          </Txt>
          <Txt variant="caption" style={{ flex: 1, textAlign: "center" }}>
            Pro
          </Txt>
        </View>
        {benefits.map((benefit) => (
          <View
            key={benefit.title}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: colors.line,
            }}
          >
            <Txt variant="caption" style={{ flex: 1.8, paddingRight: 6 }}>
              {benefit.title}
            </Txt>
            {(["free", "plus", "pro"] as const).map((id) => (
              <Txt
                key={id}
                variant="caption"
                color={id === selected ? colors.accent : colors.secondary}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: id === selected ? "700" : "400",
                }}
              >
                {benefit[id]}
              </Txt>
            ))}
          </View>
        ))}
      </Surface>
      <Surface style={{ padding: 18, gap: 13, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Txt variant="subheading">
            {text("开通确认", "Your plan summary")}
          </Txt>
          <Txt variant="label">
            {plan.name} · ${plan.priceUSD}/
            {selected === "plus" ? text("月", "mo") : text("年", "yr")}
          </Txt>
        </View>
        <Txt variant="caption" color={colors.secondary}>
          {text("本次为演示开通，实际支付", "Demo activation · amount due")}{" "}
          <Txt variant="label">$0</Txt>
          {"\n"}
          {text(
            "无自动续费 · 不含服务商 API 费用",
            "No auto-renewal · provider API fees excluded",
          )}
        </Txt>
        {Boolean(error) && <Notice danger text={error} />}
        {done && (
          <Notice
            text={text(
              `${plan.name} 演示会员已开通，记录已保存。`,
              `${plan.name} demo activated. Your record has been saved.`,
            )}
          />
        )}
        <Button
          disabled={active && !done}
          label={
            done
              ? text("查看开通记录", "View activation history")
              : active
                ? text("正在使用此套餐", "Your current plan")
                : profile
                  ? text(
                      `体验 ${plan.name} · 演示开通`,
                      `Activate ${plan.name} demo`,
                    )
                  : text("登录后体验", "Sign in to continue")
          }
          onPress={() => {
            if (done) {
              router.push("/orders");
              return;
            }
            if (!profile) {
              router.push("/login");
              return;
            }
            try {
              upgrade(selected);
              setDone(true);
              setError("");
            } catch {
              setError(
                text(
                  "开通失败，请登录后重试。",
                  "Could not activate. Sign in and try again.",
                ),
              );
            }
          }}
        />
        {done && (
          <Button
            secondary
            label={text("返回个人中心", "Back to Me")}
            onPress={() => router.replace("/settings")}
          />
        )}
        {tier !== "free" && !active && !done && (
          <Txt variant="caption" color={colors.secondary}>
            {text(
              "切换会替换当前演示套餐，有效期从今天重新计算。",
              "Switching replaces your demo plan and restarts its validity today.",
            )}
          </Txt>
        )}
      </Surface>
      <Txt variant="subheading" style={{ marginBottom: 12 }}>
        {text("开通前，你可能想了解", "A few useful answers")}
      </Txt>
      <Surface style={{ marginBottom: 18 }}>
        {questions.map(([q, a], i) => (
          <View key={q}>
            <Row
              title={q}
              icon="info"
              last={i === questions.length - 1 && open !== i}
              trailing={<Icon name={open === i ? "close" : "plus"} size={16} />}
              onPress={() => setOpen(open === i ? null : i)}
            />
            {open === i && (
              <Txt
                variant="caption"
                color={colors.secondary}
                style={{ paddingHorizontal: 18, paddingBottom: 18 }}
              >
                {a}
              </Txt>
            )}
          </View>
        ))}
      </Surface>
      <Row
        title={text("查看开通记录", "Activation history")}
        icon="prep"
        last
        onPress={() => router.push("/orders")}
      />
    </Page>
  );
}
