import type { Language } from "../content";
import { APIConfig, providers, validateConfig } from "./providers";
export type ChatTurn = { role: "user" | "assistant"; content: string };
export class AIError extends Error {
  constructor(
    public kind:
      | "auth"
      | "access"
      | "model"
      | "limit"
      | "network"
      | "timeout"
      | "empty"
      | "server"
      | "stream"
      | "cancelled"
      | "invalid",
    public status?: number,
  ) {
    super(kind);
  }
}
export function makeRequest(
  config: APIConfig,
  instructions: string,
  messages: ChatTurn[],
) {
  if (validateConfig(config)) throw new AIError("invalid");
  const responses = providers[config.provider].protocol === "responses";
  // Explicit stateless API mode. No Conversations API, previous_response_id or stored response.
  const body = responses
    ? {
        model: config.model.trim(),
        instructions,
        input: messages.slice(-16),
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        max_output_tokens: 6000,
      }
    : {
        model: config.model.trim(),
        messages: [
          { role: "system", content: instructions },
          ...messages.slice(-16),
        ],
        stream: true,
        max_tokens: 4096,
        ...(config.provider === "deepseek"
          ? { thinking: { type: "disabled" } }
          : { enable_thinking: false }),
      };
  return {
    url: `${config.baseURL.trim().replace(/\/+$/, "")}/${responses ? "responses" : "chat/completions"}`,
    body,
  };
}
export class SSEParser {
  private pending = "";
  private data: string[] = [];
  private event = "";
  constructor(private emit: (data: string, event: string) => void) {}
  push(chunk: string) {
    this.pending += chunk;
    let end: number;
    while ((end = this.pending.indexOf("\n")) >= 0) {
      const line = this.pending.slice(0, end).replace(/\r$/, "");
      this.pending = this.pending.slice(end + 1);
      this.line(line);
    }
  }
  private line(line: string) {
    if (!line) {
      if (this.data.length) this.emit(this.data.join("\n"), this.event);
      this.data = [];
      this.event = "";
      return;
    }
    if (line.startsWith("data:"))
      this.data.push(line.slice(5).replace(/^ /, ""));
    else if (line.startsWith("event:")) this.event = line.slice(6).trim();
  }
  finish() {
    if (this.pending) this.line(this.pending.replace(/\r$/, ""));
    this.line("");
    this.pending = "";
  }
}
type FetchFn = typeof globalThis.fetch;
// DeepSeek exposes model discovery without starting a billable generation job.
// Verify authentication and the selected model separately from inference queue latency.
export async function verifyDeepSeekConnection(
  config: APIConfig,
  options: { signal: AbortSignal; fetcher: FetchFn; timeoutMs?: number },
) {
  if (config.provider !== "deepseek" || validateConfig(config))
    throw new AIError("invalid");
  const control = new AbortController();
  const cancel = () => control.abort();
  options.signal.addEventListener("abort", cancel, { once: true });
  if (options.signal.aborted) control.abort();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    control.abort();
  }, options.timeoutMs ?? 30000);
  try {
    const fetcher = options.fetcher;
    const result = await fetcher(
      `${config.baseURL.trim().replace(/\/+$/, "")}/models`,
      {
        headers: {
          Authorization: `Bearer ${config.key.trim()}`,
          Accept: "application/json",
        },
        signal: control.signal,
        redirect: "error",
      },
    );
    if (!result.ok)
      throw new AIError(
        result.status === 401
          ? "auth"
          : result.status === 403
            ? "access"
            : result.status === 404
              ? "model"
              : result.status === 429
                ? "limit"
                : "server",
        result.status,
      );
    const data = await result.json();
    if (!Array.isArray(data.data)) throw new AIError("server");
    if (
      !data.data.some(
        (model: { id?: string }) => model.id === config.model.trim(),
      )
    )
      throw new AIError("model");
  } catch (error) {
    if (timedOut) throw new AIError("timeout");
    if (options.signal.aborted) throw new AIError("cancelled");
    if (error instanceof AIError) throw error;
    throw new AIError("network");
  } finally {
    clearTimeout(timer);
    options.signal.removeEventListener("abort", cancel);
  }
}
export async function streamAnswer(
  config: APIConfig,
  instructions: string,
  messages: ChatTurn[],
  options: {
    signal: AbortSignal;
    onText: (text: string) => void;
    fetcher: FetchFn;
    timeoutMs?: number;
  },
) {
  const request = makeRequest(config, instructions, messages);
  const controller = new AbortController();
  const cancel = () => controller.abort();
  options.signal.addEventListener("abort", cancel, { once: true });
  if (options.signal.aborted) controller.abort();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs ?? 120000);
  let text = "",
    complete = false;
  try {
    // Invoke as a standalone function: browser fetch rejects an options-object
    // receiver (Illegal invocation) before any network request is sent.
    const fetcher = options.fetcher;
    const res = await fetcher(request.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: `Bearer ${config.key.trim()}`,
      },
      body: JSON.stringify(request.body),
      signal: controller.signal,
      redirect: "error",
    });
    if (!res.ok) {
      // Never display or log provider bodies: they can echo the key or user content.
      throw new AIError(
        res.status === 401
          ? "auth"
          : res.status === 403
            ? "access"
            : res.status === 404
              ? "model"
              : res.status === 429
                ? "limit"
                : "server",
        res.status,
      );
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/event-stream")) {
      const data = await res.json();
      if (
        data.error ||
        data.status === "failed" ||
        data.status === "incomplete"
      )
        throw new AIError("server");
      text =
        data.choices?.[0]?.message?.content ||
        data.output
          ?.flatMap(
            (o: { content?: { type: string; text?: string }[] }) =>
              o.content || [],
          )
          .filter((c: { type: string }) => c.type === "output_text")
          .map((c: { text?: string }) => c.text || "")
          .join("") ||
        "";
      if (typeof text !== "string" || !text.trim()) throw new AIError("empty");
      options.onText(text);
      return text;
    }
    if (!res.body) throw new AIError("stream");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const parser = new SSEParser((raw, event) => {
      if (raw === "[DONE]") {
        complete = true;
        return;
      }
      let obj: any;
      try {
        obj = JSON.parse(raw);
      } catch {
        throw new AIError("stream");
      }
      if (
        obj.error ||
        event === "error" ||
        obj.type === "response.failed" ||
        obj.type === "response.incomplete"
      )
        throw new AIError("server");
      if (obj.type === "response.completed") {
        complete = true;
        return;
      }
      const delta =
        obj.type === "response.output_text.delta"
          ? obj.delta
          : obj.choices?.[0]?.delta?.content;
      if (typeof delta === "string") {
        text += delta;
        options.onText(text);
      }
      if (obj.choices?.[0]?.finish_reason === "length")
        throw new AIError("stream");
    });
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        parser.push(decoder.decode(part.value, { stream: true }));
      }
      parser.push(decoder.decode());
      parser.finish();
    } finally {
      await reader.cancel().catch(() => {});
    }
    if (!complete) throw new AIError("stream");
    if (!text.trim()) throw new AIError("empty");
    return text;
  } catch (error) {
    if (timedOut) throw new AIError("timeout");
    if (options.signal.aborted) throw new AIError("cancelled");
    if (error instanceof AIError) throw error;
    throw new AIError("network");
  } finally {
    clearTimeout(timeout);
    options.signal.removeEventListener("abort", cancel);
  }
}
const errors = {
  auth: [
    "API key was rejected. Check the key and, for Qwen, its region.",
    "接口密钥被拒绝。请检查密钥和 Qwen 区域。",
    "APIキーが拒否されました。キーと、Qwenの場合は地域設定を確認してください。",
    "API 키가 거절되었습니다. 키와 Qwen 지역 설정을 확인하세요.",
  ],
  access: [
    "This model is not available to your account or region.",
    "当前账号或区域没有该模型权限。",
    "このモデルは現在のアカウントまたは地域で利用できません。",
    "이 계정이나 지역에서는 해당 모델을 사용할 수 없습니다.",
  ],
  model: [
    "Model or endpoint not found. Check the model ID and base URL.",
    "未找到模型或接口，请检查模型标识和基础地址。",
    "モデルか接続先が見つかりません。モデル識別子と接続先の基底アドレスを確認してください。",
    "모델이나 접속 주소를 찾지 못했습니다. 모델 식별자와 기본 주소를 확인하세요.",
  ],
  limit: [
    "The provider is rate-limiting requests or your quota is exhausted. Check your account and try again.",
    "服务商限流或额度不足，请检查账号后重试。",
    "リクエスト制限または利用枠の上限です。提供元のアカウントを確認し、後で再試行してください。",
    "요청 제한 또는 사용 한도에 도달했습니다. 제공업체 계정을 확인한 후 다시 시도하세요.",
  ],
  network: [
    "Could not reach the provider. Check your connection and endpoint. Your question is still here.",
    "无法连接服务商。请检查网络和接口地址，问题仍保留。",
    "提供元に接続できません。通信と接続先を確認してください。質問は保持されています。",
    "제공업체에 연결할 수 없습니다. 네트워크와 접속 주소를 확인하세요. 질문은 유지됩니다.",
  ],
  timeout: [
    "The request timed out. Check your connection and retry.",
    "请求超时，请检查连接后重试。",
    "応答が時間内に届きませんでした。接続を確認して再試行してください。",
    "요청 시간이 초과되었습니다. 연결을 확인하고 다시 시도하세요.",
  ],
  empty: [
    "The model returned no answer. Try again with a shorter question.",
    "模型未返回回答，请用更短的问题重试。",
    "モデルから回答がありません。質問を短くして再試行してください。",
    "모델이 답변을 반환하지 않았습니다. 질문을 줄여 다시 시도하세요.",
  ],
  server: [
    "The provider could not finish this request. Try again later.",
    "服务商未能完成请求，请稍后重试。",
    "提供元が処理を完了できませんでした。後で再試行してください。",
    "제공업체가 요청을 완료하지 못했습니다. 나중에 다시 시도하세요.",
  ],
  stream: [
    "The answer was interrupted or cut short. Retry to get a complete answer.",
    "回答被中断或截断，请重试获取完整回答。",
    "回答が中断されました。完全な回答を得るには再試行してください。",
    "답변이 중단되었습니다. 전체 답변을 받으려면 다시 시도하세요.",
  ],
  cancelled: [
    "Generation stopped.",
    "已停止生成。",
    "生成を停止しました。",
    "생성을 중지했습니다.",
  ],
  invalid: [
    "Check the key, model ID and HTTPS base URL.",
    "请检查密钥、模型标识和安全连接基础地址。",
    "キー、モデル識別子、安全な接続先の基底アドレスを確認してください。",
    "키, 모델 식별자와 보안 접속 기본 주소를 확인하세요.",
  ],
};
export function errorMessage(error: unknown, language: Language | boolean) {
  const lang =
    typeof language === "boolean" ? (language ? "zh" : "en") : language;
  const message =
    errors[error instanceof AIError ? error.kind : "network"][
      ["en", "zh", "ja", "ko"].indexOf(lang)
    ];
  return error instanceof AIError && error.status
    ? `${message} (${error.status})`
    : message;
}
