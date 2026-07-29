const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

function buildScoringPrompt({ paper, essayType, maxScore, targetWords, prompt, essay, hasImage }) {
  return `你是考研英语写作训练的辅助评阅老师。请以真实考场的整体评分原则评阅，不要冒充官方阅卷结果，也不要为了鼓励而虚高分数。

考试类型：${paper}
题型：${essayType}
该题满分：${maxScore} 分
建议字数：${targetWords}
题目要求：${prompt || "题干待补充"}
考生文本：${essay || "考生仅上传了图片，请先尽力识别正文。"}

评分要求：
1. 先判断是否完成题目规定任务、内容是否切题、文体/语域/格式是否恰当。
2. 再综合评估内容要点、组织衔接、词汇语法准确性与句式多样性；采用整体分档思路，不要机械按错误数量扣分。
3. 字数明显不足、遗漏核心要点、文体错误、内容跑题、严重影响理解的语言错误应明显反映在分数和建议中。
4. 仅指出最影响得分的 3-5 个问题；不要把正常的个人表达一律改成模板句。
5. 若图片模糊、文字无法可靠识别，明确说明并降低评分确信度，不要臆造内容。
6. 分数必须是 0 到 ${maxScore} 的整数。若文本为空或无法识别，给出 0 分并说明原因。

只返回一个合法 JSON 对象，不要使用 Markdown 代码块，不要添加对象外文字。格式必须为：
{
  "score": 0,
  "band": "例如：中档 / 较高档",
  "summary": "不超过两句的总体结论",
  "taskCompletion": "任务完成与格式评价",
  "content": "内容、切题性和要点评价",
  "organization": "结构与衔接评价",
  "language": "词汇、语法与表达评价",
  "strengths": ["..."],
  "issues": ["问题 + 对分数的影响"],
  "corrections": [{"original":"原句","suggestion":"更自然/准确的改法","reason":"原因"}],
  "nextSteps": ["下一次训练建议"],
  "imageNote": "${hasImage ? "说明图片识别是否可靠" : "未使用图片"}"
}`;
}

function getErrorMessage(payload, status) {
  if (payload?.error?.message) return payload.error.message;
  if (typeof payload?.error === "string") return payload.error;
  return `模型服务返回错误（HTTP ${status}）。`;
}

function isSafeEndpoint(endpoint) {
  try {
    const url = new URL(endpoint);
    const host = url.hostname.toLowerCase();
    const privateNetwork = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);
    return url.protocol === "https:" && !privateNetwork;
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "仅支持 POST 请求。" });
  }

  const {
    apiKey,
    endpoint,
    model,
    paper,
    essayType,
    maxScore,
    targetWords,
    prompt,
    essay,
    imageDataUrl,
  } = request.body ?? {};

  if (![apiKey, endpoint, model].every((value) => typeof value === "string" && value.trim())) {
    return response.status(400).json({ error: "请提供 API 密钥、接口地址和模型名称。" });
  }
  if (!isSafeEndpoint(endpoint)) {
    return response.status(400).json({ error: "接口地址必须是公开可访问的 HTTPS 地址，且不能指向本机或局域网。" });
  }
  if (typeof essay !== "string" || essay.length > 20000) {
    return response.status(400).json({ error: "作文文本不能为空且不能超过 20,000 个字符。" });
  }
  if (imageDataUrl && (typeof imageDataUrl !== "string" || !imageDataUrl.startsWith("data:image/") || imageDataUrl.length > MAX_IMAGE_SIZE)) {
    return response.status(400).json({ error: "图片格式无效或过大，请上传 3MB 以内的图片。" });
  }

  const scoringPrompt = buildScoringPrompt({
    paper,
    essayType,
    maxScore,
    targetWords,
    prompt,
    essay,
    hasImage: Boolean(imageDataUrl),
  });
  const userContent = [{ type: "text", text: "请严格按照 JSON 格式返回评阅结果。" }];
  if (imageDataUrl) userContent.push({ type: "image_url", image_url: { url: imageDataUrl } });

  try {
    const providerResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: scoringPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });
    const payload = await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok) {
      return response.status(providerResponse.status).json({ error: getErrorMessage(payload, providerResponse.status) });
    }

    const resultText = payload?.choices?.[0]?.message?.content;
    if (typeof resultText !== "string" || !resultText.trim()) {
      return response.status(502).json({ error: "模型没有返回有效的评阅文本，请检查模型是否兼容 Chat Completions 接口。" });
    }

    return response.status(200).json({ resultText });
  } catch (error) {
    return response.status(502).json({ error: `无法连接模型服务：${error.message}` });
  }
}
