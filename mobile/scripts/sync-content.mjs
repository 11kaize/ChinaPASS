import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const sandbox = vm.createContext({});
for (const file of ["data.js", "scene-i18n.js", "explore.js", "phrases.js"]) {
  vm.runInContext(
    fs.readFileSync(path.join(root, "demo", file), "utf8"),
    sandbox,
    { filename: file },
  );
}
const raw = vm.runInContext(
  "JSON.stringify({scenes: SCENES, groups: CARD_GROUPS, prep: PREP, faq: FAQ, cities: CITIES, shortGuides: EXPLORE_GUIDES, phrases: PHRASE_BANK})",
  sandbox,
);
const clean = (value) => {
  if (typeof value === "string")
    return value
      .replace(/China Hand/g, "ChinaHand")
      .replace(/[—–]/g, "-")
      .replace(/\p{Extended_Pictographic}\uFE0F?/gu, "")
      .trim();
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "icon")
        .map(([key, val]) => [key, clean(val)]),
    );
  return value;
};
const data = clean(JSON.parse(raw));
for (const scene of data.scenes) {
  scene.actions = scene.actions || [];
  scene.sources =
    scene.sources ||
    scene.actions
      .filter((a) => a.kind === "official")
      .map((a) => ({
        label: typeof a.label === "string" ? a.label : a.label.en,
        url: a.url,
      }));
}
data.prep.find((p) => p.id === "offline").title = {
  en: "Install ChinaHand before you fly",
  zh: "出发前安装 ChinaHand",
  ja: "出発前に ChinaHand をインストール",
  ko: "출발 전에 ChinaHand 설치",
};
data.prep.find((p) => p.id === "offline").body = {
  en: "Guides and phrase cards are bundled in the native app. Open it once, choose your city, and try your help cards in airplane mode. AI needs internet.",
  zh: "原生应用内置指南和中文卡片。打开应用、选择城市，再用飞行模式试一下卡片。AI 问答需要网络。",
  ja: "ガイドと中国語カードはアプリに内蔵されています。都市を選び、機内モードでカードを試してください。AIにはネット接続が必要です。",
  ko: "안내와 중국어 카드는 앱에 포함됩니다. 도시를 선택하고 비행기 모드에서 카드를 확인하세요. AI에는 인터넷이 필요합니다.",
};
const destination = path.join(root, "mobile/src/content/content.json");
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Synced ${data.scenes.length} scenes, ${Object.values(data.groups).reduce((n, g) => n + g.cards.length, 0)} cards and ${data.phrases.length} phrases.`,
);
