import { Link } from "react-router";
import SectionCard from "../components/SectionCard";
import {
  getClozeByYear,
  getExamDatabaseStats,
  getExamYears,
  getReadingsByYear,
  getTranslationByYear,
  getWritingByYear,
  hasReadingData,
} from "../utils/dataAdapter";

function hasText(value) {
  return Boolean(String(value ?? "").trim());
}

function getToneClasses(tone) {
  const classes = {
    complete: "bg-emerald-50 text-emerald-700",
    partial: "bg-blue-50 text-blue-700",
    pending: "bg-amber-50 text-amber-700",
  };
  return classes[tone] ?? classes.pending;
}

function getReadingStatus(readings) {
  const total = readings.length;
  const complete = readings.filter(hasReadingData).length;
  const hasAnyContent = readings.some(
    (reading) => hasText(reading.passage) || (reading.questions ?? []).length > 0,
  );

  if (!hasAnyContent) {
    return { label: "待补充", detail: "暂无阅读题面", ready: false, tone: "pending" };
  }

  if (complete === total && total > 0) {
    return { label: `${complete}/${total} 可训练`, detail: "文章、选项和答案完整", ready: true, tone: "complete" };
  }

  return {
    label: `${complete}/${total} 可训练`,
    detail: "部分年份仍缺文章、选项或答案",
    ready: complete > 0,
    tone: complete > 0 ? "partial" : "pending",
  };
}

function getClozeStatus(items) {
  const item = items[0];
  if (!item) {
    return { label: "待补充", detail: "暂无完形题面", ready: false, tone: "pending" };
  }

  const blanks = item.blanks ?? [];
  const answerCount = blanks.filter((blank) => /^[A-D]$/.test(blank.answer ?? "")).length;
  const hasPassage = (item.passageParts ?? []).length > 0;

  if (!hasPassage || blanks.length === 0) {
    return { label: "待补充", detail: "暂无完形文章", ready: false, tone: "pending" };
  }

  if (answerCount === blanks.length && blanks.length === 20) {
    return { label: `${answerCount}/20 有答案`, detail: "可进入完形训练", ready: true, tone: "complete" };
  }

  return {
    label: `${answerCount}/${blanks.length} 有答案`,
    detail: "题面已录入，答案待补齐",
    ready: true,
    tone: "partial",
  };
}

function getTranslationStatus(item) {
  const tasks = item.items?.length
    ? item.items
    : [{ sourceText: item.sourceText, referenceTranslation: item.referenceTranslation }];
  const sourceCount = tasks.filter((task) =>
    hasText(task.sourceText ?? task.sentence),
  ).length;
  const referenceCount = tasks.filter((task) => {
    const reference = task.referenceTranslation ?? task.reference;
    return hasText(reference) && !String(reference).includes("待补充");
  }).length;

  if (sourceCount === 0) {
    return { label: "待补充", detail: "暂无翻译原文", ready: false, tone: "pending" };
  }

  if (referenceCount === sourceCount) {
    return { label: `${referenceCount}/${sourceCount} 有译文`, detail: "原文和参考译文已录入", ready: true, tone: "complete" };
  }

  return {
    label: `题面 ${sourceCount} / 译文 ${referenceCount}`,
    detail: "已有原文，参考译文待补",
    ready: true,
    tone: "partial",
  };
}

function getWritingStatus(item) {
  const sections = [item.smallWriting, item.bigWriting].filter(Boolean);
  const promptCount = sections.filter((section) => hasText(section.prompt)).length;
  const sampleCount = sections.filter((section) => hasText(section.sampleEssay)).length;

  if (promptCount === 0) {
    return { label: "待补充", detail: "暂无写作题目", ready: false, tone: "pending" };
  }

  if (sampleCount >= promptCount) {
    return { label: `题目 ${promptCount} / 范文 ${sampleCount}`, detail: "题目和范文已录入", ready: true, tone: "complete" };
  }

  return {
    label: `题目 ${promptCount} / 范文 ${sampleCount}`,
    detail: "已有题目，范文待补",
    ready: true,
    tone: "partial",
  };
}

function getModuleCards(year) {
  const readings = getReadingsByYear(year);
  const clozeItems = getClozeByYear(year);
  const translation = getTranslationByYear(year);
  const writing = getWritingByYear(year);

  return [
    { title: "阅读训练", to: "/reading", ...getReadingStatus(readings) },
    { title: "完形专项", to: "/cloze", ...getClozeStatus(clozeItems) },
    { title: "翻译训练", to: "/translation", ...getTranslationStatus(translation) },
    { title: "写作训练", to: "/writing", ...getWritingStatus(writing) },
  ];
}

export default function ExamCenter() {
  const years = getExamYears();
  const databaseStats = getExamDatabaseStats();

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">EXAM CENTER</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">真题中心</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        年份从本地数据中自动读取。每个模块按实际录入情况显示进度：题面、答案、译文或范文缺什么，就如实标出来。
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">题库年份</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {databaseStats.yearRange}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            共 {databaseStats.yearCount} 年
          </p>
        </div>
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <p className="text-xs font-semibold text-blue-600">阅读语篇</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {databaseStats.readingTextCount} 篇
          </p>
          <p className="mt-1 text-xs text-blue-700">
            {databaseStats.readingCompleteTextCount} 篇可完整训练
          </p>
        </div>
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm">
          <p className="text-xs font-semibold text-cyan-700">完形专项</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {databaseStats.clozeCount} 篇
          </p>
          <p className="mt-1 text-xs text-cyan-700">
            {databaseStats.clozeAnsweredCount}/{databaseStats.clozeBlankCount} 空有答案
          </p>
        </div>
        <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm">
          <p className="text-xs font-semibold text-violet-700">翻译/写作</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {databaseStats.translationItemCount}/{databaseStats.writingTaskCount}
          </p>
          <p className="mt-1 text-xs text-violet-700">翻译句 / 写作题</p>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {years.map((year) => (
          <SectionCard
            key={year}
            title={`${year} 年英语一`}
            description="按训练模块进入"
            action={
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                本地数据
              </span>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {getModuleCards(year).map((module) => {
                const content = (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span>{module.title}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${getToneClasses(module.tone)}`}
                      >
                        {module.label}
                      </span>
                    </div>
                    <p className="text-xs font-normal text-slate-500">{module.detail}</p>
                  </div>
                );

                if (!module.ready) {
                  return (
                    <div
                      key={module.title}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500"
                    >
                      {content}
                    </div>
                  );
                }

                return (
                  <Link
                    key={module.title}
                    to={module.to}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
