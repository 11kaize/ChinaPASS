import type { Localized } from "./content";
const l = (en: string, zh: string, ja: string, ko: string): Localized => ({
  en,
  zh,
  ja,
  ko,
});
export const paymentHelpTitle = l(
  "Payment problems: check, fix, then fall back",
  "支付遇到问题：检查、解决与备用方式",
  "支払いの問題：確認・解決・代替手段",
  "결제 문제: 확인·해결·대안",
);
export const paymentHelp = [
  {
    title: l(
      "Card will not link or verification fails",
      "绑卡或身份验证失败",
      "カード登録・本人確認ができない",
      "카드 등록 또는 본인 인증 실패",
    ),
    body: l(
      "Check that you use your own supported card and that identity details match your passport and issuer records. Follow the app’s current verification prompts; contact the payment service or issuer if rejected. If unresolved, try another supported card or RMB cash.",
      "确认使用本人名下的受支持银行卡，身份信息与护照及发卡行记录一致。按应用当前提示完成验证；仍被拒时联系支付平台或发卡行。未解决前可换另一张受支持银行卡或使用人民币现金。",
      "本人名義の対応カードを使い、本人情報をパスポートと発行会社の記録に一致させます。現在の認証案内に従い、拒否される場合は決済会社か発行会社に問い合わせます。解決するまでは別の対応カードか人民元の現金を利用してください。",
      "본인 명의의 지원 카드를 사용하고 신원 정보를 여권 및 발급사 기록과 일치시키세요. 앱의 현재 인증 절차를 따르고 거절되면 결제 서비스나 발급사에 문의하세요. 해결 전에는 다른 지원 카드나 위안화 현금을 사용하세요.",
    ),
  },
  {
    title: l(
      "Payment declined or merchant not supported",
      "付款被拒或商户不支持",
      "支払い拒否・店舗が非対応",
      "결제 거절 또는 가맹점 미지원",
    ),
    body: l(
      "Read the exact error and check network, available funds, issuer restrictions and the payment app’s limits. Merchant payments and personal transfers are different; a foreign card may not support both. Confirm another accepted payment method with the cashier. Do not split payments to bypass controls.",
      "先读具体报错，检查网络、可用余额、发卡行限制和支付平台限额。商户付款与个人转账不同，境外卡可能不支持后者。请收银员确认其他可用方式，不要拆单规避风控。",
      "エラー内容を読み、接続、利用可能額、発行会社の制限、決済サービスの限度を確認します。店舗への支払いと個人送金は別で、海外カードは両方に対応するとは限りません。別の支払い方法を店員に確認し、制限回避の分割はしないでください。",
      "정확한 오류를 읽고 연결, 사용 가능 잔액, 발급사 제한과 앱 한도를 확인하세요. 가맹점 결제와 개인 송금은 다르며 해외 카드가 둘 다 지원하지 않을 수 있습니다. 계산원에게 다른 수단을 확인하고 제한을 피하려고 결제를 나누지 마세요.",
    ),
  },
  {
    title: l(
      "Unclear result or possible duplicate charge",
      "交易结果不明或疑似重复扣款",
      "結果不明・二重請求の疑い",
      "거래 결과 불명확 또는 중복 청구 의심",
    ),
    body: l(
      "Check the order and your card account before paying again. A pending authorization can differ from a settled charge. Keep the receipt, order number and time, ask the merchant to check, and contact the platform or issuer. Never share your full card number, password or verification code.",
      "再次付款前先看订单和银行卡账单，待处理预授权不一定是已入账扣款。保留收据、订单号和时间，请商户核查，并联系平台或发卡行。不要向他人提供完整卡号、密码或验证码。",
      "再度払う前に注文履歴とカード口座を確認します。保留中の与信と確定請求は異なります。領収書、注文番号、時刻を保存し、店舗へ確認して決済会社か発行会社へ連絡します。カード番号全体、暗証番号、認証コードを他人に渡さないでください。",
      "다시 결제하기 전에 주문과 카드 계좌를 확인하세요. 승인 보류는 확정 청구와 다를 수 있습니다. 영수증, 주문 번호와 시간을 보관하고 가맹점에 확인한 뒤 플랫폼이나 발급사에 문의하세요. 전체 카드 번호, 비밀번호나 인증 코드를 타인에게 주지 마세요.",
    ),
  },
  {
    title: l(
      "Refund has not arrived",
      "退款尚未到账",
      "返金が届かない",
      "환불 미도착",
    ),
    body: l(
      "Check the merchant’s refund status and original payment method. Keep the refund reference and ask the platform or issuer for the applicable processing time; it varies. If overdue, follow up with that reference. Do not send a separate transfer or pay a fee to an unknown person to unlock a refund.",
      "查看商户退款状态和原支付渠道。保留退款凭证，向平台或发卡行确认具体处理时间，不同渠道可能不同。超期后凭编号追查；不要为解冻退款向陌生人转账或付费。",
      "店舗の返金状況と元の支払い方法を確認します。返金番号を保管し、決済会社か発行会社へ処理期間を問い合わせてください。期間を過ぎたら番号を添えて照会します。返金解除を理由に知らない相手へ送金や手数料の支払いをしないでください。",
      "가맹점의 환불 상태와 원래 결제 수단을 확인하세요. 환불 번호를 보관하고 플랫폼이나 발급사에 처리 기간을 문의하세요. 기한이 지났으면 번호로 확인을 요청하세요. 환불 해제를 위해 낯선 사람에게 송금하거나 수수료를 내지 마세요.",
    ),
  },
];
