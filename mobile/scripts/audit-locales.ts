import assert from "node:assert/strict";
import { dictionaries, languageOptions } from "../src/i18n";
import { content, localize } from "../src/content";
import { arrivalStages, arrivalSources } from "../src/arrival-guide";
import { paymentHelp } from "../src/payment-help";
import { cityLabel, locationLabel } from "../src/geography";
import { uiText } from "../src/locale-ui";
import { travelServices, travelCopy } from "../src/domain/travel-services";
const languages = ["en", "zh", "ja", "ko"] as const;
let count = 0;
for (const language of languages) {
  assert.deepEqual(
    Object.keys(dictionaries[language]).sort(),
    Object.keys(dictionaries.en).sort(),
  );
  assert.equal(
    new Set(languageOptions(language).map((item) => item.label)).size,
    4,
  );
  for (const text of Object.values(dictionaries[language]))
    assert.ok(text.trim());
}
function inspect(value: unknown, path: string) {
  if (Array.isArray(value))
    return value.forEach((item, i) => inspect(item, `${path}[${i}]`));
  if (!value || typeof value !== "object") return;
  const object = value as Record<string, unknown>;
  if (typeof object.en === "string") {
    count++;
    for (const language of languages) {
      assert.equal(typeof object[language], "string", `${path}.${language}`);
      assert.ok(
        (object[language] as string).trim(),
        `${path}.${language} is empty`,
      );
      assert.ok(
        localize(object, language).trim(),
        `${path}.${language} cannot render`,
      );
    }
  }
  Object.entries(object).forEach(([key, item]) =>
    inspect(item, `${path}.${key}`),
  );
}
inspect(content, "content");
inspect(arrivalStages, "arrival");
inspect(arrivalSources, "arrivalSources");
inspect(paymentHelp, "paymentHelp");
inspect(travelServices, "travelServices");
inspect(travelCopy, "travelCopy");
for (const language of languages) {
  for (const city of content.cities) {
    assert.ok(cityLabel(city.name, language));
    for (const place of [...city.airport, ...city.stations])
      assert.ok(locationLabel(place, language));
  }
  for (const port of content.ports) assert.ok(locationLabel(port.zh, language));
  // Exact canonical keys and interpolation must not depend on another locale.
  assert.equal(
    uiText(language, "Sign in"),
    { en: "Sign in", zh: "登录", ja: "ログイン", ko: "로그인" }[language],
  );
  assert.equal(
    uiText(language, "Search for Shanghai"),
    {
      en: "Search for Shanghai",
      zh: "搜索 Shanghai",
      ja: "「Shanghai」を検索",
      ko: "Shanghai 검색",
    }[language],
  );
}
for (const phrase of content.phrases) {
  const markers = phrase.en.match(/%s/g)?.length || 0;
  for (const language of languages)
    assert.equal(
      (phrase[language]?.match(/%s/g) || []).length,
      markers,
      `template markers: ${phrase.en}/${language}`,
    );
}
console.log(
  `Locale audit passed: ${count} complete four-language records, ${Object.keys(dictionaries.en).length} core keys, ${content.phrases.length} phrase/template entries, city/port names and interpolation.`,
);
