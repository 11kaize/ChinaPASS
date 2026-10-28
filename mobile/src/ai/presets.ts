import type { Language } from "../content";

// Only these explicit examples can produce a local reply. Free text always
// requires a configured provider; failures never turn into a simulated answer.
export const presetKeys = ["promptPay", "promptTaxi", "promptTrain"] as const;
export type PresetKey = (typeof presetKeys)[number];
const replies: Record<PresetKey, Record<Language, string>> = {
  promptPay: {
    en: "Check the payment status before trying again. If the card was rejected, check verification and contact your card issuer. Ask the merchant about another supported card or RMB cash. Open the payment guide for troubleshooting.",
    zh: "重试前先确认交易状态。银行卡被拒时，检查身份验证并联系发卡行。询问商家能否使用另一张受支持的银行卡或人民币现金。可打开支付指南查看排查方法。",
    ja: "再試行の前に取引状況を確認してください。カードが拒否された場合は本人確認を確認し、カード発行会社に問い合わせます。別の対応カードか人民元の現金で払えるか店に尋ねてください。詳しくは支払いガイドを開いてください。",
    ko: "다시 시도하기 전에 거래 상태를 확인하세요. 카드가 거절되면 본인 인증을 확인하고 카드 발급사에 문의하세요. 다른 지원 카드나 위안화 현금을 사용할 수 있는지 상점에 물어보세요. 자세한 해결 방법은 결제 안내에서 확인하세요.",
  },
  promptTaxi: {
    en: "Confirm your hotel’s name and address, then use the signed official taxi rank or an authorized ride-hailing pickup area. Match the vehicle and driver to your booking, and keep the receipt. Open Transport to choose a method.",
    zh: "先确认酒店名称和地址，再前往有标识的正规出租车候车点或网约车指定上车区。核对车辆和司机信息，保留行程凭证。打开交通入口选择出行方式。",
    ja: "ホテル名と住所を確認し、案内表示のある正規タクシー乗り場か配車サービス指定の乗車場所へ進みます。車両と運転手を予約情報と照合し、領収書を保管してください。交通メニューで移動手段を選べます。",
    ko: "호텔 이름과 주소를 확인한 뒤 표지판이 있는 공식 택시 승강장이나 차량 호출 서비스의 지정 승차 구역으로 이동하세요. 예약 정보와 차량 및 기사를 대조하고 영수증을 보관하세요. 교통 메뉴에서 이동 수단을 선택할 수 있습니다.",
  },
  promptTrain: {
    en: "Use your valid passport to book through official China Railway 12306 or a staffed station counter. Match the passenger details to your passport and bring that same document. Check the exact station name; ask staff for the manual lane if a gate cannot read your passport.",
    zh: "使用有效护照，通过铁路官方购票平台或车站人工窗口购票。乘车人信息应与护照一致，并携带购票所用证件。核对具体车站名称；闸机无法识别护照时，请工作人员引导走人工通道。",
    ja: "有効なパスポートで中国鉄道の公式予約サービスまたは駅の有人窓口から購入できます。旅客情報をパスポートと一致させ、購入に使った同じ証明書を持参してください。駅名を確認し、改札で読み取れない場合は有人通路を係員に尋ねてください。",
    ko: "유효한 여권으로 중국철도 공식 예매 서비스나 역의 유인 창구에서 구매할 수 있습니다. 승객 정보를 여권과 일치시키고 구매에 사용한 동일한 신분증을 지참하세요. 정확한 역 이름을 확인하고 개찰구에서 여권을 읽지 못하면 직원에게 유인 통로를 문의하세요.",
  },
};
export function presetReply(key: PresetKey, language: Language) {
  return {
    text: replies[key][language],
    guideId:
      key === "promptPay" ? "pay" : key === "promptTaxi" ? "taxi" : "train",
  };
}
