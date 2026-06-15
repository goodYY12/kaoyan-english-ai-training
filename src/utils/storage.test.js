import assert from "node:assert/strict";
import test from "node:test";
import {
  STORAGE_KEY,
  addMistake,
  getMistakes,
  removeMistake,
  toggleReviewed,
} from "./storage.js";

function createMemoryStorage(initialValue) {
  const values = new Map();

  if (initialValue !== undefined) {
    values.set(STORAGE_KEY, initialValue);
  }

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

const sampleMistake = {
  id: "reading-1",
  type: "细节题",
  question: "Which statement is supported by the passage?",
  userAnswer: "B",
  correctAnswer: "C",
  reviewed: false,
};

test("returns an empty list when no mistakes are saved", () => {
  assert.deepEqual(getMistakes(createMemoryStorage()), []);
});

test("returns an empty list when saved JSON is damaged", () => {
  assert.deepEqual(getMistakes(createMemoryStorage("{broken")), []);
});

test("adds a mistake and prevents duplicate ids", () => {
  const storage = createMemoryStorage();

  addMistake(sampleMistake, storage);
  addMistake({ ...sampleMistake, userAnswer: "A" }, storage);

  assert.deepEqual(getMistakes(storage), [sampleMistake]);
});

test("removes a mistake by id", () => {
  const storage = createMemoryStorage(JSON.stringify([sampleMistake]));

  removeMistake(sampleMistake.id, storage);

  assert.deepEqual(getMistakes(storage), []);
});

test("toggles the reviewed state", () => {
  const storage = createMemoryStorage(JSON.stringify([sampleMistake]));

  toggleReviewed(sampleMistake.id, storage);
  assert.equal(getMistakes(storage)[0].reviewed, true);

  toggleReviewed(sampleMistake.id, storage);
  assert.equal(getMistakes(storage)[0].reviewed, false);
});
