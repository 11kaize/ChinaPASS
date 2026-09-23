/* City notes for arrival, not sightseeing.

   This started as a travel explorer (highlights, food, suggested days) and was
   cut back on purpose: the product is about getting through your first days in
   China, not about where to go. What survives is the part a visitor actually
   trips over — a city can have two airports and several railway stations whose
   Chinese names look nothing alike, and the ticket only says one of them.

   Every field here is a name written in Chinese that you may need to show
   someone, or a mechanical fact about which airport/station you are heading
   for. No recommendations, no opening hours, no prices.

   Names and codes drift. Sources are official city or operator pages; verify
   before relying on any of this. */
const CITIES = [
  {
    id: 'beijing', name: 'Beijing', zh: '北京',
    airport: ['北京首都国际机场（PEK）', '北京大兴国际机场（PKX）'],
    stations: ['北京站', '北京南站', '北京西站', '北京朝阳站'],
    note: 'Two airports, in opposite directions from the centre. The ticket says which — check before you book a transfer, because the two are roughly an hour apart.',
    source: { label: 'Beijing municipal government', url: 'https://english.beijing.gov.cn/' }
  },
  {
    id: 'shanghai', name: 'Shanghai', zh: '上海',
    airport: ['上海浦东国际机场（PVG）', '上海虹桥国际机场（SHA）'],
    stations: ['上海站', '上海南站', '上海虹桥站'],
    note: 'Pudong (PVG) is the international one and sits far east of the centre; Hongqiao (SHA) is close in and shares a complex with the main high-speed rail station. Most high-speed trains leave from 上海虹桥站.',
    source: { label: 'Shanghai municipal government', url: 'https://english.shanghai.gov.cn/' }
  },
  {
    id: 'xian', name: 'Xi’an', zh: '西安',
    airport: ['西安咸阳国际机场（XIY）'],
    stations: ['西安北站', '西安站'],
    note: 'High-speed trains use 西安北站, not 西安站 — the two are on different metro lines and are not interchangeable. The airport is well outside the city.',
    source: { label: 'Shaanxi provincial government', url: 'https://english.shaanxi.gov.cn/' }
  },
  {
    id: 'chengdu', name: 'Chengdu', zh: '成都',
    airport: ['成都双流国际机场（CTU）', '成都天府国际机场（TFU）'],
    stations: ['成都东站', '成都站', '成都南站'],
    note: 'Two airports. Tianfu (TFU) is much further out than Shuangliu (CTU), so the same flight number can mean a very different trip into town. High-speed trains mostly use 成都东站.',
    source: { label: 'Chengdu municipal government', url: 'https://www.chengdu.gov.cn/chengdu/index.shtml' }
  },
  {
    id: 'hangzhou', name: 'Hangzhou', zh: '杭州',
    airport: ['杭州萧山国际机场（HGH）'],
    stations: ['杭州东站', '杭州站', '杭州西站'],
    note: 'Most high-speed trains arrive at 杭州东站, which is not the same as 杭州站. Both are on the metro, but they are several stops apart.',
    source: { label: 'Hangzhou municipal government', url: 'https://www.hangzhou.gov.cn/' }
  },
  {
    id: 'guilin', name: 'Guilin', zh: '桂林',
    airport: ['桂林两江国际机场（KWL）'],
    stations: ['桂林北站', '桂林站', '桂林西站'],
    note: 'High-speed trains stop at 桂林北站, which is north of the centre. 桂林站 is the older central station. Check which one your ticket names before arranging a pickup.',
    source: { label: 'Guilin municipal government', url: 'https://www.guilin.gov.cn/' }
  }
];

/* Two guides, both about clearing the arrival, not about sightseeing. */
const EXPLORE_GUIDES = [
  {
    id: 'entry-check', title: 'Check entry documents', category: 'Before departure', duration: '5 min read',
    summary: 'A reliable way to verify current entry rules for your own passport and route.',
    steps: [
      ['Start with your passport', 'Check validity, available pages, and the name used on every booking.'],
      ['Check the official rule', 'Visa-free arrangements and permitted stays can change. Use the National Immigration Administration and your nearest Chinese mission.'],
      ['Keep a small offline set', 'Save your itinerary, onward ticket if relevant, lodging address in Chinese, and emergency contacts.']
    ],
    source: { label: 'National Immigration Administration', url: 'https://en.nia.gov.cn/n147418/n147463/index.html' }
  },
  {
    id: 'offline-ready', title: 'Make your phone offline-ready', category: 'Before departure', duration: '3 min read',
    summary: 'Prepare maps, key addresses, tickets, and a few phrases while you still have reliable internet.',
    steps: [
      ['Save locations', 'Download map areas and keep the Chinese names of your hotel and next station.'],
      ['Save bookings securely', 'Keep offline copies in a protected location and use the phrase cards for routine requests.'],
      ['Do a short airplane-mode check', 'Open this app, your map, and essential tickets without a connection before departure.']
    ],
    source: { label: 'China Railway passenger FAQ', url: 'https://www.12306.cn/en/faq.html' }
  }
];
