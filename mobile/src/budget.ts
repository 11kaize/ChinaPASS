import { cnyCents } from "./talk";
import { chinaToday, validChinaDate } from "./itinerary";

export const expenseCategories = [
  "food",
  "transport",
  "stay",
  "shopping",
  "other",
] as const;
export type ExpenseCategory = (typeof expenseCategories)[number];
export type Expense = {
  id: string;
  amountCents: number;
  category: ExpenseCategory;
  date: string;
  note: string;
};
export const chinaDate = chinaToday;
export const validDate = validChinaDate;
export const money = (cents: number) =>
  `¥${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export function expenseAmount(value: string) {
  const cents = cnyCents(value);
  return cents !== null && cents > 0 ? cents : null;
}
export function sanitizeExpenses(value: unknown): Expense[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value
    .filter((item) => {
      if (
        !item ||
        typeof item.id !== "string" ||
        !item.id ||
        item.id.length > 160 ||
        ids.has(item.id) ||
        !Number.isSafeInteger(item.amountCents) ||
        item.amountCents <= 0 ||
        item.amountCents > 99_999_999 ||
        !expenseCategories.includes(item.category) ||
        typeof item.date !== "string" ||
        !validDate(item.date)
      )
        return false;
      ids.add(item.id);
      return true;
    })
    .slice(0, 200)
    .map((item) => ({
      id: item.id,
      amountCents: item.amountCents,
      category: item.category,
      date: item.date,
      note: typeof item.note === "string" ? item.note.slice(0, 200) : "",
    }));
}
