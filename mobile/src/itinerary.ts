export type ItineraryItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  placeId: string | null;
  note: string;
  done: boolean;
};
export type ItineraryDraft = Omit<ItineraryItem, "id" | "done">;
export const itineraryLimit = 100;
export function validChinaDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
  return (
    day <=
    [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
  );
}
export const validChinaTime = (value: string) =>
  /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
export function validateItinerary(
  value: ItineraryDraft,
): "title" | "date" | "time" | "note" | null {
  if (!value.title.trim() || value.title.trim().length > 100) return "title";
  if (!validChinaDate(value.date)) return "date";
  if (!validChinaTime(value.time)) return "time";
  if (value.note.length > 500) return "note";
  return null;
}
export function chinaToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value || "";
  return `${part("year").padStart(4, "0")}-${part("month")}-${part("day")}`;
}
export function sortItinerary(items: ItineraryItem[]) {
  return [...items].sort(
    (a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`) ||
      a.id.localeCompare(b.id),
  );
}
// Whitelist only itinerary fields. Never spread saved objects into preferences.
export function persistableItinerary(input: unknown): ItineraryItem[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  return input.slice(0, itineraryLimit).flatMap((value): ItineraryItem[] => {
    if (
      !value ||
      typeof value.id !== "string" ||
      !value.id ||
      value.id.length > 160 ||
      seen.has(value.id) ||
      typeof value.title !== "string" ||
      typeof value.date !== "string" ||
      typeof value.time !== "string" ||
      typeof value.note !== "string"
    )
      return [];
    const item: ItineraryItem = {
      id: value.id,
      title: value.title.trim(),
      date: value.date,
      time: value.time,
      placeId:
        typeof value.placeId === "string" && value.placeId.length <= 160
          ? value.placeId
          : null,
      note: value.note.trim(),
      done: value.done === true,
    };
    if (validateItinerary(item)) return [];
    seen.add(item.id);
    return [item];
  });
}
export const sanitizeItinerary = persistableItinerary;
