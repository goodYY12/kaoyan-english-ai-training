import { Link } from "react-router";
import SectionCard from "../components/SectionCard";
import {
  getAvailableYears,
  getReadingsByYear,
  getTranslationByYear,
  getWritingByYear,
} from "../utils/dataAdapter";

function getModuleCards(year) {
  const readings = getReadingsByYear(year);
  const translation = getTranslationByYear(year);
  const writing = getWritingByYear(year);

  return [
    { title: "阅读训练", to: "/reading", status: readings.length ? `${readings.length} 篇` : "待补充" },
    { title: "翻译训练", to: "/translation", status: translation.status === "待补充" ? "待补充" : "已接入" },
    { title: "写作训练", to: "/writing", status: writing.status === "待补充" ? "待补充" : "已接入" },
    { title: "词汇复盘", to: "/vocabulary", status: readings.length ? "已接入" : "待补充" },
    { title: "长难句训练", to: "/sentences", status: readings.length ? "已接入" : "待补充" },
    { title: "错题复盘", to: "/mistakes", status: "本地记录" },
  ];
}

export default function ExamCenter() {
  const years = getAvailableYears();

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">EXAM CENTER</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">真题中心</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        年份从真题数据中自动读取。以后新增年份数据后，这里会按年份倒序自动出现入口。
      </p>

      <div className="mt-7 space-y-5">
        {years.map((year) => (
          <SectionCard
            key={year}
            title={`${year} 年英语一`}
            description="按训练模块进入，暂无数据的模块会显示待补充。"
            action={
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                已录入阅读
              </span>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {getModuleCards(year).map((module) => (
                <Link
                  key={module.title}
                  to={module.to}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{module.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        module.status === "待补充"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {module.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
