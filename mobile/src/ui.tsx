import { dictionaries } from "./i18n";
import { uiText } from "./locale-ui";
import { backOrReplace } from "./navigation-back";
import { artwork } from "./artwork";
import { LinearGradient } from "expo-linear-gradient";
import { useReducedMotion } from "./motion";
import { PageMotion } from "./page-motion";
import { MorphGlyph } from "./morph-icon";
import { motionIcons } from "./generated/motion-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Easing,
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
import { router } from "expo-router";
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
import { CaretDown } from "phosphor-react-native/src/icons/CaretDown";
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
import { PencilSimple } from "phosphor-react-native/src/icons/PencilSimple";
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
import { Copy } from "phosphor-react-native/src/icons/Copy";
export { useReducedMotion } from "./motion";

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
  edit: PencilSimple,
  copy: Copy,
  check: Check,
  checked: CheckCircle,
  unchecked: CircleIcon,
  checks: Checks,
  arrow: ArrowRight,
  back: ArrowLeft,
  next: CaretRight,
  down: CaretDown,
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
  animated = name === "checked" || name === "unchecked",
}: {
  name: string;
  size?: number;
  color?: string;
  weight?: "regular" | "fill" | "bold";
  animated?: boolean;
}) {
  const { colors } = useApp();
  const shape = animated ? motionIcons[`${name}:${weight}`] : undefined;
  if (shape)
    return (
      <MorphGlyph shape={shape} size={size} color={color || colors.accent} />
    );
  const Component = icons[name] || Info;
  return (
    <Component size={size} color={color || colors.accent} weight={weight} />
  );
}
export function useMotionValue(initial: number) {
  return useState(() => new Animated.Value(initial))[0];
}
export function Txt({
  children,
  variant = "body",
  color,
  style,
  numberOfLines,
  selectable = false,
  verbatim = false,
}: {
  children: React.ReactNode;
  variant?: "body" | "title" | "heading" | "subheading" | "caption" | "label";
  color?: string;
  style?: any;
  numberOfLines?: number;
  selectable?: boolean;
  verbatim?: boolean;
}) {
  const { colors, prefs } = useApp();
  const text = (child: React.ReactNode): React.ReactNode =>
    typeof child === "string" && !verbatim
      ? uiText(prefs.language, child)
      : Array.isArray(child)
        ? child.map(text)
        : child;
  return (
    <Text
      selectable={selectable}
      numberOfLines={numberOfLines}
      style={[type[variant], { color: color || colors.ink }, style]}
    >
      {text(children)}
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
  expanded,
  testID,
  verbatim = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  label: string;
  disabled?: boolean;
  selected?: boolean;
  expanded?: boolean;
  testID?: string;
  verbatim?: boolean;
}) {
  const { prefs } = useApp();
  const scale = useMotionValue(1);
  const reduced = useReducedMotion();
  const press = (value: number) => {
    if (Platform.OS === "web") return;
    scale.stopAnimation();
    if (reduced) {
      scale.setValue(1);
      return;
    }
    Animated.timing(scale, {
      toValue: value,
      duration: value === 1 ? 180 : 100,
      easing: Easing.out(Easing.cubic),
      isInteraction: false,
      useNativeDriver: true,
    }).start();
  };
  const layout = StyleSheet.flatten(style) || {};
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={verbatim ? label : uiText(prefs.language, label)}
      accessibilityState={{ disabled, selected, expanded }}
      aria-selected={selected}
      aria-expanded={expanded}
      disabled={disabled}
      testID={testID}
      onPressIn={() => press(0.98)}
      onPressOut={() => press(1)}
      onPress={() => {
        if (Platform.OS !== "web")
          void Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={{
        opacity: disabled ? 0.48 : 1,
        ...(layout.flex !== undefined ? { flex: layout.flex } : {}),
      }}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            style,
            Platform.OS === "web"
              ? ({
                  transform: [{ scale: !reduced && pressed ? 0.985 : 1 }],
                  transitionProperty: "transform",
                  transitionDuration: reduced
                    ? "0ms"
                    : pressed
                      ? "100ms"
                      : "180ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                } as ViewStyle)
              : { transform: [{ scale }] },
          ]}
        >
          {children}
        </Animated.View>
      )}
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
  selected,
  animated = selected !== undefined,
}: {
  label: string;
  onPress: () => void;
  icon?: string;
  secondary?: boolean;
  disabled?: boolean;
  danger?: boolean;
  selected?: boolean;
  animated?: boolean;
}) {
  const { colors } = useApp();
  const ink = danger ? colors.danger : secondary ? colors.accent : "#FFFFFF";
  return (
    <Tap
      label={label}
      onPress={onPress}
      disabled={disabled}
      selected={selected}
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
      <Icon
        name={icon}
        size={18}
        color={ink}
        animated={animated}
        weight={selected ? "fill" : "regular"}
      />
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
          animated={name === "save" || name === "heart"}
        />
      </View>
    </Tap>
  );
}
export function Brand({ large = false }: { large?: boolean }) {
  return (
    <Image
      source={artwork.brand}
      accessibilityLabel="ChinaBuddy"
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
          onPress={() => backOrReplace(router)}
        />
      ) : (
        <View style={styles.row}>
          <Brand />
          <Txt variant="subheading">ChinaBuddy</Txt>
        </View>
      )}
      {title ? (
        <Txt variant="label" style={{ flex: 1, textAlign: "center" }}>
          {title}
        </Txt>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {!back && (
        <IconButton
          name="search"
          label="Search all of ChinaBuddy"
          onPress={() => router.push("/search")}
        />
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
  headerScrolls = false,
}: {
  children: React.ReactNode;
  title?: string;
  back?: boolean;
  scroll?: boolean;
  backdrop?: ImageSourcePropType;
  header?: React.ReactNode;
  headerScrolls?: boolean;
}) {
  const { colors, isDark, prefs } = useApp();
  const scrollingHeader = scroll && headerScrolls && Boolean(header);
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
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <Image
        source={backdrop || (isDark ? artwork.homeNight : artwork.homeDay)}
        resizeMode="cover"
        accessibilityLabel={uiText(
          prefs.language,
          isDark
            ? "Shanghai night skyline background"
            : "Shanghai morning skyline background",
        )}
        style={[
          StyleSheet.absoluteFill,
          { width: "100%", height: "100%", opacity: backdrop ? 0.8 : 0.15 },
        ]}
      />
      {!scrollingHeader && (header || <TopBar title={title} back={back} />)}
      <PageMotion
        style={{
          flex: 1,
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
            {scrollingHeader && (
              <View
                style={{
                  marginHorizontal: -22,
                  marginTop: -9,
                  marginBottom: 9,
                }}
              >
                {header}
              </View>
            )}
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
      </PageMotion>
    </SafeAreaView>
  );
}
export function Heading({
  title,
  body,
  verbatim = false,
}: {
  title: string;
  body?: string;
  verbatim?: boolean;
}) {
  const { colors } = useApp();
  return (
    <View style={{ gap: 7, marginTop: 6, marginBottom: 20 }}>
      <Txt variant="title" verbatim={verbatim}>
        {title}
      </Txt>
      {body && (
        <Txt verbatim={verbatim} color={colors.secondary}>
          {body}
        </Txt>
      )}
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
  expanded,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  last?: boolean;
  expanded?: boolean;
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
        (onPress && (
          <Icon
            name={expanded ? "down" : "next"}
            animated={expanded !== undefined}
            size={18}
            color={colors.secondary}
          />
        ))}
    </View>
  );
  return onPress ? (
    <Tap label={title} onPress={onPress} expanded={expanded}>
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
  const { colors, prefs } = useApp();
  const input = useRef<TextInput>(null);
  return (
    <View style={{ gap: 8, marginBottom: 20 }}>
      <Txt variant="caption" color={colors.secondary}>
        {label}
      </Txt>
      <View style={[styles.search, { backgroundColor: colors.raised }]}>
        <Pressable
          accessibilityRole={value ? "button" : undefined}
          accessibilityLabel={uiText(prefs.language, "Clear search")}
          accessible={!!value}
          disabled={!value}
          onPress={() => {
            onChange("");
            input.current?.focus();
          }}
          style={{
            width: 44,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            name={value ? "close" : "search"}
            animated
            size={20}
            color={colors.secondary}
          />
        </Pressable>
        <TextInput
          ref={input}
          accessibilityLabel={uiText(prefs.language, label)}
          placeholder={uiText(prefs.language, label)}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
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
  const { colors, prefs } = useApp();
  return (
    <View style={{ gap: 8, marginBottom: 19 }}>
      <Txt variant="label">{label}</Txt>
      <TextInput
        accessibilityLabel={uiText(prefs.language, label)}
        placeholderTextColor={colors.placeholder}
        {...props}
        placeholder={
          props.placeholder
            ? uiText(prefs.language, props.placeholder)
            : undefined
        }
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
  verbatim = false,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  verbatim?: boolean;
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
          verbatim={verbatim}
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
            verbatim={verbatim}
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
  const language =
    (["en", "zh", "ja", "ko"] as const).find(
      (lang) => dictionaries[lang].cancel === t("cancel"),
    ) || "en";
  title = uiText(language, title);
  body = uiText(language, body);
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
