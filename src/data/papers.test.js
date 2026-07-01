import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import text1 from "./papers/2026/text1.json" with { type: "json" };
import text2 from "./papers/2026/text2.json" with { type: "json" };
import text3 from "./papers/2026/text3.json" with { type: "json" };
import text4 from "./papers/2026/text4.json" with { type: "json" };
import text2024_1 from "./papers/2024/text1.json" with { type: "json" };
import text2024_2 from "./papers/2024/text2.json" with { type: "json" };
import text2024_3 from "./papers/2024/text3.json" with { type: "json" };
import text2024_4 from "./papers/2024/text4.json" with { type: "json" };
import text2023_1 from "./papers/2023/text1.json" with { type: "json" };
import text2023_2 from "./papers/2023/text2.json" with { type: "json" };
import text2023_3 from "./papers/2023/text3.json" with { type: "json" };
import text2023_4 from "./papers/2023/text4.json" with { type: "json" };
import text2022_1 from "./papers/2022/text1.json" with { type: "json" };
import text2022_2 from "./papers/2022/text2.json" with { type: "json" };
import text2022_3 from "./papers/2022/text3.json" with { type: "json" };
import text2022_4 from "./papers/2022/text4.json" with { type: "json" };
import text2021_1 from "./papers/2021/text1.json" with { type: "json" };
import text2021_2 from "./papers/2021/text2.json" with { type: "json" };
import text2021_3 from "./papers/2021/text3.json" with { type: "json" };
import text2021_4 from "./papers/2021/text4.json" with { type: "json" };

const papers = [text1, text2, text3, text4];
const papers2024 = [text2024_1, text2024_2, text2024_3, text2024_4];
const papers2023 = [text2023_1, text2023_2, text2023_3, text2023_4];
const papers2022 = [text2022_1, text2022_2, text2022_3, text2022_4];
const papers2021 = [text2021_1, text2021_2, text2021_3, text2021_4];

test("2026 reading papers have one full passage and five complete questions", () => {
  assert.equal(papers.length, 4);

  for (const paper of papers) {
    assert.equal(paper.year, 2026);
    assert.equal(paper.paperType, "English I");
    assert.equal(paper.section, "Reading Comprehension");
    assert.match(paper.textNumber, /^Text [1-4]$/);
    assert.equal(typeof paper.passage, "string");
    assert.ok(paper.passage.length > 500);
    assert.equal(paper.questions.length, 5);

    for (const question of paper.questions) {
      assert.equal(typeof question.questionNumber, "number");
      assert.equal(typeof question.questionText, "string");
      assert.ok(question.questionText.length > 10);
      assert.deepEqual(Object.keys(question.options), ["A", "B", "C", "D"]);
      assert.match(question.answer, /^[A-D]$/);
      assert.equal(typeof question.explanation, "string");
      assert.ok(question.explanation.length > 10);
      assert.equal(typeof question.questionType, "string");
      assert.equal(typeof question.location, "string");
      assert.equal(typeof question.thinkingMethod, "string");
    }
  }
});

test("Text 1 questions include trap and mistake analysis", () => {
  for (const question of text1.questions) {
    assert.equal(typeof question.trapAnalysis, "string");
    assert.ok(question.trapAnalysis.length > 10);
    assert.equal(typeof question.commonMistake, "string");
    assert.ok(question.commonMistake.length > 10);
  }
});

test("Text 1 has enough structured vocabulary for the word self-test", () => {
  assert.ok(text1.vocabulary.length >= 30);

  for (const item of text1.vocabulary) {
    assert.equal(typeof item.word, "string");
    assert.equal(typeof item.meaning, "string");
    assert.equal(typeof item.partOfSpeech, "string");
    assert.equal(typeof item.sentence, "string");
    assert.equal(typeof item.sentenceTranslation, "string");
    assert.equal(typeof item.difficulty, "string");
    assert.equal(typeof item.sourceParagraph, "number");
    assert.deepEqual(Object.keys(item.options), ["A", "B", "C", "D"]);
    assert.match(item.answer, /^[A-D]$/);
    assert.equal(typeof item.meaningInContext, "string");
    assert.equal(typeof item.explanation, "string");
    assert.equal(item.meaning.includes("?"), false);
    assert.equal(item.sentenceTranslation.includes("?"), false);
    assert.equal(item.note.includes("?"), false);
  }
});

test("2024 reading papers are available in the same structure", () => {
  assert.equal(papers2024.length, 4);

  for (const paper of papers2024) {
    assert.equal(paper.year, 2024);
    assert.equal(paper.paperType, "English I");
    assert.equal(paper.section, "Reading Comprehension");
    assert.match(paper.textNumber, /^Text [1-4]$/);
    assert.ok(paper.passage.length > 500);
    assert.equal(paper.questions.length, 5);
    assert.ok(paper.vocabulary.length >= 10);

    for (const question of paper.questions) {
      assert.deepEqual(Object.keys(question.options), ["A", "B", "C", "D"]);
      assert.match(question.answer, /^[A-D]$/);
      assert.ok(question.explanation.length > 10);
      assert.ok(question.commonMistake.length > 10);
    }

    for (const word of paper.vocabulary) {
      assert.deepEqual(Object.keys(word.options), ["A", "B", "C", "D"]);
      assert.match(word.answer, /^[A-D]$/);
      assert.ok(word.meaningInContext.length > 1);
    }
  }
});

test("2023 and 2022 reading papers have extracted question data", () => {
  for (const paper of [...papers2023, ...papers2022]) {
    assert.match(paper.textNumber, /^Text [1-4]$/);
    assert.ok(paper.passage.length > 500);
    assert.equal(paper.questions.length, 5);

    for (const question of paper.questions) {
      assert.deepEqual(Object.keys(question.options), ["A", "B", "C", "D"]);
      assert.match(question.answer, /^[A-D]$/);
      assert.ok(question.questionText.length > 10);
      assert.ok(question.type.length > 1);
      assert.ok(question.examinerThinking);
      assert.ok(question.sourceSentenceAnalysis);
    }
  }
});

test("2021 reading papers have complete answer keys", () => {
  for (const paper of papers2021) {
    assert.equal(paper.year, 2021);
    assert.match(paper.textNumber, /^Text [1-4]$/);
    assert.equal(paper.questions.length, 5);

    for (const question of paper.questions) {
      assert.deepEqual(Object.keys(question.options), ["A", "B", "C", "D"]);
      assert.match(question.answer, /^[A-D]$/);
    }
  }
});

test("2018-2020 imports preserve four-text structure without inventing passages", () => {
  for (const year of [2018, 2019, 2020]) {
    for (let textNumber = 1; textNumber <= 4; textNumber += 1) {
      const url = new URL(`./papers/${year}/text${textNumber}.json`, import.meta.url);
      const paper = JSON.parse(readFileSync(url, "utf8"));

      assert.equal(paper.year, year);
      assert.equal(paper.textNumber, `Text ${textNumber}`);
      assert.equal(paper.questions.length, 5);
      assert.equal(paper.status, "待补充");
    }
  }
});

test("2019 answer-analysis PDF contributes complete question choices and keys", () => {
  for (let textNumber = 1; textNumber <= 4; textNumber += 1) {
    const url = new URL(`./papers/2019/text${textNumber}.json`, import.meta.url);
    const paper = JSON.parse(readFileSync(url, "utf8"));

    for (const question of paper.questions) {
      assert.ok(question.questionText.length > 10);
      assert.deepEqual(Object.keys(question.options), ["A", "B", "C", "D"]);
      assert.match(question.answer, /^[A-D]$/);
    }
  }
});
