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
  Button,
  RichText,
  Heading,
  Surface,
  confirmAction,
} from "../../ui";
let messageSequence = 0;
function nextMessageId() {
  return `message-${++messageSequence}`;
}
export default function Chat() {
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
      setMessages((old) =>
        old.map((m) => (m.id === aid ? { ...m, content: text } : m)),
      );
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
      const stopped = e instanceof AIError && e.kind === "cancelled";
      setMessages((old) =>
        old.map((m) =>
          m.id === aid ? { ...m, status: stopped ? "stopped" : "error" } : m,
        ),
      );
      setError(errorMessage(e, prefs.language === "zh"));
      if (!stopped) setQuestion(query);
    } finally {
      sending.current = false;
      setBusy(false);
      if (abortRef.current === control) abortRef.current = null;
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
            paddingTop: 7,
            paddingBottom: 12,
            gap: 10,
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
              <Icon name="chat" size={19} />
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
            padding: 22,
            paddingTop: 4,
            paddingBottom: 20,
            flexGrow: 1,
            gap: 19,
          }}
          ListEmptyComponent={
            <View style={{ paddingTop: 12, gap: 16 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 20,
                  backgroundColor: colors.accentSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="chat" size={30} />
              </View>
              <Heading title={t("aiTitle")} body={t("aiBody")} />
              {!config && <Notice text={t("exampleNote")} />}
              {!config && (
                <Button
                  label={t("configure")}
                  icon="settings"
                  onPress={() => router.push("/ai-config")}
                />
              )}
              <Surface>
                {(["promptPay", "promptTaxi", "promptTrain"] as const).map(
                  (key, i) => (
                    <Tap
                      key={key}
                      label={t(key)}
                      onPress={() => {
                        void send(t(key));
                      }}
                      style={{
                        padding: 19,
                        borderBottomWidth: i === 2 ? 0 : 0.5,
                        borderBottomColor: colors.line,
                        flexDirection: "row",
                        gap: 12,
                      }}
                    >
                      <Txt style={{ flex: 1 }}>{t(key)}</Txt>
                      <Icon name="arrow" size={19} />
                    </Tap>
                  ),
                )}
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
                minHeight: 50,
                maxHeight: 140,
                padding: 14,
                paddingTop: 14,
                borderRadius: 20,
                backgroundColor: colors.raised,
                color: colors.ink,
                fontSize: 16,
                lineHeight: 23,
              }}
            />
            <Tap
              label={busy ? t("stop") : t("send")}
              disabled={!busy && !question.trim()}
              onPress={() => (busy ? abortRef.current?.abort() : void send())}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.accent,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name={busy ? "stop" : "send"}
                size={23}
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
