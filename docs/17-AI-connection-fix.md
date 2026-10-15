# AI 连接修复（2026-10-15）

## 原因与变更

1. Web 平台的 `expo/fetch` 直接导出浏览器 `globalThis.fetch`。调用 `options.fetcher(...)` 把配置对象作为 receiver，浏览器会在真正发出请求前拒绝调用。提取局部函数后独立调用，修复原生 fetch 的调用上下文。
2. DeepSeek 真实鉴权与模型列表接口返回 HTTP 200，并列出 `deepseek-flash`。生成请求也能返回 HTTP 200，但本次存在持续保活等待；短时间内未收到完整回答。因此不能把生成排队和连接鉴权混为一谈。
3. DeepSeek 的 Test connection 改为 GET `/models`，检查鉴权与所选模型是否存在，不生成回答；界面明确展示“Key 和模型列表验证成功，生成回答仍可能等待”。其他服务商仍进行短生成测试，最长等待时间与聊天一致为 120 秒。
4. 聊天继续调用真实流式生成接口，保持取消、超时、错误提示和内容上下文；没有用预设文本冒充模型回复，也没有自动重试造成额外请求。

## 验证与隐私

- TypeScript、Lint、20 项测试通过，包括 fetch receiver 回归测试，以及模型列表成功、错误 Key、无权限、限流和模型不存在的处理。
- 在浏览器中用用户授权的 Key 复现原来的即时失败；修复后可以实际发送请求。
- 真实模型列表请求成功；本次未把流式 HTTP 200 或保活注释当成生成回答成功。
- Key 仅通过 HTTPS Authorization 请求头发送给用户选择的 DeepSeek 接口；未写入源代码、文档、测试、构建产物或 Git。测试文件仅使用虚拟 Key。
- API 配置继续只在内存中存在；刷新、关闭及断开会清空。

参考：[DeepSeek 模型接口](https://api-docs.deepseek.com/api/list-models)、[保活与等待机制](https://api-docs.deepseek.com/quick_start/rate_limit/)。
