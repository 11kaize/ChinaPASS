import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../../state";
import { content } from "../../content";
import { ServiceActions } from "../../service-actions";
import {
  Page,
  Heading,
  Surface,
  Section,
  Txt,
  Icon,
  Tap,
  Button,
  Notice,
  RichText,
  openURL,
} from "../../ui";
export default function Guide() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, L, colors, prefs, update, setGuideId } = useApp();
  const [expanded, setExpanded] = useState(0);
  const scene = content.scenes.find((s) => s.id === id);
  const short = content.shortGuides.find((s) => s.id === id);
  useEffect(() => {
    setGuideId(id);
  }, [id, setGuideId]);
  if (!scene && !short)
    return (
      <Page back>
        <Heading title={t("guideUnavailable")} />
      </Page>
    );
  if (short)
    return (
      <Page back>
        <Heading title={short.title} body={short.summary} />
        <Surface style={{ padding: 22, gap: 24 }}>
          {short.steps.map(([title, body]) => (
            <View key={title} style={{ gap: 8 }}>
              <Txt variant="subheading">{title}</Txt>
              <Txt color={colors.secondary}>{body}</Txt>
            </View>
          ))}
        </Surface>
        <View style={{ marginTop: 24 }}>
          <Button
            label={short.source.label}
            secondary
            onPress={() => openURL(short.source.url)}
          />
        </View>
      </Page>
    );
  const s = scene!;
  const done = prefs.steps[id] || [];
  const zhMissing =
    prefs.language === "zh" && (typeof s.task === "string" || !s.task.zh);
  return (
    <Page back>
      <Heading title={L(s.title)} body={L(s.subtitle)} />
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
        <Txt variant="caption" color={colors.accent}>
          {done.length}/{s.steps.length} {t("completed")}
        </Txt>
        <Txt variant="caption" color={colors.secondary}>
          {L(s.eta)}
        </Txt>
      </View>
      {zhMissing && <Notice text={t("englishFallback")} />}
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
                      <Icon name="checked" size={28} />
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
      <Section title={t("planB")}>
        <Surface style={{ padding: 20, gap: 16 }}>
          {s.planB.map((text, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 12 }}>
              <Icon name="arrow" size={19} />
              <Txt style={{ flex: 1 }} color={colors.secondary}>
                {L(text)}
              </Txt>
            </View>
          ))}
        </Surface>
      </Section>
      <Section title={t("trouble")}>
        <Surface style={{ padding: 20, gap: 22 }}>
          {s.trouble.map((item, i) => (
            <View key={i} style={{ gap: 8 }}>
              <Txt variant="label">{L(item.p)}</Txt>
              <Txt color={colors.secondary}>{L(item.a)}</Txt>
            </View>
          ))}
        </Surface>
      </Section>
      {s.mistakes?.length > 0 && (
        <Section title={t("mistakes")}>
          <Surface style={{ padding: 20, gap: 20 }}>
            {s.mistakes.map((item, i) => (
              <View key={i} style={{ gap: 5 }}>
                <Txt variant="label">{L(item.m)}</Txt>
                <Txt color={colors.secondary}>{L(item.d)}</Txt>
              </View>
            ))}
          </Surface>
        </Section>
      )}
      <Section title={t("sources")}>
        <Txt variant="caption" color={colors.secondary}>
          {t("reviewed")}: {s.lastUpdated}
        </Txt>
        {!s.actions.length &&
          s.sources.map((source) => (
            <Tap
              key={source.url}
              label={source.label}
              onPress={() => openURL(source.url)}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <Txt color={colors.accent}>{source.label}</Txt>
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
