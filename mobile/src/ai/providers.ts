export type Provider = "deepseek" | "qwen" | "openai";
export type APIConfig = {
  provider: Provider;
  key: string;
  baseURL: string;
  model: string;
};
export const providers = {
  deepseek: {
    name: "DeepSeek",
    label: "DeepSeek 4.1 Flash",
    model: "deepseek-flash",
    baseURL: "https://api.deepseek.com",
    protocol: "chat",
    docs: "https://api-docs.deepseek.com/",
    keyURL: "https://platform.deepseek.com/api_keys",
  },
  qwen: {
    name: "Qwen",
    label: "Qwen 3.8 Flash",
    model: "qwen3.8-flash",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    protocol: "chat",
    docs: "https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope",
    keyURL: "https://bailian.console.aliyun.com/",
  },
  openai: {
    name: "OpenAI",
    label: "GPT-6.1 Sol",
    model: "gpt-6.1-sol",
    baseURL: "https://api.openai.com/v1",
    protocol: "responses",
    docs: "https://developers.openai.com/api/docs/models/gpt-6.1-sol",
    keyURL: "https://platform.openai.com/api-keys",
  },
} as const;
export type Region = "beijing" | "singapore" | "virginia";
export function qwenLocation(
  baseURL: string,
): { region: Region; workspace: string } | null {
  try {
    const url = new URL(baseURL);
    if (
      url.protocol !== "https:" ||
      url.pathname.replace(/\/$/, "") !== "/compatible-mode/v1"
    )
      return null;
    const legacy: Record<string, Region> = {
      "dashscope.aliyuncs.com": "beijing",
      "dashscope-intl.aliyuncs.com": "singapore",
      "dashscope-us.aliyuncs.com": "virginia",
    };
    if (legacy[url.hostname])
      return { region: legacy[url.hostname], workspace: "" };
    const match =
      /^([a-zA-Z0-9-]+)\.(cn-beijing|ap-southeast-1)\.maas\.aliyuncs\.com$/.exec(
        url.hostname,
      );
    return match
      ? {
          region: match[2] === "cn-beijing" ? "beijing" : "singapore",
          workspace: match[1],
        }
      : null;
  } catch {
    return null;
  }
}
export function qwenEndpoint(region: Region, workspace: string): string {
  const id = workspace.trim();
  if (id && !/^[a-zA-Z0-9-]+$/.test(id))
    throw new Error(
      "Workspace ID must contain only letters, digits and hyphens.",
    );
  if (region === "virginia")
    return "https://dashscope-us.aliyuncs.com/compatible-mode/v1";
  if (id)
    return `https://${id}.${region === "beijing" ? "cn-beijing" : "ap-southeast-1"}.maas.aliyuncs.com/compatible-mode/v1`;
  return `https://${region === "beijing" ? "dashscope" : "dashscope-intl"}.aliyuncs.com/compatible-mode/v1`;
}
export function validateConfig(
  config: APIConfig,
): "keyRequired" | "modelRequired" | "invalidEndpoint" | null {
  if (!config.key.trim()) return "keyRequired";
  if (!config.model.trim()) return "modelRequired";
  try {
    const url = new URL(config.baseURL);
    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      /[{}<>\s]/.test(config.baseURL) ||
      /\/(responses|chat\/completions)\/?$/.test(url.pathname)
    )
      return "invalidEndpoint";
  } catch {
    return "invalidEndpoint";
  }
  return null;
}
