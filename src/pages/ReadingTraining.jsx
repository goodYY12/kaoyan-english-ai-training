import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import questionTypes from "../data/questionTypes.json";
import text1 from "../data/papers/2026/text1.json";
import text2 from "../data/papers/2026/text2.json";
import text3 from "../data/papers/2026/text3.json";
import text4 from "../data/papers/2026/text4.json";
import { addMistake, getMistakes } from "../utils/storage";

const papers = [text1, text2, text3, text4];
const years = [...new Set(papers.map((paper) => paper.year))];

function getQuestionId(paper, question) {
  return `${paper.year}-${paper.textNumber.toLowerCase().replace(" ", "-")}-${question.questionNumber}`;
}

export default function ReadingTraining() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedTextNumber, setSelectedTextNumber] = useState("Text 1");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [savedIds, setSavedIds] = useState(
    () => new Set(getMistakes().map((item) => item.id)),
  );

  const availableTexts = useMemo(
    () => papers.filter((paper) => paper.year === Number(selectedYear)),
    [selectedYear],
  );

  const currentPaper =
    availableTexts.find((paper) => paper.textNumber === selectedTextNumber) ??
    availableTexts[0];

  const score = currentPaper.questions.reduce((total, question) => {
    return answers[question.questionNumber] === question.answer
      ? total + 1
      : total;
  }, 0);

  function chooseYear(year) {
    const firstPaper = papers.find((paper) => paper.year === Number(year));
    setSelectedYear(Number(year));
    setSelectedTextNumber(firstPaper?.textNumber ?? "Text 1");
    resetTraining();
  }

  function chooseText(textNumber) {
    setSelectedTextNumber(textNumber);
    resetTraining();
  }

  function resetTraining() {
    setAnswers({});
    setSubmitted(false);
    setShowAnalysis(true);
  }

  function saveQuestion(question) {
    const id = getQuestionId(currentPaper, question);
    const selected = answers[question.questionNumber] ?? "未作答";

    addMistake({
      id,
      type: question.questionType,
      question: `${currentPaper.year} ${currentPaper.textNumber} - ${question.questionNumber}. ${question.questionText}`,
      userAnswer: selected,
      correctAnswer: question.answer,
      reviewed: false,
    });
    setSavedIds((current) => new Set([...current, id]));
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">READING TRAINING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        完整阅读训练
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        选择年份和 Text，先完整读完一篇文章，再连续完成 5 道选择题。
        提交后统一查看得分、定位、解析和做题思路。
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_2fr]">
        <label className="text-sm font-semibold text-slate-700">
          年份
          <select
            value={selectedYear}
            onChange={(event) => chooseYear(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year} 考研英语一
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="text-sm font-semibold text-slate-700">选择篇目</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableTexts.map((paper) => {
              const isActive = paper.textNumber === currentPaper.textNumber;
              return (
                <button
                  key={paper.textNumber}
                  type="button"
                  onClick={() => chooseText(paper.textNumber)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {paper.textNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {questionTypes.map((type) => (
          <span
            key={type.name}
            title={type.detail}
            className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
          >
            {type.name}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <SectionCard
          title={`${currentPaper.year} ${currentPaper.textNumber}｜${currentPaper.title}`}
        >
          <div className="max-h-[72vh] overflow-y-auto rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 md:p-5">
            {currentPaper.passage.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <p className="rounded-xl bg-blue-50 p-3">
              篇章结构：{currentPaper.articleStructure}
            </p>
            <p className="rounded-xl bg-emerald-50 p-3">
              高频词：{currentPaper.vocabulary.slice(0, 5).join(" / ")}
            </p>
            <p className="rounded-xl bg-amber-50 p-3">
              长难句：{currentPaper.longSentences[0]?.analysis}
            </p>
          </div>
        </SectionCard>

        <SectionCard title="选择题">
          <div className="space-y-5">
            {currentPaper.questions.map((question) => {
              const selected = answers[question.questionNumber];
              const isCorrect = submitted && selected === question.answer;
              const isWrong = submitted && selected !== question.answer;
              const mistakeId = getQuestionId(currentPaper, question);
              const isSaved = savedIds.has(mistakeId);

              return (
                <article
                  key={question.questionNumber}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="max-w-xl text-sm font-bold leading-6 text-slate-900">
                      {question.questionNumber}. {question.questionText}
                    </h2>
                    {submitted && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isCorrect
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isCorrect ? "正确" : "错误"}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid gap-2">
                    {Object.entries(question.options).map(([label, text]) => {
                      const isSelected = selected === label;
                      const isAnswer = submitted && question.answer === label;
                      let style =
                        "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50";

                      if (isAnswer) {
                        style =
                          "border-emerald-300 bg-emerald-50 text-emerald-800";
                      } else if (submitted && isSelected) {
                        style = "border-rose-300 bg-rose-50 text-rose-800";
                      } else if (isSelected) {
                        style = "border-blue-300 bg-blue-50 text-blue-800";
                      }

                      return (
                        <button
                          key={label}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.questionNumber]: label,
                            }))
                          }
                          className={`rounded-xl border px-3 py-2 text-left text-sm transition disabled:cursor-default ${style}`}
                        >
                          <span className="mr-2 font-bold">{label}.</span>
                          {text}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && showAnalysis && (
                    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                      <div className="grid gap-2 text-sm sm:grid-cols-3">
                        <p className="rounded-xl bg-slate-50 p-3 text-slate-600">
                          你的选择：
                          <strong className={isWrong ? "text-rose-700" : ""}>
                            {selected ?? "未作答"}
                          </strong>
                        </p>
                        <p className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                          正确答案：<strong>{question.answer}</strong>
                        </p>
                        <p className="rounded-xl bg-blue-50 p-3 text-blue-700">
                          题型：<strong>{question.questionType}</strong>
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                        <p>
                          <strong>原文定位：</strong>
                          {question.location}
                        </p>
                        <p className="mt-2">
                          <strong>解析：</strong>
                          {question.explanation}
                        </p>
                        <p className="mt-2">
                          <strong>做题思路：</strong>
                          {question.thinkingMethod}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isSaved}
                        onClick={() => saveQuestion(question)}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {isSaved ? "已加入错题本" : "加入错题本"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="sticky bottom-4 mt-6 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-lg backdrop-blur">
            {submitted ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-bold text-slate-900">
                  本篇得分：
                  <span className="text-blue-600">{score}/5</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAnalysis((value) => !value)}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    {showAnalysis ? "隐藏解析" : "查看解析"}
                  </button>
                  <button
                    type="button"
                    onClick={resetTraining}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    重新作答
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  已作答 {Object.keys(answers).length}/5。提交后才会显示解析。
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  提交答案
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
