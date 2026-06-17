import { Link, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import ClozeTraining from "./pages/ClozeTraining";
import Dashboard from "./pages/Dashboard";
import ExamCenter from "./pages/ExamCenter";
import ExaminerThinking from "./pages/ExaminerThinking";
import LongReadingSpecial from "./pages/LongReadingSpecial";
import MistakeBook from "./pages/MistakeBook";
import ReadingTraining from "./pages/ReadingTraining";
import SentenceTraining from "./pages/SentenceTraining";
import TranslationTraining from "./pages/TranslationTraining";
import Vocabulary from "./pages/Vocabulary";
import WritingTraining from "./pages/WritingTraining";

function NotFound() {
  return (
    <div className="grid min-h-[65vh] place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-blue-600">404</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">页面不存在</h2>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="px-4 py-6 sm:px-6 md:ml-72 md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exams" element={<ExamCenter />} />
            <Route path="/reading" element={<ReadingTraining />} />
            <Route path="/cloze" element={<ClozeTraining />} />
            <Route path="/long-reading" element={<LongReadingSpecial />} />
            <Route path="/examiner-thinking" element={<ExaminerThinking />} />
            <Route path="/sentences" element={<SentenceTraining />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/translation" element={<TranslationTraining />} />
            <Route path="/writing" element={<WritingTraining />} />
            <Route path="/mistakes" element={<MistakeBook />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
