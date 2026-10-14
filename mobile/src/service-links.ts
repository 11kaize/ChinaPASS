import type { Language, ServiceAction } from "./content";
const badges = {
  official: { en: "Official", zh: "官方", ja: "公式", ko: "공식" },
  easy: {
    en: "English-friendly",
    zh: "英文友好",
    ja: "英語対応",
    ko: "영어 지원",
  },
  local: {
    en: "Chinese interface",
    zh: "中文界面",
    ja: "中国語UI",
    ko: "중국어 UI",
  },
  call: { en: "Dial", zh: "拨打", ja: "電話", ko: "전화" },
};
export function actionBadge(action: ServiceAction, language: Language): string {
  return badges[action.kind]?.[language] || String(action.kind);
}
export function actionTarget(action: ServiceAction): "web" | "call" | null {
  if (!Object.hasOwn(badges, action.kind)) return null;
  if (action.kind === "call")
    return /^tel:\+?\d{2,15}$/.test(action.url) ? "call" : null;
  try {
    const url = new URL(action.url);
    return url.protocol === "https:" && !url.username && !url.password
      ? "web"
      : null;
  } catch {
    return null;
  }
}
export function mapSearchURL(name: string): string {
  return `https://www.amap.com/search?query=${encodeURIComponent(name.replace(/（[^）]*）/g, "").trim())}`;
}
