import { uiText } from "./locale-ui";
import { cityLabel, locationLabel } from "./geography";
import { arrivalGuideTitle, arrivalStages } from "./arrival-guide";
import { paymentHelp } from "./payment-help";
import {
  cards,
  phrases,
  content,
  localize,
  type Language,
  type Localized,
  type Phrase,
  type Scene,
} from "./content";

export type SearchGroup = "guides" | "faq" | "cards" | "phrases" | "places";
export type GuideSection = {
  id: string;
  title: string;
  body: string;
  step?: number;
};
export type OfflineEntry = {
  id: string;
  group: SearchGroup;
  title: string;
  body: string;
  searchable: string;
  destination?: { pathname: string; params?: Record<string, string> };
  cityId?: string;
  collapse?: string;
};
const plain = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
function allText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(allText).join(" ");
  if (value && typeof value === "object")
    return Object.values(value).map(allText).join(" ");
  return "";
}
const normalize = (value: string) =>
  plain(value).normalize("NFKC").toLocaleLowerCase();
export function guideSections(
  scene: Scene,
  language: Language,
): GuideSection[] {
  const L = (value: Localized) => plain(localize(value, language));
  const sections = [
    {
      id: "overview",
      title: uiText(language, "Overview"),
      body: L(scene.task),
    },
    {
      id: "before",
      title: uiText(language, "Before you start"),
      body: scene.before.map(L).join(" · "),
    },
    {
      id: "tip",
      title: uiText(language, "Useful tip"),
      body: scene.tip ? L(scene.tip) : "",
    },
    ...scene.steps.map((step, i) => ({
      id: `step-${i}`,
      title: L(step.t),
      body: L(step.d),
      step: i,
    })),
    {
      id: "plan-b",
      title: uiText(language, "Plan B"),
      body: scene.planB.map(L).join(" · "),
    },
    {
      id: "trouble",
      title: uiText(language, "Troubleshooting"),
      body: scene.trouble
        .map((item) => `${L(item.p)} ${L(item.a)}`)
        .join(" · "),
    },
    {
      id: "mistakes",
      title: uiText(language, "Common mistakes"),
      body: scene.mistakes
        .map((item) => `${L(item.m)} ${L(item.w)} ${L(item.d)}`)
        .join(" · "),
    },
  ].filter((section) => section.body);
  return scene.id === "pay"
    ? [
        ...sections.filter(
          (section) => !["plan-b", "trouble", "mistakes"].includes(section.id),
        ),
        ...paymentHelp.map((item, i) => ({
          id: `payment-help-${i}`,
          title: plain(localize(item.title, language)),
          body: plain(localize(item.body, language)),
        })),
      ]
    : sections;
}
export function buildOfflineIndex(
  language: Language,
  customCards: Phrase[] = [],
): OfflineEntry[] {
  const entries: OfflineEntry[] = arrivalStages.map((stage) => ({
    id: `arrival:${stage.id}`,
    group: "guides",
    title: `${localize(arrivalGuideTitle, language)} · ${localize(stage.title, language)}`,
    body: localize(stage.body, language),
    searchable: allText(stage),
    destination: { pathname: "/arrival" },
    collapse: "arrival",
  }));
  for (const scene of content.scenes) {
    const variants = (["en", "zh", "ja", "ko"] as Language[]).map((lang) =>
      guideSections(scene, lang),
    );
    for (const section of guideSections(scene, language)) {
      entries.push({
        id: `guide:${scene.id}:${section.id}`,
        group: "guides",
        title: `${localize(scene.title, language)} · ${section.title}`,
        body: section.body,
        searchable: `${allText(scene.title)} ${allText(scene.subtitle)} ${variants
          .map((sections) => {
            const item = sections.find((s) => s.id === section.id);
            return item ? `${item.title} ${item.body}` : "";
          })
          .join(" ")}`,
        destination: {
          pathname: `/guide/${scene.id}`,
          params: { match: section.id },
        },
        collapse: `guide:${scene.id}`,
      });
    }
  }
  for (const guide of content.shortGuides) {
    guide.steps.forEach(([title, body], i) =>
      entries.push({
        id: `short:${guide.id}:${i}`,
        group: "guides",
        title: `${localize(guide.title, language)} · ${localize(title, language)}`,
        body: localize(body, language),
        searchable: allText(guide),
        destination: {
          pathname: `/guide/${guide.id}`,
          params: { match: `step-${i}` },
        },
        collapse: `guide:${guide.id}`,
      }),
    );
  }
  content.faq.forEach((faq, i) =>
    entries.push({
      id: `faq:${i}`,
      group: "faq",
      title: plain(localize(faq.q, language)),
      body: plain(localize(faq.a, language)),
      searchable: allText(faq),
      destination: { pathname: "/faq", params: { item: String(i) } },
    }),
  );
  for (const [group, bank] of [
    ["cards", [...cards, ...customCards]],
    ["phrases", phrases],
  ] as const) {
    for (const card of bank)
      entries.push({
        id: `${group}:${card.id}`,
        group,
        title:
          language === "zh"
            ? card.zh
            : localize({ en: card.en, ja: card.ja, ko: card.ko }, language) ||
              card.zh,
        body: uiText(language, "Show in Chinese"),
        searchable: allText(card),
        destination: { pathname: "/card", params: { id: card.id } },
      });
  }
  for (const city of content.cities)
    entries.push({
      id: `city:${city.id}`,
      group: "places",
      title: cityLabel(city.name, language),
      body: localize(city.note, language),
      searchable: allText(city),
      cityId: city.id,
    });
  for (const port of content.ports)
    entries.push({
      id: `port:${port.id}`,
      group: "places",
      title: `${locationLabel(port.zh, language)}${port.iata ? ` · ${port.iata}` : ""}`,
      body: port.city
        ? cityLabel(port.city, language)
        : uiText(language, "Hong Kong"),
      searchable: allText(port),
      destination: { pathname: "/card", params: { kind: "port", id: port.id } },
    });
  return entries;
}
export function searchOffline(
  index: OfflineEntry[],
  query: string,
): OfflineEntry[] {
  const normalized = normalize(query).slice(0, 200);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const seen = new Set<string>();
  return index
    .map((entry) => {
      const text = normalize(entry.searchable),
        title = normalize(entry.title);
      const score = tokens.every((token) => text.includes(token))
        ? (title.includes(normalized) ? 12 : 0) +
          tokens.reduce(
            (sum, token) => sum + (title.includes(token) ? 3 : 1),
            0,
          ) +
          (text.includes(normalized) ? 2 : 0)
        : 0;
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id))
    .filter(({ entry }) => {
      const key = entry.collapse || entry.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(({ entry }) => entry);
}
export function searchExcerpt(text: string, query: string, length = 145) {
  const value = plain(text),
    lower = normalize(value);
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const positions = words
    .map((word) => lower.indexOf(word))
    .filter((i) => i >= 0);
  const exact = lower.indexOf(normalize(query));
  const start = Math.max(
    0,
    (exact >= 0 ? exact : positions.length ? Math.min(...positions) : 0) - 35,
  );
  return `${start ? "…" : ""}${value.slice(start, start + length)}${value.length > start + length ? "…" : ""}`;
}
