import { useMemo, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState";
import SectionCard from "../components/SectionCard";
import { getEnglishIIClozeByYear } from "../utils/englishIIDataAdapter";

const years = [2010, 2009, 2008, 2007];

export default function English2ClozeTraining() {
  const [year, setYear] = useState(2010);
  const items = useMemo(() => getEnglishIIClozeByYear(year), [year]);
  const [activeId, setActiveId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeBlank, setActiveBlank] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const item = items.find((entry) => entry.id === activeId);

  function start(nextId) {
    setActiveId(nextId);
    setAnswers({});
    setActiveBlank(1);
    setSubmitted(false);
  }

  if (!item) {
    return <div className="space-y-6">
      <div><p className="text-sm font-bold text-blue-600">ENGLISH II · CLOZE</p><h1 className="mt-2 text-3xl font-bold text-slate-900">英语二完形专项</h1></div>
      <div className="flex flex-wrap gap-2">{years.map((value) => <button key={value} type="button" onClick={() => { setYear(value); setActiveId(null); }} className={"rounded-xl px-4 py-2 text-sm font-bold " + (year === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>{value}</button>)}</div>
      {items.length ? items.map((entry) => <SectionCard key={entry.id} title={String(entry.year) + " 完形填空"} description={entry.compatibilityNote ?? "英语二真题"}>
        <p className="text-sm text-slate-600">20 个空 · 建议用时 {entry.estimatedTime ?? 15} 分钟</p><button type="button" onClick={() => start(entry.id)} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">开始训练</button>
      </SectionCard>) : <EmptyState title={String(year) + " 英语二完形待补充"} description="2010 年完形将在核对完全部题干、选项与答案后开放，暂不使用不可靠内容。" />}
    </div>;
  }

  const current = item.blanks.find((blank) => blank.id === activeBlank) ?? item.blanks[0];
  const score = item.blanks.filter((blank) => answers[blank.id] === blank.answer).length;
  return <div className="space-y-6">
    <button type="button" onClick={() => setActiveId(null)} className="text-sm font-bold text-blue-600">← 返回完形列表</button>
    <div><p className="text-sm font-bold text-blue-600">ENGLISH II · CLOZE</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{item.year} 完形填空</h1><p className="mt-2 text-sm text-slate-500">已完成 {Object.keys(answers).length}/20</p></div>
    {item.compatibilityNote && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{item.compatibilityNote}</p>}
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
      <SectionCard title="完形文章"><div className="rounded-2xl bg-slate-50 p-5 text-[15px] leading-9 text-slate-700">{item.passageParts.map((part, index) => part.type === "text" ? <span key={index}>{part.content}</span> : <button key={index} type="button" onClick={() => setActiveBlank(part.blankId)} className={"mx-1 inline-flex rounded-xl border px-2 py-1 text-sm font-bold " + (activeBlank === part.blankId ? "border-blue-600 bg-blue-600 text-white" : answers[part.blankId] ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-blue-200 bg-white text-blue-700")}>{part.blankId}. {answers[part.blankId] ? item.blanks.find((blank) => blank.id === part.blankId)?.options[answers[part.blankId]] : "请选择"}</button>)}</div></SectionCard>
      <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <SectionCard title={"第 " + current.id + " 空"}>
          <div className="grid gap-2">{Object.entries(current.options).map(([key, text]) => <button key={key} type="button" disabled={submitted} onClick={() => setAnswers((value) => ({ ...value, [current.id]: key }))} className={"rounded-xl border px-4 py-3 text-left text-sm " + (answers[current.id] === key ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-700") + (submitted && key === current.answer ? " border-emerald-400 bg-emerald-50" : "")}>{key}. {text}</button>)}</div>
          {submitted && <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">正确答案：{current.answer}。{current.explanation || "解析待补充"}</div>}
        </SectionCard>
        <div className="grid grid-cols-10 gap-1">{item.blanks.map((blank) => <button key={blank.id} type="button" onClick={() => setActiveBlank(blank.id)} className={"rounded-lg px-1 py-2 text-xs font-bold " + (answers[blank.id] ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>{blank.id}</button>)}</div>
        {submitted ? <p className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">本篇成绩：{score}/20</p> : <button type="button" onClick={() => setSubmitted(true)} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">提交答案</button>}
      </div>
    </div>
  </div>;
}
