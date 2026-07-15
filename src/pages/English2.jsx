import { useMemo } from "react";
import { Link } from "react-router";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import {
  getEnglishIIYears,
  getEnglishIIMarkdownContent,
  getEnglishIIModuleData,
} from "../utils/englishIIDataAdapter";

const modules = [
  { key: "reading", title: "英语二真题阅读", description: "完整文章、答案、题型解析和定位句。" },
  { key: "vocabulary", title: "单词解析", description: "语境词义、熟词僻义和原文例句。" },
  { key: "longSentence", title: "长难句分析", description: "主干、从句、修饰成分和参考翻译。" },
  { key: "tips", title: "阅读技巧总结", description: "题型规律、定位方法和做题策略。" },
  { key: "translation", title: "翻译解析", description: "翻译原文、参考译文和扣分点。" },
  { key: "writing", title: "作文模板", description: "小作文、大作文结构和常用表达。" },
];

function getModuleCount(key, data) {
  if (key === "reading") return data.readings.length;
  if (key === "vocabulary") return data.vocabulary.length;
  if (key === "longSentence") return data.studyGuides.longSentenceGuides.length;
  if (key === "tips") return data.studyGuides.readingTips.length;
  if (key === "translation") return data.translations.length;
  if (key === "writing") return data.writing.length;
  return 0;
}

export default function English2() {
  const data = useMemo(() => getEnglishIIModuleData(), []);
  const years = useMemo(() => getEnglishIIYears(), []);
  const markdownDocs = useMemo(() => getEnglishIIMarkdownContent(), []);
  const readyCount = modules.filter((module) => getModuleCount(module.key, data) > 0).length;

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">ENGLISH II</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">英语二学习模块</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        英语二使用独立题库和数据结构，后续补充 PDF 后即可逐年接入，不影响现有英语一功能。
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="已接入年份" value={years.length || "—"} note="英语二题库年份" tone="blue" />
        <StatCard label="已接入模块" value={`${readyCount}/${modules.length}`} note="缺少数据时显示待补充" tone="cyan" />
        <StatCard label="当前状态" value="建设中" note="等待导入英语二真题" tone="amber" />
      </div>

      <SectionCard
        className="mt-7"
        title="英语二题库入口"
        description="目前尚未导入英语二原始试卷，下面的录入位置已经准备好。"
      >
        {years.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50 px-6 py-14 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">II</div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">英语二真题待补充</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              请先提供英语二真题 PDF 或结构化数据。导入后会在这里按年份显示。
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <span key={year} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {year} 英语二
              </span>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const count = getModuleCount(module.key, data);
          return (
            <SectionCard key={module.key} title={module.title} description={module.description}>
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${count ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {count ? `已有 ${count} 条` : "待补充"}
                </span>
                {module.key === "reading" && count > 0 && (
                  <Link to="/reading" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    开始训练
                  </Link>
                )}
              </div>
            </SectionCard>
          );
        })}
      </div>

      <SectionCard
        className="mt-7"
        title="英语二 Markdown 解析"
        description="解析内容存放在 English-II 目录，支持按模块继续补充。"
      >
        <div className="space-y-4">
          {markdownDocs.map((doc) => (
            <article key={doc.path} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">{doc.category}</span>
                <span>{doc.year || "TODO"}</span>
                <span>{doc.type || "TODO"}</span>
                <span>{doc.difficulty || "TODO"}</span>
              </div>
              <h3 className="mt-3 font-bold text-slate-900">{doc.title || "未命名解析"}</h3>
              <p className="mt-1 text-xs text-slate-500">关键词：{doc.keywords || "TODO"}</p>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{doc.body}</div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
