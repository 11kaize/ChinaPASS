import { localeTag } from "../locale-ui";
import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../state";
import { useProduct } from "../product-state";
import { plans } from "../domain/membership";
import { Page, Heading, Surface, Txt, Icon, Button, Notice } from "../ui";
import { Identity } from "../identity";
export default function Orders() {
  const { prefs, colors } = useApp();
  const { profile } = useProduct();
  const zh = prefs.language === "zh";
  const orders = profile?.orders || [];
  const date = (value: string) =>
    new Date(value).toLocaleDateString(localeTag(prefs.language));
  return (
    <Page back title={zh ? "开通记录" : "Activation history"}>
      <Heading
        title={zh ? "你的会员记录" : "Your membership journey."}
        body={
          zh
            ? "查看本机演示开通记录与有效期。"
            : "Your demo activations and validity dates, in one place."
        }
      />
      <Notice
        text={
          zh
            ? "以下均为演示记录，实际支付金额为 $0，不是支付凭证。旧版本未记录的开通不会补生成订单。"
            : "Demo records only. Amount actually paid: $0. These are not payment receipts. Activations from older versions have no history record."
        }
      />
      {!profile ? (
        <Button
          label={zh ? "登录查看记录" : "Sign in to view history"}
          onPress={() => router.push("/login")}
        />
      ) : !orders.length ? (
        <Surface style={{ padding: 24, gap: 14, alignItems: "center" }}>
          <Icon name="prep" size={30} />
          <Txt variant="subheading">
            {zh ? "还没有开通记录" : "No activations yet"}
          </Txt>
          <Txt variant="caption" color={colors.secondary}>
            {zh
              ? "体验一次会员升级后，记录会出现在这里。"
              : "Your next demo activation will appear here."}
          </Txt>
          <Button
            label={zh ? "查看会员套餐" : "Explore membership"}
            onPress={() => router.push("/upgrade")}
          />
        </Surface>
      ) : (
        orders.map((order) => (
          <Surface
            key={order.id}
            style={{ padding: 18, gap: 12, marginBottom: 12 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Identity
                name={`ChinaBuddy ${plans[order.tier].name}`}
                tier={order.tier}
                compact
              />
              <Txt variant="caption" color={colors.accent}>
                {zh ? "演示开通" : "Demo activation"}
              </Txt>
            </View>
            <Txt variant="caption" color={colors.secondary}>
              {date(order.createdAt)} · {zh ? "有效至" : "valid until"}{" "}
              {date(order.expiresAt)}
            </Txt>
            <Txt variant="label">
              {zh ? "实际支付 $0" : "$0 paid"}
              <Txt variant="caption" color={colors.secondary}>
                {" "}
                · {zh ? "套餐标价" : "Plan price"} ${order.priceUSD} /{" "}
                {order.tier === "plus"
                  ? zh
                    ? "月"
                    : "month"
                  : zh
                    ? "年"
                    : "year"}
              </Txt>
            </Txt>
            <Txt variant="caption" color={colors.secondary} selectable>
              {order.id}
            </Txt>
          </Surface>
        ))
      )}
    </Page>
  );
}
