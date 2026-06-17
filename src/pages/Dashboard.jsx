import { useMemo } from "react";
import { Link } from "react-router";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import {
  getHighFrequencyMistakes,
  getReadingRecords,
  getReadingStats,
} from "../utils/trainingStorage";

const exampleTasks = ["完成 1 篇阅读训练", "练 1 篇完形专项", "复盘 5 个核心词"];

function getClozeStats(records) {
  const clozeRecords = records.filter((item) => item.mode === "cloze");
  const total = clozeRecords.reduce((sum, item) => sum + item.total, 0);
  const correct = clozeRecords.reduce((sum, item) => sum + item.correct, 0);
  return {
    count: clozeRecords.length,
    accuracy: total === 0 ? 0 : Math.round((correct / total) * 100),
    total,
    correct,
  };
}

function getTodayTasks(hasRecords, frequentReasons) {
  if (!hasRecords) return exampleTasks;
  const topReason = frequentReasons[0]?.reason ?? "错题定位句";
  return [
    `复盘高频错因：${topReason}`,
    "完成 1 篇完形专项，重点看固定搭配",
    "重做错题本中未掌握题目",
  ];
}

export default function Dashboard() {
  const records = useMemo(() => getReadingRecords(), []);
  const stats = useMemo(() => getReadingStats(), []);
  const clozeStats = useMemo(() => getClozeStats(records), [records]);
  const frequentReasons = useMemo(() => getHighFrequencyMistakes(), []);
  const hasRecords = records.length > 0;
  const tasks = getTodayTasks(hasRecords, frequentReasons);
  const topReason = frequentReasons[0]?.reason ?? "范围扩大";

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
          现在网站会把阅读、完形、错因、定位句和词汇复盘串起来，帮你形成训练闭环。
        </p>
        <Link
          to="/cloze"
          className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50"
        >
          开始完形专项
        </Link>
      </section>

      {!hasRecords && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          当前暂无真实训练记录，下面先显示示例数据。完成阅读或完形并提交后，这里会自动变成你的真实统计。
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="今日任务" value={`${tasks.length} 项`} note={tasks[0]} />
        <StatCard
          label="阅读正确率"
          value={hasRecords ? `${stats.accuracy}%` : "76%"}
          note={hasRecords ? `${stats.correctQuestions}/${stats.totalQuestions} 题正确` : "示例数据"}
          tone="violet"
        />
        <StatCard
          label="完形完成"
          value={hasRecords ? `${clozeStats.count} 篇` : "示例"}
          note={clozeStats.count ? `正确率 ${clozeStats.accuracy}%` : "提交完形后自动统计"}
          tone="cyan"
        />
        <StatCard
          label="高频错因"
          value={hasRecords ? topReason : "范围扩大"}
          note={hasRecords ? "根据错题本统计" : "示例数据"}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="今日任务"
          description={hasRecords ? "根据你的薄弱项生成" : "示例任务，完成训练后会自动调整"}
        >
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
                <span className="grid size-8 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-700">{task}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="高频错因" description="从错因出发安排下一次训练">
          <div className="space-y-4">
            {(hasRecords ? frequentReasons : [{ reason: "范围扩大", count: 2 }]).map(
              (item) => (
                <div key={item.reason}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.reason}</span>
                    <span className="text-slate-500">{item.count} 次</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-2/3 rounded-full bg-amber-400" />
                  </div>
                </div>
              ),
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="快捷入口">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { to: "/reading", title: "阅读训练", text: "完成一篇文章和 5 道题。" },
            { to: "/cloze", title: "完形专项", text: "完成 20 空长语篇训练。" },
            { to: "/mistakes", title: "错题本", text: "查看错题、错因和长难句。" },
          ].map((item) => (
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
