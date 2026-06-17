import { Link } from "react-router";
import SectionCard from "../components/SectionCard";
import {
  getClozeByYear,
  getExamYears,
  getReadingsByYear,
  getTranslationByYear,
  getWritingByYear,
  hasClozeData,
  hasTranslationData,
  hasWritingData,
} from "../utils/dataAdapter";

function getModuleCards(year) {
  const readings = getReadingsByYear(year);
  const clozeItems = getClozeByYear(year);
  const translation = getTranslationByYear(year);
  const writing = getWritingByYear(year);
  const clozeReady = clozeItems.some(hasClozeData);
  const translationReady = hasTranslationData(translation);
  const writingReady = hasWritingData(writing);

  return [
    { title: "阅读训练", to: "/reading", status: readings.length ? "已有数据" : "待补充", ready: readings.length > 0 },
    { title: "完形专项", to: "/cloze", status: clozeReady ? "已有数据" : "待补充", ready: clozeReady },
    { title: "翻译训练", to: "/translation", status: translationReady ? "已有数据" : "待补充", ready: translationReady },
    { title: "写作训练", to: "/writing", status: writingReady ? "已有数据" : "待补充", ready: writingReady },
  ];
}

export default function ExamCenter() {
  const years = getExamYears();

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">EXAM CENTER</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">真题中心</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        年份从本地数据中自动读取。每个年份统一显示阅读、完形、翻译、写作；暂无数据的模块显示待补充。
      </p>

      <div className="mt-7 space-y-5">
        {years.map((year) => (
          <SectionCard
            key={year}
            title={`${year} 年英语一`}
            description="按训练模块进入。"
            action={
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                本地数据
              </span>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {getModuleCards(year).map((module) => {
                const content = (
                  <div className="flex items-center justify-between gap-3">
                    <span>{module.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        module.ready
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {module.status}
                    </span>
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
