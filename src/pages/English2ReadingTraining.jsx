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

function highlightWord(sentence, word) {
  const index = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return sentence;
  return <>{sentence.slice(0, index)}<mark className="rounded bg-amber-200 px-1 font-bold text-slate-900">{sentence.slice(index, index + word.length)}</mark>{sentence.slice(index + word.length)}</>;
}

export default function English2ReadingTraining() {
  const years = useMemo(() => getEnglishIIYears(), []);
  const [year, setYear] = useState(years[0] ?? 2010);
  const papers = useMemo(() => getEnglishIIReadingsByYear(year), [year]);
  const [paperId, setPaperId] = useState(papers[0]?.id ?? "");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState("reading");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnswers, setWordAnswers] = useState({});
  const paper = papers.find((item) => item.id === paperId) ?? papers[0];
  const questions = paper?.questions ?? [];
  const vocabulary = paper?.vocabulary ?? [];
  const score = questions.filter((question) => answers[question.questionNumber] === question.answer).length;

  function resetTraining() {
    setAnswers({});
    setSubmitted(false);
    setMode("reading");
    setWordIndex(0);
    setWordAnswers({});
  }

  function selectYear(nextYear) {
    const nextPapers = getEnglishIIReadingsByYear(nextYear);
    setYear(nextYear);
    setPaperId(nextPapers[0]?.id ?? "");
    resetTraining();
  }

  function selectPaper(nextId) {
    setPaperId(nextId);
    resetTraining();
  }

  if (!paper) {
    return <EmptyState title="英语二阅读真题待补充" description="请先从英语二学习首页进入已接入的年份。" />;
  }

  if (mode === "vocabulary") {
    const finished = wordIndex >= vocabulary.length;
    const currentWord = vocabulary[wordIndex];
    const answerKey = currentWord ? `${wordIndex}-${currentWord.word}` : "";
    const selected = wordAnswers[answerKey];
    const wordScore = vocabulary.reduce((total, word, index) => total + (wordAnswers[`${index}-${word.word}`] === word.answer ? 1 : 0), 0);
    const accuracy = vocabulary.length ? Math.round((wordScore / vocabulary.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-7 text-white shadow-xl shadow-blue-100">
          <p className="text-xs font-bold tracking-[0.2em] text-blue-100">ENGLISH II VOCABULARY</p>
          <h1 className="mt-2 text-3xl font-bold">本篇重点词自测</h1>
          <p className="mt-2 text-sm leading-6 text-blue-50">{paper.year} {paper.textNumber}：结合原文语境，一次掌握一个核心词。</p>
        </section>

        <SectionCard title={finished ? "自测结果" : `词汇进度 ${wordIndex + 1}/${vocabulary.length}`} description={finished ? "本次结果只保留在当前页面，可重新测试。" : "先选中文语境义，再查看答案与解释。"}>
          {finished ? (
            <div className="space-y-5">
              <div className="rounded-3xl bg-blue-50 p-7 text-center">
                <p className="text-sm font-semibold text-blue-700">本篇重点词正确率</p>
                <p className="mt-2 text-4xl font-bold text-slate-900">{wordScore}/{vocabulary.length}</p>
                <p className="mt-1 text-sm text-slate-500">{accuracy}%</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => { setWordIndex(0); setWordAnswers({}); }} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">重新测试</button>
                <button type="button" onClick={() => setMode("reading")} className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700">返回阅读解析</button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6">
                <h2 className="text-4xl font-bold text-slate-900">{currentWord.word}</h2>
                <p className="mt-2 text-sm text-slate-500">{currentWord.phonetic} · {currentWord.partOfSpeech}</p>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                <p className="font-semibold text-slate-900">原文例句</p>
                <p className="mt-2 text-base">{highlightWord(currentWord.sentence, currentWord.word)}</p>
              </div>
              <div className="mt-5 grid gap-3">
                {Object.entries(currentWord.options ?? {}).map(([label, text]) => {
                  const isCorrect = selected && label === currentWord.answer;
                  const isWrong = selected === label && label !== currentWord.answer;
                  const style = isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : isWrong ? "border-rose-300 bg-rose-50 text-rose-800" : selected === label ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50";
                  return <button key={label} type="button" disabled={Boolean(selected)} onClick={() => setWordAnswers((current) => ({ ...current, [answerKey]: label }))} className={`rounded-xl border px-4 py-3 text-left text-sm transition disabled:cursor-default ${style}`}><span className="mr-2 font-bold">{label}.</span>{text}</button>;
                })}
              </div>
              {selected && <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700"><p>正确答案：<strong className="text-emerald-700">{currentWord.answer}. {currentWord.options[currentWord.answer]}</strong></p><p className="mt-2">语境义：<strong>{currentWord.meaningInContext}</strong></p><p className="mt-2">{currentWord.explanation}</p></div>}
              <div className="mt-5 flex flex-wrap justify-between gap-3">
                <button type="button" onClick={() => setMode("reading")} className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700">返回阅读解析</button>
                <button type="button" disabled={!selected} onClick={() => setWordIndex((current) => current + 1)} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">下一个单词</button>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-7 text-white shadow-xl shadow-blue-100">
        <p className="text-xs font-bold tracking-[0.2em] text-blue-100">ENGLISH II READING</p>
        <h1 className="mt-2 text-3xl font-bold">英语二阅读训练</h1>
        <p className="mt-2 text-sm leading-6 text-blue-50">完整语篇、连续 5 题、统一提交；2010 年已接入定位精读和每篇重点词自测。</p>
      </section>

      <SectionCard title="选择真题" description="先选年份，再选 Text 1—4。">
        <div className="flex flex-wrap gap-2">{years.map((item) => <button key={item} type="button" onClick={() => selectYear(item)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${year === item ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-blue-50"}`}>{item}</button>)}</div>
        <div className="mt-4 flex flex-wrap gap-2">{papers.map((item) => <button key={item.id} type="button" onClick={() => selectPaper(item.id)} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${paper.id === item.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-blue-200"}`}>{item.textNumber}</button>)}</div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(26rem,0.9fr)]">
        <SectionCard title={`${paper.year} 英语二 ${paper.textNumber} | ${paper.title || "阅读文章"}`} description={paper.topic ? `话题：${paper.topic}` : "文章阅读"}>
          <div className="max-h-[72vh] space-y-5 overflow-y-auto rounded-2xl bg-slate-50 p-5 text-[15px] leading-8 text-slate-700">
            {passageParagraphs(paper.passage).map((paragraph, index) => <p key={index}><span className="mr-2 rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">P{index + 1}</span>{paragraph}</p>)}
          </div>
        </SectionCard>

        <div className="space-y-4">
          {questions.map((question) => {
            const selected = answers[question.questionNumber];
            const correct = selected === question.answer;
            const thinking = question.examinerThinking;
            const sentenceTraining = question.sentenceTraining;
            return <SectionCard key={question.id} title={`${question.questionNumber}. ${question.questionText}`} description={question.location ? `定位：${question.location}` : "定位句待补充"}>
              <div className="space-y-2">{Object.entries(question.options).map(([key, value]) => <button key={key} type="button" onClick={() => !submitted && setAnswers((current) => ({ ...current, [question.questionNumber]: key }))} className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${selected === key ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-blue-300"}${submitted && key === question.answer ? " border-emerald-400 bg-emerald-50 text-emerald-800" : ""}${submitted && selected === key && !correct ? " border-rose-300 bg-rose-50 text-rose-800" : ""}`}><span className="mr-2 font-bold">{key}.</span>{value}</button>)}</div>
              {submitted && <div className={`mt-4 rounded-xl p-4 text-sm leading-6 ${correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}><p className="font-bold">{correct ? "回答正确" : `回答错误：你选 ${selected ?? "未作答"}，正确答案 ${question.answer}`}</p><p className="mt-2">题型：{question.type || "待补充"}</p><p>解析：{question.explanation || "待补充"}</p>{!correct && <p>常见错因：{question.commonMistake || "待补充"}</p>}{thinking && <div className="mt-3 rounded-lg bg-white/70 p-3 text-slate-700"><p className="font-bold">出题人思维</p><p>考查点：{thinking.testPoint}</p><p>干扰套路：{thinking.trap}</p><p>下次策略：{thinking.nextTimeStrategy}</p></div>}{sentenceTraining && <div className="mt-3 rounded-lg bg-amber-50 p-3 text-slate-700"><p className="font-bold text-amber-800">定位句精读</p><p className="mt-1">{sentenceTraining.sentence}</p><p>主干：{sentenceTraining.coreStructure}</p><p>参考：{sentenceTraining.translation}</p></div>}</div>}
            </SectionCard>;
          })}
          <div className="sticky bottom-4 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-lg backdrop-blur">
            {submitted ? <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-bold text-slate-900">本篇成绩：{score}/{questions.length}，正确率 {questions.length ? Math.round((score / questions.length) * 100) : 0}%</p><div className="flex flex-wrap gap-2">{vocabulary.length > 0 && <button type="button" onClick={() => setMode("vocabulary")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">进入本篇单词自测（{vocabulary.length}）</button>}<button type="button" onClick={resetTraining} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">重新作答</button></div></div> : <button type="button" onClick={() => setSubmitted(true)} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">提交答案（已作答 {Object.keys(answers).length}/{questions.length}）</button>}
          </div>
        </div>
      </div>
      <Link to="/english2" className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">返回英语二学习首页</Link>
    </div>
  );
}
