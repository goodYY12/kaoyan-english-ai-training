import SectionCard from "../components/SectionCard";
import examYears from "../data/examYears.json";

export default function ExamCenter() {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">EXAM CENTER</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">真题中心</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        第一版只建立年份与题型入口，后续你可以逐年补充题目内容。
      </p>

      <div className="mt-7 space-y-5">
        {examYears.map((exam) => (
          <SectionCard
            key={exam.year}
            title={`${exam.year} 年英语一`}
            description="静态目录卡片"
            action={
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {exam.status}
              </span>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exam.sections.map((section) => (
                <div
                  key={section}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {section}
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
