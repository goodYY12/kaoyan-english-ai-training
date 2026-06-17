import { useState } from "react";
import SectionCard from "../components/SectionCard";
import { getExamYears, getWritingByYear, hasWritingData } from "../utils/dataAdapter";
import { getTrainingDraft, saveTrainingDraft } from "../utils/trainingStorage";

const essayTypes = [
  { key: "smallWriting", label: "小作文" },
  { key: "bigWriting", label: "大作文" },
];

function normalizeWritingTask(item, essayKey) {
  const label = essayTypes.find((entry) => entry.key === essayKey)?.label ?? "小作文";
  const structured = item[essayKey];
  if (structured) {
    return {
      id: `${item.year}-${essayKey}`,
      type: label,
      prompt: structured.prompt ?? "",
      taskType: structured.taskType ?? structured.topic ?? "",
      writingIdeas: structured.writingIdeas ?? [],
      structure: structured.structure ?? [],
      usefulExpressions: structured.usefulExpressions ?? [],
      commonMistakes: structured.commonMistakes ?? [],
      sampleEssay: structured.sampleEssay ?? "",
    };
  }

  const legacy = item.tasks?.find((entry) => entry.type === label);
  return {
    id: legacy?.id ?? `${item.year}-${essayKey}`,
    type: label,
    prompt: legacy?.prompt ?? "",
    taskType: legacy?.taskType ?? "",
    writingIdeas: legacy?.writingIdeas ?? [],
    structure: Array.isArray(legacy?.structure)
      ? legacy.structure
      : legacy?.structure
        ? [legacy.structure]
        : [],
    usefulExpressions: legacy?.usefulExpressions ?? legacy?.expressions ?? [],
    commonMistakes: Array.isArray(legacy?.commonMistakes)
      ? legacy.commonMistakes
      : legacy?.deductions
        ? [legacy.deductions]
        : [],
    sampleEssay: legacy?.sampleEssay ?? "",
  };
}

function ListBlock({ title, items }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
        {(items.length ? items : ["待补充"]).map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function WritingTraining() {
  const years = getExamYears();
  const [year, setYear] = useState(years[0] ?? 2026);
  const [essayKey, setEssayKey] = useState("smallWriting");
  const [showGuide, setShowGuide] = useState(false);
  const item = getWritingByYear(year);
  const hasData = hasWritingData(item);
  const task = normalizeWritingTask(item, essayKey);
  const draftId = `writing-${task.id}`;
  const [content, setContent] = useState(() => getTrainingDraft(draftId));

  function chooseYear(nextYear) {
    const nextItem = getWritingByYear(nextYear);
    const nextTask = normalizeWritingTask(nextItem, essayKey);
    setYear(Number(nextYear));
    setShowGuide(false);
    setContent(getTrainingDraft(`writing-${nextTask.id}`));
  }

  function chooseEssayKey(nextKey) {
    const nextTask = normalizeWritingTask(item, nextKey);
    setEssayKey(nextKey);
    setShowGuide(false);
    setContent(getTrainingDraft(`writing-${nextTask.id}`));
  }

  function updateContent(value) {
    setContent(value);
    saveTrainingDraft(draftId, value);
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">WRITING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">写作训练</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        选择年份和题型，输入自己的作文，再查看写作思路、结构、表达和扣分点。
      </p>

      <div className="mt-6 grid gap-3 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm shadow-slate-200/60 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          选择年份
          <select
            value={year}
            onChange={(event) => chooseYear(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item} 考研英语一
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          训练类型
          <select
            value={essayKey}
            onChange={(event) => chooseEssayKey(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {essayTypes.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SectionCard className="mt-7" title={`${year} ${task.type}`}>
        {!hasData || !task.prompt ? (
          <p className="rounded-2xl bg-amber-50 p-5 text-sm font-medium text-amber-700">
            该年份写作真题数据待补充。
          </p>
        ) : (
          <>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              <p className="font-bold text-slate-900">题目要求</p>
              <p className="mt-2 whitespace-pre-wrap">{task.prompt}</p>
            </div>
            <textarea
              value={content}
              onChange={(event) => updateContent(event.target.value)}
              rows={10}
              placeholder="在这里输入你的作文，内容会自动暂存在本机浏览器..."
              className="mt-5 w-full resize-y rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowGuide((current) => !current)}
              className="mt-4 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
            >
              {showGuide ? "收起写作思路" : "查看写作思路"}
            </button>
            {showGuide && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ListBlock title="写作思路" items={task.writingIdeas} />
                <ListBlock title="文章结构" items={task.structure} />
                <ListBlock title="可用表达" items={task.usefulExpressions} />
                <ListBlock title="常见扣分点" items={task.commonMistakes} />
                <div className="rounded-2xl bg-emerald-50 p-4 md:col-span-2">
                  <h3 className="font-bold text-emerald-800">参考范文占位</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {task.sampleEssay || "待补充"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </div>
  );
}
