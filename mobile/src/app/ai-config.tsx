import React, { useEffect, useRef, useState } from "react";
import { View, Switch, Keyboard } from "react-native";
import { router } from "expo-router";
import { fetch as nativeFetch } from "expo/fetch";
import { useApp } from "../state";
import {
  APIConfig,
  Provider,
  providers,
  qwenEndpoint,
  qwenLocation,
  Region,
  validateConfig,
} from "../ai/providers";
import { streamAnswer, errorMessage } from "../ai/client";
import {
  Page,
  Heading,
  Section,
  Chips,
  Field,
  Notice,
  Button,
  Txt,
  Surface,
  Row,
  openURL,
} from "../ui";
export default function AIConfig() {
  const { sessionEpoch } = useApp();
  return <ConfigForm key={sessionEpoch} />;
}
function ConfigForm() {
  const { t, colors, prefs, config, setConfig, disconnect } = useApp();
  const initialLocation =
    config?.provider === "qwen" ? qwenLocation(config.baseURL) : null;
  const [provider, setProvider] = useState<Provider>(
      config?.provider || "deepseek",
    ),
    [model, setModel] = useState(config?.model || providers.deepseek.model),
    [baseURL, setBaseURL] = useState(
      config?.baseURL || providers.deepseek.baseURL,
    ),
    [key, setKey] = useState(config?.key || "");
  const [region, setRegion] = useState<Region>(
      initialLocation?.region || "beijing",
    ),
    [workspace, setWorkspace] = useState(initialLocation?.workspace || ""),
    [advanced, setAdvanced] = useState(false),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [result, setResult] = useState(""),
    [error, setError] = useState("");
  const testAbort = useRef<AbortController | null>(null),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      testAbort.current?.abort();
    };
  }, []);
  const invalidate = () => {
    testAbort.current?.abort();
    testAbort.current = null;
    setBusy(false);
    setResult("");
    setError("");
  };
  const selectProvider = (id: string) => {
    const p = id as Provider;
    setProvider(p);
    setModel(providers[p].model);
    setBaseURL(providers[p].baseURL);
    setKey("");
    setWorkspace("");
    setRegion("beijing");
    setConsent(false);
    invalidate();
  };
  const current = (): APIConfig => ({
    provider,
    key: key.trim(),
    baseURL: baseURL.trim(),
    model: model.trim(),
  });
  const validate = () => {
    const invalid = validateConfig(current());
    if (invalid) {
      setError(t(invalid));
      return false;
    }
    if (!consent) {
      setError(t("consent"));
      return false;
    }
    return true;
  };
  const test = async () => {
    Keyboard.dismiss();
    if (!validate()) return;
    invalidate();
    setBusy(true);
    const control = new AbortController();
    testAbort.current = control;
    try {
      await streamAnswer(
        current(),
        "Reply with OK. This is a connection test.",
        [{ role: "user", content: "Reply OK." }],
        {
          signal: control.signal,
          fetcher: nativeFetch as typeof globalThis.fetch,
          onText: () => {},
          timeoutMs: 45000,
        },
      );
      if (alive.current && testAbort.current === control)
        setResult(t("connectionOk"));
    } catch (e) {
      if (alive.current && testAbort.current === control)
        setError(errorMessage(e, prefs.language === "zh"));
    } finally {
      if (testAbort.current === control) {
        if (alive.current) setBusy(false);
        testAbort.current = null;
      }
    }
  };
  return (
    <Page back title={t("connection")}>
      <Heading title={t("configure")} body={t("sessionOnly")} />
      <Section title={t("provider")}>
        <Chips
          value={provider}
          onChange={selectProvider}
          items={Object.entries(providers).map(([id, p]) => ({
            id,
            label: p.name,
          }))}
        />
      </Section>
      <Surface style={{ padding: 20, gap: 8, marginBottom: 22 }}>
        <Txt variant="subheading">
          {provider === "qwen" && model === "qwen3.8-max"
            ? "Qwen 3.8 Max"
            : providers[provider].label}
        </Txt>
        <Txt variant="caption" color={colors.secondary}>
          {t("connectHint")}
        </Txt>
      </Surface>
      {provider === "qwen" && (
        <>
          <Section title={t("region")}>
            <Chips
              value={region}
              onChange={(id) => {
                const r = id as Region;
                setRegion(r);
                invalidate();
                try {
                  setBaseURL(qwenEndpoint(r, workspace));
                } catch {
                  setBaseURL("");
                  setError(
                    prefs.language === "zh"
                      ? "请修正业务空间 ID。"
                      : "Please correct your workspace ID.",
                  );
                }
              }}
              items={[
                { id: "beijing", label: "Beijing" },
                { id: "singapore", label: "Singapore" },
                { id: "virginia", label: "Virginia (US)" },
              ]}
            />
            <Txt variant="caption" color={colors.secondary}>
              {prefs.language === "zh"
                ? "选择创建 API Key 时使用的区域。"
                : "Choose the region where you created your key."}
            </Txt>
          </Section>
          {advanced && (
            <Field
              label={t("workspace")}
              hint={
                prefs.language === "zh"
                  ? "可选，填写后使用业务空间专属域名。"
                  : "Optional. Uses your workspace-specific endpoint."
              }
              value={workspace}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(v) => {
                setWorkspace(v);
                invalidate();
                try {
                  setBaseURL(qwenEndpoint(region, v));
                } catch {
                  setError(
                    prefs.language === "zh"
                      ? "业务空间 ID 只允许字母、数字和连字符。"
                      : "Workspace ID accepts only letters, digits and hyphens.",
                  );
                  setBaseURL("");
                }
              }}
            />
          )}
          <Chips
            value={model}
            onChange={(v) => {
              setModel(v);
              invalidate();
            }}
            items={[
              { id: "qwen3.8-flash", label: "Qwen 3.8 Flash" },
              { id: "qwen3.8-max", label: "Qwen 3.8 Max" },
            ]}
          />
        </>
      )}
      <Field
        label={t("apiKey")}
        value={key}
        onChangeText={(v) => {
          setKey(v);
          invalidate();
        }}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
        maxLength={500}
        placeholder="Your provider API key"
      />
      <Surface style={{ marginBottom: 21 }}>
        <Row
          title={t("advanced")}
          subtitle={`${model}\n${baseURL}`}
          onPress={() => setAdvanced(!advanced)}
          last
        />
      </Surface>
      {advanced && (
        <>
          <Field
            label={t("model")}
            value={model}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(v) => {
              setModel(v);
              invalidate();
            }}
          />
          <Field
            label={t("endpoint")}
            value={baseURL}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(v) => {
              setBaseURL(v);
              invalidate();
            }}
            hint={
              prefs.language === "zh"
                ? "填写基础地址，不附加 /chat/completions 或 /responses。"
                : "Base URL only. Do not append /chat/completions or /responses."
            }
          />
        </>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          marginBottom: 22,
        }}
      >
        <Switch
          accessibilityLabel={t("consent")}
          value={consent}
          onValueChange={(value) => {
            setConsent(value);
            invalidate();
          }}
          trackColor={{ true: colors.accent, false: colors.line }}
        />
        <Txt variant="caption" color={colors.secondary} style={{ flex: 1 }}>
          {t("consent")}
        </Txt>
      </View>
      {Boolean(error) && <Notice danger text={error} />}
      <View style={{ gap: 12 }}>
        <Button
          label={busy ? t("checking") : t("check")}
          secondary
          icon={busy ? "stop" : "checks"}
          disabled={busy || !consent}
          onPress={() => {
            void test();
          }}
        />
        <Txt variant="caption" color={colors.secondary}>
          {prefs.language === "zh"
            ? "测试会发送一个简短请求，消耗少量服务商额度。"
            : "Testing sends a short request and may use a small amount of your provider credit."}
        </Txt>
        {Boolean(result) && <Notice text={`${result}. ${t("connectedNote")}`} />}
        <Button
          label={t("connect")}
          icon="check"
          disabled={busy || !consent}
          onPress={() => {
            if (validate()) {
              disconnect();
              setConfig(current());
              setKey("");
              router.back();
            }
          }}
        />
        {config && (
          <Button
            label={t("disconnect")}
            danger
            icon="close"
            onPress={() => {
              disconnect();
              setKey("");
              router.back();
            }}
          />
        )}
        <Button
          label={prefs.language === "zh" ? "获取 API Key" : "Get an API key"}
          secondary
          icon="arrow"
          onPress={() => openURL(providers[provider].keyURL)}
        />
        <Button
          label={
            prefs.language === "zh" ? "官方配置文档" : "Official setup guide"
          }
          secondary
          icon="guides"
          onPress={() => openURL(providers[provider].docs)}
        />
      </View>
    </Page>
  );
}
