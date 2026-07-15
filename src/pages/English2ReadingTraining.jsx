import { useMemo, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState";
import SectionCard from "../components/SectionCard";
import {
  getEnglishIIReadingsByYear,
  getEnglishIIYears,
} from "../utils/englishIIDataAdapter";

function passageParagraphs(passage) {
  return String(passage ?? "").split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
}

export default function English2ReadingTraining() {
  const years = useMemo(() => getEnglishIIYears(), []);
  const [year, setYear] = useState(years[0] ?? 2010);
  const papers = useMemo(() => getEnglishIIReadingsByYear(year), [year]);
  const [paperId, setPaperId] = useState(papers[0]?.id ?? "");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const paper = papers.find((item) => item.id === paperId) ?? papers[0];
  const questions = paper?.questions ?? [];
  const score = questions.filter((question) => answers[question.questionNumber] === question.answer).length;

  function selectYear(nextYear) {
    const nextPapers = getEnglishIIReadingsByYear(nextYear);
    setYear(nextYear);
    setPaperId(nextPapers[0]?.id ?? "");
    setAnswers({});
    setSubmitted(false);
  }

  function selectPaper(nextId) {
    setPaperId(nextId);
    setAnswers({});
    setSubmitted(false);
  }

  if (!paper) {
    return <EmptyState title="英语二阅读真题待补充" description="请先从英语二学习首页进入已接入的年份。" />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-7 text-white shadow-xl shadow-blue-100">
        <p className="text-xs font-bold tracking-[0.2em] text-blue-100">ENGLISH II · READING</p>
        <h1 className="mt-2 text-3xl font-bold">英语二阅读训练</h1>
        <p className="mt-2 text-sm leading-6 text-blue-50">完整语篇、连续 5 题、统一提交。英语一和英语二题库在这里完全分开。</p>
      </section>

      <SectionCard title="选择真题" description="先选年份，再选 Text 1—4。">
        <div className="flex flex-wrap gap-2">
          {years.map((item) => <button key={item} type="button" onClick={() => selectYear(item)} className={"rounded-xl px-4 py-2 text-sm font-semibold " + (year === item ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-blue-50")}>{item}</button>)}
        </div>
        {paper.compatibilityNote && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{paper.compatibilityNote}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {papers.map((item) => <button key={item.id} type="button" onClick={() => selectPaper(item.id)} className={"rounded-xl border px-4 py-2 text-sm font-semibold " + (paper.id === item.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-blue-200")}>{item.textNumber}</button>)}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(26rem,0.9fr)]">
        <SectionCard title={String(paper.year) + " 英语二 " + paper.textNumber + " | " + (paper.title || "阅读文章")} description={paper.topic ? "话题：" + paper.topic : "文章阅读"}>
          <div className="max-h-[72vh] space-y-5 overflow-y-auto rounded-2xl bg-slate-50 p-5 text-[15px] leading-8 text-slate-700">
            {passageParagraphs(paper.passage).map((paragraph, index) => <p key={index}><span className="mr-2 rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">P{index + 1}</span>{paragraph}</p>)}
          </div>
        </SectionCard>

        <div className="space-y-4">
          {questions.map((question) => {
            const selected = answers[question.questionNumber];
            const correct = selected === question.answer;
            return (
              <SectionCard key={question.id} title={String(question.questionNumber) + ". " + question.questionText} description={question.location ? "定位：" + question.location : "定位句待补充"}>
                <div className="space-y-2">
                  {Object.entries(question.options).map(([key, value]) => <button key={key} type="button" onClick={() => !submitted && setAnswers((current) => ({ ...current, [question.questionNumber]: key }))} className={"w-full rounded-xl border px-4 py-3 text-left text-sm transition " + (selected === key ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-blue-300") + (submitted && key === question.answer ? " border-emerald-400 bg-emerald-50 text-emerald-800" : "") + (submitted && selected === key && !correct ? " border-rose-300 bg-rose-50 text-rose-800" : "")}><span className="mr-2 font-bold">{key}.</span>{value}</button>)}
                </div>
                {submitted && <div className={"mt-4 rounded-xl p-4 text-sm leading-6 " + (correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800")}><p className="font-bold">{correct ? "回答正确" : "回答错误：你选 " + (selected ?? "未作答") + "，正确答案 " + question.answer}</p><p className="mt-2">题型：{question.type || "待补充"}</p><p>解析：{question.explanation || "待补充"}</p>{!correct && <p>常见错因：{question.commonMistake || "待补充"}</p>}</div>}
              </SectionCard>
            );
          })}
          <div className="sticky bottom-4 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-lg backdrop-blur">
            {submitted ? <div className="flex items-center justify-between gap-3"><p className="font-bold text-slate-900">本篇成绩：{score}/{questions.length}，正确率 {questions.length ? Math.round((score / questions.length) * 100) : 0}%</p><button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">重新作答</button></div> : <button type="button" onClick={() => setSubmitted(true)} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">提交答案（已作答 {Object.keys(answers).length}/{questions.length}）</button>}
          </div>
        </div>
      </div>
      <Link to="/english2" className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">返回英语二学习首页</Link>
    </div>
  );
}
