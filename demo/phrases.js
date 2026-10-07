/* China Hand — offline English→Chinese phrase bank.
   Why this exists: when a visitor cannot speak Chinese, typing what they mean in
   English should surface one ready sentence to show a Chinese speaker. Templates
   carry a %s slot that a fill replaces, so one card covers many real moments.
   Data only — the matching engine in app.js reads this array and nothing here
   touches the DOM. Keep entries to the documented fields; the engine depends on
   their names. Content rules live in docs/05-内容模板规范.md; the human-editable
   companion is content/cards/常用表达词库.md. */

const PHRASE_BANK = [
  /* ============================================================
     basics — everyday survival lines
     ============================================================ */
  { icon: "🚻", cat: "basics",
    en: "Where is the toilet?",
    zh: "请问洗手间在哪里？",
    keys: "toilet loo restroom bathroom washroom wc lavatory john" },

  { icon: "🚻", cat: "basics",
    en: "May I use your toilet?",
    zh: "我可以借用一下洗手间吗？",
    keys: "toilet loo bathroom restroom borrow use" },

  { icon: "🗣️", cat: "basics",
    en: "I don't speak Chinese.",
    zh: "我不会说中文。",
    keys: "chinese language speak understand only english" },

  { icon: "🙋", cat: "basics",
    en: "Do you speak English?",
    zh: "你会说英语吗？",
    keys: "english speak understand language" },

  { icon: "🤔", cat: "basics",
    en: "I don't understand.",
    zh: "我听不懂。",
    keys: "understand get confused repeat again" },

  { icon: "🙏", cat: "basics",
    en: "Can you help me?",
    zh: "可以帮帮我吗？",
    keys: "help assist assistance please" },

  { icon: "✍️", cat: "basics",
    en: "Please write it down for me.",
    zh: "请帮我写下来。",
    keys: "write note pen paper down" },

  { icon: "📱", cat: "basics",
    en: "Please show me.",
    zh: "请给我看一下。",
    keys: "show display point screen" },

  { icon: "🕐", cat: "basics",
    en: "What time is it now?",
    zh: "请问现在几点？",
    keys: "time clock hour now oclock" },

  { icon: "⏳", cat: "basics",
    en: "Please wait a moment.",
    zh: "请等一下。",
    keys: "wait minute moment second hold" },

  { icon: "🧻", cat: "basics",
    en: "Do you have tissues?",
    zh: "请问有纸巾吗？",
    keys: "tissue napkin paper toilet roll serviette" },

  { icon: "🛗", cat: "basics",
    en: "Is there an elevator?",
    zh: "请问有电梯吗？",
    keys: "elevator lift escalator stairs" },

  { icon: "🗺️", cat: "basics",
    en: "Can you show me on the map?",
    zh: "可以在地图上指给我看吗？",
    keys: "map point show location" },

  { icon: "👋", cat: "basics",
    en: "Hello.",
    zh: "你好。",
    keys: "hi hey greetings morning afternoon" },

  { icon: "🙏", cat: "basics",
    en: "Thank you very much.",
    zh: "非常感谢。",
    keys: "thanks thankyou cheers ta grateful" },

  { icon: "😅", cat: "basics",
    en: "Sorry to bother you.",
    zh: "不好意思，打扰了。",
    keys: "sorry excuse bother interrupt" },

  /* ============================================================
     food — ordering, restrictions, the bill
     ============================================================ */
  { icon: "🥤", cat: "food",
    en: "Can I have some ice water?",
    zh: "可以给我一杯冰水吗？",
    keys: "water ice cold drink tap" },

  { icon: "🔥", cat: "food",
    en: "This is too spicy.",
    zh: "这个太辣了。",
    keys: "spicy hot chilli pepper" },

  { icon: "🧂", cat: "food",
    en: "Can you make it less salty?",
    zh: "可以少放点盐吗？",
    keys: "salt salty seasoning" },

  { icon: "🍚", cat: "food",
    en: "Can I have some rice?",
    zh: "可以给我一碗米饭吗？",
    keys: "rice bowl staple" },

  { icon: "🥢", cat: "food",
    en: "Can I have chopsticks?",
    zh: "可以给我一双筷子吗？",
    keys: "chopsticks cutlery utensils" },

  { icon: "🌶️", cat: "food",
    en: "Please don't make it spicy.",
    zh: "请不要放辣。",
    keys: "spicy hot chilli pepper mild" },

  { icon: "🍽️", cat: "food",
    en: "Is this dish spicy?",
    zh: "这道菜辣吗？",
    keys: "dish spicy hot" },

  { icon: "🫖", cat: "food",
    en: "Can I have some hot water?",
    zh: "可以给我一杯热水吗？",
    keys: "hot water warm drink" },

  { icon: "🥜", cat: "food",
    en: "Does this contain nuts?",
    zh: "这个里面有坚果吗？",
    keys: "nuts peanuts contain ingredient" },

  { icon: "🧾", cat: "food",
    en: "The bill, please.",
    zh: "买单，谢谢。",
    keys: "bill check cheque pay" },

  { icon: "🥡", cat: "food",
    en: "Can I get this to take away?",
    zh: "可以帮我打包吗？",
    keys: "takeaway takeout doggy pack box" },

  { icon: "⭐", cat: "food",
    en: "What do you recommend?",
    zh: "有什么推荐的菜吗？",
    keys: "recommend suggestion popular speciality specialty" },

  { icon: "🧊", cat: "food",
    en: "No ice, please.",
    zh: "请不要加冰。",
    keys: "ice cold" },

  { icon: "🍴", cat: "food",
    en: "Where is the fork?",
    zh: "请问叉子在哪里？",
    keys: "fork spoon knife cutlery" },

  { icon: "⏰", cat: "food",
    en: "Is my food ready?",
    zh: "请问菜好了吗？",
    keys: "ready food order wait" },

  { icon: "📋", cat: "food",
    en: "Can I see the menu?",
    zh: "可以给我看一下菜单吗？",
    keys: "menu list dishes" },

  /* Ordering. The rest of this category is about things going wrong — allergies,
     too spicy, the wrong dish — which left a visitor able to complain about a
     meal but not to order a drink. These are the gaps that showed up when the
     engine was run against real traveller sentences. */
  { icon: "☕", cat: "food",
    en: "Can I have a coffee?",
    zh: "可以给我一杯咖啡吗？",
    keys: "coffee espresso latte cappuccino americano mocha drink order beverage" },

  { icon: "🍵", cat: "food",
    en: "Can I have a tea?",
    zh: "可以给我一杯茶吗？",
    keys: "tea green tea jasmine black tea drink order beverage" },

  { icon: "🍺", cat: "food",
    en: "A beer, please.",
    zh: "请给我一瓶啤酒。",
    keys: "beer alcohol drink bottle lager order beverage" },

  { icon: "🍽️", cat: "food",
    en: "A table for two, please.",
    zh: "请安排两个人的位子。",
    keys: "table seat seats sit dine in restaurant two people couple booking" },

  { icon: "✍️", cat: "food",
    en: "I would like to order now.",
    zh: "我现在可以点菜吗？",
    keys: "order ordering ready to order dishes choose" },

  { icon: "💧", cat: "food",
    en: "Where can I buy water?",
    zh: "哪里可以买水？",
    keys: "water buy bottle shop store purchase bottled drinking mineral" },

  /* ============================================================
     taxi — getting a car and directing the driver
     ============================================================ */
  { icon: "📍", cat: "taxi",
    en: "Please take me to this address.",
    zh: "请带我去这个地址。",
    keys: "take drive address destination" },

  { icon: "🚕", cat: "taxi",
    en: "Please use the meter.",
    zh: "请打表。",
    keys: "meter fare charge" },

  { icon: "🛑", cat: "taxi",
    en: "Please stop here.",
    zh: "请在这里停车。",
    keys: "stop park here pull over" },

  { icon: "🚦", cat: "taxi",
    en: "Please stop at the next corner.",
    zh: "请在前面的路口停车。",
    keys: "stop corner junction turn" },

  { icon: "⏱️", cat: "taxi",
    en: "Please wait two minutes.",
    zh: "请等我两分钟。",
    keys: "wait minutes moment" },

  { icon: "🧥", cat: "taxi",
    en: "I am wearing a black jacket.",
    zh: "我穿着黑色外套。",
    keys: "wearing jacket clothes black coat" },

  { icon: "🅱️", cat: "taxi",
    en: "I am at Exit B.",
    zh: "我在 B 出口。",
    keys: "exit b door entrance" },

  { icon: "🚪", cat: "taxi",
    en: "I am at the main entrance.",
    zh: "我在正门。",
    keys: "entrance main gate door" },

  { icon: "🐢", cat: "taxi",
    en: "Please drive more slowly.",
    zh: "请开慢一点。",
    keys: "slow drive careful" },

  { icon: "🧳", cat: "taxi",
    en: "Can you open the trunk?",
    zh: "可以帮我开一下后备箱吗？",
    keys: "trunk boot luggage bags" },

  { icon: "📞", cat: "taxi",
    en: "Please call me when you arrive.",
    zh: "到了请给我打电话。",
    keys: "call phone arrive reach" },

  { icon: "🛣️", cat: "taxi",
    en: "Please take the fastest route.",
    zh: "请走最快的路线。",
    keys: "fastest quick route road" },

  { icon: "❄️", cat: "taxi",
    en: "Please turn on the air conditioning.",
    zh: "请开一下空调。",
    keys: "air conditioning ac cool aircon" },

  { icon: "✋", cat: "taxi",
    en: "Please wait here, I will come back.",
    zh: "请在这里等我，我马上回来。",
    keys: "wait return back soon" },

  { icon: "🚕", cat: "taxi",
    en: "Is this taxi free?",
    zh: "这辆车有人吗？",
    keys: "free available vacant taken" },

  /* ============================================================
     hotel — check-in, room, front-desk asks
     ============================================================ */
  { icon: "🛎️", cat: "hotel",
    en: "I have a reservation.",
    zh: "我有预订。",
    keys: "reservation booking booked room" },

  { icon: "🛏️", cat: "hotel",
    en: "Can I check in now?",
    zh: "现在可以办理入住吗？",
    keys: "check in arrive room" },

  { icon: "⏰", cat: "hotel",
    en: "What time is check-out?",
    zh: "几点退房？",
    keys: "check out checkout time leave" },

  { icon: "🍳", cat: "hotel",
    en: "What time is breakfast?",
    zh: "早餐几点？",
    keys: "breakfast morning meal time" },

  { icon: "💰", cat: "hotel",
    en: "Do I need to pay a deposit?",
    zh: "需要付押金吗？",
    keys: "deposit bond security money" },

  { icon: "🧳", cat: "hotel",
    en: "Can you keep my luggage?",
    zh: "可以帮我寄存行李吗？",
    keys: "luggage bags store keep left" },

  { icon: "🚕", cat: "hotel",
    en: "Can you call a taxi for me?",
    zh: "可以帮我叫辆车吗？",
    keys: "taxi cab call book car" },

  { icon: "🕐", cat: "hotel",
    en: "Can I have a late check-out?",
    zh: "可以延迟退房吗？",
    keys: "late checkout delay" },

  { icon: "📶", cat: "hotel",
    en: "What is the Wi-Fi password?",
    zh: "请问 Wi-Fi 密码是多少？",
    keys: "wifi internet password network" },

  { icon: "🧺", cat: "hotel",
    en: "Can I have an extra towel?",
    zh: "可以再给我一条毛巾吗？",
    keys: "towel extra more" },

  { icon: "❄️", cat: "hotel",
    en: "The air conditioning is not working.",
    zh: "空调坏了。",
    keys: "air conditioning broken not working" },

  { icon: "🔌", cat: "hotel",
    en: "Can I borrow a power adapter?",
    zh: "可以借我一个转换插头吗？",
    keys: "adapter plug converter charge" },

  { icon: "🧴", cat: "hotel",
    en: "Could you give me some shampoo?",
    zh: "可以给我一些洗发水吗？",
    keys: "shampoo soap toiletries" },

  { icon: "🔑", cat: "hotel",
    en: "I have lost my room key.",
    zh: "我的房卡丢了。",
    keys: "room key card lost" },

  /* ============================================================
     shopping — price, size, receipts
     ============================================================ */
  { icon: "💰", cat: "shopping",
    en: "How much is this?",
    zh: "这个多少钱？",
    keys: "price cost yuan money" },

  { icon: "🛍️", cat: "shopping",
    en: "I am just looking, thanks.",
    zh: "我只是看看，谢谢。",
    keys: "looking browse just" },

  { icon: "💸", cat: "shopping",
    en: "That is too expensive.",
    zh: "太贵了。",
    keys: "expensive price costly" },

  { icon: "🏷️", cat: "shopping",
    en: "Can you make it cheaper?",
    zh: "可以便宜一点吗？",
    keys: "discount cheaper reduce bargain" },

  { icon: "👕", cat: "shopping",
    en: "Can I try this on?",
    zh: "可以试一下吗？",
    keys: "try fit fitting room" },

  { icon: "📏", cat: "shopping",
    en: "Do you have a bigger size?",
    zh: "有大一号的吗？",
    keys: "bigger size larger" },

  { icon: "📐", cat: "shopping",
    en: "Do you have a smaller size?",
    zh: "有小一号的吗？",
    keys: "smaller size" },

  { icon: "🧾", cat: "shopping",
    en: "Can I have a receipt?",
    zh: "可以给我发票吗？",
    keys: "receipt invoice fapiao" },

  { icon: "🛍️", cat: "shopping",
    en: "Can I get a bag?",
    zh: "可以给我一个袋子吗？",
    keys: "bag plastic carrier" },

  { icon: "👝", cat: "shopping",
    en: "What time do you close?",
    zh: "请问几点关门？",
    keys: "close shut closing time" },

  { icon: "🔄", cat: "shopping",
    en: "Can I return this?",
    zh: "这个可以退吗？",
    keys: "return refund exchange" },

  { icon: "🛒", cat: "shopping",
    en: "Where is the supermarket?",
    zh: "超市在哪里？",
    keys: "supermarket grocery store" },

  { icon: "🎨", cat: "shopping",
    en: "Do you have this in another colour?",
    zh: "这个有别的颜色吗？",
    keys: "colour color another shade" },

  { icon: "🚬", cat: "shopping",
    en: "Do you sell cigarettes?",
    zh: "你们卖香烟吗？",
    keys: "cigarettes tobacco smoke" },

  /* ============================================================
     directions — finding the way
     ============================================================ */
  { icon: "🧭", cat: "directions",
    en: "I am lost.",
    zh: "我迷路了。",
    keys: "lost confused" },

  { icon: "🚶", cat: "directions",
    en: "How do I get to this place?",
    zh: "请问怎么去这个地方？",
    keys: "get go reach how" },

  { icon: "📏", cat: "directions",
    en: "Is it far from here?",
    zh: "离这里远吗？",
    keys: "far distance close near" },

  { icon: "🚇", cat: "directions",
    en: "Which metro line should I take?",
    zh: "我应该坐几号线？",
    keys: "metro subway line underground tube" },

  { icon: "🚪", cat: "directions",
    en: "Where is the entrance?",
    zh: "入口在哪里？",
    keys: "entrance entry door" },

  { icon: "🚪", cat: "directions",
    en: "Where is the exit?",
    zh: "出口在哪里？",
    keys: "exit way out" },

  { icon: "🧭", cat: "directions",
    en: "Which way is north?",
    zh: "哪边是北？",
    keys: "north direction compass" },

  { icon: "❓", cat: "directions",
    en: "Is this the right way?",
    zh: "这条路对吗？",
    keys: "right correct way road" },

  { icon: "🚌", cat: "directions",
    en: "Where is the bus stop?",
    zh: "公交站在哪里？",
    keys: "bus stop station coach" },

  { icon: "🚉", cat: "directions",
    en: "Where is the metro station?",
    zh: "地铁站在哪里？",
    keys: "metro subway station underground tube" },

  { icon: "🚶", cat: "directions",
    en: "Do I need to walk far?",
    zh: "要走很远吗？",
    keys: "walk far distance" },

  { icon: "🚕", cat: "directions",
    en: "Can I walk there?",
    zh: "可以走过去吗？",
    keys: "walk on foot" },

  { icon: "🚏", cat: "directions",
    en: "Which platform?",
    zh: "请问在哪个站台？",
    keys: "platform track" },

  { icon: "🗺️", cat: "directions",
    en: "Is there a map?",
    zh: "请问有地图吗？",
    keys: "map guide" },

  /* ============================================================
     medical — saying what is wrong, finding help
     ============================================================ */
  { icon: "🤒", cat: "medical",
    en: "I don't feel well.",
    zh: "我身体不舒服。",
    keys: "ill sick unwell" },

  { icon: "👨‍⚕️", cat: "medical",
    en: "I need to see a doctor.",
    zh: "我需要看医生。",
    keys: "doctor physician see" },

  { icon: "💊", cat: "medical",
    en: "Where is the pharmacy?",
    zh: "药店在哪里？",
    keys: "pharmacy chemist drugstore medicine" },

  { icon: "💊", cat: "medical",
    en: "I am taking this medicine.",
    zh: "我在吃这个药。",
    keys: "medicine medication taking" },

  { icon: "🩹", cat: "medical",
    en: "Do you have a bandage?",
    zh: "请问有创可贴吗？",
    keys: "bandage plaster dressing" },

  { icon: "🚑", cat: "medical",
    en: "Please take me to a hospital.",
    zh: "请带我去医院。",
    keys: "hospital clinic" },

  { icon: "🩺", cat: "medical",
    en: "Can you help me find a doctor?",
    zh: "可以帮我找一个医生吗？",
    keys: "doctor find help" },

  { icon: "💉", cat: "medical",
    en: "Can I buy this without a prescription?",
    zh: "这个药需要处方吗？",
    keys: "prescription medicine buy" },

  { icon: "🏥", cat: "medical",
    en: "Is there a doctor who speaks English?",
    zh: "有会说英语的医生吗？",
    keys: "doctor english speak" },

  { icon: "📝", cat: "medical",
    en: "Can you write down the medicine name?",
    zh: "可以帮我写下药名吗？",
    keys: "medicine name write" },

  { icon: "🤕", cat: "medical",
    en: "I need a painkiller.",
    zh: "我需要止痛药。",
    keys: "painkiller pain relief medicine" },

  { icon: "😷", cat: "medical",
    en: "I have a cold.",
    zh: "我感冒了。",
    keys: "cold flu cough" },

  /* ============================================================
     emergency — urgent help
     ============================================================ */
  { icon: "🆘", cat: "emergency",
    en: "I need help.",
    zh: "我需要帮助。",
    keys: "help emergency urgent" },

  { icon: "🚓", cat: "emergency",
    en: "Please call the police.",
    zh: "请报警。",
    keys: "police call 110" },

  { icon: "🚑", cat: "emergency",
    en: "Please call an ambulance.",
    zh: "请叫救护车。",
    keys: "ambulance 120" },

  { icon: "🔥", cat: "emergency",
    en: "There is a fire.",
    zh: "着火了。",
    keys: "fire 119" },

  { icon: "⚠️", cat: "emergency",
    en: "There is an emergency.",
    zh: "这里有紧急情况。",
    keys: "emergency urgent" },

  { icon: "👮", cat: "emergency",
    en: "Where is the nearest police station?",
    zh: "最近的警察局在哪里？",
    keys: "police station nearest" },

  { icon: "📄", cat: "emergency",
    en: "I need a police report.",
    zh: "我需要一份报警记录。",
    keys: "police report statement insurance" },

  { icon: "🗣️", cat: "emergency",
    en: "Please find an interpreter.",
    zh: "请帮我找一个翻译。",
    keys: "interpreter translator" },

  { icon: "🙏", cat: "emergency",
    en: "Please help me.",
    zh: "请帮帮我。",
    keys: "help" },

  { icon: "🚗", cat: "emergency",
    en: "I had an accident.",
    zh: "我出车祸了。",
    keys: "accident crash car" },

  { icon: "🏥", cat: "emergency",
    en: "Please take me to the nearest hospital.",
    zh: "请带我去最近的医院。",
    keys: "hospital nearest" },

  { icon: "😰", cat: "emergency",
    en: "Someone is following me.",
    zh: "有人跟着我。",
    keys: "follow stalk behind" },

  { icon: "🎒", cat: "emergency",
    en: "My bag was stolen.",
    zh: "我的包被偷了。",
    keys: "stolen theft rob bag" },

  /* ============================================================
     payment — paying and money
     ============================================================ */
  { icon: "💳", cat: "payment",
    en: "Can I pay by card?",
    zh: "可以刷卡吗？",
    keys: "card credit debit" },

  { icon: "📱", cat: "payment",
    en: "Can I pay by Alipay?",
    zh: "可以用支付宝吗？",
    keys: "alipay" },

  { icon: "💚", cat: "payment",
    en: "Can I pay by WeChat?",
    zh: "可以用微信支付吗？",
    keys: "wechat weixin pay" },

  { icon: "💵", cat: "payment",
    en: "Do you take cash?",
    zh: "收现金吗？",
    keys: "cash money yuan" },

  { icon: "❌", cat: "payment",
    en: "My card does not work.",
    zh: "我的卡刷不了。",
    keys: "card fail declined work" },

  { icon: "🧾", cat: "payment",
    en: "Can I have an invoice?",
    zh: "可以开发票吗？",
    keys: "invoice fapiao receipt" },

  { icon: "🍽️", cat: "payment",
    en: "Can we pay separately?",
    zh: "可以分开付吗？",
    keys: "separately split bill each" },

  { icon: "💰", cat: "payment",
    en: "Do you have change?",
    zh: "您有零钱吗？",
    keys: "change small money" },

  { icon: "💱", cat: "payment",
    en: "Where can I change money?",
    zh: "哪里可以换钱？",
    keys: "change money exchange currency" },

  { icon: "💸", cat: "payment",
    en: "Is there a service fee?",
    zh: "有手续费吗？",
    keys: "fee service charge commission" },

  { icon: "🔢", cat: "payment",
    en: "I think the change is wrong.",
    zh: "我觉得找零不对。",
    keys: "change wrong money short" },

  { icon: "🏧", cat: "payment",
    en: "Where is the ATM?",
    zh: "请问 ATM 在哪里？",
    keys: "atm cash machine withdrawal" },

  { icon: "📱", cat: "payment",
    en: "My phone payment is not working.",
    zh: "我的手机支付用不了。",
    keys: "phone payment fail" },

  /* ============================================================
     documents — passport, customs, forms
     ============================================================ */
  { icon: "🛂", cat: "documents",
    en: "I am a foreign tourist.",
    zh: "我是外国游客。",
    keys: "foreign tourist visitor" },

  { icon: "📕", cat: "documents",
    en: "Here is my passport.",
    zh: "这是我的护照。",
    keys: "passport here" },

  { icon: "📄", cat: "documents",
    en: "I don't have this document.",
    zh: "我没有这份文件。",
    keys: "document paper form" },

  { icon: "🛃", cat: "documents",
    en: "Do I need to declare this?",
    zh: "这个需要申报吗？",
    keys: "declare customs" },

  { icon: "🧳", cat: "documents",
    en: "Where is the baggage claim?",
    zh: "请问在哪里取行李？",
    keys: "baggage luggage claim belt" },

  { icon: "🛄", cat: "documents",
    en: "My luggage did not arrive.",
    zh: "我的行李没有到。",
    keys: "luggage arrive missing lost" },

  { icon: "📷", cat: "documents",
    en: "Is photography allowed here?",
    zh: "这里可以拍照吗？",
    keys: "photo camera picture" },

  { icon: "📅", cat: "documents",
    en: "How long can I stay?",
    zh: "我可以停留多久？",
    keys: "stay long duration visa" },

  { icon: "🛂", cat: "documents",
    en: "Where is immigration?",
    zh: "请问入境处在哪儿？",
    keys: "immigration passport control border" },

  { icon: "📄", cat: "documents",
    en: "Can I have a copy of this?",
    zh: "可以给我一份复印件吗？",
    keys: "copy photocopy duplicate" },

  { icon: "🧾", cat: "documents",
    en: "Where do I fill in this form?",
    zh: "这个表格填在哪里？",
    /* "table" removed on purpose: it is a form, and the synonym sent "a table
       for two" here instead of to the restaurant card. */
    keys: "form fill paperwork" },

  /* ============================================================
     phone — battery, signal, contact
     ============================================================ */
  { icon: "📱", cat: "phone",
    en: "My phone is about to die.",
    zh: "我的手机快没电了。",
    keys: "phone battery die charge" },

  { icon: "🔌", cat: "phone",
    en: "Can I charge my phone here?",
    zh: "我可以在这里充电吗？",
    keys: "charge phone plug" },

  { icon: "📶", cat: "phone",
    en: "Is there Wi-Fi here?",
    zh: "请问这里有 Wi-Fi 吗？",
    keys: "wifi internet network" },

  { icon: "📵", cat: "phone",
    en: "My phone has no signal.",
    zh: "我的手机没有信号。",
    keys: "signal network reception" },

  { icon: "☎️", cat: "phone",
    en: "Can I use your phone?",
    zh: "可以借我用一下电话吗？",
    keys: "phone use borrow call" },

  { icon: "🔋", cat: "phone",
    en: "Where can I buy a charger?",
    zh: "哪里可以买到充电器？",
    keys: "charger cable" },

  { icon: "📶", cat: "phone",
    en: "The Wi-Fi is not working.",
    zh: "Wi-Fi 连不上。",
    keys: "wifi network fail connect" },

  { icon: "📞", cat: "phone",
    en: "Please call this number.",
    zh: "请打这个电话号码。",
    keys: "call number dial" },

  { icon: "🔋", cat: "phone",
    en: "I need a power bank.",
    zh: "我需要一个充电宝。",
    keys: "power bank battery portable" },

  { icon: "🔌", cat: "phone",
    en: "Do you have an iPhone charger?",
    zh: "请问有苹果充电器吗？",
    keys: "iphone charger cable" },

  /* ============================================================
     weather — small talk and practical cover
     ============================================================ */
  { icon: "☔", cat: "weather",
    en: "It is going to rain.",
    zh: "快下雨了。",
    keys: "rain raining" },

  { icon: "☂️", cat: "weather",
    en: "Do you have an umbrella?",
    zh: "请问有伞吗？",
    keys: "umbrella rain" },

  { icon: "🥵", cat: "weather",
    en: "It is very hot today.",
    zh: "今天很热。",
    keys: "hot heat warm" },

  { icon: "🥶", cat: "weather",
    en: "It is very cold today.",
    zh: "今天很冷。",
    keys: "cold cool" },

  { icon: "🌫️", cat: "weather",
    en: "Is the air quality bad today?",
    zh: "今天空气不好吗？",
    keys: "air quality pollution smog" },

  { icon: "🌧️", cat: "weather",
    en: "Will it rain tomorrow?",
    zh: "明天会下雨吗？",
    keys: "rain tomorrow" },

  { icon: "🌀", cat: "weather",
    en: "Is there a typhoon warning?",
    zh: "有台风预警吗？",
    keys: "typhoon warning storm" },

  { icon: "❄️", cat: "weather",
    en: "Does it snow here?",
    zh: "这里会下雪吗？",
    keys: "snow winter" },

  { icon: "🌡️", cat: "weather",
    en: "What is the temperature today?",
    zh: "今天多少度？",
    keys: "temperature degrees" },

  { icon: "🧥", cat: "weather",
    en: "Do I need a jacket?",
    zh: "需要穿外套吗？",
    keys: "jacket coat wear" },

  { icon: "💨", cat: "weather",
    en: "Is it windy today?",
    zh: "今天风大吗？",
    keys: "wind windy" },

  /* ============================================================
     social — friendly openers
     ============================================================ */
  { icon: "👋", cat: "social",
    en: "Nice to meet you.",
    zh: "很高兴认识你。",
    keys: "nice meet pleased" },

  { icon: "🎂", cat: "social",
    en: "What is your name?",
    zh: "请问你叫什么名字？",
    keys: "name called" },

  { icon: "🌍", cat: "social",
    en: "Where are you from?",
    zh: "你是哪里人？",
    keys: "from country where" },

  { icon: "📷", cat: "social",
    en: "Can I take a photo with you?",
    zh: "可以和你合影吗？",
    keys: "photo picture together" },

  { icon: "🍻", cat: "social",
    en: "Cheers!",
    zh: "干杯！",
    keys: "cheers toast" },

  { icon: "😊", cat: "social",
    en: "You are very kind.",
    zh: "你人真好。",
    keys: "kind nice helpful" },

  { icon: "👋", cat: "social",
    en: "Goodbye.",
    zh: "再见。",
    keys: "bye goodbye see later" },

  { icon: "🙇", cat: "social",
    en: "Sorry.",
    zh: "对不起。",
    keys: "sorry excuse apologies" },

  { icon: "👍", cat: "social",
    en: "That sounds great.",
    zh: "太好了。",
    keys: "great nice good" },

  { icon: "💬", cat: "social",
    en: "Can I add you on WeChat?",
    zh: "可以加你微信吗？",
    keys: "wechat add friend" },

  { icon: "🔍", cat: "social",
    en: "Do you have WeChat?",
    zh: "你有微信吗？",
    keys: "wechat" },

  /* ============================================================
     templates — %s is replaced by a fill's zh
     ============================================================ */
  { icon: "🥜", cat: "food",
    en: "I am allergic to %s.",
    zh: "我对%s过敏。",
    fill: [
      { en: "peanuts", zh: "花生", keys: "peanut nuts groundnut" },
      { en: "seafood", zh: "海鲜", keys: "shellfish shrimp prawn crab lobster fish" },
      { en: "shellfish", zh: "贝类", keys: "shellfish prawn shrimp crab mussel" },
      { en: "nuts", zh: "坚果", keys: "nuts tree nuts peanut cashew" },
      { en: "milk", zh: "牛奶", keys: "milk dairy lactose" },
      { en: "eggs", zh: "鸡蛋", keys: "egg eggs" },
      { en: "wheat", zh: "小麦", keys: "wheat flour" },
      { en: "gluten", zh: "麸质", keys: "gluten flour wheat" },
      { en: "soy", zh: "大豆", keys: "soy soya soybean" },
      { en: "msg", zh: "味精", keys: "msg monosodium glutamate seasoning" },
      { en: "sesame", zh: "芝麻", keys: "sesame seed" },
      { en: "beef", zh: "牛肉", keys: "beef cow" },
      { en: "pork", zh: "猪肉", keys: "pork pig" },
      { en: "alcohol", zh: "酒精", keys: "alcohol beer wine spirits" },
      { en: "penicillin", zh: "青霉素", keys: "penicillin antibiotic" },
    ] },

  { icon: "🚫", cat: "food",
    en: "I don't eat %s.",
    zh: "我不吃%s。",
    fill: [
      { en: "pork", zh: "猪肉", keys: "pork pig" },
      { en: "beef", zh: "牛肉", keys: "beef cow" },
      { en: "lamb", zh: "羊肉", keys: "lamb mutton sheep" },
      { en: "chicken", zh: "鸡肉", keys: "chicken poultry" },
      { en: "fish", zh: "鱼", keys: "fish seafood" },
      { en: "seafood", zh: "海鲜", keys: "seafood shellfish shrimp" },
      { en: "eggs", zh: "鸡蛋", keys: "egg eggs" },
      { en: "dairy", zh: "奶制品", keys: "dairy milk cheese" },
      { en: "garlic", zh: "大蒜", keys: "garlic" },
      { en: "meat", zh: "肉", keys: "meat vegetarian" },
      { en: "spicy food", zh: "辣的东西", keys: "spicy hot chilli" },
      { en: "animal products", zh: "动物制品", keys: "vegan animal products" },
    ] },

  { icon: "🌿", cat: "food",
    en: "Please don't put %s in it.",
    zh: "请不要放%s。",
    fill: [
      { en: "coriander", zh: "香菜", keys: "cilantro coriander" },
      { en: "chilli", zh: "辣椒", keys: "chili chilli pepper spicy" },
      { en: "garlic", zh: "大蒜", keys: "garlic" },
      { en: "ginger", zh: "姜", keys: "ginger" },
      { en: "msg", zh: "味精", keys: "msg monosodium seasoning" },
      { en: "sugar", zh: "糖", keys: "sugar sweet" },
      { en: "ice", zh: "冰", keys: "ice cold" },
      { en: "peanuts", zh: "花生", keys: "peanut nuts" },
      { en: "sesame", zh: "芝麻", keys: "sesame" },
      { en: "oil", zh: "油", keys: "oil greasy" },
    ] },

  { icon: "🍲", cat: "food",
    en: "This is %s, not what I ordered.",
    zh: "这是%s，不是我点的。",
    fill: [
      { en: "cold", zh: "凉的", keys: "cold" },
      { en: "undercooked", zh: "没熟的", keys: "undercooked raw" },
      { en: "the wrong dish", zh: "上错的菜", keys: "wrong dish order" },
      { en: "the wrong drink", zh: "上错的饮料", keys: "wrong drink" },
      { en: "too salty", zh: "太咸的", keys: "salty" },
      { en: "too spicy", zh: "太辣的", keys: "spicy hot" },
      { en: "not fresh", zh: "不新鲜的", keys: "fresh stale" },
      { en: "missing an item", zh: "少了一道菜", keys: "missing item order" },
    ] },

  { icon: "🚕", cat: "taxi",
    en: "Please take me to %s.",
    zh: "请带我去%s。",
    fill: [
      { en: "the airport", zh: "机场", keys: "airport flight terminal" },
      { en: "the railway station", zh: "火车站", keys: "train station rail" },
      { en: "the high-speed rail station", zh: "高铁站", keys: "high speed rail train station" },
      { en: "the metro station", zh: "地铁站", keys: "metro subway underground" },
      { en: "my hotel", zh: "我的酒店", keys: "hotel accommodation" },
      { en: "the hospital", zh: "医院", keys: "hospital clinic" },
      { en: "the pharmacy", zh: "药店", keys: "pharmacy chemist drugstore" },
      { en: "the police station", zh: "警察局", keys: "police station" },
      { en: "the taxi rank", zh: "出租车候车点", keys: "taxi rank stand queue" },
      { en: "the nearest ATM", zh: "最近的 ATM", keys: "atm cash machine" },
      { en: "the supermarket", zh: "超市", keys: "supermarket grocery" },
      { en: "this address", zh: "这个地址", keys: "address place" },
      { en: "the city centre", zh: "市中心", keys: "city centre center downtown" },
      { en: "the bus station", zh: "汽车站", keys: "bus coach station" },
      { en: "terminal 2", zh: "二号航站楼", keys: "terminal airport" },
    ] },

  { icon: "🚖", cat: "taxi",
    en: "I need a taxi to %s.",
    zh: "我需要一辆去%s的出租车。",
    fill: [
      { en: "the airport", zh: "机场", keys: "airport flight terminal" },
      { en: "the railway station", zh: "火车站", keys: "train station rail" },
      { en: "the city centre", zh: "市中心", keys: "city centre center downtown" },
      { en: "my hotel", zh: "我的酒店", keys: "hotel accommodation" },
      { en: "this address", zh: "这个地址", keys: "address place" },
      { en: "the exhibition centre", zh: "展览中心", keys: "exhibition convention centre" },
      { en: "the hospital", zh: "医院", keys: "hospital clinic" },
      { en: "the metro station", zh: "地铁站", keys: "metro subway station" },
    ] },

  { icon: "🏥", cat: "emergency",
    en: "Please take me to the nearest %s.",
    zh: "请带我去最近的%s。",
    fill: [
      { en: "hospital", zh: "医院", keys: "hospital clinic" },
      { en: "pharmacy", zh: "药店", keys: "pharmacy chemist drugstore" },
      { en: "police station", zh: "警察局", keys: "police station" },
      { en: "metro station", zh: "地铁站", keys: "metro subway" },
      { en: "ATM", zh: "取款机", keys: "atm cash machine" },
      { en: "toilet", zh: "洗手间", keys: "toilet loo restroom" },
      { en: "hotel", zh: "酒店", keys: "hotel accommodation" },
      { en: "taxi rank", zh: "出租车站", keys: "taxi rank stand" },
      { en: "supermarket", zh: "超市", keys: "supermarket grocery" },
      { en: "petrol station", zh: "加油站", keys: "petrol gas fuel station" },
    ] },

  { icon: "💰", cat: "shopping",
    en: "How much is %s?",
    zh: "%s多少钱？",
    fill: [
      { en: "this", zh: "这个", keys: "this item" },
      { en: "one night", zh: "一晚", keys: "night stay hotel" },
      { en: "a ticket to Beijing", zh: "去北京的票", keys: "ticket train beijing" },
      { en: "a taxi to the airport", zh: "去机场的出租车", keys: "taxi airport fare" },
      { en: "the deposit", zh: "押金", keys: "deposit bond" },
      { en: "a SIM card", zh: "手机卡", keys: "sim card mobile" },
      { en: "breakfast", zh: "早餐", keys: "breakfast" },
      { en: "the entrance fee", zh: "门票", keys: "entrance ticket" },
      { en: "one day", zh: "一天", keys: "day rental" },
      { en: "one kilo", zh: "一公斤", keys: "kilo kilogram weight" },
    ] },

  { icon: "🛍️", cat: "shopping",
    en: "Do you have %s?",
    zh: "你们有%s吗？",
    fill: [
      { en: "a smaller size", zh: "小一号的", keys: "smaller size" },
      { en: "a bigger size", zh: "大一号的", keys: "bigger larger size" },
      { en: "another colour", zh: "别的颜色", keys: "colour color shade" },
      { en: "a bag", zh: "袋子", keys: "bag carrier" },
      { en: "a receipt", zh: "发票", keys: "receipt invoice fapiao" },
      { en: "a SIM card", zh: "手机卡", keys: "sim card mobile" },
      { en: "an English menu", zh: "英文菜单", keys: "english menu" },
      { en: "vegetarian food", zh: "素食", keys: "vegetarian veggie" },
      { en: "soy milk", zh: "豆浆", keys: "soy milk" },
      { en: "Wi-Fi", zh: "Wi-Fi", keys: "wifi internet network" },
      { en: "a charger", zh: "充电器", keys: "charger cable" },
      { en: "change", zh: "零钱", keys: "change small money" },
      { en: "an umbrella", zh: "伞", keys: "umbrella rain" },
    ] },

  { icon: "🙏", cat: "basics",
    en: "I need %s.",
    zh: "我需要%s。",
    fill: [
      { en: "help", zh: "帮助", keys: "help assistance" },
      { en: "a doctor", zh: "医生", keys: "doctor physician" },
      { en: "a taxi", zh: "出租车", keys: "taxi cab" },
      { en: "a SIM card", zh: "手机卡", keys: "sim card mobile" },
      { en: "a phone charger", zh: "手机充电器", keys: "charger cable" },
      { en: "a power bank", zh: "充电宝", keys: "power bank battery" },
      { en: "an umbrella", zh: "一把伞", keys: "umbrella rain" },
      { en: "a receipt", zh: "发票", keys: "receipt fapiao" },
      { en: "a translator", zh: "翻译", keys: "translator interpreter" },
      { en: "cash", zh: "现金", keys: "cash money" },
      { en: "a wheelchair", zh: "轮椅", keys: "wheelchair" },
      { en: "a bandage", zh: "创可贴", keys: "bandage plaster" },
      { en: "a pen", zh: "一支笔", keys: "pen" },
      { en: "a blanket", zh: "一条毯子", keys: "blanket" },
      { en: "a quiet room", zh: "一间安静的房间", keys: "quiet room hotel" },
    ] },

  { icon: "🤲", cat: "basics",
    en: "Can I have %s?",
    zh: "可以给我%s吗？",
    fill: [
      { en: "a menu", zh: "菜单", keys: "menu" },
      { en: "some water", zh: "一杯水", keys: "water drink" },
      { en: "hot water", zh: "一杯热水", keys: "hot water warm" },
      { en: "a tissue", zh: "一张纸巾", keys: "tissue napkin" },
      { en: "chopsticks", zh: "一双筷子", keys: "chopsticks" },
      { en: "a fork", zh: "一把叉子", keys: "fork" },
      { en: "a spoon", zh: "一把勺子", keys: "spoon" },
      { en: "a bag", zh: "一个袋子", keys: "bag" },
      { en: "the bill", zh: "账单", keys: "bill check" },
      { en: "a receipt", zh: "发票", keys: "receipt fapiao" },
      { en: "some ice", zh: "一些冰块", keys: "ice" },
      { en: "a pen", zh: "一支笔", keys: "pen" },
    ] },

  { icon: "✍️", cat: "basics",
    en: "Please write %s in Chinese for me.",
    zh: "请帮我把%s写成中文。",
    fill: [
      { en: "the address", zh: "这个地址", keys: "address" },
      { en: "the name", zh: "这个名字", keys: "name" },
      { en: "the price", zh: "这个价格", keys: "price" },
      { en: "the hotel name", zh: "酒店的名字", keys: "hotel name" },
      { en: "the dish name", zh: "这道菜的名字", keys: "dish food name" },
      { en: "the medicine name", zh: "这个药的名字", keys: "medicine name" },
      { en: "the directions", zh: "怎么走", keys: "directions way" },
      { en: "your phone number", zh: "你的电话", keys: "phone number" },
      { en: "the metro line", zh: "地铁线路", keys: "metro line" },
      { en: "my name", zh: "我的名字", keys: "my name" },
    ] },

  { icon: "🔎", cat: "directions",
    en: "I am looking for %s.",
    zh: "我在找%s。",
    fill: [
      { en: "the metro station", zh: "地铁站", keys: "metro subway station" },
      { en: "the bus stop", zh: "公交站", keys: "bus stop" },
      { en: "the taxi rank", zh: "出租车站", keys: "taxi rank stand" },
      { en: "the toilet", zh: "洗手间", keys: "toilet loo restroom" },
      { en: "the exit", zh: "出口", keys: "exit way out" },
      { en: "the platform", zh: "站台", keys: "platform" },
      { en: "the ticket office", zh: "售票处", keys: "ticket office" },
      { en: "the luggage lockers", zh: "行李寄存处", keys: "luggage lockers storage" },
      { en: "the pharmacy", zh: "药店", keys: "pharmacy chemist" },
      { en: "the supermarket", zh: "超市", keys: "supermarket grocery" },
      { en: "the hotel", zh: "酒店", keys: "hotel" },
      { en: "the lost and found", zh: "失物招领处", keys: "lost found" },
    ] },

  { icon: "➡️", cat: "directions",
    en: "I want to go to %s.",
    zh: "我想去%s。",
    fill: [
      { en: "the toilet", zh: "洗手间", keys: "toilet loo restroom" },
      { en: "the airport", zh: "机场", keys: "airport" },
      { en: "the railway station", zh: "火车站", keys: "train station rail" },
      { en: "the metro station", zh: "地铁站", keys: "metro subway station" },
      { en: "the city centre", zh: "市中心", keys: "city centre downtown" },
      { en: "the market", zh: "市场", keys: "market" },
      { en: "the museum", zh: "博物馆", keys: "museum" },
      { en: "the supermarket", zh: "超市", keys: "supermarket grocery" },
      { en: "the pharmacy", zh: "药店", keys: "pharmacy chemist" },
      { en: "this place", zh: "这个地方", keys: "this place here" },
      { en: "the ticket office", zh: "售票处", keys: "ticket office" },
      { en: "the bus station", zh: "汽车站", keys: "bus coach station" },
    ] },

  { icon: "🏪", cat: "directions",
    en: "Is there a %s nearby?",
    zh: "附近有%s吗？",
    fill: [
      { en: "supermarket", zh: "超市", keys: "supermarket grocery" },
      { en: "pharmacy", zh: "药店", keys: "pharmacy chemist drugstore" },
      { en: "metro station", zh: "地铁站", keys: "metro subway" },
      { en: "ATM", zh: "取款机", keys: "atm cash machine" },
      { en: "convenience store", zh: "便利店", keys: "convenience store" },
      { en: "toilet", zh: "洗手间", keys: "toilet loo restroom" },
      { en: "hospital", zh: "医院", keys: "hospital clinic" },
      { en: "bank", zh: "银行", keys: "bank" },
      { en: "restaurant", zh: "餐厅", keys: "restaurant" },
      { en: "police station", zh: "警察局", keys: "police station" },
      { en: "petrol station", zh: "加油站", keys: "petrol gas fuel" },
      { en: "taxi rank", zh: "出租车站", keys: "taxi rank stand" },
    ] },

  { icon: "🛣️", cat: "directions",
    en: "Is this the way to %s?",
    zh: "这是去%s的路吗？",
    fill: [
      { en: "the railway station", zh: "火车站", keys: "train station rail" },
      { en: "the metro station", zh: "地铁站", keys: "metro subway station" },
      { en: "the airport", zh: "机场", keys: "airport" },
      { en: "the city centre", zh: "市中心", keys: "city centre downtown" },
      { en: "the museum", zh: "博物馆", keys: "museum" },
      { en: "the market", zh: "市场", keys: "market" },
      { en: "my hotel", zh: "我的酒店", keys: "hotel" },
      { en: "the park", zh: "公园", keys: "park" },
    ] },

  { icon: "⏳", cat: "directions",
    en: "How long does it take to get to %s?",
    zh: "去%s要多久？",
    fill: [
      { en: "the airport", zh: "机场", keys: "airport" },
      { en: "the railway station", zh: "火车站", keys: "train station rail" },
      { en: "the city centre", zh: "市中心", keys: "city centre downtown" },
      { en: "my hotel", zh: "我的酒店", keys: "hotel" },
      { en: "the metro station", zh: "地铁站", keys: "metro subway station" },
      { en: "the museum", zh: "博物馆", keys: "museum" },
      { en: "the next town", zh: "下一个镇", keys: "next town city" },
    ] },

  { icon: "💳", cat: "payment",
    en: "Can I pay with %s?",
    zh: "可以用%s付款吗？",
    fill: [
      { en: "a credit card", zh: "信用卡", keys: "credit card" },
      { en: "a debit card", zh: "借记卡", keys: "debit card" },
      { en: "a foreign card", zh: "境外银行卡", keys: "foreign overseas card" },
      { en: "Alipay", zh: "支付宝", keys: "alipay" },
      { en: "WeChat Pay", zh: "微信支付", keys: "wechat weixin pay" },
      { en: "cash", zh: "现金", keys: "cash money" },
      { en: "US dollars", zh: "美元", keys: "usd dollar foreign currency" },
      { en: "Apple Pay", zh: "Apple Pay", keys: "apple pay" },
      { en: "a bank transfer", zh: "银行转账", keys: "bank transfer" },
      { en: "my phone", zh: "手机", keys: "phone mobile contactless" },
    ] },

  { icon: "🧾", cat: "payment",
    en: "Can I get a receipt for %s?",
    zh: "可以给我%s的发票吗？",
    fill: [
      { en: "this purchase", zh: "这次消费", keys: "purchase shopping" },
      { en: "the room", zh: "住宿", keys: "room hotel stay" },
      { en: "the taxi", zh: "打车", keys: "taxi ride" },
      { en: "dinner", zh: "晚餐", keys: "dinner meal" },
      { en: "breakfast", zh: "早餐", keys: "breakfast" },
      { en: "the deposit", zh: "押金", keys: "deposit bond" },
      { en: "the tour", zh: "旅游", keys: "tour trip" },
      { en: "the transfer", zh: "转账", keys: "transfer payment" },
    ] },

  { icon: "🛎️", cat: "hotel",
    en: "I have a reservation for %s.",
    zh: "我预订了%s。",
    fill: [
      { en: "tonight", zh: "今晚", keys: "tonight" },
      { en: "tomorrow night", zh: "明晚", keys: "tomorrow night" },
      { en: "two nights", zh: "两晚", keys: "two nights stay" },
      { en: "a double room", zh: "一间大床房", keys: "double room bed" },
      { en: "a twin room", zh: "一间双床房", keys: "twin room two beds" },
      { en: "one person", zh: "一位", keys: "one person single" },
      { en: "two people", zh: "两位", keys: "two people double" },
      { en: "a room with a view", zh: "一间景观房", keys: "room view window" },
    ] },

  { icon: "🔢", cat: "hotel",
    en: "My room number is %s.",
    zh: "我的房间号是%s。",
    fill: [
      { en: "202", zh: "202", keys: "room number" },
      { en: "305", zh: "305", keys: "room number" },
      { en: "512", zh: "512", keys: "room number" },
      { en: "916", zh: "916", keys: "room number" },
      { en: "1208", zh: "1208", keys: "room number" },
      { en: "1802", zh: "1802", keys: "room number" },
      { en: "3015", zh: "3015", keys: "room number" },
    ] },

  { icon: "🏨", cat: "hotel",
    en: "I am staying at %s.",
    zh: "我住在%s。",
    fill: [
      { en: "this hotel", zh: "这家酒店", keys: "hotel this" },
      { en: "the hotel on this card", zh: "这张卡片上的酒店", keys: "hotel card address" },
      { en: "a hotel nearby", zh: "附近的酒店", keys: "nearby hotel" },
      { en: "my friend's place", zh: "我朋友家", keys: "friend home house" },
      { en: "this address", zh: "这个地址", keys: "address" },
      { en: "the city centre", zh: "市中心", keys: "city centre downtown" },
      { en: "the airport hotel", zh: "机场酒店", keys: "airport hotel" },
      { en: "the Hilton", zh: "希尔顿酒店", keys: "hilton hotel name" },
    ] },

  { icon: "📞", cat: "phone",
    en: "Can you help me call %s?",
    zh: "可以帮我拨打%s吗？",
    fill: [
      { en: "the police", zh: "报警电话", keys: "police 110" },
      { en: "an ambulance", zh: "急救电话", keys: "ambulance 120" },
      { en: "my friend", zh: "我朋友", keys: "friend" },
      { en: "my hotel", zh: "我的酒店", keys: "hotel" },
      { en: "the embassy", zh: "大使馆", keys: "embassy consulate" },
      { en: "a taxi", zh: "出租车", keys: "taxi cab" },
      { en: "my airline", zh: "我的航空公司", keys: "airline flight" },
      { en: "my family", zh: "我的家人", keys: "family home" },
    ] },

  { icon: "🎒", cat: "emergency",
    en: "I lost my %s.",
    zh: "我的%s丢了。",
    fill: [
      { en: "passport", zh: "护照", keys: "passport" },
      { en: "phone", zh: "手机", keys: "phone mobile" },
      { en: "wallet", zh: "钱包", keys: "wallet purse" },
      { en: "bag", zh: "包", keys: "bag backpack" },
      { en: "luggage", zh: "行李", keys: "luggage suitcase bags" },
      { en: "keys", zh: "钥匙", keys: "keys" },
      { en: "ticket", zh: "票", keys: "ticket" },
      { en: "credit card", zh: "信用卡", keys: "credit card" },
      { en: "ID card", zh: "身份证", keys: "id card identity" },
      { en: "camera", zh: "相机", keys: "camera" },
      { en: "jacket", zh: "外套", keys: "jacket coat" },
    ] },

  { icon: "📵", cat: "phone",
    en: "My %s is not working.",
    zh: "我的%s坏了。",
    fill: [
      { en: "phone", zh: "手机", keys: "phone mobile" },
      { en: "Wi-Fi", zh: "Wi-Fi", keys: "wifi internet network" },
      { en: "SIM card", zh: "手机卡", keys: "sim card mobile" },
      { en: "charger", zh: "充电器", keys: "charger cable" },
      { en: "air conditioning", zh: "空调", keys: "air conditioning ac" },
      { en: "room key", zh: "房卡", keys: "room key card" },
      { en: "laptop", zh: "电脑", keys: "laptop computer" },
      { en: "power bank", zh: "充电宝", keys: "power bank battery" },
    ] },

  { icon: "❓", cat: "social",
    en: "What is your %s?",
    zh: "请问你的%s是多少？",
    fill: [
      { en: "phone number", zh: "电话号码", keys: "phone number mobile" },
      { en: "WeChat", zh: "微信号", keys: "wechat weixin" },
      { en: "email address", zh: "邮箱地址", keys: "email" },
      { en: "room number", zh: "房间号", keys: "room number hotel" },
      { en: "address", zh: "地址", keys: "address" },
      { en: "name", zh: "名字", keys: "name" },
    ] },

  { icon: "🤢", cat: "medical",
    en: "I feel %s.",
    zh: "我觉得%s。",
    fill: [
      { en: "dizzy", zh: "头晕", keys: "dizzy giddy" },
      { en: "nauseous", zh: "想吐", keys: "nauseous sick vomit" },
      { en: "weak", zh: "没力气", keys: "weak tired" },
      { en: "cold", zh: "发冷", keys: "cold chills" },
      { en: "hot", zh: "发热", keys: "hot feverish" },
      { en: "short of breath", zh: "喘不上气", keys: "breath breathing" },
      { en: "itchy", zh: "痒", keys: "itchy itch" },
      { en: "faint", zh: "快晕倒了", keys: "faint pass out" },
    ] },

  { icon: "🩺", cat: "medical",
    en: "I have a %s.",
    zh: "我%s。",
    fill: [
      { en: "headache", zh: "头疼", keys: "headache head" },
      { en: "fever", zh: "发烧", keys: "fever temperature" },
      { en: "stomachache", zh: "肚子疼", keys: "stomach ache tummy" },
      { en: "sore throat", zh: "嗓子疼", keys: "throat sore" },
      { en: "cough", zh: "咳嗽", keys: "cough" },
      { en: "cold", zh: "感冒", keys: "cold flu" },
      { en: "toothache", zh: "牙疼", keys: "toothache tooth dental" },
      { en: "rash", zh: "皮疹", keys: "rash skin" },
      { en: "backache", zh: "腰疼", keys: "back ache" },
      { en: "runny nose", zh: "流鼻涕", keys: "runny nose cold" },
      { en: "earache", zh: "耳朵疼", keys: "ear ache" },
      { en: "broken arm", zh: "胳膊骨折", keys: "broken arm fracture" },
    ] },

  { icon: "🗣️", cat: "basics",
    en: "Please speak %s.",
    zh: "请%s。",
    fill: [
      { en: "more slowly", zh: "慢一点", keys: "slow slowly" },
      { en: "more clearly", zh: "清楚一点", keys: "clear clearly" },
      { en: "more loudly", zh: "大声一点", keys: "loud louder" },
      { en: "in English", zh: "用英语", keys: "english" },
      { en: "in simple Chinese", zh: "说简单的中文", keys: "simple easy chinese" },
      { en: "one more time", zh: "再说一遍", keys: "again repeat" },
    ] },

  { icon: "🕐", cat: "shopping",
    en: "What time does %s open?",
    zh: "%s几点开门？",
    fill: [
      { en: "the museum", zh: "博物馆", keys: "museum" },
      { en: "the market", zh: "市场", keys: "market" },
      { en: "the shop", zh: "商店", keys: "shop store" },
      { en: "the pharmacy", zh: "药店", keys: "pharmacy chemist" },
      { en: "the supermarket", zh: "超市", keys: "supermarket grocery" },
      { en: "the park", zh: "公园", keys: "park" },
      { en: "the metro", zh: "地铁", keys: "metro subway" },
      { en: "the restaurant", zh: "餐厅", keys: "restaurant" },
    ] },

  { icon: "🛂", cat: "documents",
    en: "I am here for %s.",
    zh: "我来这里%s。",
    fill: [
      { en: "tourism", zh: "旅游", keys: "tourism holiday sightseeing" },
      { en: "business", zh: "出差", keys: "business work" },
      { en: "study", zh: "学习", keys: "study school" },
      { en: "a holiday", zh: "度假", keys: "holiday vacation" },
      { en: "a conference", zh: "开会", keys: "conference meeting" },
      { en: "visiting family", zh: "探亲", keys: "family visit relatives" },
      { en: "medical treatment", zh: "看病", keys: "medical treatment hospital" },
    ] },
];
