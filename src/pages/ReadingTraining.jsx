import { useState } from "react";
import SectionCard from "../components/SectionCard";
import questionTypes from "../data/questionTypes.json";
import readingQuestions from "../data/readingQuestions.json";
import { addMistake, getMistakes } from "../utils/storage";

const analysisLabels = {
  questionType: "题型判断",
  intent: "出题意图",
  location: "原文定位",
  correct: "正确答案",
  paraphrase: "同义替换",
  distractors: "干扰项分析",
  rule: "命题规律",
  reminder: "做题提醒",
};

export default function ReadingTraining() {
  const [answers, setAnswers] = useState({});
  const [savedIds, setSavedIds] = useState(
    () => new Set(getMistakes().map((item) => item.id)),
  );

  function saveQuestion(question) {
    const selected = answers[question.id];
    if (!selected) return;

    addMistake({
      id: question.id,
      type: question.type,
      question: question.question,
      userAnswer: selected,
      correctAnswer: question.correctAnswer,
      reviewed: false,
    });
    setSavedIds((current) => new Set([...current, question.id]));
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">READING TRAINING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">阅读训练</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        先选择答案，再对照八个角度的解析。示例题均为本项目原创模拟内容。
      </p>

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

      <div className="mt-6 space-y-7">
        {readingQuestions.map((question, questionIndex) => {
          const selected = answers[question.id];
          const isSaved = savedIds.has(question.id);

          return (
            <SectionCard
              key={question.id}
              title={`模拟题 ${questionIndex + 1} · ${question.type}`}
            >
              <p className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {question.passage}
              </p>
              <h2 className="mt-5 font-bold leading-7 text-slate-900">
                {question.question}
              </h2>

              <div className="mt-4 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selected === option.label;
                  const isCorrect = option.label === question.correctAnswer;
                  let style =
                    "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50";

                  if (selected && isCorrect) {
                    style = "border-emerald-300 bg-emerald-50 text-emerald-800";
                  } else if (selected && isSelected) {
                    style = "border-rose-300 bg-rose-50 text-rose-800";
                  }

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: option.label,
                        }))
                      }
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${style}`}
                    >
                      <span className="mr-2 font-bold">{option.label}.</span>
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p
                      className={`font-bold ${
                        selected === question.correctAnswer
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {selected === question.correctAnswer
                        ? "回答正确"
                        : `回答错误，你选择了 ${selected}`}
                    </p>
                    <button
                      type="button"
                      disabled={isSaved}
                      onClick={() => saveQuestion(question)}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isSaved ? "已加入错题本" : "加入错题本"}
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {Object.entries(question.analysis).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-blue-100 bg-blue-50/60 p-4"
                      >
                        <p className="text-sm font-bold text-blue-800">
                          {analysisLabels[key]}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
