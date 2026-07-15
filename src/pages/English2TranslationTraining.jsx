import { useState } from "react";
import SectionCard from "../components/SectionCard";
import { getEnglishIITranslationByYear } from "../utils/englishIIDataAdapter";
import { getTrainingDraft, saveTrainingDraft } from "../utils/trainingStorage";

const years = [2010, 2009, 2008, 2007];

export default function English2TranslationTraining() {
  const [year, setYear] = useState(2010);
  const [showReference, setShowReference] = useState(false);
  const item = getEnglishIITranslationByYear(year);
  const task = item?.items?.[0];
  const draftKey = "english2-translation-" + (task?.id ?? year);
  const [draft, setDraft] = useState(() => getTrainingDraft(draftKey));

  function chooseYear(nextYear) {
    const next = getEnglishIITranslationByYear(nextYear)?.items?.[0];
    setYear(nextYear);
    setShowReference(false);
    setDraft(getTrainingDraft("english2-translation-" + (next?.id ?? nextYear)));
  }

  function update(value) {
    setDraft(value);
    saveTrainingDraft(draftKey, value);
  }

  return <div className="space-y-6">
    <div><p className="text-sm font-bold text-blue-600">ENGLISH II · TRANSLATION</p><h1 className="mt-2 text-3xl font-bold text-slate-900">英语二翻译训练</h1><p className="mt-2 text-sm text-slate-500">先完成自己的译文，再按需要查看参考内容。</p></div>
    <div className="flex flex-wrap gap-2">{years.map((value) => <button key={value} type="button" onClick={() => chooseYear(value)} className={"rounded-xl px-4 py-2 text-sm font-bold " + (year === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>{value}</button>)}</div>
    {!task ? <SectionCard title={String(year) + " 翻译训练"}><p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">该年份英语二翻译数据待补充。</p></SectionCard> : <SectionCard title={String(year) + " 翻译真题"} description={item.compatibilityNote ?? "英语二真题"}>
      <p className="rounded-2xl bg-slate-50 p-5 text-[15px] leading-8 text-slate-800">{task.sourceText}</p>
      <textarea value={draft} onChange={(event) => update(event.target.value)} rows={8} placeholder="在这里输入你的中文翻译，本地会自动保存。" className="mt-5 w-full rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
      <button type="button" onClick={() => setShowReference((value) => !value)} className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{showReference ? "收起参考译文" : "查看参考译文"}</button>
      {showReference && <div className="mt-5 rounded-2xl bg-emerald-50 p-5 text-sm leading-7 text-slate-700"><p className="font-bold text-emerald-800">参考译文</p><p className="mt-2">{task.referenceTranslation || "待补充"}</p></div>}
    </SectionCard>}
  </div>;
}
