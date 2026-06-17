import assert from "node:assert/strict";
import test from "node:test";
import {
  clearTrainingData,
  getDraftStats,
  getHighFrequencyMistakes,
  getReadingRecords,
  getReadingStats,
  getStoredMistakes,
  getTrainingDraft,
  markMistakeMastered,
  saveReadingRecord,
  saveTrainingDraft,
} from "./trainingStorage.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

const record = {
  id: "record-1",
  year: 2026,
  textNumber: "Text 1",
  total: 5,
  correct: 3,
  submittedAt: "2026-06-16T00:00:00.000Z",
  mistakes: [
    {
      id: "2026-text1-q21",
      year: 2026,
      textNumber: "Text 1",
      questionNumber: 21,
      type: "细节题",
      wrongReason: "定位错误",
      userAnswer: "B",
      correctAnswer: "A",
      mastered: false,
    },
  ],
};

test("saves reading records and mistakes", () => {
  const storage = createMemoryStorage();
  saveReadingRecord(record, storage);

  assert.equal(getReadingRecords(storage).length, 1);
  assert.equal(getStoredMistakes(storage).length, 1);
  assert.deepEqual(getReadingStats(storage), {
    totalQuestions: 5,
    correctQuestions: 3,
    accuracy: 60,
  });
});

test("marks mistakes mastered and clears local training data", () => {
  const storage = createMemoryStorage();
  saveReadingRecord(record, storage);
  markMistakeMastered("2026-text1-q21", storage);

  assert.equal(getStoredMistakes(storage)[0].mastered, true);
  assert.deepEqual(getHighFrequencyMistakes(storage), [
    { reason: "定位错误", count: 1 },
  ]);

  clearTrainingData(storage);
  assert.equal(getReadingRecords(storage).length, 0);
  assert.equal(getStoredMistakes(storage).length, 0);
});

test("saves and clears translation and writing drafts", () => {
  const storage = createMemoryStorage();

  saveTrainingDraft("translation-2026", "my translation", storage);
  saveTrainingDraft("writing-2026-小作文", "my essay", storage);

  assert.equal(getTrainingDraft("translation-2026", storage), "my translation");
  assert.deepEqual(getDraftStats(storage), {
    translationCount: 1,
    writingCount: 1,
  });

  clearTrainingData(storage);
  assert.equal(getTrainingDraft("translation-2026", storage), "");
});
