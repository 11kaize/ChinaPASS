import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { useApp } from "../state";
import { useProduct } from "../product-state";
import {
  Page,
  Heading,
  Surface,
  Txt,
  Icon,
  Button,
  Notice,
  Tap,
  openURL,
} from "../ui";
import { localeTag } from "../locale-ui";
import {
  getTravelService,
  travelPricing,
  travelText,
  travelUSD,
  travelTotalCents,
  type SupportTopic,
} from "../domain/travel-services";

export default function TravelServiceDetail() {
  const { id, order: orderId } = useLocalSearchParams<{
    id?: string;
    order?: string;
  }>();
  const { prefs, colors } = useApp();
  const {
    profile,
    ready,
    error: storageError,
    loginDemo,
    buyTravel,
    requestTravelSupport,
  } = useProduct();
  const [checkoutId] = useState(() => Crypto.randomUUID());
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const lang = prefs.language;
  const c = (key: Parameters<typeof travelText>[1]) => travelText(lang, key);
  const service = getTravelService(id);
  const order = profile?.travelOrders?.find(
    (item) => item.id === orderId && item.serviceId === service?.id,
  );
  if (!service || (orderId && !order))
    return (
      <Page back title={c("travel")}>
        <Notice text={c(service ? "noOrder" : "missing")} />
        <Button
          label={c("browse")}
          onPress={() =>
            router.replace({
              pathname: "/upgrade",
              params: { section: "travel" },
            })
          }
        />
      </Page>
    );
  const baseCNY = order?.baseCNY ?? service.baseCNY;
  const rate = order?.cnyPerUSD ?? travelPricing.cnyPerUSD;
  const fee = order?.feeCents ?? travelPricing.feeCents;
  const total = order?.totalCents ?? travelTotalCents(baseCNY);
  const topic = order?.supportTopic;
  return (
    <Page key={order?.id || service.id} back title={service.name[lang]}>
      <Heading title={service.name[lang]} body={service.description[lang]} />
      <Notice text={c("demo")} />
      {order && (
        <Surface style={{ padding: 20, gap: 12, marginBottom: 19 }}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Icon name="checked" size={24} />
            <Txt verbatim variant="subheading" style={{ flex: 1 }}>
              {c("activated")}
            </Txt>
          </View>
          <Txt verbatim color={colors.secondary}>
            {c("recordNote")}
          </Txt>
          <Txt verbatim variant="caption" color={colors.secondary}>
            {new Date(order.createdAt).toLocaleDateString(localeTag(lang))}
          </Txt>
          <Txt verbatim selectable variant="caption" color={colors.secondary}>
            {order.id}
          </Txt>
          <Button
            label={c("contact")}
            icon="chat"
            onPress={() => setSupportOpen(true)}
          />
        </Surface>
      )}
      {order && (supportOpen || topic) && (
        <Surface style={{ padding: 19, gap: 13, marginBottom: 19 }}>
          <View style={{ flexDirection: "row", gap: 9, alignItems: "center" }}>
            <Icon name="chat" size={20} />
            <Txt verbatim variant="subheading" style={{ flex: 1 }}>
              {c("concierge")}
            </Txt>
          </View>
          <Txt verbatim variant="caption" color={colors.secondary}>
            {c("supportIntro")}
          </Txt>
          {(["prepare", "change", "redeem"] as SupportTopic[]).map((item) => (
            <Tap
              key={item}
              verbatim
              label={c(item)}
              selected={topic === item}
              onPress={() => {
                try {
                  requestTravelSupport(order.id, item);
                  setError("");
                } catch {
                  setError(c("error"));
                }
              }}
              style={{
                padding: 13,
                minHeight: 44,
                backgroundColor:
                  topic === item ? colors.accentSoft : colors.raised,
                borderRadius: 14,
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Txt verbatim variant="label" style={{ flex: 1 }}>
                {c(item)}
              </Txt>
              <Icon
                animated
                name={topic === item ? "checked" : "next"}
                size={17}
              />
            </Tap>
          ))}
          {topic && (
            <>
              <Txt verbatim variant="caption" color={colors.accent}>
                {c("supportSent")}
              </Txt>
              <Txt verbatim>
                {topic === "prepare"
                  ? service.preparation[lang]
                  : c(topic === "change" ? "changeReply" : "redeemReply")}
              </Txt>
            </>
          )}
        </Surface>
      )}
      <Surface style={{ padding: 19, gap: 15, marginBottom: 19 }}>
        <Txt verbatim variant="subheading">
          {c("included")}
        </Txt>
        <Txt verbatim variant="label" color={colors.accent}>
          {service.scope[lang]}
        </Txt>
        {service.included.map((line, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 10 }}>
            <Icon name="check" size={17} />
            <Txt verbatim style={{ flex: 1 }}>
              {line[lang]}
            </Txt>
          </View>
        ))}
        <Txt verbatim variant="caption" color={colors.secondary}>
          {c("independent")}
        </Txt>
        <Txt verbatim variant="caption" color={colors.secondary}>
          {c("once")}
        </Txt>
      </Surface>
      <Surface style={{ padding: 19, gap: 13, marginBottom: 19 }}>
        <Txt verbatim variant="subheading">
          {c("pricing")}
        </Txt>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Txt verbatim style={{ flex: 1 }} color={colors.secondary}>
            {c("subtotal")}
          </Txt>
          <Txt verbatim variant="label">
            ¥{baseCNY} ≈ {travelUSD(total - fee)}
          </Txt>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Txt verbatim style={{ flex: 1 }} color={colors.secondary}>
            {c("fee")}
          </Txt>
          <Txt verbatim variant="label">
            {travelUSD(fee)}
          </Txt>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderTopWidth: 1,
            borderTopColor: colors.line,
            paddingTop: 14,
          }}
        >
          <Txt verbatim variant="label" style={{ flex: 1 }}>
            {c("total")}
          </Txt>
          <Txt
            verbatim
            style={{
              fontSize: 27,
              lineHeight: 33,
              fontWeight: "700",
              fontVariant: ["tabular-nums"],
            }}
          >
            {travelUSD(total)}
          </Txt>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Txt
            verbatim
            variant="caption"
            style={{ flex: 1 }}
            color={colors.secondary}
          >
            {c("due")}
          </Txt>
          <Txt verbatim variant="label" color={colors.accent}>
            $0.00
          </Txt>
        </View>
        <Txt verbatim variant="caption" color={colors.secondary}>
          US$1 = ¥{rate} · {c("rateNote")}
        </Txt>
      </Surface>
      <Txt verbatim variant="subheading" style={{ marginBottom: 8 }}>
        {c("limits")}
      </Txt>
      <Txt verbatim color={colors.secondary} style={{ marginBottom: 18 }}>
        {service.limits[lang]}
      </Txt>
      <Surface style={{ padding: 18, gap: 10, marginBottom: 19 }}>
        <Txt verbatim variant="label">
          {service.sourceName[lang]}
        </Txt>
        <Txt verbatim variant="caption" color={colors.secondary}>
          {c("published")}:{" "}
          {service.sourceDate === "—" ? c("undated") : service.sourceDate}
          {"\n"}
          {c("checked")}: {travelPricing.checkedAt}
        </Txt>
        <Button
          secondary
          label={c("source")}
          onPress={() => openURL(service.sourceURL)}
        />
      </Surface>
      {(error || storageError) && (
        <Notice danger text={error || storageError} />
      )}
      {!order && (
        <Surface style={{ padding: 18, gap: 15, marginBottom: 19 }}>
          <Tap
            verbatim
            label={c("agree")}
            selected={agreed}
            onPress={() => setAgreed(!agreed)}
            style={{
              minHeight: 44,
              flexDirection: "row",
              alignItems: "center",
              gap: 11,
            }}
          >
            <Icon name={agreed ? "checked" : "unchecked"} size={22} />
            <Txt verbatim variant="caption" style={{ flex: 1 }}>
              {c("agree")}
            </Txt>
          </Tap>
          <Button
            disabled={!agreed || !ready}
            label={c(profile ? "activate" : "loginDemo")}
            icon="check"
            onPress={() => {
              if (!agreed || !ready) return;
              try {
                if (!profile) loginDemo();
                const nextId = buyTravel(service.id, checkoutId);
                setError("");
                router.setParams({ order: nextId });
              } catch {
                setError(c("error"));
              }
            }}
          />
        </Surface>
      )}
      <Button
        secondary
        label={c("allHistory")}
        icon="prep"
        onPress={() => router.push("/orders")}
      />
    </Page>
  );
}
