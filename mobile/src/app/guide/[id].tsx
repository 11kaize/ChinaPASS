import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../../state";
import { content } from "../../content";
import { paymentHelp, paymentHelpTitle } from "../../payment-help";
import { ServiceActions } from "../../service-actions";
import { guideSections } from "../../offline-search";
import {
  Page,
  Heading,
  Surface,
  Section,
  Txt,
  Icon,
  Tap,
  Button,
  RichText,
  openURL,
} from "../../ui";
export function generateStaticParams() {
  return [...content.scenes, ...content.shortGuides].map(({ id }) => ({ id }));
}

export default function Guide() {
  const { id, match } = useLocalSearchParams<{ id: string; match?: string }>();
  const { t, L, colors, prefs, update, setGuideId } = useApp();
  const [choice, setChoice] = useState({ route: "", value: 0 });
  const scene = content.scenes.find((s) => s.id === id);
  const short = content.shortGuides.find((s) => s.id === id);
  const searchMatch = scene
    ? guideSections(scene, prefs.language).find(
        (section) => section.id === match,
      )
    : short?.steps
        .map(([title, body], i) => ({ id: `step-${i}`, title, body, step: i }))
        .find((section) => section.id === match);
  const routeKey = `${id}:${match || ""}`;
  const expanded =
    choice.route === routeKey ? choice.value : (searchMatch?.step ?? 0);
  const setExpanded = (value: number) => setChoice({ route: routeKey, value });
  const matchedContent = searchMatch ? (
    <Surface
      style={{
        padding: 18,
        gap: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.accent,
      }}
    >
      <Txt variant="caption" color={colors.accent}>
        {prefs.language === "zh" ? "搜索定位" : "Search match"}
      </Txt>
      <Txt variant="subheading">{L(searchMatch.title)}</Txt>
      <Txt selectable>{L(searchMatch.body)}</Txt>
    </Surface>
  ) : null;
  useEffect(() => {
    setGuideId(id);
    if (scene) update({ arrivalTask: id });
  }, [id, scene, update, setGuideId]);
  if (!scene && !short)
    return (
      <Page back>
        <Heading title={t("guideUnavailable")} />
      </Page>
    );
  if (short)
    return (
      <Page back>
        <Heading title={L(short.title)} body={L(short.summary)} />
        {matchedContent}
        <Surface style={{ padding: 22, gap: 24 }}>
          {short.steps.map(([title, body], index) => (
            <View key={index} style={{ gap: 8 }}>
              <Txt variant="subheading">{L(title)}</Txt>
              <Txt color={colors.secondary}>{L(body)}</Txt>
            </View>
          ))}
        </Surface>
        <View style={{ marginTop: 24 }}>
          <Button
            label={L(short.source.label)}
            secondary
            onPress={() => openURL(short.source.url)}
          />
        </View>
      </Page>
    );
  const s = scene!;
  const done = prefs.steps[id] || [];
  return (
    <Page back>
      <Heading title={L(s.title)} body={L(s.subtitle)} />
      {matchedContent}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
        <Txt variant="caption" color={colors.accent}>
          {done.length}/{s.steps.length} {t("completed")}
        </Txt>
        <Txt variant="caption" color={colors.secondary}>
          {L(s.eta)}
        </Txt>
      </View>
      <RichText text={L(s.task)} />
      <View style={{ height: 25 }} />
      <ServiceActions actions={s.actions} />
      <Section title={t("beforeStart")}>
        <Surface style={{ padding: 19, gap: 11 }}>
          {s.before.map((item, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 10 }}>
              <Icon name="checks" size={18} />
              <Txt style={{ flex: 1 }} color={colors.secondary}>
                {L(item)}
              </Txt>
            </View>
          ))}
        </Surface>
      </Section>
      <Section title={t("steps")}>
        <Surface>
          {s.steps.map((step, i) => {
            const checked = done.includes(i);
            return (
              <View
                key={i}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 18,
                  borderBottomWidth: i === s.steps.length - 1 ? 0 : 0.5,
                  borderBottomColor: colors.line,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 13,
                    alignItems: "center",
                  }}
                >
                  <Tap
                    label={`${L(step.t)} ${checked ? t("completed") : ""}`}
                    selected={checked}
                    onPress={() =>
                      update({
                        steps: {
                          ...prefs.steps,
                          [id]: checked
                            ? done.filter((n) => n !== i)
                            : [...done, i],
                        },
                      })
                    }
                    style={{
                      width: 44,
                      height: 44,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {checked ? (
                      <Icon name="checked" size={22} />
                    ) : (
                      <Txt variant="label" color={colors.accent}>
                        {i + 1}
                      </Txt>
                    )}
                  </Tap>
                  <Tap
                    label={L(step.t)}
                    onPress={() => setExpanded(expanded === i ? -1 : i)}
                    style={{ flex: 1 }}
                  >
                    <Txt variant="label" style={{ maxWidth: 250 }}>
                      {L(step.t)}
                    </Txt>
                  </Tap>
                </View>
                {expanded === i && (
                  <Txt
                    color={colors.secondary}
                    style={{ marginTop: 9, marginLeft: 47 }}
                  >
                    {L(step.d)}
                  </Txt>
                )}
              </View>
            );
          })}
        </Surface>
      </Section>
      {s.showCard && (
        <View style={{ marginBottom: 26 }}>
          <Button
            label={t("show")}
            icon="cards"
            onPress={() =>
              router.push({ pathname: "/card", params: { kind: "scene", id } })
            }
          />
        </View>
      )}
      {(s.id === "pay" ||
        s.trouble.length > 0 ||
        s.planB.length > 0 ||
        s.mistakes.length > 0) && (
        <Section title={s.id === "pay" ? L(paymentHelpTitle) : t("trouble")}>
          <Surface style={{ padding: 20, gap: 24 }}>
            {s.id === "pay" ? (
              paymentHelp.map((item, i) => (
                <View key={i} style={{ gap: 8 }}>
                  <Txt variant="label">{L(item.title)}</Txt>
                  <Txt color={colors.secondary}>{L(item.body)}</Txt>
                </View>
              ))
            ) : (
              <>
                {s.trouble.map((item, i) => (
                  <View key={`trouble-${i}`} style={{ gap: 8 }}>
                    <Txt variant="label">{L(item.p)}</Txt>
                    <Txt color={colors.secondary}>{L(item.a)}</Txt>
                  </View>
                ))}
                {s.mistakes.map((item, i) => (
                  <View key={`mistake-${i}`} style={{ gap: 8 }}>
                    <Txt variant="label">{L(item.m)}</Txt>
                    <Txt color={colors.secondary}>{L(item.d)}</Txt>
                  </View>
                ))}
                {s.planB.length > 0 && (
                  <View style={{ gap: 8 }}>
                    <Txt variant="label">{t("planB")}</Txt>
                    {s.planB.map((text, i) => (
                      <Txt key={i} color={colors.secondary}>
                        {L(text)}
                      </Txt>
                    ))}
                  </View>
                )}
              </>
            )}
          </Surface>
        </Section>
      )}
      <Section title={t("sources")}>
        <Txt variant="caption" color={colors.secondary}>
          {t("reviewed")}: {s.lastUpdated}
        </Txt>
        {s.sources.map((source) => (
          <Tap
            key={source.url}
            label={L(source.label)}
            onPress={() => openURL(source.url)}
            style={{ minHeight: 44, justifyContent: "center" }}
          >
            <Txt color={colors.accent}>{L(source.label)}</Txt>
          </Tap>
        ))}
        {s.disclaimer && (
          <Txt variant="caption" color={colors.secondary}>
            {L(s.disclaimer)}
          </Txt>
        )}
      </Section>
      <Button
        label={t("askGuide")}
        icon="chat"
        secondary
        onPress={() => {
          setGuideId(id);
          router.navigate("/(tabs)/chat");
        }}
      />
    </Page>
  );
}
