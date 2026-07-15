import { Link } from "react-router";
import { setSelectedPaper } from "../utils/paperSelection";

const modules = [
  {
    id: "english1",
    eyebrow: "ENGLISH I",
    title: "考研英语一",
    description: "面向学术型硕士考试：真题阅读、完形、翻译、写作与错题复盘。",
    to: "/english1",
    tone: "from-blue-700 to-indigo-600",
    status: "已上线",
  },
  {
    id: "english2",
    eyebrow: "ENGLISH II",
    title: "考研英语二",
    description: "独立题库与训练空间。第一阶段已开放 2007—2010 阅读训练。",
    to: "/english2",
    tone: "from-cyan-600 to-blue-600",
    status: "阅读已上线",
  },
];

export default function LearningHub() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-8 text-white shadow-xl sm:p-12">
        <p className="text-sm font-bold tracking-[0.2em] text-blue-200">AI ENGLISH LAB</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">考研英语学习平台</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">先选择你的考试方向。进入后，题库、训练记录和复盘路径都会保持在对应的学习世界中，互不混用。</p>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold text-blue-600">选择学习方向</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">你准备哪一套考试？</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {modules.map((module) => (
            <Link key={module.id} to={module.to} onClick={() => setSelectedPaper(module.id)} className={"group overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl " + module.tone}>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-[0.16em]">{module.eyebrow}</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{module.status}</span>
              </div>
              <h3 className="mt-9 text-3xl font-bold">{module.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-blue-50">{module.description}</p>
              <p className="mt-8 text-sm font-bold">进入训练空间 <span className="ml-1 transition group-hover:ml-2">→</span></p>
            </Link>
          ))}
        </div>
      </section>

      <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-slate-500">雅思、四六级等后续模块会继续以同样的入口卡片加入，不会挤进英语一或英语二的训练空间。</p>
    </div>
  );
}
