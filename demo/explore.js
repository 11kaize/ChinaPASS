/* Short, original city notes. Links lead to the source responsible for changing details. */
const CITIES = [
  {
    id: 'beijing', name: 'Beijing', zh: '北京', type: 'Heritage', region: 'North China', suggestedDays: 3,
    summary: 'Imperial landmarks, hutong lanes, and a useful first stop for understanding China’s long history.',
    highlights: ['Forbidden City and nearby central landmarks', 'Temple of Heaven park', 'A slower walk through a hutong neighborhood'],
    food: 'Try Beijing roast duck and local wheat noodles.',
    practical: 'Major museums and landmarks may require timed reservations. Check official booking channels before setting the day’s route.',
    source: { label: 'Beijing official ticketing guide', url: 'https://english.beijing.gov.cn/specials/ticketing/' }
  },
  {
    id: 'shanghai', name: 'Shanghai', zh: '上海', type: 'City life', region: 'East China', suggestedDays: 2,
    summary: 'A walkable mix of riverfront views, older streets, contemporary design, and easy onward rail connections.',
    highlights: ['The Bund and Huangpu riverfront', 'Neighborhood walks around the former French Concession', 'Art, food, and evening skyline views'],
    food: 'Look for xiaolongbao and scallion oil noodles.',
    practical: 'Group nearby stops into a single walk and keep a station name in Chinese for the return trip.',
    source: { label: 'Shanghai official visitor guide', url: 'https://english.shanghai.gov.cn/en-CityTour/20250527/0ed4212054564179be6a914ba23c32b1.html' }
  },
  {
    id: 'xian', name: 'Xi’an', zh: '西安', type: 'Heritage', region: 'Northwest China', suggestedDays: 2,
    summary: 'Ancient capitals, city walls, and the Terracotta Warriors make Xi’an a strong history-focused stop.',
    highlights: ['Terracotta Warriors museum', 'City wall and old-city lanes', 'Regional food around the historic center'],
    food: 'Try biangbiang noodles and roujiamo.',
    practical: 'Allow time for the museum transfer. Verify passport-based entry and reservation steps with its official channel.',
    source: { label: 'Terracotta Warriors visitor information', url: 'https://www.bmy.com.cn/' }
  },
  {
    id: 'chengdu', name: 'Chengdu', zh: '成都', type: 'City life', region: 'Southwest China', suggestedDays: 2,
    summary: 'A relaxed city for Sichuan food, teahouses, and an early-morning visit to the panda base.',
    highlights: ['Chengdu Research Base of Giant Panda Breeding', 'Teahouse culture in city parks', 'Sichuan food and neighborhood walks'],
    food: 'Try mapo tofu or a Sichuan hot pot; ask for less spice if needed.',
    practical: 'Panda-base tickets and entry windows can change. Check the official site before you travel.',
    source: { label: 'Panda base official visitor site', url: 'https://www.panda.org.cn/en/' }
  },
  {
    id: 'hangzhou', name: 'Hangzhou', zh: '杭州', type: 'Nature', region: 'East China', suggestedDays: 2,
    summary: 'Lake paths, gardens, and tea country offer a softer pace within reach of major eastern cities.',
    highlights: ['West Lake shoreline', 'Traditional gardens and causeways', 'Tea-growing landscape nearby'],
    food: 'Try local freshwater fish and Longjing tea.',
    practical: 'Choose one side of West Lake for a relaxed day; the full loop takes longer than it first appears.',
    source: { label: 'UNESCO West Lake overview', url: 'https://whc.unesco.org/en/list/1334' }
  },
  {
    id: 'guilin', name: 'Guilin', zh: '桂林', type: 'Nature', region: 'South China', suggestedDays: 2,
    summary: 'Karst peaks and river scenery reward an unhurried route through Guilin and Yangshuo.',
    highlights: ['Li River scenery', 'Yangshuo countryside', 'Riverside paths at a slower pace'],
    food: 'Try Guilin rice noodles.',
    practical: 'Boat services vary with season and conditions. Confirm the current route and boarding point with the operator.',
    source: { label: 'Li River official visitor information', url: 'https://en.liriver.com.cn/' }
  }
];

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
    id: 'attraction-booking', title: 'Plan attraction reservations', category: 'On the trip', duration: '4 min read',
    summary: 'Build each sightseeing day around confirmed entry slots and realistic travel time.',
    steps: [
      ['Identify the official channel', 'Start at the venue’s own site. Avoid assuming every attraction accepts walk-ins.'],
      ['Check identity details', 'Use the same name and travel document details you will show at entry.'],
      ['Leave room around the visit', 'Plan transfer, security checks, and a nearby alternative if tickets are unavailable.']
    ],
    source: { label: 'Palace Museum visit information', url: 'https://intl.dpm.org.cn/visit' }
  },
  {
    id: 'offline-ready', title: 'Make your phone offline-ready', category: 'Before departure', duration: '3 min read',
    summary: 'Prepare maps, key addresses, tickets, and a few phrases while you still have reliable internet.',
    steps: [
      ['Save locations', 'Download map areas and keep the Chinese names of your hotel and next station.'],
      ['Save bookings securely', 'Keep offline copies in a protected location and use the ChinaPASS phrase cards for routine requests.'],
      ['Do a short airplane-mode check', 'Open this app, your map, and essential tickets without a connection before departure.']
    ],
    source: { label: 'China Railway passenger FAQ', url: 'https://www.12306.cn/en/faq.html' }
  }
];
