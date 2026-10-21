import type { Tier, Membership, Usage } from "./membership";
export type Media = {
  id: string;
  uri: string;
  type: "image" | "video";
  mime: string;
  name: string;
};
export type Profile = {
  id: string;
  name: string;
  email: string;
  membership: Membership;
  usage: Usage;
};
export type Reply = {
  id: string;
  authorId: string;
  authorName: string;
  tier: Tier;
  body: string;
  createdAt: string;
};
export type Activity = {
  kind: "like" | "save" | "reply";
  actor: string;
  at: string;
};
export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  tier: Tier;
  title: string;
  body: string;
  city: string;
  category: "help" | "experience";
  media: Media[];
  likedBy: string[];
  savedBy?: string[];
  activity?: Activity[];
  sampleRecent?: { likes: number; saves: number; replies: number; at: string };
  baseLikes: number;
  replies: Reply[];
  review: "unreviewed" | "pending" | "approved" | "rejected";
  sample?: boolean;
  createdAt: string;
};
export function likeCount(post: Post) {
  return Math.max(0, post.baseLikes) + new Set(post.likedBy).size;
}
export function isFeatured(post: Post) {
  return (
    post.category === "experience" &&
    likeCount(post) > 100000 &&
    post.review === "approved"
  );
}
export function toggleLike(post: Post, userId: string): Post {
  if (!userId) throw new Error("Sign in to like a post.");
  return {
    ...post,
    likedBy: post.likedBy.includes(userId)
      ? post.likedBy.filter((id) => id !== userId)
      : [...post.likedBy, userId],
    activity: post.likedBy.includes(userId)
      ? (post.activity || []).filter(
          (a) => !(a.actor === userId && a.kind === "like"),
        )
      : [
          ...(post.activity || []),
          { kind: "like", actor: userId, at: new Date().toISOString() },
        ],
  };
}
export function validatePost(
  post: Pick<Post, "title" | "body" | "city" | "media">,
): string | null {
  if (post.title.trim().length < 3 || post.title.trim().length > 100)
    return "Use a title between 3 and 100 characters.";
  if (!post.body.trim() || post.body.length > 5000)
    return "Add your experience or question (up to 5,000 characters).";
  if (post.city.length > 100) return "Keep the location under 100 characters.";
  if (post.media.length > 6) return "Attach up to six photos or videos.";
  return null;
}
export function seedPosts(): Post[] {
  const shared = {
    media: [],
    likedBy: [],
    replies: [],
    review: "unreviewed" as const,
    sample: true,
    createdAt: "2026-10-21T02:00:00.000Z",
  };
  return [
    {
      ...shared,
      id: "sample-airport",
      authorId: "sample-sarah",
      authorName: "Sarah",
      tier: "plus",
      title: "Just landed at PVG. Where can I charge my phone?",
      body: "I am near the arrivals meeting point in Terminal 2. Does anyone know where the public charging points are? Please do not share private contact information here.",
      city: "Shanghai · PVG T2",
      category: "help",
      baseLikes: 28,
      sampleRecent: {
        likes: 28,
        saves: 6,
        replies: 4,
        at: "2026-10-21T02:00:00.000Z",
      },
    },
    {
      ...shared,
      id: "sample-food",
      authorId: "sample-chen",
      authorName: "Chen",
      tier: "pro",
      title: "A little less on delivery. A little more to explore.",
      body: "My routine: compare the final checkout amount in Meituan and Taobao before ordering. Check the app coupon page, delivery fee and minimum order. A bigger coupon does not always mean a cheaper order. Availability and promotions change; this is a personal experience, not a guaranteed discount.",
      city: "Shanghai",
      category: "experience",
      baseLikes: 120486,
      review: "approved",
      sampleRecent: {
        likes: 2200,
        saves: 850,
        replies: 164,
        at: "2026-10-21T02:00:00.000Z",
      },
    },
    {
      ...shared,
      id: "sample-transit",
      authorId: "sample-jamie",
      authorName: "Jamie",
      tier: "free",
      title: "The station name I almost got wrong",
      body: "Hongqiao Railway Station and Shanghai Railway Station are different places. Match the Chinese station name on your ticket before leaving your hotel. ChinaHand has the airport and station names ready to show.",
      city: "Shanghai",
      category: "experience",
      baseLikes: 386,
    },
    {
      ...shared,
      id: "sample-pay",
      authorId: "sample-maya",
      authorName: "Maya",
      tier: "plus",
      title: "My first week paying in China",
      body: "Prepare both a digital payment method and a backup. I linked a supported foreign card in Alipay, then checked the final fee before paying. Some merchants and transaction types may not accept your card. Check the payment guide before you need it.",
      city: "Beijing",
      category: "experience",
      baseLikes: 108204,
      review: "approved",
      sampleRecent: {
        likes: 1100,
        saves: 920,
        replies: 108,
        at: "2026-10-21T02:00:00.000Z",
      },
    },
    {
      ...shared,
      id: "sample-hotel",
      authorId: "sample-alex",
      authorName: "Alex",
      tier: "free",
      title: "Can someone help me read this hotel entrance?",
      body: "The map pin takes me to the back of the building. How do you usually confirm the main reception entrance? I will ask the staff and use a Chinese address card.",
      city: "Beijing",
      category: "help",
      baseLikes: 14,
    },
  ];
}

export function toggleSave(post: Post, userId: string): Post {
  if (!userId) throw new Error("Sign in to save a post.");
  const saved = post.savedBy || [],
    exists = saved.includes(userId);
  return {
    ...post,
    savedBy: exists ? saved.filter((id) => id !== userId) : [...saved, userId],
    activity: exists
      ? (post.activity || []).filter(
          (a) => !(a.actor === userId && a.kind === "save"),
        )
      : [
          ...(post.activity || []),
          { kind: "save", actor: userId, at: new Date().toISOString() },
        ],
  };
}
export function hotScore(post: Post, now = new Date()): number {
  const ageWeight = (date: string) => {
    const hours = (now.getTime() - Date.parse(date)) / 3600000;
    return hours < 0 || hours > 168 ? 0 : Math.pow(0.5, hours / 72);
  };
  const weights = { like: 1, save: 3, reply: 2 };
  const recent = post.sample && post.sampleRecent ? post.sampleRecent : null;
  return (
    (post.activity || []).reduce(
      (sum, a) => sum + weights[a.kind] * ageWeight(a.at),
      0,
    ) +
    (recent
      ? (recent.likes + recent.saves * 3 + recent.replies * 2) *
        ageWeight(recent.at)
      : 0)
  );
}
export function hotPosts(posts: Post[], now = new Date()): Post[] {
  return posts
    .filter((p) => hotScore(p, now) > 0)
    .sort(
      (a, b) =>
        hotScore(b, now) - hotScore(a, now) ||
        Date.parse(b.createdAt) - Date.parse(a.createdAt) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 10);
}
export function searchPosts(posts: Post[], query: string): Post[] {
  const words = query
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return posts.filter((p) =>
    words.every((word) =>
      `${p.title} ${p.body} ${p.city} ${p.authorName}`
        .normalize("NFKC")
        .toLocaleLowerCase()
        .includes(word),
    ),
  );
}
