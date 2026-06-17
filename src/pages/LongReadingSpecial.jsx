import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import { getLongReadingSpecials } from "../utils/dataAdapter";
import { saveReadingRecord } from "../utils/trainingStorage";

function createMistake(reading, question, selected) {
  return {
    id: question.id,
    year: reading.year,
    textNumber: reading.textNumber,
    questionNumber: question.questionNumber,
    question: question.questionText,
    options: question.options,
    type: question.type,
    userAnswer: selected ?? "未作答",
    correctAnswer: question.answer,
    wrongReason: question.commonMistake,
    location: question.location,
    targetParagraph: question.targetParagraph,
    explanation: question.explanation,
    trapAnalysis: question.trapAnalysis,
    examinerThinking: question.examinerThinking,
    sourceSentenceAnalysis: question.sourceSentenceAnalysis,
    completedAt: new Date().toISOString(),
    mastered: false,
  };
}

function getAccuracy(correct, total) {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export default function LongReadingSpecial() {
  const specials = useMemo(() => getLongReadingSpecials({ limit: 2 }), []);
  const [activeId, setActiveId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const activeReading = specials.find((item) => item.id === activeId);

  function startTraining(id) {
    setActiveId(id);
    setAnswers({});
    setSubmitted(false);
  }

  function backHome() {
    setActiveId(null);
    setAnswers({});
    setSubmitted(false);
  }

  function submitAnswers() {
    const correct = activeReading.questions.filter(
      (question) => answers[question.questionNumber] === question.answer,
    ).length;
    const mistakes = activeReading.questions
      .filter((question) => answers[question.questionNumber] !== question.answer)
      .map((question) =>
        createMistake(activeReading, question, answers[question.questionNumber]),
      );

    saveReadingRecord({
      id: `long-${activeReading.id}-${Date.now()}`,
      year: activeReading.year,
      textNumber: activeReading.textNumber,
      readingId: activeReading.id,
      mode: "long-reading-special",
      total: activeReading.questions.length,
      correct,
      accuracy: getAccuracy(correct, activeReading.questions.length),
      submittedAt: new Date().toISOString(),
      answers,
      mistakes,
    });
    setSubmitted(true);
  }

  if (!activeReading) {
    return (
      <div>
        <p className="text-sm font-semibold text-blue-600">LONG READING</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">长篇专项</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          先用已经录入且带词汇数据的两篇真题做试点，验证做题、结构、定位句和词汇复盘体验。
        </p>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {specials.map((reading) => (
            <SectionCard
              key={reading.id}
              title={`${reading.year} ${reading.textNumber}`}
              description={reading.title || "未命名文章"}
              action={
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {reading.questions.length} 题
                </span>
              }
            >
              <div className="space-y-4">
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p className="rounded-xl bg-slate-50 p-3">
                    文章话题：<strong>{reading.topic || "待标注"}</strong>
                  </p>
                  <p className="rounded-xl bg-slate-50 p-3">
                    段落数量：<strong>{reading.paragraphs.length}</strong>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">训练重点</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reading.focusPoints.map((point) => (
                      <span
                        key={point}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startTraining(reading.id)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  开始训练
                </button>
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    );
  }

  const correct = activeReading.questions.filter(
    (question) => answers[question.questionNumber] === question.answer,
  ).length;
  const wrongQuestions = activeReading.questions.filter(
    (question) => submitted && answers[question.questionNumber] !== question.answer,
  );
  const accuracy = getAccuracy(correct, activeReading.questions.length);

  return (
    <div>
      <button
        type="button"
        onClick={backHome}
        className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
      >
        ← 返回长篇专项
      </button>

      <div className="mt-5">
        <p className="text-sm font-semibold text-blue-600">LONG READING</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {activeReading.year} {activeReading.textNumber}｜{activeReading.title || "未命名文章"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          左侧读文章，右侧集中做 5 道题。手机端会自动上下排列。
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <SectionCard title="文章">
          <div className="max-h-[76vh] space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 md:p-5">
            {activeReading.paragraphs.map((paragraph) => (
              <article key={paragraph.label} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-bold text-blue-700">{paragraph.label}</p>
                <p className="mt-2">{paragraph.text}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="题目">
          <div className="space-y-5">
            {activeReading.questions.map((question) => {
              const selected = answers[question.questionNumber];
              const isCorrect = submitted && selected === question.answer;

              return (
                <article key={question.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-bold leading-6 text-slate-900">
                      {question.questionNumber}. {question.questionText}
                    </h2>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {question.targetParagraph ? `定位段落 ${question.targetParagraph}` : "定位段落待补充"}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {Object.entries(question.options).map(([label, text]) => {
                      const isSelected = selected === label;
                      const isAnswer = submitted && question.answer === label;
                      const style = isAnswer
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : submitted && isSelected
                          ? "border-rose-300 bg-rose-50 text-rose-800"
                          : isSelected
                            ? "border-blue-300 bg-blue-50 text-blue-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50";

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

                  {submitted && (
                    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <p className="rounded-xl bg-slate-50 p-3">
                          用户选择：<strong>{selected ?? "未作答"}</strong>
                        </p>
                        <p className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                          正确答案：<strong>{question.answer}</strong>
                        </p>
                        <p className={`rounded-xl p-3 ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                          {isCorrect ? "答对" : "答错"}
                        </p>
                      </div>
                      <p>题型：{question.type}</p>
                      <p>解析：{question.explanation}</p>
                      <p>常见错因：{question.commonMistake}</p>
                      <p>定位段落：{question.targetParagraph ?? "待补充"}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="sticky bottom-4 mt-6 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-lg backdrop-blur">
            {submitted ? (
              <p className="text-lg font-bold text-slate-900">
                本篇结果：{correct}/{activeReading.questions.length}，正确率 {accuracy}%
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  已作答 {Object.keys(answers).length}/{activeReading.questions.length}
                </p>
                <button
                  type="button"
                  onClick={submitAnswers}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  提交答案
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {submitted && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionCard title="文章结构图" description="后续可以把每段 role/summary 细化成真正的结构图。">
            {activeReading.structureMap.length > 0 ? (
              <div className="space-y-3">
                {activeReading.structureMap.map((item) => (
                  <div key={item.paragraph} className="rounded-xl bg-blue-50 p-4 text-sm">
                    <p className="font-bold text-blue-700">{item.paragraph} · {item.role}</p>
                    <p className="mt-2 text-slate-600">{item.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                该文章结构图待补充。
              </p>
            )}
          </SectionCard>

          <SectionCard title="段落功能">
            <div className="space-y-3">
              {activeReading.paragraphs.map((paragraph) => (
                <div key={paragraph.label} className="rounded-xl bg-slate-50 p-4 text-sm">
                  <p className="font-bold text-slate-900">{paragraph.label}</p>
                  <p className="mt-2 text-slate-500">段落功能待补充。</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="错题定位句精读">
            {wrongQuestions.length === 0 ? (
              <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                本篇没有错题。可以继续看词汇复盘。
              </p>
            ) : (
              <div className="space-y-3">
                {wrongQuestions.map((question) => (
                  <div key={question.id} className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-slate-700">
                    <p className="font-bold text-amber-800">
                      第 {question.questionNumber} 题 · {question.targetParagraph ?? "定位段落待补充"}
                    </p>
                    <p className="mt-2">定位句：{question.location ?? "待补充"}</p>
                    {question.sourceSentenceAnalysis ? (
                      <>
                        <p className="mt-2">主干：{question.sourceSentenceAnalysis.coreStructure}</p>
                        <p className="mt-2">翻译：{question.sourceSentenceAnalysis.translation}</p>
                      </>
                    ) : (
                      <p className="mt-2">该题长难句分析待补充。</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="核心词汇 / 熟词僻义">
            <div className="grid gap-3 sm:grid-cols-2">
              {activeReading.vocabulary.slice(0, 12).map((word) => (
                <div key={`${word.word}-${word.category}`} className="rounded-xl border border-slate-200 p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-slate-900">{word.word}</p>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {word.category ?? "核心词汇"}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">语境义：{word.meaningInContext ?? word.meaning ?? "待补充"}</p>
                  <p className="mt-2 text-slate-500">{word.sentence ?? "原文例句待补充"}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
