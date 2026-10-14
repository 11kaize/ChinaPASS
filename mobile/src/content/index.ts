import raw from "./content.json";
export type Language = "en" | "zh" | "ja" | "ko";
export type Localized = string | Partial<Record<Language, string>>;
export type ActionKind = "official" | "easy" | "local" | "call";
export type ServiceAction = {
  kind: ActionKind;
  url: string;
  label: Localized;
  note?: Localized;
};
export type Phrase = {
  id: string;
  zh: string;
  en: string;
  ja?: string;
  ko?: string;
  cat: string;
  keys?: string;
  custom?: boolean;
};
export type Scene = {
  id: string;
  title: Localized;
  subtitle: Localized;
  category: Localized;
  eta: Localized;
  task: Localized;
  before: Localized[];
  tip?: Localized;
  steps: { t: Localized; d: Localized }[];
  mistakes: { m: Localized; w: Localized; d: Localized }[];
  planB: Localized[];
  trouble: { p: Localized; a: Localized }[];
  showCard?: { title: Localized; lines: string[] };
  cardGroup?: string;
  lastUpdated: string;
  sources: { label: string; url: string }[];
  actions: ServiceAction[];
  disclaimer?: Localized;
};
export type ArrivalPort = { id: string; kind: "air" | "rail" | "sea" | "land"; zh: string; iata?: string; city?: string; cityZh?: string };
export const content = raw as unknown as {
  scenes: Scene[];
  ports: ArrivalPort[];
  cityLabels: { city: string; zh: string; ja: string; ko: string }[];
  arrivalLabels: Record<Language, Record<string,string>>;
  groups: Record<
    string,
    { title: Localized; hint: Localized; cards: Omit<Phrase, "id" | "cat">[] }
  >;
  prep: { id: string; title: Localized; body: Localized }[];
  faq: { q: Localized; a: Localized }[];
  cities: {
    id: string;
    name: string;
    zh: string;
    airport: string[];
    stations: string[];
    note: string;
    source: { label: string; url: string };
  }[];
  shortGuides: {
    id: string;
    title: string;
    summary: string;
    steps: [string, string][];
    source: { label: string; url: string };
  }[];
  phrases: Omit<Phrase, "id">[];
};
export const localize = (
  value: Localized | undefined,
  lang: Language,
): string =>
  typeof value === "string" ? value : value?.[lang] || value?.en || "";
export const cards: Phrase[] = Object.entries(content.groups).flatMap(
  ([cat, group]) =>
    group.cards.map((card, index) => ({ ...card, cat, id: `${cat}-${index}` })),
);
export const phrases: Phrase[] = content.phrases.map((phrase, index) => ({
  ...phrase,
  id: `phrase-${index}`,
}));
export const orderedScenes = [
  "customs",
  "sim",
  "pay",
  "taxi",
  "hotel",
  "metro",
  "train",
  "food",
  "emergency",
].map((id) => content.scenes.find((s) => s.id === id)!);
export function searchPhrases(query: string, bank: Phrase[]): Phrase[] {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return bank;
  return bank
    .map((p) => {
      const text =
        `${p.en} ${p.zh} ${p.ja || ""} ${p.ko || ""} ${p.keys || ""}`.toLocaleLowerCase();
      const score = words.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((p) => p.score === words.length)
    .sort((a, b) => b.score - a.score)
    .map((p) => p.p);
}
