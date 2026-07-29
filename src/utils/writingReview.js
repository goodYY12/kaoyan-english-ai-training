export const WRITING_MODEL_PRESETS = {
  openai: {
    label: "OpenAI（支持图片，取决于模型）",
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4.1-mini",
  },
  qwenVision: {
    label: "通义千问视觉模型（支持图片，取决于账号权限）",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    model: "qwen-vl-plus",
  },
  deepseek: {
    label: "DeepSeek（仅文本评阅）",
    endpoint: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
  },
  custom: {
    label: "自定义 OpenAI 兼容接口",
    endpoint: "",
    model: "",
  },
};

export function getWritingScoreConfig(paper, essayKey) {
  const smallWriting = essayKey === "smallWriting";
  return {
    maxScore: smallWriting ? 10 : paper === "英语二" ? 15 : 20,
    targetWords: smallWriting ? "约 100 词" : paper === "英语二" ? "约 150 词" : "160-200 词",
  };
}

export function wordCount(content) {
  return (String(content).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? []).length;
}

export function extractReviewResult(value) {
  const text = String(value ?? "").trim().replace(/^```json\s*|^```\s*|\s*```$/g, "");
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first < 0 || last <= first) {
    throw new Error("模型没有返回可识别的结构化评分结果。");
  }

  const result = JSON.parse(text.slice(first, last + 1));
  if (!Number.isFinite(Number(result.score))) {
    throw new Error("模型返回的评分结果缺少 score 字段。");
  }

  return {
    score: Number(result.score),
    band: String(result.band ?? "待判断"),
    summary: String(result.summary ?? "待补充"),
    taskCompletion: String(result.taskCompletion ?? "待补充"),
    content: String(result.content ?? "待补充"),
    organization: String(result.organization ?? "待补充"),
    language: String(result.language ?? "待补充"),
    strengths: Array.isArray(result.strengths) ? result.strengths.map(String) : [],
    issues: Array.isArray(result.issues) ? result.issues.map(String) : [],
    corrections: Array.isArray(result.corrections) ? result.corrections : [],
    nextSteps: Array.isArray(result.nextSteps) ? result.nextSteps.map(String) : [],
    imageNote: String(result.imageNote ?? ""),
  };
}

export function getReviewErrorMessage(error) {
  const message = String(error?.message ?? "");
  if (message.includes("Failed to fetch")) {
    return "无法连接评阅接口。线上站点请稍后重试；本地使用 Vite 启动时，请改用 Vercel 线上站点或执行 vercel dev。";
  }
  return message || "评阅失败，请检查密钥、接口地址、模型名称和网络后重试。";
}
