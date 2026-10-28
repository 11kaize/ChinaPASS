// Reviewed content shared by every built-in search and AI reference export.
const l = (en, zh, ja, ko) => ({ en, zh, ja, ko });
const nia = "https://www.nia.gov.cn/n741440/n741577/c1755806/content.html";
const payment = "https://english.www.gov.cn/2025special/bizexpatsinchina2025";
export const guideRevisions = {
  customs: {
    tip: undefined,
    disclaimer: undefined,
    showCard: {
      title: l(
        "Please help with these documents",
        "请协助核对材料",
        "書類の確認をお願いします",
        "서류 확인을 부탁드립니다",
      ),
      lines: [
        "你好，我不太会说中文。",
        "可以说慢一点吗？",
        "我需要出示哪些材料？",
        "谢谢！",
      ],
    },
    title: l(
      "Border checks & documents",
      "边检与入境材料",
      "入国審査と書類",
      "입국 심사 및 서류",
    ),
    subtitle: l(
      "Prepare papers, answer questions and check your entry record",
      "备齐材料、回答问题、核对入境记录",
      "書類を用意し、質問に答えて入国記録を確認",
      "서류 준비, 질문 답변 및 입국 기록 확인",
    ),
    task: l(
      "Use this guide for border-inspection paperwork. For the full route from arrival to accommodation, open Your first 24 hours. Entry permission depends on your nationality, document and travel purpose; this app cannot decide eligibility.",
      "此指南专门处理边检材料。完整的落地至入住流程请打开落地后的前 24 小时。入境资格取决于国籍、证件和出行目的，本应用不能替你判断。",
      "入国審査の書類を確認するためのガイドです。到着から宿泊までの流れは到着後の24時間を開いてください。入国資格は国籍・書類・渡航目的により、このアプリでは判断できません。",
      "입국 심사 서류 안내입니다. 도착부터 숙박까지의 전체 절차는 도착 후 첫 24시간을 확인하세요. 입국 자격은 국적, 서류와 방문 목적에 따라 다르며 앱에서 판단할 수 없습니다.",
    ),
    before: [
      l(
        "Your travel document and applicable visa or permission",
        "旅行证件及适用的签证或许可",
        "渡航書類と該当する査証・許可",
        "여행 서류 및 해당 비자·허가",
      ),
      l(
        "Accommodation and onward travel details you can show without internet",
        "无需联网也能出示的住宿与后续行程信息",
        "通信なしで提示できる宿泊先と以後の旅程",
        "인터넷 없이 제시할 숙소 및 이후 여행 정보",
      ),
    ],
    steps: [
      {
        t: l(
          "Check whether an arrival card is needed",
          "核实是否需要入境卡",
          "入国カードの要否を確認",
          "입국 카드 필요 여부 확인",
        ),
        d: l(
          "Use the free official NIA page when required. If you cannot submit online, ask for the on-site terminal or paper procedure. Keep the result available; the card does not replace a visa or grant entry.",
          "需要时使用移民管理局免费官方页面。无法在线填报时，询问现场设备或纸质办理方式，并保留结果；入境卡不能代替签证，也不代表已获准入境。",
          "必要なら入管当局の無料公式ページを利用します。提出できなければ現場の端末か紙の手続きを尋ねてください。カードは査証の代わりや入国許可にはなりません。",
          "필요하면 이민 당국의 무료 공식 페이지를 이용하세요. 온라인 제출이 안 되면 현장 단말기나 종이 절차를 문의하세요. 입국 카드는 비자나 입국 허가를 대신하지 않습니다.",
        ),
      },
      {
        t: l(
          "Use the appropriate inspection lane",
          "选择适用的边检通道",
          "適切な審査通路を利用",
          "해당 입국 심사 통로 이용",
        ),
        d: l(
          "Follow the signs for your document and staff directions, including any biometric checks. Explain your purpose, planned stay and accommodation accurately. If you do not understand, ask staff to repeat or provide language assistance; use a device only when permitted.",
          "按证件类型和现场指示排队，生物信息核验遵循工作人员要求。如实说明目的、停留计划和住宿。不明白时请工作人员重复或协助语言沟通；仅在允许时使用设备。",
          "書類に合う案内と係員の指示に従い、生体情報の確認にも対応します。目的・滞在予定・宿泊先を正確に説明し、不明なら繰り返しや言語支援を頼みます。端末は許可された場合のみ使ってください。",
          "서류에 맞는 표지판과 직원 지시를 따르고 생체정보 확인에 응하세요. 목적, 체류 계획과 숙소를 사실대로 설명하고 이해가 안 되면 반복이나 언어 지원을 요청하세요. 기기는 허용된 경우에만 사용하세요.",
        ),
      },
      {
        t: l(
          "Check the entry record and stay conditions",
          "核对入境记录和停留条件",
          "入国記録と滞在条件を確認",
          "입국 기록 및 체류 조건 확인",
        ),
        d: l(
          "Before leaving, check the record and any document returned to you. Ask the officer if a date or condition is unclear. Keep records with your passport. For later entry or stay questions, contact NIA 12367; do not calculate a deadline from an unverified social-media post.",
          "离开前核对记录和退回的文件，日期或条件不明时当场询问，材料随护照妥善保管。之后的出入境、停留咨询可联系移民管理局 12367，不要依靠未经核实的社交帖子计算期限。",
          "退出前に記録と返却された書類を確認し、日付や条件が不明なら係員に尋ねます。パスポートと保管してください。後日の相談は12367へ。未確認の投稿で期限を計算しないでください。",
          "나가기 전에 기록과 돌려받은 서류를 확인하고 날짜나 조건이 불명확하면 직원에게 질문하세요. 여권과 함께 보관하세요. 이후 상담은 12367을 이용하며 확인되지 않은 게시물로 기한을 계산하지 마세요.",
        ),
      },
    ],
    planB: [
      l(
        "If a document or permission is unclear, ask the inspection officer or NIA 12367 before proceeding. The airline or visa authority should clarify eligibility before travel.",
        "材料或许可不清楚时，先问边检工作人员或 12367。出发前的入境资格应向航空公司或签证主管机构核实。",
        "書類や許可が不明なら先に審査官か12367へ確認します。渡航前の資格は航空会社や査証当局に確認してください。",
        "서류나 허가가 불분명하면 먼저 심사 직원이나 12367에 문의하세요. 출발 전 입국 자격은 항공사나 비자 당국에 확인하세요.",
      ),
    ],
    trouble: [
      {
        p: l(
          "Online arrival card unavailable",
          "入境卡无法在线填写",
          "入国カードをオンライン提出できない",
          "입국 카드 온라인 제출 불가",
        ),
        a: l(
          "Ask port staff about terminals or paper cards. Avoid unofficial sites charging to submit the form.",
          "向口岸工作人员询问设备或纸质卡片，不要使用收取填报费用的非官方网站。",
          "現場の端末か紙のカードを尋ね、有料の非公式サイトは避けてください。",
          "직원에게 현장 단말기나 종이 카드를 문의하고 유료 비공식 사이트는 피하세요.",
        ),
      },
    ],
    mistakes: [],
    lastUpdated: "2026-10-28",
    sources: [
      {
        label: l(
          "NIA arrival-card guidance",
          "移民管理局入境卡说明",
          "入管当局の入国カード案内",
          "이민 당국 입국 카드 안내",
        ),
        url: nia,
      },
    ],
    actions: [
      {
        kind: "official",
        url: "https://s.nia.gov.cn/ArrivalCardFillingPhone/arrival",
        label: l(
          "Official arrival card",
          "官方入境卡",
          "公式の入国カード",
          "공식 입국 카드",
        ),
        note: l(
          "Free official service; follow eligibility instructions",
          "免费官方服务，请遵循适用要求",
          "無料公式サービス・対象要件を確認",
          "무료 공식 서비스·대상 요건 확인",
        ),
      },
    ],
  },
  pay: {
    tip: undefined,
    showCard: {
      title: l(
        "Show this to the cashier",
        "向收银员展示",
        "レジで見せる",
        "계산원에게 보여 주세요",
      ),
      lines: [
        "你好，我想用支付宝付款。",
        "请扫这个付款码。",
        "如果不行，我可以付现金。",
        "谢谢！",
      ],
    },
    task: l(
      "Set up a supported payment app, check a real merchant payment and keep a backup. A foreign bank card can support purchases without enabling every transfer or wallet feature.",
      "设置受支持的支付应用，核对商户交易，并保留备用方式。境外卡可用于购物，并不代表支持全部转账或钱包功能。",
      "対応する決済アプリを設定し、店舗への支払いを確認して予備の手段を用意します。海外カードで購入できても、すべての送金や財布機能が使えるとは限りません。",
      "지원 결제 앱을 설정하고 가맹점 결제를 확인하며 대안을 준비하세요. 해외 카드로 구매할 수 있어도 모든 송금이나 지갑 기능을 지원하는 것은 아닙니다.",
    ),
    before: [
      l(
        "An internet connection and a number that can receive verification messages",
        "可用网络和能接收验证短信的号码",
        "通信接続と認証メッセージを受け取れる番号",
        "인터넷 연결 및 인증 문자를 받을 번호",
      ),
      l(
        "Your own supported card and identity document if requested",
        "本人名下受支持银行卡，以及验证时要求的身份证件",
        "本人名義の対応カードと、求められた場合の身分証",
        "본인 명의의 지원 카드 및 요청 시 신분증",
      ),
    ],
    steps: [
      {
        t: l(
          "Install and register through the official app",
          "通过官方应用安装并注册",
          "公式アプリを導入して登録",
          "공식 앱 설치 및 가입",
        ),
        d: l(
          "Download Alipay or WeChat from the official store. Register using your own phone number, including a supported overseas number, and keep it available for future verification. Choose a language you understand.",
          "从官方商店下载支付宝或微信。使用本人的号码注册，包括受支持的境外号码，并保留该号码用于后续验证。选择自己能理解的界面语言。",
          "公式ストアからAlipayかWeChatを入手します。対応する海外番号を含む本人の番号で登録し、今後の認証にも使えるよう維持してください。理解できる画面言語を選びます。",
          "공식 스토어에서 Alipay나 WeChat을 받으세요. 지원되는 해외 번호를 포함한 본인 번호로 가입하고 이후 인증에도 사용할 수 있도록 유지하세요. 이해할 수 있는 화면 언어를 선택하세요.",
        ),
      },
      {
        t: l(
          "Link your card and follow verification prompts",
          "绑卡并按提示完成验证",
          "カード登録と必要な認証",
          "카드 등록 및 필요한 인증",
        ),
        d: l(
          "Add a supported card in your own name. Complete the app and issuer checks when prompted; required checks vary. Enter verification codes only in the official flow. If linking fails, contact the platform or issuer rather than assuming another person’s card will work.",
          "添加本人名下受支持的银行卡，按提示完成平台和发卡行验证，具体要求可能不同。验证码只在官方流程中输入。失败时联系平台或发卡行，不要改用他人银行卡冒试。",
          "本人名義の対応カードを登録し、案内に従ってアプリと発行会社の認証を行います。要件は異なります。認証コードは公式の手順だけで入力し、失敗したら決済会社か発行会社に問い合わせてください。",
          "본인 명의의 지원 카드를 등록하고 앱 및 발급사 안내에 따라 인증하세요. 요구 사항은 다를 수 있습니다. 인증 코드는 공식 절차에서만 입력하고 실패하면 플랫폼이나 발급사에 문의하세요.",
        ),
      },
      {
        t: l(
          "Check the merchant, amount and funding source",
          "核对收款方、金额与支付渠道",
          "店舗・金額・支払い元を確認",
          "가맹점·금액·결제 수단 확인",
        ),
        d: l(
          "Scan the merchant’s code or show your payment code to the cashier. Confirm the recipient, amount, selected card and any fee before authorizing. Keep payment codes and verification codes private. App limits and supported merchants can change.",
          "扫描商户收款码或向收银员出示付款码。确认收款方、金额、所选银行卡和费用后再授权。保护付款码与验证码。平台限额和支持商户可能变化。",
          "店舗のコードを読み取るか、レジで自分の決済コードを提示します。相手、金額、選択カード、手数料を確認して承認します。決済コードと認証コードを守ってください。上限や対応店舗は変わる場合があります。",
          "가맹점 코드를 스캔하거나 계산원에게 결제 코드를 보여 주세요. 수취인, 금액, 선택 카드와 수수료를 확인한 후 승인하세요. 결제 코드와 인증 코드를 보호하세요. 한도와 지원 가맹점은 바뀔 수 있습니다.",
        ),
      },
      {
        t: l(
          "Confirm the result before trying again",
          "重试前确认交易结果",
          "再試行前に結果を確認",
          "재시도 전에 결과 확인",
        ),
        d: l(
          "Check your order history and the merchant’s confirmation. Do not pay again just because a screen is slow. If rejected, use the combined troubleshooting section below. Ask which other payment methods the merchant accepts, and keep RMB cash or another supported card as a backup.",
          "查看交易记录并请商家确认，不要仅因页面响应慢就再次支付。被拒时按下方统一问题区排查。询问商户接受的其他方式，并备好人民币现金或另一张受支持银行卡。",
          "取引履歴と店舗の確認を照合し、画面が遅いだけで再度払わないでください。拒否された場合は下の問題解決欄を使います。別の支払い方法を店に尋ね、人民元の現金か別の対応カードを予備に用意します。",
          "거래 내역과 가맹점 확인을 대조하고 화면이 느리다는 이유로 다시 결제하지 마세요. 거절되면 아래 통합 문제 해결을 이용하세요. 다른 결제 수단을 문의하고 위안화 현금이나 다른 지원 카드를 준비하세요.",
        ),
      },
    ],
    mistakes: [],
    planB: [],
    trouble: [],
    lastUpdated: "2026-10-28",
    sources: [
      {
        label: l(
          "Official payment-service guidance",
          "官方支付服务指南",
          "公式の決済サービス案内",
          "공식 결제 서비스 안내",
        ),
        url: payment,
      },
    ],
  },
};

guideRevisions.hotel = {
  task: l(
    "Check your reservation, present your travel document and confirm accommodation registration. An extra foreign-guest qualification is not a valid general barrier under the official accommodation-facilitation measures; a booking still depends on availability and the reservation conditions.",
    "核对预订、出示旅行证件，并确认住宿登记。官方便利住宿措施不应以涉外资质作为普遍接待门槛；具体入住仍取决于房态和预订条件。",
    "予約と渡航書類を確認し、宿泊登録を確認します。公式の宿泊便利化措置では外国人向け資格を一般的な受入条件にできません。宿泊には空室と予約条件の確認が必要です。",
    "예약과 여행 서류를 확인하고 숙박 등록을 확인하세요. 공식 숙박 편의 조치상 별도의 외국인 접객 자격을 일반적인 장벽으로 삼아서는 안 됩니다. 숙박은 객실 상황과 예약 조건을 확인해야 합니다.",
  ),
  before: [
    l(
      "A valid passport or accepted travel document for each guest",
      "每位住客的有效护照或认可的旅行证件",
      "各宿泊者の有効なパスポートや認められる渡航書類",
      "각 투숙객의 유효한 여권 또는 인정되는 여행 서류",
    ),
    l(
      "Booking name, dates, hotel address and payment details",
      "预订姓名、日期、酒店地址与付款信息",
      "予約名・日程・ホテル住所・支払い情報",
      "예약자 이름·날짜·호텔 주소·결제 정보",
    ),
  ],
  steps: [
    {
      t: l(
        "Confirm your reservation and arrival time",
        "确认预订与抵达时间",
        "予約と到着時刻を確認",
        "예약 및 도착 시간 확인",
      ),
      d: l(
        "Match the hotel branch and address to your confirmation. If arriving late, contact reception before travelling. Ask about the document and registration process in advance. Do not assume that a platform’s foreign-guest filter is a legal licensing rule.",
        "核对酒店门店与确认单地址。晚到时提前联系前台，了解证件与登记流程。平台的外宾筛选项不等于法定资质规则。",
        "ホテルの支店と住所を確認書に照合し、遅い到着は先にフロントへ連絡します。必要書類と登録手順を確認してください。予約サイトの絞り込みを法的資格の規則と混同しないでください。",
        "확인서와 호텔 지점 및 주소를 대조하고 늦게 도착하면 미리 프런트에 연락하세요. 서류 및 등록 절차를 확인하세요. 플랫폼의 외국인 필터가 법적 자격 규정이라고 생각하지 마세요.",
      ),
    },
    {
      t: l(
        "Present documents and confirm registration",
        "出示证件并确认登记",
        "書類を提示して登録を確認",
        "서류 제시 및 등록 확인",
      ),
      d: l(
        "Give reception the booking name and each guest’s document for the required registration. Check that documents are returned and stored safely. If registration is unclear, ask reception or NIA 12367. Private-home registration is a separate process in the arrival checklist.",
        "向前台提供预订姓名和各住客证件，办理所需登记。确认取回证件并妥善保管。流程不清楚时询问前台或移民管理局 12367。私人住所登记另见落地清单。",
        "予約名と各宿泊者の書類を提示し、必要な登録を受けます。書類の返却を確認し安全に保管してください。不明点はフロントか12367へ。個人宅の登録は到着チェックリストで案内します。",
        "예약자 이름과 각 투숙객의 서류를 제시하여 등록하세요. 서류를 돌려받아 안전하게 보관하세요. 불분명하면 프런트나 12367에 문의하세요. 개인 주택 등록은 도착 체크리스트에서 안내합니다.",
      ),
    },
    {
      t: l(
        "Confirm charges and practical details",
        "确认费用及入住细节",
        "料金と宿泊条件を確認",
        "비용 및 숙박 조건 확인",
      ),
      d: l(
        "Ask about deposits or card holds, breakfast, checkout time and reception contact details before paying. Keep receipts. Deposit release and bank processing can take time; ask the hotel for its terms rather than assuming an immediate refund. Save the hotel’s Chinese address for your return.",
        "付款前问清押金或银行卡预授权、早餐、退房时间及前台联系方式，保留凭证。押金解冻和银行入账可能需要时间，不要假定立即退款。保存酒店中文地址，方便返回。",
        "支払い前に保証金や与信枠の確保、朝食、退出時刻、連絡先を確認して領収書を保存します。解除や銀行処理には時間がかかる場合があるため、即時返金を前提にせず条件を尋ねてください。中国語住所も保存します。",
        "결제 전에 보증금이나 카드 승인 보류, 조식, 퇴실 시간과 연락처를 확인하고 영수증을 보관하세요. 해제와 은행 처리에 시간이 걸릴 수 있으므로 즉시 환불을 가정하지 말고 조건을 문의하세요. 중국어 주소도 저장하세요.",
      ),
    },
    {
      t: l(
        "Check out and keep a record",
        "退房并保留记录",
        "退出して記録を保管",
        "체크아웃 및 기록 보관",
      ),
      d: l(
        "Return the key, check the final bill and ask how any deposit will be released. Keep the receipt and original payment record until the amount is settled. If you need another night, ask about availability and price before the current checkout deadline.",
        "归还房卡、核对最终账单，询问押金解冻或退回方式。款项结清前保留收据与原付款记录。需要续住时，在当前退房期限前确认房态和价格。",
        "鍵を返して最終明細と保証金の解除方法を確認し、精算完了まで領収書と元の支払い記録を保存します。延泊は退出期限の前に空室と料金を確認してください。",
        "열쇠를 반납하고 최종 명세와 보증금 해제 방법을 확인하세요. 정산까지 영수증과 원래 결제 기록을 보관하세요. 연장은 현재 퇴실 기한 전에 객실과 가격을 확인하세요.",
      ),
    },
  ],
  planB: [
    l(
      "If check-in cannot be resolved, ask the booking platform and hotel manager for assistance with the reservation or alternative accommodation. Keep written records; do not assume every rejection is caused by a lawful foreign-guest licensing restriction.",
      "无法解决入住问题时，请预订平台和酒店负责人协助处理订单或安排其他住宿，并保留书面记录；不要将任何拒绝都理解为合法的涉外资质限制。",
      "解決しなければ予約サイトとホテル責任者に予約や代替宿泊の支援を求め、記録を残します。拒否を当然の外国人向け資格制限と考えないでください。",
      "해결되지 않으면 예약 플랫폼과 호텔 책임자에게 예약 처리나 대체 숙소 지원을 요청하고 기록을 보관하세요. 모든 거절을 합법적인 외국인 자격 제한으로 이해하지 마세요.",
    ),
  ],
  trouble: [
    {
      p: l(
        "Deposit has not returned",
        "押金未退回",
        "保証金が戻らない",
        "보증금 미반환",
      ),
      a: l(
        "Ask the hotel to confirm release and provide its reference. Check the original payment channel and issuer processing time. Keep the bill and follow up if the stated period has passed.",
        "请酒店确认已解冻或退款，并提供凭证编号。核对原支付渠道与发卡行处理时间，保留账单，超过约定期限后继续追查。",
        "ホテルに解除と照会番号を確認し、元の支払い方法と発行会社の処理期間を確認します。明細を残し、期間を過ぎたら照会してください。",
        "호텔에 해제 여부와 확인 번호를 요청하고 원래 결제 수단 및 발급사 처리 기간을 확인하세요. 명세를 보관하고 안내된 기간이 지나면 다시 문의하세요.",
      ),
    },
  ],
  mistakes: [],
  tip: undefined,
  disclaimer: undefined,
  lastUpdated: "2026-10-28",
  sources: [
    {
      label: l(
        "Official accommodation-facilitation measures",
        "官方住宿便利化措施",
        "公式の宿泊便利化措置",
        "공식 숙박 편의 조치",
      ),
      url: "https://www.mofcom.gov.cn/zwgk/zcfb/art/2024/art_10ddb29858c24ece86b3f575bda1d9c4.html",
    },
  ],
};

guideRevisions.emergency = {
  task: l(
    "Use the appropriate emergency number and explain where you are. Do not wait for an AI reply or community response when urgent help is needed.",
    "需要紧急帮助时，拨打相应电话并说明位置。不要等待智能助手或社区回复。",
    "緊急時は適切な番号に電話して場所を伝えます。アシスタントやコミュニティの返答を待たないでください。",
    "긴급 상황에는 해당 번호로 전화하고 위치를 설명하세요. 도우미나 커뮤니티 답변을 기다리지 마세요.",
  ),
  before: [
    l(
      "Your city and exact location, or a nearby named landmark",
      "所在城市、准确位置或附近有名称的地标",
      "都市と正確な場所、または近くの目印",
      "도시 및 정확한 위치나 근처 지명",
    ),
    l(
      "A working phone, or someone nearby who can place a call",
      "可用电话，或能协助拨号的人",
      "使える電話、または発信を手伝える人",
      "사용 가능한 전화나 전화를 걸어 줄 사람",
    ),
  ],
  steps: [
    {
      t: l(
        "Call the service you need",
        "拨打对应的求助电话",
        "必要な窓口へ電話",
        "필요한 기관에 전화",
      ),
      d: l(
        "Police 110; ambulance 120; fire 119; traffic incidents 122. If you cannot speak Chinese, ask for language assistance or ask a nearby staff member to help communicate. Do not delay calling to collect documents.",
        "报警 110、急救 120、火警 119、交通事故 122。不会中文时可请求语言协助，或请附近工作人员帮忙沟通。不要为了寻找证件而延误拨号。",
        "警察110、救急120、消防119、交通事故122です。中国語がわからなければ言語支援や近くの係員の協力を頼んでください。書類を探すために通報を遅らせないでください。",
        "경찰 110, 구급 120, 소방 119, 교통사고 122입니다. 중국어를 못하면 언어 지원이나 근처 직원의 도움을 요청하세요. 서류를 찾느라 신고를 늦추지 마세요.",
      ),
    },
    {
      t: l(
        "Give your location and describe the situation",
        "说明位置与现场情况",
        "場所と状況を伝える",
        "위치 및 상황 설명",
      ),
      d: l(
        "Give the city, street or venue name and a clear nearby landmark. Say what happened, how many people need help and a callback number if requested. Follow the operator’s instructions and keep the phone available.",
        "提供城市、街道或场所名称及清楚的附近地标。说明发生了什么、需要帮助的人数，并按要求提供回拨号码。遵循接线员指引，保持电话畅通。",
        "都市、通りや施設名、はっきりした目印を伝えます。何が起きたか、何人が助けを必要としているか、求められた場合は折り返し番号を伝えます。係員の指示に従い、電話を使える状態に保ってください。",
        "도시, 거리나 장소 이름과 분명한 지표를 알려 주세요. 발생한 일, 도움이 필요한 사람 수와 요청 시 회신 번호를 설명하세요. 상담원 지시를 따르고 전화를 받을 수 있게 하세요.",
      ),
    },
    {
      t: l(
        "If your phone cannot call",
        "手机无法拨号时",
        "自分の電話で発信できない場合",
        "내 전화로 통화할 수 없을 때",
      ),
      d: l(
        "Ask a nearby staff member or another person to call on your behalf. Show a Chinese help card and point out your location. The app opens the dialer when supported; it does not dispatch responders or share your location automatically.",
        "请附近工作人员或他人代为拨号，出示中文求助卡并指出位置。本应用仅在设备支持时打开拨号器，不会代为调度救援，也不会自动发送你的位置。",
        "近くの係員などに代わりに電話してもらい、中国語カードと場所を示してください。アプリは対応端末の発信画面を開くだけで、救助要請や位置の自動共有は行いません。",
        "근처 직원이나 다른 사람에게 대신 전화해 달라고 요청하고 중국어 카드와 위치를 보여 주세요. 앱은 지원 기기의 전화 화면만 열며 구조대를 배치하거나 위치를 자동 전송하지 않습니다.",
      ),
    },
    {
      t: l(
        "For a lost passport",
        "护照遗失时",
        "パスポートを失くした場合",
        "여권을 잃어버렸을 때",
      ),
      d: l(
        "Report the loss to local police and contact your country’s embassy or consulate about replacement documents. Keep the report and ask NIA 12367 about any related stay or exit procedure. This is separate from medical or fire emergencies.",
        "向当地公安机关报失，联系本国使领馆补办证件。保留报失材料，涉及停留或出境手续时向移民管理局 12367 咨询。这与急救或火警求助不同。",
        "地元警察に届け出て、自国の大使館か領事館へ再発行を相談します。届出記録を保管し、滞在・出国手続きは12367へ確認してください。救急や火災の通報とは別です。",
        "관할 경찰에 분실 신고하고 자국 대사관이나 영사관에 재발급을 문의하세요. 신고 기록을 보관하고 체류나 출국 절차는 12367에 문의하세요. 구급이나 화재 신고와는 별개입니다.",
      ),
    },
  ],
  planB: [],
  mistakes: [],
  trouble: [],
  tip: undefined,
  showCard: {
    title: l(
      "Ask someone nearby to help",
      "向附近的人求助",
      "近くの人に助けを求める",
      "주변 사람에게 도움 요청",
    ),
    lines: [
      "我需要紧急帮助。",
      "请帮我拨打合适的求助电话。",
      "我的位置在这里。",
      "我不太会说中文。",
    ],
  },
  disclaimer: l(
    "Contact guidance only; follow emergency-service staff for instructions.",
    "此处仅提供联络指引，请遵循紧急服务工作人员的指导。",
    "連絡の案内です。緊急窓口の係員の指示に従ってください。",
    "연락 안내이며 긴급 기관 직원의 지시에 따르세요.",
  ),
  lastUpdated: "2026-10-28",
  sources: [
    {
      label: l(
        "Official emergency-contact guidance",
        "官方紧急联络指南",
        "公式の緊急連絡案内",
        "공식 긴급 연락 안내",
      ),
      url: payment,
    },
  ],
};

export const shortGuideRevisions = {
  "entry-check": {
    title: l(
      "Check your entry eligibility",
      "核实入境资格",
      "入国資格を確認",
      "입국 자격 확인",
    ),
    summary: l(
      "A pre-departure document check. The arrival checklist covers the procedures after you land.",
      "出发前核对证件资格；抵达后的办理顺序另见落地清单。",
      "出発前の書類確認です。到着後の流れは到着チェックリストで確認できます。",
      "출발 전 서류 확인 안내입니다. 도착 후 절차는 도착 체크리스트에서 확인하세요.",
    ),
    steps: [
      [
        l(
          "Check your own travel document",
          "核对自己的旅行证件",
          "自分の渡航書類を確認",
          "자신의 여행 서류 확인",
        ),
        l(
          "Check passport validity, available pages and that booking details match. Do not assume another traveller’s visa arrangement applies to you.",
          "核对护照有效期、空白页和预订信息是否一致。不要假定其他旅客的签证安排也适用于你。",
          "パスポートの有効期限、空白ページ、予約との一致を確認します。他の旅行者の査証条件が自分にも当てはまるとは限りません。",
          "여권 유효기간, 빈 페이지와 예약 정보의 일치를 확인하세요. 다른 여행자의 비자 조건이 본인에게도 적용된다고 가정하지 마세요.",
        ),
      ],
      [
        l(
          "Check official rules for your route",
          "按自己的路线核实官方规定",
          "自分の経路に合う公式規則を確認",
          "자신의 경로에 맞는 공식 규정 확인",
        ),
        l(
          "Consult NIA, the relevant Chinese mission and your airline about nationality, document type, travel purpose, entry port, permitted area and stay. Check transit conditions separately. The app does not calculate eligibility.",
          "向移民管理局、相关中国使领馆及航空公司确认国籍、证件类型、出行目的、口岸、允许区域和停留期限。过境条件须单独核实。本应用不计算入境资格。",
          "国籍、書類の種類、目的、入境地、許可区域、滞在について入管当局・中国公館・航空会社に確認します。乗り継ぎ条件は別に確認してください。アプリは資格を判定しません。",
          "국적, 서류 종류, 목적, 입국지, 허용 지역과 체류 기간을 이민 당국, 중국 공관 및 항공사에 확인하세요. 환승 조건은 별도로 확인하세요. 앱은 자격을 판단하지 않습니다.",
        ),
      ],
      [
        l(
          "Keep documents available offline",
          "准备离线可查看的材料",
          "通信なしで書類を確認できるように",
          "오프라인으로 볼 서류 준비",
        ),
        l(
          "Keep the itinerary, onward booking when relevant, first lodging address and contact details in a secure place on your device. Carry originals where required; a screenshot does not replace a travel document.",
          "将行程、适用的后续交通预订、首晚住宿地址和联系方式安全保存在手机上。按要求携带原件，截图不能代替旅行证件。",
          "旅程、該当する以後の予約、最初の宿泊先住所と連絡先を端末の安全な場所に保存します。必要な原本を持参し、画面の画像を渡航書類の代わりにしないでください。",
          "여정, 해당하는 이후 예약, 첫 숙소 주소와 연락처를 기기에 안전하게 저장하세요. 필요한 원본을 지참하며 화면 캡처는 여행 서류를 대신하지 않습니다.",
        ),
      ],
    ],
  },
  "offline-ready": {
    title: l(
      "Prepare your phone without a connection",
      "准备离线可用的手机资料",
      "通信なしでも使える準備",
      "인터넷 없이 쓸 휴대전화 자료 준비",
    ),
    summary: l(
      "Keep practical essentials accessible if roaming, airport Wi-Fi or your battery lets you down.",
      "漫游、机场网络不可用或电量不足时，也能找到必要资料。",
      "ローミングや空港の通信、電池に問題があっても必要な情報を使えるようにします。",
      "로밍, 공항 통신망이나 배터리에 문제가 생겨도 필요한 정보를 찾도록 준비하세요.",
    ),
    steps: [
      [
        l("Save destinations", "保存目的地", "目的地を保存", "목적지 저장"),
        l(
          "Save your hotel address and the exact next airport or station. If your map app supports offline areas, download them before departure. Keep a separate Chinese address card.",
          "保存酒店地址及下一程准确的机场或车站。如果地图支持离线区域，出发前先下载；另备中文地址卡。",
          "宿泊先住所と次の正確な空港・駅を保存します。地図が通信なしの地域保存に対応していれば出発前に取得し、中国語の住所カードも用意します。",
          "호텔 주소와 다음 정확한 공항 또는 역을 저장하세요. 지도 앱이 오프라인 지역 저장을 지원하면 출발 전에 내려받고 중국어 주소 카드를 별도로 준비하세요.",
        ),
      ],
      [
        l(
          "Save booking references safely",
          "安全保存预订凭证",
          "予約情報を安全に保存",
          "예약 정보를 안전하게 저장",
        ),
        l(
          "Keep key confirmations and contact numbers in protected device storage. Carry required original documents. Do not put passport or payment details in a public community post.",
          "将重要确认单和联系方式存入受保护的本机空间，携带所需证件原件。不要把护照或支付信息发布到公开社区。",
          "確認書と連絡先を保護された端末領域に保存し、必要な書類の原本を持参します。パスポートや決済情報は公開投稿に載せないでください。",
          "확인서와 연락처를 기기의 보호된 저장 공간에 보관하고 필요한 서류 원본을 지참하세요. 여권이나 결제 정보를 공개 게시물에 올리지 마세요.",
        ),
      ],
      [
        l(
          "Try a short airplane-mode check",
          "用飞行模式检查一次",
          "機内モードで確認",
          "비행기 모드로 확인",
        ),
        l(
          "Before travelling, check that saved cards, bookings and map areas open without a connection. Charge your phone and plan a way to recharge. AI chat and live translation need internet; they do not work offline.",
          "出发前确认保存的卡片、预订和地图区域能在断网时打开。给手机充电并安排补电方式。智能聊天和实时翻译需要网络，无法离线使用。",
          "出発前にカード、予約、保存した地図を通信なしで開けるか確認します。充電して補充方法も考えてください。モデルとの会話と即時翻訳には通信が必要です。",
          "출발 전에 카드, 예약과 저장한 지도가 인터넷 없이 열리는지 확인하세요. 충전하고 재충전 방법도 준비하세요. 모델 대화와 실시간 번역에는 인터넷이 필요합니다.",
        ),
      ],
    ],
  },
};
export const cityNoteRevisions = {
  beijing: l(
    "Capital (PEK) and Daxing (PKX) are different airports. Match the airport code and terminal on your ticket before arranging a transfer; do not treat the airports as interchangeable.",
    "首都机场和大兴机场是两个不同机场，代码分别为 PEK 和 PKX。安排接驳前核对车票或机票上的代码与航站楼，不要混淆。",
    "首都空港と大興空港は別で、コードはPEKとPKXです。移動を手配する前に航空券のコードとターミナルを確認してください。",
    "서우두 공항과 다싱 공항은 별개이며 코드는 PEK와 PKX입니다. 이동을 예약하기 전에 항공권의 코드와 터미널을 확인하세요.",
  ),
  shanghai: l(
    "Pudong (PVG) and Hongqiao (SHA) are separate airports. Hongqiao Railway Station and Shanghai Railway Station are also different destinations. Match the full name and terminal on each booking.",
    "浦东机场与虹桥机场分别为 PVG、SHA；上海虹桥站与上海站也是不同目的地。每一段预订都要核对完整名称及航站楼。",
    "浦東空港PVGと虹橋空港SHAは別です。上海虹橋駅と上海駅も異なります。各予約の正式名とターミナルを確認してください。",
    "푸둥 공항 PVG와 훙차오 공항 SHA는 별개이며 상하이 훙차오역과 상하이역도 다릅니다. 각 예약의 전체 이름과 터미널을 확인하세요.",
  ),
  xian: l(
    "Xi’an North Railway Station is different from Xi’an Railway Station. Check the exact station printed on the ticket. For flights, confirm Xianyang airport’s code XIY and your terminal.",
    "西安北站不同于西安站，请核对车票上的准确站名。乘飞机时确认咸阳机场代码 XIY 与航站楼。",
    "西安北駅と西安駅は別です。切符の正確な駅名を確認してください。航空便は咸陽空港XIYとターミナルを確認します。",
    "시안 북역과 시안역은 다릅니다. 승차권의 정확한 역 이름을 확인하세요. 항공편은 셴양 공항 XIY와 터미널을 확인하세요.",
  ),
  chengdu: l(
    "Shuangliu (CTU) and Tianfu (TFU) are different airports. Chengdu East, Chengdu and Chengdu South are different railway stations. Use the exact name on your booking when arranging pickup.",
    "双流机场与天府机场分别为 CTU、TFU；成都东站、成都站和成都南站也不同。安排接送时使用预订上的完整名称。",
    "双流空港CTUと天府空港TFUは別です。成都東駅、成都駅、成都南駅も異なるため、送迎では予約の正確な名前を使ってください。",
    "솽류 공항 CTU와 톈푸 공항 TFU는 다릅니다. 청두 동역, 청두역과 청두 남역도 별개이므로 예약의 정확한 이름으로 승차 장소를 정하세요.",
  ),
  hangzhou: l(
    "Hangzhou East, Hangzhou and Hangzhou West are different stations. Confirm the full station name and allow time for the correct route. For flights, check Xiaoshan airport code HGH.",
    "杭州东站、杭州站与杭州西站不同，请核对完整站名并预留前往正确车站的时间。乘机时确认萧山机场代码 HGH。",
    "杭州東駅、杭州駅、杭州西駅は別です。正確な駅名と経路を確認し、空港利用時は蕭山空港HGHを確認してください。",
    "항저우 동역, 항저우역과 항저우 서역은 별개입니다. 전체 역 이름과 경로를 확인하고 항공편은 샤오산 공항 HGH를 확인하세요.",
  ),
  guilin: l(
    "Guilin, Guilin North and Guilin West are separate stations. Match your train’s station before arranging a taxi. Liangjiang airport uses code KWL.",
    "桂林站、桂林北站和桂林西站是不同车站，叫车前先核对本次列车的站名。两江机场代码为 KWL。",
    "桂林駅、桂林北駅、桂林西駅は別です。タクシー手配前に列車の駅名を確認してください。両江空港のコードはKWLです。",
    "구이린역, 구이린 북역과 구이린 서역은 별개입니다. 택시 예약 전에 열차의 역 이름을 확인하세요. 량장 공항 코드는 KWL입니다.",
  ),
  guangzhou: l(
    "Guangzhou South, Guangzhou and Guangzhou East are different railway stations. This is a starter list, not every station. Use your ticket’s exact name; Baiyun airport uses code CAN.",
    "广州南站、广州站和广州东站不同，此处仅列常用车站。请使用车票上的准确名称；白云机场代码为 CAN。",
    "広州南駅、広州駅、広州東駅は別で、ここですべての駅を網羅していません。切符の正確な名前を使い、白雲空港はCANを確認してください。",
    "광저우 남역, 광저우역과 광저우 동역은 별개이며 전체 역 목록은 아닙니다. 승차권의 정확한 이름을 사용하고 바이윈 공항은 CAN을 확인하세요.",
  ),
  shenzhen: l(
    "Shenzhen North, Futian and Shenzhen Railway Station are separate places. Check your ticket and pickup point carefully. Bao’an airport uses code SZX; a city name alone is not enough for pickup.",
    "深圳北站、福田站与深圳站是不同地点，请仔细核对车票与上车点。宝安机场代码为 SZX，仅有城市名不足以确定接送位置。",
    "深圳北駅、福田駅、深圳駅は別です。切符と乗車場所を確認してください。宝安空港はSZXで、都市名だけでは送迎場所を特定できません。",
    "선전 북역, 푸톈역과 선전역은 별개입니다. 승차권과 승차 장소를 확인하세요. 바오안 공항 코드는 SZX이며 도시 이름만으로는 장소를 특정할 수 없습니다.",
  ),
};
export const officialSourceLabel = l(
  "Official source",
  "官方来源",
  "公式情報",
  "공식 자료",
);

guideRevisions.taxi = {
  task: l(
    "Get from your current place to the right destination using an official taxi or a supported ride-hailing service.",
    "使用正规出租车或受支持的网约车服务，前往正确目的地。",
    "正規タクシーや対応する配車サービスで正しい目的地へ移動します。",
    "공식 택시나 지원 차량 호출 서비스로 정확한 목적지에 이동하세요.",
  ),
  before: [
    l(
      "The destination’s full address and the correct entrance",
      "目的地完整地址及正确入口",
      "目的地の正確な住所と入口",
      "목적지의 전체 주소 및 정확한 입구",
    ),
    l(
      "A supported payment method; internet for app booking",
      "可用支付方式；通过应用叫车还需网络",
      "利用可能な支払い方法と、配車時の通信接続",
      "사용 가능한 결제 수단 및 앱 호출 시 인터넷",
    ),
  ],
  steps: [
    {
      t: l(
        "Confirm the destination and pickup point",
        "确认目的地与上车点",
        "目的地と乗車場所を確認",
        "목적지 및 승차 장소 확인",
      ),
      d: l(
        "Use the hotel or venue’s exact Chinese address, not just its brand. Match the terminal, exit or street side. At airports and stations, follow official taxi signs or the app’s designated pickup area.",
        "使用酒店或场所的准确中文地址，不要只填品牌名。核对航站楼、出口和道路一侧。在机场或车站按正规出租车标识或应用指定区域上车。",
        "ブランド名だけでなく施設の正確な中国語住所を使い、ターミナル・出口・道路の側を確認します。空港や駅では正規乗り場か配車指定場所に従ってください。",
        "브랜드명뿐 아니라 정확한 중국어 주소를 사용하고 터미널, 출구와 도로 방향을 확인하세요. 공항이나 역에서는 공식 승강장이나 앱 지정 구역을 이용하세요.",
      ),
    },
    {
      t: l(
        "Choose and review the ride",
        "选择车辆并核对订单",
        "車両と注文内容を確認",
        "차량 선택 및 주문 확인",
      ),
      d: l(
        "For an app booking, check the displayed service type, estimated fare, payment method and cancellation terms before confirming. An estimate is not a final fare. For a street taxi, use a recognized taxi and confirm the destination and meter arrangements.",
        "应用叫车时，确认车型、预估费用、付款方式和取消条款。预估价不等于最终车费。乘坐巡游出租车时，选择正规车辆并确认目的地和计价方式。",
        "配車では車種、見積額、支払い方法、取消条件を確認します。見積りは最終料金ではありません。流しのタクシーは正規車両を選び、目的地と計量方法を確認してください。",
        "앱 호출 시 차종, 예상 요금, 결제 수단과 취소 조건을 확인하세요. 예상액은 최종 요금이 아닙니다. 일반 택시는 정식 차량을 선택하고 목적지와 요금 계산 방식을 확인하세요.",
      ),
    },
    {
      t: l(
        "Verify the vehicle before boarding",
        "上车前核对车辆",
        "乗る前に車両を照合",
        "승차 전 차량 대조",
      ),
      d: l(
        "Match the full plate, vehicle and driver information to the booking. Use in-app messages if a call is difficult to understand. Do not board a different vehicle just because someone says they are your driver.",
        "将完整车牌、车辆和司机信息与订单核对。听不懂电话时可用应用内文字消息。不要仅因对方自称司机就上其他车辆。",
        "車両番号全体、車種、運転手を予約と照合します。電話がわからなければアプリ内の文字で連絡し、名乗られただけで別の車には乗らないでください。",
        "전체 번호판, 차량과 기사 정보를 예약과 대조하세요. 통화가 어렵다면 앱 내 문자로 연락하세요. 누군가 기사라고 말하는 것만으로 다른 차량에 타지 마세요.",
      ),
    },
    {
      t: l(
        "Pay once and keep the receipt",
        "确认付款一次并保留凭证",
        "支払いを確認して記録を保管",
        "한 번 결제하고 기록 보관",
      ),
      d: l(
        "Follow the order or taxi’s supported payment method. Check whether the app already charged you before paying separately. Keep the trip record and receipt for fare questions or lost property; use the order’s support channel to follow up.",
        "按订单或出租车支持的方式付款，另行支付前先确认应用是否已扣款。保留行程和发票，费用争议或遗失物品时通过对应订单客服追查。",
        "対応する方法で払い、別途払う前にアプリの請求済み状態を確認します。料金の疑問や忘れ物に備えて履歴と領収書を保存し、該当する注文の窓口を使ってください。",
        "지원하는 방식으로 결제하고 별도로 내기 전에 앱에서 이미 청구했는지 확인하세요. 요금 문의나 분실물에 대비해 내역과 영수증을 보관하고 해당 주문의 고객 지원을 이용하세요.",
      ),
    },
  ],
  trouble: [
    {
      p: l(
        "Pickup or booking fails",
        "无法上车或下单失败",
        "乗車・予約ができない",
        "승차 또는 예약 실패",
      ),
      a: l(
        "Check the exact exit and order status before rebooking. Ask an official transport desk or hotel reception about a taxi, metro or bus alternative. Do not assume a cancellation has no fee.",
        "重新下单前核对出口与订单状态。可向正规交通服务台或酒店前台询问出租车、地铁或巴士替代方案，不要假定取消一定免费。",
        "再予約前に出口と注文状態を確認し、正規の案内所やホテルへ代替交通を尋ねます。取消が無料とは限りません。",
        "재예약 전에 출구와 주문 상태를 확인하고 공식 안내소나 호텔에 대체 교통편을 문의하세요. 취소가 항상 무료라고 가정하지 마세요.",
      ),
    },
  ],
  planB: [],
  mistakes: [],
  tip: undefined,
  disclaimer: undefined,
  lastUpdated: "2026-10-28",
  sources: [
    {
      label: l(
        "DiDi official service",
        "滴滴官方服务",
        "DiDi公式サービス",
        "DiDi 공식 서비스",
      ),
      url: "https://www.didiglobal.com/",
    },
  ],
};

guideRevisions.train = {
  task: l(
    "Book a train using your accepted travel document, check the exact station and board with the document used for booking.",
    "使用认可的旅行证件购票，确认准确车站，并携购票证件乘车。",
    "認められる渡航書類で購入し、正確な駅と購入に使った書類を確認して乗車します。",
    "인정되는 여행 서류로 예매하고 정확한 역과 예매에 사용한 서류를 확인하여 승차하세요.",
  ),
  before: [
    l(
      "Your valid passport and matching passenger details",
      "有效护照及与其一致的乘车人信息",
      "有効なパスポートと一致する旅客情報",
      "유효한 여권 및 일치하는 승객 정보",
    ),
    l(
      "Correct station names, travel date and an accepted payment method",
      "正确站名、乘车日期和可用支付方式",
      "正確な駅名・日付・利用可能な支払い方法",
      "정확한 역 이름·날짜·결제 수단",
    ),
  ],
  steps: [
    {
      t: l(
        "Choose an official booking channel",
        "选择正规购票渠道",
        "正規の購入窓口を選ぶ",
        "정식 예매 창구 선택",
      ),
      d: l(
        "Use China Railway 12306 or a staffed station counter. Add passenger details exactly as required by your document and complete any verification. Third-party agencies have their own conditions and fees; a saved search is not a ticket.",
        "使用铁路官方购票平台或车站人工窗口。按证件要求准确填写乘车人信息并完成核验。第三方代理有独立条款与费用，保存查询结果不代表已经购票。",
        "中国鉄道12306か駅の有人窓口を利用し、書類に従って旅客情報を入力して認証します。代理店には独自の条件と料金があり、検索の保存は切符ではありません。",
        "중국철도 12306이나 역의 유인 창구를 이용하고 서류에 맞게 승객 정보를 입력하여 인증하세요. 대행업체에는 별도 조건과 수수료가 있으며 검색 결과 저장은 승차권이 아닙니다.",
      ),
    },
    {
      t: l(
        "Check train, station and ticket status",
        "核对车次、车站及出票状态",
        "列車・駅・発券状況を確認",
        "열차·역·발권 상태 확인",
      ),
      d: l(
        "Confirm the full departure and arrival station names, date, time, seat and final payment status. Different stations in one city are not interchangeable. If using a waitlist, read its deadline and refund rules; travel only after ticketing is confirmed.",
        "确认完整出发与到达站名、日期、时间、席别和最终支付状态。同城不同站不能混用。候补时阅读兑现期限及退款规则，确认出票后再安排行程。",
        "出発・到着の正式な駅名、日時、座席、支払い完了を確認します。同じ都市でも駅は異なります。待機予約は期限と返金規則を読み、発券確認後に移動を計画してください。",
        "출발·도착역 전체 이름, 날짜, 시간, 좌석과 최종 결제 상태를 확인하세요. 같은 도시라도 역은 다릅니다. 대기는 마감과 환불 규정을 읽고 발권 확인 후 이동을 계획하세요.",
      ),
    },
    {
      t: l(
        "Reach the correct station in good time",
        "提前到达正确车站",
        "正しい駅へ余裕をもって到着",
        "정확한 역에 여유 있게 도착",
      ),
      d: l(
        "Allow time for the journey, security and identity checks. Check your ticket and station notices for boarding deadlines. Carry the original document used to buy the ticket; if a gate cannot read it, ask staff for assistance rather than repeatedly trying another document.",
        "为路程、安检和身份核验预留时间，按车票和车站通知确认检票截止时间。携带购票所用证件原件；闸机不能识别时请工作人员协助，不要不断更换其他证件尝试。",
        "移動、保安検査、本人確認の時間を取り、切符と駅の案内で改札期限を確認します。購入に使った原本を持ち、読み取れなければ別の書類で試し続けず係員へ相談してください。",
        "이동, 보안 검사와 신원 확인 시간을 확보하고 승차권 및 역 공지에서 탑승 마감을 확인하세요. 예매 서류 원본을 지참하고 읽히지 않으면 다른 서류로 반복 시도하지 말고 직원에게 문의하세요.",
      ),
    },
    {
      t: l(
        "Board and keep your travel record",
        "乘车并保留行程记录",
        "乗車して記録を保管",
        "승차 및 이용 기록 보관",
      ),
      d: l(
        "Match the train number, platform, carriage and seat to the confirmed booking. Keep the booking and document until the journey is complete. For a change, refund or missed train, consult current 12306 rules or a staffed counter; availability and fees vary.",
        "按已确认订单核对车次、站台、车厢和座位，行程结束前保留订单及证件。改签、退票或误车时，查询铁路现行规则或人工窗口，不保证有余票，费用也可能不同。",
        "確定予約と列車番号、ホーム、車両、席を照合し、旅行終了まで予約と書類を保管します。変更・返金・乗り遅れは現在の公式規則や有人窓口へ確認してください。空席と料金は異なります。",
        "확정 예약과 열차 번호, 승강장, 객차 및 좌석을 대조하고 이동이 끝날 때까지 예약과 서류를 보관하세요. 변경, 환불이나 놓친 열차는 현행 공식 규정이나 유인 창구에 문의하세요. 좌석과 수수료는 달라집니다.",
      ),
    },
  ],
  trouble: [
    {
      p: l(
        "Cannot verify or find a ticket",
        "无法核验或查到车票",
        "認証・切符の確認ができない",
        "인증 또는 승차권 확인 불가",
      ),
      a: l(
        "Check the passenger’s document number and spelling, booking account and ticket status. Ask 12306 or the issuing agency to check the record. Screenshots can help explain a problem but do not replace the required travel document.",
        "核对证件号码、拼写、购票账号和出票状态，联系铁路或出票代理核查。截图可协助说明问题，但不能代替所需证件。",
        "書類番号、綴り、購入アカウント、発券状態を確認し、鉄道か発券元へ照会します。画像は説明に使えても必要書類の代わりにはなりません。",
        "서류 번호, 철자, 예매 계정과 발권 상태를 확인하고 철도나 발권 업체에 문의하세요. 화면 캡처는 설명에 도움이 되지만 필수 서류를 대신하지 않습니다.",
      ),
    },
  ],
  planB: [],
  mistakes: [],
  tip: undefined,
  disclaimer: undefined,
  lastUpdated: "2026-10-28",
  sources: [
    {
      label: l(
        "China Railway passenger FAQ",
        "中国铁路旅客常见问题",
        "中国鉄道の旅客向け質問集",
        "중국철도 승객 자주 묻는 질문",
      ),
      url: "https://www.12306.cn/en/faq.html?item=1",
    },
  ],
};

guideRevisions.metro = {
  task: l(
    "Choose the right city, fare method and direction for a metro journey. Local operators set routes, hours and ticket rules.",
    "乘坐地铁前核对城市、支付方式与方向，线路、时刻及票务规则以当地运营方为准。",
    "地下鉄の都市・支払い方法・方向を確認します。経路、時刻、切符の規則は現地運営会社が定めます。",
    "지하철 도시, 결제 방식과 방향을 확인하세요. 경로, 시간 및 승차권 규칙은 현지 운영사가 정합니다.",
  ),
  before: [
    l(
      "The exact destination station and a route you can check",
      "准确的目的站名与可查看的路线",
      "正確な目的駅と確認できる経路",
      "정확한 목적역 및 확인할 경로",
    ),
    l(
      "A valid ticket, transit card or supported local ride code",
      "有效车票、交通卡或当地支持的乘车码",
      "有効な切符・交通カード・対応する乗車コード",
      "유효한 승차권·교통카드·지원 승차 코드",
    ),
  ],
  steps: [
    {
      t: l(
        "Find the station and plan the route",
        "找到车站并规划路线",
        "駅と経路を確認",
        "역 및 경로 확인",
      ),
      d: l(
        "Check the line, interchange stations, direction and last train with the operator’s map or station signs. Confirm the right entrance for your luggage or accessibility needs; elevators and gates differ by entrance.",
        "通过运营方线路图或现场标识核对线路、换乘站、方向与末班车。携行李或有无障碍需求时确认入口，电梯和闸机配置可能不同。",
        "運営会社の図や駅の案内で路線、乗換駅、方向、最終列車を確認します。荷物や移動支援の必要に合う入口を選び、入口ごとの設備の違いに注意してください。",
        "운영사 지도나 역 표지판으로 노선, 환승역, 방향과 막차를 확인하세요. 짐이나 접근성 요구에 맞는 입구를 선택하고 입구별 시설 차이에 유의하세요.",
      ),
    },
    {
      t: l(
        "Use a valid fare method",
        "使用有效乘车方式",
        "有効な支払い手段を使う",
        "유효한 승차 방식 사용",
      ),
      d: l(
        "Buy a ticket at a machine or service counter, or activate a supported metro ride code for the correct city. A retail payment code is not necessarily a metro code, and bus and metro codes may differ. Ask staff which methods are accepted.",
        "在售票机或人工窗口购票，或开通正确城市支持的地铁乘车码。商户付款码不一定是地铁码，公交和地铁码也可能不同。向站务人员确认支持方式。",
        "券売機・窓口で購入するか、正しい都市の対応乗車コードを有効にします。店舗の決済コードは地下鉄用とは限らず、バス用と異なる場合もあります。係員に確認してください。",
        "발매기나 창구에서 구매하거나 올바른 도시의 지원 지하철 코드를 활성화하세요. 가맹점 결제 코드는 지하철 코드와 다를 수 있고 버스 코드도 별개일 수 있습니다. 직원에게 확인하세요.",
      ),
    },
    {
      t: l(
        "Check the platform and stops",
        "核对站台与停靠站",
        "ホームと停車駅を確認",
        "승강장 및 정차역 확인",
      ),
      d: l(
        "Use platform signs to match the line’s direction and your next stop. Watch station names in the carriage as well as announcements. If unsure or travelling with large luggage, ask staff before boarding.",
        "按站台标识核对线路方向和目的站，结合车厢显示与广播留意站名。不确定或带大件行李时，上车前先向工作人员询问。",
        "ホームの案内で方向と目的駅を照合し、放送だけでなく車内表示も見てください。不明な点や大きな荷物があれば乗車前に係員へ相談します。",
        "승강장 안내로 방향과 목적역을 대조하고 방송뿐 아니라 차량 내 표시도 확인하세요. 불분명하거나 큰 짐이 있으면 승차 전에 직원에게 문의하세요.",
      ),
    },
    {
      t: l(
        "Exit using the same journey method",
        "用同一乘车介质完成出站",
        "同じ手段で出場",
        "같은 승차 수단으로 퇴장",
      ),
      d: l(
        "Keep your ticket or device until you exit and follow the operator’s process with the same fare method. Check the exit letter and street before leaving. A fare or gate problem should be handled at the service counter; do not enter a second journey to fix it.",
        "出站前保留票卡或设备，用同一乘车方式按规则出站，离站前核对出口编号与街道。票务或闸机问题到客服窗口处理，不要为解决问题再开启一段新行程。",
        "退出まで切符や端末を保ち、同じ手段で運営会社の手順に従います。出口と通りを確認し、料金や改札の問題は窓口で解決してください。別の乗車を開始して直そうとしないでください。",
        "퇴장까지 승차권이나 기기를 보관하고 같은 수단으로 운영사 절차를 따르세요. 출구와 거리를 확인하고 요금이나 개찰구 문제는 창구에서 해결하세요. 문제 해결을 위해 새 승차를 시작하지 마세요.",
      ),
    },
  ],
  trouble: [
    {
      p: l(
        "Wrong direction or gate will not open",
        "坐错方向或闸机未打开",
        "方向間違い・改札が開かない",
        "방향 오류 또는 개찰구 열리지 않음",
      ),
      a: l(
        "For a wrong direction, follow station signs or ask staff about a safe transfer. For an incomplete journey or unreadable ticket, go to the service counter with the ticket or device. Do not assume all cities use the same fare rules.",
        "方向错误时按站内标识或请工作人员指导换乘。行程未闭环或票卡无法读取时，携票卡或设备到客服窗口，不要假定所有城市票制相同。",
        "方向を間違えたら案内や係員に従って乗り換えます。未完了の乗車や読めない切符は窓口へ持参し、全都市で同じ規則とは考えないでください。",
        "방향이 틀리면 역 안내나 직원 지시에 따라 환승하세요. 미완료 승차나 읽히지 않는 승차권은 기기와 함께 창구에 가져가세요. 모든 도시의 요금 규칙이 같다고 가정하지 마세요.",
      ),
    },
  ],
  planB: [],
  mistakes: [],
  tip: undefined,
  disclaimer: undefined,
  lastUpdated: "2026-10-28",
  sources: [
    {
      label: l(
        "Official transport-service guidance",
        "官方交通服务指南",
        "公式の交通サービス案内",
        "공식 교통 서비스 안내",
      ),
      url: payment,
    },
  ],
};

guideRevisions.food = {
  task: l(
    "Order to the correct delivery point, check food requirements and follow the order through the official platform.",
    "核对配送位置与餐品需求，通过正规平台下单并跟进订单。",
    "正しい受取場所と食事の要望を確認し、正規サービスで注文を管理します。",
    "정확한 수령 장소와 음식 요구를 확인하고 정식 플랫폼에서 주문을 관리하세요.",
  ),
  before: [
    l(
      "A confirmed Chinese address and an agreed delivery point",
      "已确认的中文地址与约定交付点",
      "確認済みの中国語住所と受取場所",
      "확인된 중국어 주소 및 합의된 수령 장소",
    ),
    l(
      "A working contact method and supported payment",
      "可用联系方式和支付方式",
      "使える連絡手段と支払い方法",
      "사용 가능한 연락 및 결제 수단",
    ),
  ],
  steps: [
    {
      t: l(
        "Confirm the service and delivery location",
        "确认服务范围与配送位置",
        "対応範囲と配送先を確認",
        "서비스 범위 및 배송 위치 확인",
      ),
      d: l(
        "Use an official delivery platform or a service listed in your payment app. Availability and language options vary. Enter the hotel or venue’s full Chinese address and ask reception about the lobby or pickup shelf. Share only details needed for delivery.",
        "使用正规配送平台或支付应用内提供的服务，支持范围和语言可能不同。填写酒店或场所的完整中文地址，向前台确认大堂或取餐架位置，只填写配送必需的信息。",
        "正規の配送サービスか決済アプリ内のサービスを使います。対応地域と言語は異なります。施設の正確な中国語住所を入力し、フロントへ受取場所を確認して必要な情報だけ共有します。",
        "공식 배달 플랫폼이나 결제 앱의 서비스를 이용하세요. 지원 지역과 언어는 다를 수 있습니다. 정확한 중국어 주소를 입력하고 프런트에 수령 장소를 확인하며 배송에 필요한 정보만 공유하세요.",
      ),
    },
    {
      t: l(
        "Check the restaurant and food requirements",
        "核对商家与餐品要求",
        "店と食事の要望を確認",
        "음식점 및 음식 요구 확인",
      ),
      d: l(
        "Check opening status, delivery estimate, minimum order and food descriptions. Use a verified Chinese phrase for dietary needs. For an allergy, confirm ingredients and cross-contact risks with the merchant; an order note or machine translation is not a guarantee.",
        "核对营业状态、预计送达时间、起送条件和餐品说明。饮食需求使用核实过的中文。存在过敏时直接向商家确认成分及交叉接触风险，订单备注或机器翻译不能作保证。",
        "営業状況、配達予定、最低注文、料理説明を確認し、食事の要望は確認済みの中国語で伝えます。アレルギーは原材料と交差接触を店舗に確認してください。注文メモや機械翻訳は保証にはなりません。",
        "영업 상태, 예상 도착, 최소 주문과 음식 설명을 확인하고 식사 요구는 확인된 중국어로 전달하세요. 알레르기는 재료와 교차 접촉 위험을 상점에 확인하세요. 주문 메모나 기계 번역은 보장이 아닙니다.",
      ),
    },
    {
      t: l(
        "Review the final order and pay once",
        "核对最终订单并付款一次",
        "最終注文と支払いを確認",
        "최종 주문 확인 및 한 번 결제",
      ),
      d: l(
        "Review items, quantities, address, contact method and the total including delivery fees before paying. Confirm the order is accepted. Follow the platform’s payment flow and check existing payment status before paying anyone separately.",
        "付款前核对餐品、数量、地址、联系方式及含配送费的总额，确认商家已接单。按平台流程付款，另行支付前先检查是否已付，避免重复付款。",
        "支払い前に品目、数量、住所、連絡先、配達料を含む合計を確認し、受注を確認します。正規の決済手順を使い、別途払う前に支払い済みか確認してください。",
        "결제 전에 메뉴, 수량, 주소, 연락처와 배달료 포함 총액을 확인하고 주문 수락을 확인하세요. 플랫폼 결제 절차를 따르고 별도로 내기 전에 기존 결제 상태를 확인하세요.",
      ),
    },
    {
      t: l(
        "Follow delivery and use order support",
        "跟进配送并使用订单客服",
        "配送と注文窓口を確認",
        "배달 확인 및 주문 고객 지원 이용",
      ),
      d: l(
        "Watch for in-app messages or calls and meet at the agreed point. If food is missing, wrong or damaged, keep evidence and contact the merchant or platform through that order. Use the displayed refund process rather than assuming every problem has an instant refund.",
        "留意应用消息和电话，在约定位置取餐。未送达、错送或损坏时保留证据，通过对应订单联系商家或平台。按页面退款流程处理，不要假定任何问题都可立即退款。",
        "メッセージや電話を確認し、合意した場所で受け取ります。未着、誤配、破損は証拠を残して該当注文から店舗か窓口へ連絡し、表示される返金手順に従ってください。",
        "메시지나 전화를 확인하고 정한 장소에서 받으세요. 미도착, 오배송이나 파손은 증거를 남겨 해당 주문에서 상점이나 플랫폼에 문의하고 표시된 환불 절차를 따르세요.",
      ),
    },
  ],
  trouble: [
    {
      p: l(
        "Cannot communicate or complete delivery",
        "沟通或交付有困难",
        "連絡・受取が難しい",
        "연락 또는 수령이 어려움",
      ),
      a: l(
        "Send a short message in the order, show the help card or ask hotel reception to assist. For an unavailable service, use a nearby restaurant or another supported provider. Do not share passwords or verification codes with a rider.",
        "在订单内发送简短消息、出示求助卡或请前台协助。服务不可用时，可考虑附近餐厅或其他受支持服务。不要向骑手提供密码或验证码。",
        "注文内で短いメッセージを送り、カードやフロントの助けを使います。サービス非対応なら近くの店などを検討し、配達員にパスワードや認証コードを渡さないでください。",
        "주문에서 짧은 메시지를 보내거나 도움 카드와 프런트 지원을 이용하세요. 서비스가 안 되면 근처 식당 등을 이용하고 배달원에게 비밀번호나 인증 코드를 주지 마세요.",
      ),
    },
  ],
  planB: [],
  mistakes: [],
  tip: undefined,
  disclaimer: undefined,
  lastUpdated: "2026-10-28",
  sources: [
    {
      label: l(
        "Meituan official service",
        "美团官方服务",
        "Meituan公式サービス",
        "Meituan 공식 서비스",
      ),
      url: "https://www.meituan.com/",
    },
  ],
};

guideRevisions.sim = {
  task: l(
    "Choose a connection that suits your phone, required number and message access. Confirm the operator’s current terms instead of assuming every travel data plan includes local calls or SMS.",
    "按手机兼容性、号码和短信需求选择通信方式，不要假定所有旅行流量套餐都含本地通话或短信。",
    "端末、電話番号、短信の必要に合う接続を選びます。旅行用データ契約に現地通話や短信が必ず含まれるとは限りません。",
    "기기, 번호와 문자 요구에 맞는 연결을 선택하세요. 여행용 데이터 요금제에 현지 통화나 문자가 항상 포함된다고 가정하지 마세요.",
  ),
  before: [
    l(
      "A compatible phone and the identity document required by the operator",
      "兼容手机及运营商要求的身份证件",
      "対応端末と通信会社が求める身分証",
      "호환 기기 및 통신사가 요구하는 신분증",
    ),
    l(
      "A plan for keeping important bank verification messages accessible",
      "保留重要银行验证短信接收能力的方案",
      "銀行など重要な認証メッセージを受け取る方法",
      "중요한 은행 인증 문자를 받을 방법",
    ),
  ],
  steps: [
    {
      t: l(
        "Decide what you actually need",
        "先确认实际需求",
        "必要な機能を決める",
        "실제 필요한 기능 결정",
      ),
      d: l(
        "Compare home-carrier roaming, a compatible travel data plan and a local SIM. Check device support and locks, coverage, whether a Chinese number is included, and call or message support. A data-only plan may not receive verification messages.",
        "比较原运营商漫游、兼容的旅行数据套餐与本地电话卡。核对设备支持、锁机情况、覆盖范围、是否含中国号码及通话短信。纯流量套餐可能收不到验证短信。",
        "自国のローミング、対応する旅行用データ、現地の通信契約を比較します。端末対応と制限、地域、中国番号、通話・短信を確認してください。データ専用では認証メッセージを受け取れない場合があります。",
        "기존 통신사 로밍, 호환 여행 데이터 및 현지 유심을 비교하세요. 기기 지원과 잠금, 지역, 중국 번호 포함 여부 및 통화·문자를 확인하세요. 데이터 전용은 인증 문자를 받지 못할 수 있습니다.",
      ),
    },
    {
      t: l(
        "Use official channels and complete registration",
        "通过正规渠道实名办理",
        "正規窓口で登録",
        "공식 창구에서 등록",
      ),
      d: l(
        "For local service, take your passport or another accepted document to an official China Mobile, China Unicom or China Telecom outlet. Follow identity-registration requirements. For a travel plan, use the provider’s official setup and check compatibility before purchase.",
        "办理本地服务时，携护照或其他认可证件前往中国移动、中国联通或中国电信正规营业厅，按要求实名登记。旅行套餐按服务商官方步骤设置，购买前核实兼容性。",
        "現地契約はパスポートなど認められる書類を持って正規通信会社の窓口へ行き、本人登録に従います。旅行用契約は公式設定を使い、購入前に端末対応を確認してください。",
        "현지 서비스는 여권 등 인정되는 서류를 지참해 중국이동, 중국연통 또는 중국전신 공식 영업점에서 본인 등록하세요. 여행 요금제는 공식 설정을 따르고 구매 전에 호환성을 확인하세요.",
      ),
    },
    {
      t: l(
        "Read the price, allowance and expiry",
        "看清价格、用量和有效期",
        "料金・容量・有効期間を確認",
        "가격·사용량·유효기간 확인",
      ),
      d: l(
        "Confirm the total cost, data limit, calls, messages, renewal or expiry rules and how to top up or cancel. Ask which services are reachable; network access can differ from home. Do not assume airport and city plans are identical or that every overseas app will work.",
        "确认总价、流量、通话、短信、续费或到期规则，以及充值和取消方式。询问所需服务是否可达，不要假定机场与市区套餐相同，也不要假定所有海外应用都能使用。",
        "総額、通信量、通話・短信、更新と期限、追加や解約方法を確認します。必要なサービスが使えるか尋ね、空港と市内の契約や海外アプリの利用を同じと考えないでください。",
        "총액, 데이터, 통화·문자, 갱신과 만료, 충전 및 해지 방법을 확인하세요. 필요한 서비스 접속을 문의하고 공항과 시내 요금제나 해외 앱 사용이 같다고 가정하지 마세요.",
      ),
    },
    {
      t: l(
        "Test before relying on the connection",
        "正式依赖前先测试",
        "利用前に動作確認",
        "사용 전에 작동 확인",
      ),
      d: l(
        "Test data, and calls or messages if included, before leaving the counter. Keep support details and an alternative contact method. Retain access to your home number if your bank uses it; check roaming charges with that carrier.",
        "离开柜台前测试流量以及套餐包含的通话或短信，保留客服信息和备用联络方式。银行仍使用原号码时保持其接收能力，并向原运营商核实漫游费用。",
        "窓口を出る前に通信と、契約に含む通話・短信を試し、窓口情報と別の連絡手段を残します。銀行が自国番号を使うなら受信を維持し、料金はその通信会社へ確認してください。",
        "창구를 떠나기 전에 데이터와 포함된 통화·문자를 시험하고 고객 지원 정보 및 대체 연락 수단을 보관하세요. 은행이 기존 번호를 쓰면 수신을 유지하고 로밍 요금은 해당 통신사에 확인하세요.",
      ),
    },
  ],
  trouble: [
    {
      p: l(
        "No data, message or remaining allowance",
        "无法联网、收短信或额度不足",
        "通信・短信・残量の問題",
        "데이터·문자·잔여량 문제",
      ),
      a: l(
        "Check the selected SIM, remaining allowance and operator setup instructions. Data-only plans do not add SMS by changing a setting. Contact the official operator before buying another package or entering settings from an unknown source.",
        "核对所选电话卡、剩余额度和运营商设置指引。纯流量套餐不能靠修改设置增加短信功能。购买新套餐或输入陌生来源设置前，先联系官方客服。",
        "選択した回線、残量、公式設定を確認します。データ専用契約は設定変更で短信を追加できません。不明な設定や新規購入の前に公式窓口へ相談してください。",
        "선택한 회선, 잔여량과 공식 설정을 확인하세요. 데이터 전용 요금제는 설정 변경으로 문자를 추가할 수 없습니다. 새 구매나 불명확한 설정 전에 공식 고객 지원에 문의하세요.",
      ),
    },
  ],
  planB: [],
  mistakes: [],
  tip: undefined,
  disclaimer: undefined,
  lastUpdated: "2026-10-28",
  sources: [
    {
      label: l(
        "Official mobile-service guidance",
        "官方移动通信服务指南",
        "公式の携帯通信案内",
        "공식 이동통신 안내",
      ),
      url: payment,
    },
  ],
};

export const preparationBodies = {
  documents: l(
    "Check the passport and permission requirements for your own nationality, route and travel purpose with official authorities and the airline. Carry required originals and keep secure backup copies; a photo does not replace a passport.",
    "向官方机构及航空公司核实适用于自己国籍、路线和目的的护照与许可要求。携带所需原件，安全保存备份；照片不能代替护照。",
    "国籍・経路・目的に合う書類と許可を公式当局や航空会社に確認します。必要な原本を持ち安全な控えを残してください。写真はパスポートの代わりになりません。",
    "국적, 경로와 목적에 맞는 서류 및 허가를 공식 당국과 항공사에 확인하세요. 필요한 원본과 안전한 사본을 준비하세요. 사진은 여권을 대신하지 않습니다.",
  ),
  connectivity: l(
    "Check phone compatibility, roaming cost and whether you need a local number or SMS. Prepare a supported connection and a backup contact method; your usual online services may not be reachable on every network.",
    "确认手机兼容性、漫游费用，以及是否需要本地号码或短信。准备受支持的通信方式和备用联系渠道，常用在线服务不一定在所有网络上可用。",
    "端末対応、ローミング料金、現地番号や短信の必要を確認し、接続と予備の連絡手段を準備します。普段のサービスがすべての回線で使えるとは限りません。",
    "기기 호환성, 로밍 요금과 현지 번호 또는 문자 필요 여부를 확인하고 연결 및 대체 연락 수단을 준비하세요. 평소 서비스가 모든 회선에서 작동하는 것은 아닙니다.",
  ),
  payment: l(
    "Set up a supported payment app and your own card before travel when possible. Follow the actual verification prompts; timing varies. Keep another usable method, such as RMB cash, and check card acceptance and fees.",
    "尽可能提前设置支付应用并绑定本人的银行卡。按实际提示验证，处理时间可能不同。保留人民币现金等其他可用方式，核对受理范围及费用。",
    "可能なら渡航前に対応アプリと本人名義カードを設定します。認証と所要時間は実際の案内に従い、人民元の現金など別の手段と手数料を確認してください。",
    "가능하면 출발 전에 지원 앱과 본인 명의 카드를 설정하세요. 실제 인증 안내를 따르고 소요 시간은 다를 수 있습니다. 위안화 현금 등 다른 수단과 수수료를 확인하세요.",
  ),
  address: l(
    "Save the full Chinese name and address of each accommodation from a reliable confirmation. Confirm the entrance and reception contact. Use an address card to show it without sharing private room or payment details.",
    "从可信确认单保存每处住址的完整中文名称和地址，核对入口及前台联系方式。出示地址卡时不要包含私人房间或支付信息。",
    "信頼できる確認書から宿泊先の中国語正式名と住所を保存し、入口と連絡先を確認します。カードに私的な部屋番号や決済情報を含めないでください。",
    "신뢰할 수 있는 확인서에서 숙소의 전체 중국어 이름과 주소를 저장하고 입구 및 프런트 연락처를 확인하세요. 주소 카드에는 사적인 객실 번호나 결제 정보를 넣지 마세요.",
  ),
  maps: l(
    "Save the exact hotel, airport and station. If your map supports offline areas, download them before departure and check that they open without internet. Language coverage and route availability vary by service.",
    "保存准确的酒店、机场和车站。地图支持离线区域时，出发前下载并断网试开。服务支持的语言及路线可用性可能不同。",
    "正確な宿泊先・空港・駅を保存します。地図が地域保存に対応すれば出発前に取得し、通信なしで開けるか確認します。言語や経路の対応はサービスで異なります。",
    "정확한 호텔, 공항과 역을 저장하세요. 지도가 오프라인 지역 저장을 지원하면 출발 전에 받고 인터넷 없이 열리는지 확인하세요. 지원 언어와 경로는 서비스별로 다릅니다.",
  ),
};
export const faqRevisions = [
  {
    q: l(
      "My payment was rejected. What should I check?",
      "付款被拒，先检查什么？",
      "支払い拒否で最初に確認することは？",
      "결제가 거절되면 무엇부터 확인하나요?",
    ),
    a: l(
      "Read the actual error, confirm transaction status and check verification, limits and issuer restrictions. Use the payment guide’s single troubleshooting section; ask the merchant about a supported backup before paying again.",
      "先读具体错误并确认交易状态，检查认证、限额及发卡行限制。按支付指南中的统一问题区排查，再次付款前向商户确认备用方式。",
      "エラーと取引状態、認証・上限・発行会社の制限を確認します。支払いガイドの問題解決欄を使い、再度払う前に代替手段を店へ確認してください。",
      "실제 오류와 거래 상태, 인증·한도·발급사 제한을 확인하세요. 결제 안내의 통합 해결 항목을 이용하고 다시 내기 전에 가맹점에 대안을 확인하세요.",
    ),
  },
  {
    q: l(
      "Do I always need a Chinese phone number?",
      "一定需要中国手机号吗？",
      "中国の電話番号は必須ですか？",
      "중국 전화번호가 꼭 필요한가요?",
    ),
    a: l(
      "Not for every service. Accepted numbers and verification methods depend on the provider and account flow. Keep access to the number registered with your bank; a data-only travel plan may not receive SMS.",
      "并非所有服务都需要。可用号码和验证方式取决于服务商及账号流程。保留银行登记号码的接收能力，纯流量旅行套餐可能无法收短信。",
      "すべてのサービスで必須ではありません。番号と認証方法は提供元の手順によります。銀行登録番号を受信可能に保ち、データ専用契約に短信がない場合に注意してください。",
      "모든 서비스에 필요한 것은 아닙니다. 지원 번호와 인증은 제공업체 절차에 따라 다릅니다. 은행 등록 번호로 수신할 수 있게 하고 데이터 전용의 문자 미지원에 유의하세요.",
    ),
  },
  {
    q: l(
      "Can I travel by train with my passport?",
      "可以用护照乘火车吗？",
      "パスポートで鉄道に乗れますか？",
      "여권으로 기차를 탈 수 있나요?",
    ),
    a: l(
      "Use an accepted valid passport and matching passenger details to book. Bring that same original document. If a gate cannot read it, ask staff for assistance. Check the ticket status and exact station first.",
      "用受认可的有效护照及一致乘车人信息购票，并携带同一证件原件。闸机不能识别时请工作人员协助，先确认出票状态及准确站名。",
      "認められる有効なパスポートで情報を一致させて購入し、同じ原本を持参します。改札で読めなければ係員へ。発券状況と正確な駅名も確認してください。",
      "인정되는 유효한 여권과 일치하는 승객 정보로 예매하고 같은 원본을 지참하세요. 읽히지 않으면 직원에게 문의하고 발권 상태와 정확한 역을 확인하세요.",
    ),
  },
  {
    q: l(
      "Why does a linked foreign card not work everywhere?",
      "为什么绑定境外卡后仍有场景不能用？",
      "海外カード登録後も使えない場面があるのはなぜ？",
      "해외 카드를 등록해도 일부 거래가 안 되는 이유는 무엇인가요?",
    ),
    a: l(
      "Card support varies by merchant, transaction type and provider rules. Purchases and personal transfers are different. Check the displayed payment options and use a supported alternative rather than assuming every QR code accepts your card.",
      "银行卡支持情况取决于商户、交易类型和平台规则，购物付款与个人转账不同。查看当前可选渠道，不要假定每个收款码都支持你的银行卡。",
      "対応は店舗、取引の種類、提供元の規則で異なり、購入と個人送金は別です。表示される方法を確認し、すべてのコードで使えると思わず代替手段を選んでください。",
      "지원 여부는 가맹점, 거래 종류와 제공업체 규칙에 따라 다르며 구매와 개인 송금은 별개입니다. 표시되는 수단을 확인하고 모든 코드가 카드를 받는다고 가정하지 마세요.",
    ),
  },
  {
    q: l(
      "How do I contact a real support agent?",
      "怎样联系人工客服？",
      "担当者にはどう連絡しますか？",
      "상담원에게 어떻게 연락하나요?",
    ),
    a: l(
      "Use the service’s official help area or the support option inside the relevant order. Language and hours vary. Keep the order reference, but never send a password, full card details or verification code to a stranger.",
      "通过服务官方帮助入口或对应订单内的客服选项联系，语言及服务时间可能不同。保留订单编号，不要向陌生人发送密码、完整银行卡信息或验证码。",
      "公式ヘルプか該当注文の窓口を使います。言語と受付時間は異なります。注文番号を保管し、知らない相手にパスワード・カード情報全体・認証コードを渡さないでください。",
      "공식 도움말이나 해당 주문의 고객 지원을 이용하세요. 지원 언어와 시간은 다릅니다. 주문 번호를 보관하되 낯선 사람에게 비밀번호, 전체 카드 정보나 인증 코드를 주지 마세요.",
    ),
  },
  {
    q: l(
      "I left something in a taxi. What should I do?",
      "物品遗留在出租车上怎么办？",
      "タクシーに忘れ物をしたら？",
      "택시에 물건을 두고 내렸다면 어떻게 하나요?",
    ),
    a: l(
      "Keep the receipt or trip record. For an app booking, use that order’s driver-contact or lost-property support. For a street taxi, contact the taxi operator using the receipt. For an urgent crime or safety issue, use the appropriate emergency service.",
      "保留发票或行程记录。网约车通过对应订单联系司机或遗失物品客服；巡游出租车按发票信息联系运营企业。涉及紧急犯罪或安全问题时，使用相应紧急服务。",
      "領収書や履歴を保存し、配車は該当注文の運転手連絡や忘れ物窓口へ。流しの車は領収書の会社へ連絡します。緊急の犯罪・安全問題は緊急窓口を使ってください。",
      "영수증이나 이용 내역을 보관하세요. 호출 차량은 해당 주문의 기사 연락이나 분실물 지원을 이용하고 일반 택시는 영수증의 회사에 연락하세요. 긴급 범죄나 안전 문제는 긴급 기관을 이용하세요.",
    ),
  },
  {
    q: l(
      "Why are my usual apps not connecting?",
      "为什么常用应用无法连接？",
      "普段のアプリにつながらないのはなぜ？",
      "평소 앱에 연결되지 않는 이유는 무엇인가요?",
    ),
    a: l(
      "Availability can differ by network, service and current rules. Check connectivity with the operator, prepare supported tools before travel and keep offline copies of essentials. ChinaBuddy does not configure network access tools for you.",
      "可用性会因网络、服务和现行规定而异。向运营商核实，出发前准备可用工具并保存必要离线资料。ChinaBuddy 不会代为配置网络接入工具。",
      "利用可否は回線・サービス・現行規則で異なります。通信会社へ確認し、渡航前に使える手段と必要な控えを準備してください。ChinaBuddyは接続ツールを設定しません。",
      "사용 가능 여부는 회선, 서비스와 현행 규칙에 따라 다릅니다. 통신사에 확인하고 출발 전에 지원 도구와 필수 오프라인 자료를 준비하세요. ChinaBuddy는 네트워크 접속 도구를 대신 설정하지 않습니다.",
    ),
  },
];
