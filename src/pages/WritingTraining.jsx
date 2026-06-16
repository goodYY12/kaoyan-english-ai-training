import { useState } from "react";
import SectionCard from "../components/SectionCard";
import { getAvailableYears, getWritingByYear } from "../utils/dataAdapter";

export default function WritingTraining() {
  const years = getAvailableYears();
  const [year, setYear] = useState(years[0] ?? 2026);
  const [essayType, setEssayType] = useState("小作文");
  const [content, setContent] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const item = getWritingByYear(year);
  const task = item?.tasks?.find((entry) => entry.type === essayType);
  const hasData = item.status !== "待补充" && task;

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">WRITING</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">写作训练</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        先搭好小作文和大作文训练框架。真实题目未录入时，只显示待补充，不乱编真题。
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          选择年份
          <select
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value));
              setContent("");
              setShowGuide(false);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {years.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          训练类型
          <select
            value={essayType}
            onChange={(event) => {
              setEssayType(event.target.value);
              setContent("");
              setShowGuide(false);
            }}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="小作文">小作文</option>
            <option value="大作文">大作文</option>
          </select>
        </label>
      </div>

      <SectionCard className="mt-7" title={`${year} ${essayType}`}>
        {!hasData ? (
          <p className="rounded-xl bg-amber-50 p-5 text-sm font-medium text-amber-700">
            {year} 写作真题数据待补充
          </p>
        ) : (
          <>
            <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {task.prompt}
            </p>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={9}
              placeholder="在这里输入你的作文..."
              className="mt-5 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowGuide((current) => !current)}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {showGuide ? "收起写作思路" : "查看写作思路"}
            </button>
            {showGuide && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-blue-50 p-4">
                  <h3 className="font-bold text-blue-800">结构</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{task.structure ?? "待补充"}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <h3 className="font-bold text-amber-800">常见扣分点</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{task.deductions ?? "待补充"}</p>
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </div>
  );
}
