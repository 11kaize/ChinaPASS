import { TextInput } from "./localized-input";
import { backOrReplace } from "./navigation-back";
import { artwork } from "./artwork";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useProduct } from "./product-state";
import { useApp } from "./state";
import { Brand, Txt, Tap, Icon, useMotionValue, useReducedMotion } from "./ui";
export function AuthScreen({ register = false }: { register?: boolean }) {
  const { signup, login, loginDemo, ready } = useProduct();
  const { prefs, update, disconnect } = useApp();
  const zh = prefs.language === "zh";
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const glow = useMotionValue(1),
    reduce = useReducedMotion();
  useFocusEffect(
    useCallback(() => {
      glow.setValue(1);
      if (reduce || Platform.OS === "web") return;
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 2600,
            isInteraction: false,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.82,
            duration: 2600,
            isInteraction: false,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }, [glow, reduce]),
  );
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (register) await signup(name, email, password);
      else await login(email, password);
      setPassword("");
      router.replace("/settings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const enterDemo = () => {
    if (busy || !ready) return;
    setBusy(true);
    setError("");
    try {
      loginDemo();
      disconnect();
      setPassword("");
      update({ onboarded: true });
      router.replace("/settings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const field = (
    label: string,
    value: string,
    set: (v: string) => void,
    secret = false,
  ) => (
    <View style={{ gap: 7, marginBottom: 15 }}>
      <Txt style={{ color: "#C5D6EE", fontSize: 12, fontWeight: "600" }}>
        {label}
      </Txt>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={set}
        secureTextEntry={secret}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        textContentType="none"
        keyboardType={label === "Email" ? "email-address" : "default"}
        editable={!busy}
        placeholderTextColor="#879BB8"
        style={{
          color: "#F0F6FF",
          backgroundColor: "rgba(190,215,255,0.10)",
          borderWidth: 1,
          borderColor: "rgba(216,233,255,0.25)",
          borderRadius: 16,
          paddingHorizontal: 15,
          paddingVertical: 13,
          minHeight: 48,
          fontSize: 14,
        }}
      />
    </View>
  );
  return (
    <ImageBackground
      source={artwork.login}
      imageStyle={{ width: "100%", height: "100%" }}
      style={{ flex: 1, backgroundColor: "#071326" }}
    >
      <LinearGradient
        colors={["#06102200", "#06102266", "#030A18DD"]}
        locations={[0, 0.45, 1]}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 24,
              paddingBottom: 32,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Tap
              label={zh ? "返回" : "Back"}
              onPress={() => backOrReplace(router, "/settings")}
              style={{
                alignSelf: "flex-start",
                padding: 10,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Icon name="back" color="#E5F0FF" size={18} />
            </Tap>
            <Animated.View
              nativeID="auth-gateway-mark"
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: register ? "column" : "row",
                paddingTop: register ? 30 : 16,
                paddingBottom: register ? 24 : 14,
                gap: 10,
                opacity: glow,
              }}
            >
              <Brand large={register} />
              <Txt style={{ fontSize: 11, letterSpacing: 3, color: "#D1E2FC" }}>
                CHINABUDDY
              </Txt>
            </Animated.View>
            <View style={{ marginTop: "auto", paddingTop: register ? 28 : 12 }}>
              <Txt
                style={{
                  fontSize: register ? 31 : 27,
                  lineHeight: register ? 36 : 32,
                  fontWeight: "600",
                  letterSpacing: -0.8,
                  color: "#F5F8FF",
                  marginBottom: 8,
                }}
              >
                {register
                  ? zh
                    ? "你的故事，\n从这里开始。"
                    : "Every journey\nstarts somewhere."
                  : zh
                    ? "再一次，\n从容出发。"
                    : "Find your way\nback to possibility."}
              </Txt>
              <Txt
                style={{
                  color: "#B9CAE2",
                  fontSize: 13,
                  lineHeight: 20,
                  marginBottom: 24,
                }}
              >
                {zh
                  ? "在中国，给自己多一只帮手。"
                  : "A familiar hand, wherever the day takes you."}
              </Txt>
              {register && field(zh ? "昵称" : "Display name", name, setName)}
              {field("Email", email, setEmail)}
              {field(
                zh ? "演示密码" : "Demo password",
                password,
                setPassword,
                true,
              )}
              {Boolean(error) && (
                <Txt
                  style={{ color: "#FFBAC8", fontSize: 12, marginBottom: 12 }}
                >
                  {error}
                </Txt>
              )}
              <Tap
                disabled={busy}
                label={register ? "Create demo account" : "Sign in"}
                onPress={() => {
                  void submit();
                }}
                style={{
                  minHeight: 50,
                  borderRadius: 18,
                  backgroundColor: "#DDEBFF",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                {busy ? (
                  <ActivityIndicator color="#2458A0" />
                ) : (
                  <>
                    <Txt style={{ color: "#173A70", fontWeight: "700" }}>
                      {register
                        ? zh
                          ? "创建演示账号"
                          : "Create demo account"
                        : zh
                          ? "登录"
                          : "Sign in"}
                    </Txt>
                    <Icon name="arrow" color="#2458A0" size={18} />
                  </>
                )}
              </Tap>
              {!register && (
                <View style={{ marginTop: 10, gap: 7 }}>
                  <Tap
                    disabled={busy || !ready}
                    label={zh ? "一键登录 Demo 账号" : "One-tap demo sign-in"}
                    onPress={enterDemo}
                    style={{
                      minHeight: 50,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: "rgba(216,233,255,0.45)",
                      backgroundColor: "rgba(190,215,255,0.12)",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 9,
                    }}
                  >
                    <Icon name="profile" color="#E5F0FF" size={19} />
                    <Txt
                      style={{
                        color: "#F0F6FF",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      {zh ? "一键登录 Demo 账号" : "One-tap demo sign-in"}
                    </Txt>
                  </Tap>
                  <Txt
                    style={{
                      color: "#C5D6EE",
                      fontSize: 11,
                      lineHeight: 17,
                      textAlign: "center",
                    }}
                  >
                    {zh
                      ? "无需邮箱或密码 · Pro 演示权益 · 不扣款"
                      : "No email or password · Pro demo access · no charge"}
                  </Txt>
                </View>
              )}
              <Tap
                disabled={busy}
                label={register ? "Sign in instead" : "Create account"}
                onPress={() =>
                  router.replace(register ? "/login" : "/register")
                }
                style={{ paddingVertical: 17, alignItems: "center" }}
              >
                <Txt style={{ fontSize: 13, color: "#D8E7FF" }}>
                  {register
                    ? zh
                      ? "已有账号？登录"
                      : "Already here? Sign in"
                    : zh
                      ? "第一次来？创建账号"
                      : "New here? Create an account"}
                </Txt>
              </Tap>
              <Txt
                style={{
                  color: "#9FB2CE",
                  fontSize: 10,
                  lineHeight: 16,
                  textAlign: "center",
                }}
              >
                {zh
                  ? register
                    ? "仅用于本机演示，不会发送邮件。请使用虚拟邮箱和演示密码。"
                    : "指南和卡片可直接使用。登录仅用于个人资料、社区互动与会员演示。"
                  : register
                    ? "On-device demo only. No email is sent. Use a made-up email and demo password."
                    : "Guides and cards work without signing in. Sign-in is for profiles, community activity and membership demos."}
              </Txt>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
