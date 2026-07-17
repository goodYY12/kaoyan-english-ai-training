import readingData from "../data/englishII/readingData.js";
import vocabulary from "../data/englishII/vocabulary.json" with { type: "json" };
import clozeData from "../data/englishII/clozeData.json" with { type: "json" };
import translationItems from "../data/englishII/translationItems.json" with { type: "json" };
import writingTemplates from "../data/englishII/writingTemplates.json" with { type: "json" };
import studyGuides from "../data/englishII/studyGuides.json" with { type: "json" };
import { readingEnhancements2010 } from "../data/englishII/readingEnhancements2010.js";
import {
  englishIIClozeItems,
  englishIITranslationItems,
  englishIIWritingItems,
} from "../data/englishII/trainingData.js";

const ENGLISH_TWO_START_YEAR = 2010;

function isEnglishIIYear(item) {
  return Number(item?.year ?? item) >= ENGLISH_TWO_START_YEAR;
}

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
    const enhancement = readingEnhancements2010[reading.id] ?? {};
    const questionEnhancements = enhancement.questions ?? {};
    const normalized = {
      ...reading,
      ...enhancement,
      id: reading.id ?? `${reading.year}-english2-text${reading.textNumber}`,
      paper: "英语二",
      paperType: "English II",
      title: reading.title ?? "",
      passage: reading.passage ?? "",
      questions: [],
      vocabulary: enhancement.vocabulary ?? reading.vocabulary ?? [],
      vocabularyGroups: enhancement.vocabularyGroups ?? reading.vocabularyGroups ?? {},
      readingTips: reading.readingTips ?? [],
    };
    normalized.questions = (reading.questions ?? []).map((question) =>
      normalizeQuestion({ ...question, ...(questionEnhancements[question.id] ?? {}) }, normalized),
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
  ].filter(isEnglishIIYear).sort((a, b) => b - a);
}

export function getEnglishIIModuleData() {
  return {
    readings: getEnglishIIReadings(),
    vocabulary,
    cloze: [...clozeData, ...englishIIClozeItems].filter(isEnglishIIYear),
    translations: [...translationItems, ...englishIITranslationItems].filter(isEnglishIIYear),
    writing: [...writingTemplates, ...englishIIWritingItems].filter(isEnglishIIYear),
    studyGuides,
  };
}

export function getEnglishIIClozeByYear(year) {
  return englishIIClozeItems.filter((item) => isEnglishIIYear(item) && Number(item.year) === Number(year));
}

export function getEnglishIITranslationByYear(year) {
  if (!isEnglishIIYear(year)) return null;
  return englishIITranslationItems.find((item) => Number(item.year) === Number(year)) ?? null;
}

export function getEnglishIIWritingByYear(year) {
  if (!isEnglishIIYear(year)) return null;
  return englishIIWritingItems.find((item) => Number(item.year) === Number(year)) ?? null;
}
