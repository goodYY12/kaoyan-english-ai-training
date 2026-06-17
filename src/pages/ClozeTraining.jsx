import { useMemo, useRef, useState } from "react";
import SectionCard from "../components/SectionCard";
import { getAllClozeItems } from "../utils/dataAdapter";
import { saveReadingRecord } from "../utils/trainingStorage";

function countBy(items, key) {
  return items.reduce((result, item) => {
    const value = item[key] ?? "待补充";
    return { ...result, [value]: (result[value] ?? 0) + 1 };
  }, {});
}

function getAccuracy(correct, total) {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

function createMistake(item, blank, selected) {
  return {
    id: `${item.id}-blank-${blank.id}`,
    source: "完形专项",
    mode: "cloze",
    year: item.year,
    textNumber: "完形填空",
    questionNumber: blank.id,
    question: `完形第 ${blank.id} 空`,
    options: blank.options,
    type: blank.type,
    userAnswer: selected ?? "未作答",
    correctAnswer: blank.answer,
    wrongReason: blank.commonMistake,
    location: blank.clue,
    explanation: blank.explanation,
    trapAnalysis: blank.strategy,
    examinerThinking: blank.examinerThinking ?? null,
    completedAt: new Date().toISOString(),
    mastered: false,
  };
}

export default function ClozeTraining() {
  const clozeItems = useMemo(() => getAllClozeItems(), []);
  const [activeId, setActiveId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeBlankId, setActiveBlankId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const blankRefs = useRef({});
  const activeItem = clozeItems.find((item) => item.id === activeId);

  function startTraining(id) {
    setActiveId(id);
    setAnswers({});
    setSubmitted(false);
    setActiveBlankId(1);
    setStartedAt(Date.now());
  }

  function backHome() {
    setActiveId(null);
    setAnswers({});
    setSubmitted(false);
    setActiveBlankId(null);
    setStartedAt(null);
  }

  function jumpToBlank(id) {
    setActiveBlankId(id);
    blankRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function submitAnswers() {
    const unanswered = activeItem.blanks.filter((blank) => !answers[blank.id]);
    if (
      unanswered.length > 0 &&
      !window.confirm(`还有 ${unanswered.length} 个空未完成，确定继续提交吗？`)
    ) {
      return;
    }

    const correct = activeItem.blanks.filter(
      (blank) => answers[blank.id] === blank.answer,
    ).length;
    const mistakes = activeItem.blanks
      .filter((blank) => answers[blank.id] !== blank.answer)
      .map((blank) => createMistake(activeItem, blank, answers[blank.id]));

    saveReadingRecord({
      id: `cloze-${activeItem.id}-${Date.now()}`,
      mode: "cloze",
      year: activeItem.year,
      textNumber: "完形填空",
      readingId: activeItem.id,
      total: activeItem.blanks.length,
      correct,
      accuracy: getAccuracy(correct, activeItem.blanks.length),
      durationSeconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : null,
      submittedAt: new Date().toISOString(),
      answers,
      mistakes,
    });
    setSubmitted(true);
  }

  if (!activeItem) {
    return (
      <div>
        <p className="text-sm font-semibold text-blue-600">CLOZE TRAINING</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">完形专项</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          先用明确标注的模拟数据验证完形做题体验：20 个空、内嵌选择、提交后解析和错因统计。
        </p>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {clozeItems.map((item) => (
            <SectionCard
              key={item.id}
              title={`${item.year} · ${item.title}`}
              description={`${item.paper} · ${item.sourceType}数据`}
              action={
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.sourceType === "模拟"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {item.sourceType}
                </span>
              }
            >
              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <p className="rounded-2xl border border-slate-100 bg-slate-50 p-3">空数：{item.blanks.length}</p>
                <p className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  建议用时：{item.estimatedTime} 分钟
                </p>
                <p className="rounded-2xl border border-slate-100 bg-slate-50 p-3">难度：{item.difficulty}</p>
                <p className="rounded-2xl border border-slate-100 bg-slate-50 p-3">试卷类型：{item.paper}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-700">训练重点</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.focusPoints.map((point) => (
                    <span
                      key={point}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => startTraining(item.id)}
                className="mt-5 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
              >
                开始训练
              </button>
            </SectionCard>
          ))}
        </div>
      </div>
    );
  }

  const activeBlank = activeItem.blanks.find((blank) => blank.id === activeBlankId);
  const completedCount = Object.keys(answers).length;
  const correct = activeItem.blanks.filter(
    (blank) => answers[blank.id] === blank.answer,
  ).length;
  const wrongBlanks = activeItem.blanks.filter(
    (blank) => submitted && answers[blank.id] !== blank.answer,
  );
  const typeStats = countBy(wrongBlanks, "type");
  const reasonStats = countBy(wrongBlanks, "commonMistake");
  const topTypes = Object.entries(typeStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([type]) => type);
  const diagnosis =
    wrongBlanks.length === 0
      ? "本篇完形全对，建议继续复盘固定搭配和语篇逻辑。"
      : `你本篇主要问题是${topTypes.join("和")}。建议先判断空格前后的搭配，再看选项词义差异和上下文逻辑。`;

  return (
    <div>
      <button
        type="button"
        onClick={backHome}
        className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
      >
        ← 返回完形专项
      </button>

      <div className="mt-5">
        <p className="text-sm font-semibold text-blue-600">CLOZE TRAINING</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {activeItem.year} {activeItem.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {activeItem.sourceType}数据 · 建议 {activeItem.estimatedTime} 分钟 · 已完成 {completedCount}/{activeItem.blanks.length}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <SectionCard title="完形文章">
          <div className="rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-5 text-base leading-9 text-slate-700 md:p-6">
            {activeItem.passageParts.map((part, index) => {
              if (part.type === "text") {
                return <span key={`${part.content}-${index}`}>{part.content}</span>;
              }

              const blank = activeItem.blanks.find((item) => item.id === part.blankId);
              const selected = answers[part.blankId];
              const selectedWord = selected ? blank?.options[selected] : "";
              return (
                <button
                  key={`blank-${part.blankId}`}
                  ref={(element) => {
                    blankRefs.current[part.blankId] = element;
                  }}
                  type="button"
                  onClick={() => setActiveBlankId(part.blankId)}
                  className={`mx-1 inline-flex min-w-28 items-center justify-center rounded-2xl border px-2.5 py-1 text-sm font-semibold transition ${
                    activeBlankId === part.blankId
                      ? "border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : selected
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {part.blankId}. {selectedWord || "请选择"}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="当前空格选项">
            {activeBlank ? (
              <div>
                <p className="text-sm font-bold text-slate-900">
                  第 {activeBlank.id} 空 · {activeBlank.type}
                </p>
                <div className="mt-4 grid gap-2">
                  {Object.entries(activeBlank.options).map(([label, text]) => {
                    const selected = answers[activeBlank.id] === label;
                    const isAnswer = submitted && activeBlank.answer === label;
                    const style = isAnswer
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : submitted && selected
                        ? "border-rose-300 bg-rose-50 text-rose-800"
                        : selected
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
                            [activeBlank.id]: label,
                          }))
                        }
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition disabled:cursor-default ${style}`}
                      >
                        <span className="mr-2 font-bold">{label}.</span>
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">点击文章中的空格开始选择。</p>
            )}
          </SectionCard>

          <SectionCard title="答题卡">
            <div className="grid grid-cols-5 gap-2">
              {activeItem.blanks.map((blank) => (
                <button
                  key={blank.id}
                  type="button"
                  onClick={() => jumpToBlank(blank.id)}
                  className={`rounded-2xl px-2 py-2 text-sm font-bold transition ${
                    activeBlankId === blank.id
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : answers[blank.id]
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {blank.id}
                </button>
              ))}
            </div>
            {!submitted ? (
              <button
                type="button"
                onClick={submitAnswers}
                className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
              >
                提交答案
              </button>
            ) : (
              <div className="mt-5 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                <p className="text-lg font-bold text-slate-900">
                  {correct}/{activeItem.blanks.length} · 正确率 {getAccuracy(correct, activeItem.blanks.length)}%
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{diagnosis}</p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {submitted && (
        <div className="mt-6 space-y-6">
          <SectionCard title="错因统计">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4">
                <h3 className="font-bold text-blue-800">本篇错题分布</h3>
                {Object.entries(typeStats).length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">本篇无错题。</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {Object.entries(typeStats).map(([type, count]) => (
                      <li key={type}>{type}：{count} 个</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <h3 className="font-bold text-amber-800">高频错因</h3>
                {Object.entries(reasonStats).length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">本篇无错因记录。</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {Object.entries(reasonStats).map(([reason, count]) => (
                      <li key={reason}>{reason}：{count} 次</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="详细解析">
            <div className="space-y-4">
              {activeItem.blanks.map((blank) => {
                const selected = answers[blank.id];
                const optionAnalysis = blank.optionAnalysis ?? {};
                const isCorrect = selected === blank.answer;
                return (
                  <article key={blank.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          第 {blank.id} 空
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {blank.type} · {blank.subType}
                        </span>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {isCorrect ? "正确" : "需复盘"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <p className="rounded-xl bg-slate-50 p-3">
                        用户选择：<strong>{selected ?? "未作答"}</strong>
                      </p>
                      <p className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                        正确答案：<strong>{blank.answer}. {blank.options[blank.answer]}</strong>
                      </p>
                    </div>
                    <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                      <p><strong>解题依据：</strong>{blank.clue ?? "待补充"}</p>
                      <p><strong>解析：</strong>{blank.explanation ?? "待补充"}</p>
                      <p><strong>正确选项：</strong>{optionAnalysis[blank.answer] ?? "待补充"}</p>
                      <p><strong>其他选项：</strong>{Object.entries(optionAnalysis).filter(([label]) => label !== blank.answer).map(([label, text]) => `${label}: ${text}`).join("；") || "待补充"}</p>
                      <p><strong>常见错因：</strong>{blank.commonMistake ?? "待补充"}</p>
                      <p><strong>下次策略：</strong>{blank.strategy ?? "待补充"}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="语篇分析">
              {activeItem.discourseAnalysis ? (
                <div className="space-y-4 text-sm leading-6 text-slate-600">
                  <p><strong>文章主旨：</strong>{activeItem.discourseAnalysis.mainIdea ?? "待补充"}</p>
                  <div>
                    <h3 className="font-bold text-slate-900">段落结构</h3>
                    <div className="mt-2 space-y-2">
                      {(activeItem.discourseAnalysis.structure ?? []).map((part) => (
                        <p key={part.paragraph} className="rounded-xl bg-slate-50 p-3">
                          {part.paragraph} · {part.role}：{part.summary}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">关键逻辑词</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(activeItem.discourseAnalysis.logicSignals ?? []).map((signal) => (
                        <span key={signal.word} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {signal.word} · {signal.function}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  语篇分析待补充。
                </p>
              )}
            </SectionCard>

            <SectionCard title="词汇与搭配复盘">
              {activeItem.vocabularyGroups ? (
                <div className="space-y-4">
                  {[
                    ["核心词汇", activeItem.vocabularyGroups.coreWords],
                    ["熟词僻义", activeItem.vocabularyGroups.familiarWordsWithNewMeanings],
                    ["固定搭配", activeItem.vocabularyGroups.phrases],
                  ].map(([title, items]) => (
                    <div key={title}>
                      <h3 className="font-bold text-slate-900">{title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(items ?? []).map((word) => (
                          <span key={word.word ?? word.phrase} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {word.word ?? word.phrase}：{word.meaning}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  本篇词汇与搭配待补充。
                </p>
              )}
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}
