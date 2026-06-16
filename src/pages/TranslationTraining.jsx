import { useState } from "react";
import SectionCard from "../components/SectionCard";
import { getAvailableYears, getTranslationByYear } from "../utils/dataAdapter";

export default function TranslationTraining() {
  const years = getAvailableYears();
  const [year, setYear] = useState(years[0] ?? 2026);
  const [answer, setAnswer] = useState("");
  const [showReference, setShowReference] = useState(false);
  const item = getTranslationByYear(year);
  const hasData = item.status !== "待补充" && item.sentence;

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
              setAnswer("");
              setShowReference(false);
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
          <>
            <p className="text-lg font-semibold leading-8 text-slate-900">
              {item.sentence}
            </p>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={5}
              placeholder="在这里输入你的翻译..."
              className="mt-5 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowReference((current) => !current)}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {showReference ? "收起参考内容" : "查看参考译文"}
            </button>
            {showReference && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <h3 className="font-bold text-emerald-800">参考译文</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.reference ?? "待补充"}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <h3 className="font-bold text-amber-800">常见扣分点</h3>
                  <ul className="mt-2 space-y-1">
                    {(item.deductions ?? ["待补充"]).map((point) => (
                      <li key={point} className="text-sm leading-6 text-slate-600">
                        · {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </div>
  );
}
