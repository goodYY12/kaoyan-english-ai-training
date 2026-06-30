import assert from "node:assert/strict";
import test from "node:test";
import {
  getAvailableYears,
  getClozeByYear,
  getClozeYears,
  getExamDatabaseStats,
  getExamYears,
  getReadingsByYear,
  getSimilarQuestionsByType,
  hasClozeData,
  hasReadingData,
  hasTranslationData,
  hasWritingData,
  normalizeQuestion,
  normalizeReading,
  normalizeVocabulary,
  splitPassageIntoParagraphs,
} from "./dataAdapter.js";

test("normalizes readings and exposes available years", () => {
  const years = getAvailableYears();
  assert.deepEqual(years, [
    2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
    2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007,
  ]);

  const readings = getReadingsByYear(2026);
  assert.equal(readings.length, 4);
  assert.equal(readings[0].id, "2026-text1");
  assert.equal(readings[0].questions.length, 5);

  const readings2024 = getReadingsByYear(2024);
  assert.equal(readings2024.length, 4);
  assert.equal(readings2024[0].id, "2024-text1");
  assert.equal(readings2024[0].questions.length, 5);

  const readings2023 = getReadingsByYear(2023);
  assert.equal(readings2023.length, 4);
  assert.equal(readings2023[0].id, "2023-text1");
  assert.equal(readings2023[0].questions.length, 5);

  const readings2022 = getReadingsByYear(2022);
  assert.equal(readings2022.length, 4);
  assert.equal(readings2022[0].id, "2022-text1");
  assert.equal(readings2022[0].questions.length, 5);

  const readings2021 = getReadingsByYear(2021);
  assert.equal(readings2021.length, 4);
  assert.equal(readings2021[0].id, "2021-text1");
  assert.equal(readings2021[0].questions.length, 5);

  for (const year of [2020, 2019, 2018]) {
    const imported = getReadingsByYear(year);
    assert.equal(imported.length, 4);
    assert.equal(imported[0].id, `${year}-text1`);
    assert.equal(imported[0].questions.length, 5);
  }

  for (const year of [2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007]) {
    const imported = getReadingsByYear(year);
    assert.equal(imported.length, 4);
    assert.equal(imported[0].id, `${year}-text1`);
    assert.equal(imported[0].questions.length, 5);
  }
});

test("exposes unified exam years from all module data", () => {
  assert.deepEqual(getExamYears(), [
    2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
    2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007,
  ]);
});

test("summarizes the local exam database", () => {
  const stats = getExamDatabaseStats();

  assert.equal(stats.firstYear, 2007);
  assert.equal(stats.latestYear, 2026);
  assert.equal(stats.yearCount, 20);
  assert.equal(stats.readingTextCount, 80);
  assert.equal(stats.readingQuestionCount, 400);
  assert.equal(stats.clozeCount, 20);
  assert.equal(stats.clozeBlankCount, 400);
  assert.ok(stats.readingAnsweredCount > 0);
  assert.ok(stats.clozeAnsweredCount > 0);
});

test("distinguishes complete reading data from answerless imports", () => {
  assert.equal(hasReadingData(getReadingsByYear(2019)[0]), true);
  assert.equal(hasReadingData(getReadingsByYear(2018)[0]), false);
  assert.equal(hasReadingData(getReadingsByYear(2020)[0]), false);
  assert.equal(hasReadingData(getReadingsByYear(2025)[0]), false);
  assert.equal(hasReadingData(getReadingsByYear(2026)[0]), true);
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

test("loads 2026 cloze data with twenty blanks", () => {
  const years = getClozeYears();
  assert.ok(years.includes(2026));

  const items = getClozeByYear(2026);
  assert.equal(items.length, 1);
  assert.equal(items[0].sourceType, "真题");
  assert.equal(items[0].status, "已有数据");
  assert.equal(items[0].blanks.length, 20);
  assert.equal(items[0].estimatedTime, 15);
  assert.equal(hasClozeData(items[0]), true);
});

test("detects 2026 translation and writing data", () => {
  assert.equal(hasTranslationData({ year: 2026, status: "待补充" }), false);
  assert.equal(hasWritingData({ year: 2026, status: "待补充" }), false);
  assert.equal(hasTranslationData({ year: 2026, status: "已有数据", items: [{ sentence: "x" }] }), true);
  assert.equal(hasWritingData({ year: 2026, status: "已有数据", smallWriting: { prompt: "x" } }), true);
});
