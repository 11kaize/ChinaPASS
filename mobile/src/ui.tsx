import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Keyboard,
  Platform,
  Animated,
  Alert,
  Image,
  ImageSourcePropType,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { AirplaneLanding } from "phosphor-react-native/src/icons/AirplaneLanding";
import { ArrowLeft } from "phosphor-react-native/src/icons/ArrowLeft";
import { ArrowRight } from "phosphor-react-native/src/icons/ArrowRight";
import { BookmarkSimple } from "phosphor-react-native/src/icons/BookmarkSimple";
import { Car } from "phosphor-react-native/src/icons/Car";
import { ChatCircleDots } from "phosphor-react-native/src/icons/ChatCircleDots";
import { Check } from "phosphor-react-native/src/icons/Check";
import { CheckCircle } from "phosphor-react-native/src/icons/CheckCircle";
import { CircleIcon } from "phosphor-react-native/src/icons/Circle";
import { Checks } from "phosphor-react-native/src/icons/Checks";
import { CaretRight } from "phosphor-react-native/src/icons/CaretRight";
import { ClipboardText } from "phosphor-react-native/src/icons/ClipboardText";
import { Scan } from "phosphor-react-native/src/icons/Scan";
import { Bed } from "phosphor-react-native/src/icons/Bed";
import { Lifebuoy } from "phosphor-react-native/src/icons/Lifebuoy";
import { FirstAid } from "phosphor-react-native/src/icons/FirstAid";
import { House } from "phosphor-react-native/src/icons/House";
import { Info } from "phosphor-react-native/src/icons/Info";
import { MapPin } from "phosphor-react-native/src/icons/MapPin";
import { ShieldCheck } from "phosphor-react-native/src/icons/ShieldCheck";
import { SimCard } from "phosphor-react-native/src/icons/SimCard";
import { SquaresFour } from "phosphor-react-native/src/icons/SquaresFour";
import { Train } from "phosphor-react-native/src/icons/Train";
import { Translate } from "phosphor-react-native/src/icons/Translate";
import { ForkKnife } from "phosphor-react-native/src/icons/ForkKnife";
import { WifiSlash } from "phosphor-react-native/src/icons/WifiSlash";
import { X } from "phosphor-react-native/src/icons/X";
import { GearSix } from "phosphor-react-native/src/icons/GearSix";
import { Plus } from "phosphor-react-native/src/icons/Plus";
import { PaperPlaneTilt } from "phosphor-react-native/src/icons/PaperPlaneTilt";
import { Stop } from "phosphor-react-native/src/icons/Stop";
import { Phone } from "phosphor-react-native/src/icons/Phone";
import { WarningCircle } from "phosphor-react-native/src/icons/WarningCircle";
import { MagnifyingGlass } from "phosphor-react-native/src/icons/MagnifyingGlass";
import type { Icon as PhosphorIcon } from "phosphor-react-native";
import { useApp } from "./state";
import { GlassMaterial } from "./material";
import { UserCircle } from "phosphor-react-native/src/icons/UserCircle";
import { UsersThree } from "phosphor-react-native/src/icons/UsersThree";
import { Heart } from "phosphor-react-native/src/icons/Heart";
import { Star } from "phosphor-react-native/src/icons/Star";
import { ImageSquare } from "phosphor-react-native/src/icons/ImageSquare";
import { Crown } from "phosphor-react-native/src/icons/Crown";
export const icons: Record<string, PhosphorIcon> = {
  profile: UserCircle,
  community: UsersThree,
  heart: Heart,
  star: Star,
  image: ImageSquare,
  crown: Crown,
  transport: Train,
  customs: AirplaneLanding,
  sim: SimCard,
  pay: Scan,
  taxi: Car,
  hotel: Bed,
  help: Lifebuoy,
  metro: Train,
  train: Train,
  food: ForkKnife,
  emergency: FirstAid,
  address: MapPin,
  prep: ClipboardText,
  cards: Translate,
  chat: ChatCircleDots,
  today: House,
  guides: SquaresFour,
  settings: GearSix,
  check: Check,
  checked: CheckCircle,
  unchecked: CircleIcon,
  checks: Checks,
  arrow: ArrowRight,
  back: ArrowLeft,
  next: CaretRight,
  save: BookmarkSimple,
  close: X,
  plus: Plus,
  send: PaperPlaneTilt,
  stop: Stop,
  phone: Phone,
  warning: WarningCircle,
  info: Info,
  privacy: ShieldCheck,
  offline: WifiSlash,
  search: MagnifyingGlass,
};
export function Icon({
  name,
  size = 18,
  color,
  weight = "regular",
}: {
  name: string;
  size?: number;
  color?: string;
  weight?: "regular" | "fill" | "bold";
}) {
  const { colors } = useApp();
  const Component = icons[name] || Info;
  return (
    <Component size={size} color={color || colors.accent} weight={weight} />
  );
}
export function useMotionValue(initial: number) {
  return useState(() => new Animated.Value(initial))[0];
}
export function useReducedMotion() {
  const [reduced, set] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(set)
      .catch(() => {});
    const event = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      set,
    );
    return () => event.remove();
  }, []);
  return reduced;
}
export function Txt({
  children,
  variant = "body",
  color,
  style,
  numberOfLines,
  selectable = false,
}: {
  children: React.ReactNode;
  variant?: "body" | "title" | "heading" | "subheading" | "caption" | "label";
  color?: string;
  style?: any;
  numberOfLines?: number;
  selectable?: boolean;
}) {
  const { colors } = useApp();
  return (
    <Text
      selectable={selectable}
      numberOfLines={numberOfLines}
      style={[type[variant], { color: color || colors.ink }, style]}
    >
      {children}
    </Text>
  );
}
const type = StyleSheet.create({
  body: { fontSize: 15, lineHeight: 22 },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.7,
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  subheading: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  caption: { fontSize: 12, lineHeight: 18 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
});
export function Tap({
  children,
  onPress,
  style,
  label,
  disabled = false,
  selected,
  testID,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  label: string;
  disabled?: boolean;
  selected?: boolean;
  testID?: string;
}) {
  const scale = useMotionValue(1);
  const reduced = useReducedMotion();
  const press = (value: number) => {
    if (!reduced)
      Animated.spring(scale, {
        toValue: value,
        useNativeDriver: Platform.OS !== "web",
        speed: 32,
        bounciness: value === 1 ? 5 : 0,
      }).start();
  };
  const layout = StyleSheet.flatten(style) || {};
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      testID={testID}
      onPressIn={() => press(0.98)}
      onPressOut={() => press(1)}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={{
        opacity: disabled ? 0.48 : 1,
        ...(layout.flex !== undefined ? { flex: layout.flex } : {}),
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
export function Button({
  label,
  onPress,
  icon = "arrow",
  secondary = false,
  disabled = false,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  icon?: string;
  secondary?: boolean;
  disabled?: boolean;
  danger?: boolean;
}) {
  const { colors } = useApp();
  const ink = danger ? colors.danger : secondary ? colors.accent : "#FFFFFF";
  return (
    <Tap
      label={label}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: danger
            ? colors.dangerSoft
            : secondary
              ? colors.accentSoft
              : colors.accent,
        },
      ]}
    >
      {!secondary && !danger && (
        <LinearGradient
          pointerEvents="none"
          colors={["#258CFF", "#3A6AF0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 17 }]}
        />
      )}
      <Txt variant="label" color={ink} style={{ flexShrink: 1 }}>
        {label}
      </Txt>
      <Icon name={icon} size={18} color={ink} />
    </Tap>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  danger = false,
  selected = false,
}: {
  name: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
  selected?: boolean;
}) {
  const { colors } = useApp();
  return (
    <Tap
      label={label}
      onPress={onPress}
      selected={selected}
      style={styles.iconButton}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: danger
            ? colors.dangerSoft
            : selected
              ? colors.accentSoft
              : colors.raised,
        }}
      >
        <Icon
          name={name}
          color={danger ? colors.danger : colors.accent}
          size={18}
          weight={selected ? "fill" : "regular"}
        />
      </View>
    </Tap>
  );
}
export function Brand({ large = false }: { large?: boolean }) {
  return (
    <Image
      source={require("../assets/brand-blue.png")}
      accessibilityLabel="ChinaHand"
      style={{
        width: large ? 80 : 28,
        height: large ? 80 : 28,
        borderRadius: large ? 22 : 9,
      }}
    />
  );
}
export function TopBar({
  title,
  back = false,
}: {
  title?: string;
  back?: boolean;
}) {
  const { t } = useApp();
  return (
    <View style={[styles.topbar, { zIndex: 10 }]}>
      <GlassMaterial radius={0} />
      {back ? (
        <IconButton
          name="back"
          label={t("back")}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)")
          }
        />
      ) : (
        <View style={styles.row}>
          <Brand />
          <Txt variant="subheading">ChinaHand</Txt>
        </View>
      )}
      {title ? (
        <Txt variant="label" style={{ flex: 1, textAlign: "center" }}>
          {title}
        </Txt>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      <IconButton
        name="emergency"
        label={t("emergency")}
        danger
        onPress={() => router.push("/emergency")}
      />
    </View>
  );
}
export function Page({
  children,
  title,
  back = false,
  scroll = true,
  backdrop,
  header,
}: {
  children: React.ReactNode;
  title?: string;
  back?: boolean;
  scroll?: boolean;
  backdrop?: ImageSourcePropType;
  header?: React.ReactNode;
}) {
  const { colors, isDark } = useApp();
  const reduced = useReducedMotion();
  const offset = useMotionValue(0);
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboard(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboard(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      offset.setValue(reduced ? 0 : 10);
      const animation = Animated.spring(offset, {
        toValue: 0,
        damping: 22,
        stiffness: 210,
        mass: 0.8,
        useNativeDriver: Platform.OS !== "web",
      });
      animation.start();
      return () => animation.stop();
    }, [offset, reduced]),
  );
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <Image
        source={
          backdrop ||
          (isDark
            ? require("../assets/home-night.png")
            : require("../assets/home-portrait.png"))
        }
        resizeMode="cover"
        accessibilityLabel={
          isDark
            ? "Shanghai night skyline background"
            : "Shanghai morning skyline background"
        }
        style={[
          StyleSheet.absoluteFill,
          { width: "100%", height: "100%", opacity: backdrop ? 0.8 : 0.15 },
        ]}
      />
      {header || <TopBar title={title} back={back} />}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: offset }],
          paddingBottom: !scroll && !back && !keyboard ? 86 : 0,
        }}
      >
        {scroll ? (
          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={[
              styles.page,
              { paddingBottom: back ? 40 : 112 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
export function Heading({ title, body }: { title: string; body?: string }) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 7, marginTop: 6, marginBottom: 20 }}>
      <Txt variant="title">{title}</Txt>
      {body && <Txt color={colors.secondary}>{body}</Txt>}
    </View>
  );
}
export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; onPress: () => void };
  children: React.ReactNode;
}) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 13, marginBottom: 28 }}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Txt variant="subheading" style={{ flex: 1 }}>
          {title}
        </Txt>
        {action && (
          <Tap
            label={action.label}
            onPress={action.onPress}
            style={{ minHeight: 44, justifyContent: "center" }}
          >
            <Txt variant="caption" color={colors.accent}>
              {action.label}
            </Txt>
          </Tap>
        )}
      </View>
      {children}
    </View>
  );
}
export function Surface({
  children,
  style,
  glass = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  glass?: boolean;
}) {
  const { colors, isDark } = useApp();
  return (
    <View
      style={[
        styles.surface,
        { backgroundColor: colors.surface },
        style,
        glass && {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: isDark ? "#3B4E70" : "#FFFFFF",
        },
      ]}
    >
      {glass && <GlassMaterial />}
      {children}
    </View>
  );
}
export function Row({
  title,
  subtitle,
  icon,
  onPress,
  trailing,
  last = false,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  last?: boolean;
}) {
  const { colors } = useApp();
  const child = (
    <View
      style={[
        styles.listRow,
        {
          borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.line,
        },
      ]}
    >
      {icon && (
        <View
          style={[
            styles.rowIcon,
            {
              backgroundColor:
                (
                  {
                    emergency: "#FF8B86",
                    food: "#FFB146",
                    hotel: "#9C8BF0",
                    prep: "#70AFE8",
                    taxi: "#F1B642",
                    train: "#9382EE",
                    metro: "#56A9EE",
                    pay: "#478FF0",
                    sim: "#EC8C99",
                    cards: "#8E8CE5",
                    address: "#5CB3D4",
                    save: "#C19CE4",
                  } as Record<string, string>
                )[icon] || "#559FEF",
            },
          ]}
        >
          <Icon name={icon} color="#FFFFFF" />
        </View>
      )}
      <View style={{ flex: 1, gap: 3 }}>
        <Txt variant="label">{title}</Txt>
        {subtitle && (
          <Txt variant="caption" color={colors.secondary}>
            {subtitle}
          </Txt>
        )}
      </View>
      {trailing ||
        (onPress && <Icon name="next" size={18} color={colors.secondary} />)}
    </View>
  );
  return onPress ? (
    <Tap label={title} onPress={onPress}>
      {child}
    </Tap>
  ) : (
    child
  );
}
export function Search({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 8, marginBottom: 20 }}>
      <Txt variant="caption" color={colors.secondary}>
        {label}
      </Txt>
      <View style={[styles.search, { backgroundColor: colors.raised }]}>
        <Icon name="search" size={20} color={colors.secondary} />
        <TextInput
          accessibilityLabel={label}
          placeholder={label}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={{ flex: 1, color: colors.ink, fontSize: 16, minHeight: 44 }}
        />
      </View>
    </View>
  );
}
export function Field({
  label,
  hint,
  error,
  ...props
}: TextInputProps & { label: string; hint?: string; error?: string }) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 8, marginBottom: 19 }}>
      <Txt variant="label">{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.placeholder}
        {...props}
        style={[
          styles.input,
          {
            color: colors.ink,
            backgroundColor: colors.raised,
            borderColor: error ? colors.danger : colors.line,
          },
          props.style,
        ]}
      />
      {hint && (
        <Txt variant="caption" color={colors.secondary}>
          {hint}
        </Txt>
      )}
      {error && (
        <Txt variant="caption" color={colors.danger}>
          {error}
        </Txt>
      )}
    </View>
  );
}
export function Chips({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors } = useApp();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingBottom: 18 }}
    >
      {items.map((item) => (
        <Tap
          key={item.id}
          label={item.label}
          selected={value === item.id}
          onPress={() => onChange(item.id)}
          style={{
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 24,
            backgroundColor: value === item.id ? colors.accent : colors.raised,
          }}
        >
          <Txt
            variant="caption"
            color={value === item.id ? colors.onAccent : colors.secondary}
            style={{ fontWeight: "600" }}
          >
            {item.label}
          </Txt>
        </Tap>
      ))}
    </ScrollView>
  );
}
export function Notice({
  text,
  danger = false,
  icon = "info",
}: {
  text: string;
  danger?: boolean;
  icon?: string;
}) {
  const { colors } = useApp();
  return (
    <View
      style={[
        styles.notice,
        { backgroundColor: danger ? colors.dangerSoft : colors.accentSoft },
      ]}
    >
      <Icon
        name={icon}
        size={18}
        color={danger ? colors.danger : colors.accent}
      />
      <Txt
        variant="caption"
        color={danger ? colors.danger : colors.accent}
        style={{ flex: 1 }}
      >
        {text}
      </Txt>
    </View>
  );
}
export function Empty({
  title,
  body,
  icon = "cards",
}: {
  title: string;
  body: string;
  icon?: string;
}) {
  const { colors } = useApp();
  return (
    <View style={{ paddingVertical: 40, gap: 14, alignItems: "center" }}>
      <View
        style={{
          padding: 22,
          borderRadius: 24,
          backgroundColor: colors.accentSoft,
        }}
      >
        <Icon name={icon} size={28} />
      </View>
      <Txt variant="subheading" style={{ textAlign: "center" }}>
        {title}
      </Txt>
      <Txt
        color={colors.secondary}
        style={{ textAlign: "center", maxWidth: 290 }}
      >
        {body}
      </Txt>
    </View>
  );
}
export function RichText({ text }: { text: string }) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 8 }}>
      {text.split("\n").map((line, i) => (
        <Text
          key={i}
          selectable
          style={{ color: colors.ink, fontSize: 16, lineHeight: 25 }}
        >
          {line
            .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g)
            .map((part, j) => {
              const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
              return (
                <Text
                  key={j}
                  accessibilityRole={link ? "link" : undefined}
                  onPress={link ? () => openURL(link[2]) : undefined}
                  style={
                    link
                      ? {
                          color: colors.accent,
                          textDecorationLine: "underline",
                        }
                      : part.startsWith("**")
                        ? { fontWeight: "700" }
                        : undefined
                  }
                >
                  {link
                    ? link[1]
                    : part.replace(/^\*\*|\*\*$/g, "").replace(/^#{1,4}\s/, "")}
                </Text>
              );
            })}
        </Text>
      ))}
    </View>
  );
}
export function openURL(url: string, onFailure?: () => void) {
  if (!/^https?:\/\//.test(url) && !/^tel:\+?\d{2,15}$/.test(url)) {
    onFailure?.();
    return;
  }
  void Linking.openURL(url).catch(() => {
    onFailure?.();
  });
}
export function confirmAction(
  title: string,
  body: string,
  onConfirm: () => void,
  t: (key: any) => string,
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${body}`)) onConfirm();
    return;
  }
  Alert.alert(title, body, [
    { text: t("cancel"), style: "cancel" },
    { text: t("confirm"), style: "destructive", onPress: onConfirm },
  ]);
}
export const styles = StyleSheet.create({
  page: { padding: 22, paddingTop: 9, paddingBottom: 40, gap: 0 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  topbar: {
    minHeight: 54,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  button: {
    minHeight: 54,
    paddingHorizontal: 21,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  surface: { borderRadius: 24, overflow: "hidden" },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
    paddingHorizontal: 18,
    gap: 13,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  input: {
    fontSize: 16,
    lineHeight: 23,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  notice: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    marginBottom: 18,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
});
