import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  AIError,
  makeRequest,
  SSEParser,
  streamAnswer,
  errorMessage,
} from "../src/ai/client";
import {
  providers,
  qwenEndpoint,
  validateConfig,
  APIConfig,
} from "../src/ai/providers";
import {
  buildInstructions,
  describeContext,
  TripContext,
} from "../src/ai/context";
import { freshPreferences, persistable } from "../src/preferences";
import { content, cards, phrases } from "../src/content";
const base: APIConfig = {
  provider: "deepseek",
  key: "test-key-not-a-real-secret",
  model: providers.deepseek.model,
  baseURL: providers.deepseek.baseURL,
};
const ctx: TripContext = {
  language: "en",
  city: "shanghai",
  stage: "arrived",
  checklist: ["payment"],
  completedSteps: { taxi: [0] },
  shareContext: true,
  platform: "ios",
  online: true,
  timezone: "Asia/Shanghai",
};
const response = (s: string) =>
  new Response(
    new ReadableStream({
      start(controller) {
        const bytes = new TextEncoder().encode(s);
        for (let i = 0; i < bytes.length; i += 3)
          controller.enqueue(bytes.slice(i, i + 3));
        controller.close();
      },
    }),
    { headers: { "content-type": "text/event-stream" } },
  );
test("requested models have correct protocols, stateless OpenAI payload, no key in body", () => {
  for (const provider of ["deepseek", "qwen", "openai"] as const) {
    const c = {
      ...base,
      provider,
      model: providers[provider].model,
      baseURL: providers[provider].baseURL,
    };
    const r = makeRequest(c, "PROJECT CONTEXT", [
      { role: "user", content: "hello" },
    ]);
    assert(!JSON.stringify(r.body).includes(c.key));
    assert(r.body.stream);
    assert.equal(r.body.model, c.model);
    if (provider === "openai") {
      assert(r.url.endsWith("/v1/responses"));
      assert.equal((r.body as any).store, false);
      assert.equal((r.body as any).instructions, "PROJECT CONTEXT");
      assert.equal((r.body as any).reasoning.effort, "low");
    } else {
      assert(r.url.endsWith("/chat/completions"));
      assert.equal((r.body as any).messages[0].content, "PROJECT CONTEXT");
    }
  }
});
test("Qwen region and workspace produce official endpoints; invalid URLs rejected", () => {
  assert.equal(
    qwenEndpoint("beijing", "ws-123"),
    "https://ws-123.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
  );
  assert.equal(
    qwenEndpoint("singapore", "ws-123"),
    "https://ws-123.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
  );
  assert(qwenEndpoint("virginia", "").includes("dashscope-us"));
  assert.throws(() => qwenEndpoint("beijing", "../bad"));
  for (const url of [
    "http://example.com",
    "https://user:pass@example.com",
    "https://example.com?key=SECRET",
    "https://{WorkspaceId}.example.com",
    "https://example.com/chat/completions",
    "https://example.com/responses",
  ])
    assert.equal(validateConfig({ ...base, baseURL: url }), "invalidEndpoint");
});
test("SSE supports arbitrary chunks, CRLF, comments and multiline data", () => {
  const events: string[] = [];
  const p = new SSEParser((v, e) => events.push(`${e}:${v}`));
  for (const ch of ":keepalive\r\nevent: a\r\ndata: first\r\ndata: second\r\n\r\ndata: [DONE]\n\n")
    p.push(ch);
  p.finish();
  assert.deepEqual(events, ["a:first\nsecond", ":[DONE]"]);
});
test("Chat Completions stream decodes split Chinese correctly and sends bearer only to target", async () => {
  const seen: string[] = [];
  const out = await streamAnswer(
    base,
    "instructions",
    [{ role: "user", content: "help" }],
    {
      signal: new AbortController().signal,
      onText: (t) => seen.push(t),
      fetcher: async (url, init) => {
        assert.equal(url, "https://api.deepseek.com/chat/completions");
        assert.equal(
          (init?.headers as any).Authorization,
          `Bearer ${base.key}`,
        );
        assert.equal(init?.redirect, "error");
        return response(
          'data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: {"choices":[{"delta":{"content":"，朋友"}}]}\n\ndata: [DONE]\n\n',
        );
      },
    },
  );
  assert.equal(out, "你好，朋友");
  assert.equal(seen.at(-1), out);
});
test("Responses stream extracts answer and requires completion", async () => {
  const c = {
    ...base,
    provider: "openai" as const,
    baseURL: providers.openai.baseURL,
    model: providers.openai.model,
  };
  const text = await streamAnswer(
    c,
    "project",
    [{ role: "user", content: "hi" }],
    {
      signal: new AbortController().signal,
      onText: () => {},
      fetcher: async () =>
        response(
          'event: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"Hello"}\n\nevent: response.completed\ndata: {"type":"response.completed"}\n\n',
        ),
    },
  );
  assert.equal(text, "Hello");
  await assert.rejects(
    () =>
      streamAnswer(base, "project", [], {
        signal: new AbortController().signal,
        onText: () => {},
        fetcher: async () =>
          response('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n'),
      }),
    (e: unknown) => e instanceof AIError && e.kind === "stream",
  );
});
test("provider failures never reveal response bodies or credentials", async () => {
  await assert.rejects(
    () =>
      streamAnswer(base, "project", [], {
        signal: new AbortController().signal,
        onText: () => {},
        fetcher: async () =>
          new Response(`Incorrect key ${base.key}`, { status: 401 }),
      }),
    (e: unknown) => {
      assert.equal(errorMessage(e, false).includes(base.key), false);
      return e instanceof AIError && e.kind === "auth";
    },
  );
});
test("timeouts, cancellation, SSE provider errors and empty answers are distinguished", async () => {
  const stalled: typeof fetch = (_url, init) =>
    new Promise((_, reject) =>
      init?.signal?.addEventListener("abort", () =>
        reject(new DOMException("Aborted", "AbortError")),
      ),
    );
  await assert.rejects(
    () =>
      streamAnswer(base, "", [], {
        signal: new AbortController().signal,
        onText: () => {},
        fetcher: stalled,
        timeoutMs: 10,
      }),
    (e: unknown) => e instanceof AIError && e.kind === "timeout",
  );
  const abort = new AbortController();
  setTimeout(() => abort.abort(), 5);
  await assert.rejects(
    () =>
      streamAnswer(base, "", [], {
        signal: abort.signal,
        onText: () => {},
        fetcher: stalled,
      }),
    (e: unknown) => e instanceof AIError && e.kind === "cancelled",
  );
  for (const s of ['data: {"error":{"message":"key"}}\n\n', "data: [DONE]\n\n"])
    await assert.rejects(
      () =>
        streamAnswer(base, "", [], {
          signal: new AbortController().signal,
          onText: () => {},
          fetcher: async () => response(s),
        }),
      AIError,
    );
});
test("context includes relevant guide and city but omits personal trip data when disabled", () => {
  const full = buildInstructions("My Alipay payment failed", ctx);
  assert(full.includes("Shanghai"));
  assert(full.includes("Call your bank"));
  assert(full.includes("lastReviewed"));
  assert(full.includes("96 ready-to-show"));
  const minimal = buildInstructions("My Alipay payment failed", {
    ...ctx,
    shareContext: false,
  });
  assert(!minimal.includes("Shanghai"));
  assert(!minimal.includes("Asia/Shanghai"));
  assert(!minimal.includes("deviceDate"));
  const data = describeContext(ctx);
  assert(!("key" in data));
  assert(!("address" in data));
});
test("persistence excludes API configuration, conversations and unknown fields", () => {
  const output = persistable({
    ...freshPreferences(),
    apiKey: "SECRET",
    config: base,
    messages: [{ content: "PRIVATE" }],
  } as any);
  assert(!JSON.stringify(output).includes("SECRET"));
  assert(!JSON.stringify(output).includes("PRIVATE"));
  assert(!("config" in output));
  assert(!("apiKey" in output));
});
test("native content retains real counts, has no visible long dashes or emoji and keeps Chinese payloads", () => {
  assert.equal(content.scenes.length, 9);
  assert.equal(cards.length, 96);
  assert.equal(phrases.length, 207);
  const payload = readFileSync(
    new URL("../src/content/content.json", import.meta.url),
    "utf8",
  );
  assert(!/[—–]/.test(payload));
  assert(cards.some((c) => c.zh === "我在 B 出口。"));
  assert(!/\p{Extended_Pictographic}/u.test(payload));
});

import { cardBlanks, fillCard } from "../src/card-template";
test("Chinese card templates require every distinct blank and preserve user text", () => {
  const template = "目的地：[中文地址]；位置：[地点]；%s / %s";
  assert.deepEqual(cardBlanks(template), ["[中文地址]", "[地点]", "%s"]);
  assert.equal(
    fillCard(template, {
      "[中文地址]": " 上海市 ",
      "[地点]": "大厅",
      "%s": "$1",
    }),
    "目的地：上海市；位置：大厅；$1 / $1",
  );
  assert.equal(fillCard("目的地：[中文地址]", {}), "目的地：[中文地址]");
});

import { qwenLocation } from "../src/ai/providers";
test("reopening Qwen settings restores the session endpoint region and workspace", () => {
  for (const region of ["beijing", "singapore", "virginia"] as const) {
    assert.deepEqual(qwenLocation(qwenEndpoint(region, "")), {
      region,
      workspace: "",
    });
    if (region !== "virginia")
      assert.deepEqual(qwenLocation(qwenEndpoint(region, "ws-demo")), {
        region,
        workspace: "ws-demo",
      });
  }
  assert.equal(qwenLocation("https://custom.example.com/v1"), null);
  assert.equal(qwenLocation("invalid"), null);
});

import { actionBadge, actionTarget, mapSearchURL } from "../src/service-links";
import type { ServiceAction } from "../src/content";
test("latest upstream hand-offs survive native migration in all nine guides and four languages", () => {
  const actions = content.scenes.flatMap((s) => s.actions);
  assert.equal(actions.length, 21);
  for (const scene of content.scenes) {
    assert(scene.actions.length > 0);
    for (const a of scene.actions) {
      assert(actionTarget(a));
      for (const lang of ["en", "zh", "ja", "ko"] as const) {
        assert(typeof a.label === "object" && a.label[lang]);
        assert(actionBadge(a, lang));
      }
    }
  }
  assert(
    content.scenes
      .find((s) => s.id === "food")
      ?.actions.some((a) => a.kind === "local"),
  );
  assert(!actions.some((a) => a.url.includes("customs.gov.cn")));
});
test("unknown badges and mismatched schemes never become phone or web actions", () => {
  const action: ServiceAction = {
    kind: "official",
    label: "Test",
    url: "https://example.com",
  };
  assert.equal(actionTarget({ ...action, url: "javascript:alert(1)" }), null);
  assert.equal(actionTarget({ ...action, url: "http://example.com" }), null);
  assert.equal(
    actionTarget({ ...action, url: "https://name:password@example.com" }),
    null,
  );
  assert.equal(actionTarget({ ...action, kind: "call" }), null);
  assert.equal(actionTarget({ ...action, url: "tel:110" }), null);
  assert.equal(
    actionTarget({ ...action, kind: "call", url: "tel:110" }),
    "call",
  );
  assert.equal(actionTarget({ ...action, kind: "unknown" as any }), null);
  assert.equal(
    actionBadge({ ...action, kind: "unknown" as any }, "en"),
    "unknown",
  );
});
test("airport hand-offs use escaped Amap search, not fabricated coordinates or navigation", () => {
  const url = new URL(mapSearchURL("上海浦东国际机场（PVG）"));
  assert.equal(url.origin, "https://www.amap.com");
  assert.equal(url.pathname, "/search");
  assert.equal(url.searchParams.get("query"), "上海浦东国际机场");
  assert.equal(
    new URL(mapSearchURL("北京南站 &other=value")).searchParams.size,
    1,
  );
});
test("AI receives current hand-off targets, provider requirements and honest limitations", () => {
  const instructions = buildInstructions("How do I order food?", ctx);
  assert(instructions.includes("serviceLinks"));
  assert(instructions.includes("Chinese interface"));
  assert(instructions.includes("meituan.com"));
  assert(instructions.includes("Chinese phone number"));
  assert(instructions.includes("Never invent app schemes"));
});
