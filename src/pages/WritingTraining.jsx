import SectionCard from "../components/SectionCard";
import writingTemplates from "../data/writingTemplates.json";

export default function WritingTraining() {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">WRITING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">写作训练</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        第一版先建立模板、常用句型和替换表达的内容框架。
      </p>

      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        {writingTemplates.map((item) => (
          <SectionCard
            key={item.type}
            title={`${item.type} · ${item.title}`}
          >
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-blue-700">文章结构</h3>
                <ol className="mt-3 space-y-2">
                  {item.template.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600"
                    >
                      <span className="font-bold text-blue-600">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-700">常用句型</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {item.sentences.map((sentence) => (
                    <li key={sentence}>· {sentence}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-700">替换表达</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.replacements.map((replacement) => (
                    <span
                      key={replacement}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                    >
                      {replacement}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
