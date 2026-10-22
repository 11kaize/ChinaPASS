import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { clearAllMedia } from "./local-media";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import {
  Profile,
  Post,
  Media,
  Reply,
  seedPosts,
  toggleLike,
  toggleSave,
  validatePost,
} from "./domain/community";
import {
  Tier,
  Usage,
  effectiveTier,
  monthKey,
  nextExpiry,
  plans,
  refundQuestion,
  reserveQuestion,
} from "./domain/membership";

type Account = { profile: Profile; salt: string; digest: string };
type ProductData = {
  accounts: Account[];
  activeId: string | null;
  posts: Post[];
  guestUsage: Usage;
};
const initial = (): ProductData => ({
  accounts: [],
  activeId: null,
  posts: seedPosts(),
  guestUsage: { month: monthKey(), requestIds: [] },
});
const STORAGE = "chinahand.demo.community.v1";
type Product = {
  ready: boolean;
  error: string;
  profile: Profile | null;
  tier: Tier;
  posts: Post[];
  usage: Usage;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  editProfile: (name: string, bio: string) => void;
  upgrade: (tier: "plus" | "pro") => void;
  publish: (
    title: string,
    body: string,
    city: string,
    category: Post["category"],
    media: Media[],
  ) => string;
  like: (id: string) => void;
  save: (id: string) => void;
  reply: (id: string, body: string) => void;
  requestReview: (id: string) => void;
  removePost: (id: string) => void;
  reserve: (id: string) => void;
  refund: (id: string) => void;
  reset: () => Promise<void>;
};
const Context = createContext<Product | null>(null);
function id() {
  return Crypto.randomUUID();
}
async function digest(salt: string, password: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initial),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  const current = useRef(data),
    queue = useRef(Promise.resolve()),
    reservationOwners = useRef(new Map<string, string | null>());
  const commit = (update: (old: ProductData) => ProductData) => {
    const next = update(current.current);
    current.current = next;
    setData(next);
  };
  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(STORAGE)
      .then((raw) => {
        if (!raw || !live) return;
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved.accounts) || !Array.isArray(saved.posts))
          throw new Error("Invalid saved demo data");
        const restored = { ...initial(), ...saved };
        current.current = restored;
        setData(restored);
      })
      .catch(() => {
        if (live) setError("Could not load local demo data.");
      })
      .finally(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const payload = JSON.stringify({
      accounts: data.accounts.map((a) => ({
        salt: a.salt,
        digest: a.digest,
        profile: a.profile,
      })),
      activeId: data.activeId,
      posts: data.posts,
      guestUsage: data.guestUsage,
    });
    queue.current = queue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(STORAGE, payload))
      .catch(() =>
        setError(
          "Device storage is full or unavailable. Your latest changes may not survive a restart.",
        ),
      );
  }, [data, ready]);
  const profile =
    data.accounts.find((a) => a.profile.id === data.activeId)?.profile || null;
  const tier = profile ? effectiveTier(profile.membership) : "free";
  const signedIn = () => {
    const p = current.current.accounts.find(
      (a) => a.profile.id === current.current.activeId,
    )?.profile;
    if (!p) throw new Error("Sign in to continue.");
    return p;
  };
  const updateProfile = (change: (p: Profile) => Profile) => {
    const p = signedIn();
    commit((old) => ({
      ...old,
      accounts: old.accounts.map((a) =>
        a.profile.id === p.id ? { ...a, profile: change(a.profile) } : a,
      ),
    }));
  };
  const value: Product = {
    ready,
    error,
    profile,
    tier,
    posts: data.posts,
    usage: profile?.usage || data.guestUsage,
    async signup(name, email, password) {
      const normalized = email.trim().toLowerCase();
      if (!name.trim() || name.trim().length > 40)
        throw new Error("Use a display name between 1 and 40 characters.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized))
        throw new Error("Enter a valid email address.");
      if (password.length < 8)
        throw new Error("Use at least 8 characters for your demo password.");
      if (current.current.accounts.some((a) => a.profile.email === normalized))
        throw new Error("This email already has a local demo account.");
      const salt = id(),
        hash = await digest(salt, password),
        userId = id();
      // Recheck after async hashing to prevent duplicate submissions.
      if (current.current.accounts.some((a) => a.profile.email === normalized))
        throw new Error("This email already has a local demo account.");
      commit((old) => ({
        ...old,
        activeId: userId,
        accounts: [
          ...old.accounts,
          {
            salt,
            digest: hash,
            profile: {
              id: userId,
              name: name.trim(),
              email: normalized,
              membership: { tier: "free", expiresAt: null },
              usage: { month: monthKey(), requestIds: [] },
            },
          },
        ],
      }));
    },
    async login(email, password) {
      const account = current.current.accounts.find(
        (a) => a.profile.email === email.trim().toLowerCase(),
      );
      if (!account || (await digest(account.salt, password)) !== account.digest)
        throw new Error(
          "Email or password does not match a local demo account.",
        );
      commit((old) => ({ ...old, activeId: account.profile.id }));
    },
    logout() {
      commit((old) => ({ ...old, activeId: null }));
    },
    editProfile(name, bio) {
      if (!name.trim() || name.trim().length > 40 || bio.trim().length > 160)
        throw new Error(
          "Use a name of 1–40 characters and a bio of up to 160 characters.",
        );
      const p = signedIn();
      commit((old) => ({
        ...old,
        accounts: old.accounts.map((a) =>
          a.profile.id === p.id
            ? {
                ...a,
                profile: { ...a.profile, name: name.trim(), bio: bio.trim() },
              }
            : a,
        ),
        posts: old.posts.map((post) => ({
          ...post,
          authorName: post.authorId === p.id ? name.trim() : post.authorName,
          replies: post.replies.map((reply) =>
            reply.authorId === p.id
              ? { ...reply, authorName: name.trim() }
              : reply,
          ),
        })),
      }));
    },
    upgrade(next) {
      const createdAt = new Date().toISOString();
      const expiresAt = nextExpiry(next);
      updateProfile((p) => ({
        ...p,
        membership: { tier: next, expiresAt },
        orders: [
          {
            id: id(),
            tier: next,
            priceUSD: plans[next].priceUSD,
            createdAt,
            expiresAt,
          },
          ...(p.orders || []),
        ],
      }));
    },
    publish(title, body, city, category, media) {
      const p = signedIn();
      const issue = validatePost({ title, body, city, media });
      if (issue) throw new Error(issue);
      const postId = id();
      commit((old) => ({
        ...old,
        posts: [
          {
            id: postId,
            authorId: p.id,
            authorName: p.name,
            tier: effectiveTier(p.membership),
            title: title.trim(),
            body: body.trim(),
            city: city.trim(),
            category,
            media,
            likedBy: [],
            baseLikes: 0,
            replies: [],
            review: "unreviewed",
            createdAt: new Date().toISOString(),
          },
          ...old.posts,
        ],
      }));
      return postId;
    },
    like(postId) {
      const p = signedIn();
      commit((old) => ({
        ...old,
        posts: old.posts.map((post) =>
          post.id === postId ? toggleLike(post, p.id) : post,
        ),
      }));
    },
    save(postId) {
      const p = signedIn();
      commit((old) => ({
        ...old,
        posts: old.posts.map((post) =>
          post.id === postId ? toggleSave(post, p.id) : post,
        ),
      }));
    },
    reply(postId, body) {
      const p = signedIn();
      if (!body.trim() || body.length > 1000)
        throw new Error("Write a reply between 1 and 1,000 characters.");
      const reply: Reply = {
        id: id(),
        authorId: p.id,
        authorName: p.name,
        tier: effectiveTier(p.membership),
        body: body.trim(),
        createdAt: new Date().toISOString(),
      };
      commit((old) => ({
        ...old,
        posts: old.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                replies: [...post.replies, reply],
                activity: [
                  ...(post.activity || []),
                  { kind: "reply", actor: p.id, at: reply.createdAt },
                ],
              }
            : post,
        ),
      }));
    },
    requestReview(postId) {
      const p = signedIn();
      commit((old) => ({
        ...old,
        posts: old.posts.map((post) =>
          post.id === postId &&
          post.authorId === p.id &&
          post.category === "experience" &&
          post.baseLikes + new Set(post.likedBy).size > 100000
            ? { ...post, review: "pending" }
            : post,
        ),
      }));
    },
    removePost(postId) {
      const p = signedIn();
      commit((old) => ({
        ...old,
        posts: old.posts.filter(
          (post) => post.id !== postId || post.authorId !== p.id,
        ),
      }));
    },
    reserve(requestId) {
      if (current.current.activeId) {
        updateProfile((p) => ({
          ...p,
          usage: reserveQuestion(
            effectiveTier(p.membership),
            p.usage,
            requestId,
          ),
        }));
      } else
        commit((old) => ({
          ...old,
          guestUsage: reserveQuestion("free", old.guestUsage, requestId),
        }));
      reservationOwners.current.set(requestId, current.current.activeId);
    },
    refund(requestId) {
      if (!reservationOwners.current.has(requestId)) return;
      const owner = reservationOwners.current.get(requestId);
      reservationOwners.current.delete(requestId);
      commit((old) => ({
        ...old,
        guestUsage:
          owner === null
            ? refundQuestion(old.guestUsage, requestId)
            : old.guestUsage,
        accounts: old.accounts.map((a) =>
          a.profile.id === owner
            ? {
                ...a,
                profile: {
                  ...a.profile,
                  usage: refundQuestion(a.profile.usage, requestId),
                },
              }
            : a,
        ),
      }));
    },
    async reset() {
      await queue.current.catch(() => {});
      await clearAllMedia();
      await AsyncStorage.removeItem(STORAGE);
      reservationOwners.current.clear();
      commit(() => initial());
      setError("");
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useProduct() {
  const value = useContext(Context);
  if (!value) throw new Error("ProductProvider is missing");
  return value;
}
export { plans };
