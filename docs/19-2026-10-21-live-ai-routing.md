# 2026-10-21：真实 AI 跳转验证与返回修复

## 测试方式与结果

- 在本地 iPhone 布局演示页面使用官方 DeepSeek 服务、`deepseek-flash` 和用户临时提供的密钥，实际生成回复并点击回复内按钮。
- 使用已有本地 Pro 演示账户，覆盖导航目录全部 **36 个入口：36/36 通过**。
- 紧急帮助使用自然语言问题验证；其余入口通过正常问题及指定每批三个目标的覆盖提示验证。验证实际页面路径、查询参数和页面存在性，没有用假响应替代模型输出。
- 仅打开目标页面；没有拨打紧急电话、发布帖子或购买会员。
- 其他服务商没有使用本次 DeepSeek 密钥进行调用；本记录不代表 Qwen、OpenAI 的真实凭证测试。

| 入口 | 实际目标 | 结果 |
| --- | --- | --- |
| Home | `/` | 通过 |
| Transport | `/transport` | 通过 |
| Guides | `/guides` | 通过 |
| Community | `/community` | 通过 |
| Help nearby | `/community?filter=help` | 通过 |
| Editor's picks | `/community?filter=featured` | 通过 |
| Chinese help cards | `/cards` | 通过 |
| AI companion | `/chat` | 通过 |
| Me | `/settings` | 通过 |
| Preferences & privacy | `/preferences` | 通过 |
| Share a story | `/create-post` | 通过 |
| Sign in | `/login` | 通过 |
| Create account | `/register` | 通过 |
| Upgrade membership | `/upgrade` | 通过 |
| Emergency help | `/emergency` | 通过 |
| Arrival ports | `/ports` | 通过 |
| Your arrival route | `/arrival` | 通过 |
| Before you go | `/preparation` | 通过 |
| My address card | `/address` | 通过 |
| Airports & stations | `/city` | 通过 |
| My trip | `/trip` | 通过 |
| Common questions | `/faq` | 通过 |
| Connect a model | `/ai-config` | 通过 |
| AI context & privacy | `/context` | 通过 |
| Create a help card | `/write-card` | 通过 |
| Customs & Entry | `/guide/customs` | 通过 |
| Taxi | `/guide/taxi` | 通过 |
| Train | `/guide/train` | 通过 |
| Metro | `/guide/metro` | 通过 |
| Pay | `/guide/pay` | 通过 |
| Hotel | `/guide/hotel` | 通过 |
| Food | `/guide/food` | 通过 |
| SIM | `/guide/sim` | 通过 |
| Emergency | `/guide/emergency` | 通过 |
| Check entry documents | `/guide/entry-check` | 通过 |
| Make your phone offline-ready | `/guide/offline-ready` | 通过 |

## 修复

1. 直接打开页面或刷新后，导航栈可能没有上一页。统一通过 `backOrReplace` 检查历史，有历史时返回，否则替换为对应安全入口。覆盖配置连接/断开、登录返回、行程完成、地址保存、口岸选择、卡片与通用返回按钮，避免未处理的 `GO_BACK`。
2. 长聊天进入指南再返回时，虚拟列表可能重新从最早的消息渲染，最新按钮因此不可见。改用倒置列表与倒序数据，让最新回复属于初始渲染批次，并在重新聚焦、布局完成时定位最近回复。实际重新点击 Hotel → Food → SIM 均通过。

## 密钥处理

- 测试密钥仅通过页面输入，保留于当前运行内存；未写入源码、配置、报告或构建参数。
- 测试后执行 Disconnect & clear chat，页面恢复 Preset examples。
- 重新打开配置页并刷新，检查 API key 输入框长度为 **0**。
- 持久化偏好使用白名单，不包含 API 配置或聊天内容。页面关闭/刷新、原生应用进入后台、主动断开均清除会话。

## 自动检查

- TypeScript、ESLint 通过。
- 单元测试 **28/28** 通过，包含新增的有历史返回与无历史替换测试，以及现有导航标记、可信目标和密钥持久化隔离测试。
- iOS/Android JS 导出通过；本轮交互测试在浏览器演示中进行，未声称原生设备运行验证。
