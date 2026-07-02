import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import questionTypes from "../data/questionTypes.json";
import {
  getAllReadings,
  getReadingsByYear,
  getSimilarQuestionsByType,
  normalizeVocabulary,
} from "../utils/dataAdapter";
import { saveReadingRecord } from "../utils/trainingStorage";

const years = [...new Set(getAllReadings().map((reading) => reading.year))].sort(
  (a, b) => b - a,
);

function highlightWord(sentence, word) {
  const index = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return sentence;
  return (
    <>
      {sentence.slice(0, index)}
      <mark className="rounded bg-amber-200 px-1 font-bold text-slate-900">
        {sentence.slice(index, index + word.length)}
      </mark>
      {sentence.slice(index + word.length)}
    </>
  );
}

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
    explanation: question.explanation,
    trapAnalysis: question.trapAnalysis,
    examinerThinking: question.examinerThinking,
    sourceSentenceAnalysis: question.sourceSentenceAnalysis,
    completedAt: new Date().toISOString(),
    mastered: false,
  };
}

export default function ReadingTraining() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedTextNumber, setSelectedTextNumber] = useState("Text 1");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [mode, setMode] = useState("reading");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordAnswers, setWordAnswers] = useState({});
  const [savedRecordId, setSavedRecordId] = useState(null);

  const availableTexts = useMemo(
    () => getReadingsByYear(selectedYear),
    [selectedYear],
  );
  const currentPaper =
    availableTexts.find((paper) => paper.textNumber === selectedTextNumber) ??
    availableTexts[0];
  const vocabulary = normalizeVocabulary(currentPaper);
  const currentWord = vocabulary[wordIndex];
  const score = currentPaper.questions.filter(
    (question) => answers[question.questionNumber] === question.answer,
  ).length;
  const wrongQuestions = currentPaper.questions.filter(
    (question) => submitted && answers[question.questionNumber] !== question.answer,
  );
  const similarQuestions = submitted
    ? getSimilarQuestionsByType({
        allReadings: getAllReadings(),
        wrongQuestionTypes: wrongQuestions.map((question) => question.type),
        wrongReasons: wrongQuestions.map((question) => question.commonMistake),
        currentQuestionIds: currentPaper.questions.map((question) => question.id),
        limit: 3,
      })
    : [];

  const wordScore = vocabulary.filter(
    (item) => wordAnswers[item.word] === (item.answer ?? "A"),
  ).length;

  function resetTraining() {
    setAnswers({});
    setSubmitted(false);
    setShowAnalysis(false);
    setMode("reading");
    setWordIndex(0);
    setWordAnswers({});
    setSavedRecordId(null);
  }

  function chooseYear(year) {
    const nextYear = Number(year);
    const firstPaper = getReadingsByYear(nextYear)[0];
    setSelectedYear(nextYear);
    setSelectedTextNumber(firstPaper?.textNumber ?? "Text 1");
    resetTraining();
  }

  function submitAnswers() {
    const mistakes = currentPaper.questions
      .filter((question) => answers[question.questionNumber] !== question.answer)
      .map((question) =>
        createMistake(currentPaper, question, answers[question.questionNumber]),
      );
    const record = {
      id: `${currentPaper.id}-${Date.now()}`,
      year: currentPaper.year,
      textNumber: currentPaper.textNumber,
      readingId: currentPaper.id,
      total: currentPaper.questions.length,
      correct: score,
      accuracy: Math.round((score / currentPaper.questions.length) * 100),
      submittedAt: new Date().toISOString(),
      answers,
      mistakes,
    };

    saveReadingRecord(record);
    setSavedRecordId(record.id);
    setShowAnalysis(true);
    setSubmitted(true);
  }

  if (mode === "vocabulary") {
    const finished = wordIndex >= vocabulary.length;
    const selected = currentWord ? wordAnswers[currentWord.word] : "";
    const options = currentWord?.options ?? {};
    const answer = currentWord?.answer ?? "A";
    const accuracy =
      vocabulary.length === 0 ? 0 : Math.round((wordScore / vocabulary.length) * 100);

    return (
      <div>
        <p className="text-sm font-semibold text-blue-600">VOCABULARY TEST</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">本篇单词自测</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          结合原文例句选择单词在本文中的语境义。
        </p>

        <div className="mt-6">
          <SectionCard title={finished ? "自测结果" : `词汇进度 ${wordIndex + 1}/${vocabulary.length}`}>
            {finished ? (
              <div className="space-y-5">
                <div className="rounded-3xl bg-blue-50 p-6 text-center">
                  <p className="text-sm font-semibold text-blue-700">本次单词正确率</p>
                  <p className="mt-2 text-4xl font-bold text-slate-900">
                    {wordScore}/{vocabulary.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{accuracy}%</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => { setWordIndex(0); setWordAnswers({}); }} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                    重新测试
                  </button>
                  <button type="button" onClick={() => setMode("reading")} className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700">
                    返回阅读解析
                  </button>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl">
                <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6">
                  <h2 className="text-4xl font-bold text-slate-900">{currentWord.word}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {currentWord.phonetic ?? ""} · {currentWord.partOfSpeech ?? "词性待补充"}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  <p className="font-semibold text-slate-900">原文例句</p>
                  <p className="mt-2 text-base">{highlightWord(currentWord.sentence ?? "", currentWord.word)}</p>
                </div>

                <div className="mt-5 grid gap-3">
                  {Object.entries(options).map(([label, text]) => {
                    const isSelected = selected === label;
                    const isAnswer = selected && answer === label;
                    const isWrong = selected && isSelected && !isAnswer;
                    const style = isAnswer
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : isWrong
                        ? "border-rose-300 bg-rose-50 text-rose-800"
                        : isSelected
                          ? "border-blue-300 bg-blue-50 text-blue-800"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50";
                    return (
                      <button key={label} type="button" disabled={Boolean(selected)} onClick={() => setWordAnswers((current) => ({ ...current, [currentWord.word]: label }))} className={`rounded-xl border px-4 py-3 text-left text-sm transition disabled:cursor-default ${style}`}>
                        <span className="mr-2 font-bold">{label}.</span>{text}
                      </button>
                    );
                  })}
                </div>

                {selected && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                    <p>正确答案：<strong className="text-emerald-700">{answer}. {options[answer]}</strong></p>
                    <p className="mt-2">本文语境义：<strong>{currentWord.meaningInContext ?? "待补充"}</strong></p>
                    <p className="mt-2">{currentWord.explanation ?? "解释待补充"}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap justify-between gap-3">
                  <button type="button" onClick={() => setMode("reading")} className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700">返回阅读解析</button>
                  <button type="button" disabled={!selected} onClick={() => setWordIndex((current) => Math.min(current + 1, vocabulary.length))} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">下一个单词</button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">READING TRAINING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">完整阅读训练</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        做题、诊断错因、归位出题人思维，再进入词汇和长难句复盘。
      </p>

      <div className="mt-6 grid gap-4 rounded-3xl border border-blue-100 bg-white/95 p-4 shadow-sm shadow-blue-100/60 md:grid-cols-[1fr_2fr]">
        <label className="text-sm font-semibold text-slate-700">
          年份
          <select value={selectedYear} onChange={(event) => chooseYear(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400">
            {years.map((year) => <option key={year} value={year}>{year} 考研英语一</option>)}
          </select>
        </label>
        <div>
          <p className="text-sm font-semibold text-slate-700">选择篇目</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableTexts.map((paper) => (
              <button key={paper.id} type="button" onClick={() => { setSelectedTextNumber(paper.textNumber); resetTraining(); }} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${paper.textNumber === currentPaper.textNumber ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>
                {paper.textNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {questionTypes.map((type) => (
          <span key={type.name} title={type.detail} className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            {type.name}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <SectionCard
          title={`${currentPaper.year} ${currentPaper.textNumber}｜${currentPaper.title || "阅读文章"}`}
          className="lg:sticky lg:top-4 lg:self-start"
        >
          <div className="max-h-[72vh] overflow-y-auto rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-5 text-[15px] leading-8 text-slate-700 md:p-6 lg:max-h-[calc(100vh-11rem)]">
            {currentPaper.passage.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="mb-5 indent-6 last:mb-0">{paragraph}</p>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="选择题" className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-hidden">
          <div className="space-y-5 lg:max-h-[calc(100vh-19rem)] lg:overflow-y-auto lg:pr-2">
            {currentPaper.questions.map((question) => {
              const selected = answers[question.questionNumber];
              const isCorrect = submitted && selected === question.answer;
              const isWrong = submitted && selected !== question.answer;
              return (
                <article key={question.id} className={`rounded-3xl border bg-white p-4 shadow-sm shadow-slate-100 ${submitted ? (isCorrect ? "border-emerald-200" : "border-rose-200") : "border-slate-200"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="max-w-xl text-sm font-bold leading-6 text-slate-900">{question.questionNumber}. {question.questionText}</h2>
                    {submitted && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{isCorrect ? "正确" : "错误"}</span>}
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
                      return <button key={label} type="button" disabled={submitted} onClick={() => setAnswers((current) => ({ ...current, [question.questionNumber]: label }))} className={`rounded-2xl border px-3 py-2.5 text-left text-sm transition disabled:cursor-default ${style}`}><span className="mr-2 font-bold">{label}.</span>{text}</button>;
                    })}
                  </div>

                  {submitted && (
                    <div className={`mt-4 rounded-2xl border p-3 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                      <div className="grid gap-2 text-sm sm:grid-cols-4">
                        <p className={`rounded-xl bg-white/80 p-3 font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          判定：{isCorrect ? "正确" : "错误"}
                        </p>
                        <p className="rounded-xl bg-white/80 p-3 text-slate-700">
                          你的选择：<strong className={isWrong ? "text-rose-700" : "text-emerald-700"}>{selected ?? "未作答"}</strong>
                        </p>
                        <p className="rounded-xl bg-white/80 p-3 text-emerald-700">
                          正确答案：<strong>{question.answer}</strong>
                        </p>
                        <p className="rounded-xl bg-white/80 p-3 text-blue-700">
                          题型：<strong>{question.type || "待补充"}</strong>
                        </p>
                      </div>
                      {!showAnalysis && (
                        <p className="mt-2 text-xs text-slate-500">
                          详细解析已收起，点击成绩区“查看解析”展开出题人思维、定位句和错因分析。
                        </p>
                      )}
                    </div>
                  )}

                  {submitted && showAnalysis && (
                    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                      <div className="grid gap-2 text-sm sm:grid-cols-3">
                        <p className="rounded-xl bg-slate-50 p-3 text-slate-600">你的选择：<strong className={isWrong ? "text-rose-700" : ""}>{selected ?? "未作答"}</strong></p>
                        <p className="rounded-xl bg-emerald-50 p-3 text-emerald-700">正确答案：<strong>{question.answer}</strong></p>
                        <p className="rounded-xl bg-blue-50 p-3 text-blue-700">题型：<strong>{question.type}</strong></p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                        <p><strong>原文定位：</strong>{question.location}</p>
                        <p className="mt-2"><strong>解析：</strong>{question.explanation}</p>
                        <p className="mt-2"><strong>干扰项分析：</strong>{question.trapAnalysis}</p>
                        {isWrong && <p className="mt-2 rounded-xl bg-rose-50 p-3 text-rose-700"><strong>本题错因：</strong>{question.commonMistake}</p>}
                      </div>

                      {isWrong && (
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                            <p className="font-bold text-blue-700">归位出题人思维</p>
                            {question.examinerThinking ? (
                              <>
                                <p className="mt-2">考查点：{question.examinerThinking.testPoint}</p>
                                <p>干扰套路：{question.examinerThinking.trap}</p>
                                <p>下次策略：{question.examinerThinking.nextTimeStrategy}</p>
                              </>
                            ) : <p className="mt-2">该题出题人思维分析待补充</p>}
                          </div>
                          <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-slate-700">
                            <p className="font-bold text-amber-700">错题定位句长难句训练</p>
                            {question.sourceSentenceAnalysis ? (
                              <>
                                <p className="mt-2">{question.sourceSentenceAnalysis.sentence}</p>
                                <p>主干：{question.sourceSentenceAnalysis.coreStructure}</p>
                              </>
                            ) : <p className="mt-2">该题长难句分析待补充</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="sticky bottom-4 mt-6 rounded-3xl border border-blue-100 bg-white/95 p-4 shadow-xl shadow-blue-100 backdrop-blur lg:static lg:mt-4">
            {submitted ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-bold text-slate-900">本篇成绩</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">答对 {score} 题</span>
                    <span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">答错 {currentPaper.questions.length - score} 题</span>
                    <span className="rounded-full bg-white px-3 py-1 font-semibold text-blue-700">正确率 {Math.round((score / currentPaper.questions.length) * 100)}%</span>
                  </div>
                  {savedRecordId && <span className="text-xs font-semibold text-blue-600">已保存本次训练记录</span>}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setShowAnalysis((value) => !value)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">{showAnalysis ? "隐藏解析" : "查看解析"}</button>
                  <button type="button" onClick={resetTraining} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">重新作答</button>
                  <button type="button" disabled={vocabulary.length === 0} onClick={() => setMode("vocabulary")} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">{vocabulary.length > 0 ? "进入单词自测" : "本篇暂未整理词汇"}</button>
                </div>

                {wrongQuestions.length > 0 && (
                  <div className="rounded-2xl bg-white p-4">
                    <p className="font-bold text-slate-900">同类题推荐</p>
                    {similarQuestions.length === 0 ? <p className="mt-2 text-sm text-slate-500">当前同类真题数量较少，后续录入更多年份后会自动补充。</p> : (
                      <div className="mt-3 grid gap-3">
                        {similarQuestions.map(({ reading, question, reason }) => (
                          <div key={question.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                            <p className="font-semibold">{reading.year} {reading.textNumber} 第 {question.questionNumber} 题 · {question.type}</p>
                            <p className="text-slate-500">{reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">已作答 {Object.keys(answers).length}/5。提交后显示成绩和每题对错。</p>
                <button type="button" onClick={submitAnswers} className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700">提交答案</button>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
