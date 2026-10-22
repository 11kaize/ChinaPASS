import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../state";
import { useProduct } from "../product-state";
import { plans } from "../domain/membership";
import type { Palette } from "../theme";
import {
  credentialLike,
  TranslationError,
  translateShortText,
  translationService,
  utf8Bytes,
} from "../translation";
import {
  Page,
  Txt,
  Icon,
  Tap,
  Button,
  Surface,
  Notice,
  Row,
  openURL,
} from "../ui";

type Side = "en" | "zh";
type Draft = { side: Side; text: string; revision: number };
type Phase = "idle" | "waiting" | "loading" | "done";

function TranslationPane({
  side,
  value,
  onChange,
  receiving,
  phase,
  source,
  colors,
  dark,
}: {
  side: Side;
  value: string;
  onChange: (value: string) => void;
  receiving: boolean;
  phase: Phase;
  source: boolean;
  colors: Palette;
  dark: boolean;
}) {
  const chinese = side === "zh";
  const working = receiving && (phase === "waiting" || phase === "loading");
  return (
    <View
      testID={chinese ? "translation-opposite-panel" : "translation-self-panel"}
      style={[
        styles.pane,
        {
          backgroundColor: chinese ? colors.accentSoft : colors.surface,
          transform: chinese ? [{ rotate: "180deg" }] : [],
        },
      ]}
    >
      <View style={styles.paneHeader}>
        <View style={styles.language}>
          <Icon name={chinese ? "community" : "profile"} size={17} />
          <Txt variant="label">{chinese ? "中文" : "English"}</Txt>
        </View>
        <Txt variant="caption" color={colors.secondary}>
          {chinese ? "给对面的人" : "Your side"}
        </Txt>
      </View>
      <TextInput
        accessibilityLabel={
          chinese ? "Chinese face-to-face text" : "English face-to-face text"
        }
        value={value}
        onChangeText={onChange}
        placeholder={
          working
            ? chinese
              ? "正在翻译…"
              : "Translating…"
            : chinese
              ? "在此输入中文…"
              : "Type in English…"
        }
        placeholderTextColor={colors.placeholder}
        selectionColor={colors.accent}
        multiline
        textAlignVertical="top"
        maxLength={500}
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        underlineColorAndroid="transparent"
        style={[
          styles.input,
          { color: colors.ink, backgroundColor: "transparent" },
        ]}
      />
      <View style={styles.paneFooter} accessibilityLiveRegion="polite">
        <View style={[styles.language, { flex: 1 }]}>
          {working ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Icon
              name={source ? "edit" : value ? "checks" : "cards"}
              size={14}
            />
          )}
          <Txt variant="caption" color={colors.secondary}>
            {working
              ? chinese
                ? "正在同步英文"
                : "Syncing Chinese"
              : source
                ? chinese
                  ? "中文原文"
                  : "English original"
                : value
                  ? chinese
                    ? "英文译文 · 可编辑"
                    : "From Chinese · editable"
                  : chinese
                    ? "中文 ↔ English"
                    : "English ↔ 中文"}
          </Txt>
        </View>
        <Txt
          variant="caption"
          color={
            utf8Bytes(value) > 500 && source ? colors.danger : colors.secondary
          }
        >
          {source ? `${utf8Bytes(value)} / 500 B` : ""}
        </Txt>
      </View>
      {dark && (
        <View
          pointerEvents="none"
          style={[styles.paneLine, { backgroundColor: colors.line }]}
        />
      )}
    </View>
  );
}

function TranslationSession({ entitled }: { entitled: boolean }) {
  const { prefs, colors, isDark, online } = useApp();
  const insets = useSafeAreaInsets();
  const zh = prefs.language === "zh";
  const text = (cn: string, en: string) => (zh ? cn : en);
  const [started, setStarted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [values, setValues] = useState({ en: "", zh: "" });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const revision = useRef(0);
  const control = useRef<AbortController | null>(null);
  const pause = useCallback(() => {
    revision.current++;
    control.current?.abort();
    setEnabled(false);
    setPhase("idle");
  }, []);

  useFocusEffect(
    useCallback(() => {
      const listener = AppState.addEventListener("change", (state) => {
        if (state === "background") pause();
      });
      const hide = () => {
        if (document.hidden) pause();
      };
      if (Platform.OS === "web")
        document.addEventListener("visibilitychange", hide);
      return () => {
        pause();
        listener.remove();
        if (Platform.OS === "web")
          document.removeEventListener("visibilitychange", hide);
      };
    }, [pause]),
  );

  useEffect(() => {
    if (!entitled || !enabled || !draft?.text.trim()) return;
    const currentDraft = draft;
    if (
      utf8Bytes(currentDraft.text.trim()) > 500 ||
      credentialLike(currentDraft.text)
    )
      return;
    const request = new AbortController();
    const version = revision.current;
    control.current = request;
    let timeout = false;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const delay = setTimeout(async () => {
      if (request.signal.aborted || revision.current !== version) return;
      setPhase("loading");
      deadline = setTimeout(() => {
        timeout = true;
        request.abort();
      }, 15000);
      try {
        const result = await translateShortText(
          currentDraft.text,
          currentDraft.side === "en" ? "en-zh" : "zh-en",
          request.signal,
        );
        if (!request.signal.aborted && revision.current === version) {
          const target = currentDraft.side === "en" ? "zh" : "en";
          setValues((old) => ({ ...old, [target]: result }));
          setPhase("done");
        }
      } catch (failure) {
        if (
          revision.current === version &&
          (!request.signal.aborted || timeout)
        ) {
          setError(
            timeout
              ? "timeout"
              : failure instanceof TranslationError
                ? failure.code
                : "network",
          );
          setPhase("idle");
        }
      } finally {
        clearTimeout(deadline);
        if (control.current === request) control.current = null;
      }
    }, 1000);
    return () => {
      clearTimeout(delay);
      clearTimeout(deadline);
      request.abort();
      if (control.current === request) control.current = null;
    };
  }, [draft, enabled, entitled]);

  const edit = (side: Side, value: string) => {
    revision.current++;
    control.current?.abort();
    setValues(side === "en" ? { en: value, zh: "" } : { zh: value, en: "" });
    setDraft({ side, text: value, revision: revision.current });
    const invalid =
      utf8Bytes(value.trim()) > 500
        ? "length"
        : credentialLike(value)
          ? "credential"
          : "";
    setError(invalid);
    setPhase(enabled && value.trim() && !invalid ? "waiting" : "idle");
  };
  const resume = () => {
    revision.current++;
    if (draft) setDraft({ ...draft, revision: revision.current });
    const invalid =
      draft && utf8Bytes(draft.text.trim()) > 500
        ? "length"
        : draft && credentialLike(draft.text)
          ? "credential"
          : "";
    setError(invalid);
    setPhase(draft?.text.trim() && !invalid ? "waiting" : "idle");
    setEnabled(true);
  };
  const errors: Record<string, string> = {
    length: text(
      "本次原文超过 500 字节，请缩短后再试。",
      "Shorten the original to 500 UTF-8 bytes or fewer.",
    ),
    credential: text(
      "疑似包含密钥或密码。请移除后再翻译。",
      "This looks like a key or password. Remove it before translating.",
    ),
    quota: text(
      "免费服务额度已用完，请稍后再试或使用离线沟通板。",
      "The free service is at its limit. Try later or use offline talk.",
    ),
    network: text(
      "连接失败，文字已保留。检查网络后重试。",
      "Could not connect. Your text is still here; check your connection and retry.",
    ),
    service: text(
      "服务未返回有效译文，请重试。",
      "The service did not return a usable translation. Please retry.",
    ),
    timeout: text(
      "翻译超时，文字已保留，请重试。",
      "Translation timed out. Your text is still here; please retry.",
    ),
  };

  if (!entitled || !started)
    return (
      <Page back title={text("面对面翻译", "Face-to-face translation")}>
        <View style={{ gap: 9, marginTop: 6, marginBottom: 24 }}>
          <Txt variant="title">
            {text(
              "一部手机，\n两边都听得懂。",
              "One phone.\nBoth sides understood.",
            )}
          </Txt>
          <Txt color={colors.secondary}>
            {text(
              "放在你们中间。中文朝向对方，英文朝向自己。",
              "Set it between you. Chinese faces them. English faces you.",
            )}
          </Txt>
        </View>
        <View style={[styles.preview, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.previewHalf,
              {
                backgroundColor: colors.accentSoft,
                transform: [{ rotate: "180deg" }],
              },
            ]}
          >
            <Txt variant="caption" color={colors.secondary}>
              中文 · 给对面的人
            </Txt>
            <Txt style={{ fontSize: 23, lineHeight: 31, fontWeight: "600" }}>
              我们可以在这里坐吗？
            </Txt>
          </View>
          <View
            style={{
              padding: 11,
              alignItems: "center",
              backgroundColor: colors.bg,
            }}
          >
            <Icon name="cards" size={19} />
          </View>
          <View style={styles.previewHalf}>
            <Txt variant="caption" color={colors.secondary}>
              English · Your side
            </Txt>
            <Txt style={{ fontSize: 22, lineHeight: 29, fontWeight: "600" }}>
              Can we sit here?
            </Txt>
          </View>
        </View>
        <Txt
          variant="caption"
          color={colors.secondary}
          style={{ marginBottom: 20 }}
        >
          {text(
            "布局示例 · 开始后输入任一语言即可同步翻译",
            "Layout example · type on either side to translate after starting",
          )}
        </Txt>
        {!entitled ? (
          <>
            <Txt variant="subheading" style={{ marginBottom: 8 }}>
              {text("Plus 与 Pro 专属", "Included with Plus & Pro")}
            </Txt>
            <Txt color={colors.secondary} style={{ marginBottom: 18 }}>
              {text(
                "解锁面对面布局与双向同步文字翻译。免费卡片翻译与离线沟通板继续可用。",
                "Unlock the shared layout and two-way text translation. Card translation and offline talk stay free.",
              )}
            </Txt>
            <Button
              icon="crown"
              label={text("查看 Plus / Pro 权益", "Explore Plus / Pro")}
              onPress={() => router.push("/upgrade")}
            />
          </>
        ) : (
          <>
            <Txt variant="subheading" style={{ marginBottom: 8 }}>
              {text("开始前，请双方知悉", "Before you both begin")}
            </Txt>
            <Txt
              variant="caption"
              color={colors.secondary}
              style={{ marginBottom: 18 }}
            >
              {text(
                "点击开始即同意将本屏双方输入的文字，在停顿 1 秒后自动发给 MyMemory 翻译。请先征得对方同意。服务可能长期保留文字；不要输入私人地址、身份信息、密码或密钥。",
                "Starting enables automatic translation: text typed on either side is sent to MyMemory after a 1-second pause. Get the other person’s agreement first. The provider may retain text long term; exclude private addresses, identity details, passwords and keys.",
              )}
            </Txt>
            {online === false && (
              <Notice
                text={text(
                  "当前离线。联网后可开始，或使用下方离线沟通板。",
                  "You are offline. Connect to begin, or use offline talk below.",
                )}
              />
            )}
            <Button
              icon="cards"
              disabled={online === false}
              label={text(
                "同意并开始同步翻译",
                "Agree & start live text translation",
              )}
              onPress={() => {
                setStarted(true);
                resume();
              }}
            />
          </>
        )}
        <View style={{ height: 12 }} />
        <Button
          secondary
          icon="chat"
          label={text("打开免费离线沟通板", "Open free offline talk")}
          onPress={() => router.push("/talk")}
        />
        <Surface style={{ marginTop: 20 }}>
          <Row
            icon="info"
            title={text("MyMemory · 免 Key", "MyMemory · no key needed")}
            subtitle={text(
              "匿名每天 5,000 字符 · 单次 500 字节。会员不增加服务商额度。",
              "5,000 characters/day anonymously · 500 bytes/request. Membership does not increase the provider limit.",
            )}
            onPress={() => openURL(translationService.limits)}
          />
          <Row
            icon="privacy"
            title={text("翻译服务条款与隐私", "Translation terms & privacy")}
            subtitle={text(
              "仅本次页面内存保存，不写入聊天或卡片",
              "Text stays in this screen’s memory; no chat or card is saved",
            )}
            last
            onPress={() => openURL(translationService.terms)}
          />
        </Surface>
      </Page>
    );

  return (
    <Page back scroll={false} title={text("面对面翻译", "Face-to-face")}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={Platform.OS !== "web"}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60 + insets.top}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 12),
            gap: 8,
          }}
        >
          <TranslationPane
            side="zh"
            value={values.zh}
            onChange={(value) => edit("zh", value)}
            source={draft?.side === "zh"}
            receiving={draft?.side === "en"}
            phase={phase}
            colors={colors}
            dark={isDark}
          />
          <View style={[styles.controls, { backgroundColor: colors.raised }]}>
            <Tap
              label={
                enabled ? "Pause live translation" : "Resume live translation"
              }
              onPress={() => {
                Keyboard.dismiss();
                if (enabled) pause();
                else resume();
              }}
              style={styles.control}
            >
              <Icon name={enabled ? "stop" : "cards"} size={16} />
              <Txt variant="caption" color={colors.accent}>
                {enabled
                  ? text("暂停同步", "Pause sync")
                  : text("同意并恢复", "Agree & resume")}
              </Txt>
            </Tap>
            <Txt variant="caption" color={colors.secondary}>
              MyMemory
            </Txt>
            <Tap
              label="Clear translation"
              onPress={() => {
                revision.current++;
                control.current?.abort();
                setValues({ en: "", zh: "" });
                setDraft(null);
                setError("");
                setPhase("idle");
                Keyboard.dismiss();
              }}
              style={styles.control}
            >
              <Icon name="close" size={15} />
              <Txt variant="caption" color={colors.accent}>
                {text("清空", "Clear")}
              </Txt>
            </Tap>
          </View>
          <TranslationPane
            side="en"
            value={values.en}
            onChange={(value) => edit("en", value)}
            source={draft?.side === "en"}
            receiving={draft?.side === "zh"}
            phase={phase}
            colors={colors}
            dark={isDark}
          />
          <ScrollView
            style={{ maxHeight: error ? 110 : 52, flexGrow: 0 }}
            contentContainerStyle={{ gap: 5 }}
            keyboardShouldPersistTaps="handled"
          >
            {error ? (
              <View accessibilityLiveRegion="polite">
                <Txt variant="caption" color={colors.danger}>
                  {errors[error] || errors.service}
                </Txt>
                <Tap
                  label="Retry translation"
                  onPress={resume}
                  style={{ paddingVertical: 8 }}
                >
                  <Txt variant="label" color={colors.accent}>
                    {text("重试", "Retry")}
                  </Txt>
                </Tap>
              </View>
            ) : (
              <Txt
                variant="caption"
                color={colors.secondary}
                style={{ textAlign: "center" }}
              >
                {enabled
                  ? text(
                      "输入后停顿 1 秒，译文在另一侧同步。机器翻译请核对。",
                      "Pause typing for 1 second to sync. Check machine translations.",
                    )
                  : text(
                      "同步已暂停。恢复后会将当前原文发给 MyMemory。",
                      "Sync paused. Resuming sends the current original to MyMemory.",
                    )}
              </Txt>
            )}
            <Tap
              label="Use offline talk instead"
              onPress={() => router.push("/talk")}
              style={{ paddingVertical: 3, alignItems: "center" }}
            >
              <Txt variant="caption" color={colors.accent}>
                {text("改用离线沟通板", "Use offline talk instead")}
              </Txt>
            </Tap>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}

export default function Translate() {
  const { tier, profile } = useProduct();
  const entitled = plans[tier].faceToFace;
  // Remounting discards text and cancels requests whenever the account or access changes.
  return (
    <TranslationSession
      key={`${profile?.id || "guest"}:${entitled}`}
      entitled={entitled}
    />
  );
}

const styles = StyleSheet.create({
  pane: {
    flex: 1,
    minHeight: 125,
    borderRadius: 24,
    padding: 17,
    overflow: "hidden",
  },
  paneHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  language: { flexDirection: "row", alignItems: "center", gap: 7 },
  input: {
    flex: 1,
    minHeight: 44,
    fontSize: 24,
    lineHeight: 33,
    fontWeight: "500",
    paddingHorizontal: 0,
    paddingTop: 15,
    paddingBottom: 10,
  },
  paneFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 22,
  },
  paneLine: { height: 1, position: "absolute", top: 0, left: 24, right: 24 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    paddingHorizontal: 10,
    minHeight: 44,
  },
  control: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 44,
    paddingHorizontal: 4,
  },
  preview: { borderRadius: 24, overflow: "hidden", marginBottom: 8 },
  previewHalf: { padding: 20, gap: 12, minHeight: 113 },
});
