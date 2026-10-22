import { cards, phrases } from "./content";
import { cardBlanks } from "./card-template";
import type { Preferences } from "./preferences";
export const talkCards = (prefs: Preferences) =>
  [...cards, ...phrases, ...prefs.customCards].filter(
    (card) => cardBlanks(card.zh).length === 0,
  );
export const generalReplies = [
  { zh: "请稍等", en: "Please wait", icon: "info" },
  { zh: "请跟我来", en: "Please follow me", icon: "arrow" },
  { zh: "请看这里", en: "Please look here", icon: "cards" },
  { zh: "我不清楚", en: "I’m not sure", icon: "help" },
  { zh: "请写下来", en: "Please write it down", icon: "prep" },
  { zh: "已经处理好了", en: "It has been taken care of", icon: "check" },
];
export function yesNoReplies(question: string) {
  if (/(?:可以|能不能|能.*吗|可不可以)/.test(question))
    return [
      { zh: "可以", en: "Yes", icon: "check" },
      { zh: "不可以", en: "No", icon: "close" },
    ];
  if (/(?:有没有|有.*吗)/.test(question))
    return [
      { zh: "有", en: "Yes", icon: "check" },
      { zh: "没有", en: "No", icon: "close" },
    ];
  if (/(?:吗|是否|是不是)/.test(question))
    return [
      { zh: "是的", en: "Yes", icon: "check" },
      { zh: "不是", en: "No", icon: "close" },
    ];
  return [];
}
export function cnyCents(value: string): number | null {
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, decimals = ""] = value.trim().split(".");
  return Number(whole) * 100 + Number(decimals.padEnd(2, "0"));
}
