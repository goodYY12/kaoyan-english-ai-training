import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

const englishOneSections = [
  { title: "学习首页", items: [{ to: "/english1", label: "英语一首页", end: true }, { to: "/english1/exams", label: "真题中心" }] },
  { title: "专项训练", items: [{ to: "/english1/reading", label: "阅读训练" }, { to: "/english1/cloze", label: "完形专项" }, { to: "/english1/translation", label: "翻译训练" }, { to: "/english1/writing", label: "写作训练" }] },
  { title: "复盘提升", items: [{ to: "/english1/examiner-thinking", label: "出题人思维" }, { to: "/english1/vocabulary", label: "词汇与熟词僻义" }, { to: "/english1/mistakes", label: "错题本" }] },
];

const englishTwoSections = [
  { title: "学习首页", items: [{ to: "/english2", label: "英语二首页", end: true }] },
  { title: "专项训练", items: [{ to: "/english2/reading", label: "阅读训练" }, { to: "/english2/cloze", label: "完形专项" }, { to: "/english2/translation", label: "翻译训练" }, { to: "/english2/writing", label: "写作训练" }] },
];

function getWorld(pathname) {
  if (pathname === "/") return "hub";
  if (pathname.startsWith("/english2")) return "english2";
  return "english1";
}

function NavigationLinks({ world }) {
  const sections = world === "english2" ? englishTwoSections : englishOneSections;
  let index = 0;
  return (
    <nav className="mt-8 space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{section.title}</p>
          <div className="mt-2 space-y-1.5">
            {section.items.map((item) => {
              index += 1;
              return <NavLink key={item.to + item.label} to={item.to} end={item.end} className={({ isActive }) => "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition " + (isActive ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700")}>
                <span className="grid size-7 place-items-center rounded-xl bg-current/10 text-xs">{String(index).padStart(2, "0")}</span>{item.label}
              </NavLink>;
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarContent({ world }) {
  const isEnglishTwo = world === "english2";
  if (world === "hub") {
    return <>
      <Link to="/" className="block">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">AI English Lab</p>
        <h1 className="mt-2 text-lg font-bold leading-7 text-slate-900">考研英语 AI 提分训练平台</h1>
      </Link>
      <div className="mt-8 space-y-2">
        <Link to="/english1" className="block rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">进入英语一训练</Link>
        <Link to="/english2" className="block rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-700">进入英语二训练</Link>
      </div>
    </>;
  }
  return <>
    <Link to="/" className="block">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">AI English Lab</p>
      <h1 className="mt-2 text-lg font-bold leading-7 text-slate-900">考研英语 AI 提分训练平台</h1>
    </Link>
    <div className="mt-5 flex gap-2">
      <Link to="/english1" className={"rounded-xl px-3 py-2 text-xs font-bold " + (!isEnglishTwo ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>英语一</Link>
      <Link to="/english2" className={"rounded-xl px-3 py-2 text-xs font-bold " + (isEnglishTwo ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>英语二</Link>
    </div>
    <NavigationLinks world={world} />
    <div className="mt-7 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-sm text-blue-900">
      <p className="font-semibold">当前学习方向</p>
      <p className="mt-1 leading-6 text-blue-700">{isEnglishTwo ? "英语二题库：阅读训练已接入。" : "英语一题库：进入真题中心开始训练。"}</p>
    </div>
  </>;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const world = getWorld(location.pathname);
  useEffect(() => setIsOpen(false), [location.pathname]);
  return <>
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <Link to="/" className="font-bold text-slate-900">考研英语学习平台</Link>
      <button type="button" onClick={() => setIsOpen(true)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">菜单</button>
    </header>
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 overflow-y-auto border-r border-slate-200 bg-white px-5 py-7 md:block"><SidebarContent world={world} /></aside>
    {isOpen && <div className="fixed inset-0 z-40 md:hidden"><button type="button" aria-label="关闭导航菜单" className="absolute inset-0 bg-slate-950/35" onClick={() => setIsOpen(false)} /><aside className="relative h-full w-[min(18rem,86vw)] overflow-y-auto bg-white px-5 py-7 shadow-2xl"><button type="button" onClick={() => setIsOpen(false)} className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm text-slate-500">关闭</button><SidebarContent world={world} /></aside></div>}
  </>;
}
