import assert from "node:assert/strict";
import test from "node:test";
import {
  getAvailableYears,
  getClozeByYear,
  getClozeYears,
  getExamYears,
  getReadingsByYear,
  getSimilarQuestionsByType,
  hasClozeData,
  hasTranslationData,
  hasWritingData,
  normalizeQuestion,
  normalizeReading,
  normalizeVocabulary,
  splitPassageIntoParagraphs,
} from "./dataAdapter.js";

test("normalizes readings and exposes available years", () => {
  const years = getAvailableYears();
  assert.deepEqual(years, [2026, 2024]);

  const readings = getReadingsByYear(2026);
  assert.equal(readings.length, 4);
  assert.equal(readings[0].id, "2026-text1");
  assert.equal(readings[0].questions.length, 5);

  const readings2024 = getReadingsByYear(2024);
  assert.equal(readings2024.length, 4);
  assert.equal(readings2024[0].id, "2024-text1");
  assert.equal(readings2024[0].questions.length, 5);
});

test("exposes unified exam years from all module data", () => {
  assert.deepEqual(getExamYears(), [2026, 2024]);
});

test("normalizes old and new question fields", () => {
  const question = normalizeQuestion(
    {
      questionNumber: 21,
      questionText: "Question text",
      answer: "A",
      questionType: "细节题",
      commonMistake: "定位错误",
    },
    { year: 2026, textNumber: "Text 1" },
  );

  assert.equal(question.id, "2026-text1-q21");
  assert.equal(question.type, "细节题");
  assert.equal(question.commonMistake, "定位错误");
});

test("normalizes vocabulary groups with source metadata", () => {
  const reading = normalizeReading({
    year: 2026,
    textNumber: "Text 1",
    vocabulary: [{ word: "claim", meaning: "声称", sentence: "claim it" }],
    vocabularyGroups: {
      familiarWordsWithNewMeanings: [{ word: "address", meaning: "处理" }],
    },
    questions: [],
  });

  const words = normalizeVocabulary(reading);
  assert.equal(words.length, 2);
  assert.equal(words[0].category, "核心词汇");
  assert.equal(words[1].category, "熟词僻义");
  assert.equal(words[0].year, 2026);
});

test("recommends similar questions by type and skips current ids", () => {
  const [reading] = getReadingsByYear(2026);
  const current = reading.questions[0];
  const recommendations = getSimilarQuestionsByType({
    allReadings: getReadingsByYear(2026),
    wrongQuestionTypes: [current.type],
    wrongReasons: [current.commonMistake],
    currentQuestionIds: [current.id],
    limit: 3,
  });

  assert.ok(recommendations.every((item) => item.question.id !== current.id));
  assert.ok(recommendations.length > 0);
});

test("splits passage into labeled paragraphs", () => {
  const paragraphs = splitPassageIntoParagraphs("First paragraph.\n\nSecond paragraph.");

  assert.deepEqual(paragraphs, [
    { label: "P1", text: "First paragraph." },
    { label: "P2", text: "Second paragraph." },
  ]);
});

test("loads cloze placeholder without pretending it is real data", () => {
  const years = getClozeYears();
  assert.ok(years.includes(2026));

  const items = getClozeByYear(2026);
  assert.equal(items.length, 1);
  assert.equal(items[0].sourceType, "待补充");
  assert.equal(items[0].status, "待补充");
  assert.equal(items[0].blanks.length, 0);
  assert.equal(items[0].estimatedTime, 15);
  assert.equal(hasClozeData(items[0]), false);
});

test("detects missing translation and writing placeholders", () => {
  assert.equal(hasTranslationData({ year: 2026, status: "待补充" }), false);
  assert.equal(hasWritingData({ year: 2026, status: "待补充" }), false);
});
