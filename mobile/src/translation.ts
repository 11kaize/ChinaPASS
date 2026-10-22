export const translationService = {
  name: "MyMemory",
  endpoint: "https://api.mymemory.translated.net/get",
  docs: "https://mymemory.translated.net/doc/spec.php",
  limits: "https://mymemory.translated.net/doc/usagelimits.php",
  terms: "https://mymemory.translated.net/terms-and-conditions",
};
export type TranslationDirection = "en-zh" | "zh-en";
export type TranslationFailure =
  | "empty"
  | "length"
  | "credential"
  | "quota"
  | "network"
  | "service"
  | "cancelled";
export class TranslationError extends Error {
  constructor(public code: TranslationFailure) {
    super(code);
  }
}
export function utf8Bytes(text: string) {
  return Array.from(text).reduce((sum, character) => {
    const code = character.codePointAt(0)!;
    return (
      sum + (code <= 0x7f ? 1 : code <= 0x7ff ? 2 : code <= 0xffff ? 3 : 4)
    );
  }, 0);
}
export function credentialLike(text: string) {
  return /\bsk-[\w-]{12,}|\bBearer\s+\S+|\b(?:api[_ -]?key|password)\s*[:=]\s*\S+/i.test(
    text,
  );
}
function decodeText(text: string) {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };
  return text.replace(
    /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi,
    (_, entity: string) => {
      if (!entity.startsWith("#")) return named[entity.toLowerCase()] || "";
      const number = /^#x/i.test(entity)
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return number >= 0 && number <= 0x10ffff
        ? String.fromCodePoint(number)
        : "";
    },
  );
}
export async function translateShortText(
  text: string,
  direction: TranslationDirection,
  signal: AbortSignal,
): Promise<string> {
  const source = text.trim();
  if (!source) throw new TranslationError("empty");
  if (utf8Bytes(source) > 500) throw new TranslationError("length");
  if (credentialLike(source)) throw new TranslationError("credential");
  const url = new URL(translationService.endpoint);
  url.searchParams.set("q", source);
  url.searchParams.set(
    "langpair",
    direction === "en-zh" ? "en|zh-CN" : "zh-CN|en",
  );
  url.searchParams.set("mt", "1");
  try {
    const response = await fetch(url.toString(), {
      signal,
      credentials: "omit",
      referrerPolicy: "no-referrer",
      cache: "no-store",
    });
    if (response.status === 429) throw new TranslationError("quota");
    if (!response.ok) throw new TranslationError("service");
    const data = await response.json();
    if (data.quotaFinished === true || Number(data.responseStatus) === 429)
      throw new TranslationError("quota");
    if (
      Number(data.responseStatus) !== 200 ||
      typeof data.responseData?.translatedText !== "string"
    )
      throw new TranslationError("service");
    const result = decodeText(data.responseData.translatedText).trim();
    if (!result || result.length > 1000) throw new TranslationError("service");
    return result;
  } catch (error) {
    if (signal.aborted) throw new TranslationError("cancelled");
    if (error instanceof TranslationError) throw error;
    throw new TranslationError("network");
  }
}
