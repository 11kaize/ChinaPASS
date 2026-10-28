import { uiText } from "../../locale-ui";
import { TextInput } from "../../localized-input";
import { artwork } from "../../artwork";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Crypto from "expo-crypto";
import {
  View,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { router, Href, useFocusEffect, useIsFocused } from "expo-router";
import { fetch as nativeFetch } from "expo/fetch";
import { useApp, Message } from "../../state";
import { content } from "../../content";
import { buildInstructions } from "../../ai/context";
import { presetKeys, presetReply, type PresetKey } from "../../ai/presets";
import { streamAnswer, errorMessage, AIError } from "../../ai/client";
import { providers } from "../../ai/providers";
import { useProduct } from "../../product-state";
import { plans, remainingQuestions } from "../../domain/membership";
import { parsePageActions } from "../../domain/navigation";
import {
  Page,
  Txt,
  Icon,
  Tap,
  IconButton,
  Notice,
  RichText,
  Surface,
  Button,
  confirmAction,
} from "../../ui";
function nextMessageId() {
  return Crypto.randomUUID();
}
export default function Chat() {
  const { sessionEpoch } = useApp();
  return <ChatSession key={sessionEpoch} />;
}
function ChatSession() {
  const {
    t,
    L,
    colors,
    prefs,
    config,
    messages,
    setMessages,
    tripContext,
    abortRef,
  } = useApp();
  const { tier, usage, reserve, refund } = useProduct();
  const [question, setQuestion] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => setError(""), [prefs.language]);
  const list = useRef<FlatList<Message>>(null),
    sending = useRef(false);
  const focused = useIsFocused();
  const newestFirst = useMemo(() => [...messages].reverse(), [messages]);
  // Keep the most recent reply mounted when returning from an action page.
  useFocusEffect(
    useCallback(() => {
      const frame = requestAnimationFrame(() =>
        list.current?.scrollToOffset({ offset: 0, animated: false }),
      );
      return () => cancelAnimationFrame(frame);
    }, []),
  );
  const send = async (input = question) => {
    const query = input.trim();
    if (!query || sending.current) return;
    if (!config) {
      setError(t("notConnected"));
      return;
    }
    if (query.length > 4000) {
      setError(
        prefs.language === "zh"
          ? "问题请控制在 4000 字以内。"
          : "Keep your question under 4,000 characters.",
      );
      return;
    }
    if (config && remainingQuestions(tier, usage) === 0) {
      setError(
        prefs.language === "zh"
          ? "本月 AI 额度已用完，请在个人中心查看会员。"
          : "Monthly AI allowance reached. See membership in Me.",
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
    if (config) {
      try {
        reserve(aid);
      } catch (e) {
        setError((e as Error).message);
        setBusy(false);
        sending.current = false;
        return;
      }
    }
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
        example: false,
      },
      {
        id: aid,
        role: "assistant",
        content: "",
        status: "pending",
        example: false,
        pageActionsEnabled: plans[tier].pageActions,
      },
    ]);
    const control = new AbortController();
    abortRef.current = control;
    const change = (text: string) => {
      if (abortRef.current !== control) return;
      setMessages((old) =>
        old.map((m) => (m.id === aid ? { ...m, content: text } : m)),
      );
    };
    try {
      await streamAnswer(
        config,
        buildInstructions(query, tripContext, plans[tier].pageActions),
        [...prior, { role: "user", content: query }],
        {
          signal: control.signal,
          onText: change,
          fetcher: nativeFetch as typeof globalThis.fetch,
        },
      );
      setMessages((old) =>
        old.map((m) => (m.id === aid ? { ...m, status: "complete" } : m)),
      );
    } catch (e) {
      if (config) refund(aid);
      if (abortRef.current !== control) return;
      const stopped = e instanceof AIError && e.kind === "cancelled";
      setMessages((old) =>
        old.map((m) =>
          m.id === aid
            ? {
                ...m,
                status: stopped ? "stopped" : "error",
                failure: {
                  kind: e instanceof AIError ? e.kind : "network",
                  status: e instanceof AIError ? e.status : undefined,
                },
              }
            : m,
        ),
      );
      setError(errorMessage(e, prefs.language));
      if (!stopped) setQuestion(query);
    } finally {
      if (abortRef.current === control) {
        sending.current = false;
        setBusy(false);
        abortRef.current = null;
      }
    }
  };
  const showPreset = (key: PresetKey) => {
    if (sending.current) return;
    const sample = presetReply(key, prefs.language);
    setError("");
    setMessages((old) => [
      ...old,
      {
        id: nextMessageId(),
        role: "user",
        content: t(key),
        status: "complete",
        example: true,
      },
      {
        id: nextMessageId(),
        role: "assistant",
        content: sample.text,
        guideId: sample.guideId,
        status: "complete",
        example: true,
      },
    ]);
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
                {config
                  ? providers[config.provider].name
                  : t("notConnectedTitle")}
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
          data={newestFirst}
          inverted={messages.length > 0}
          keyExtractor={(m) => m.id}
          keyboardShouldPersistTaps="handled"
          onLayout={() => {
            if (focused)
              list.current?.scrollToOffset({ offset: 0, animated: false });
          }}
          onContentSizeChange={() => {
            if (focused)
              list.current?.scrollToOffset({ offset: 0, animated: false });
          }}
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
              <View
                style={{ alignItems: "center", gap: 8, paddingVertical: 8 }}
              >
                <Image
                  source={artwork.assistant}
                  accessibilityLabel={uiText(
                    prefs.language,
                    "ChinaBuddy AI companion",
                  )}
                  style={{ width: 76, height: 68 }}
                  resizeMode="contain"
                />
                <Txt
                  style={{
                    fontSize: 22,
                    lineHeight: 28,
                    fontWeight: "600",
                    letterSpacing: -0.4,
                    textAlign: "center",
                  }}
                >
                  {t("aiTitle")}
                </Txt>
                <Txt
                  variant="caption"
                  color={colors.secondary}
                  style={{ textAlign: "center", maxWidth: 270 }}
                >
                  {t("aiBody")}
                </Txt>
              </View>
              {!config && (
                <Surface style={{ padding: 12, gap: 9 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <Icon name="info" size={15} />
                    <Txt
                      variant="caption"
                      color={colors.secondary}
                      style={{ flex: 1 }}
                    >
                      {t("exampleNote")}
                    </Txt>
                  </View>
                  <Tap
                    label={t("configure")}
                    onPress={() => router.push("/ai-config")}
                    style={{
                      minHeight: 44,
                      paddingHorizontal: 13,
                      borderRadius: 13,
                      backgroundColor: colors.accent,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Txt variant="label" color={colors.onAccent}>
                      {t("configure")}
                    </Txt>
                    <Icon name="settings" size={18} color={colors.onAccent} />
                  </Tap>
                </Surface>
              )}
              <Surface>
                {presetKeys.map((key, i) => (
                  <Tap
                    key={key}
                    label={t(key)}
                    onPress={() => {
                      if (config) void send(t(key));
                      else showPreset(key);
                    }}
                    style={{
                      minHeight: 44,
                      paddingVertical: 11,
                      paddingHorizontal: 14,
                      borderBottomWidth: i === 2 ? 0 : 0.5,
                      borderBottomColor: colors.line,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Txt style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>
                      {t(key)}
                    </Txt>
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
                <Txt verbatim color={colors.onAccent} selectable>
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
                    {item.example ? t("exampleMode") : "ChinaBuddy"}
                  </Txt>
                </View>
                {item.content ? (
                  <RichText
                    text={parsePageActions(item.content).text.replace(
                      /\[\[chinabuddy:[^\]]*$/,
                      "",
                    )}
                  />
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
                    {item.failure
                      ? errorMessage(
                          new AIError(item.failure.kind, item.failure.status),
                          prefs.language,
                        )
                      : item.status === "stopped"
                        ? t("stop")
                        : t("noResults")}
                  </Txt>
                )}
                {!item.example &&
                  item.pageActionsEnabled &&
                  plans[tier].pageActions &&
                  item.status === "complete" &&
                  parsePageActions(item.content).actions.map((action) => (
                    <Tap
                      key={action.id}
                      label={prefs.language === "zh" ? action.zh : action.title}
                      onPress={() => router.push(action.path as Href)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        paddingVertical: 13,
                        paddingHorizontal: 15,
                        borderRadius: 18,
                        backgroundColor: colors.accentSoft,
                        borderWidth: 1,
                        borderColor: colors.line,
                      }}
                    >
                      <Icon
                        name={
                          action.id === "emergency" ? "emergency" : "guides"
                        }
                        size={18}
                      />
                      <View style={{ flex: 1, gap: 3 }}>
                        <Txt variant="label">
                          {prefs.language === "zh" ? action.zh : action.title}
                        </Txt>
                        <Txt variant="caption" color={colors.secondary}>
                          {prefs.language === "zh"
                            ? "在 ChinaBuddy 中打开"
                            : "Open in ChinaBuddy"}
                        </Txt>
                      </View>
                      <Icon name="arrow" size={17} />
                    </Tap>
                  ))}
                {item.example && (
                  <View style={{ gap: 10 }}>
                    <Txt variant="caption" color={colors.secondary}>
                      {t("exampleNote")}
                    </Txt>
                    {item.guideId && (
                      <Button
                        secondary
                        icon="guides"
                        label={
                          L(
                            content.scenes.find(
                              (scene) => scene.id === item.guideId,
                            )?.title,
                          ) || t("guides")
                        }
                        onPress={() =>
                          router.push({
                            pathname: "/guide/[id]",
                            params: { id: item.guideId! },
                          })
                        }
                      />
                    )}
                  </View>
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
                animated
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
