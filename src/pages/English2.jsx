import { Link } from "react-router";
import SectionCard from "../components/SectionCard";
import { getEnglishIIYears, getEnglishIIModuleData } from "../utils/englishIIDataAdapter";

const modules = [
  { key: "reading", title: "阅读训练", description: "完整文章 + 5 道选择题 + 提交判分", to: "/english2/reading", tone: "bg-blue-50 text-blue-700" },
  { key: "cloze", title: "完形专项", description: "文章内嵌 20 个空，集中完成后提交", to: "/english2/cloze", tone: "bg-cyan-50 text-cyan-700" },
  { key: "translation", title: "翻译训练", description: "输入译文，再按需查看参考译文", to: "/english2/translation", tone: "bg-violet-50 text-violet-700" },
  { key: "writing", title: "写作训练", description: "小作文、大作文题目与本地草稿", to: "/english2/writing", tone: "bg-amber-50 text-amber-700" },
];

export default function English2() {
  const years = getEnglishIIYears();
  const data = getEnglishIIModuleData();
  const counts = {
    reading: data.readings.length,
    cloze: data.cloze.length,
    translation: data.translations.length,
    writing: data.writing.length,
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-700 p-8 text-white shadow-xl shadow-blue-100">
        <p className="text-xs font-bold tracking-[0.2em] text-cyan-100">ENGLISH II</p>
        <h1 className="mt-2 text-3xl font-bold">英语二刷题空间</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">这里只有英语二的题库和练习入口。选择模块后直接做题，不展示额外的阅读解释文档。</p>
      </section>

      <SectionCard title="已接入年份" description="2007—2009 为分卷前统一卷兼容练习；2010 为独立英语二。">
        <div className="flex flex-wrap gap-2">
          {years.map((year) => <span key={year} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">{year}</span>)}
        </div>
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2">
        {modules.map((module) => (
          <SectionCard key={module.key} title={module.title} description={module.description}>
            <div className="flex items-center justify-between gap-3">
              <span className={"rounded-full px-3 py-1 text-xs font-bold " + module.tone}>{counts[module.key] ? "可训练" : "待补充"}</span>
              <Link to={module.to} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">开始训练</Link>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
