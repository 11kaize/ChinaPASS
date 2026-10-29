import type { Language } from "../content";

export type TravelText = Record<Language, string>;
const words = (en: string, zh: string, ja: string, ko: string): TravelText => ({
  en,
  zh,
  ja,
  ko,
});
// Illustrative conversion, not a live exchange-rate feed or supplier quote.
export const travelPricing = {
  cnyPerUSD: 7,
  feeCents: 500,
  checkedAt: "2026-10-29",
} as const;
export const travelTotalCents = (baseCNY: number) =>
  Math.round((baseCNY / travelPricing.cnyPerUSD) * 100) +
  travelPricing.feeCents;
export const travelUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export type TravelServiceId = "airport" | "sim" | "luggage" | "garden";
export type SupportTopic = "prepare" | "change" | "redeem";
export type TravelOrder = {
  id: string;
  checkoutId: string;
  serviceId: TravelServiceId;
  createdAt: string;
  baseCNY: number;
  cnyPerUSD: number;
  feeCents: number;
  totalCents: number;
  paidCents: 0;
  supportTopic?: SupportTopic;
  supportRequestedAt?: string;
};
export type TravelService = {
  id: TravelServiceId;
  icon: string;
  color: string;
  baseCNY: number;
  sourceURL: string;
  sourceName: TravelText;
  sourceDate: string;
  name: TravelText;
  scope: TravelText;
  description: TravelText;
  included: TravelText[];
  limits: TravelText;
  preparation: TravelText;
};
export const travelServices: TravelService[] = [
  {
    id: "airport",
    icon: "taxi",
    color: "#D69A20",
    baseCNY: 350,
    sourceURL: "https://jgj.sh.gov.cn/shhq/app/rent_car.html",
    sourceName: words(
      "Shanghai government rental guide",
      "上海市机关事务管理局用车指南",
      "上海市政府の車両利用案内",
      "상하이시 정부 차량 이용 안내",
    ),
    sourceDate: "—",
    name: words("Airport pickup", "机场接机", "空港お迎え", "공항 픽업"),
    scope: words(
      "Pudong · one private transfer",
      "浦东机场 · 一次单程用车",
      "浦東空港・片道1回",
      "푸둥공항 · 편도 1회",
    ),
    description: words(
      "Land with your next step arranged.",
      "落地后的第一程，有人帮你理顺。",
      "到着後の最初の移動を、もっと気軽に。",
      "도착 후 첫 이동을 더 편안하게.",
    ),
    included: [
      words(
        "One Passat-class transfer, using a ¥350 public benchmark",
        "一次帕萨特级用车，以公开价 ¥350 为参考",
        "パサート級の片道送迎1回。公開参考価格350元",
        "파사트급 차량 편도 1회, 공개 참고가 350위안",
      ),
      words(
        "Dedicated coordinator for meeting-point and driver communication",
        "专属客服协助确认集合点、对接司机",
        "専任担当が集合場所とドライバー連絡をサポート",
        "전담 상담원이 만남 장소와 기사 연락을 지원",
      ),
      words(
        "A bilingual arrival and pickup checklist",
        "一份中英双语接机准备清单",
        "中英2言語のお迎え準備リスト",
        "중영문 픽업 준비 목록",
      ),
    ],
    limits: words(
      "Reference only: service area and vehicle availability need confirmation. Published price excludes invoicing tax, tolls and parking. No extra charges are taken in this demo.",
      "仅参考：实际范围与车辆须另行确认。原报价不含开票税、过路费与停车费；本演示不会收取任何费用。",
      "参考価格です。対応地域と車両は要確認。原価格に請求書税・通行料・駐車料は含まれません。デモでは課金しません。",
      "참고 가격입니다. 운행 범위와 차량은 확인이 필요하며 세금·통행료·주차료는 별도입니다. 데모에서는 요금이 발생하지 않습니다.",
    ),
    preparation: words(
      "Before a real booking, confirm flight number, terminal, destination, passenger and bag counts. This demo collects none of those details.",
      "实际预约前需确认航班、航站楼、目的地、人数和行李数。本演示不收集这些信息。",
      "実予約前に便名・ターミナル・目的地・人数・荷物数を確認します。デモでは収集しません。",
      "실제 예약 전 항공편·터미널·목적지·인원·수하물을 확인합니다. 데모에서는 수집하지 않습니다.",
    ),
  },
  {
    id: "sim",
    icon: "sim",
    color: "#D86B82",
    baseCNY: 85,
    sourceURL:
      "https://en.shio.gov.cn/TrueCMS/shxwbgs/voices/content/20240314225802988.html",
    sourceName: words(
      "Shanghai Information Office · tourist SIM",
      "上海市政府新闻办 · 短期通信卡",
      "上海市政府新聞弁公室・短期SIM",
      "상하이시 정부 신문판공실 · 단기 SIM",
    ),
    sourceDate: "2024-03-14",
    name: words("Get connected", "通信卡办理", "通信の準備", "통신 준비"),
    scope: words(
      "One 7-day physical SIM package",
      "一张 7 天实体 SIM 套餐",
      "7日間の物理SIM 1枚",
      "7일 실물 SIM 패키지 1개",
    ),
    description: words(
      "A local number, with a little help getting started.",
      "本地号码，从选择到开通都更清楚。",
      "現地の電話番号を、分かりやすい手順で。",
      "현지 전화번호 준비부터 개통 안내까지.",
    ),
    included: [
      words(
        "7-day China Telecom benchmark: 20GB + 100 call minutes",
        "中国电信 7 天参考套餐：20GB + 100 分钟通话",
        "中国電信の7日参考プラン：20GB＋通話100分",
        "차이나텔레콤 7일 참고 요금제: 20GB + 통화 100분",
      ),
      words(
        "Dedicated coordinator for outlet and activation guidance",
        "专属客服协助网点选择与开通指引",
        "専任担当が窓口選びと開通手順をサポート",
        "전담 상담원의 매장 선택 및 개통 안내",
      ),
      words(
        "Device and eSIM suitability guidance",
        "手机兼容性与 eSIM 适用性说明",
        "端末の互換性・eSIM利用条件の案内",
        "기기 호환성 및 eSIM 이용 조건 안내",
      ),
    ],
    limits: words(
      "This priced example is a physical SIM, not an eSIM. The published 2024 plan is a benchmark, not a current stock promise. Carrier ID checks and device compatibility apply; no roaming or eSIM plan is included.",
      "此示例定价对应实体 SIM，不含 eSIM。2024 年公开套餐仅作参考，不保证当前库存。实际需运营商实名核验和手机兼容；不含漫游或 eSIM 套餐。",
      "料金例は物理SIMです。2024年公開プランを参考にしており、現在の在庫を保証しません。本人確認と端末互換性が必要で、ローミング・eSIMは含みません。",
      "실물 SIM 가격 예시이며 eSIM은 포함되지 않습니다. 2024년 공개 요금제를 참고하며 현재 재고를 보장하지 않습니다. 본인 확인과 기기 호환성이 필요하며 로밍은 별도입니다.",
    ),
    preparation: words(
      "For a real activation, bring your passport to the carrier and check whether your phone is unlocked. Never send passport images in this demo.",
      "实际开通需携护照到运营商办理，并确认手机已解锁；不要在演示中发送护照照片。",
      "実際の開通時は旅券を持参し、SIMロックを確認します。デモに旅券画像を送らないでください。",
      "실제 개통 시 여권을 지참하고 SIM 잠금을 확인하세요. 데모에 여권 사진을 보내지 마세요.",
    ),
  },
  {
    id: "luggage",
    icon: "prep",
    color: "#397FA9",
    baseCNY: 20,
    sourceURL:
      "https://english.shanghai.gov.cn/en-EditorsPick-ShopinShanghai/20240914/806dc988728140cc858914f38605b8ad.html",
    sourceName: words(
      "Shanghai government · Cunzhiji guide",
      "上海市政府 · 存知己寄存指南",
      "上海市政府・荷物預かり案内",
      "상하이시 정부 · 수하물 보관 안내",
    ),
    sourceDate: "2026-07-13",
    name: words(
      "Explore hands-free",
      "行李寄存",
      "身軽に街歩き",
      "가볍게 둘러보기",
    ),
    scope: words(
      "One large bag · one calendar day",
      "一件大件行李 · 一个自然日",
      "大型荷物1点・1暦日",
      "큰 짐 1개 · 당일 보관",
    ),
    description: words(
      "Put down your bag. Keep your day open.",
      "放下行李，把时间留给城市。",
      "荷物を預けて、街を楽しむ時間を。",
      "짐을 맡기고 도시를 즐기세요.",
    ),
    included: [
      words(
        "One large item at a ¥20/day public reference rate",
        "按公开参考价 ¥20/天，寄存一件大件行李",
        "公開参考価格20元/日で大型荷物1点",
        "공개 참고가 20위안/일, 큰 짐 1개",
      ),
      words(
        "Dedicated coordinator for location and pickup instructions",
        "专属客服协助选择寄存点、说明取件流程",
        "専任担当が預け先選びと受け取り手順をサポート",
        "전담 상담원의 보관 장소 선택 및 수령 안내",
      ),
      words(
        "Drop-off and collection checklist",
        "寄存、取件准备清单",
        "預け入れ・受け取り準備リスト",
        "보관 및 수령 준비 목록",
      ),
    ],
    limits: words(
      "Example: a 13–30 inch suitcase, longest side no more than 80cm. Charges vary by location; crossing midnight counts as another day. Transport, insurance and extra days are not included.",
      "示例为 13–30 英寸、最长边不超过 80cm 的行李箱。各点位价格不同，跨零点另计一天；不含行李运送、保险或额外天数。",
      "例：13〜30インチ、最長辺80cm以内のスーツケース。店舗で料金は異なり、日付をまたぐと追加1日分。配送・保険・延長分は含みません。",
      "13~30인치, 가장 긴 변이 80cm 이하인 가방 예시입니다. 지점별 요금이 다르며 자정을 넘기면 하루가 추가됩니다. 운송·보험·추가 일수는 제외됩니다.",
    ),
    preparation: words(
      "Confirm the storage location, opening hours and bag dimensions before a real visit. Keep valuables with you. No physical storage reservation is created here.",
      "实际使用前确认点位、营业时间和行李尺寸，贵重物品随身携带。这里不会生成真实寄存预约。",
      "実利用前に場所・営業時間・寸法を確認し、貴重品は携帯してください。実際の預かり予約は作成されません。",
      "실제 이용 전 장소·영업시간·짐 크기를 확인하고 귀중품은 소지하세요. 실제 보관 예약은 생성되지 않습니다.",
    ),
  },
  {
    id: "garden",
    icon: "star",
    color: "#598967",
    baseCNY: 40,
    sourceURL: "https://www.yugarden.com.cn/page/articleview/message.html",
    sourceName: words(
      "Yu Garden · official visitor information",
      "豫园官方 · 参观信息",
      "豫園公式・参観案内",
      "예원 공식 · 관람 안내",
    ),
    sourceDate: "—",
    name: words(
      "A little local culture",
      "本地文化体验",
      "現地の文化にふれる",
      "현지 문화 체험",
    ),
    scope: words(
      "Yu Garden · one adult peak-season entry",
      "豫园 · 一次成人旺季入园",
      "豫園・繁忙期の大人入園1回",
      "예원 · 성수기 성인 입장 1회",
    ),
    description: words(
      "A garden visit, with the details made clear.",
      "走进豫园，先把入园细节弄明白。",
      "入園の流れを確認して、豫園へ。",
      "입장 절차를 확인하고 예원으로.",
    ),
    included: [
      words(
        "One adult admission, based on the official ¥40 peak rate",
        "以官方旺季价 ¥40 为参考的一次成人入园",
        "公式繁忙期料金40元を参考にした大人入園1回",
        "공식 성수기 요금 40위안을 기준으로 한 성인 입장 1회",
      ),
      words(
        "Dedicated coordinator for ticketing and entry guidance",
        "专属客服协助购票流程、入园指引",
        "専任担当が購入手順・入園方法をサポート",
        "전담 상담원의 예매 절차 및 입장 안내",
      ),
      words(
        "A self-guided visit checklist",
        "一份自由参观准备清单",
        "自由見学の準備リスト",
        "자유 관람 준비 목록",
      ),
    ],
    limits: words(
      "Peak rate applies Apr–Jun and Sep–Nov; official off-peak admission is ¥30. This example has no live ticket inventory, guide, transport or night tour. Dates and opening days need confirmation.",
      "旺季为 4–6 月、9–11 月，官方淡季成人票 ¥30。示例不含实时票务、导游、交通或夜游；日期与开放日须另行确认。",
      "繁忙期は4〜6月・9〜11月、閑散期の公式大人料金は30元。リアルタイム在庫・ガイド・交通・夜間見学は含みません。日時と開園日は要確認。",
      "성수기는 4~6월·9~11월이며 비수기 공식 성인 요금은 30위안입니다. 실시간 재고·가이드·교통·야간 관람은 포함되지 않으며 날짜와 운영일은 확인이 필요합니다.",
    ),
    preparation: words(
      "For a real visit, check the date, concession eligibility and official opening notice. This is self-guided admission, not a guided tour or an issued ticket.",
      "实际参观前确认日期、优惠资格与官方开放公告。本项为自由参观入园示例，不是导览团或已出票凭证。",
      "実際の訪問前に日時・割引条件・公式開園情報を確認してください。自由見学の入園例であり、ガイドツアーや発券済みチケットではありません。",
      "실제 방문 전 날짜·할인 자격·공식 운영 공지를 확인하세요. 자유 관람 입장 예시이며 가이드 투어나 발권된 티켓이 아닙니다.",
    ),
  },
];
export const getTravelService = (id: unknown) =>
  travelServices.find((service) => service.id === id);

export const travelCopy = {
  storeTitle: words(
    "Membership & travel",
    "会员与旅行权益",
    "会員・旅行サービス",
    "멤버십 및 여행 서비스",
  ),
  membership: words("Membership", "会员续费", "会員プラン", "멤버십"),
  travel: words(
    "Travel services",
    "旅行买断权益",
    "旅行サービス",
    "여행 서비스",
  ),
  headline: words(
    "Less to arrange.\nMore to look forward to.",
    "少一点奔忙，\n多一点期待。",
    "準備はもっと気軽に。\n旅はもっと楽しみに。",
    "준비는 더 가볍게.\n기대는 더 크게.",
  ),
  intro: words(
    "Choose one service. Pay once. A dedicated coordinator helps with the details.",
    "按需选择，一次购买。专属客服帮你对接办理细节。",
    "必要なサービスを1回購入。専任担当が手続きをサポート。",
    "필요한 서비스만 한 번 구매. 전담 상담원이 세부 절차를 도와드립니다.",
  ),
  independent: words(
    "Open to Free, Plus and Pro · separate from membership",
    "Free、Plus、Pro 均可单独购买 · 不占会员权益",
    "Free・Plus・Pro共通。会員プランとは別購入",
    "Free·Plus·Pro 모두 별도 구매 가능",
  ),
  once: words(
    "One service, one purchase. No renewal.",
    "一次买断一项服务，不自动续费。",
    "1回の購入でサービス1回分。自動更新なし。",
    "한 번 구매로 서비스 1회. 자동 갱신 없음.",
  ),
  demoShort: words(
    "Demo · $0 charged. No real partner, booking or messages.",
    "演示实付 $0 · 无真实合作、预约或消息发送。",
    "デモ・請求$0。実際の提携・予約・送信なし。",
    "데모 · 결제 $0. 실제 제휴·예약·메시지 전송 없음.",
  ),
  demo: words(
    "Demo only · $0 charged. No real partner, payment, booking or customer-service message is involved.",
    "仅供演示 · 实付 $0。没有真实合作、支付、预约，也不会向客服发送消息。",
    "デモ専用・請求額$0。実際の提携・支払い・予約・担当者への送信はありません。",
    "데모 전용 · 실제 결제 $0. 실제 제휴·결제·예약·상담원 메시지 전송은 없습니다.",
  ),
  concierge: words(
    "Dedicated service coordinator",
    "专属客服对接",
    "専任担当のサポート",
    "전담 상담원 지원",
  ),
  advantages: words(
    "The value is in the details",
    "多一份对接，少一份不确定",
    "細かな準備まで、分かりやすく",
    "세부 준비까지 더 명확하게",
  ),
  advantageBody: words(
    "Bilingual preparation, a clear cost breakdown, and one contact for setup and questions. Buy what you need, without a subscription.",
    "中英双语准备、清晰的费用明细、统一的咨询和办理入口。只买需要的服务，不必订阅。",
    "中英の準備案内、明確な料金内訳、手続き・質問の窓口をひとつに。定期契約は不要です。",
    "중영문 준비 안내, 명확한 요금 내역, 상담과 진행을 한 곳에서. 구독 없이 필요한 서비스만 구매하세요.",
  ),
  view: words("View service", "查看服务", "詳細を見る", "서비스 보기"),
  fromLocal: words(
    "Domestic reference",
    "国内参考价",
    "現地参考価格",
    "현지 참고가",
  ),
  plusFee: words(
    "+ $5 coordination",
    "+ $5 对接服务费",
    "+ $5 手続きサポート",
    "+ $5 지원 수수료",
  ),
  pricing: words(
    "Transparent example pricing",
    "演示定价，明明白白",
    "分かりやすい料金例",
    "투명한 가격 예시",
  ),
  rateNote: words(
    "Fixed demo conversion. Public reference prices, not live supplier quotes.",
    "固定演示汇率。公开价格仅供参考，不是实时供应商报价。",
    "固定のデモ換算です。公開参考価格であり、実際の見積もりではありません。",
    "고정 데모 환율입니다. 공개 참고 가격이며 실시간 업체 견적이 아닙니다.",
  ),
  pricingNote: words(
    "Each example = published domestic price ÷ 7 + $5 coordination fee. Demo rate: US$1 = ¥7, not a live rate. Public prices are examples, not nationwide or real-time quotes.",
    "每项演示价 = 国内公开参考价 ÷ 7 + $5 对接服务费。演示汇率 US$1 = ¥7，非实时汇率；公开价格不是全国统一价或实时成交报价。",
    "料金例＝現地公開参考価格÷7＋$5のサポート料。デモ換算はUS$1＝7元で、実勢レートではありません。全国一律・リアルタイムの見積もりではありません。",
    "예시 가격 = 현지 공개 참고가 ÷ 7 + $5 지원 수수료. 데모 환율 US$1 = 7위안이며 실시간 환율이 아닙니다. 전국 공통 또는 실시간 견적이 아닙니다.",
  ),
  included: words(
    "What this one-time purchase includes",
    "这次买断包含什么",
    "1回の購入に含まれるもの",
    "1회 구매 포함 사항",
  ),
  limits: words(
    "Scope & things to confirm",
    "服务范围与确认事项",
    "範囲と確認事項",
    "범위 및 확인 사항",
  ),
  subtotal: words(
    "Reference service cost",
    "服务参考成本",
    "参考サービス原価",
    "서비스 참고 원가",
  ),
  fee: words(
    "ChinaBuddy coordination fee",
    "ChinaBuddy 对接服务费",
    "ChinaBuddy サポート料",
    "ChinaBuddy 지원 수수료",
  ),
  total: words(
    "One-time example price",
    "一次性演示标价",
    "1回購入の参考価格",
    "1회 구매 예시 가격",
  ),
  due: words(
    "Actually charged in this demo",
    "本演示实际支付",
    "デモでの実際の請求額",
    "데모 실제 결제액",
  ),
  source: words(
    "Read the public price source",
    "查看公开价格来源",
    "公開価格の出典を見る",
    "공개 가격 출처 보기",
  ),
  checked: words("Source checked", "来源核对日期", "出典確認日", "출처 확인일"),
  published: words(
    "Source publication / update",
    "来源发布／更新",
    "出典の公開・更新日",
    "출처 게시·갱신일",
  ),
  undated: words(
    "Not dated on source",
    "原页面未标日期",
    "元ページに日付表示なし",
    "원문 날짜 표시 없음",
  ),
  activate: words(
    "Activate demo · $0",
    "模拟买断 · 实付 $0",
    "デモで購入・$0",
    "데모 구매 · $0",
  ),
  loginDemo: words(
    "Use demo account & activate · $0",
    "一键 Demo 帐号并模拟买断 · $0",
    "デモアカウントで購入・$0",
    "데모 계정으로 구매 · $0",
  ),
  agree: words(
    "I understand this creates a local demo entitlement only, with no real booking or payment.",
    "我知道此操作只生成本机演示权益，不会真实预约或扣款。",
    "本機のデモ利用権のみ作成され、実予約・課金はないことを理解しました。",
    "기기에 데모 이용권만 생성되며 실제 예약이나 결제가 없음을 이해합니다.",
  ),
  activated: words(
    "Your demo entitlement is ready",
    "演示买断权益已就绪",
    "デモ利用権を作成しました",
    "데모 이용권 준비 완료",
  ),
  recordNote: words(
    "Saved on this device. This record is not a voucher, ticket or confirmed reservation. Your VIP plan is unchanged.",
    "记录保存在本机，不是兑换券、门票或已确认预约。你的 VIP 套餐不会因买断而变化。",
    "本機に保存しました。引換券・入場券・予約確認ではありません。購入による会員プランの変更はありません。",
    "이 기기에 저장됩니다. 바우처·티켓·예약 확인서가 아니며 구매로 VIP 플랜이 변경되지 않습니다.",
  ),
  contact: words(
    "Try the dedicated support demo",
    "体验专属客服对接",
    "専任サポートを体験",
    "전담 상담 데모 체험",
  ),
  supportIntro: words(
    "Mia · demo service coordinator. Choose a topic to preview a handoff. No message leaves this device.",
    "Mia · 演示专属客服。选择问题查看对接过程，消息不会离开本机。",
    "Mia・デモ専任担当。項目を選んで引き継ぎを体験できます。メッセージは本機から送信されません。",
    "Mia · 데모 전담 상담원. 주제를 골라 상담 흐름을 확인하세요. 메시지는 기기 밖으로 전송되지 않습니다.",
  ),
  supportSent: words(
    "Demo handoff recorded · no real agent contacted",
    "演示对接已记录 · 未联系真实客服",
    "デモの引き継ぎを記録・実際の担当者への連絡なし",
    "데모 상담 기록 완료 · 실제 상담원 연결 없음",
  ),
  prepare: words(
    "What should I prepare?",
    "需要准备什么？",
    "何を準備すればいい？",
    "무엇을 준비하나요?",
  ),
  change: words(
    "Can I change the date?",
    "可以改时间吗？",
    "日程を変更できますか？",
    "날짜를 바꿀 수 있나요?",
  ),
  redeem: words(
    "How do I use this service?",
    "如何使用这项服务？",
    "どう利用しますか？",
    "어떻게 이용하나요?",
  ),
  changeReply: words(
    "In a real service, your coordinator would check the provider's availability and change rules before confirming. This demo changes no dates and promises no refund or availability.",
    "实际服务中，专属客服会先确认服务商的余量和改期规则，再告知能否变更。演示不会修改日期，也不承诺退款或可用名额。",
    "実サービスでは担当者が空きと変更規定を確認します。デモでは日程変更・返金・空きの保証は行いません。",
    "실제 서비스에서는 상담원이 제공 업체의 재고와 변경 규정을 먼저 확인합니다. 데모는 일정을 변경하거나 환불·예약 가능 여부를 보장하지 않습니다.",
  ),
  redeemReply: words(
    "The real flow would be: confirm requirements with your coordinator, receive provider confirmation, then follow the meeting or collection instructions. This local record cannot be redeemed.",
    "实际流程为：与专属客服确认需求 → 获得服务商确认 → 按集合或领取指引使用。本机演示记录不能真实核销。",
    "実際は、担当者と要件確認→提供元の確認→集合・受け取り案内に従って利用します。本機のデモ記録は引き換えできません。",
    "실제 절차: 상담원과 요구 사항 확인 → 업체 확정 → 만남 또는 수령 안내에 따라 이용. 기기의 데모 기록은 실제 사용이 불가합니다.",
  ),
  history: words(
    "Travel entitlements",
    "旅行买断记录",
    "旅行サービス購入記録",
    "여행 이용권 기록",
  ),
  allHistory: words(
    "Membership & service history",
    "会员与服务记录",
    "会員・サービス履歴",
    "멤버십 및 서비스 기록",
  ),
  empty: words(
    "No travel entitlements yet. Choose a one-time service to try the full demo.",
    "还没有旅行买断记录，选择一项服务即可体验完整演示。",
    "旅行サービスの購入記録はありません。サービスを選んでデモを体験できます。",
    "아직 여행 이용권이 없습니다. 서비스를 선택해 전체 데모를 체험하세요.",
  ),
  noOrder: words(
    "This demo record is not available for the current account.",
    "当前帐号没有这条演示记录。",
    "現在のアカウントにこのデモ記録はありません。",
    "현재 계정에서 이 데모 기록을 찾을 수 없습니다.",
  ),
  missing: words(
    "This service is unavailable. Return to travel services to choose another.",
    "这项服务不可用，请返回旅行权益选择其他项目。",
    "このサービスは利用できません。旅行サービスに戻って選択してください。",
    "이 서비스를 이용할 수 없습니다. 여행 서비스에서 다른 항목을 선택하세요.",
  ),
  error: words(
    "Could not save the entitlement. Try again after your local data finishes loading.",
    "权益保存失败，请等待本机数据加载后重试。",
    "利用権を保存できませんでした。本機データの読み込み後に再試行してください。",
    "이용권을 저장하지 못했습니다. 기기 데이터 로딩 후 다시 시도하세요.",
  ),
  owned: words(
    "Demo purchase saved",
    "已保存演示买断记录",
    "デモ購入を保存済み",
    "데모 구매 저장됨",
  ),
  browse: words(
    "Browse travel services",
    "浏览旅行权益",
    "旅行サービスを見る",
    "여행 서비스 둘러보기",
  ),
  viewRecord: words(
    "View entitlement & support",
    "查看权益与专属客服",
    "利用権・サポートを見る",
    "이용권 및 상담 보기",
  ),
  totalHistory: words(
    "Your plans and one-time services, saved on this device.",
    "会员与一次性服务，记录都保存在本机。",
    "会員プランと1回購入サービスの履歴を本機に保存。",
    "멤버십 및 1회 구매 서비스 기록을 기기에 저장합니다.",
  ),
};
export const travelText = (language: Language, key: keyof typeof travelCopy) =>
  travelCopy[key][language];
