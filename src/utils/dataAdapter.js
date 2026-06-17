import text2024_1 from "../data/papers/2024/text1.json" with { type: "json" };
import text2024_2 from "../data/papers/2024/text2.json" with { type: "json" };
import text2024_3 from "../data/papers/2024/text3.json" with { type: "json" };
import text2024_4 from "../data/papers/2024/text4.json" with { type: "json" };
import text1 from "../data/papers/2026/text1.json" with { type: "json" };
import text2 from "../data/papers/2026/text2.json" with { type: "json" };
import text3 from "../data/papers/2026/text3.json" with { type: "json" };
import text4 from "../data/papers/2026/text4.json" with { type: "json" };
import translationItems from "../data/translationItems.json" with { type: "json" };
import writingTemplates from "../data/writingTemplates.json" with { type: "json" };

const rawReadings = [
  text1,
  text2,
  text3,
  text4,
  text2024_1,
  text2024_2,
  text2024_3,
  text2024_4,
];

function normalizeTextNumber(textNumber) {
  if (typeof textNumber === "number") return `Text ${textNumber}`;
  return textNumber ?? "Text 1";
}

function getTextNumberValue(textNumber) {
  const normalized = normalizeTextNumber(textNumber);
  return Number(normalized.replace(/\D/g, "")) || 1;
}

export function normalizeQuestion(question, reading) {
  const year = reading.year;
  const textNumber = normalizeTextNumber(reading.textNumber);
  const questionNumber =
    question.questionNumber ??
    question.number ??
    Number(String(question.id ?? "").match(/\d+$/)?.[0] ?? 0);
  const type = question.type ?? question.questionType ?? "待补充";
  const commonMistake = question.commonMistake ?? question.wrongReason ?? "待补充";

  return {
    ...question,
    id:
      question.id ??
      `${year}-${textNumber.toLowerCase().replace(" ", "")}-q${questionNumber}`,
    questionNumber,
    questionText: question.questionText ?? question.question ?? "待补充",
    question: question.question ?? question.questionText ?? "待补充",
    options: question.options ?? {},
    answer: question.answer ?? question.correctAnswer ?? "",
    type,
    questionType: type,
    explanation: question.explanation ?? "待补充",
    trapAnalysis: question.trapAnalysis ?? question.thinkingMethod ?? "待补充",
    commonMistake,
    wrongReason: commonMistake,
    location: question.location ?? question.examinerThinking?.sourceSentence ?? "待补充",
    examinerThinking: question.examinerThinking ?? null,
    sourceSentenceAnalysis: question.sourceSentenceAnalysis ?? null,
  };
}

export function normalizeReading(reading) {
  const textNumber = normalizeTextNumber(reading.textNumber);
  const normalized = {
    ...reading,
    id:
      reading.id ??
      `${reading.year}-${textNumber.toLowerCase().replace(" ", "")}`,
    paper: reading.paper ?? reading.paperType ?? "英语一",
    paperType: reading.paperType ?? "English I",
    textNumber,
    textNumberValue: getTextNumberValue(textNumber),
    title: reading.title ?? "",
    passage: reading.passage ?? "",
    questions: [],
  };

  normalized.questions = (reading.questions ?? []).map((question) =>
    normalizeQuestion(question, normalized),
  );

  return normalized;
}

export function getAllReadings() {
  return rawReadings.map(normalizeReading);
}

export function getAvailableYears() {
  return [...new Set(getAllReadings().map((reading) => reading.year))].sort(
    (a, b) => b - a,
  );
}

export function getReadingsByYear(year) {
  return getAllReadings()
    .filter((reading) => reading.year === Number(year))
    .sort((a, b) => a.textNumberValue - b.textNumberValue);
}

export function getTranslationByYear(year) {
  return (
    translationItems.find((item) => item.year === Number(year)) ?? {
      year: Number(year),
      status: "待补充",
    }
  );
}

export function getWritingByYear(year) {
  return (
    writingTemplates.find((item) => item.year === Number(year)) ?? {
      year: Number(year),
      status: "待补充",
    }
  );
}

export function normalizeVocabulary(reading) {
  const normalizedReading = normalizeReading(reading);
  const baseWords = (reading.vocabulary ?? [])
    .filter((item) => typeof item === "object")
    .map((item) => ({
      ...item,
      category: item.category ?? "核心词汇",
      year: normalizedReading.year,
      textNumber: normalizedReading.textNumber,
      source: normalizedReading.id,
      meaningInContext: item.meaningInContext ?? item.meaning ?? "待补充",
      explanation: item.explanation ?? item.note ?? "待补充",
    }));

  const groups = reading.vocabularyGroups ?? {};
  const coreWords = (groups.coreWords ?? []).map((item) => ({
    ...item,
    category: "核心词汇",
    year: normalizedReading.year,
    textNumber: normalizedReading.textNumber,
    source: normalizedReading.id,
  }));
  const familiarWords = (groups.familiarWordsWithNewMeanings ?? []).map(
    (item) => ({
      ...item,
      category: "熟词僻义",
      year: normalizedReading.year,
      textNumber: normalizedReading.textNumber,
      source: normalizedReading.id,
      note: item.note ?? "不是常见义",
    }),
  );

  return [...baseWords, ...coreWords, ...familiarWords];
}

export function getAllVocabulary() {
  return getAllReadings().flatMap((reading) => normalizeVocabulary(reading));
}

export function getSimilarQuestionsByType({
  allReadings = getAllReadings(),
  wrongQuestionTypes = [],
  wrongReasons = [],
  currentQuestionIds = [],
  limit = 3,
}) {
  const currentIds = new Set(currentQuestionIds);
  const typeSet = new Set(wrongQuestionTypes);
  const reasonSet = new Set(wrongReasons);

  return allReadings
    .flatMap((reading) =>
      normalizeReading(reading).questions.map((question) => ({
        reading: normalizeReading(reading),
        question,
      })),
    )
    .filter(({ question }) => !currentIds.has(question.id))
    .filter(({ question }) => typeSet.size === 0 || typeSet.has(question.type))
    .sort((a, b) => {
      const aReason = reasonSet.has(a.question.commonMistake) ? 0 : 1;
      const bReason = reasonSet.has(b.question.commonMistake) ? 0 : 1;
      return aReason - bReason;
    })
    .slice(0, limit)
    .map((item) => ({
      ...item,
      reason: reasonSet.has(item.question.commonMistake)
        ? "同题型且错因相近"
        : "同题型巩固训练",
    }));
}

export function splitPassageIntoParagraphs(passage = "") {
  const parts = String(passage)
    .split(/\n\s*\n/g)
    .map((part) => part.trim())
    .filter(Boolean);

  const paragraphs = parts.length > 0 ? parts : [String(passage).trim()].filter(Boolean);

  return paragraphs.map((text, index) => ({
    label: `P${index + 1}`,
    text,
  }));
}

function inferTargetParagraph(question, paragraphs) {
  if (question.targetParagraph) return question.targetParagraph;
  const location = question.location;
  if (!location || location === "待补充") return null;
  const normalizedLocation = location.toLowerCase().replace(/\s+/g, " ").slice(0, 80);

  const match = paragraphs.find((paragraph) =>
    paragraph.text.toLowerCase().replace(/\s+/g, " ").includes(normalizedLocation),
  );

  return match?.label ?? null;
}

export function getLongReadingSpecials({ limit = 2 } = {}) {
  return getAllReadings()
    .filter((reading) => normalizeVocabulary(reading).length > 0)
    .slice(0, limit)
    .map((reading) => {
      const paragraphs = splitPassageIntoParagraphs(reading.passage);
      const questions = reading.questions.map((question) => ({
        ...question,
        targetParagraph: inferTargetParagraph(question, paragraphs),
      }));

      return {
        ...reading,
        topic: reading.topic ?? "待标注",
        focusPoints: reading.focusPoints ?? ["信息定位", "段落结构", "主旨判断", "同义替换"],
        paragraphs,
        questions,
        vocabulary: normalizeVocabulary(reading),
        structureMap: reading.structureMap ?? [],
      };
    });
}
