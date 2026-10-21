import { artwork } from "../../artwork";
import React from "react";
import { View, Image, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, Href } from "expo-router";
import { useApp } from "../../state";
import { content } from "../../content";
import {
  Page,
  Surface,
  Row,
  Section,
  Txt,
  Tap,
  Icon,
  Button,
  Notice,
  Brand,
} from "../../ui";
const shortcuts = [
  {
    id: "transport",
    en: "Transport",
    zh: "交通",
    icon: "transport",
    colors: ["#FFD65F", "#FFAE2D"],
    path: "/transport",
  },
  {
    id: "pay",
    en: "Pay",
    zh: "支付",
    icon: "pay",
    colors: ["#53CFFF", "#3487FA"],
    path: "/guide/pay",
  },
  {
    id: "sim",
    en: "Internet",
    zh: "网络",
    icon: "sim",
    colors: ["#FFAD9B", "#FF7885"],
    path: "/guide/sim",
  },
  {
    id: "hotel",
    en: "Stay",
    zh: "住宿",
    icon: "hotel",
    colors: ["#62CDFF", "#408AFA"],
    path: "/guide/hotel",
  },
  {
    id: "food",
    en: "Food",
    zh: "餐饮",
    icon: "food",
    colors: ["#FFCE68", "#FF9738"],
    path: "/guide/food",
  },
  {
    id: "customs",
    en: "Arrival",
    zh: "落地",
    icon: "customs",
    colors: ["#88C5FF", "#5B9FF6"],
    path: "/ports",
  },
  {
    id: "guides",
    en: "Guides",
    zh: "指南",
    icon: "guides",
    colors: ["#AEB5FF", "#8177F0"],
    path: "/guides",
  },
  {
    id: "emergency",
    en: "Help",
    zh: "帮助",
    icon: "help",
    colors: ["#FFAC99", "#FF7A85"],
    path: "/emergency",
  },
];
// Page paints one continuous backdrop behind this transparent header and the shortcuts.
function HomeHeader() {
  const { colors, prefs } = useApp();
  const zh = prefs.language === "zh";
  return (
    <View style={{ padding: 20, paddingBottom: 17, gap: 8, minHeight: 127 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Brand />
        <Txt
          style={{
            fontSize: 27,
            lineHeight: 34,
            fontWeight: "750",
            letterSpacing: -1,
            color: colors.ink,
          }}
        >
          ChinaHand
        </Txt>
        <View style={{ flex: 1 }} />
        <Tap
          label="Emergency help"
          onPress={() => router.push("/emergency")}
          style={{
            backgroundColor: "#FFF2F3DD",
            borderWidth: 1,
            borderColor: "#FFFFFF",
            borderRadius: 19,
            paddingHorizontal: 10,
            paddingVertical: 10,
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}
        >
          <Icon name="phone" color="#EF6F78" size={15} weight="fill" />
          <Txt style={{ fontSize: 11, fontWeight: "700", color: "#D84859" }}>
            SOS
          </Txt>
        </Tap>
      </View>
      <Txt variant="caption" color={colors.secondary}>
        {zh
          ? "在中国，每一天都多一只帮手。"
          : "A hand with everyday life in China."}
      </Txt>
      <Txt variant="caption" color={colors.secondary} style={{ fontSize: 11 }}>
        {new Date().toLocaleDateString(zh ? "zh-CN" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Txt>
    </View>
  );
}
export default function Home() {
  const { colors, prefs, t, online, isDark } = useApp();
  const zh = prefs.language === "zh";
  const port = content.ports.find((p) => p.id === prefs.arrivalPort);
  return (
    <Page
      backdrop={
        isDark
          ? artwork.homeNight
          : artwork.homeDay
      }
      header={<HomeHeader />}
    >
      <Surface
        glass
        style={{
          padding: 10,
          marginTop: 6,
          marginBottom: 12,
          borderRadius: 28,
        }}
      >
        {[shortcuts.slice(0, 4), shortcuts.slice(4)].map((row, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", gap: 5, paddingVertical: 5 }}
          >
            {row.map((item) => (
              <Tap
                key={item.id}
                label={zh ? item.zh : item.en}
                onPress={() => router.push(item.path as Href)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 10,
                  borderRadius: 21,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.48)",
                }}
              >
                <LinearGradient
                  colors={item.colors as [string, string]}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.7)",
                    shadowColor: item.colors[1],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.23,
                    shadowRadius: 8,
                  }}
                >
                  <Icon
                    name={item.icon}
                    size={25}
                    color="#FFFFFF"
                    weight="fill"
                  />
                </LinearGradient>
                <Txt
                  variant="caption"
                  style={{ fontSize: 11, fontWeight: "600" }}
                >
                  {zh ? item.zh : item.en}
                </Txt>
              </Tap>
            ))}
          </View>
        ))}
      </Surface>
      {online === false && <Notice text={t("offlineNow")} />}
      <View
        style={{
          borderRadius: 26,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: isDark ? "#42567B" : "#FFFFFF",
          marginBottom: 12,
          backgroundColor: isDark ? "#0D203E" : "#DFF1FF",
        }}
      >
        <ImageBackground
          source={
            isDark
              ? artwork.arrivalNight
              : artwork.arrivalDay
          }
          imageStyle={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          style={{ minHeight: 198 }}
        >
          <View style={{ padding: 19, gap: 8, width: "71%" }}>
            <Txt
              style={{
                fontSize: 24,
                lineHeight: 28,
                fontWeight: "750",
                letterSpacing: -0.7,
                color: isDark ? "#F1F6FF" : "#10294F",
              }}
            >
              {zh
                ? "你的第一天，\n可以更轻松。"
                : "Your first day,\nmade easier."}
            </Txt>
            <Txt
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: isDark ? "#BDCDE5" : "#4C6686",
                maxWidth: 185,
              }}
            >
              {port
                ? port.zh
                : zh
                  ? "实用指南与清单，陪你从落地到适应生活。"
                  : "Essential guides and little tips to help you settle in."}
            </Txt>
            <View style={{ alignSelf: "flex-start", marginTop: 4 }}>
              <Button
                label={zh ? "查看落地指南" : "View arrival guide"}
                onPress={() => router.push(port ? "/arrival" : "/ports")}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
      <Tap
        label={zh ? "问问 ChinaHand AI" : "Ask ChinaHand AI"}
        onPress={() => router.navigate("/chat")}
        style={{ marginBottom: 16 }}
      >
        <Surface
          glass
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            gap: 10,
          }}
        >
          <Image
            source={artwork.assistant}
            accessibilityLabel="ChinaHand AI companion"
            style={{ width: 65, height: 65 }}
            resizeMode="contain"
          />
          <View style={{ flex: 1, gap: 5 }}>
            <Txt variant="subheading" style={{ fontSize: 16 }}>
              {zh ? "问问 ChinaHand AI" : "Ask ChinaHand AI"}
            </Txt>
            <Txt variant="caption" color={colors.secondary}>
              {zh
                ? "关于中国生活，给你清楚、实用的回答。"
                : "Clear, practical answers about life in China."}
            </Txt>
          </View>
          <Icon name="arrow" size={19} />
        </Surface>
      </Tap>
      <Surface glass style={{ padding: 14, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Txt variant="subheading" style={{ fontSize: 16 }}>
            {zh ? "来自社区" : "From the community"}
          </Txt>
          <Tap
            label={zh ? "查看社区" : "See all community"}
            onPress={() => router.navigate("/community")}
          >
            <Txt variant="caption" color={colors.accent}>
              {zh ? "查看全部" : "See all"} ›
            </Txt>
          </Tap>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            {
              id: "help",
              icon: "community",
              en: "Help nearby",
              zh: "救助贴",
              body: zh
                ? "真实的问题，来自身边的帮助。"
                : "Real questions. A little help nearby.",
              color: "#43AEF4",
            },
            {
              id: "featured",
              icon: "star",
              en: "Editor’s picks",
              zh: "精华贴",
              body: zh
                ? "让落地更轻松的实用经验。"
                : "Practical stories for a smoother arrival.",
              color: "#F8BC38",
            },
          ].map((x) => (
            <Tap
              key={x.id}
              label={zh ? x.zh : x.en}
              onPress={() =>
                router.push({
                  pathname: "/community",
                  params: { filter: x.id },
                })
              }
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 20,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.5)",
                gap: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 11,
                    backgroundColor: x.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={x.icon} color="#FFFFFF" size={16} weight="fill" />
                </View>
                <Txt style={{ fontSize: 12, fontWeight: "700", flexShrink: 1 }}>
                  {zh ? x.zh : x.en}
                </Txt>
              </View>
              {x.id === "featured" && (
                <Image
                  source={
                    isDark
                      ? artwork.arrivalNight
                      : artwork.arrivalDay
                  }
                  accessibilityLabel="Airport arrival illustration"
                  style={{ width: "100%", height: 68, borderRadius: 12 }}
                  resizeMode="cover"
                />
              )}
              <Txt
                variant="caption"
                color={colors.secondary}
                style={{ fontSize: 11, lineHeight: 16 }}
              >
                {x.body}
              </Txt>
            </Tap>
          ))}
        </View>
      </Surface>
      <Section title={zh ? "你的生活工具箱" : "Your everyday toolkit"}>
        <Surface glass>
          {[
            { label: t("prep"), icon: "prep", path: "/preparation" },
            { label: t("address"), icon: "address", path: "/address" },
            {
              label: zh ? "机场与车站" : "Airports & stations",
              icon: "transport",
              path: "/city",
            },
            { label: t("faq"), icon: "info", path: "/faq" },
          ].map((x, i) => (
            <Row
              key={x.path}
              title={x.label}
              icon={x.icon}
              last={i === 3}
              onPress={() => router.push(x.path as Href)}
            />
          ))}
        </Surface>
      </Section>
    </Page>
  );
}
