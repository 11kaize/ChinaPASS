import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { AppState, Platform, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { Localized, localize } from "./content";
import { translate, TranslationKey } from "./i18n";
import { light, dark } from "./theme";
import { APIConfig } from "./ai/providers";
import { TripContext } from "./ai/context";
import { Preferences, freshPreferences, persistable } from "./preferences";
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  example?: boolean;
  guideId?: string;
  status?: "pending" | "complete" | "stopped" | "error";
};
const STORAGE_KEY = "chinahand.native.preferences.v1";
type State = {
  prefs: Preferences;
  update: (patch: Partial<Preferences>) => void;
  hydrated: boolean;
  storageError: boolean;
  colors: typeof light;
  isDark: boolean;
  t: (key: TranslationKey) => string;
  L: (v: Localized | undefined) => string;
  online: boolean | null;
  config: APIConfig | null;
  setConfig: (v: APIConfig | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  guideId?: string;
  setGuideId: (v: string | undefined) => void;
  tripContext: TripContext;
  disconnect: () => void;
  clearData: () => Promise<void>;
  abortRef: React.MutableRefObject<AbortController | null>;
};
const Context = createContext<State | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState(freshPreferences),
    [hydrated, setHydrated] = useState(false),
    [storageError, setStorageError] = useState(false);
  const [config, setConfig] = useState<APIConfig | null>(null),
    [messages, setMessages] = useState<Message[]>([]),
    [guideId, setGuideId] = useState<string>();
  const abortRef = useRef<AbortController | null>(null),
    writeQueue = useRef(Promise.resolve());
  const system = useColorScheme();
  const network = Network.useNetworkState();
  const online = network.isInternetReachable ?? network.isConnected ?? null;
  const isDark =
    prefs.appearance === "dark" ||
    (prefs.appearance === "system" && system === "dark");
  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw && live) {
          const parsed = JSON.parse(raw);
          const safe = {
            ...freshPreferences(),
            ...persistable({ ...freshPreferences(), ...parsed }),
          };
          if (
            !["en", "zh", "ja", "ko"].includes(safe.language) ||
            !["system", "light", "dark"].includes(safe.appearance) ||
            !["before", "arrived", "settled"].includes(safe.stage) ||
            !Array.isArray(safe.prep) ||
            !Array.isArray(safe.favorites) ||
            !Array.isArray(safe.customCards) ||
            !safe.address ||
            typeof safe.address.address !== "string" ||
            !safe.steps ||
            typeof safe.steps !== "object"
          )
            throw new Error("Invalid preferences");
          setPrefs(safe);
        }
      })
      .catch(() => {
        if (live) setStorageError(true);
      })
      .finally(() => {
        if (live) setHydrated(true);
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const serialized = JSON.stringify(persistable(prefs));
    // Serialize writes so quick changes cannot restore an older destination or preference.
    writeQueue.current = writeQueue.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serialized))
      .catch(() => {
        setStorageError(true);
      });
  }, [prefs, hydrated]);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "background") abortRef.current?.abort();
    });
    return () => {
      listener.remove();
      // This ref intentionally points to the latest request, not a mounted DOM node.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      abortRef.current?.abort();
    };
  }, []);
  const disconnect = () => {
    abortRef.current?.abort();
    setConfig(null);
    setMessages([]);
  };
  const value: State = {
    prefs,
    update: (patch) => setPrefs((p) => ({ ...p, ...patch })),
    hydrated,
    storageError,
    colors: isDark ? dark : light,
    isDark,
    t: (key) => translate(prefs.language, key),
    L: (v) => localize(v, prefs.language),
    online,
    config,
    setConfig,
    messages,
    setMessages,
    guideId,
    setGuideId,
    abortRef,
    disconnect,
    clearData: async () => {
      disconnect();
      setGuideId(undefined);
      await writeQueue.current;
      await AsyncStorage.removeItem(STORAGE_KEY);
      setPrefs(freshPreferences());
    },
    tripContext: {
      language: prefs.language,
      city: prefs.city,
      stage: prefs.stage,
      checklist: prefs.prep,
      guideId,
      completedSteps: prefs.steps,
      shareContext: prefs.shareContext,
      platform: Platform.OS,
      online,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error("AppProvider missing");
  return value;
}
