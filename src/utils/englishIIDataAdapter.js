import readingData from "../data/englishII/readingData.js";
import vocabulary from "../data/englishII/vocabulary.json" with { type: "json" };
import clozeData from "../data/englishII/clozeData.json" with { type: "json" };
import translationItems from "../data/englishII/translationItems.json" with { type: "json" };
import writingTemplates from "../data/englishII/writingTemplates.json" with { type: "json" };
import studyGuides from "../data/englishII/studyGuides.json" with { type: "json" };
import {
  englishIIClozeItems,
  englishIITranslationItems,
  englishIIWritingItems,
} from "../data/englishII/trainingData.js";

const markdownFiles = import.meta.glob("../data/English-II/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function normalizeQuestion(question, reading) {
  return {
    ...question,
    id: question.id ?? `${reading.id}-q${question.questionNumber ?? 0}`,
    options: question.options ?? { A: "", B: "", C: "", D: "" },
    answer: question.answer ?? "",
    type: question.type ?? "",
    explanation: question.explanation ?? "",
    commonMistake: question.commonMistake ?? "",
    examinerThinking: question.examinerThinking ?? null,
    sentenceTraining: question.sentenceTraining ?? null,
  };
}

export function getEnglishIIReadings() {
  return readingData.map((reading) => {
    const normalized = {
      ...reading,
      id: reading.id ?? `${reading.year}-english2-text${reading.textNumber}`,
      paper: "英语二",
      paperType: "English II",
      title: reading.title ?? "",
      passage: reading.passage ?? "",
      questions: [],
      vocabulary: reading.vocabulary ?? [],
      vocabularyGroups: reading.vocabularyGroups ?? {},
      readingTips: reading.readingTips ?? [],
    };
    normalized.questions = (reading.questions ?? []).map((question) =>
      normalizeQuestion(question, normalized),
    );
    return normalized;
  });
}

export function getEnglishIIReadingsByYear(year) {
  return getEnglishIIReadings().filter((reading) => Number(reading.year) === Number(year));
}

export function getEnglishIIYears() {
  return [
    ...new Set([
      ...getEnglishIIReadings().map((item) => item.year),
      ...clozeData.map((item) => item.year),
      ...englishIIClozeItems.map((item) => item.year),
      ...englishIITranslationItems.map((item) => item.year),
      ...englishIIWritingItems.map((item) => item.year),
    ]),
  ].sort((a, b) => b - a);
}

export function getEnglishIIModuleData() {
  return {
    readings: getEnglishIIReadings(),
    vocabulary,
    cloze: [...clozeData, ...englishIIClozeItems],
    translations: [...translationItems, ...englishIITranslationItems],
    writing: [...writingTemplates, ...englishIIWritingItems],
    studyGuides,
  };
}

export function getEnglishIIClozeByYear(year) {
  return englishIIClozeItems.filter((item) => Number(item.year) === Number(year));
}

export function getEnglishIITranslationByYear(year) {
  return englishIITranslationItems.find((item) => Number(item.year) === Number(year)) ?? null;
}

export function getEnglishIIWritingByYear(year) {
  return englishIIWritingItems.find((item) => Number(item.year) === Number(year)) ?? null;
}

function parseMarkdownDocument(source, path) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  const frontMatter = {};
  const body = match?.[2] ?? source;

  for (const line of (match?.[1] ?? "").split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    frontMatter[key] = value;
  }

  const category = path.match(/English-II[\\/]([^\\/]+)[\\/]/)?.[1] ?? "unknown";
  return { ...frontMatter, category, path, body: body.trim() };
}

export function getEnglishIIMarkdownContent() {
  return Object.entries(markdownFiles).map(([path, source]) =>
    parseMarkdownDocument(source, path),
  );
}
