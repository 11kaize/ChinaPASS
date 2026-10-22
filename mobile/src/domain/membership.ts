export type Tier = "free" | "plus" | "pro";
export const plans = {
  free: {
    name: "Free",
    priceUSD: 0,
    period: "month",
    monthlyQuestions: 20,
    pageActions: false,
    faceToFace: false,
  },
  plus: {
    name: "Plus",
    priceUSD: 9,
    period: "month",
    monthlyQuestions: 500,
    pageActions: true,
    faceToFace: true,
  },
  pro: {
    name: "Pro",
    priceUSD: 89,
    period: "year",
    monthlyQuestions: 2000,
    pageActions: true,
    faceToFace: true,
  },
} as const;
export type Membership = { tier: Tier; expiresAt: string | null };
export type Usage = { month: string; requestIds: string[] };
export function effectiveTier(membership: Membership, now = new Date()): Tier {
  if (membership.tier === "free") return "free";
  return membership.expiresAt &&
    Date.parse(membership.expiresAt) > now.getTime()
    ? membership.tier
    : "free";
}
export function nextExpiry(
  tier: Exclude<Tier, "free">,
  now = new Date(),
): string {
  const result = new Date(now);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  if (tier === "plus") result.setUTCMonth(result.getUTCMonth() + 1);
  else result.setUTCFullYear(result.getUTCFullYear() + 1);
  const end = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, end));
  return result.toISOString();
}
export function monthKey(now = new Date()) {
  return now.toISOString().slice(0, 7);
}
export function remainingQuestions(tier: Tier, usage: Usage, now = new Date()) {
  return Math.max(
    0,
    plans[tier].monthlyQuestions -
      (usage.month === monthKey(now) ? new Set(usage.requestIds).size : 0),
  );
}
// Reserve before dispatch; refund failed/cancelled requests. Duplicate reservations are idempotent.
export function reserveQuestion(
  tier: Tier,
  usage: Usage,
  id: string,
  now = new Date(),
): Usage {
  const current =
    usage.month === monthKey(now)
      ? usage
      : { month: monthKey(now), requestIds: [] };
  if (current.requestIds.includes(id)) return current;
  if (!remainingQuestions(tier, current, now))
    throw new Error("Monthly AI allowance reached.");
  return { ...current, requestIds: [...current.requestIds, id] };
}
export function refundQuestion(usage: Usage, id: string): Usage {
  return { ...usage, requestIds: usage.requestIds.filter((x) => x !== id) };
}
