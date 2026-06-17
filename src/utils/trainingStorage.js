export const READING_RECORDS_KEY = "kaoyan-reading-records";
export const TRAINING_MISTAKES_KEY = "kaoyan-training-mistakes";
export const TRAINING_DRAFTS_KEY = "kaoyan-training-drafts";

function hasBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function getDefaultStorage() {
  return hasBrowserStorage() ? window.localStorage : null;
}

function readList(key, storage = getDefaultStorage()) {
  if (!storage) return [];

  try {
    const value = JSON.parse(storage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeList(key, value, storage = getDefaultStorage()) {
  if (!storage) return value;
  storage.setItem(key, JSON.stringify(value));
  return value;
}

function readObject(key, storage = getDefaultStorage()) {
  if (!storage) return {};

  try {
    const value = JSON.parse(storage.getItem(key) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function writeObject(key, value, storage = getDefaultStorage()) {
  if (!storage) return value;
  storage.setItem(key, JSON.stringify(value));
  return value;
}

export function getReadingRecords(storage) {
  return readList(READING_RECORDS_KEY, storage);
}

export function getStoredMistakes(storage) {
  return readList(TRAINING_MISTAKES_KEY, storage);
}

export function saveReadingRecord(record, storage) {
  const records = getReadingRecords(storage);
  writeList(READING_RECORDS_KEY, [record, ...records], storage);

  const existingMistakes = getStoredMistakes(storage);
  const nextMistakes = [...existingMistakes];

  for (const mistake of record.mistakes ?? []) {
    const index = nextMistakes.findIndex((item) => item.id === mistake.id);
    const nextMistake = {
      ...mistake,
      completedAt: mistake.completedAt ?? record.submittedAt,
      mastered: mistake.mastered ?? false,
    };

    if (index >= 0) {
      nextMistakes[index] = { ...nextMistakes[index], ...nextMistake };
    } else {
      nextMistakes.unshift(nextMistake);
    }
  }

  writeList(TRAINING_MISTAKES_KEY, nextMistakes, storage);
  return record;
}

export function markMistakeMastered(id, storage) {
  return writeList(
    TRAINING_MISTAKES_KEY,
    getStoredMistakes(storage).map((item) =>
      item.id === id ? { ...item, mastered: !item.mastered } : item,
    ),
    storage,
  );
}

export function clearTrainingData(storage) {
  const target = storage ?? getDefaultStorage();
  if (!target) return;
  target.removeItem(READING_RECORDS_KEY);
  target.removeItem(TRAINING_MISTAKES_KEY);
  target.removeItem(TRAINING_DRAFTS_KEY);
}

export function getTrainingDrafts(storage) {
  return readObject(TRAINING_DRAFTS_KEY, storage);
}

export function getTrainingDraft(id, storage) {
  return getTrainingDrafts(storage)[id] ?? "";
}

export function saveTrainingDraft(id, content, storage) {
  const drafts = getTrainingDrafts(storage);
  return writeObject(
    TRAINING_DRAFTS_KEY,
    {
      ...drafts,
      [id]: content,
    },
    storage,
  );
}

export function getDraftStats(storage) {
  const drafts = getTrainingDrafts(storage);
  const values = Object.entries(drafts).filter(([, value]) => String(value).trim());
  return {
    translationCount: values.filter(([key]) => key.startsWith("translation-")).length,
    writingCount: values.filter(([key]) => key.startsWith("writing-")).length,
  };
}

export function getReadingStats(storage) {
  const records = getReadingRecords(storage);
  const totalQuestions = records.reduce((sum, item) => sum + item.total, 0);
  const correctQuestions = records.reduce((sum, item) => sum + item.correct, 0);
  const accuracy =
    totalQuestions === 0 ? 0 : Math.round((correctQuestions / totalQuestions) * 100);

  return { totalQuestions, correctQuestions, accuracy };
}

export function getHighFrequencyMistakes(storage) {
  const counts = getStoredMistakes(storage).reduce((result, item) => {
    const reason = item.wrongReason ?? item.commonMistake ?? "待补充";
    return { ...result, [reason]: (result[reason] ?? 0) + 1 };
  }, {});

  return Object.entries(counts)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}
