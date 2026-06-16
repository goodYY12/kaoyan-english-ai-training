import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import attitudeSignals from "../data/attitudeSignals.json";
import examinerRules from "../data/examinerRules.json";
import questionTypes from "../data/questionTypes.json";
import trapPatterns from "../data/trapPatterns.json";
import { getStoredMistakes } from "../utils/trainingStorage";

const groups = [
  { title: "题型规律", description: "先判断题型，再决定阅读动作。", items: questionTypes.slice(0, 4) },
  { title: "干扰项陷阱", description: "识别看似熟悉、实际越界的选项。", items: trapPatterns },
  { title: "作者态度与语气", description: "从措辞强弱判断作者评价。", items: attitudeSignals },
  { title: "命题套路", description: "总结命题人反复使用的组织方式。", items: examinerRules },
];

function countBy(items, key) {
  return items.reduce((result, item) => {
    const value = item[key] ?? "待补充";
    return { ...result, [value]: (result[value] ?? 0) + 1 };
  }, {});
}

export default function ExaminerThinking() {
  const [expanded, setExpanded] = useState(null);
  const mistakes = useMemo(() => getStoredMistakes(), []);
  const typeStats = Object.entries(countBy(mistakes, "type"));
  const reasonStats = Object.entries(countBy(mistakes, "wrongReason"));

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">EXAMINER THINKING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">出题人思维</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        这里既保留命题规律卡片，也会读取你的错题记录，按题型和错因汇总复盘重点。
      </p>

      <SectionCard
        className="mt-7"
        title="我的错题思维归位"
        description="完成阅读并提交后，这里会按本地错题记录自动汇总。"
      >
        {mistakes.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            还没有错题记录。完成一篇阅读后，错题会自动出现在这里。
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-4">
              <h3 className="font-bold text-blue-800">题型统计</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {typeStats.map(([type, count]) => (
                  <li key={type}>{type}：{count} 题</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <h3 className="font-bold text-amber-800">错因统计</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {reasonStats.map(([reason, count]) => (
                  <li key={reason}>{reason}：{count} 题</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-indigo-50 p-4">
              <h3 className="font-bold text-indigo-800">复盘提醒</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                优先回看错题的原文定位句，判断选项和原文之间是同义替换、范围变化，还是语气偷换。
              </p>
            </div>
          </div>
        )}

        {mistakes.length > 0 && (
          <div className="mt-5 space-y-3">
            {mistakes.slice(0, 5).map((mistake) => (
              <div key={mistake.id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-bold text-slate-900">
                  {mistake.year} {mistake.textNumber} 第 {mistake.questionNumber} 题 · {mistake.type}
                </p>
                {mistake.examinerThinking ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {mistake.examinerThinking.nextTimeStrategy ?? "待补充"}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">该题出题人思维分析待补充</p>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        {groups.map((group, groupIndex) => (
          <SectionCard
            key={group.title}
            title={group.title}
            description={group.description}
          >
            <div className="space-y-3">
              {group.items.map((item, itemIndex) => {
                const id = `${groupIndex}-${itemIndex}`;
                const isExpanded = expanded === id;
                const details = item.details ?? [item.detail].filter(Boolean);

                return (
                  <button
                    key={item.title ?? item.name}
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : id)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {item.title ?? item.name}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.summary}
                        </p>
                      </div>
                      <span className="shrink-0 text-lg text-blue-600">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </div>
                    {isExpanded && (
                      <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                        {details.map((detail) => (
                          <li
                            key={detail}
                            className="text-sm leading-6 text-slate-600"
                          >
                            · {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
