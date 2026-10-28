import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  appPages,
  parsePageActions,
  retrievePages,
  transportModes,
} from "../src/domain/navigation";
import {
  effectiveTier,
  nextExpiry,
  remainingQuestions,
  reserveQuestion,
  refundQuestion,
  plans,
} from "../src/domain/membership";
import {
  hotPosts,
  hotScore,
  isFeatured,
  seedPosts,
  searchPosts,
  toggleLike,
  toggleSave,
  validatePost,
} from "../src/domain/community";
const now = new Date("2026-10-21T12:00:00Z");
test("prices, membership expiration and end-of-month billing calendar", () => {
  assert.equal(plans.plus.priceUSD, 9);
  assert.equal(plans.pro.priceUSD, 89);
  assert.equal(plans.pro.period, "year");
  assert.equal(
    nextExpiry("plus", new Date("2026-01-31T12:00:00Z")),
    "2026-02-28T12:00:00.000Z",
  );
  assert.equal(
    nextExpiry("pro", new Date("2024-02-29T12:00:00Z")),
    "2025-02-28T12:00:00.000Z",
  );
  assert.equal(
    effectiveTier({ tier: "pro", expiresAt: "2026-10-20T00:00:00Z" }, now),
    "free",
  );
  assert.equal(
    effectiveTier({ tier: "plus", expiresAt: "2026-11-01T00:00:00Z" }, now),
    "plus",
  );
});
test("AI reservations are idempotent, bounded, refundable, and reset monthly", () => {
  let usage = { month: "2026-10", requestIds: [] as string[] };
  for (let i = 0; i < plans.free.monthlyQuestions; i++)
    usage = reserveQuestion("free", usage, `request-${i}`, now);
  assert.equal(remainingQuestions("free", usage, now), 0);
  assert.throws(() => reserveQuestion("free", usage, "one-too-many", now));
  assert.equal(
    reserveQuestion("free", usage, "request-0", now).requestIds.length,
    plans.free.monthlyQuestions,
  );
  usage = refundQuestion(usage, "request-0");
  assert.equal(remainingQuestions("free", usage, now), 1);
  assert.equal(
    reserveQuestion("free", usage, "new-month", new Date("2026-11-01"))
      .requestIds.length,
    1,
  );
});
test("transport is a single shortcut with three preserved child guides", () => {
  assert.deepEqual(
    transportModes.map((m) => m.id),
    ["taxi", "metro", "train"],
  );
  assert.equal(appPages.filter((p) => p.id === "transport").length, 1);
  for (const p of appPages) {
    const route = p.path.split("?")[0];
    if (route.startsWith("/guide/"))
      assert(existsSync("src/app/guide/[id].tsx"));
    else if (
      ["/", "/guides", "/cards", "/chat", "/settings", "/community"].includes(
        route,
      )
    )
      assert(
        existsSync(
          `src/app/(tabs)/${route === "/" ? "index" : route.slice(1)}.tsx`,
        ),
      );
    else assert(existsSync(`src/app${route}.tsx`), route);
  }
});
test("navigation buttons require explicit model markers and only allow trusted destinations", () => {
  assert.equal(
    parsePageActions("You can find police numbers in emergency help.").actions
      .length,
    0,
  );
  const answer = parsePageActions(
    "Call 110 for police. [[chinabuddy:emergency]] [[chinabuddy:emergency]] [[chinabuddy:made-up]]",
  );
  assert.deepEqual(
    answer.actions.map((p) => p.path),
    ["/emergency"],
  );
  assert.equal(answer.text, "Call 110 for police.");
  assert.equal(
    parsePageActions(
      "[[chinabuddy:home]] [[chinabuddy:cards]] [[chinabuddy:profile]] [[chinabuddy:transport]]",
    ).actions.length,
    3,
  );
  assert(retrievePages("在哪里找报警电话").some((p) => p.id === "emergency"));
  assert(
    retrievePages("I need a charger at the airport").some(
      (p) => p.id === "community-help",
    ),
  );
});
test("featured posts exceed 100k likes; search is normalized; likes and saves toggle once", () => {
  const posts = seedPosts(),
    post = posts.find((p) => p.category === "experience")!;
  assert(isFeatured(post));
  assert(!isFeatured({ ...post, baseLikes: 100000 }));
  assert(!isFeatured({ ...post, review: "pending" }));
  const liked = toggleLike(post, "user");
  assert.equal(liked.likedBy.length, 1);
  assert.equal(toggleLike(liked, "user").likedBy.length, 0);
  const saved = toggleSave(post, "user");
  assert.equal(saved.savedBy?.length, 1);
  assert.equal(toggleSave(saved, "user").savedBy?.length, 0);
  assert(searchPosts(posts, "PVG").some((p) => p.id === "sample-airport"));
  assert.equal(
    validatePost({ ...post, title: "" }),
    "Use a title between 3 and 100 characters.",
  );
});
test("hot ranking uses recent weighted activity, time decay and a maximum ten entries", () => {
  const base = { ...seedPosts()[0], sample: false, baseLikes: 900000 };
  assert.equal(hotScore({ ...base, activity: [] }, now), 0);
  const activity = [
    { kind: "like" as const, actor: "a", at: now.toISOString() },
    { kind: "save" as const, actor: "b", at: now.toISOString() },
    { kind: "reply" as const, actor: "c", at: now.toISOString() },
  ];
  assert.equal(hotScore({ ...base, activity }, now), 6);
  assert.equal(
    hotScore(
      {
        ...base,
        activity: activity.map((a) => ({ ...a, at: "2026-10-10T00:00:00Z" })),
      },
      now,
    ),
    0,
  );
  const many = Array.from({ length: 20 }, (_, i) => ({
    ...base,
    id: String(i),
    activity: activity.slice(0, (i % 3) + 1),
  }));
  assert.equal(hotPosts(many, now).length, 10);
  assert(
    hotScore(hotPosts(many, now)[0], now) >=
      hotScore(hotPosts(many, now)[9], now),
  );
});
