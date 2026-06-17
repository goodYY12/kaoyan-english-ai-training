import assert from "node:assert/strict";
import test from "node:test";
import {
  getAvailableYears,
  getClozeByYear,
  getClozeYears,
  getLongReadingSpecials,
  getReadingsByYear,
  getSimilarQuestionsByType,
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

test("builds two pilot long-reading specials from existing papers", () => {
  const specials = getLongReadingSpecials({ limit: 2 });

  assert.equal(specials.length, 2);
  for (const item of specials) {
    assert.ok(item.id);
    assert.ok(item.year);
    assert.match(item.textNumber, /^Text [1-4]$/);
    assert.ok(item.title || item.title === "");
    assert.equal(item.topic || "待标注", item.topic ?? "待标注");
    assert.deepEqual(item.focusPoints, ["信息定位", "段落结构", "主旨判断", "同义替换"]);
    assert.equal(item.questions.length, 5);
    assert.ok(item.paragraphs.length > 1);
    assert.ok(item.vocabulary.length > 0);
  }
});

test("splits passage into labeled paragraphs", () => {
  const paragraphs = splitPassageIntoParagraphs("First paragraph.\n\nSecond paragraph.");

  assert.deepEqual(paragraphs, [
    { label: "P1", text: "First paragraph." },
    { label: "P2", text: "Second paragraph." },
  ]);
});

test("loads cloze pilot data with twenty blanks", () => {
  const years = getClozeYears();
  assert.ok(years.includes(2026));

  const items = getClozeByYear(2026);
  assert.equal(items.length, 1);
  assert.equal(items[0].sourceType, "模拟");
  assert.equal(items[0].blanks.length, 20);
  assert.equal(items[0].estimatedTime, 15);
  assert.ok(items[0].passageParts.some((part) => part.type === "blank"));
  assert.ok(items[0].vocabularyGroups.phrases.length > 0);

  for (const blank of items[0].blanks) {
    assert.deepEqual(Object.keys(blank.options), ["A", "B", "C", "D"]);
    assert.match(blank.answer, /^[A-D]$/);
    assert.ok(blank.explanation.length > 5);
  }
});
