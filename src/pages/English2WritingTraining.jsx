import { useState } from "react";
import SectionCard from "../components/SectionCard";
import { getEnglishIIWritingByYear } from "../utils/englishIIDataAdapter";
import { getTrainingDraft, saveTrainingDraft } from "../utils/trainingStorage";

const years = [2010, 2009, 2008, 2007];
const modes = [
  { key: "smallWriting", label: "小作文" },
  { key: "bigWriting", label: "大作文" },
];

export default function English2WritingTraining() {
  const [year, setYear] = useState(2010);
  const [mode, setMode] = useState("smallWriting");
  const [showGuide, setShowGuide] = useState(false);
  const item = getEnglishIIWritingByYear(year);
  const task = item?.[mode];
  const draftKey = "english2-writing-" + year + "-" + mode;
  const [draft, setDraft] = useState(() => getTrainingDraft(draftKey));

  function selectYear(nextYear) {
    setYear(nextYear);
    setShowGuide(false);
    setDraft(getTrainingDraft("english2-writing-" + nextYear + "-" + mode));
  }
  function selectMode(nextMode) {
    setMode(nextMode);
    setShowGuide(false);
    setDraft(getTrainingDraft("english2-writing-" + year + "-" + nextMode));
  }
  function update(value) {
    setDraft(value);
    saveTrainingDraft(draftKey, value);
  }

  return <div className="space-y-6">
    <div><p className="text-sm font-bold text-blue-600">ENGLISH II · WRITING</p><h1 className="mt-2 text-3xl font-bold text-slate-900">英语二写作训练</h1><p className="mt-2 text-sm text-slate-500">按年份选择小作文或大作文，在本地完成草稿。</p></div>
    <div className="flex flex-wrap gap-2">{years.map((value) => <button key={value} type="button" onClick={() => selectYear(value)} className={"rounded-xl px-4 py-2 text-sm font-bold " + (year === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>{value}</button>)}</div>
    <div className="flex gap-2">{modes.map((entry) => <button key={entry.key} type="button" onClick={() => selectMode(entry.key)} className={"rounded-xl px-4 py-2 text-sm font-bold " + (mode === entry.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>{entry.label}</button>)}</div>
    {!task?.prompt ? <SectionCard title={String(year) + " 写作训练"}><p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">该年份英语二写作数据待补充。</p></SectionCard> : <SectionCard title={String(year) + " " + modes.find((entry) => entry.key === mode).label} description={item.compatibilityNote ?? "英语二真题"}>
      <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-800"><p className="font-bold">题目要求</p><p className="mt-2 whitespace-pre-wrap">{task.prompt}</p></div>
      <textarea value={draft} onChange={(event) => update(event.target.value)} rows={12} placeholder="在这里输入你的英文作文，本地会自动保存。" className="mt-5 w-full rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
      <button type="button" onClick={() => setShowGuide((value) => !value)} className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{showGuide ? "收起写作要点" : "查看写作要点"}</button>
      {showGuide && <div className="mt-5 grid gap-4 md:grid-cols-2">{[["写作思路", task.writingIdeas], ["文章结构", task.structure], ["可用表达", task.usefulExpressions], ["常见扣分点", task.commonMistakes]].map(([title, entries]) => <div key={title} className="rounded-2xl bg-slate-50 p-4"><p className="font-bold text-slate-900">{title}</p><ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">{(entries.length ? entries : ["待补充"]).map((entry) => <li key={entry}>• {entry}</li>)}</ul></div>)}</div>}
    </SectionCard>}
  </div>;
}
