import { useMemo, useState } from "react";
import {
  extractReviewResult,
  getReviewErrorMessage,
  getWritingScoreConfig,
  wordCount,
  WRITING_MODEL_PRESETS,
} from "../utils/writingReview";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("图片读取失败，请重新选择图片。"));
    reader.readAsDataURL(file);
  });
}

function ReviewList({ title, items, tone = "bg-slate-50" }) {
  if (!items.length) return null;
  return (
    <div className={`rounded-2xl p-4 ${tone}`}>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item, index) => <li key={`${title}-${index}`}>• {String(item)}</li>)}
      </ul>
    </div>
  );
}

export default function WritingAiReview({ paper, essayKey, essayType, prompt, content }) {
  const { maxScore, targetWords } = useMemo(
    () => getWritingScoreConfig(paper, essayKey),
    [paper, essayKey],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState(WRITING_MODEL_PRESETS.openai.endpoint);
  const [model, setModel] = useState(WRITING_MODEL_PRESETS.openai.model);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function chooseProvider(nextProvider) {
    setProvider(nextProvider);
    const preset = WRITING_MODEL_PRESETS[nextProvider];
    setEndpoint(preset.endpoint);
    setModel(preset.model);
    setError("");
  }

  async function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("请上传 JPG、PNG、WEBP 等图片文件。");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("图片请控制在 2MB 以内，避免接口请求失败。");
      return;
    }

    try {
      setImage(await readImage(file));
      setImageName(file.name);
      setError("");
    } catch (nextError) {
      setError(getReviewErrorMessage(nextError));
    }
  }

  async function submitReview() {
    const trimmedContent = content.trim();
    if (!trimmedContent && !image) {
      setError("请先粘贴作文内容，或上传一张清晰的作文图片。");
      return;
    }
    if (!apiKey.trim() || !endpoint.trim() || !model.trim()) {
      setError("请完整填写 API 密钥、接口地址和模型名称。");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          endpoint: endpoint.trim(),
          model: model.trim(),
          paper,
          essayType,
          maxScore,
          targetWords,
          prompt,
          essay: trimmedContent,
          imageDataUrl: image,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "评阅接口返回错误。");
      setResult(extractReviewResult(payload.resultText));
    } catch (nextError) {
      setError(getReviewErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 rounded-3xl border border-violet-100 bg-violet-50/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-violet-800">AI 辅助评阅</p>
          <p className="mt-1 text-xs leading-5 text-violet-700">按 {paper} {essayType}（满分 {maxScore} 分、{targetWords}）给出训练建议，不等同于官方人工阅卷。</p>
        </div>
        <button type="button" onClick={() => setIsOpen((value) => !value)} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">
          {isOpen ? "收起 AI 评阅" : "设置并开始评阅"}
        </button>
      </div>

      {isOpen && <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-violet-100 bg-white p-4 text-xs leading-5 text-slate-600">
          <p className="font-bold text-slate-800">密钥与隐私说明</p>
          <p className="mt-1">密钥仅随本次 HTTPS 请求发送给你选择的模型服务商，不写入项目源码、不保存至 localStorage，也不会提交到 GitHub。请使用有额度上限的个人密钥，并在不需要时清空输入框。</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">模型服务
            <select value={provider} onChange={(event) => chooseProvider(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100">
              {Object.entries(WRITING_MODEL_PRESETS).map(([key, preset]) => <option key={key} value={key}>{preset.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">模型名称
            <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="例如 gpt-4.1-mini" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">OpenAI 兼容接口地址
            <input value={endpoint} onChange={(event) => setEndpoint(event.target.value)} placeholder="https://.../v1/chat/completions" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">你的 API 密钥
            <input type="password" autoComplete="off" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="仅本次评阅使用，不会保存" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-4">
          <label className="block text-sm font-bold text-slate-800">上传手写作文照片（可选）
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-violet-700" />
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-500">建议优先粘贴可编辑文本。仅视觉模型可读取图片；请上传清晰、正向、单页且不超过 2MB 的照片。</p>
          {imageName && <p className="mt-2 text-xs font-semibold text-violet-700">已选择：{imageName}</p>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">当前文本词数：{wordCount(content)}。模型会根据题目要求判断长度是否合适。</p>
          <button type="button" onClick={submitReview} disabled={loading} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-violet-200 disabled:cursor-not-allowed disabled:bg-violet-300">
            {loading ? "正在生成评阅报告..." : "提交 AI 评阅"}
          </button>
        </div>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}

        {result && <div className="space-y-4 rounded-2xl border border-violet-100 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div><p className="text-xs font-bold text-violet-700">AI 辅助评分</p><p className="mt-1 text-2xl font-black text-slate-900">{Math.min(maxScore, Math.max(0, result.score))} / {maxScore} 分</p></div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">{result.band}</span>
          </div>
          <p className="text-sm leading-6 text-slate-700">{result.summary}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {[["任务完成", result.taskCompletion], ["内容切题", result.content], ["结构衔接", result.organization], ["语言表达", result.language]].map(([title, value]) => <div key={title} className="rounded-2xl bg-slate-50 p-4"><p className="font-bold text-slate-900">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{value}</p></div>)}
          </div>
          <ReviewList title="做得好的地方" items={result.strengths} tone="bg-emerald-50" />
          <ReviewList title="优先修改的问题" items={result.issues} tone="bg-rose-50" />
          <ReviewList title="下一次训练建议" items={result.nextSteps} tone="bg-amber-50" />
          {result.corrections.length > 0 && <div className="rounded-2xl bg-slate-50 p-4"><h4 className="font-bold text-slate-900">典型修改建议</h4><div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">{result.corrections.map((item, index) => <div key={index} className="rounded-xl bg-white p-3"><p><span className="font-bold text-rose-600">原句：</span>{item.original ?? "待补充"}</p><p className="mt-1"><span className="font-bold text-emerald-700">建议：</span>{item.suggestion ?? "待补充"}</p><p className="mt-1 text-xs text-slate-500">{item.reason ?? ""}</p></div>)}</div></div>}
          {result.imageNote && <p className="text-xs leading-5 text-slate-500">图片识别说明：{result.imageNote}</p>}
        </div>}
      </div>}
    </div>
  );
}
