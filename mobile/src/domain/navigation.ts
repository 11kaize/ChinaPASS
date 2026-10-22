import { content, localize } from "../content";
export type AppPage = {
  id: string;
  path: string;
  title: string;
  zh: string;
  description: string;
  keywords: string[];
};
export const transportModes = [
  {
    id: "taxi",
    title: "Taxi & ride-hailing",
    zh: "打车",
    icon: "taxi",
    color: "#EAA926",
  },
  {
    id: "metro",
    title: "Metro & city transit",
    zh: "地铁",
    icon: "metro",
    color: "#348CEE",
  },
  {
    id: "train",
    title: "Trains & rail tickets",
    zh: "火车",
    icon: "train",
    color: "#8170E8",
  },
] as const;
export const appPages: AppPage[] = [
  {
    id: "home",
    path: "/",
    title: "Home",
    zh: "首页",
    description: "Daily life shortcuts and arrival essentials.",
    keywords: ["homepage", "home", "首页"],
  },
  {
    id: "transport",
    path: "/transport",
    title: "Transport",
    zh: "交通",
    description: "Choose taxi, metro or intercity train guidance.",
    keywords: ["transport", "transportation", "getting around", "交通", "出行"],
  },
  {
    id: "guides",
    path: "/guides",
    title: "Guides",
    zh: "指南",
    description: "Browse all practical task guides.",
    keywords: ["guides", "guide directory", "指南"],
  },
  {
    id: "community",
    path: "/community",
    title: "Community",
    zh: "社区",
    description:
      "Read and publish local questions and experiences. Not an emergency dispatch service.",
    keywords: ["community", "posts", "社区", "帖子"],
  },
  {
    id: "community-help",
    path: "/community?filter=help",
    title: "Help nearby",
    zh: "救助贴",
    description:
      "Community requests for chargers, airport assistance and directions. No guaranteed response.",
    keywords: ["charger", "charging", "help nearby", "充电", "求助", "救助贴"],
  },
  {
    id: "community-featured",
    path: "/community?filter=featured",
    title: "Editor's picks",
    zh: "精华贴",
    description:
      "Experience posts with more than 100,000 likes AND editorial approval.",
    keywords: ["featured", "experience", "coupons", "精选", "精华", "优惠券"],
  },
  {
    id: "cards",
    path: "/cards",
    title: "Chinese help cards",
    zh: "中文求助卡",
    description:
      "Show Chinese phrases full screen, save favorites and create cards.",
    keywords: ["phrase", "chinese card", "say", "中文", "怎么说", "卡片"],
  },
  {
    id: "chat",
    path: "/chat",
    title: "AI companion",
    zh: "AI 助手",
    description: "Ask your configured model with ChinaHand knowledge.",
    keywords: ["ai", "assistant", "问答"],
  },
  {
    id: "profile",
    path: "/settings",
    title: "Me",
    zh: "个人中心",
    description:
      "Your account, membership, AI allowance, posts and app preferences.",
    keywords: ["profile", "account", "settings", "个人", "设置", "账户"],
  },
  {
    id: "preferences",
    path: "/preferences",
    title: "Preferences & privacy",
    zh: "偏好与隐私",
    description:
      "Language, appearance, context sharing and local data controls.",
    keywords: ["preferences", "theme", "language", "外观", "语言", "偏好"],
  },
  {
    id: "create-post",
    path: "/create-post",
    title: "Share a story",
    zh: "发布帖子",
    description:
      "Write an experience or help request and attach photos or videos.",
    keywords: ["publish", "create post", "发布", "发帖"],
  },
  {
    id: "login",
    path: "/login",
    title: "Sign in",
    zh: "登录",
    description: "Sign into your local demo account.",
    keywords: ["login", "sign in", "登录"],
  },
  {
    id: "register",
    path: "/register",
    title: "Create account",
    zh: "注册",
    description: "Create an on-device demo account.",
    keywords: ["register", "sign up", "注册"],
  },
  {
    id: "upgrade",
    path: "/upgrade",
    title: "Upgrade membership",
    zh: "升级会员",
    description:
      "Plus $9 monthly; Pro $89 yearly. Demo checkout does not charge.",
    keywords: ["plus", "pro", "upgrade", "subscription", "会员", "升级"],
  },
  {
    id: "account",
    path: "/account",
    title: "Personal details",
    zh: "个人资料",
    description: "Edit your local display name and bio. Sign-in email cannot be changed here.",
    keywords: ["profile edit", "display name", "bio", "昵称", "简介", "个人资料"],
  },
  {
    id: "orders",
    path: "/orders",
    title: "Activation history",
    zh: "开通记录",
    description: "Local demo membership activations only. No actual payments or receipts.",
    keywords: ["activation", "order history", "billing", "开通记录", "订单", "充值记录"],
  },
  {
    id: "emergency",
    path: "/emergency",
    title: "Emergency help",
    zh: "紧急帮助",
    description:
      "Police 110, ambulance 120, fire 119, traffic 122; Chinese emergency card.",
    keywords: [
      "police",
      "ambulance",
      "fire",
      "emergency",
      "110",
      "120",
      "119",
      "122",
      "报警",
      "警察",
      "急救",
      "紧急",
    ],
  },
  {
    id: "ports",
    path: "/ports",
    title: "Arrival ports",
    zh: "入境口岸",
    description:
      "Choose one of 15 air, rail or sea arrival ports and show its Chinese name.",
    keywords: ["airport", "arrival port", "landed", "机场", "口岸", "入境"],
  },
  {
    id: "arrival",
    path: "/arrival",
    title: "Your arrival route",
    zh: "落地流程",
    description: "Entry, connectivity, payment, transport and hotel steps.",
    keywords: ["arrival route", "first day", "落地", "流程"],
  },
  {
    id: "preparation",
    path: "/preparation",
    title: "Before you go",
    zh: "行前准备",
    description: "Seven preparation tasks with saved checklist progress.",
    keywords: ["prepare", "before travel", "checklist", "准备", "行前"],
  },
  {
    id: "address",
    path: "/address",
    title: "My address card",
    zh: "地址卡",
    description: "Save Chinese destination details to show a driver.",
    keywords: ["address", "destination", "地址", "目的地"],
  },
  {
    id: "city",
    path: "/city",
    title: "Airports & stations",
    zh: "机场与车站",
    description: "Chinese airport and rail station names in eight cities.",
    keywords: ["station", "airport name", "车站", "机场名称"],
  },
  {
    id: "trip",
    path: "/trip",
    title: "My trip",
    zh: "行程偏好",
    description: "Manually select city and journey stage.",
    keywords: ["city", "trip stage", "城市", "行程"],
  },
  {
    id: "faq",
    path: "/faq",
    title: "Common questions",
    zh: "常见问题",
    description: "Seven bundled questions about life in China.",
    keywords: ["faq", "common questions", "常见问题"],
  },
  {
    id: "ai-config",
    path: "/ai-config",
    title: "Connect a model",
    zh: "连接模型",
    description: "Configure your own provider and session-only API key.",
    keywords: ["api key", "connect model", "配置模型", "连接模型"],
  },
  {
    id: "context",
    path: "/context",
    title: "AI context & privacy",
    zh: "AI 上下文与隐私",
    description:
      "Review which project and trip information is shared with your model.",
    keywords: ["privacy", "context", "隐私", "上下文"],
  },
  {
    id: "write-card",
    path: "/write-card",
    title: "Create a help card",
    zh: "制作求助卡",
    description: "Supply your own Chinese phrase and English note.",
    keywords: ["custom card", "write card", "自定义卡", "制作卡"],
  },
  ...content.scenes.map((scene) => ({
    id: `guide-${scene.id}`,
    path: `/guide/${scene.id}`,
    title: localize(scene.title, "en"),
    zh: localize(scene.title, "zh"),
    description: localize(scene.task, "en"),
    keywords: [
      scene.id,
      localize(scene.title, "en").toLowerCase(),
      localize(scene.title, "zh"),
    ],
  })),
  ...content.shortGuides.map((guide) => ({
    id: `guide-${guide.id}`,
    path: `/guide/${guide.id}`,
    title: guide.title,
    zh: guide.title,
    description: guide.summary,
    keywords: [guide.id, guide.title.toLowerCase()],
  })),
];
export function retrievePages(query: string, limit = 5): AppPage[] {
  const text = query.toLocaleLowerCase().normalize("NFKC");
  return appPages
    .map((page) => ({
      page,
      score: page.keywords.reduce(
        (score, word) =>
          score +
          (text.includes(word.toLocaleLowerCase())
            ? Math.max(1, word.length)
            : 0),
        0,
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.page);
}
const marker = /\[\[chinahand:([a-z0-9-]+)\]\]/g;
// Model-triggered allowlisted IDs only. Never infer action buttons from the user's query.
export function parsePageActions(answer: string): {
  text: string;
  actions: AppPage[];
} {
  const actions: AppPage[] = [];
  const text = answer
    .replace(marker, (_, id: string) => {
      const page = appPages.find((p) => p.id === id);
      if (page && !actions.some((p) => p.id === id) && actions.length < 3)
        actions.push(page);
      return "";
    })
    .trim();
  return { text, actions };
}
export function navigationInstructions(query: string, enabled: boolean) {
  return `APP PAGE DIRECTORY (trusted app-owned IDs, never invent paths): ${JSON.stringify(appPages.map(({ id, title, zh, description }) => ({ id, title, zh, description })))}\nRETRIEVED PAGE CONTEXT: ${JSON.stringify(retrievePages(query))}\n${enabled ? "After your normal answer, optionally recommend up to 3 directly relevant app pages using exactly [[chinahand:PAGE_ID]]. These markers become navigation buttons. Only choose IDs from the trusted directory. For police or emergency numbers prefer [[chinahand:emergency]]. Do not emit a button unless useful for this answer. Never claim navigation has already occurred. Do not put markers in code blocks." : "Do not emit navigation action markers for this account. Provide the normal helpful answer without app action buttons."}`;
}
