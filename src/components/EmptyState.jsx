import { Link } from "react-router";

export default function EmptyState({
  title = "错题本还是空的",
  description = "完成阅读训练并提交答案后，做错的题会自动保存在这里。",
}) {
  return (
    <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50 px-6 py-14 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
        ✓
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
      <Link
        to="/reading"
        className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        去做阅读训练
      </Link>
    </div>
  );
}
