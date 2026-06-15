import { Link } from "react-router";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";

const quickLinks = [
  { to: "/reading", title: "开始阅读训练", text: "用模拟题练习定位与排除。" },
  {
    to: "/examiner-thinking",
    title: "学习命题规律",
    text: "识别常见陷阱与出题套路。",
  },
  { to: "/mistakes", title: "复习错题", text: "回看错误选择并标记已复习。" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-lg shadow-blue-200 sm:p-10">
        <p className="text-sm font-semibold tracking-[0.18em] text-blue-100">
          考研英一 AI 提分训练平台
        </p>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
          不只是刷真题，
          <br />
          而是训练出题人思维。
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
          第一版先把训练结构搭起来：做题、看解析、识别命题规律，并把需要回看的题留在错题本。
        </p>
        <Link
          to="/reading"
          className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50"
        >
          开始今日训练
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="今日任务" value="2 道" note="细节题与推理题各 1 道" />
        <StatCard
          label="学习进度"
          value="68%"
          note="本周已完成 5 个训练单元"
          tone="cyan"
        />
        <StatCard
          label="阅读正确率"
          value="76%"
          note="示例数据，后续可接真实统计"
          tone="violet"
        />
        <StatCard
          label="高频错因"
          value="范围扩大"
          note="重点检查 all、only、always"
          tone="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="今日任务"
          description="任务数据目前为本地示例，后续可以逐步替换。"
        >
          <div className="space-y-3">
            {["完成 2 道阅读模拟题", "复习 1 条干扰项规律", "拆解 1 个长难句"].map(
              (task, index) => (
                <div
                  key={task}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{task}</span>
                </div>
              ),
            )}
          </div>
        </SectionCard>

        <SectionCard title="本周薄弱点" description="从错因出发安排下一次训练。">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">范围扩大</span>
                <span className="text-slate-500">42%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[42%] rounded-full bg-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">无中生有</span>
                <span className="text-slate-500">28%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[28%] rounded-full bg-blue-500" />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="快捷入口">
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
            >
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                进入页面 →
              </span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
