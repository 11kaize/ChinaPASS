import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "./state";
import { useProduct } from "./product-state";
import { Surface, Txt, Tap, Icon, Notice, Button } from "./ui";
import {
  travelServices,
  travelText,
  travelTotalCents,
  travelUSD,
} from "./domain/travel-services";

export function TravelCatalog() {
  const { prefs, colors, isDark } = useApp();
  const { profile } = useProduct();
  const lang = prefs.language;
  const c = (key: Parameters<typeof travelText>[1]) => travelText(lang, key);
  return (
    <>
      <LinearGradient
        colors={isDark ? ["#173A5E", "#233650"] : ["#D5EAFF", "#EBF4FF"]}
        style={{ borderRadius: 26, padding: 18, gap: 8, marginBottom: 18 }}
      >
        <Txt verbatim variant="title" style={{ fontSize: 24, lineHeight: 29 }}>
          {c("headline")}
        </Txt>
        <Txt verbatim variant="caption" color={colors.secondary}>
          {c("intro")}
        </Txt>
        <Txt verbatim variant="caption" color={colors.secondary}>
          {c("independent")}
        </Txt>
      </LinearGradient>
      <Notice text={c("demoShort")} />
      <Txt
        verbatim
        variant="caption"
        color={colors.secondary}
        style={{ marginBottom: 15 }}
      >
        {c("once")}
      </Txt>
      {travelServices.map((service) => {
        const owned = profile?.travelOrders?.some(
          (order) => order.serviceId === service.id,
        );
        return (
          <Tap
            key={service.id}
            label={`${service.name[lang]} · ${travelUSD(travelTotalCents(service.baseCNY))}`}
            verbatim
            onPress={() =>
              router.push({
                pathname: "/travel-service",
                params: { id: service.id },
              })
            }
            style={{ marginBottom: 12 }}
          >
            <Surface glass={false} style={{ padding: 18, gap: 13 }}>
              <View
                style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isDark
                      ? colors.raised
                      : `${service.color}16`,
                  }}
                >
                  <Icon
                    name={service.icon}
                    color={isDark ? colors.accent : service.color}
                    size={21}
                  />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Txt verbatim variant="subheading">
                    {service.name[lang]}
                  </Txt>
                  <Txt verbatim variant="caption" color={colors.secondary}>
                    {service.scope[lang]}
                  </Txt>
                </View>
                <Icon name="next" size={17} color={colors.secondary} />
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View style={{ flex: 1, gap: 3 }}>
                  <Txt verbatim variant="caption" color={colors.secondary}>
                    {c("fromLocal")} ¥{service.baseCNY}
                  </Txt>
                  <Txt verbatim variant="caption" color={colors.secondary}>
                    {c("plusFee")}
                  </Txt>
                </View>
                <Txt
                  verbatim
                  style={{
                    fontSize: 25,
                    lineHeight: 31,
                    fontWeight: "700",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {travelUSD(travelTotalCents(service.baseCNY))}
                </Txt>
              </View>
              {owned && (
                <Txt verbatim variant="caption" color={colors.accent}>
                  {c("owned")}
                </Txt>
              )}
            </Surface>
          </Tap>
        );
      })}
      <Surface style={{ padding: 19, gap: 10, marginTop: 5, marginBottom: 18 }}>
        <Txt verbatim variant="subheading">
          {c("advantages")}
        </Txt>
        <Txt verbatim color={colors.secondary}>
          {c("advantageBody")}
        </Txt>
      </Surface>
      <Txt verbatim variant="label" style={{ marginBottom: 6 }}>
        {c("pricing")}
      </Txt>
      <Txt
        verbatim
        variant="caption"
        color={colors.secondary}
        style={{ marginBottom: 18 }}
      >
        {c("pricingNote")}
      </Txt>
      <Button
        secondary
        label={c("history")}
        icon="prep"
        onPress={() => router.push("/orders")}
      />
    </>
  );
}
