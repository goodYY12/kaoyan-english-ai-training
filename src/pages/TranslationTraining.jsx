import { useState } from "react";
import SectionCard from "../components/SectionCard";
import { getAvailableYears, getTranslationByYear } from "../utils/dataAdapter";

export default function TranslationTraining() {
  const years = getAvailableYears();
  const [year, setYear] = useState(years[0] ?? 2026);
  const [answers, setAnswers] = useState({});
  const [visibleIds, setVisibleIds] = useState(new Set());
  const item = getTranslationByYear(year);
  const translationItems = item.items ?? (item.sentence ? [item] : []);
  const hasData = item.status !== "待补充" && translationItems.length > 0;

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
        先搭好训练框架：选择年份、输入译文、查看参考译文和扣分点。暂无真题时显示待补充。
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">
          选择年份
          <select
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value));
              setAnswers({});
              setVisibleIds(new Set());
            }}
            className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:w-56"
          >
            {years.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <SectionCard className="mt-7" title={`${year} 翻译真题`}>
        {!hasData ? (
          <p className="rounded-xl bg-amber-50 p-5 text-sm font-medium text-amber-700">
            {year} 翻译真题数据待补充
          </p>
        ) : (
          <div className="space-y-6">
            {translationItems.map((translation, index) => (
              <article key={translation.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-bold text-blue-700">第 {46 + index} 题</p>
                <p className="mt-2 text-lg font-semibold leading-8 text-slate-900">
                  {translation.sentence}
                </p>
                <textarea
                  value={answers[translation.id] ?? ""}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [translation.id]: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="在这里输入你的翻译..."
                  className="mt-5 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => toggleReference(translation.id)}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {visibleIds.has(translation.id) ? "收起参考内容" : "查看参考译文"}
                </button>
                {visibleIds.has(translation.id) && (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <h3 className="font-bold text-emerald-800">参考译文</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {translation.reference ?? "待补充"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-4">
                      <h3 className="font-bold text-amber-800">常见扣分点</h3>
                      <ul className="mt-2 space-y-1">
                        {(translation.deductions ?? ["待补充"]).map((point) => (
                          <li key={point} className="text-sm leading-6 text-slate-600">
                            · {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4 md:col-span-2">
                      <h3 className="font-bold text-blue-800">词组与长难句</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        词组：{(translation.phrases ?? ["待补充"]).join(" / ")}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        长难句：{translation.longSentence ?? "待补充"}
                      </p>
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
