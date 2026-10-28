import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../state";
import { content, searchPhrases } from "../content";
import { savedPlaces, placeLines } from "../places";
import { generalReplies, yesNoReplies, talkCards, cnyCents } from "../talk";
import {
  Page,
  Heading,
  Search,
  Surface,
  Row,
  Txt,
  Tap,
  Icon,
  Button,
  Chips,
  Field,
  Notice,
} from "../ui";
export default function Talk() {
  const params = useLocalSearchParams<{ id?: string; kind?: string }>();
  const { prefs, colors, L } = useApp();
  const bank = talkCards(prefs);
  const place =
    params.kind === "place"
      ? savedPlaces(prefs).find((item) => item.id === params.id)
      : params.kind === "address" && prefs.address.address
        ? prefs.address
        : null;
  const port =
    params.kind === "port"
      ? content.ports.find((item) => item.id === params.id)
      : null;
  const scene =
    params.kind === "scene"
      ? content.scenes.find((item) => item.id === params.id)
      : null;
  const seeded = place
    ? {
        zh: `请带我去：\n${placeLines(place)}`,
        en: `Please take me to ${place.name || "this address"}.`,
      }
    : port
      ? {
          zh: `请带我去：${port.zh}`,
          en: `Please take me to ${port.city || ""} ${port.iata || port.zh}.`,
        }
      : scene?.showCard
        ? { zh: scene.showCard.lines.join("\n"), en: L(scene.showCard.title) }
        : bank.find((item) => item.id === params.id);
  const [question, setQuestion] = useState<{
    zh: string;
    en: string;
    custom?: boolean;
  } | null>(seeded || null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState(
    /多少钱|价格|费用|票价|金额/.test(seeded?.zh || "") ? "amount" : "quick",
  );
  const [amount, setAmount] = useState("");
  const [answer, setAnswer] = useState<{ zh: string; en: string } | null>(null);
  const zh = prefs.language === "zh";
  const cents = cnyCents(amount);
  const choose = (value: { zh: string; en: string; custom?: boolean }) => {
    setQuestion(value);
    setAnswer(null);
    setAmount("");
    setMode(/多少钱|价格|费用|票价|金额/.test(value.zh) ? "amount" : "quick");
  };
  const popular = [
    "可以刷卡吗",
    "可以支付宝吗",
    "多少钱",
    "请带我去",
    "厕所",
    "请帮我",
  ];
  const suggestions = query.trim()
    ? searchPhrases(query, bank).slice(0, 40)
    : [
        ...bank
          .filter((card) => popular.some((key) => card.zh.includes(key)))
          .slice(0, 8),
        ...bank
          .filter((card) => !popular.some((key) => card.zh.includes(key)))
          .slice(0, 8),
      ];
  return (
    <Page back title={zh ? "双向沟通板" : "Two-way talk"}>
      {!question ? (
        <>
          <Heading
            title={
              zh
                ? "你出示中文，对方点选答复。"
                : "Show your question. Let them reply."
            }
            body={
              zh
                ? "固定中英短语与金额输入，离线可用，不需要 AI。"
                : "Preset Chinese–English replies and CNY amounts. Works offline, without AI."
            }
          />
          <Search
            label={zh ? "选择要说的话" : "Choose what you want to say"}
            value={query}
            onChange={setQuery}
          />
          <Surface>
            {suggestions.map((card, index) => (
              <Row
                key={card.id}
                title={L(card)}
                icon="chat"
                last={index === suggestions.length - 1}
                onPress={() => choose(card)}
              />
            ))}
          </Surface>
          {!suggestions.length && (
            <Notice
              text={
                zh
                  ? "没有匹配短语。可换个关键词，或先在卡片页自制一张中文卡。"
                  : "No matching phrase. Try another keyword or create a Chinese card first."
              }
            />
          )}
          <Button
            secondary
            label={zh ? "打开地址钱包" : "Open address wallet"}
            onPress={() => router.push("/address")}
          />
        </>
      ) : (
        <>
          <Surface style={{ padding: 20, gap: 12, marginBottom: 18 }}>
            <Txt variant="caption" color={colors.secondary}>
              {zh
                ? "把这一屏出示给对方"
                : "Show this screen to the other person"}
            </Txt>
            <Txt
              verbatim
              selectable
              style={{ fontSize: 28, lineHeight: 39, fontWeight: "600" }}
            >
              {question.zh}
            </Txt>
            <Txt
              verbatim={question.custom}
              variant="caption"
              color={colors.secondary}
            >
              {question.en}
            </Txt>
          </Surface>
          {answer ? (
            <Surface style={{ padding: 22, gap: 15, marginBottom: 18 }}>
              <View accessibilityLiveRegion="polite">
                <Txt variant="caption" color={colors.accent}>
                  {zh ? "对方选择的答复" : "Their selected reply"}
                </Txt>
                <Txt
                  style={{
                    fontSize: 29,
                    lineHeight: 38,
                    fontWeight: "700",
                    marginTop: 12,
                  }}
                >
                  {answer.en}
                </Txt>
                <Txt
                  verbatim
                  style={{ fontSize: 22, lineHeight: 30, marginTop: 7 }}
                >
                  {answer.zh}
                </Txt>
              </View>
              <Button
                secondary
                label={zh ? "重新选择答复" : "Choose another reply"}
                onPress={() => setAnswer(null)}
              />
            </Surface>
          ) : (
            <>
              <Txt variant="subheading" style={{ marginBottom: 8 }}>
                {L({
                  en: "Please choose a reply",
                  zh: "请您选择回答",
                  ja: "返答を選んでください",
                  ko: "답변을 선택해 주세요",
                })}
              </Txt>
              <Txt
                variant="caption"
                color={colors.secondary}
                style={{ marginBottom: 14 }}
              >
                {zh
                  ? "可点选下方答复，或输入人民币金额。"
                  : "Ask them to choose a reply or enter a CNY amount."}
              </Txt>
              <Chips
                value={mode}
                onChange={setMode}
                items={[
                  {
                    id: "quick",
                    label: L({
                      en: "Quick replies",
                      zh: "快捷回答",
                      ja: "定型の返答",
                      ko: "고정 답변",
                    }),
                  },
                  {
                    id: "amount",
                    label: L({
                      en: "Amount in RMB",
                      zh: "人民币金额",
                      ja: "人民元の金額",
                      ko: "위안화 금액",
                    }),
                  },
                ]}
              />
              {mode === "amount" ? (
                <Surface style={{ padding: 18, gap: 8 }}>
                  <Field
                    label={L({
                      en: "Amount in RMB",
                      zh: "人民币金额",
                      ja: "人民元の金額",
                      ko: "위안화 금액",
                    })}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    maxLength={9}
                    placeholder="80.00"
                    hint={
                      zh
                        ? "填写非负金额，最多 6 位整数、2 位小数，不加逗号。"
                        : "Enter a non-negative amount, up to 6 whole digits and 2 decimals, without commas."
                    }
                    error={
                      amount && cents === null
                        ? zh
                          ? "请输入有效金额，例如 80.50。"
                          : "Enter a valid amount, for example 80.50."
                        : undefined
                    }
                  />
                  <Button
                    label={L({
                      en: "Confirm amount",
                      zh: "确认金额",
                      ja: "金額を確定",
                      ko: "금액 확인",
                    })}
                    disabled={cents === null}
                    onPress={() => {
                      if (cents !== null)
                        setAnswer({
                          zh: `人民币 ${(cents / 100).toFixed(2)} 元`,
                          en: `¥${(cents / 100).toFixed(2)} CNY`,
                        });
                    }}
                  />
                </Surface>
              ) : (
                <View style={{ gap: 9 }}>
                  {[...yesNoReplies(question.zh), ...generalReplies].map(
                    (reply) => (
                      <Tap
                        key={reply.en}
                        label={`${reply.zh} · ${reply.en}`}
                        onPress={() => setAnswer(reply)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 13,
                          padding: 17,
                          minHeight: 72,
                          borderRadius: 18,
                          backgroundColor: colors.raised,
                        }}
                      >
                        <Icon name={reply.icon} size={21} />
                        <View style={{ flex: 1, gap: 4 }}>
                          <Txt
                            verbatim
                            style={{
                              fontSize: 21,
                              lineHeight: 28,
                              fontWeight: "600",
                            }}
                          >
                            {reply.zh}
                          </Txt>
                          <Txt variant="caption" color={colors.secondary}>
                            {reply.en}
                          </Txt>
                        </View>
                        <Icon name="next" size={15} />
                      </Tap>
                    ),
                  )}
                </View>
              )}
            </>
          )}
          <View style={{ height: 18 }} />
          <Button
            secondary
            label={zh ? "换一句话" : "Choose another question"}
            onPress={() => {
              setQuestion(null);
              setAnswer(null);
              setQuery("");
            }}
          />
          <Txt
            variant="caption"
            color={colors.secondary}
            style={{ marginTop: 16 }}
          >
            {zh
              ? "这是对方手动选择的固定答复，不是实时翻译；金额只是对方输入的数字，不会发起支付。"
              : "These are manually selected preset replies, not live translation. Amounts are entered by the other person; no payment is made."}
          </Txt>
        </>
      )}
    </Page>
  );
}
