/* ==========================================================================
   China Cheat Sheet — 双语应急卡片

   唯一的产品形态：单向应急卡片。
   用户遇到说不通的情况 → 打开卡片 → 全屏中文大字 → 直接递给对方看。

   设计约束（沿用 docs/05-内容模板规范.md）：
   - 中文是展示内容，字号必须大
   - 英文只是用户自己确认用的对照，递出去时隐藏
   - 只写沟通用语，不给诊断、法律或用药建议
   - 空格用 ____ 表示，用户自己填

   排序规则：按紧急程度从高到低。
   ========================================================================== */

const EMERGENCY_NUMBERS = [
  { label: "Police", zh: "报警", num: "110" },
  { label: "Ambulance", zh: "急救", num: "120" },
  { label: "Fire", zh: "火警", num: "119" },
  { label: "Traffic", zh: "交通事故", num: "122" },
];

const CARD_GROUPS = [
  {
    id: "sos",
    icon: "🆘",
    title: "Emergency",
    zh: "紧急求助",
    hint: "最急的情况，先打开这一组",
    cards: [
      { en: "I need help.", zh: "我需要帮助。" },
      { en: "Please call the police for me.", zh: "请帮我打 110（警察）。" },
      { en: "Please call an ambulance for me.", zh: "请帮我打 120（救护车）。" },
      { en: "There is an emergency here.", zh: "这里有紧急情况。" },
      { en: "Please take me to the nearest hospital.", zh: "请带我去最近的医院。" },
      { en: "Please help me find an interpreter.", zh: "请帮我找一个翻译。" },
    ],
  },

  {
    id: "nogood",
    icon: "🗣️",
    title: "Can't communicate",
    zh: "说不通时",
    hint: "万能卡，任何场景都先用这几张",
    cards: [
      { en: "I don't speak Chinese.", zh: "我不会说中文。" },
      { en: "Please speak more slowly.", zh: "请说慢一点。" },
      { en: "Please write it down.", zh: "请写下来。" },
      { en: "Please show me / point at it.", zh: "请指给我看。" },
      { en: "One moment, I'll use a translation app.", zh: "请等一下，我用翻译软件。" },
      { en: "Please help me.", zh: "请帮帮我。" },
    ],
  },

  {
    id: "hospital",
    icon: "🏥",
    title: "Hospital",
    zh: "医院",
    hint: "沟通用语，不含任何诊断或用药建议",
    cards: [
      { en: "I don't feel well.", zh: "我身体不舒服。" },
      { en: "I need to see a doctor.", zh: "我需要看医生。" },
      { en: "I have a fever.", zh: "我发烧了。" },
      { en: "I have a stomachache.", zh: "我肚子疼。" },
      { en: "I am allergic to ____.", zh: "我对 ____ 过敏。" },
      { en: "I am taking this medicine.", zh: "我在吃这个药。" },
      { en: "My passport number is ____.", zh: "我的护照号码是 ____。" },
      { en: "Where is the pharmacy?", zh: "药店在哪里？" },
    ],
    note: "本组仅用于沟通，不提供任何诊断或用药建议。",
  },

  {
    id: "lost",
    icon: "🎒",
    title: "Lost something",
    zh: "丢失物品",
    hint: "护照、手机、包",
    cards: [
      { en: "I lost my passport.", zh: "我的护照丢了。" },
      { en: "I lost my phone.", zh: "我的手机丢了。" },
      { en: "I left my bag in the taxi.", zh: "我的包落在出租车上了。" },
      { en: "Can you help me call the police?", zh: "可以帮我报警吗？" },
      { en: "Where is the nearest police station?", zh: "最近的警察局在哪里？" },
      { en: "I need a police report for my insurance.", zh: "我需要一份报警记录用于保险。" },
    ],
  },

  {
    id: "phone",
    icon: "🔋",
    title: "Phone battery dead",
    zh: "手机没电",
    hint: "手机快关机、需要借充电",
    cards: [
      { en: "My phone is about to die.", zh: "我的手机快没电了。" },
      { en: "Could I charge my phone here?", zh: "我可以在这里充电吗？" },
      { en: "Please help me contact my friend.", zh: "请帮我联系我的朋友。" },
      { en: "His/Her phone number is ____.", zh: "他/她的电话是 ____。" },
      { en: "Thank you very much!", zh: "非常感谢！" },
    ],
  },

  {
    id: "lost-way",
    icon: "🧭",
    title: "Lost / Directions",
    zh: "迷路问路",
    hint: "找不到地方的时候",
    cards: [
      { en: "I am lost.", zh: "我迷路了。" },
      { en: "How do I get to this place?", zh: "请问怎么去这个地方？" },
      { en: "Is it far from here?", zh: "离这里远吗？" },
      { en: "Where is the entrance?", zh: "入口在哪里？" },
      { en: "Which metro line should I take?", zh: "我应该坐几号线？" },
      { en: "Could you show me on the map?", zh: "可以在地图上指给我看吗？" },
    ],
  },

  {
    id: "taxi",
    icon: "🚕",
    title: "Taxi",
    zh: "打车",
    hint: "联系司机、报位置、付款",
    cards: [
      { en: "Please take me to this address.", zh: "请带我去这个地址。" },
      { en: "I am here: ____", zh: "我在这里：____" },
      { en: "I am wearing a black jacket.", zh: "我穿着黑色外套。" },
      { en: "Please wait 2 minutes.", zh: "请等我 2 分钟。" },
      { en: "Please use the meter.", zh: "请打表。" },
      { en: "Please stop here.", zh: "请在这里停车。" },
      { en: "How much is it?", zh: "多少钱？" },
      { en: "Can I pay by Alipay?", zh: "可以支付宝付款吗？" },
    ],
  },

  {
    id: "hotel",
    icon: "🏨",
    title: "Hotel",
    zh: "酒店",
    hint: "入住、寄存、叫车",
    cards: [
      { en: "I have a reservation under my passport name.", zh: "我用护照预订了房间。" },
      { en: "Could you help me check in?", zh: "请帮我办理入住。" },
      { en: "Can you help me call a taxi?", zh: "可以帮我叫车吗？" },
      { en: "Could you write the address in Chinese for me?", zh: "可以帮我把地址写成中文吗？" },
      { en: "Could you keep my luggage?", zh: "可以帮我寄存行李吗？" },
      { en: "What time is breakfast?", zh: "早餐几点？" },
      { en: "Can I have a late check-out?", zh: "可以延迟退房吗？" },
    ],
  },

  {
    id: "food",
    icon: "🍜",
    title: "Food delivery",
    zh: "外卖",
    hint: "忌口、放前台、联系骑手",
    cards: [
      { en: "No spicy.", zh: "不要辣。" },
      { en: "No peanuts.", zh: "不要花生。" },
      { en: "No cilantro.", zh: "不要香菜。" },
      { en: "Please leave it at the hotel front desk.", zh: "请放在酒店前台。" },
      { en: "My room number is ____.", zh: "我的房间号是 ____。" },
      { en: "Please call me when you arrive.", zh: "到达时请打电话给我。" },
      { en: "I don't speak Chinese.", zh: "我不会说中文。" },
    ],
  },
];
