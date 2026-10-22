import React, { useEffect, useRef, useState } from "react";
import { AppState, Platform, Switch, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { useApp } from "../state";
import { cards, phrases } from "../content";
import { cardBlanks } from "../card-template";
import {
  TranslationDirection,
  TranslationError,
  TranslationFailure,
  translateShortText,
  translationService,
  utf8Bytes,
} from "../translation";
import {
  Page,
  Heading,
  Field,
  Button,
  Surface,
  Txt,
  Notice,
  Chips,
  openURL,
} from "../ui";

export default function WriteCard() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t, prefs, update, colors } = useApp();
  const original = [...cards, ...phrases, ...prefs.customCards].find(
    (card) => card.id === id,
  );
  const editing = original?.custom === true;
  const [chinese, setChinese] = useState(original?.zh || "");
  const [english, setEnglish] = useState(original?.en || "");
  const [direction, setDirection] = useState<TranslationDirection>("en-zh");
  const [consent, setConsent] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{
    text: string;
    direction: TranslationDirection;
  } | null>(null);
  const [error, setError] = useState("");
  const mounted = useRef(true),
    controller = useRef<AbortController | null>(null),
    saving = useRef(false);
  const zh = prefs.language === "zh";
  const source = direction === "en-zh" ? english : chinese;
  const bytes = utf8Bytes(source.trim());
  useEffect(() => {
    mounted.current = true;
    const clearConsent = () => {
      controller.current?.abort();
      setConsent(false);
    };
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "background") clearConsent();
    });
    if (Platform.OS === "web")
      window.addEventListener("pagehide", clearConsent);
    return () => {
      mounted.current = false;
      controller.current?.abort();
      listener.remove();
      if (Platform.OS === "web")
        window.removeEventListener("pagehide", clearConsent);
    };
  }, []);
  const translate = async () => {
    if (!consent || controller.current || !source.trim() || bytes > 500) return;
    const control = new AbortController();
    controller.current = control;
    setBusy(true);
    setConsent(false);
    setError("");
    setPreview(null);
    let timeout = false;
    const timer = setTimeout(() => {
      timeout = true;
      control.abort();
    }, 15000);
    try {
      const result = await translateShortText(
        source,
        direction,
        control.signal,
      );
      if (mounted.current && !control.signal.aborted)
        setPreview({ text: result, direction });
    } catch (failure) {
      if (mounted.current) {
        const messages: Record<TranslationFailure, [string, string]> = {
          empty: [
            "请先填写要翻译的文字。",
            "Enter the text you want to translate.",
          ],
          length: [
            "单次不能超过 500 个 UTF-8 字节，请缩短文字。",
            "Shorten the text to 500 UTF-8 bytes or fewer.",
          ],
          credential: [
            "文字中疑似有密钥或密码，请移除后再翻译。",
            "This looks like a key or password. Remove it before translating.",
          ],
          quota: [
            "免费服务额度已用完或请求过快，请稍后再试；你仍可手动编辑。",
            "The free service is at its limit. Try later or keep editing manually.",
          ],
          network: [
            "无法连接翻译服务，请检查网络或稍后重试。",
            "Could not reach the translation service. Check your connection or try later.",
          ],
          service: [
            "翻译服务未返回有效结果，请稍后重试。",
            "The translation service did not return a usable result. Try again later.",
          ],
          cancelled: [
            timeout ? "翻译超时，请重试。" : "本次翻译已取消。",
            timeout
              ? "Translation timed out. Try again."
              : "Translation cancelled.",
          ],
        };
        const code =
          failure instanceof TranslationError ? failure.code : "network";
        setError(messages[code][zh ? 0 : 1]);
      }
    } finally {
      clearTimeout(timer);
      controller.current = null;
      if (mounted.current) setBusy(false);
    }
  };
  const save = (copy = false) => {
    if (!chinese.trim() || busy || saving.current || (id && !original)) return;
    saving.current = true;
    const targetId =
      editing && !copy ? original.id : `custom-${Crypto.randomUUID()}`;
    const card = {
      id: targetId,
      zh: chinese.trim(),
      en: english.trim() || chinese.trim().slice(0, 80),
      cat: "custom",
      custom: true,
    };
    update({
      customCards:
        editing && !copy
          ? prefs.customCards.map((item) =>
              item.id === targetId ? card : item,
            )
          : [...prefs.customCards, card],
      favorites: prefs.favorites.includes(targetId)
        ? prefs.favorites
        : [...prefs.favorites, targetId],
    });
    router.replace({ pathname: "/card", params: { id: targetId } });
  };
  return (
    <Page
      back
      title={
        editing
          ? zh
            ? "编辑我的卡片"
            : "Edit my card"
          : original
            ? zh
              ? "编辑模板"
              : "Edit a template"
            : t("newCard")
      }
    >
      <Heading
        title={
          editing
            ? zh
              ? "把这张卡改成你需要的样子。"
              : "Make this card work for you."
            : original
              ? zh
                ? "从这张模板开始。"
                : "Start with this template."
              : zh
                ? "创建你自己的沟通卡。"
                : "Make your own communication card."
        }
        body={
          original && !editing
            ? zh
              ? "编辑后保存为你的卡片副本。"
              : "Edit and save your own copy."
            : zh
              ? "中文用于出示，英文帮助你找到它。"
              : "Chinese to show. English to help you find it."
        }
      />
      {id && !original && (
        <Notice
          danger
          text={
            zh
              ? "这张卡片已不存在，请返回卡片页重新选择。"
              : "This card no longer exists. Return to Cards and choose another."
          }
        />
      )}
      <Field
        label={t("chinese")}
        value={chinese}
        onChangeText={(value) => {
          setChinese(value);
          setPreview(null);
          setConsent(false);
        }}
        editable={!busy}
        multiline
        maxLength={1000}
        style={{ minHeight: 130, textAlignVertical: "top" }}
      />
      <Field
        label={zh ? "英文说明" : "English meaning"}
        value={english}
        onChangeText={(value) => {
          setEnglish(value);
          setPreview(null);
          setConsent(false);
        }}
        editable={!busy}
        multiline
        maxLength={1000}
        style={{ minHeight: 85, textAlignVertical: "top" }}
      />
      {cardBlanks(chinese).length > 0 && (
        <Notice
          text={
            zh
              ? "检测到模板空位：保存后出示时可以填写。你也可以现在直接改成具体内容。"
              : "Template blanks detected. Fill them when showing the card, or replace them with your details now."
          }
        />
      )}
      <View style={{ marginBottom: 16 }}>
        <Button
          secondary
          label={
            showTranslation
              ? zh
                ? "收起免费翻译"
                : "Hide free translation"
              : zh
                ? "打开免费中英翻译"
                : "Use free Chinese–English translation"
          }
          disabled={busy}
          onPress={() => {
            setShowTranslation(!showTranslation);
            setConsent(false);
          }}
        />
      </View>
      {showTranslation && (
        <Surface style={{ padding: 18, gap: 12, marginBottom: 20 }}>
          <Txt variant="subheading">
            {zh ? "免费中英翻译" : "Free Chinese–English translation"}
          </Txt>
          <Chips
            value={direction}
            onChange={(value) => {
              if (!busy) {
                setDirection(value as TranslationDirection);
                setPreview(null);
                setConsent(false);
                setError("");
              }
            }}
            items={[
              { id: "en-zh", label: "English → 中文" },
              { id: "zh-en", label: "中文 → English" },
            ]}
          />
          <Txt variant="caption" color={colors.secondary}>
            {zh
              ? "MyMemory 免 Key，匿名每日 5,000 字符，单次 500 字节。服务会处理并可能长期保留文字，只用于一般短句。不要发送密钥、密码、证件或私人地址。"
              : "MyMemory needs no key: 5,000 characters/day anonymously, 500 bytes/request. It processes and may retain text long term. Use general phrases only; exclude keys, passwords, identity documents and private addresses."}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Txt variant="caption" style={{ flex: 1 }}>
              {zh
                ? "我同意将本次源文字发送给 MyMemory。"
                : "I agree to send the current source text to MyMemory."}
            </Txt>
            <Switch
              accessibilityLabel={
                zh
                  ? "同意发送文字给 MyMemory"
                  : "Consent to send text to MyMemory"
              }
              value={consent}
              disabled={busy}
              onValueChange={(value) => {
                setConsent(value);
                if (!value) controller.current?.abort();
              }}
              trackColor={{ true: colors.accent, false: colors.line }}
            />
          </View>
          <Txt
            variant="caption"
            color={bytes > 500 ? colors.danger : colors.secondary}
          >
            {bytes} / 500 {zh ? "字节" : "bytes"}
          </Txt>
          <Button
            secondary
            icon="cards"
            label={
              busy
                ? zh
                  ? "翻译中…"
                  : "Translating…"
                : zh
                  ? "翻译并预览"
                  : "Translate & preview"
            }
            disabled={!consent || !source.trim() || bytes > 500 || busy}
            onPress={() => {
              void translate();
            }}
          />
          {busy && (
            <Button
              secondary
              label={zh ? "取消翻译" : "Cancel translation"}
              onPress={() => controller.current?.abort()}
            />
          )}
          {Boolean(error) && <Notice danger text={error} />}
          {preview && (
            <View style={{ gap: 12 }}>
              <Txt variant="label">
                {zh
                  ? "机器翻译结果，请检查后使用"
                  : "Machine translation · review before using"}
              </Txt>
              <Txt selectable>{preview.text}</Txt>
              <Button
                secondary
                label={zh ? "填入编辑框" : "Use this translation"}
                onPress={() => {
                  if (preview.direction === "en-zh") setChinese(preview.text);
                  else setEnglish(preview.text);
                  setPreview(null);
                }}
              />
            </View>
          )}
          <Button
            secondary
            label={zh ? "服务条款与隐私说明" : "Service terms & privacy"}
            onPress={() => openURL(translationService.terms)}
          />
        </Surface>
      )}
      <Surface style={{ padding: 18, gap: 9, marginBottom: 18 }}>
        <Txt variant="caption" color={colors.secondary}>
          {zh ? "卡片预览" : "Card preview"}
        </Txt>
        <Txt style={{ fontSize: 24, lineHeight: 34 }}>
          {chinese || (zh ? "在上方输入中文" : "Enter Chinese above")}
        </Txt>
        <Txt variant="caption" color={colors.secondary}>
          {english}
        </Txt>
      </Surface>
      <Button
        label={
          editing
            ? zh
              ? "保存修改"
              : "Save changes"
            : original
              ? zh
                ? "保存为我的卡片"
                : "Save as my card"
              : zh
                ? "创建卡片"
                : "Create card"
        }
        icon="save"
        disabled={!chinese.trim() || busy || Boolean(id && !original)}
        onPress={() => save()}
      />
      {editing && (
        <View style={{ marginTop: 12 }}>
          <Button
            secondary
            label={zh ? "另存为新卡片" : "Save a new copy"}
            disabled={!chinese.trim() || busy}
            onPress={() => save(true)}
          />
        </View>
      )}
      <Txt variant="caption" color={colors.secondary} style={{ marginTop: 15 }}>
        {zh
          ? "卡片只保存在此设备。翻译不会自动运行，预览结果也不会自动保存。"
          : "Cards stay on this device. Translation only runs when requested; preview results are not saved automatically."}
      </Txt>
    </Page>
  );
}
