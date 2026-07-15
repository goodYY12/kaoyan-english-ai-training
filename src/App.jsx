import { Link, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import ClozeTraining from "./pages/ClozeTraining";
import Dashboard from "./pages/Dashboard";
import English2 from "./pages/English2";
import English2ReadingTraining from "./pages/English2ReadingTraining";
import ExamCenter from "./pages/ExamCenter";
import ExaminerThinking from "./pages/ExaminerThinking";
import MistakeBook from "./pages/MistakeBook";
import ReadingTraining from "./pages/ReadingTraining";
import TranslationTraining from "./pages/TranslationTraining";
import Vocabulary from "./pages/Vocabulary";
import WritingTraining from "./pages/WritingTraining";
import LearningHub from "./pages/LearningHub";

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
            <Route path="/" element={<LearningHub />} />
            <Route path="/english1" element={<Dashboard />} />
            <Route path="/english1/exams" element={<ExamCenter />} />
            <Route path="/english1/reading" element={<ReadingTraining />} />
            <Route path="/english1/cloze" element={<ClozeTraining />} />
            <Route path="/english1/examiner-thinking" element={<ExaminerThinking />} />
            <Route path="/english1/vocabulary" element={<Vocabulary />} />
            <Route path="/english1/translation" element={<TranslationTraining />} />
            <Route path="/english1/writing" element={<WritingTraining />} />
            <Route path="/english1/mistakes" element={<MistakeBook />} />
            <Route path="/exams" element={<ExamCenter />} />
            <Route path="/english2" element={<English2 />} />
            <Route path="/english2/reading" element={<English2ReadingTraining />} />
            <Route path="/reading" element={<ReadingTraining />} />
            <Route path="/cloze" element={<ClozeTraining />} />
            <Route path="/examiner-thinking" element={<ExaminerThinking />} />
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
