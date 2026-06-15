import { useMemo, useState } from "react";
import vocabulary from "../data/vocabulary.json";

const categories = ["全部", ...new Set(vocabulary.map((item) => item.category))];

export default function Vocabulary() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");

  const filteredItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return vocabulary.filter((item) => {
      const matchesCategory =
        category === "全部" || item.category === category;
      const matchesKeyword =
        !normalized ||
        `${item.word} ${item.meaning} ${item.example}`
          .toLowerCase()
          .includes(normalized);
      return matchesCategory && matchesKeyword;
    });
  }, [category, keyword]);

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">VOCABULARY</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        词汇与熟词僻义
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        搜索单词、中文含义或例句，也可以按类型筛选。
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索 address、逻辑词、态度词..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article
            key={`${item.word}-${item.category}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">{item.word}</h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {item.category}
              </span>
            </div>
            <p className="mt-4 font-semibold text-slate-700">{item.meaning}</p>
            <p className="mt-3 text-sm italic leading-6 text-slate-500">
              {item.example}
            </p>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          没有找到匹配的示例词汇。
        </p>
      )}
    </div>
  );
}
