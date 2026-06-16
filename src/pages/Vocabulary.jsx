import { useMemo, useState } from "react";
import vocabulary from "../data/vocabulary.json";
import { getAllVocabulary } from "../utils/dataAdapter";

const filters = ["全部", "核心词汇", "熟词僻义"];

function normalizeStaticWords() {
  return vocabulary.map((item) => ({
    ...item,
    category: item.category ?? "核心词汇",
    meaningInContext: item.meaning,
    sentence: item.example,
    explanation: item.note ?? item.meaning,
    year: "示例",
    textNumber: "通用",
  }));
}

export default function Vocabulary() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");

  const allWords = useMemo(
    () => [...getAllVocabulary(), ...normalizeStaticWords()],
    [],
  );

  const filteredItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return allWords.filter((item) => {
      const matchesCategory =
        category === "全部" ||
        item.category === category ||
        (category === "核心词汇" && item.category !== "熟词僻义");
      const text = `${item.word} ${item.meaningInContext} ${item.meaning} ${item.sentence} ${item.explanation}`;
      const matchesKeyword = !normalized || text.toLowerCase().includes(normalized);
      return matchesCategory && matchesKeyword;
    });
  }, [allWords, category, keyword]);

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">VOCABULARY</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        词汇与熟词僻义
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        这里会读取每篇阅读文章中的 vocabulary、核心词汇和熟词僻义，方便按年份和语境复盘。
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索单词、中文释义、原文例句..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item) => (
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
        {filteredItems.map((item, index) => (
          <article
            key={`${item.source ?? "static"}-${item.word}-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{item.word}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {item.phonetic ?? "音标待补充"} · {item.partOfSpeech ?? "词性待补充"}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  item.category === "熟词僻义"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {item.category === "熟词僻义" ? "不是常见义" : item.category}
              </span>
            </div>
            <p className="mt-4 font-semibold text-slate-700">
              语境义：{item.meaningInContext ?? item.meaning ?? "待补充"}
            </p>
            <p className="mt-3 text-sm italic leading-6 text-slate-500">
              {item.sentence ?? item.example ?? "原文例句待补充"}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.explanation ?? item.note ?? "解释待补充"}
            </p>
            <p className="mt-4 text-xs font-semibold text-slate-400">
              来源：{item.year} · {item.textNumber}
            </p>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          没有找到匹配的词汇。
        </p>
      )}
    </div>
  );
}
