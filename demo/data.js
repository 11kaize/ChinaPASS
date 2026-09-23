/* ==========================================================================
   China Cheat Sheet — demo content
   内容遵循 docs/05-内容模板规范.md：
   - 英文主体，CEFR B1，单句 <= 15 词，步骤动词开头
   - 政策/支付类只写操作步骤，不做承诺，标注官方来源与更新时间
   ========================================================================== */

const EMERGENCY_NUMBERS = [
  { label: "Police", zh: "报警", num: "110", icon: "🚓" },
  { label: "Ambulance", zh: "急救", num: "120", icon: "🚑" },
  { label: "Fire", zh: "火警", num: "119", icon: "🚒" },
  { label: "Traffic", zh: "交通事故", num: "122", icon: "🚗" },
];

/* 双语急救卡片库 —— 场景引用这里的 group id，卡片页展示全部 */
const CARD_GROUPS = {
  pay: {
    icon: "💳",
    title: "Payment",
    zh: "支付",
    hint: "At the counter or the till",
    cards: [
      { en: "Can I pay by card?", zh: "可以刷卡吗？" },
      { en: "Can I pay by Alipay?", zh: "可以用支付宝吗？" },
      { en: "Do you accept foreign cards?", zh: "你们收外国银行卡吗？" },
      { en: "The payment failed.", zh: "支付失败了。" },
      { en: "Please try again.", zh: "请再试一次。" },
      { en: "Please give me a receipt.", zh: "请给我一张小票。" },
      { en: "How much is it in total?", zh: "一共多少钱？" },
    ],
  },
  taxi: {
    icon: "🚕",
    title: "Taxi",
    zh: "打车",
    hint: "Talking to your driver",
    cards: [
      { en: "I am at Exit B.", zh: "我在 B 出口。" },
      { en: "I am wearing a black jacket.", zh: "我穿着黑色外套。" },
      { en: "Please wait 2 minutes.", zh: "请等我 2 分钟。" },
      { en: "I don't speak Chinese.", zh: "我不会说中文。" },
      { en: "Please take me to this address.", zh: "请带我去这个地址。" },
      { en: "Please use the meter.", zh: "请打表。" },
      { en: "Please stop here.", zh: "请在这里停车。" },
      { en: "How much is it?", zh: "多少钱？" },
      { en: "Can I pay by Alipay?", zh: "可以支付宝付款吗？" },
    ],
  },
  train: {
    icon: "🚄",
    title: "Train",
    zh: "高铁",
    hint: "Stations, seats and tickets",
    cards: [
      { en: "Where is the ticket gate?", zh: "检票口在哪里？" },
      { en: "Which platform is it?", zh: "在几号站台？" },
      { en: "This is my seat.", zh: "这是我的座位。" },
      { en: "Is this seat taken?", zh: "这个座位有人吗？" },
      { en: "I need to change my ticket.", zh: "我需要改签。" },
      { en: "Where is the waiting room?", zh: "候车室在哪里？" },
      { en: "Please help me, I don't speak Chinese.", zh: "请帮帮我，我不会说中文。" },
    ],
  },
  metro: {
    icon: "🚇",
    title: "Metro",
    zh: "地铁",
    hint: "Stations, lines and exits",
    cards: [
      { en: "Where is the metro station?", zh: "地铁站在哪里？" },
      { en: "Which line goes to the airport?", zh: "哪条线去机场？" },
      { en: "Is this the right platform?", zh: "是在这个站台吗？" },
      { en: "I need to buy a ticket.", zh: "我需要买票。" },
      { en: "Which exit should I take?", zh: "我应该走哪个出口？" },
    ],
  },
  hotel: {
    icon: "🏨",
    title: "Hotel",
    zh: "酒店",
    hint: "Front desk, check-in, luggage",
    cards: [
      { en: "I have a reservation under my passport name.", zh: "我用护照预订了房间。" },
      { en: "Could you help me check in?", zh: "请帮我办理入住。" },
      { en: "What time is breakfast?", zh: "早餐几点？" },
      { en: "Do I need to pay a deposit?", zh: "我需要付押金吗？" },
      { en: "Can you help me call a taxi?", zh: "可以帮我叫车吗？" },
      { en: "Could you keep my luggage?", zh: "可以帮我寄存行李吗？" },
      { en: "Can I have a late check-out?", zh: "可以延迟退房吗？" },
      { en: "Could you write the address in Chinese for me?", zh: "可以帮我把地址写成中文吗？" },
      { en: "Could you help me order food?", zh: "可以帮我点一份外卖吗？" },
    ],
  },
  food: {
    icon: "🍜",
    title: "Food Delivery",
    zh: "外卖",
    hint: "Riders and dietary notes",
    cards: [
      { en: "No spicy.", zh: "不要辣。" },
      { en: "No peanuts.", zh: "不要花生。" },
      { en: "No cilantro.", zh: "不要香菜。" },
      { en: "Please leave it at the hotel front desk.", zh: "请放在酒店前台。" },
      { en: "Please call me when you arrive.", zh: "到达时请打电话给我。" },
      { en: "I don't speak Chinese.", zh: "我不会说中文。" },
      { en: "My room number is ___.", zh: "我的房间号是 ___。" },
      { en: "The order is wrong.", zh: "订单送错了。" },
    ],
  },
  sim: {
    icon: "📶",
    title: "SIM / Internet",
    zh: "电话卡",
    hint: "Buying a SIM or topping up",
    cards: [
      { en: "I want to buy a SIM card.", zh: "我想买一张电话卡。" },
      { en: "How much is it per month?", zh: "每个月多少钱？" },
      { en: "Does it work with my phone?", zh: "我的手机能用吗？" },
      { en: "I need a number that can receive SMS.", zh: "我需要一个能收短信的号码。" },
      { en: "Could you help me set it up?", zh: "可以帮我设置一下吗？" },
    ],
  },
  hospital: {
    icon: "🏥",
    title: "Hospital",
    zh: "医院",
    hint: "When you feel unwell",
    cards: [
      { en: "I don't feel well.", zh: "我身体不舒服。" },
      { en: "I need to see a doctor.", zh: "我需要看医生。" },
      { en: "I have a fever.", zh: "我发烧了。" },
      { en: "I have a stomachache.", zh: "我肚子疼。" },
      { en: "I am allergic to ___.", zh: "我对 ___ 过敏。" },
      { en: "I am taking this medicine.", zh: "我在吃这个药。" },
      { en: "My passport number is ___.", zh: "我的护照号码是 ___。" },
      { en: "Where is the pharmacy?", zh: "药店在哪里？" },
    ],
    note: "This card is for communication only. It is not medical advice.",
  },
  lost: {
    icon: "🎒",
    title: "Lost & Found",
    zh: "丢失物品",
    hint: "Passport, phone or bag missing",
    cards: [
      { en: "I lost my phone.", zh: "我的手机丢了。" },
      { en: "I lost my passport.", zh: "我的护照丢了。" },
      { en: "I left my bag in the taxi.", zh: "我的包落在出租车上了。" },
      { en: "Can you help me call the police?", zh: "可以帮我报警吗？" },
      { en: "Where is the nearest police station?", zh: "最近的警察局在哪里？" },
      { en: "I need a police report for my insurance.", zh: "我需要一份报警记录用于保险。" },
    ],
  },
  phone: {
    icon: "🔋",
    title: "Phone Battery Dead",
    zh: "手机没电",
    hint: "When your phone is about to die",
    cards: [
      { en: "My phone is about to die.", zh: "我的手机快没电了。" },
      { en: "Could I charge my phone here?", zh: "我可以在这里充电吗？" },
      { en: "Please help me contact my friend.", zh: "请帮我联系我的朋友。" },
      { en: "His/Her phone number is ___.", zh: "他/她的电话是 ___。" },
      { en: "Thank you very much!", zh: "非常感谢！" },
    ],
  },
  directions: {
    icon: "🧭",
    title: "Directions",
    zh: "找路",
    hint: "When you can't find the place",
    cards: [
      { en: "I am lost.", zh: "我迷路了。" },
      { en: "How do I get to this place?", zh: "请问怎么去这个地方？" },
      { en: "Is it far from here?", zh: "离这里远吗？" },
      { en: "Which metro line should I take?", zh: "我应该坐几号线？" },
      { en: "Where is the entrance?", zh: "入口在哪里？" },
      { en: "Could you show me on the map?", zh: "可以在地图上指给我看吗？" },
    ],
  },
  emergency: {
    icon: "🆘",
    title: "Emergency",
    zh: "报警 / 求助",
    hint: "When it's urgent — police, ambulance, fire",
    cards: [
      { en: "I need help.", zh: "我需要帮助。" },
      { en: "Please call the police.", zh: "请报警。" },
      { en: "Please call an ambulance.", zh: "请叫救护车。" },
      { en: "There is an emergency.", zh: "这里有紧急情况。" },
      { en: "I don't speak Chinese.", zh: "我不会说中文。" },
      { en: "Please help me find an interpreter.", zh: "请帮我找一个翻译。" },
      { en: "Please take me to the nearest hospital.", zh: "请带我去最近的医院。" },
    ],
  },
};

/* 卡片的展示顺序：按紧急程度从高到低。
   显式写出来，不依赖对象键的顺序。改顺序只改这个数组。 */
const CARD_ORDER = [
  "emergency",   // 最急：报警、救护车
  "hospital",    // 身体不舒服
  "lost",        // 护照 / 手机 / 包丢了
  "phone",       // 手机没电
  "directions",  // 迷路
  "taxi",        // 高频：联系司机
  "hotel",       // 高频：前台沟通
  "food",        // 高频：外卖忌口
  "pay",         // 日常
  "metro",       // 日常
  "train",       // 日常
  "sim",         // 日常
];

/* ==========================================================================
   场景
   ========================================================================== */

const SCENES = [
  {
    id: "pay",
    icon: "💳",
    title: "Pay",
    subtitle: "How to pay with Alipay",
    category: "Money",
    priority: "P0",
    eta: "3 min",
    lastUpdated: "2026-09-23",
    task: "Set up Alipay with your own bank card, then pay in a shop or online.",
    before: [
      "Phone with internet (eSIM or local SIM)",
      "Your passport",
      "A card in your own name (Visa / Mastercard / JCB / Discover)",
      "A phone number that can receive SMS",
    ],
    steps: [
      { t: "Download Alipay", d: "Install it from the App Store or Google Play. The publisher is Ant Group." },
      { t: "Sign up with your own phone number", d: "International numbers work. You will need this number again for verification." },
      { t: "Verify your identity", d: "Tap Me → Account → Identity Verification. Photograph your passport. Payment stays locked until this is approved." },
      { t: "Add a bank card", d: "Tap Me → Bank Cards → Add Bank Card. Enter the card number, expiry date and CVC." },
      { t: "Confirm with your bank", d: "Your bank sends a one-time code by SMS. Enter it in the app." },
      { t: "Pay in a shop", d: "Two ways: scan the shop's QR code, or show your payment code (Me → Pay) to the cashier's scanner." },
      { t: "Check your limits", d: "Me → Bank Cards shows the limit for each card. Foreign cards have lower limits than Chinese cards." },
      { t: "If a payment fails", d: "Try the other payment method first. If it still fails, use Plan B below." },
    ],
    mistakes: [
      { m: "Using someone else's card", w: "The card name must match your verified identity", d: "Use a card in your own name" },
      { m: "Skipping passport verification", w: "Payments fail and features stay locked", d: "Finish verification before you travel" },
      { m: "Assuming every shop takes foreign cards", w: "Small vendors use personal QR transfers", d: "Carry some cash as a backup" },
      { m: "Paying before checking the amount", w: "You may overpay, and refunds take days", d: "Check the amount on the screen first" },
    ],
    cardGroups: ["pay"],
    showCard: {
      title: "Show this to the cashier",
      lines: ["你好，我想用支付宝付款。", "请扫这个付款码。", "如果不行，我可以付现金。", "谢谢！"],
    },
    planB: [
      "Pay in cash. Yuan (CNY) works everywhere. Withdraw at an ATM with your Visa / Mastercard / UnionPay logo.",
      "Ask the hotel to pay for you, and add it to your room bill.",
      "Ask a friend to pay, and send them the money later.",
      "Try WeChat Pay. It also supports foreign cards — if one app rejects your card, try the other.",
    ],
    trouble: [
      { p: "Payment declined", a: "Check the card limit in Me → Bank Cards, then try a smaller amount." },
      { p: "Card will not add", a: "Contact your bank. Many banks block China transactions by default." },
      { p: "Refund not received", a: "Refunds go back to the original card. This can take several working days." },
      { p: "Charged twice", a: "Open the order → Feedback and report it. Keep the receipt." },
    ],
    sources: [
      { label: "Alipay official site", url: "https://www.alipay.com/" },
    ],
    disclaimer: "Limits and card support change often. Check the current limit inside the app before you rely on it.",
  },

  {
    id: "taxi",
    icon: "🚕",
    title: "Taxi",
    subtitle: "How to take a taxi (DiDi)",
    category: "Transport",
    priority: "P0",
    eta: "3 min",
    lastUpdated: "2026-09-16",
    task: "Take a taxi with DiDi, from opening the app to arriving at your hotel.",
    before: [
      "Phone with internet (eSIM or local SIM)",
      "DiDi app installed, or Alipay → Transport / Ride mini-app",
      "Your destination written in Chinese (copy it from your booking)",
      "Alipay or WeChat Pay linked to a card",
    ],
    tip: "Before you leave your hotel, ask the front desk to write the hotel name and address in Chinese. Save it in your notes. You will need it every time you come back.",
    steps: [
      { t: "Open DiDi", d: "Or open Alipay → Transport → Ride." },
      { t: "Switch to English", d: "Tap the profile icon → Settings → Language → English." },
      { t: "Enter your destination", d: "Paste the Chinese address. Do not type only \"Hilton Hotel\" in English — it may match the wrong city." },
      { t: "Check the pickup point", d: "The app shows a green pin. Walk to it. If it is on the wrong side of the road, drag the map to adjust." },
      { t: "Choose a ride type", d: "\"Express\" (快车) is the cheapest standard option. \"Premier\" costs more." },
      { t: "Tap Confirm and wait", d: "The app shows the driver's plate number and car model." },
      { t: "Check the plate number before you get in", d: "Match the last 3–4 characters on the plate." },
      { t: "Pay in the app", d: "Do not pay cash unless the driver asks. The fare is charged automatically after arrival." },
    ],
    mistakes: [
      { m: "Typing only the hotel name in English", w: "The driver may go to the wrong place, or cancel", d: "Paste the Chinese address" },
      { m: "Standing at the wrong exit", w: "The driver cannot find you, and you pay a waiting fee", d: "Check the pickup pin and the exit letter (A/B/C/D)" },
      { m: "Not checking the plate number", w: "You may get into the wrong car", d: "Match the plate before entering" },
      { m: "Canceling after the driver arrives", w: "A cancellation fee applies", d: "Cancel early, or message the driver first" },
      { m: "Not being able to describe yourself", w: "The driver gives up and cancels", d: "Use the bilingual card below" },
    ],
    cardGroups: ["taxi"],
    showCard: {
      title: "Show this to the driver",
      lines: ["你好，我不太会说中文。", "我在 B 出口，穿黑色外套，请到这里接我。", "目的地是：[中文地址]", "谢谢！"],
    },
    planB: [
      "Ask the hotel front desk to call a taxi for you.",
      "Use the metro instead. Most cities have English signage and English ticket machines.",
      "Walk to a main road and hail a taxi. Show the Chinese address through the window first.",
      "Ask staff at a convenience store or mall information desk to order for you.",
    ],
    trouble: [
      { p: "Driver calls but you cannot understand", a: "Say \"Hello, I don't speak Chinese\" and send a text in the app instead." },
      { p: "You left something in the car", a: "Open the order in DiDi → Contact driver → Lost item." },
      { p: "You were charged too much", a: "Open the order → Feedback and report the fare." },
      { p: "Driver canceled", a: "Just re-order. No action needed." },
    ],
    sources: [],
  },

  {
    id: "train",
    icon: "🚄",
    title: "Train",
    subtitle: "How to buy a high-speed rail ticket",
    category: "Transport",
    priority: "P0",
    eta: "5 min",
    lastUpdated: "2026-09-23",
    task: "Buy a high-speed train ticket with your passport, and board the train.",
    before: [
      "Your passport (the number and spelling must be exact)",
      "12306 app, or Trip.com if you prefer a full English flow",
      "Alipay / WeChat Pay, or an international card",
      "Enough time: arrive at the station 45–60 minutes early",
    ],
    tip: "Big cities have several stations. Shanghai has Hongqiao, Shanghai Station and Shanghai South. Check the station name, not just the city.",
    steps: [
      { t: "Download the official app", d: "12306 is the official railway app and has an English version. Trip.com sells the same tickets in English for a small fee." },
      { t: "Register with your passport", d: "Enter your name exactly as printed on the passport. Spelling and word order must match." },
      { t: "Add yourself as a passenger", d: "In 12306, add a passenger with your passport number. You cannot buy a ticket until this is saved." },
      { t: "Search for trains", d: "Choose From and To, then the date. Use the English station names." },
      { t: "Pick the train type", d: "G = fastest. D = fast. C = intercity. Z / T / K = slower, often overnight." },
      { t: "Choose a seat class", d: "Second Class is standard. First Class has wider seats. Business Class is the most expensive." },
      { t: "Understand 候补 (Waitlist)", d: "Waitlist means you pay first. If another passenger cancels, the system may get a ticket for you automatically. If it fails, you are refunded." },
      { t: "Pay", d: "Alipay, WeChat Pay or an international card." },
      { t: "Board the train", d: "Your passport is your ticket. Use the staffed lane, not the automatic gate, and show your passport." },
      { t: "Change or refund", d: "You can change or refund in the app before departure. Fees depend on how close to departure you are." },
    ],
    mistakes: [
      { m: "Name does not match the passport", w: "The ticket cannot be used at the gate", d: "Copy the passport spelling exactly" },
      { m: "Arriving late", w: "Gates close about 5 minutes before departure", d: "Be at the station 45–60 minutes early" },
      { m: "Going to the wrong station", w: "You miss the train", d: "Check the station name on the ticket" },
      { m: "Using the automatic gate", w: "Foreign passports often fail to scan", d: "Use the staffed lane and show your passport" },
      { m: "Buying from a reseller on the street", w: "Overpriced, and the ticket may be invalid", d: "Use 12306 or a licensed agent" },
    ],
    cardGroups: ["train"],
    showCard: {
      title: "Show this at the station",
      lines: ["你好，我不会说中文。", "我要坐这班车，这是我的护照。", "请问检票口在哪里？", "谢谢！"],
    },
    planB: [
      "Buy through Trip.com or a travel agent that works in English.",
      "Fly instead. Check domestic flights for long distances.",
      "Take a slower overnight train, or a long-distance bus.",
      "Ask your hotel front desk to book it. Show them: 请帮我在 12306 上买一张到北京的高铁票。",
    ],
    trouble: [
      { p: "Ticket not showing in the app", a: "Open 12306 → Your Orders and screenshot it. Show the screenshot at the staffed lane." },
      { p: "Cannot pass the gate", a: "Go to the staffed lane and show your passport." },
      { p: "You missed the train", a: "Change to a later train on the same day in the app, as soon as possible." },
      { p: "You lost your passport", a: "Report it to the police, then go to your embassy." },
    ],
    sources: [
      { label: "12306 official site", url: "https://www.12306.cn/en/index.html" },
    ],
    disclaimer: "Ticket rules and change fees follow railway policy. Check the app for the current rules.",
  },

  {
    id: "metro",
    icon: "🚇",
    title: "Metro",
    subtitle: "How to ride the metro",
    category: "Transport",
    priority: "P1",
    eta: "2 min",
    lastUpdated: "2026-09-23",
    task: "Ride the metro from the street entrance to your stop.",
    before: [
      "Phone with internet",
      "Alipay or WeChat Pay, or small notes for a ticket machine",
      "Your destination station written in Chinese",
    ],
    steps: [
      { t: "Find the station", d: "Look for the metro logo. Entrances are marked with letters (A, B, C, D)." },
      { t: "Choose how to pay", d: "Buy a single ticket from a machine (English option available), or use Alipay → Transport → Metro." },
      { t: "Open your ride QR code", d: "Alipay → Transport → pick your city → Metro. Show the code at the gate." },
      { t: "Find your direction", d: "The platform sign shows the last station on the line. Match it to your line." },
      { t: "Check the route", d: "Amap (高德) and Baidu Maps show metro routes in English. Metro apps differ by city." },
      { t: "Watch your stop", d: "Announcements are in Chinese, then English in most big cities. Count the stops too." },
      { t: "Exit the right way", d: "Signs show exits A/B/C/D and the streets nearby. Check before you go up." },
      { t: "Tap out", d: "Scan the QR code again at the exit gate. You are charged by distance." },
    ],
    mistakes: [
      { m: "Standing on the wrong platform", w: "You travel away from your stop", d: "Match the last station on the sign to your direction" },
      { m: "Losing the single ticket", w: "You cannot leave the station", d: "Keep it until you tap out" },
      { m: "Traveling at rush hour with luggage", w: "Trains are packed at 07:30–09:30 and 17:30–19:30", d: "Travel outside those windows" },
      { m: "Not checking the exit letter", w: "You surface blocks from where you wanted", d: "Check the exit letter on the map first" },
    ],
    cardGroups: ["metro", "directions"],
    planB: [
      "Take a taxi or DiDi instead.",
      "Take a bus. Pay with the same Alipay transport QR code.",
      "Show the station name to station staff and ask for help.",
      "Walk if it is under 20 minutes. Streets are busier but you can see landmarks.",
    ],
    trouble: [
      { p: "Gate will not open", a: "Show the QR code again, or go to the service window." },
      { p: "You went the wrong way", a: "Get off at the next station and take a train back." },
      { p: "Machine will not take your note", a: "Most accept 5 and 10 yuan notes, and some take coins." },
    ],
    sources: [],
  },

  {
    id: "hotel",
    icon: "🏨",
    title: "Hotel",
    subtitle: "How to check in",
    category: "Stay",
    priority: "P1",
    eta: "3 min",
    lastUpdated: "2026-09-23",
    task: "Check in to a hotel with your passport, and ask the front desk for what you need.",
    before: [
      "Your passport (every guest must show one)",
      "Booking confirmation",
      "A payment method for the deposit",
    ],
    steps: [
      { t: "Book a hotel that accepts foreign guests", d: "Not every hotel is licensed to register foreign passports. Use the \"accepts foreign guests\" filter, or call ahead." },
      { t: "Bring your passport to the desk", d: "The hotel registers your passport with the local police. This is normal and required." },
      { t: "Check in", d: "Hand over your passport and the booking name." },
      { t: "Confirm the details", d: "Ask about breakfast, deposit, check-out time and the Wi-Fi password." },
      { t: "Pay the deposit", d: "Usually a few hundred yuan. It is refunded at check-out." },
      { t: "Ask for the address in Chinese", d: "Save it in your phone. You need it for taxis and food delivery." },
      { t: "Ask the desk for help", d: "They can call a taxi, translate, write notes or order food for you." },
      { t: "Check out", d: "Return the key card. The deposit goes back to the original payment method." },
    ],
    mistakes: [
      { m: "Booking a hotel that cannot register foreign passports", w: "You are turned away at the desk", d: "Check before you book, or call the hotel" },
      { m: "Leaving your passport in the room safe", w: "You need it for trains, hotels and some payments", d: "Carry it with you" },
      { m: "Losing the deposit receipt", w: "Disputes are harder to resolve", d: "Keep the receipt and the payment record" },
      { m: "Assuming the desk speaks English", w: "Check-in takes much longer", d: "Use the bilingual cards below" },
    ],
    cardGroups: ["hotel"],
    showCard: {
      title: "Show this at the front desk",
      lines: ["你好，我用护照预订了房间。", "请帮我办理入住。", "可以帮我把酒店地址写成中文吗？", "谢谢！"],
    },
    planB: [
      "If a guesthouse cannot register you, move to a larger hotel with a 24-hour front desk.",
      "Ask your booking platform's customer service to help you move.",
      "Ask the hotel to recommend a nearby hotel that accepts foreign guests.",
    ],
    trouble: [
      { p: "Hotel refuses your passport", a: "Ask them to help you find a hotel that can register foreign guests." },
      { p: "Deposit not returned", a: "Show your receipt and the original payment record." },
      { p: "You need to stay longer", a: "Ask at the front desk as early as possible. Rooms sell out." },
    ],
    sources: [],
  },

  {
    id: "food",
    icon: "🍜",
    title: "Food",
    subtitle: "How to order delivery",
    category: "Daily",
    priority: "P1",
    eta: "4 min",
    lastUpdated: "2026-09-23",
    task: "Order food delivery to your hotel, and handle problems with the order.",
    before: [
      "Alipay or WeChat Pay linked to a card",
      "Your hotel address and room number",
      "Any allergy or dietary notes ready in Chinese",
    ],
    steps: [
      { t: "Open a delivery app", d: "Meituan (美团) and Ele.me (饿了么) are the two main apps. For English, use the food mini-app inside Alipay." },
      { t: "Set your address", d: "Type the hotel name in Chinese and add your room number. Save it as the default." },
      { t: "Pick a restaurant", d: "Check the rating, the delivery time and the minimum order." },
      { t: "Choose your food", d: "Add items to the cart, then tap Checkout." },
      { t: "Write a note for the kitchen", d: "Tap 备注 (Notes) and add your dietary needs. Use the cards below." },
      { t: "Pay in the app", d: "Never pay the rider in cash." },
      { t: "Watch the delivery", d: "The app shows the rider's position and an arrival time." },
      { t: "Meet the rider", d: "Most riders call when they arrive. Meet them in the lobby or at the delivery table." },
      { t: "If something is wrong", d: "Open the order → Contact rider or Customer service. Photograph the wrong item." },
    ],
    mistakes: [
      { m: "Writing the address only in English", w: "The rider cannot find the hotel", d: "Use the Chinese hotel name plus the room number" },
      { m: "Forgetting the room number", w: "The rider waits in the lobby", d: "Add the room number in the address" },
      { m: "Not checking the Notes field for allergens", w: "The kitchen does not know your allergy", d: "Write it in the Notes every time" },
      { m: "Not answering the rider's call", w: "The order is left outside, or canceled", d: "Answer, or send a text in the app" },
      { m: "Ordering at peak meal times", w: "Delivery takes much longer at 12:00–13:00 and 18:00–19:30", d: "Order 30 minutes earlier" },
    ],
    cardGroups: ["food", "directions"],
    showCard: {
      title: "Show this to the rider or staff",
      lines: ["你好，我不会说中文。", "请不要放辣，不要放花生。", "请放在酒店前台。", "到达时请打电话给我。", "谢谢！"],
    },
    planB: [
      "Walk to a restaurant nearby. Staff can point at the menu with you.",
      "Eat at the hotel restaurant or a convenience store (7-Eleven, Lawson, FamilyMart).",
      "Ask the front desk to order for you. They usually do this often.",
    ],
    trouble: [
      { p: "You cannot understand the rider", a: "Stop answering by voice. Send a text message in the app." },
      { p: "Food never arrived", a: "Open the order → Customer service and request a refund." },
      { p: "Wrong order", a: "Photograph it and report it in the app." },
      { p: "The food is too spicy", a: "Order again and write 不要辣 in the Notes." },
    ],
    sources: [],
  },

  {
    id: "sim",
    icon: "📶",
    title: "SIM",
    subtitle: "How to get online",
    category: "Setup",
    priority: "P1",
    eta: "5 min",
    lastUpdated: "2026-09-23",
    task: "Get online in China with an eSIM or a local SIM card.",
    before: [
      "Phone that supports eSIM (or a SIM slot)",
      "Your passport",
      "A payment method",
    ],
    steps: [
      { t: "Decide: eSIM or local SIM", d: "eSIM is easier — buy before you fly and skip the shop. A local SIM gives you a Chinese number, which some apps ask for." },
      { t: "For an eSIM", d: "Buy from an international eSIM provider and install it before you leave home. Most data-only eSIMs cannot receive SMS." },
      { t: "For a local SIM", d: "Go to a China Mobile, China Unicom or China Telecom shop. Bring your passport. The staff registers it for you." },
      { t: "Expect the firewall", d: "Google, Gmail, WhatsApp, Instagram, Facebook and YouTube are blocked on local networks. Plan around this." },
      { t: "Test it before you leave the shop", d: "Check that data works and that a call goes through." },
      { t: "Top up when needed", d: "Use the carrier's app, Alipay, or go back to the shop." },
      { t: "Keep your home SIM active", d: "You may need it to receive verification codes from your bank." },
    ],
    mistakes: [
      { m: "Buying only at the airport", w: "Airport plans are usually more expensive", d: "Compare with a city shop, or buy an eSIM in advance" },
      { m: "Forgetting your passport", w: "The shop cannot register the SIM without it", d: "Always bring your passport" },
      { m: "Assuming your usual apps will work", w: "Many are blocked on local networks", d: "Set up your connectivity before you arrive" },
      { m: "Choosing a data-only eSIM and then needing SMS", w: "You cannot receive bank verification codes", d: "Keep your home number active for codes" },
    ],
    cardGroups: ["sim"],
    planB: [
      "Use hotel Wi-Fi for booking and messages.",
      "Turn on roaming from your home carrier for the first days.",
      "Ask the hotel front desk where to buy a SIM nearby.",
    ],
    trouble: [
      { p: "SIM does not work", a: "Restart the phone and check the APN settings. If it fails, go back to the shop." },
      { p: "You cannot receive SMS", a: "Data-only plans do not include SMS. Use your home number for codes." },
      { p: "You ran out of data", a: "Top up in the carrier app or the shop." },
    ],
    sources: [],
  },

  {
    id: "emergency",
    icon: "🆘",
    title: "Emergency",
    subtitle: "Get help fast",
    category: "Safety",
    priority: "P0",
    eta: "now",
    lastUpdated: "2026-09-23",
    task: "Get help fast when something goes wrong.",
    before: [
      "Know your location (a hotel name, metro station or landmark)",
      "Your passport, if you have it with you",
      "A charged phone, or a person nearby who can call for you",
    ],
    steps: [
      { t: "Call the right number", d: "110 police. 120 ambulance. 119 fire. 122 traffic accident. Operators may not speak English." },
      { t: "Get a Chinese speaker on the line", d: "Hand your phone to someone nearby, or show them 请帮我打 110。" },
      { t: "Give your location first", d: "Say the city, then the nearest landmark, hotel or metro station." },
      { t: "Keep your passport with you", d: "Police and hospitals ask for it." },
      { t: "Call your embassy if your passport is lost", d: "Save the number before you travel." },
      { t: "Ask the hotel front desk for help", d: "A 24-hour front desk can call, translate and write notes." },
    ],
    mistakes: [
      { m: "Calling 120 for a minor problem", w: "Ambulances are for emergencies", d: "Go to a hospital clinic for non-urgent care" },
      { m: "Not knowing your location", w: "Help takes much longer to arrive", d: "Screenshot your map location" },
      { m: "Leaving without your passport", w: "You cannot be registered or treated quickly", d: "Carry it, or keep a photo of it" },
    ],
    cardGroups: ["emergency", "lost", "phone", "hospital"],
    showCard: {
      title: "Show this to anyone nearby",
      lines: ["你好，我需要帮助。", "我不会说中文。", "请帮我打 110 / 120。", "我的位置是：[地点]", "谢谢！"],
    },
    planB: [
      "Ask any shop or mall staff member. Most will help you call.",
      "Use the in-app customer service in Alipay or your booking app.",
      "Go to the nearest large hotel and ask the front desk.",
    ],
    trouble: [
      { p: "Nobody understands you", a: "Show the card above. Keep it full screen." },
      { p: "Your phone is dead", a: "Ask to charge it at a shop, or use the phone battery card." },
      { p: "You lost your passport", a: "Report it to the police first, then go to your embassy with the police report." },
    ],
    sources: [
      { label: "China emergency numbers: 110 / 120 / 119 / 122", url: "https://www.gov.cn/" },
    ],
    disclaimer: "This page gives contact steps only. It is not legal, medical or safety advice.",
  },
];

const FAQ = [
  {
    q: "My Alipay card was rejected. What now?",
    a: "Call your bank first. Many banks block China transactions by default. If the bank says it is fine, try a different card, or pay cash.",
  },
  {
    q: "Can I use these apps without a Chinese phone number?",
    a: "Mostly yes. Alipay and 12306 accept international numbers for registration. Some services still ask for a Chinese number, so keep your home SIM active for SMS codes.",
  },
  {
    q: "Can I buy a train ticket with my passport?",
    a: "Yes. Add your passport as a passenger in 12306. At the station, use the staffed lane instead of the automatic gate.",
  },
  {
    q: "Where do foreign cards not work?",
    a: "Small shops and street vendors often use personal QR transfers, which may not accept foreign cards. Carry some cash.",
  },
  {
    q: "How do I reach a human customer service agent?",
    a: "In Alipay: Me → Help Center → Contact us. Most agents handle English in the chat channel.",
  },
  {
    q: "How do I get back something I left in a taxi?",
    a: "Open the order in DiDi → Contact driver → Lost item. If the driver does not reply, use the app's feedback form.",
  },
  {
    q: "Do I need a VPN?",
    a: "Many international services are blocked on local networks. If you need them, set up your own connectivity before you arrive. Rules apply — check current regulations.",
  },
];
