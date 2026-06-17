import { useState } from "react";
import SectionCard from "../components/SectionCard";
import {
  getExamYears,
  getTranslationByYear,
  hasTranslationData,
} from "../utils/dataAdapter";
import { getTrainingDraft, saveTrainingDraft } from "../utils/trainingStorage";

function normalizeTranslationTasks(item) {
  if (item.items?.length) {
    return item.items.map((entry, index) => ({
      id: entry.id ?? `${item.year}-translation-${index + 1}`,
      sourceText: entry.sourceText ?? entry.sentence ?? "",
      referenceTranslation: entry.referenceTranslation ?? entry.reference ?? "",
      keyPoints: entry.keyPoints ?? [],
      phrases: (entry.phrases ?? []).map((phrase) =>
        typeof phrase === "string" ? { phrase, meaning: "", example: "" } : phrase,
      ),
      sentenceAnalysis: entry.sentenceAnalysis ?? [
        {
          sentence: entry.sentence ?? "",
          coreStructure: "",
          grammarBreakdown: entry.longSentence ?? "",
          translation: entry.reference ?? "",
        },
      ],
      commonMistakes: entry.commonMistakes ?? entry.deductions ?? [],
    }));
  }

  return [
    {
      id: item.id ?? `${item.year}-translation`,
      sourceText: item.sourceText ?? "",
      referenceTranslation: item.referenceTranslation ?? "",
      keyPoints: item.keyPoints ?? [],
      phrases: item.phrases ?? [],
      sentenceAnalysis: item.sentenceAnalysis ?? [],
      commonMistakes: item.commonMistakes ?? [],
    },
  ];
}

export default function TranslationTraining() {
  const years = getExamYears();
  const [year, setYear] = useState(years[0] ?? 2026);
  const [visibleIds, setVisibleIds] = useState(new Set());
  const item = getTranslationByYear(year);
  const hasData = hasTranslationData(item);
  const translationTasks = normalizeTranslationTasks(item);
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(
      translationTasks.map((task) => [
        task.id,
        getTrainingDraft(`translation-${task.id}`),
      ]),
    ),
  );

  function chooseYear(nextYear) {
    const nextItem = getTranslationByYear(nextYear);
    const nextTasks = normalizeTranslationTasks(nextItem);
    setYear(Number(nextYear));
    setVisibleIds(new Set());
    setDrafts(
      Object.fromEntries(
        nextTasks.map((task) => [
          task.id,
          getTrainingDraft(`translation-${task.id}`),
        ]),
      ),
    );
  }

  function updateDraft(id, value) {
    setDrafts((current) => ({ ...current, [id]: value }));
    saveTrainingDraft(`translation-${id}`, value);
  }

  function toggleReference(id) {
    setVisibleIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">TRANSLATION</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">翻译训练</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        选择年份，输入自己的译文，再查看参考译文、翻译要点、词组、长难句和扣分点。
      </p>

      <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm shadow-slate-200/60">
        <label className="text-sm font-semibold text-slate-700">
          选择年份
          <select
            value={year}
            onChange={(event) => chooseYear(event.target.value)}
            className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:w-56"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item} 考研英语一
              </option>
            ))}
          </select>
        </label>
      </div>

      <SectionCard className="mt-7" title={`${year} 翻译训练`}>
        {!hasData ? (
          <p className="rounded-2xl bg-amber-50 p-5 text-sm font-medium text-amber-700">
            该年份翻译真题数据待补充。
          </p>
        ) : (
          <div className="space-y-6">
            {translationTasks.map((translation, index) => (
              <article
                key={translation.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100"
              >
                <p className="text-sm font-bold text-blue-700">第 {46 + index} 题</p>
                <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-base font-semibold leading-8 text-slate-900">
                  {translation.sourceText || "待补充"}
                </p>
                <textarea
                  value={drafts[translation.id] ?? ""}
                  onChange={(event) => updateDraft(translation.id, event.target.value)}
                  rows={5}
                  placeholder="在这里输入你的翻译，内容会自动暂存在本机浏览器..."
                  className="mt-5 w-full resize-y rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => toggleReference(translation.id)}
                  className="mt-4 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
                >
                  {visibleIds.has(translation.id) ? "收起参考内容" : "查看参考译文"}
                </button>
                {visibleIds.has(translation.id) && (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <h3 className="font-bold text-emerald-800">参考译文</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {translation.referenceTranslation || "待补充"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-4">
                      <h3 className="font-bold text-blue-800">翻译要点</h3>
                      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                        {(translation.keyPoints.length
                          ? translation.keyPoints
                          : ["待补充"]
                        ).map((point) => (
                          <li key={point}>· {point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-cyan-50 p-4">
                      <h3 className="font-bold text-cyan-800">重点词组</h3>
                      <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                        {(translation.phrases.length
                          ? translation.phrases
                          : [{ phrase: "待补充", meaning: "", example: "" }]
                        ).map((phrase) => (
                          <p key={phrase.phrase}>
                            <strong>{phrase.phrase}</strong>
                            {phrase.meaning ? `：${phrase.meaning}` : ""}
                            {phrase.example ? `（${phrase.example}）` : ""}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4">
                      <h3 className="font-bold text-amber-800">常见扣分点</h3>
                      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                        {(translation.commonMistakes.length
                          ? translation.commonMistakes
                          : ["待补充"]
                        ).map((point) => (
                          <li key={point}>· {point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                      <h3 className="font-bold text-slate-900">长难句拆解</h3>
                      <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600">
                        {(translation.sentenceAnalysis.length
                          ? translation.sentenceAnalysis
                          : [{ sentence: "待补充", coreStructure: "", grammarBreakdown: "", translation: "" }]
                        ).map((sentence) => (
                          <div key={sentence.sentence}>
                            <p><strong>句子：</strong>{sentence.sentence}</p>
                            <p><strong>主干：</strong>{sentence.coreStructure || "待补充"}</p>
                            <p><strong>拆解：</strong>{sentence.grammarBreakdown || "待补充"}</p>
                            <p><strong>译文：</strong>{sentence.translation || "待补充"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
