import { useState } from "react";
import SectionCard from "../components/SectionCard";
import translationItems from "../data/translationItems.json";

export default function TranslationTraining() {
  const [answers, setAnswers] = useState({});
  const [visibleIds, setVisibleIds] = useState(new Set());

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
        输入自己的翻译，再显示参考翻译和常见扣分点。
      </p>

      <div className="mt-7 space-y-6">
        {translationItems.map((item, index) => (
          <SectionCard key={item.id} title={`翻译句 ${index + 1}`}>
            <p className="text-lg font-semibold leading-8 text-slate-900">
              {item.sentence}
            </p>
            <textarea
              value={answers[item.id] ?? ""}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [item.id]: event.target.value,
                }))
              }
              rows={4}
              placeholder="在这里输入你的翻译..."
              className="mt-5 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => toggleReference(item.id)}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {visibleIds.has(item.id) ? "收起参考内容" : "显示参考翻译"}
            </button>

            {visibleIds.has(item.id) && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <h3 className="font-bold text-emerald-800">参考翻译</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.reference}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <h3 className="font-bold text-amber-800">常见扣分点</h3>
                  <ul className="mt-2 space-y-1">
                    {item.deductions.map((point) => (
                      <li key={point} className="text-sm leading-6 text-slate-600">
                        · {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
