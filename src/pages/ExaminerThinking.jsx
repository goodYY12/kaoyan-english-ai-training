import { useState } from "react";
import SectionCard from "../components/SectionCard";
import attitudeSignals from "../data/attitudeSignals.json";
import examinerRules from "../data/examinerRules.json";
import questionTypes from "../data/questionTypes.json";
import trapPatterns from "../data/trapPatterns.json";

const groups = [
  { title: "题型规律", description: "先判断题型，再决定阅读动作。", items: questionTypes.slice(0, 4) },
  { title: "干扰项陷阱", description: "识别那些看起来熟悉、实际上越界的选项。", items: trapPatterns },
  { title: "作者态度与语气", description: "从措辞强弱判断作者评价。", items: attitudeSignals },
  { title: "命题套路", description: "总结命题人反复使用的组织方式。", items: examinerRules },
];

export default function ExaminerThinking() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">EXAMINER THINKING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">出题人思维</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        点击卡片展开详情。第一版先建立规律库的结构，后续可以继续补充例题。
      </p>

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
                const details = item.details ?? [item.detail];

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
