import type { Language } from "./content";
import reviewed from "./locales/reviewed.json";
import { dictionaries } from "./i18n";

type Entry = Record<Language, string>;
const merged: Record<string, Entry> = { ...reviewed } as Record<string, Entry>;
for (const key of Object.keys(
  dictionaries.en,
) as (keyof typeof dictionaries.en)[]) {
  const item = Object.fromEntries(
    (["en", "zh", "ja", "ko"] as const).map((lang) => [
      lang,
      dictionaries[lang][key],
    ]),
  ) as Entry;
  merged[item.en] = item;
}
const entries = Object.values(merged);
const normalize = (s: string) => s.trim().replace(/\s+/g, " ");
const index = new Map<string, Entry>();
for (const item of entries)
  for (const language of ["en", "zh", "ja", "ko"] as const)
    if (item[language]) index.set(normalize(item[language]), item);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const patterns: { expression: RegExp; item: Entry; order: number[] }[] = [];
for (const item of entries)
  for (const language of ["en", "zh", "ja", "ko"] as const) {
    const source = item[language];
    if (!source || !/\{\d+\}/.test(source)) continue;
    const order: number[] = [];
    const parts = normalize(source).split(/(\{\d+\})/);
    const expression = parts
      .map((part) =>
        /^\{\d+\}$/.test(part)
          ? (order.push(Number(part.slice(1, -1))), "(.+?)")
          : escape(part),
      )
      .join("");
    patterns.push({ expression: new RegExp(`^${expression}$`), item, order });
  }
// Static UI copy only. User-authored text and Chinese show-cards opt out at
// their rendering boundary; no request, storage write or runtime translation.
export function uiText(language: Language, text: string): string {
  const key = normalize(text),
    entry = index.get(key);
  if (entry?.[language]) return entry[language];
  for (const pattern of patterns) {
    const match = pattern.expression.exec(key);
    if (!match) continue;
    const values: Record<number, string> = {};
    pattern.order.forEach((id, i) => (values[id] = match[i + 1]));
    return pattern.item[language].replace(
      /\{(\d+)\}/g,
      (_, id) => values[Number(id)] || "",
    );
  }
  return text;
}
export const localeTag = (language: Language) =>
  ({ en: "en-US", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR" })[language];
