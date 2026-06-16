import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import sentences from "../data/sentences.json";
import { getStoredMistakes } from "../utils/trainingStorage";

function getTextLabel(value) {
  return value ?? "待补充";
}

export default function SentenceTraining() {
  const mistakes = useMemo(() => getStoredMistakes(), []);
  const [year, setYear] = useState("全部");
  const [textNumber, setTextNumber] = useState("全部");
  const years = [...new Set(mistakes.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a);
  const texts = [...new Set(mistakes.map((item) => item.textNumber).filter(Boolean))];
  const filteredMistakes = mistakes.filter((item) => {
    const yearMatch = year === "全部" || String(item.year) === String(year);
    const textMatch = textNumber === "全部" || item.textNumber === textNumber;
    return yearMatch && textMatch;
  });

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">LONG SENTENCES</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">长难句训练</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        这里会汇总你的错题定位句，帮助你从句子层面回看为什么选错。
      </p>

      <SectionCard className="mt-7" title="错题定位句复盘" description="按年份和 Text 筛选错题定位句。">
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="全部">全部年份</option>
            {years.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            value={textNumber}
            onChange={(event) => setTextNumber(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="全部">全部 Text</option>
            {texts.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 space-y-4">
          {filteredMistakes.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              还没有错题定位句。完成阅读提交后会自动生成复盘入口。
            </p>
          ) : (
            filteredMistakes.map((mistake) => {
              const analysis = mistake.sourceSentenceAnalysis;
              return (
                <div key={mistake.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-bold text-blue-700">
                    {mistake.year} {mistake.textNumber} 第 {mistake.questionNumber} 题
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {analysis?.sentence ?? mistake.location ?? "该题长难句分析待补充"}
                  </p>
                  {analysis ? (
                    <dl className="mt-4 grid gap-3 md:grid-cols-2">
                      {[
                        ["句子主干", analysis.coreStructure],
                        ["语法拆解", analysis.grammarBreakdown],
                        ["修饰成分", analysis.modifiers],
                        ["参考翻译", analysis.translation],
                        ["与答案关系", analysis.relationToQuestion],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-slate-50 p-3">
                          <dt className="text-xs font-bold text-slate-500">{label}</dt>
                          <dd className="mt-1 text-sm leading-6 text-slate-700">{getTextLabel(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">该题长难句分析待补充</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </SectionCard>

      <div className="mt-7 space-y-6">
        {sentences.map((item, index) => (
          <SectionCard key={item.id} title={`示例句 ${index + 1}`}>
            <p className="text-lg font-semibold leading-8 text-slate-900">
              {item.sentence}
            </p>
            <dl className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["主干", item.core],
                ["从句", item.clauses],
                ["修饰成分", item.modifiers],
                ["关键词", item.keywords?.join(" · ")],
                ["参考翻译", item.translation],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-xl bg-slate-50 p-4 ${
                    label === "参考翻译" ? "md:col-span-2" : ""
                  }`}
                >
                  <dt className="text-sm font-bold text-blue-700">{label}</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-600">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
