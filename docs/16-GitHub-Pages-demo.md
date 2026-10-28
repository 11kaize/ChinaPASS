# ChinaBuddy GitHub Pages 演示集成（2026-10-15）

## 入口与发布

- 仓库首页 `/ChinaPASS/` → `/ChinaPASS/demo/` → 新版 `/ChinaPASS/demo/app/`。
- 新版直接复用 `mobile/src/` 的 Expo / React Native 应用：Today、Guides、Cards、AI、Settings 五个导航页面，以及口岸、落地流程、行前准备、FAQ、城市、地址卡、自定义卡、紧急帮助和 AI 设置。
- 原版保留在 `/ChinaPASS/demo/legacy.html`，新版桌面说明和 Settings 中提供入口。原版的浏览器城市检测、离线短语相似排序、PWA 安装仍可使用；新版采用手动城市选择。Electron 继续加载原版本地入口。
- 编辑内容仍在 `demo/data.js`、`scene-i18n.js`、`explore.js`、`phrases.js`。`npm run demo:build` 同步这些内容，再导出新版静态页面至 `demo/app/`。发布产物和源代码一起提交，现有 main 分支 Pages 部署直接发布，无需更改仓库设置。
- 构建时才设置 `/ChinaPASS/demo/app` baseUrl；本地 Expo 开发和 iOS/Android 不受该路径影响。所有 11 个指南生成独立静态路由，并转换为目录 `index.html`，支持直接打开和刷新。根目录 `.nojekyll` 保留 `_expo` 资源。
- 原版 service worker 更新缓存版本，缓存 `legacy.html`，不拦截新版应用资源或任何模型请求。原版 manifest 启动路径更新至 legacy.html。

## 内容核对

| 内容 | 新版数量 / 行为 |
| --- | --- |
| 任务场景 / 补充指南 | 9 / 2 |
| 内置中文帮助卡 / 离线短语 | 96 / 207 |
| 入境口岸 / 城市资料 | 15 / 8 |
| 行前准备 / FAQ | 7 / 7 |
| 服务跳转 | 21 个场景服务入口，保留官网、英文友好、中文界面、拨号标记 |
| 卡片 | 列表英文主要文字；展开后中文大字；收藏、排序、模板、自定义、地址卡 |
| 落地路线 | 当前任务与已完成步骤分别维护；铁路/海港不伪装机场流程 |
| AI | DeepSeek、Qwen、OpenAI 配置；可编辑模型与 HTTPS 地址；项目内容与可选使用环境上下文；预设示例、流式回答、取消及错误处理 |
| 展示偏好 | 四种界面语言、浅色/深色、减少动画与透明效果兼容 |

## API Key 生命周期

Key、API 配置与对话仅在 React 状态中；持久化偏好使用明确白名单，包含显示偏好和用户保存的卡片，排除所有 API 字段。刷新重新创建空配置；`pagehide`、缓存恢复 `pageshow` 和应用后台事件均使会话失效。配置草稿和聊天组件随着会话失效重建，进行中的请求取消。没有 Key 写入 localStorage、sessionStorage、数据库或服务端。

验证使用占位值 `demo-session-not-real`，仅点击本机“Connect for this session”，没有调用 Test connection 或发送模型请求。连接后 Disconnect 按钮出现；刷新后 Key 为空、同意开关关闭、连接按钮禁用、Disconnect 消失。普通偏好和用户主动保存的卡片允许保留。

## 检查记录

- TypeScript、Expo Lint、18 项测试通过。
- 发布版导出 37 个 HTML 页面；全部 HTML 中带部署前缀的资源路径对应实际文件。
- 11 个指南均有独立目录 index.html，包含 customs、sim、pay、taxi、hotel、metro、train、food、emergency、entry-check、offline-ready。
- 实际浏览器刷新 API 配置页，确认会话及 Key 清空。

GitHub Pages 是交互展示；不是 Apple iOS 模拟器。真实模型回答需要用户自行提供有效 Key，供应商账户、网络与浏览器跨域权限仍由供应商控制。本次没有真实 Key，不宣称完成供应商在线调用验证。原生 Expo Go 使用同一套聊天实现。

参考：[Expo 发布与 baseUrl](https://docs.expo.dev/guides/publishing-websites/)、[静态路由生成](https://docs.expo.dev/router/web/static-rendering/)。
