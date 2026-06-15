import { useState } from "react";
import EmptyState from "../components/EmptyState";
import {
  getMistakes,
  removeMistake,
  toggleReviewed,
} from "../utils/storage";

export default function MistakeBook() {
  const [mistakes, setMistakes] = useState(() => getMistakes());

  function handleRemove(id) {
    setMistakes(removeMistake(id));
  }

  function handleToggle(id) {
    setMistakes(toggleReviewed(id));
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">MISTAKE BOOK</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">错题本</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        数据只保存在当前浏览器中，刷新页面后仍会保留。
      </p>

      <div className="mt-7">
        {mistakes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {mistakes.map((mistake) => (
              <article
                key={mistake.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  mistake.reviewed
                    ? "border-emerald-200"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {mistake.type}
                      </span>
                      {mistake.reviewed && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          已复习
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-bold leading-7 text-slate-900">
                      {mistake.question}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(mistake.id)}
                      className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      {mistake.reviewed ? "取消已复习" : "标记已复习"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(mistake.id)}
                      className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                    你的答案：<strong>{mistake.userAnswer}</strong>
                  </p>
                  <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    正确答案：<strong>{mistake.correctAnswer}</strong>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
