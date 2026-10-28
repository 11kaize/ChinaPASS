import type { Localized } from "./content";
const l = (en: string, zh: string, ja: string, ko: string): Localized => ({
  en,
  zh,
  ja,
  ko,
});
export const arrivalGuideTitle = l(
  "Your first 24 hours",
  "落地后的前 24 小时",
  "到着後の24時間",
  "도착 후 첫 24시간",
);
export const arrivalGuideBody = l(
  "From border checks to your first night: follow the stages that apply to your journey.",
  "从入境检查到第一晚入住，按顺序完成适用于你的事项。",
  "入国審査から最初の宿泊まで、旅程に合う手順を順番に確認しましょう。",
  "입국 심사부터 첫날 숙박까지 본인 여정에 해당하는 단계를 차례로 확인하세요.",
);
export const arrivalSources = [
  {
    label: l(
      "NIA: arrival card",
      "国家移民管理局：入境卡",
      "国家移民管理局：入国カード",
      "국가이민관리국: 입국 카드",
    ),
    url: "https://www.nia.gov.cn/n741440/n741577/c1755806/content.html",
  },
  {
    label: l(
      "China Customs: baggage procedures",
      "中国海关：行李物品通关",
      "中国税関：手荷物の通関",
      "중국 해관: 휴대품 통관",
    ),
    url: "https://online.customs.gov.cn/static/pages/guides/000629014002/000629014002.html",
  },
  {
    label: l(
      "NIA: accommodation registration",
      "国家移民管理局：住宿登记",
      "国家移民管理局：宿泊登録",
      "국가이민관리국: 숙박 등록",
    ),
    url: "https://en.nia.gov.cn/n147418/n147468/c237295/content.html",
  },
  {
    label: l(
      "Official guide to daily services",
      "官方在华生活服务指南",
      "中国生活サービスの公式案内",
      "공식 중국 생활 서비스 안내",
    ),
    url: "https://english.www.gov.cn/2025special/bizexpatsinchina2025",
  },
  {
    label: l(
      "Airport international arrival procedure",
      "机场国际到达流程",
      "空港の国際線到着手順",
      "공항 국제선 도착 절차",
    ),
    url: "https://www.hzairport.com/en/ride/arrive.html",
  },
];
export type ArrivalStage = {
  id: string;
  title: Localized;
  body: Localized;
  airOnly?: boolean;
  guide?: string;
  url?: string;
  tool?: "/address" | "/transport" | "/emergency";
};
export const arrivalStages: ArrivalStage[] = [
  {
    id: "documents",
    title: l(
      "Before border control: documents",
      "入境检查前：备好证件",
      "入国審査前：書類の準備",
      "입국 심사 전: 서류 준비",
    ),
    body: l(
      "Keep your passport, applicable visa or permission, first accommodation address and onward travel details accessible. Check eligibility with your airline and NIA before departure. This checklist does not determine visa-free eligibility or permitted stay.",
      "随身备好护照、适用的签证或许可、首晚住宿地址及后续行程信息。出发前向航空公司和移民管理部门核实入境资格。此清单不能判断免签资格或允许停留期限。",
      "パスポート、該当する査証や許可、最初の宿泊先住所、以後の旅程を用意します。出発前に航空会社と入管当局へ入国資格を確認してください。この一覧で査証免除や滞在期限は判断できません。",
      "여권, 해당 비자나 허가, 첫 숙소 주소와 이후 여행 정보를 준비하세요. 출발 전에 항공사와 이민 당국에 입국 자격을 확인하세요. 이 목록은 무비자 자격이나 체류 기간을 판단하지 않습니다.",
    ),
    guide: "entry-check",
  },
  {
    id: "arrival-card",
    title: l(
      "Complete the official arrival card",
      "填写官方入境卡",
      "公式の入国カードを記入",
      "공식 입국 카드 작성",
    ),
    body: l(
      "When required, use NIA’s free official arrival-card service. If online submission is unavailable, ask about on-site terminals or a paper card. Keep the result available. This is separate from a visa and customs declaration. Avoid unofficial paid websites.",
      "需要填报时，使用移民管理局免费官方入境卡服务。无法在线填写，可询问现场设备或纸质卡片，并保留结果。入境卡不等于签证，也不等于海关申报。不要向非官方网站付费。",
      "必要な場合は入管当局の無料公式サービスを利用します。オンラインで提出できなければ現場の端末や紙のカードについて尋ね、結果を保管してください。査証や税関申告とは別です。非公式の有料サイトは避けてください。",
      "필요한 경우 이민 당국의 무료 공식 입국 카드 서비스를 이용하세요. 온라인 제출이 안 되면 현장 단말기나 종이 카드에 대해 문의하고 결과를 보관하세요. 비자 및 세관 신고와 별개이며 비공식 유료 사이트는 피하세요.",
    ),
    url: "https://s.nia.gov.cn/ArrivalCardFillingPhone/arrival",
  },
  {
    id: "immigration",
    title: l(
      "Follow immigration inspection signs",
      "按指引接受边防检查",
      "案内に従って入国審査へ",
      "표지판에 따라 입국 심사",
    ),
    body: l(
      "Use the lane for your travel document, present the requested papers and answer accurately. Follow staff directions for biometric checks. Check your entry record and ask about an unclear stay deadline before leaving. Entry and stay enquiries: NIA 12367.",
      "按证件类型选择通道，出示材料并如实回答。生物信息采集遵循工作人员指引。离开前核对入境记录，停留期限不清楚时当场询问。出入境咨询：移民管理局 12367。",
      "渡航書類に合う通路で必要書類を提示し、正確に回答します。生体情報の確認は係員の指示に従ってください。入国記録と滞在期限を確認し、不明点はその場で質問します。入国・滞在の相談は12367です。",
      "여행 서류에 맞는 통로에서 요청받은 서류를 제시하고 사실대로 답하세요. 생체정보 확인은 직원 지시에 따르세요. 입국 기록과 체류 기한을 확인하고 불분명하면 현장에서 질문하세요. 출입국 상담은 12367입니다.",
    ),
    guide: "customs",
  },
  {
    id: "baggage",
    airOnly: true,
    title: l(
      "Collect and check your baggage",
      "领取并检查托运行李",
      "預け荷物を受け取り確認",
      "위탁 수하물 수취 및 확인",
    ),
    body: l(
      "Find the belt using your flight number and keep the baggage tag. Report missing or damaged bags to the airline desk before leaving reclaim; obtain a report and contact details. Connecting passengers should confirm whether reclaim and recheck are required.",
      "按航班号找行李转盘并保留行李牌。行李未到或损坏时，在离开提取区前到航空公司柜台登记，取得报告和联系方式。中转旅客须确认是否需要提取并重新托运。",
      "便名でターンテーブルを確認し、手荷物タグを保管します。未着や破損は受取エリアを出る前に航空会社へ申し出て、報告書と連絡先を受け取ってください。乗り継ぎでは受取と再預けが必要か確認します。",
      "항공편 번호로 수하물 벨트를 확인하고 수하물표를 보관하세요. 미도착이나 파손은 수취 구역을 나가기 전에 항공사에 신고하고 확인서와 연락처를 받으세요. 환승 시 수취 및 재위탁 여부를 확인하세요.",
    ),
  },
  {
    id: "customs",
    title: l(
      "Choose the correct customs channel",
      "选择正确的海关通道",
      "適切な税関通路を選ぶ",
      "올바른 세관 통로 선택",
    ),
    body: l(
      "Use red for declarable items or if unsure; use green only when nothing needs declaration. Medicines, food, animal or plant products, cash and goods left in China can have special rules. Check current allowances with customs on 12360.",
      "携带须申报物品或不确定时走红色通道；符合无申报条件才走绿色通道。药品、食品、动植物制品、现金及拟留在境内的物品可能有专门规定。具体限额向海关 12360 核实。",
      "申告対象の物品がある場合や判断できない場合は赤い通路へ、申告するものがない場合のみ緑へ進みます。医薬品、食品、動植物製品、現金、中国に残す品には個別規則があります。最新の制限は税関12360へ確認してください。",
      "신고 대상 물품이 있거나 판단이 어려우면 빨간 통로를, 신고할 것이 없을 때만 초록 통로를 이용하세요. 의약품, 식품, 동식물 제품, 현금 및 중국에 남길 물품에는 별도 규정이 있을 수 있습니다. 세관 12360에 현행 한도를 확인하세요.",
    ),
    url: arrivalSources[1].url,
  },
  {
    id: "connection",
    title: l(
      "Get a working connection",
      "先获得可用网络",
      "通信手段を確保する",
      "사용 가능한 통신망 확보",
    ),
    body: l(
      "Test existing roaming first. For a local SIM, bring your passport to an official telecom counter and confirm data, calls, price and validity before purchase. Airport Wi-Fi may require identity or SMS verification. Save the hotel address locally before leaving.",
      "先测试原有漫游套餐。需本地电话卡时携护照到运营商正规柜台，购买前确认流量、通话、价格和有效期。机场无线网络可能需身份或短信验证。离开前把酒店地址保存在本机。",
      "まず契約中のローミングを試します。現地の通信契約はパスポートを持って正規窓口へ行き、通信量、通話、料金、有効期間を確認してから購入します。空港の無線接続には本人確認やショートメッセージ認証が必要な場合があります。住所を端末に保存してから出発します。",
      "먼저 기존 로밍을 확인하세요. 현지 유심은 여권을 지참해 통신사 공식 창구에서 데이터, 통화, 가격과 유효기간을 확인한 후 구매하세요. 공항 무선망에 신원 확인이나 문자 인증이 필요할 수 있습니다. 떠나기 전에 숙소 주소를 저장하세요.",
    ),
    guide: "sim",
  },
  {
    id: "payment",
    title: l(
      "Check payment and a backup",
      "确认支付方式和备用方案",
      "支払い方法と予備を確認",
      "결제 수단과 대안 확인",
    ),
    body: l(
      "Check app setup or card acceptance before buying a transfer; keep RMB cash as a backup. Exchange money at a bank or authorized counter. At ATMs, check your card network’s logo and fees. Linking a foreign card does not enable every transaction type.",
      "购买接驳交通前确认支付应用已设置或银行卡可用，并备好人民币现金。换汇选银行或授权网点，取现核对卡组织标识和手续费。绑定境外卡不代表支持所有交易类型。",
      "移動の購入前に決済設定やカード対応を確認し、人民元の現金を予備に用意します。両替は銀行か正規窓口で、引出機はカード会社のマークと手数料を確認します。海外カードを登録しても全種類の取引が可能になるわけではありません。",
      "이동 수단 구매 전에 앱 설정이나 카드 지원 여부를 확인하고 위안화 현금을 준비하세요. 은행이나 공인 창구에서 환전하고 인출기는 카드사 표시와 수수료를 확인하세요. 해외 카드 등록이 모든 거래 지원을 의미하지는 않습니다.",
    ),
    guide: "pay",
  },
  {
    id: "transfer",
    title: l(
      "Use the signed transport area",
      "从正规交通区域前往住处",
      "案内された乗り場から宿へ",
      "안내된 승차장에서 숙소로",
    ),
    body: l(
      "Confirm your arrival terminal or station and exact destination. Follow signs for metro, bus, official taxis or the designated ride-hailing pickup area. Check last departures if late. Match the pickup point and vehicle to your booking, avoid unsolicited drivers and keep the receipt.",
      "核对入境站点和完整目的地，按标识找地铁、巴士、正规出租车或网约车指定上车区。晚到先确认末班时间。核对订单上车点和车辆，避免陌生人揽客，保留行程凭证。",
      "到着ターミナルや駅と正確な目的地を確認し、地下鉄、バス、正規タクシーか配車指定場所の案内に従います。夜間は最終便を確認してください。乗車場所と車両を予約と照合し、客引きを避けて利用記録を保管します。",
      "도착 터미널이나 역과 정확한 목적지를 확인하고 지하철, 버스, 공식 택시나 지정 차량 호출 승차장 표지를 따르세요. 늦으면 막차를 확인하세요. 예약과 승차 장소 및 차량을 대조하고 호객을 피하며 영수증을 보관하세요.",
    ),
    tool: "/transport",
  },
  {
    id: "registration",
    title: l(
      "Check in and register your accommodation",
      "入住并办理住宿登记",
      "チェックインと宿泊登録",
      "체크인 및 숙박 등록",
    ),
    body: l(
      "At a hotel, present your passport and confirm reception handles registration. At a private home, you or your host must register within 24 hours of moving in. Since 21 September 2026, online registration is available nationwide through NIA’s official platform or its 12367 app and mini programs. Keep the registration record. If online filing fails, contact local police or 12367; the in-person channel remains available.",
      "住酒店时出示护照，确认前台办理住宿登记。住私人住所时，由本人或留宿人在入住后 24 小时内登记。自 2026 年 9 月 21 日起，可在全国通过移民管理局官方平台、12367 应用或小程序网上办理。保留登记记录；网上办理失败时，联系当地公安机关或 12367，线下渠道仍保留。",
      "ホテルではパスポートを提示し、フロントの宿泊登録を確認します。個人宅では入居後24時間以内に本人か宿泊させる人が登録します。2026年9月21日から全国で入管当局の公式サイトや12367のアプリ・ミニプログラムによる登録が利用できます。記録を保存し、利用できなければ地元警察か12367へ相談してください。対面窓口も残っています。",
      "호텔에서는 여권을 제시하고 프런트의 숙박 등록을 확인하세요. 개인 주택에서는 입주 후 24시간 이내에 본인이나 숙박 제공자가 등록해야 합니다. 2026년 9월 21일부터 전국에서 이민 당국 공식 플랫폼, 12367 앱 및 미니프로그램으로 온라인 등록할 수 있습니다. 기록을 보관하고 온라인 등록에 실패하면 관할 경찰이나 12367에 문의하세요. 방문 등록도 유지됩니다.",
    ),
    url: arrivalSources[2].url,
  },
  {
    id: "first-night",
    title: l(
      "Before your first night",
      "第一晚休息前",
      "最初の夜の確認",
      "첫날 밤 확인 사항",
    ),
    body: l(
      "Save your accommodation’s Chinese address and reception number. Charge your phone, secure your passport and check tomorrow’s station or terminal. Urgent help: police 110, ambulance 120, fire 119. ChinaBuddy records this checklist locally; it does not submit arrival cards, registrations or bookings.",
      "保存住处中文地址和前台电话，给手机充电、保管好护照，核对次日车站或航站楼。紧急求助：报警 110、急救 120、火警 119。ChinaBuddy 仅在本机记录清单进度，不会代交入境卡、登记或预订。",
      "宿泊先の中国語住所とフロント番号を保存し、充電してパスポートを安全に保管します。翌日の駅やターミナルも確認してください。緊急時は警察110、救急120、消防119です。ChinaBuddyは端末に進捗を保存するだけで、入国カード、登録、予約を代行しません。",
      "숙소의 중국어 주소와 프런트 번호를 저장하고 휴대전화를 충전하며 여권을 보관하세요. 다음 날 역이나 터미널도 확인하세요. 긴급 시 경찰 110, 구급 120, 소방 119입니다. ChinaBuddy는 진행 상황을 기기에 저장할 뿐 입국 카드, 등록이나 예약을 대신 제출하지 않습니다.",
    ),
    tool: "/address",
  },
];
