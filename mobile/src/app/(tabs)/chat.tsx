import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { fetch as nativeFetch } from "expo/fetch";
import { useApp, Message } from "../../state";
import {
  buildInstructions,
  offlineExample,
  relevantScenes,
} from "../../ai/context";
import { streamAnswer, errorMessage, AIError } from "../../ai/client";
import { providers } from "../../ai/providers";
import { content } from "../../content";
import {
  Page,
  Txt,
  Icon,
  Tap,
  IconButton,
  Notice,
  RichText,
  Surface,
  confirmAction,
} from "../../ui";
let messageSequence = 0;
function nextMessageId() {
  return `message-${++messageSequence}`;
}
export default function Chat() {
  const { sessionEpoch } = useApp();
  return <ChatSession key={sessionEpoch} />;
}
function ChatSession() {
  const {
    t,
    colors,
    prefs,
    config,
    messages,
    setMessages,
    tripContext,
    abortRef,
    guideId,
    L,
  } = useApp();
  const [question, setQuestion] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const list = useRef<FlatList<Message>>(null),
    sending = useRef(false);
  const send = async (input = question) => {
    const query = input.trim();
    if (!query || sending.current) return;
    if (query.length > 4000) {
      setError(
        prefs.language === "zh"
          ? "问题请控制在 4000 字以内。"
          : "Keep your question under 4,000 characters.",
      );
      return;
    }
    Keyboard.dismiss();
    setQuestion("");
    setError("");
    sending.current = true;
    setBusy(true);
    const uid = nextMessageId(),
      aid = nextMessageId();
    const selected = tripContext.shareContext ? guideId : undefined;
    const related = relevantScenes(query, selected)[0]?.id;
    const prior = messages
      .filter((m) => m.status === "complete" && !m.example)
      .map((m) => ({ role: m.role, content: m.content }));
    setMessages((old) => [
      ...old,
      {
        id: uid,
        role: "user",
        content: query,
        status: "complete",
        example: !config,
      },
      {
        id: aid,
        role: "assistant",
        content: "",
        status: "pending",
        example: !config,
        guideId: related,
      },
    ]);
    const control = new AbortController();
    abortRef.current = control;
    const change = (text: string) =>
      {
        if (abortRef.current !== control) return;
        setMessages((old) => old.map((m) => (m.id === aid ? { ...m, content: text } : m)));
      };
    try {
      if (config) {
        await streamAnswer(
          config,
          buildInstructions(query, tripContext),
          [...prior, { role: "user", content: query }],
          {
            signal: control.signal,
            onText: change,
            fetcher: nativeFetch as typeof globalThis.fetch,
          },
        );
      } else {
        const sample = offlineExample(query, tripContext);
        change(sample.text);
        setMessages((old) =>
          old.map((m) =>
            m.id === aid ? { ...m, guideId: sample.guideId } : m,
          ),
        );
      }
      setMessages((old) =>
        old.map((m) => (m.id === aid ? { ...m, status: "complete" } : m)),
      );
    } catch (e) {
      if (abortRef.current !== control) return;
      const stopped = e instanceof AIError && e.kind === "cancelled";
      setMessages((old) =>
        old.map((m) =>
          m.id === aid ? { ...m, status: stopped ? "stopped" : "error" } : m,
        ),
      );
      setError(errorMessage(e, prefs.language === "zh"));
      if (!stopped) setQuestion(query);
    } finally {
      if (abortRef.current === control) {
        sending.current = false;
        setBusy(false);
        abortRef.current = null;
      }
    }
  };
  const clear = () =>
    confirmAction(
      t("newChat"),
      t("newChatBody"),
      () => {
        abortRef.current?.abort();
        setMessages([]);
        setError("");
        setQuestion("");
      },
      t,
    );
  return (
    <Page scroll={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View
          style={{
            paddingHorizontal: 22,
            paddingTop: 2,
            paddingBottom: 5,
            gap: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Tap
              label={t("configure")}
              onPress={() => router.push("/ai-config")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 8,
              }}
            >
              <Icon name="chat" size={16} />
              <Txt variant="label" color={colors.accent}>
                {config ? providers[config.provider].name : t("exampleMode")}
              </Txt>
              <Icon name="next" size={14} />
            </Tap>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <IconButton
                name="info"
                label={t("context")}
                onPress={() => router.push("/context")}
              />
              <IconButton name="plus" label={t("newChat")} onPress={clear} />
            </View>
          </View>
          {config && (
            <Txt variant="caption" color={colors.secondary}>
              {config.model}
            </Txt>
          )}
        </View>
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(m) => m.id}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            list.current?.scrollToEnd({ animated: false })
          }
          contentContainerStyle={{
            padding: 20,
            paddingTop: 4,
            paddingBottom: 12,
            flexGrow: 1,
            gap: 15,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ paddingTop: 12, gap: 14 }}>
              <View style={{ alignItems: "center", gap: 8, paddingVertical: 8 }}>
                <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" }}>
                  <Icon name="chat" size={21} />
                </View>
                <Txt style={{ fontSize: 22, lineHeight: 28, fontWeight: "600", letterSpacing: -0.4, textAlign: "center" }}>{t("aiTitle")}</Txt>
                <Txt variant="caption" color={colors.secondary} style={{ textAlign: "center", maxWidth: 270 }}>{t("aiBody")}</Txt>
              </View>
              {!config && (
                <Surface style={{ padding: 12, gap: 9 }}>
                  <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                    <Icon name="info" size={15} />
                    <Txt variant="caption" color={colors.secondary} style={{ flex: 1 }}>{t("exampleNote")}</Txt>
                  </View>
                  <Tap label={t("configure")} onPress={() => router.push("/ai-config")} style={{ minHeight: 44, paddingHorizontal: 13, borderRadius: 13, backgroundColor: colors.accent, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Txt variant="label" color={colors.onAccent}>{t("configure")}</Txt>
                    <Icon name="settings" size={18} color={colors.onAccent} />
                  </Tap>
                </Surface>
              )}
              <Surface>
                {(["promptPay", "promptTaxi", "promptTrain"] as const).map((key, i) => (
                  <Tap key={key} label={t(key)} onPress={() => { void send(t(key)); }} style={{ minHeight: 44, paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: i === 2 ? 0 : 0.5, borderBottomColor: colors.line, flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Txt style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>{t(key)}</Txt>
                    <Icon name="arrow" size={16} />
                  </Tap>
                ))}
              </Surface>
            </View>
          }
          renderItem={({ item }) =>
            item.role === "user" ? (
              <View
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "89%",
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  borderRadius: 22,
                  borderBottomRightRadius: 7,
                  backgroundColor: colors.accent,
                }}
              >
                <Txt color={colors.onAccent} selectable>
                  {item.content}
                </Txt>
              </View>
            ) : (
              <View style={{ gap: 10, alignSelf: "stretch" }}>
                <View
                  style={{ flexDirection: "row", gap: 7, alignItems: "center" }}
                >
                  <Icon name="chat" size={16} />
                  <Txt variant="caption" color={colors.secondary}>
                    {item.example ? t("exampleMode") : "ChinaHand"}
                  </Txt>
                </View>
                {item.content ? (
                  <RichText text={item.content} />
                ) : item.status === "pending" ? (
                  <View
                    accessibilityLabel={t("thinking")}
                    style={{ gap: 9, paddingVertical: 6 }}
                  >
                    <Txt variant="caption" color={colors.secondary}>
                      {t("thinking")}
                    </Txt>
                    {[0.9, 0.74, 0.5].map((width, i) => (
                      <View
                        key={i}
                        style={{
                          height: 12,
                          width: `${width * 100}%`,
                          borderRadius: 6,
                          backgroundColor: colors.raised,
                        }}
                      />
                    ))}
                  </View>
                ) : (
                  <Txt variant="caption" color={colors.secondary}>
                    {item.status === "stopped" ? t("stop") : t("noResults")}
                  </Txt>
                )}
                {item.guideId && item.status !== "pending" && (
                  <Tap
                    label={t("guides")}
                    onPress={() => router.push(`/guide/${item.guideId}`)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 7,
                      paddingVertical: 10,
                    }}
                  >
                    <Icon name="guides" size={16} />
                    <Txt variant="caption" color={colors.accent}>
                      {t("guides")}:{" "}
                      {L(
                        content.scenes.find((s) => s.id === item.guideId)
                          ?.title,
                      )}
                    </Txt>
                    <Icon name="next" size={14} />
                  </Tap>
                )}
                {item.example && (
                  <Txt variant="caption" color={colors.secondary}>
                    {t("exampleNote")}
                  </Txt>
                )}
              </View>
            )
          }
        />
        <View
          style={{
            paddingHorizontal: 18,
            paddingTop: 10,
            paddingBottom: 10,
            borderTopWidth: 0.5,
            borderTopColor: colors.line,
            backgroundColor: colors.surface,
          }}
        >
          {Boolean(error) && <Notice text={error} danger />}
          <View
            style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }}
          >
            <TextInput
              accessibilityLabel={t("composer")}
              multiline
              value={question}
              onChangeText={setQuestion}
              placeholder={t("composer")}
              placeholderTextColor={colors.placeholder}
              maxLength={4000}
              editable={!busy}
              style={{
                flex: 1,
                minHeight: 44,
                maxHeight: 112,
                padding: 11,
                paddingTop: 11,
                borderRadius: 20,
                backgroundColor: colors.raised,
                color: colors.ink,
                fontSize: 15,
                lineHeight: 21,
              }}
            />
            <Tap
              label={busy ? t("stop") : t("send")}
              disabled={!busy && !question.trim()}
              onPress={() => (busy ? abortRef.current?.abort() : void send())}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.accent,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name={busy ? "stop" : "send"}
                size={19}
                color={colors.onAccent}
                weight="fill"
              />
            </Tap>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}
