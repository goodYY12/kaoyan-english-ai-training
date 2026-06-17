import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import SectionCard from "../components/SectionCard";
import {
  clearTrainingData,
  getStoredMistakes,
  markMistakeMastered,
} from "../utils/trainingStorage";

const ALL = "全部";

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))];
}

function getSourceLabel(mistake) {
  return mistake.source ?? (mistake.mode === "cloze" ? "完形专项" : "阅读训练");
}

export default function MistakeBook() {
  const [mistakes, setMistakes] = useState(() => getStoredMistakes());
  const [year, setYear] = useState(ALL);
  const [source, setSource] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [reason, setReason] = useState(ALL);

  const years = useMemo(() => uniqueValues(mistakes, "year").sort((a, b) => b - a), [mistakes]);
  const sources = useMemo(() => [...new Set(mistakes.map(getSourceLabel))], [mistakes]);
  const types = useMemo(() => uniqueValues(mistakes, "type"), [mistakes]);
  const reasons = useMemo(() => uniqueValues(mistakes, "wrongReason"), [mistakes]);

  const filteredMistakes = useMemo(
    () =>
      mistakes.filter((item) => {
        const yearMatch = year === ALL || String(item.year) === String(year);
        const sourceMatch = source === ALL || getSourceLabel(item) === source;
        const typeMatch = type === ALL || item.type === type;
        const reasonMatch = reason === ALL || item.wrongReason === reason;
        return yearMatch && sourceMatch && typeMatch && reasonMatch;
      }),
    [mistakes, reason, source, type, year],
  );

  function handleMastered(id) {
    setMistakes(markMistakeMastered(id));
  }

  function handleClear() {
    if (window.confirm("确定清空本地训练记录吗？这个操作主要用于测试。")) {
      clearTrainingData();
      setMistakes([]);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">MISTAKE BOOK</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">错题本</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        阅读和完形提交后，做错的题会自动进入这里。记录只保存在当前浏览器中，刷新页面不会丢失。
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ["年份", year, setYear, years],
            ["来源", source, setSource, sources],
            ["题型", type, setType, types],
            ["错因", reason, setReason, reasons],
          ].map(([label, value, setter, options]) => (
            <label key={label} className="text-sm font-semibold text-slate-700">
              {label}
              <select
                value={value}
                onChange={(event) => setter(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                <option value={ALL}>{ALL}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="self-end rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            清空本地记录
          </button>
        </div>
      </div>

      <div className="mt-7">
        {filteredMistakes.length === 0 ? (
          <EmptyState
            title="还没有匹配的错题"
            description="完成阅读或完形训练并提交答案后，错题会自动保存到这里。"
          />
        ) : (
          <div className="space-y-5">
            {filteredMistakes.map((mistake) => (
              <SectionCard
                key={mistake.id}
                title={`${mistake.year} ${mistake.textNumber} · 第 ${mistake.questionNumber} 题`}
                description={mistake.question}
                action={
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      mistake.mastered
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {mistake.mastered ? "已掌握" : "待复盘"}
                  </span>
                }
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {getSourceLabel(mistake)}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {mistake.type ?? "待补充"}
                  </span>
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    {mistake.wrongReason ?? "待补充"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                    你的答案：<strong>{mistake.userAnswer || "未作答"}</strong>
                  </p>
                  <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    正确答案：<strong>{mistake.correctAnswer}</strong>
                  </p>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <h3 className="font-bold text-slate-900">查看解析</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {mistake.explanation ?? "待补充"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4">
                    <h3 className="font-bold text-blue-800">原文定位句 / 解题依据</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {mistake.location ?? "待补充"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-4">
                    <h3 className="font-bold text-indigo-800">查看出题人思维</h3>
                    {mistake.examinerThinking ? (
                      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                        <li>考查点：{mistake.examinerThinking.testPoint ?? "待补充"}</li>
                        <li>干扰项：{mistake.examinerThinking.trap ?? "待补充"}</li>
                        <li>下次策略：{mistake.examinerThinking.nextTimeStrategy ?? "待补充"}</li>
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        该题出题人思维分析待补充
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl bg-cyan-50 p-4">
                    <h3 className="font-bold text-cyan-800">查看长难句分析</h3>
                    {mistake.sourceSentenceAnalysis ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {mistake.sourceSentenceAnalysis.translation ?? "待补充"}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">该题长难句分析待补充</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMastered(mistake.id)}
                  className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  {mistake.mastered ? "取消已掌握" : "标记为已掌握"}
                </button>
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
