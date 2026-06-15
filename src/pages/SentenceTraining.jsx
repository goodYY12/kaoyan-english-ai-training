import SectionCard from "../components/SectionCard";
import sentences from "../data/sentences.json";

export default function SentenceTraining() {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">LONG SENTENCES</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">长难句训练</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        先抓主干，再处理从句和修饰成分。
      </p>

      <div className="mt-7 space-y-6">
        {sentences.map((item, index) => (
          <SectionCard key={item.id} title={`示例句 ${index + 1}`}>
            <p className="text-lg font-semibold leading-8 text-slate-900">
              {item.sentence}
            </p>
            <dl className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["主干", item.core],
                ["从句", item.clauses],
                ["修饰成分", item.modifiers],
                ["关键词", item.keywords.join(" · ")],
                ["参考翻译", item.translation],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-xl bg-slate-50 p-4 ${
                    label === "参考翻译" ? "md:col-span-2" : ""
                  }`}
                >
                  <dt className="text-sm font-bold text-blue-700">{label}</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-600">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
