import assert from "node:assert/strict";
import test from "node:test";

import text1 from "./papers/2026/text1.json" with { type: "json" };
import text2 from "./papers/2026/text2.json" with { type: "json" };
import text3 from "./papers/2026/text3.json" with { type: "json" };
import text4 from "./papers/2026/text4.json" with { type: "json" };

const papers = [text1, text2, text3, text4];

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
  }
});
