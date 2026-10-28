import {
  guideRevisions,
  shortGuideRevisions,
  cityNoteRevisions,
  officialSourceLabel,
  preparationBodies,
  faqRevisions,
} from "../content/guide-revisions.mjs";
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
  "JSON.stringify({scenes: SCENES, groups: CARD_GROUPS, prep: PREP, faq: FAQ, cities: CITIES, ports: PORTS, cityLabels: CITY_BOXES.map(({city,zh,ja,ko}) => ({city,zh,ja,ko})), arrivalLabels: Object.fromEntries(Object.entries(UI).map(([lang,labels]) => [lang,Object.fromEntries(['whereLanded','whereLandedHint','changePort','yourRoute','routeArrivalDay','routeLater','youAreHere','portAir','portSea','portRail','portLand','portNoDetail','portOfficialList'].map(key => [key,labels[key]]))])), shortGuides: EXPLORE_GUIDES, phrases: PHRASE_BANK})",
  sandbox,
);
const clean = (value) => {
  if (typeof value === "string")
    return value
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
  Object.assign(scene, guideRevisions[scene.id] || {});
  scene.actions = scene.actions || [];
  for (const action of scene.actions) {
    if (action.note?.zh)
      action.note.zh = action.note.zh.replace(/\bApp\b/gi, "应用");
  }
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
  en: "Install ChinaBuddy before you fly",
  zh: "出发前安装 ChinaBuddy",
  ja: "出発前に ChinaBuddy をインストール",
  ko: "출발 전에 ChinaBuddy 설치",
};
data.prep.find((p) => p.id === "offline").body = {
  en: "Guides and phrase cards are bundled in the native app. Open it once, choose your city, and try your help cards in airplane mode. AI needs internet.",
  zh: "原生应用内置指南和中文卡片。打开应用、选择城市，再用飞行模式试一下卡片。AI 问答需要网络。",
  ja: "ガイドと中国語カードはアプリに内蔵されています。都市を選び、機内モードでカードを試してください。AIにはネット接続が必要です。",
  ko: "안내와 중국어 카드는 앱에 포함됩니다. 도시를 선택하고 비행기 모드에서 카드를 확인하세요. AI에는 인터넷이 필요합니다.",
};
for (const item of data.prep)
  if (preparationBodies[item.id]) item.body = preparationBodies[item.id];
data.faq = faqRevisions;
for (const guide of data.shortGuides) {
  Object.assign(guide, shortGuideRevisions[guide.id] || {});
  guide.source.label = officialSourceLabel;
}
for (const city of data.cities) {
  city.note = cityNoteRevisions[city.id] || city.note;
  city.source.label = officialSourceLabel;
}
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "mobile/src/locales/reviewed.json"), "utf8"),
);
const missingLocales = [];
function completeLocales(value) {
  if (Array.isArray(value)) return value.map(completeLocales);
  if (value && typeof value === "object") {
    const result = Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, completeLocales(item)]),
    );
    if (typeof result.en === "string")
      for (const language of ["zh", "ja", "ko"]) {
        result[language] ||= catalog[result.en]?.[language];
        if (!result[language]) missingLocales.push(`${language}: ${result.en}`);
      }
    return result;
  }
  return value;
}
const complete = completeLocales(data);
if (missingLocales.length)
  throw new Error(
    "Missing locale copy:\n" + [...new Set(missingLocales)].join("\n"),
  );
const destination = path.join(root, "mobile/src/content/content.json");
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, JSON.stringify(complete, null, 2) + "\n");
console.log(
  `Synced ${data.scenes.length} scenes, ${Object.values(data.groups).reduce((n, g) => n + g.cards.length, 0)} cards and ${data.phrases.length} phrases.`,
);
